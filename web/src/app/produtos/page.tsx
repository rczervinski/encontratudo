'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'

interface Produto {
  id: string
  nome_produto: string
  descricao: string | null
  preco: number
  preco_promocional: number | null
  tipo: 'produto'
  loja_id: string
  categoria_id: string | null
  imagens?: { url: string }[]
  loja: {
    nome_loja: string
    slug: string
  }
  categoria?: {
    nome: string
  }
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [categorias, setCategorias] = useState<{id: string, nome: string}[]>([])

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => {
        setProdutos(data)
        const cats = new Map<string, string>()
        data.forEach((p: Produto) => {
          if (p.categoria_id && p.categoria?.nome) {
            cats.set(p.categoria_id, p.categoria.nome)
          }
        })
        setCategorias(Array.from(cats.entries()).map(([id, nome]) => ({ id, nome })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const produtosFiltrados = produtos.filter(p => {
    const matchBusca = !busca || 
      p.nome_produto.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
      p.loja.nome_loja.toLowerCase().includes(busca.toLowerCase())
    
    const matchCategoria = !categoriaFiltro || p.categoria_id === categoriaFiltro
    
    return matchBusca && matchCategoria
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Icon icon="mdi:arrow-left" className="w-5 h-5" />
              Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Icon icon="mdi:shopping-outline" className="w-8 h-8 text-blue-600" />
              Produtos
            </h1>
            <div className="w-20"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <Icon icon="mdi:tag-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="mdi:package-variant-closed" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h2>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltrados.map(produto => (
                <Link 
                  key={produto.id} 
                  href="/loja/{produto.loja.slug}"
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {produto.imagens?.[0]?.url ? (
                      <img
                        src={produto.imagens[0].url}
                        alt={produto.nome_produto}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                        <Icon icon="mdi:package-variant" className="w-20 h-20 text-blue-300" />
                      </div>
                    )}
                    
                    {produto.preco_promocional && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        -{Math.round((1 - produto.preco_promocional / produto.preco) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Icon icon="mdi:store" className="w-3.5 h-3.5" />
                      {produto.loja.nome_loja}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-blue-600 transition-colors">
                      {produto.nome_produto}
                    </h3>
                    
                    {produto.categoria?.nome && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <Icon icon="mdi:tag-outline" className="w-3.5 h-3.5" />
                        {produto.categoria.nome}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      {produto.preco_promocional ? (
                        <div>
                          <div className="text-sm text-gray-400 line-through">
                            R$ {produto.preco.toFixed(2)}
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-gray-900">
                          R$ {produto.preco.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Icon icon="mdi:eye" className="w-5 h-5" />
                      Ver na loja
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Encontra Tudo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
