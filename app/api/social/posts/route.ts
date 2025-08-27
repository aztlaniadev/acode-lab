import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social/posts - Listar posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const authorId = searchParams.get('authorId')
    const tags = searchParams.get('tags')?.split(',')
    const sortBy = searchParams.get('sortBy') || 'newest'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      isPublic: true
    }

    if (type) {
      where.type = type
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      }
    }

    // Construir ordenação
    let orderBy: any = {}
    switch (sortBy) {
      case 'popular':
        orderBy = { likeCount: 'desc' }
        break
      case 'views':
        orderBy = { viewCount: 'desc' }
        break
      case 'comments':
        orderBy = { commentCount: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Buscar posts
    const posts = await prisma.socialPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            shares: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Contar total
    const total = await prisma.socialPost.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social/posts - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, type, tags, visibility, authorId } = body

    // Validações básicas
    if (!content || !type || !authorId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    if (content.length < 1 || content.length > 10000) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter entre 1 e 10000 caracteres' },
        { status: 400 }
      )
    }

    // Criar post
    const post = await prisma.socialPost.create({
      data: {
        content,
        type,
        tags: tags || [],
        visibility: visibility || 'PUBLIC',
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
