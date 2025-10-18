// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let currentStep = 1;
let totalSteps = 5;
let dadosCadastro = {
    tipo_estabelecimento: null,
    nome: null,
    tipo_contato: null,
    contato: null,
    senha: null,
    // Endereço
    cep: null,
    logradouro: null,
    numero: null,
    complemento: null,
    bairro: null,
    cidade: null,
    estado: null,
    latitude: null,
    longitude: null
};

let mapa = null;
let marcador = null;

// ============================================
// MÁSCARAS
// ============================================
const maskCEP = IMask(document.getElementById('cep'), {
    mask: '00000-000'
});

let maskTelefone = null;

// ============================================
// STEP 1: TIPO DE ESTABELECIMENTO
// ============================================
document.querySelectorAll('#step1 .choice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover seleção anterior
        document.querySelectorAll('#step1 .choice-btn').forEach(b => b.classList.remove('selected'));
        
        // Selecionar atual
        this.classList.add('selected');
        dadosCadastro.tipo_estabelecimento = this.dataset.type;
        
        // Habilitar botão de continuar
        document.getElementById('nextStep1').disabled = false;
    });
});

document.getElementById('nextStep1').addEventListener('click', () => {
    avancarStep(2);
    
    // Atualizar texto conforme tipo
    const tipoTexto = dadosCadastro.tipo_estabelecimento === 'loja' ? 'loja' : 'negócio';
    document.getElementById('tipoTexto').textContent = tipoTexto;
});

// ============================================
// STEP 2: NOME
// ============================================
document.getElementById('nome').addEventListener('input', function() {
    const nome = this.value.trim();
    document.getElementById('nextStep2').disabled = nome.length < 3;
});

document.getElementById('nextStep2').addEventListener('click', () => {
    dadosCadastro.nome = document.getElementById('nome').value.trim();
    avancarStep(3);
});

// ============================================
// STEP 3: CONTATO
// ============================================
document.querySelectorAll('#step3 .choice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover seleção anterior
        document.querySelectorAll('#step3 .choice-btn').forEach(b => b.classList.remove('selected'));
        
        // Selecionar atual
        this.classList.add('selected');
        dadosCadastro.tipo_contato = this.dataset.contact;
        
        // Atualizar label e input
        const inputContato = document.getElementById('contato');
        const labelContato = document.getElementById('labelContato');
        
        if (dadosCadastro.tipo_contato === 'telefone') {
            labelContato.textContent = 'Telefone';
            inputContato.type = 'text';
            inputContato.placeholder = '(00) 00000-0000';
            
            // Aplicar máscara de telefone
            if (maskTelefone) {
                maskTelefone.destroy();
            }
            maskTelefone = IMask(inputContato, {
                mask: '(00) 00000-0000'
            });
        } else {
            labelContato.textContent = 'E-mail';
            inputContato.type = 'email';
            inputContato.placeholder = 'seu@email.com';
            
            // Remover máscara se existir
            if (maskTelefone) {
                maskTelefone.destroy();
                maskTelefone = null;
            }
        }
        
        inputContato.value = '';
        inputContato.focus();
        validarContato();
    });
});

document.getElementById('contato').addEventListener('input', validarContato);

function validarContato() {
    const contato = document.getElementById('contato').value.trim();
    let valido = false;
    
    if (dadosCadastro.tipo_contato === 'telefone') {
        valido = contato.replace(/\D/g, '').length === 11;
    } else if (dadosCadastro.tipo_contato === 'email') {
        valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato);
    }
    
    document.getElementById('nextStep3').disabled = !valido;
}

