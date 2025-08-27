import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Forçar renderização dinâmica para evitar problemas de build estático
export const dynamic = 'force-dynamic';

// GET /api/forum/tags - Listar tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';
    const popular = searchParams.get('popular') === 'true';
    const newTags = searchParams.get('new') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};

    if (popular) {
      where.isPopular = true;
    }

    if (newTags) {
      where.isNew = true;
    }

    if (includeStats) {
      // Buscar tags com estatísticas
      const tagsWithStats = await prisma.tag.findMany({
        where,
        include: {
          _count: {
            select: {
              questions: true
            }
          }
        },
        orderBy: [
          { usageCount: 'desc' },
          { name: 'asc' }
        ],
        take: limit
      });

      // Calcular estatísticas adicionais
      const tagsWithFullStats = await Promise.all(
        tagsWithStats.map(async (tag: any) => {
          const questions = await prisma.question.findMany({
            where: {
              tags: {
                some: {
                  tagId: tag.id
                }
              }
            },
            include: {
              _count: {
                select: {
                  answers: true,
                  votes: true,
                }
              }
            }
          });

          const totalQuestions = questions.length;
          const totalAnswers = questions.reduce((sum: number, q: any) => sum + q._count.answers, 0);
          const totalVotes = questions.reduce((sum: number, q: any) => sum + q._count.votes, 0);
          const solvedQuestions = questions.filter((q: any) => q.isSolved).length;
          const unansweredQuestions = questions.filter((q: any) => q._count.answers === 0).length;

          return {
            ...tag,
            stats: {
              totalQuestions,
              totalAnswers,
              totalVotes,
              solvedQuestions,
              unansweredQuestions,
              solutionRate: totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0
            }
          };
        })
      );

      return NextResponse.json(tagsWithFullStats);
    } else {
      // Buscar tags básicas
      const tags = await prisma.tag.findMany({
        where,
        orderBy: [
          { usageCount: 'desc' },
          { name: 'asc' }
        ],
        take: limit
      });

      return NextResponse.json(tags);
    }

  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
