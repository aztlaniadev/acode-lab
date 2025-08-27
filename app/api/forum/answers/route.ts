import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/forum/answers - Criar nova resposta
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, questionId } = body;

    // Validação
    if (!content || !questionId) {
      return NextResponse.json(
        { error: 'Conteúdo e ID da pergunta são obrigatórios' },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se a pergunta existe
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true, status: true }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      );
    }

    if (question.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Não é possível responder a esta pergunta' },
        { status: 400 }
      );
    }

    // Criar resposta
    const answer = await prisma.answer.create({
      data: {
        content,
        authorId: session.user.id,
        questionId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            reputation: true,
            level: true,
            createdAt: true,
          }
        },
        question: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          }
        }
      }
    });

    return NextResponse.json(answer, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar resposta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
