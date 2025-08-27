"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Building2, 
  Briefcase, 
  Clock, 
  Star, 
  Users, 
  MessageSquare,
  Heart,
  Share2,
  Edit3,
  Settings
} from 'lucide-react'

interface UserProfileProps {
  profile: {
    id: string
    userId: string
    displayName: string
    bio?: string
    skills: string[]
    experience?: string
    education?: string
    company?: string
    jobTitle?: string
    location?: string
    timezone?: string
    isAvailable: boolean
    hourlyRate?: number
    portfolio: string[]
    socialLinks?: any
    user: {
      id: string
      username: string
      name: string
      avatar?: string
      reputation: number
      level: string
      isVerified: boolean
    }
  }
  isOwnProfile?: boolean
  connectionStatus?: 'none' | 'pending' | 'connected'
  onConnect?: () => void
  onMessage?: () => void
  onEdit?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  isOwnProfile = false,
  connectionStatus = 'none',
  onConnect,
  onMessage,
  onEdit
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

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />
        <CardHeader className="relative pb-0">
          <div className="flex items-end justify-between">
            <div className="flex items-end space-x-4 -mt-16">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={profile.user.avatar} alt={profile.displayName} />
                <AvatarFallback className="text-2xl font-semibold">
                  {getInitials(profile.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="mb-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.displayName}
                  </h1>
                  {profile.user.isVerified && (
                    <Badge variant="secondary" className="bg-status-verified text-status-verified-foreground">
                      ✓ Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">@{profile.user.username}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getLevelColor(profile.user.level)}>
                    {profile.user.level}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    {profile.user.reputation}
                  </Badge>
                </div>
              </div>
            </div>
            
            {!isOwnProfile && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMessage}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Mensagem
                </Button>
                
                {connectionStatus === 'none' && (
                  <Button
                    onClick={onConnect}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    Conectar
                  </Button>
                )}
                
                {connectionStatus === 'pending' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled
                    className="flex items-center space-x-2"
                  >
                    <Clock className="w-4 h-4" />
                    Pendente
                  </Button>
                )}
                
                {connectionStatus === 'connected' && (
                  <Badge variant="secondary" className="bg-status-success text-status-success-foreground">
                    <Users className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
              </div>
            )}
            
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {profile.bio && (
            <p className="text-muted-foreground mb-4">{profile.bio}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.jobTitle && (
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{profile.jobTitle}</span>
                {profile.company && (
                  <span className="text-foreground">em {profile.company}</span>
                )}
              </div>
            )}
            
            {profile.location && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{profile.location}</span>
              </div>
            )}
            
            {profile.timezone && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{profile.timezone}</span>
              </div>
            )}
            
            {profile.hourlyRate && (
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  ${profile.hourlyRate}/hora
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Habilidades */}
      {profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiência */}
      {profile.experience && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Experiência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {profile.experience}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educação */}
      {profile.education && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Educação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {profile.education}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio */}
      {profile.portfolio.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.portfolio.map((item, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium text-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status de Disponibilidade */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                profile.isAvailable 
                  ? 'bg-status-success' 
                  : 'bg-status-warning'
              }`} />
              <span className="text-sm font-medium">
                {profile.isAvailable ? 'Disponível para projetos' : 'Indisponível'}
              </span>
            </div>
            
            {profile.isAvailable && profile.hourlyRate && (
              <Badge variant="outline" className="text-status-success border-status-success">
                ${profile.hourlyRate}/hora
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
