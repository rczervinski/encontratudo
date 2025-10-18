const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================================
// DADOS MOCKADOS (Simula o banco de dados)
// ============================================

const lojas = [
  {
    id: 1,
    nome_loja: "Ferragista do Bairro",
    endereco: "Rua das Flores, 123 - Centro",
    latitude: -25.4284,
    longitude: -49.2733,
    telefone: "(41) 3333-4444",
    horario_funcionamento: "Seg-Sex: 8h-18h, Sáb: 8h-12h"
  },
  {
    id: 2,
    nome_loja: "TecnoPartes",
    endereco: "Av. Tecnologia, 456 - Batel",
    latitude: -25.4372,
    longitude: -49.2844,
    telefone: "(41) 9999-8888",
    horario_funcionamento: "Seg-Sex: 9h-19h, Sáb: 9h-14h"
  },
  {
    id: 3,
    nome_loja: "Casa da Eletrônica",
    endereco: "Rua dos Chips, 789 - Água Verde",
    latitude: -25.4450,
    longitude: -49.2520,
    telefone: "(41) 3232-1010",
    horario_funcionamento: "Seg-Sex: 8h30-18h30"
  }
];

const produtos = [
  {
    id: 1,
    loja_id: 1,
    nome_produto: "Cabo de Rede Cat6",
    descricao: "Cabo de rede ethernet categoria 6, 10 metros, azul",
    preco: 45.90,
    foto_url: "https://via.placeholder.com/300x200?text=Cabo+Cat6",
    tags: "cabo de rede, cabo ethernet, rj45, cat6, internet, rede computador, cabo lan, patch cord, cabo para internet"
  },
  {
    id: 2,
    loja_id: 2,
    nome_produto: "Resistor 10K Ohm",
    descricao: "Resistor de carbono 10K Ohm, 1/4W, pacote com 10 unidades",
    preco: 3.50,
    foto_url: "https://via.placeholder.com/300x200?text=Resistor+10K",
    tags: "resistor, resistência, 10k, 10000 ohm, componente eletrônico, eletrônica, arduino, protoboard, circuito"
  },
  {
    id: 3,
    loja_id: 2,
    nome_produto: "Arduino Uno R3",
    descricao: "Placa Arduino Uno R3 original com cabo USB",
    preco: 89.90,
    foto_url: "https://via.placeholder.com/300x200?text=Arduino+Uno",
    tags: "arduino, arduino uno, microcontrolador, placa arduino, atmega328, automação, robótica, prototipagem, eletrônica"
  },
  {
    id: 4,
    loja_id: 3,
    nome_produto: "LED Vermelho 5mm",
    descricao: "LED vermelho de 5mm, alto brilho, pacote com 20 unidades",
    preco: 8.00,
    foto_url: "https://via.placeholder.com/300x200?text=LED+Vermelho",
    tags: "led, led vermelho, diodo emissor de luz, luz vermelha, componente eletrônico, iluminação, 5mm, eletrônica"
  },
  {
    id: 5,
    loja_id: 1,
    nome_produto: "Parafuso Phillips 6x40mm",
    descricao: "Parafuso cabeça chata phillips 6x40mm, galvanizado, caixa com 100 unidades",
    preco: 25.00,
    foto_url: "https://via.placeholder.com/300x200?text=Parafuso",
    tags: "parafuso, parafuso phillips, parafuso fenda cruzada, fixação, ferragem, galvanizado, construção, marcenaria"
  },
  {
    id: 6,
    loja_id: 3,
    nome_produto: "Multímetro Digital",
    descricao: "Multímetro digital com medição de tensão, corrente e resistência",
    preco: 55.00,
    foto_url: "https://via.placeholder.com/300x200?text=Multimetro",
    tags: "multímetro, multimetro, testador, medidor, voltímetro, amperímetro, ohmímetro, ferramenta eletrônica, teste elétrico"
  }
];

// ============================================
// FUNÇÃO AUXILIAR: Calcular Distância
// ============================================

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distância em km
}

// ============================================
// ENDPOINT PRINCIPAL: API DE BUSCA
// ============================================

app.get('/api/search', (req, res) => {
  const { q, local } = req.query;

  // Validação básica
  if (!q || !local) {
    return res.status(400).json({ 
      error: 'Parâmetros obrigatórios: q (busca) e local (latitude,longitude)' 
    });
  }

  // Parse da localização
  const [userLat, userLon] = local.split(',').map(Number);
  
  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ 
      error: 'Formato de localização inválido. Use: latitude,longitude' 
    });
  }

  // Normalizar busca para lowercase
  const buscaNormalizada = q.toLowerCase().trim();

  // Buscar produtos que correspondem
  const resultados = produtos
    .filter(produto => {
      const nomeProduto = produto.nome_produto.toLowerCase();
      const descricao = produto.descricao.toLowerCase();
      const tags = produto.tags.toLowerCase();
      
      // Busca nos três campos
      return nomeProduto.includes(buscaNormalizada) ||
             descricao.includes(buscaNormalizada) ||
             tags.includes(buscaNormalizada);
    })
    .map(produto => {
      // Buscar dados da loja
      const loja = lojas.find(l => l.id === produto.loja_id);
      
      // Calcular distância
      const distancia = calcularDistancia(
        userLat, userLon,
        loja.latitude, loja.longitude
      );

      return {
        produto: {
          id: produto.id,
          nome: produto.nome_produto,
          descricao: produto.descricao,
          preco: produto.preco,
          foto_url: produto.foto_url
        },
        loja: {
          id: loja.id,
          nome: loja.nome_loja,
          endereco: loja.endereco,
          telefone: loja.telefone,
          horario: loja.horario_funcionamento,
          distancia: distancia.toFixed(2) + ' km'
        }
      };
    })
    // Ordenar por distância (mais próximos primeiro)
    .sort((a, b) => parseFloat(a.loja.distancia) - parseFloat(b.loja.distancia));

  // Retornar resultados
  res.json({
    total_resultados: resultados.length,
    busca: q,
    resultados: resultados
  });
});

// ============================================
// ROTA RAIZ: Servir o frontend
// ============================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api/search`);
});
