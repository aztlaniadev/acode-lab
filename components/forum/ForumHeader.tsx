'use client'

import { useState } from 'react'
// Animações removidas
import { Search, Plus, Filter, TrendingUp, Clock, MessageSquare, Eye, ThumbsUp } from 'lucide-react'
import { Question, QuestionStats } from '@/types/forum'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface ForumHeaderProps {
  onSearch?: (query: string) => void
  stats?: QuestionStats | null
  questions?: Question[]
}

export function ForumHeader({ onSearch, stats, questions = [] }: ForumHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // ✅ SEGURANÇA: Garantir que questions seja sempre um array
  const safeQuestions = Array.isArray(questions) ? questions : []

  // Calcular contadores dinamicamente baseado nas perguntas reais
  const filters = [
    { id: 'all', label: 'Todas', icon: MessageSquare, count: safeQuestions.length },
    { id: 'unanswered', label: 'Sem Resposta', icon: Clock, count: safeQuestions.filter(q => (q._count?.answers || 0) === 0).length },
    { id: 'answered', label: 'Respondidas', icon: MessageSquare, count: safeQuestions.filter(q => (q._count?.answers || 0) > 0).length },
    { id: 'solved', label: 'Resolvidas', icon: ThumbsUp, count: safeQuestions.filter(q => q.isSolved).length },
    { id: 'trending', label: 'Tendências', icon: TrendingUp, count: safeQuestions.filter(q => {
      // ✅ SEGURANÇA: Garantir que votes seja sempre um array
      const votes = Array.isArray(q.votes) ? q.votes : []
      const answersCount = q._count?.answers || 0
      const viewsCount = q.viewCount || 0
      
      // Algoritmo de trending: perguntas com alta pontuação
      const score = votes.reduce((sum, vote) => sum + (vote.value || 0), 0) + answersCount * 2 + viewsCount * 0.1
      return score > 5 // Considerar trending se pontuação > 5
    }).length },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      // Implementar busca local se não houver callback
      console.log('Buscar:', searchQuery)
    }
  }

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
    // Aqui você implementaria a lógica de filtro real
    console.log('Filtro alterado para:', filterId)
  }

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        {/* Header principal */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Fórum Q&A
            </h1>
            <p className="text-muted-foreground">
              Faça perguntas, compartilhe conhecimento e conecte-se com outros desenvolvedores
            </p>
          </div>
          
          <Link href="/forum/ask">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Fazer Pergunta
            </Button>
          </Link>
        </div>

        {/* Barra de busca */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar perguntas, tags ou usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Buscar
            </Button>
          </div>
        </form>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filtrar por:</span>
          </div>
          
          {filters.map((filter) => {
            const Icon = filter.icon
            const isActive = activeFilter === filter.id
            
            return (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {filter.count}
                </Badge>
              </button>
            )
          })}
        </div>

        {/* Estatísticas do fórum (se disponíveis) */}
        {stats && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.totalQuestions || 0}</div>
                <div className="text-sm text-muted-foreground">Perguntas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.totalAnswers || 0}</div>
                <div className="text-sm text-muted-foreground">Respostas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.totalUsers || 0}</div>
                <div className="text-sm text-muted-foreground">Usuários</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{Math.round(stats.solvedRate || 0)}%</div>
                <div className="text-sm text-muted-foreground">Taxa Resolução</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
