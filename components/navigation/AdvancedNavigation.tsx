"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, MessageSquare, Users, Search, Bell, User,
  Settings, HelpCircle, LogOut, Menu, X, ChevronDown,
  Bookmark, Heart, TrendingUp, Zap, Award, Crown,
  Code, BookOpen, Calendar, Shield, Plus, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { useTheme, ThemeSelector } from '@/components/ui/ThemeProvider'
import { NotificationCenter } from '@/components/social/NotificationCenter'
import { ExploreModal } from '@/components/social/ExploreModal'

// Types
interface NavigationItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  isActive?: boolean
  children?: NavigationItem[]
  premium?: boolean
  hotkey?: string
}

interface User {
  id: string
  name: string
  username: string
  avatar: string
  email: string
  level: number
  xp: number
  isPremium: boolean
  notifications: number
}

interface AdvancedNavigationProps {
  user?: User
  onLogout: () => void
}

// Navigation items configuration
const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Início',
    href: '/',
    icon: Home,
    hotkey: 'h'
  },
  {
    id: 'social',
    label: 'Social',
    href: '/social',
    icon: Users,
    hotkey: 's',
    children: [
      { id: 'feed', label: 'Feed', href: '/social', icon: Home },
      { id: 'explore', label: 'Explorar', href: '/social/explore', icon: TrendingUp },
      { id: 'messages', label: 'Mensagens', href: '/social/messages', icon: MessageSquare, badge: 3 },
      { id: 'bookmarks', label: 'Salvos', href: '/social/bookmarks', icon: Bookmark }
    ]
  },
  {
    id: 'forum',
    label: 'Fórum',
    href: '/forum',
    icon: MessageSquare,
    hotkey: 'f',
    children: [
      { id: 'questions', label: 'Perguntas', href: '/forum', icon: MessageSquare },
      { id: 'ask', label: 'Fazer Pergunta', href: '/forum/ask', icon: Plus },
      { id: 'categories', label: 'Categorias', href: '/forum/categories', icon: BookOpen },
      { id: 'leaderboard', label: 'Ranking', href: '/forum/leaderboard', icon: Award }
    ]
  },
  {
    id: 'code',
    label: 'Código',
    href: '/code',
    icon: Code,
    hotkey: 'c',
    premium: true
  },
  {
    id: 'achievements',
    label: 'Conquistas',
    href: '/achievements',
    icon: Award,
    hotkey: 'a'
  }
]

// Quick actions
const quickActions = [
  { id: 'new-post', label: 'Novo Post', icon: Plus, action: 'create-post' },
  { id: 'new-question', label: 'Nova Pergunta', icon: MessageSquare, action: 'create-question' },
  { id: 'search', label: 'Buscar', icon: Search, action: 'search', hotkey: '/' }
]

// Command palette hook
const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    // Cmd/Ctrl + K to open command palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsOpen(true)
    }
    
    // Escape to close
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
    }

    // Quick navigation hotkeys
    if (!isOpen && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const item = navigationItems.find(item => item.hotkey === e.key)
      if (item) {
        e.preventDefault()
        router.push(item.href)
      }
    }
  }, [isOpen, router])

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [handleKeydown])

  return {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery
  }
}

// Command Palette Component
const CommandPalette = ({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery 
}: {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}) => {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter items based on search
  const filteredItems = navigationItems
    .flatMap(item => [item, ...(item.children || [])])
    .filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.href.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 8)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredItems[selectedIndex]) {
            router.push(filteredItems[selectedIndex].href)
            onClose()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, selectedIndex, filteredItems, router, onClose])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-lg mx-4"
      >
        <Card className="bg-background/95 backdrop-blur-sm border shadow-2xl">
          <CardContent className="p-0">
            {/* Search input */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar páginas, ações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 text-base"
                autoFocus
              />
              <Badge variant="outline" className="text-xs">
                ⌘K
              </Badge>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum resultado encontrado</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredItems.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          router.push(item.href)
                          onClose()
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          index === selectedIndex
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.href}</p>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.premium && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">↑↓</Badge>
                    <span>Navegar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">⏎</Badge>
                    <span>Selecionar</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">ESC</Badge>
                  <span>Fechar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Main Navigation Component
