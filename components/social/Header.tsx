import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bell, Search } from 'lucide-react';

export const Header = () => {
  const [mounted, setMounted] = useState(false);

  // Proteção contra hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderizar loading até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-xl border-b border-border/50 p-4 flex justify-between items-center z-20 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Acode Social
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-48 h-10 bg-muted/50 rounded-full"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted/50 rounded-full"></div>
            <div className="w-10 h-10 bg-muted/50 rounded-full"></div>
            <div className="w-10 h-10 bg-muted/50 rounded-full"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-xl border-b border-border/50 p-1 flex justify-between items-center z-20 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
          <span className="text-primary-foreground font-bold text-xs">A</span>
        </div>
        <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Acode Social
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="h-3 w-3 text-muted-foreground absolute left-1.5 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-6 pr-2 py-0.5 bg-muted/50 rounded-full border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-300 text-xs w-32"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="relative p-1 rounded-full hover:bg-muted/50 transition-all duration-200 group">
            <Heart className="h-3 w-3 text-muted-foreground group-hover:text-destructive transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
          </button>
          
          <button className="relative p-1 rounded-full hover:bg-muted/50 transition-all duration-200 group">
            <MessageCircle className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </button>
          
          <button className="relative p-1 rounded-full hover:bg-muted/50 transition-all duration-200 group">
            <Bell className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
