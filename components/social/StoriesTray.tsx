import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from '@/types/social';
import { Plus, Play } from 'lucide-react';

interface StoriesTrayProps {
  stories: User[];
  onStoryClick: (user: User) => void;
}

export const StoriesTray = ({ stories, onStoryClick }: StoriesTrayProps) => {
  const [mounted, setMounted] = useState(false);

  // Proteção contra hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderizar loading até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <div className="pt-24 px-4 pb-6">
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 pb-6">
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Story próprio */}
        <div className="flex-shrink-0 text-center cursor-pointer group">
          <div className="relative w-20 h-20 rounded-3xl p-1 flex justify-center items-center bg-gradient-to-br from-primary via-accent to-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center">
              <Plus className="w-6 h-6 text-primary mb-1" />
              <span className="text-xs text-primary font-medium">Criar</span>
            </div>
          </div>
          <p className="text-xs mt-2 text-muted-foreground font-medium">Seu Story</p>
        </div>

        {/* Stories dos usuários */}
        {stories.map(user => (
          <div 
            key={user.id} 
            className="flex-shrink-0 text-center cursor-pointer group" 
            onClick={() => onStoryClick(user)}
          >
            <div className={`relative w-20 h-20 rounded-3xl p-1 flex justify-center items-center transition-all duration-300 hover:scale-105 ${
              user.isOwn ? '' : (
                user.viewed 
                  ? 'bg-gradient-to-br from-muted to-muted/50 shadow-lg' 
                  : 'bg-gradient-to-br from-accent via-primary to-accent shadow-xl hover:shadow-2xl'
              )
            }`}>
              <Image 
                className="w-full h-full rounded-3xl border-2 border-background object-cover" 
                src={user.avatar || 'https://placehold.co/150x150/e2e8f0/e2e8f0?text= '} 
                alt={user.username}
                width={80}
                height={80}
              />
              
              {/* Indicador de tipo de story */}
              {user.stories.length > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-accent rounded-full w-6 h-6 flex items-center justify-center border-2 border-background shadow-lg">
                  <Play className="w-3 h-3 text-accent-foreground" fill="currentColor" />
                </div>
              )}
              
              {/* Indicador de visualização */}
              {user.viewed && !user.isOwn && (
                <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-xs mt-2 text-muted-foreground group-hover:text-foreground transition-colors font-medium truncate w-20">
              {user.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