export const AdvancedNavigation = ({ user, onLogout }: AdvancedNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showExplore, setShowExplore] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  
  const pathname = usePathname()
  const { theme, isDark } = useTheme()
  const { isOpen: isCommandPaletteOpen, setIsOpen: setCommandPaletteOpen, searchQuery, setSearchQuery } = useCommandPalette()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false)
      setActiveSubmenu(null)
    }

    if (showUserMenu || activeSubmenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showUserMenu, activeSubmenu])

  // Get active navigation item
  const getActiveItem = (item: NavigationItem): boolean => {
    if (item.href === pathname) return true
    if (item.children) {
      return item.children.some(child => child.href === pathname)
    }
    return false
  }

  // Navigation item component
  const NavigationItem = ({ 
    item, 
    level = 0, 
    inMobile = false 
  }: { 
    item: NavigationItem
    level?: number
    inMobile?: boolean 
  }) => {
    const isActive = getActiveItem(item)
    const hasChildren = item.children && item.children.length > 0
    const isSubmenuOpen = activeSubmenu === item.id
    const IconComponent = item.icon

    const handleClick = (e: React.MouseEvent) => {
      if (hasChildren && !inMobile) {
        e.preventDefault()
        setActiveSubmenu(isSubmenuOpen ? null : item.id)
      }
    }

    return (
      <div className="relative">
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className={`w-full justify-start gap-3 ${level > 0 ? 'pl-8' : ''} ${
            item.premium && !user?.isPremium ? 'opacity-60' : ''
          }`}
          onClick={handleClick}
          disabled={item.premium && !user?.isPremium}
        >
          <IconComponent className="h-5 w-5" />
          <span className="flex-1 text-left">{item.label}</span>
          
          {item.badge && (
            <Badge variant="destructive" className="text-xs">
              {item.badge}
            </Badge>
          )}
          
          {item.premium && !user?.isPremium && (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
          
          {hasChildren && !inMobile && (
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${
                isSubmenuOpen ? 'rotate-180' : ''
              }`} 
            />
          )}
          
          {item.hotkey && (
            <Badge variant="outline" className="text-xs">
              {item.hotkey}
            </Badge>
          )}
        </Button>

        {/* Submenu */}
        {hasChildren && (inMobile || isSubmenuOpen) && (
          <motion.div
            initial={inMobile ? {} : { opacity: 0, y: -10 }}
            animate={inMobile ? {} : { opacity: 1, y: 0 }}
            exit={inMobile ? {} : { opacity: 0, y: -10 }}
            className={inMobile ? 'ml-4 mt-2 space-y-1' : 'absolute top-full left-0 w-64 bg-background border rounded-lg shadow-lg p-2 z-50'}
          >
            {item.children!.map((child) => (
              <NavigationItem
                key={child.id}
                item={child}
                level={level + 1}
                inMobile={inMobile}
              />
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">ACode Lab</span>
          </div>

          {/* Main navigation */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Quick actions */}
          <div className="flex items-center gap-1">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (action.action === 'search') {
                      setCommandPaletteOpen(true)
                    }
                  }}
                  className="relative"
                >
                  <IconComponent className="h-4 w-4" />
                  {action.hotkey && (
                    <Badge variant="outline" className="absolute -top-1 -right-1 text-xs">
                      {action.hotkey}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {user?.notifications && user.notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center"
              >
                {user.notifications > 99 ? '99+' : user.notifications}
              </Badge>
            )}
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemeSelector(!showThemeSelector)}
          >
            {isDark ? <Star className="h-5 w-5" /> : <Star className="h-5 w-5" />}
          </Button>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Nível {user.level}</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {/* User dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 w-64 bg-background border rounded-lg shadow-lg p-2 z-50 mt-2"
                  >
                    <div className="p-3 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">Nível {user.level}</Badge>
                            {user.isPremium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="h-4 w-4 mr-3" />
                        Perfil
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-3" />
                        Configurações
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-3" />
                        Ajuda
                      </Button>
                      <Separator className="my-2" />
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={onLogout}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sair
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button size="sm">
              Entrar
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
            <Code className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">ACode Lab</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {user?.notifications && user.notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 text-xs w-4 h-4 rounded-full p-0 flex items-center justify-center"
              >
                {user.notifications > 9 ? '9+' : user.notifications}
              </Badge>
            )}
          </Button>

          {user && (
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background"
          >
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem key={item.id} item={item} inMobile={true} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      {showNotifications && user && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={[]} // Would be passed from props
          onMarkAsRead={() => {}}
          onMarkAllAsRead={() => {}}
          onDeleteNotification={() => {}}
        />
      )}

      {showThemeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowThemeSelector(false)} 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-background border rounded-lg shadow-2xl"
          >
            <ThemeSelector onClose={() => setShowThemeSelector(false)} />
          </motion.div>
        </div>
      )}

      {showExplore && (
        <ExploreModal
          isOpen={showExplore}
          onClose={() => setShowExplore(false)}
          trendingTopics={[]}
          searchResults={[]}
          onSearch={() => {}}
          onUserClick={() => {}}
          onPostClick={() => {}}
          onHashtagClick={() => {}}
        />
      )}
    </>
  )
}