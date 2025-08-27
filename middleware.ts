import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SECURITY_CONFIG, SecurityUtils, SECURITY_ERRORS } from '@/lib/security'

// Rate limiting será habilitado em produção
if (process.env.NODE_ENV === 'development') {
  console.log('🔓 Rate limiting desabilitado no middleware')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // 1. Verificação de segurança básica (simplificada)
  const riskScore = SecurityUtils.calculateRiskScore(request)
  if (SecurityUtils.shouldBlockRequest(request)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚨 Requisição bloqueada por segurança - IP: ${SecurityUtils.maskIP(ip)}, Score: ${riskScore}`)
    }
    return NextResponse.json(
      { error: SECURITY_ERRORS.HIGH_RISK_REQUEST },
      { status: 403 }
    )
  }

  // 2. RATE LIMITING DESABILITADO - Focando apenas no login funcionar
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔓 Middleware: ${pathname} - IP: ${SecurityUtils.maskIP(ip)} - Rate limiting desabilitado`)
  }

  // 3. Login sempre permitido (sem rate limiting)
  if (pathname === '/api/auth/callback/credentials') {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Login permitido pelo middleware (sem rate limiting)');
    }
  }

  // 4. Rate limiting desabilitado para todas as rotas
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔓 Rate limiting desabilitado para: ${pathname}`)
  }

  // 6. Headers de segurança
  const response = NextResponse.next()
  
  // Content Security Policy
  const csp = Object.entries(SECURITY_CONFIG.CSP)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Headers de segurança
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // 7. Validação de entrada para APIs
  if (request.method === 'POST' && pathname.startsWith('/api/')) {
    const contentType = request.headers.get('content-type')
    if (!contentType || (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded'))) {
      return NextResponse.json(
        { error: 'Content-Type deve ser application/json ou application/x-www-form-urlencoded' },
        { status: 400 }
      )
    }

    try {
      const body = await request.text()
      if (body.length > SECURITY_CONFIG.SANITIZATION.MAX_REQUEST_BODY_SIZE) {
        return NextResponse.json(
          { error: 'Corpo da requisição muito grande' },
          { status: 413 }
        )
      }

      // Só validar JSON se for application/json
      if (contentType.includes('application/json') && body && !JSON.parse(body)) {
        return NextResponse.json(
          { error: 'JSON inválido' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Corpo da requisição inválido' },
        { status: 400 }
      )
    }
  }

  // 8. Log de segurança (em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔒 [${new Date().toISOString()}] ${request.method} ${pathname} - IP: ${SecurityUtils.maskIP(ip)}, Score: ${riskScore}`)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
