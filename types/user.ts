// Tipos unificados para usuários do Acode Lab

export enum UserLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER'
}

export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  reputation: number;
  level: UserLevel;
  role: UserRole;
  badges: Badge[];
  isVerified: boolean;
  isBanned: boolean;
  joinDate: Date;
  lastActive: Date;
  questionsCount: number;
  answersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  coverImage?: string;
  skills: string[];
  experience?: string;
  education?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  timezone?: string;
  isAvailable: boolean;
  hourlyRate?: number;
  portfolio: string[];
  socialLinks?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  reputation: number;
  level: UserLevel;
  role: UserRole;
  isVerified: boolean;
}

