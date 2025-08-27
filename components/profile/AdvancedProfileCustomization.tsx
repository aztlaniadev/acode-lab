"use client"

import React, { useState, useRef } from 'react'
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
import { 
  User, 
  Camera, 
  Link as LinkIcon, 
  MapPin, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Plus,
  X,
  Save,
  Eye,
  Lock,
  Unlock,
  Palette,
  Layout
} from 'lucide-react'

interface SocialLink {
  id: string
  platform: string
  url: string
  verified: boolean
}

interface Portfolio {
  id: string
  title: string
  description: string
  image: string
  url: string
  tags: string[]
  featured: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  date: Date
  verified: boolean
}

interface ProfileCustomization {
  // Basic Info
  displayName: string
  username: string
  bio: string
  location: string
  website: string
  birthDate: string
  
  // Professional
  occupation: string
  company: string
  education: string
  skills: string[]
  
  // Visual
  avatar: string
  banner: string
  theme: {
    primaryColor: string
    accentColor: string
    backgroundStyle: 'solid' | 'gradient' | 'pattern'
    layout: 'minimal' | 'detailed' | 'creative'
  }
  
  // Social Links
  socialLinks: SocialLink[]
  
  // Portfolio
  portfolio: Portfolio[]
  
  // Achievements
  achievements: Achievement[]
  
  // Privacy
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private'
    showEmail: boolean
    showLocation: boolean
    showBirthDate: boolean
    showActivity: boolean
  }
  
  // Settings
  settings: {
    allowMessages: boolean
    allowCollaborations: boolean
    showOnlineStatus: boolean
    emailNotifications: boolean
  }
}

const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: Github, color: '#333' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, color: '#9146FF' },
]

const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'CSS', 'HTML',
  'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Express', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Figma', 'Photoshop'
]

