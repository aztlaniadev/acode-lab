'use client'

import { useState } from 'react'
// Animações removidas
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  User,
  Edit,
  Trash2,
  Flag,
  Reply
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Answer, UserLevel } from '@/types/forum'

interface AnswerSectionProps {
  questionId: string
}

// Dados mockados para respostas
const mockAnswers: Answer[] = [
  {
    id: 'answer-1',
    content: `Excelente pergunta! Vou te ajudar com uma implementação completa de JWT em Next.js 14.

## 1. Estrutura de Pastas Recomendada

\`\`\`
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   └── logout/route.ts
│   └── middleware.ts
├── lib/
│   ├── auth.ts
│   └── jwt.ts
└── components/
    └── auth/
        ├── LoginForm.tsx
        └── ProtectedRoute.tsx
\`\`\`

## 2. Middleware Funcional

\`\`\`typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/jwt'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt-token')?.value
  
  // Rotas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
      const payload = await verifyJWT(token)
      if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
}
\`\`\`

## 3. Gerenciamento de Tokens no Cliente

\`\`\`typescript
// lib/auth.ts
export const setAuthToken = (token: string) => {
  document.cookie = \`jwt-token=\${token}; path=/; max-age=86400; secure; samesite=strict\`
}

export const removeAuthToken = () => {
  document.cookie = 'jwt-token=; path=/; max-age=0'
}

export const getAuthToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt-token='))
    ?.split('=')[1]
}
\`\`\`

## 4. API de Login/Registro

\`\`\`typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { signJWT } from '@/lib/jwt'
import { comparePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validar credenciais (implementar lógica de banco)
    const user = await validateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }
    
    // Gerar JWT
    const token = await signJWT({ userId: user.id, email: user.email })
    
    const response = NextResponse.json({ success: true })
    response.cookies.set('jwt-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 horas
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
\`\`\`

**Principais pontos:**
- Use \`httpOnly\` cookies para segurança
- Implemente refresh tokens para sessões longas
- Valide JWT no middleware para todas as rotas protegidas
- Use \`secure\` e \`sameSite\` para produção

Espero que ajude! Se precisar de mais detalhes, é só perguntar. 🚀`,
    author: {
      id: 'user-2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      reputation: 2100,
      level: UserLevel.EXPERT,
      badges: [],
      joinDate: new Date('2023-06-20'),
      questionsCount: 8,
      answersCount: 127
    },
    questionId: '1',
    votes: [
      { id: 'vote-1', userId: 'user-1', answerId: 'answer-1', value: 1, createdAt: new Date() },
      { id: 'vote-2', userId: 'user-3', answerId: 'answer-1', value: 1, createdAt: new Date() },
      { id: 'vote-3', userId: 'user-4', answerId: 'answer-1', value: 1, createdAt: new Date() }
    ],
    isAccepted: false,
    createdAt: new Date('2024-08-20T11:15:00'),
    updatedAt: new Date('2024-08-20T11:15:00')
  },
  {
    id: 'answer-2',
    content: `Também recomendo usar o NextAuth.js para autenticação. É mais robusto e tem integração nativa com Next.js.

**Vantagens do NextAuth.js:**
- ✅ Integração nativa com Next.js
- ✅ Múltiplos provedores (Google, GitHub, etc.)
- ✅ Sessões seguras
- ✅ Middleware integrado
- ✅ TypeScript nativo

**Instalação:**
\`\`\`bash
npm install next-auth
\`\`\`

**Configuração básica:**
\`\`\`typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implementar validação
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      return token
    },
    async session({ session, token }) {
      return session
    }
  }
})

export { handler as GET, handler as POST }
\`\`\`

É uma alternativa mais simples e robusta! 👍`,
    author: {
      id: 'user-3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
      reputation: 450,
      level: UserLevel.BEGINNER,
      badges: [],
      joinDate: new Date('2024-03-10'),
      questionsCount: 5,
      answersCount: 12
    },
    questionId: '1',
    votes: [
      { id: 'vote-4', userId: 'user-1', answerId: 'answer-2', value: 1, createdAt: new Date() }
    ],
    isAccepted: false,
    createdAt: new Date('2024-08-20T12:30:00'),
    updatedAt: new Date('2024-08-20T12:30:00')
  }
]

