'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Tipos
interface Loja {
  id: string
  nome_loja: string
  slug: string
  email?: string
  telefone_loja?: string
  cidade: string
  estado: string
}

interface Metricas {
  totalProdutos: number
  totalServicos: number
  acessosCatalogo: number
  produtosAtivos: number
  servicosAtivos: number
}

export default function PainelPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('inicio')
  const [loja, setLoja] = useState<Loja | null>(null)
  const [metricas, setMetricas] = useState<Metricas>({
    totalProdutos: 0,
    totalServicos: 0,
    acessosCatalogo: 0,
    produtosAtivos: 0,
    servicosAtivos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lojaData = localStorage.getItem('loja')
    if (lojaData) {
      setLoja(JSON.parse(lojaData))
      carregarMetricas()
    } else {
      router.push('/login')
    }
  }, [])

  const carregarMetricas = async () => {
    // TODO: Buscar métricas reais da API
    setMetricas({
      totalProdutos: 12,
      totalServicos: 5,
      acessosCatalogo: 248,
      produtosAtivos: 10,
      servicosAtivos: 5
    })
    setLoading(false)
  }

  const copiarLinkCatalogo = async () => {
    if (!loja?.slug) return
    const link = `${window.location.origin}/loja/${loja.slug}`
    await navigator.clipboard.writeText(link)
    alert('Link copiado!')
  }

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('loja')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex">
      {/* Sidebar - Menu Lateral */}
      <aside className="w-64 bg-white border-r border-purple-200 shadow-xl flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h1 className="text-xl font-black text-purple-900">Painel</h1>
          </div>
          <p className="text-xs text-gray-600 truncate">{loja?.nome_loja}</p>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'inicio'
                ? 'bg-purple-100 text-purple-900 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Início
          </button>

          <button
            onClick={() => setActiveTab('produtos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'produtos'
                ? 'bg-purple-100 text-purple-900 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Produtos & Serviços
          </button>

          <button
            onClick={() => setActiveTab('categorias')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'categorias'
                ? 'bg-purple-100 text-purple-900 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categorias
          </button>

          <button
            onClick={() => setActiveTab('personalizacao')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'personalizacao'
                ? 'bg-purple-100 text-purple-900 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Personalização
          </button>

          <button
            onClick={() => setActiveTab('analiticos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'analiticos'
                ? 'bg-purple-100 text-purple-900 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analíticos
          </button>
        </nav>

        {/* Footer do Menu */}
        <div className="p-4 border-t border-purple-100 space-y-2">
          <button
            onClick={copiarLinkCatalogo}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copiar Link
          </button>
          <button
            onClick={sair}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-purple-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-900">
                {activeTab === 'inicio' && 'Início'}
                {activeTab === 'produtos' && 'Produtos & Serviços'}
                {activeTab === 'categorias' && 'Categorias'}
                {activeTab === 'personalizacao' && 'Personalização'}
                {activeTab === 'analiticos' && 'Analíticos'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === 'inicio' && 'Visão geral do seu negócio'}
                {activeTab === 'produtos' && 'Gerencie seus produtos e serviços'}
                {activeTab === 'categorias' && 'Organize por categorias'}
                {activeTab === 'personalizacao' && 'Customize seu site'}
                {activeTab === 'analiticos' && 'Métricas e estatísticas'}
              </p>
            </div>
            <Link
              href={`/loja/${loja?.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-semibold"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Meu Site
            </Link>
          </div>
        </header>

        {/* Conteúdo da Aba */}
        <div className="p-8">
          {activeTab === 'inicio' && <TabInicio metricas={metricas} loja={loja} setActiveTab={setActiveTab} />}
          {activeTab === 'produtos' && <TabProdutos />}
          {activeTab === 'categorias' && <TabCategorias />}
          {activeTab === 'personalizacao' && <TabPersonalizacao loja={loja} />}
          {activeTab === 'analiticos' && <TabAnaliticos metricas={metricas} />}
        </div>
      </main>
    </div>
  )
}

// ========== TABS ==========

function TabInicio({ metricas, loja, setActiveTab }: any) {
  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium">Produtos</p>
          <p className="text-3xl font-bold mt-1">{metricas.totalProdutos}</p>
          <p className="text-xs text-blue-100 mt-2">{metricas.produtosAtivos} ativos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-green-100 text-sm font-medium">Serviços</p>
          <p className="text-3xl font-bold mt-1">{metricas.totalServicos}</p>
          <p className="text-xs text-green-100 mt-2">{metricas.servicosAtivos} ativos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p className="text-purple-100 text-sm font-medium">Acessos ao Catálogo</p>
          <p className="text-3xl font-bold mt-1">{metricas.acessosCatalogo}</p>
          <p className="text-xs text-purple-100 mt-2">últimos 30 dias</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-orange-100 text-sm font-medium">Taxa de Conversão</p>
          <p className="text-3xl font-bold mt-1">3.2%</p>
          <p className="text-xs text-orange-100 mt-2">+0.8% este mês</p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('produtos')}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-all">
              <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Novo Produto</span>
          </button>

          <button
            onClick={() => setActiveTab('personalizacao')}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-all">
              <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Personalizar</span>
          </button>

          <button
            onClick={() => setActiveTab('analiticos')}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-all">
              <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Ver Relatórios</span>
          </button>

          <button
            onClick={() => setActiveTab('categorias')}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-all">
              <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Categorias</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function TabProdutos() {
  const [itens, setItens] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<any | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const carregarTudo = async () => {
    setLoading(true)
    setErro('')
    try {
      const headers: any = token ? { Authorization: `Bearer ${token}` } : {}
      const [resP, resC] = await Promise.all([
        fetch('/api/produtos', { headers }),
        fetch('/api/categorias', { headers })
      ])
      const [prods, cats] = await Promise.all([resP.json(), resC.json()])
      if (!resP.ok) throw new Error(prods?.error || 'Erro ao listar produtos')
      if (!resC.ok) throw new Error(cats?.error || 'Erro ao listar categorias')
      setItens(prods)
      setCategorias(cats)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarTudo() }, [])

  const abrirCriar = () => { setEditando(null); setModalAberto(true) }
  const abrirEditar = (item: any) => { setEditando(item); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false) }

  const remover = async (id: string) => {
    if (!confirm('Remover este item?')) return
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao remover')
      await carregarTudo()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const alterarDestaque = async (id: string, destaque: boolean) => {
    try {
      const res = await fetch(`/api/produtos/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ destaque })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao atualizar destaque')
      await carregarTudo()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const filtrados = itens.filter((p) => {
    if (!busca.trim()) return true
    const q = busca.toLowerCase()
    return (
      (p.nome_produto || '').toLowerCase().includes(q) ||
      (p.descricao || '').toLowerCase().includes(q) ||
      (p.tags || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:justify-between">
          <div className="flex items-center gap-2">
            <input aria-label="Buscar produtos" value={busca} onChange={(e)=>setBusca(e.target.value)} className="px-3 py-2 border-2 border-purple-200 rounded-lg outline-none" placeholder="Buscar produtos..." />
            <button onClick={carregarTudo} className="px-3 py-2 rounded-lg border-2 border-purple-200 hover:bg-purple-50">Atualizar</button>
          </div>
          <div className="md:ml-auto">
            <button onClick={abrirCriar} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">Novo Produto</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        {loading ? (
          <div className="text-gray-600">Carregando…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2">Preço</th>
                  <th className="py-2">Qtde</th>
                  <th className="py-2">⭐ Destaque</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2">{p.nome_produto}</td>
                    <td className="py-2 capitalize">{p.tipo}</td>
                    <td className="py-2">R$ {p.preco}{p.preco_promocional ? <span className="text-xs text-green-600"> (promo: R$ {p.preco_promocional})</span> : null}</td>
                    <td className="py-2">{p.estoque_quantidade ?? '-'}</td>
                    <td className="py-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          title={`Marcar ${p.nome_produto} como destaque`}
                          aria-label={`Destaque de ${p.nome_produto}`}
                          checked={!!p.destaque}
                          onChange={(e) => alterarDestaque(p.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button onClick={() => abrirEditar(p)} className="px-3 py-1 bg-blue-600 text-white rounded-lg">Editar</button>
                        <button onClick={() => remover(p.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">Nenhum item</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalAberto && (
        <ProdutoModal onClose={fecharModal} onSaved={async ()=>{ await carregarTudo(); fecharModal() }} categorias={categorias} editItem={editando} />
      )}
    </div>
  )
}

function ProdutoModal({ onClose, onSaved, categorias, editItem }: { onClose: ()=>void, onSaved: ()=>void, categorias: any[], editItem: any | null }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<any>({
    nome_produto: editItem?.nome_produto || '',
    descricao: editItem?.descricao || '',
    preco: editItem?.preco ?? '',
    preco_promocional: editItem?.preco_promocional ?? '',
    tipo: editItem?.tipo || 'produto',
    categoria_id: editItem?.categoria_id || '',
    estoque_quantidade: editItem?.estoque_quantidade ?? ''
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f: any) => ({ ...f, [name]: value }))
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      const payload: any = {
        nome_produto: form.nome_produto,
        descricao: form.descricao || null,
        preco: form.preco,
        preco_promocional: form.preco_promocional || null,
        tipo: form.tipo,
        categoria_id: form.categoria_id || null,
        estoque_quantidade: form.estoque_quantidade || null,
      }
      let res: Response
      if (editItem) {
        res = await fetch(`/api/produtos/${editItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(payload)
        })
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao salvar')
      onSaved()
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl p-6" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{editItem ? 'Editar Produto/Serviço' : 'Novo Produto/Serviço'}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100">✕</button>
        </div>
        {erro && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-lg mb-4 font-semibold">{erro}</div>}
        <form onSubmit={salvar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="nome_produto">Nome</label>
            <input id="nome_produto" aria-label="Nome do produto" name="nome_produto" value={form.nome_produto} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none" placeholder="Ex.: Camiseta Básica" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="tipo">Tipo</label>
            <select id="tipo" aria-label="Tipo" name="tipo" value={form.tipo} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none">
              <option value="produto">Produto</option>
              <option value="servico">Serviço</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="preco">Preço</label>
            <input id="preco" aria-label="Preço" name="preco" value={form.preco} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="preco_promocional">Preço Promocional</label>
            <input id="preco_promocional" aria-label="Preço Promocional" name="preco_promocional" value={form.preco_promocional} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none" placeholder="opcional" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="estoque_quantidade">Estoque (Qtde)</label>
            <input id="estoque_quantidade" aria-label="Estoque" name="estoque_quantidade" value={form.estoque_quantidade} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none" placeholder="ex.: 20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="categoria_id">Categoria</label>
            <select id="categoria_id" aria-label="Categoria" name="categoria_id" value={form.categoria_id} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none">
              <option value="">(sem categoria)</option>
              {categorias.map((c: any) => (
                <option key={c.id} value={c.id}>{'— '.repeat((c.nivel || 1) - 1)}{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="descricao">Descrição</label>
            <textarea id="descricao" aria-label="Descrição" name="descricao" value={form.descricao} onChange={onChange} className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg outline-none" rows={3} placeholder="opcional"></textarea>
          </div>
          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-6 py-2 border-2 border-purple-200 rounded-lg">Cancelar</button>
            <button disabled={salvando} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50">{salvando ? 'Salvando…' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TabCategorias() {
  const [lista, setLista] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [inlineParent, setInlineParent] = useState<string | 'root' | null>(null)
  const [inlineNome, setInlineNome] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [menuAberto, setMenuAberto] = useState<string | null>(null)
  const [expandido, setExpandido] = useState<Record<string, boolean>>({})
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const carregar = async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/categorias', { headers: token ? { Authorization: `Bearer ${token}` } as any : undefined })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao listar categorias')
      setLista(data)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const criarInline = async () => {
    if (!inlineNome.trim()) return
    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ nome: inlineNome, pai_id: inlineParent && inlineParent !== 'root' ? inlineParent : null })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao criar categoria')
      setInlineNome('')
      setInlineParent(null)
      await carregar()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const editarCategoria = async (id: string, nome: string) => {
    const res = await fetch('/api/categorias', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ id, nome })
    })
    if (!res.ok) {
      const data = await res.json().catch(()=>null)
      throw new Error(data?.error || 'Erro ao editar categoria')
    }
    await carregar()
  }

  const togglarOculto = async (id: string, oculto: boolean) => {
    const res = await fetch('/api/categorias', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ id, oculto })
    })
    if (!res.ok) {
      const data = await res.json().catch(()=>null)
      throw new Error(data?.error || 'Erro ao atualizar visibilidade')
    }
    await carregar()
  }

  const apagarCategoria = async (id: string) => {
    const res = await fetch('/api/categorias', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ id })
    })
    if (!res.ok) {
      const data = await res.json().catch(()=>null)
      throw new Error(data?.error || 'Erro ao eliminar categoria')
    }
    await carregar()
  }

  const tree = buildTree(lista)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Categorias</h3>
          <div className="flex items-center gap-2">
            <button onClick={()=>{ setInlineParent('root'); setInlineNome('') }} className="px-3 py-1 rounded-lg border-2 border-purple-200 hover:bg-purple-50">+ Nova categoria (raiz)</button>
            <button onClick={carregar} className="px-3 py-1 rounded-lg border-2 border-purple-200 hover:bg-purple-50">Atualizar</button>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-600">Carregando…</div>
        ) : (
          <div>
            {lista.length === 0 ? (
              <div className="py-12 text-center">
                <button onClick={()=>{ setInlineParent('root'); setInlineNome('') }} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold">CRIAR NOVA CATEGORIA</button>
              </div>
            ) : null}

            <ul className="space-y-1">
              {tree.map((node: any) => (
                <CategoriaNode
                  key={node.id}
                  node={node}
                  nivel={1}
                  expandido={expandido}
                  setExpandido={setExpandido}
                  onAddChild={(id: string | null)=>{ setInlineParent(id as any); setInlineNome('') }}
                  inlineParent={inlineParent}
                  inlineNome={inlineNome}
                  setInlineNome={setInlineNome}
                  onCreate={criarInline}
                  menuAberto={menuAberto}
                  setMenuAberto={setMenuAberto}
                  onEditStart={(id: string, nome: string)=>{ if (id) { setEditId(id); setEditNome(nome) } else { setEditId(null); setEditNome('') } }}
                  editId={editId}
                  editNome={editNome}
                  setEditNome={setEditNome}
                  salvarEdicao={async ()=>{ if (editId) { await editarCategoria(editId, editNome); setEditId(null); setEditNome('') } }}
                  onToggleOculto={async (id: string, novo: boolean)=>{ await togglarOculto(id, novo) }}
                  onEliminar={async (id: string)=>{ await apagarCategoria(id) }}
                />
              ))}
            </ul>

            {inlineParent === 'root' && (
              <div className="py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">(raiz)</span>
                  <input aria-label="Nome da categoria raiz" value={inlineNome} onChange={(e)=>setInlineNome(e.target.value)} className="px-2 py-1 border rounded" placeholder="Nome da categoria" />
                  <button onClick={criarInline} className="px-3 py-1 bg-green-600 text-white rounded">Salvar</button>
                  <button onClick={()=>{ setInlineParent(null); setInlineNome('') }} className="px-3 py-1 border rounded">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoriaNode({ node, nivel, expandido, setExpandido, onAddChild, inlineParent, inlineNome, setInlineNome, onCreate, menuAberto, setMenuAberto, onEditStart, editId, editNome, setEditNome, salvarEdicao, onToggleOculto, onEliminar }: { node: any, nivel: number, expandido: Record<string, boolean>, setExpandido: (v: any)=>void, onAddChild: (id: string | null)=>void, inlineParent: string | 'root' | null, inlineNome: string, setInlineNome: (v: string)=>void, onCreate: ()=>void, menuAberto: string | null, setMenuAberto: (v: string | null)=>void, onEditStart: (id: string, nome: string)=>void, editId: string | null, editNome: string, setEditNome: (v: string)=>void, salvarEdicao: ()=>void, onToggleOculto: (id: string, novo: boolean)=>Promise<void>, onEliminar: (id: string)=>Promise<void> }) {
  return (
    <li className="py-1">
      <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-300">⋮⋮</span>
          <button onClick={()=>setExpandido((e:any)=>({ ...e, [node.id]: !e[node.id] }))} aria-label="Expandir/contrair" className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100">
            {node.children && node.children.length > 0 ? (
              <span>{expandido[node.id] ? '▾' : '▸'}</span>
            ) : (
              <span className="opacity-0">▸</span>
            )}
          </button>

          {editId === node.id ? (
            <div className="flex items-center gap-2 min-w-0">
              <input value={editNome} onChange={(e)=>setEditNome(e.target.value)} className="px-2 py-1 border rounded min-w-[200px]" placeholder="Nome da categoria" />
              <button onClick={salvarEdicao} className="px-2 py-1 bg-blue-600 text-white rounded">Salvar</button>
              <button onClick={()=>{ setEditNome(''); onEditStart('', ''); }} className="px-2 py-1 border rounded">Cancelar</button>
            </div>
          ) : (
            <div className={`truncate ${node.oculto ? 'opacity-50 italic' : ''}`}>{node.nome}</div>
          )}

          {inlineParent === node.id && (
            <div className="ml-4 flex items-center gap-2">
              <input aria-label="Nome da subcategoria" value={inlineNome} onChange={(e)=>setInlineNome(e.target.value)} className="px-2 py-1 border rounded" placeholder="Nome da subcategoria" />
              <button onClick={onCreate} className="px-3 py-1 bg-green-600 text-white rounded">Salvar</button>
              <button onClick={()=>onAddChild(null)} className="px-3 py-1 border rounded">Cancelar</button>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={()=>setMenuAberto(menuAberto === node.id ? null : node.id)} aria-label="Ações" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">⋯</button>
          {menuAberto === node.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              <button onClick={()=>{ onAddChild(node.id); setMenuAberto(null) }} className="w-full text-left px-3 py-2 hover:bg-gray-50">Criar subcategoria</button>
              <button onClick={()=>{ onEditStart(node.id, node.nome); setMenuAberto(null) }} className="w-full text-left px-3 py-2 hover:bg-gray-50">Editar</button>
              <button onClick={async ()=>{ await onToggleOculto(node.id, !node.oculto); setMenuAberto(null) }} className="w-full text-left px-3 py-2 hover:bg-gray-50">{node.oculto ? 'Exibir na loja' : 'Ocultar na loja'}</button>
              <button onClick={async ()=>{ if (confirm('Eliminar categoria e suas subcategorias?')) { await onEliminar(node.id); setMenuAberto(null) } }} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">Eliminar</button>
            </div>
          )}
        </div>
      </div>

      {node.children && node.children.length > 0 && expandido[node.id] !== false && (
        <ul className="mt-1 ml-6">
          {node.children.map((child: any) => (
            <CategoriaNode key={child.id} node={child} nivel={nivel + 1} expandido={expandido} setExpandido={setExpandido} onAddChild={onAddChild} inlineParent={inlineParent} inlineNome={inlineNome} setInlineNome={setInlineNome} onCreate={onCreate} menuAberto={menuAberto} setMenuAberto={setMenuAberto} onEditStart={onEditStart} editId={editId} editNome={editNome} setEditNome={setEditNome} salvarEdicao={salvarEdicao} onToggleOculto={onToggleOculto} onEliminar={onEliminar} />
          ))}
        </ul>
      )}
    </li>
  )
}

function buildTree(categorias: any[]) {
  const byId: Record<string, any> = {}
  const roots: any[] = []
  for (const c of categorias) {
    byId[c.id] = { ...c, children: [] }
  }
  for (const c of categorias) {
    if (c.pai_id && byId[c.pai_id]) byId[c.pai_id].children.push(byId[c.id])
    else roots.push(byId[c.id])
  }
  const sortTree = (nodes: any[]) => {
    nodes.sort((a,b)=> (a.nivel - b.nivel) || (a.ordem - b.ordem) || a.nome.localeCompare(b.nome))
    for (const n of nodes) sortTree(n.children)
  }
  sortTree(roots)
  return roots
}

// Presets de Cores Profissionais
const PRESETS_CORES = [
  {
    id: 'preto-amarelo',
    nome: 'Preto & Amarelo',
    descricao: 'Elegante e vibrante',
    cores: {
      cor_primaria: '#FFD700',
      cor_secundaria: '#FFA500',
      cor_fundo: '#000000',
      cor_header: '#1a1a1a',
      cor_texto: '#FFFFFF'
    },
    preview: 'linear-gradient(135deg, #000000 0%, #FFD700 100%)'
  },
  {
    id: 'preto-laranja',
    nome: 'Preto & Laranja',
    descricao: 'Energia e sofisticação',
    cores: {
      cor_primaria: '#FF6B35',
      cor_secundaria: '#FF8C42',
      cor_fundo: '#0a0a0a',
      cor_header: '#1a1a1a',
      cor_texto: '#FFFFFF'
    },
    preview: 'linear-gradient(135deg, #000000 0%, #FF6B35 100%)'
  },
  {
    id: 'branco-vermelho',
    nome: 'Branco & Vermelho',
    descricao: 'Clássico e impactante',
    cores: {
      cor_primaria: '#DC143C',
      cor_secundaria: '#FF6B6B',
      cor_fundo: '#FFFFFF',
      cor_header: '#DC143C',
      cor_texto: '#1a1a1a'
    },
    preview: 'linear-gradient(135deg, #FFFFFF 0%, #DC143C 100%)'
  },
  {
    id: 'azul-ciano',
    nome: 'Azul & Ciano',
    descricao: 'Moderno e profissional',
    cores: {
      cor_primaria: '#00CED1',
      cor_secundaria: '#1E90FF',
      cor_fundo: '#0F1419',
      cor_header: '#1a2332',
      cor_texto: '#FFFFFF'
    },
    preview: 'linear-gradient(135deg, #0F1419 0%, #00CED1 100%)'
  },
  {
    id: 'verde-lima',
    nome: 'Verde & Lima',
    descricao: 'Fresco e natural',
    cores: {
      cor_primaria: '#00FF7F',
      cor_secundaria: '#32CD32',
      cor_fundo: '#0a1a0a',
      cor_header: '#1a2a1a',
      cor_texto: '#FFFFFF'
    },
    preview: 'linear-gradient(135deg, #0a1a0a 0%, #00FF7F 100%)'
  },
  {
    id: 'roxo-rosa',
    nome: 'Roxo & Rosa',
    descricao: 'Criativo e moderno',
    cores: {
      cor_primaria: '#9D50BB',
      cor_secundaria: '#E91E63',
      cor_fundo: '#1a0a1a',
      cor_header: '#2a1a2a',
      cor_texto: '#FFFFFF'
    },
    preview: 'linear-gradient(135deg, #9D50BB 0%, #E91E63 100%)'
  },
  {
    id: 'dourado-branco',
    nome: 'Dourado & Branco',
    descricao: 'Luxo e elegância',
    cores: {
      cor_primaria: '#FFD700',
      cor_secundaria: '#FFA500',
      cor_fundo: '#FFFFFF',
      cor_header: '#1a1a1a',
      cor_texto: '#1a1a1a'
    },
    preview: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)'
  },
  {
    id: 'navy-ouro',
    nome: 'Navy & Ouro',
    descricao: 'Sofisticado e premium',
    cores: {
      cor_primaria: '#C9A961',
      cor_secundaria: '#D4AF37',
      cor_fundo: '#001F3F',
      cor_header: '#001129',
      cor_texto: '#FFFFFF'
    },
    preview: 'linear-gradient(135deg, #001F3F 0%, #C9A961 100%)'
  }
]

function TabPersonalizacao({ loja }: any) {
  const router = useRouter()
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 text-center shadow-xl">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">🎨 Personalize sua Loja Online</h2>
          <p className="text-lg text-gray-600 mb-2">Deixe sua loja com a sua cara!</p>
          <p className="text-gray-500">Cores, logo, layout e muito mais</p>
        </div>

        <button 
          onClick={() => router.push('/personalizacao')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Abrir Editor de Personalização
        </button>

        <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-semibold text-gray-900">Cores e Estilo</div>
            <div className="text-gray-600 text-xs">6 temas prontos</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-semibold text-gray-900">Preview em Tempo Real</div>
            <div className="text-gray-600 text-xs">Veja as mudanças na hora</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-gray-900">Rápido e Fácil</div>
            <div className="text-gray-600 text-xs">Modos guiado e avançado</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ANTIGO - comentado para referência
function TabPersonalizacaoOLD({ loja }: any) {
  const [p, setP] = useState<any>({
    logo_url: '',
    slogan: '',
    nome_header: loja?.nome_loja || '',
    preset_cores: '',
    cor_primaria: '#9D50BB',
    cor_secundaria: '#E91E63',
    cor_fundo: '#FFFFFF',
    cor_header: '#1a1a1a',
    cor_texto: '#1a1a1a',
    fonte_titulo: 'system-ui',
    fonte_corpo: 'system-ui',
    layout_grade: 'grid',
    produtos_por_linha: 3,
    animacoes_ativadas: true,
    efeito_hover: 'zoom',
    mostrar_categorias: true,
    estilo_categorias: 'cards'
  })

  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')
  const [uploadandoLogo, setUploadandoLogo] = useState(false)

  useEffect(() => {
    carregarPersonalizacao()
  }, [])

  const carregarPersonalizacao = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/personalizacao', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setP((prev: any) => ({ ...prev, ...data }))
        }
      }
    } catch (e) {
      console.error('Erro ao carregar:', e)
    }
  }

  const aplicarPreset = (preset: typeof PRESETS_CORES[0]) => {
    setP((prev: any) => ({
      ...prev,
      preset_cores: preset.id,
      ...preset.cores
    }))
  }

  const handleChange = (key: string, value: any) => {
    setP((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadandoLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const token = localStorage.getItem('token')
      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setP((prev: any) => ({ ...prev, logo_url: data.url }))
      }
    } catch (e) {
      setErro('Erro ao fazer upload da logo')
    } finally {
      setUploadandoLogo(false)
    }
  }

  const salvar = async () => {
    setSalvando(true)
    setSucesso('')
    setErro('')
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/personalizacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(p)
      })

      if (res.ok) {
        setSucesso('✓ Personalização salva com sucesso!')
        setTimeout(() => setSucesso(''), 3000)
      } else {
        setErro('Erro ao salvar')
      }
    } catch (e) {
      setErro('Erro ao salvar personalização')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Presets de Cores - Destaque */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Presets de Cores Profissionais
        </h3>
        <p className="text-purple-100 mb-6">Escolha uma combinação pronta ou personalize do seu jeito</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRESETS_CORES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => aplicarPreset(preset)}
              className={`group relative rounded-xl overflow-hidden transition-all hover:scale-105 ${
                p.preset_cores === preset.id ? 'ring-4 ring-white shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              <div
                className="h-32 flex items-center justify-center"
                style={{ background: preset.preview }}
              >
                {p.preset_cores === preset.id && (
                  <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="bg-white p-3 text-left">
                <p className="font-bold text-gray-900 text-sm">{preset.nome}</p>
                <p className="text-xs text-gray-600">{preset.descricao}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branding */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Identidade Visual
          </h3>

          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Logo da Loja</label>
              <div className="flex items-center gap-4">
                {p.logo_url ? (
                  <div className="relative w-24 h-24 rounded-lg border-2 border-purple-200 overflow-hidden">
                    <img src={p.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center bg-purple-50">
                    <svg className="w-8 h-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLogo}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-semibold text-sm"
                  >
                    {uploadandoLogo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {p.logo_url ? 'Trocar Logo' : 'Enviar Logo'}
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG ou SVG (máx. 2MB)</p>
                </div>
              </div>
            </div>

            {/* Nome do Header */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome no Header</label>
              <input
                type="text"
                value={p.nome_header || ''}
                onChange={(e) => handleChange('nome_header', e.target.value)}
                placeholder="Nome da sua loja"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900"
              />
            </div>

            {/* Slogan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slogan/Descrição</label>
              <textarea
                value={p.slogan || ''}
                onChange={(e) => handleChange('slogan', e.target.value)}
                placeholder="Ex: Os melhores produtos da região"
                rows={3}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none resize-none transition-all text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Cores Customizadas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Cores Personalizadas
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor Primária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.cor_primaria}
                    onChange={(e) => handleChange('cor_primaria', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                    title="Cor Primária"
                  />
                  <input
                    type="text"
                    value={p.cor_primaria}
                    onChange={(e) => handleChange('cor_primaria', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor Secundária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.cor_secundaria}
                    onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                    title="Cor Secundária"
                  />
                  <input
                    type="text"
                    value={p.cor_secundaria}
                    onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor de Fundo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.cor_fundo}
                    onChange={(e) => handleChange('cor_fundo', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                    title="Cor de Fundo"
                  />
                  <input
                    type="text"
                    value={p.cor_fundo}
                    onChange={(e) => handleChange('cor_fundo', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor do Header</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.cor_header}
                    onChange={(e) => handleChange('cor_header', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                    title="Cor do Header"
                  />
                  <input
                    type="text"
                    value={p.cor_header}
                    onChange={(e) => handleChange('cor_header', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono text-gray-900"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cor do Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p.cor_texto}
                    onChange={(e) => handleChange('cor_texto', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                    title="Cor do Texto"
                  />
                  <input
                    type="text"
                    value={p.cor_texto}
                    onChange={(e) => handleChange('cor_texto', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipografia */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Tipografia
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fonte dos Títulos</label>
              <select
                value={p.fonte_titulo}
                onChange={(e) => handleChange('fonte_titulo', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900"
              >
                <option value="system-ui">Padrão do Sistema</option>
                <option value="'Inter', sans-serif">Inter (Moderna)</option>
                <option value="'Poppins', sans-serif">Poppins (Arredondada)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Geométrica)</option>
                <option value="'Playfair Display', serif">Playfair (Elegante)</option>
                <option value="'Bebas Neue', cursive">Bebas Neue (Impactante)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fonte do Corpo</label>
              <select
                value={p.fonte_corpo}
                onChange={(e) => handleChange('fonte_corpo', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900"
              >
                <option value="system-ui">Padrão do Sistema</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Lato', sans-serif">Lato</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            Layout e Organização
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estilo do Layout</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('layout_grade', 'grid')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    p.layout_grade === 'grid'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div className="w-full h-3 bg-purple-300 rounded"></div>
                    <div className="w-full h-3 bg-purple-300 rounded"></div>
                    <div className="w-full h-3 bg-purple-300 rounded"></div>
                    <div className="w-full h-3 bg-purple-300 rounded"></div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Grid</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('layout_grade', 'lista')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    p.layout_grade === 'lista'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <div className="space-y-1 mb-2">
                    <div className="w-full h-2 bg-purple-300 rounded"></div>
                    <div className="w-full h-2 bg-purple-300 rounded"></div>
                    <div className="w-full h-2 bg-purple-300 rounded"></div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Lista</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('layout_grade', 'masonry')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    p.layout_grade === 'masonry'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div className="w-full h-4 bg-purple-300 rounded"></div>
                    <div className="w-full h-2 bg-purple-300 rounded"></div>
                    <div className="w-full h-2 bg-purple-300 rounded"></div>
                    <div className="w-full h-3 bg-purple-300 rounded"></div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Masonry</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Produtos por Linha: {p.produtos_por_linha}
              </label>
              <input
                type="range"
                min={2}
                max={5}
                value={p.produtos_por_linha}
                onChange={(e) => handleChange('produtos_por_linha', Number(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <div>
          {sucesso && <p className="text-green-600 font-semibold">{sucesso}</p>}
          {erro && <p className="text-red-600 font-semibold">{erro}</p>}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={carregarPersonalizacao}
            className="px-6 py-3 border-2 border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            Descartar Alterações
          </button>
          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-bold disabled:opacity-50 flex items-center gap-2"
          >
            {salvando ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar Personalização
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function TabAnaliticos({ metricas }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Em Desenvolvimento</h3>
      <p className="text-gray-600">Análises e métricas detalhadas serão implementadas aqui.</p>
    </div>
  )
}
