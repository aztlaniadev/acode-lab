import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Post as PostType } from '@/types/social';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostType | null;
  onAddComment: (postId: number, commentText: string) => void;
}

export const CommentModal = ({ isOpen, onClose, post, onAddComment }: CommentModalProps) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(post.id, newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-30">
      <div className="bg-card rounded-t-2xl p-4 w-full max-w-lg h-3/4 flex flex-col">
        {/* Header */}
        <div className="text-center pb-2 border-b border-border mb-4 relative">
          <h2 className="font-bold text-foreground">Comentários</h2>
          <button onClick={onClose} className="absolute right-0 top-0">
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Lista de comentários */}
        <div className="flex-grow overflow-y-auto pr-2">
          {post.commentsData.length === 0 ? (
            <p className="text-center text-muted-foreground mt-8">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            post.commentsData.map(comment => (
              <div key={comment.id} className="flex items-start space-x-3 mb-4">
                <Image 
                  src={`https://i.pravatar.cc/150?u=${comment.username}`} 
                  className="w-8 h-8 rounded-full" 
                  alt={comment.username}
                  width={32}
                  height={32}
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{comment.username}</span> {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form para novo comentário */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center border-t border-border pt-4">
          <Image 
            src={`https://i.pravatar.cc/150?u=seu_story`} 
            className="w-8 h-8 rounded-full" 
            alt="seu avatar"
            width={32}
            height={32}
          />
          <input 
            type="text" 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            placeholder="Adicionar um comentário..." 
            className="flex-1 ml-3 p-2 bg-muted rounded-full border-none focus:ring-0 text-sm text-foreground"
          />
          <button 
            type="submit" 
            className="ml-2 font-semibold text-accent disabled:text-muted-foreground" 
            disabled={!newComment.trim()}
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
};
