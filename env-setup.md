# Configuração do Ambiente

## 1. Criar arquivo .env.local na raiz do projeto:

```bash
# Database
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/acode_lab"

# NextAuth.js
NEXTAUTH_SECRET="sua-chave-secreta-aqui-123456789"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

## 2. Substituir valores:
- `SUA_SENHA`: Senha do seu PostgreSQL
- `sua-chave-secreta-aqui-123456789`: Chave secreta aleatória para NextAuth

## 3. Configurar banco PostgreSQL:
- Criar banco `acode_lab`
- Usuário `postgres` com a senha configurada

## 4. Executar comandos:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

