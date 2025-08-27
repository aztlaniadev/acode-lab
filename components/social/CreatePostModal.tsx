"use client"

import { useState, useRef } from 'react';
import { X, Image, Video, FileText, Smile } from 'lucide-react';
import { CreatePostData } from '@/types/social';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: CreatePostData) => void;
}

export const CreatePostModal = ({ isOpen, onClose, onCreatePost }: CreatePostModalProps) => {
  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState<'photo' | 'reel'>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    
    try {
      await onCreatePost({
        type: postType,
        caption,
        file: selectedFile
      });
      
      // Reset form
      setCaption('');
      setSelectedFile(null);
      setPostType('photo');
      onClose();
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCaption('');
      setSelectedFile(null);
      setPostType('photo');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card/95 backdrop-blur-xl border border-border/30 rounded-3xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Criar Nova Publicação</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tipo de Post */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Tipo de Conteúdo
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setPostType('photo')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-2xl border transition-all duration-200 ${
                postType === 'photo'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-border/50'
              }`}
            >
              <Image className="h-5 w-5" />
              <span className="font-medium">Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('reel')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-2xl border transition-all duration-200 ${
                postType === 'reel'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-border/50'
              }`}
            >
              <Video className="h-5 w-5" />
              <span className="font-medium">Reel</span>
            </button>
          </div>
        </div>

        {/* Upload de Arquivo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            {postType === 'photo' ? 'Selecionar Imagem' : 'Selecionar Vídeo'}
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  {postType === 'photo' ? (
                    <Image className="h-8 w-8 text-primary" />
                  ) : (
                    <Video className="h-8 w-8 text-primary" />
                  )}
                </div>
                <p className="text-sm text-foreground font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
                  {postType === 'photo' ? (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <Video className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Clique para selecionar um {postType === 'photo' ? 'arquivo de imagem' : 'arquivo de vídeo'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {postType === 'photo' ? 'PNG, JPG até 10MB' : 'MP4, MOV até 100MB'}
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={postType === 'photo' ? 'image/*' : 'video/*'}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Legenda */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Legenda
          </label>
          <div className="relative">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="O que você quer compartilhar?"
              className="w-full p-4 bg-muted/30 border border-border/30 rounded-2xl resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[100px]"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                title="Adicionar emoji"
              >
                <Smile className="h-4 w-4 text-muted-foreground" />
              </button>
              <span className="text-xs text-muted-foreground">
                {caption.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 px-6 rounded-2xl border border-border/30 text-muted-foreground hover:bg-muted/30 transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:from-primary/90 hover:to-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Publicando...</span>
              </div>
            ) : (
              'Publicar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


