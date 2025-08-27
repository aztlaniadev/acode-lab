import { useEffect, useRef, useState, useCallback } from 'react'
import { globalCache } from './cache'

// Types
export interface RealTimeEvent {
  type: string
  data: any
  timestamp: number
  userId?: string
  roomId?: string
  metadata?: Record<string, any>
}

export interface ConnectionStatus {
  connected: boolean
  reconnecting: boolean
  lastConnected?: Date
  connectionCount: number
  latency: number
}

export interface RealTimeConfig {
  url?: string
  reconnectAttempts: number
  reconnectDelay: number
  heartbeatInterval: number
  enableCompression: boolean
  enableBinaryMode: boolean
  maxMessageSize: number
}

// WebSocket Manager
export class RealTimeManager {
  private static instance: RealTimeManager
  private ws: WebSocket | null = null
  private config: RealTimeConfig
  private listeners = new Map<string, Set<(event: RealTimeEvent) => void>>()
  private connectionStatus: ConnectionStatus = {
    connected: false,
    reconnecting: false,
    connectionCount: 0,
    latency: 0
  }
  private reconnectTimer?: NodeJS.Timeout
  private heartbeatTimer?: NodeJS.Timeout
  private reconnectAttempts = 0
  private messageQueue: RealTimeEvent[] = []
  private rooms = new Set<string>()
  private presenceData = new Map<string, any>()
  
  constructor(config: Partial<RealTimeConfig> = {}) {
    this.config = {
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
      reconnectAttempts: 5,
      reconnectDelay: 1000,
      heartbeatInterval: 30000,
      enableCompression: true,
      enableBinaryMode: false,
      maxMessageSize: 1024 * 1024, // 1MB
      ...config
    }
  }

  static getInstance(config?: Partial<RealTimeConfig>): RealTimeManager {
    if (!RealTimeManager.instance) {
      RealTimeManager.instance = new RealTimeManager(config)
    }
    return RealTimeManager.instance
  }

  // Connection Management
  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      const wsUrl = userId 
        ? `${this.config.url}?userId=${userId}`
        : this.config.url

      try {
        this.ws = new WebSocket(wsUrl!)
        
        // Enable compression if supported
        if (this.config.enableCompression && 'permessage-deflate' in this.ws) {
          this.ws.binaryType = 'arraybuffer'
        }

        this.ws.onopen = () => {
          this.connectionStatus.connected = true
          this.connectionStatus.reconnecting = false
          this.connectionStatus.lastConnected = new Date()
          this.connectionStatus.connectionCount++
          this.reconnectAttempts = 0
          
          console.log('🔗 WebSocket connected')
          
          // Process queued messages
          this.processMessageQueue()
          
          // Start heartbeat
          this.startHeartbeat()
          
          // Emit connection event
          this.emit('connection:open', {
            status: this.connectionStatus,
            timestamp: Date.now()
          })
          
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event)
        }

