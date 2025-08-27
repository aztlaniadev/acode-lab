import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
// import { useIntersection } from '@/hooks/useIntersection'

// Performance Monitor
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track component render times
  trackRender(componentName: string, renderTime: number) {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, [])
    }
    this.metrics.get(componentName)!.push(renderTime)
    
    // Keep only last 10 measurements
    const times = this.metrics.get(componentName)!
    if (times.length > 10) {
      times.shift()
    }
    
    // Alert if average render time > 16ms (60fps threshold)
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    if (avgTime > 16) {
      console.warn(`⚠️ Performance: ${componentName} average render time: ${avgTime.toFixed(2)}ms`)
    }
  }

  // Track API response times
  trackAPI(endpoint: string, responseTime: number) {
    const key = `api_${endpoint}`
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    this.metrics.get(key)!.push(responseTime)
    
    // Keep only last 5 measurements
    const times = this.metrics.get(key)!
    if (times.length > 5) {
      times.shift()
    }
  }

  // Get performance report
  getReport() {
    const report: Record<string, any> = {}
    this.metrics.forEach((times, key) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      const min = Math.min(...times)
      const max = Math.max(...times)
      report[key] = { avg: avg.toFixed(2), min, max, samples: times.length }
    })
    return report
  }

  // Monitor Web Vitals
  initWebVitals() {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('🎨 FCP:', entry.startTime.toFixed(2), 'ms')
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('🖼️ LCP:', entry.startTime.toFixed(2), 'ms')
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          console.log('📏 CLS:', (entry as any).value.toFixed(4))
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Smart Image Lazy Loading Hook
export const useSmartImageLoading = (src: string, options?: {
  rootMargin?: string
  threshold?: number
  placeholder?: string
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(options?.placeholder || '')
  
  // const { isIntersecting } = useIntersection(imgRef, {
  //   rootMargin: options?.rootMargin || '50px',
  //   threshold: options?.threshold || 0.1
  // })

  useEffect(() => {
    // if (isIntersecting && !isLoaded && src) {
    if (!isLoaded && src) {
      const img = new Image()
      img.onload = () => {
        setCurrentSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => setError(true)
      img.src = src
    }
  }, [src, isLoaded])

  return { imgRef, currentSrc, isLoaded, error }
}

// Virtual Scrolling Hook
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, startIndex, endIndex])
  
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  }
}

// Component Performance Tracker
export const usePerformanceTracker = (componentName: string) => {
  const renderStart = useRef<number>(0)
  const monitor = PerformanceMonitor.getInstance()
  
  useEffect(() => {
    renderStart.current = performance.now()
  })
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart.current
    monitor.trackRender(componentName, renderTime)
  })
}

// Debounced Value Hook
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Throttled Callback Hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(0)
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastRun.current >= delay) {
      lastRun.current = now
      return callback(...args)
    }
  }, [callback, delay]) as T
}

// Memory Usage Monitor
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          used: ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2),
          total: ((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2),
          limit: ((performance as any).memory.jsHeapSizeLimit / 1048576).toFixed(2)
        })
      }
    }
    
    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return memoryInfo
}

// Bundle Size Analyzer
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return {}
  
  const scripts = Array.from(document.scripts)
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const analysis = {
    scripts: scripts.length,
    stylesheets: stylesheets.length,
    totalRequests: scripts.length + stylesheets.length,
    estimatedSize: scripts.length * 50 + stylesheets.length * 20 // rough estimate in KB
  }
  
  return analysis
}

// Resource Loading Optimizer
export class ResourceOptimizer {
  private static loadedResources = new Set<string>()
  private static loadingPromises = new Map<string, Promise<any>>()
  
  static async loadImage(src: string): Promise<HTMLImageElement> {
    if (this.loadedResources.has(src)) {
      const img = new Image()
      img.src = src
      return img
    }
    
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!
    }
    
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.loadedResources.add(src)
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
    
    this.loadingPromises.set(src, promise)
    return promise
  }
  
  static preloadImages(srcs: string[]) {
    srcs.forEach(src => {
      if (!this.loadedResources.has(src)) {
        this.loadImage(src).catch(() => {
          // Silently handle errors for preloading
        })
      }
    })
  }
  
  static clearCache() {
    this.loadedResources.clear()
    this.loadingPromises.clear()
  }
}

// Code Splitting Utilities
export const loadComponent = async (importFn: () => Promise<any>) => {
  try {
    const moduleResult = await importFn()
    return moduleResult.default || moduleResult
  } catch (error) {
    console.error('Failed to load component:', error)
    throw error
  }
}

// Performance Presets
export const PERFORMANCE_PRESETS = {
  development: {
    enableMonitoring: true,
    virtualScrollThreshold: 50,
    imageLazyLoadMargin: '100px',
    debounceDelay: 300,
    throttleDelay: 100
  },
  production: {
    enableMonitoring: false,
    virtualScrollThreshold: 100,
    imageLazyLoadMargin: '50px',
    debounceDelay: 150,
    throttleDelay: 50
  }
} as const

// Performance Configuration
export const getPerformanceConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  return isProduction ? PERFORMANCE_PRESETS.production : PERFORMANCE_PRESETS.development
}

// Initialize Performance Monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return
  
  const config = getPerformanceConfig()
  if (!config.enableMonitoring) return
  
  const monitor = PerformanceMonitor.getInstance()
  monitor.initWebVitals()
  
  // Log performance report every 30 seconds in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      console.table(monitor.getReport())
    }, 30000)
  }
}