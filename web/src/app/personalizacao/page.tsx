'use client'

import { useEffect, useMemo, useState } from 'react'

type Personalizacao = {
  cor_primaria?: string
  cor_fundo?: string
  cor_header?: string
  cor_texto?: string
  fonte_titulo?: string
  fonte_corpo?: string
  produtos_por_linha?: number
  efeito_hover?: 'zoom' | 'lift' | 'glow'
  animacoes_ativadas?: boolean
  logo_url?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ''

export default function PersonalizacaoPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [loja, setLoja] = useState<any>(null)
  const [p, setP] = useState<Personalizacao>({
    cor_primaria: '#00ff88',
    cor_fundo: '#0b0b0b',
    cor_header: '#111111',
    cor_texto: '#e5e7eb',
    fonte_titulo: 'system-ui',
    fonte_corpo: 'system-ui',
    produtos_por_linha: 3,
    efeito_hover: 'zoom',
    animacoes_ativadas: true
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setLoja(data)
        if (data?.personalizacao) setP((prev) => ({ ...prev, ...data.personalizacao }))
      } catch (e: any) {
        setErro('Erro ao carregar dados da loja')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleChange = (key: keyof Personalizacao, value: any) => {
    setP((prev) => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    setSaving(true)
    setErro('')
    setOk('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/personalizacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(p)
      })
      if (!res.ok) throw new Error('Falha ao salvar')
      setOk('Personalização salva!')
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setSaving(false)
    }
  }

  const gridStyle = useMemo(() => ({ gridTemplateColumns: `repeat(${p.produtos_por_linha || 3}, minmax(0,1fr))` }), [p.produtos_por_linha])

  if (loading) return <main className="min-h-screen flex items-center justify-center text-text-primary">Carregando…</main>

  return (
    <main className="min-h-screen" style={{ background: p.cor_fundo, color: p.cor_texto }}>
      <header className="px-6 py-4" style={{ background: p.cor_header }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {p.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logo_url} alt={loja?.nome_loja} className="h-10" />
            ) : null}
            <h1 className="text-xl font-semibold" style={{ color: '#fff', fontFamily: p.fonte_titulo || 'inherit' }}>Personalização</h1>
          </div>
          <a href={`/loja/${loja?.slug || ''}`} className="text-sm underline" style={{ color: p.cor_primaria }}>Ver catálogo</a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 p-6">
        <section className="bg-white/5 border border-white/10 rounded-xl p-4 lg:col-span-1">
          <h2 className="font-medium mb-3">Aparência</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <label>Cor primária</label>
              <input type="color" value={p.cor_primaria} onChange={(e) => handleChange('cor_primaria', e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <label>Cor do fundo</label>
              <input type="color" value={p.cor_fundo} onChange={(e) => handleChange('cor_fundo', e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <label>Cor do header</label>
              <input type="color" value={p.cor_header} onChange={(e) => handleChange('cor_header', e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <label>Cor do texto</label>
              <input type="color" value={p.cor_texto} onChange={(e) => handleChange('cor_texto', e.target.value)} />
            </div>
            <div>
              <label className="block mb-1">Produtos por linha: {p.produtos_por_linha}</label>
              <input type="range" min={1} max={4} value={p.produtos_por_linha} onChange={(e) => handleChange('produtos_por_linha', Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block mb-1">Efeito hover</label>
              <select value={p.efeito_hover} onChange={(e) => handleChange('efeito_hover', e.target.value as any)} className="w-full bg-transparent border border-white/20 rounded p-2">
                <option value="zoom">Zoom</option>
                <option value="lift">Levantar</option>
                <option value="glow">Brilho</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input id="anim" type="checkbox" checked={p.animacoes_ativadas} onChange={(e) => handleChange('animacoes_ativadas', e.target.checked)} />
              <label htmlFor="anim">Ativar animações</label>
            </div>
            {erro && <div className="text-red-400 text-sm">{erro}</div>}
            {ok && <div className="text-green-400 text-sm">{ok}</div>}
            <button onClick={save} disabled={saving} className="w-full py-2 rounded-lg" style={{ background: p.cor_primaria, color: '#000' }}>{saving ? 'Salvando…' : 'Salvar'}</button>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="py-8 text-center" style={{ background: p.cor_header }}>
              <h3 className="text-2xl font-semibold" style={{ color: '#fff', fontFamily: p.fonte_titulo || 'inherit' }}>{loja?.nome_loja || 'Minha Loja'}</h3>
              {loja?.descricao ? <p className="opacity-80 mt-1" style={{ color: '#fff' }}>{loja.descricao}</p> : null}
            </div>
            <div className="p-4" style={{ background: p.cor_fundo, color: p.cor_texto }}>
              <div className="grid gap-4" style={gridStyle}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-white/5 border border-white/10 transition" style={{ transform: 'translateZ(0)' }}>
                    <div className="h-40 bg-black/30" />
                    <div className="p-3">
                      <div className="text-sm opacity-80">Produto exemplo {i}</div>
                      <div className="text-lg font-bold" style={{ color: p.cor_primaria }}>R$ 99,90</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
