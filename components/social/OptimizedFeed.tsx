"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// import { FixedSizeList as List } from 'react-window'
// import InfiniteLoader from 'react-window-infinite-loader'
// import { useVirtualizer } from '@tanstack/react-virtual'
// import { useIntersection } from '@/hooks/useIntersection'
import { useCache } from '@/lib/cache'
import { usePerformanceTracker } from '@/lib/performance'
import { SocialPost } from '@/components/social/SocialPost'
import { PostSkeleton } from '@/components/social/PostSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, Filter, SortAsc } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Post {
  id: string
  type: 'text' | 'image' | 'link' | 'poll' | 'event'
  content: string
  images?: string[]
  video?: string
  link?: {
    url: string
    title: string
    description: string
    image?: string
  }
  poll?: {
    question: string
    options: Array<{
      id: string
      text: string
      votes: number
      percentage: number
    }>
    totalVotes: number
    endDate: Date
    isActive: boolean
  }
  event?: {
    id: string
    title: string
    description: string
    startDate: Date
    endDate: Date
    location: string
    attendees: number
    maxAttendees?: number
  }
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    name: string
    avatar?: string
    reputation: number
    level: string
    isVerified: boolean
  }
  _count: {
    comments: number
    likes: number
    shares: number
  }
  likes?: number
  comments?: number
  shares?: number
  bookmarks?: number
  timestamp?: Date
  isLiked?: boolean
  isBookmarked?: boolean
  engagement?: {
    rate: number
    trend: 'up' | 'down' | 'stable'
  }
}

interface OptimizedFeedProps {
  userId?: string
  feedType: 'home' | 'following' | 'trending' | 'discover'
  filters?: {
    tags?: string[]
    dateRange?: 'today' | 'week' | 'month' | 'all'
    sortBy?: 'recent' | 'popular' | 'engagement'
    mediaOnly?: boolean
  }
  onPostInteraction?: (postId: string, action: string) => void
}

// Optimized Post Item Component
const PostItem = ({ index, style, data }: { index: number; style: any; data: any }) => {
  const { posts, onPostInteraction, isItemLoaded } = data
  const post = posts[index]
  const itemRef = useRef<HTMLDivElement>(null)
  
  // Track performance for this component
  usePerformanceTracker(`PostItem_${index}`)
  
  // Intersection observer for analytics
  // const { isIntersecting } = useIntersection(itemRef, {
  //   threshold: 0.5,
  //   rootMargin: '0px'
  // })
  
  // Track post visibility
  // useEffect(() => {
  //   if (isIntersecting && post?.id) {
  //     // Track post view analytics
  //     onPostInteraction?.(post.id, 'view')
  //   }
  // }, [isIntersecting, post?.id, onPostInteraction])
  
  if (!isItemLoaded(index)) {
    return (
      <div style={style} className="p-4">
        <PostSkeleton />
      </div>
    )
  }
  
  if (!post) {
    return (
      <div style={style} className="p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Carregando mais posts...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div ref={itemRef} style={style} className="p-2">
              <SocialPost
          post={post}
          onLike={() => onPostInteraction?.(post.id, 'like')}
          onComment={(postId, comment) => onPostInteraction?.(postId, 'comment', comment)}
          onShare={() => onPostInteraction?.(post.id, 'share')}
        />
    </div>
  )
}

// Smart Feed Algorithm
const useFeedAlgorithm = (posts: Post[], filters: any, userId?: string) => {
  return useMemo(() => {
    let filteredPosts = [...posts]
    
    // Apply filters
    if (filters.tags?.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag => filters.tags.includes(tag))
      )
    }
    
    if (filters.mediaOnly) {
      filteredPosts = filteredPosts.filter(post =>
        (post.images && post.images.length > 0) || post.video
      )
    }
    
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setMonth(now.getMonth() - 1)
          break
      }
      
      filteredPosts = filteredPosts.filter(post =>
        (post.timestamp || post.createdAt) >= cutoff
      )
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => 
          ((b.likes || b._count.likes) + (b.comments || b._count.comments) + (b.shares || b._count.shares)) - 
          ((a.likes || a._count.likes) + (a.comments || a._count.comments) + (a.shares || a._count.shares))
        )
        break
      case 'engagement':
        filteredPosts.sort((a, b) => 
          (b.engagement?.rate || 0) - (a.engagement?.rate || 0)
        )
        break
      case 'recent':
      default:
        filteredPosts.sort((a, b) => 
          (b.timestamp || b.createdAt).getTime() - (a.timestamp || a.createdAt).getTime()
        )
        break
    }
    
    // Smart algorithm: mix trending and personalized content
    if (userId && filters.sortBy !== 'recent') {
      const personalizedPosts = filteredPosts.filter(post => {
        // Simplified personalization logic
        return post.author.id !== userId && 
               post.engagement?.trend === 'up'
      })
      
      const otherPosts = filteredPosts.filter(post => 
        !personalizedPosts.includes(post)
      )
      
      // Interleave personalized and other posts
      const result: Post[] = []
      const maxLength = Math.max(personalizedPosts.length, otherPosts.length)
      
      for (let i = 0; i < maxLength; i++) {
        if (i < personalizedPosts.length) result.push(personalizedPosts[i])
        if (i < otherPosts.length) result.push(otherPosts[i])
      }
      
      return result
    }
    
    return filteredPosts
  }, [posts, filters, userId])
}

