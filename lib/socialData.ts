import { User, Post } from '@/types/social';

export const getInitialStories = (): User[] => [
  {
    id: '1',
    username: 'seu_story',
    avatar: `https://i.pravatar.cc/150?u=seu_story`,
    isOwn: true,
    viewed: false,
    stories: [
      { id: 101, type: 'image', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80' }
    ]
  },
  {
    id: '2',
    username: 'reactdev',
    avatar: `https://i.pravatar.cc/150?u=reactdev`,
    viewed: false,
    stories: [
      { id: 102, type: 'image', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80' },
      { id: 103, type: 'image', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80' }
    ]
  },
  {
    id: '3',
    username: 'tailwinder',
    avatar: `https://i.pravatar.cc/150?u=tailwinder`,
    viewed: false,
    stories: [
      { id: 104, type: 'image', url: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=500&q=80' }
    ]
  },
  {
    id: '4',
    username: 'js_master',
    avatar: `https://i.pravatar.cc/150?u=js_master`,
    viewed: false,
    stories: [
      { id: 105, type: 'image', url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=500&q=80' },
      { id: 106, type: 'image', url: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=500&q=80' },
      { id: 107, type: 'image', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&q=80' }
    ]
  },
  {
    id: '5',
    username: 'ux_designer',
    avatar: `https://i.pravatar.cc/150?u=ux_designer`,
    viewed: false,
    stories: [
      { id: 108, type: 'image', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80' }
    ]
  }
];

export const getInitialPosts = (): Post[] => [
  {
    id: 1,
    username: 'ux_designer',
    avatar: `https://i.pravatar.cc/150?u=ux_designer`,
    type: 'photo',
    contentUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    caption: 'Trabalhando no novo layout do projeto. O que vocês acham? ✨ #uidesign #webdev',
    likes: 1342,
    commentsCount: 2,
    commentsData: [
      { id: 1, username: 'reactdev', text: 'Ficou incrível! Parabéns!', timestamp: '1 hora atrás', userId: '2' },
      { id: 2, username: 'tailwinder', text: 'Muito limpo e moderno.', timestamp: '30 min atrás', userId: '3' }
    ],
    timestamp: '2 horas atrás',
    userId: '5'
  },
  {
    id: 2,
    username: 'reactdev',
    avatar: `https://i.pravatar.cc/150?u=reactdev`,
    type: 'reel',
    contentUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    caption: 'Um pouco do meu setup de programação! 🎮🕹️ #coding #setup #developer',
    likes: 5890,
    commentsCount: 1,
    commentsData: [
      { id: 3, username: 'js_master', text: 'Que setup legal!', timestamp: '2 horas atrás', userId: '4' }
    ],
    timestamp: '5 horas atrás',
    userId: '2'
  },
  {
    id: 3,
    username: 'tailwinder',
    avatar: `https://i.pravatar.cc/150?u=tailwinder`,
    type: 'photo',
    contentUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    caption: 'A beleza está na simplicidade do código limpo. #cleancode #tailwindcss',
    likes: 876,
    commentsCount: 0,
    commentsData: [],
    timestamp: '1 dia atrás',
    userId: '3'
  }
];

