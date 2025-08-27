import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social/profiles - Listar perfis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skills = searchParams.get('skills')?.split(',')
    const location = searchParams.get('location')
    const isAvailable = searchParams.get('isAvailable')
    const sortBy = searchParams.get('sortBy') || 'reputation'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}

    if (skills && skills.length > 0) {
      where.skills = {
        hasSome: skills
      }
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true'
    }

    // Construir ordenação
    let orderBy: any = {}
    switch (sortBy) {
      case 'reputation':
        orderBy = { user: { reputation: 'desc' } }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'name':
        orderBy = { displayName: 'asc' }
        break
      default:
        orderBy = { user: { reputation: 'desc' } }
    }

    // Buscar perfis
    const profiles = await prisma.userProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true,
            isVerified: true,
            createdAt: true,
            _count: {
              select: {
                followers: true,
                following: true,
                socialPosts: true
              }
            }
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Contar total
    const total = await prisma.userProfile.count({ where })

    return NextResponse.json({
      profiles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar perfis:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/social/profiles - Criar/atualizar perfil
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, displayName, bio, skills, experience, education, company, jobTitle, location, isAvailable, hourlyRate, portfolio, socialLinks } = body

    // Validações básicas
    if (!userId || !displayName) {
      return NextResponse.json(
        { error: 'userId e displayName são obrigatórios' },
        { status: 400 }
      )
    }

    if (displayName.length < 2 || displayName.length > 100) {
      return NextResponse.json(
        { error: 'Nome deve ter entre 2 e 100 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Criar ou atualizar perfil
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        displayName,
        bio,
        skills: skills || [],
        experience,
        education,
        company,
        jobTitle,
        location,
        isAvailable: isAvailable ?? true,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        portfolio: portfolio || [],
        socialLinks,
        updatedAt: new Date()
      },
      create: {
        userId,
        displayName,
        bio,
        skills: skills || [],
        experience,
        education,
        company,
        jobTitle,
        location,
        isAvailable: isAvailable ?? true,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        portfolio: portfolio || [],
        socialLinks
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true,
            isVerified: true
          }
        }
      }
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar/atualizar perfil:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
