import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, PlayCircle, Share2, BookmarkPlus } from 'lucide-react';
import { Post as PostType } from '@/types/social';

interface PostProps {
  post: PostType;
  onCommentClick: (post: PostType) => void;
  onShareClick: (post: PostType) => void;
}

export const Post = ({ post, onCommentClick, onShareClick }: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [viewCount, setViewCount] = useState<number | null>(null);

  // Corrigir hidratação: calcular visualizações apenas no cliente
  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 1000));
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl mx-4 mb-4 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group">
      {/* Header do post */}
      <div className="flex items-center p-3">
        <div className="relative">
          <Image 
            className="w-10 h-10 rounded-xl border-2 border-border/50 shadow-md" 
            src={post.avatar || 'https://placehold.co/150x150/e2e8f0/e2e8f0?text= '} 
            alt={post.username}
            width={40}
            height={40}
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-success to-accent rounded-full border-2 border-background"></div>
        </div>
        
        <div className="ml-3 flex-1">
          <p className="font-bold text-foreground text-sm">{post.username}</p>
          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
        </div>
        
        <button className="p-1.5 rounded-xl hover:bg-muted/50 transition-all duration-200 group-hover:bg-muted/30">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Conteúdo do post */}
      <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 mx-3 rounded-xl overflow-hidden">
        <Image 
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          src={post.contentUrl || 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=Image+Not+Found'} 
          alt={`Post by ${post.username}`}
          width={600}
          height={400}
        />
        
        {/* Overlay para reels */}
        {post.type === 'reel' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayCircle className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        )}
        
        {/* Badge de tipo */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            post.type === 'reel' 
              ? 'bg-gradient-to-r from-accent to-primary text-accent-foreground' 
              : 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
          } shadow-md`}>
            {post.type === 'reel' ? 'REEL' : 'FOTO'}
          </span>
        </div>
      </div>

      {/* Ações e informações */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLike}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                isLiked 
                  ? 'bg-gradient-to-r from-destructive to-red-500 text-white shadow-md' 
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button 
              onClick={() => onCommentClick(post)}
              className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-accent transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => onShareClick(post)}
              className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              isBookmarked 
                ? 'bg-gradient-to-r from-accent to-primary text-accent-foreground shadow-md' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            }`}
          >
            {isBookmarked ? <BookmarkPlus className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        {/* Estatísticas */}
        <div className="mb-3">
          <p className="font-bold text-foreground text-base mb-1">
            {likes.toLocaleString('pt-BR')} curtidas
          </p>
          
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span>{post.commentsCount} comentários</span>
            <span>•</span>
            <span>{viewCount !== null ? viewCount : '...'} visualizações</span>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mb-3">
          <p className="text-foreground leading-relaxed text-sm">
            <span className="font-bold text-foreground">{post.username}</span>{' '}
            <span className="text-muted-foreground">{post.caption}</span>
          </p>
        </div>
        
        {/* Call to action */}
        <button 
          onClick={() => onCommentClick(post)}
          className="w-full p-2 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 border border-border/30 hover:border-border/50 text-sm"
        >
          {post.commentsCount > 0 
            ? `Ver todos os ${post.commentsCount} comentários` 
            : 'Adicionar um comentário...'
          }
        </button>
      </div>
    </div>
  );
};
