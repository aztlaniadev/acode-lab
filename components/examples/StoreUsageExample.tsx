"use client"

import React, { useEffect } from 'react'
import { useAuth, useForum, useUI, useRealtime } from '@/lib/hooks/useStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserLevel, UserRole } from '@/types/user'

/**
 * Exemplo de como usar os stores Zustand
 * Este componente demonstra as melhores práticas
 */
export const StoreUsageExample: React.FC = () => {
  // Usando os hooks personalizados
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    isAdmin 
  } = useAuth()
  
  const { 
    questions, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    addQuestion,
    setLoadingQuestions 
  } = useForum()
  
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    addNotification,
    theme,
    toggleTheme 
  } = useUI()
  
  const { 
    onlineCount, 
    isConnected, 
    connectionStatus 
  } = useRealtime()

  // Exemplo de uso em useEffect
  useEffect(() => {
    if (isAuthenticated && user) {
      addNotification({
        id: 'welcome',
        type: 'success',
        title: 'Bem-vindo!',
        message: `Olá ${user.displayName}, você está logado!`,
        isRead: false,
        createdAt: new Date()
      })
    }
  }, [isAuthenticated, user, addNotification])

  // Exemplo de ação que atualiza múltiplos stores
  const handleCreateQuestion = () => {
    if (!user) return

    setLoadingQuestions(true)
    
    // Simular criação de pergunta
    setTimeout(() => {
      const newQuestion = {
        id: `q-${Date.now()}`,
        title: 'Nova pergunta criada',
        content: 'Conteúdo da pergunta...',
        authorId: user.id,
        authorName: user.displayName || user.name,
        authorAvatar: user.avatar,
        categoryId: selectedCategory || 'general',
        tags: ['exemplo'],
        status: 'open' as const,
        isSolved: false,
        views: 0,
        votes: 0,
        answersCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      addQuestion(newQuestion)
      setLoadingQuestions(false)
      
      addNotification({
        id: `question-${newQuestion.id}`,
        type: 'success',
        title: 'Pergunta criada!',
        message: 'Sua pergunta foi criada com sucesso.',
        isRead: false,
        createdAt: new Date()
      })
    }, 1000)
  }

  // Exemplo de login mock
  const handleLogin = () => {
    const mockUser = {
      id: 'user-1',
      email: 'usuario@exemplo.com',
      username: 'usuario_exemplo',
      name: 'Usuário Exemplo',
      displayName: 'Usuário Exemplo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=usuario',
      role: UserRole.USER,
      reputation: 150,
      level: UserLevel.BEGINNER,
      badges: [
        {
          id: 'badge-1',
          name: 'Primeira Pergunta',
          description: 'Fez sua primeira pergunta no fórum',
          icon: '🎯',
          color: '#10B981',
          earnedAt: new Date('2024-01-01')
        },
        {
          id: 'badge-2',
          name: 'Resposta Aceita',
          description: 'Teve uma resposta aceita como melhor',
          icon: '✅',
          color: '#3B82F6',
          earnedAt: new Date('2024-01-15')
        }
      ],
      isVerified: true,
      isBanned: false,
      joinDate: new Date('2024-01-01'),
      lastActive: new Date(),
      questionsCount: 0,
      answersCount: 0,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
    
    login(mockUser)
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado Global com Zustand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Seção de Autenticação */}
          <div className="space-y-2">
            <h3 className="font-semibold">🔐 Autenticação</h3>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2">
                    <img 
                      src={user?.avatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user?.displayName}</span>
                    {isAdmin && <Badge variant="destructive">Admin</Badge>}
                  </div>
                  <Button onClick={logout} variant="outline">
                    Sair
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin}>
                  Fazer Login
                </Button>
              )}
            </div>
          </div>

          {/* Seção do Fórum */}
          <div className="space-y-2">
            <h3 className="font-semibold">💬 Fórum</h3>
            <div className="flex items-center gap-4">
              <span>Perguntas: {questions.length}</span>
              <span>Categorias: {categories.length}</span>
              <select 
                value={selectedCategory || ''} 
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-1 border rounded"
              >
                <option value="">Todas as categorias</option>
                <option value="general">Geral</option>
                <option value="programming">Programação</option>
              </select>
              <Button onClick={handleCreateQuestion} disabled={!isAuthenticated}>
                Criar Pergunta
              </Button>
            </div>
          </div>

          {/* Seção de UI */}
          <div className="space-y-2">
            <h3 className="font-semibold">🎨 Interface</h3>
            <div className="flex items-center gap-4">
              <Button onClick={toggleSidebar} variant="outline">
                {isSidebarOpen ? 'Fechar' : 'Abrir'} Sidebar
              </Button>
              <Button onClick={toggleTheme} variant="outline">
                Tema: {theme}
              </Button>
              <Button 
                onClick={() => addNotification({
                  id: `test-${Date.now()}`,
                  type: 'info',
                  title: 'Teste',
                  message: 'Esta é uma notificação de teste',
                  isRead: false,
                  createdAt: new Date()
                })}
                variant="outline"
              >
                Adicionar Notificação
              </Button>
            </div>
          </div>

          {/* Seção de Tempo Real */}
          <div className="space-y-2">
            <h3 className="font-semibold">⚡ Tempo Real</h3>
            <div className="flex items-center gap-4">
              <span>Usuários online: {onlineCount}</span>
              <span>Status: {connectionStatus}</span>
              <Badge variant={isConnected ? 'default' : 'secondary'}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
          </div>

          {/* Exemplo de Estado Computado */}
          <div className="space-y-2">
            <h3 className="font-semibold">🧮 Estado Computado</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Perguntas por categoria:</strong>
                <div className="mt-1 space-y-1">
                  {Object.entries(
                    questions.reduce((acc, q) => {
                      acc[q.categoryId] = (acc[q.categoryId] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  ).map(([category, count]) => (
                    <div key={category}>
                      {category}: {count}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <strong>Estatísticas:</strong>
                <div className="mt-1 space-y-1">
                  <div>Total de perguntas: {questions.length}</div>
                  <div>Perguntas abertas: {questions.filter(q => q.status === 'open').length}</div>
                  <div>Perguntas respondidas: {questions.filter(q => q.status === 'answered').length}</div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
