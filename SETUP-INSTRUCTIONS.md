# 🚀 INSTRUÇÕES DE CONFIGURAÇÃO - ACODE LAB

## 📋 **PRÉ-REQUISITOS**

### **1. PostgreSQL Instalado e Rodando**
- Instalar PostgreSQL 14+ 
- Criar banco de dados: `acode_lab`
- Usuário: `postgres`
- Senha: `postgres` (ou alterar no .env.local)
- Porta: `5432`

### **2. Node.js 18+ Instalado**
- Verificar versão: `node --version`
- Verificar npm: `npm --version`

## 🔧 **CONFIGURAÇÃO DO AMBIENTE**

### **1. Criar arquivo .env.local**
Copie o conteúdo de `env-config.txt` para um arquivo chamado `.env.local` na raiz do projeto:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/acode_lab"

# NextAuth.js
NEXTAUTH_SECRET="acode-lab-secret-key-2024-development-environment"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"

# Prisma
PRISMA_GENERATE_DATAPROXY=true
```

### **2. Instalar Dependências**
```bash
npm install
```

## 🗄️ **CONFIGURAÇÃO DO BANCO DE DADOS**

### **1. Gerar Cliente Prisma**
```bash
npm run db:generate
```

### **2. Criar/Atualizar Schema do Banco**
```bash
npm run db:push
```

### **3. Executar Seeds**
```bash
# Seed principal (fórum, usuários, categorias, tags)
npm run db:seed

# Seed da rede social (perfis, posts, conexões)
npm run db:seed:social
```

## 🧪 **VERIFICAÇÃO**

### **1. Testar Conexão com Banco**
```bash
npm run db:test
```

### **2. Abrir Prisma Studio**
```bash
npm run db:studio
```

### **3. Executar Aplicação**
```bash
npm run dev
```

## 🔑 **CREDENCIAIS DE TESTE**

### **Usuários Criados pelo Seed:**

#### **Admin:**
- Email: `admin@acodelab.com`
- Senha: `admin123`
- Nível: MASTER
- Reputação: 1000

#### **Usuário Exemplo:**
- Email: `user@acodelab.com`
- Senha: `user123`
- Nível: INTERMEDIATE
- Reputação: 150

#### **Usuários da Rede Social:**
- **João Silva:** `joao@acodelab.com` / `joao123`
- **Maria Santos:** `maria@acodelab.com` / `maria123`
- **Pedro Costa:** `pedro@acodelab.com` / `pedro123`
- **Ana Oliveira:** `ana@acodelab.com` / `ana123`

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Erro: "Can't reach database server"**
- Verificar se PostgreSQL está rodando
- Verificar porta (padrão: 5432)
- Verificar credenciais no .env.local

### **Erro: "Environment variable not found: DATABASE_URL"**
- Verificar se .env.local existe na raiz
- Verificar se não há arquivo .env conflitante
- Reiniciar terminal após criar .env.local

### **Erro: "Prisma schema validation"**
- Executar `npm run db:generate`
- Verificar sintaxe do schema.prisma
- Verificar tipos de dados

## 📊 **ESTRUTURA DO BANCO**

### **Tabelas Principais:**
- `users` - Usuários da plataforma
- `categories` - Categorias do fórum
- `tags` - Tags para perguntas
- `questions` - Perguntas do fórum
- `answers` - Respostas às perguntas
- `badges` - Conquistas dos usuários
- `userProfiles` - Perfis detalhados
- `socialPosts` - Posts da rede social
- `connections` - Conexões entre usuários

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ Configurar .env.local
2. ✅ Executar migrações do banco
3. ✅ Executar seeds de dados
4. 🔄 Testar autenticação
5. 🔄 Implementar funcionalidades restantes
6. 🔄 Configurar testes automatizados

