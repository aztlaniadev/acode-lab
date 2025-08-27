import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      name: string
      avatar?: string
      reputation: number
      level: string
    }
  }

  interface User {
    id: string
    email: string
    username: string
    name: string
    avatar?: string
    reputation: number
    level: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    reputation: number
    level: string
  }
}
