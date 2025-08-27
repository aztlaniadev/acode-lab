"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { 
  X, Edit, Camera, MapPin, Link, Calendar, Mail, Phone,
  Settings, Share, MoreHorizontal, Grid, Bookmark, Heart,
  MessageCircle, UserPlus, UserMinus, Shield, Award,
  Star, Trophy, Target, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface UserProfile {
  id: string
  name: string
  username: string
  avatar: string
  coverImage?: string
  bio: string
  location?: string
  website?: string
  email?: string
  phone?: string
  joinDate: Date
  verified: boolean
  followers: number
  following: number
  posts: number
  level: number
  xp: number
  badges: Array<{
    id: string
    name: string
    icon: string
    description: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }>
  achievements: Array<{
    id: string
    name: string
    description: string
    unlockedAt: Date
    progress?: number
    maxProgress?: number
  }>
  stats: {
    totalLikes: number
    totalComments: number
    totalShares: number
    engagementRate: number
    streakDays: number
  }
  preferences: {
    isPrivate: boolean
    allowMessages: boolean
    showEmail: boolean
    showPhone: boolean
    showOnlineStatus: boolean
  }
  socialLinks?: Array<{
    platform: string
    url: string
  }>
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: UserProfile
  isOwnProfile: boolean
  isFollowing?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  onUpdateProfile?: (updates: Partial<UserProfile>) => void
  onMessage?: () => void
  posts: Array<{
    id: string
    images: string[]
    likes: number
    comments: number
  }>
}

export const ProfileModal = ({
  isOpen,
  onClose,
  profile,
  isOwnProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  onUpdateProfile,
  onMessage,
  posts
}: ProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [activeTab, setActiveTab] = useState('posts')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editedProfile)
    }
    setIsEditing(false)
  }

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-pink-500'
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-indigo-500'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Profile Panel */}
      <div className="relative ml-auto h-full w-full max-w-4xl bg-background border-l border-border shadow-2xl">
        <ScrollArea className="h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <h2 className="text-lg font-semibold">
              {isOwnProfile ? 'Seu Perfil' : `@${profile.username}`}
            </h2>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      handleSave()
                    } else {
                      setIsEditing(true)
                    }
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Salvar' : 'Editar'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-primary/20 to-secondary/20">
            {profile.coverImage && (
              <Image
                src={profile.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            )}
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => coverInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Alterar Capa
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 relative">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1 pt-16 sm:pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Nome de usuário</Label>
                          <Input
                            id="username"
                            value={editedProfile.username}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="@username"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold">{profile.name}</h1>
                          {profile.verified && (
                            <Badge variant="secondary" className="text-blue-500">
                              <Shield className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">@{profile.username}</p>
                      </>
                    )}
                  </div>

                  {!isOwnProfile && (
                    <div className="flex gap-2">
                      <Button
                        variant={isFollowing ? 'outline' : 'default'}
                        onClick={isFollowing ? onUnfollow : onFollow}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Deixar de seguir
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Seguir
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={onMessage}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Mensagem
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="mt-4">
                  {isEditing ? (
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Conte sobre você..."
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{profile.bio}</p>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {isEditing ? (
                        <Input
                          value={editedProfile.location}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="h-6 text-xs"
                          placeholder="Localização"
                        />
                      ) : (
                        profile.location
                      )}
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-1">
                      <Link className="h-4 w-4" />
                      <a href={profile.website} className="text-primary hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Entrou em {format(profile.joinDate, 'MMMM yyyy', { locale: ptBR })}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{formatNumber(profile.posts)}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{formatNumber(profile.followers)}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{formatNumber(profile.following)}</div>
                    <div className="text-xs text-muted-foreground">Seguindo</div>
                  </div>
                </div>

                {/* Level and XP */}
                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Nível {profile.level}</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(profile.xp % 1000) / 10}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {profile.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {profile.badges.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Distintivos</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`relative p-2 rounded-lg text-white text-xs font-medium ${getBadgeColor(badge.rarity)}`}
                      title={badge.description}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{badge.icon}</span>
                        <span>{badge.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                {isOwnProfile && <TabsTrigger value="settings">Configurações</TabsTrigger>}
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                <div className="grid grid-cols-3 gap-1">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="relative aspect-square bg-muted rounded overflow-hidden group cursor-pointer"
                    >
                      {post.images[0] && (
                        <Image
                          src={post.images[0]}
                          alt="Post"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4 text-white text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {formatNumber(post.likes)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {formatNumber(post.comments)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <div className="space-y-4">
                  {profile.achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Desbloqueado em {format(achievement.unlockedAt, 'dd/MM/yyyy')}
                            </p>
                          </div>
                          <Trophy className="h-8 w-8 text-yellow-500" />
                        </div>
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progresso</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Engajamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Curtidas</span>
                          <span className="font-medium">{formatNumber(profile.stats.totalLikes)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Comentários</span>
                          <span className="font-medium">{formatNumber(profile.stats.totalComments)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Compartilhamentos</span>
                          <span className="font-medium">{formatNumber(profile.stats.totalShares)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Taxa de Engajamento</span>
                          <span className="font-medium">{profile.stats.engagementRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sequência de dias</span>
                          <span className="font-medium">{profile.stats.streakDays} dias</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="settings" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Privacidade</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">Conta privada</div>
                            <div className="text-xs text-muted-foreground">
                              Apenas seguidores podem ver seus posts
                            </div>
                          </div>
                          <Switch
                            checked={editedProfile.preferences.isPrivate}
                            onCheckedChange={(checked: boolean) => 
                              setEditedProfile(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, isPrivate: checked }
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">Permitir mensagens</div>
                            <div className="text-xs text-muted-foreground">
                              Qualquer pessoa pode enviar mensagens
                            </div>
                          </div>
                          <Switch
                            checked={editedProfile.preferences.allowMessages}
                            onCheckedChange={(checked: boolean) => 
                              setEditedProfile(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, allowMessages: checked }
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Informações de Contato</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedProfile.email || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={editedProfile.phone || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            value={editedProfile.website || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              // Handle avatar upload
              const url = URL.createObjectURL(file)
              setEditedProfile(prev => ({ ...prev, avatar: url }))
            }
          }}
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              // Handle cover upload
              const url = URL.createObjectURL(file)
              setEditedProfile(prev => ({ ...prev, coverImage: url }))
            }
          }}
        />
      </div>
    </div>
  )
}