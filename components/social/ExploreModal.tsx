"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { 
  Search, X, TrendingUp, Hash, MapPin, Calendar, 
  Heart, MessageCircle, Share, Bookmark, Play,
  Users, Filter, Grid, List, SortAsc
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface TrendingTopic {
  id: string
  name: string
  count: number
  trend: 'up' | 'down' | 'stable'
  category: 'hashtag' | 'location' | 'person' | 'topic'
}

interface SearchResult {
  id: string
  type: 'post' | 'user' | 'hashtag' | 'location'
  content: string
  user?: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
    followers: number
  }
  post?: {
    id: string
    content: string
    images: string[]
    likes: number
    comments: number
    shares: number
    timestamp: Date
  }
  hashtag?: {
    name: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }
  location?: {
    name: string
    country: string
    postsCount: number
  }
}

interface ExploreModalProps {
  isOpen: boolean
  onClose: () => void
  trendingTopics: TrendingTopic[]
  searchResults: SearchResult[]
  onSearch: (query: string, filters: SearchFilters) => void
  onUserClick: (userId: string) => void
  onPostClick: (postId: string) => void
  onHashtagClick: (hashtag: string) => void
}

interface SearchFilters {
  type: 'all' | 'post' | 'user' | 'hashtag' | 'location'
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  sortBy: 'relevance' | 'recent' | 'popular' | 'trending'
  location?: string
  verified?: boolean
}

export const ExploreModal = ({
  isOpen,
  onClose,
  trendingTopics,
  searchResults,
  onSearch,
  onUserClick,
  onPostClick,
  onHashtagClick
}: ExploreModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('explore')

  const filteredResults = useMemo(() => {
    let results = searchResults

    if (filters.type !== 'all') {
      results = results.filter(result => result.type === filters.type)
    }

    if (filters.verified && filters.type === 'user') {
      results = results.filter(result => result.user?.verified)
    }

    // Sort results
    switch (filters.sortBy) {
      case 'recent':
        results = results.sort((a, b) => {
          const aDate = a.post?.timestamp || new Date(0)
          const bDate = b.post?.timestamp || new Date(0)
          return bDate.getTime() - aDate.getTime()
        })
        break
      case 'popular':
        results = results.sort((a, b) => {
          const aScore = (a.post?.likes || 0) + (a.post?.comments || 0) + (a.user?.followers || 0)
          const bScore = (b.post?.likes || 0) + (b.post?.comments || 0) + (b.user?.followers || 0)
          return bScore - aScore
        })
        break
      case 'trending':
        results = results.sort((a, b) => {
          const aTrending = a.hashtag?.trend === 'up' ? 1 : 0
          const bTrending = b.hashtag?.trend === 'up' ? 1 : 0
          return bTrending - aTrending
        })
        break
    }

    return results
  }, [searchResults, filters])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      onSearch(query, filters)
      setSearchHistory(prev => [query, ...prev.filter(item => item !== query)].slice(0, 10))
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Explore Panel */}
      <div className="relative ml-auto h-full w-full max-w-5xl bg-background border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Explorar</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pessoas, hashtags, locais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleSearch(searchQuery)}>
              Buscar
            </Button>
          </div>

          {/* Search Filters */}
          <div className="flex items-center gap-3 mt-3">
            <Select
              value={filters.type}
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tudo</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="user">Pessoas</SelectItem>
                <SelectItem value="hashtag">Hashtags</SelectItem>
                <SelectItem value="location">Locais</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="recent">Recente</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="trending">Tendência</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="explore">Explorar</TabsTrigger>
            <TabsTrigger value="trending">Tendências</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
            {/* Explore Tab */}
            <TabsContent value="explore" className="p-4 space-y-6">
              {/* Featured Content */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Destaques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.slice(0, 6).map((result) => (
                    <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-0">
                        {result.type === 'post' && result.post?.images[0] && (
                          <div className="relative aspect-square">
                            <Image
                              src={result.post.images[0]}
                              alt="Post image"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex items-center gap-4 text-white text-sm">
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {formatNumber(result.post.likes)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {formatNumber(result.post.comments)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Categorias</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Arte', 'Tecnologia', 'Esportes', 'Música', 'Culinária', 'Viagem', 'Moda', 'Fitness'].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                      onClick={() => handleSearch(category)}
                    >
                      <Hash className="h-6 w-6" />
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Trending Tab */}
            <TabsContent value="trending" className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tendências do momento</h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onHashtagClick(topic.name)}
                    >
                      <div className="text-2xl font-bold text-muted-foreground w-8">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">#{topic.name}</span>
                          {getTrendIcon(topic.trend)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(topic.count)} posts
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {topic.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="p-4">
              {searchQuery && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Resultados para &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredResults.length} resultados encontrados
                  </p>
                </div>
              )}

              <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : ''}`}>
                {filteredResults.map((result) => (
                  <Card
                    key={result.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      if (result.type === 'user' && result.user) {
                        onUserClick(result.user.id)
                      } else if (result.type === 'post' && result.post) {
                        onPostClick(result.post.id)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      {result.type === 'user' && result.user && (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={result.user.avatar} />
                            <AvatarFallback>
                              {result.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate">{result.user.name}</h4>
                              {result.user.verified && (
                                <Badge variant="secondary" className="text-xs">✓</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">@{result.user.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatNumber(result.user.followers)} seguidores
                            </p>
                          </div>
                        </div>
                      )}

                      {result.type === 'post' && result.post && (
                        <div>
                          {result.post.images[0] && (
                            <div className="relative aspect-video mb-3 rounded overflow-hidden">
                              <Image
                                src={result.post.images[0]}
                                alt="Post image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <p className="text-sm line-clamp-3 mb-3">{result.post.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {formatNumber(result.post.likes)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {formatNumber(result.post.comments)}
                            </div>
                          </div>
                        </div>
                      )}

                      {result.type === 'hashtag' && result.hashtag && (
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">#{result.hashtag.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(result.hashtag.count)} posts
                            </p>
                          </div>
                          {getTrendIcon(result.hashtag.trend)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}