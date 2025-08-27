"use client"

import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, ArrowLeft, Shield, Lock } from 'lucide-react'
import Link from 'next/link'

function AuthErrorContent() {
  const [error, setError] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    // Simular o uso de searchParams de forma segura
    const urlParams = new URLSearchParams(window.location.search)
    setError(urlParams.get('error'))
  }, [])

  // Mapeamento seguro de erros para mensagens amigáveis
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return {
          title: 'Erro de Configuração',
          message: 'Ocorreu um problema na configuração do sistema. Entre em contato com o suporte.',
          severity: 'error'
        }
      case 'AccessDenied':
        return {
          title: 'Acesso Negado',
          message: 'Você não tem permissão para acessar esta área.',
          severity: 'warning'
        }
      case 'Verification':
        return {
          title: 'Verificação Necessária',
          message: 'Sua conta precisa ser verificada antes de continuar.',
          severity: 'info'
        }
      case 'Default':
      default:
        return {
          title: 'Erro de Autenticação',
          message: 'Ocorreu um problema durante a autenticação. Tente novamente.',
          severity: 'error'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-destructive/20 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">
              {errorInfo.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {errorInfo.message}
              </p>
              
              {error && (
                <Badge variant="outline" className="mb-4">
                  Código: {error}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Sistema de segurança ativo
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Autenticação criptografada
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>Se o problema persistir, entre em contato com o suporte</p>
              <p className="mt-1">ID da sessão: {Date.now().toString(36)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
