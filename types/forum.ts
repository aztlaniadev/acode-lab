// Tipos para o sistema de fórum Q&A

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  reputation: number
  level: UserLevel
  badges: Badge[]
  joinDate: Date
  questionsCount: number
  answersCount: number
}

export enum UserLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER'
}

export enum QuestionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DUPLICATE = 'DUPLICATE',
  OFF_TOPIC = 'OFF_TOPIC',
  TOO_BROAD = 'TOO_BROAD',
  OPINION_BASED = 'OPINION_BASED',
  SOLVED = 'SOLVED',
  ANSWERED = 'ANSWERED',
  UNANSWERED = 'UNANSWERED'
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: Date
}

export interface Question {
  id: string
  title: string
  content: string
  slug: string
  status: QuestionStatus
  isFeatured: boolean
  isSolved: boolean
  viewCount: number
  createdAt: string | Date
  updatedAt: string | Date
  author: {
    id: string
    username: string
    name?: string | null
    avatar?: string | null
    reputation: number
    level: UserLevel
  }
  category: Category
  tags: Tag[]
  votes?: Vote[]
  _count?: {
    answers: number
    comments: number
    votes: number
  }
  // Campos de votação otimizados
  upvotesCount?: number
  downvotesCount?: number
  userVote?: number // 1 para upvote, -1 para downvote, 0 para sem voto
  score?: number // score calculado (upvotes - downvotes)
}

export interface Answer {
  id: string
  content: string
  author: User
  questionId: string
  votes: Vote[]
  isAccepted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  author: User
  parentId: string // ID da pergunta ou resposta
  parentType: 'question' | 'answer'
  votes: Vote[]
  createdAt: Date
}

export interface Vote {
  id: string
  userId: string
  questionId?: string
  answerId?: string
  commentId?: string
  value: 1 | -1 // 1 para positivo, -1 para negativo
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  questionsCount: number
  slug: string
  isActive?: boolean
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Tag {
  id: string
  name: string
  description?: string
  color: string
  questionsCount: number
  slug: string
  createdAt: Date
  updatedAt: Date
  isPopular?: boolean
  isNew?: boolean
  usageCount?: number
}

export interface QuestionFilters {
  category?: string
  tags?: string[]
  status?: 'all' | 'unanswered' | 'answered' | 'solved'
  sortBy?: 'newest' | 'oldest' | 'mostVoted' | 'mostViewed' | 'mostAnswered'
  search?: string
}

export interface QuestionStats {
  totalQuestions: number
  totalAnswers: number
  totalUsers: number
  questionsThisWeek: number
  questionsThisMonth: number
  averageResponseTime: number
  solvedRate: number
}
