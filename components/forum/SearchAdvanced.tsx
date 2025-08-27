'use client'

import { useState, useMemo } from 'react'
// Animações removidas
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  User, 
  Tag, 
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Question, UserLevel } from '@/types/forum'

interface SearchAdvancedProps {
  questions: Question[]
  onSearchResults: (results: Question[]) => void
}

// Dados mockados para filtros
const categories = [
  { id: 'all', name: 'Todas as Categorias', color: '#6B7280' },
  { id: 'web', name: 'Web Development', color: '#3B82F6' },
  { id: 'mobile', name: 'Mobile Development', color: '#10B981' },
  { id: 'ai-ml', name: 'AI & Machine Learning', color: '#8B5CF6' },
  { id: 'design', name: 'UI/UX Design', color: '#F59E0B' },
  { id: 'backend', name: 'Backend Development', color: '#EF4444' },
  { id: 'database', name: 'Database', color: '#06B6D4' }
]

const sortOptions = [
  { id: 'newest', name: 'Mais Recentes', icon: Clock },
  { id: 'oldest', name: 'Mais Antigas', icon: Calendar },
  { id: 'mostVoted', name: 'Mais Votadas', icon: ThumbsUp },
  { id: 'mostViewed', name: 'Mais Visualizadas', icon: Eye },
  { id: 'mostAnswered', name: 'Mais Respondidas', icon: MessageSquare },
  { id: 'trending', name: 'Tendências', icon: TrendingUp }
]

const statusOptions = [
  { id: 'all', name: 'Todas', icon: MessageSquare },
  { id: 'unanswered', name: 'Sem Resposta', icon: Clock },
  { id: 'answered', name: 'Respondidas', icon: MessageSquare },
  { id: 'solved', name: 'Resolvidas', icon: CheckCircle }
]

