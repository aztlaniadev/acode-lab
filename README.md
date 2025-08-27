# Acode Lab - Plataforma de Desenvolvimento Colaborativo

## 🚀 Sobre o Projeto

Acode Lab é uma plataforma completa para desenvolvedores que combina as funcionalidades de:
- **Fórum Q&A**: Sistema de perguntas e respostas com votação e reputação
- **Rede Social**: Conecte-se com outros desenvolvedores e compartilhe conhecimento
- **Marketplace Freelancer**: Encontre projetos ou ofereça seus serviços

## ✨ Funcionalidades Principais

### 🗣️ Fórum Q&A
- Sistema de votação e reputação
- Marcação de respostas aceitas
- Categorização por tecnologias
- Busca avançada e filtros
- Sistema de badges e gamificação

### 👥 Rede Social
- Perfis profissionais detalhados
- Feed de atividades personalizado
- Grupos e comunidades
- Sistema de conexões e networking
- Compartilhamento de projetos e código

### 💼 Marketplace Freelancer
- Projetos verificados e seguros
- Sistema de pagamento protegido
- Avaliações e portfólio
- Matching inteligente baseado em skills
- Sistema de propostas e negociações

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Class Variance Authority
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Next.js App Router
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Security**: bcryptjs para hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/acode-lab.git
cd acode-lab
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### 4. Configure o banco de dados
Veja [README-DATABASE.md](./README-DATABASE.md) para instruções detalhadas.

### 5. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### 6. Abra o navegador
Acesse [http://localhost:3001](http://localhost:3001) para visualizar o projeto.

## 📁 Estrutura do Projeto

```
acode-lab/
├── app/                    # App Router do Next.js
│   ├── api/               # APIs do backend
│   │   ├── auth/          # Autenticação
│   │   └── forum/         # APIs do fórum
│   ├── forum/             # Páginas do fórum
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/             # Componentes React
│   ├── ui/                # Componentes base (Button, Card, etc.)
│   ├── navigation/        # Componentes de navegação
│   ├── sections/          # Seções da página inicial
│   └── forum/             # Componentes do fórum
├── lib/                   # Utilitários e configurações
│   ├── auth.ts            # Configuração NextAuth.js
│   ├── prisma.ts          # Cliente Prisma
│   └── utils.ts           # Funções utilitárias
├── prisma/                # Schema e migrações do banco
│   └── schema.prisma      # Schema do banco de dados
├── scripts/               # Scripts utilitários
│   └── seed.ts            # Script para popular banco
├── types/                 # Tipos TypeScript
│   └── forum.ts           # Tipos do fórum
├── public/                # Arquivos estáticos
├── package.json           # Dependências do projeto
├── tailwind.config.js     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
├── README.md              # Este arquivo
└── README-DATABASE.md     # Configuração do banco de dados
```

## 🎨 Componentes Principais

### Header
- Navegação responsiva
- Menu mobile com animações
- Sistema de busca integrado
- Notificações e perfil do usuário

### HeroSection
- Apresentação da plataforma
- Call-to-actions principais
- Estatísticas da comunidade
- Recursos em destaque

### FeaturesSection
- Funcionalidades principais
- Cards interativos
- Estatísticas de qualidade
- CTA para cadastro

### FreelancerSection
- Projetos em destaque
- Sistema de filtros
- Busca por categoria
- Informações dos clientes

## 🗄️ Funcionalidades do Banco de Dados

### Sistema de Fórum Completo
- **Perguntas**: Criação, edição, exclusão e busca avançada
- **Respostas**: Sistema de respostas com aceitação de melhor resposta
- **Comentários**: Comentários em perguntas e respostas com respostas aninhadas
- **Votação**: Sistema de upvote/downvote com cálculo de reputação
- **Categorias**: Organização por categorias com estatísticas
- **Tags**: Sistema de tags com indicadores de popularidade e novidade

### Sistema de Usuários
- **Autenticação**: NextAuth.js com JWT
- **Perfis**: Informações detalhadas, badges e reputação
- **Níveis**: Sistema de níveis baseado em reputação
- **Badges**: Conquistas por participação e contribuições

### APIs RESTful
- **Forum**: CRUD completo para perguntas, respostas e comentários
- **Usuários**: Registro, login e gerenciamento de perfis
- **Votação**: Sistema de votação com validações
- **Busca**: Filtros avançados por categoria, tags e status

### Footer
- Links de navegação
- Redes sociais
- Newsletter
- Estatísticas da plataforma

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa o servidor de desenvolvimento
npm run build        # Constrói o projeto para produção
npm run start        # Executa o servidor de produção
npm run lint         # Executa o linter
npm run test         # Executa os testes
npm run test:watch   # Executa os testes em modo watch
```

## 🎯 Boas Práticas Implementadas

### 1. Código Limpo e Legível
- Nomes descritivos para variáveis e funções
- Funções curtas e focadas
- Indentação e espaçamento adequados

### 2. Documentação
- Comentários explicativos em componentes complexos
- README detalhado
- JSDoc para interfaces TypeScript

### 3. Testes
- Configuração do Jest
- Scripts de teste automatizados
- Estrutura preparada para testes unitários

### 4. Refatoração
- Componentes modulares e reutilizáveis
- Separação de responsabilidades
- Padrões consistentes de codificação

### 5. Padrões de Codificação
- TypeScript para tipagem estática
- ESLint para qualidade do código
- Prettier para formatação (configurável)

### 6. Princípio DRY
- Componentes reutilizáveis
- Funções utilitárias compartilhadas
- Estilos consistentes com Tailwind

### 7. Simplicidade (KISS)
- Soluções diretas e eficientes
- Evita sobre-engenharia
- Código auto-explicativo

### 8. Revisão de Código
- Estrutura preparada para code reviews
- Padrões consistentes
- Documentação clara para revisores

## 🌟 Características Técnicas

- **Responsivo**: Design mobile-first com Tailwind CSS
- **Acessível**: Componentes com ARIA labels e semântica HTML
- **Performance**: Lazy loading e otimizações do Next.js
- **SEO**: Metadados estruturados e Open Graph
- **Animations**: Transições suaves com Framer Motion
- **TypeScript**: Tipagem estática para maior confiabilidade

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Faça upload da pasta .next para o Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Website**: [https://acodelab.com](https://acodelab.com)
- **Email**: contato@acodelab.com
- **GitHub**: [https://github.com/acodelab](https://github.com/acodelab)
- **LinkedIn**: [https://linkedin.com/company/acodelab](https://linkedin.com/company/acodelab)

## 🙏 Agradecimentos

- Comunidade Next.js
- Equipe Tailwind CSS
- Contribuidores do Radix UI
- Inspirações do 21st.dev

---

**Acode Lab** - Conectando desenvolvedores, compartilhando conhecimento, construindo o futuro. 🚀




