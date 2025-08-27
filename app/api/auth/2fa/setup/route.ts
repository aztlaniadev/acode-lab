import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTOTPSecret, validateTOTPFormat } from '@/lib/totp'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Verificar se usuário está autenticado
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { action, token, password } = await request.json()

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'generate':
        // Gerar novo segredo TOTP
        if (user.totpEnabled) {
          return NextResponse.json(
            { error: '2FA já está ativado' },
            { status: 400 }
          )
        }

        const totpSecret = await generateTOTPSecret(user.email, user.username)
        
        // Salvar segredo no banco (temporariamente)
        await prisma.user.update({
          where: { id: user.id },
          data: { totpSecret: totpSecret.secret }
        })

        return NextResponse.json({
          success: true,
          data: {
            qr_code: totpSecret.qr_code,
            secret: totpSecret.secret,
            otpauth_url: totpSecret.otpauth_url
          }
        })

      case 'verify':
        // Verificar token e ativar 2FA
        if (!token || !validateTOTPFormat(token)) {
          return NextResponse.json(
            { error: 'Token inválido' },
            { status: 400 }
          )
        }

        if (!user.totpSecret) {
          return NextResponse.json(
            { error: 'Segredo TOTP não encontrado' },
            { status: 400 }
          )
        }

        // Verificar token
        const { verifyTOTPToken } = await import('@/lib/totp')
        const verification = verifyTOTPToken(token, user.totpSecret)

        if (!verification.isValid) {
          return NextResponse.json(
            { error: 'Token inválido ou expirado' },
            { status: 400 }
          )
        }

        // Gerar códigos de backup
        const backupCodes = Array.from({ length: 10 }, () => 
          Math.random().toString(36).substring(2, 8).toUpperCase()
        )

        // Hash dos códigos de backup
        const hashedBackupCodes = await Promise.all(
          backupCodes.map(code => bcrypt.hash(code, 12))
        )

        // Ativar 2FA
        await prisma.user.update({
          where: { id: user.id },
          data: {
            totpEnabled: true,
            totpBackupCodes: hashedBackupCodes,
            totpLastUsed: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          message: '2FA ativado com sucesso',
          backupCodes: backupCodes // Retornar apenas uma vez
        })

      case 'disable':
        // Desativar 2FA
        if (!password) {
          return NextResponse.json(
            { error: 'Senha é obrigatória para desativar 2FA' },
            { status: 400 }
          )
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: 'Senha incorreta' },
            { status: 400 }
          )
        }

        // Desativar 2FA
        await prisma.user.update({
          where: { id: user.id },
          data: {
            totpEnabled: false,
            totpSecret: null,
            totpBackupCodes: [],
            totpLastUsed: null
          }
        })

        return NextResponse.json({
          success: true,
          message: '2FA desativado com sucesso'
        })

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Erro na configuração 2FA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se usuário está autenticado
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Buscar status do 2FA
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        totpEnabled: true,
        totpLastUsed: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        enabled: user.totpEnabled,
        lastUsed: user.totpLastUsed
      }
    })
  } catch (error) {
    console.error('Erro ao buscar status 2FA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
