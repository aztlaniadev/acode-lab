"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Award, Star, Crown, Zap, Target, 
  TrendingUp, Flame, Shield, Heart, Gem,
  Users, MessageCircle, ThumbsUp, Share2,
  Calendar, Rocket, Medal, Gift, CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Types
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'social' | 'forum' | 'engagement' | 'special'
  points: number
  unlockedAt?: Date
  progress?: {
    current: number
    total: number
  }
  requirements: string[]
  hidden?: boolean
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  category: string
  earnedAt?: Date
}

interface UserLevel {
  current: number
  xp: number
  xpToNext: number
  totalXp: number
  title: string
  benefits: string[]
}

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  points: number
  level: number
  badges: number
  achievements: number
  trend: 'up' | 'down' | 'same'
  change: number
}

interface Quest {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  category: 'social' | 'forum' | 'engagement'
  progress: {
    current: number
    total: number
  }
  reward: {
    xp: number
    points: number
    badge?: string
    achievement?: string
  }
  expiresAt?: Date
  completed: boolean
  claimedAt?: Date
}

interface GamificationSystemProps {
  userId: string
  userLevel: UserLevel
  achievements: Achievement[]
  badges: Badge[]
  quests: Quest[]
  leaderboard: LeaderboardEntry[]
  onClaimReward: (questId: string) => void
  onViewAchievement: (achievementId: string) => void
}

// Rarity colors
const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
}

// Tier colors
const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-400 to-cyan-600',
  diamond: 'from-blue-400 to-purple-600'
}

// Level titles
const levelTitles = [
  'Novato', 'Iniciante', 'Aprendiz', 'Estudante', 'Colaborador',
  'Contribuidor', 'Especialista', 'Veterano', 'Expert', 'Mestre',
  'Guru', 'Sábio', 'Lenda', 'Ícone', 'Divindade'
]

