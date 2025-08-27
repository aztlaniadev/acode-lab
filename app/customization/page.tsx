"use client"

import React from 'react'
import { useCopperTheme, CopperButton, CopperCard, CopperGradientText } from '@/lib/copper-theme'
import { Button } from '@/components/ui/button'
import { 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Crown,
  Star,
  Zap
} from 'lucide-react'

export default function CustomizationPage() {
  const { mode, toggleMode } = useCopperTheme()

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-copper-100 to-copper-50 dark:from-copper-900 dark:to-copper-800 border border-copper-200 dark:border-copper-700 rounded-full px-4 py-2 mb-6">
            <Crown className="w-4 h-4 text-copper-500" />
            <span className="text-sm font-medium text-copper-700 dark:text-copper-300">
              Design Premium
            </span>
          </div>
          
          <h1 className="heading-display text-4xl md:text-6xl mb-4">
            <CopperGradientText>
              Personalização
            </CopperGradientText>
          </h1>
          
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Experimente nossa paleta de cores premium com tons de 
            <CopperGradientText className="font-semibold">
              {" "}cobre, preto e branco
            </CopperGradientText>
          </p>
        </div>

        {/* Theme Controls */}
        <CopperCard variant="premium" className="p-8 text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Palette className="w-8 h-8 text-copper-500 mr-3" />
            <CopperGradientText className="text-2xl font-bold">
              Controles de Tema
            </CopperGradientText>
          </div>
          
          <div className="flex justify-center space-x-4">
            <CopperButton
              variant={mode === 'light' ? 'primary' : 'outline'}
              onClick={() => mode === 'dark' && toggleMode()}
              className="flex items-center space-x-2"
            >
              <Sun className="w-4 h-4" />
              <span>Modo Claro</span>
            </CopperButton>
            
            <CopperButton
              variant={mode === 'dark' ? 'primary' : 'outline'}
              onClick={() => mode === 'light' && toggleMode()}
              className="flex items-center space-x-2"
            >
              <Moon className="w-4 h-4" />
              <span>Modo Escuro</span>
            </CopperButton>
          </div>
        </CopperCard>

        {/* Color Palette Demo */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <CopperCard variant="premium" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-copper-500 mr-2" />
              Paleta de Cobre
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="text-center">
                  <div 
                    className={`w-full h-12 rounded-lg mb-2`}
                    style={{ backgroundColor: `var(--copper-${shade})` }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    {shade}
                  </span>
                </div>
              ))}
            </div>
          </CopperCard>

          <CopperCard variant="premium" className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="w-5 h-5 text-copper-500 mr-2" />
              Tons Neutros
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="text-center">
                  <div 
                    className={`w-full h-12 rounded-lg mb-2`}
                    style={{ backgroundColor: `var(--neutral-${shade})` }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    {shade}
                  </span>
                </div>
              ))}
            </div>
          </CopperCard>
        </div>

        {/* Component Demos */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <CopperCard variant="default" className="p-6">
            <h4 className="text-lg font-semibold mb-4">Botões Premium</h4>
            <div className="space-y-3">
              <CopperButton className="w-full">
                Primário
              </CopperButton>
              <CopperButton variant="outline" className="w-full">
                Contorno
              </CopperButton>
              <CopperButton variant="ghost" className="w-full">
                Fantasma
              </CopperButton>
            </div>
          </CopperCard>

          <CopperCard variant="premium" className="p-6">
            <h4 className="text-lg font-semibold mb-4">Cards Premium</h4>
            <div className="space-y-3">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Este é um card premium com gradiente sutil e bordas de cobre.
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-copper-500" />
                <span className="text-sm font-medium">Funcionalidade Premium</span>
              </div>
            </div>
          </CopperCard>

          <CopperCard variant="elegant" className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-copper-300">
              Card Elegante
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-neutral-300">
                Design escuro e sofisticado com acentos de cobre.
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-copper-400" />
                <span className="text-sm font-medium text-copper-300">Exclusivo</span>
              </div>
            </div>
          </CopperCard>
        </div>

        {/* Typography Demo */}
        <CopperCard variant="premium" className="p-8 text-center">
          <h2 className="heading-display text-3xl mb-4">
            <CopperGradientText>
              Tipografia Premium
            </CopperGradientText>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
            Combinação elegante de Inter e Playfair Display para uma experiência visual sofisticada.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold mb-2">Fonte Principal (Inter)</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Texto de interface limpo e legível, perfeito para usabilidade premium.
              </p>
            </div>
            <div>
              <h4 className="heading-elegant text-lg mb-2">Fonte Display (Playfair)</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Elegância clássica para títulos e elementos de destaque.
              </p>
            </div>
          </div>
        </CopperCard>
      </div>
    </div>
  )
}