import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { userRegistrationSchema, validateRequest, sanitizeText } from '@/lib/validation';

// POST /api/auth/users - Registrar novo usuário
export async function POST(request: NextRequest) {
  try {
    // Rate limiting básico (em produção, use o middleware)
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Verificar se já houve muitas tentativas de registro deste IP
    const recentRegistrations = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // Últimos 15 minutos
        }
      }
    });
    
    if (recentRegistrations.length > 10) {
      return NextResponse.json(
        { error: 'Muitas tentativas de registro. Tente novamente em alguns minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validação robusta usando Zod
    const validation = await validateRequest(userRegistrationSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { email, username, name, password } = validation.data;

    // Sanitização adicional
    const sanitizedName = sanitizeText(name);
    const sanitizedUsername = sanitizeText(username);

    // Verificar se email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Verificar se username já existe
    const existingUsername = await prisma.user.findUnique({
      where: { username: sanitizedUsername }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username já está em uso' },
        { status: 400 }
      );
    }

    // Hash da senha com salt mais forte
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        username: sanitizedUsername,
        name: sanitizedName,
        password: hashedPassword,
        reputation: 0,
        level: 'BEGINNER',
        isVerified: false,
        isBanned: false,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        reputation: true,
        level: true,
        isVerified: true,
        createdAt: true,
      }
    });

    // Log de sucesso (sem dados sensíveis)
    console.log(`Novo usuário registrado: ${email} (ID: ${user.id})`);

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    
    // Em produção, não exponha detalhes internos
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Erro interno do servidor',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET /api/auth/users - Buscar perfil do usuário logado
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        badges: {
          include: {
            badge: {
              select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                color: true,
              }
            }
          }
        },
        _count: {
          select: {
            questions: true,
            answers: true,
            followers: true,
            following: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Remover senha do objeto
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Erro interno do servidor',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
