"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, PanInfo, useAnimation } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, MoreHorizontal, Share2,
  Heart, MessageCircle, Bookmark, ChevronUp, ChevronDown,
  Menu, X, Search, Filter, SortAsc, Grid, List,
  ArrowUp, Maximize2, Minimize2, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
// import { useSwipeable } from 'react-swipeable'

// Types
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  refreshThreshold?: number
}

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  snapPoints?: number[]
  initialSnap?: number
}

interface TouchFeedbackProps {
  children: React.ReactNode
  onTap?: () => void
  onLongPress?: () => void
  className?: string
  haptic?: boolean
}

// Swipeable Card Component
export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = ''
}: SwipeableCardProps) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const controls = useAnimation()

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setDragOffset({ x: info.offset.x, y: info.offset.y })
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 100
    const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y)

    // Determine swipe direction
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
      // Horizontal swipe
      if (info.offset.x > threshold || (info.offset.x > 50 && velocity > 500)) {
        onSwipeRight?.()
        controls.start({ x: window.innerWidth, opacity: 0 })
      } else if (info.offset.x < -threshold || (info.offset.x < -50 && velocity > 500)) {
        onSwipeLeft?.()
        controls.start({ x: -window.innerWidth, opacity: 0 })
      } else {
        controls.start({ x: 0, y: 0 })
      }
    } else {
      // Vertical swipe
      if (info.offset.y > threshold || (info.offset.y > 50 && velocity > 500)) {
        onSwipeDown?.()
      } else if (info.offset.y < -threshold || (info.offset.y < -50 && velocity > 500)) {
        onSwipeUp?.()
      } else {
        controls.start({ x: 0, y: 0 })
      }
    }

    setDragOffset({ x: 0, y: 0 })
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      className={`select-none ${className}`}
      style={{
        x: dragOffset.x,
        y: dragOffset.y,
        scale: isDragging ? 0.95 : 1,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      
      {/* Swipe indicators */}
      {isDragging && (
        <>
          {Math.abs(dragOffset.x) > 50 && (
            <div className={`absolute top-1/2 transform -translate-y-1/2 ${
              dragOffset.x > 0 ? 'left-4' : 'right-4'
            } bg-white/90 rounded-full p-2 shadow-lg`}>
              {dragOffset.x > 0 ? (
                <ChevronRight className="h-6 w-6 text-green-600" />
              ) : (
                <ChevronLeft className="h-6 w-6 text-red-600" />
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

// Pull to Refresh Component
export const PullToRefresh = ({
  onRefresh,
  children,
  refreshThreshold = 80
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setCanRefresh(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!canRefresh || isRefreshing) return

    const touch = e.touches[0]
    const startY = touch.clientY
    
    if (startY > 0 && containerRef.current?.scrollTop === 0) {
      const distance = Math.max(0, startY - window.scrollY)
      setPullDistance(Math.min(distance, refreshThreshold * 1.5))
    }
  }, [canRefresh, isRefreshing, refreshThreshold])

  const handleTouchEnd = useCallback(async () => {
    if (!canRefresh || isRefreshing) return

    if (pullDistance >= refreshThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    
    setPullDistance(0)
    setCanRefresh(false)
  }, [canRefresh, isRefreshing, pullDistance, refreshThreshold, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const refreshProgress = Math.min(pullDistance / refreshThreshold, 1)

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: pullDistance > 0 ? pullDistance - 60 : -60,
          opacity: pullDistance > 20 ? 1 : 0
        }}
        style={{ height: 60 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: isRefreshing ? 360 : refreshProgress * 360
            }}
            transition={{
              duration: isRefreshing ? 1 : 0,
              repeat: isRefreshing ? Infinity : 0,
              ease: 'linear'
            }}
          >
            <RotateCcw className="h-5 w-5 text-primary" />
          </motion.div>
          
          <span className="text-sm text-muted-foreground">
            {isRefreshing ? 'Atualizando...' : 
             pullDistance >= refreshThreshold ? 'Solte para atualizar' : 
             'Puxe para atualizar'}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${refreshProgress * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{
          paddingTop: pullDistance > 0 ? pullDistance : 0
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Bottom Sheet Component
export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.25, 0.5, 0.9],
  initialSnap = 1
}: BottomSheetProps) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const [isDragging, setIsDragging] = useState(false)
  const controls = useAnimation()

  const snapHeight = snapPoints[currentSnap] * window.innerHeight

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: `${100 - snapPoints[currentSnap] * 100}%` })
    } else {
      controls.start({ y: '100%' })
    }
  }, [isOpen, currentSnap, snapPoints, controls])

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    
    const currentY = info.point.y
    const velocity = info.velocity.y
    
    // Find closest snap point
    let targetSnap = currentSnap
    
    if (velocity > 500) {
      // Fast swipe down
      if (currentSnap > 0) targetSnap = currentSnap - 1
      else onClose()
    } else if (velocity < -500) {
      // Fast swipe up
      if (currentSnap < snapPoints.length - 1) targetSnap = currentSnap + 1
    } else {
      // Snap to closest point based on position
      const windowHeight = window.innerHeight
      const distances = snapPoints.map((point, index) => ({
        index,
        distance: Math.abs(currentY - (windowHeight * (1 - point)))
      }))
      
      targetSnap = distances.sort((a, b) => a.distance - b.distance)[0].index
    }
    
    if (targetSnap !== currentSnap) {
      setCurrentSnap(targetSnap)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-background border-t rounded-t-xl shadow-2xl z-50"
        style={{ height: '100vh' }}
        initial={{ y: '100%' }}
        animate={controls}
        exit={{ y: '100%' }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {/* Handle */}
        <div className="flex justify-center p-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Snap indicators */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
          {snapPoints.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSnap(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSnap ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </>
  )
}

// Touch Feedback Component
export const TouchFeedback = ({
  children,
  onTap,
  onLongPress,
  className = '',
  haptic = true
}: TouchFeedbackProps) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const longPressTimer = useRef<NodeJS.Timeout>()
  const elementRef = useRef<HTMLDivElement>(null)

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!haptic || typeof window === 'undefined') return
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[type])
    }
  }, [haptic])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsPressed(true)
    triggerHaptic('light')

    const rect = elementRef.current?.getBoundingClientRect()
    if (rect) {
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      
      const rippleId = Date.now()
      setRipples(prev => [...prev, { id: rippleId, x, y }])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== rippleId))
      }, 600)
    }

    // Long press detection
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        triggerHaptic('heavy')
        onLongPress()
      }, 500)
    }
  }, [onLongPress, triggerHaptic])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    onTap?.()
  }, [onTap])

  const handleTouchCancel = useCallback(() => {
    setIsPressed(false)
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      style={{
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 0.1s ease'
      }}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/20 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            marginLeft: 0,
            marginTop: 0
          }}
          animate={{
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
            opacity: [0.5, 0]
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Mobile Action Sheet Component
export const MobileActionSheet = ({
  isOpen,
  onClose,
  actions,
  title
}: {
  isOpen: boolean
  onClose: () => void
  actions: Array<{
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: () => void
    destructive?: boolean
    disabled?: boolean
  }>
  title?: string
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4 space-y-2">
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <TouchFeedback
              key={index}
              onTap={() => {
                action.onClick()
                onClose()
              }}
              className={`w-full p-4 rounded-lg border transition-colors ${
                action.destructive
                  ? 'text-red-600 hover:bg-red-50 border-red-200'
                  : 'hover:bg-muted border-border'
              } ${action.disabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-3">
                {IconComponent && <IconComponent className="h-5 w-5" />}
                <span className="font-medium">{action.label}</span>
              </div>
            </TouchFeedback>
          )
        })}
      </div>
    </BottomSheet>
  )
}

// Mobile Optimized Post Card
export const MobilePostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserClick
}: {
  post: any
  onLike: () => void
  onComment: () => void
  onShare: () => void
  onBookmark: () => void
  onUserClick: () => void
}) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <SwipeableCard
      onSwipeLeft={onLike}
      onSwipeRight={onBookmark}
      className="mb-4"
    >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-3">
            <TouchFeedback onTap={onUserClick} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {post.timestamp.toLocaleDateString()}
                </p>
              </div>
            </TouchFeedback>
            
            <TouchFeedback onTap={() => setShowActions(true)}>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </TouchFeedback>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>

          {/* Media */}
          {post.images?.length > 0 && (
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={post.images[0]}
                alt="Post content"
                className="w-full h-full object-cover"
                fill
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between p-4 pt-3">
            <div className="flex items-center gap-6">
              <TouchFeedback onTap={onLike} haptic>
                <div className="flex items-center gap-2">
                  <Heart 
                    className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                  />
                  <span className="text-sm font-medium">{post.likes}</span>
                </div>
              </TouchFeedback>
              
              <TouchFeedback onTap={onComment} haptic>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </div>
              </TouchFeedback>
              
              <TouchFeedback onTap={onShare} haptic>
                <Share2 className="h-6 w-6 text-muted-foreground" />
              </TouchFeedback>
            </div>
            
            <TouchFeedback onTap={onBookmark} haptic>
              <Bookmark 
                className={`h-6 w-6 ${post.isBookmarked ? 'fill-current' : ''} text-muted-foreground`} 
              />
            </TouchFeedback>
          </div>
        </CardContent>
      </Card>

      {/* Action Sheet */}
      <MobileActionSheet
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Post"
        actions={[
          { label: 'Compartilhar', icon: Share2, onClick: onShare },
          { label: 'Salvar', icon: Bookmark, onClick: onBookmark },
          { label: 'Reportar', icon: MoreHorizontal, onClick: () => {}, destructive: true }
        ]}
      />
    </SwipeableCard>
  )
}

// Floating Action Button
export const FloatingActionButton = ({
  icon: IconComponent,
  onClick,
  className = ''
}: {
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  className?: string
}) => {
  return (
    <TouchFeedback
      onTap={onClick}
      haptic
      className={`fixed bottom-20 right-4 z-30 ${className}`}
    >
      <motion.div
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconComponent className="h-6 w-6" />
      </motion.div>
    </TouchFeedback>
  )
}

const MobileOptimizedComponents = {
  SwipeableCard,
  PullToRefresh,
  BottomSheet,
  TouchFeedback,
  MobileActionSheet,
  MobilePostCard,
  FloatingActionButton
}

export default MobileOptimizedComponents