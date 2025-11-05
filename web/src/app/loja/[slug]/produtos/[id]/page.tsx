'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

interface Imagem {
  id: number
  url: string
  ordem: number
}

interface Produto {
  id: number
  nome_produto: string
  descricao: string | null
  preco: number
  preco_promocional: number | null
  tipo: 'produto' | 'servico'
  imagens: Imagem[]
  loja: {
    slug: string
    nome_loja: string
    logo_url: string | null
  }
  personalizacao?: {
    cor_primaria?: string
    cor_fundo?: string
    cor_texto?: string
    fonte_titulo?: string
    fonte_corpo?: string
    cor_header?: string
  }
}

export default function ProdutoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)
  const [imagemAtual, setImagemAtual] = useState(0)

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const res = await fetch(`/api/produtos/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProduto(data)
        } else {
          console.error('Produto não encontrado')
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      carregarProduto()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon icon="eos-icons:loading" className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
          <p className="text-gray-600 mb-4">O produto que você procura não existe ou foi removido.</p>
          <button
            onClick={() => router.push(`/loja/${params.slug}`)}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    )
  }

  const corPrimaria = produto.personalizacao?.cor_primaria || '#DC143C'
  const corFundo = produto.personalizacao?.cor_fundo || '#FFFFFF'
  const corTexto = produto.personalizacao?.cor_texto || '#1a1a1a'
  const corHeader = produto.personalizacao?.cor_header || '#1a1a1a'
  const fonteTitulo = produto.personalizacao?.fonte_titulo || 'Inter'
  const fonteCorpo = produto.personalizacao?.fonte_corpo || 'Inter'

  const imagensOrdenadas = [...produto.imagens].sort((a, b) => a.ordem - b.ordem)
  const precoFinal = produto.preco_promocional || produto.preco
  const temDesconto = produto.preco_promocional && produto.preco_promocional < produto.preco

  return (
    <div style={{ background: corFundo, fontFamily: fonteCorpo, minHeight: '100vh' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: corHeader }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push(`/loja/${params.slug}`)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: corTexto }}
          >
            <Icon icon="mdi:arrow-left" className="w-6 h-6" />
            <span className="font-semibold">Voltar para a loja</span>
          </button>

          {produto.loja.logo_url && (
            <div className="flex items-center gap-3">
              <img 
                src={produto.loja.logo_url} 
                alt={produto.loja.nome_loja}
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Layout Desktop: Foto à esquerda + Info à direita */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          
          {/* Galeria de Imagens */}
          <div className="mb-8 lg:mb-0">
            {/* Imagem Principal */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              {imagensOrdenadas.length > 0 ? (
                <div className="relative aspect-square">
                  <img
                    src={imagensOrdenadas[imagemAtual]?.url}
                    alt={produto.nome_produto}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navegação de Imagens */}
                  {imagensOrdenadas.length > 1 && (
                    <>
                      <button
                        onClick={() => setImagemAtual((prev) => (prev > 0 ? prev - 1 : imagensOrdenadas.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                      >
                        <Icon icon="mdi:chevron-left" className="w-8 h-8 text-gray-800" />
                      </button>
                      <button
                        onClick={() => setImagemAtual((prev) => (prev < imagensOrdenadas.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                      >
                        <Icon icon="mdi:chevron-right" className="w-8 h-8 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <Icon 
                    icon={produto.tipo === 'produto' ? 'mdi:package-variant' : 'mdi:briefcase-outline'} 
                    className="w-32 h-32 text-gray-300" 
                  />
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {imagensOrdenadas.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {imagensOrdenadas.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setImagemAtual(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === imagemAtual 
                        ? 'border-current shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={idx === imagemAtual ? { borderColor: corPrimaria } : {}}
                  >
                    <img
                      src={img.url}
                      alt={`${produto.nome_produto} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Nome do Produto */}
            <h1 
              className="text-3xl lg:text-4xl font-bold leading-tight"
              style={{ color: corTexto, fontFamily: fonteTitulo }}
            >
              {produto.nome_produto}
            </h1>

            {/* Preço */}
            <div className="space-y-2">
              {temDesconto && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-400 line-through">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                    {Math.round(((produto.preco - produto.preco_promocional!) / produto.preco) * 100)}% OFF
                  </span>
                </div>
              )}
              <div 
                className="text-4xl lg:text-5xl font-bold"
                style={{ color: corPrimaria }}
              >
                R$ {precoFinal.toFixed(2)}
              </div>
            </div>

            {/* Descrição */}
            {produto.descricao && (
              <div className="space-y-3">
                <h2 
                  className="text-xl font-bold"
                  style={{ color: corTexto, fontFamily: fonteTitulo }}
                >
                  Descrição
                </h2>
                <p 
                  className="text-lg leading-relaxed whitespace-pre-line"
                  style={{ color: corTexto }}
                >
                  {produto.descricao}
                </p>
              </div>
            )}

            {/* Botão de Comprar */}
            <button
              className="w-full py-4 px-8 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
              style={{ background: corPrimaria }}
            >
              <Icon icon="mdi:cart-outline" className="w-6 h-6" />
              {produto.tipo === 'produto' ? 'Comprar Agora' : 'Contratar Serviço'}
            </button>

            {/* Vendido e Entregue por */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Vendido e entregue por:</p>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                {produto.loja.logo_url ? (
                  <img
                    src={produto.loja.logo_url}
                    alt={produto.loja.nome_loja}
                    className="w-16 h-16 object-contain rounded-lg bg-white p-2"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:store" className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <p 
                    className="font-bold text-lg"
                    style={{ color: corTexto, fontFamily: fonteTitulo }}
                  >
                    {produto.loja.nome_loja}
                  </p>
                  <button
                    onClick={() => router.push(`/loja/${params.slug}`)}
                    className="text-sm hover:underline"
                    style={{ color: corPrimaria }}
                  >
                    Ver mais produtos desta loja →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
