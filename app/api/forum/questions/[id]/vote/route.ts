import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/forum/questions/[id]/vote - Votar em uma pergunta
export async function POST(
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
    const { value } = body;

    // Validação
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Valor de voto inválido. Use 1 para upvote ou -1 para downvote.' },
        { status: 400 }
      );
    }

    // Verificar se a pergunta existe
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        votes: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o usuário não está votando na própria pergunta
    if (question.authorId === session.user.id) {
      return NextResponse.json(
        { error: 'Você não pode votar na sua própria pergunta' },
        { status: 400 }
      );
    }

    const existingVote = question.votes[0];

    if (existingVote) {
      if (existingVote.value === value) {
        // Remover voto se clicar no mesmo botão
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });

        return NextResponse.json({
          message: 'Voto removido',
          newVote: null,
          score: await getQuestionScore(id)
        });
      } else {
        // Mudar voto
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value }
        });

        return NextResponse.json({
          message: 'Voto atualizado',
          newVote: value,
          score: await getQuestionScore(id)
        });
      }
    } else {
      // Criar novo voto
      await prisma.vote.create({
        data: {
          value,
          userId: session.user.id,
          questionId: id
        }
      });

      return NextResponse.json({
        message: 'Voto registrado',
        newVote: value,
        score: await getQuestionScore(id)
      });
    }

  } catch (error) {
    console.error('Erro ao votar na pergunta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para calcular o score da pergunta
async function getQuestionScore(questionId: string): Promise<number> {
  const votes = await prisma.vote.findMany({
    where: { questionId },
    select: { value: true }
  });

  return votes.reduce((score, vote) => score + vote.value, 0);
}
