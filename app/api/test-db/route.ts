import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    
    // Buscar usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        password: true,
        isBanned: true,
        lockedUntil: true,
        loginAttempts: true
      }
    });

    // Testar busca específica por email
    const testEmail = 'admin@acodelab.com';
    const testUser = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        userCount: users.length,
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          username: u.username,
          name: u.name,
          passwordLength: u.password?.length || 0,
          isBanned: u.isBanned,
          lockedUntil: u.lockedUntil,
          loginAttempts: u.loginAttempts
        })),
        testUser: testUser ? {
          id: testUser.id,
          email: testUser.email,
          username: testUser.username,
          name: testUser.name,
          passwordLength: testUser.password?.length || 0,
          isBanned: testUser.isBanned,
          lockedUntil: testUser.lockedUntil,
          loginAttempts: testUser.loginAttempts
        } : null
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
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
