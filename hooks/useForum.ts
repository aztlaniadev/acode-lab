import { useState, useEffect, useCallback, useRef } from 'react'
import { Question, QuestionFilters, QuestionStats } from '@/types/forum'
import { useDebounce } from './useDebounce'
import { handleFetchError } from '@/utils/apiUtils'

// Definindo tipos de entrada para mutações (Type Safety)
export interface CreateQuestionInput {
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
}

export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {}

interface UseForumReturn {
  questions: Question[]
  loading: boolean
  error: string | null
  stats: QuestionStats | null
  // Filtros atuais (incluindo o valor imediato da busca para a UI)
  filters: QuestionFilters
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  setFilters: (filters: Partial<QuestionFilters>) => void
  setPage: (page: number) => void
  refreshQuestions: () => void
  createQuestion: (data: CreateQuestionInput) => Promise<void>
  updateQuestion: (id: string, data: UpdateQuestionInput) => Promise<void>
  deleteQuestion: (id: string) => Promise<void>
}

export function useForum(): UseForumReturn {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<QuestionStats | null>(null)
  const [paginationData, setPaginationData] = useState({ total: 0, pages: 0 })

  // Estado unificado para parâmetros de busca (Este estado controla o fetching)
  const [params, setParams] = useState<QuestionFilters & { page: number, limit: number }>({
    page: 1,
    limit: 20,
    category: undefined,
    tags: [],
    status: 'all',
    sortBy: 'newest',
    search: ''
  })

  // Estado separado para a UI de busca (para input controlado imediato)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400) // 400ms debounce

  // Ref para controlar race conditions
  const abortControllerRef = useRef<AbortController | null>(null)

  // Efeito 1: Sincroniza o input de busca com os parâmetros de fetching após o debounce
  useEffect(() => {
    if (debouncedSearch !== params.search) {
      setParams(prev => ({ ...prev, search: debouncedSearch, page: 1 }))
    }
  }, [debouncedSearch, params.search])

  // Efeito 2: Fetching de dados (Depende apenas de 'params')
  const fetchQuestions = useCallback(async () => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Criar novo controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'tags' && Array.isArray(value) && value.length > 0) {
            searchParams.append(key, value.join(','))
          } else if (key !== 'tags' && !Array.isArray(value)) {
            searchParams.append(key, String(value))
          }
        }
      })

      const response = await fetch(`/api/forum/questions?${searchParams}`, { 
        signal: controller.signal 
      })
      
      if (!response.ok) {
        await handleFetchError(response, 'Erro ao buscar perguntas')
      }
      
      const data = await response.json()

      if (!controller.signal.aborted) {
        setQuestions(data.questions)
        setPaginationData({
          total: data.pagination.total,
          pages: data.pagination.pages
        })
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [params])

  useEffect(() => {
    fetchQuestions()
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchQuestions])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/forum/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // ✅ SEGURANÇA: Se a API falhar, definir stats como null mas não quebrar
        console.warn('API de estatísticas retornou erro:', response.status)
        setStats(null)
      }
    } catch (err) {
      // ✅ SEGURANÇA: Se houver erro de rede, definir stats como null mas não quebrar
      console.error('Erro ao buscar estatísticas:', err)
      setStats(null)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Funções de controle (Handlers)
  const setPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }))
  }, [])

  const setFilters = useCallback((newFilters: Partial<QuestionFilters>) => {
    // Gerencia a atualização de filtros e busca em um só lugar
    if (newFilters.search !== undefined) {
      setSearchInput(newFilters.search)
    }
    
    // Atualiza outros filtros imediatamente e reseta a página
    const otherFilters = { ...newFilters }
    delete otherFilters.search

    if (Object.keys(otherFilters).length > 0) {
      setParams(prev => ({ ...prev, ...otherFilters, page: 1 }))
    }
  }, [])

  // Funções CRUD (Tipagem Corrigida)
  const createQuestion = async (data: CreateQuestionInput) => {
    try {
      const response = await fetch('/api/forum/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        await handleFetchError(response, 'Erro ao criar pergunta')
      }
      
      // Força o refetch após a criação e atualiza as estatísticas
      await fetchQuestions()
      await fetchStats()
    } catch (err) {
      throw err
    }
  }

  const updateQuestion = async (id: string, data: UpdateQuestionInput) => {
    try {
      const response = await fetch(`/api/forum/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        await handleFetchError(response, 'Erro ao atualizar pergunta')
      }
      
      await fetchQuestions()
    } catch (err) {
      throw err
    }
  }

  const deleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/forum/questions/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        await handleFetchError(response, 'Erro ao deletar pergunta')
      }
      
      await fetchQuestions()
      await fetchStats()
    } catch (err) {
      throw err
    }
  }

  return {
    questions,
    loading,
    error,
    stats,
    // Combina os parâmetros atuais e o searchInput imediato para a UI
    filters: { ...params, search: searchInput }, 
    pagination: { ...params, ...paginationData },
    setFilters,
    setPage,
    refreshQuestions: fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
  }
}
