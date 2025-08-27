"use client"

import { useEffect, useState } from 'react';
import { Header } from '@/components/social/Header';
import { StoriesTray } from '@/components/social/StoriesTray';
import { Feed } from '@/components/social/Feed';
import { CreatePostModal } from '@/components/social/CreatePostModal';
import { CommentModal } from '@/components/social/CommentModal';
import { ShareModal } from '@/components/social/ShareModal';
import { StoryViewer } from '@/components/social/StoryViewer';
import { BottomNav } from '@/components/social/BottomNav';
import { useSocial } from '@/hooks/useSocial';

export const SocialFeed = () => {
  const [mounted, setMounted] = useState(false);
  
  const {
    posts,
    stories,
    isLoading,
    isCreateModalOpen,
    activeCommentPost,
    activeSharePost,
    viewingStoryUser,
    loaderRef,
    setCreateModalOpen,
    setActiveCommentPost,
    setActiveSharePost,
    handleCreatePost,
    handleAddComment,
    handleStoryClick,
    handleCloseStory,
    handleNextUserStory,
    handlePrevUserStory
  } = useSocial();

  // Proteção contra hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Adicionar estilos CSS para animações
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes progress-bar { 
        from { width: 0%; } 
        to { width: 100%; } 
      } 
      .animate-progress { 
        animation: progress-bar linear; 
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
      }
      
      .animate-glow {
        animation: glow 2s ease-in-out infinite alternate;
      }
    `;
    document.head.appendChild(style);
    
    // Detectar tema escuro
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Renderizar loading até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      {/* Background decorativo */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-accent/10 to-primary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="max-w-2xl mx-auto relative">
        <Header />
        
        <main className="pt-4 pb-24">
          <StoriesTray 
            stories={stories} 
            onStoryClick={handleStoryClick} 
          />
          
          <Feed 
            posts={posts} 
            loadMorePosts={() => {}} // Implementado no hook
            isLoading={isLoading} 
            onCommentClick={(post) => setActiveCommentPost(post)} 
            onShareClick={(post) => setActiveSharePost(post)}
            loaderRef={loaderRef}
          />
        </main>
        
        <BottomNav onOpenCreateModal={() => setCreateModalOpen(true)} />
        
        {/* Modais */}
        <CreatePostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
          onCreatePost={handleCreatePost}
        />
        
        <CommentModal 
          isOpen={!!activeCommentPost} 
          onClose={() => setActiveCommentPost(null)} 
          post={activeCommentPost} 
          onAddComment={handleAddComment} 
        />
        
        <ShareModal 
          isOpen={!!activeSharePost} 
          onClose={() => setActiveSharePost(null)} 
          post={activeSharePost} 
        />
        
        {/* Story Viewer */}
        {viewingStoryUser && (
          <StoryViewer 
            user={viewingStoryUser} 
            onClose={handleCloseStory} 
            onNextUser={handleNextUserStory} 
            onPrevUser={handlePrevUserStory} 
          />
        )}
      </div>
    </div>
  );
};
