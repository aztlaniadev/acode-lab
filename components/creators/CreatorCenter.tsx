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
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare,
  Share2,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  Crown,
  Zap,
  Gift,
  Target,
  Trophy,
  Sparkles,
  Coins,
  CreditCard,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Video,
  Image as ImageIcon,
  Mic,
  FileText,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  Plus,
  Search
} from 'lucide-react'

interface CreatorProfile {
  id: string
  isVerified: boolean
  tier: 'emerging' | 'rising' | 'established' | 'elite'
  followers: number
  totalViews: number
  totalLikes: number
  totalShares: number
  monthlyEarnings: number
  subscription: {
    isEnabled: boolean
    price: number
    subscribers: number
    tiers: SubscriptionTier[]
  }
  achievements: Achievement[]
  analytics: CreatorAnalytics
}

interface SubscriptionTier {
  id: string
  name: string
  description: string
  price: number
  perks: string[]
  subscribers: number
  isActive: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface CreatorAnalytics {
  posts: {
    total: number
    thisMonth: number
    avgEngagement: number
    topPerforming: Array<{
      id: string
      title: string
      views: number
      engagement: number
    }>
  }
  audience: {
    demographics: {
      age: Record<string, number>
      gender: Record<string, number>
      location: Record<string, number>
    }
    growth: Array<{
      date: string
      followers: number
      engagement: number
    }>
  }
  revenue: {
    total: number
    thisMonth: number
    sources: {
      subscriptions: number
      tips: number
      sponsorships: number
      merchandise: number
    }
    trends: Array<{
      date: string
      amount: number
    }>
  }
}

interface ContentPlan {
  id: string
  title: string
  description: string
  scheduledDate: Date
  type: 'post' | 'video' | 'live' | 'story'
  status: 'draft' | 'scheduled' | 'published'
  tags: string[]
  targetAudience: string[]
}

interface Sponsorship {
  id: string
  brand: string
  brandLogo: string
  title: string
  description: string
  budget: number
  deadline: Date
  requirements: string[]
  status: 'pending' | 'accepted' | 'completed' | 'rejected'
  category: string
}

export const CreatorCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const [creatorProfile] = useState<CreatorProfile>({
    id: '1',
    isVerified: true,
    tier: 'rising',
    followers: 25400,
    totalViews: 1240000,
    totalLikes: 89000,
    totalShares: 12400,
    monthlyEarnings: 3250,
    subscription: {
      isEnabled: true,
      price: 9.99,
      subscribers: 840,
      tiers: [
        {
          id: '1',
          name: 'Apoiador',
          description: 'Acesso a conteúdo exclusivo',
          price: 4.99,
          perks: ['Conteúdo exclusivo', 'Badge especial', 'Acesso antecipado'],
          subscribers: 320,
          isActive: true
        },
        {
          id: '2',
          name: 'VIP',
          description: 'Todos os benefícios + interação direta',
          price: 9.99,
          perks: ['Todos do Apoiador', 'Lives exclusivas', 'Mensagens diretas', 'Feedback em projetos'],
          subscribers: 180,
          isActive: true
        },
        {
          id: '3',
          name: 'Elite',
          description: 'Mentoria e consultoria 1:1',
          price: 29.99,
          perks: ['Todos do VIP', 'Mentoria mensal', 'Review de código', 'Consultoria 1:1'],
          subscribers: 45,
          isActive: true
        }
      ]
    },
    achievements: [
      {
        id: '1',
        title: 'Primeira Verificação',
        description: 'Conta verificada pela primeira vez',
        icon: '✅',
        unlockedAt: new Date('2023-06-15'),
        rarity: 'epic'
      },
      {
        id: '2',
        title: '10K Seguidores',
        description: 'Alcançou 10.000 seguidores',
        icon: '🎯',
        unlockedAt: new Date('2023-09-22'),
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Criador do Mês',
        description: 'Escolhido como criador destaque do mês',
        icon: '👑',
        unlockedAt: new Date('2023-11-01'),
        rarity: 'legendary'
      }
    ],
    analytics: {
      posts: {
        total: 247,
        thisMonth: 18,
        avgEngagement: 7.8,
        topPerforming: [
          { id: '1', title: 'React 18 - Principais Novidades', views: 15400, engagement: 12.3 },
          { id: '2', title: 'Como construir um portfólio incrível', views: 12800, engagement: 10.8 },
          { id: '3', title: 'TypeScript para iniciantes', views: 11200, engagement: 9.5 }
        ]
      },
      audience: {
        demographics: {
          age: { '18-24': 35, '25-34': 45, '35-44': 15, '45+': 5 },
          gender: { 'Masculino': 65, 'Feminino': 32, 'Outro': 3 },
          location: { 'Brasil': 70, 'Portugal': 15, 'EUA': 10, 'Outros': 5 }
        },
        growth: []
      },
      revenue: {
        total: 18750,
        thisMonth: 3250,
        sources: {
          subscriptions: 2100,
          tips: 450,
          sponsorships: 600,
          merchandise: 100
        },
        trends: []
      }
    }
  })

