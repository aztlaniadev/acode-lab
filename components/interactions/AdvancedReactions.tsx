"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, ThumbsUp, ThumbsDown, Laugh, Angry, 
  AlertCircle, Frown, Plus, Minus, Eye, Share2,
  MessageCircle, Bookmark, Flag, MoreHorizontal,
  Sparkles, Flame, Star, Award, Crown, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

// Types
interface Reaction {
  id: string
  emoji: string
  name: string
  color: string
  count: number
  users: Array<{
    id: string
    name: string
    avatar: string
  }>
  userReacted: boolean
  intensity?: number // 1-5 for some reactions
}

interface ReactionStats {
  totalReactions: number
  uniqueUsers: number
  topReaction: string
  engagementScore: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

interface AdvancedReactionsProps {
  postId: string
  reactions: Reaction[]
  currentUserId: string
  onReact: (reactionId: string, intensity?: number) => void
  onUnreact: (reactionId: string) => void
  showStats?: boolean
  enableCustomReactions?: boolean
  enableIntensity?: boolean
  maxDisplayCount?: number
}

// Default reaction types
const defaultReactions = [
  { id: 'like', emoji: '👍', name: 'Curtir', color: 'text-blue-500' },
  { id: 'love', emoji: '❤️', name: 'Amar', color: 'text-red-500' },
  { id: 'laugh', emoji: '😂', name: 'Rir', color: 'text-yellow-500' },
  { id: 'wow', emoji: '😮', name: 'Uau', color: 'text-purple-500' },
  { id: 'sad', emoji: '😢', name: 'Triste', color: 'text-blue-400' },
  { id: 'angry', emoji: '😠', name: 'Raiva', color: 'text-red-600' },
  { id: 'flame', emoji: '🔥', name: 'Fogo', color: 'text-orange-500' },
  { id: 'star', emoji: '⭐', name: 'Estrela', color: 'text-yellow-400' },
  { id: 'genius', emoji: '🧠', name: 'Genial', color: 'text-indigo-500' },
  { id: 'rocket', emoji: '🚀', name: 'Incrível', color: 'text-green-500' }
]

// Premium reactions (unlocked with achievements)
const premiumReactions = [
  { id: 'diamond', emoji: '💎', name: 'Valioso', color: 'text-cyan-400' },
  { id: 'crown', emoji: '👑', name: 'Real', color: 'text-yellow-600' },
  { id: 'magic', emoji: '✨', name: 'Mágico', color: 'text-purple-400' },
  { id: 'trophy', emoji: '🏆', name: 'Vencedor', color: 'text-amber-500' }
]

// Floating reaction component
const FloatingReaction = ({ 
  emoji, 
  x, 
  y 
}: { 
  emoji: string
  x: number
  y: number 
}) => (
  <motion.div
    initial={{ 
      opacity: 1, 
      scale: 1, 
      x: x - 12, 
      y: y - 12 
    }}
    animate={{ 
      opacity: 0, 
      scale: 1.5, 
      y: y - 60 
    }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
    className="fixed pointer-events-none z-50 text-2xl"
    style={{ left: x, top: y }}
  >
    {emoji}
  </motion.div>
)

// Reaction button with animation
const ReactionButton = ({ 
  reaction, 
  onClick, 
  onIntensityChange,
  enableIntensity = false,
  showCount = true 
}: {
  reaction: Reaction
  onClick: (e: React.MouseEvent) => void
  onIntensityChange?: (intensity: number) => void
  enableIntensity?: boolean
  showCount?: boolean
}) => {
  const [showIntensity, setShowIntensity] = useState(false)
  const [localIntensity, setLocalIntensity] = useState(reaction.intensity || 1)

  const handleClick = (e: React.MouseEvent) => {
    if (enableIntensity && !reaction.userReacted) {
      setShowIntensity(true)
    } else {
      onClick(e)
    }
  }

  const handleIntensitySelect = (intensity: number) => {
    setLocalIntensity(intensity)
    setShowIntensity(false)
    onIntensityChange?.(intensity)
  }

  return (
    <Popover open={showIntensity} onOpenChange={setShowIntensity}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
            reaction.userReacted
              ? 'bg-primary/10 border border-primary/30 text-primary'
              : 'bg-muted/50 hover:bg-muted border border-transparent'
          }`}
        >
          <span className="text-lg">{reaction.emoji}</span>
          {showCount && reaction.count > 0 && (
            <span className="text-sm font-medium">
              {reaction.count}
            </span>
          )}
          {reaction.userReacted && reaction.intensity && reaction.intensity > 1 && (
            <Badge variant="secondary" className="text-xs h-4">
              {reaction.intensity}x
            </Badge>
          )}
        </motion.button>
      </PopoverTrigger>
      {enableIntensity && (
        <PopoverContent className="w-auto p-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-2">Intensidade:</span>
            {[1, 2, 3, 4, 5].map((intensity) => (
              <Button
                key={intensity}
                variant={localIntensity === intensity ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleIntensitySelect(intensity)}
                className="w-8 h-8 p-0"
              >
                {intensity}
              </Button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

// Reaction picker component
const ReactionPicker = ({ 
  onSelect, 
  userLevel = 1,
  enableCustom = false 
}: {
  onSelect: (reactionId: string) => void
  userLevel?: number
  enableCustom?: boolean
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [customEmoji, setCustomEmoji] = useState('')

  // Available reactions based on user level
  const availableReactions = [
    ...defaultReactions,
    ...(userLevel >= 10 ? premiumReactions : [])
  ]

  const filteredReactions = availableReactions.filter(reaction =>
    reaction.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Buscar reação..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />

      {/* Reactions grid */}
      <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
        {filteredReactions.map((reaction) => (
          <Button
            key={reaction.id}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(reaction.id)}
            className="flex flex-col items-center gap-1 h-auto p-2"
          >
            <span className="text-xl">{reaction.emoji}</span>
            <span className="text-xs">{reaction.name}</span>
          </Button>
        ))}
      </div>

      {/* Custom emoji input */}
      {enableCustom && (
        <>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium">Emoji personalizado:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🎉"
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                maxLength={2}
              />
              <Button
                size="sm"
                onClick={() => customEmoji && onSelect(`custom_${customEmoji}`)}
                disabled={!customEmoji}
              >
                Usar
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Premium unlock hint */}
      {userLevel < 10 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Reações Premium
            </span>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            Chegue ao nível 10 para desbloquear reações especiais!
          </p>
        </div>
      )}
    </div>
  )
}

// Main component
export const AdvancedReactions = ({
  postId,
  reactions,
  currentUserId,
  onReact,
  onUnreact,
  showStats = true,
  enableCustomReactions = false,
  enableIntensity = false,
  maxDisplayCount = 6
}: AdvancedReactionsProps) => {
  const [showAllReactions, setShowAllReactions] = useState(false)
  const [floatingReactions, setFloatingReactions] = useState<Array<{
    id: string
    emoji: string
    x: number
    y: number
  }>>([])
  const [showPicker, setShowPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate stats
  const stats: ReactionStats = {
    totalReactions: reactions.reduce((sum, r) => sum + r.count, 0),
    uniqueUsers: new Set(reactions.flatMap(r => r.users.map(u => u.id))).size,
    topReaction: reactions.sort((a, b) => b.count - a.count)[0]?.emoji || '',
    engagementScore: Math.round(reactions.reduce((sum, r) => sum + r.count, 0) / 10),
    sentiment: calculateSentiment(reactions)
  }

  // Calculate sentiment based on reaction types
  function calculateSentiment(reactions: Reaction[]): 'positive' | 'negative' | 'neutral' {
    const positiveReactions = ['like', 'love', 'laugh', 'wow', 'flame', 'star', 'genius', 'rocket']
    const negativeReactions = ['sad', 'angry']
    
    let positiveCount = 0
    let negativeCount = 0
    
    reactions.forEach(reaction => {
      if (positiveReactions.includes(reaction.id)) {
        positiveCount += reaction.count
      } else if (negativeReactions.includes(reaction.id)) {
        negativeCount += reaction.count
      }
    })
    
    if (positiveCount > negativeCount * 2) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  // Add floating reaction animation
  const addFloatingReaction = useCallback((emoji: string, event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const id = Math.random().toString(36).substr(2, 9)
    const newFloating = {
      id,
      emoji,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }

    setFloatingReactions(prev => [...prev, newFloating])
    
    // Remove after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(f => f.id !== id))
    }, 1000)
  }, [])

  // Handle reaction click
  const handleReactionClick = useCallback((reaction: Reaction, event: React.MouseEvent) => {
    if (reaction.userReacted) {
      onUnreact(reaction.id)
    } else {
      onReact(reaction.id)
      addFloatingReaction(reaction.emoji, event)
    }
  }, [onReact, onUnreact, addFloatingReaction])

  // Handle custom reaction
  const handleCustomReaction = useCallback((reactionId: string) => {
    onReact(reactionId)
    setShowPicker(false)
  }, [onReact])

  // Sort reactions by count
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count)
  const displayReactions = showAllReactions 
    ? sortedReactions 
    : sortedReactions.slice(0, maxDisplayCount)

  const hasMoreReactions = sortedReactions.length > maxDisplayCount

  return (
    <div ref={containerRef} className="relative space-y-4">
      {/* Stats bar */}
      {showStats && stats.totalReactions > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {stats.totalReactions} reações • {stats.uniqueUsers} pessoas
                </span>
                {stats.topReaction && (
                  <div className="flex items-center gap-1">
                    <span>Mais popular:</span>
                    <span className="text-lg">{stats.topReaction}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${
                    stats.sentiment === 'positive' ? 'text-green-600 border-green-300' :
                    stats.sentiment === 'negative' ? 'text-red-600 border-red-300' :
                    'text-gray-600 border-gray-300'
                  }`}
                >
                  {stats.sentiment === 'positive' ? '😊 Positivo' :
                   stats.sentiment === 'negative' ? '😔 Negativo' :
                   '😐 Neutro'}
                </Badge>
                
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  {stats.engagementScore}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-2 flex-wrap">
        {displayReactions.map((reaction) => (
          <ReactionButton
            key={reaction.id}
            reaction={reaction}
            onClick={(e) => handleReactionClick(reaction, e)}
            enableIntensity={enableIntensity}
            onIntensityChange={(intensity) => onReact(reaction.id, intensity)}
          />
        ))}
        
        {/* Show more button */}
        {hasMoreReactions && !showAllReactions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllReactions(true)}
            className="text-muted-foreground"
          >
            +{sortedReactions.length - maxDisplayCount} mais
          </Button>
        )}
        
        {/* Show less button */}
        {showAllReactions && hasMoreReactions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllReactions(false)}
            className="text-muted-foreground"
          >
            Mostrar menos
          </Button>
        )}

        {/* Add reaction button */}
        <Popover open={showPicker} onOpenChange={setShowPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" side="top">
            <ReactionPicker
              onSelect={handleCustomReaction}
              enableCustom={enableCustomReactions}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Reaction details */}
      {reactions.some(r => r.count > 0) && (
        <div className="space-y-2">
          {displayReactions
            .filter(r => r.count > 0)
            .map((reaction) => (
              <Popover key={reaction.id}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-2 justify-start text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{reaction.emoji}</span>
                      <span className="text-sm">{reaction.name}</span>
                      <Badge variant="secondary">{reaction.count}</Badge>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="text-xl">{reaction.emoji}</span>
                      {reaction.name} ({reaction.count})
                    </h4>
                    
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {reaction.users.map((user) => (
                        <div key={user.id} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
        </div>
      )}

      {/* Floating reactions */}
      <AnimatePresence>
        {floatingReactions.map((floating) => (
          <FloatingReaction
            key={floating.id}
            emoji={floating.emoji}
            x={floating.x}
            y={floating.y}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}