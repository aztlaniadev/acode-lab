"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Image as ImageIcon,
  Link,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SocialPostProps {
  post: {
    id: string
    type: 'text' | 'image' | 'link' | 'poll' | 'event'
    content: string
    images?: string[]
    link?: {
      url: string
      title: string
      description: string
      image?: string
    }
    poll?: {
      question: string
      options: Array<{
        id: string
        text: string
        votes: number
        percentage: number
      }>
      totalVotes: number
      endDate: Date
      isActive: boolean
    }
    event?: {
      title: string
      description: string
      startDate: Date
      endDate: Date
      location: string
      attendees: number
      maxAttendees?: number
    }
    tags: string[]
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
    author: {
      id: string
      username: string
      name: string
      avatar?: string
      reputation: number
      level: string
      isVerified: boolean
    }
    _count: {
      comments: number
      likes: number
      shares: number
    }
  }
  isLiked?: boolean
  isShared?: boolean
  onLike?: (postId: string) => void
  onComment?: (postId: string, comment: string) => void
  onShare?: (postId: string) => void
  onVote?: (postId: string, optionId: string) => void
  onAttend?: (postId: string) => void
}

export const SocialPost: React.FC<SocialPostProps> = ({
  post,
  isLiked = false,
  isShared = false,
  onLike,
  onComment,
  onShare,
  onVote,
  onAttend
}) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-level-beginner text-level-beginner-foreground'
      case 'intermediate':
        return 'bg-level-intermediate text-level-intermediate-foreground'
      case 'advanced':
        return 'bg-level-advanced text-level-advanced-foreground'
      case 'expert':
        return 'bg-level-expert text-level-expert-foreground'
      default:
        return 'bg-level-beginner text-level-beginner-foreground'
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !onComment) return
    
    setIsSubmitting(true)
    try {
      await onComment(post.id, newComment)
      setNewComment('')
      setShowComments(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPostContent = () => {
    switch (post.type) {
      case 'image':
        return (
          <div className="space-y-3">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'link':
        return (
          <div className="space-y-3">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            {post.link && (
              <div className="border rounded-lg p-3 hover:border-primary/50 transition-colors">
                <div className="flex space-x-3">
                  {post.link.image && (
                    <img
                      src={post.link.image}
                      alt={post.link.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {post.link.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.link.description}
                    </p>
                    <p className="text-xs text-primary truncate">
                      {post.link.url}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'poll':
        return (
          <div className="space-y-3">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            {post.poll && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">{post.poll.question}</h4>
                <div className="space-y-2">
                  {post.poll.options.map((option) => (
                    <div
                      key={option.id}
                      className="relative cursor-pointer"
                      onClick={() => onVote?.(post.id, option.id)}
                    >
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors">
                        <span className="text-sm text-foreground">{option.text}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {option.votes} votos
                          </span>
                          <span className="text-xs font-medium text-primary">
                            {option.percentage}%
                          </span>
                        </div>
                      </div>
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/10 rounded-l-lg transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.poll.totalVotes} votos totais</span>
                  <span>
                    {post.poll.isActive ? (
                      <span className="flex items-center space-x-1 text-status-success">
                        <Clock className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-status-warning">
                        <CheckCircle className="w-3 h-3" />
                        Encerrado
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )

      case 'event':
        return (
          <div className="space-y-3">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            {post.event && (
              <div className="border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{post.event.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.event.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(post.event.startDate, { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                      {post.event.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          {post.event.location}
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        {post.event.attendees}
                        {post.event.maxAttendees && `/${post.event.maxAttendees}`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => onAttend?.(post.id)}
                >
                  Participar do Evento
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return (
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        )
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="text-sm font-medium">
              {getInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-foreground truncate">
                {post.author.name}
              </h3>
              {post.author.isVerified && (
                <Badge variant="secondary" className="bg-status-verified text-status-verified-foreground text-xs">
                  ✓
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{formatDistanceToNow(post.createdAt, { 
                addSuffix: true, 
                locale: ptBR 
              })}</span>
              {post.type !== 'text' && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {post.type === 'image' && <ImageIcon className="w-3 h-3 mr-1" />}
                    {post.type === 'link' && <Link className="w-3 h-3 mr-1" />}
                    {post.type === 'poll' && <BarChart3 className="w-3 h-3 mr-1" />}
                    {post.type === 'event' && <Calendar className="w-3 h-3 mr-1" />}
                    {post.type}
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {renderPostContent()}
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Estatísticas */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{post._count.likes} curtidas</span>
            <span>{post._count.comments} comentários</span>
            <span>{post._count.shares} compartilhamentos</span>
          </div>
        </div>
        
        {/* Ações */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 ${
              isLiked ? 'text-status-error' : 'text-muted-foreground'
            }`}
            onClick={() => onLike?.(post.id)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>Curtir</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comentar</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 ${
              isShared ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onShare?.(post.id)}
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </Button>
        </div>
        
        {/* Comentários */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComments(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