export function SearchAdvanced({ questions, onSearchResults }: SearchAdvancedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSort, setSelectedSort] = useState('newest')
  const [dateRange, setDateRange] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minReputation, setMinReputation] = useState(0)
  const [tagSearchQuery, setTagSearchQuery] = useState('')

  // Extrair todas as tags únicas das perguntas com busca
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    questions.forEach(question => {
      question.tags.forEach(tag => tags.add(tag.name))
    })
    return Array.from(tags).sort()
  }, [questions])

  // Filtrar tags por busca
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return allTags.slice(0, 20)
    return allTags
      .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
      .slice(0, 20)
  }, [allTags, tagSearchQuery])

  // Aplicar filtros e busca
  const filteredQuestions = useMemo(() => {
    let results = [...questions]

    // Filtro por texto de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(question =>
        question.title.toLowerCase().includes(query) ||
        question.content.toLowerCase().includes(query) ||
        (question.author.name || question.author.username).toLowerCase().includes(query) ||
        question.tags.some(tag => tag.name.toLowerCase().includes(query))
      )
    }

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      results = results.filter(question => question.category.id === selectedCategory)
    }

    // Filtro por tags
    if (selectedTags.length > 0) {
      results = results.filter(question =>
        selectedTags.every(tag => 
          question.tags.some(qTag => qTag.name === tag)
        )
      )
    }

    // Filtro por status
    if (selectedStatus !== 'all') {
      switch (selectedStatus) {
        case 'unanswered':
          results = results.filter(question => (question._count?.answers || 0) === 0)
          break
        case 'answered':
          results = results.filter(question => (question._count?.answers || 0) > 0)
          break
        case 'solved':
          results = results.filter(question => question.isSolved)
          break
      }
    }

    // Filtro por data
    if (dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      // ✅ SEGURANÇA: Converter string de data para Date antes de comparar
      results = results.filter(question => new Date(question.createdAt) >= cutoffDate)
    }

    // Filtro por reputação mínima do autor
    if (minReputation > 0) {
      results = results.filter(question => question.author.reputation >= minReputation)
    }

    // Ordenação
    switch (selectedSort) {
      case 'newest':
        // ✅ SEGURANÇA: Converter strings de data para Date objects antes de usar .getTime()
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        // ✅ SEGURANÇA: Converter strings de data para Date objects antes de usar .getTime()
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'mostVoted':
        results.sort((a, b) => {
          const aVotes = a.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0
          const bVotes = b.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0
          return bVotes - aVotes
        })
        break
      case 'mostViewed':
        results.sort((a, b) => b.viewCount - a.viewCount)
        break
      case 'mostAnswered':
        results.sort((a, b) => (b._count?.answers || 0) - (a._count?.answers || 0))
        break
      case 'trending':
        // Algoritmo simples de trending baseado em votos + respostas + visualizações recentes
        results.sort((a, b) => {
          const aScore = (a.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0) + (a._count?.answers || 0) * 2 + a.viewCount * 0.1
          const bScore = (b.votes?.reduce((sum, vote) => sum + vote.value, 0) || 0) + (b._count?.answers || 0) * 2 + b.viewCount * 0.1
          return bScore - aScore
        })
        break
    }

    return results
  }, [questions, searchQuery, selectedCategory, selectedTags, selectedStatus, selectedSort, dateRange, minReputation])

  // Aplicar resultados da busca
  const handleSearch = () => {
    onSearchResults(filteredQuestions)
  }

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTags([])
    setSelectedStatus('all')
    setSelectedSort('newest')
    setDateRange('all')
    setMinReputation(0)
    onSearchResults(questions)
  }

  // Toggle de tag
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    )
  }

  // Aplicar busca quando filtros mudarem (sem loop infinito)
  useMemo(() => {
    // Não aplicar automaticamente para evitar loop
  }, [])

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar perguntas, tags ou usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <Button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="outline"
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {showAdvancedFilters ? 'Ocultar' : 'Filtros'}
            </Button>
            
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros avançados */}
      {showAdvancedFilters && (
        <div
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros Avançados
                  </span>
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Limpar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categorias */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Categoria</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="gap-2"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                                 {/* Tags */}
                 <div>
                   <h4 className="font-medium text-foreground mb-3">Tags</h4>
                   
                   {/* Busca de tags */}
                   <div className="mb-3">
                     <input
                       type="text"
                       placeholder="Buscar tags..."
                       value={tagSearchQuery}
                       onChange={(e) => setTagSearchQuery(e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                     />
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                     {filteredTags.map((tagName) => (
                       <Button
                         key={tagName}
                         variant={selectedTags.includes(tagName) ? 'default' : 'outline'}
                         size="sm"
                         onClick={() => toggleTag(tagName)}
                         className="gap-1"
                       >
                         <Tag className="w-3 h-3" />
                         {tagName}
                       </Button>
                     ))}
                     
                     {filteredTags.length === 0 && tagSearchQuery.trim() && (
                       <p className="text-sm text-muted-foreground col-span-full">
                         Nenhuma tag encontrada para &quot;{tagSearchQuery}&quot;
                       </p>
                     )}
                   </div>
                   
                   {tagSearchQuery.trim() && (
                     <p className="text-xs text-muted-foreground mt-2">
                       Mostrando {filteredTags.length} de {allTags.length} tags
                     </p>
                   )}
                 </div>

                {/* Status e Ordenação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Status</h4>
                    <div className="space-y-2">
                      {statusOptions.map((status) => {
                        const Icon = status.icon
                        return (
                          <Button
                            key={status.id}
                            variant={selectedStatus === status.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedStatus(status.id)}
                            className="w-full justify-start gap-2"
                          >
                            <Icon className="w-4 h-4" />
                            {status.name}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Ordenar por</h4>
                    <div className="space-y-2">
                      {sortOptions.map((sort) => {
                        const Icon = sort.icon
                        return (
                          <Button
                            key={sort.id}
                            variant={selectedSort === sort.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedSort(sort.id)}
                            className="w-full justify-start gap-2"
                          >
                            <Icon className="w-4 h-4" />
                            {sort.name}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Filtros adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Período</h4>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">Todas as datas</option>
                      <option value="today">Hoje</option>
                      <option value="week">Última semana</option>
                      <option value="month">Último mês</option>
                      <option value="year">Último ano</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Reputação mínima do autor: {minReputation}
                    </h4>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={minReputation}
                      onChange={(e) => setMinReputation(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      0 - 10.000 pontos
                    </div>
                  </div>
                </div>

                {/* Resumo dos filtros ativos */}
                {(selectedCategory !== 'all' || selectedTags.length > 0 || selectedStatus !== 'all' || dateRange !== 'all' || minReputation > 0) && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">Filtros Ativos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                          Categoria: {categories.find(c => c.id === selectedCategory)?.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto ml-1"
                            onClick={() => setSelectedCategory('all')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )}
                      
                      {selectedTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          Tag: {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto ml-1"
                            onClick={() => toggleTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                      
                      {selectedStatus !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                          Status: {statusOptions.find(s => s.id === selectedStatus)?.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto ml-1"
                            onClick={() => setSelectedStatus('all')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )}
                      
                      {dateRange !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                          Período: {dateRange === 'today' ? 'Hoje' : dateRange === 'week' ? 'Última semana' : dateRange === 'month' ? 'Último mês' : 'Último ano'}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto ml-1"
                            onClick={() => setDateRange('all')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )}
                      
                      {minReputation > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          Reputação: {minReputation}+
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto ml-1"
                            onClick={() => setMinReputation(0)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      )}

      {/* Resultados da busca */}
      <div className="text-sm text-muted-foreground">
        {filteredQuestions.length} pergunta{filteredQuestions.length !== 1 ? 's' : ''} encontrada{filteredQuestions.length !== 1 ? 's' : ''}
        {filteredQuestions.length !== questions.length && (
          <span> de {questions.length} total</span>
        )}
      </div>
    </div>
  )
}
