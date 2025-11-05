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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || data.error || 'Erro ao fazer login')

      localStorage.setItem('token', data.token)
      localStorage.setItem('loja', JSON.stringify(data.loja))
      router.push('/painel')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="w-full max-w-md bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">ENCONTRATUDO</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">Acesse sua conta</p>
        </div>
        {error && <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 rounded-lg mb-4 font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">E-mail ou Telefone</label>
            <input 
              value={login} 
              onChange={(e)=>setLogin(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-900 transition-all" 
              placeholder="Digite seu e-mail ou telefone"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-semibold mb-1">Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e)=>setSenha(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-900 transition-all" 
              placeholder="Digite sua senha"
            />
          </div>
          <button 
            disabled={loading} 
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Não tem conta? <a href="/registro" className="text-purple-600 font-bold hover:text-purple-800">Cadastre-se gratuitamente</a>
        </div>
      </div>
    </main>
  )
}