// XP calculation
const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Achievement Card Component
const AchievementCard = ({ 
  achievement, 
  onClick 
}: { 
  achievement: Achievement
  onClick: () => void 
}) => {
  const isUnlocked = !!achievement.unlockedAt
  const progressPercentage = achievement.progress 
    ? (achievement.progress.current / achievement.progress.total) * 100 
    : 0

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${
        isUnlocked 
          ? 'bg-gradient-to-br from-background to-primary/5 border-primary/20 shadow-lg' 
          : 'bg-muted/50 border-muted-foreground/20'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div className={`p-3 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} ${
              isUnlocked ? 'opacity-100' : 'opacity-40'
            }`}>
              <span className="text-2xl">{achievement.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Achievement Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.hidden && !isUnlocked ? '???' : achievement.name}
                  </h4>
                  <p className={`text-sm mt-1 ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                    {achievement.hidden && !isUnlocked 
                      ? 'Conquista secreta' 
                      : achievement.description
                    }
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs capitalize bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white border-0`}
                  >
                    {achievement.rarity}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" />
                    <span>{achievement.points}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar for incomplete achievements */}
              {!isUnlocked && achievement.progress && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progresso</span>
                    <span>{achievement.progress.current}/{achievement.progress.total}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {/* Unlock date */}
              {isUnlocked && achievement.unlockedAt && (
                <p className="text-xs text-green-600 mt-2">
                  Desbloqueado em {achievement.unlockedAt.toLocaleDateString('pt-BR')}
                </p>
              )}

              {/* Requirements */}
              {!isUnlocked && !achievement.hidden && achievement.requirements.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Requisitos:</p>
                  <ul className="text-xs space-y-1">
                    {achievement.requirements.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {req}
                      </li>
                    ))}
                    {achievement.requirements.length > 2 && (
                      <li className="text-muted-foreground/60">
                        +{achievement.requirements.length - 2} mais...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Shimmer effect for unlocked achievements */}
          {isUnlocked && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: [-300, 300]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5
              }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Badge Display Component
const BadgeDisplay = ({ badge }: { badge: Badge }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative group"
    >
      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tierColors[badge.tier]} p-0.5`}>
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
          <span className="text-xl">{badge.icon}</span>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {badge.name}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
      </div>
    </motion.div>
  )
}

// Quest Card Component
const QuestCard = ({ 
  quest, 
  onClaim 
}: { 
  quest: Quest
  onClaim: () => void 
}) => {
  const progressPercentage = (quest.progress.current / quest.progress.total) * 100
  const isCompleted = quest.completed
  const isClaimed = !!quest.claimedAt

  const typeColors = {
    daily: 'bg-blue-500',
    weekly: 'bg-green-500',
    monthly: 'bg-purple-500',
    special: 'bg-orange-500'
  }

  return (
    <Card className={`transition-all duration-300 ${
      isCompleted && !isClaimed ? 'border-green-500 shadow-lg shadow-green-500/20' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-full ${typeColors[quest.type]} rounded-full flex-shrink-0`} />
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{quest.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
              </div>
              
              <Badge variant="outline" className="capitalize">
                {quest.type}
              </Badge>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span className={isCompleted ? 'text-green-600 font-medium' : ''}>
                  {quest.progress.current}/{quest.progress.total}
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className={`h-2 ${isCompleted ? 'bg-green-100' : ''}`}
              />
            </div>

            {/* Rewards */}
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Recompensas:</p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>{quest.reward.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{quest.reward.points} pts</span>
                </div>
                {quest.reward.badge && (
                  <Badge variant="secondary" className="text-xs">
                    Distintivo
                  </Badge>
                )}
              </div>
            </div>

            {/* Action button */}
            <div className="mt-4">
              {isClaimed ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Recompensa coletada</span>
                </div>
              ) : isCompleted ? (
                <Button 
                  onClick={onClaim}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Coletar Recompensa
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {quest.expiresAt && (
                    <>Expira em: {quest.expiresAt.toLocaleDateString('pt-BR')}</>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Leaderboard Component
const LeaderboardTable = ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) => {
  return (
    <div className="space-y-2">
      {leaderboard.map((entry) => (
        <Card key={entry.userId} className={`transition-all duration-300 ${
          entry.rank <= 3 ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8">
                {entry.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                {entry.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                {entry.rank === 3 && <Award className="h-6 w-6 text-amber-600" />}
                {entry.rank > 3 && (
                  <span className="text-lg font-bold text-muted-foreground">
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* User info */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{entry.username}</h4>
                  <Badge variant="outline">Nível {entry.level}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>{entry.points.toLocaleString()} pontos</span>
                  <span>{entry.badges} distintivos</span>
                  <span>{entry.achievements} conquistas</span>
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-1">
                {entry.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {entry.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                <span className={`text-sm ${
                  entry.trend === 'up' ? 'text-green-600' : 
                  entry.trend === 'down' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {entry.change > 0 ? '+' : ''}{entry.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Main Gamification Component
export const GamificationSystem = ({
  userId,
  userLevel,
  achievements,
  badges,
  quests,
  leaderboard,
  onClaimReward,
  onViewAchievement
}: GamificationSystemProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  // Calculate stats
  const stats = useMemo(() => {
    const unlockedAchievements = achievements.filter(a => a.unlockedAt)
    const completedQuests = quests.filter(q => q.completed)
    const totalXp = userLevel.totalXp
    const progressToNext = (userLevel.xp / userLevel.xpToNext) * 100

    return {
      unlockedAchievements: unlockedAchievements.length,
      totalAchievements: achievements.length,
      completedQuests: completedQuests.length,
      totalQuests: quests.length,
      badges: badges.length,
      totalXp,
      progressToNext
    }
  }, [achievements, quests, badges, userLevel])

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      if (filter === 'unlocked') return achievement.unlockedAt
      if (filter === 'locked') return !achievement.unlockedAt
      return true
    })
  }, [achievements, filter])

  // Pending quests
  const pendingQuests = quests.filter(q => q.completed && !q.claimedAt)

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with level info */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{userLevel.current}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userLevel.title}</h2>
                <p className="text-muted-foreground">Nível {userLevel.current}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso para o próximo nível</span>
                <span>{userLevel.xp.toLocaleString()} / {userLevel.xpToNext.toLocaleString()} XP</span>
              </div>
              <Progress value={stats.progressToNext} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.unlockedAchievements}</p>
                <p className="text-xs text-muted-foreground">Conquistas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{stats.badges}</p>
                <p className="text-xs text-muted-foreground">Distintivos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.totalXp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending rewards notification */}
      {pendingQuests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800">
                Você tem {pendingQuests.length} recompensa(s) para coletar!
              </h4>
              <p className="text-sm text-green-700">
                Vá para a aba &ldquo;Missões&rdquo; para coletar suas recompensas.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('quests')}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Ver Missões
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="quests">Missões</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Recent badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Distintivos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {badges.slice(0, 8).map((badge) => (
                  <BadgeDisplay key={badge.id} badge={badge} />
                ))}
                {badges.length === 0 && (
                  <p className="text-muted-foreground text-center py-8 w-full">
                    Nenhum distintivo conquistado ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Conquistas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements
                  .filter(a => a.unlockedAt)
                  .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                  .slice(0, 4)
                  .map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onClick={() => onViewAchievement(achievement.id)}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Conquistas</h3>
              <p className="text-muted-foreground">
                {stats.unlockedAchievements} de {stats.totalAchievements} desbloqueadas
              </p>
            </div>
            
            <div className="flex gap-2">
              {['all', 'unlocked', 'locked'].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterType as any)}
                  className="capitalize"
                >
                  {filterType === 'all' ? 'Todas' : 
                   filterType === 'unlocked' ? 'Desbloqueadas' : 'Bloqueadas'}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onClick={() => onViewAchievement(achievement.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Quests Tab */}
        <TabsContent value="quests" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Missões</h3>
            <p className="text-muted-foreground">
              Complete missões para ganhar XP, pontos e desbloqueios especiais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={() => onClaimReward(quest.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Ranking Global</h3>
            <p className="text-muted-foreground">
              Veja como você se compara com outros usuários
            </p>
          </div>

          <LeaderboardTable leaderboard={leaderboard} />
        </TabsContent>
      </Tabs>
    </div>
  )
}