import { z } from 'zod'

// Schemas de validação usando Zod (similar ao WTForms do Flask)
export const userRegistrationSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email deve ter pelo menos 5 caracteres')
    .max(120, 'Email deve ter no máximo 120 caracteres')
    .transform(email => email.toLowerCase().trim()),
  
  username: z.string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username deve conter apenas letras, números, hífens e underscores')
    .transform(username => username.toLowerCase().trim()),
  
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .transform(name => name.trim()),
  
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número')
})

export const userLoginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .transform(email => email.toLowerCase().trim()),
  
  password: z.string()
    .min(1, 'Senha é obrigatória')
})

export const questionSchema = z.object({
  title: z.string()
    .min(10, 'Título deve ter pelo menos 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .transform(title => title.trim()),
  
  content: z.string()
    .min(20, 'Conteúdo deve ter pelo menos 20 caracteres')
    .max(10000, 'Conteúdo deve ter no máximo 10000 caracteres')
    .transform(content => content.trim()),
  
  categoryId: z.string()
    .min(1, 'Categoria é obrigatória'),
  
  tags: z.array(z.string())
    .min(1, 'Pelo menos uma tag é obrigatória')
    .max(10, 'Máximo de 10 tags permitidas')
    .transform(tags => tags.map(tag => tag.trim().toLowerCase()))
})

export const answerSchema = z.object({
  content: z.string()
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres')
    .max(10000, 'Conteúdo deve ter no máximo 10000 caracteres')
    .transform(content => content.trim()),
  
  questionId: z.string()
    .min(1, 'ID da pergunta é obrigatório')
})

export const commentSchema = z.object({
  content: z.string()
    .min(2, 'Comentário deve ter pelo menos 2 caracteres')
    .max(1000, 'Comentário deve ter no máximo 1000 caracteres')
    .transform(content => content.trim()),
  
  questionId: z.string().optional(),
  answerId: z.string().optional(),
  parentId: z.string().optional()
}).refine(data => data.questionId || data.answerId, {
  message: 'Deve especificar questionId ou answerId',
  path: ['questionId']
})

export const voteSchema = z.object({
  value: z.number()
    .refine(val => val === 1 || val === -1, {
      message: 'Valor do voto deve ser 1 (upvote) ou -1 (downvote)'
    }),
  
  questionId: z.string().optional(),
  answerId: z.string().optional(),
  commentId: z.string().optional()
}).refine(data => data.questionId || data.answerId || data.commentId, {
  message: 'Deve especificar questionId, answerId ou commentId'
})

export const socialPostSchema = z.object({
  content: z.string()
    .min(1, 'Conteúdo é obrigatório')
    .max(10000, 'Conteúdo deve ter no máximo 10000 caracteres')
    .transform(content => content.trim()),
  
  type: z.enum(['TEXT', 'CODE', 'LINK', 'IMAGE', 'VIDEO'], {
    errorMap: () => ({ message: 'Tipo de post inválido' })
  }),
  
  tags: z.array(z.string())
    .max(20, 'Máximo de 20 tags permitidas')
    .transform(tags => tags.map(tag => tag.trim().toLowerCase())),
  
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'CONNECTIONS'], {
    errorMap: () => ({ message: 'Visibilidade inválida' })
  }).default('PUBLIC'),
  
  authorId: z.string()
    .min(1, 'ID do autor é obrigatório')
})

// Função de validação genérica
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message)
      return { success: false, errors }
    }
    return { success: false, errors: ['Erro de validação desconhecido'] }
  }
}

// Função para sanitizar entrada de texto (proteção XSS básica)
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Função para validar e sanitizar HTML (para conteúdo rico)
export function sanitizeHTML(html: string): string {
  // Lista de tags permitidas
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'
  ]
  
  // Lista de atributos permitidos
  const allowedAttributes = {
    'a': ['href', 'target', 'rel'],
    'code': ['class'],
    'pre': ['class']
  }
  
  // Implementação básica - em produção, use uma biblioteca como DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// Função para validar URL
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Função para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar força da senha
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) score += 1
  else feedback.push('Senha deve ter pelo menos 8 caracteres')
  
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Senha deve conter pelo menos uma letra minúscula')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Senha deve conter pelo menos uma letra maiúscula')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Senha deve conter pelo menos um número')
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Senha deve conter pelo menos um caractere especial')
  
  if (password.length >= 12) score += 1
  
  const isValid = score >= 4
  
  return { isValid, score, feedback }
}
