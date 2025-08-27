"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Bell, X, Heart, MessageCircle, UserPlus, Share, 
  Award, TrendingUp, Zap, Crown, Gift, AlertTriangle,
  CheckCircle, Info, Volume2, VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useRealTime, useRealTimeEvent } from '@/lib/realtime'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention' | 'achievement' | 'system' | 'live'
  title: string
  message: string
  userId?: string
  userName?: string
  userAvatar?: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'social' | 'forum' | 'system' | 'achievement' | 'live'
  actionUrl?: string
  data?: any
  sound?: boolean
  vibrate?: boolean
  persistent?: boolean
  autoHide?: number
  progress?: {
    current: number
    total: number
    label: string
  }
}

interface RealTimeNotificationsProps {
  userId: string
  maxVisible?: number
  soundEnabled?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showUnreadCount?: boolean
}

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  share: Share,
  mention: Bell,
  achievement: Award,
  system: Info,
  live: Zap
}

const notificationColors = {
  like: 'text-red-500 bg-red-50 border-red-200',
  comment: 'text-blue-500 bg-blue-50 border-blue-200',
  follow: 'text-green-500 bg-green-50 border-green-200',
  share: 'text-purple-500 bg-purple-50 border-purple-200',
  mention: 'text-orange-500 bg-orange-50 border-orange-200',
  achievement: 'text-yellow-500 bg-yellow-50 border-yellow-200',
  system: 'text-gray-500 bg-gray-50 border-gray-200',
  live: 'text-indigo-500 bg-indigo-50 border-indigo-200'
}

const priorityConfig = {
  low: { duration: 3000, sound: false, vibrate: false },
  medium: { duration: 5000, sound: true, vibrate: false },
  high: { duration: 8000, sound: true, vibrate: true },
  urgent: { duration: 0, sound: true, vibrate: true } // 0 = no auto-hide
}

