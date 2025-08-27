# Acode Lab 🚀

Uma plataforma completa de desenvolvimento e rede social para desenvolvedores, construída com Next.js 14, TypeScript e Prisma.

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- Sistema de login com NextAuth.js
- Autenticação de dois fatores (2FA)
- Gerenciamento de sessões seguro
- Middleware de proteção de rotas

### 💬 Fórum de Desenvolvimento
- Sistema de perguntas e respostas
- Categorias e tags organizacionais
- Sistema de votação
- Comentários em tempo real
- Busca avançada

### 🌐 Rede Social
- Feed de posts personalizado
- Sistema de conexões entre usuários
- Stories e compartilhamento
- Perfis de usuário personalizáveis
- Sistema de comentários

### 🛠️ Tecnologias
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Backend**: API Routes do Next.js
- **Database**: PostgreSQL com Prisma ORM
- **Cache**: Redis
- **Estado**: Zustand
- **Autenticação**: NextAuth.js

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL
- Redis

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/acode-lab.git
cd acode-lab

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute as migrações do banco
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/acode_lab"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (opcional)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
```

## 📁 Estrutura do Projeto

```
acode-lab/
├── app/                    # App Router do Next.js 14
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── forum/             # Páginas do fórum
│   └── social/            # Páginas da rede social
├── components/             # Componentes React reutilizáveis
├── lib/                    # Utilitários e configurações
├── prisma/                 # Schema e migrações do banco
├── types/                  # Definições de tipos TypeScript
└── docs/                   # Documentação do projeto
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos TypeScript
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma [issue](https://github.com/seu-usuario/acode-lab/issues).

---

**Desenvolvido com ❤️ pela equipe Acode Lab**




