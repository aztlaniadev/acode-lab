'use client'

import { ForumHeader } from '@/components/forum/ForumHeader'
import { QuestionList } from '@/components/forum/QuestionList'
import { ForumSidebar } from '@/components/forum/ForumSidebar'
import { SearchAdvanced } from '@/components/forum/SearchAdvanced'
import { useForum } from '@/hooks/useForum'
import { QuestionFilters } from '@/types/forum'

export default function ForumPage() {
  const {
    questions,
    loading,
    error,
    stats,
    filters,
    pagination,
    setFilters,
    setPage,
    refreshQuestions
  } = useForum()

  const handleFiltersChange = (newFilters: Partial<QuestionFilters>) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleSearch = (query: string) => {
    setFilters({ search: query })
  }

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader 
        onSearch={handleSearch}
        stats={stats}
        questions={questions}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar com filtros e categorias */}
          <div className="lg:w-1/4">
            <ForumSidebar 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              stats={stats}
            />
          </div>

          {/* Lista principal de perguntas */}
          <div className="lg:w-3/4">
            <SearchAdvanced 
              questions={questions}
              onSearchResults={(results) => {
                // Implementar busca avançada se necessário
                console.log('Resultados da busca avançada:', results)
              }}
            />
            
            <div className="mt-6">
              <QuestionList
                questions={questions}
                loading={loading}
                error={error}
                filters={filters}
                pagination={pagination}
                onFiltersChange={handleFiltersChange}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
