"use client"

import Link from 'next/link'
import { useState } from 'react'
import { obterCidadeAutomatica } from '../utils/geolocalizacao'
import SeletorCidade from '../components/SeletorCidade'

interface Resultado {
  tipo: string
  produto: {
    id: string
    nome: string
    descricao: string
    preco: number
    preco_promocional?: number
    foto_url?: string
  }
  loja: {
    id: string
    nome: string
    slug: string
    endereco: string
    telefone: string
    whatsapp: string
    distancia: string
  }
}

export default function Home() {
  const [busca, setBusca] = useState('')
  const [mostrarInfo, setMostrarInfo] = useState(false)
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [loading, setLoading] = useState(false)
  const [detectandoGPS, setDetectandoGPS] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarSeletorCidade, setMostrarSeletorCidade] = useState(false)
  const [buscaRealizada, setBuscaRealizada] = useState(false)

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    
    if (!busca.trim()) {
      setErro('Digite algo para buscar')
      return
    }

    // Se não tem cidade, tenta detectar GPS primeiro
    if (!cidade) {
      setDetectandoGPS(true)
      setErro('')
      
      try {
        const resultado = await obterCidadeAutomatica()
        setCidade(resultado.cidade)
        setEstado(resultado.siglaEstado)
        
        // Depois de detectar, faz a busca
        await realizarBusca(busca, resultado.cidade, resultado.siglaEstado)
      } catch (error) {
        console.error('Erro ao detectar localização:', error)
        setDetectandoGPS(false)
        setMostrarSeletorCidade(true)
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        setErro(isLocalhost 
          ? 'GPS não funciona em localhost. Por favor, selecione sua cidade manualmente.' 
          : 'Não conseguimos detectar sua localização. Por favor, selecione manualmente.'
        )
      }
    } else {
      // Se já tem cidade, faz a busca direto
      await realizarBusca(busca, cidade, estado)
    }
  }

  async function realizarBusca(termoBusca: string, cidadeBusca: string, estadoBusca: string) {
    setLoading(true)
    setDetectandoGPS(false)
    setErro('')
    setBuscaRealizada(false)

    try {
      const params = new URLSearchParams({
        q: termoBusca,
        cidade: cidadeBusca,
        estado: estadoBusca
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        setResultados(data.resultados || [])
        setBuscaRealizada(true)
      } else {
        console.error('Erro da API:', data)
        setErro(data.details ? `${data.error}: ${data.details}` : (data.error || 'Erro ao buscar'))
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      setErro('Erro ao realizar busca. Verifique o console para detalhes.')
    } finally {
      setLoading(false)
    }
  }

  function handleCidadeSelecionada(cidadeNome: string, estadoSigla: string) {
    setCidade(cidadeNome)
    setEstado(estadoSigla)
    setMostrarSeletorCidade(false)
    setErro('')
  }

  function novaBusca() {
    setBusca('')
    setResultados([])
    setBuscaRealizada(false)
    setErro('')
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Esquerda - Anúncios */}
      <aside className="hidden lg:block w-32 xl:w-40 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-purple-200">
        <div className="sticky top-4 mx-2 my-4">
          <div className="bg-white border-2 border-dashed border-purple-300 rounded-lg p-4 min-h-[600px] flex items-center justify-center">
            <p className="text-purple-400 text-xs text-center font-medium">
              Espaço para Anúncio
            </p>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className={`flex-1 flex flex-col items-center px-6 transition-all duration-700 ${buscaRealizada ? 'py-8' : 'py-12 justify-center min-h-screen'}`}>
        {/* Cabeçalho - com animação */}
        <div className={`text-center mb-8 transition-all duration-700 ${buscaRealizada ? 'scale-90' : 'scale-100'}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
              ENCONTRATUDO
            </h1>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8 text-white">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
          
          <p className="text-purple-600 text-lg font-medium mb-3">
            Pesquise por serviços, produtos e profissionais
          </p>

          {cidade && (
            <p className="text-sm text-green-600 mb-2 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Localização: {cidade} - {estado}
              <button 
                onClick={() => setMostrarSeletorCidade(true)}
                className="ml-2 text-xs text-purple-600 hover:text-purple-800 underline"
              >
                alterar
              </button>
            </p>
          )}

          <button onClick={() => setMostrarInfo(!mostrarInfo)} className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span className="text-sm font-medium">O que é o Encontratudo?</span>
          </button>

          {mostrarInfo && (
            <div className="mt-4 max-w-2xl mx-auto bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
              <p className="text-purple-800 leading-relaxed">
                Uma plataforma onde conectamos clientes a pessoas autônomas, com produtos e serviços, fácil e rápido.
              </p>
            </div>
          )}
        </div>

        {/* Detectando GPS */}
        {detectandoGPS && (
          <div className="w-full max-w-3xl mb-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-8 text-center animate-pulse">
            <svg className="w-16 h-16 mx-auto text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-bold text-purple-900 mb-2">
              Detectando sua localização...
            </h3>
            <p className="text-purple-600">
              Aguarde um momento
            </p>
          </div>
        )}

        {/* Formulário de Busca */}
        <form onSubmit={handleBuscar} className="w-full max-w-3xl mb-6">
          <div className="relative">
            <input 
              type="text" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
              placeholder="O que você está procurando?" 
              className="w-full px-8 py-6 text-lg border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all shadow-lg" 
              disabled={loading || detectandoGPS}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || detectandoGPS}
            >
              {loading ? 'Buscando...' : detectandoGPS ? 'Aguarde...' : 'Buscar'}
            </button>
          </div>
          {erro && (
            <p className="mt-3 text-center text-red-600 text-sm">{erro}</p>
          )}
        </form>

        {/* Link para selecionar cidade manualmente */}
        {!cidade && !detectandoGPS && !buscaRealizada && (
          <button
            onClick={() => setMostrarSeletorCidade(true)}
            className="text-sm text-purple-600 hover:text-purple-800 underline mb-8"
          >
            Ou selecione sua cidade manualmente
          </button>
        )}

        {/* Seletor de Cidade */}
        {mostrarSeletorCidade && (
          <div className="w-full max-w-3xl mb-8">
            <SeletorCidade 
              onCidadeSelect={handleCidadeSelecionada}
              mensagem={cidade ? "Alterar localização" : "Selecione sua cidade:"}
              cidadeInicial={cidade}
              estadoInicial={estado}
            />
          </div>
        )}

        {/* Call to Action - Apenas antes da primeira busca */}
        {!buscaRealizada && !loading && !detectandoGPS && (
          <div className="w-full max-w-4xl space-y-6 mb-8">
            {/* Banner para Lojas/Autônomos */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl hover:shadow-purple-300 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Você tem uma loja física ou é autônomo?</h3>
                  <p className="text-purple-100 text-lg mb-4">
                    Cadastre-se gratuitamente e alcance mais clientes na sua região!
                  </p>
                  <Link 
                    href="/registro"
                    className="inline-block bg-white text-purple-700 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Cadastrar minha loja
                  </Link>
                </div>
              </div>
            </div>

            {/* Banner Saiba Mais */}
            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 text-lg">Como funciona o Encontratudo?</h4>
                    <p className="text-purple-600 text-sm">Descubra como conectamos clientes e empresas</p>
                  </div>
                </div>
                <Link 
                  href="/sobre"
                  className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Saiba Mais →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading de Busca */}
        {loading && (
          <div className="w-full max-w-3xl mb-8 bg-gradient-to-b from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-12 text-center">
            <div className="relative mb-6">
              <svg className="w-20 h-20 mx-auto text-purple-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 mb-2 animate-pulse">
              Buscando produtos e serviços em {cidade}
            </h2>
            <p className="text-purple-600">
              Aguarde um momento...
            </p>
          </div>
        )}

        {/* Resultados */}
        {buscaRealizada && !loading && (
          <div className="w-full max-w-4xl">
            {resultados.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-purple-900">
                    {resultados.length} resultado{resultados.length > 1 ? 's' : ''} em {cidade}
                  </h2>
                  <button
                    onClick={novaBusca}
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Nova busca
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  {resultados.map((resultado) => (
                    <Link
                      key={resultado.produto.id}
                      href={`/loja/`}
                      className="block bg-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        {resultado.produto.foto_url && (
                          <img
                            src={resultado.produto.foto_url}
                            alt={resultado.produto.nome}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-purple-900 mb-1">
                            {resultado.produto.nome}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {resultado.produto.descricao}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {resultado.loja.nome}
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            {resultado.loja.distancia} de distância
                          </div>
                          {resultado.produto.preco && (
                            <div className="mt-2">
                              <span className="text-2xl font-bold text-purple-700">
                                R-Force {resultado.produto.preco.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Opção de buscar em outra cidade */}
                <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 text-center">
                  <p className="text-purple-900 font-semibold mb-4">
                    Não encontrou o que procura? Tente outra cidade!
                  </p>
                  <button
                    onClick={() => setMostrarSeletorCidade(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                  >
                    Buscar em outra cidade
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center bg-white border-2 border-purple-200 rounded-2xl p-12">
                <svg className="w-20 h-20 mx-auto text-purple-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vixi, não encontramos nada em {cidade}
                </h2>
                <p className="text-gray-600 mb-6">
                  Tente buscar em outra cidade ou com outros termos
                </p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={novaBusca}
                    className="bg-white border-2 border-purple-300 text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
                  >
                    Tentar outra busca
                  </button>
                  <button
                    onClick={() => setMostrarSeletorCidade(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                  >
                    Mudar cidade
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sidebar Direita - Anúncios */}
      <aside className="hidden lg:block w-32 xl:w-40 bg-gradient-to-b from-purple-50 to-purple-100 border-l border-purple-200">
        <div className="sticky top-4 mx-2 my-4">
          <div className="bg-white border-2 border-dashed border-purple-300 rounded-lg p-4 min-h-[600px] flex items-center justify-center">
            <p className="text-purple-400 text-xs text-center font-medium">
              Espaço para Anúncio
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}