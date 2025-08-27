import { useState, useCallback, useRef, useEffect } from 'react';
import { User, Post, CreatePostData } from '@/types/social';
import { getInitialStories, getInitialPosts } from '@/lib/socialData';

export const useSocial = () => {
  const [posts, setPosts] = useState<Post[]>(getInitialPosts());
  const [postsCounter, setPostsCounter] = useState(1000); // Contador estático para IDs
  const [stories, setStories] = useState<User[]>(getInitialStories());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);
  const [viewingStoryUser, setViewingStoryUser] = useState<User | null>(null);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Carregar mais posts com infinite scroll
  const loadMorePosts = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const newPosts: Post[] = [
        {
          id: postsCounter + 1,
          username: 'js_master',
          avatar: `https://i.pravatar.cc/150?u=js_master`,
          type: 'photo',
          contentUrl: `https://picsum.photos/800/600?random=${postsCounter + 1}`,
          caption: 'Gerando conteúdo dinâmico para o feed! #javascript #dev',
          likes: 1500 + (postsCounter % 1000), // Likes determinísticos
          commentsCount: 0,
          commentsData: [],
          timestamp: 'Agora mesmo',
          userId: '4'
        },
        {
          id: postsCounter + 2,
          username: 'devops_guru',
          avatar: `https://i.pravatar.cc/150?u=devops_guru`,
          type: 'reel',
          contentUrl: `https://picsum.photos/800/1000?random=${postsCounter + 2}`,
          caption: 'Novo Reel sobre automação de deploy. Confira! 🚀',
          likes: 2000 + (postsCounter % 1000), // Likes determinísticos
          commentsCount: 0,
          commentsData: [],
          timestamp: 'Agora mesmo',
          userId: '6'
        }
      ];
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPostsCounter(prev => prev + 2);
      setIsLoading(false);
    }, 1500);
  }, [postsCounter]);

  // Intersection Observer para infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
        observer.disconnect();
      }
    };
  }, [isLoading, loadMorePosts]);

  // Criar novo post
  const handleCreatePost = useCallback((newPost: CreatePostData) => {
    const post: Post = {
      id: postsCounter + 1,
      username: 'você',
      avatar: `https://i.pravatar.cc/150?u=seu_story`,
      type: newPost.type,
      contentUrl: URL.createObjectURL(newPost.file),
      caption: newPost.caption,
      likes: 0,
      commentsCount: 0,
      commentsData: [],
      timestamp: 'Agora mesmo',
      userId: '1'
    };
    setPosts(prevPosts => [post, ...prevPosts]);
    setPostsCounter(prev => prev + 1);
  }, [postsCounter]);

  // Adicionar comentário
  const handleAddComment = useCallback((postId: number, commentText: string) => {
    const newComment = {
      id: postsCounter + 1,
      username: 'você',
      text: commentText,
      timestamp: 'Agora mesmo',
      userId: '1'
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            commentsCount: post.commentsCount + 1,
            commentsData: [...post.commentsData, newComment]
          };
          setActiveCommentPost(updatedPost);
          return updatedPost;
        }
        return post;
      })
    );
    setPostsCounter(prev => prev + 1);
  }, [postsCounter]);

  // Gerenciar stories
  const handleStoryClick = useCallback((user: User) => {
    setViewingStoryUser(user);
    setStories(prevStories =>
      prevStories.map(storyUser =>
        storyUser.id === user.id ? { ...storyUser, viewed: true } : storyUser
      )
    );
  }, []);

  const handleCloseStory = useCallback(() => {
    setViewingStoryUser(null);
  }, []);

  const handleNextUserStory = useCallback(() => {
    if (!viewingStoryUser) return;
    
    const currentIndex = stories.findIndex(u => u.id === viewingStoryUser.id);
    if (currentIndex < stories.length - 1) {
      handleStoryClick(stories[currentIndex + 1]);
    } else {
      handleCloseStory();
    }
  }, [viewingStoryUser, stories, handleStoryClick, handleCloseStory]);

  const handlePrevUserStory = useCallback(() => {
    if (!viewingStoryUser) return;
    
    const currentIndex = stories.findIndex(u => u.id === viewingStoryUser.id);
    if (currentIndex > 0) {
      handleStoryClick(stories[currentIndex - 1]);
    } else {
      handleCloseStory();
    }
  }, [viewingStoryUser, stories, handleStoryClick, handleCloseStory]);

  return {
    // Estado
    posts,
    stories,
    isLoading,
    isCreateModalOpen,
    activeCommentPost,
    activeSharePost,
    viewingStoryUser,
    
    // Refs
    loaderRef,
    
    // Ações
    setCreateModalOpen,
    setActiveCommentPost,
    setActiveSharePost,
    handleCreatePost,
    handleAddComment,
    handleStoryClick,
    handleCloseStory,
    handleNextUserStory,
    handlePrevUserStory
  };
};
