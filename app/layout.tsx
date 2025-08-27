import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/navigation/Header'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/lib/theme-engine'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Acode Lab - Plataforma de Desenvolvimento Colaborativo',
  description: 'Conecte-se com desenvolvedores, compartilhe conhecimento e encontre oportunidades de freelancer na maior comunidade de tecnologia do Brasil.',
  keywords: 'desenvolvimento, programação, fórum, rede social, freelancer, tecnologia, código',
  authors: [{ name: 'Acode Lab Team' }],
  creator: 'Acode Lab',
  publisher: 'Acode Lab',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://acodelab.com'),
  openGraph: {
    title: 'Acode Lab - Plataforma de Desenvolvimento Colaborativo',
    description: 'Conecte-se com desenvolvedores, compartilhe conhecimento e encontre oportunidades de freelancer.',
    url: 'https://acodelab.com',
    siteName: 'Acode Lab',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Acode Lab - Plataforma de Desenvolvimento Colaborativo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acode Lab - Plataforma de Desenvolvimento Colaborativo',
    description: 'Conecte-se com desenvolvedores, compartilhe conhecimento e encontre oportunidades de freelancer.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider>
            <Header />
            <div className="min-h-screen bg-background pt-16">
              {children}
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

