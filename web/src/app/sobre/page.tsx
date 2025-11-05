import Link from 'next/link'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
              ENCONTRATUDO
            </h1>
          </Link>
          <Link 
            href="/"
            className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 mb-6">
            Conectando Pessoas
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            O <span className="font-bold text-purple-600">Encontratudo</span> é uma plataforma que une clientes a profissionais autônomos, 
            pequenos empreendedores e lojas físicas da sua região.
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-purple-900 mb-12">Como Funciona?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-purple-900 text-center mb-3">1. Busque</h4>
              <p className="text-gray-600 text-center">
                Digite o produto ou serviço que procura e sua cidade. Simples assim!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-purple-900 text-center mb-3">2. Encontre</h4>
              <p className="text-gray-600 text-center">
                Veja resultados próximos a você, com informações de contato e localização.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-purple-900 text-center mb-3">3. Conecte-se</h4>
              <p className="text-gray-600 text-center">
                Entre em contato direto pelo telefone ou WhatsApp e feche negócio!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Empresas */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Tem um negócio?</h3>
          <p className="text-xl mb-8 text-purple-100">
            Cadastre sua loja ou serviço gratuitamente e alcance mais clientes na sua região!
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-200 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-lg mb-1">Cadastro Grátis</h4>
                <p className="text-purple-100">Sem custos para começar</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-200 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-lg mb-1">Visibilidade Local</h4>
                <p className="text-purple-100">Alcance clientes da sua cidade</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-200 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-lg mb-1">Fácil de Usar</h4>
                <p className="text-purple-100">Interface simples e intuitiva</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-200 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-lg mb-1">Contato Direto</h4>
                <p className="text-purple-100">Clientes falam com você pelo WhatsApp</p>
              </div>
            </div>
          </div>

          <Link 
            href="/registro"
            className="inline-block bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1"
          >
            Cadastrar Minha Loja Agora
          </Link>
        </div>
      </section>

      {/* Quem Pode Se Cadastrar */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-purple-900 mb-12">Quem Pode Se Cadastrar?</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-purple-900">Lojas Físicas</h4>
              </div>
              <p className="text-gray-600">
                Comércio local, restaurantes, academias, salões de beleza, oficinas, e muito mais.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-purple-900">Profissionais Autônomos</h4>
              </div>
              <p className="text-gray-600">
                Eletricistas, encanadores, manicures, jardineiros, fotógrafos, e outros prestadores de serviço.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-purple-900">Vendedores de Produtos</h4>
              </div>
              <p className="text-gray-600">
                Artesanato, produtos personalizados, alimentos caseiros, e outros itens à venda.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-purple-900">Prestadores de Serviços</h4>
              </div>
              <p className="text-gray-600">
                Consultoria, aulas particulares, serviços de tecnologia, e outras soluções profissionais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-6 bg-purple-50">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-purple-900 mb-4">Pronto para começar?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Faça parte da maior plataforma de conexão local da sua região
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-full font-bold hover:bg-purple-50 transition-all shadow-lg"
            >
              Buscar Produtos/Serviços
            </Link>
            <Link 
              href="/registro"
              className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg"
            >
              Cadastrar Meu Negócio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p className="mb-2">© 2025 Encontratudo - Conectando pessoas e negócios</p>
          <p className="text-sm text-gray-500">Feito com 💜 para fortalecer o comércio local</p>
        </div>
      </footer>
    </div>
  )
}
