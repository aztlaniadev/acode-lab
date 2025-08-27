"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
export interface Theme {
  id: string
  name: string
  displayName: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    input: string
    ring: string
    destructive: string
    warning: string
    success: string
  }
  fonts: {
    sans: string
    serif: string
    mono: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  animation: {
    duration: string
    easing: string
  }
  premium?: boolean
}

export interface ThemeContextType {
  theme: Theme
  themes: Theme[]
  setTheme: (themeId: string) => void
  customTheme: Partial<Theme> | null
  setCustomTheme: (theme: Partial<Theme>) => void
  resetTheme: () => void
  isDark: boolean
  toggleDarkMode: () => void
  fontSize: number
  setFontSize: (size: number) => void
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
}

// Default themes
const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'default',
    displayName: 'Padrão',
    description: 'Tema padrão limpo e moderno',
    colors: {
      primary: 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 96%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(222.2 84% 4.9%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      warning: 'hsl(38 92% 50%)',
      success: 'hsl(142 76% 36%)'
    },
    fonts: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, Consolas, monospace'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    animation: {
      duration: '200ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  {
    id: 'dark',
    name: 'dark',
    displayName: 'Escuro',
    description: 'Tema escuro elegante',
    colors: {
      primary: 'hsl(210 40% 98%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(212.7 26.8% 83.9%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      warning: 'hsl(38 92% 50%)',
      success: 'hsl(142 76% 36%)'
    },
    fonts: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, Consolas, monospace'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4)'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    animation: {
      duration: '200ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  {
    id: 'ocean',
    name: 'ocean',
    displayName: 'Oceano',
    description: 'Tons de azul inspirados no oceano',
    colors: {
      primary: 'hsl(200 100% 50%)',
      secondary: 'hsl(200 20% 95%)',
      accent: 'hsl(180 100% 85%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(200 50% 10%)',
      muted: 'hsl(200 20% 95%)',
      border: 'hsl(200 30% 85%)',
      input: 'hsl(200 30% 90%)',
      ring: 'hsl(200 100% 50%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      warning: 'hsl(38 92% 50%)',
      success: 'hsl(142 76% 36%)'
    },
    fonts: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, Consolas, monospace'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(59 130 246 / 0.1)',
      md: '0 4px 6px -1px rgb(59 130 246 / 0.2)',
      lg: '0 10px 15px -3px rgb(59 130 246 / 0.2)',
      xl: '0 20px 25px -5px rgb(59 130 246 / 0.2)'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    animation: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    premium: true
  },
  {
    id: 'sunset',
    name: 'sunset',
    displayName: 'Pôr do Sol',
    description: 'Cores quentes do pôr do sol',
    colors: {
      primary: 'hsl(25 95% 53%)',
      secondary: 'hsl(25 20% 95%)',
      accent: 'hsl(45 100% 85%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(25 50% 10%)',
      muted: 'hsl(25 20% 95%)',
      border: 'hsl(25 30% 85%)',
      input: 'hsl(25 30% 90%)',
      ring: 'hsl(25 95% 53%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      warning: 'hsl(38 92% 50%)',
      success: 'hsl(142 76% 36%)'
    },
    fonts: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, Consolas, monospace'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(249 115 22 / 0.1)',
      md: '0 4px 6px -1px rgb(249 115 22 / 0.2)',
      lg: '0 10px 15px -3px rgb(249 115 22 / 0.2)',
      xl: '0 20px 25px -5px rgb(249 115 22 / 0.2)'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    animation: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    premium: true
  },
  {
    id: 'forest',
    name: 'forest',
    displayName: 'Floresta',
    description: 'Verde natural e relaxante',
    colors: {
      primary: 'hsl(142 76% 36%)',
      secondary: 'hsl(142 20% 95%)',
      accent: 'hsl(120 100% 85%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(142 50% 10%)',
      muted: 'hsl(142 20% 95%)',
      border: 'hsl(142 30% 85%)',
      input: 'hsl(142 30% 90%)',
      ring: 'hsl(142 76% 36%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      warning: 'hsl(38 92% 50%)',
      success: 'hsl(142 76% 36%)'
    },
    fonts: {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, Consolas, monospace'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(34 197 94 / 0.1)',
      md: '0 4px 6px -1px rgb(34 197 94 / 0.2)',
      lg: '0 10px 15px -3px rgb(34 197 94 / 0.2)',
      xl: '0 20px 25px -5px rgb(34 197 94 / 0.2)'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    animation: {
      duration: '250ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    premium: true
  }
]

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0])
  const [customTheme, setCustomTheme] = useState<Partial<Theme> | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Load saved preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      const savedDarkMode = localStorage.getItem('darkMode')
      const savedFontSize = localStorage.getItem('fontSize')
      const savedReducedMotion = localStorage.getItem('reducedMotion')
      const savedHighContrast = localStorage.getItem('highContrast')
      const savedCustomTheme = localStorage.getItem('customTheme')

      if (savedTheme) {
        const theme = defaultThemes.find(t => t.id === savedTheme)
        if (theme) setCurrentTheme(theme)
      }

      if (savedDarkMode) {
        setIsDark(JSON.parse(savedDarkMode))
      }

      if (savedFontSize) {
        setFontSize(parseInt(savedFontSize))
      }

      if (savedReducedMotion) {
        setReducedMotion(JSON.parse(savedReducedMotion))
      }

      if (savedHighContrast) {
        setHighContrast(JSON.parse(savedHighContrast))
      }

      if (savedCustomTheme) {
        try {
          setCustomTheme(JSON.parse(savedCustomTheme))
        } catch (e) {
          console.warn('Failed to parse custom theme')
        }
      }

      // Detect system preferences
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      if (!savedDarkMode && prefersDark) {
        setIsDark(true)
      }
      
      if (!savedReducedMotion && prefersReducedMotion) {
        setReducedMotion(true)
      }
    }
  }, [])

  // Apply theme to CSS variables
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const theme = customTheme ? { ...currentTheme, ...customTheme } : currentTheme
    const finalTheme = isDark && theme.id === 'default' ? defaultThemes[1] : theme

    // Apply colors
    Object.entries(finalTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // Apply fonts
    Object.entries(finalTheme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value)
    })

    // Apply shadows
    Object.entries(finalTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    // Apply border radius
    Object.entries(finalTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })

    // Apply animation
    root.style.setProperty('--animation-duration', finalTheme.animation.duration)
    root.style.setProperty('--animation-easing', finalTheme.animation.easing)

    // Apply font size
    root.style.setProperty('--base-font-size', `${fontSize}px`)

    // Apply accessibility preferences
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0s')
    }

    if (highContrast) {
      root.style.setProperty('--contrast-modifier', '1.5')
    } else {
      root.style.setProperty('--contrast-modifier', '1')
    }

    // Apply dark mode class
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [currentTheme, customTheme, isDark, fontSize, reducedMotion, highContrast])

  // Save preferences
  const savePreferences = useCallback(() => {
    if (typeof window === 'undefined') return

    localStorage.setItem('theme', currentTheme.id)
    localStorage.setItem('darkMode', JSON.stringify(isDark))
    localStorage.setItem('fontSize', fontSize.toString())
    localStorage.setItem('reducedMotion', JSON.stringify(reducedMotion))
    localStorage.setItem('highContrast', JSON.stringify(highContrast))
    
    if (customTheme) {
      localStorage.setItem('customTheme', JSON.stringify(customTheme))
    } else {
      localStorage.removeItem('customTheme')
    }
  }, [currentTheme.id, isDark, fontSize, reducedMotion, highContrast, customTheme])

  useEffect(() => {
    savePreferences()
  }, [savePreferences])

  // Theme functions
  const setTheme = useCallback((themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const resetTheme = useCallback(() => {
    setCurrentTheme(defaultThemes[0])
    setCustomTheme(null)
    setIsDark(false)
    setFontSize(16)
    setReducedMotion(false)
    setHighContrast(false)
  }, [])

  const updateCustomTheme = useCallback((theme: Partial<Theme>) => {
    setCustomTheme(theme)
  }, [])

  const updateFontSize = useCallback((size: number) => {
    setFontSize(Math.max(12, Math.min(24, size)))
  }, [])

  const value: ThemeContextType = {
    theme: customTheme ? { ...currentTheme, ...customTheme } : currentTheme,
    themes: defaultThemes,
    setTheme,
    customTheme,
    setCustomTheme: updateCustomTheme,
    resetTheme,
    isDark,
    toggleDarkMode,
    fontSize,
    setFontSize: updateFontSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast
  }

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme.id + isDark.toString()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeContext.Provider>
  )
}

