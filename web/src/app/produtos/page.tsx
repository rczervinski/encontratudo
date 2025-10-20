'use client'

import { useEffect, useMemo, useState } from 'react'

type Produto = {
  id: string
  nome_produto: string
  descricao?: string | null
  preco: number
  preco_promocional?: number | null
  tipo?: 'produto' | 'servico'
  disponivel: boolean
  bloqueado: boolean
  imagens?: { id: string; url: string; ordem: number }[]
  categoria_id?: string | null
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export default function ProdutosPage() {
  const [itens, setItens] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [tipo, setTipo] = useState<'produto' | 'servico'>('produto')
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([])
  const [categoriaId, setCategoriaId] = useState<string>('')
  const [novaCategoria, setNovaCategoria] = useState('')
  const [selecionado, setSelecionado] = useState<Produto | null>(null)

  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : ''), [])

  const carregar = async () => {
    setErro('')
    try {
      const res = await fetch(`${API_BASE}/api/produtos`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Falha ao listar')
      const data = await res.json()
      setItens(data)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }
  const carregarCategorias = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categorias`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setCategorias(data)
    } catch {}
  }

  useEffect(() => {
    if (!token) {
      window.location.href = '/login'
      return
    }
    carregar()
    carregarCategorias()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const criar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    try {
  const body = { nome_produto: nome, preco: Number(preco), tipo, categoria_id: categoriaId || undefined }
      const res = await fetch(`${API_BASE}/api/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('Falha ao criar')
      setNome('')
      setPreco('')
      setCategoriaId('')
      await carregar()
    } catch (e: any) {
      setErro(e.message)
    }
  }

  const remover = async (id: string) => {
    if (!confirm('Remover este item?')) return
    await fetch(`${API_BASE}/api/produtos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    await carregar()
  }

  const toggleDisponivel = async (item: Produto) => {
    await fetch(`${API_BASE}/api/produtos/${item.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ disponivel: !item.disponivel })
    })
    await carregar()
  }

  const criarCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaCategoria) return
    const res = await fetch(`${API_BASE}/api/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome: novaCategoria })
    })
    if (res.ok) {
      setNovaCategoria('')
      await carregarCategorias()
    }
  }

  const onUploadImagens = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !selecionado) return
    const form = new FormData()
    Array.from(files).forEach(f => form.append('imagens', f))
    await fetch(`${API_BASE}/api/produtos/${selecionado.id}/imagens`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    })
    await carregar()
    // re-seleciona o item atualizado
    const novo = (await (await fetch(`${API_BASE}/api/produtos`, { headers: { Authorization: `Bearer ${token}` } })).json()) as Produto[]
    setItens(novo)
    setSelecionado(novo.find(p => p.id === selecionado.id) || null)
    e.target.value = ''
  }

  const removerImagem = async (imgId: string) => {
    if (!selecionado) return
    await fetch(`${API_BASE}/api/produtos/${selecionado.id}/imagens/${imgId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    await carregar()
    const novo = (await (await fetch(`${API_BASE}/api/produtos`, { headers: { Authorization: `Bearer ${token}` } })).json()) as Produto[]
    setItens(novo)
    setSelecionado(novo.find(p => p.id === selecionado.id) || null)
  }

  const moverImagem = async (index: number, direcao: -1 | 1) => {
    if (!selecionado || !selecionado.imagens) return
    const arr = [...selecionado.imagens].sort((a, b) => a.ordem - b.ordem)
    const novoIndex = index + direcao
    if (novoIndex < 0 || novoIndex >= arr.length) return
    // swap
    ;[arr[index].ordem, arr[novoIndex].ordem] = [arr[novoIndex].ordem, arr[index].ordem]
    const ordem = arr.map((it, i) => ({ id: it.id, ordem: i }))
    await fetch(`${API_BASE}/api/produtos/${selecionado.id}/imagens/ordenar`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ordem })
    })
    await carregar()
    const novo = (await (await fetch(`${API_BASE}/api/produtos`, { headers: { Authorization: `Bearer ${token}` } })).json()) as Produto[]
    setItens(novo)
    setSelecionado(novo.find(p => p.id === selecionado.id) || null)
  }

  return (
    <main className="min-h-screen bg-bg text-text-primary p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Produtos e Serviços</h1>
          <a href="/dashboard" className="text-sm underline text-primary">Voltar ao Dashboard</a>
        </div>

        <section className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <h2 className="font-medium mb-3">Cadastrar</h2>
          <form onSubmit={criar} className="grid sm:grid-cols-6 gap-3">
            <input value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Nome" className="px-3 py-2 rounded bg-white/5 border border-white/10 outline-none" required />
            <input value={preco} onChange={(e)=>setPreco(e.target.value)} placeholder="Preço" type="number" step="0.01" className="px-3 py-2 rounded bg-white/5 border border-white/10 outline-none" required />
            <select value={tipo} onChange={(e)=>setTipo(e.target.value as any)} className="px-3 py-2 rounded bg-white/5 border border-white/10">
              <option value="produto">Produto</option>
              <option value="servico">Serviço</option>
            </select>
            <select value={categoriaId} onChange={(e)=>setCategoriaId(e.target.value)} className="px-3 py-2 rounded bg-white/5 border border-white/10">
              <option value="">Sem categoria</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <button className="px-4 py-2 rounded bg-primary text-bg shadow-glow">Adicionar</button>
          </form>
          <form onSubmit={criarCategoria} className="mt-3 flex gap-2 items-center">
            <input value={novaCategoria} onChange={(e)=>setNovaCategoria(e.target.value)} placeholder="Nova categoria" className="px-3 py-2 rounded bg-white/5 border border-white/10 outline-none" />
            <button className="px-3 py-2 rounded bg-white/10 border border-white/10">Criar categoria</button>
          </form>
          {erro && <div className="text-red-400 text-sm mt-3">{erro}</div>}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h2 className="font-medium mb-3">Lista</h2>
          {loading ? (
            <div>Carregando…</div>
          ) : itens.length === 0 ? (
            <div className="text-text-secondary">Nenhum item cadastrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-secondary">
                    <th className="py-2">Nome</th>
                    <th>Tipo</th>
                    <th>Preço</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((p) => (
                    <tr key={p.id} className={`border-t border-white/10 ${selecionado?.id===p.id ? 'bg-white/[0.03]' : ''}`} onClick={()=>setSelecionado(p)}>
                      <td className="py-2">{p.nome_produto}</td>
                      <td className="capitalize">{p.tipo || 'produto'}</td>
                      <td>R$ {p.preco}</td>
                      <td>
                        <button onClick={()=>toggleDisponivel(p)} className={`px-2 py-1 rounded text-xs ${p.disponivel ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-text-secondary'}`}>
                          {p.disponivel ? 'Disponível' : 'Indisponível'}
                        </button>
                      </td>
                      <td className="text-right">
                        <button onClick={()=>remover(p.id)} className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selecionado && (
          <section className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Imagens de: {selecionado.nome_produto}</h2>
              <label className="px-3 py-2 rounded bg-white/10 border border-white/10 cursor-pointer">
                <input type="file" multiple className="hidden" onChange={onUploadImagens} />
                Enviar imagens
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {(selecionado.imagens || []).sort((a,b)=>a.ordem-b.ordem).map((img, idx) => (
                <div key={img.id} className="bg-black/30 rounded overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="img" className="w-full h-28 object-cover" />
                  <div className="flex items-center justify-between p-2 text-xs">
                    <div className="flex gap-1">
                      <button onClick={()=>moverImagem(idx,-1)} className="px-2 py-1 bg-white/10 rounded">↑</button>
                      <button onClick={()=>moverImagem(idx, 1)} className="px-2 py-1 bg-white/10 rounded">↓</button>
                    </div>
                    <button onClick={()=>removerImagem(img.id)} className="px-2 py-1 bg-red-500/20 text-red-400 rounded">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
