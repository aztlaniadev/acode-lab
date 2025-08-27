"use client"

import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Users, 
  Briefcase, 
  Code, 
  Search, 
  Award,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Star,
  ArrowRight
} from 'lucide-react'

/**
 * Seção de funcionalidades principais da plataforma
 * Apresenta as três funcionalidades principais: Fórum, Rede Social e Freelancer
 */
export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Fórum Q&A',
      description: 'Faça perguntas e obtenha respostas da comunidade de desenvolvedores',
      highlights: [
        'Sistema de votação e reputação',
        'Marcação de respostas aceitas',
        'Categorização por tecnologias',
        'Busca avançada e filtros'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'Popular',
      cta: 'Explorar Fórum'
    },
    {
      icon: Users,
      title: 'Rede Social',
      description: 'Conecte-se com outros desenvolvedores e compartilhe conhecimento',
      highlights: [
        'Perfis profissionais detalhados',
        'Feed de atividades personalizado',
        'Grupos e comunidades',
        'Sistema de conexões'
      ],
      color: 'from-purple-500 to-pink-500',
      badge: 'Novo',
      cta: 'Conectar-se'
    },
    {
      icon: Briefcase,
      title: 'Marketplace Freelancer',
      description: 'Encontre projetos ou ofereça seus serviços de desenvolvimento',
      highlights: [
        'Projetos verificados e seguros',
        'Sistema de pagamento protegido',
        'Avaliações e portfólio',
        'Matching inteligente'
      ],
      color: 'from-green-500 to-emerald-500',
      badge: 'Em Alta',
      cta: 'Ver Projetos'
    }
  ]

  const stats = [
    { icon: TrendingUp, value: '95%', label: 'Taxa de Resolução' },
    { icon: Heart, value: '98%', label: 'Satisfação' },
    { icon: Star, value: '4.9/5', label: 'Avaliação' },
    { icon: Shield, value: '100%', label: 'Seguro' }
  ]

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            ✨ Funcionalidades
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Tudo que você precisa em{' '}
            <span className="gradient-text">uma plataforma</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Acode Lab combina as melhores funcionalidades de fórum, rede social e marketplace 
            para criar a experiência definitiva para desenvolvedores.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    {feature.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 border shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Por que escolher o Acode Lab?
            </h3>
            <p className="text-muted-foreground">
              Números que falam por si mesmos
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para começar?
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se a milhares de desenvolvedores que já estão transformando suas carreiras 
              com o Acode Lab.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Criar Conta Gratuita
                <Zap className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Saiba Mais
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




