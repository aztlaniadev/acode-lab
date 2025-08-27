"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  Shield, 
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Mic,
  Lock,
  Globe,
  Eye,
  UserPlus,
  MoreHorizontal,
  Search,
  Filter,
  Star,
  Flame,
  TrendingUp,
  Hash,
  MapPin,
  Clock,
  Activity
} from 'lucide-react'

interface Community {
  id: string
  name: string
  description: string
  image: string
  banner: string
  type: 'public' | 'private' | 'secret'
  category: string
  memberCount: number
  onlineCount: number
  isJoined: boolean
  role?: 'owner' | 'admin' | 'moderator' | 'member'
  createdAt: Date
  rules: string[]
  tags: string[]
  settings: {
    allowMemberInvites: boolean
    moderateContent: boolean
    allowEvents: boolean
    allowPolls: boolean
  }
}

interface CommunityEvent {
  id: string
  communityId: string
  title: string
  description: string
  type: 'discussion' | 'voice' | 'video' | 'stream'
  startTime: Date
  endTime: Date
  location?: string
  maxParticipants?: number
  currentParticipants: number
  isLive: boolean
  tags: string[]
}

interface CommunityMember {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    username: string
  }
  role: 'owner' | 'admin' | 'moderator' | 'member'
  joinedAt: Date
  lastActive: Date
  isOnline: boolean
  reputation: number
}

const COMMUNITY_CATEGORIES = [
  'Tecnologia', 'Design', 'Programação', 'Startup', 'Marketing',
  'Educação', 'Ciência', 'Arte', 'Música', 'Gaming', 'Esportes',
  'Culinária', 'Viagem', 'Fotografia', 'Literatura', 'Outros'
]

// Helper functions
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />
    case 'admin': return <Shield className="w-4 h-4 text-red-500" />
    case 'moderator': return <Shield className="w-4 h-4 text-blue-500" />
    default: return null
  }
}

const getRoleBadge = (role: string) => {
  const roleColors = {
    owner: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-blue-100 text-blue-800',
    member: 'bg-gray-100 text-gray-800'
  }
  
  const roleNames = {
    owner: 'Criador',
    admin: 'Admin',
    moderator: 'Moderador',
    member: 'Membro'
  }

  return (
    <Badge className={roleColors[role as keyof typeof roleColors]}>
      {roleNames[role as keyof typeof roleNames]}
    </Badge>
  )
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'public': return <Globe className="w-4 h-4" />
    case 'private': return <Lock className="w-4 h-4" />
    case 'secret': return <Eye className="w-4 h-4" />
    default: return <Globe className="w-4 h-4" />
  }
}

