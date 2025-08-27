"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  User, 
  Settings,
  LogOut,
  Home,
  Users,
  MessageSquare,
  Tv,
  Palette,
  Crown,
  Sparkles
} from 'lucide-react'
import { useCopperTheme, CopperButton, CopperGradientText } from '@/lib/copper-theme'

const NAVIGATION_ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/forum', label: 'Fórum', icon: MessageSquare },
  { href: '/communities', label: 'Comunidades', icon: Users },
  { href: '/live', label: 'Live', icon: Tv },
  { href: '/creator', label: 'Creator', icon: Crown, premium: true },
  { href: '/customization', label: 'Temas', icon: Palette }
]

export const CopperHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { mode, toggleMode } = useCopperTheme()
  const pathname = usePathname()

  return (
    <>
      {/* Header Premium */}
      <header className="nav-premium fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Premium */}
          <Link href="/" className="flex items-center space-x-3 hover-lift">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-copper-500 to-copper-400 rounded-xl flex items-center justify-center copper-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-copper-400 to-copper-300 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <CopperGradientText className="text-xl font-bold">
                ACode Lab
              </CopperGradientText>
              <div className="text-xs text-muted-foreground font-medium">
                Premium Experience
              </div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link group relative ${isActive ? 'active' : ''} ${mode === 'dark' ? 'dark' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.premium && (
                      <Crown className="w-3 h-3 text-copper-500" />
                    )}
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-copper-500 rounded-full" />
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-copper-500/0 via-copper-500/5 to-copper-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden md:flex hover-lift">
              <Search className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <CopperButton
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              className="hover-lift"
            >
              {mode === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </CopperButton>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="hover-lift">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-copper-500 to-copper-400 rounded-full animate-pulse" />
              </Button>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="hover-lift"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-copper-500 to-copper-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </Button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 card-premium animate-fade-scale">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-copper-500 to-copper-400 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-primary">
                          João Silva
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Premium Member
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Meu Perfil</span>
                    </Link>
                    <Link
                      href="/profile/customize"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Personalizar</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </Link>
                    <div className="border-t border-border my-2" />
                    <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors w-full text-left text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover-lift"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-16 left-4 right-4 card-premium animate-slide-up">
            <div className="p-4">
              <div className="space-y-2">
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-copper-50 text-copper-600 dark:bg-copper-900 dark:text-copper-300' 
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.premium && (
                        <Crown className="w-4 h-4 text-copper-500" />
                      )}
                    </Link>
                  )
                })}
              </div>
              
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex items-center space-x-3 p-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="input-copper flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  )
}