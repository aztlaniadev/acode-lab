import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/forum/questions - Listar perguntas com filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tags = searchParams.get('tags') || '';
    const status = searchParams.get('status') || '';
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {
      status: 'OPEN',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = {
        some: {
          tag: {
            slug: { in: tagArray }
          }
        }
      };
    }

    if (status && status !== 'all') {
      // Mapear status do frontend para valores do banco
      const statusMap: Record<string, string> = {
        'unanswered': 'OPEN',
        'answered': 'ANSWERED', 
        'solved': 'SOLVED'
      };
      
      where.status = statusMap[status] || 'OPEN';
    }

    // Construir ordenação
    const orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'most_voted':
        orderBy.votes = { _count: 'desc' };
        break;
      case 'most_viewed':
        orderBy.viewCount = 'desc';
        break;
      case 'most_answered':
        orderBy.answers = { _count: 'desc' };
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    // Buscar perguntas
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
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
          _count: {
            select: {
              answers: true,
              comments: true,
              votes: true,
            }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.question.count({ where })
    ]);

    // Buscar votos do usuário atual (se autenticado) e calcular estatísticas
    let questionsWithVotes = questions;
    
    if (session?.user?.id) {
      // Buscar todos os votos do usuário para as perguntas retornadas
      const userVotes = await prisma.vote.findMany({
        where: {
          userId: session.user.id,
          questionId: { in: questions.map(q => q.id) }
        },
        select: {
          questionId: true,
          value: true
        }
      });

      // Criar mapa de votos do usuário
      const userVoteMap = new Map(
        userVotes.map(vote => [vote.questionId, vote.value])
      );

      // Calcular estatísticas dos votos e adicionar userVote
      questionsWithVotes = await Promise.all(
        questions.map(async (question: any) => {
          const votes = await prisma.vote.findMany({
            where: { questionId: question.id }
          });

          const upvotes = votes.filter((v: any) => v.value === 1).length;
          const downvotes = votes.filter((v: any) => v.value === -1).length;
          const score = upvotes - downvotes;
          const userVote = userVoteMap.get(question.id) || 0;

          return {
            ...question,
            score,
            upvotesCount: upvotes,
            downvotesCount: downvotes,
            userVote,
          };
        })
      );
    } else {
      // Para usuários não autenticados, apenas calcular estatísticas
      questionsWithVotes = await Promise.all(
        questions.map(async (question: any) => {
          const votes = await prisma.vote.findMany({
            where: { questionId: question.id }
          });

          const upvotes = votes.filter((v: any) => v.value === 1).length;
          const downvotes = votes.filter((v: any) => v.value === -1).length;
          const score = upvotes - downvotes;

          return {
            ...question,
            score,
            upvotesCount: upvotes,
            downvotesCount: downvotes,
            userVote: 0,
          };
        })
      );
    }

    return NextResponse.json({
      questions: questionsWithVotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/forum/questions - Criar nova pergunta
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
    const { title, content, categoryId, tags } = body;

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

    // Criar slug único
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.question.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Criar pergunta
    const question = await prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: session.user.id,
        categoryId,
        tags: tags && tags.length > 0 ? {
          create: tags.map((tagId: string) => ({
            tagId
          }))
        } : undefined,
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

    // Atualizar contador de uso das tags
    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map((tagId: string) =>
          prisma.tag.update({
            where: { id: tagId },
            data: { usageCount: { increment: 1 } }
          })
        )
      );
    }

    return NextResponse.json(question, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