// Theme Selector Component
export const ThemeSelector = ({ onClose }: { onClose?: () => void }) => {
  const {
    theme,
    themes,
    setTheme,
    isDark,
    toggleDarkMode,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    resetTheme
  } = useTheme()

  return (
    <div className="w-80 p-4 space-y-6">
      {/* Current theme */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Personalização</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência da aplicação
        </p>
      </div>

      {/* Theme selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Tema</h4>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                theme.id === t.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: t.colors.primary }}
                />
                <span className="text-sm font-medium">{t.displayName}</span>
                {t.premium && (
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1 rounded">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {t.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Modo Escuro</h4>
          <p className="text-xs text-muted-foreground">
            Alterna entre tema claro e escuro
          </p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`w-12 h-6 rounded-full transition-colors ${
            isDark ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Font size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Tamanho da Fonte</h4>
          <span className="text-sm text-muted-foreground">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pequeno</span>
          <span>Grande</span>
        </div>
      </div>

      {/* Accessibility options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Acessibilidade</h4>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Reduzir Animações</span>
            <p className="text-xs text-muted-foreground">
              Desativa animações desnecessárias
            </p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-10 h-5 rounded-full transition-colors ${
              reducedMotion ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Alto Contraste</span>
            <p className="text-xs text-muted-foreground">
              Aumenta o contraste para melhor legibilidade
            </p>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-10 h-5 rounded-full transition-colors ${
              highContrast ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={resetTheme}
        className="w-full p-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
      >
        Restaurar Padrões
      </button>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full p-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Aplicar Configurações
        </button>
      )}
    </div>
  )
}