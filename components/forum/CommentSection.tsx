'use client'

import { useState, useEffect } from 'react'
// Animações removidas
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Edit, 
  Trash2, 
  Flag,
  Reply,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Comment, UserLevel } from '@/types/forum'

interface CommentSectionProps {
  parentId: string
  parentType: 'question' | 'answer'
  comments: Comment[]
  onAddComment: (comment: Comment) => void
}

// Dados mockados para comentários
const mockComments: Comment[] = [
  {
    id: 'comment-1',
    content: 'Excelente pergunta! Também estou enfrentando o mesmo problema com JWT no Next.js 14.',
    author: {
      id: 'user-4',
      name: 'Ana Costa',
      email: 'ana@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      reputation: 890,
      level: UserLevel.INTERMEDIATE,
      badges: [],
      joinDate: new Date('2024-02-15'),
      questionsCount: 12,
      answersCount: 28
    },
    parentId: '1',
    parentType: 'question',
    votes: [
      { id: 'vote-1', userId: 'user-1', commentId: 'comment-1', value: 1, createdAt: new Date() }
    ],
    createdAt: new Date('2024-08-20T11:00:00')
  },
  {
    id: 'comment-2',
    content: 'Já tentou usar o NextAuth.js? É mais simples que implementar JWT do zero.',
    author: {
      id: 'user-5',
      name: 'Carlos Lima',
      email: 'carlos@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      reputation: 1560,
      level: UserLevel.EXPERT,
      badges: [],
      joinDate: new Date('2023-09-10'),
      questionsCount: 6,
      answersCount: 89
    },
    parentId: '1',
    parentType: 'question',
    votes: [
      { id: 'vote-2', userId: 'user-1', commentId: 'comment-2', value: 1, createdAt: new Date() },
      { id: 'vote-3', userId: 'user-2', commentId: 'comment-2', value: 1, createdAt: new Date() }
    ],
    createdAt: new Date('2024-08-20T11:30:00')
  }
]

export function CommentSection({ parentId, parentType, comments, onAddComment }: CommentSectionProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(comments.length > 0 ? comments : mockComments)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // Sincronizar comentários quando as props mudarem
  useEffect(() => {
    if (comments.length > 0) {
      setLocalComments(comments)
    }
  }, [comments])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    setIsSubmitting(true)
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Criar novo comentário
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: {
          id: 'user-current',
          name: 'Usuário Atual',
          email: 'current@email.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Current',
          reputation: 100,
          level: UserLevel.BEGINNER,
          badges: [],
          joinDate: new Date(),
          questionsCount: 1,
          answersCount: 1
        },
        parentId,
        parentType,
        votes: [],
        createdAt: new Date()
      }
      
      setLocalComments(prev => [newCommentObj, ...prev])
      onAddComment(newCommentObj)
      setNewComment('')
      setShowCommentForm(false)
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return
    
    try {
      // Simular edição na API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setLocalComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent }
          : comment
      ))
      
      setEditingComment(null)
      setEditContent('')
    } catch (error) {
      console.error('Erro ao editar comentário:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return
    
    try {
      // Simular exclusão na API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setLocalComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Erro ao excluir comentário:', error)
    }
  }

  const handleVote = (commentId: string, voteValue: 1 | -1) => {
    // Implementar API de votação
    console.log('Votar comentário:', commentId, voteValue)
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
    <div className="space-y-4">
      {/* Header dos comentários */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {localComments.length} Comentário{localComments.length !== 1 ? 's' : ''}
        </h3>
        <Button 
          onClick={() => setShowCommentForm(!showCommentForm)}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {showCommentForm ? 'Cancelar' : 'Comentar'}
        </Button>
      </div>

      {/* Formulário de comentário */}
      <div>
        {showCommentForm && (
          <div
          >
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <Textarea
                    placeholder="Adicione um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={isSubmitting || !newComment.trim()}
                    >
                      {isSubmitting ? 'Enviando...' : 'Comentar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Lista de comentários */}
      <div className="space-y-3">
        {localComments.map((comment) => (
          <div
            key={comment.id}
          >
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Avatar do autor */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Conteúdo do comentário */}
                  <div className="flex-1 space-y-3">
                    {/* Header do comentário */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {comment.author.name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getLevelColor(comment.author.level)}`}
                      >
                        {comment.author.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    {/* Conteúdo */}
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleEditComment(comment.id)}
                          >
                            Salvar
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingComment(null)
                              setEditContent('')
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-foreground leading-relaxed">
                        {comment.content}
                      </div>
                    )}

                    {/* Ações do comentário */}
                    <div className="flex items-center gap-3 pt-2">
                      {/* Sistema de votação */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-muted-foreground hover:text-foreground"
                          onClick={() => handleVote(comment.id, 1)}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground min-w-[20px] text-center">
                          {comment.votes.reduce((sum, vote) => sum + vote.value, 0)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-muted-foreground hover:text-foreground"
                          onClick={() => handleVote(comment.id, -1)}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Outras ações */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-muted-foreground hover:text-foreground"
                      >
                        <Reply className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingComment(comment.id)
                          setEditContent(comment.content)
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-muted-foreground hover:text-foreground"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-muted-foreground hover:text-foreground"
                      >
                        <Flag className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Mensagem se não há comentários */}
      {localComments.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
