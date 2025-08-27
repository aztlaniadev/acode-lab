"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

// Copper Design System - Paleta de cores inspirada em luxo e sofisticação
export const COPPER_DESIGN_SYSTEM = {
  colors: {
    // Cores primárias - Cobre
    copper: {
      50: '#fef7f0',
      100: '#feeee0',
      200: '#fcd4b6',
      300: '#f9b885',
      400: '#f59e4c',
      500: '#dc7633',  // Cobre principal
      600: '#c0622d',
      700: '#a14d24',
      800: '#83401e',
      900: '#6d341a',
      950: '#3b1a0c'
    },
    
    // Tons neutros - Preto e Branco sofisticados
    neutral: {
      0: '#ffffff',    // Branco puro
      50: '#fafafa',   // Branco off
      100: '#f5f5f5',  // Cinza muito claro
      200: '#e5e5e5',  // Cinza claro
      300: '#d4d4d4',  // Cinza médio claro
      400: '#a3a3a3',  // Cinza médio
      500: '#737373',  // Cinza escuro
      600: '#525252',  // Cinza muito escuro
      700: '#404040',  // Quase preto
      800: '#262626',  // Preto suave
      900: '#171717',  // Preto profundo
      950: '#0a0a0a'   // Preto puro
    },
    
    // Cores funcionais com toque de cobre
    semantic: {
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0891b2'
    },
    
    // Gradientes premium
    gradients: {
      copper: 'linear-gradient(135deg, #dc7633 0%, #f59e4c 50%, #fcd4b6 100%)',
      copperDark: 'linear-gradient(135deg, #a14d24 0%, #dc7633 50%, #f59e4c 100%)',
      elegant: 'linear-gradient(135deg, #171717 0%, #404040 50%, #dc7633 100%)',
      premium: 'linear-gradient(135deg, #0a0a0a 0%, #262626 25%, #dc7633 75%, #f59e4c 100%)',
      subtle: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #feeee0 100%)'
    }
  },
  
  // Tipografia premium
  typography: {
    fonts: {
      display: '"Playfair Display", "Georgia", serif',
      body: '"Inter", "SF Pro Display", "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", "Monaco", monospace'
    },
    scales: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900
    }
  },
  
  // Spacing system
  spacing: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem'
  },
  
  // Border radius system
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  // Shadows premium
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    copper: '0 4px 14px 0 rgba(220, 118, 51, 0.3)',
    copperLg: '0 8px 25px 0 rgba(220, 118, 51, 0.2)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // Animations premium
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms'
    },
    easings: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
}

// Context para o tema de cobre
const CopperThemeContext = createContext<{
  theme: typeof COPPER_DESIGN_SYSTEM
  mode: 'light' | 'dark'
  toggleMode: () => void
} | null>(null)

export const useCopperTheme = () => {
  const context = useContext(CopperThemeContext)
  if (!context) {
    throw new Error('useCopperTheme must be used within a CopperThemeProvider')
  }
  return context
}