export const AdvancedProfileCustomization: React.FC = () => {
  const [profile, setProfile] = useState<ProfileCustomization>({
    displayName: 'João Silva',
    username: 'joaosilva',
    bio: 'Desenvolvedor Full Stack apaixonado por tecnologia e inovação. Sempre em busca de novos desafios!',
    location: 'São Paulo, Brasil',
    website: 'https://joaosilva.dev',
    birthDate: '1990-01-01',
    occupation: 'Desenvolvedor Full Stack',
    company: 'Tech Solutions Inc.',
    education: 'Ciência da Computação - USP',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    avatar: '/placeholder-avatar.png',
    banner: '/placeholder-banner.jpg',
    theme: {
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      backgroundStyle: 'gradient',
      layout: 'detailed'
    },
    socialLinks: [
      { id: '1', platform: 'github', url: 'https://github.com/joaosilva', verified: true },
      { id: '2', platform: 'linkedin', url: 'https://linkedin.com/in/joaosilva', verified: false }
    ],
    portfolio: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Plataforma completa de e-commerce com React e Node.js',
        image: '/placeholder-project.jpg',
        url: 'https://github.com/joaosilva/ecommerce',
        tags: ['React', 'Node.js', 'MongoDB'],
        featured: true
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Contribuidor Open Source',
        description: 'Mais de 100 contribuições em projetos open source',
        icon: '🏆',
        date: new Date(),
        verified: true
      }
    ],
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true,
      showBirthDate: false,
      showActivity: true
    },
    settings: {
      allowMessages: true,
      allowCollaborations: true,
      showOnlineStatus: true,
      emailNotifications: true
    }
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [previewMode, setPreviewMode] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' })
  
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const updateProfile = (section: keyof ProfileCustomization, updates: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: typeof updates === 'object' && !Array.isArray(updates) && prev[section] && typeof prev[section] === 'object'
        ? { ...(prev[section] as Record<string, any>), ...updates }
        : updates
    }))
  }

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      updateProfile('skills', [...profile.skills, newSkill])
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    updateProfile('skills', profile.skills.filter(s => s !== skill))
  }

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      const newLink: SocialLink = {
        id: Date.now().toString(),
        platform: newSocialLink.platform,
        url: newSocialLink.url,
        verified: false
      }
      updateProfile('socialLinks', [...profile.socialLinks, newLink])
      setNewSocialLink({ platform: '', url: '' })
    }
  }

  const removeSocialLink = (id: string) => {
    updateProfile('socialLinks', profile.socialLinks.filter(link => link.id !== id))
  }

  const handleImageUpload = (type: 'avatar' | 'banner', file: File) => {
    // In a real app, this would upload to a storage service
    const reader = new FileReader()
    reader.onload = (e) => {
      updateProfile(type, e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personalização de Perfil</h1>
          <p className="text-muted-foreground">
            Customize seu perfil para mostrar sua personalidade e conquistas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Editar' : 'Visualizar'}
          </Button>
          
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Salvar Perfil
          </Button>
        </div>
      </div>

      {previewMode ? (
        // Profile Preview
        <div className="space-y-6">
          <ProfilePreview profile={profile} />
        </div>
      ) : (
        // Profile Editor
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Preview Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilePreview profile={profile} compact />
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Editor de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="professional">Profissional</TabsTrigger>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                    <TabsTrigger value="privacy">Privacidade</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome de Exibição</Label>
                        <Input
                          value={profile.displayName}
                          onChange={(e) => updateProfile('displayName', e.target.value)}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div>
                        <Label>Nome de Usuário</Label>
                        <Input
                          value={profile.username}
                          onChange={(e) => updateProfile('username', e.target.value)}
                          placeholder="seuusername"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => updateProfile('bio', e.target.value)}
                        placeholder="Conte um pouco sobre você..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Localização</Label>
                        <Input
                          value={profile.location}
                          onChange={(e) => updateProfile('location', e.target.value)}
                          placeholder="Cidade, País"
                        />
                      </div>
                      
                      <div>
                        <Label>Website</Label>
                        <Input
                          value={profile.website}
                          onChange={(e) => updateProfile('website', e.target.value)}
                          placeholder="https://seusite.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => updateProfile('birthDate', e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="professional" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ocupação</Label>
                        <Input
                          value={profile.occupation}
                          onChange={(e) => updateProfile('occupation', e.target.value)}
                          placeholder="Desenvolvedor, Designer, etc."
                        />
                      </div>
                      
                      <div>
                        <Label>Empresa</Label>
                        <Input
                          value={profile.company}
                          onChange={(e) => updateProfile('company', e.target.value)}
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Educação</Label>
                      <Input
                        value={profile.education}
                        onChange={(e) => updateProfile('education', e.target.value)}
                        placeholder="Curso - Instituição"
                      />
                    </div>

                    <div>
                      <Label>Habilidades</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Adicionar habilidade..."
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          />
                          <Button onClick={addSkill}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="cursor-pointer">
                              {skill}
                              <X 
                                className="w-3 h-3 ml-1"
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Sugestões: {SKILL_SUGGESTIONS.slice(0, 5).map(skill => (
                            <span
                              key={skill}
                              className="cursor-pointer hover:text-primary mr-2"
                              onClick={() => setNewSkill(skill)}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="visual" className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Avatar */}
                      <div>
                        <Label>Foto de Perfil</Label>
                        <div className="space-y-2">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border">
                            <Image
                              src={profile.avatar}
                              alt="Avatar"
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => avatarInputRef.current?.click()}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Alterar Foto
                          </Button>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload('avatar', file)
                            }}
                          />
                        </div>
                      </div>

                      {/* Banner */}
                      <div>
                        <Label>Banner do Perfil</Label>
                        <div className="space-y-2">
                          <div className="w-full h-32 rounded-lg overflow-hidden border">
                            <Image
                              src={profile.banner}
                              alt="Banner"
                              width={400}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => bannerInputRef.current?.click()}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Alterar Banner
                          </Button>
                          <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload('banner', file)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Theme Customization */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Personalização do Tema</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cor Primária</Label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={profile.theme.primaryColor}
                              onChange={(e) => updateProfile('theme', { primaryColor: e.target.value })}
                              className="w-12 h-10 border rounded"
                            />
                            <Input
                              value={profile.theme.primaryColor}
                              onChange={(e) => updateProfile('theme', { primaryColor: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Cor de Destaque</Label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={profile.theme.accentColor}
                              onChange={(e) => updateProfile('theme', { accentColor: e.target.value })}
                              className="w-12 h-10 border rounded"
                            />
                            <Input
                              value={profile.theme.accentColor}
                              onChange={(e) => updateProfile('theme', { accentColor: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Estilo do Fundo</Label>
                          <Select
                            value={profile.theme.backgroundStyle}
                            onValueChange={(value) => updateProfile('theme', { backgroundStyle: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">Sólido</SelectItem>
                              <SelectItem value="gradient">Gradiente</SelectItem>
                              <SelectItem value="pattern">Padrão</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Layout</Label>
                          <Select
                            value={profile.theme.layout}
                            onValueChange={(value) => updateProfile('theme', { layout: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimalista</SelectItem>
                              <SelectItem value="detailed">Detalhado</SelectItem>
                              <SelectItem value="creative">Criativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-6">
                    <div>
                      <Label>Links Sociais</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Select
                            value={newSocialLink.platform}
                            onValueChange={(value) => setNewSocialLink(prev => ({ ...prev, platform: value }))}
                          >
                            <SelectTrigger className="max-w-xs">
                              <SelectValue placeholder="Plataforma" />
                            </SelectTrigger>
                            <SelectContent>
                              {SOCIAL_PLATFORMS.map(platform => (
                                <SelectItem key={platform.id} value={platform.id}>
                                  <div className="flex items-center">
                                    <platform.icon className="w-4 h-4 mr-2" />
                                    {platform.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={newSocialLink.url}
                            onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="URL do perfil"
                            className="flex-1"
                          />
                          
                          <Button onClick={addSocialLink}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {profile.socialLinks.map(link => {
                            const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
                            if (!platform) return null
                            
                            return (
                              <div key={link.id} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center gap-3">
                                  <platform.icon 
                                    className="w-5 h-5" 
                                    style={{ color: platform.color }}
                                  />
                                  <div>
                                    <div className="font-medium">{platform.name}</div>
                                    <div className="text-sm text-muted-foreground">{link.url}</div>
                                  </div>
                                  {link.verified && (
                                    <Badge variant="secondary">Verificado</Badge>
                                  )}
                                </div>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSocialLink(link.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="portfolio" className="space-y-6">
                    <div>
                      <Label>Projetos em Destaque</Label>
                      <p className="text-sm text-muted-foreground">
                        Mostre seus melhores trabalhos e projetos
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {profile.portfolio.map(project => (
                          <div key={project.id} className="border rounded-lg p-4">
                            <div className="aspect-video bg-muted rounded mb-3">
                              <Image
                                src={project.image}
                                alt={project.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {project.featured && (
                                  <Star className="w-4 h-4 text-yellow-500" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {project.featured ? 'Destacado' : 'Projeto'}
                                </span>
                              </div>
                              
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Adicionar Projeto
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="privacy" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Visibilidade do Perfil</h4>
                      
                      <div>
                        <Label>Quem pode ver seu perfil?</Label>
                        <Select
                          value={profile.privacy.profileVisibility}
                          onValueChange={(value) => updateProfile('privacy', { profileVisibility: value })}
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
                                <User className="w-4 h-4 mr-2" />
                                Apenas Seguidores
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center">
                                <Lock className="w-4 h-4 mr-2" />
                                Privado
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium">Informações Visíveis</h5>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Mostrar email</Label>
                            <Switch
                              checked={profile.privacy.showEmail}
                              onCheckedChange={(checked) => 
                                updateProfile('privacy', { showEmail: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Mostrar localização</Label>
                            <Switch
                              checked={profile.privacy.showLocation}
                              onCheckedChange={(checked) => 
                                updateProfile('privacy', { showLocation: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Mostrar data de nascimento</Label>
                            <Switch
                              checked={profile.privacy.showBirthDate}
                              onCheckedChange={(checked) => 
                                updateProfile('privacy', { showBirthDate: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Mostrar atividade</Label>
                            <Switch
                              checked={profile.privacy.showActivity}
                              onCheckedChange={(checked) => 
                                updateProfile('privacy', { showActivity: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium">Configurações de Interação</h5>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Permitir mensagens</Label>
                            <Switch
                              checked={profile.settings.allowMessages}
                              onCheckedChange={(checked) => 
                                updateProfile('settings', { allowMessages: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Permitir colaborações</Label>
                            <Switch
                              checked={profile.settings.allowCollaborations}
                              onCheckedChange={(checked) => 
                                updateProfile('settings', { allowCollaborations: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Mostrar status online</Label>
                            <Switch
                              checked={profile.settings.showOnlineStatus}
                              onCheckedChange={(checked) => 
                                updateProfile('settings', { showOnlineStatus: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Notificações por email</Label>
                            <Switch
                              checked={profile.settings.emailNotifications}
                              onCheckedChange={(checked) => 
                                updateProfile('settings', { emailNotifications: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

// Profile Preview Component
const ProfilePreview: React.FC<{ 
  profile: ProfileCustomization
  compact?: boolean 
}> = ({ profile, compact = false }) => {
  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={profile.avatar}
              alt={profile.displayName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{profile.displayName}</h3>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
        </div>
        
        <p className="text-sm">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-1">
          {profile.skills.slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{profile.skills.length - 3}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div 
        className="h-48 bg-gradient-to-r from-primary to-accent relative"
        style={{
          background: profile.theme.backgroundStyle === 'gradient'
            ? `linear-gradient(135deg, ${profile.theme.primaryColor}, ${profile.theme.accentColor})`
            : profile.theme.primaryColor
        }}
      >
        <Image
          src={profile.banner}
          alt="Banner"
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="relative pt-0 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden">
            <Image
              src={profile.avatar}
              alt={profile.displayName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{profile.displayName}</h2>
          <p className="text-muted-foreground">@{profile.username}</p>
          
          {profile.occupation && (
            <div className="flex items-center justify-center mt-2">
              <Briefcase className="w-4 h-4 mr-1" />
              <span className="text-sm">{profile.occupation}</span>
              {profile.company && (
                <span className="text-sm text-muted-foreground"> @ {profile.company}</span>
              )}
            </div>
          )}
          
          {profile.privacy.showLocation && profile.location && (
            <div className="flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-center">{profile.bio}</p>
        </div>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Habilidades</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Links</h4>
            <div className="flex justify-center gap-3">
              {profile.socialLinks.map(link => {
                const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
                if (!platform) return null
                
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border hover:bg-accent transition-colors"
                  >
                    <platform.icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {profile.portfolio.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Projetos em Destaque</h4>
            <div className="grid grid-cols-2 gap-4">
              {profile.portfolio.slice(0, 4).map(project => (
                <div key={project.id} className="space-y-2">
                  <div className="aspect-video bg-muted rounded overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={200}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="text-sm font-medium">{project.title}</h5>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}