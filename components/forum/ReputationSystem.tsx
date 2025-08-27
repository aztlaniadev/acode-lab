"use client"

import { useState, useEffect } from 'react'
import { 
  TrendingUp, Award, Star, Target, Zap, Crown,
  ChevronUp, ChevronDown, Heart, Share, Bookmark,
  Flag, MoreHorizontal, Trophy, Medal, Shield,
  Flame, Users, Clock, Eye, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface ReputationSystemProps {
  postId: string
  postType: 'question' | 'answer' | 'comment'
  currentVotes: number
  userVote?: 'up' | 'down' | null
  onVote: (type: 'up' | 'down') => void
  author: {
    id: string
    name: string
    avatar: string
    reputation: number
    level: number
    badges: Array<{
      id: string
      name: string
      icon: string
      rarity: 'common' | 'rare' | 'epic' | 'legendary'
    }>
  }
  isOwn?: boolean
  canVote?: boolean
  stats?: {
    helpful: number
    views: number
    shares: number
    bookmarks: number
  }
}

interface VotingButtonProps {
  direction: 'up' | 'down'
  isActive: boolean
  count: number
  onClick: () => void
  disabled: boolean
  showAnimation?: boolean
}

const VotingButton = ({ direction, isActive, count, onClick, disabled, showAnimation }: VotingButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setIsAnimating(true)
    onClick()
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={handleClick}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 h-16 w-12 relative ${
              isAnimating ? 'animate-pulse' : ''
            } ${direction === 'up' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
          >
            {direction === 'up' ? (
              <ChevronUp className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
            ) : (
              <ChevronDown className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
            )}
            <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
              {count > 0 && direction === 'up' ? `+${count}` : count}
            </span>
            
            {showAnimation && isAnimating && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{direction === 'up' ? 'Útil' : 'Não útil'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ReputationBadge = ({ reputation, level }: { reputation: number; level: number }) => {
  const getBadgeColor = (level: number) => {
    if (level >= 50) return 'from-purple-500 to-pink-500'
    if (level >= 30) return 'from-yellow-500 to-orange-500'
    if (level >= 15) return 'from-blue-500 to-indigo-500'
    if (level >= 5) return 'from-green-500 to-emerald-500'
    return 'from-gray-500 to-gray-600'
  }

  const getBadgeIcon = (level: number) => {
    if (level >= 50) return Crown
    if (level >= 30) return Trophy
    if (level >= 15) return Medal
    if (level >= 5) return Award
    return Star
  }

  const BadgeIcon = getBadgeIcon(level)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(level)} text-white text-xs font-medium`}>
            <BadgeIcon className="h-3 w-3" />
            <span>{reputation.toLocaleString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">Nível {level}</p>
            <p className="text-xs">{reputation.toLocaleString()} pontos de reputação</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const UserBadges = ({ badges }: { badges: Array<{ id: string; name: string; icon: string; rarity: string }> }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500'
      case 'epic': return 'from-indigo-500 to-purple-500'
      case 'rare': return 'from-blue-500 to-indigo-500'
      case 'common': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  return (
    <div className="flex gap-1">
      {badges.slice(0, 3).map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center text-white text-xs`}>
                {badge.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.name}</p>
              <p className="text-xs capitalize">{badge.rarity}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {badges.length > 3 && (
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
          +{badges.length - 3}
        </div>
      )}
    </div>
  )
}

export const ReputationSystem = ({
  postId,
  postType,
  currentVotes,
  userVote,
  onVote,
  author,
  isOwn = false,
  canVote = true,
  stats
}: ReputationSystemProps) => {
  const [localVotes, setLocalVotes] = useState(currentVotes)
  const [localUserVote, setLocalUserVote] = useState(userVote)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showReputationDetails, setShowReputationDetails] = useState(false)

  const upVotes = Math.max(0, localVotes)
  const downVotes = Math.max(0, -localVotes)

  const handleVote = (type: 'up' | 'down') => {
    if (!canVote || isOwn) return

    let newVote: 'up' | 'down' | null = type
    let voteDifference = 0

    if (localUserVote === type) {
      // Remove vote
      newVote = null
      voteDifference = type === 'up' ? -1 : 1
    } else if (localUserVote === null) {
      // Add new vote
      voteDifference = type === 'up' ? 1 : -1
    } else {
      // Change vote
      voteDifference = type === 'up' ? 2 : -2
    }

    setLocalVotes(prev => prev + voteDifference)
    setLocalUserVote(newVote)
    onVote(type)
  }

  const getReputationProgress = () => {
    const currentLevel = author.level
    const baseXP = Math.pow(currentLevel, 2) * 100
    const nextLevelXP = Math.pow(currentLevel + 1, 2) * 100
    const currentXP = author.reputation % 1000
    return (currentXP / (nextLevelXP - baseXP)) * 100
  }

  return (
    <div className="flex items-start gap-4">
      {/* Voting Section */}
      <div className="flex flex-col items-center gap-2">
        <VotingButton
          direction="up"
          isActive={localUserVote === 'up'}
          count={upVotes}
          onClick={() => handleVote('up')}
          disabled={!canVote || isOwn}
          showAnimation={true}
        />

        {/* Vote Score */}
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold ${
            localVotes > 0 ? 'text-green-600' : 
            localVotes < 0 ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {localVotes}
          </span>
          <span className="text-xs text-muted-foreground">
            {postType === 'question' ? 'votos' : 'pontos'}
          </span>
        </div>

        <VotingButton
          direction="down"
          isActive={localUserVote === 'down'}
          count={downVotes}
          onClick={() => handleVote('down')}
          disabled={!canVote || isOwn}
          showAnimation={true}
        />

        <Separator className="w-full my-2" />

        {/* Additional Actions */}
        <div className="flex flex-col items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isBookmarked ? 'Remover favorito' : 'Favoritar'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartilhar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isOwn && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Flag className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reportar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Author Information */}
      <div className="flex-1">
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{author.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{author.name}</h4>
                  <ReputationBadge reputation={author.reputation} level={author.level} />
                </div>

                {/* User Badges */}
                {author.badges.length > 0 && (
                  <UserBadges badges={author.badges} />
                )}

                {/* Reputation Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progresso Nível {author.level}</span>
                    <span>{Math.round(getReputationProgress())}%</span>
                  </div>
                  <Progress value={getReputationProgress()} className="h-1" />
                </div>

                {/* Quick Stats */}
                {stats && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{stats.helpful}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{stats.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="h-3 w-3" />
                      <span>{stats.shares}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" />
                      <span>{stats.bookmarks}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Menu */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Reputation Boost Animation */}
            {localUserVote === 'up' && (
              <div className="absolute top-0 right-0 pointer-events-none">
                <div className="animate-bounce">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-bl-lg text-xs font-medium">
                    +{postType === 'question' ? '5' : '10'} REP
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expanded Reputation Details */}
        {showReputationDetails && (
          <Card className="mt-2">
            <CardHeader>
              <CardTitle className="text-sm">Detalhes de Reputação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Perguntas:</span>
                  <span className="font-medium ml-2">42</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Respostas:</span>
                  <span className="font-medium ml-2">89</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Melhores respostas:</span>
                  <span className="font-medium ml-2">23</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sequência:</span>
                  <span className="font-medium ml-2">15 dias</span>
                </div>
              </div>

              <Separator />

              <div>
                <h5 className="text-sm font-medium mb-2">Conquistas Recentes</h5>
                <div className="space-y-2">
                  {author.badges.slice(0, 2).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-xs`}>
                        {badge.icon}
                      </div>
                      <span className="text-sm">{badge.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toggle Details Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReputationDetails(!showReputationDetails)}
          className="mt-2 text-xs"
        >
          {showReputationDetails ? 'Ocultar detalhes' : 'Ver detalhes de reputação'}
        </Button>
      </div>
    </div>
  )
}