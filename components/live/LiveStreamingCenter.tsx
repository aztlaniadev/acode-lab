"use client"

import React, { useState, useRef, useEffect } from 'react'
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
import { Slider } from '@/components/ui/slider'
import { 
  Video, 
  Mic, 
  MicOff,
  VideoOff,
  Share2,
  Settings,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Gift,
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Radio,
  Camera,
  Monitor,
  Headphones,
  Zap,
  Star,
  Crown,
  Award,
  TrendingUp,
  MapPin,
  Globe,
  Lock,
  UserPlus,
  Send,
  Smile,
  DollarSign,
  Filter,
  Search
} from 'lucide-react'

interface LiveStream {
  id: string
  title: string
  description: string
  thumbnail: string
  streamer: {
    id: string
    name: string
    avatar: string
    isVerified: boolean
    followers: number
  }
  category: string
  tags: string[]
  viewerCount: number
  likes: number
  startTime: Date
  isLive: boolean
  duration: number
  quality: '720p' | '1080p' | '4K'
  isFollowing: boolean
  isSubscribed: boolean
}

interface LiveEvent {
  id: string
  title: string
  description: string
  image: string
  organizer: {
    id: string
    name: string
    avatar: string
  }
  type: 'workshop' | 'webinar' | 'conference' | 'q&a' | 'entertainment'
  startTime: Date
  endTime: Date
  maxParticipants?: number
  currentParticipants: number
  isRegistered: boolean
  isPaid: boolean
  price?: number
  category: string
  speakers: Array<{
    id: string
    name: string
    avatar: string
    title: string
  }>
}

interface ChatMessage {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    badges: string[]
  }
  message: string
  timestamp: Date
  type: 'message' | 'tip' | 'subscription' | 'follow' | 'system'
  amount?: number
}

interface StreamSettings {
  title: string
  description: string
  category: string
  tags: string[]
  privacy: 'public' | 'followers' | 'subscribers'
  allowChat: boolean
  moderateChat: boolean
  allowTips: boolean
  minTipAmount: number
  quality: '720p' | '1080p' | '4K'
  enableRecording: boolean
}

const STREAM_CATEGORIES = [
  'Tecnologia', 'Gaming', 'Educação', 'Arte', 'Música', 'Fitness',
  'Culinária', 'Viagem', 'Lifestyle', 'Negócios', 'Ciência', 'Outros'
]

// Helper functions
const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case 'subscriber': return <Crown className="w-3 h-3 text-purple-500" />
    case 'verified': return <Star className="w-3 h-3 text-blue-500" />
    case 'mod': return <Award className="w-3 h-3 text-green-500" />
    case 'follower': return <Heart className="w-3 h-3 text-red-500" />
    default: return null
  }
}

