"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { 
  X, Send, Search, MoreVertical, Phone, Video, Info, 
  Image as ImageIcon, Smile, Paperclip, Heart, ThumbsUp,
  CheckCheck, Check, Circle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: Date
  read: boolean
  delivered: boolean
  type: 'text' | 'image' | 'file' | 'audio' | 'video'
  attachments?: Array<{
    url: string
    type: string
    name: string
    size: number
  }>
  replyTo?: string
  reactions?: Array<{
    emoji: string
    userId: string
    userName: string
  }>
}

interface Conversation {
  id: string
  participants: Array<{
    id: string
    name: string
    username: string
    avatar: string
    isOnline: boolean
    lastSeen?: Date
  }>
  lastMessage?: Message
  unreadCount: number
  isTyping?: boolean
  isPinned: boolean
  isMuted: boolean
}

interface MessagesModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: string
  conversations: Conversation[]
  messages: Record<string, Message[]>
  onSendMessage: (conversationId: string, content: string, type?: string) => void
  onMarkAsRead: (conversationId: string) => void
  onReactToMessage: (messageId: string, emoji: string) => void
}

export const MessagesModal = ({
  isOpen,
  onClose,
  currentUserId,
  conversations,
  messages,
  onSendMessage,
  onMarkAsRead,
  onReactToMessage
}: MessagesModalProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const selectedConversationData = conversations.find(c => c.id === selectedConversation)
  
  const conversationMessages = useMemo(() => 
    selectedConversation ? messages[selectedConversation] || [] : [], 
    [selectedConversation, messages]
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages, scrollToBottom])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return
    
    onSendMessage(selectedConversation, messageInput.trim())
    setMessageInput('')
    setReplyingTo(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm')
    } else if (isYesterday(timestamp)) {
      return 'Ontem'
    } else {
      return format(timestamp, 'dd/MM/yyyy')
    }
  }

  const getConversationName = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId)
    return otherParticipant?.name || 'Conversa'
  }

  const getConversationAvatar = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId)
    return otherParticipant?.avatar
  }

  const isOnline = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId)
    return otherParticipant?.isOnline || false
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Messages Panel */}
      <div className="relative ml-auto h-full w-full max-w-4xl bg-background border-l border-border shadow-2xl flex">
        
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Mensagens</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation.id)
                    onMarkAsRead(conversation.id)
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={getConversationAvatar(conversation)} />
                        <AvatarFallback>
                          {getConversationName(conversation).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline(conversation) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {getConversationName(conversation)}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {getMessageTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.content || 'Nenhuma mensagem'}
                        </p>
                        
                        {conversation.unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="text-xs min-w-[20px] h-5 rounded-full"
                          >
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      {conversation.isTyping && (
                        <p className="text-xs text-primary italic">Digitando...</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversationData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getConversationAvatar(selectedConversationData)} />
                    <AvatarFallback>
                      {getConversationName(selectedConversationData).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {getConversationName(selectedConversationData)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isOnline(selectedConversationData) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversationMessages.map((message) => {
                    const isOwn = message.senderId === currentUserId
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-3 rounded-2xl ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Message reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map((reaction, index) => (
                                  <span
                                    key={`${message.id}-reaction-${index}-${reaction.emoji}`}
                                    className="text-xs bg-background/20 px-2 py-1 rounded-full"
                                  >
                                    {reaction.emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                            isOwn ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{getMessageTime(message.timestamp)}</span>
                            {isOwn && (
                              <div className="flex items-center">
                                {message.delivered ? (
                                  message.read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <CheckCheck className="h-3 w-3" />
                                  )
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Reply Preview */}
              {replyingTo && (
                <div className="px-4 py-2 border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Respondendo a:</p>
                      <p className="text-sm truncate">{replyingTo.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[40px] max-h-32 resize-none"
                      rows={1}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Suas mensagens</h3>
                <p className="text-muted-foreground">
                  Selecione uma conversa para começar a conversar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}