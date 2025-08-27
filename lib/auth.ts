import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  // Debug desabilitado para produção
  debug: process.env.NODE_ENV === 'development',
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 AUTHORIZE FUNCTION - INICIANDO');
        }

        // Validação rigorosa de entrada
        if (!credentials?.email || !credentials?.password) {
          if (process.env.NODE_ENV === 'development') {
            console.log('❌ Missing email or password');
          }
          return null;
        }

        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Searching for user with email:', credentials.email);
          }
          
          // Buscar usuário com proteção contra timing attacks
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          });

          if (process.env.NODE_ENV === 'development') {
            console.log('👤 User found:', user ? 'YES' : 'NO');
          }

          if (!user) {
            // Simular delay para prevenir timing attacks
            await bcrypt.compare("dummy_password", "$2a$12$dummy.hash.for.timing");
            if (process.env.NODE_ENV === 'development') {
              console.log('❌ User not found:', credentials.email);
            }
            return null;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('🔑 Comparing passwords...');
          }
          
          // Verificar senha com proteção contra timing attacks
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (process.env.NODE_ENV === 'development') {
            console.log('🔑 Password valid:', isPasswordValid);
          }

          if (!isPasswordValid) {
            if (process.env.NODE_ENV === 'development') {
              console.log('❌ Invalid password for:', credentials.email);
            }
            return null;
          }

          // Login bem-sucedido
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Login successful for:', credentials.email);
          }
          
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
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Returning user object:', result);
          }
          return result;
          
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('💥 Error in authentication:', error);
            console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack');
          }
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
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 JWT CALLBACK - Executando');
        console.log('🔐 User object:', !!user);
        console.log('🔐 Account object:', !!account);
      }
      
      if (user) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 JWT CALLBACK - Atualizando token com dados do usuário');
        }
        token.id = user.id;
        token.username = user.username;
        token.reputation = user.reputation;
        token.level = user.level;
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 JWT CALLBACK - Token final:', token);
      }
      return token;
    },
    async session({ session, token }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 SESSION CALLBACK - Executando');
        console.log('🔐 Token object:', !!token);
      }
      
      if (token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 SESSION CALLBACK - Atualizando sessão com dados do token');
        }
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.reputation = token.reputation as number;
        session.user.level = token.level as string;
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 SESSION CALLBACK - Sessão final:', session);
      }
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
