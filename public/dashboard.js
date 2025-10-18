// Dashboard - Encontra Tudo
// Sistema completo de gerenciamento de produtos e serviços

let lojaData = null;
let produtos = [];
let servicos = [];
let categorias = [];
let currentEditId = null;

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/landing.html';
        return;
    }

    // Carregar dados iniciais
    await carregarDadosLoja();
    await carregarMetricas();
    await carregarProdutos();
    await carregarServicos();
    await carregarCategorias();
    await carregarPersonalizacao();

    // Event listeners
    setupEventListeners();
});

// ============================================
// CARREGAR DADOS
// ============================================

async function carregarDadosLoja() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            lojaData = await response.json();
            document.getElementById('loja-nome').textContent = lojaData.nome_loja;
            document.getElementById('loja-email').textContent = lojaData.email;
        }
    } catch (error) {
        console.error('Erro ao carregar dados da loja:', error);
    }
}

async function carregarMetricas() {
    try {
        // Carregar produtos
        const produtosRes = await fetch('/api/produtos?tipo=produto', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const produtosData = await produtosRes.json();
        document.getElementById('total-produtos').textContent = produtosData.pagination?.total || 0;

        // Carregar serviços
        const servicosRes = await fetch('/api/produtos?tipo=servico', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const servicosData = await servicosRes.json();
        document.getElementById('total-servicos').textContent = servicosData.pagination?.total || 0;

        // Carregar categorias
        const categoriasRes = await fetch('/api/categorias', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const categoriasData = await categoriasRes.json();
        document.getElementById('total-categorias').textContent = categoriasData.length || 0;

        // Analytics (placeholder)
        document.getElementById('total-views').textContent = '0';
    } catch (error) {
        console.error('Erro ao carregar métricas:', error);
    }
}

async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos?tipo=produto', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        produtos = data.produtos || [];
        renderProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showAlert('Erro ao carregar produtos', 'error');
    }
}

async function carregarServicos() {
    try {
        const response = await fetch('/api/produtos?tipo=servico', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        servicos = data.produtos || [];
        renderServicos(servicos);
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        showAlert('Erro ao carregar serviços', 'error');
    }
}

async function carregarCategorias() {
    try {
        const response = await fetch('/api/categorias', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        categorias = await response.json();
        renderCategorias();
        atualizarSelectsCategorias();
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function carregarPersonalizacao() {
    try {
        const response = await fetch('/api/personalizacao', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
            const data = await response.json();
            if (data) {
                const form = document.getElementById('form-personalizacao');
                Object.keys(data).forEach(key => {
                    const input = form.elements[key];
                    if (input && data[key]) {
                        input.value = data[key];
                    }
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar personalização:', error);
    }
}

// ============================================
// RENDERIZAR DADOS
// ============================================

function renderProdutos(produtosLista) {
    const tbody = document.getElementById('table-produtos');
    
    if (produtosLista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <p>📦 Nenhum produto cadastrado</p>
                    <button class="btn btn-primary" onclick="openModal('modal-produto')" style="margin-top: 15px;">
                        ➕ Adicionar Primeiro Produto
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = produtosLista.map(p => `
        <tr>
            <td>
                ${p.imagens && p.imagens[0] 
                    ? `<img src="${p.imagens[0].url}" class="image-preview" alt="${p.nome_produto}">` 
                    : '📦'}
            </td>
            <td><strong>${p.nome_produto}</strong></td>
            <td>${p.categoria?.nome || '-'}</td>
            <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
            <td>${p.estoque_quantidade || 0}</td>
            <td>
                <span class="badge ${p.disponivel ? 'badge-success' : 'badge-danger'}">
                    ${p.disponivel ? '✓ Disponível' : '✗ Indisponível'}
                </span>
                ${p.bloqueado ? '<span class="badge badge-danger">🔒 Bloqueado</span>' : ''}
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarProduto('${p.id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deletarProduto('${p.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function renderServicos(servicosLista) {
    const tbody = document.getElementById('table-servicos');
    
    if (servicosLista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <p>🛠️ Nenhum serviço cadastrado</p>
                    <button class="btn btn-success" onclick="openModal('modal-servico')" style="margin-top: 15px;">
                        ➕ Adicionar Primeiro Serviço
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = servicosLista.map(s => `
        <tr>
            <td>
                ${s.imagens && s.imagens[0] 
                    ? `<img src="${s.imagens[0].url}" class="image-preview" alt="${s.nome_produto}">` 
                    : '🛠️'}
            </td>
            <td><strong>${s.nome_produto}</strong></td>
            <td>${s.categoria?.nome || '-'}</td>
            <td>R$ ${parseFloat(s.preco).toFixed(2)}</td>
            <td>${s.duracao_estimada || '-'}</td>
            <td>
                ${s.aceita_urgencia 
                    ? '<span class="badge badge-warning">🚨 Sim</span>' 
                    : '<span class="badge" style="background: #e5e7eb; color: #6b7280;">Não</span>'}
            </td>
            <td>
                <span class="badge ${s.disponivel ? 'badge-success' : 'badge-danger'}">
                    ${s.disponivel ? '✓ Disponível' : '✗ Indisponível'}
                </span>
                ${s.bloqueado ? '<span class="badge badge-danger">🔒 Bloqueado</span>' : ''}
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarServico('${s.id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deletarServico('${s.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function renderCategorias() {
    const container = document.getElementById('categorias-list');
    
    if (categorias.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>🏷️ Nenhuma categoria cadastrada</p>
                <button class="btn btn-primary" onclick="openModal('modal-categoria')" style="margin-top: 15px;">
                    ➕ Adicionar Primeira Categoria
                </button>
            </div>
        `;
        return;
    }

    // Organizar por hierarquia
    const nivel1 = categorias.filter(c => c.nivel === 1);
    
    let html = '<div style="display: grid; gap: 20px;">';
    
    nivel1.forEach(cat1 => {
        const nivel2 = categorias.filter(c => c.pai_id === cat1.id);
        
        html += `
            <div style="border: 2px solid var(--border); border-radius: 12px; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="font-size: 1.2rem; color: var(--primary);">📁 ${cat1.nome}</h3>
                    <div>
                        <button class="btn btn-sm btn-primary" onclick="editarCategoria('${cat1.id}')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarCategoria('${cat1.id}')">🗑️</button>
                    </div>
                </div>
        `;
        
        if (nivel2.length > 0) {
            html += '<div style="margin-left: 20px; display: grid; gap: 10px;">';
            nivel2.forEach(cat2 => {
                const nivel3 = categorias.filter(c => c.pai_id === cat2.id);
                html += `
                    <div style="border-left: 3px solid var(--primary); padding-left: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong>📂 ${cat2.nome}</strong>
                            <div>
                                <button class="btn btn-sm btn-primary" onclick="editarCategoria('${cat2.id}')">✏️</button>
                                <button class="btn btn-sm btn-danger" onclick="deletarCategoria('${cat2.id}')">🗑️</button>
                            </div>
                        </div>
                `;
                
                if (nivel3.length > 0) {
                    html += '<div style="margin-left: 20px; margin-top: 10px;">';
                    nivel3.forEach(cat3 => {
                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                                <span>📄 ${cat3.nome}</span>
                                <div>
                                    <button class="btn btn-sm btn-primary" onclick="editarCategoria('${cat3.id}')">✏️</button>
                                    <button class="btn btn-sm btn-danger" onclick="deletarCategoria('${cat3.id}')">🗑️</button>
                                </div>
                            </div>
                        `;
                    });
                    html += '</div>';
                }
                
                html += '</div>';
            });
            html += '</div>';
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function atualizarSelectsCategorias() {
    const selects = [
        'select-categoria-produto',
        'select-categoria-servico',
        'select-categoria-pai'
    ];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = '<option value="">Sem categoria</option>';

        categorias.forEach(cat => {
            const indent = '&nbsp;&nbsp;'.repeat(cat.nivel - 1);
            const option = document.createElement('option');
            option.value = cat.id;
            option.innerHTML = `${indent}${cat.nome}`;
            select.appendChild(option);
        });

        if (currentValue) select.value = currentValue;
    });
}

// ============================================
// NAVEGAÇÃO E UI
// ============================================

function switchView(viewName) {
    // Esconder todas as views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Mostrar view selecionada
    document.getElementById(`view-${viewName}`).classList.add('active');
    
    // Atualizar sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === viewName) {
            link.classList.add('active');
        }
    });
}

function switchTab(tabName) {
    // Atualizar botões
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Atualizar conteúdo
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    
    // Resetar form se não for edição
    if (!currentEditId) {
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    currentEditId = null;
}

function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${type} active`;
    alert.textContent = message;
    
    setTimeout(() => {
        alert.classList.remove('active');
    }, 5000);
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('token');
        window.location.href = '/landing.html';
    }
}

// ============================================
// CRUD PRODUTOS
// ============================================

async function salvarProduto(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const id = formData.get('id');
        const url = id ? `/api/produtos/${id}` : '/api/produtos';
        const method = id ? 'PUT' : 'POST';

        // Para PUT, converter para JSON (sem imagens por enquanto)
        const data = {
            tipo: 'produto',
            nome_produto: formData.get('nome_produto'),
            preco: parseFloat(formData.get('preco')),
            preco_promocional: formData.get('preco_promocional') ? parseFloat(formData.get('preco_promocional')) : null,
            estoque_quantidade: formData.get('estoque_quantidade') ? parseInt(formData.get('estoque_quantidade')) : null,
            descricao: formData.get('descricao'),
            tags: formData.get('tags'),
            categoria_id: formData.get('categoria_id') || null,
            disponivel: formData.get('disponivel') === 'on'
        };

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert(id ? 'Produto atualizado!' : 'Produto criado!', 'success');
            closeModal('modal-produto');
            await carregarProdutos();
            await carregarMetricas();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Erro ao salvar produto', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao salvar produto', 'error');
    }
}

async function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    currentEditId = id;
    const form = document.getElementById('form-produto');
    
    form.elements['id'].value = produto.id;
    form.elements['nome_produto'].value = produto.nome_produto;
    form.elements['preco'].value = produto.preco;
    form.elements['preco_promocional'].value = produto.preco_promocional || '';
    form.elements['estoque_quantidade'].value = produto.estoque_quantidade || '';
    form.elements['descricao'].value = produto.descricao || '';
    form.elements['tags'].value = produto.tags;
    form.elements['categoria_id'].value = produto.categoria_id || '';
    form.elements['disponivel'].checked = produto.disponivel;

    document.getElementById('modal-produto-title').textContent = '✏️ Editar Produto';
    openModal('modal-produto');
}

async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            showAlert('Produto deletado!', 'success');
            await carregarProdutos();
            await carregarMetricas();
        }
    } catch (error) {
        showAlert('Erro ao deletar produto', 'error');
    }
}

// ============================================
// CRUD SERVIÇOS
// ============================================

async function salvarServico(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const id = formData.get('id');
        const url = id ? `/api/produtos/${id}` : '/api/produtos';
        const method = id ? 'PUT' : 'POST';

        const data = {
            tipo: 'servico',
            nome_produto: formData.get('nome_produto'),
            preco: parseFloat(formData.get('preco')),
            preco_promocional: formData.get('preco_promocional') ? parseFloat(formData.get('preco_promocional')) : null,
            descricao: formData.get('descricao'),
            tags: formData.get('tags'),
            categoria_id: formData.get('categoria_id') || null,
            duracao_estimada: formData.get('duracao_estimada'),
            area_atendimento: formData.get('area_atendimento'),
            aceita_urgencia: formData.get('aceita_urgencia') === 'on',
            disponivel: formData.get('disponivel') === 'on'
        };

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert(id ? 'Serviço atualizado!' : 'Serviço criado!', 'success');
            closeModal('modal-servico');
            await carregarServicos();
            await carregarMetricas();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Erro ao salvar serviço', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao salvar serviço', 'error');
    }
}

async function editarServico(id) {
    const servico = servicos.find(s => s.id === id);
    if (!servico) return;

    currentEditId = id;
    const form = document.getElementById('form-servico');
    
    form.elements['id'].value = servico.id;
    form.elements['nome_produto'].value = servico.nome_produto;
    form.elements['preco'].value = servico.preco;
    form.elements['preco_promocional'].value = servico.preco_promocional || '';
    form.elements['descricao'].value = servico.descricao || '';
    form.elements['tags'].value = servico.tags;
    form.elements['categoria_id'].value = servico.categoria_id || '';
    form.elements['duracao_estimada'].value = servico.duracao_estimada || '';
    form.elements['area_atendimento'].value = servico.area_atendimento || '';
    form.elements['aceita_urgencia'].checked = servico.aceita_urgencia;
    form.elements['disponivel'].checked = servico.disponivel;

    document.getElementById('modal-servico-title').textContent = '✏️ Editar Serviço';
    openModal('modal-servico');
}

async function deletarServico(id) {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;

    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            showAlert('Serviço deletado!', 'success');
            await carregarServicos();
            await carregarMetricas();
        }
    } catch (error) {
        showAlert('Erro ao deletar serviço', 'error');
    }
}

// ============================================
// CRUD CATEGORIAS
// ============================================

async function salvarCategoria(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const id = formData.get('id');
        const url = id ? `/api/categorias/${id}` : '/api/categorias';
        const method = id ? 'PUT' : 'POST';

        const data = {
            nome: formData.get('nome'),
            pai_id: formData.get('pai_id') || null
        };

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert(id ? 'Categoria atualizada!' : 'Categoria criada!', 'success');
            closeModal('modal-categoria');
            await carregarCategorias();
            await carregarMetricas();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Erro ao salvar categoria', 'error');
        }
    } catch (error) {
        showAlert('Erro ao salvar categoria', 'error');
    }
}

async function editarCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;

    currentEditId = id;
    const form = document.getElementById('form-categoria');
    
    form.elements['id'].value = categoria.id;
    form.elements['nome'].value = categoria.nome;
    form.elements['pai_id'].value = categoria.pai_id || '';

    openModal('modal-categoria');
}

async function deletarCategoria(id) {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            showAlert('Categoria deletada!', 'success');
            await carregarCategorias();
            await carregarMetricas();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Erro ao deletar categoria', 'error');
        }
    } catch (error) {
        showAlert('Erro ao deletar categoria', 'error');
    }
}

// ============================================
// PERSONALIZAÇÃO
// ============================================

async function salvarPersonalizacao(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
        cor_primaria: formData.get('cor_primaria'),
        cor_secundaria: formData.get('cor_secundaria'),
        cor_fundo: formData.get('cor_fundo'),
        cor_texto: formData.get('cor_texto'),
        meta_titulo: formData.get('meta_titulo'),
        meta_descricao: formData.get('meta_descricao')
    };

    try {
        const response = await fetch('/api/personalizacao', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showAlert('Personalização salva! Recarregue seu catálogo para ver as mudanças.', 'success');
        } else {
            showAlert('Erro ao salvar personalização', 'error');
        }
    } catch (error) {
        showAlert('Erro ao salvar personalização', 'error');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(link.dataset.view);
        });
    });

    // Forms
    document.getElementById('form-produto').addEventListener('submit', salvarProduto);
    document.getElementById('form-servico').addEventListener('submit', salvarServico);
    document.getElementById('form-categoria').addEventListener('submit', salvarCategoria);
    document.getElementById('form-personalizacao').addEventListener('submit', salvarPersonalizacao);

    // Busca
    document.getElementById('search-produtos')?.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = produtos.filter(p => 
            p.nome_produto.toLowerCase().includes(termo) ||
            p.tags.toLowerCase().includes(termo)
        );
        renderProdutos(filtrados);
    });

    document.getElementById('search-servicos')?.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = servicos.filter(s => 
            s.nome_produto.toLowerCase().includes(termo) ||
            s.tags.toLowerCase().includes(termo)
        );
        renderServicos(filtrados);
    });

    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}
