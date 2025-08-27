'use client'

import { useState, useEffect } from 'react'
// Animações removidas
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Eye, 
  Clock, 
  CheckCircle, 
  Tag, 
  Share2,
  Bookmark,
  Flag,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Question, UserLevel, QuestionStatus } from '@/types/forum'

interface QuestionDetailProps {
  questionId: string
}

// Dados mockados para demonstração
const mockQuestion: Question = {
  id: '1',
  title: 'Como implementar autenticação JWT em Next.js 14?',
  slug: 'como-implementar-autenticacao-jwt-nextjs-14',
  status: QuestionStatus.ANSWERED,
  isFeatured: false,
  content: `Estou desenvolvendo uma aplicação Next.js 14 e preciso implementar autenticação JWT. 

**Contexto:**
- Aplicação Next.js 14 com App Router
- Usando TypeScript
- Preciso de login/registro de usuários
- Proteção de rotas

**O que já tentei:**
\`\`\`typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}
\`\`\`

**Problema:**
O middleware não está funcionando corretamente e as rotas protegidas não estão sendo redirecionadas.

**Pergunta:**
Alguém pode me ajudar com um exemplo completo de implementação JWT em Next.js 14? Preciso de:
1. Estrutura de pastas recomendada
2. Exemplo de middleware funcional
3. Como gerenciar tokens no cliente
4. Exemplo de API de login/registro

Obrigado desde já! 🚀`,
  author: {
    id: 'user-1',
    username: 'joao_silva',
    name: 'João Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
    reputation: 1250,
    level: UserLevel.INTERMEDIATE
  },
  category: {
    id: 'cat-1',
    name: 'Web Development',
    description: 'Desenvolvimento web com React, Next.js e outras tecnologias',
    icon: '🌐',
    color: '#3B82F6',
    questionsCount: 450,
    slug: 'web-development'
  },
  tags: [
    { id: 'tag-1', name: 'Next.js', description: 'Framework React', color: '#000000', questionsCount: 89, slug: 'nextjs', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false },
    { id: 'tag-2', name: 'JWT', description: 'JSON Web Tokens', color: '#F59E0B', questionsCount: 156, slug: 'jwt', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false },
    { id: 'tag-3', name: 'Autenticação', description: 'Sistemas de login', color: '#10B981', questionsCount: 234, slug: 'autenticacao', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false },
    { id: 'tag-4', name: 'TypeScript', description: 'Superset JavaScript', color: '#3178C6', questionsCount: 345, slug: 'typescript', createdAt: new Date(), updatedAt: new Date(), isPopular: true, isNew: false }
  ],
  votes: [
    { id: 'vote-1', userId: 'user-2', questionId: '1', value: 1, createdAt: new Date() },
    { id: 'vote-2', userId: 'user-3', questionId: '1', value: 1, createdAt: new Date() }
  ],
  _count: {
    answers: 3,
    comments: 5,
    votes: 2
  },
  viewCount: 89,
  isSolved: false,
  upvotesCount: 2,
  downvotesCount: 0,
  score: 2,
  createdAt: new Date('2024-08-20T10:30:00'),
  updatedAt: new Date('2024-08-20T10:30:00')
}

export function QuestionDetail({ questionId }: QuestionDetailProps) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setQuestion(mockQuestion)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [questionId])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-muted h-8 rounded-lg w-3/4"></div>
        <div className="bg-muted h-4 rounded-lg w-1/2"></div>
        <div className="bg-muted h-32 rounded-lg"></div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Pergunta não encontrada</p>
      </div>
    )
  }

  // Calcular votos totais
  const totalVotes = question.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0

  const handleVote = (voteValue: 1 | -1) => {
    if (userVote === voteValue) {
      setUserVote(0) // Remove o voto
    } else {
      setUserVote(voteValue) // Define o voto
    }
    // Implementar API de votação
    console.log('Votar:', voteValue)
  }

  const formatDate = (date: Date | string) => {
    // ✅ SEGURANÇA: Converter string para Date se necessário
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-green-600'
      case 'intermediate': return 'text-yellow-600'
      case 'master': return 'text-purple-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div
    >
      <Card className="border-border">
        <CardHeader className="pb-4">
          {/* Header da pergunta */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {question.title}
              </h1>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="gap-1">
                    <Tag className="w-3 h-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Status da pergunta */}
            {question.isSolved && (
              <Badge variant="success" className="gap-1 text-sm">
                <CheckCircle className="w-4 h-4" />
                Resolvida
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex gap-6">
            {/* Sistema de votação */}
            <div className="flex flex-col items-center gap-3 min-w-[80px]">
              <Button
                variant="ghost"
                size="sm"
                className={`p-3 h-auto ${userVote === 1 ? 'text-green-600 bg-green-50' : ''}`}
                onClick={() => handleVote(1)}
              >
                <ThumbsUp className="w-6 h-6" />
              </Button>
              
              <span className="text-2xl font-bold text-foreground">
                {totalVotes + (userVote !== 0 ? userVote : 0)}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className={`p-3 h-auto ${userVote === -1 ? 'text-red-600 bg-red-50' : ''}`}
                onClick={() => handleVote(-1)}
              >
                <ThumbsDown className="w-6 h-6" />
              </Button>
            </div>

            {/* Conteúdo da pergunta */}
            <div className="flex-1 space-y-6">
              {/* Conteúdo */}
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {question.content}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{question._count?.answers || 0} respostas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{question.viewCount} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Perguntado {formatDate(question.createdAt)}</span>
                </div>
                {/* ✅ SEGURANÇA: Converter strings de data para Date antes de comparar */}
                {new Date(question.updatedAt) > new Date(question.createdAt) && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Editado {formatDate(question.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* Ações da pergunta */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bookmark className="w-4 h-4" />
                    Salvar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Flag className="w-4 h-4" />
                    Reportar
                  </Button>
                </div>

                {/* Botões de edição (se for o autor) */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </div>

              {/* Informações do autor */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={question.author.avatar || undefined} alt={question.author.name || undefined} />
                    <AvatarFallback>
                      {(question.author.name || question.author.username).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">
                        {question.author.name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getLevelColor(question.author.level)}`}
                      >
                        {question.author.level}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reputação: {question.author.reputation} • 
                      Nível: {question.author.level}
                    </div>
                  </div>

                  {/* Categoria */}
                  <Badge variant="secondary" className="gap-1">
                    {question.category.icon && (
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: question.category.color }} />
                    )}
                    {question.category.name}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
