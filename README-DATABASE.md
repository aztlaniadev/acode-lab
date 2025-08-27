# 🗄️ Configuração do Banco de Dados - Acode Lab

Este documento explica como configurar o banco de dados PostgreSQL para o projeto Acode Lab.

## 📋 Pré-requisitos

- **PostgreSQL** instalado e rodando
- **Node.js** 18+ e **npm**
- **Prisma CLI** (já instalado como dependência)

## 🚀 Configuração Rápida

### 1. Instalar PostgreSQL

#### Windows
1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador e siga as instruções
3. Anote a senha do usuário `postgres`

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE acode_lab;

# Verificar se foi criado
\l

# Sair
\q
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/acode_lab"

# NextAuth.js
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3001"

# Environment
NODE_ENV="development"
```

**⚠️ IMPORTANTE:** Substitua `SUA_SENHA` pela senha real do PostgreSQL.

### 4. Executar Migrações

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# OU usar migrações (recomendado para produção)
npm run db:migrate
```

### 5. Popular Banco com Dados Iniciais

```bash
# Executar script de seed
npm run db:seed
```

## 🔧 Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar mudanças no schema
npm run db:push

# Criar migração
npm run db:migrate

# Abrir Prisma Studio (interface visual)
npm run db:studio

# Executar seed
npm run db:seed
```

## 📊 Estrutura do Banco

### Tabelas Principais

- **users** - Usuários do sistema
- **questions** - Perguntas do fórum
- **answers** - Respostas às perguntas
- **comments** - Comentários em perguntas/respostas
- **categories** - Categorias do fórum
- **tags** - Tags para classificar perguntas
- **votes** - Sistema de votação
- **badges** - Conquistas dos usuários

### Relacionamentos

- Usuários podem fazer perguntas, respostas e comentários
- Perguntas pertencem a categorias e podem ter múltiplas tags
- Respostas e comentários podem receber votos
- Sistema de reputação baseado em votos e ações

## 🚨 Solução de Problemas

### Erro de Conexão
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução:** Verifique se o PostgreSQL está rodando

### Erro de Autenticação
```
Error: password authentication failed
```
**Solução:** Verifique a senha no arquivo `.env.local`

### Erro de Banco Não Encontrado
```
Error: database "acode_lab" does not exist
```
**Solução:** Execute `CREATE DATABASE acode_lab;` no PostgreSQL

### Erro de Permissão
```
Error: permission denied for table
```
**Solução:** Verifique se o usuário tem permissões no banco

## 🔐 Credenciais de Teste

Após executar o seed, você terá acesso a:

- **Admin:** `admin@acodelab.com` / `admin123`
- **Usuário:** `user@acodelab.com` / `user123`

## 📱 Prisma Studio

Para visualizar e editar dados diretamente:

```bash
npm run db:studio
```

Acesse: http://localhost:5555

## 🚀 Próximos Passos

1. ✅ Banco configurado
2. ✅ Dados iniciais carregados
3. ✅ APIs funcionando
4. 🔄 Integrar frontend com APIs
5. 🔄 Implementar autenticação
6. 🔄 Testar funcionalidades

## 📚 Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [NextAuth.js Docs](https://next-auth.js.org/)

---

**🎯 Status:** Banco de dados configurado e funcional!
