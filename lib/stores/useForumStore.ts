import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Question {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  categoryId: string
  tags: string[]
  status: 'open' | 'answered' | 'closed'
  isSolved: boolean
  views: number
  votes: number
  answersCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Answer {
  id: string
  questionId: string
  content: string
  authorId: string
  authorName: string
  authorAvatar?: string
  isAccepted: boolean
  votes: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  questionsCount: number
  slug: string
}

export interface Tag {
  id: string
  name: string
  description: string
  color: string
  questionsCount: number
  slug: string
  isPopular: boolean
  isNew: boolean
  createdAt: Date
  updatedAt: Date
}

interface ForumState {
  // Data
  questions: Question[]
  answers: Answer[]
  categories: Category[]
  tags: Tag[]
  
  // UI State
  selectedCategory: string | null
  selectedTags: string[]
  searchQuery: string
  sortBy: 'newest' | 'votes' | 'views' | 'unanswered'
  currentPage: number
  itemsPerPage: number
  
  // Loading States
  isLoadingQuestions: boolean
  isLoadingAnswers: boolean
  isLoadingCategories: boolean
  isLoadingTags: boolean
  
  // Actions
  setQuestions: (questions: Question[]) => void
  addQuestion: (question: Question) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  removeQuestion: (id: string) => void
  
  setAnswers: (answers: Answer[]) => void
  addAnswer: (answer: Answer) => void
  updateAnswer: (id: string, updates: Partial<Answer>) => void
  removeAnswer: (id: string) => void
  
  setCategories: (categories: Category[]) => void
  setTags: (tags: Tag[]) => void
  
  // UI Actions
  setSelectedCategory: (categoryId: string | null) => void
  setSelectedTags: (tags: string[]) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: 'newest' | 'votes' | 'views' | 'unanswered') => void
  setCurrentPage: (page: number) => void
  
  // Loading Actions
  setLoadingQuestions: (loading: boolean) => void
  setLoadingAnswers: (loading: boolean) => void
  setLoadingCategories: (loading: boolean) => void
  setLoadingTags: (loading: boolean) => void
  
  // Computed Values
  getFilteredQuestions: () => Question[]
  getQuestionById: (id: string) => Question | undefined
  getAnswersByQuestionId: (questionId: string) => Answer[]
  getCategoryById: (id: string) => Category | undefined
  getTagBySlug: (slug: string) => Tag | undefined
}

export const useForumStore = create<ForumState>()(
  devtools(
    (set, get) => ({
      // Initial State
      questions: [],
      answers: [],
      categories: [],
      tags: [],
      
      selectedCategory: null,
      selectedTags: [],
      searchQuery: '',
      sortBy: 'newest',
      currentPage: 1,
      itemsPerPage: 20,
      
      isLoadingQuestions: false,
      isLoadingAnswers: false,
      isLoadingCategories: false,
      isLoadingTags: false,
      
      // Data Actions
      setQuestions: (questions) => set({ questions }),
      addQuestion: (question) => set((state) => ({ 
        questions: [question, ...state.questions] 
      })),
      updateQuestion: (id, updates) => set((state) => ({
        questions: state.questions.map(q => 
          q.id === id ? { ...q, ...updates } : q
        )
      })),
      removeQuestion: (id) => set((state) => ({
        questions: state.questions.filter(q => q.id !== id)
      })),
      
      setAnswers: (answers) => set({ answers }),
      addAnswer: (answer) => set((state) => ({ 
        answers: [...state.answers, answer] 
      })),
      updateAnswer: (id, updates) => set((state) => ({
        answers: state.answers.map(a => 
          a.id === id ? { ...a, ...updates } : a
        )
      })),
      removeAnswer: (id) => set((state) => ({
        answers: state.answers.filter(a => a.id !== id)
      })),
      
      setCategories: (categories) => set({ categories }),
      setTags: (tags) => set({ tags }),
      
      // UI Actions
      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Loading Actions
      setLoadingQuestions: (loading) => set({ isLoadingQuestions: loading }),
      setLoadingAnswers: (loading) => set({ isLoadingAnswers: loading }),
      setLoadingCategories: (loading) => set({ isLoadingCategories: loading }),
      setLoadingTags: (loading) => set({ isLoadingTags: loading }),
      
      // Computed Values
      getFilteredQuestions: () => {
        const state = get()
        let filtered = [...state.questions]
        
        // Filter by category
        if (state.selectedCategory) {
          filtered = filtered.filter(q => q.categoryId === state.selectedCategory)
        }
        
        // Filter by tags
        if (state.selectedTags.length > 0) {
          filtered = filtered.filter(q => 
            state.selectedTags.some(tag => q.tags.includes(tag))
          )
        }
        
        // Filter by search query
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase()
          filtered = filtered.filter(q => 
            q.title.toLowerCase().includes(query) ||
            q.content.toLowerCase().includes(query) ||
            q.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }
        
        // Sort
        switch (state.sortBy) {
          case 'votes':
            filtered.sort((a, b) => b.votes - a.votes)
            break
          case 'views':
            filtered.sort((a, b) => b.views - a.views)
            break
          case 'unanswered':
            filtered.sort((a, b) => a.answersCount - b.answersCount)
            break
          case 'newest':
          default:
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
        
        return filtered
      },
      
      getQuestionById: (id) => {
        const state = get()
        return state.questions.find(q => q.id === id)
      },
      
      getAnswersByQuestionId: (questionId) => {
        const state = get()
        return state.answers
          .filter(a => a.questionId === questionId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },
      
      getCategoryById: (id) => {
        const state = get()
        return state.categories.find(c => c.id === id)
      },
      
      getTagBySlug: (slug) => {
        const state = get()
        return state.tags.find(t => t.slug === slug)
      }
    }),
    {
      name: 'forum-store'
    }
  )
)
