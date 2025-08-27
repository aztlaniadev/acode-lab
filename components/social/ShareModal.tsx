"use client"

import { useState } from 'react';
import Image from 'next/image';
import { X, Copy, Share2, MessageCircle, Mail, Link, Facebook, Twitter, Instagram } from 'lucide-react';
import { Post } from '@/types/social';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

export const ShareModal = ({ isOpen, onClose, post }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const shareOptions = [
    {
      icon: Copy,
      label: 'Copiar Link',
      action: handleCopyLink,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: MessageCircle,
      label: 'Mensagem Direta',
      action: () => console.log('Mensagem direta'),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Mail,
      label: 'Email',
      action: () => console.log('Compartilhar por email'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      action: () => console.log('Compartilhar no Facebook'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      action: () => console.log('Compartilhar no Twitter'),
      color: 'text-sky-500',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      action: () => console.log('Compartilhar no Instagram'),
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card/95 backdrop-blur-xl border border-border/30 rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Compartilhar</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Preview do Post */}
        <div className="mb-6 p-4 bg-muted/30 rounded-2xl border border-border/30">
          <div className="flex items-center space-x-3 mb-3">
            <Image
              src={post.avatar}
              alt={post.username}
              className="w-10 h-10 rounded-full border-2 border-border/50"
              width={40}
              height={40}
            />
            <div>
              <p className="font-medium text-foreground">{post.username}</p>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <p className="text-sm text-foreground line-clamp-2">{post.caption}</p>
        </div>

        {/* Opções de Compartilhamento */}
        <div className="space-y-2 mb-6">
          {shareOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className={`p-2 rounded-xl ${option.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <option.icon className={`h-5 w-5 ${option.color}`} />
              </div>
              <span className="text-foreground font-medium">{option.label}</span>
              {option.label === 'Copiar Link' && copied && (
                <span className="ml-auto text-xs text-green-500 font-medium">Copiado!</span>
              )}
            </button>
          ))}
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-2xl bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-all duration-200 font-medium"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};