  const [contentPlan] = useState<ContentPlan[]>([
    {
      id: '1',
      title: 'Tutorial: Next.js 14 App Router',
      description: 'Tutorial completo sobre o novo App Router do Next.js 14',
      scheduledDate: new Date('2024-01-20T10:00:00'),
      type: 'video',
      status: 'scheduled',
      tags: ['Next.js', 'Tutorial', 'React'],
      targetAudience: ['Desenvolvedores', 'Frontend']
    },
    {
      id: '2',
      title: 'Live: Q&A sobre carreira em tech',
      description: 'Sessão de perguntas e respostas sobre carreira',
      scheduledDate: new Date('2024-01-22T19:00:00'),
      type: 'live',
      status: 'scheduled',
      tags: ['Carreira', 'Q&A', 'Tech'],
      targetAudience: ['Iniciantes', 'Profissionais']
    }
  ])

  const [sponsorships] = useState<Sponsorship[]>([
    {
      id: '1',
      brand: 'TechCorp',
      brandLogo: '/placeholder-brand.png',
      title: 'Patrocínio para Tutorial React',
      description: 'Criação de conteúdo educativo sobre React para desenvolvedores iniciantes',
      budget: 1500,
      deadline: new Date('2024-02-15'),
      requirements: ['Mínimo 10k views', 'Mencionar produto 3x', 'CTA no final'],
      status: 'pending',
      category: 'Educacional'
    },
    {
      id: '2',
      brand: 'DevTools',
      brandLogo: '/placeholder-brand.png',
      title: 'Review de Ferramenta de Desenvolvimento',
      description: 'Review honesto da nova ferramenta de desenvolvimento da DevTools',
      budget: 800,
      deadline: new Date('2024-01-30'),
      requirements: ['Review detalhado', 'Prós e contras', 'Demonstração prática'],
      status: 'accepted',
      category: 'Review'
    }
  ])

