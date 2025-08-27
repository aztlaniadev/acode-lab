"use client"

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Star, 
  Users, 
  MessageSquare, 
  Zap, 
  Crown, 
  Sparkles,
  Play,
  Code,
  Palette,
  Trophy
} from 'lucide-react'
import { CopperButton, CopperCard, CopperGradientText } from '@/lib/copper-theme'

const FEATURES = [
  {
    icon: Code,
    title: 'Fórum de Desenvolvimento',
    description: 'Conecte-se com desenvolvedores e compartilhe conhecimento',
    color: 'from-copper-500 to-copper-400'
  },
  {
    icon: Users,
    title: 'Rede Social Premium',
    description: 'Construa sua presença profissional na comunidade tech',
    color: 'from-copper-600 to-copper-500'
  },
  {
    icon: Crown,
    title: 'Creator Center',
    description: 'Monetize seu conhecimento e crie conteúdo premium',
    color: 'from-copper-700 to-copper-600'
  },
  {
    icon: Palette,
    title: 'Personalização Total',
    description: 'Customize sua experiência com temas únicos',
    color: 'from-copper-400 to-copper-300'
  }
]

const STATS = [
  { value: '50K+', label: 'Desenvolvedores', icon: Users },
  { value: '1M+', label: 'Discussões', icon: MessageSquare },
  { value: '99.9%', label: 'Uptime', icon: Zap },
  { value: '4.9★', label: 'Avaliação', icon: Star }
]

export const CopperHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-copper-50/30 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800" />
      
      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-copper-300 to-copper-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-copper-400 to-copper-600 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-copper-200/30 to-copper-400/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Hero Content */}
        <div className="text-center mb-16">
          {/* Badge Premium */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-copper-100 to-copper-50 dark:from-copper-900 dark:to-copper-800 border border-copper-200 dark:border-copper-700 rounded-full px-4 py-2 mb-8 animate-fade-scale">
            <Sparkles className="w-4 h-4 text-copper-500" />
            <span className="text-sm font-medium text-copper-700 dark:text-copper-300">
              Plataforma Premium para Desenvolvedores
            </span>
            <Crown className="w-4 h-4 text-copper-500" />
          </div>

          {/* Main Heading */}
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl mb-6 animate-slide-up">
            <CopperGradientText>
              ACode Lab
            </CopperGradientText>
            <br />
            <span className="text-neutral-900 dark:text-neutral-100">
              Premium
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up">
            A plataforma mais elegante para desenvolvedores se conectarem, 
            compartilharem conhecimento e criarem conteúdo premium com 
            <CopperGradientText className="font-semibold">
              {" "}design sofisticado
            </CopperGradientText>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
            <CopperButton size="lg" className="group">
              <span>Começar Gratuitamente</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </CopperButton>
            
            <CopperButton variant="outline" size="lg" className="group">
              <Play className="w-5 h-5 mr-2" />
              <span>Ver Demo</span>
            </CopperButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up">
            {STATS.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-copper-500 to-copper-400 rounded-xl mb-3 copper-glow group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-copper-600 dark:text-copper-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <CopperCard 
                key={index} 
                variant="premium" 
                className="p-6 text-center hover-lift group animate-fade-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CopperCard>
            )
          })}
        </div>

        {/* Premium Banner */}
        <CopperCard variant="elegant" className="text-center p-8 hover-lift">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-copper-500 mr-3" />
            <CopperGradientText className="text-2xl font-bold">
              Experiência Premium
            </CopperGradientText>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
            Desfrute de uma interface elegante, funcionalidades avançadas e uma 
            comunidade exclusiva de desenvolvedores premium.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/social">
              <CopperButton variant="secondary">
                Rede Social
              </CopperButton>
            </Link>
            <Link href="/forum">
              <CopperButton variant="secondary">
                Fórum
              </CopperButton>
            </Link>
            <Link href="/creator">
              <CopperButton variant="secondary">
                <Crown className="w-4 h-4 mr-2" />
                Creator Center
              </CopperButton>
            </Link>
            <Link href="/customization">
              <CopperButton variant="secondary">
                <Palette className="w-4 h-4 mr-2" />
                Personalizar
              </CopperButton>
            </Link>
          </div>
        </CopperCard>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-copper-400 rounded-full animate-bounce opacity-60" />
      <div className="absolute top-1/3 right-16 w-6 h-6 bg-copper-300 rounded-full animate-bounce delay-500 opacity-40" />
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-copper-500 rounded-full animate-bounce delay-1000 opacity-50" />
    </section>
  )
}