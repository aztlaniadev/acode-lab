import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const envCheck = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
    };

    // Verificar se o banco está funcionando
    let dbCheck = false;
    try {
      const { prisma } = await import('@/lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
      dbCheck = true;
    } catch (error) {
      console.error('Database check failed:', error);
    }

    // Verificar se há usuários no banco
    let userCount = 0;
    try {
      const { prisma } = await import('@/lib/prisma');
      userCount = await prisma.user.count();
    } catch (error) {
      console.error('User count failed:', error);
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        connected: dbCheck,
        userCount
      },
      message: 'Auth system status check'
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
