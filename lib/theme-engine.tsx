"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

// Theme Types
export interface CustomTheme {
  id: string
  name: string
  type: 'light' | 'dark' | 'auto'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
  gradients: {
    primary: string
    secondary: string
    accent: string
  }
  effects: {
    blur: boolean
    animations: boolean
    shadows: boolean
    borderRadius: 'none' | 'small' | 'medium' | 'large'
  }
  typography: {
    fontFamily: string
    fontSize: 'small' | 'medium' | 'large'
    fontWeight: 'light' | 'normal' | 'medium' | 'bold'
  }
  layout: {
    density: 'compact' | 'comfortable' | 'spacious'
    sidebar: 'collapsed' | 'expanded' | 'auto'
    headerStyle: 'floating' | 'sticky' | 'static'
  }
}

export interface ThemePreferences {
  selectedTheme: string
  customThemes: CustomTheme[]
  autoSwitch: boolean
  autoSwitchTimes: {
    lightStart: string
    darkStart: string
  }
}

// Predefined Themes
export const DEFAULT_THEMES: Record<string, CustomTheme> = {
  'default-light': {
    id: 'default-light',
    name: 'Claro Padrão',
    type: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      secondary: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      accent: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    effects: {
      blur: true,
      animations: true,
      shadows: true,
      borderRadius: 'medium'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 'medium',
      fontWeight: 'normal'
    },
    layout: {
      density: 'comfortable',
      sidebar: 'expanded',
      headerStyle: 'sticky'
    }
  },
  'default-dark': {
    id: 'default-dark',
    name: 'Escuro Padrão',
    type: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#22d3ee'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      secondary: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
      accent: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'
    },
    effects: {
      blur: true,
      animations: true,
      shadows: true,
      borderRadius: 'medium'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 'medium',
      fontWeight: 'normal'
    },
    layout: {
      density: 'comfortable',
      sidebar: 'expanded',
      headerStyle: 'sticky'
    }
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    type: 'dark',
    colors: {
      primary: '#00ff9f',
      secondary: '#ff0080',
      accent: '#00d4ff',
      background: '#0a0a0a',
      surface: '#1a1a2e',
      text: '#00ff9f',
      textSecondary: '#ff0080',
      border: '#16213e',
      success: '#00ff9f',
      warning: '#ffaa00',
      error: '#ff0080',
      info: '#00d4ff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00ff9f 0%, #00d4ff 100%)',
      secondary: 'linear-gradient(135deg, #ff0080 0%, #ff4081 100%)',
      accent: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)'
    },
    effects: {
      blur: true,
      animations: true,
      shadows: true,
      borderRadius: 'small'
    },
    typography: {
      fontFamily: 'JetBrains Mono',
      fontSize: 'medium',
      fontWeight: 'medium'
    },
    layout: {
      density: 'compact',
      sidebar: 'collapsed',
      headerStyle: 'floating'
    }
  },
  'nature': {
    id: 'nature',
    name: 'Natureza',
    type: 'light',
    colors: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#ca8a04',
      background: '#f0fdf4',
      surface: '#ecfdf5',
      text: '#064e3b',
      textSecondary: '#047857',
      border: '#bbf7d0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      info: '#0891b2'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      secondary: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
      accent: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)'
    },
    effects: {
      blur: false,
      animations: true,
      shadows: false,
      borderRadius: 'large'
    },
    typography: {
      fontFamily: 'Poppins',
      fontSize: 'medium',
      fontWeight: 'normal'
    },
    layout: {
      density: 'spacious',
      sidebar: 'expanded',
      headerStyle: 'static'
    }
  }
}

