import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useForumStore } from '@/lib/stores/useForumStore'
import { useUIStore } from '@/lib/stores/useUIStore'
import { useRealtimeStore } from '@/lib/stores/useRealtimeStore'

// Hook para autenticação
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    setLoading,
    setError,
    clearError
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    setLoading,
    setError,
    clearError,
    
    // Computed values
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
    hasAvatar: !!user?.avatar,
    displayName: user?.displayName || user?.username || 'Usuário'
  }
}

// Hook para o fórum
export const useForum = () => {
  const {
    questions,
    answers,
    categories,
    tags,
    selectedCategory,
    selectedTags,
    searchQuery,
    sortBy,
    currentPage,
    itemsPerPage,
    isLoadingQuestions,
    isLoadingAnswers,
    isLoadingCategories,
    isLoadingTags,
    
    // Actions
    setQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setAnswers,
    addAnswer,
    updateAnswer,
    removeAnswer,
    setCategories,
    setTags,
    
    // UI Actions
    setSelectedCategory,
    setSelectedTags,
    setSearchQuery,
    setSortBy,
    setCurrentPage,
    
    // Loading Actions
    setLoadingQuestions,
    setLoadingAnswers,
    setLoadingCategories,
    setLoadingTags,
    
    // Computed Values
    getFilteredQuestions,
    getQuestionById,
    getAnswersByQuestionId,
    getCategoryById,
    getTagBySlug
  } = useForumStore()

  return {
    // State
    questions,
    answers,
    categories,
    tags,
    selectedCategory,
    selectedTags,
    searchQuery,
    sortBy,
    currentPage,
    itemsPerPage,
    isLoadingQuestions,
    isLoadingAnswers,
    isLoadingCategories,
    isLoadingTags,
    
    // Actions
    setQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setAnswers,
    addAnswer,
    updateAnswer,
    removeAnswer,
    setCategories,
    setTags,
    
    // UI Actions
    setSelectedCategory,
    setSelectedTags,
    setSearchQuery,
    setSortBy,
    setCurrentPage,
    
    // Loading Actions
    setLoadingQuestions,
    setLoadingAnswers,
    setLoadingCategories,
    setLoadingTags,
    
    // Computed Values
    getFilteredQuestions,
    getQuestionById,
    getAnswersByQuestionId,
    getCategoryById,
    getTagBySlug,
    
    // Computed State
    filteredQuestions: getFilteredQuestions(),
    totalQuestions: questions.length,
    totalAnswers: answers.length,
    totalCategories: categories.length,
    totalTags: tags.length,
    
    // Pagination
    totalPages: Math.ceil(getFilteredQuestions().length / itemsPerPage),
    paginatedQuestions: getFilteredQuestions().slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }
}

// Hook para UI
export const useUI = () => {
  const {
    isSidebarOpen,
    isMobileMenuOpen,
    activeTab,
    isCreateQuestionModalOpen,
    isCreateAnswerModalOpen,
    isProfileModalOpen,
    isSettingsModalOpen,
    notifications,
    unreadCount,
    theme,
    globalLoading,
    loadingStates,
    
    // Actions
    toggleSidebar,
    toggleMobileMenu,
    setActiveTab,
    openCreateQuestionModal,
    closeCreateQuestionModal,
    openCreateAnswerModal,
    closeCreateAnswerModal,
    openProfileModal,
    closeProfileModal,
    openSettingsModal,
    closeSettingsModal,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    setTheme,
    toggleTheme,
    setGlobalLoading,
    setLoadingState,
    clearLoadingState
  } = useUIStore()

  return {
    // State
    isSidebarOpen,
    isMobileMenuOpen,
    activeTab,
    isCreateQuestionModalOpen,
    isCreateAnswerModalOpen,
    isProfileModalOpen,
    isSettingsModalOpen,
    notifications,
    unreadCount,
    theme,
    globalLoading,
    loadingStates,
    
    // Actions
    toggleSidebar,
    toggleMobileMenu,
    setActiveTab,
    openCreateQuestionModal,
    closeCreateQuestionModal,
    openCreateAnswerModal,
    closeCreateAnswerModal,
    openProfileModal,
    closeProfileModal,
    openSettingsModal,
    closeSettingsModal,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    setTheme,
    toggleTheme,
    setGlobalLoading,
    setLoadingState,
    clearLoadingState,
    
    // Computed Values
    hasUnreadNotifications: unreadCount > 0,
    isAnyModalOpen: isCreateQuestionModalOpen || isCreateAnswerModalOpen || isProfileModalOpen || isSettingsModalOpen,
    isAnyLoading: globalLoading || Object.values(loadingStates).some(Boolean)
  }
}

// Hook para dados em tempo real
export const useRealtime = () => {
  const {
    onlineUsers,
    onlineCount,
    liveQuestions,
    liveAnswers,
    liveComments,
    isConnected,
    connectionStatus,
    lastPing,
    
    // Actions
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    updateOnlineUser,
    addLiveQuestion,
    updateLiveQuestion,
    removeLiveQuestion,
    addLiveAnswer,
    updateLiveAnswer,
    removeLiveAnswer,
    addLiveComment,
    updateLiveComment,
    removeLiveComment,
    setConnectionStatus,
    setConnected,
    setLastPing,
    
    // Computed Values
    getOnlineUsersByCategory,
    getLiveQuestionsByCategory,
    getLiveAnswersByQuestion,
    getLiveCommentsByAnswer
  } = useRealtimeStore()

  return {
    // State
    onlineUsers,
    onlineCount,
    liveQuestions,
    liveAnswers,
    liveComments,
    isConnected,
    connectionStatus,
    lastPing,
    
    // Actions
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    updateOnlineUser,
    addLiveQuestion,
    updateLiveQuestion,
    removeLiveQuestion,
    addLiveAnswer,
    updateLiveAnswer,
    removeLiveAnswer,
    addLiveComment,
    updateLiveComment,
    removeLiveComment,
    setConnectionStatus,
    setConnected,
    setLastPing,
    
    // Computed Values
    getOnlineUsersByCategory,
    getLiveQuestionsByCategory,
    getLiveAnswersByQuestion,
    getLiveCommentsByAnswer,
    
    // Computed State
    isConnecting: connectionStatus === 'connecting',
    isDisconnected: connectionStatus === 'disconnected',
    hasConnectionError: connectionStatus === 'error',
    connectionLatency: lastPing ? Date.now() - lastPing.getTime() : null
  }
}
