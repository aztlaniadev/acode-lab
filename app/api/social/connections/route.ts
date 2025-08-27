import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social/connections - Listar conexões do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: any = {
      OR: [
        { requesterId: userId },
        { recipientId: userId }
      ]
    }

    if (status) {
      where.status = status
    }

    // Buscar conexões
    const connections = await prisma.connection.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Separar conexões por tipo
    const sent = connections.filter((c: any) => c.requesterId === userId)
    const received = connections.filter((c: any) => c.recipientId === userId)
    const accepted = connections.filter((c: any) => c.status === 'ACCEPTED')

    return NextResponse.json({
      connections,
      sent,
      received,
      accepted,
      pending: connections.filter((c: any) => c.status === 'PENDING'),
      rejected: connections.filter((c: any) => c.status === 'REJECTED')
    })
  } catch (error) {
    console.error('Erro ao buscar conexões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social/connections - Enviar solicitação de conexão
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requesterId, recipientId, message } = body

    // Validações básicas
    if (!requesterId || !recipientId) {
      return NextResponse.json(
        { error: 'requesterId e recipientId são obrigatórios' },
        { status: 400 }
      )
    }

    if (requesterId === recipientId) {
      return NextResponse.json(
        { error: 'Não é possível se conectar consigo mesmo' },
        { status: 400 }
      )
    }

    // Verificar se usuários existem
    const [requester, recipient] = await Promise.all([
      prisma.user.findUnique({ where: { id: requesterId } }),
      prisma.user.findUnique({ where: { id: recipientId } })
    ])

    if (!requester || !recipient) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe uma conexão
    const existingConnection = await prisma.connection.findUnique({
      where: {
        requesterId_recipientId: {
          requesterId,
          recipientId
        }
      }
    })

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Já existe uma conexão entre estes usuários' },
        { status: 400 }
      )
    }

    // Verificar se existe uma conexão reversa
    const reverseConnection = await prisma.connection.findUnique({
      where: {
        requesterId_recipientId: {
          requesterId: recipientId,
          recipientId: requesterId
        }
      }
    })

    if (reverseConnection) {
      return NextResponse.json(
        { error: 'Já existe uma conexão entre estes usuários' },
        { status: 400 }
      )
    }

    // Criar solicitação de conexão
    const connection = await prisma.connection.create({
      data: {
        requesterId,
        recipientId,
        status: 'PENDING',
        message: message || null
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(connection, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar conexão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/social/connections - Atualizar status da conexão
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionId, status, userId } = body

    if (!connectionId || !status || !userId) {
      return NextResponse.json(
        { error: 'connectionId, status e userId são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar conexão
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId }
    })

    if (!connection) {
      return NextResponse.json(
        { error: 'Conexão não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o destinatário
    if (connection.recipientId !== userId) {
      return NextResponse.json(
        { error: 'Apenas o destinatário pode alterar o status da conexão' },
        { status: 403 }
      )
    }

    // Atualizar status
    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(updatedConnection)
  } catch (error) {
    console.error('Erro ao atualizar conexão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
