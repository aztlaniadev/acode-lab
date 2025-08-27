import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed da rede social...')

  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...')
  await prisma.socialMention.deleteMany()
  await prisma.socialShare.deleteMany()
  await prisma.socialLike.deleteMany()
  await prisma.socialComment.deleteMany()
  await prisma.socialPost.deleteMany()
  await prisma.connection.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuários
  console.log('👥 Criando usuários...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@acodelab.com',
        username: 'admin',
        name: 'Administrador',
        password: await bcrypt.hash('admin123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        reputation: 1000,
        level: 'MASTER',
        isVerified: true,
        bio: 'Administrador da plataforma Acode Lab'
      }
    }),
    prisma.user.create({
      data: {
        email: 'joao@acodelab.com',
        username: 'joao_dev',
        name: 'João Silva',
        password: await bcrypt.hash('joao123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
        reputation: 850,
        level: 'EXPERT',
        isVerified: true,
        bio: 'Desenvolvedor Full Stack apaixonado por React e Node.js'
      }
    }),
    prisma.user.create({
      data: {
        email: 'maria@acodelab.com',
        username: 'maria_ux',
        name: 'Maria Santos',
        password: await bcrypt.hash('maria123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
        reputation: 720,
        level: 'ADVANCED',
        isVerified: true,
        bio: 'UX/UI Designer especializada em interfaces intuitivas'
      }
    }),
    prisma.user.create({
      data: {
        email: 'pedro@acodelab.com',
        username: 'pedro_mobile',
        name: 'Pedro Costa',
        password: await bcrypt.hash('pedro123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
        reputation: 650,
        level: 'INTERMEDIATE',
        isVerified: false,
        bio: 'Desenvolvedor Mobile focado em React Native'
      }
    }),
    prisma.user.create({
      data: {
        email: 'ana@acodelab.com',
        username: 'ana_backend',
        name: 'Ana Oliveira',
        password: await bcrypt.hash('ana123', 10),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
        reputation: 580,
        level: 'INTERMEDIATE',
        isVerified: false,
        bio: 'Desenvolvedora Backend com experiência em Python e Django'
      }
    })
  ])

  // Criar perfis de usuário
  console.log('👤 Criando perfis de usuário...')
  const profiles = await Promise.all([
    prisma.userProfile.create({
      data: {
        userId: users[1].id, // João
        displayName: 'João Silva',
        bio: 'Desenvolvedor Full Stack com 5+ anos de experiência. Especialista em React, Node.js e TypeScript. Apaixonado por código limpo e arquitetura escalável.',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
        experience: '5+ anos desenvolvendo aplicações web e mobile',
        education: 'Bacharel em Ciência da Computação - UFMG',
        company: 'TechCorp',
        jobTitle: 'Senior Full Stack Developer',
        location: 'Belo Horizonte, MG',
        timezone: 'America/Sao_Paulo',
        isAvailable: true,
        hourlyRate: 150.00,
        portfolio: [
          'https://github.com/joaosilva',
          'https://joaosilva.dev',
          'https://linkedin.com/in/joaosilva'
        ],
        socialLinks: {
          github: 'https://github.com/joaosilva',
          linkedin: 'https://linkedin.com/in/joaosilva',
          twitter: 'https://twitter.com/joaosilva'
        }
      }
    }),
    prisma.userProfile.create({
      data: {
        userId: users[2].id, // Maria
        displayName: 'Maria Santos',
        bio: 'UX/UI Designer com foco em experiências digitais memoráveis. Especialista em Design Systems e pesquisa com usuários.',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
        experience: '4+ anos criando interfaces intuitivas e acessíveis',
        education: 'Design Gráfico - PUC Minas',
        company: 'DesignStudio',
        jobTitle: 'Senior UX/UI Designer',
        location: 'São Paulo, SP',
        timezone: 'America/Sao_Paulo',
        isAvailable: true,
        hourlyRate: 120.00,
        portfolio: [
          'https://behance.net/mariasantos',
          'https://mariasantos.design',
          'https://dribbble.com/mariasantos'
        ],
        socialLinks: {
          behance: 'https://behance.net/mariasantos',
          dribbble: 'https://dribbble.com/mariasantos',
          linkedin: 'https://linkedin.com/in/mariasantos'
        }
      }
    }),
    prisma.userProfile.create({
      data: {
        userId: users[3].id, // Pedro
        displayName: 'Pedro Costa',
        bio: 'Desenvolvedor Mobile apaixonado por criar apps nativos e híbridos. Especialista em React Native e desenvolvimento iOS/Android.',
        skills: ['React Native', 'iOS', 'Android', 'JavaScript', 'TypeScript', 'Firebase'],
        experience: '3+ anos desenvolvendo aplicações mobile',
        education: 'Técnico em Informática - SENAI',
        company: 'MobileDev',
        jobTitle: 'Mobile Developer',
        location: 'Rio de Janeiro, RJ',
        timezone: 'America/Sao_Paulo',
        isAvailable: true,
        hourlyRate: 100.00,
        portfolio: [
          'https://github.com/pedrocosta',
          'https://pedrocosta.dev',
          'https://apps.apple.com/developer/pedrocosta'
        ],
        socialLinks: {
          github: 'https://github.com/pedrocosta',
          linkedin: 'https://linkedin.com/in/pedrocosta'
        }
      }
    }),
    prisma.userProfile.create({
      data: {
        userId: users[4].id, // Ana
        displayName: 'Ana Oliveira',
        bio: 'Desenvolvedora Backend focada em APIs robustas e escaláveis. Experiência com Python, Django e microsserviços.',
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
        experience: '2+ anos desenvolvendo APIs e sistemas backend',
        education: 'Sistemas de Informação - UFSJ',
        company: 'BackendTech',
        jobTitle: 'Backend Developer',
        location: 'Juiz de Fora, MG',
        timezone: 'America/Sao_Paulo',
        isAvailable: false,
        hourlyRate: 90.00,
        portfolio: [
          'https://github.com/anaoliveira',
          'https://anaoliveira.dev'
        ],
        socialLinks: {
          github: 'https://github.com/anaoliveira',
          linkedin: 'https://linkedin.com/in/anaoliveira'
        }
      }
    })
  ])

  // Criar conexões entre usuários
  console.log('🔗 Criando conexões...')
  const connections = await Promise.all([
    // João e Maria são conectados
    prisma.connection.create({
      data: {
        requesterId: users[1].id,
        recipientId: users[2].id,
        status: 'ACCEPTED',
        message: 'Olá! Gostaria de conectar para futuras colaborações em projetos.'
      }
    }),
    // João e Pedro são conectados
    prisma.connection.create({
      data: {
        requesterId: users[1].id,
        recipientId: users[3].id,
        status: 'ACCEPTED',
        message: 'Oi Pedro! Vi seu trabalho com React Native e gostaria de conectar.'
      }
    }),
    // Maria enviou solicitação para Ana
    prisma.connection.create({
      data: {
        requesterId: users[2].id,
        recipientId: users[4].id,
        status: 'PENDING',
        message: 'Olá Ana! Adorei seu trabalho com Django. Gostaria de conectar!'
      }
    })
  ])

  // Criar posts sociais
  console.log('📝 Criando posts sociais...')
  const posts = await Promise.all([
    prisma.socialPost.create({
      data: {
        authorId: users[1].id,
        content: `🚀 Acabei de finalizar um projeto incrível usando React + TypeScript + Node.js!

Principais tecnologias utilizadas:
• Frontend: React 18, TypeScript, Tailwind CSS
• Backend: Node.js, Express, Prisma ORM
• Banco: PostgreSQL
• Deploy: Vercel + Railway

O projeto é uma plataforma de gestão de tarefas com funcionalidades avançadas como:
✅ Autenticação JWT
✅ Upload de arquivos
✅ Notificações em tempo real
✅ Dashboard responsivo
✅ API RESTful completa

Fiquei muito satisfeito com o resultado! Alguma dúvida sobre as tecnologias utilizadas? 🤔

#React #TypeScript #NodeJS #FullStack #WebDevelopment`,
        type: 'PROJECT',
        tags: ['react', 'typescript', 'nodejs', 'fullstack', 'webdev'],
        visibility: 'PUBLIC'
      }
    }),
    prisma.socialPost.create({
      data: {
        authorId: users[2].id,
        content: `🎨 Compartilhando algumas dicas de UX que aprendi trabalhando com Design Systems:

💡 **Consistência é fundamental**
- Use componentes reutilizáveis
- Mantenha padrões de espaçamento
- Defina uma hierarquia visual clara

💡 **Acessibilidade não é opcional**
- Contraste adequado (mínimo 4.5:1)
- Navegação por teclado
- Textos alternativos para imagens

💡 **Teste com usuários reais**
- Protótipos são ótimos para validação
- Feedback direto é insubstituível
- Iteração contínua melhora o resultado

Qual dica você gostaria que eu detalhasse mais? 🤔

#UXDesign #DesignSystems #Accessibility #UserExperience`,
        type: 'TIP',
        tags: ['ux', 'design', 'accessibility', 'designsystems'],
        visibility: 'PUBLIC'
      }
    }),
    prisma.socialPost.create({
      data: {
        authorId: users[3].id,
        content: `📱 Dica rápida para desenvolvedores React Native:

Estou trabalhando em um projeto React Native e precisando de dicas de debugging! 🚀

Alguém tem sugestões de ferramentas ou técnicas que funcionaram bem para vocês? 🤔

#ReactNative #MobileDevelopment #Debugging #Tips`,
        type: 'TIP',
        tags: ['reactnative', 'mobile', 'debugging', 'tips'],
        visibility: 'PUBLIC'
      }
    }),
    prisma.socialPost.create({
      data: {
        authorId: users[1].id,
        content: `🤔 Pergunta para a comunidade:

Estou pensando em migrar um projeto de JavaScript para TypeScript. O projeto tem cerca de 50 arquivos e é usado em produção.

Alguém já fez essa migração? Quais foram os principais desafios? 

Estou especialmente interessado em:
• Estratégias de migração gradual
• Ferramentas para automatizar o processo
• Como lidar com bibliotecas que não têm tipos
• Tempo estimado para um projeto desse tamanho

Obrigado pelas dicas! 🙏

#TypeScript #Migration #JavaScript #WebDevelopment`,
        type: 'QUESTION',
        tags: ['typescript', 'migration', 'javascript', 'webdev'],
        visibility: 'PUBLIC'
      }
    }),
    prisma.socialPost.create({
      data: {
        authorId: users[2].id,
        content: `🎉 Conquista desbloqueada: "Designer Verificado" ✅

Após 6 meses de trabalho consistente e feedback positivo da comunidade, finalmente consegui a verificação!

Isso significa muito para mim, pois representa:
• Reconhecimento da qualidade do meu trabalho
• Confiança da comunidade
• Oportunidades de projetos maiores
• Networking com outros profissionais

Obrigada a todos que apoiaram e colaboraram! 🙏

Para quem está começando: persistência e qualidade sempre valem a pena! 💪

#Achievement #DesignerVerified #Community #Success`,
        type: 'ACHIEVEMENT',
        tags: ['achievement', 'verified', 'design', 'success'],
        visibility: 'PUBLIC'
      }
    })
  ])

  // Criar comentários nos posts
  console.log('💬 Criando comentários...')
  const comments = await Promise.all([
    prisma.socialComment.create({
      data: {
        postId: posts[0].id,
        authorId: users[2].id,
        content: 'Parabéns pelo projeto! A interface ficou muito limpa e intuitiva. 🎨'
      }
    }),
    prisma.socialComment.create({
      data: {
        postId: posts[0].id,
        authorId: users[3].id,
        content: 'Muito bom! Como você fez para implementar as notificações em tempo real? 🤔'
      }
    }),
    prisma.socialComment.create({
      data: {
        postId: posts[0].id,
        authorId: users[1].id,
        content: 'Obrigado! Usei Socket.io para as notificações. Se quiser, posso detalhar a implementação! 😊'
      }
    }),
    prisma.socialComment.create({
      data: {
        postId: posts[1].id,
        authorId: users[1].id,
        content: 'Excelentes dicas! A parte de acessibilidade é realmente crucial. 👏'
      }
    }),
    prisma.socialComment.create({
      data: {
        postId: posts[2].id,
        authorId: users[1].id,
        content: 'Essa dica salvou minha vida hoje! Obrigado por compartilhar! 🙏'
      }
    })
  ])

  // Criar likes nos posts e comentários
  console.log('❤️ Criando likes...')
  const likes = await Promise.all([
    // Likes no primeiro post
    prisma.socialLike.create({
      data: {
        userId: users[2].id,
        postId: posts[0].id
      }
    }),
    prisma.socialLike.create({
      data: {
        userId: users[3].id,
        postId: posts[0].id
      }
    }),
    prisma.socialLike.create({
      data: {
        userId: users[4].id,
        postId: posts[0].id
      }
    }),
    // Likes no segundo post
    prisma.socialLike.create({
      data: {
        userId: users[1].id,
        postId: posts[1].id
      }
    }),
    prisma.socialLike.create({
      data: {
        userId: users[3].id,
        postId: posts[1].id
      }
    }),
    // Likes no terceiro post
    prisma.socialLike.create({
      data: {
        userId: users[1].id,
        postId: posts[2].id
      }
    }),
    prisma.socialLike.create({
      data: {
        userId: users[2].id,
        postId: posts[2].id
      }
    }),
    // Likes em comentários
    prisma.socialLike.create({
      data: {
        userId: users[1].id,
        commentId: comments[0].id
      }
    }),
    prisma.socialLike.create({
      data: {
        userId: users[3].id,
        commentId: comments[0].id
      }
    })
  ])

  // Atualizar contadores dos posts
  console.log('📊 Atualizando contadores...')
  await Promise.all([
    prisma.socialPost.update({
      where: { id: posts[0].id },
      data: {
        likeCount: 3,
        commentCount: 3
      }
    }),
    prisma.socialPost.update({
      where: { id: posts[1].id },
      data: {
        likeCount: 2,
        commentCount: 1
      }
    }),
    prisma.socialPost.update({
      where: { id: posts[2].id },
      data: {
        likeCount: 2,
        commentCount: 1
      }
    }),
    prisma.socialPost.update({
      where: { id: posts[3].id },
      data: {
        likeCount: 0,
        commentCount: 0
      }
    }),
    prisma.socialPost.update({
      where: { id: posts[4].id },
      data: {
        likeCount: 0,
        commentCount: 0
      }
    })
  ])

  console.log('✅ Seed da rede social concluído com sucesso!')
  console.log(`📊 Dados criados:`)
  console.log(`   👥 Usuários: ${users.length}`)
  console.log(`   👤 Perfis: ${profiles.length}`)
  console.log(`   🔗 Conexões: ${connections.length}`)
  console.log(`   📝 Posts: ${posts.length}`)
  console.log(`   💬 Comentários: ${comments.length}`)
  console.log(`   ❤️ Likes: ${likes.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