export const LiveStreamingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: '',
    description: '',
    category: '',
    tags: [],
    privacy: 'public',
    allowChat: true,
    moderateChat: true,
    allowTips: true,
    minTipAmount: 5,
    quality: '1080p',
    enableRecording: false
  })

  // Stream controls state
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [volume, setVolume] = useState([80])
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Chat state
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'João Silva',
        avatar: '/placeholder-avatar.png',
        badges: ['subscriber', 'verified']
      },
      message: 'Ótimo conteúdo! Muito útil 🔥',
      timestamp: new Date(Date.now() - 120000),
      type: 'message'
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Maria Santos',
        avatar: '/placeholder-avatar.png',
        badges: ['follower']
      },
      message: 'Primeira vez aqui, adorando!',
      timestamp: new Date(Date.now() - 60000),
      type: 'message'
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Pedro Costa',
        avatar: '/placeholder-avatar.png',
        badges: ['subscriber', 'mod']
      },
      message: '',
      timestamp: new Date(Date.now() - 30000),
      type: 'tip',
      amount: 10
    }
  ])

  const [liveStreams] = useState<LiveStream[]>([
    {
      id: '1',
      title: 'Construindo uma API REST com Node.js',
      description: 'Tutorial completo sobre como criar uma API REST escalável',
      thumbnail: '/placeholder-stream.jpg',
      streamer: {
        id: '1',
        name: 'Ana Developer',
        avatar: '/placeholder-avatar.png',
        isVerified: true,
        followers: 15400
      },
      category: 'Tecnologia',
      tags: ['Node.js', 'API', 'Backend'],
      viewerCount: 342,
      likes: 89,
      startTime: new Date(Date.now() - 1800000),
      isLive: true,
      duration: 1800,
      quality: '1080p',
      isFollowing: false,
      isSubscribed: false
    },
    {
      id: '2',
      title: 'React Hooks Avançados - useCallback e useMemo',
      description: 'Aprenda a otimizar performance com hooks avançados',
      thumbnail: '/placeholder-stream.jpg',
      streamer: {
        id: '2',
        name: 'Carlos Frontend',
        avatar: '/placeholder-avatar.png',
        isVerified: true,
        followers: 23100
      },
      category: 'Tecnologia',
      tags: ['React', 'Hooks', 'Performance'],
      viewerCount: 567,
      likes: 156,
      startTime: new Date(Date.now() - 3600000),
      isLive: true,
      duration: 3600,
      quality: '1080p',
      isFollowing: true,
      isSubscribed: true
    }
  ])

  const [upcomingEvents] = useState<LiveEvent[]>([
    {
      id: '1',
      title: 'Workshop: Design System com Figma',
      description: 'Aprenda a criar um design system completo do zero',
      image: '/placeholder-event.jpg',
      organizer: {
        id: '1',
        name: 'Design Academy',
        avatar: '/placeholder-avatar.png'
      },
      type: 'workshop',
      startTime: new Date('2024-01-25T19:00:00'),
      endTime: new Date('2024-01-25T21:00:00'),
      maxParticipants: 100,
      currentParticipants: 67,
      isRegistered: false,
      isPaid: true,
      price: 49.90,
      category: 'Design',
      speakers: [
        {
          id: '1',
          name: 'Laura Design',
          avatar: '/placeholder-avatar.png',
          title: 'Senior UX Designer'
        }
      ]
    },
    {
      id: '2',
      title: 'Webinar: Carreira em Tech 2024',
      description: 'Tendências e oportunidades no mercado de tecnologia',
      image: '/placeholder-event.jpg',
      organizer: {
        id: '2',
        name: 'Tech Careers',
        avatar: '/placeholder-avatar.png'
      },
      type: 'webinar',
      startTime: new Date('2024-01-28T14:00:00'),
      endTime: new Date('2024-01-28T16:00:00'),
      currentParticipants: 234,
      isRegistered: true,
      isPaid: false,
      category: 'Carreira',
      speakers: [
        {
          id: '1',
          name: 'Roberto Tech',
          avatar: '/placeholder-avatar.png',
          title: 'Tech Lead'
        },
        {
          id: '2',
          name: 'Fernanda HR',
          avatar: '/placeholder-avatar.png',
          title: 'Tech Recruiter'
        }
      ]
    }
  ])

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }



  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: {
          id: 'current-user',
          name: 'Você',
          avatar: '/placeholder-avatar.png',
          badges: ['follower']
        },
        message: chatMessage,
        timestamp: new Date(),
        type: 'message'
      }
      setChatMessages(prev => [...prev, newMessage])
      setChatMessage('')
    }
  }

  const startStream = () => {
    // In a real app, this would initialize the streaming SDK
    setIsStreaming(true)
  }

  const stopStream = () => {
    setIsStreaming(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Center</h1>
          <p className="text-muted-foreground">
            Transmita ao vivo e participe de eventos exclusivos
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Evento
          </Button>
          <Button>
            <Radio className="w-4 h-4 mr-2" />
            Iniciar Live
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="discover">Descobrir</TabsTrigger>
          <TabsTrigger value="following">Seguindo</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="studio">Meu Studio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar lives e criadores..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {STREAM_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Featured Stream */}
          {liveStreams[0] && (
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FeaturedStreamPlayer stream={liveStreams[0]} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={liveStreams[0].streamer.avatar} />
                      <AvatarFallback>
                        {liveStreams[0].streamer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{liveStreams[0].streamer.name}</h3>
                        {liveStreams[0].streamer.isVerified && (
                          <Star className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {liveStreams[0].streamer.followers.toLocaleString()} seguidores
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{liveStreams[0].title}</h2>
                  <p className="text-muted-foreground mb-4">{liveStreams[0].description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {liveStreams[0].tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {liveStreams[0].viewerCount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {liveStreams[0].likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(liveStreams[0].duration)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <UserPlus className="w-4 h-4 mr-2" />
                      {liveStreams[0].isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                    <Button variant="outline">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Live Streams Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Lives Populares</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.slice(1).map(stream => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams
              .filter(stream => stream.isFollowing)
              .map(stream => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="studio" className="space-y-6">
          {!isStreaming ? (
            <StreamSetup
              settings={streamSettings}
              onSettingsChange={setStreamSettings}
              onStartStream={startStream}
            />
          ) : (
            <LiveStudioInterface
              settings={streamSettings}
              onStopStream={stopStream}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isVideoOff={isVideoOff}
              setIsVideoOff={setIsVideoOff}
              chatMessages={chatMessages}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
              onSendMessage={handleSendMessage}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <StreamAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Featured Stream Player Component
const FeaturedStreamPlayer: React.FC<{ stream: LiveStream }> = ({ stream }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState([80])
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted={isMuted}
        poster={stream.thumbnail}
      >
        <source src="/placeholder-video.mp4" type="video/mp4" />
      </video>

      {/* Live indicator */}
      <div className="absolute top-4 left-4">
        <Badge variant="destructive" className="animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mr-1" />
          AO VIVO
        </Badge>
      </div>

      {/* Quality indicator */}
      <div className="absolute top-4 right-4">
        <Badge variant="secondary">{stream.quality}</Badge>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <div className="w-16">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-white text-sm">
              {stream.viewerCount.toLocaleString()} assistindo
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stream Card Component
const StreamCard: React.FC<{ stream: LiveStream }> = ({ stream }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <div className="aspect-video bg-muted">
          <Image
            src={stream.thumbnail}
            alt={stream.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="absolute top-2 left-2">
          <Badge variant="destructive" className="text-xs">
            AO VIVO
          </Badge>
        </div>
        
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {stream.viewerCount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/60 px-2 py-1 rounded">
          {formatDuration(stream.duration)}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={stream.streamer.avatar} />
            <AvatarFallback>
              {stream.streamer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium line-clamp-2 mb-1">{stream.title}</h4>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm text-muted-foreground">{stream.streamer.name}</span>
              {stream.streamer.isVerified && (
                <Star className="w-3 h-3 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{stream.category}</span>
              <span>•</span>
              <span>{stream.likes} likes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Event Card Component
const EventCard: React.FC<{ event: LiveEvent }> = ({ event }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-32">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        {event.isPaid && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">
              R$ {event.price?.toFixed(2)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{event.category}</Badge>
          <Badge variant={event.type === 'workshop' ? 'default' : 'secondary'}>
            {event.type}
          </Badge>
        </div>

        <h4 className="font-semibold mb-2">{event.title}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span>{event.startTime.toLocaleDateString('pt-BR')}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{event.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm">
            <Users className="w-4 h-4" />
            <span>{event.currentParticipants} participantes</span>
          </div>
          {event.maxParticipants && (
            <span className="text-xs text-muted-foreground">
              máx. {event.maxParticipants}
            </span>
          )}
        </div>

        <Button className="w-full" disabled={event.isRegistered}>
          {event.isRegistered ? 'Registrado' : 'Participar'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Stream Setup Component
const StreamSetup: React.FC<{
  settings: StreamSettings
  onSettingsChange: (settings: StreamSettings) => void
  onStartStream: () => void
}> = ({ settings, onSettingsChange, onStartStream }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Live</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título da Live</Label>
            <Input
              value={settings.title}
              onChange={(e) => onSettingsChange({ ...settings, title: e.target.value })}
              placeholder="Digite o título da sua live..."
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={settings.description}
              onChange={(e) => onSettingsChange({ ...settings, description: e.target.value })}
              placeholder="Descreva o que você vai abordar..."
              rows={3}
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <Select
              value={settings.category}
              onValueChange={(value) => onSettingsChange({ ...settings, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {STREAM_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Privacidade</Label>
            <Select
              value={settings.privacy}
              onValueChange={(value) => onSettingsChange({ ...settings, privacy: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Público
                  </div>
                </SelectItem>
                <SelectItem value="followers">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Apenas Seguidores
                  </div>
                </SelectItem>
                <SelectItem value="subscribers">
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Apenas Assinantes
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Qualidade</Label>
            <Select
              value={settings.quality}
              onValueChange={(value) => onSettingsChange({ ...settings, quality: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p HD</SelectItem>
                <SelectItem value="1080p">1080p Full HD</SelectItem>
                <SelectItem value="4K">4K Ultra HD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Permitir chat</Label>
              <Switch
                checked={settings.allowChat}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, allowChat: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Moderar chat</Label>
              <Switch
                checked={settings.moderateChat}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, moderateChat: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Permitir gorjetas</Label>
              <Switch
                checked={settings.allowTips}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, allowTips: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Gravar live</Label>
              <Switch
                checked={settings.enableRecording}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, enableRecording: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview da Câmera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-12 h-12 mx-auto mb-2" />
              <p>Câmera desconectada</p>
              <p className="text-sm text-gray-400">Conecte sua câmera para começar</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Testar Câmera
              </Button>
              <Button variant="outline" className="flex-1">
                <Mic className="w-4 h-4 mr-2" />
                Testar Áudio
              </Button>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={onStartStream}
              disabled={!settings.title || !settings.category}
            >
              <Radio className="w-4 h-4 mr-2" />
              Iniciar Transmissão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Live Studio Interface Component
const LiveStudioInterface: React.FC<{
  settings: StreamSettings
  onStopStream: () => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  isVideoOff: boolean
  setIsVideoOff: (off: boolean) => void
  chatMessages: ChatMessage[]
  chatMessage: string
  setChatMessage: (message: string) => void
  onSendMessage: () => void
}> = ({
  settings,
  onStopStream,
  isMuted,
  setIsMuted,
  isVideoOff,
  setIsVideoOff,
  chatMessages,
  chatMessage,
  setChatMessage,
  onSendMessage
}) => {
  const chatEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Stream View */}
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 mx-auto mb-4" />
                    <p>Câmera desligada</p>
                  </div>
                </div>
              ) : (
                <video className="w-full h-full object-cover" autoPlay muted />
              )}

              {/* Live indicator */}
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  AO VIVO
                </Badge>
              </div>

              {/* Stream info */}
              <div className="absolute top-4 right-4 space-y-2">
                <Badge variant="secondary">156 assistindo</Badge>
                <Badge variant="secondary">45 likes</Badge>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 bg-black/80 rounded-full p-2">
                  <Button
                    size="sm"
                    variant={isMuted ? "destructive" : "secondary"}
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full"
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  <Button
                    size="sm"
                    variant={isVideoOff ? "destructive" : "secondary"}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className="rounded-full"
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onStopStream}
                    className="rounded-full"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stream Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Assistindo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Novos Seguidores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">R$ 38</div>
              <div className="text-sm text-muted-foreground">Gorjetas</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat */}
      <div className="lg:col-span-1">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Chat da Live</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(message => (
                <div key={message.id}>
                  {message.type === 'message' && (
                    <div className="flex gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={message.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {message.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium truncate">
                            {message.user.name}
                          </span>
                          {message.user.badges.map(badge => (
                            <div key={badge}>
                              {getBadgeIcon(badge)}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm break-words">{message.message}</p>
                      </div>
                    </div>
                  )}

                  {message.type === 'tip' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">
                          {message.user.name} enviou R$ {message.amount}
                        </span>
                      </div>
                    </div>
                  )}

                  {message.type === 'follow' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {message.user.name} começou a seguir!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                  className="flex-1"
                />
                <Button size="sm" onClick={onSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Stream Analytics Component
const StreamAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Lives</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Video className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Horas Transmitidas</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações Totais</p>
                <p className="text-2xl font-bold">15.2K</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita de Lives</p>
                <p className="text-2xl font-bold">R$ 1.2K</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance das Lives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Audiência média por live</span>
              <span className="font-medium">156 espectadores</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tempo médio de visualização</span>
              <span className="font-medium">12 minutos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa de engagement</span>
              <span className="font-medium">8.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Novos seguidores por live</span>
              <span className="font-medium">23 seguidores</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}