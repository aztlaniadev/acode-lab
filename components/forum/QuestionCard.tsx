'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Question, UserLevel } from '@/types/forum'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle,
  Clock,
  User,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface QuestionCardProps {
  question: Question
  onVoteChange?: (questionId: string, newScore: number) => void
}

export function QuestionCard({ question, onVoteChange }: QuestionCardProps) {
  const { data: session } = useSession()
  const [isVoting, setIsVoting] = useState(false)
  const [localUpvotes, setLocalUpvotes] = useState(question.upvotesCount || question.votes?.filter(v => v.value === 1).length || 0)
  const [localDownvotes, setLocalDownvotes] = useState(question.downvotesCount || question.votes?.filter(v => v.value === -1).length || 0)
  const [userVote, setUserVote] = useState(question.userVote || 0)

  const getLevelColor = (level: UserLevel) => {
    switch (level) {
      case UserLevel.BEGINNER: return 'bg-green-100 text-green-800'
      case UserLevel.INTERMEDIATE: return 'bg-blue-100 text-blue-800'
      case UserLevel.EXPERT: return 'bg-purple-100 text-purple-800'
      case UserLevel.MASTER: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelLabel = (level: UserLevel) => {
    switch (level) {
      case UserLevel.BEGINNER: return 'Iniciante'
      case UserLevel.INTERMEDIATE: return 'Intermediário'
      case UserLevel.EXPERT: return 'Especialista'
      case UserLevel.MASTER: return 'Mestre'
      default: return 'Iniciante'
    }
  }

  const handleVote = async (voteValue: 1 | -1) => {
    if (!session?.user?.id) {
      // Redirecionar para login se não estiver autenticado
      window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname)
      return
    }

    if (isVoting) return

    setIsVoting(true)
    
    try {
      const response = await fetch(`/api/forum/questions/${question.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: voteValue }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Atualizar estado local
        if (userVote === voteValue) {
          // Remover voto
          if (voteValue === 1) {
            setLocalUpvotes(prev => prev - 1)
          } else {
            setLocalDownvotes(prev => prev - 1)
          }
          setUserVote(0)
        } else if (userVote === 0) {
          // Adicionar novo voto
          if (voteValue === 1) {
            setLocalUpvotes(prev => prev + 1)
          } else {
            setLocalDownvotes(prev => prev + 1)
          }
          setUserVote(voteValue)
        } else {
          // Mudar voto
          if (voteValue === 1) {
            setLocalUpvotes(prev => prev + 1)
            setLocalDownvotes(prev => prev - 1)
          } else {
            setLocalUpvotes(prev => prev - 1)
            setLocalDownvotes(prev => prev + 1)
          }
          setUserVote(voteValue)
        }

        // Notificar componente pai sobre mudança no score
        if (onVoteChange) {
          const newScore = localUpvotes - localDownvotes
          onVoteChange(question.id, newScore)
        }
      } else {
        console.error('Erro ao votar:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao votar:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const score = localUpvotes - localDownvotes

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/forum/${question.slug}`}>
              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                {question.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{question.author.name}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getLevelColor(question.author.level)}`}
              >
                {getLevelLabel(question.author.level)}
              </Badge>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(question.createdAt), { locale: ptBR, addSuffix: true })}</span>
            </div>
          </div>
          
          {question.isSolved && (
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {question.content}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag) => (
            <Link key={tag.id} href={`/forum/tag/${tag.slug}`}>
              <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
        
        {/* Estatísticas e Ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Sistema de Votação */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(1)}
                disabled={isVoting}
                className={`h-8 px-2 hover:bg-green-100 ${
                  userVote === 1 ? 'text-green-600 bg-green-50' : 'text-muted-foreground'
                }`}
              >
                {isVoting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp className="h-4 w-4" />
                )}
                <span className="ml-1">{localUpvotes}</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(-1)}
                disabled={isVoting}
                className={`h-8 px-2 hover:bg-red-100 ${
                  userVote === -1 ? 'text-red-600 bg-red-50' : 'text-muted-foreground'
                }`}
              >
                {isVoting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown className="h-4 w-4" />
                )}
                <span className="ml-1">{localDownvotes}</span>
              </Button>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1">
              <span className={`font-medium ${
                score > 0 ? 'text-green-600' : 
                score < 0 ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                {score > 0 ? '+' : ''}{score}
              </span>
            </div>

            {/* Respostas */}
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{question._count?.answers || 0} resposta{(question._count?.answers || 0) !== 1 ? 's' : ''}</span>
            </div>

            {/* Visualizações */}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{question.viewCount || 0} visualizaç{(question.viewCount || 0) !== 1 ? 'ões' : 'ão'}</span>
            </div>
          </div>
          
          {/* Categoria */}
          <div className="flex items-center gap-2">
            <Link href={`/forum/category/${question.category.slug}`}>
              <Badge 
                variant="secondary" 
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                {question.category.icon} {question.category.name}
              </Badge>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
