import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// DEBUG: Verificar se as variáveis de ambiente estão sendo carregadas
console.log("🔍 DEBUG - NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
console.log("🔍 DEBUG - NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("🔍 DEBUG - REDIS_URL:", process.env.REDIS_URL);
console.log("🔍 DEBUG - DATABASE_URL:", process.env.DATABASE_URL);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
