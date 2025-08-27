import { useState, useEffect } from 'react';
import { Post as PostType } from '@/types/social';
import { Post } from '@/components/social/Post';

interface FeedProps {
  posts: PostType[];
  loadMorePosts: () => void;
  isLoading: boolean;
  onCommentClick: (post: PostType) => void;
  onShareClick: (post: PostType) => void;
  loaderRef: React.RefObject<HTMLDivElement>;
}

export const Feed = ({ 
  posts, 
  loadMorePosts, 
  isLoading, 
  onCommentClick, 
  onShareClick,
  loaderRef 
}: FeedProps) => {
  const [mounted, setMounted] = useState(false);

  // Proteção contra hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderizar loading até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <div className="pb-16">
        <div className="flex justify-center items-center p-8">
          <div className="w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          onCommentClick={onCommentClick} 
          onShareClick={onShareClick} 
        />
      ))}
      
      <div ref={loaderRef} className="flex justify-center items-center p-8">
        {isLoading && (
          <div className="w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
};
