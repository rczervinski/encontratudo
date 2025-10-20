import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encontra Tudo',
  description: 'Conecte sua loja com clientes locais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  )
}