  const getTierInfo = (tier: string) => {
    const tiers = {
      emerging: { name: 'Emergente', color: 'bg-gray-100 text-gray-800', icon: '🌱' },
      rising: { name: 'Crescente', color: 'bg-blue-100 text-blue-800', icon: '📈' },
      established: { name: 'Estabelecido', color: 'bg-purple-100 text-purple-800', icon: '⭐' },
      elite: { name: 'Elite', color: 'bg-yellow-100 text-yellow-800', icon: '👑' }
    }
    return tiers[tier as keyof typeof tiers]
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-yellow-100 text-yellow-800'
    }
    return colors[rarity as keyof typeof colors]
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Creator Center</h1>
              {creatorProfile.isVerified && (
                <CheckCircle className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getTierInfo(creatorProfile.tier).color}>
                {getTierInfo(creatorProfile.tier).icon} {getTierInfo(creatorProfile.tier).name}
              </Badge>
              <span className="text-muted-foreground">
                {creatorProfile.followers.toLocaleString()} seguidores
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Criar Conteúdo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="monetization">Monetização</TabsTrigger>
          <TabsTrigger value="sponsorships">Parcerias</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ganhos do Mês</p>
                    <p className="text-2xl font-bold">R$ {creatorProfile.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">+12.5%</span>
                  <span className="text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visualizações</p>
                    <p className="text-2xl font-bold">{(creatorProfile.totalViews / 1000000).toFixed(1)}M</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-blue-500">+8.2%</span>
                  <span className="text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Assinantes</p>
                    <p className="text-2xl font-bold">{creatorProfile.subscription.subscribers}</p>
                  </div>
                  <Crown className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-purple-500">+24.1%</span>
                  <span className="text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engajamento</p>
                    <p className="text-2xl font-bold">{creatorProfile.analytics.posts.avgEngagement}%</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500">+5.7%</span>
                  <span className="text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Posts com Melhor Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {creatorProfile.analytics.posts.topPerforming.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.views.toLocaleString()} views • {post.engagement}% engagement
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Próximo Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentPlan.slice(0, 3).map(content => (
                  <div key={content.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {content.type === 'video' && <Video className="w-4 h-4" />}
                        {content.type === 'live' && <Mic className="w-4 h-4" />}
                        {content.type === 'post' && <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{content.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {content.scheduledDate.toLocaleDateString('pt-BR')} às {content.scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={content.status === 'scheduled' ? 'default' : 'secondary'}>
                      {content.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Fontes de Receita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assinaturas</span>
                    <span className="font-medium">R$ {creatorProfile.analytics.revenue.sources.subscriptions}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gorjetas</span>
                    <span className="font-medium">R$ {creatorProfile.analytics.revenue.sources.tips}</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patrocínios</span>
                    <span className="font-medium">R$ {creatorProfile.analytics.revenue.sources.sponsorships}</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Audience Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Demografia da Audiência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Faixa Etária</h4>
                  {Object.entries(creatorProfile.analytics.audience.demographics.age).map(([age, percentage]) => (
                    <div key={age} className="flex justify-between items-center mb-2">
                      <span className="text-sm">{age}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Localização</h4>
                  {Object.entries(creatorProfile.analytics.audience.demographics.location).map(([location, percentage]) => (
                    <div key={location} className="flex justify-between items-center mb-2">
                      <span className="text-sm">{location}</span>
                      <span className="text-xs text-muted-foreground">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Métricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{creatorProfile.analytics.posts.total}</div>
                  <div className="text-sm text-muted-foreground">Posts Totais</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{creatorProfile.analytics.posts.thisMonth}</div>
                  <div className="text-sm text-muted-foreground">Posts Este Mês</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{creatorProfile.analytics.posts.avgEngagement}%</div>
                  <div className="text-sm text-muted-foreground">Engajamento Médio</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Planejamento de Conteúdo</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agendar Conteúdo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentPlan.map(content => (
              <Card key={content.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {content.type === 'video' && <Video className="w-4 h-4" />}
                      {content.type === 'live' && <Mic className="w-4 h-4" />}
                      {content.type === 'post' && <FileText className="w-4 h-4" />}
                      <Badge variant={content.status === 'scheduled' ? 'default' : 'secondary'}>
                        {content.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h4 className="font-medium mb-2">{content.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {content.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Clock className="w-3 h-3" />
                    {content.scheduledDate.toLocaleDateString('pt-BR')} às {content.scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {content.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    {content.status === 'scheduled' && (
                      <Button size="sm" className="flex-1">
                        <Play className="w-3 h-3 mr-1" />
                        Publicar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Planos de Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Label>Assinaturas Habilitadas</Label>
                  <Switch checked={creatorProfile.subscription.isEnabled} />
                </div>
                
                {creatorProfile.subscription.tiers.map(tier => (
                  <div key={tier.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{tier.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">R$ {tier.price}</span>
                        <Switch checked={tier.isActive} />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {tier.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{tier.subscribers} assinantes</span>
                    </div>
                    
                    <ul className="text-xs space-y-1">
                      {tier.perks.slice(0, 3).map((perk, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Plano
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Visão Geral da Receita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    R$ {creatorProfile.analytics.revenue.thisMonth.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Este mês</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Assinaturas</span>
                    </div>
                    <span className="font-medium">R$ {creatorProfile.analytics.revenue.sources.subscriptions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-500" />
                      <span className="text-sm">Gorjetas</span>
                    </div>
                    <span className="font-medium">R$ {creatorProfile.analytics.revenue.sources.tips}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Patrocínios</span>
                    </div>
                    <span className="font-medium">R$ {creatorProfile.analytics.revenue.sources.sponsorships}</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Configurar Pagamentos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tips Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Configuração de Gorjetas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[5, 10, 25, 50].map(amount => (
                  <div key={amount} className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold">R$ {amount}</div>
                    <div className="text-xs text-muted-foreground">Valor sugerido</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <Label>Mensagem de agradecimento personalizada</Label>
                <Textarea 
                  placeholder="Obrigado pelo apoio! Sua gorjeta me motiva a continuar criando conteúdo de qualidade..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsorships" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Oportunidades de Parceria</h3>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Procurar Marcas
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sponsorships.map(sponsorship => (
              <Card key={sponsorship.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border">
                      <Image
                        src={sponsorship.brandLogo}
                        alt={sponsorship.brand}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{sponsorship.title}</h4>
                        <Badge variant={
                          sponsorship.status === 'pending' ? 'secondary' :
                          sponsorship.status === 'accepted' ? 'default' :
                          sponsorship.status === 'completed' ? 'default' : 'destructive'
                        }>
                          {sponsorship.status === 'pending' && 'Pendente'}
                          {sponsorship.status === 'accepted' && 'Aceito'}
                          {sponsorship.status === 'completed' && 'Concluído'}
                          {sponsorship.status === 'rejected' && 'Rejeitado'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {sponsorship.brand} • {sponsorship.category}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-medium">R$ {sponsorship.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{sponsorship.deadline.toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{sponsorship.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <Label className="text-xs font-medium">Requisitos:</Label>
                    <ul className="text-xs space-y-1">
                      {sponsorship.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    {sponsorship.status === 'pending' && (
                      <>
                        <Button size="sm" className="flex-1">
                          Aceitar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Recusar
                        </Button>
                      </>
                    )}
                    
                    {sponsorship.status === 'accepted' && (
                      <Button size="sm" className="w-full">
                        <Play className="w-3 h-3 mr-1" />
                        Iniciar Projeto
                      </Button>
                    )}
                    
                    {sponsorship.status === 'completed' && (
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Resultados
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatorProfile.achievements.map(achievement => (
              <Card key={achievement.id} className="overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  
                  <div className="mb-2">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                      {achievement.rarity === 'common' && 'Comum'}
                      {achievement.rarity === 'rare' && 'Raro'}
                      {achievement.rarity === 'epic' && 'Épico'}
                      {achievement.rarity === 'legendary' && 'Lendário'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    Desbloqueado em {achievement.unlockedAt.toLocaleDateString('pt-BR')}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Locked Achievements */}
            <Card className="overflow-hidden opacity-50">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h4 className="font-semibold mb-2">Conquista Bloqueada</h4>
                <p className="text-sm text-muted-foreground">
                  Continue criando conteúdo para desbloquear mais conquistas!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Progresso das Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">100K Seguidores</span>
                  <span className="text-sm text-muted-foreground">25.4K / 100K</span>
                </div>
                <Progress value={25.4} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">1M Visualizações</span>
                  <span className="text-sm text-muted-foreground">1.24M / 1M ✓</span>
                </div>
                <Progress value={100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Streamer Ativo</span>
                  <span className="text-sm text-muted-foreground">3 / 10 lives</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}