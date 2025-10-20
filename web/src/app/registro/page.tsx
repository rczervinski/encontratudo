'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [tipo, setTipo] = useState<'loja'|'autonomo'|''>('')
  const [nome, setNome] = useState('')
  const [contactType, setContactType] = useState<'email'|'telefone'|''>('')
  const [contato, setContato] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const next = () => setStep(s => Math.min(5, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))

  const buscaCep = async () => {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setLogradouro(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.localidade || '')
        setEstado(data.uf || '')
      }
    } catch {}
  }

  const finalizar = async () => {
    setLoading(true)
    setError('')
    try {
      const body: any = {
        senha,
        nome,
        tipo_estabelecimento: tipo,
        cidade,
        estado: estado.toUpperCase(),
      }
      if (contactType === 'email') body.email = contato
      if (contactType === 'telefone') body.telefone = contato
      if (tipo === 'loja') {
        body.logradouro = logradouro
        body.numero = numero
        body.bairro = bairro
        body.cep = cep
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || data.error || 'Erro ao cadastrar')
      localStorage.setItem('token', data.token)
      localStorage.setItem('loja', JSON.stringify(data.loja))
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-xl bg-bg-card border border-primary/30 rounded-2xl p-6 shadow-glow max-h-[90vh] overflow-y-auto">
        <div className="sticky -top-6 h-1 bg-white/10 rounded mb-6">
          <div className="h-full bg-primary" style={{width: `${(step/5)*100}%`}} />
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded mb-4">{error}</div>}

        {step === 1 && (
          <section>
            <h2 className="text-primary text-2xl font-semibold mb-1">Bem-vindo! 👋</h2>
            <p className="text-text-secondary mb-4">Você é autônomo ou tem uma loja física?</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setTipo('loja')} className={`p-6 rounded-xl border ${tipo==='loja'?'border-primary bg-primary/10 shadow-glow':'border-white/10 bg-white/5'}`}>🏪 Loja Física</button>
              <button onClick={()=>setTipo('autonomo')} className={`p-6 rounded-xl border ${tipo==='autonomo'?'border-primary bg-primary/10 shadow-glow':'border-white/10 bg-white/5'}`}>🛠️ Autônomo</button>
            </div>
            <div className="mt-4 flex gap-2"><button disabled={!tipo} onClick={next} className="btn btn-primary bg-primary text-bg rounded px-4 py-2 shadow-glow disabled:opacity-30">Continuar</button></div>
            <div className="text-center text-sm text-text-secondary mt-4">Já tem uma conta? <Link href="/login" className="text-primary">Fazer Login</Link></div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-primary text-2xl font-semibold mb-1">Legal! 😊</h2>
            <p className="text-text-secondary mb-4">Qual o nome da sua {tipo==='autonomo'? 'atividade' : 'loja'}?</p>
            <input value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Ex: Padaria do João" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
            <div className="mt-4 flex gap-2"><button onClick={back} className="px-4 py-2 rounded bg-white/10">Voltar</button><button disabled={nome.length<3} onClick={next} className="px-4 py-2 rounded bg-primary text-bg shadow-glow disabled:opacity-30">Continuar</button></div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-primary text-2xl font-semibold mb-1">Ótimo! 📱</h2>
            <p className="text-text-secondary mb-4">Como você prefere fazer login?</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={()=>{setContactType('telefone'); setContato('')}} className={`p-6 rounded-xl border ${contactType==='telefone'?'border-primary bg-primary/10 shadow-glow':'border-white/10 bg-white/5'}`}>📱 Telefone</button>
              <button onClick={()=>{setContactType('email'); setContato('')}} className={`p-6 rounded-xl border ${contactType==='email'?'border-primary bg-primary/10 shadow-glow':'border-white/10 bg-white/5'}`}>📧 E-mail</button>
            </div>
            <label className="block text-sm text-text-primary mb-1">{contactType==='email'?'E-mail':'Telefone'}</label>
            <input value={contato} onChange={(e)=>setContato(e.target.value)} placeholder={contactType==='email'?'seu@email.com':'(00) 00000-0000'} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
            <div className="mt-4 flex gap-2"><button onClick={back} className="px-4 py-2 rounded bg-white/10">Voltar</button><button disabled={!contactType || contato.length<5} onClick={next} className="px-4 py-2 rounded bg-primary text-bg shadow-glow disabled:opacity-30">Continuar</button></div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="text-primary text-2xl font-semibold mb-1">Quase lá! 📍</h2>
            <p className="text-text-secondary mb-4">Onde você está localizado?</p>
            {tipo==='loja' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-text-primary mb-1">CEP</label>
                  <input value={cep} onChange={(e)=>setCep(e.target.value)} onBlur={buscaCep} placeholder="00000-000" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm text-text-primary mb-1">Endereço</label>
                  <input value={logradouro} onChange={(e)=>setLogradouro(e.target.value)} placeholder="Rua, Avenida..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-text-primary mb-1">Número</label>
                    <input value={numero} onChange={(e)=>setNumero(e.target.value)} placeholder="123" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-primary mb-1">Bairro</label>
                    <input value={bairro} onChange={(e)=>setBairro(e.target.value)} placeholder="Centro" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-text-primary mb-1">Cidade</label>
                    <input value={cidade} onChange={(e)=>setCidade(e.target.value)} placeholder="São Paulo" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-primary mb-1">Estado</label>
                    <input value={estado} onChange={(e)=>setEstado(e.target.value)} placeholder="SP" maxLength={2} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-text-primary mb-1">Cidade</label>
                  <input value={cidade} onChange={(e)=>setCidade(e.target.value)} placeholder="São Paulo" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm text-text-primary mb-1">Estado</label>
                  <input value={estado} onChange={(e)=>setEstado(e.target.value)} placeholder="SP" maxLength={2} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm text-text-primary mb-1">Bairro (opcional)</label>
                  <input value={bairro} onChange={(e)=>setBairro(e.target.value)} placeholder="Centro" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2"><button onClick={back} className="px-4 py-2 rounded bg-white/10">Voltar</button><button disabled={tipo==='loja' ? !(logradouro && numero && cidade && estado) : !(cidade && estado)} onClick={next} className="px-4 py-2 rounded bg-primary text-bg shadow-glow disabled:opacity-30">Continuar</button></div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="text-primary text-2xl font-semibold mb-1">Última etapa! 🔐</h2>
            <p className="text-text-secondary mb-4">Escolha uma senha segura</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-text-primary mb-1">Senha</label>
                <input type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
              <div>
                <label className="block text-sm text-text-primary mb-1">Confirmar</label>
                <input type="password" value={confirmar} onChange={(e)=>setConfirmar(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary outline-none text-white" />
              </div>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={back} className="px-4 py-2 rounded bg-white/10">Voltar</button><button disabled={senha.length<6 || senha!==confirmar} onClick={finalizar} className="px-4 py-2 rounded bg-primary text-bg shadow-glow disabled:opacity-30">Criar Conta</button></div>
          </section>
        )}
      </div>
    </main>
  )
}
