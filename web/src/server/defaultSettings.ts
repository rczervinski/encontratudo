export const defaultSettings = {
  identidade: {
    nome_header: '',
    slogan: '',
    logo_url: '',
    preset_cores: '',
    cores: {
      cor_primaria: '#DC143C',
      cor_secundaria: '#FF6B6B',
      cor_fundo: '#FFFFFF',
      cor_header: '#1a1a1a',
      cor_texto: '#1a1a1a',
      cor_texto_produto: '#1a1a1a',
      // Cards
      cor_fundo_card: '#FFFFFF',
      cor_borda_card: '#E5E7EB',
      cor_texto_card: '#111827',
      borda_radius_card: '12',
      sombra_card: 'md',
    },
    fontes: {
      fonte_titulo: 'Inter',
      fonte_corpo: 'Inter',
    },
  },
  layout: {
    header_sticky: true,
    produtos_por_linha: 3,
    mostrar_categorias: true,
    carrossel_ativo: true,
    localizacao_ativo: true,
  },
  conteudo: {
    exibir_tipo: 'ambos',
    ordem_exibicao: 'produtos_primeiro',
    carrossel_ativado: false,
    carrossel_produtos: [],
    carrossel_foto1: '',
    carrossel_foto2: '',
    carrossel_foto3: '',
    cor_fundo_carrossel: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
  },
  integracoes: {
    whatsapp: '',
    instagram: '',
    facebook: '',
  },
} as const
