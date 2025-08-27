import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pergunta - Fórum Acode Lab',
  description: 'Visualize perguntas e respostas da comunidade de desenvolvedores.',
  keywords: 'pergunta, resposta, fórum, programação, desenvolvimento',
  openGraph: {
    title: 'Pergunta - Fórum Acode Lab',
    description: 'Visualize perguntas e respostas da comunidade.',
    type: 'website',
  },
}

export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
