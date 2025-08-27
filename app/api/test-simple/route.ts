import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 TEST SIMPLE - Credenciais recebidas:', { email, passwordLength: password?.length });

    // Validação básica
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Buscar usuário
    console.log('🔍 Buscando usuário com email:', email);
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    console.log('👤 Usuário encontrado:', user ? 'SIM' : 'NÃO');

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Verificar senha
    console.log('🔑 Comparando senhas...');
    console.log('🔑 Senha de entrada:', password);
    console.log('🔑 Hash armazenado:', user.password);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Senha válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Senha inválida');
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Sucesso
    console.log('✅ Login bem-sucedido!');
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('💥 Erro no teste simples:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
