'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [loja, setLoja] = useState<any>(null)

  useEffect(()=>{
    const l = localStorage.getItem('loja')
    if (l) setLoja(JSON.parse(l))
  },[])

  const copiar = async () => {
    if (!loja?.slug) return
    const link = `${window.location.origin}/loja/${loja.slug}`
    await navigator.clipboard.writeText(link)
    alert('Link copiado: ' + link)
  }

  return (
    <main className="min-h-screen bg-bg text-text-primary p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex gap-2">
            <a href="/produtos" className="px-4 py-2 rounded bg-white/10 border border-white/20">📦 Produtos</a>
            <a href="/personalizacao" className="px-4 py-2 rounded bg-white/10 border border-white/20">🎨 Personalização</a>
            <button onClick={copiar} className="px-4 py-2 rounded bg-primary text-bg shadow-glow">📋 Copiar Link do Catálogo</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-bg-card border border-white/10">Produtos</div>
          <div className="p-4 rounded-xl bg-bg-card border border-white/10">Serviços</div>
        </div>
      </div>
    </main>
  )
}
