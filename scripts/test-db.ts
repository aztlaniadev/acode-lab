import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testando conexão com o banco de dados...');
    
    // Testar conexão básica
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    const userCount = await prisma.user.count();
    console.log(`📊 Usuários no banco: ${userCount}`);
    
    const questionCount = await prisma.question.count();
    console.log(`📝 Perguntas no banco: ${questionCount}`);
    
    const categoryCount = await prisma.category.count();
    console.log(`🏷️ Categorias no banco: ${categoryCount}`);
    
    console.log('🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P1001') {
      console.log('\n💡 Dica: Verifique se:');
      console.log('   1. PostgreSQL está rodando');
      console.log('   2. Arquivo .env.local está configurado');
      console.log('   3. Banco "acode_lab" foi criado');
      console.log('   4. Usuário e senha estão corretos');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
