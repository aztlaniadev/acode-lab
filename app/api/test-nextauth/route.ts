import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 TEST NEXTAUTH - Simulando authorize function');
    console.log('🔐 Credenciais recebidas:', { email, passwordLength: password?.length });

    // Simular a função authorize do NextAuth
    const credentialsProvider = authOptions.providers.find(p => p.id === 'credentials') as any;
    
    if (!credentialsProvider || !credentialsProvider.authorize) {
      console.log('❌ Credentials provider não encontrado');
      return NextResponse.json({ error: 'Credentials provider not found' }, { status: 500 });
    }

    console.log('🔐 Executando authorize function...');
    
    try {
      // Executar a função authorize
      const result = await credentialsProvider.authorize({ email, password }, request);
      
      console.log('🔐 Resultado da função authorize:', result);
      
      if (result) {
        return NextResponse.json({
          success: true,
          user: result,
          message: 'Login successful via NextAuth simulation'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Authentication failed',
          message: 'User not found or invalid credentials'
        }, { status: 401 });
      }
      
    } catch (authError) {
      console.error('💥 Erro na função authorize:', authError);
      return NextResponse.json({
        success: false,
        error: 'Authentication error',
        details: authError instanceof Error ? authError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Error in NextAuth test:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
