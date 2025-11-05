'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Personalizacao {
  // Branding
  logo_url?: string
  slogan?: string
  nome_header?: string
  
  // Cores
  preset_cores?: string
  cor_primaria: string
  cor_secundaria: string
  cor_fundo: string
  cor_header: string
  cor_texto: string
  
  // Tipografia
  fonte_titulo: string
  fonte_corpo: string
  
  // Layout
  layout_grade: string
  produtos_por_linha: number
  
  // Efeitos
  animacoes_ativadas: boolean
  efeito_hover: string
  
  // Categorias/Seções
  mostrar_categorias: boolean
  estilo_categorias: string
}

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

export default function TabPersonalizacao({ loja }: any) {
  const [p, setP] = useState<Personalizacao>({
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
        setP(prev => ({ ...prev, ...data }))
      }
    } catch (e) {
      console.error('Erro ao carregar:', e)
    }
  }

  const aplicarPreset = (preset: typeof PRESETS_CORES[0]) => {
    setP(prev => ({
      ...prev,
      preset_cores: preset.id,
      ...preset.cores
    }))
  }

  const handleChange = (key: keyof Personalizacao, value: any) => {
    setP(prev => ({ ...prev, [key]: value }))
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
        setP(prev => ({ ...prev, logo_url: data.url }))
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
                value={p.nome_header}
                onChange={(e) => handleChange('nome_header', e.target.value)}
                placeholder="Nome da sua loja"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              />
            </div>

            {/* Slogan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slogan/Descrição</label>
              <textarea
                value={p.slogan}
                onChange={(e) => handleChange('slogan', e.target.value)}
                placeholder="Ex: Os melhores produtos da região"
                rows={3}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none resize-none transition-all"
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
                  />
                  <input
                    type="text"
                    value={p.cor_primaria}
                    onChange={(e) => handleChange('cor_primaria', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono"
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
                  />
                  <input
                    type="text"
                    value={p.cor_secundaria}
                    onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono"
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
                  />
                  <input
                    type="text"
                    value={p.cor_fundo}
                    onChange={(e) => handleChange('cor_fundo', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono"
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
                  />
                  <input
                    type="text"
                    value={p.cor_header}
                    onChange={(e) => handleChange('cor_header', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono"
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
                  />
                  <input
                    type="text"
                    value={p.cor_texto}
                    onChange={(e) => handleChange('cor_texto', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none text-sm font-mono"
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
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
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
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
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
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Efeito Hover</label>
              <select
                value={p.efeito_hover}
                onChange={(e) => handleChange('efeito_hover', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              >
                <option value="zoom">Zoom</option>
                <option value="lift">Levantar</option>
                <option value="glow">Brilho</option>
                <option value="none">Nenhum</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="animacoes"
                checked={p.animacoes_ativadas}
                onChange={(e) => handleChange('animacoes_ativadas', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="animacoes" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Ativar Animações
              </label>
            </div>
          </div>
        </div>

        {/* Categorias/Seções */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categorias e Seções
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mostrar-categorias"
                checked={p.mostrar_categorias}
                onChange={(e) => handleChange('mostrar_categorias', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="mostrar-categorias" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Mostrar Menu de Categorias
              </label>
            </div>

            {p.mostrar_categorias && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estilo das Categorias</label>
                <select
                  value={p.estilo_categorias}
                  onChange={(e) => handleChange('estilo_categorias', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                >
                  <option value="cards">Cards com Ícones</option>
                  <option value="pills">Pills/Tags</option>
                  <option value="sidebar">Sidebar Lateral</option>
                  <option value="dropdown">Menu Dropdown</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Pré-visualização
          </h3>

          <div className="border-2 border-purple-200 rounded-xl overflow-hidden">
            {/* Header Preview */}
            <div className="py-6 px-6 flex items-center justify-between" style={{ background: p.cor_header }}>
              {p.logo_url && (
                <img src={p.logo_url} alt="Logo" className="h-12 object-contain" />
              )}
              <div className="flex-1 ml-4">
                <h3
                  className="text-xl font-bold"
                  style={{
                    color: p.cor_texto,
                    fontFamily: p.fonte_titulo
                  }}
                >
                  {p.nome_header || 'Nome da Loja'}
                </h3>
                {p.slogan && (
                  <p className="text-sm opacity-80" style={{ color: p.cor_texto, fontFamily: p.fonte_corpo }}>
                    {p.slogan}
                  </p>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6" style={{ background: p.cor_fundo }}>
              <div
                className={`grid gap-4`}
                style={{ gridTemplateColumns: `repeat(${p.produtos_por_linha}, 1fr)` }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden shadow-lg transition-transform"
                    style={{
                      transform: p.efeito_hover === 'zoom' ? 'scale(1)' : 'translateY(0)',
                      boxShadow: p.efeito_hover === 'glow' ? `0 0 20px ${p.cor_primaria}40` : undefined
                    }}
                  >
                    <div className="h-32" style={{ background: `linear-gradient(135deg, ${p.cor_primaria}, ${p.cor_secundaria})` }}></div>
                    <div className="p-3 bg-white">
                      <h4 className="font-bold text-sm" style={{ color: p.cor_texto, fontFamily: p.fonte_titulo }}>
                        Produto {i}
                      </h4>
                      <p className="text-xs text-gray-500" style={{ fontFamily: p.fonte_corpo }}>
                        Descrição
                      </p>
                      <button
                        className="mt-2 w-full py-2 rounded-lg font-semibold text-sm text-white"
                        style={{ background: p.cor_primaria }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
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
            onClick={carregarPersonalizacao}
            className="px-6 py-3 border-2 border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            Descartar Alterações
          </button>
          <button
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
