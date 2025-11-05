import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encontra Tudo - Conectando pessoas e negócios',
  description: 'Plataforma que conecta clientes a pessoas autônomas, produtos e serviços de forma fácil e rápida.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
