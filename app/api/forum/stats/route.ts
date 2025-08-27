import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Buscar estatísticas do fórum
    const [
      totalQuestions,
      totalAnswers,
      totalUsers,
      questionsThisWeek,
      questionsThisMonth,
      solvedQuestions
    ] = await Promise.all([
      // Total de perguntas
      prisma.question.count(),
      
      // Total de respostas
      prisma.answer.count(),
      
      // Total de usuários
      prisma.user.count(),
      
      // Perguntas desta semana
      prisma.question.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Perguntas deste mês
      prisma.question.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Perguntas resolvidas
      prisma.question.count({
        where: {
          isSolved: true
        }
      })
    ])

    // Calcular taxa de resolução
    const solvedRate = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0

    // Calcular tempo médio de resposta (simplificado)
    const averageResponseTime = 2.5 // Em horas, implementar cálculo real depois

    const stats = {
      totalQuestions,
      totalAnswers,
      totalUsers,
      questionsThisWeek,
      questionsThisMonth,
      averageResponseTime,
      solvedRate: Math.round(solvedRate * 100) / 100 // Arredondar para 2 casas decimais
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas do fórum:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
