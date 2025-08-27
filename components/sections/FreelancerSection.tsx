"use client"

import React, { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'

/**
 * Seção de projetos freelancer em destaque
 * Mostra projetos ativos com filtros e sistema de busca
 */
export const FreelancerSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'Todos', count: 156 },
    { id: 'web', label: 'Web Development', count: 45 },
    { id: 'mobile', label: 'Mobile App', count: 32 },
    { id: 'ai', label: 'AI/ML', count: 28 },
    { id: 'design', label: 'UI/UX Design', count: 23 },
    { id: 'backend', label: 'Backend', count: 18 }
  ]

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform Development',
      description: 'Desenvolvimento de plataforma completa de e-commerce com React, Node.js e PostgreSQL',
      budget: '$5,000 - $8,000',
      duration: '2-3 meses',
      location: 'Remoto',
      category: 'web',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      client: {
        name: 'TechCorp Solutions',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
        rating: 4.9,
        projects: 24
      },
      proposals: 12,
      views: 156,
      isFeatured: true,
      isUrgent: true
    },
    {
      id: 2,
      title: 'AI-Powered Chatbot for Customer Service',
      description: 'Criação de chatbot inteligente usando machine learning para atendimento ao cliente',
      budget: '$3,000 - $5,000',
      duration: '1-2 meses',
      location: 'Remoto',
      category: 'ai',
      skills: ['Python', 'TensorFlow', 'NLP', 'API Integration'],
      client: {
        name: 'InnovateLab',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateLab',
        rating: 4.8,
        projects: 18
      },
      proposals: 8,
      views: 89,
      isFeatured: true,
      isUrgent: false
    },
    {
      id: 3,
      title: 'Mobile App for Fitness Tracking',
      description: 'Aplicativo móvel para rastreamento de fitness com React Native e Firebase',
      budget: '$4,000 - $6,000',
      duration: '2-3 meses',
      location: 'Remoto',
      category: 'mobile',
      skills: ['React Native', 'Firebase', 'Health APIs', 'Push Notifications'],
      client: {
        name: 'FitTech Pro',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitTech',
        rating: 4.7,
        projects: 31
      },
      proposals: 15,
      views: 203,
      isFeatured: false,
      isUrgent: true
    },
    {
      id: 4,
      title: 'UI/UX Redesign for SaaS Platform',
      description: 'Redesign completo da interface de usuário para plataforma SaaS existente',
      budget: '$2,500 - $4,000',
      duration: '1-2 meses',
      location: 'Remoto',
      category: 'design',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      client: {
        name: 'CloudFlow Systems',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CloudFlow',
        rating: 4.9,
        projects: 42
      },
      proposals: 6,
      views: 67,
      isFeatured: false,
      isUrgent: false
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            💼 Freelancer
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Projetos em <span className="gradient-text">Destaque</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Encontre os melhores projetos freelancer ou conecte-se com clientes 
            que precisam dos seus serviços de desenvolvimento.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{project.title}</CardTitle>
                          {project.isFeatured && (
                            <Badge variant="default" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                          {project.isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{project.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{project.proposals} propostas</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Client Info */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={project.client.avatar} />
                          <AvatarFallback>{project.client.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{project.client.name}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {project.client.rating} ({project.client.projects} projetos)
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {project.views}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Enviar Proposta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Ver Todos os Projetos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}




