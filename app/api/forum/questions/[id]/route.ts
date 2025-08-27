import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/forum/questions/[id] - Buscar pergunta específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Incrementar contador de visualizações
    await prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    // Buscar pergunta com todos os relacionamentos
    const question = await prisma.question.findUnique({
      where: { id },
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                isPopular: true,
                isNew: true,
              }
            }
          }
        },
        answers: {
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
            comments: {
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
                votes: true,
                _count: {
                  select: {
                    votes: true,
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            },
            votes: true,
            _count: {
              select: {
                votes: true,
                comments: true,
              }
            }
          },
          orderBy: [
            { isBest: 'desc' },
            { isAccepted: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        comments: {
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
            votes: true,
            _count: {
              select: {
                votes: true,
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        votes: true,
        _count: {
          select: {
            answers: true,
            comments: true,
            votes: true,
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      );
    }

    // Calcular estatísticas dos votos
    const questionVotes = question.votes;
    const upvotes = questionVotes.filter((v: any) => v.value === 1).length;
    const downvotes = questionVotes.filter((v: any) => v.value === -1).length;
    const score = upvotes - downvotes;

    // Calcular estatísticas das respostas
    const answersWithVotes = question.answers.map((answer: any) => {
      const answerVotes = answer.votes;
      const answerUpvotes = answerVotes.filter((v: any) => v.value === 1).length;
      const answerDownvotes = answerVotes.filter((v: any) => v.value === -1).length;
      const answerScore = answerUpvotes - answerDownvotes;

      return {
        ...answer,
        score: answerScore,
        upvotes: answerUpvotes,
        downvotes: answerDownvotes,
      };
    });

    // Calcular estatísticas dos comentários
    const commentsWithVotes = question.comments.map((comment: any) => {
      const commentVotes = comment.votes;
      const commentUpvotes = commentVotes.filter((v: any) => v.value === 1).length;
      const commentDownvotes = commentVotes.filter((v: any) => v.value === -1).length;
      const commentScore = commentUpvotes - commentDownvotes;

      return {
        ...comment,
        score: commentScore,
        upvotes: commentUpvotes,
        downvotes: commentDownvotes,
      };
    });

    const questionWithStats = {
      ...question,
      score,
      upvotes,
      downvotes,
      answers: answersWithVotes,
      comments: commentsWithVotes,
    };

    return NextResponse.json(questionWithStats);

  } catch (error) {
    console.error('Erro ao buscar pergunta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/forum/questions/[id] - Atualizar pergunta
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
    const { title, content, categoryId, tags } = body;

    // Verificar se o usuário é o autor da pergunta
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      );
    }

    if (existingQuestion.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para editar esta pergunta' },
        { status: 403 }
      );
    }

    // Validação
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Título, conteúdo e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    if (title.length < 10) {
      return NextResponse.json(
        { error: 'Título deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter pelo menos 20 caracteres' },
        { status: 400 }
      );
    }

    // Atualizar pergunta
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        tags: {
          deleteMany: {},
          create: tags && tags.length > 0 ? tags.map((tagId: string) => ({
            tagId
          })) : []
        }
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                isPopular: true,
                isNew: true,
              }
            }
          }
        },
      }
    });

    return NextResponse.json(updatedQuestion);

  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/questions/[id] - Remover pergunta
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

    // Verificar se o usuário é o autor da pergunta
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      );
    }

    if (existingQuestion.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para remover esta pergunta' },
        { status: 403 }
      );
    }

    // Remover pergunta (cascade remove respostas, comentários e votos)
    await prisma.question.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Pergunta removida com sucesso' });

  } catch (error) {
    console.error('Erro ao remover pergunta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
