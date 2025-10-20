'use client'

import { useEffect, useState } from 'react'

export default function LojaPage({ params }: { params: { slug: string } }) {
  const [loja, setLoja] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/lojas/${params.slug}`)
        if (!res.ok) throw new Error('Loja não encontrada')
        const data = await res.json()
        setLoja(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [API_BASE, params.slug])

  if (loading) return <main className="min-h-screen flex items-center justify-center">Carregando…</main>
  if (error || !loja) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">{error || 'Loja não encontrada'}</h1>
        <p className="text-sm opacity-80">Verifique o link e tente novamente.</p>
      </div>
    </main>
  )

  const p = loja.personalizacao || {}
  const gridCols = p.produtos_por_linha || 3

  return (
    <main className="min-h-screen" style={{ background: p.cor_fundo || '#0b0b0b', color: p.cor_texto || '#e5e7eb' }}>
      <header className="py-10 text-center" style={{ background: p.cor_header || '#111', color: '#fff' }}>
        {p.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.logo_url} alt={loja.nome_loja} className="mx-auto h-16 mb-3" />
        ) : null}
        <h1 className="text-3xl font-bold" style={{ fontFamily: p.fonte_titulo || 'inherit' }}>{loja.nome_loja}</h1>
        {loja.descricao ? <p className="opacity-80 mt-1" style={{ fontFamily: p.fonte_corpo || 'inherit' }}>{loja.descricao}</p> : null}
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div>📍 {loja.endereco}{loja.cidade ? `, ${loja.cidade}` : ''}{loja.estado ? ` - ${loja.estado}` : ''}</div>
            <div>📞 {loja.telefone_loja}{loja.whatsapp ? ` • WhatsApp: ${loja.whatsapp}` : ''}</div>
            <div>🕐 {loja.horario_funcionamento || 'Consultar horário'}</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Catálogo</h2>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
          {loja.produtos.map((prod: any) => (
            <div key={prod.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition transform hover:-translate-y-1" style={{ boxShadow: p.animacoes_ativadas === false ? undefined : '0 0 20px rgba(0,0,0,0.15)' }}>
              {prod.imagens?.[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={prod.imagens[0].url} alt={prod.nome_produto} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-black/30 flex items-center justify-center text-text-secondary">Sem imagem</div>
              )}
              <div className="p-4">
                {prod.tipo === 'servico' && (
                  <span className="inline-block text-xs px-2 py-1 rounded-full mb-2" style={{ background: p.cor_primaria || '#00ff88', color: '#000' }}>Serviço</span>
                )}
                <div className="font-semibold">{prod.nome_produto}</div>
                {prod.descricao ? (
                  <div className="text-sm text-text-secondary mt-1">{prod.descricao.slice(0, 100)}{prod.descricao.length > 100 ? '…' : ''}</div>
                ) : null}
                <div className="mt-3 text-lg font-bold" style={{ color: p.cor_primaria || '#00ff88' }}>
                  R$ {prod.preco_promocional || prod.preco}
                </div>
                {prod.preco_promocional ? (
                  <div className="text-xs line-through text-text-secondary">De R$ {prod.preco}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