export const CommunitySystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [communities] = useState<Community[]>([
    {
      id: '1',
      name: 'React Developers',
      description: 'Comunidade para desenvolvedores React compartilharem conhecimento e projetos',
      image: '/placeholder-community.jpg',
      banner: '/placeholder-banner.jpg',
      type: 'public',
      category: 'Tecnologia',
      memberCount: 15420,
      onlineCount: 342,
      isJoined: true,
      role: 'member',
      createdAt: new Date('2023-01-15'),
      rules: [
        'Seja respeitoso com todos os membros',
        'Mantenha as discussões relacionadas ao React',
        'Não faça spam ou autopromoção excessiva',
        'Use as tags apropriadas nos posts'
      ],
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
      settings: {
        allowMemberInvites: true,
        moderateContent: true,
        allowEvents: true,
        allowPolls: true
      }
    },
    {
      id: '2',
      name: 'UI/UX Designers',
      description: 'Espaço para designers compartilharem trabalhos e receberem feedback',
      image: '/placeholder-community.jpg',
      banner: '/placeholder-banner.jpg',
      type: 'public',
      category: 'Design',
      memberCount: 8930,
      onlineCount: 156,
      isJoined: false,
      createdAt: new Date('2023-03-22'),
      rules: [
        'Compartilhe apenas trabalhos originais',
        'Forneça feedback construtivo',
        'Respeite direitos autorais'
      ],
      tags: ['UI', 'UX', 'Design', 'Figma', 'Adobe'],
      settings: {
        allowMemberInvites: true,
        moderateContent: false,
        allowEvents: true,
        allowPolls: true
      }
    },
    {
      id: '3',
      name: 'Startup Brasil',
      description: 'Rede de empreendedores brasileiros',
      image: '/placeholder-community.jpg',
      banner: '/placeholder-banner.jpg',
      type: 'private',
      category: 'Startup',
      memberCount: 2840,
      onlineCount: 67,
      isJoined: true,
      role: 'admin',
      createdAt: new Date('2023-02-10'),
      rules: [
        'Apenas empreendedores verificados',
        'Mantenha confidencialidade das discussões',
        'Compartilhe conhecimento genuíno'
      ],
      tags: ['Startup', 'Empreendedorismo', 'Brasil', 'Negócios'],
      settings: {
        allowMemberInvites: false,
        moderateContent: true,
        allowEvents: true,
        allowPolls: true
      }
    }
  ])

  const [upcomingEvents] = useState<CommunityEvent[]>([
    {
      id: '1',
      communityId: '1',
      title: 'React 18 - Novidades e Migração',
      description: 'Discussão sobre as novas features do React 18 e como migrar projetos existentes',
      type: 'discussion',
      startTime: new Date('2024-01-15T19:00:00'),
      endTime: new Date('2024-01-15T21:00:00'),
      currentParticipants: 45,
      maxParticipants: 100,
      isLive: false,
      tags: ['React', 'Migration', 'Discussion']
    },
    {
      id: '2',
      communityId: '2',
      title: 'Portfolio Review Session',
      description: 'Sessão de review de portfólios com feedback da comunidade',
      type: 'video',
      startTime: new Date('2024-01-16T20:00:00'),
      endTime: new Date('2024-01-16T22:00:00'),
      currentParticipants: 23,
      maxParticipants: 50,
      isLive: false,
      tags: ['Portfolio', 'Review', 'Feedback']
    }
  ])

  const [communityMembers] = useState<CommunityMember[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Maria Silva',
        avatar: '/placeholder-avatar.png',
        username: 'mariasilva'
      },
      role: 'owner',
      joinedAt: new Date('2023-01-15'),
      lastActive: new Date(),
      isOnline: true,
      reputation: 2840
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'João Santos',
        avatar: '/placeholder-avatar.png',
        username: 'joaosantos'
      },
      role: 'admin',
      joinedAt: new Date('2023-01-20'),
      lastActive: new Date(Date.now() - 300000), // 5 min ago
      isOnline: true,
      reputation: 1920
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Ana Costa',
        avatar: '/placeholder-avatar.png',
        username: 'anacosta'
      },
      role: 'moderator',
      joinedAt: new Date('2023-02-01'),
      lastActive: new Date(Date.now() - 3600000), // 1 hour ago
      isOnline: false,
      reputation: 1560
    }
  ])

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || community.category === selectedCategory
    return matchesSearch && matchesCategory
  })



  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comunidades</h1>
          <p className="text-muted-foreground">
            Conecte-se com pessoas que compartilham seus interesses
          </p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Comunidade
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Descobrir</TabsTrigger>
          <TabsTrigger value="joined">Minhas Comunidades</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="manage">Gerenciar</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar comunidades..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {COMMUNITY_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Communities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Comunidades em Destaque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explorar por Categoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {COMMUNITY_CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSelectedCategory(category)}
                >
                  <Hash className="w-5 h-5" />
                  <span className="text-sm">{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="joined" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities
              .filter(c => c.isJoined)
              .map(community => (
                <JoinedCommunityCard key={community.id} community={community} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Eventos ao Vivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="w-8 h-8 mx-auto mb-2" />
                  <p>Nenhum evento ao vivo no momento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Community Management */}
            <div className="lg:col-span-2 space-y-6">
              {communities
                .filter(c => c.role && ['owner', 'admin'].includes(c.role))
                .map(community => (
                  <CommunityManagementCard key={community.id} community={community} />
                ))}
            </div>

            {/* Members */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Membros Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {communityMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.user.avatar} />
                            <AvatarFallback>
                              {member.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {member.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{member.user.name}</span>
                            {getRoleIcon(member.role)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {member.reputation} pontos
                          </span>
                        </div>
                      </div>
                      
                      {getRoleBadge(member.role)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Community Modal */}
      {showCreateModal && (
        <CreateCommunityModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

// Community Card Component
const CommunityCard: React.FC<{ community: Community }> = ({ community }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-24 bg-gradient-to-r from-primary to-secondary">
        <Image
          src={community.banner}
          alt={community.name}
          fill
          className="object-cover"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-background -mt-8 relative z-10">
            <Image
              src={community.image}
              alt={community.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{community.name}</h3>
              {getTypeIcon(community.type)}
            </div>
            <Badge variant="secondary" className="text-xs">
              {community.category}
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {community.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {community.memberCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {community.onlineCount}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {community.isJoined ? (
            <>
              <Button size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                Entrar
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" className="flex-1">
              <UserPlus className="w-4 h-4 mr-1" />
              Participar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Joined Community Card Component
const JoinedCommunityCard: React.FC<{ community: Community }> = ({ community }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <Image
              src={community.image}
              alt={community.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{community.name}</h3>
              {community.role && getRoleIcon(community.role)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{community.onlineCount} online</span>
            </div>
          </div>
          
          <Button size="sm">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
        
        {community.role && (
          <div className="mb-2">
            {getRoleBadge(community.role)}
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Event Card Component
const EventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'discussion': return <MessageSquare className="w-4 h-4" />
      case 'voice': return <Mic className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'stream': return <Activity className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getEventIcon(event.type)}
          <h4 className="font-medium text-sm">{event.title}</h4>
        </div>
        {event.isLive && (
          <Badge variant="destructive" className="text-xs">
            AO VIVO
          </Badge>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {event.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {event.startTime.toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {event.currentParticipants}
          {event.maxParticipants && `/${event.maxParticipants}`}
        </div>
      </div>
    </div>
  )
}

// Community Management Card Component
const CommunityManagementCard: React.FC<{ community: Community }> = ({ community }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={community.image}
                alt={community.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{community.name}</h3>
              <div className="flex items-center gap-2">
                {getRoleBadge(community.role!)}
                <Badge variant="outline">
                  {community.memberCount} membros
                </Badge>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{community.onlineCount}</div>
            <div className="text-xs text-muted-foreground">Online agora</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-muted-foreground">Posts hoje</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Moderar conteúdo</span>
            <Switch checked={community.settings.moderateContent} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Permitir eventos</span>
            <Switch checked={community.settings.allowEvents} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Convites de membros</span>
            <Switch checked={community.settings.allowMemberInvites} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Create Community Modal Component
const CreateCommunityModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: '',
    type: 'public' as const,
    rules: [''],
    tags: []
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Criar Nova Comunidade</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome da Comunidade</Label>
              <Input
                value={newCommunity.name}
                onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome único da comunidade"
              />
            </div>
            
            <div>
              <Label>Categoria</Label>
              <Select
                value={newCommunity.category}
                onValueChange={(value) => setNewCommunity(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNITY_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={newCommunity.description}
              onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito da sua comunidade..."
              rows={3}
            />
          </div>
          
          <div>
            <Label>Tipo de Comunidade</Label>
            <Select
              value={newCommunity.type}
              onValueChange={(value) => setNewCommunity(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Pública - Qualquer um pode participar
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Privada - Necessário aprovação
                  </div>
                </SelectItem>
                <SelectItem value="secret">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Secreta - Apenas por convite
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button className="flex-1">
              Criar Comunidade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}