"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Landing() {
  const [q, setQ] = useState('')
  const [local, setLocal] = useState('')
  const [resultados, setResultados] = useState<any>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => setLocal(`${pos.coords.latitude},${pos.coords.longitude}`))
    }
  }, [])

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!q || !local) return
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}&local=${encodeURIComponent(local)}`)
    const data = await res.json()
    setResultados(data)
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-bg to-bg-secondary text-white py-24 text-center">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(0,255,136,0.1)_0%,transparent_70%)] animate-pulse" />
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-5xl font-extrabold drop-shadow-[0_0_30px_rgba(0,255,136,0.5)]">🔍 Encontra Tudo</h1>
          <p className="text-xl text-text-secondary mt-4">Coloque sua loja no mapa digital. Venda mais sem e-commerce.</p>
          <form onSubmit={buscar} className="mt-8 max-w-2xl mx-auto grid grid-cols-[1fr_auto] gap-3">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar produtos ou serviços" className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none" />
            <button className="px-5 py-3 rounded-lg bg-primary text-bg shadow-glow">Buscar</button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/login" className="inline-block bg-primary text-bg font-bold px-8 py-4 rounded-full shadow-glow hover:shadow-glowStrong transition">Entrar</Link>
            <Link href="/registro" className="inline-block border border-primary text-primary px-8 py-4 rounded-full hover:bg-primary hover:text-bg transition">Começar Grátis</Link>
          </div>
        </div>
      </section>

      {resultados && (
        <section className="container mx-auto px-6 py-10">
          <div className="bg-white/5 border border-white/10 rounded-xl">
            <div className="p-4 text-sm text-text-secondary">{resultados.total_resultados} resultados</div>
            <div className="divide-y divide-white/10">
              {resultados.resultados.map((r: any) => (
                <Link key={r.produto.id} href={`/loja/${r.loja.slug}`} className="block p-4 hover:bg-white/[0.03]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.produto.nome || r.produto.nome_produto}</div>
                      <div className="text-sm text-text-secondary">{r.loja.nome || r.loja.nome_loja} • {r.loja.distancia}</div>
                    </div>
                    <div className="text-primary font-semibold">R$ {r.produto.preco_promocional || r.produto.preco}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
