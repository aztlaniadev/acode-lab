import React from 'react'
import { Metadata } from 'next'
// Animações removidas
import { QuestionCard } from '@/components/forum/QuestionCard'
import { Question, UserLevel, QuestionStatus } from '@/types/forum'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code, 
  Smartphone, 
  Brain, 
  Palette, 
  Server, 
  Database,
  ArrowLeft,
  Filter,
  TrendingUp,
  Clock,
  MessageSquare,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Função para mapear nomes de ícones para componentes
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Code,
    Smartphone,
    Brain,
    Palette,
    Server,
    Database
  }
  return iconMap[iconName] || Code
}

// Dados mockados para categorias
const categories = {
  'web-development': {
    id: 'web',
    name: 'Web Development',
    description: 'Desenvolvimento web com React, Next.js, Vue, Angular e outras tecnologias modernas',
    icon: 'Code',
    color: '#3B82F6',
    questionsCount: 450,
    slug: 'web-development'
  },
  'mobile-development': {
    id: 'mobile',
    name: 'Mobile Development',
    description: 'Desenvolvimento mobile com React Native, Flutter, iOS, Android e outras plataformas',
    icon: 'Smartphone',
    color: '#10B981',
    questionsCount: 320,
    slug: 'mobile-development'
  },
  'ai-ml': {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Inteligência Artificial, Machine Learning, Deep Learning e tecnologias relacionadas',
    icon: 'Brain',
    color: '#8B5CF6',
    questionsCount: 189,
    slug: 'ai-ml'
  },
  'design': {
    id: 'design',
    name: 'UI/UX Design',
    description: 'Design de interfaces, experiência do usuário e ferramentas de design',
    icon: 'Palette',
    color: '#F59E0B',
    questionsCount: 156,
    slug: 'design'
  },
  'backend': {
    id: 'backend',
    name: 'Backend Development',
    description: 'Desenvolvimento de APIs, servidores e lógica de negócio',
    icon: 'Server',
    color: '#EF4444',
    questionsCount: 320,
    slug: 'backend'
  },
  'database': {
    id: 'database',
    name: 'Database',
    description: 'Bancos de dados relacionais, NoSQL e tecnologias de armazenamento',
    icon: 'Database',
    color: '#06B6D4',
    questionsCount: 234,
    slug: 'database'
  }
}

// Dados mockados para perguntas da categoria
const getCategoryQuestions = (categorySlug: string): Question[] => {
  const baseQuestions: Question[] = [
    {
      id: '1',
      title: 'Como implementar autenticação JWT em Next.js 14?',
      content: 'Estou desenvolvendo uma aplicação Next.js 14 e preciso implementar autenticação JWT...',
      slug: 'como-implementar-autenticacao-jwt-nextjs-14',
      status: QuestionStatus.OPEN,
      isFeatured: false,
      author: {
        id: 'user-1',
        username: 'joao_silva',
        name: 'João Silva',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
        reputation: 1250,
        level: UserLevel.INTERMEDIATE
      },
      category: categories[categorySlug as keyof typeof categories] || categories['web-development'],
      tags: [
        { id: 'tag-1', name: 'Next.js', description: 'Framework React', color: '#000000', questionsCount: 89, slug: 'nextjs', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false },
        { id: 'tag-2', name: 'JWT', description: 'JSON Web Tokens', color: '#F59E0B', questionsCount: 156, slug: 'jwt', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false }
      ],
      votes: [
        { id: 'vote-1', userId: 'user-2', questionId: '1', value: 1, createdAt: new Date() }
      ],
      viewCount: 89,
      isSolved: false,
      createdAt: new Date('2024-08-20T10:30:00'),
      updatedAt: new Date('2024-08-20T10:30:00')
    },
    {
      id: '2',
      title: 'Melhores práticas para otimização de performance em React',
      content: 'Quais são as melhores práticas para otimizar a performance de uma aplicação React...',
      slug: 'melhores-praticas-otimizacao-performance-react',
      status: QuestionStatus.OPEN,
      isFeatured: true,
      author: {
        id: 'user-2',
        username: 'maria_santos',
        name: 'Maria Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        reputation: 2100,
        level: UserLevel.EXPERT
      },
      category: categories[categorySlug as keyof typeof categories] || categories['web-development'],
      tags: [
        { id: 'tag-3', name: 'React', description: 'Biblioteca JavaScript', color: '#61DAFB', questionsCount: 567, slug: 'react', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false },
        { id: 'tag-4', name: 'Estado', description: 'Gerenciamento de estado', color: '#8B5CF6', questionsCount: 89, slug: 'estado', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false }
      ],
      votes: [
        { id: 'vote-2', userId: 'user-1', questionId: '2', value: 1, createdAt: new Date() }
      ],
      viewCount: 156,
      isSolved: true,
      createdAt: new Date('2024-08-19T14:15:00'),
      updatedAt: new Date('2024-08-19T14:15:00')
    }
  ]

  return baseQuestions
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = categories[params.slug as keyof typeof categories]
  
  if (!category) {
    return {
      title: 'Categoria não encontrada - Fórum Acode Lab',
      description: 'A categoria solicitada não foi encontrada.'
    }
  }

  return {
    title: `${category.name} - Fórum Acode Lab`,
    description: category.description,
    keywords: `${category.name.toLowerCase()}, programação, desenvolvimento, fórum, acode lab`,
    openGraph: {
      title: `${category.name} - Fórum Acode Lab`,
      description: category.description,
      type: 'website',
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories[params.slug as keyof typeof categories]
  const questions = getCategoryQuestions(params.slug)

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Categoria não encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              A categoria solicitada não foi encontrada.
            </p>
            <Link href="/forum">
              <Button>
                Voltar ao Fórum
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const Icon = category.icon

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header da categoria */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/forum">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Fórum
                </Button>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: category.color }}
                >
                  {React.createElement(getIconComponent(category.icon), { className: "w-8 h-8" })}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {category.name}
                  </h1>
                  <p className="text-muted-foreground text-lg mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{category.questionsCount} perguntas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Categoria ativa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e estatísticas */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros e Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Perguntas nesta categoria</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {questions.filter(q => q.isSolved).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Perguntas resolvidas</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {questions.filter(q => !q.isSolved).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Perguntas pendentes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de perguntas */}
          <div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Perguntas em {category.name}
                </h2>
                <Link href="/forum/ask">
                  <Button className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Fazer Pergunta
                  </Button>
                </Link>
              </div>

              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="hover:shadow-lg transition-all duration-200"
                    >
                      <QuestionCard question={question} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhuma pergunta nesta categoria
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Seja o primeiro a fazer uma pergunta em {category.name}!
                    </p>
                    <Link href="/forum/ask">
                      <Button>
                        Fazer Primeira Pergunta
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