export const OptimizedFeed = ({
  userId,
  feedType,
  filters = {},
  onPostInteraction
}: OptimizedFeedProps) => {
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(0)
  const listRef = useRef<any>(null)
  
  // Track component performance
  usePerformanceTracker('OptimizedFeed')
  
  // Cache posts data
  const { data: cachedPosts, loading, invalidate } = useCache(
    `feed_${feedType}_${userId}_${JSON.stringify(filters)}`,
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return generateMockPosts(20)
    },
    {
      ttl: 300000, // 5 minutes
      tags: ['posts', feedType]
    }
  )
  
  // Update posts when cache data changes
  useEffect(() => {
    if (cachedPosts) {
      setPosts(cachedPosts)
    }
  }, [cachedPosts])
  
  // Apply smart feed algorithm
  const processedPosts = useFeedAlgorithm(posts, filters, userId)
  
  // Infinite scroll functions
  const isItemLoaded = useCallback((index: number) => {
    return !!processedPosts[index]
  }, [processedPosts])
  
  const loadMoreItems = useCallback(async () => {
    if (isNextPageLoading || !hasNextPage) return
    
    setIsNextPageLoading(true)
    
    try {
      // Simulate loading more posts
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newPosts = generateMockPosts(10, posts.length)
      
      setPosts(prev => [...prev, ...newPosts])
      setPage(prev => prev + 1)
      
      // Stop loading if we've reached the limit
      if (page >= 5) {
        setHasNextPage(false)
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setIsNextPageLoading(false)
    }
  }, [isNextPageLoading, hasNextPage, page, posts.length])
  
  // Refresh feed
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await invalidate()
    setPage(0)
    setHasNextPage(true)
    setRefreshing(false)
    
    // Scroll to top
    listRef.current?.scrollToItem(0)
  }, [invalidate])
  
  // Handle post interactions
  const handlePostInteraction = useCallback((postId: string, action: string, data?: any) => {
    // Update local state optimistically
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        switch (action) {
          case 'like':
            return {
              ...post,
              likes: post.isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
              isLiked: !post.isLiked
            }
          case 'bookmark':
            return {
              ...post,
              bookmarks: post.isBookmarked ? (post.bookmarks || 0) - 1 : (post.bookmarks || 0) + 1,
              isBookmarked: !post.isBookmarked
            }
          default:
            return post
        }
      }
      return post
    }))
    
    // Call parent handler
    onPostInteraction?.(postId, action)
  }, [onPostInteraction])
  
  // Calculate item count for infinite loader
  const itemCount = hasNextPage ? processedPosts.length + 1 : processedPosts.length
  
  // Render loading state
  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Feed Header */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold capitalize">{feedType}</h2>
              <Badge variant="secondary">
                {processedPosts.length} posts
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              {filters.sortBy === 'engagement' && (
                <Badge variant="outline" className="text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Smart Feed
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Simple Feed */}
      <div className="space-y-4">
        {processedPosts.map((post, index) => (
          <div key={post.id} className="p-2">
                       <SocialPost
             post={post}
             onLike={() => handlePostInteraction?.(post.id, 'like')}
             onComment={(postId, comment) => handlePostInteraction?.(postId, 'comment', comment)}
             onShare={() => handlePostInteraction?.(post.id, 'share')}
           />
          </div>
        ))}
      </div>
      
      {/* Loading indicator */}
      {isNextPageLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      )}
      
      {/* End of feed indicator */}
      {!hasNextPage && processedPosts.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Você chegou ao fim do feed! 🎉
            </p>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="mt-2"
            >
              Recarregar Feed
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Mock data generator for testing
function generateMockPosts(count: number, startIndex: number = 0): Post[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `post_${startIndex + i}`,
    type: 'text' as const,
    content: `Este é um post de exemplo #${startIndex + i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${
      Math.random() > 0.5 ? 'Com mais conteúdo para teste de layout!' : ''
    }`,
    images: Math.random() > 0.6 ? [`https://picsum.photos/600/400?random=${startIndex + i}`] : undefined,
    video: Math.random() > 0.9 ? `https://example.com/video_${startIndex + i}.mp4` : undefined,
    tags: ['tecnologia', 'programação', 'react', 'nextjs'].slice(0, Math.floor(Math.random() * 3) + 1),
    isPublic: true,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
    updatedAt: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
    author: {
      id: `user_${(startIndex + i) % 10}`,
      username: `user${(startIndex + i) % 10}`,
      name: `User ${(startIndex + i) % 10}`,
      avatar: `https://picsum.photos/60/60?random=${(startIndex + i) % 10}`,
      reputation: Math.floor(Math.random() * 1000),
      level: 'intermediate',
      isVerified: Math.random() > 0.7
    },
    _count: {
      comments: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 1000),
      shares: Math.floor(Math.random() * 50)
    },
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    bookmarks: Math.floor(Math.random() * 200),
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
    isLiked: Math.random() > 0.7,
    isBookmarked: Math.random() > 0.8,
    engagement: {
      rate: Math.random(),
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    }
  }))
}