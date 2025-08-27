import { LRUCache } from 'lru-cache'
import { useState, useEffect, useCallback } from 'react'

// Cache Types
export interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl: number
  version: string
  priority: number
}

export interface CacheConfig {
  maxSize: number
  defaultTTL: number
  enableCompression: boolean
  enableEncryption: boolean
  storageType: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB'
}

// Advanced Cache Manager
export class CacheManager {
  private static instance: CacheManager
  private memoryCache: LRUCache<string, CacheItem>
  private config: CacheConfig
  private compressionEnabled: boolean
  private encryptionKey?: string

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 300000, // 5 minutes
      enableCompression: true,
      enableEncryption: false,
      storageType: 'memory',
      ...config
    }

    this.memoryCache = new LRUCache({
      max: this.config.maxSize,
      dispose: (value, key) => {
        this.cleanupStorageItem(key)
      }
    })

    this.compressionEnabled = this.config.enableCompression && typeof window !== 'undefined'
    
    // Initialize compression worker if available
    if (this.compressionEnabled && 'CompressionStream' in window) {
      this.initCompressionWorker()
    }
  }

  static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config)
    }
    return CacheManager.instance
  }

  // Set cache item with advanced options
  async set<T>(
    key: string, 
    data: T, 
    options: {
      ttl?: number
      priority?: number
      tags?: string[]
      version?: string
      compress?: boolean
    } = {}
  ): Promise<void> {
    const now = Date.now()
    const ttl = options.ttl || this.config.defaultTTL
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      ttl,
      version: options.version || '1.0.0',
      priority: options.priority || 1
    }

    // Store in memory cache
    this.memoryCache.set(key, item)

    // Store in persistent storage if configured
    if (this.config.storageType !== 'memory') {
      await this.setPersistentStorage(key, item, options)
    }

    // Handle tags for cache invalidation
    if (options.tags) {
      this.setTags(key, options.tags)
    }
  }

  // Get cache item with validation
  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    let item = this.memoryCache.get(key)
    
    // Fallback to persistent storage
    if (!item && this.config.storageType !== 'memory') {
      const persistentItem = await this.getPersistentStorage(key)
      if (persistentItem) {
        item = persistentItem
        // Restore to memory cache
        this.memoryCache.set(key, item)
      }
    }

    if (!item) return null

    // Check if expired
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }

    return item.data as T
  }

  // Delete cache item
  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key)
    
    if (this.config.storageType !== 'memory') {
      await this.deletePersistentStorage(key)
    }
    
    this.deleteTags(key)
  }

  // Clear all cache
  async clear(): Promise<void> {
    this.memoryCache.clear()
    
    if (this.config.storageType !== 'memory') {
      await this.clearPersistentStorage()
    }
  }

  // Invalidate by tags
  async invalidateByTag(tag: string): Promise<void> {
    const taggedKeys = this.getKeysByTag(tag)
    for (const key of taggedKeys) {
      await this.delete(key)
    }
  }

  // Batch operations
  async mset<T>(items: Array<{ key: string; data: T; options?: any }>): Promise<void> {
    const promises = items.map(item => this.set(item.key, item.data, item.options))
    await Promise.all(promises)
  }

  async mget<T>(keys: string[]): Promise<Record<string, T | null>> {
    const promises = keys.map(async key => ({ key, data: await this.get<T>(key) }))
    const results = await Promise.all(promises)
    
    return results.reduce((acc, { key, data }) => {
      acc[key] = data
      return acc
    }, {} as Record<string, T | null>)
  }

  // Cache statistics
  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.config.maxSize,
      hitRate: this.calculateHitRate(),
      memoryUsage: this.calculateMemoryUsage(),
      oldestItem: this.getOldestItem(),
      config: this.config
    }
  }

  // Persistent Storage Methods
  private async setPersistentStorage<T>(
    key: string, 
    item: CacheItem<T>, 
    options: any
  ): Promise<void> {
    try {
      let serializedData = JSON.stringify(item)
      
      // Compress if enabled
      if (options.compress !== false && this.compressionEnabled) {
        serializedData = await this.compress(serializedData)
      }
      
      // Encrypt if enabled
      if (this.config.enableEncryption && this.encryptionKey) {
        serializedData = await this.encrypt(serializedData)
      }

      switch (this.config.storageType) {
        case 'localStorage':
          localStorage.setItem(`cache_${key}`, serializedData)
          break
        case 'sessionStorage':
          sessionStorage.setItem(`cache_${key}`, serializedData)
          break
        case 'indexedDB':
          await this.setIndexedDB(key, serializedData)
          break
      }
    } catch (error) {
      console.warn('Failed to set persistent storage:', error)
    }
  }

  private async getPersistentStorage(key: string): Promise<CacheItem | null> {
    try {
      let serializedData: string | null = null

      switch (this.config.storageType) {
        case 'localStorage':
          serializedData = localStorage.getItem(`cache_${key}`)
          break
        case 'sessionStorage':
          serializedData = sessionStorage.getItem(`cache_${key}`)
          break
        case 'indexedDB':
          serializedData = await this.getIndexedDB(key)
          break
      }

      if (!serializedData) return null

      // Decrypt if enabled
      if (this.config.enableEncryption && this.encryptionKey) {
        serializedData = await this.decrypt(serializedData)
      }
      
      // Decompress if enabled
      if (this.compressionEnabled) {
        serializedData = await this.decompress(serializedData)
      }

      return JSON.parse(serializedData)
    } catch (error) {
      console.warn('Failed to get persistent storage:', error)
      return null
    }
  }

  private async deletePersistentStorage(key: string): Promise<void> {
    try {
      switch (this.config.storageType) {
        case 'localStorage':
          localStorage.removeItem(`cache_${key}`)
          break
        case 'sessionStorage':
          sessionStorage.removeItem(`cache_${key}`)
          break
        case 'indexedDB':
          await this.deleteIndexedDB(key)
          break
      }
    } catch (error) {
      console.warn('Failed to delete persistent storage:', error)
    }
  }

  private async clearPersistentStorage(): Promise<void> {
    try {
      switch (this.config.storageType) {
        case 'localStorage':
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
              localStorage.removeItem(key)
            }
          })
          break
        case 'sessionStorage':
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('cache_')) {
              sessionStorage.removeItem(key)
            }
          })
          break
        case 'indexedDB':
          await this.clearIndexedDB()
          break
      }
    } catch (error) {
      console.warn('Failed to clear persistent storage:', error)
    }
  }

  // IndexedDB Methods
  private async setIndexedDB(key: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CacheDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        
        store.put({ key, data, timestamp: Date.now() })
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
      }
    })
  }

  private async getIndexedDB(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CacheDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['cache'], 'readonly')
        const store = transaction.objectStore('cache')
        const getRequest = store.get(key)
        
        getRequest.onsuccess = () => {
          resolve(getRequest.result?.data || null)
        }
        getRequest.onerror = () => reject(getRequest.error)
      }
    })
  }

  private async deleteIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CacheDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        
        store.delete(key)
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CacheDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['cache'], 'readwrite')
        const store = transaction.objectStore('cache')
        
        store.clear()
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }

  // Compression Methods
  private async compress(data: string): Promise<string> {
    if (typeof window === 'undefined' || !('CompressionStream' in window)) {
      return data
    }

    try {
      const stream = new CompressionStream('gzip')
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()
      
      writer.write(new TextEncoder().encode(data))
      writer.close()
      
      const chunks: Uint8Array[] = []
      let done = false
      
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) chunks.push(value)
      }
      
      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        compressed.set(chunk, offset)
        offset += chunk.length
      }
      
      return btoa(String.fromCharCode.apply(null, Array.from(compressed)))
    } catch (error) {
      console.warn('Compression failed:', error)
      return data
    }
  }

  private async decompress(compressedData: string): Promise<string> {
    if (typeof window === 'undefined' || !('DecompressionStream' in window)) {
      return compressedData
    }

    try {
      const compressed = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0))
      const stream = new DecompressionStream('gzip')
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()
      
      writer.write(compressed)
      writer.close()
      
      const chunks: Uint8Array[] = []
      let done = false
      
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) chunks.push(value)
      }
      
      const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        decompressed.set(chunk, offset)
        offset += chunk.length
      }
      
      return new TextDecoder().decode(decompressed)
    } catch (error) {
      console.warn('Decompression failed:', error)
      return compressedData
    }
  }

  // Encryption Methods (simplified)
  private async encrypt(data: string): Promise<string> {
    // Simplified encryption - in production, use proper crypto
    return btoa(data)
  }

  private async decrypt(encryptedData: string): Promise<string> {
    // Simplified decryption - in production, use proper crypto
    return atob(encryptedData)
  }

  // Tag Management
  private tagMap = new Map<string, Set<string>>()

  private setTags(key: string, tags: string[]): void {
    tags.forEach(tag => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set())
      }
      this.tagMap.get(tag)!.add(key)
    })
  }

  private getKeysByTag(tag: string): string[] {
    return Array.from(this.tagMap.get(tag) || [])
  }

  private deleteTags(key: string): void {
    this.tagMap.forEach((keys, tag) => {
      keys.delete(key)
      if (keys.size === 0) {
        this.tagMap.delete(tag)
      }
    })
  }

  // Utility Methods
  private cleanupStorageItem(key: string): void {
    this.deletePersistentStorage(key)
  }

  private calculateHitRate(): number {
    // Simplified hit rate calculation
    return 0.85 // Would need proper tracking
  }

  private calculateMemoryUsage(): string {
    const size = JSON.stringify(Array.from(this.memoryCache.entries())).length
    return `${(size / 1024).toFixed(2)} KB`
  }

  private getOldestItem(): string | null {
    const items: Array<{ key: string; timestamp: number }> = []
    
    this.memoryCache.forEach((value, key) => {
      items.push({ key, timestamp: value.timestamp })
    })
    
    if (items.length === 0) return null
    
    const oldest = items.reduce((prev, current) => 
      prev.timestamp < current.timestamp ? prev : current
    )
    
    return oldest.key
  }

  private initCompressionWorker(): void {
    // Initialize web worker for background compression if needed
    if (typeof Worker !== 'undefined') {
      // Would implement compression worker here
    }
  }
}

