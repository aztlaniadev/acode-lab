"use client"

import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Play, 
  Users, 
  MessageCircle, 
  Briefcase,
  Code,
  Star,
  Zap
} from 'lucide-react'

/**
 * Componente de background de vídeo que alterna entre vídeos
 */
const VideoBackground: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const videos = [
    '/videos/coders-discussing.mp4',
    '/videos/generation.mp4',
    '/videos/source-code.mp4'
  ]



  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }, 15000) // Aumentei para 15 segundos para dar mais tempo de apreciar cada vídeo

    return () => clearInterval(interval)
  }, [videos.length, isPaused])

  const handleVideoLoad = () => {
    setIsLoading(false);
  }

  const handleVideoError = () => {
    // Pula para o próximo vídeo em caso de erro
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {/* Overlay escuro para melhorar legibilidade do texto */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Vídeo de fundo */}
      <video
        key={videos[currentVideoIndex]}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onEnded={() => {
          if (!isPaused) {
            setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
          }
        }}

      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
      

      
      {/* Controles de vídeo */}
      <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
        <button
          onClick={togglePause}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all duration-200"
          title={isPaused ? 'Retomar vídeo' : 'Pausar vídeo'}
        >
          {isPaused ? (
            <Play className="h-4 w-4" />
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-1 h-4 bg-white rounded-full mr-1"></div>
              <div className="w-1 h-4 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>
      
      {/* Indicadores de vídeo */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentVideoIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            title={`Vídeo ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Nome do vídeo atual */}
      <div className="absolute bottom-16 left-4 z-20">
        <div className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full border border-white/20">
          <span className="text-white/80 text-xs font-medium">
            {currentVideoIndex === 0 && 'Desenvolvedores discutindo código'}
            {currentVideoIndex === 1 && 'Geração de código'}
            {currentVideoIndex === 2 && 'Código fonte'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Seção Hero principal da página inicial
 * Apresenta o conceito da plataforma com call-to-actions e estatísticas
 */
export const HeroSection: React.FC = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Desenvolvedores' },
    { icon: MessageCircle, value: '100K+', label: 'Discussões' },
    { icon: Briefcase, value: '10K+', label: 'Projetos' },
    { icon: Code, value: '1M+', label: 'Linhas de Código' },
  ]

  const features = [
    { icon: Star, title: 'Comunidade Ativa', description: 'Conecte-se com desenvolvedores experientes' },
    { icon: Zap, title: 'Respostas Rápidas', description: 'Obtenha ajuda em tempo real' },
    { icon: Briefcase, title: 'Oportunidades', description: 'Encontre projetos freelancer' },
  ]

  return (
    <section className="relative overflow-hidden py-2 lg:py-3">
      {/* Background de Vídeo */}
      <VideoBackground />
      
      {/* Background Elements adicionais */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-2">
            <Badge variant="outline" className="px-2 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm border-white/20 text-white">
              🚀 Nova plataforma
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-white drop-shadow-2xl">
            <span className="gradient-text">Conecte-se</span> com a{' '}
            <span className="gradient-text">comunidade</span>
          </h1>

          {/* Description */}
          <p className="text-xs md:text-sm text-white/90 max-w-xl mx-auto mb-3 leading-relaxed drop-shadow-lg">
            Acode Lab é a plataforma completa para desenvolvedores.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
            <Button size="sm" className="text-sm px-4 py-1 bg-white text-black hover:bg-white/90 shadow-lg">
              Começar
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="text-sm px-4 py-1 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              <Play className="mr-1 h-3 w-3" />
              Demo
            </Button>
          </div>

          {/* Stats - Apenas 1 linha */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {stats.slice(0, 2).map((stat, index) => (
              <div
                key={stat.label}
                className="text-center backdrop-blur-sm bg-white/10 rounded-md p-1 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center mb-1">
                  <div className="p-1 rounded-full bg-white/20">
                    <stat.icon className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}




