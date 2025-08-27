import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from '@/types/social';

interface StoryViewerProps {
  user: User | null;
  onClose: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
}

export const StoryViewer = ({ user, onClose, onNextUser, onPrevUser }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const STORY_DURATION = 5000;

  useEffect(() => {
    setCurrentIndex(0);
  }, [user]);

  const goToNextStory = () => {
    if (user && currentIndex < user.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNextUser();
    }
  };

  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onPrevUser();
    }
  };

  useEffect(() => {
    if (isPaused || !user) return;
    const timer = setTimeout(goToNextStory, STORY_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, user, isPaused, goToNextStory]);
  
  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  if (!user || !user.stories || !user.stories[currentIndex]) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-40 flex items-center justify-center" 
      onMouseDown={handleInteractionStart} 
      onMouseUp={handleInteractionEnd} 
      onTouchStart={handleInteractionStart} 
      onTouchEnd={handleInteractionEnd}
    >
      <div className="relative w-full h-full max-w-md mx-auto">
        <img 
          src={user.stories[currentIndex].url} 
          className="w-full h-full object-cover" 
          alt={`Story by ${user.username}`} 
        />
        
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 p-3 z-50">
          <div className="flex items-center gap-2">
            {user.stories.map((story, index) => (
              <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full">
                <div 
                  className={`h-full bg-white rounded-full ${
                    index < currentIndex ? 'w-full' : ''
                  } ${
                    index === currentIndex ? (isPaused ? 'w-0' : 'animate-progress') : ''
                  }`} 
                  style={{ animationDuration: `${STORY_DURATION}ms` }}
                ></div>
              </div>
            ))}
          </div>
          
          {/* Header do story */}
          <div className="flex items-center mt-3">
            <img 
              src={user.avatar} 
              className="w-8 h-8 rounded-full" 
              alt={user.username} 
            />
            <p className="text-white font-semibold text-sm ml-2">{user.username}</p>
            <button 
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="ml-auto p-2"
            >
              <X className="h-7 w-7 text-white" />
            </button>
          </div>
        </div>

        {/* Áreas de navegação */}
        <div 
          className="absolute inset-y-0 left-0 w-1/3 z-10" 
          onClick={(e) => { 
            e.stopPropagation(); 
            goToPrevStory(); 
          }}
        ></div>
        <div 
          className="absolute inset-y-0 right-0 w-1/3 z-10" 
          onClick={(e) => { 
            e.stopPropagation(); 
            goToNextStory(); 
          }}
        ></div>
      </div>
    </div>
  );
};

