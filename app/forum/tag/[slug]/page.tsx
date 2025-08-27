"use client"

import { useState, useMemo } from 'react'
import { QuestionCard } from '@/components/forum/QuestionCard'
import { Question, UserLevel, QuestionStatus } from '@/types/forum'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Tag,
  ArrowLeft,
  Filter,
  TrendingUp,
  MessageSquare,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { tags } from './metadata'

// Dados mockados para categorias
const categories = {
  'web-development': {
    id: 'web',
    name: 'Web Development',
    description: 'Desenvolvimento web com React, Next.js, Vue, Angular e outras tecnologias modernas',
    icon: '🌐',
    color: '#3B82F6',
    questionsCount: 450,
    slug: 'web-development'
  }
}

interface TagPageProps {
  params: {
    slug: string
  }
}

// Dados mockados para perguntas da tag
const getTagQuestions = (tagSlug: string): Question[] => {
  const baseQuestions: Question[] = [
    {
      id: '1',
      title: 'Como implementar autenticação JWT em Next.js 14?',
      content: 'Estou desenvolvendo uma aplicação Next.js 14 e preciso implementar autenticação JWT...',
      slug: 'como-implementar-autenticacao-jwt-em-nextjs-14',
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
      category: categories['web-development'],
      tags: [tags['react'], tags['nextjs']],
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
      category: categories['web-development'],
      tags: [tags['react'], tags['typescript']],
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

export default function TagPage({ params }: TagPageProps) {
  const tag = tags[params.slug as keyof typeof tags]
  const allQuestions = getTagQuestions(params.slug)
  const [visibleQuestions, setVisibleQuestions] = useState(10)
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'pending'>('all')
  
  // Filtrar perguntas por status
  const filteredQuestions = useMemo(() => {
    if (statusFilter === 'all') return allQuestions
    if (statusFilter === 'solved') return allQuestions.filter(q => q.isSolved)
    if (statusFilter === 'pending') return allQuestions.filter(q => !q.isSolved)
    return allQuestions
  }, [allQuestions, statusFilter])
  
  // Perguntas visíveis com lazy loading
  const visibleQuestionsList = filteredQuestions.slice(0, visibleQuestions)
  
  const loadMoreQuestions = () => {
    setVisibleQuestions(prev => Math.min(prev + 10, filteredQuestions.length))
  }

  if (!tag) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tag não encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              A tag solicitada não foi encontrada.
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header da tag */}
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
                  style={{ backgroundColor: tag.color }}
                >
                  <Tag className="w-8 h-8" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      #{tag.name}
                    </h1>
                    <Badge 
                      variant="outline" 
                      className="text-lg px-3 py-1"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      {tag.questionsCount} perguntas
                    </Badge>
                    
                    {/* Indicadores de status da tag */}
                    {tag.isPopular && (
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Popular
                      </Badge>
                    )}
                    {tag.isNew && (
                      <Badge variant="secondary" className="gap-1">
                        <span className="text-green-500">🆕</span>
                        Nova
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-lg mb-4">
                    {tag.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{tag.questionsCount} perguntas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Tag popular</span>
                    </div>
                  </div>
                  
                  {/* Filtros de status */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                    >
                      Todas ({allQuestions.length})
                    </Button>
                    <Button
                      variant={statusFilter === 'solved' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('solved')}
                    >
                      Resolvidas ({allQuestions.filter(q => q.isSolved).length})
                    </Button>
                    <Button
                      variant={statusFilter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('pending')}
                    >
                      Pendentes ({allQuestions.filter(q => !q.isSolved).length})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas e filtros */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Estatísticas da Tag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{tag.questionsCount}</div>
                    <div className="text-sm text-muted-foreground">Total de perguntas</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {allQuestions.filter(q => q.isSolved).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Resolvidas</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {allQuestions.filter(q => !q.isSolved).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pendentes</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {tag.relatedTags.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Tags relacionadas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags relacionadas */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags Relacionadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tag.relatedTags.map((relatedTagSlug) => {
                    const relatedTag = tags[relatedTagSlug as keyof typeof tags]
                    if (!relatedTag) return null
                    
                    return (
                      <Link key={relatedTag.slug} href={`/forum/tag/${relatedTag.slug}`}>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          style={{ borderColor: relatedTag.color }}
                        >
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: relatedTag.color }}
                          />
                          {relatedTag.name}
                          <span className="ml-2 text-xs opacity-70">
                            {relatedTag.questionsCount}
                          </span>
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de perguntas */}
          <div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Perguntas com #{tag.name}
                </h2>
                <Link href="/forum/ask">
                  <Button className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Fazer Pergunta
                  </Button>
                </Link>
              </div>

              {visibleQuestionsList.length > 0 ? (
                <div className="space-y-4">
                  {visibleQuestionsList.map((question, index) => (
                    <div key={question.id}>
                      <QuestionCard question={question} />
                    </div>
                  ))}
                  
                  {/* Botão para carregar mais perguntas */}
                  {visibleQuestions < filteredQuestions.length && (
                    <div className="text-center pt-6">
                      <Button 
                        onClick={loadMoreQuestions}
                        variant="outline"
                        className="gap-2"
                      >
                        Carregar Mais Perguntas ({filteredQuestions.length - visibleQuestions} restantes)
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhuma pergunta com #{tag.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Seja o primeiro a fazer uma pergunta usando esta tag!
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
