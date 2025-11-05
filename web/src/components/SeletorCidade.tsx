'use client'

import { useState, useEffect, useRef } from 'react'

interface Estado {
  sigla: string
  nome: string
}

interface Cidade {
  nome: string
  estado: string
  siglaEstado: string
}

interface SeletorCidadeProps {
  onCidadeSelect: (cidade: string, estado: string) => void
  mensagem?: string
  cidadeInicial?: string
  estadoInicial?: string
}

export default function SeletorCidade({ 
  onCidadeSelect, 
  mensagem = "Selecione sua cidade:",
  cidadeInicial = "",
  estadoInicial = ""
}: SeletorCidadeProps) {
  const [busca, setBusca] = useState('')
  const [cidadeSelecionada, setCidadeSelecionada] = useState(cidadeInicial)
  const [estadoSelecionado, setEstadoSelecionado] = useState(estadoInicial)
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [todasCidades, setTodasCidades] = useState<Cidade[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Carrega todas as cidades ao montar
  useEffect(() => {
    carregarTodasCidades()
  }, [])

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMostrarSugestoes(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function carregarTodasCidades() {
    setLoading(true)
    
    try {
      // Tenta API do IBGE primeiro
      const responseEstados = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      
      if (responseEstados.ok) {
        const estados = await responseEstados.json()
        const todasAsCidades: Cidade[] = []

        // Carrega cidades de todos os estados
        for (const estado of estados) {
          try {
            const responseCidades = await fetch(
              `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.sigla}/municipios`
            )
            
            if (responseCidades.ok) {
              const cidades = await responseCidades.json()
              
              for (const cidade of cidades) {
                todasAsCidades.push({
                  nome: cidade.nome,
                  estado: estado.nome,
                  siglaEstado: estado.sigla
                })
              }
            }
          } catch (e) {
            console.warn(`Erro ao carregar cidades de ${estado.sigla}`)
          }
        }

        setTodasCidades(todasAsCidades)
      } else {
        throw new Error('API IBGE falhou')
      }
    } catch (error) {
      console.warn('Usando fallback JSON local', error)
      
      try {
        const response = await fetch('/cidades/cidades.json')
        const data = await response.json()
        
        const cidadesArray: Cidade[] = []
        
        for (const estadoObj of data.estados) {
          for (const cidadeNome of estadoObj.cidades) {
            cidadesArray.push({
              nome: cidadeNome,
              estado: estadoObj.nome,
              siglaEstado: estadoObj.sigla
            })
          }
        }
        
        setTodasCidades(cidadesArray)
      } catch (jsonError) {
        console.error('Erro ao carregar fallback:', jsonError)
      }
    } finally {
      setLoading(false)
    }
  }

  function filtrarCidades(): Cidade[] {
    if (!busca.trim()) return []

    const termoBusca = busca.toLowerCase().trim()
    
    return todasCidades
      .filter(cidade => 
        cidade.nome.toLowerCase().includes(termoBusca) ||
        cidade.estado.toLowerCase().includes(termoBusca) ||
        cidade.siglaEstado.toLowerCase().includes(termoBusca)
      )
      .slice(0, 8) // Limita a 8 resultados
  }

  function handleSelecionarCidade(cidade: Cidade) {
    setCidadeSelecionada(cidade.nome)
    setEstadoSelecionado(cidade.siglaEstado)
    setBusca(`${cidade.nome} - ${cidade.siglaEstado}`)
    setMostrarSugestoes(false)
  }

  function handleConfirmar() {
    if (cidadeSelecionada && estadoSelecionado) {
      onCidadeSelect(cidadeSelecionada, estadoSelecionado)
    }
  }

  const cidadesFiltradas = filtrarCidades()

  return (
    <div className="w-full max-w-2xl mx-auto" ref={containerRef}>
      <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 shadow-xl">
        <p className="text-center text-purple-900 font-semibold mb-6 text-lg">
          {mensagem}
        </p>

        {/* Input de Busca com Autocomplete */}
        <div className="relative mb-4">
          <div className="relative">
            <input
              type="text"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value)
                setMostrarSugestoes(true)
              }}
              onFocus={() => setMostrarSugestoes(true)}
              placeholder="Digite sua cidade ou estado..."
              className="w-full px-6 py-4 pr-12 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all text-lg"
              disabled={loading}
            />
            
            {/* Ícone de busca */}
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400"
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>

          {/* Dropdown de Sugestões */}
          {mostrarSugestoes && cidadesFiltradas.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-purple-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-in slide-in-from-top-2">
              {cidadesFiltradas.map((cidade, index) => (
                <button
                  key={`${cidade.nome}-${cidade.siglaEstado}-${index}`}
                  onClick={() => handleSelecionarCidade(cidade)}
                  className="w-full px-6 py-4 text-left hover:bg-purple-50 transition-all border-b border-purple-100 last:border-b-0 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-900 group-hover:text-purple-700">
                        {cidade.nome}
                      </span>
                      <span className="text-sm text-purple-600 ml-2">
                        {cidade.estado}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-purple-500 bg-purple-100 px-3 py-1 rounded-full">
                      {cidade.siglaEstado}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Mensagem quando não encontra */}
          {mostrarSugestoes && busca.trim() && cidadesFiltradas.length === 0 && !loading && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-purple-200 rounded-xl shadow-xl p-6 text-center">
              <svg className="w-12 h-12 mx-auto text-purple-300 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-purple-600">
                Nenhuma cidade encontrada
              </p>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <svg className="w-8 h-8 mx-auto text-purple-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-purple-600 text-sm mt-2">Carregando cidades...</p>
          </div>
        )}

        {/* Cidade Selecionada */}
        {cidadeSelecionada && estadoSelecionado && (
          <div className="mb-4 p-4 bg-purple-100 border border-purple-300 rounded-xl">
            <p className="text-sm text-purple-700 mb-1">Cidade selecionada:</p>
            <p className="font-bold text-purple-900 text-lg">
              {cidadeSelecionada} - {estadoSelecionado}
            </p>
          </div>
        )}

        {/* Botão Confirmar */}
        <button
          onClick={handleConfirmar}
          disabled={!cidadeSelecionada || !estadoSelecionado}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {cidadeSelecionada ? 'Confirmar Localização' : 'Selecione uma cidade'}
        </button>

        {/* Dica */}
        <p className="text-center text-xs text-purple-500 mt-3">
          💡 Digite o nome da cidade ou a sigla do estado (ex: SP, RJ, CWB)
        </p>
      </div>
    </div>
  )
}