document.getElementById('nextStep3').addEventListener('click', () => {
    dadosCadastro.contato = document.getElementById('contato').value.trim();
    avancarStep(4);
    
    // Configurar step 4 conforme tipo
    if (dadosCadastro.tipo_estabelecimento === 'loja') {
        document.getElementById('enderecoLoja').style.display = 'block';
        document.getElementById('enderecoAutonomo').style.display = 'none';
        document.getElementById('localizacaoTexto').textContent = 'Onde você está localizado?';
    } else {
        document.getElementById('enderecoLoja').style.display = 'none';
        document.getElementById('enderecoAutonomo').style.display = 'block';
        document.getElementById('localizacaoTexto').textContent = 'Em qual cidade você atende?';
        document.getElementById('nextStep4').disabled = false;
    }
});

// ============================================
// STEP 4: LOCALIZAÇÃO
// ============================================

// CEP
document.getElementById('cep').addEventListener('blur', async function() {
    const cep = this.value.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    const loading = document.getElementById('loadingCep');
    loading.classList.add('show');
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            mostrarErro('CEP não encontrado. Preencha manualmente.');
            mostrarCamposManual();
            loading.classList.remove('show');
            return;
        }
        
        // Preencher campos
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        
        // Mostrar campos
        mostrarCamposManual();
        
        // Buscar coordenadas
        await buscarCoordenadas(data);
        
        loading.classList.remove('show');
        document.getElementById('nextStep4').disabled = false;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        mostrarErro('Erro ao buscar CEP. Preencha manualmente.');
        mostrarCamposManual();
        loading.classList.remove('show');
    }
});

// Link manual
document.getElementById('linkManual').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarCamposManual();
    document.getElementById('cep').value = '';
});

function mostrarCamposManual() {
    document.getElementById('manualAddress').classList.add('show');
    document.getElementById('nextStep4').disabled = false;
}

// Buscar coordenadas
async function buscarCoordenadas(dadosEndereco) {
    try {
        const endereco = `${dadosEndereco.logradouro}, ${dadosEndereco.bairro}, ${dadosEndereco.localidade}, ${dadosEndereco.uf}, Brasil`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'EncontraTudo/1.0'
            }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            dadosCadastro.latitude = lat;
            dadosCadastro.longitude = lon;
            
            inicializarMapa(lat, lon);
        } else {
            inicializarMapa(-15.7939, -47.8828);
        }
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        inicializarMapa(-15.7939, -47.8828);
    }
}

// Inicializar mapa
function inicializarMapa(lat, lon) {
    const mapaContainer = document.getElementById('mapaContainer');
    mapaContainer.style.display = 'block';
    
    if (mapa) {
        mapa.remove();
    }
    
    mapa = L.map('mapa').setView([lat, lon], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);
    
    marcador = L.marker([lat, lon], {
        draggable: true
    }).addTo(mapa);
    
    marcador.bindPopup('📍 Arraste para ajustar').openPopup();
    
    marcador.on('dragend', function(e) {
        const pos = marcador.getLatLng();
        dadosCadastro.latitude = pos.lat;
        dadosCadastro.longitude = pos.lng;
    });
}

// Validação de campos autônomo
document.getElementById('cidadeAutonomo').addEventListener('input', validarAutonomo);
document.getElementById('estadoAutonomo').addEventListener('input', validarAutonomo);

function validarAutonomo() {
    const cidade = document.getElementById('cidadeAutonomo').value.trim();
    const estado = document.getElementById('estadoAutonomo').value.trim();
    
    document.getElementById('nextStep4').disabled = !cidade || !estado;
}

document.getElementById('nextStep4').addEventListener('click', () => {
    // Salvar dados de localização
    if (dadosCadastro.tipo_estabelecimento === 'loja') {
        dadosCadastro.cep = document.getElementById('cep').value;
        dadosCadastro.logradouro = document.getElementById('logradouro').value;
        dadosCadastro.numero = document.getElementById('numero').value;
        dadosCadastro.complemento = document.getElementById('complemento').value;
        dadosCadastro.bairro = document.getElementById('bairro').value;
        dadosCadastro.cidade = document.getElementById('cidade').value;
        dadosCadastro.estado = document.getElementById('estado').value;
    } else {
        dadosCadastro.cidade = document.getElementById('cidadeAutonomo').value;
        dadosCadastro.estado = document.getElementById('estadoAutonomo').value;
        dadosCadastro.bairro = document.getElementById('bairroAutonomo').value;
    }
    
    avancarStep(5);
});

