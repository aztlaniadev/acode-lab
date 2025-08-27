"use client"

import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';

interface BottomNavProps {
  onOpenCreateModal: () => void;
}

export const BottomNav = ({ onOpenCreateModal }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50 lg:hidden">
      <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
        <Home className="w-6 h-6 text-gray-700" />
      </button>
      
      <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
        <Search className="w-6 h-6 text-gray-700" />
      </button>
      
      <button 
        onClick={onOpenCreateModal}
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
      >
        <PlusSquare className="w-6 h-6 text-gray-700" />
      </button>
      
      <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
        <Heart className="w-6 h-6 text-gray-700" />
      </button>
      
      <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
        <User className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};