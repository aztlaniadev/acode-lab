import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/forum/votes - Votar em pergunta, resposta ou comentário
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
    const { value, questionId, answerId, commentId } = body;

    // Validação
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Valor do voto deve ser 1 (upvote) ou -1 (downvote)' },
        { status: 400 }
      );
    }

    // Verificar se pelo menos um dos campos está preenchido
    if (!questionId && !answerId && !commentId) {
      return NextResponse.json(
        { error: 'Deve especificar questionId, answerId ou commentId' },
        { status: 400 }
      );
    }

    // Verificar se o usuário não está votando em seu próprio conteúdo
    let authorId: string | null = null;
    
    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { authorId: true }
      });
      if (question) authorId = question.authorId;
    } else if (answerId) {
      const answer = await prisma.answer.findUnique({
        where: { id: answerId },
        select: { authorId: true }
      });
      if (answer) authorId = answer.authorId;
    } else if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true }
      });
      if (comment) authorId = comment.authorId;
    }

    if (authorId === session.user.id) {
      return NextResponse.json(
        { error: 'Não é possível votar em seu próprio conteúdo' },
        { status: 400 }
      );
    }

    // Verificar se já existe um voto do usuário
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        questionId: questionId || null,
        answerId: answerId || null,
        commentId: commentId || null,
      }
    });

    let vote;
    
    if (existingVote) {
      // Se o voto for o mesmo, remover o voto (toggle)
      if (existingVote.value === value) {
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });
        
        // Atualizar reputação do autor
        if (authorId) {
          const reputationChange = value === 1 ? -1 : 1;
          await prisma.user.update({
            where: { id: authorId },
            data: { reputation: { increment: reputationChange } }
          });
        }
        
        return NextResponse.json({ 
          message: 'Voto removido',
          action: 'removed',
          value: 0
        });
      } else {
        // Se o voto for diferente, atualizar o voto
        vote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value }
        });
        
        // Atualizar reputação do autor (remover voto anterior e adicionar novo)
        if (authorId) {
          const reputationChange = (value * 2); // Remove o voto anterior (-value) e adiciona o novo (+value)
          await prisma.user.update({
            where: { id: authorId },
            data: { reputation: { increment: reputationChange } }
          });
        }
      }
    } else {
      // Criar novo voto
      vote = await prisma.vote.create({
        data: {
          value,
          userId: session.user.id,
          questionId: questionId || null,
          answerId: answerId || null,
          commentId: commentId || null,
        }
      });
      
      // Atualizar reputação do autor
      if (authorId) {
        const reputationChange = value;
        await prisma.user.update({
          where: { id: authorId },
          data: { reputation: { increment: reputationChange } }
        });
      }
    }

    return NextResponse.json({ 
      message: 'Voto registrado com sucesso',
      action: existingVote ? 'updated' : 'created',
      value: vote.value
    });

  } catch (error) {
    console.error('Erro ao registrar voto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
