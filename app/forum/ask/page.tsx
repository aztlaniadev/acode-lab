import { Metadata } from 'next'
import { AskQuestionForm } from '@/components/forum/AskQuestionForm'

export const metadata: Metadata = {
  title: 'Fazer Pergunta - Fórum Acode Lab',
  description: 'Faça sua pergunta para a comunidade de desenvolvedores. Compartilhe conhecimento e ajude outros programadores.',
  keywords: 'fazer pergunta, fórum, programação, ajuda, desenvolvimento',
  openGraph: {
    title: 'Fazer Pergunta - Fórum Acode Lab',
    description: 'Faça sua pergunta para a comunidade de desenvolvedores.',
    type: 'website',
  },
}

export default function AskQuestionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header da página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Fazer uma Pergunta
            </h1>
            <p className="text-muted-foreground">
              Compartilhe sua dúvida com a comunidade de desenvolvedores
            </p>
          </div>
          
          {/* Formulário de pergunta */}
          <AskQuestionForm />
        </div>
      </div>
    </div>
  )
}
