'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || data.error || 'Erro ao fazer login')

      localStorage.setItem('token', data.token)
      localStorage.setItem('loja', JSON.stringify(data.loja))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md bg-bg-card border border-primary/30 rounded-2xl p-8 shadow-glow">
        <div className="text-center mb-6">
          <h1 className="text-primary text-3xl font-bold drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]">🔍 EncontraTudo</h1>
          <p className="text-text-secondary text-sm mt-1">Acesse sua conta</p>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-primary mb-1">E-mail ou Telefone</label>
            <input value={login} onChange={(e)=>setLogin(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">Senha</label>
            <input type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
          </div>
          <button disabled={loading} className="w-full py-2 bg-primary text-bg rounded-lg shadow-glow hover:shadow-glowStrong transition">{loading ? 'Entrando…' : 'Entrar'}</button>
        </form>
        <div className="text-center text-sm text-text-secondary mt-3">Não tem conta? <a href="/registro" className="text-primary">Cadastre-se gratuitamente</a></div>
      </div>
    </main>
  )
}
