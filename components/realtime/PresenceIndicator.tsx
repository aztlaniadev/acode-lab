"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Circle, Eye, Users, Clock, Wifi, WifiOff,
  Smartphone, Monitor, Tablet, MessageCircle,
  Edit3, Pause, Play, Volume2, VolumeX
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { usePresence, useRealTimeEvent } from '@/lib/realtime'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface User {
  id: string
  name: string
  username: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen?: Date
  device?: 'desktop' | 'mobile' | 'tablet'
  activity?: {
    type: 'viewing' | 'typing' | 'editing' | 'idle' | 'active'
    context?: string
    timestamp: Date
  }
  location?: {
    page: string
    section?: string
  }
}

interface PresenceIndicatorProps {
  userId?: string
  roomId?: string
  showActivity?: boolean
  showDeviceInfo?: boolean
  showLastSeen?: boolean
  compact?: boolean
  maxUsers?: number
  enableSounds?: boolean
}

interface TypingIndicatorProps {
  users: string[]
  compact?: boolean
}

interface ActivityIndicatorProps {
  user: User
  showDetails?: boolean
}

// Device icons
const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet
}

// Status colors
const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400'
}

// Activity icons
const activityIcons = {
  viewing: Eye,
  typing: Edit3,
  editing: Edit3,
  idle: Pause,
  active: Play
}

// Typing Indicator Component
export const TypingIndicator = ({ users, compact = false }: TypingIndicatorProps) => {
  if (users.length === 0) return null

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} está digitando...`
    } else if (users.length === 2) {
      return `${users[0]} e ${users[1]} estão digitando...`
    } else {
      return `${users[0]} e mais ${users.length - 1} pessoas estão digitando...`
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        <span>{getTypingText()}</span>
      </motion.div>
    </AnimatePresence>
  )
}

// Activity Indicator Component
export const ActivityIndicator = ({ user, showDetails = true }: ActivityIndicatorProps) => {
  if (!user.activity) return null

  const ActivityIcon = activityIcons[user.activity.type] || Eye
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ActivityIcon className="h-3 w-3" />
            {showDetails && (
              <span className="truncate max-w-20">
                {user.activity.context || user.activity.type}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs">
              {user.activity.type === 'viewing' && 'Visualizando'}
              {user.activity.type === 'typing' && 'Digitando'}
              {user.activity.type === 'editing' && 'Editando'}
              {user.activity.type === 'idle' && 'Ausente'}
              {user.activity.type === 'active' && 'Ativo'}
              {user.activity.context && `: ${user.activity.context}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(user.activity.timestamp, {
                addSuffix: true,
                locale: ptBR
              })}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// User Presence Avatar Component
