import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/forum/comments - Criar novo comentário
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
    const { content, questionId, answerId, parentId } = body;

    // Validação
    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    if (content.length < 2) {
      return NextResponse.json(
        { error: 'Comentário deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se pelo menos um dos campos está preenchido
    if (!questionId && !answerId) {
      return NextResponse.json(
        { error: 'Deve especificar questionId ou answerId' },
        { status: 400 }
      );
    }

    // Se for resposta a um comentário, verificar se o comentário pai existe
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Comentário pai não encontrado' },
          { status: 404 }
        );
      }
    }

    // Criar comentário
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        questionId: questionId || null,
        answerId: answerId || null,
        parentId: parentId || null,
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
          }
        },
        question: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        answer: {
          select: {
            id: true,
            content: true,
          }
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                username: true,
              }
            }
          }
        },
        _count: {
          select: {
            votes: true,
            replies: true,
          }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
