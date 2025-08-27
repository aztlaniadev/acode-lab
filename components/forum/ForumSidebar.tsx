'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Users,
  TrendingUp,
  Clock,
  MessageSquare,
  CheckCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { QuestionFilters, QuestionStats } from '@/types/forum'
import { useForumData } from '@/hooks/useForumData'

interface ForumSidebarProps {
  filters?: QuestionFilters
  onFiltersChange?: (filters: Partial<QuestionFilters>) => void
  stats?: QuestionStats | null
}

export function ForumSidebar({ filters, onFiltersChange, stats }: ForumSidebarProps) {
  const { categories, tags, loading, error } = useForumData()

  const handleCategoryClick = (categorySlug: string) => {
    if (onFiltersChange) {
      onFiltersChange({ category: categorySlug })
    }
  }

  const handleTagClick = (tagName: string) => {
    if (onFiltersChange) {
      const currentTags = filters?.tags || []
      const newTags = currentTags.includes(tagName) 
        ? currentTags.filter(t => t !== tagName)
        : [...currentTags, tagName]
      onFiltersChange({ tags: newTags })
    }
  }

  const handleStatusFilter = (status: QuestionFilters['status']) => {
    if (onFiltersChange) {
      onFiltersChange({ status })
    }
  }

  const isCategoryActive = (categorySlug: string) => {
    return filters?.category === categorySlug
  }

  const isTagActive = (tagName: string) => {
    return filters?.tags?.includes(tagName) || false
  }

  const isStatusActive = (status: QuestionFilters['status']) => {
    return filters?.status === status
  }

  // Função para obter ícone baseado no nome da categoria
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      'web': '💻',
      'mobile': '📱',
      'ai-ml': '🧠',
      'design': '🎨',
      'backend': '⚙️',
      'database': '🗄️',
      'frontend': '🎯',
      'devops': '🚀',
      'security': '🔒',
      'testing': '🧪'
    }
    
    const key = categoryName.toLowerCase().replace(/\s+/g, '-')
    return iconMap[key] || '📁'
  }

  // Função para obter cor baseada no nome da categoria
  const getCategoryColor = (categoryName: string) => {
    const colorMap: Record<string, string> = {
      'web': '#3B82F6',
      'mobile': '#10B981',
      'ai-ml': '#8B5CF6',
      'design': '#F59E0B',
      'backend': '#EF4444',
      'database': '#06B6D4',
      'frontend': '#EC4899',
      'devops': '#8B5CF6',
      'security': '#DC2626',
      'testing': '#059669'
    }
    
    const key = categoryName.toLowerCase().replace(/\s+/g, '-')
    return colorMap[key] || '#6B7280'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              <p>Erro ao carregar dados</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas do fórum */}
      {stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              Estatísticas do Fórum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">Perguntas:</span>
                <span className="font-semibold">{stats.totalQuestions || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Respostas:</span>
                <span className="font-semibold">{stats.totalAnswers || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">Usuários:</span>
                <span className="font-semibold">{stats.totalUsers || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 w-4 text-orange-500" />
                <span className="text-muted-foreground">Taxa Resolução:</span>
                <span className="font-semibold">{Math.round(stats.solvedRate || 0)}%</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Esta semana:</span>
                <span className="font-semibold">{stats.questionsThisWeek || 0} perguntas</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo médio resposta:</span>
                <span className="font-semibold">{stats.averageResponseTime || 0}h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categorias */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="hover:translate-x-1 transition-transform duration-200">
              <Button
                variant={isCategoryActive(category.slug) ? "default" : "ghost"}
                className="w-full justify-start h-auto p-3"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: getCategoryColor(category.name) }}
                  >
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-foreground">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.description}</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {category.questionsCount || 0}
                  </Badge>
                </div>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags Populares */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tags Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.filter(tag => tag.isPopular).map((tag) => (
              <div key={tag.id} className="hover:scale-105 active:scale-95 transition-transform duration-200">
                <Badge
                  variant={isTagActive(tag.name) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  style={{ borderColor: tag.color }}
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                  <span className="ml-1 text-xs">({tag.questionsCount || 0})</span>
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={isStatusActive('all') ? "default" : "ghost"}
            className="w-full justify-start h-auto p-2"
            onClick={() => handleStatusFilter('all')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Todas
          </Button>
          <Button
            variant={isStatusActive('unanswered') ? "default" : "ghost"}
            className="w-full justify-start h-auto p-2"
            onClick={() => handleStatusFilter('unanswered')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Sem Resposta
          </Button>
          <Button
            variant={isStatusActive('answered') ? "default" : "ghost"}
            className="w-full justify-start h-auto p-2"
            onClick={() => handleStatusFilter('answered')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Respondidas
          </Button>
          <Button
            variant={isStatusActive('solved') ? "default" : "ghost"}
            className="w-full justify-start h-auto p-2"
            onClick={() => handleStatusFilter('solved')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolvidas
          </Button>
        </CardContent>
      </Card>

      {/* Links Úteis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Links Úteis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/forum/ask">
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageSquare className="w-4 h-4" />
              Fazer Pergunta
            </Button>
          </Link>
          <Link href="/forum/guidelines">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CheckCircle className="w-4 h-4" />
              Diretrizes do Fórum
            </Button>
          </Link>
          <Link href="/forum/faq">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Clock className="w-4 h-4" />
              FAQ
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
