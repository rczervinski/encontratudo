'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function LojaPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [loja, setLoja] = useState<any>(null)
  const [produtos, setProdutos] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [produtoModal, setProdutoModal] = useState<any>(null)
  const [carrosselIndex, setCarrosselIndex] = useState(0)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('')
  const [buscando, setBuscando] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const [megaOpen, setMegaOpen] = useState<null | 'produtos' | 'servicos'>(null)
  const [hoverCatId, setHoverCatId] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const megaCloseTimeout = useRef<NodeJS.Timeout | null>(null)
  // Em ambiente de cliente, prefira caminho relativo para evitar porta divergente (ex.: dev em 3001)
  const API_BASE = ''

  const carregarLoja = async (q?: string) => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : ''
    try {
      const res = await fetch(`${API_BASE}/api/lojas/${params.slug}${qs}`)
      if (!res.ok) throw new Error('Loja não encontrada')
      const data = await res.json()
      setLoja(data)
      const prods = data.produtos?.filter((p: any) => p.tipo === 'produto' && p.disponivel && !p.bloqueado) || []
      const servs = data.produtos?.filter((p: any) => p.tipo === 'servico' && p.disponivel && !p.bloqueado) || []
      setProdutos(prods)
      setServicos(servs)
      setCategorias(data.categorias || [])
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        await carregarLoja()
      } finally {
        setLoading(false)
      }
    })()
  }, [API_BASE, params.slug])

  

  const onBuscar = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setBuscando(true)
    try {
      await carregarLoja(termoBusca.trim() || undefined)
    } finally {
      setBuscando(false)
    }
  }

  // árvore simples de categorias (até 3 níveis) — definido ANTES de qualquer early return
  const categoriasPorPai = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const c of categorias) {
      const k = c.pai_id || 'root'
      if (!map[k]) map[k] = []
      map[k].push(c)
    }
    return map
  }, [categorias])

  const topo = useMemo(() => (categoriasPorPai['root'] || []), [categoriasPorPai])

  // Auto avançar carrossel
  useEffect(() => {
    const s = loja?.settings
    if (!s?.conteudo?.carrossel_ativado) return
    const fotos = [
      s.conteudo.carrossel_foto1,
      s.conteudo.carrossel_foto2,
      s.conteudo.carrossel_foto3
    ].filter(Boolean)
    
    if (fotos.length <= 1) return
    
    const timer = setInterval(() => {
      setCarrosselIndex(prev => (prev + 1) % fotos.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [loja])

  // Seleção de fontes derivadas (com fallback) e carregamento do Google Fonts
  const fonteTituloSel = (loja?.settings as any)?.identidade?.fontes?.fonte_titulo || 'Inter'
  const fonteCorpoSel = (loja?.settings as any)?.identidade?.fontes?.fonte_corpo || 'Inter'
  useEffect(() => {
    const fam = [fonteTituloSel, fonteCorpoSel]
      .filter(Boolean)
      .map(f => f.replace(/ /g, '+') + ':wght@400;600;700')
      .join('&family=')
    const href = fam ? `https://fonts.googleapis.com/css2?family=${fam}&display=swap` : ''
    if (!href) return
    let link = document.getElementById('gf-loja') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = 'gf-loja'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = href
  }, [fonteTituloSel, fonteCorpoSel])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando loja...</p>
      </div>
    </div>
  )
  
  if (error || !loja) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Loja não encontrada</h1>
        <p className="text-gray-600">{error || 'Verifique o link e tente novamente.'}</p>
      </div>
    </div>
  )

  const s = loja.settings || {}
  const p = {
    logo_url: s.identidade?.logo_url,
    nome_header: s.identidade?.nome_header,
    slogan: s.identidade?.slogan,
    cor_primaria: s.identidade?.cores?.cor_primaria,
    cor_secundaria: s.identidade?.cores?.cor_secundaria,
    cor_fundo: s.identidade?.cores?.cor_fundo,
    cor_header: s.identidade?.cores?.cor_header,
    cor_texto: s.identidade?.cores?.cor_texto,
    cor_texto_produto: s.identidade?.cores?.cor_texto_produto,
    cor_fundo_card: s.identidade?.cores?.cor_fundo_card,
    cor_borda_card: s.identidade?.cores?.cor_borda_card,
    cor_texto_card: s.identidade?.cores?.cor_texto_card,
    borda_radius_card: s.identidade?.cores?.borda_radius_card,
    sombra_card: s.identidade?.cores?.sombra_card,
    cor_fundo_carrossel: s.conteudo?.cor_fundo_carrossel,
    fonte_titulo: (s as any)?.identidade?.fontes?.fonte_titulo,
    fonte_corpo: (s as any)?.identidade?.fontes?.fonte_corpo,
    produtos_por_linha: s.layout?.produtos_por_linha,
    mostrar_categorias: s.layout?.mostrar_categorias,
    carrossel_ativo: s.layout?.carrossel_ativo ?? true,
    localizacao_ativo: s.layout?.localizacao_ativo ?? true,
    carrossel_ativado: s.conteudo?.carrossel_ativado,
    carrossel_foto1: s.conteudo?.carrossel_foto1,
    carrossel_foto2: s.conteudo?.carrossel_foto2,
    carrossel_foto3: s.conteudo?.carrossel_foto3,
    exibir_tipo: s.conteudo?.exibir_tipo,
    ordem_exibicao: s.conteudo?.ordem_exibicao,
    instagram: s.integracoes?.instagram,
    facebook: s.integracoes?.facebook,
  }
  
  const corPrimaria = p.cor_primaria || '#DC143C'
  const corSecundaria = p.cor_secundaria || '#FF6B6B'
  const corFundo = p.cor_fundo || '#FFFFFF'
  const corFundoCarrossel = p.cor_fundo_carrossel || 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)'
  const corHeader = p.cor_header || '#1a1a1a'
  const corTexto = p.cor_texto || '#1a1a1a'
  const corTextoProduto = p.cor_texto_produto || corTexto
  const corFundoCard = p.cor_fundo_card || '#FFFFFF'
  const corBordaCard = p.cor_borda_card || '#E5E7EB'
  const corTextoCard = p.cor_texto_card || '#111827'
  const borderRadiusCard = p.borda_radius_card || '12'
  const sombraCard = p.sombra_card || 'md'
  const fonteTitulo = p.fonte_titulo || 'Inter'
  const fonteCorpo = p.fonte_corpo || 'Inter'
  const gridColsClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  
  const exibirTipo = p.exibir_tipo || 'ambos'
  const ordemExibicao = p.ordem_exibicao || 'produtos_primeiro'
  
  const mostrarProdutos = exibirTipo === 'produtos' || exibirTipo === 'ambos'
  const mostrarServicos = exibirTipo === 'servicos' || exibirTipo === 'ambos'
  
  const produtosFiltrados = produtos.filter(p => !categoriaFiltro || p.categoria_id === categoriaFiltro)
  const servicosFiltrados = servicos.filter(s => !categoriaFiltro || s.categoria_id === categoriaFiltro)

  // Itens em destaque para o carrossel (respeita exibir_tipo e ordem)
  const produtosDestaque = produtos.filter(i => i.destaque && i.disponivel && !i.bloqueado)
  const servicosDestaque = servicos.filter(i => i.destaque && i.disponivel && !i.bloqueado)
  let itensCarrossel: any[] = []
  if (exibirTipo === 'ambos') {
    itensCarrossel = ordemExibicao === 'produtos_primeiro' ? [...produtosDestaque, ...servicosDestaque] : [...servicosDestaque, ...produtosDestaque]
  } else if (exibirTipo === 'produtos') itensCarrossel = produtosDestaque
  else if (exibirTipo === 'servicos') itensCarrossel = servicosDestaque
  itensCarrossel = itensCarrossel.slice(0, 8)

  const fotosCarrossel = [
    p.carrossel_foto1,
    p.carrossel_foto2,
    p.carrossel_foto3
  ].filter(Boolean)

  const contatoWhatsApp = loja.whatsapp ? `https://wa.me/${loja.whatsapp.replace(/\D/g, '')}` : null

  // categoriasPorPai/topo já definidos antes dos returns

  // useEffect de fontes movido acima para garantir ordem estável de hooks

  const ProdutoCard = ({ item }: { item: any }) => {
    const sombraCardClass = sombraCard === 'none' ? '' : sombraCard === 'sm' ? 'shadow-sm' : sombraCard === 'md' ? 'shadow' : sombraCard === 'lg' ? 'shadow-lg' : 'shadow-xl'
    
    return (
      <div
        onClick={() => router.push(`/loja/${params.slug}/produtos/${item.id}`)}
        className={`group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border ${sombraCardClass}`}
        style={{ 
          background: corFundoCard, 
          borderColor: corBordaCard, 
          borderRadius: `${borderRadiusCard}px` 
        }}
      >
        {/* Imagem */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {item.imagens?.[0]?.url ? (
            <img 
              src={item.imagens[0].url} 
              alt={item.nome_produto} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Icon 
                icon={item.tipo === 'servico' ? 'mdi:briefcase-outline' : 'mdi:package-variant'} 
                className="w-20 h-20 text-gray-300" 
              />
            </div>
          )}
          
          {/* Badge de desconto */}
          {item.preco_promocional && item.preco_promocional < item.preco && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {Math.round(((item.preco - item.preco_promocional) / item.preco) * 100)}% OFF
            </div>
          )}
        </div>
        
        {/* Conteúdo */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-3 lo-font-title line-clamp-2 min-h-[3.5rem]" style={{ color: corTextoCard }}>
            {item.nome_produto}
          </h3>
          
          {/* Preço */}
          <div className="mb-4">
            {item.preco_promocional && item.preco_promocional < item.preco ? (
              <div className="space-y-1">
                <div className="text-sm line-through" style={{ color: corTextoCard, opacity: 0.5 }}>
                  R$ {item.preco.toFixed(2)}
                </div>
                <div className="text-2xl font-bold" style={{ color: corTextoCard }}>
                  R$ {item.preco_promocional.toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold" style={{ color: corTextoCard }}>
                R$ {item.preco.toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Botão */}
          <button className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 lo-btn flex items-center justify-center gap-2">
            <Icon icon={item.tipo === 'servico' ? 'mdi:calendar-check' : 'mdi:cart-outline'} className="w-5 h-5" />
            {item.tipo === 'servico' ? 'Ver detalhes' : 'Comprar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lo-scope">
      <style>{`
        .lo-scope{
          --cor-primaria: ${corPrimaria};
          --cor-secundaria: ${corSecundaria};
          --cor-fundo: ${corFundo};
          --cor-header: ${corHeader};
          --cor-texto: ${corTexto};
          --cor-texto-produto: ${corTextoProduto};
          --fonte-titulo: "${fonteTitulo}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji";
          --fonte-corpo: "${fonteCorpo}", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji","Segoe UI Emoji";
          background: var(--cor-fundo);
          font-family: var(--fonte-corpo);
        }
        .lo-header{ background: var(--cor-header); }
        .lo-text{ color: var(--cor-texto); }
        .lo-text-prod{ color: var(--cor-texto-produto); }
        .lo-btn{ background: var(--cor-primaria); color:#fff; }
        .lo-grad{ background: linear-gradient(135deg, var(--cor-primaria), var(--cor-secundaria)); }
        .lo-font-title{ font-family: var(--fonte-titulo); }
        .lo-font-body{ font-family: var(--fonte-corpo); }
      `}</style>
      {/* HEADER PROFISSIONAL MAIOR */}
      <header className="sticky top-0 z-50 shadow-lg lo-header">
        <div className="w-full px-4 md:px-8">
          {/* Desktop Header */}
          <div className="hidden md:block py-6">
            <div className="flex items-center gap-6">
              {/* Logo em destaque */}
              <div className="flex items-center gap-4">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={loja.nome_loja} className="h-16 w-auto object-contain" />
                ) : (
                  <div className="h-16 w-16 rounded-lg lo-grad flex items-center justify-center">
                    <Icon icon="mdi:store" className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold lo-text lo-font-title">
                    {p.nome_header || loja.nome_loja}
                  </h1>
                  {p.slogan && (
                    <p className="text-sm opacity-80 lo-text mt-1">{p.slogan}</p>
                  )}
                </div>
              </div>

              {/* NAV CENTRAL */}
              <nav className="flex-1">
                <ul className="flex items-center justify-center gap-8 text-base lo-text">
                  <li>
                    <a href="#topo" className="flex items-center gap-2 hover:opacity-75 transition-opacity font-medium">
                      <Icon icon="mdi:home" className="w-5 h-5" />
                      Home
                    </a>
                  </li>
                  {mostrarProdutos && produtos.length > 0 && (
                    <li 
                      onMouseEnter={() => {
                        if (megaCloseTimeout.current) {
                          clearTimeout(megaCloseTimeout.current)
                          megaCloseTimeout.current = null
                        }
                        setMegaOpen('produtos')
                      }}
                      onMouseLeave={() => {
                        megaCloseTimeout.current = setTimeout(() => {
                          setMegaOpen(null)
                        }, 300)
                      }}
                      className="relative"
                    >
                      <button
                        onClick={() => setMegaOpen(megaOpen === 'produtos' ? null : 'produtos')}
                        className="flex items-center gap-2 hover:opacity-75 transition-opacity font-medium"
                      >
                        <Icon icon="mdi:shopping" className="w-5 h-5" />
                        Produtos
                        <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                      </button>
                    </li>
                  )}
                  {mostrarServicos && servicos.length > 0 && (
                    <li 
                      onMouseEnter={() => {
                        if (megaCloseTimeout.current) {
                          clearTimeout(megaCloseTimeout.current)
                          megaCloseTimeout.current = null
                        }
                        setMegaOpen('servicos')
                      }}
                      onMouseLeave={() => {
                        megaCloseTimeout.current = setTimeout(() => {
                          setMegaOpen(null)
                        }, 300)
                      }}
                      className="relative"
                    >
                      <button
                        onClick={() => setMegaOpen(megaOpen === 'servicos' ? null : 'servicos')}
                        className="flex items-center gap-2 hover:opacity-75 transition-opacity font-medium"
                      >
                        <Icon icon="mdi:tools" className="w-5 h-5" />
                        Serviços
                        <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                      </button>
                    </li>
                  )}
                  <li>
                    <a href="#contato" className="flex items-center gap-2 hover:opacity-75 transition-opacity font-medium">
                      <Icon icon="mdi:information" className="w-5 h-5" />
                      Sobre nós
                    </a>
                  </li>
                </ul>
              </nav>

              {/* PESQUISA À DIREITA */}
              <div className="flex items-center gap-3">
                {searchOpen ? (
                  <form onSubmit={onBuscar} className="flex items-center gap-2">
                    <div className="relative">
                      <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        autoFocus
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="pl-10 pr-4 py-3 rounded-xl text-sm w-64 outline-none bg-white text-gray-900 border-2 border-gray-200 focus:border-[var(--cor-primaria)]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 lo-text"
                      aria-label="Fechar busca"
                    >
                      <Icon icon="mdi:close" className="w-6 h-6" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10 lo-text transition-colors"
                    title="Pesquisar"
                  >
                    <Icon icon="mdi:magnify" className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden py-4">
            <div className="flex items-center justify-between">
              {/* Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center lo-text"
                aria-label="Abrir menu"
              >
                <Icon icon="mdi:menu" className="w-7 h-7" />
              </button>

              {/* Logo Mobile */}
              <div className="flex items-center gap-2">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={loja.nome_loja} className="h-10 w-auto object-contain" />
                ) : (
                  <div className="h-10 w-10 rounded-lg lo-grad flex items-center justify-center">
                    <Icon icon="mdi:store" className="w-5 h-5 text-white" />
                  </div>
                )}
                <h1 className="text-lg font-bold lo-text lo-font-title">
                  {p.nome_header || loja.nome_loja}
                </h1>
              </div>

              {/* Search Mobile */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center lo-text"
                aria-label="Pesquisar"
              >
                <Icon icon="mdi:magnify" className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar Mobile */}
            {searchOpen && (
              <form onSubmit={onBuscar} className="mt-3">
                <div className="relative">
                  <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    autoFocus
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-white text-gray-900 border-2 border-gray-200 focus:border-[var(--cor-primaria)]"
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* MEGA MENU – desce do header (Desktop) */}
        {megaOpen && !mobileMenuOpen && (
          <div 
            onMouseEnter={() => {
              if (megaCloseTimeout.current) {
                clearTimeout(megaCloseTimeout.current)
                megaCloseTimeout.current = null
              }
            }}
            onMouseLeave={() => {
              megaCloseTimeout.current = setTimeout(() => {
                setMegaOpen(null)
              }, 300)
            }}
          >
            <MegaCategorias
              tipo={megaOpen}
              categorias={categorias}
              produtos={produtos}
              servicos={servicos}
              onFechar={() => setMegaOpen(null)}
              onSelecionarCategoria={(id) => {
                setCategoriaFiltro(id)
                setMegaOpen(null)
              }}
            />
          </div>
        )}
      </header>

      {/* SIDEBAR MOBILE MENU */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto">
            {/* Header da Sidebar */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={loja.nome_loja} className="h-10 w-auto" />
                ) : (
                  <div className="h-10 w-10 rounded-lg lo-grad flex items-center justify-center">
                    <Icon icon="mdi:store" className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="font-bold text-gray-900 lo-font-title">Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                aria-label="Fechar menu"
              >
                <Icon icon="mdi:close" className="w-6 h-6 text-gray-900" />
              </button>
            </div>

            {/* Nav Mobile */}
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#topo" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-900 font-medium"
                  >
                    <Icon icon="mdi:home" className="w-6 h-6" />
                    Home
                  </a>
                </li>
                
                {produtos.length > 0 && (
                  <MobileMenuSection
                    icon="mdi:shopping"
                    title="Produtos"
                    items={produtos}
                    categorias={categorias}
                    categoriasPorPai={categoriasPorPai}
                    onSelectAll={() => {
                      setCategoriaFiltro('')
                      setMobileMenuOpen(false)
                      const el = document.getElementById('produtos')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    onSelectCategoria={(id) => {
                      setCategoriaFiltro(id)
                      setMobileMenuOpen(false)
                      const el = document.getElementById('produtos')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  />
                )}
                
                {servicos.length > 0 && (
                  <MobileMenuSection
                    icon="mdi:tools"
                    title="Serviços"
                    items={servicos}
                    categorias={categorias}
                    categoriasPorPai={categoriasPorPai}
                    onSelectAll={() => {
                      setCategoriaFiltro('')
                      setMobileMenuOpen(false)
                      const el = document.getElementById('servicos')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    onSelectCategoria={(id) => {
                      setCategoriaFiltro(id)
                      setMobileMenuOpen(false)
                      const el = document.getElementById('servicos')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  />
                )}
                
                <li>
                  <a 
                    href="#contato" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-900 font-medium"
                  >
                    <Icon icon="mdi:information" className="w-6 h-6" />
                    Sobre nós
                  </a>
                </li>
              </ul>

              {/* Contato */}
              {contatoWhatsApp && (
                <div className="mt-6 pt-6 border-t px-4">
                  <a
                    href={contatoWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white lo-btn"
                  >
                    <Icon icon="mdi:whatsapp" className="w-5 h-5" />
                    Fale Conosco
                  </a>
                </div>
              )}
            </nav>
          </div>
        </>
      )}

      {/* VITRINE ROTATIVA - CARROSSEL DE PRODUTOS EM DESTAQUE */}
      {p.carrossel_ativado && itensCarrossel.length > 0 && (
        <div className="w-full py-16" style={{ background: corFundoCarrossel }}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-12 lo-font-title">
              ✨ Destaques da Loja
            </h2>
            
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={true}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
              className="swiper-container-coverflow"
              style={{
                paddingTop: '50px',
                paddingBottom: '80px',
              }}
            >
              {itensCarrossel.map((item) => (
                <SwiperSlide 
                  key={item.id}
                  style={{
                    width: '320px',
                    height: '400px',
                  }}
                >
                  <div 
                    onClick={() => setProdutoModal(item)}
                    className="bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer h-full flex flex-col transition-transform hover:scale-105"
                  >
                    {/* Imagem */}
                    <div className="relative h-56 bg-gray-100">
                      {item.imagens?.[0]?.url ? (
                        <img
                          src={item.imagens[0].url}
                          alt={item.nome_produto}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <Icon 
                            icon={item.tipo === 'servico' ? 'mdi:tools' : 'mdi:package-variant'} 
                            className="w-20 h-20 text-blue-300"
                          />
                        </div>
                      )}
                      
                      {/* Badge de Desconto */}
                      {item.preco_promocional && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          -{Math.round((1 - item.preco_promocional / item.preco) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                        {item.nome_produto}
                      </h3>
                      
                      {item.descricao && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.descricao}
                        </p>
                      )}
                      
                      {/* Preço */}
                      <div className="mt-auto mb-3">
                        {item.preco_promocional ? (
                          <div>
                            <div className="text-sm text-gray-400 line-through">
                              R$ {item.preco.toFixed(2)}
                            </div>
                            <div className="text-2xl font-bold lo-text">
                              R$ {item.preco_promocional.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-2xl font-bold lo-text">
                            R$ {item.preco.toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      {/* Botão */}
                      <button className="w-full py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 lo-btn flex items-center justify-center gap-2">
                        <Icon icon={item.tipo === 'servico' ? 'mdi:calendar-check' : 'mdi:eye'} className="w-5 h-5" />
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      <style jsx global>{`
        .swiper-container-coverflow .swiper-slide {
          transition: all 0.3s ease;
        }
        .swiper-container-coverflow .swiper-slide-active {
          transform: scale(1.1) !important;
          opacity: 1 !important;
          z-index: 10;
        }
        .swiper-container-coverflow .swiper-slide:not(.swiper-slide-active) {
          transform: scale(0.8) !important;
          opacity: 0.7 !important;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.3);
          width: 44px !important;
          height: 44px !important;
          border-radius: 50%;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5 !important;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: var(--cor-primaria) !important;
        }
      `}</style>

  {/* CONTEÚDO PRINCIPAL */}
  <main className="flex-1 w-full">
        
        {/* SEÇÃO CATEGORIAS POPULARES */}
        {categorias.length > 0 && p.mostrar_categorias && (
          <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 lo-text lo-font-title">
                <Icon icon="mdi:grid" className="w-10 h-10 inline-block mr-3" />
                Categorias Populares
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topo.slice(0, 8).map((cat) => {
                  // Buscar primeira imagem de produto desta categoria
                  const produtoCat = [...produtos, ...servicos].find(p => p.categoria_id === cat.id)
                  const imagemCat = produtoCat?.imagens?.[0]?.url
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriaFiltro(cat.id)
                        const el = document.getElementById(produtos.some(p => p.categoria_id === cat.id) ? 'produtos' : 'servicos')
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="group relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      {/* Imagem de fundo */}
                      {imagemCat ? (
                        <img 
                          src={imagemCat} 
                          alt={cat.nome}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>
                      
                      {/* Texto */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                        <Icon icon="mdi:tag" className="w-12 h-12 mb-3" />
                        <h3 className="text-xl font-bold text-center">{cat.nome}</h3>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* PRODUTOS / SERVIÇOS EM DESTAQUE (ordem controlada por exibir_tipo / ordem_exibicao) */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {(() => {
              const renderProdutos = (
                <div id="produtos" className="mb-16">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold lo-text flex items-center gap-3">
                      <Icon icon="mdi:shopping-outline" className="w-8 h-8" />
                      Produtos em Destaque
                    </h2>
                    {contatoWhatsApp && (
                      <a
                        href={contatoWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 lo-btn"
                      >
                        Entre em contato
                      </a>
                    )}
                  </div>
                  <div className={`grid gap-6 ${gridColsClass}`}>
                    {produtosFiltrados.map(prod => <ProdutoCard key={prod.id} item={prod} />)}
                  </div>
                  {produtosFiltrados.length === 0 && (
                    <div className="text-center py-12 text-gray-500">Nenhum produto encontrado nesta categoria</div>
                  )}
                </div>
              )

              const renderServicos = (
                <div id="servicos" className="mb-16">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold lo-text flex items-center gap-3">
                      <Icon icon="mdi:tools" className="w-8 h-8" />
                      Serviços em Destaque
                    </h2>
                    {contatoWhatsApp && (
                      <a
                        href={contatoWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 lo-btn"
                      >
                        Entre em contato
                      </a>
                    )}
                  </div>
                  <div className={`grid gap-6 ${gridColsClass}`}>
                    {servicosFiltrados.map(serv => <ProdutoCard key={serv.id} item={serv} />)}
                  </div>
                  {servicosFiltrados.length === 0 && (
                    <div className="text-center py-12 text-gray-500">Nenhum serviço encontrado nesta categoria</div>
                  )}
                </div>
              )

              if (mostrarProdutos && mostrarServicos) {
                return ordemExibicao === 'produtos_primeiro'
                  ? (<>{renderProdutos}{renderServicos}</>)
                  : (<>{renderServicos}{renderProdutos}</>)
              }

              if (mostrarProdutos) return renderProdutos
              if (mostrarServicos) return renderServicos
              return null
            })()}
          </div>
        </section>

        {/* SEÇÃO SOBRE NÓS */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Coluna 1 - Imagem */}
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                {p.logo_url ? (
                  <img
                    src={p.logo_url}
                    alt={loja.nome_loja}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <Icon icon="mdi:store" className="w-32 h-32 text-white/30" />
                  </div>
                )}
              </div>
              
              {/* Coluna 2 - Conteúdo */}
              <div>
                <h2 className="text-4xl font-bold mb-6 lo-text lo-font-title">
                  Conheça a {loja.nome_loja}
                </h2>
                
                {p.slogan && (
                  <p className="text-xl text-gray-600 mb-6 italic">
                    "{p.slogan}"
                  </p>
                )}
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Somos uma loja dedicada a oferecer os melhores produtos e serviços para nossos clientes. 
                  Com compromisso com a qualidade e satisfação, trabalhamos todos os dias para superar expectativas 
                  e proporcionar a melhor experiência de compra.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-500" />
                    <span>Qualidade Garantida</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon icon="mdi:truck-fast" className="w-6 h-6 text-blue-500" />
                    <span>Entrega Rápida</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Icon icon="mdi:shield-check" className="w-6 h-6 text-purple-500" />
                    <span>Compra Segura</span>
                  </div>
                </div>
                
                {contatoWhatsApp && (
                  <a
                    href={contatoWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 shadow-lg lo-btn"
                  >
                    <Icon icon="mdi:whatsapp" className="w-6 h-6" />
                    Fale Conosco
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO LOCALIZAÇÃO E CONTATO */}
        {p.localizacao_ativo && loja.endereco && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 lo-text lo-font-title">
              <Icon icon="mdi:map-marker" className="w-10 h-10 inline-block mr-3" />
              Localização e Contato
            </h2>
            
            <div className="grid md:grid-cols-5 gap-8">
              {/* Coluna 1 - Mapa (60%) */}
              <div className="md:col-span-3">
                <div className="h-96 rounded-2xl overflow-hidden shadow-xl">
                  {loja.endereco ? (
                    <iframe
                      title="Localização da loja"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(loja.endereco)}`}
                      width="100%"
                      height="100%"
                      className="border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <Icon icon="mdi:map-marker-off" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Mapa não disponível</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Coluna 2 - Informações de Contato (40%) */}
              <div className="md:col-span-2 space-y-6">
                {/* Endereço */}
                {loja.endereco && (
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center lo-grad flex-shrink-0">
                        <Icon icon="mdi:map-marker" className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 lo-text">Endereço</h3>
                        <p className="text-gray-600">{loja.endereco}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* WhatsApp/Telefone */}
                {loja.whatsapp && (
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 flex-shrink-0">
                        <Icon icon="mdi:whatsapp" className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 lo-text">WhatsApp</h3>
                        <a 
                          href={contatoWhatsApp || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          {loja.whatsapp}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Email */}
                {loja.email && (
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 flex-shrink-0">
                        <Icon icon="mdi:email" className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 lo-text">E-mail</h3>
                        <a 
                          href={`mailto:${loja.email}`}
                          className="text-blue-600 hover:underline break-all"
                        >
                          {loja.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Horário de Funcionamento */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500 flex-shrink-0">
                      <Icon icon="mdi:clock-outline" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 lo-text">Horário</h3>
                      <p className="text-gray-600">
                        {loja.horario_funcionamento || "Segunda a Sexta: 9h às 18h"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}
      </main>

      {/* FOOTER PROFISSIONAL */}
      <footer id="contato" className="mt-auto border-t lo-header">
        <div className="w-full px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Grid Principal */}
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Sobre a Loja */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={loja.nome_loja} className="h-12 w-auto" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg lo-grad flex items-center justify-center">
                      <Icon icon="mdi:store" className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold lo-text lo-font-title">
                    {p.nome_header || loja.nome_loja}
                  </h3>
                </div>
                {p.slogan && (
                  <p className="text-sm opacity-75 lo-text mb-4">{p.slogan}</p>
                )}
                <p className="text-sm opacity-75 lo-text">
                  {loja.descricao || 'Sua loja de confiança na região.'}
                </p>
              </div>

              {/* Localização */}
              <div>
                <h4 className="font-bold text-base mb-4 lo-text flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="w-5 h-5" />
                  Localização
                </h4>
                <div className="text-sm opacity-75 lo-text space-y-1">
                  {loja.endereco && <p>{loja.endereco}</p>}
                  {loja.bairro && <p>{loja.bairro}</p>}
                  <p>{loja.cidade} - {loja.estado}</p>
                  {loja.cep && <p>CEP: {loja.cep}</p>}
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="font-bold text-base mb-4 lo-text flex items-center gap-2">
                  <Icon icon="mdi:phone" className="w-5 h-5" />
                  Contato
                </h4>
                <div className="space-y-3 text-sm opacity-75 lo-text">
                  {loja.telefone_loja && (
                    <a 
                      href={`tel:${loja.telefone_loja.replace(/\D/g, '')}`}
                      className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                    >
                      <Icon icon="mdi:phone-classic" className="w-4 h-4" />
                      {loja.telefone_loja}
                    </a>
                  )}
                  {loja.whatsapp && (
                    <a 
                      href={contatoWhatsApp || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                    >
                      <Icon icon="mdi:whatsapp" className="w-4 h-4" />
                      {loja.whatsapp}
                    </a>
                  )}
                  {loja.email && (
                    <a 
                      href={`mailto:${loja.email}`}
                      className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                    >
                      <Icon icon="mdi:email" className="w-4 h-4" />
                      {loja.email}
                    </a>
                  )}
                  {loja.horario_funcionamento && (
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-start gap-2">
                        <Icon icon="mdi:clock-outline" className="w-4 h-4 mt-0.5" />
                        <span>{loja.horario_funcionamento}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Redes Sociais e Copyright */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Redes Sociais */}
                {(p.instagram || p.facebook) && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-75 lo-text">Siga-nos:</span>
                    <div className="flex gap-3">
                      {p.instagram && (
                        <a 
                          href={`https://instagram.com/${p.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                          aria-label="Instagram"
                        >
                          <Icon icon="mdi:instagram" className="w-5 h-5 lo-text" />
                        </a>
                      )}
                      {p.facebook && (
                        <a 
                          href={`https://facebook.com/${p.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                          aria-label="Facebook"
                        >
                          <Icon icon="mdi:facebook" className="w-5 h-5 lo-text" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Copyright */}
                <div className="text-sm opacity-60 lo-text text-center md:text-right">
                  <p>© {new Date().getFullYear()} {loja.nome_loja}. Todos os direitos reservados.</p>
                  <p className="text-xs mt-1">Desenvolvido por Encontra Tudo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL DO PRODUTO */}
      {produtoModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setProdutoModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {produtoModal.imagens?.[0]?.url ? (
                <img 
                  src={produtoModal.imagens[0].url} 
                  alt={produtoModal.nome_produto} 
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div 
                  className="w-full h-96 flex items-center justify-center text-white lo-grad"
                >
                  <Icon 
                    icon={produtoModal.tipo === 'servico' ? 'mdi:tools' : 'mdi:package-variant'} 
                    className="w-32 h-32"
                  />
                </div>
              )}
              <button 
                onClick={() => setProdutoModal(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                aria-label="Fechar modal"
                title="Fechar"
              >
                <Icon icon="mdi:close" className="w-6 h-6 text-gray-700" />
              </button>
      </div>
      <div className="p-8">
              <h2 className="text-3xl font-bold mb-4 lo-text">
                {produtoModal.nome_produto}
              </h2>
              
              {produtoModal.descricao && (
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {produtoModal.descricao}
                </p>
              )}
              <div className="flex items-center justify-between mb-6">
                <div>
                  {produtoModal.preco_promocional ? (
                    <>
                      <div className="text-lg line-through text-gray-400">R$ {produtoModal.preco}</div>
                      <div className="text-4xl font-bold text-[var(--cor-primaria)]">
                        R$ {produtoModal.preco_promocional}
                      </div>
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-[var(--cor-primaria)]">
                      R$ {produtoModal.preco}
                    </div>
                  )}
                </div>
              </div>
              
              {contatoWhatsApp && (
                <a
                  href={`${contatoWhatsApp}?text=Olá! Tenho interesse em: ${produtoModal.nome_produto}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 rounded-xl font-bold text-white text-center text-lg transition-all hover:scale-105 lo-btn flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:whatsapp" className="w-6 h-6" />
                  Solicitar via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para seções expansíveis de Produtos/Serviços no menu mobile
function MobileMenuSection({ icon, title, items, categorias, categoriasPorPai, onSelectAll, onSelectCategoria }: {
  icon: string
  title: string
  items: any[]
  categorias: any[]
  categoriasPorPai: Record<string, any[]>
  onSelectAll: () => void
  onSelectCategoria: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  
  // Filtrar categorias que têm itens deste tipo (qualquer profundidade)
  const categoriasComItens = new Set(items.map(item => item.categoria_id).filter(Boolean))
  
  // Pegar apenas categorias raiz que têm itens (ou filhos com itens)
  const temItensRecursivo = (catId: string): boolean => {
    if (categoriasComItens.has(catId)) return true
    const filhos = categoriasPorPai[catId] || []
    return filhos.some(f => temItensRecursivo(f.id))
  }
  
  const categoriasRaiz = (categoriasPorPai['root'] || []).filter(cat => temItensRecursivo(cat.id))
  
  return (
    <li>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-900 font-medium"
      >
        <Icon icon={icon} className="w-6 h-6" />
        <span className="flex-1 text-left">{title}</span>
        <Icon 
          icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
          className="w-5 h-5 text-gray-400" 
        />
      </button>
      
      {expanded && (
        <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
          <li>
            <button
              onClick={onSelectAll}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium"
            >
              Todos
            </button>
          </li>
          {categoriasRaiz.map(cat => (
            <MobileCategoryItem
              key={cat.id}
              cat={cat}
              porPai={categoriasPorPai}
              onSelect={onSelectCategoria}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// Componente para itens de categoria recursivos no menu mobile
function MobileCategoryItem({ cat, porPai, onSelect }: {
  cat: any
  porPai: Record<string, any[]>
  onSelect: (id: string) => void
}) {
  const [exp, setExp] = useState(false)
  const hasChildren = (porPai[cat.id]?.length || 0) > 0

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setExp(!exp)}
            className="w-8 h-8 flex items-center justify-center text-gray-600"
            aria-label="Expandir categoria"
          >
            <Icon icon={exp ? "mdi:chevron-down" : "mdi:chevron-right"} className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8"></div>
        )}
        <button
          onClick={() => onSelect(cat.id)}
          className="flex-1 text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-900"
        >
          {cat.nome}
        </button>
      </div>
      
      {hasChildren && exp && (
        <ul className="ml-6 mt-1 space-y-1">
          {(porPai[cat.id] || []).map((child: any) => (
            <MobileCategoryItem
              key={child.id}
              cat={child}
              porPai={porPai}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// Componente MegaCategorias - Menu dropdown de categorias
function MegaCategorias({ tipo, categorias, produtos, servicos, onFechar, onSelecionarCategoria }: {
  tipo: 'produtos' | 'servicos'
  categorias: any[]
  produtos: any[]
  servicos: any[]
  onFechar: () => void
  onSelecionarCategoria: (id: string) => void
}) {
  const items = tipo === 'produtos' ? produtos : servicos
  
  // Filtrar categorias que têm itens deste tipo
  const categoriasComItens = new Set(items.map(item => item.categoria_id).filter(Boolean))
  const categoriasRelevantes = categorias.filter(cat => 
    categoriasComItens.has(cat.id) && !cat.pai_id // Apenas categorias raiz
  )
  
  // Agrupar por categoria pai (suporta profundidade arbitrária)
  const categoriasPorPai = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const c of categorias) {
      const k = c.pai_id || 'root'
      if (!map[k]) map[k] = []
      map[k].push(c)
    }
    return map
  }, [categorias])

  const renderChildren = (parentId: string | null, level = 0) => {
    const key = parentId || 'root'
    const children = categoriasPorPai[key]
    if (!children || children.length === 0) return null
    return (
      <ul className={`ml-${Math.min(level * 4, 12)} space-y-2`}> 
        {children.map((c) => (
          <li key={c.id}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => { onSelecionarCategoria(c.id); onFechar() }}
                className="text-sm text-gray-700 hover:text-[var(--cor-primaria)] transition-colors text-left"
              >
                {c.nome}
              </button>
            </div>
            {renderChildren(c.id, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 hover:text-[var(--cor-primaria)] transition-colors cursor-pointer"
                onClick={() => { onSelecionarCategoria(''); onFechar() }}>
              <Icon icon="mdi:view-grid" className="w-5 h-5" />
              Todos
            </h3>
            <p className="text-sm text-gray-600">Ver todos os {tipo === 'produtos' ? 'produtos' : 'serviços'} disponíveis</p>
          </div>

          {/* Renderiza raízes relevantes e toda a árvore */}
          {categoriasRelevantes.slice(0, 4).map(root => (
            <div key={root.id}>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 hover:text-[var(--cor-primaria)] transition-colors cursor-pointer"
                  onClick={() => { onSelecionarCategoria(root.id); onFechar() }}>
                <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                {root.nome}
              </h3>
              {renderChildren(root.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Seção CategoriasArvore removida – categorias agora aparecem somente no MegaCategorias do header