export function AnswerSection({ questionId }: AnswerSectionProps) {
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers)
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [newAnswer, setNewAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAnswer.trim()) return
    
    setIsSubmitting(true)
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Adicionar nova resposta
      const newAnswerObj: Answer = {
        id: `answer-${Date.now()}`,
        content: newAnswer,
        author: {
          id: 'user-current',
          name: 'Usuário Atual',
          email: 'current@email.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Current',
          reputation: 100,
          level: UserLevel.BEGINNER,
          badges: [],
          joinDate: new Date(),
          questionsCount: 1,
          answersCount: 1
        },
        questionId,
        votes: [],
        isAccepted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setAnswers(prev => [newAnswerObj, ...prev])
      setNewAnswer('')
      setShowAnswerForm(false)
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = (answerId: string, voteValue: 1 | -1) => {
    // Implementar API de votação
    console.log('Votar resposta:', answerId, voteValue)
  }

  const handleAcceptAnswer = (answerId: string) => {
    setAnswers(prev => prev.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    })))
    // Implementar API para aceitar resposta
    console.log('Aceitar resposta:', answerId)
  }

  const formatDate = (date: Date | string) => {
    // ✅ SEGURANÇA: Converter string para Date se necessário
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-green-600'
      case 'intermediate': return 'text-yellow-600'
      case 'master': return 'text-purple-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header das respostas */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {answers.length} Resposta{answers.length !== 1 ? 's' : ''}
        </h2>
        <Button 
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {showAnswerForm ? 'Cancelar' : 'Responder'}
        </Button>
      </div>

      {/* Formulário de resposta */}
      <div>
        {showAnswerForm && (
          <div
          >
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Sua Resposta</h3>
                <p className="text-sm text-muted-foreground">
                  Compartilhe seu conhecimento e ajude outros desenvolvedores
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <Textarea
                    placeholder="Escreva sua resposta aqui. Use Markdown para formatação..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={6}
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowAnswerForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !newAnswer.trim()}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Lista de respostas */}
      <div className="space-y-4">
        {answers.map((answer) => (
          <div
            key={answer.id}
          >
            <Card className={`border-border ${answer.isAccepted ? 'ring-2 ring-green-500 bg-green-50/50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Sistema de votação */}
                  <div className="flex flex-col items-center gap-2 min-w-[60px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto"
                      onClick={() => handleVote(answer.id, 1)}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </Button>
                    
                    <span className="text-lg font-semibold text-foreground">
                      {answer.votes.reduce((sum, vote) => sum + vote.value, 0)}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-auto"
                      onClick={() => handleVote(answer.id, -1)}
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </Button>

                    {/* Botão para aceitar resposta */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-2 h-auto ${answer.isAccepted ? 'text-green-600' : 'text-muted-foreground'}`}
                      onClick={() => handleAcceptAnswer(answer.id)}
                      title={answer.isAccepted ? 'Resposta aceita' : 'Aceitar resposta'}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Conteúdo da resposta */}
                  <div className="flex-1 space-y-4">
                    {/* Conteúdo */}
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {answer.content}
                      </div>
                    </div>

                    {/* Ações da resposta */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Reply className="w-4 h-4" />
                          Comentar
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Flag className="w-4 h-4" />
                          Reportar
                        </Button>
                      </div>

                      {/* Informações do autor */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {answer.author.name}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getLevelColor(answer.author.level)}`}
                            >
                              {answer.author.level}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Reputação: {answer.author.reputation} • 
                            {answer.author.answersCount} respostas
                          </div>
                        </div>
                        
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                          <AvatarFallback>
                            {answer.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Data da resposta */}
                    <div className="text-xs text-muted-foreground">
                      Respondido {formatDate(answer.createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Mensagem se não há respostas */}
      {answers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma resposta ainda
            </h3>
            <p className="text-muted-foreground mb-4">
              Seja o primeiro a responder esta pergunta!
            </p>
            <Button onClick={() => setShowAnswerForm(true)}>
              Responder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
