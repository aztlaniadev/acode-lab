import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT /api/forum/comments/[id] - Atualizar comentário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { content } = body;

    // Verificar se o usuário é o autor do comentário
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para editar este comentário' },
        { status: 403 }
      );
    }

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

    // Atualizar comentário
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
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

    return NextResponse.json(updatedComment);

  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/comments/[id] - Remover comentário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verificar se o usuário é o autor do comentário
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para remover este comentário' },
        { status: 403 }
      );
    }

    // Remover comentário (cascade remove respostas e votos)
    await prisma.comment.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Comentário removido com sucesso' });

  } catch (error) {
    console.error('Erro ao remover comentário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