export const UserPresenceAvatar = ({ 
  user, 
  showActivity = true, 
  showDeviceInfo = true,
  size = 'default' 
}: { 
  user: User
  showActivity?: boolean
  showDeviceInfo?: boolean
  size?: 'sm' | 'default' | 'lg'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const DeviceIcon = user.device ? deviceIcons[user.device] : Monitor

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Avatar className={sizeClasses[size]}>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[user.status]} rounded-full border-2 border-background`} />
            
            {/* Device indicator */}
            {showDeviceInfo && user.device && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-background rounded-full border flex items-center justify-center">
                <DeviceIcon className="h-2 w-2 text-muted-foreground" />
              </div>
            )}
            
            {/* Activity pulse for active users */}
            {user.activity?.type === 'active' && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center space-y-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
            
            <div className="flex items-center justify-center gap-1">
              <div className={`w-2 h-2 ${statusColors[user.status]} rounded-full`} />
              <span className="text-xs capitalize">{user.status}</span>
            </div>
            
            {showDeviceInfo && user.device && (
              <div className="flex items-center justify-center gap-1">
                <DeviceIcon className="h-3 w-3" />
                <span className="text-xs capitalize">{user.device}</span>
              </div>
            )}
            
            {showActivity && user.activity && (
              <ActivityIndicator user={user} showDetails={true} />
            )}
            
            {user.status === 'offline' && user.lastSeen && (
              <p className="text-xs text-muted-foreground">
                Visto {formatDistanceToNow(user.lastSeen, {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            )}
            
            {user.location && (
              <p className="text-xs text-muted-foreground">
                Em: {user.location.page}
                {user.location.section && ` > ${user.location.section}`}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Main Presence Indicator Component
export const PresenceIndicator = ({
  userId,
  roomId,
  showActivity = true,
  showDeviceInfo = true,
  showLastSeen = true,
  compact = false,
  maxUsers = 10,
  enableSounds = true
}: PresenceIndicatorProps) => {
  const [users, setUsers] = useState<Record<string, User>>({})
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [viewingUsers, setViewingUsers] = useState<string[]>([])
  const [soundEnabled, setSoundEnabled] = useState(enableSounds)

  const { users: presenceUsers, isTyping, updatePresence } = usePresence(roomId)

  // Update presence data
  useEffect(() => {
    updatePresence({
      status: 'online',
      device: getDeviceType(),
      activity: {
        type: 'active',
        context: window.location.pathname,
        timestamp: new Date()
      },
      location: {
        page: document.title,
        section: window.location.hash
      }
    })

    // Update activity periodically
    const interval = setInterval(() => {
      updatePresence({
        activity: {
          type: 'active',
          timestamp: new Date()
        }
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [updatePresence])

  // Sound effects
  const playJoinSound = useCallback(() => {
    if (!soundEnabled) return
    // Play join sound
    const audio = new Audio('/sounds/user-join.mp3')
    audio.volume = 0.1
    audio.play().catch(() => {})
  }, [soundEnabled])

  const playLeaveSound = useCallback(() => {
    if (!soundEnabled) return
    // Play leave sound
    const audio = new Audio('/sounds/user-leave.mp3')
    audio.volume = 0.1
    audio.play().catch(() => {})
  }, [soundEnabled])

  // Handle user join/leave events
  useRealTimeEvent<{ userId: string; user: User }>('user:join', useCallback((data) => {
    setUsers(prev => ({
      ...prev,
      [data.userId]: data.user
    }))
    
    if (soundEnabled) {
      playJoinSound()
    }
  }, [soundEnabled, playJoinSound]), [soundEnabled, playJoinSound])

  useRealTimeEvent<{ userId: string }>('user:leave', useCallback((data) => {
    setUsers(prev => {
      const newUsers = { ...prev }
      delete newUsers[data.userId]
      return newUsers
    })
    
    if (soundEnabled) {
      playLeaveSound()
    }
  }, [soundEnabled, playLeaveSound]), [soundEnabled, playLeaveSound])

  // Handle typing events
  useRealTimeEvent<{ userId: string; userName: string }>('typing:start', useCallback((data) => {
    if (data.userId !== userId) {
      setTypingUsers(prev => Array.from(new Set([...prev, data.userName])))
    }
  }, [userId]), [userId])

  useRealTimeEvent<{ userId: string; userName: string }>('typing:stop', useCallback((data) => {
    if (data.userId !== userId) {
      setTypingUsers(prev => prev.filter(name => name !== data.userName))
    }
  }, [userId]), [userId])

  // Handle presence updates
  useRealTimeEvent<{ userId: string; presence: any }>('presence:update', useCallback((data) => {
    setUsers(prev => ({
      ...prev,
      [data.userId]: {
        ...prev[data.userId],
        ...data.presence,
        id: data.userId
      }
    }))
  }, []), [])

  // Clean up typing indicators
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTypingUsers([])
    }, 5000)

    return () => clearTimeout(timeout)
  }, [typingUsers])

  // Get device type
  const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
    if (typeof window === 'undefined') return 'desktop'
    
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/mobile|android|iphone/.test(userAgent)) {
      return 'mobile'
    } else if (/tablet|ipad/.test(userAgent)) {
      return 'tablet'
    }
    
    return 'desktop'
  }

  // Filter and sort users
  const userList = Object.values(users)
    .filter(user => user.id !== userId)
    .sort((a, b) => {
      // Sort by status priority, then by activity
      const statusPriority = { online: 4, away: 3, busy: 2, offline: 1 }
      const aPriority = statusPriority[a.status] || 0
      const bPriority = statusPriority[b.status] || 0
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      // Then by recent activity
      const aTime = a.activity?.timestamp?.getTime() || 0
      const bTime = b.activity?.timestamp?.getTime() || 0
      return bTime - aTime
    })
    .slice(0, maxUsers)

  const onlineCount = userList.filter(user => user.status === 'online').length
  const totalCount = userList.length

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* User avatars */}
        <div className="flex -space-x-2">
          {userList.slice(0, 3).map((user) => (
            <UserPresenceAvatar
              key={user.id}
              user={user}
              showActivity={showActivity}
              showDeviceInfo={showDeviceInfo}
              size="sm"
            />
          ))}
          {totalCount > 3 && (
            <div className="h-6 w-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-xs">+{totalCount - 3}</span>
            </div>
          )}
        </div>

        {/* Online count */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
          <span>{onlineCount}</span>
        </div>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} compact={true} />
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Presença</span>
            <Badge variant="outline" className="text-xs">
              {onlineCount} online
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded hover:bg-muted"
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-3 w-3" />
                    ) : (
                      <VolumeX className="h-3 w-3" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{soundEnabled ? 'Desativar sons' : 'Ativar sons'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Users list */}
        <div className="space-y-3">
          <AnimatePresence>
            {userList.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <UserPresenceAvatar
                  user={user}
                  showActivity={showActivity}
                  showDeviceInfo={showDeviceInfo}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    {user.status !== 'offline' && showActivity && user.activity && (
                      <ActivityIndicator user={user} showDetails={false} />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{user.status}</span>
                    
                    {user.status === 'offline' && showLastSeen && user.lastSeen && (
                      <>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(user.lastSeen, {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </>
                    )}
                    
                    {user.location && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-24">
                          {user.location.page}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <TypingIndicator users={typingUsers} />
          </div>
        )}

        {/* Empty state */}
        {userList.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum usuário online</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PresenceIndicator