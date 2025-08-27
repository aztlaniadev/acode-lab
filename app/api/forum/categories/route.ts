import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Forçar renderização dinâmica para evitar problemas de build estático
export const dynamic = 'force-dynamic';

// GET /api/forum/categories - Listar categorias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    if (includeStats) {
      // Buscar categorias com estatísticas
      const categoriesWithStats = await prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              questions: true
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      // Calcular estatísticas adicionais
      const categoriesWithFullStats = await Promise.all(
        categoriesWithStats.map(async (category: any) => {
          const questions = await prisma.question.findMany({
            where: { categoryId: category.id },
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
            ...category,
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

      return NextResponse.json(categoriesWithFullStats);
    } else {
      // Buscar categorias básicas
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });

      return NextResponse.json(categories);
    }

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