export const RealTimeNotifications = ({
  userId,
  maxVisible = 5,
  soundEnabled = true,
  position = 'top-right',
  showUnreadCount = true
}: RealTimeNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [soundsEnabled, setSoundsEnabled] = useState(soundEnabled)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const vibrationTimeouts = useRef<NodeJS.Timeout[]>([])

  const { isConnected, status } = useRealTime()

  // Initialize audio for notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/notification.mp3')
      audioRef.current.volume = 0.3
    }
  }, [])

  // Handle real-time notification events
  useRealTimeEvent<Notification>('notification:new', useCallback((notification) => {
    addNotification(notification)
  }, []), [])

  useRealTimeEvent('notification:read', useCallback((data: { notificationId: string }) => {
    markAsRead(data.notificationId)
  }, []), [])

  useRealTimeEvent('notification:clear', useCallback(() => {
    clearAllNotifications()
  }, []), [])

  // Add new notification
  const addNotification = useCallback((notification: Notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || `notif_${Date.now()}`,
      timestamp: new Date(notification.timestamp || Date.now())
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      return updated.slice(0, maxVisible * 2) // Keep some buffer
    })

    setUnreadCount(prev => prev + 1)

    // Handle sound
    if (soundsEnabled && notification.sound !== false) {
      playNotificationSound(notification.priority)
    }

    // Handle vibration
    if (notification.vibrate && 'vibrate' in navigator) {
      vibrate(notification.priority)
    }

    // Auto-hide based on priority
    const config = priorityConfig[notification.priority]
    const hideDelay = notification.autoHide !== undefined ? notification.autoHide : config.duration

    if (hideDelay > 0 && !notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, hideDelay)
    }

    // Show browser notification if permission granted
    showBrowserNotification(newNotification)
  }, [soundsEnabled, maxVisible])

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Play notification sound
  const playNotificationSound = useCallback((priority: string) => {
    if (!audioRef.current || !soundsEnabled) return

    try {
      // Different sounds for different priorities
      switch (priority) {
        case 'urgent':
        case 'high':
          audioRef.current.playbackRate = 1.2
          break
        case 'medium':
          audioRef.current.playbackRate = 1.0
          break
        case 'low':
          audioRef.current.playbackRate = 0.8
          break
      }
      
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Silently handle play failures (user hasn't interacted yet)
      })
    } catch (error) {
      console.warn('Failed to play notification sound:', error)
    }
  }, [soundsEnabled])

  // Vibration patterns
  const vibrate = useCallback((priority: string) => {
    if (!('vibrate' in navigator)) return

    let pattern: number[] = []
    
    switch (priority) {
      case 'urgent':
        pattern = [200, 100, 200, 100, 200]
        break
      case 'high':
        pattern = [150, 100, 150]
        break
      case 'medium':
        pattern = [100]
        break
      case 'low':
        pattern = [50]
        break
    }

    navigator.vibrate(pattern)
  }, [])

  // Browser notifications
  const showBrowserNotification = useCallback((notification: Notification) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png',
        badge: '/icon-badge.png',
        tag: notification.id,
        requireInteraction: notification.persistent,
        silent: !soundsEnabled
      })

      browserNotification.onclick = () => {
        if (notification.actionUrl) {
          window.focus()
          window.location.href = notification.actionUrl
        }
        browserNotification.close()
      }

      // Auto-close browser notification
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    } catch (error) {
      console.warn('Failed to show browser notification:', error)
    }
  }, [soundsEnabled])

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return Notification.permission === 'granted'
  }, [])

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-right':
      default:
        return 'top-4 right-4'
    }
  }

  // Visible notifications (respecting maxVisible limit)
  const visibleNotifications = notifications.slice(0, isCollapsed ? 0 : maxVisible)

  // Connection indicator
  const ConnectionIndicator = () => (
    <div className={`flex items-center gap-2 text-xs ${
      isConnected ? 'text-green-600' : 'text-red-600'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      {isConnected ? `Conectado (${status.latency}ms)` : 'Desconectado'}
    </div>
  )

  return (
    <div className={`fixed ${getPositionClasses()} z-50 w-80 max-w-sm`}>
      {/* Header/Control Bar */}
      <div className="mb-2">
        <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">Notificações</span>
                {showUnreadCount && unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundsEnabled(!soundsEnabled)}
                  className="h-6 w-6 p-0"
                >
                  {soundsEnabled ? (
                    <Volume2 className="h-3 w-3" />
                  ) : (
                    <VolumeX className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-6 w-6 p-0"
                >
                  {isCollapsed ? '+' : '-'}
                </Button>
                
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-2">
              <ConnectionIndicator />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification) => {
            const IconComponent = notificationIcons[notification.type] || Bell
            const colorClasses = notificationColors[notification.type] || notificationColors.system

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.3 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`bg-background/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200 ${
                  notification.priority === 'urgent' ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon/Avatar */}
                      <div className="flex-shrink-0">
                        {notification.userAvatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.userAvatar} />
                            <AvatarFallback>
                              {notification.userName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`p-2 rounded-full ${colorClasses}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-1">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {notification.message}
                            </p>
                            
                            {/* Progress bar for progress notifications */}
                            {notification.progress && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{notification.progress.label}</span>
                                  <span>{notification.progress.current}/{notification.progress.total}</span>
                                </div>
                                <Progress 
                                  value={(notification.progress.current / notification.progress.total) * 100} 
                                  className="h-1"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </span>
                              
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {notification.category}
                              </Badge>
                              
                              {notification.priority === 'urgent' && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgente
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 ml-2">
                            {notification.actionUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  window.location.href = notification.actionUrl!
                                  markAsRead(notification.id)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <TrendingUp className="h-3 w-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Overflow indicator */}
      {notifications.length > maxVisible && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2"
        >
          <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
            <CardContent className="p-2 text-center">
              <p className="text-xs text-muted-foreground">
                +{notifications.length - maxVisible} mais notificações
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="text-xs"
              >
                Ver todas
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Request permission button */}
      {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
        <div className="mt-2">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <p className="text-xs text-blue-700 mb-2">
                Ative as notificações do navegador para não perder nada!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={requestNotificationPermission}
                className="w-full text-xs"
              >
                Ativar Notificações
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}