import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Temporariamente comentado devido a conflito de versões
  
  // Log de debug da configuração
  debug: true, // Habilitar debug do NextAuth
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 AUTHORIZE FUNCTION - INICIANDO');
        
        // 🚨 DEBUG: Log detalhado das credenciais recebidas
        console.log('🔐 AUTHORIZE FUNCTION - Credenciais recebidas:', {
          email: credentials?.email,
          passwordLength: credentials?.password?.length,
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password
        });

        // Validação rigorosa de entrada
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing email or password');
          return null;
        }

        try {
          console.log('🔍 Searching for user with email:', credentials.email);
          
          // Verificar se o Prisma está funcionando
          console.log('🔍 Prisma client status:', !!prisma);
          
          // Buscar usuário com proteção contra timing attacks
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          });

          console.log('👤 User found:', user ? 'YES' : 'NO');
          if (user) {
            console.log('👤 User details:', {
              id: user.id,
              email: user.email,
              username: user.username,
              name: user.name,
              passwordLength: user.password?.length || 0
            });
          }

          if (!user) {
            // Simular delay para prevenir timing attacks
            await bcrypt.compare("dummy_password", "$2a$12$dummy.hash.for.timing");
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          console.log('🔑 Comparing passwords...');
          console.log('🔑 Input password:', credentials.password);
          console.log('🔑 Stored password hash length:', user.password?.length || 0);
          
          // Verificar senha com proteção contra timing attacks
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('🔑 Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ Invalid password for:', credentials.email);
            return null;
          }

          // Login bem-sucedido
          console.log('✅ Login successful for:', credentials.email);
          
          const result = {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar || undefined,
            reputation: user.reputation,
            level: user.level,
            totpEnabled: user.totpEnabled || false,
          };
          
          console.log('✅ Returning user object:', result);
          return result;
          
        } catch (error) {
          console.error('💥 Error in authentication:', error);
          console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack');
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 60 * 60, // 1 hora
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('🔐 JWT CALLBACK - Executando');
      console.log('🔐 User object:', !!user);
      console.log('🔐 Account object:', !!account);
      
      if (user) {
        console.log('🔐 JWT CALLBACK - Atualizando token com dados do usuário');
        token.id = user.id;
        token.username = user.username;
        token.reputation = user.reputation;
        token.level = user.level;
      }
      console.log('🔐 JWT CALLBACK - Token final:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('🔐 SESSION CALLBACK - Executando');
      console.log('🔐 Token object:', !!token);
      
      if (token) {
        console.log('🔐 SESSION CALLBACK - Atualizando sessão com dados do token');
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.reputation = token.reputation as number;
        session.user.level = token.level as string;
      }
      console.log('🔐 SESSION CALLBACK - Sessão final:', session);
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // Configurações de segurança adicionais
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