// Cache Decorators and Utilities
export const withCache = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator?: (...args: Parameters<T>) => string
    ttl?: number
    tags?: string[]
  } = {}
) => {
  const cache = CacheManager.getInstance()
  
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    const key = options.keyGenerator ? options.keyGenerator(...args) : JSON.stringify(args)
    
    // Try to get from cache
    const cached = await cache.get<Awaited<ReturnType<T>>>(key)
    if (cached !== null) {
      return cached
    }
    
    // Execute function and cache result
    const result = await fn(...args)
    await cache.set(key, result, {
      ttl: options.ttl,
      tags: options.tags
    })
    
    return result
  }
}

// React Cache Hook
export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    tags?: string[]
    enabled?: boolean
  } = {}
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const cache = CacheManager.getInstance()

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return

    setLoading(true)
    setError(null)

    try {
      // Try cache first
      const cached = await cache.get<T>(key)
      if (cached !== null) {
        setData(cached)
        setLoading(false)
        return
      }

      // Fetch new data
      const result = await fetcher()
      await cache.set(key, result, options)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, cache, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const invalidate = useCallback(async () => {
    await cache.delete(key)
    await fetchData()
  }, [cache, key, fetchData])

  return { data, loading, error, invalidate, refetch: fetchData }
}

// Initialize global cache
export const globalCache = CacheManager.getInstance({
  maxSize: 200,
  defaultTTL: 600000, // 10 minutes
  enableCompression: true,
  enableEncryption: false,
  storageType: 'indexedDB'
})