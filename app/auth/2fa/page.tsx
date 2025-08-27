"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Key, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

interface TOTPData {
  qr_code: string
  secret: string
  otpauth_url: string
}

interface TwoFAStatus {
  enabled: boolean
  lastUsed: string | null
}

export default function TwoFAPage() {
  const { data: session, status } = useSession()
  const [totpData, setTotpData] = useState<TOTPData | null>(null)
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [status2FA, setStatus2FA] = useState<TwoFAStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Buscar status atual do 2FA
  useEffect(() => {
    if (session?.user?.email) {
      fetch2FAStatus()
    }
  }, [session])

  const fetch2FAStatus = async () => {
    try {
      const response = await fetch('/api/auth/2fa/setup')
      if (response.ok) {
        const data = await response.json()
        setStatus2FA(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar status 2FA:', error)
    }
  }

  const generateTOTP = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      })

      const data = await response.json()
      
      if (response.ok) {
        setTotpData(data.data)
        setMessage({ type: 'success', text: 'QR Code gerado com sucesso! Escaneie com seu app de autenticação.' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao gerar QR Code' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setLoading(false)
    }
  }

  const verifyAndActivate = async () => {
    if (!token || token.length !== 6) {
      setMessage({ type: 'error', text: 'Digite um código de 6 dígitos' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', token })
      })

      const data = await response.json()
      
      if (response.ok) {
        setBackupCodes(data.backupCodes)
        setMessage({ type: 'success', text: '2FA ativado com sucesso! Guarde os códigos de backup.' })
        setTotpData(null)
        setToken('')
        fetch2FAStatus()
      } else {
        setMessage({ type: 'error', text: data.error || 'Código inválido' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setLoading(false)
    }
  }

  const disable2FA = async () => {
    if (!password) {
      setMessage({ type: 'error', text: 'Digite sua senha para desativar 2FA' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable', password })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: '2FA desativado com sucesso' })
        setPassword('')
        fetch2FAStatus()
      } else {
        setMessage({ type: 'error', text: data.error || 'Senha incorreta' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setLoading(false)
    }
  }

  const downloadBackupCodes = () => {
    if (!backupCodes.length) return
    
    const content = `Códigos de Backup - Acode Lab\n\n${backupCodes.join('\n')}\n\nGuarde estes códigos em um local seguro. Cada código só pode ser usado uma vez.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground mb-4">
                Você precisa estar logado para configurar 2FA
              </p>
              <Button asChild>
                <Link href="/auth/signin">Fazer Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Configuração 2FA</h1>
          <p className="text-muted-foreground">
            Proteja sua conta com autenticação de dois fatores
          </p>
        </div>

        {/* Status Atual */}
        {status2FA && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status 2FA</p>
                  <div className="flex items-center gap-2 mt-1">
                    {status2FA.enabled ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-600">Ativado</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-600">Desativado</span>
                      </>
                    )}
                  </div>
                </div>
                {status2FA.lastUsed && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Último uso</p>
                    <p className="text-sm font-medium">
                      {new Date(status2FA.lastUsed).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensagens */}
        {message && (
          <Card className={`mb-6 border-2 ${
            message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <CardContent className="pt-6">
              <div className={`flex items-center gap-2 ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuração 2FA */}
        {!status2FA?.enabled ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Ativar 2FA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!totpData ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Clique no botão abaixo para gerar um QR Code e configurar 2FA
                  </p>
                  <Button 
                    onClick={generateTOTP} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Gerando...' : 'Gerar QR Code'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Escaneie este QR Code com seu app de autenticação
                    </p>
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <Image 
                        src={totpData.qr_code} 
                        alt="QR Code 2FA" 
                        className="w-48 h-48"
                        width={192}
                        height={192}
                      />
                    </div>
                  </div>

                  {/* Segredo Manual */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ou digite manualmente este segredo:
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        type={showSecret ? 'text' : 'password'}
                        value={totpData.secret}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Verificação */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Digite o código de 6 dígitos do seu app:
                    </p>
                    <Input
                      type="text"
                      placeholder="000000"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="text-center text-lg font-mono"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={verifyAndActivate} 
                      disabled={loading || token.length !== 6}
                      className="flex-1"
                    >
                      {loading ? 'Verificando...' : 'Ativar 2FA'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setTotpData(null)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Desativar 2FA */
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Desativar 2FA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Para desativar 2FA, digite sua senha atual:
              </p>
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                onClick={disable2FA} 
                disabled={loading || !password}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Desativando...' : 'Desativar 2FA'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Códigos de Backup */}
        {backupCodes.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Códigos de Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Guarde estes códigos em um local seguro!
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Cada código só pode ser usado uma vez para acessar sua conta caso perca acesso ao 2FA.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <Badge key={index} variant="outline" className="font-mono text-center py-2">
                    {code}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={downloadBackupCodes}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Códigos
                </Button>
                <Button 
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                  variant="outline"
                  className="flex-1"
                >
                  {showBackupCodes ? 'Ocultar' : 'Mostrar'} Códigos
                </Button>
              </div>

              {!showBackupCodes && (
                <p className="text-xs text-muted-foreground text-center">
                  Os códigos foram ocultados por segurança
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Voltar */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
