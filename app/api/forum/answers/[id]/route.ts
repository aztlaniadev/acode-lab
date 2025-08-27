import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT /api/forum/answers/[id] - Atualizar resposta
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

    // Verificar se o usuário é o autor da resposta
    const existingAnswer = await prisma.answer.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingAnswer) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      );
    }

    if (existingAnswer.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para editar esta resposta' },
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

    if (content.length < 10) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Atualizar resposta
    const updatedAnswer = await prisma.answer.update({
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

    return NextResponse.json(updatedAnswer);

  } catch (error) {
    console.error('Erro ao atualizar resposta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/answers/[id] - Remover resposta
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

    // Verificar se o usuário é o autor da resposta
    const existingAnswer = await prisma.answer.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingAnswer) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      );
    }

    if (existingAnswer.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para remover esta resposta' },
        { status: 403 }
      );
    }

    // Remover resposta (cascade remove comentários e votos)
    await prisma.answer.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Resposta removida com sucesso' });

  } catch (error) {
    console.error('Erro ao remover resposta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/forum/answers/[id] - Aceitar resposta como melhor resposta
export async function PATCH(
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
    const { action } = body; // 'accept' ou 'unaccept'

    // Buscar resposta com informações da pergunta
    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        question: {
          select: {
            id: true,
            authorId: true,
            isSolved: true,
          }
        }
      }
    });

    if (!answer) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o autor da pergunta
    if (answer.question.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Apenas o autor da pergunta pode aceitar respostas' },
        { status: 403 }
      );
    }

    if (action === 'accept') {
      // Desmarcar outras respostas como aceitas
      await prisma.answer.updateMany({
        where: {
          questionId: answer.question.id,
          id: { not: id }
        },
        data: {
          isAccepted: false,
          isBest: false
        }
      });

      // Marcar esta resposta como aceita
      await prisma.answer.update({
        where: { id },
        data: {
          isAccepted: true,
          isBest: true
        }
      });

      // Marcar pergunta como resolvida
      await prisma.question.update({
        where: { id: answer.question.id },
        data: { isSolved: true }
      });

      // Dar reputação ao autor da resposta
      await prisma.user.update({
        where: { id: answer.authorId },
        data: { reputation: { increment: 15 } }
      });

      return NextResponse.json({ message: 'Resposta aceita como melhor resposta' });

    } else if (action === 'unaccept') {
      // Desmarcar resposta como aceita
      await prisma.answer.update({
        where: { id },
        data: {
          isAccepted: false,
          isBest: false
        }
      });

      // Marcar pergunta como não resolvida
      await prisma.question.update({
        where: { id: answer.question.id },
        data: { isSolved: false }
      });

      // Remover reputação do autor da resposta
      await prisma.user.update({
        where: { id: answer.authorId },
        data: { reputation: { decrement: 15 } }
      });

      return NextResponse.json({ message: 'Resposta desmarcada como melhor resposta' });

    } else {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Erro ao gerenciar resposta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
