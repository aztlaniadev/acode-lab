import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  // Navigation
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  activeTab: string
  
  // Modals
  isCreateQuestionModalOpen: boolean
  isCreateAnswerModalOpen: boolean
  isProfileModalOpen: boolean
  isSettingsModalOpen: boolean
  
  // Notifications
  notifications: Notification[]
  unreadCount: number
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Loading States
  globalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Actions
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setActiveTab: (tab: string) => void
  
  openCreateQuestionModal: () => void
  closeCreateQuestionModal: () => void
  openCreateAnswerModal: () => void
  closeCreateAnswerModal: () => void
  openProfileModal: () => void
  closeProfileModal: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
  
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  
  setGlobalLoading: (loading: boolean) => void
  setLoadingState: (key: string, loading: boolean) => void
  clearLoadingState: (key: string) => void
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
  actionText?: string
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial State
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      activeTab: 'home',
      
      isCreateQuestionModalOpen: false,
      isCreateAnswerModalOpen: false,
      isProfileModalOpen: false,
      isSettingsModalOpen: false,
      
      notifications: [],
      unreadCount: 0,
      
      theme: 'system',
      
      globalLoading: false,
      loadingStates: {},
      
      // Navigation Actions
      toggleSidebar: () => set((state) => ({ 
        isSidebarOpen: !state.isSidebarOpen 
      })),
      
      toggleMobileMenu: () => set((state) => ({ 
        isMobileMenuOpen: !state.isMobileMenuOpen 
      })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Modal Actions
      openCreateQuestionModal: () => set({ isCreateQuestionModalOpen: true }),
      closeCreateQuestionModal: () => set({ isCreateQuestionModalOpen: false }),
      
      openCreateAnswerModal: () => set({ isCreateAnswerModalOpen: true }),
      closeCreateAnswerModal: () => set({ isCreateAnswerModalOpen: false }),
      
      openProfileModal: () => set({ isProfileModalOpen: true }),
      closeProfileModal: () => set({ isProfileModalOpen: false }),
      
      openSettingsModal: () => set({ isSettingsModalOpen: true }),
      closeSettingsModal: () => set({ isSettingsModalOpen: false }),
      
      // Notification Actions
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: Math.max(0, state.unreadCount - 1)
      })),
      
      markAsRead: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id)
        if (notification && !notification.isRead) {
          return {
            notifications: state.notifications.map(n => 
              n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }
        }
        return state
      }),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      })),
      
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
      
      // Theme Actions
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      // Loading Actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      
      setLoadingState: (key, loading) => set((state) => ({
        loadingStates: { ...state.loadingStates, [key]: loading }
      })),
      
      clearLoadingState: (key) => set((state) => {
        const newLoadingStates = { ...state.loadingStates }
        delete newLoadingStates[key]
        return { loadingStates: newLoadingStates }
      })
    }),
    {
      name: 'ui-store'
    }
  )
)
