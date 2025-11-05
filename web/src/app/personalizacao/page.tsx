'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Icon } from '@iconify/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const PRESETS = [
  {
    id: 'pb_claro',
    nome: 'Preto & Branco (Claro)',
    descricao: 'Layout claro com tipografia forte',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
    cores: {
      cor_primaria: '#111827',
      cor_secundaria: '#6B7280',
      cor_fundo: '#FFFFFF',
      cor_header: '#FFFFFF',
      cor_texto: '#111827',
      cor_fundo_card: '#FFFFFF',
      cor_borda_card: '#E5E7EB',
      cor_texto_card: '#111827',
      borda_radius_card: '12',
      sombra_card: 'sm'
    }
  },
  {
    id: 'pb_escuro',
    nome: 'Preto & Branco (Escuro)',
    descricao: 'Layout escuro minimalista',
    preview: 'linear-gradient(135deg, #0f1419 0%, #111827 100%)',
    cores: {
      cor_primaria: '#3B82F6',
      cor_secundaria: '#1D4ED8',
      cor_fundo: '#0F1419',
      cor_header: '#111827',
      cor_texto: '#E5E7EB',
      cor_fundo_card: '#1F2937',
      cor_borda_card: '#374151',
      cor_texto_card: '#F3F4F6',
      borda_radius_card: '16',
      sombra_card: 'lg'
    }
  },
  {
    id: 'azul_claro',
    nome: 'Azul Minimal (Claro)',
    descricao: 'Claro com acento azul',
    preview: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)',
    cores: {
      cor_primaria: '#2563EB',
      cor_secundaria: '#1D4ED8',
      cor_fundo: '#FFFFFF',
      cor_header: '#FFFFFF',
      cor_texto: '#111827',
      cor_fundo_card: '#F0F9FF',
      cor_borda_card: '#BFDBFE',
      cor_texto_card: '#1E3A8A',
      borda_radius_card: '16',
      sombra_card: 'md'
    }
  },
  {
    id: 'azul_escuro',
    nome: 'Azul Minimal (Escuro)',
    descricao: 'Escuro com acento azul',
    preview: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    cores: {
      cor_primaria: '#3B82F6',
      cor_secundaria: '#2563EB',
      cor_fundo: '#0F172A',
      cor_header: '#1E293B',
      cor_texto: '#E5E7EB',
      cor_fundo_card: '#1E293B',
      cor_borda_card: '#334155',
      cor_texto_card: '#E0F2FE',
      borda_radius_card: '20',
      sombra_card: 'xl'
    }
  },
  {
    id: 'ambar_claro',
    nome: 'Âmbar Minimal',
    descricao: 'Claro com acento âmbar',
    preview: 'linear-gradient(135deg, #fff7ed 0%, #fde68a 100%)',
    cores: {
      cor_primaria: '#D97706',
      cor_secundaria: '#F59E0B',
      cor_fundo: '#FFFFFF',
      cor_header: '#FFFFFF',
      cor_texto: '#111827',
      cor_fundo_card: '#FFFBEB',
      cor_borda_card: '#FDE68A',
      cor_texto_card: '#78350F',
      borda_radius_card: '16',
      sombra_card: 'md'
    }
  },
  {
    id: 'slate',
    nome: 'Slate Clean',
    descricao: 'Neutro profissional',
    preview: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    cores: {
      cor_primaria: '#334155',
      cor_secundaria: '#64748B',
      cor_fundo: '#FFFFFF',
      cor_header: '#F8FAFC',
      cor_texto: '#0F172A',
      cor_fundo_card: '#F8FAFC',
      cor_borda_card: '#CBD5E1',
      cor_texto_card: '#1E293B',
      borda_radius_card: '12',
      sombra_card: 'sm'
    }
  }
]

