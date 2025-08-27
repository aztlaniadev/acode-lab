import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fórum Q&A - Acode Lab',
  description: 'Faça perguntas, compartilhe conhecimento e conecte-se com outros desenvolvedores na comunidade Acode Lab.',
  keywords: 'fórum, perguntas, respostas, programação, desenvolvimento, comunidade',
  openGraph: {
    title: 'Fórum Q&A - Acode Lab',
    description: 'Faça perguntas, compartilhe conhecimento e conecte-se com outros desenvolvedores.',
    type: 'website',
  },
}

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
