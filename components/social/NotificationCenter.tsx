"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Bell, Heart, MessageCircle, UserPlus, Share, Bookmark, X, Check, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention' | 'post'
  userId: string
  userName: string
  userAvatar: string
  content: string
  postId?: string
  postImage?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (id: string) => void
}

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  share: Share,
  mention: Bell,
  post: Bell
}

const notificationColors = {
  like: 'text-red-500',
  comment: 'text-blue-500',
  follow: 'text-green-500',
  share: 'text-purple-500',
  mention: 'text-orange-500',
  post: 'text-indigo-500'
}

export const NotificationCenter = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}: NotificationCenterProps) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }, [onMarkAsRead])

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'curtiu seu post'
      case 'comment':
        return 'comentou no seu post'
      case 'follow':
        return 'começou a seguir você'
      case 'share':
        return 'compartilhou seu post'
      case 'mention':
        return 'mencionou você'
      case 'post':
        return 'publicou um novo post'
      default:
        return notification.content
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="relative ml-auto h-full w-full max-w-md bg-background border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Notificações</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              Marcar todas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <div className="p-2 space-y-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const IconComponent = notificationIcons[notification.type]
                const iconColor = notificationColors[notification.type]
                
                return (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                      !notification.read 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={notification.userAvatar} />
                          <AvatarFallback>
                            {notification.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Content */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{notification.userName}</span>
                                {' '}
                                <span className="text-muted-foreground">
                                  {getNotificationText(notification)}
                                </span>
                              </p>
                              
                              {notification.content && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.content}
                                </p>
                              )}
                              
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </p>
                            </div>

                            {/* Action Icon & Post Preview */}
                            <div className="flex items-center gap-2 ml-2">
                              <IconComponent className={`h-4 w-4 ${iconColor}`} />
                              
                              {notification.postImage && (
                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={notification.postImage}
                                    alt="Post preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Unread indicator */}
                          {!notification.read && (
                            <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}