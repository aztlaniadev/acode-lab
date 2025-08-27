import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar categorias
  console.log('📂 Criando categorias...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'programacao' },
      update: {},
      create: {
        name: 'Programação',
        slug: 'programacao',
        description: 'Questões sobre desenvolvimento de software, algoritmos e linguagens de programação',
        icon: '💻',
        color: '#3B82F6',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Desenvolvimento Web',
        slug: 'web-development',
        description: 'Frontend, backend, frameworks e tecnologias web',
        icon: '🌐',
        color: '#10B981',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: {
        name: 'Desenvolvimento Mobile',
        slug: 'mobile-development',
        description: 'Desenvolvimento para iOS, Android e aplicações móveis',
        icon: '📱',
        color: '#F59E0B',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'database' },
      update: {},
      create: {
        name: 'Banco de Dados',
        slug: 'database',
        description: 'SQL, NoSQL, modelagem e administração de bancos',
        icon: '🗄️',
        color: '#8B5CF6',
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'devops' },
      update: {},
      create: {
        name: 'DevOps',
        slug: 'devops',
        description: 'CI/CD, containers, cloud e infraestrutura',
        icon: '🚀',
        color: '#EF4444',
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'ai-ml' },
      update: {},
      create: {
        name: 'IA e Machine Learning',
        slug: 'ai-ml',
        description: 'Inteligência artificial, aprendizado de máquina e análise de dados',
        icon: '🤖',
        color: '#EC4899',
        order: 6,
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  // Criar tags
  console.log('🏷️ Criando tags...');
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Linguagem de programação JavaScript e ECMAScript',
        color: '#F7DF1E',
        isPopular: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'python' },
      update: {},
      create: {
        name: 'Python',
        slug: 'python',
        description: 'Linguagem de programação Python',
        color: '#3776AB',
        isPopular: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        description: 'Biblioteca JavaScript para interfaces de usuário',
        color: '#61DAFB',
        isPopular: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: {
        name: 'Node.js',
        slug: 'nodejs',
        description: 'Runtime JavaScript para servidor',
        color: '#339933',
        isPopular: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        description: 'Superset tipado de JavaScript',
        color: '#3178C6',
        isPopular: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        description: 'Framework React para produção',
        color: '#000000',
        isNew: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'postgresql' },
      update: {},
      create: {
        name: 'PostgreSQL',
        slug: 'postgresql',
        description: 'Sistema de banco de dados relacional',
        color: '#336791',
        isPopular: true,
        usageCount: 0,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'docker' },
      update: {},
      create: {
        name: 'Docker',
        slug: 'docker',
        description: 'Plataforma de containerização',
        color: '#2496ED',
        isPopular: true,
        usageCount: 0,
      },
    }),
  ]);

  console.log(`✅ ${tags.length} tags criadas`);

  // Criar badges
  console.log('🏆 Criando badges...');
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { name: 'Primeira Pergunta' },
      update: {},
      create: {
        name: 'Primeira Pergunta',
        description: 'Fez sua primeira pergunta no fórum',
        icon: '🎯',
        color: '#3B82F6',
        criteria: 'Fazer pelo menos uma pergunta',
      },
    }),
    prisma.badge.upsert({
      where: { name: 'Primeira Resposta' },
      update: {},
      create: {
        name: 'Primeira Resposta',
        description: 'Deu sua primeira resposta no fórum',
        icon: '💡',
        color: '#10B981',
        criteria: 'Dar pelo menos uma resposta',
      },
    }),
    prisma.badge.upsert({
      where: { name: 'Resposta Aceita' },
      update: {},
      create: {
        name: 'Resposta Aceita',
        description: 'Teve uma resposta aceita como melhor resposta',
        icon: '✅',
        color: '#F59E0B',
        criteria: 'Ter uma resposta marcada como aceita',
      },
    }),
    prisma.badge.upsert({
      where: { name: 'Contribuidor Ativo' },
      update: {},
      create: {
        name: 'Contribuidor Ativo',
        description: 'Participou ativamente do fórum',
        icon: '🌟',
        color: '#8B5CF6',
        criteria: 'Fazer 10 perguntas ou respostas',
      },
    }),
    prisma.badge.upsert({
      where: { name: 'Especialista' },
      update: {},
      create: {
        name: 'Especialista',
        description: 'Alcançou alta reputação no fórum',
        icon: '👑',
        color: '#EC4899',
        criteria: 'Alcançar 1000 pontos de reputação',
      },
    }),
  ]);

  console.log(`✅ ${badges.length} badges criadas`);

  // Criar usuário admin
  console.log('👤 Criando usuário admin...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@acodelab.com' },
    update: {},
    create: {
      email: 'admin@acodelab.com',
      username: 'admin',
      name: 'Administrador',
      password: hashedPassword,
      reputation: 1000,
      level: 'MASTER',
      isVerified: true,
      bio: 'Administrador do Acode Lab',
    },
  });

  console.log(`✅ Usuário admin criado: ${adminUser.username}`);

  // Criar usuário de exemplo
  console.log('👤 Criando usuário de exemplo...');
  const examplePassword = await bcrypt.hash('user123', 12);
  
  const exampleUser = await prisma.user.upsert({
    where: { email: 'user@acodelab.com' },
    update: {},
    create: {
      email: 'user@acodelab.com',
      username: 'devuser',
      name: 'Desenvolvedor Exemplo',
      password: examplePassword,
      reputation: 150,
      level: 'INTERMEDIATE',
      bio: 'Desenvolvedor apaixonado por tecnologia',
      location: 'São Paulo, Brasil',
      website: 'https://exemplo.com',
      github: 'devuser',
    },
  });

  console.log(`✅ Usuário de exemplo criado: ${exampleUser.username}`);

  // Criar algumas perguntas de exemplo
  console.log('❓ Criando perguntas de exemplo...');
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Como implementar autenticação JWT no Next.js?',
        content: 'Estou desenvolvendo uma aplicação Next.js e preciso implementar autenticação JWT. Quais são as melhores práticas e como fazer isso de forma segura?',
        slug: 'como-implementar-autenticacao-jwt-no-nextjs',
        authorId: exampleUser.id,
        categoryId: categories[1].id, // Web Development
        tags: {
          create: [
            { tagId: tags[2].id }, // React
            { tagId: tags[4].id }, // TypeScript
            { tagId: tags[5].id }, // Next.js
          ]
        }
      }
    }),
    prisma.question.create({
      data: {
        title: 'Qual a diferença entre SQL e NoSQL?',
        content: 'Sou iniciante em banco de dados e gostaria de entender melhor as diferenças entre bancos SQL e NoSQL. Quando usar cada um?',
        slug: 'qual-a-diferenca-entre-sql-e-nosql',
        authorId: exampleUser.id,
        categoryId: categories[3].id, // Database
        tags: {
          create: [
            { tagId: tags[6].id }, // PostgreSQL
          ]
        }
      }
    }),
    prisma.question.create({
      data: {
        title: 'Como fazer deploy de uma aplicação React no Vercel?',
        content: 'Terminei de desenvolver minha aplicação React e quero fazer deploy na Vercel. Qual é o processo passo a passo?',
        slug: 'como-fazer-deploy-de-uma-aplicacao-react-no-vercel',
        authorId: adminUser.id,
        categoryId: categories[1].id, // Web Development
        tags: {
          create: [
            { tagId: tags[2].id }, // React
            { tagId: tags[5].id }, // Next.js
          ]
        }
      }
    }),
  ]);

  console.log(`✅ ${questions.length} perguntas de exemplo criadas`);

  // Criar algumas respostas de exemplo
  console.log('💬 Criando respostas de exemplo...');
  const answers = await Promise.all([
    prisma.answer.create({
      data: {
        content: 'Para implementar JWT no Next.js, recomendo usar o NextAuth.js. É uma solução robusta e segura que oferece suporte nativo para JWT. Você pode configurar providers personalizados e gerenciar tokens de forma eficiente.',
        authorId: adminUser.id,
        questionId: questions[0].id,
      }
    }),
    prisma.answer.create({
      data: {
        content: 'SQL é ideal para dados estruturados e relacionamentos complexos, enquanto NoSQL é melhor para dados não estruturados e escalabilidade horizontal. Use SQL para aplicações financeiras e NoSQL para redes sociais.',
        authorId: adminUser.id,
        questionId: questions[1].id,
      }
    }),
  ]);

  console.log(`✅ ${answers.length} respostas de exemplo criadas`);

  // Atualizar contadores de uso das tags
  console.log('📊 Atualizando contadores de uso das tags...');
  await Promise.all([
    prisma.tag.update({
      where: { id: tags[2].id }, // React
      data: { usageCount: 2 }
    }),
    prisma.tag.update({
      where: { id: tags[4].id }, // TypeScript
      data: { usageCount: 1 }
    }),
    prisma.tag.update({
      where: { id: tags[5].id }, // Next.js
      data: { usageCount: 2 }
    }),
    prisma.tag.update({
      where: { id: tags[6].id }, // PostgreSQL
      data: { usageCount: 1 }
    }),
  ]);

  console.log('✅ Contadores de uso das tags atualizados');

  console.log('🎉 Seed do banco de dados concluído com sucesso!');
  console.log('\n📋 Resumo:');
  console.log(`- ${categories.length} categorias criadas`);
  console.log(`- ${tags.length} tags criadas`);
  console.log(`- ${badges.length} badges criadas`);
  console.log(`- ${questions.length} perguntas de exemplo criadas`);
  console.log(`- ${answers.length} respostas de exemplo criadas`);
  console.log('\n🔑 Credenciais de acesso:');
  console.log('Admin: admin@acodelab.com / admin123');
  console.log('User: user@acodelab.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