// Provider do tema de cobre
export const CopperThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('copper-theme-mode')
    if (saved && (saved === 'light' || saved === 'dark')) {
      setMode(saved)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    localStorage.setItem('copper-theme-mode', mode)
    applyThemeToDocument(mode)
  }, [mode])

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  const applyThemeToDocument = (themeMode: 'light' | 'dark') => {
    const root = document.documentElement
    
    if (themeMode === 'dark') {
      // Dark mode com cobre
      root.style.setProperty('--bg-primary', COPPER_DESIGN_SYSTEM.colors.neutral[950])
      root.style.setProperty('--bg-secondary', COPPER_DESIGN_SYSTEM.colors.neutral[900])
      root.style.setProperty('--bg-tertiary', COPPER_DESIGN_SYSTEM.colors.neutral[800])
      root.style.setProperty('--text-primary', COPPER_DESIGN_SYSTEM.colors.neutral[0])
      root.style.setProperty('--text-secondary', COPPER_DESIGN_SYSTEM.colors.neutral[300])
      root.style.setProperty('--text-muted', COPPER_DESIGN_SYSTEM.colors.neutral[500])
      root.style.setProperty('--border', COPPER_DESIGN_SYSTEM.colors.neutral[700])
      root.style.setProperty('--accent', COPPER_DESIGN_SYSTEM.colors.copper[400])
      root.style.setProperty('--accent-hover', COPPER_DESIGN_SYSTEM.colors.copper[300])
    } else {
      // Light mode com cobre
      root.style.setProperty('--bg-primary', COPPER_DESIGN_SYSTEM.colors.neutral[0])
      root.style.setProperty('--bg-secondary', COPPER_DESIGN_SYSTEM.colors.neutral[50])
      root.style.setProperty('--bg-tertiary', COPPER_DESIGN_SYSTEM.colors.neutral[100])
      root.style.setProperty('--text-primary', COPPER_DESIGN_SYSTEM.colors.neutral[950])
      root.style.setProperty('--text-secondary', COPPER_DESIGN_SYSTEM.colors.neutral[600])
      root.style.setProperty('--text-muted', COPPER_DESIGN_SYSTEM.colors.neutral[500])
      root.style.setProperty('--border', COPPER_DESIGN_SYSTEM.colors.neutral[200])
      root.style.setProperty('--accent', COPPER_DESIGN_SYSTEM.colors.copper[500])
      root.style.setProperty('--accent-hover', COPPER_DESIGN_SYSTEM.colors.copper[600])
    }
    
    // Cores comuns
    root.style.setProperty('--copper-50', COPPER_DESIGN_SYSTEM.colors.copper[50])
    root.style.setProperty('--copper-100', COPPER_DESIGN_SYSTEM.colors.copper[100])
    root.style.setProperty('--copper-200', COPPER_DESIGN_SYSTEM.colors.copper[200])
    root.style.setProperty('--copper-300', COPPER_DESIGN_SYSTEM.colors.copper[300])
    root.style.setProperty('--copper-400', COPPER_DESIGN_SYSTEM.colors.copper[400])
    root.style.setProperty('--copper-500', COPPER_DESIGN_SYSTEM.colors.copper[500])
    root.style.setProperty('--copper-600', COPPER_DESIGN_SYSTEM.colors.copper[600])
    root.style.setProperty('--copper-700', COPPER_DESIGN_SYSTEM.colors.copper[700])
    root.style.setProperty('--copper-800', COPPER_DESIGN_SYSTEM.colors.copper[800])
    root.style.setProperty('--copper-900', COPPER_DESIGN_SYSTEM.colors.copper[900])
    
    // Gradientes
    root.style.setProperty('--gradient-copper', COPPER_DESIGN_SYSTEM.colors.gradients.copper)
    root.style.setProperty('--gradient-elegant', COPPER_DESIGN_SYSTEM.colors.gradients.elegant)
    root.style.setProperty('--gradient-premium', COPPER_DESIGN_SYSTEM.colors.gradients.premium)
    
    // Sombras
    root.style.setProperty('--shadow-copper', COPPER_DESIGN_SYSTEM.shadows.copper)
    root.style.setProperty('--shadow-copper-lg', COPPER_DESIGN_SYSTEM.shadows.copperLg)
    
    // Classes de body
    document.body.className = `copper-theme ${themeMode}`
  }

  return (
    <CopperThemeContext.Provider
      value={{
        theme: COPPER_DESIGN_SYSTEM,
        mode,
        toggleMode
      }}
    >
      {children}
    </CopperThemeContext.Provider>
  )
}

// Componentes premium de UI
export const CopperButton: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-copper-500 to-copper-400 text-white shadow-copper hover:shadow-copper-lg hover:from-copper-600 hover:to-copper-500',
    secondary: 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200',
    outline: 'border-2 border-copper-500 text-copper-500 hover:bg-copper-500 hover:text-white',
    ghost: 'text-copper-500 hover:bg-copper-50 dark:hover:bg-copper-900/20'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export const CopperCard: React.FC<{
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'premium' | 'elegant'
  style?: React.CSSProperties
}> = ({
  children,
  className = '',
  variant = 'default',
  style
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-lg',
    premium: 'bg-gradient-to-br from-white to-copper-50 dark:from-neutral-900 dark:to-neutral-800 border border-copper-200 dark:border-copper-800 shadow-copper hover:shadow-copper-lg',
    elegant: 'bg-neutral-950 text-white border border-copper-500/20 shadow-xl'
  }
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export const CopperGradientText: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <span 
      className={`bg-gradient-to-r from-copper-600 to-copper-400 bg-clip-text text-transparent font-bold ${className}`}
    >
      {children}
    </span>
  )
}