export default function PersonalizacaoPage() {
  const router = useRouter()
  const [loja, setLoja] = useState(null)
  const [modo, setModo] = useState('escolha')
  const [rapidoEtapa, setRapidoEtapa] = useState(1)
  const [rapidoManualCores, setRapidoManualCores] = useState(false)
  const [showConcluido, setShowConcluido] = useState(false)
  const [menuAvancado, setMenuAvancado] = useState('cores')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [p, setP] = useState({
    logo_url: '', slogan: '', nome_header: '', preset_cores: '',
    cor_primaria: '#334155', cor_secundaria: '#64748B', cor_fundo: '#FFFFFF',
    cor_header: '#FFFFFF', cor_texto: '#0F172A', cor_texto_produto: '#0F172A',
    cor_fundo_carrossel: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
    cor_fundo_card: '#FFFFFF', cor_borda_card: '#E5E7EB', cor_texto_card: '#111827',
    borda_radius_card: '12', sombra_card: 'md',
    fonte_titulo: 'Inter', fonte_corpo: 'Inter',
    carrossel_ativo: true, localizacao_ativo: true,
    carrossel_ativado: false, carrossel_produtos: [],
    carrossel_foto1: '', carrossel_foto2: '', carrossel_foto3: '',
    exibir_tipo: 'ambos', ordem_exibicao: 'produtos_primeiro'
  })
  const [salvando, setSalvando] = useState(false)
  const [produtos, setProdutos] = useState<any[]>([])
  const [totalDestaque, setTotalDestaque] = useState(0)
  
  // Helper para extrair uma cor sólida quando o usuário usa gradientes
  const extrairCorSolida = (val: string | undefined) => {
    if (!val) return '#4a5568'
    if (val.trim().startsWith('#')) return val.trim()
    return '#4a5568'
  }

  useEffect(() => {
    const lojaData = localStorage.getItem('loja')
    if (lojaData) {
      const lojaObj = JSON.parse(lojaData)
      setLoja(lojaObj)
      setP(prev => ({ ...prev, nome_header: lojaObj.nome_loja }))
      carregarPersonalizacao()
      carregarProdutos()
    } else {
      router.push('/login')
    }
  }, [router])

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/produtos', { headers: { Authorization: 'Bearer ' + token }})
      if (res.ok) {
        const data = await res.json()
        setProdutos(data)
        const destaques = data.filter((i: any) => i.destaque).length
        setTotalDestaque(destaques)
      }
    } catch (e) { console.error('Erro:', e) }
  }

  const carregarPersonalizacao = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/personalizacao', { headers: { Authorization: 'Bearer ' + token }})
      if (res.ok) {
        const data = await res.json()
        if (data) setP(prev => ({ ...prev, ...data }))
      }
    } catch (e) { console.error('Erro:', e) }
  }

    const handleChange = (key: string, value: any) => {
    setP(prev => ({ ...prev, [key]: value }))
  }
  const aplicarPreset = (preset: typeof PRESETS[0]) => { setP(prev => ({ ...prev, preset_cores: preset.id, ...preset.cores })) }

  const salvar = async () => {
    setSalvando(true)
    try {
      const token = localStorage.getItem('token')
      console.log('💾 Salvando personalização:', p)
      const res = await fetch('/api/personalizacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(p)
      })
      console.log('📡 Response status:', res.status)
      const data = await res.json()
      console.log('📡 Response data:', data)
      
      if (res.ok) {
        setShowConcluido(true)
      } else {
        alert('❌ Erro: ' + (data.error || 'Erro desconhecido') + (data.details ? '\n' + data.details : ''))
      }
    } catch (e: any) { 
      console.error('❌ Erro ao salvar:', e)
      alert('❌ Erro ao salvar: ' + e.message) 
    }
    finally { setSalvando(false) }
  }

  const PreviewSite = () => {
    const [produtos, setProdutos] = useState<any[]>([])
    const [servicos, setServicos] = useState<any[]>([])
    const [totalDestaque, setTotalDestaque] = useState(0)
    
    useEffect(() => {
      const carregarDados = async () => {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: 'Bearer ' + token } : undefined
        try {
          const res = await fetch('/api/produtos', { headers })
          if (res.ok) {
            const data = await res.json()
            const prods = data.filter((i: any) => i.tipo === 'produto')
            const servs = data.filter((i: any) => i.tipo === 'servico')
            setProdutos(prods.slice(0, 8))
            setServicos(servs.slice(0, 8))
            
            // Contar total de itens em destaque
            const destaques = data.filter((i: any) => i.destaque).length
            setTotalDestaque(destaques)
          }
        } catch {}
      }
      carregarDados()
    }, [])
    
    // Carregar fontes do Google Fonts dinamicamente
    useEffect(() => {
      const fonteTitulo = p.fonte_titulo || 'Inter'
      const fonteCorpo = p.fonte_corpo || 'Inter'
      
      // Criar link para Google Fonts se ainda não existir
      const fontId = `google-font-${fonteTitulo.replace(/\s+/g, '-')}-${fonteCorpo.replace(/\s+/g, '-')}`
      
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link')
        link.id = fontId
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${fonteTitulo.replace(/\s+/g, '+')}:wght@400;600;700&family=${fonteCorpo.replace(/\s+/g, '+')}:wght@400;600&display=swap`
        document.head.appendChild(link)
      }
    }, [p.fonte_titulo, p.fonte_corpo])
    
    // Filtrar itens em destaque para o carrossel
    const produtosDestaque = produtos.filter((i: any) => i.destaque)
    const servicosDestaque = servicos.filter((i: any) => i.destaque)
    
    // Carrossel mostra apenas itens em destaque
    let itensCarrossel: any[] = []
    if (p.exibir_tipo === 'ambos') {
      itensCarrossel = p.ordem_exibicao === 'produtos_primeiro' 
        ? [...produtosDestaque, ...servicosDestaque]
        : [...servicosDestaque, ...produtosDestaque]
    } else if (p.exibir_tipo === 'produtos') {
      itensCarrossel = produtosDestaque
    } else if (p.exibir_tipo === 'servicos') {
      itensCarrossel = servicosDestaque
    }
    itensCarrossel = itensCarrossel.slice(0, 8)
    
    // Se não houver itens em destaque, mostrar exemplos
    if (itensCarrossel.length === 0) {
      itensCarrossel = [
        {
          id: 'exemplo-1',
          nome_produto: 'Produto Exemplo 1',
          preco: 99.90,
          tipo: 'produto',
          imagens: [],
          exemplo: true
        },
        {
          id: 'exemplo-2',
          nome_produto: 'Produto Exemplo 2',
          preco: 149.90,
          preco_promocional: 119.90,
          tipo: 'produto',
          imagens: [],
          exemplo: true
        },
        {
          id: 'exemplo-3',
          nome_produto: 'Serviço Exemplo',
          preco: 199.90,
          tipo: 'servico',
          imagens: [],
          exemplo: true
        }
      ]
    }
    
    // Debug
    console.log('🎠 Preview - carrossel_ativado:', p.carrossel_ativado)
    console.log('🎠 Preview - itensCarrossel:', itensCarrossel.length)
    console.log('🎠 Preview - produtosDestaque:', produtosDestaque.length)
    console.log('🎠 Preview - exibir_tipo:', p.exibir_tipo)
    
    // Determinar quais seções mostrar baseado em exibir_tipo
    const mostrarProdutos = p.exibir_tipo === 'ambos' || p.exibir_tipo === 'produtos'
    const mostrarServicos = p.exibir_tipo === 'ambos' || p.exibir_tipo === 'servicos'
    
    // Cores e fontes com fallback
    const corPrimaria = p.cor_primaria || '#DC143C'
    const corSecundaria = p.cor_secundaria || '#FF6B6B'
    const corFundo = p.cor_fundo || '#FFFFFF'
    const corHeader = p.cor_header || '#1a1a1a'
    const corTexto = p.cor_texto || '#1a1a1a'
    const corTextoProduto = p.cor_texto_produto || corTexto
    const fonteTitulo = p.fonte_titulo || 'Inter'
    const fonteCorpo = p.fonte_corpo || 'Inter'
    const corFundoCarrossel = p.cor_fundo_carrossel || 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)'
    // Cards
    const corFundoCard = p.cor_fundo_card || '#FFFFFF'
    const corBordaCard = p.cor_borda_card || '#E5E7EB'
    const corTextoCard = p.cor_texto_card || '#111827'
    const borderRadiusCard = p.borda_radius_card || '12'
    const sombraCard = p.sombra_card || 'md'
    const sombraCardClass = sombraCard === 'none' ? '' : sombraCard === 'sm' ? 'shadow-sm' : sombraCard === 'md' ? 'shadow' : sombraCard === 'lg' ? 'shadow-lg' : 'shadow-xl'
    
    return (
      <div className="sticky top-6 bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-gray-200">
        <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500">minhaloja.encontratudo.com</div>
        </div>
        
        <div className="overflow-y-auto max-h-[70vh]" style={{ background: corFundo, fontFamily: fonteCorpo }}>
          {/* Header - Layout horizontal como no site real */}
          <div className="px-3 py-2" style={{ background: corHeader }}>
            <div className="flex items-center justify-between gap-2">
              {/* Logo + Nome à esquerda */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.logo_url ? (
                  <img src={p.logo_url} alt="Logo" className="h-6 w-auto object-contain rounded" />
                ) : (
                  <div className="w-6 h-6 rounded bg-white/20"></div>
                )}
                <div>
                  <h1 className="text-xs font-bold leading-tight" style={{ color: corTexto, fontFamily: fonteTitulo }}>
                    {p.nome_header || 'Nome da Loja'}
                  </h1>
                  {p.slogan && (
                    <p className="text-[10px] opacity-80 leading-tight" style={{ color: corTexto }}>
                      {p.slogan}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Menu de navegação no centro */}
              <div className="flex items-center gap-3 text-[10px] flex-1 justify-center" style={{ color: corTexto }}>
                <div className="flex items-center gap-1 hover:opacity-80 cursor-pointer">
                  <Icon icon="mdi:home" className="w-3 h-3" />
                  <span>Home</span>
                </div>
                <div className="flex items-center gap-1 hover:opacity-80 cursor-pointer">
                  <Icon icon="mdi:package-variant" className="w-3 h-3" />
                  <span>Produtos</span>
                </div>
                <div className="flex items-center gap-1 hover:opacity-80 cursor-pointer">
                  <Icon icon="mdi:briefcase-outline" className="w-3 h-3" />
                  <span>Serviços</span>
                </div>
                <div className="flex items-center gap-1 hover:opacity-80 cursor-pointer">
                  <Icon icon="mdi:information-outline" className="w-3 h-3" />
                  <span>Sobre Nós</span>
                </div>
              </div>
              
              {/* Campo de pesquisa à direita */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1 bg-white/10 rounded px-2 py-1">
                  <Icon icon="mdi:magnify" className="w-3 h-3" style={{ color: corTexto }} />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="bg-transparent text-[10px] w-16 outline-none placeholder-white/50"
                    style={{ color: corTexto }}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Carrossel Swiper 3D - Cards com largura fixa */}
          {p.carrossel_ativado && itensCarrossel.length > 0 && (
            <div className="py-4" style={{ background: corFundoCarrossel }}>
              <h2 className="text-sm font-bold mb-3 text-center text-white flex items-center justify-center gap-1" style={{ fontFamily: fonteTitulo }}>
                <Icon icon="mdi:star" className="w-4 h-4" />
                Destaques da Loja
                {itensCarrossel.some(i => i.exemplo) && (
                  <span className="text-[9px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full ml-2">
                    EXEMPLO
                  </span>
                )}
              </h2>
              <div className="flex justify-center px-2">
                <div className="w-full max-w-md">
                  <Swiper
                    modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView="auto"
                    spaceBetween={10}
                    coverflowEffect={{
                      rotate: 30,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: true
                    }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="!pb-6"
                  >
                    {itensCarrossel.map((item, idx) => (
                      <SwiperSlide key={idx} className="!w-32">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full relative">
                          {item.exemplo && (
                            <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
                              EXEMPLO
                            </div>
                          )}
                          <div className="h-20 bg-gray-100 flex items-center justify-center">
                            {item.imagens?.[0]?.url ? (
                              <img src={item.imagens[0].url} alt={item.nome} className="w-full h-full object-cover" />
                            ) : (
                              <Icon icon={item.tipo === 'servico' ? 'mdi:briefcase-outline' : 'mdi:package-variant'} className="w-10 h-10 text-gray-300" />
                            )}
                          </div>
                          <div className="p-2 text-center">
                            <h3 className="text-xs font-bold truncate" style={{ color: corTextoProduto, fontFamily: fonteTitulo }}>
                              {item.nome_produto || item.nome}
                            </h3>
                            {item.descricao && (
                              <p className="text-[9px] text-gray-500 truncate">{item.descricao}</p>
                            )}
                            <div className="mt-2 flex flex-col items-center gap-1">
                              <span className="text-sm font-bold" style={{ color: corPrimaria }}>
                                R$ {item.preco?.toFixed(2) || '0.00'}
                              </span>
                              <button className="w-full px-2 py-1 rounded text-[9px] font-semibold text-white flex items-center justify-center gap-1" style={{ background: corPrimaria }}>
                                <Icon icon="mdi:eye" className="w-3 h-3" />
                                Ver
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          )}
          
          {/* Categorias Populares - Centralizado */}
          <div className="px-3 py-4">
            <h2 className="text-sm font-bold mb-3 text-center" style={{ color: corTexto, fontFamily: fonteTitulo }}>
              <Icon icon="mdi:grid" className="w-4 h-4 inline mr-1" />
              Categorias Populares
            </h2>
            <div className="flex justify-center gap-2 flex-wrap">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})` }}>
                <Icon icon="mdi:laptop" className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          {/* Produtos em Destaque - Cards com largura fixa */}
          {mostrarProdutos && produtos.length > 0 && (
            <div className="px-3 py-4">
              <h2 className="text-sm font-bold mb-3 text-center" style={{ color: corTexto, fontFamily: fonteTitulo }}>
                <Icon icon="mdi:package-variant" className="w-4 h-4 inline mr-1" />
                Produtos em Destaque
              </h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {produtos.slice(0, 4).map((item, idx) => (
                  <div key={idx} className={`w-28 flex-shrink-0 overflow-hidden border ${sombraCardClass}`} style={{ background: corFundoCard, borderColor: corBordaCard, borderRadius: `${borderRadiusCard}px` }}>
                    <div className="h-20 bg-gray-50 flex items-center justify-center">
                      {item.imagens?.[0]?.url ? (
                        <img src={item.imagens[0].url} alt={item.nome_produto} className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="mdi:package-variant" className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="text-[10px] font-bold truncate" style={{ color: corTextoCard, fontFamily: fonteTitulo }}>
                        {item.nome_produto}
                      </h3>
                      <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="text-xs font-bold" style={{ color: corTextoCard }}>
                          R$ {item.preco?.toFixed(2) || '0.00'}
                        </span>
                        <button className="w-full px-2 py-1 rounded text-[9px] font-semibold text-white" style={{ background: corPrimaria }}>
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Serviços em Destaque - Cards com largura fixa */}
          {mostrarServicos && servicos.length > 0 && (
            <div className="px-3 py-4">
              <h2 className="text-sm font-bold mb-3 text-center" style={{ color: corTexto, fontFamily: fonteTitulo }}>
                <Icon icon="mdi:briefcase-outline" className="w-4 h-4 inline mr-1" />
                Serviços em Destaque
              </h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {servicos.slice(0, 4).map((item, idx) => (
                  <div key={idx} className={`w-28 flex-shrink-0 overflow-hidden border ${sombraCardClass}`} style={{ background: corFundoCard, borderColor: corBordaCard, borderRadius: `${borderRadiusCard}px` }}>
                    <div className="h-20 bg-gray-50 flex items-center justify-center">
                      {item.imagens?.[0]?.url ? (
                        <img src={item.imagens[0].url} alt={item.nome_produto} className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="mdi:briefcase-outline" className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="text-[10px] font-bold truncate" style={{ color: corTextoCard, fontFamily: fonteTitulo }}>
                        {item.nome_produto}
                      </h3>
                      <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="text-xs font-bold" style={{ color: corTextoCard }}>
                          R$ {item.preco?.toFixed(2) || '0.00'}
                        </span>
                        <button className="w-full px-2 py-1 rounded text-[9px] font-semibold text-white flex items-center justify-center gap-0.5" style={{ background: corPrimaria }}>
                          <Icon icon="mdi:eye" className="w-3 h-3" />
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer compacto */}
          {p.localizacao_ativo && (
            <div className="px-3 py-2 bg-gray-50 border-t mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px]" style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})` }}>
                    <Icon icon="mdi:map-marker" className="w-3 h-3" />
                  </div>
                  <div className="text-[9px] min-w-0">
                    <div className="font-semibold truncate" style={{ color: corTexto }}>Localização</div>
                    <div className="text-gray-500">Cidade - UF</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:whatsapp" className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[9px] min-w-0">
                    <div className="font-semibold truncate" style={{ color: corTexto }}>Contato</div>
                    <div className="text-gray-500">WhatsApp</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (modo === 'escolha') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">🎨 Personalize sua Loja Online</h1>
            <p className="text-lg text-gray-600">Escolha como você quer começar a personalizar</p>
          </div>
          <div className="mb-12"><PreviewSite /></div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button onClick={() => setModo('rapido')} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500 text-left">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div><h3 className="text-2xl font-bold text-gray-900 mb-2">Personalização Rápida</h3><p className="text-gray-600 mb-4">Te guiamos passo a passo. Rápido e fácil!</p><p className="text-sm text-gray-500">✓ 5-10 minutos</p></div>
              </div>
            </button>
            <button onClick={() => setModo('avancado')} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-pink-500 text-left">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </div>
                <div><h3 className="text-2xl font-bold text-gray-900 mb-2">Personalização Avançada</h3><p className="text-gray-600 mb-4">Controle total de cada detalhe!</p><p className="text-sm text-gray-500">✓ Todas as opções</p></div>
              </div>
            </button>
          </div>
          <div className="text-center"><button onClick={() => router.push('/painel')} className="text-gray-600 hover:text-gray-900 font-semibold">← Voltar para o Painel</button></div>
        </div>
      </div>
    )
  }

  if (modo === 'rapido') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setModo('escolha')} className="text-gray-600 hover:text-gray-900 font-semibold mb-6 flex items-center gap-2"><span>←</span> Voltar</button>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">✨ Personalização Rápida</h2>
            <p className="text-gray-600">Vamos passo a passo. O preview do site fica sempre ao lado.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              {/* Wizard steps */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">Etapa {rapidoEtapa} de 7</div>
                  <div className="flex gap-1">{Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded ${i < rapidoEtapa ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                  ))}</div>
                </div>

                {rapidoEtapa === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Defina um Nome e Slogan</h3>
                    <div>
                      <label htmlFor="rapido_nome" className="block font-semibold text-gray-900 mb-1">Nome da loja</label>
                      <input id="rapido_nome" title="Nome da loja" type="text" value={p.nome_header} onChange={(e) => handleChange('nome_header', e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                      <label htmlFor="rapido_slogan" className="block font-semibold text-gray-900 mb-1">Slogan</label>
                      <input id="rapido_slogan" title="Slogan da loja" type="text" placeholder="Ex: Os melhores produtos" value={p.slogan} onChange={(e) => handleChange('slogan', e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none" />
                    </div>
                  </div>
                )}

                {rapidoEtapa === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Cores do site</h3>
                    <p className="text-gray-600">Escolha um estilo pronto ou personalize manualmente.</p>
                    <style>{PRESETS.map(pr => `.preset-rapido-${pr.id}{ background:${pr.preview}; }`).join('\n')}</style>
                    <div className="grid grid-cols-2 gap-3">
                      {PRESETS.map(pr => (
                        <button key={pr.id} onClick={() => aplicarPreset(pr)} className={'p-3 rounded-lg border-2 transition-all text-left ' + (p.preset_cores === pr.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300')}>
                          <div className={`w-full h-12 rounded mb-2 preset-rapido-${pr.id}`}></div>
                          <div className="text-sm font-semibold text-gray-900">{pr.nome}</div>
                          <div className="text-xs text-gray-500">{pr.descricao}</div>
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setRapidoManualCores(v => !v)} className="px-3 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-50">{rapidoManualCores ? 'Ocultar ajustes manuais' : 'Escolher cor manualmente'}</button>
                    {rapidoManualCores && (
                      <div className="grid grid-cols-1 gap-4">
                        {([{ key: 'cor_primaria', nome: 'Cor Principal' }, { key: 'cor_secundaria', nome: 'Cor Secundária' }, { key: 'cor_fundo', nome: 'Fundo' }, { key: 'cor_header', nome: 'Topo' }, { key: 'cor_texto', nome: 'Texto global' }, { key: 'cor_texto_produto', nome: 'Texto dos produtos' }] as const).map(item => (
                          <div key={item.key} className="flex items-center justify-between bg-white rounded-xl p-4 border">
                            <div>
                              <div className="font-semibold text-gray-900">{item.nome}</div>
                              <input title={`Código ${item.nome}`} type="text" value={p[item.key]} onChange={(e) => handleChange(item.key, e.target.value)} className="mt-1 px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm w-44" />
                            </div>
                            <input title={item.nome} aria-label={item.nome} type="color" value={p[item.key]} onChange={(e) => handleChange(item.key, e.target.value)} className="w-14 h-14 rounded-lg border" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {rapidoEtapa === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Logo da Loja</h3>
                    <div className="bg-white rounded-xl p-4 border">
                      <div className="font-semibold text-gray-900 mb-2">Envie sua logo</div>
                      <div className="flex items-center gap-4">
                        {p.logo_url ? <img src={p.logo_url} alt="Logo" className="h-16 w-auto rounded border" /> : <div className="h-16 w-16 rounded bg-gray-100 border flex items-center justify-center text-gray-400">LOGO</div>}
                        <input type="file" accept="image/*" aria-label="Enviar logo" title="Enviar logo" onChange={async (e) => {
                          const file = e.target.files?.[0]; if (!file) return; const form = new FormData(); form.append('file', file)
                          const token = localStorage.getItem('token') || ''
                          const res = await fetch('/api/upload/logo', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: form })
                          const data = await res.json(); if (!res.ok) { alert(data.error || 'Falha no upload'); return }
                          handleChange('logo_url', data.url)
                        }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Formatos aceitos: PNG, JPG. Máx. 4MB.</p>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Dica:</strong> Use uma logo com fundo transparente (PNG) para melhor resultado.
                      </p>
                    </div>
                  </div>
                )}

                {rapidoEtapa === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Fontes</h3>
                    <div>
                      <label htmlFor="rapido_fonte_titulo" className="block font-semibold text-gray-900 mb-1">Fonte dos títulos</label>
                      <style>{`.rapido-font-titulo{ font-family: "${p.fonte_titulo}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji" }`}</style>
                      <select id="rapido_fonte_titulo" title="Fonte dos títulos" value={p.fonte_titulo} onChange={(e)=>handleChange('fonte_titulo', e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 rapido-font-titulo">
                        {['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rapido_fonte_corpo" className="block font-semibold text-gray-900 mb-1">Fonte do corpo</label>
                      <style>{`.rapido-font-corpo{ font-family: "${p.fonte_corpo}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji" }`}</style>
                      <select id="rapido_fonte_corpo" title="Fonte do corpo" value={p.fonte_corpo} onChange={(e)=>handleChange('fonte_corpo', e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 rapido-font-corpo">
                        {['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-gray-500 mb-2">Preview</div>
                      <div className="text-2xl font-bold rapido-font-titulo">Título com {p.fonte_titulo}</div>
                      <div className="text-sm text-gray-700 rapido-font-corpo">Corpo com {p.fonte_corpo}. O rápido zorro marrom pula sobre o cão preguiçoso.</div>
                    </div>
                  </div>
                )}

                {rapidoEtapa === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Exibição</h3>
                    <div className="space-y-3">
                      {[
                        { v:'ambos', t:'🛍️ Produtos e Serviços', d:'Mostra tudo que você oferece' },
                        { v:'produtos', t:'📦 Apenas Produtos', d:'Esconde serviços, mostra só produtos' },
                        { v:'servicos', t:'⚙️ Apenas Serviços', d:'Esconde produtos, mostra só serviços' },
                      ].map(opt => (
                        <label key={opt.v} className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                          <input type="radio" name="rapido_exibir_tipo" value={opt.v} checked={p.exibir_tipo === opt.v} onChange={(e)=>handleChange('exibir_tipo', e.target.value)} className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-semibold text-gray-900">{opt.t}</div>
                            <div className="text-sm text-gray-500">{opt.d}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {p.exibir_tipo === 'ambos' && (
                      <div className="space-y-3">
                        {[
                          { v:'produtos_primeiro', t:'📦 Produtos Primeiro', d:'Produtos aparecem antes dos serviços' },
                          { v:'servicos_primeiro', t:'⚙️ Serviços Primeiro', d:'Serviços aparecem antes dos produtos' },
                        ].map(opt => (
                          <label key={opt.v} className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                            <input type="radio" name="rapido_ordem" value={opt.v} checked={p.ordem_exibicao === opt.v} onChange={(e)=>handleChange('ordem_exibicao', e.target.value)} className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="font-semibold text-gray-900">{opt.t}</div>
                              <div className="text-sm text-gray-500">{opt.d}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {rapidoEtapa === 6 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Seções da Página</h3>
                    <p className="text-gray-600">Escolha quais seções exibir no seu site</p>
                    
                    <div className="bg-white rounded-xl p-4 border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">🎠 Carrossel de Produtos</div>
                          <div className="text-sm text-gray-500">Destaque produtos em um carrossel 3D no topo</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" title="Ativar carrossel" aria-label="Ativar carrossel" checked={p.carrossel_ativo} onChange={(e)=>handleChange('carrossel_ativo', e.target.checked)} className="sr-only peer" />
                          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                    {p.carrossel_ativo && (
                      <div className="bg-white rounded-xl p-4 border mt-3">
                        <div className="font-semibold text-gray-900 mb-2">Cor de Fundo do Carrossel (Rápido)</div>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            title="Cor de fundo do carrossel"
                            placeholder="Ex: #4a5568 ou linear-gradient(...)"
                            value={p.cor_fundo_carrossel}
                            onChange={(e) => handleChange('cor_fundo_carrossel', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 font-mono text-sm"
                          />
                          <input
                            type="color"
                            aria-label="Escolher cor do carrossel"
                            value={extrairCorSolida(p.cor_fundo_carrossel)}
                            onChange={(e) => handleChange('cor_fundo_carrossel', e.target.value)}
                            className="w-12 h-12 rounded-lg border-2"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white rounded-xl p-4 border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">📍 Localização e Contato</div>
                          <div className="text-sm text-gray-500">Mapa e informações de contato no rodapé</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" title="Ativar localização" aria-label="Ativar localização" checked={p.localizacao_ativo} onChange={(e)=>handleChange('localizacao_ativo', e.target.checked)} className="sr-only peer" />
                          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Dica:</strong> Ambas as seções vêm ativas por padrão. Você pode desativá-las se não precisar.
                      </p>
                    </div>
                  </div>
                )}

                {rapidoEtapa === 7 && (
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">Pronto para salvar!</h3>
                    <p className="text-gray-600">Clique em salvar para aplicar as mudanças.</p>
                    <button onClick={salvar} disabled={salvando} className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-white hover:shadow-xl disabled:opacity-50">{salvando ? 'Salvando...' : '✓ Salvar Alterações'}</button>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <button onClick={() => setRapidoEtapa(e => Math.max(1, e - 1))} className="px-4 py-2 rounded-lg border font-semibold hover:bg-gray-50">Voltar</button>
                  <button onClick={() => setRapidoEtapa(e => Math.min(7, e + 1))} className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold">Continuar</button>
                </div>
              </div>
            </div>
            <div><PreviewSite /></div>
          </div>
        </div>

        {showConcluido && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowConcluido(false)}>
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center" onClick={(e)=>e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-purple-600 mx-auto mb-4 flex items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite]">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Você personalizou seu site!</h4>
              <p className="text-gray-600 mb-6">As alterações foram salvas com sucesso.</p>
              <div className="flex gap-3">
                <button onClick={()=>{ setShowConcluido(false); router.push('/painel') }} className="flex-1 px-4 py-3 rounded-lg border font-semibold hover:bg-gray-50">Voltar ao Painel</button>
                <button onClick={()=>{ setShowConcluido(false); router.push(`/loja/${(loja as any)?.slug || ''}`) }} className="flex-1 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold">Ver meu site</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ====== LAYOUT MOBILE ====== */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Header Mobile: Voltar + Botão Salvar + Menu */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0 shadow-sm">
          <button
            onClick={() => setModo('escolha')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium"
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </button>
          
          <button
            onClick={salvar}
            disabled={salvando}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold text-white text-xs disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
          >
            {salvando ? (
              <>
                <Icon icon="eos-icons:loading" className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Icon icon="material-symbols:check-circle" className="w-4 h-4" />
                <span>Salvar</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            title="Menu de seções"
            aria-label="Abrir menu de seções"
          >
            <Icon icon="material-symbols:menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="absolute top-14 right-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-64">
            <div className="p-2">
              {[
                { id: 'identidade', nome: 'Identidade Visual', icone: '🎨' },
                { id: 'cores', nome: 'Cores', icone: '🌈' },
                { id: 'textos', nome: 'Textos e Fontes', icone: '✍️' },
                { id: 'carrossel', nome: 'Carrossel', icone: '🎠' },
                { id: 'exibicao', nome: 'Exibição', icone: '👁️' },
                { id: 'secoes', nome: 'Seções', icone: '🧩' },
                { id: 'layout', nome: 'Organização', icone: '📦' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMenuAvancado(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all font-medium ${
                    menuAvancado === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icone}</span>
                  <span>{item.nome}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview Fixo - Metade Superior da Tela */}
        <div className="h-1/2 bg-white border-b-2 border-purple-600 overflow-auto flex-shrink-0">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <Icon icon="material-symbols:visibility" className="w-4 h-4" />
                Preview
              </h3>
              <span className="text-[10px] text-gray-500">Use os dedos para zoom/navegar</span>
            </div>
            <PreviewSite />
          </div>
        </div>

        {/* Controles com Scroll - Metade Inferior da Tela */}
        <div className="h-1/2 overflow-y-auto bg-gray-50 flex-shrink-0">
          <div className="p-4 space-y-6"
            onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
          >
            {menuAvancado === 'identidade' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">🎨 Identidade Visual</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-4">Estilos Prontos</h4>
                  <style>{PRESETS.map(pr => `.preset-ident-${pr.id}{ background:${pr.preview}; }`).join('\n')}</style>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESETS.map(preset => (
                      <button key={preset.id} onClick={() => aplicarPreset(preset)} className={'p-3 rounded-lg border-2 transition-all ' + (p.preset_cores === preset.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300')}>
                        <div className={`w-full h-12 rounded mb-2 preset-ident-${preset.id}`}></div>
                        <p className="text-sm font-semibold text-gray-900">{preset.nome}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <h4 className="font-bold text-gray-900">Logo da Loja</h4>
                  <div className="flex items-center gap-4">
                    {p.logo_url ? (
                      <img src={p.logo_url} alt="Logo" className="h-16 w-auto rounded border" />
                    ) : (
                      <div className="h-16 w-16 rounded bg-gray-100 border flex items-center justify-center text-gray-400">LOGO</div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Enviar logo da loja"
                        title="Enviar logo da loja"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const form = new FormData()
                          form.append('file', file)
                          const token = localStorage.getItem('token') || ''
                          const res = await fetch('/api/upload/logo', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: form })
                          const data = await res.json()
                          if (!res.ok) { alert(data.error || 'Falha no upload'); return }
                          handleChange('logo_url', data.url)
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Máx. 4MB. Imagens grandes serão comprimidas automaticamente.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'cores' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🌈 Cores do Site</h3>
                <p className="text-gray-600 mb-6">Personalize cada cor individualmente</p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-purple-900 mb-2">💡 Cores Gerais</h4>
                  <p className="text-sm text-purple-800">Cores principais do site</p>
                </div>
                
                {([{ key: 'cor_primaria', nome: 'Cor Principal', desc: 'Botões e destaques' }, { key: 'cor_secundaria', nome: 'Cor Secundária', desc: 'Elementos complementares' }, { key: 'cor_fundo', nome: 'Fundo da Página', desc: 'Cor de fundo principal' }, { key: 'cor_header', nome: 'Topo do Site', desc: 'Cabeçalho e menu' }, { key: 'cor_texto', nome: 'Cor dos Textos (globais)', desc: 'Títulos e parágrafos do site' }] as const).map(item => (
                  <div key={item.key} className="bg-white rounded-2xl p-6 shadow-lg"><div className="flex items-center justify-between mb-3"><div><h4 className="font-bold text-gray-900">{item.nome}</h4><p className="text-sm text-gray-500">{item.desc}</p></div><input type="color" value={p[item.key]} onChange={(e) => handleChange(item.key, e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label={item.nome} /></div><input type="text" value={p[item.key]} onChange={(e) => handleChange(item.key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label={`Código ${item.nome}`} /></div>
                ))}
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mt-8 mb-6">
                  <h4 className="font-bold text-blue-900 mb-2">🃏 Personalização dos Cards</h4>
                  <p className="text-sm text-blue-800">Customize a aparência dos cards de produtos e serviços</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Fundo do Card</h4>
                      <p className="text-sm text-gray-500">Cor de fundo dos cards de produtos</p>
                    </div>
                    <input type="color" value={p.cor_fundo_card} onChange={(e) => handleChange('cor_fundo_card', e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label="Fundo do Card" />
                  </div>
                  <input type="text" value={p.cor_fundo_card} onChange={(e) => handleChange('cor_fundo_card', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label="Código Fundo do Card" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Borda do Card</h4>
                      <p className="text-sm text-gray-500">Cor da borda dos cards</p>
                    </div>
                    <input type="color" value={p.cor_borda_card} onChange={(e) => handleChange('cor_borda_card', e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label="Borda do Card" />
                  </div>
                  <input type="text" value={p.cor_borda_card} onChange={(e) => handleChange('cor_borda_card', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label="Código Borda do Card" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Texto do Card</h4>
                      <p className="text-sm text-gray-500">Cor do texto dentro dos cards</p>
                    </div>
                    <input type="color" value={p.cor_texto_card} onChange={(e) => handleChange('cor_texto_card', e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label="Texto do Card" />
                  </div>
                  <input type="text" value={p.cor_texto_card} onChange={(e) => handleChange('cor_texto_card', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label="Código Texto do Card" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div>
                    <label htmlFor="borda_radius_card" className="block font-bold text-gray-900 mb-2">Raio da Borda (arredondamento)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        id="borda_radius_card" 
                        type="range" 
                        min="0" 
                        max="32" 
                        step="4"
                        value={p.borda_radius_card} 
                        onChange={(e) => handleChange('borda_radius_card', e.target.value)} 
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-gray-900 w-16 text-center">{p.borda_radius_card}px</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['0', '8', '12', '16', '24'].map(val => (
                        <button 
                          key={val}
                          onClick={() => handleChange('borda_radius_card', val)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${p.borda_radius_card === val ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {val}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div>
                    <label className="block font-bold text-gray-900 mb-3">Sombra do Card</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { v: 'none', n: 'Sem sombra', d: 'Cards sem sombra' },
                        { v: 'sm', n: 'Pequena', d: 'Sombra sutil' },
                        { v: 'md', n: 'Média', d: 'Sombra padrão' },
                        { v: 'lg', n: 'Grande', d: 'Sombra pronunciada' },
                        { v: 'xl', n: 'Extra Grande', d: 'Sombra dramática' },
                      ].map(opt => (
                        <label key={opt.v} className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${p.sombra_card === opt.v ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                          <input 
                            type="radio" 
                            name="sombra_card" 
                            value={opt.v}
                            checked={p.sombra_card === opt.v}
                            onChange={(e) => handleChange('sombra_card', e.target.value)}
                            className="mt-0.5 w-4 h-4 text-purple-600"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{opt.n}</div>
                            <div className="text-xs text-gray-500">{opt.d}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'textos' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">✍️ Textos e Fontes</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div>
                    <label htmlFor="nome_header" className="block font-bold text-gray-900 mb-2">Nome da Loja no Topo</label>
                    <input id="nome_header" type="text" value={p.nome_header} onChange={(e) => handleChange('nome_header', e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="slogan" className="block font-bold text-gray-900 mb-2">Slogan (Frase de Efeito)</label>
                    <input id="slogan" type="text" value={p.slogan} onChange={(e) => handleChange('slogan', e.target.value)} placeholder="Uma frase curta que define seu negócio" className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="fonte_titulo_sel" className="block font-bold text-gray-900 mb-2">Fonte dos Títulos</label>
                    <p className="text-xs text-gray-500 mb-2">As fontes serão carregadas automaticamente do Google Fonts</p>
                    <style>{`.font-titulo-sample{ font-family: "${p.fonte_titulo}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji" }`}</style>
                    <style>{['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => `.opt-${f.replace(/\s+/g,'-')}{ font-family: "${f}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji" }`).join('\n')}</style>
                    <select id="fonte_titulo_sel" title="Fonte dos títulos" value={p.fonte_titulo} onChange={(e)=>handleChange('fonte_titulo', e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 font-titulo-sample text-base">
                      {['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => (
                        <option key={f} value={f} className={`opt-${f.replace(/\s+/g,'-')}`}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="fonte_corpo_sel" className="block font-bold text-gray-900 mb-2">Fonte do Corpo do Texto</label>
                    <p className="text-xs text-gray-500 mb-2">As fontes serão carregadas automaticamente do Google Fonts</p>
                    <style>{`.font-corpo-sample{ font-family: "${p.fonte_corpo}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji" }`}</style>
                    <select id="fonte_corpo_sel" title="Fonte do corpo" value={p.fonte_corpo} onChange={(e)=>handleChange('fonte_corpo', e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 font-corpo-sample text-base">
                      {['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => (
                        <option key={f} value={f} className={`opt-${f.replace(/\s+/g,'-')}`}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
                    <div className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <Icon icon="material-symbols:preview" className="w-5 h-5" />
                      Preview das Fontes
                    </div>
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Títulos:</div>
                        <div className="text-2xl font-bold font-titulo-sample text-gray-900">
                          {p.fonte_titulo}
                        </div>
                        <div className="text-lg font-semibold font-titulo-sample text-gray-700">
                          Exemplo de Título Médio
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="text-xs text-gray-500 mb-1">Corpo do texto:</div>
                        <div className="text-base font-corpo-sample text-gray-700 leading-relaxed">
                          {p.fonte_corpo} - O rápido zorro marrom pula sobre o cão preguiçoso. Este é um exemplo de texto corrido.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'carrossel' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎠 Carrossel de Produtos</h3>
                <p className="text-gray-600 mb-6">Selecione produtos/serviços para destacar no carrossel 3D no topo da página</p>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Ativar Carrossel</h4>
                      <p className="text-sm text-gray-500">Mostrar carrossel de produtos na loja</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        title="Ativar carrossel"
                        aria-label="Ativar carrossel"
                        checked={p.carrossel_ativado} 
                        onChange={(e) => handleChange('carrossel_ativado', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                {p.carrossel_ativado && (
                  <>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Como funciona:</strong> O carrossel exibe automaticamente produtos/serviços marcados como <strong>"Destaque"</strong>.
                      </p>
                      <p className="text-sm text-blue-800">
                        <strong>Passo a passo:</strong>
                      </p>
                      <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                        <li>Acesse a página <strong>Produtos</strong></li>
                        <li>Clique no ícone de <strong>estrela (★)</strong> nos produtos que deseja destacar</li>
                        <li>Os produtos com destaque aparecerão automaticamente no carrossel</li>
                      </ol>
                      {totalDestaque > 0 ? (
                        <p className="text-sm text-green-700 font-bold flex items-center gap-2 mt-3">
                          ✅ Ótimo! Você tem {totalDestaque} {totalDestaque === 1 ? 'item' : 'itens'} em destaque!
                        </p>
                      ) : (
                        <p className="text-sm text-orange-700 font-bold">
                          ⚠️ Nenhum item marcado como destaque ainda. Vá em Produtos para marcar itens!
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                      <h4 className="font-bold text-gray-900">🎨 Cor de Fundo do Carrossel</h4>
                      <p className="text-sm text-gray-500 mb-3">Escolha a cor ou gradiente de fundo do carrossel</p>
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          title="Cor de fundo do carrossel"
                          placeholder="Ex: #4a5568 ou linear-gradient(...)"
                          value={p.cor_fundo_carrossel} 
                          onChange={(e) => handleChange('cor_fundo_carrossel', e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none font-mono text-sm"
                        />
                        <input
                          type="color"
                          aria-label="Cor de fundo do carrossel"
                          value={extrairCorSolida(p.cor_fundo_carrossel)}
                          onChange={(e) => handleChange('cor_fundo_carrossel', e.target.value)}
                          className="w-12 h-12 rounded-lg border-2"
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {[
                          { nome: 'Cinza Escuro', valor: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)' },
                          { nome: 'Azul', valor: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' },
                          { nome: 'Roxo', valor: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
                          { nome: 'Verde', valor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                          { nome: 'Vermelho', valor: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
                        ].map(preset => (
                          <button
                            key={preset.nome}
                            onClick={() => handleChange('cor_fundo_carrossel', preset.valor)}
                            className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-purple-400 text-xs font-semibold transition-all"
                            style={{ background: preset.valor, color: 'white' }}
                          >
                            {preset.nome}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                      <h4 className="font-bold text-gray-900">ℹ️ Como funciona</h4>
                      <ul className="text-sm text-gray-600 space-y-2 list-disc ml-5">
                        <li>O carrossel mostra apenas produtos/serviços marcados como "Destaque"</li>
                        <li>São exibidos até 8 itens em destaque</li>
                        <li>O carrossel roda automaticamente a cada 3 segundos</li>
                        <li>Efeito 3D (Coverflow) moderno e profissional</li>
                        <li>Respeita as configurações de exibição (produtos/serviços)</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {menuAvancado === 'exibicao' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">👁️ Controle de Exibição</h3>
                <p className="text-gray-600 mb-6">Escolha o que mostrar e em qual ordem</p>

                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <label className="block font-bold text-gray-900 mb-4">O que você quer exibir na loja?</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                      <input 
                        type="radio" 
                        name="exibir_tipo" 
                        value="ambos"
                        checked={p.exibir_tipo === 'ambos'}
                        onChange={(e) => handleChange('exibir_tipo', e.target.value)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">🛍️ Produtos e Serviços</div>
                        <div className="text-sm text-gray-500">Mostra tudo que você oferece</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                      <input 
                        type="radio" 
                        name="exibir_tipo" 
                        value="produtos"
                        checked={p.exibir_tipo === 'produtos'}
                        onChange={(e) => handleChange('exibir_tipo', e.target.value)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">📦 Apenas Produtos</div>
                        <div className="text-sm text-gray-500">Esconde serviços, mostra só produtos</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                      <input 
                        type="radio" 
                        name="exibir_tipo" 
                        value="servicos"
                        checked={p.exibir_tipo === 'servicos'}
                        onChange={(e) => handleChange('exibir_tipo', e.target.value)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">⚙️ Apenas Serviços</div>
                        <div className="text-sm text-gray-500">Esconde produtos, mostra só serviços</div>
                      </div>
                    </label>
                  </div>
                </div>

                {p.exibir_tipo === 'ambos' && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                    <label className="block font-bold text-gray-900 mb-4">Em qual ordem exibir?</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                        <input 
                          type="radio" 
                          name="ordem_exibicao" 
                          value="produtos_primeiro"
                          checked={p.ordem_exibicao === 'produtos_primeiro'}
                          onChange={(e) => handleChange('ordem_exibicao', e.target.value)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">📦 Produtos Primeiro</div>
                          <div className="text-sm text-gray-500">Produtos aparecem antes dos serviços</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-300">
                        <input 
                          type="radio" 
                          name="ordem_exibicao" 
                          value="servicos_primeiro"
                          checked={p.ordem_exibicao === 'servicos_primeiro'}
                          onChange={(e) => handleChange('ordem_exibicao', e.target.value)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">⚙️ Serviços Primeiro</div>
                          <div className="text-sm text-gray-500">Serviços aparecem antes dos produtos</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    ✅ <strong>Configurado:</strong> {
                      p.exibir_tipo === 'ambos' 
                        ? `Mostrando ${p.ordem_exibicao === 'produtos_primeiro' ? 'produtos primeiro, depois serviços' : 'serviços primeiro, depois produtos'}`
                        : p.exibir_tipo === 'produtos' 
                          ? 'Mostrando apenas produtos'
                          : 'Mostrando apenas serviços'
                    }
                  </p>
                </div>
              </div>
            )}
            
            {menuAvancado === 'secoes' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🧩 Seções da Página</h3>
                <p className="text-gray-600 mb-6">Ative ou desative seções do seu site</p>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">🎠 Carrossel de Produtos</h4>
                      <p className="text-sm text-gray-500">Exibe um carrossel 3D com produtos/serviços em destaque no topo da página</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        title="Ativar seção carrossel"
                        aria-label="Ativar seção carrossel"
                        checked={p.carrossel_ativo} 
                        onChange={(e) => handleChange('carrossel_ativo', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  {!p.carrossel_ativo && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Atenção:</strong> O carrossel está desativado e não será exibido no site.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">📍 Localização e Contato</h4>
                      <p className="text-sm text-gray-500">Exibe mapa do Google Maps e informações de contato no rodapé</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        title="Ativar seção localização"
                        aria-label="Ativar seção localização"
                        checked={p.localizacao_ativo} 
                        onChange={(e) => handleChange('localizacao_ativo', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  {!p.localizacao_ativo && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Atenção:</strong> A seção de localização está desativada e não será exibida no site.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Dica:</strong> Você pode desativar seções que não fazem sentido para o seu negócio. 
                    Por exemplo, se você trabalha apenas com entrega, pode desativar a seção de localização.
                  </p>
                </div>
              </div>
            )}
            
            {menuAvancado === 'layout' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📦 Organização do Site</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Grid Responsivo Automático</h4>
                  <p className="text-sm text-gray-600">A grade de produtos agora se adapta automaticamente ao tamanho da tela:</p>
                  <ul className="text-sm text-gray-600 list-disc ml-5 mt-2 space-y-1">
                    <li>1 coluna no celular</li>
                    <li>2 colunas em telas pequenas</li>
                    <li>3 colunas em telas médias</li>
                    <li>4-5 colunas em telas grandes/extra grandes</li>
                  </ul>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                    <p className="text-sm text-blue-800">Não é mais necessário escolher "itens por linha" — o layout é fluido e profissional por padrão.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== LAYOUT DESKTOP ====== */}
      <div className="hidden lg:flex lg:flex-row">
        {/* Sidebar Desktop */}
        <div className="w-80 bg-white border-r p-6 flex flex-col h-screen sticky top-0">
          <button onClick={() => setModo('escolha')} className="text-gray-600 hover:text-gray-900 font-semibold mb-8 flex items-center gap-2">
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalização Avançada</h2>
          <p className="text-sm text-gray-600 mb-8">Controle total do seu site</p>
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {[
              { id: 'identidade', nome: 'Identidade Visual', icone: '🎨' }, 
              { id: 'cores', nome: 'Cores', icone: '🌈' }, 
              { id: 'textos', nome: 'Textos e Fontes', icone: '✍️' }, 
              { id: 'carrossel', nome: 'Carrossel', icone: '🎠' },
              { id: 'exibicao', nome: 'Exibição', icone: '👁️' },
              { id: 'secoes', nome: 'Seções', icone: '🧩' },
              { id: 'layout', nome: 'Organização', icone: '📦' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setMenuAvancado(item.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  menuAvancado === item.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{item.icone}</span>
                <span>{item.nome}</span>
              </button>
            ))}
          </nav>
          <button 
            onClick={salvar} 
            disabled={salvando} 
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl font-bold text-white hover:shadow-xl disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
          >
            {salvando ? (
              <>
                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Icon icon="material-symbols:check-circle" className="w-5 h-5" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
        
        {/* Content Desktop */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Copiar todo o conteúdo das seções aqui - mesmo do mobile */}
            {menuAvancado === 'identidade' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">🎨 Identidade Visual</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-4">Estilos Prontos</h4>
                  <style>{PRESETS.map(pr => `.preset-ident-${pr.id}{ background:${pr.preview}; }`).join('\n')}</style>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESETS.map(preset => (
                      <button key={preset.id} onClick={() => aplicarPreset(preset)} className={'p-3 rounded-lg border-2 transition-all ' + (p.preset_cores === preset.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300')}>
                        <div className={`w-full h-12 rounded mb-2 preset-ident-${preset.id}`}></div>
                        <p className="text-sm font-semibold text-gray-900">{preset.nome}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <h4 className="font-bold text-gray-900">Logo da Loja</h4>
                  <div className="flex items-center gap-4">
                    {p.logo_url ? (
                      <img src={p.logo_url} alt="Logo" className="h-16 w-auto rounded border" />
                    ) : (
                      <div className="h-16 w-16 rounded bg-gray-100 border flex items-center justify-center text-gray-400">LOGO</div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Enviar logo da loja"
                        title="Enviar logo da loja"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const form = new FormData()
                          form.append('file', file)
                          const token = localStorage.getItem('token') || ''
                          const res = await fetch('/api/upload/logo', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: form })
                          const data = await res.json()
                          if (!res.ok) { alert(data.error || 'Falha no upload'); return }
                          handleChange('logo_url', data.url)
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Máx. 4MB. Imagens grandes serão comprimidas automaticamente.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'cores' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🌈 Cores do Site</h3>
                <p className="text-gray-600 mb-6">Personalize cada cor individualmente</p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-purple-900 mb-2">💡 Cores Gerais</h4>
                  <p className="text-sm text-purple-800">Cores principais do site</p>
                </div>
                
                {([{ key: 'cor_primaria', nome: 'Cor Principal', desc: 'Botões e destaques' }, { key: 'cor_secundaria', nome: 'Cor Secundária', desc: 'Elementos complementares' }, { key: 'cor_fundo', nome: 'Fundo da Página', desc: 'Cor de fundo principal' }, { key: 'cor_header', nome: 'Topo do Site', desc: 'Cabeçalho e menu' }, { key: 'cor_texto', nome: 'Cor dos Textos (globais)', desc: 'Títulos e parágrafos do site' }] as const).map(item => (
                  <div key={item.key} className="bg-white rounded-2xl p-6 shadow-lg"><div className="flex items-center justify-between mb-3"><div><h4 className="font-bold text-gray-900">{item.nome}</h4><p className="text-sm text-gray-500">{item.desc}</p></div><input type="color" value={p[item.key]} onChange={(e) => handleChange(item.key, e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label={item.nome} /></div><input type="text" value={p[item.key]} onChange={(e) => handleChange(item.key, e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label={`Código ${item.nome}`} /></div>
                ))}
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mt-8 mb-6">
                  <h4 className="font-bold text-blue-900 mb-2">🃏 Personalização dos Cards</h4>
                  <p className="text-sm text-blue-800">Customize a aparência dos cards de produtos e serviços</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Fundo do Card</h4>
                      <p className="text-sm text-gray-500">Cor de fundo dos cards de produtos</p>
                    </div>
                    <input type="color" value={p.cor_fundo_card} onChange={(e) => handleChange('cor_fundo_card', e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label="Fundo do Card" />
                  </div>
                  <input type="text" value={p.cor_fundo_card} onChange={(e) => handleChange('cor_fundo_card', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label="Código Fundo do Card" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Borda do Card</h4>
                      <p className="text-sm text-gray-500">Cor da borda dos cards</p>
                    </div>
                    <input type="color" value={p.cor_borda_card} onChange={(e) => handleChange('cor_borda_card', e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label="Borda do Card" />
                  </div>
                  <input type="text" value={p.cor_borda_card} onChange={(e) => handleChange('cor_borda_card', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label="Código Borda do Card" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">Texto do Card</h4>
                      <p className="text-sm text-gray-500">Cor do texto dentro dos cards</p>
                    </div>
                    <input type="color" value={p.cor_texto_card} onChange={(e) => handleChange('cor_texto_card', e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-200" aria-label="Texto do Card" />
                  </div>
                  <input type="text" value={p.cor_texto_card} onChange={(e) => handleChange('cor_texto_card', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm" aria-label="Código Texto do Card" />
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div>
                    <label htmlFor="borda_radius_card_desk" className="block font-bold text-gray-900 mb-2">Raio da Borda (arredondamento)</label>
                    <div className="flex items-center gap-4">
                      <input 
                        id="borda_radius_card_desk" 
                        type="range" 
                        min="0" 
                        max="32" 
                        step="4"
                        value={p.borda_radius_card} 
                        onChange={(e) => handleChange('borda_radius_card', e.target.value)} 
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-gray-900 w-16 text-center">{p.borda_radius_card}px</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['0', '8', '12', '16', '24'].map(val => (
                        <button 
                          key={val}
                          onClick={() => handleChange('borda_radius_card', val)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${p.borda_radius_card === val ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {val}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div>
                    <label className="block font-bold text-gray-900 mb-3">Sombra do Card</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { v: 'none', n: 'Sem sombra', d: 'Cards sem sombra' },
                        { v: 'sm', n: 'Pequena', d: 'Sombra sutil' },
                        { v: 'md', n: 'Média', d: 'Sombra padrão' },
                        { v: 'lg', n: 'Grande', d: 'Sombra pronunciada' },
                        { v: 'xl', n: 'Extra Grande', d: 'Sombra dramática' },
                      ].map(opt => (
                        <label key={opt.v} className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${p.sombra_card === opt.v ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                          <input 
                            type="radio" 
                            name="sombra_card_desk" 
                            value={opt.v}
                            checked={p.sombra_card === opt.v}
                            onChange={(e) => handleChange('sombra_card', e.target.value)}
                            className="mt-0.5 w-4 h-4 text-purple-600"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{opt.n}</div>
                            <div className="text-xs text-gray-500">{opt.d}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'textos' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">✍️ Textos e Fontes</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div>
                    <label htmlFor="nome_header_desk" className="block font-bold text-gray-900 mb-2">Nome da Loja no Topo</label>
                    <input id="nome_header_desk" type="text" value={p.nome_header} onChange={(e) => handleChange('nome_header', e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="slogan_desk" className="block font-bold text-gray-900 mb-2">Slogan (Frase de Efeito)</label>
                    <input id="slogan_desk" type="text" value={p.slogan} onChange={(e) => handleChange('slogan', e.target.value)} placeholder="Uma frase curta que define seu negócio" className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="fonte_titulo_sel_desk" className="block font-bold text-gray-900 mb-2">Fonte dos Títulos</label>
                    <select id="fonte_titulo_sel_desk" title="Fonte dos títulos" value={p.fonte_titulo} onChange={(e)=>handleChange('fonte_titulo', e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200">
                      {['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="fonte_corpo_sel_desk" className="block font-bold text-gray-900 mb-2">Fonte do Corpo do Texto</label>
                    <select id="fonte_corpo_sel_desk" title="Fonte do corpo" value={p.fonte_corpo} onChange={(e)=>handleChange('fonte_corpo', e.target.value)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200">
                      {['Inter','Poppins','Roboto','Playfair Display','Merriweather','Montserrat'].map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'carrossel' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎠 Carrossel de Produtos</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Ativar Carrossel</h4>
                      <p className="text-sm text-gray-500">Mostrar carrossel de produtos na loja</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        title="Ativar carrossel"
                        checked={p.carrossel_ativado} 
                        onChange={(e) => handleChange('carrossel_ativado', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'exibicao' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">👁️ Controle de Exibição</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <label className="block font-bold text-gray-900 mb-4">O que você quer exibir na loja?</label>
                  <div className="space-y-3">
                    {['ambos', 'produtos', 'servicos'].map(tipo => (
                      <label key={tipo} className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer">
                        <input 
                          type="radio" 
                          name="exibir_tipo_desk" 
                          value={tipo}
                          checked={p.exibir_tipo === tipo}
                          onChange={(e) => handleChange('exibir_tipo', e.target.value)}
                          className="w-5 h-5"
                        />
                        <div>
                          <div className="font-semibold">{tipo === 'ambos' ? 'Produtos e Serviços' : tipo === 'produtos' ? 'Apenas Produtos' : 'Apenas Serviços'}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'secoes' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🧩 Seções da Página</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">🎠 Carrossel de Produtos</h4>
                      <p className="text-sm text-gray-500">Exibe carrossel 3D no topo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        title="Ativar carrossel"
                        checked={p.carrossel_ativo} 
                        onChange={(e) => handleChange('carrossel_ativo', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 rounded-full peer after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 peer-checked:after:translate-x-6 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {menuAvancado === 'layout' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📦 Organização do Site</h3>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Grid Responsivo Automático</h4>
                  <p className="text-sm text-gray-600">A grade de produtos se adapta automaticamente ao tamanho da tela.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Preview Desktop - Sticky */}
        <div className="w-1/2 p-8 sticky top-0 h-screen overflow-y-auto bg-gray-50">
          <PreviewSite />
        </div>
      </div>
    </div>
  )
}
