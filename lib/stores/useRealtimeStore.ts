import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RealtimeState {
  // Online Users
  onlineUsers: OnlineUser[]
  onlineCount: number
  
  // Live Updates
  liveQuestions: LiveQuestion[]
  liveAnswers: LiveAnswer[]
  liveComments: LiveComment[]
  
  // WebSocket Connection
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastPing: Date | null
  
  // Actions
  setOnlineUsers: (users: OnlineUser[]) => void
  addOnlineUser: (user: OnlineUser) => void
  removeOnlineUser: (userId: string) => void
  updateOnlineUser: (userId: string, updates: Partial<OnlineUser>) => void
  
  addLiveQuestion: (question: LiveQuestion) => void
  updateLiveQuestion: (id: string, updates: Partial<LiveQuestion>) => void
  removeLiveQuestion: (id: string) => void
  
  addLiveAnswer: (answer: LiveAnswer) => void
  updateLiveAnswer: (id: string, updates: Partial<LiveAnswer>) => void
  removeLiveAnswer: (id: string) => void
  
  addLiveComment: (comment: LiveComment) => void
  updateLiveComment: (id: string, updates: Partial<LiveComment>) => void
  removeLiveComment: (id: string) => void
  
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void
  setConnected: (connected: boolean) => void
  setLastPing: (date: Date) => void
  
  // Computed Values
  getOnlineUsersByCategory: (category: string) => OnlineUser[]
  getLiveQuestionsByCategory: (category: string) => LiveQuestion[]
  getLiveAnswersByQuestion: (questionId: string) => LiveAnswer[]
  getLiveCommentsByAnswer: (answerId: string) => LiveComment[]
}

export interface OnlineUser {
  id: string
  username: string
  displayName: string
  avatar?: string
  category: string
  isTyping: boolean
  lastActivity: Date
  status: 'online' | 'away' | 'busy'
}

export interface LiveQuestion {
  id: string
  title: string
  authorId: string
  authorName: string
  categoryId: string
  tags: string[]
  status: 'live' | 'answered' | 'closed'
  viewers: number
  createdAt: Date
  updatedAt: Date
}

export interface LiveAnswer {
  id: string
  questionId: string
  content: string
  authorId: string
  authorName: string
  isAccepted: boolean
  votes: number
  createdAt: Date
  updatedAt: Date
}

export interface LiveComment {
  id: string
  answerId: string
  content: string
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
}

export const useRealtimeStore = create<RealtimeState>()(
  devtools(
    (set, get) => ({
      // Initial State
      onlineUsers: [],
      onlineCount: 0,
      
      liveQuestions: [],
      liveAnswers: [],
      liveComments: [],
      
      isConnected: false,
      connectionStatus: 'disconnected',
      lastPing: null,
      
      // Online Users Actions
      setOnlineUsers: (users) => set({ 
        onlineUsers: users, 
        onlineCount: users.length 
      }),
      
      addOnlineUser: (user) => set((state) => ({
        onlineUsers: [...state.onlineUsers, user],
        onlineCount: state.onlineCount + 1
      })),
      
      removeOnlineUser: (userId) => set((state) => ({
        onlineUsers: state.onlineUsers.filter(u => u.id !== userId),
        onlineCount: Math.max(0, state.onlineCount - 1)
      })),
      
      updateOnlineUser: (userId, updates) => set((state) => ({
        onlineUsers: state.onlineUsers.map(u => 
          u.id === userId ? { ...u, ...updates } : u
        )
      })),
      
      // Live Questions Actions
      addLiveQuestion: (question) => set((state) => ({
        liveQuestions: [question, ...state.liveQuestions]
      })),
      
      updateLiveQuestion: (id, updates) => set((state) => ({
        liveQuestions: state.liveQuestions.map(q => 
          q.id === id ? { ...q, ...updates } : q
        )
      })),
      
      removeLiveQuestion: (id) => set((state) => ({
        liveQuestions: state.liveQuestions.filter(q => q.id !== id)
      })),
      
      // Live Answers Actions
      addLiveAnswer: (answer) => set((state) => ({
        liveAnswers: [...state.liveAnswers, answer]
      })),
      
      updateLiveAnswer: (id, updates) => set((state) => ({
        liveAnswers: state.liveAnswers.map(a => 
          a.id === id ? { ...a, ...updates } : a
        )
      })),
      
      removeLiveAnswer: (id) => set((state) => ({
        liveAnswers: state.liveAnswers.filter(a => a.id !== id)
      })),
      
      // Live Comments Actions
      addLiveComment: (comment) => set((state) => ({
        liveComments: [...state.liveComments, comment]
      })),
      
      updateLiveComment: (id, updates) => set((state) => ({
        liveComments: state.liveComments.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      
      removeLiveComment: (id) => set((state) => ({
        liveComments: state.liveComments.filter(c => c.id !== id)
      })),
      
      // Connection Actions
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setConnected: (connected) => set({ isConnected: connected }),
      setLastPing: (date) => set({ lastPing: date }),
      
      // Computed Values
      getOnlineUsersByCategory: (category) => {
        const state = get()
        return state.onlineUsers.filter(u => u.category === category)
      },
      
      getLiveQuestionsByCategory: (category) => {
        const state = get()
        return state.liveQuestions.filter(q => q.categoryId === category)
      },
      
      getLiveAnswersByQuestion: (questionId) => {
        const state = get()
        return state.liveAnswers
          .filter(a => a.questionId === questionId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },
      
      getLiveCommentsByAnswer: (answerId) => {
        const state = get()
        return state.liveComments
          .filter(c => c.answerId === answerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    }),
    {
      name: 'realtime-store'
    }
  )
)