// Theme Context
const ThemeContext = createContext<{
  currentTheme: CustomTheme
  preferences: ThemePreferences
  updateTheme: (themeId: string) => void
  createCustomTheme: (theme: Omit<CustomTheme, 'id'>) => void
  updateCustomTheme: (themeId: string, updates: Partial<CustomTheme>) => void
  deleteCustomTheme: (themeId: string) => void
  updatePreferences: (preferences: Partial<ThemePreferences>) => void
  exportTheme: (themeId: string) => string
  importTheme: (themeData: string) => boolean
} | null>(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<ThemePreferences>({
    selectedTheme: 'default-light',
    customThemes: [],
    autoSwitch: false,
    autoSwitchTimes: {
      lightStart: '06:00',
      darkStart: '18:00'
    }
  })

  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(DEFAULT_THEMES['default-light'])

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme-preferences')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPreferences(parsed)
      } catch (error) {
        console.error('Failed to parse theme preferences:', error)
      }
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('theme-preferences', JSON.stringify(preferences))
  }, [preferences])

  // Update current theme when preferences change
  useEffect(() => {
    const allThemes = { ...DEFAULT_THEMES }
    preferences.customThemes.forEach(theme => {
      allThemes[theme.id] = theme
    })

    let themeId = preferences.selectedTheme

    // Auto switch logic
    if (preferences.autoSwitch) {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      const lightStart = preferences.autoSwitchTimes.lightStart
      const darkStart = preferences.autoSwitchTimes.darkStart
      
      if (currentTime >= darkStart || currentTime < lightStart) {
        // Find a dark theme
        const darkTheme = Object.values(allThemes).find(theme => theme.type === 'dark')
        if (darkTheme) themeId = darkTheme.id
      } else {
        // Find a light theme
        const lightTheme = Object.values(allThemes).find(theme => theme.type === 'light')
        if (lightTheme) themeId = lightTheme.id
      }
    }

    const theme = allThemes[themeId] || DEFAULT_THEMES['default-light']
    setCurrentTheme(theme)
    applyThemeToDOM(theme)
  }, [preferences])

  const applyThemeToDOM = (theme: CustomTheme) => {
    const root = document.documentElement
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value)
    })

    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily)
    root.style.setProperty('--font-size-base', getFontSize(theme.typography.fontSize))
    root.style.setProperty('--font-weight-base', getFontWeight(theme.typography.fontWeight))

    // Apply effects
    root.style.setProperty('--border-radius', getBorderRadius(theme.effects.borderRadius))
    
    // Apply classes for layout and effects
    document.body.className = [
      `density-${theme.layout.density}`,
      `sidebar-${theme.layout.sidebar}`,
      `header-${theme.layout.headerStyle}`,
      theme.effects.animations ? 'animations-enabled' : 'animations-disabled',
      theme.effects.shadows ? 'shadows-enabled' : 'shadows-disabled',
      theme.effects.blur ? 'blur-enabled' : 'blur-disabled',
      theme.type === 'dark' ? 'dark' : 'light'
    ].join(' ')
  }

  const updateTheme = (themeId: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedTheme: themeId
    }))
  }

  const createCustomTheme = (themeData: Omit<CustomTheme, 'id'>) => {
    const id = `custom-${Date.now()}`
    const newTheme: CustomTheme = { ...themeData, id }
    
    setPreferences(prev => ({
      ...prev,
      customThemes: [...prev.customThemes, newTheme],
      selectedTheme: id
    }))
  }

  const updateCustomTheme = (themeId: string, updates: Partial<CustomTheme>) => {
    setPreferences(prev => ({
      ...prev,
      customThemes: prev.customThemes.map(theme =>
        theme.id === themeId ? { ...theme, ...updates } : theme
      )
    }))
  }

  const deleteCustomTheme = (themeId: string) => {
    setPreferences(prev => ({
      ...prev,
      customThemes: prev.customThemes.filter(theme => theme.id !== themeId),
      selectedTheme: prev.selectedTheme === themeId ? 'default-light' : prev.selectedTheme
    }))
  }

  const updatePreferences = (newPreferences: Partial<ThemePreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }))
  }

  const exportTheme = (themeId: string): string => {
    const allThemes = { ...DEFAULT_THEMES }
    preferences.customThemes.forEach(theme => {
      allThemes[theme.id] = theme
    })
    
    const theme = allThemes[themeId]
    if (!theme) throw new Error('Theme not found')
    
    return btoa(JSON.stringify(theme))
  }

  const importTheme = (themeData: string): boolean => {
    try {
      const theme = JSON.parse(atob(themeData)) as CustomTheme
      
      // Validate theme structure
      if (!theme.name || !theme.colors || !theme.gradients) {
        throw new Error('Invalid theme structure')
      }
      
      const id = `imported-${Date.now()}`
      const importedTheme: CustomTheme = { ...theme, id }
      
      setPreferences(prev => ({
        ...prev,
        customThemes: [...prev.customThemes, importedTheme]
      }))
      
      return true
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        preferences,
        updateTheme,
        createCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
        updatePreferences,
        exportTheme,
        importTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// Helper functions
const getFontSize = (size: 'small' | 'medium' | 'large'): string => {
  switch (size) {
    case 'small': return '14px'
    case 'medium': return '16px'
    case 'large': return '18px'
    default: return '16px'
  }
}

const getFontWeight = (weight: 'light' | 'normal' | 'medium' | 'bold'): string => {
  switch (weight) {
    case 'light': return '300'
    case 'normal': return '400'
    case 'medium': return '500'
    case 'bold': return '700'
    default: return '400'
  }
}

const getBorderRadius = (radius: 'none' | 'small' | 'medium' | 'large'): string => {
  switch (radius) {
    case 'none': return '0px'
    case 'small': return '4px'
    case 'medium': return '8px'
    case 'large': return '16px'
    default: return '8px'
  }
}

// Theme Builder Hook
export const useThemeBuilder = () => {
  const { createCustomTheme, updateCustomTheme } = useTheme()
  
  const [builderTheme, setBuilderTheme] = useState<Omit<CustomTheme, 'id'>>({
    name: 'Tema Personalizado',
    type: 'light',
    colors: { ...DEFAULT_THEMES['default-light'].colors },
    gradients: { ...DEFAULT_THEMES['default-light'].gradients },
    effects: { ...DEFAULT_THEMES['default-light'].effects },
    typography: { ...DEFAULT_THEMES['default-light'].typography },
    layout: { ...DEFAULT_THEMES['default-light'].layout }
  })

  const updateBuilderTheme = (section: keyof CustomTheme, updates: any) => {
    setBuilderTheme(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...updates }
    }))
  }

  const saveTheme = () => {
    createCustomTheme(builderTheme)
  }

  const loadTemplate = (templateId: string) => {
    const template = DEFAULT_THEMES[templateId]
    if (template) {
      setBuilderTheme({
        name: `${template.name} - Personalizado`,
        type: template.type,
        colors: { ...template.colors },
        gradients: { ...template.gradients },
        effects: { ...template.effects },
        typography: { ...template.typography },
        layout: { ...template.layout }
      })
    }
  }

  return {
    builderTheme,
    updateBuilderTheme,
    saveTheme,
    loadTemplate
  }
}