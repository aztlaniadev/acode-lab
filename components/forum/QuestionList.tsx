'use client'

import { useState } from 'react'
import { QuestionCard } from './QuestionCard'
import { Question, QuestionFilters } from '@/types/forum'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
// Importações da nova paginação
import { usePagination, DOTS } from '@/hooks/usePagination'

interface QuestionListProps {
  questions: Question[]
  loading: boolean
  error: string | null
  filters: QuestionFilters
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  onFiltersChange: (filters: Partial<QuestionFilters>) => void
  onPageChange: (page: number) => void
}

export function QuestionList({
  questions,
  loading,
  error,
  filters,
  pagination,
  onFiltersChange,
  onPageChange
}: QuestionListProps) {
  const [sortBy, setSortBy] = useState(filters.sortBy || 'newest')

  // Hook da nova paginação (Corrigido)
  const paginationRange = usePagination({
    currentPage: pagination.page,
    totalPageCount: pagination.pages,
    siblingCount: 1,
  });

  const handleSortChange = (value: string) => {
    const sortValue = value as NonNullable<QuestionFilters['sortBy']>
    setSortBy(sortValue)
    onFiltersChange({ sortBy: sortValue })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando perguntas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg font-semibold mb-2">
          Erro ao carregar perguntas
        </div>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">
          Nenhuma pergunta encontrada
        </div>
        <p className="text-muted-foreground">
          {filters.search 
            ? `Nenhum resultado para "${filters.search}"`
            : 'Tente ajustar os filtros ou fazer uma nova pergunta'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Ordenação */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="text-sm text-muted-foreground">
          {pagination.total} pergunta{pagination.total !== 1 ? 's' : ''} encontrada{pagination.total !== 1 ? 's' : ''}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigas</SelectItem>
              <SelectItem value="mostVoted">Mais votadas</SelectItem>
              <SelectItem value="mostViewed">Mais vistas</SelectItem>
              <SelectItem value="mostAnswered">Mais respondidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Perguntas */}
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {/* Paginação (CORRIGIDO) */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Botão Anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          {/* Números das Páginas e Ellipsis */}
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              // Usamos index na key porque pode haver dois DOTS
              return (
                <span key={`${DOTS}-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={pageNumber}
                // Usando Number() porque pageNumber pode ser string do DOTS (embora já tenhamos checado)
                variant={pagination.page === Number(pageNumber) ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(Number(pageNumber))}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            );
          })}

          {/* Botão Próxima */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
