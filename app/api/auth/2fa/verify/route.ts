import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTOTPToken, validateTOTPFormat } from '@/lib/totp'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, token, backupCode } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!user.totpEnabled) {
      return NextResponse.json(
        { error: '2FA não está ativado para este usuário' },
        { status: 400 }
      )
    }

    if (!user.totpSecret) {
      return NextResponse.json(
        { error: 'Configuração 2FA inválida' },
        { status: 400 }
      )
    }

    let isValid = false

    if (backupCode) {
      // Verificar código de backup
      let backupCodeValid = false
      let validIndex = -1
      
      for (let i = 0; i < user.totpBackupCodes.length; i++) {
        const hashedCode = user.totpBackupCodes[i]
        const isMatch = await bcrypt.compare(backupCode, hashedCode)
        if (isMatch) {
          backupCodeValid = true
          validIndex = i
          break
        }
      }
      
      if (backupCodeValid && validIndex >= 0) {
        // Remover código de backup usado
        const updatedBackupCodes = user.totpBackupCodes.filter((_: string, i: number) => i !== validIndex)
        await prisma.user.update({
          where: { id: user.id },
          data: { totpBackupCodes: updatedBackupCodes }
        })
      }

      isValid = backupCodeValid
    } else if (token) {
      // Verificar token TOTP
      if (!validateTOTPFormat(token)) {
        return NextResponse.json(
          { error: 'Formato de token inválido' },
          { status: 400 }
        )
      }

      const verification = verifyTOTPToken(token, user.totpSecret)
      isValid = verification.isValid

      if (isValid) {
        // Atualizar último uso
        await prisma.user.update({
          where: { id: user.id },
          data: { totpLastUsed: new Date() }
        })
      }
    } else {
      return NextResponse.json(
        { error: 'Token ou código de backup é obrigatório' },
        { status: 400 }
      )
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verificação 2FA bem-sucedida',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        reputation: user.reputation,
        level: user.level
      }
    })

  } catch (error) {
    console.error('Erro na verificação 2FA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
