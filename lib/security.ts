// Configurações de segurança centralizadas
export const SECURITY_CONFIG = {
  // Autenticação
  AUTH: {
    SESSION_MAX_AGE: 24 * 60 * 60, // 24 horas
    SESSION_UPDATE_AGE: 60 * 60, // 1 hora
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_BLOCK_DURATION: 15 * 60 * 1000, // 15 minutos
    REGISTRATION_MAX_PER_IP: 10,
    REGISTRATION_WINDOW: 15 * 60 * 1000, // 15 minutos
  },

  // Rate Limiting
  RATE_LIMIT: {
    API_MAX_REQUESTS_PER_MINUTE: 100,
    LOGIN_MAX_REQUESTS_PER_MINUTE: 10,
    REGISTRATION_MAX_REQUESTS_PER_HOUR: 5,
  },

  // Validação
  VALIDATION: {
    EMAIL_MAX_LENGTH: 120,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    QUESTION_TITLE_MIN_LENGTH: 10,
    QUESTION_TITLE_MAX_LENGTH: 200,
    QUESTION_CONTENT_MIN_LENGTH: 20,
    QUESTION_CONTENT_MAX_LENGTH: 10000,
    ANSWER_CONTENT_MIN_LENGTH: 10,
    ANSWER_CONTENT_MAX_LENGTH: 10000,
    COMMENT_MIN_LENGTH: 2,
    COMMENT_MAX_LENGTH: 1000,
    POST_CONTENT_MAX_LENGTH: 10000,
    MAX_TAGS: 20,
    MAX_TAGS_PER_QUESTION: 10,
  },

  // Sanitização
  SANITIZATION: {
    ALLOWED_HTML_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a'
    ],
    ALLOWED_HTML_ATTRIBUTES: {
      'a': ['href', 'target', 'rel'],
      'code': ['class'],
      'pre': ['class']
    },
    MAX_REQUEST_BODY_SIZE: 1024 * 1024, // 1MB
  },

  // Headers de Segurança
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Content Security Policy
  CSP: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "https://cdn.jsdelivr.net"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },

  // Cookies
  COOKIES: {
    SESSION_TOKEN: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 horas
      },
    },
    CSRF_TOKEN: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Logs
  LOGGING: {
    LOG_AUTH_ATTEMPTS: true,
    LOG_REGISTRATION_ATTEMPTS: true,
    LOG_API_ERRORS: true,
    LOG_SECURITY_EVENTS: true,
    MASK_SENSITIVE_DATA: true,
  },
}

// Funções de segurança utilitárias
export const SecurityUtils = {
  // Mascarar dados sensíveis nos logs
  maskEmail: (email: string): string => {
    if (!email || !SECURITY_CONFIG.LOGGING.MASK_SENSITIVE_DATA) return email
    const [local, domain] = email.split('@')
    if (local.length <= 2) return email
    return `${local[0]}***@${domain}`
  },

  // Mascarar IP para logs
  maskIP: (ip: string): string => {
    if (!ip || !SECURITY_CONFIG.LOGGING.MASK_SENSITIVE_DATA) return ip
    if (ip === 'unknown') return ip
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`
    }
    return ip
  },

  // Gerar token CSRF
  generateCSRFToken: (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  },

  // Validar token CSRF
  validateCSRFToken: (token: string, storedToken: string): boolean => {
    return token === storedToken && token.length >= 20
  },

  // Verificar se é uma requisição segura
  isSecureRequest: (request: Request): boolean => {
    // Em desenvolvimento, permitir HTTP
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    const protocol = request.headers.get('x-forwarded-proto') || 
                    (request.url.startsWith('https') ? 'https' : 'http')
    return protocol === 'https'
  },

  // Verificar se é um IP válido
  isValidIP: (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === 'unknown'
  },

  // Verificar se é um User-Agent válido
  isValidUserAgent: (userAgent: string | null): boolean => {
    if (!userAgent) return false
    if (userAgent.length < 10 || userAgent.length > 500) return false
    
    // Bloquear User-Agents suspeitos
    const suspiciousPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python',
      'java', 'perl', 'ruby', 'php', 'go-http-client'
    ]
    
    const lowerUA = userAgent.toLowerCase()
    return !suspiciousPatterns.some(pattern => lowerUA.includes(pattern))
  },

  // Verificar se é uma requisição de bot
  isBotRequest: (request: Request): boolean => {
    const userAgent = request.headers.get('user-agent')
    if (!userAgent) return true
    
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python-requests', 'go-http-client', 'java-http-client'
    ]
    
    const lowerUA = userAgent.toLowerCase()
    return botPatterns.some(pattern => lowerUA.includes(pattern))
  },

  // Calcular score de risco da requisição
  calculateRiskScore: (request: Request): number => {
    let score = 0
    
    // Verificar User-Agent
    const userAgent = request.headers.get('user-agent')
    if (!userAgent || !SecurityUtils.isValidUserAgent(userAgent)) {
      score += 50
    }
    
    // Verificar se é bot
    if (SecurityUtils.isBotRequest(request)) {
      score += 30
    }
    
    // Verificar protocolo
    if (!SecurityUtils.isSecureRequest(request)) {
      score += 20
    }
    
    // Verificar headers suspeitos
    const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-client-ip']
    suspiciousHeaders.forEach(header => {
      if (request.headers.get(header)) {
        score += 10
      }
    })
    
    return score
  },

  // Decidir se deve bloquear a requisição
  shouldBlockRequest: (request: Request): boolean => {
    const riskScore = SecurityUtils.calculateRiskScore(request)
    return riskScore >= 80 // Bloquear se score >= 80
  },
}

// Constantes de erro de segurança
export const SECURITY_ERRORS = {
  TOO_MANY_REQUESTS: 'Too Many Requests',
  TOO_MANY_LOGIN_ATTEMPTS: 'Too Many Login Attempts',
  TOO_MANY_REGISTRATION_ATTEMPTS: 'Too Many Registration Attempts',
  INVALID_INPUT: 'Invalid Input',
  REQUEST_TOO_LARGE: 'Request Body Too Large',
  INVALID_JSON: 'Invalid JSON',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  SECURITY_VIOLATION: 'Security Violation',
  BOT_DETECTED: 'Bot Request Detected',
  HIGH_RISK_REQUEST: 'High Risk Request',
} as const

// Tipos de segurança
export type SecurityError = typeof SECURITY_ERRORS[keyof typeof SECURITY_ERRORS]
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

// Interface para eventos de segurança
export interface SecurityEvent {
  timestamp: Date
  type: 'auth_attempt' | 'registration_attempt' | 'api_error' | 'security_violation'
  ip: string
  userAgent?: string
  riskScore: number
  riskLevel: RiskLevel
  details: Record<string, any>
  blocked: boolean
}
