import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export interface TOTPConfig {
  issuer: string
  algorithm: string
  digits: number
  period: number
}

export interface TOTPSecret {
  secret: string
  otpauth_url: string
  qr_code: string
}

export interface TOTPVerification {
  isValid: boolean
  delta?: number
  message?: string
}

export class TOTPService {
  private config: TOTPConfig

  constructor(config?: Partial<TOTPConfig>) {
    this.config = {
      issuer: process.env.TOTP_ISSUER || 'Acode Lab',
      algorithm: process.env.TOTP_ALGORITHM || 'sha1',
      digits: parseInt(process.env.TOTP_DIGITS || '6'),
      period: parseInt(process.env.TOTP_PERIOD || '30'),
      ...config
    }
  }

  /**
   * Gera um novo segredo TOTP para um usuário
   */
  async generateSecret(userEmail: string, username: string): Promise<TOTPSecret> {
    try {
      // Gerar segredo base32
      const secret = speakeasy.generateSecret({
        name: `${this.config.issuer}:${userEmail}`,
        issuer: this.config.issuer,
        length: 32
      })

      // Gerar URL para QR Code
      const otpauth_url = speakeasy.otpauthURL({
        secret: secret.base32!,
        label: userEmail,
        issuer: this.config.issuer,
        digits: this.config.digits,
        period: this.config.period
      })

      // Gerar QR Code como data URL
      const qr_code = await QRCode.toDataURL(otpauth_url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 2,
        width: 200
      })

      return {
        secret: secret.base32!,
        otpauth_url,
        qr_code
      }
    } catch (error) {
      console.error('Erro ao gerar segredo TOTP:', error)
      throw new Error('Falha ao gerar segredo 2FA')
    }
  }

  /**
   * Verifica um código TOTP
   */
  verifyToken(token: string, secret: string): TOTPVerification {
    try {
      // Verificar token com tolerância de 1 período (30s)
      const isValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 1, // Aceita tokens de ±1 período
        digits: this.config.digits
      })

      if (isValid) {
        return { isValid: true }
      }

      // Tentar verificar com diferentes deltas para debug
      const delta = speakeasy.totp.verifyDelta({
        secret,
        encoding: 'base32',
        token,
        window: 2,
        digits: this.config.digits
      })

      return {
        isValid: false,
        delta: delta?.delta || 0,
        message: `Token inválido. Delta: ${delta?.delta || 'N/A'}`
      }
    } catch (error) {
      console.error('Erro ao verificar token TOTP:', error)
      return {
        isValid: false,
        message: 'Erro na verificação do token'
      }
    }
  }

  /**
   * Gera um token TOTP para testes
   */
  generateToken(secret: string): string {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
      digits: this.config.digits
    })
  }

  /**
   * Valida formato do token (6 dígitos)
   */
  validateTokenFormat(token: string): boolean {
    const tokenRegex = /^\d{6}$/
    return tokenRegex.test(token)
  }

  /**
   * Obtém informações sobre o segredo
   */
  getSecretInfo(secret: string): {
    algorithm: string
    digits: number
    period: number
    remainingTime: number
  } {
    const now = Math.floor(Date.now() / 1000)
    const period = this.config.period
    const remainingTime = period - (now % period)

    return {
      algorithm: this.config.algorithm,
      digits: this.config.digits,
      period,
      remainingTime
    }
  }
}

// Instância global do serviço TOTP
export const totpService = new TOTPService()

// Funções utilitárias para uso direto
export const generateTOTPSecret = (userEmail: string, username: string) => 
  totpService.generateSecret(userEmail, username)

export const verifyTOTPToken = (token: string, secret: string) => 
  totpService.verifyToken(token, secret)

export const generateTOTPToken = (secret: string) => 
  totpService.generateToken(secret)

export const validateTOTPFormat = (token: string) => 
  totpService.validateTokenFormat(token)
