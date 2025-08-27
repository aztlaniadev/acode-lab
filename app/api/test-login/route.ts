import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 TEST LOGIN - Credenciais recebidas:', {
      email,
      passwordLength: password?.length,
      hasEmail: !!email,
      hasPassword: !!password
    });

    // Validação rigorosa de entrada
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validação de tamanho da senha
    if (password.length < 6) {
      console.log('❌ Password too short:', password.length);
      return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    console.log('🔍 Searching for user with email:', email);
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    console.log('👤 User found:', user ? 'YES' : 'NO');

    if (!user) {
      // Simular delay para prevenir timing attacks
      await bcrypt.compare("dummy_password", "$2a$12$dummy.hash.for.timing");
      console.log('❌ User not found:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    console.log('🔒 Checking if user is banned...');
    // Verificar se usuário está banido
    if (user.isBanned) {
      console.log('❌ User is banned:', email);
      return NextResponse.json({ error: 'User is banned' }, { status: 401 });
    }

    console.log('🔒 Checking if user is locked...');
    // Verificar se usuário está bloqueado temporariamente
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      console.log('❌ User is locked until:', user.lockedUntil);
      return NextResponse.json({ error: 'User is locked' }, { status: 401 });
    }

    console.log('🔑 Comparing passwords...');
    console.log('🔑 Input password length:', password.length);
    console.log('🔑 Stored password hash length:', user.password?.length || 0);
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      // Incrementar tentativas de login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: user.loginAttempts + 1,
          lastLoginAttempt: new Date(),
          lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null
        }
      });

      console.log('❌ Invalid password for:', email);
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Resetar tentativas de login em caso de sucesso
    if (user.loginAttempts > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: 0,
          lastLoginAttempt: new Date(),
          lockedUntil: null
        }
      });
    }

    // Login bem-sucedido
    console.log('✅ Login successful for:', email);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        reputation: user.reputation,
        level: user.level
      }
    });

  } catch (error) {
    console.error('💥 Error in test login:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