// ============================================
// STEP 5: SENHA
// ============================================
document.getElementById('senha').addEventListener('input', validarSenhas);
document.getElementById('confirmarSenha').addEventListener('input', validarSenhas);

function validarSenhas() {
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;
    
    const valido = senha.length >= 6 && senha === confirmar;
    document.getElementById('btnFinalizar').disabled = !valido;
}

document.getElementById('btnFinalizar').addEventListener('click', finalizarCadastro);

async function finalizarCadastro() {
    const btnFinalizar = document.getElementById('btnFinalizar');
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = 'Cadastrando...';
    
    dadosCadastro.senha = document.getElementById('senha').value;
    
    // Montar dados para envio
    const dados = {
        nome: dadosCadastro.nome,
        tipo_estabelecimento: dadosCadastro.tipo_estabelecimento,
        senha: dadosCadastro.senha
    };
    
    // Adicionar contato
    if (dadosCadastro.tipo_contato === 'telefone') {
        dados.telefone = dadosCadastro.contato;
    } else {
        dados.email = dadosCadastro.contato;
    }
    
    // Adicionar localização
    dados.cidade = dadosCadastro.cidade;
    dados.estado = dadosCadastro.estado;
    dados.bairro = dadosCadastro.bairro;
    
    if (dadosCadastro.tipo_estabelecimento === 'loja') {
        dados.cep = dadosCadastro.cep;
        dados.logradouro = dadosCadastro.logradouro;
        dados.numero = dadosCadastro.numero;
        dados.complemento = dadosCadastro.complemento;
        dados.latitude = dadosCadastro.latitude;
        dados.longitude = dadosCadastro.longitude;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            // Salvar token
            localStorage.setItem('token', resultado.token);
            
            // Mostrar modal de sucesso
            document.getElementById('successModal').classList.add('show');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            mostrarErro(resultado.erro || 'Erro ao cadastrar. Tente novamente.');
            btnFinalizar.disabled = false;
            btnFinalizar.textContent = 'Finalizar Cadastro';
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        mostrarErro('Erro de conexão. Verifique sua internet e tente novamente.');
        btnFinalizar.disabled = false;
        btnFinalizar.textContent = 'Finalizar Cadastro';
    }
}

// ============================================
// NAVEGAÇÃO ENTRE STEPS
// ============================================
function avancarStep(proximoStep) {
    const stepAtual = document.getElementById(`step${currentStep}`);
    const proximoStepEl = document.getElementById(`step${proximoStep}`);
    
    // Animação de saída
    stepAtual.classList.add('exit');
    
    setTimeout(() => {
        stepAtual.classList.remove('active', 'exit');
        proximoStepEl.classList.add('active');
        currentStep = proximoStep;
        
        // Atualizar barra de progresso
        atualizarProgresso();
        
        // Focar primeiro input
        const primeiroInput = proximoStepEl.querySelector('input');
        if (primeiroInput) {
            setTimeout(() => primeiroInput.focus(), 100);
        }
    }, 300);
}

function voltarStep(stepAnterior) {
    const stepAtual = document.getElementById(`step${currentStep}`);
    const stepAnteriorEl = document.getElementById(`step${stepAnterior}`);
    
    stepAtual.classList.add('exit');
    
    setTimeout(() => {
        stepAtual.classList.remove('active', 'exit');
        stepAnteriorEl.classList.add('active');
        currentStep = stepAnterior;
        atualizarProgresso();
    }, 300);
}

function atualizarProgresso() {
    const progresso = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progresso}%`;
}

// ============================================
// MENSAGENS
// ============================================
function mostrarErro(mensagem) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = mensagem;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// Inicializar progresso
atualizarProgresso();
