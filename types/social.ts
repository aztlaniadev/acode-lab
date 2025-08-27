export interface Story {
  id: number;
  type: 'image' | 'video';
  url: string;
  duration?: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  isOwn?: boolean;
  viewed?: boolean;
  stories: Story[];
}

export interface Comment {
  id: number;
  username: string;
  text: string;
  timestamp: string;
  userId: string;
}

export interface Post {
  id: number;
  username: string;
  avatar: string;
  type: 'photo' | 'reel';
  contentUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  commentsData: Comment[];
  timestamp: string;
  userId: string;
}

export interface CreatePostData {
  caption: string;
  file: File;
  type: 'photo' | 'reel';
}

export interface SocialState {
  posts: Post[];
  stories: User[];
  isLoading: boolean;
  isCreateModalOpen: boolean;
  activeCommentPost: Post | null;
  activeSharePost: Post | null;
  viewingStoryUser: User | null;
}

