"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Home, 
  Users, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Settings,
  Plus,
  MapPin,
  Clock,
  Star,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react'
import Link from 'next/link'

interface SocialSidebarProps {
  currentUser?: {
    id: string
    username: string
    name: string
    avatar?: string
    reputation: number
    level: string
  }
  stats?: {
    totalPosts: number
    totalConnections: number
    totalLikes: number
    totalComments: number
  }
  suggestedConnections?: Array<{
    id: string
    username: string
    name: string
    avatar?: string
    level: string
    skills: string[]
    isAvailable: boolean
  }>
  upcomingEvents?: Array<{
    id: string
    title: string
    startDate: Date
    location: string
    attendees: number
    maxAttendees?: number
  }>
  trendingTopics?: Array<{
    tag: string
    count: number
    growth: number
  }>
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  currentUser,
  stats,
  suggestedConnections,
  upcomingEvents,
  trendingTopics
}) => {
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

  const formatDistanceToNow = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Em breve'
    if (diffInHours < 24) return `Em ${diffInHours}h`
    if (diffInHours < 48) return 'Amanhã'
    return `Em ${Math.floor(diffInHours / 24)} dias`
  }

  return (
    <div className="space-y-6">
      {/* Navegação Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navegação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/social">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="w-4 h-4 mr-2" />
              Feed Principal
            </Button>
          </Link>
          
          <Link href="/social/connections">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Conexões
            </Button>
          </Link>
          
          <Link href="/social/events">
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Eventos
            </Button>
          </Link>
          
          <Link href="/social/trending">
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Em Alta
            </Button>
          </Link>
          
          <Link href="/social/notifications">
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </Button>
          </Link>
          
          <Link href="/social/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Estatísticas do Usuário */}
      {currentUser && stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suas Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Posts</span>
              <Badge variant="secondary">{stats.totalPosts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conexões</span>
              <Badge variant="secondary">{stats.totalConnections}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Curtidas</span>
              <Badge variant="secondary">{stats.totalLikes}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Comentários</span>
              <Badge variant="secondary">{stats.totalComments}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sugestões de Conexão */}
      {suggestedConnections && suggestedConnections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sugestões de Conexão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedConnections.slice(0, 5).map((connection) => (
              <div key={connection.id} className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={connection.avatar} alt={connection.name} />
                  <AvatarFallback className="text-sm font-medium">
                    {getInitials(connection.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {connection.name}
                    </p>
                    <Badge className={getLevelColor(connection.level)} variant="secondary">
                      {connection.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    @{connection.username}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {connection.skills.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-3">
              Ver Todas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Eventos Próximos */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eventos Próximos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="p-3 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                <h4 className="font-medium text-foreground text-sm truncate">
                  {event.title}
                </h4>
                <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(event.startDate)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>
                    {event.attendees}
                    {event.maxAttendees && `/${event.maxAttendees}`}
                  </span>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-3">
              Ver Todos os Eventos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tópicos em Alta */}
      {trendingTopics && trendingTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tópicos em Alta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trendingTopics.slice(0, 8).map((topic, index) => (
              <div key={topic.tag} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    index < 3 ? 'text-primary' : 'text-foreground'
                  }`}>
                    #{topic.tag}
                  </span>
                  {index < 3 && (
                    <TrendingUp className="w-3 h-3 text-status-success" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>{topic.count}</span>
                  {topic.growth > 0 && (
                    <span className="text-status-success">+{topic.growth}%</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
          
          <Button variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Criar Evento
          </Button>
          
          <Button variant="outline" className="w-full">
            <Users className="w-4 h-4 mr-2" />
            Encontrar Conexões
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