        this.ws.onclose = (event) => {
          this.handleClose(event)
        }

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error)
          this.emit('connection:error', { error, timestamp: Date.now() })
          reject(error)
        }

      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error)
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    
    this.connectionStatus.connected = false
    this.connectionStatus.reconnecting = false
    
    this.emit('connection:close', {
      status: this.connectionStatus,
      timestamp: Date.now()
    })
  }

  // Message Handling
  private handleMessage(event: MessageEvent): void {
    try {
      let data: RealTimeEvent
      
      if (event.data instanceof ArrayBuffer) {
        // Handle binary messages
        const decoder = new TextDecoder()
        data = JSON.parse(decoder.decode(event.data))
      } else {
        data = JSON.parse(event.data)
      }
      
      // Update latency if it's a pong message
      if (data.type === 'pong' && data.metadata?.pingTime) {
        this.connectionStatus.latency = Date.now() - data.metadata.pingTime
        return
      }
      
      // Cache real-time updates
      if (data.type.includes('update') || data.type.includes('new')) {
        this.cacheUpdate(data)
      }
      
      // Emit to listeners
      this.emit(data.type, data)
      
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error)
    }
  }

  private handleClose(event: CloseEvent): void {
    this.connectionStatus.connected = false
    
    console.log('🔌 WebSocket disconnected:', event.code, event.reason)
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
    
    // Attempt reconnection if not a clean close
    if (event.code !== 1000 && this.reconnectAttempts < this.config.reconnectAttempts) {
      this.attemptReconnection()
    }
    
    this.emit('connection:close', {
      code: event.code,
      reason: event.reason,
      timestamp: Date.now()
    })
  }

  private attemptReconnection(): void {
    if (this.connectionStatus.reconnecting) return
    
    this.connectionStatus.reconnecting = true
    this.reconnectAttempts++
    
    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.config.reconnectAttempts} in ${delay}ms`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        if (this.reconnectAttempts >= this.config.reconnectAttempts) {
          console.error('❌ Max reconnection attempts reached')
          this.connectionStatus.reconnecting = false
          this.emit('connection:failed', {
            attempts: this.reconnectAttempts,
            timestamp: Date.now()
          })
        }
      })
    }, delay)
  }

  // Event System
  on(eventType: string, callback: (event: RealTimeEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    
    this.listeners.get(eventType)!.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  off(eventType: string, callback?: (event: RealTimeEvent) => void): void {
    if (callback) {
      this.listeners.get(eventType)?.delete(callback)
    } else {
      this.listeners.delete(eventType)
    }
  }

  emit(eventType: string, data: any): void {
    const event: RealTimeEvent = {
      type: eventType,
      data,
      timestamp: Date.now()
    }
    
    this.listeners.get(eventType)?.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('❌ Event callback error:', error)
      }
    })
  }

  // Message Sending
  send(type: string, data: any, options: {
    roomId?: string
    targetUserId?: string
    priority?: 'high' | 'normal' | 'low'
    reliable?: boolean
  } = {}): void {
    const message: RealTimeEvent = {
      type,
      data,
      timestamp: Date.now(),
      roomId: options.roomId,
      metadata: {
        priority: options.priority || 'normal',
        reliable: options.reliable || false
      }
    }
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        const payload = JSON.stringify(message)
        
        // Check message size
        if (payload.length > this.config.maxMessageSize) {
          console.warn('⚠️ Message size exceeds limit:', payload.length)
          return
        }
        
        this.ws.send(payload)
      } catch (error) {
        console.error('❌ Failed to send message:', error)
        
        // Queue message if reliable
        if (options.reliable) {
          this.messageQueue.push(message)
        }
      }
    } else {
      // Queue message for later
      this.messageQueue.push(message)
    }
  }

  // Room Management
  joinRoom(roomId: string): void {
    this.rooms.add(roomId)
    this.send('room:join', { roomId })
  }

  leaveRoom(roomId: string): void {
    this.rooms.delete(roomId)
    this.send('room:leave', { roomId })
  }

  // Presence System
  updatePresence(data: any): void {
    this.presenceData.set('self', data)
    this.send('presence:update', data)
  }

  getPresence(userId?: string): any {
    return userId ? this.presenceData.get(userId) : this.presenceData
  }

  // Typing Indicators
  startTyping(roomId: string): void {
    this.send('typing:start', { roomId })
  }

  stopTyping(roomId: string): void {
    this.send('typing:stop', { roomId })
  }

  // Utility Methods
  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return
    
    console.log(`📬 Processing ${this.messageQueue.length} queued messages`)
    
    const messages = [...this.messageQueue]
    this.messageQueue = []
    
    messages.forEach(message => {
      try {
        this.ws?.send(JSON.stringify(message))
      } catch (error) {
        console.error('❌ Failed to send queued message:', error)
      }
    })
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { pingTime: Date.now() })
      }
    }, this.config.heartbeatInterval)
  }

  private cacheUpdate(event: RealTimeEvent): void {
    // Intelligent cache invalidation based on event type
    const cache = globalCache
    
    switch (event.type) {
      case 'post:new':
      case 'post:update':
        cache.invalidateByTag('posts')
        break
      case 'comment:new':
        cache.invalidateByTag('comments')
        break
      case 'user:update':
        cache.invalidateByTag('users')
        break
      case 'notification:new':
        cache.invalidateByTag('notifications')
        break
    }
  }

  // Status Methods
  getStatus(): ConnectionStatus {
    return { ...this.connectionStatus }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.connectionStatus.connected
  }

  getRooms(): string[] {
    return Array.from(this.rooms)
  }

  getQueueSize(): number {
    return this.messageQueue.length
  }

  // Cleanup
  destroy(): void {
    this.disconnect()
    this.listeners.clear()
    this.rooms.clear()
    this.presenceData.clear()
    this.messageQueue = []
  }
}

// React Hooks
export const useRealTime = (eventTypes?: string[]) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    reconnecting: false,
    connectionCount: 0,
    latency: 0
  })
  
  const manager = RealTimeManager.getInstance()
  const listenersRef = useRef<(() => void)[]>([])
  
  useEffect(() => {
    // Update status
    const updateStatus = () => setStatus(manager.getStatus())
    
    const connectionListener = manager.on('connection:open', updateStatus)
    const closeListener = manager.on('connection:close', updateStatus)
    const errorListener = manager.on('connection:error', updateStatus)
    
    listenersRef.current = [connectionListener, closeListener, errorListener]
    
    updateStatus()
    
    return () => {
      listenersRef.current.forEach(unsubscribe => unsubscribe())
    }
  }, [manager])
  
  const send = useCallback((type: string, data: any, options?: any) => {
    manager.send(type, data, options)
  }, [manager])
  
  const connect = useCallback((userId?: string) => {
    return manager.connect(userId)
  }, [manager])
  
  const disconnect = useCallback(() => {
    manager.disconnect()
  }, [manager])
  
  return {
    status,
    send,
    connect,
    disconnect,
    isConnected: status.connected,
    latency: status.latency
  }
}

export const useRealTimeEvent = <T = any>(
  eventType: string,
  callback: (data: T) => void,
  deps: any[] = []
) => {
  const manager = RealTimeManager.getInstance()
  
  useEffect(() => {
    const unsubscribe = manager.on(eventType, (event) => {
      callback(event.data)
    })
    
    return unsubscribe
  }, [eventType, callback, manager, ...deps])
}

export const usePresence = (roomId?: string) => {
  const [users, setUsers] = useState<Record<string, any>>({})
  const [isTyping, setIsTyping] = useState<string[]>([])
  const manager = RealTimeManager.getInstance()
  
  useEffect(() => {
    if (roomId) {
      manager.joinRoom(roomId)
    }
    
    const presenceUpdate = manager.on('presence:update', (event) => {
      setUsers(prev => ({
        ...prev,
        [event.userId!]: event.data
      }))
    })
    
    const typingStart = manager.on('typing:start', (event) => {
      setIsTyping(prev => Array.from(new Set([...prev, event.userId!])))
    })
    
    const typingStop = manager.on('typing:stop', (event) => {
      setIsTyping(prev => prev.filter(id => id !== event.userId))
    })
    
    return () => {
      presenceUpdate()
      typingStart()
      typingStop()
      
      if (roomId) {
        manager.leaveRoom(roomId)
      }
    }
  }, [roomId, manager])
  
  const updatePresence = useCallback((data: any) => {
    manager.updatePresence(data)
  }, [manager])
  
  const startTyping = useCallback(() => {
    if (roomId) manager.startTyping(roomId)
  }, [roomId, manager])
  
  const stopTyping = useCallback(() => {
    if (roomId) manager.stopTyping(roomId)
  }, [roomId, manager])
  
  return {
    users,
    isTyping,
    updatePresence,
    startTyping,
    stopTyping
  }
}

// Global instance
export const realTimeManager = RealTimeManager.getInstance()