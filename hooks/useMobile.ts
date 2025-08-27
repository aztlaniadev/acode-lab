import { useState, useEffect, useCallback, useRef } from 'react'

// Device detection hook
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    screenSize: { width: 0, height: 0 },
    orientation: 'portrait' as 'portrait' | 'landscape',
    isStandalone: false,
    hasNotch: false,
    pixelRatio: 1
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Device detection
      const isMobile = width <= 768
      const isTablet = width > 768 && width <= 1024
      const isDesktop = width > 1024
      
      // OS detection
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      
      // Browser detection
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
      const isChrome = /chrome/.test(userAgent)
      
      // Orientation
      const orientation = height > width ? 'portrait' : 'landscape'
      
      // PWA detection
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true
      
      // Notch detection (approximation)
      const hasNotch = isIOS && (
        window.screen.height === 812 || // iPhone X
        window.screen.height === 896 || // iPhone XR/XS Max
        window.screen.height === 844 || // iPhone 12/13 Pro
        window.screen.height === 926    // iPhone 12/13 Pro Max
      )
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        screenSize: { width, height },
        orientation,
        isStandalone,
        hasNotch,
        pixelRatio: window.devicePixelRatio || 1
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Touch gestures hook
export const useTouchGestures = (elementRef: React.RefObject<HTMLElement>) => {
  const [gestureState, setGestureState] = useState({
    isTouch: false,
    touches: 0,
    distance: 0,
    angle: 0,
    center: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 }
  })

  const lastTouch = useRef<{ x: number; y: number; time: number } | null>(null)
  const gestureCallbacks = useRef<{
    onTap?: (e: TouchEvent) => void
    onDoubleTap?: (e: TouchEvent) => void
    onLongPress?: (e: TouchEvent) => void
    onPinch?: (e: TouchEvent, scale: number) => void
    onSwipe?: (e: TouchEvent, direction: string, velocity: number) => void
    onRotate?: (e: TouchEvent, angle: number) => void
  }>({})

  const registerGesture = useCallback((type: string, callback: any) => {
    gestureCallbacks.current[type as keyof typeof gestureCallbacks.current] = callback
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let tapCount = 0
    let tapTimer: NodeJS.Timeout | null = null
    let longPressTimer: NodeJS.Timeout | null = null
    let initialDistance = 0
    let initialAngle = 0

    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0
      const touch1 = touches[0]
      const touch2 = touches[1]
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
    }

    const getTouchAngle = (touches: TouchList) => {
      if (touches.length < 2) return 0
      const touch1 = touches[0]
      const touch2 = touches[1]
      return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX)
    }

    const getTouchCenter = (touches: TouchList) => {
      let x = 0, y = 0
      for (let i = 0; i < touches.length; i++) {
        x += touches[i].clientX
        y += touches[i].clientY
      }
      return { x: x / touches.length, y: y / touches.length }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touches = e.touches
      const center = getTouchCenter(touches)
      
      setGestureState({
        isTouch: true,
        touches: touches.length,
        distance: getTouchDistance(touches),
        angle: getTouchAngle(touches),
        center,
        velocity: { x: 0, y: 0 }
      })

      if (touches.length === 1) {
        // Single touch - potential tap or long press
        tapCount++
        
        if (tapTimer) clearTimeout(tapTimer)
        
        if (tapCount === 1) {
          // Start long press detection
          longPressTimer = setTimeout(() => {
            gestureCallbacks.current.onLongPress?.(e)
            tapCount = 0
          }, 500)
          
          // Set timer for double tap detection
          tapTimer = setTimeout(() => {
            if (tapCount === 1) {
              gestureCallbacks.current.onTap?.(e)
            }
            tapCount = 0
          }, 300)
        } else if (tapCount === 2) {
          // Double tap
          if (longPressTimer) clearTimeout(longPressTimer)
          if (tapTimer) clearTimeout(tapTimer)
          gestureCallbacks.current.onDoubleTap?.(e)
          tapCount = 0
        }
        
        lastTouch.current = {
          x: touches[0].clientX,
          y: touches[0].clientY,
          time: Date.now()
        }
      } else if (touches.length === 2) {
        // Multi-touch - pinch/rotate
        initialDistance = getTouchDistance(touches)
        initialAngle = getTouchAngle(touches)
        
        if (longPressTimer) clearTimeout(longPressTimer)
        if (tapTimer) clearTimeout(tapTimer)
        tapCount = 0
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touches = e.touches
      const center = getTouchCenter(touches)
      
      if (touches.length === 1 && lastTouch.current) {
        // Calculate velocity
        const currentTime = Date.now()
        const timeDiff = currentTime - lastTouch.current.time
        const velocity = {
          x: (touches[0].clientX - lastTouch.current.x) / timeDiff,
          y: (touches[0].clientY - lastTouch.current.y) / timeDiff
        }
        
        setGestureState(prev => ({
          ...prev,
          center,
          velocity
        }))
        
        // Cancel long press on movement
        if (longPressTimer) {
          clearTimeout(longPressTimer)
          longPressTimer = null
        }
      } else if (touches.length === 2) {
        // Pinch/zoom
        const currentDistance = getTouchDistance(touches)
        const currentAngle = getTouchAngle(touches)
        
        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance
          gestureCallbacks.current.onPinch?.(e, scale)
        }
        
        // Rotation
        const angleDiff = currentAngle - initialAngle
        gestureCallbacks.current.onRotate?.(e, angleDiff)
        
        setGestureState(prev => ({
          ...prev,
          distance: currentDistance,
          angle: currentAngle,
          center
        }))
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }

      // Swipe detection
      if (lastTouch.current && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - lastTouch.current.x
        const deltaY = touch.clientY - lastTouch.current.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const timeDiff = Date.now() - lastTouch.current.time
        const velocity = distance / timeDiff

        if (distance > 50 && velocity > 0.1) {
          let direction = ''
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left'
          } else {
            direction = deltaY > 0 ? 'down' : 'up'
          }
          gestureCallbacks.current.onSwipe?.(e, direction, velocity)
        }
      }

      setGestureState(prev => ({
        ...prev,
        isTouch: false,
        touches: e.touches.length
      }))
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      
      if (tapTimer) clearTimeout(tapTimer)
      if (longPressTimer) clearTimeout(longPressTimer)
    }
  }, [elementRef])

  return { gestureState, registerGesture }
}

// Haptic feedback hook
export const useHapticFeedback = () => {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('vibrate' in navigator)
  }, [])

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!isSupported) return false

    try {
      navigator.vibrate(pattern)
      return true
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
      return false
    }
  }, [isSupported])

  const lightImpact = useCallback(() => vibrate(10), [vibrate])
  const mediumImpact = useCallback(() => vibrate(20), [vibrate])
  const heavyImpact = useCallback(() => vibrate(30), [vibrate])
  const selectionChanged = useCallback(() => vibrate(5), [vibrate])
  const notificationSuccess = useCallback(() => vibrate([100, 50, 100]), [vibrate])
  const notificationWarning = useCallback(() => vibrate([100, 50, 100, 50, 100]), [vibrate])
  const notificationError = useCallback(() => vibrate([200, 100, 200]), [vibrate])

  return {
    isSupported,
    vibrate,
    lightImpact,
    mediumImpact,
    heavyImpact,
    selectionChanged,
    notificationSuccess,
    notificationWarning,
    notificationError
  }
}

// Safe area hook (for devices with notches)
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0')
      })
    }

    updateSafeArea()
    window.addEventListener('orientationchange', updateSafeArea)

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea)
    }
  }, [])

  return safeArea
}

// Network status hook for mobile
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    effectiveType: '4g' as '2g' | '3g' | '4g' | 'slow-2g',
    downlink: 10,
    rtt: 50,
    saveData: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      setNetworkStatus({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || 10,
        rtt: connection?.rtt || 50,
        saveData: connection?.saveData || false
      })
    }

    updateNetworkStatus()

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus)
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [])

  return networkStatus
}

// Mobile keyboard detection
export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initialHeight = window.innerHeight
    
    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDifference = initialHeight - currentHeight
      
      // Keyboard is likely open if height decreased by more than 150px
      if (heightDifference > 150) {
        setKeyboardHeight(heightDifference)
        setIsKeyboardOpen(true)
      } else {
        setKeyboardHeight(0)
        setIsKeyboardOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    // For iOS devices, also listen for visual viewport changes
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport!
      
      const handleViewportChange = () => {
        const heightDifference = window.innerHeight - visualViewport.height
        setKeyboardHeight(heightDifference)
        setIsKeyboardOpen(heightDifference > 150)
      }

      visualViewport.addEventListener('resize', handleViewportChange)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        visualViewport.removeEventListener('resize', handleViewportChange)
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { keyboardHeight, isKeyboardOpen }
}

// Orientation lock hook
export const useOrientationLock = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('orientationchange', updateOrientation)
    window.addEventListener('resize', updateOrientation)

    return () => {
      window.removeEventListener('orientationchange', updateOrientation)
      window.removeEventListener('resize', updateOrientation)
    }
  }, [])

  const lockOrientation = useCallback(async (targetOrientation: string) => {
    // Check if the lock method exists (it may not be available in all browsers)
    if (!screen.orientation || !('lock' in screen.orientation)) {
      console.warn('Orientation lock not supported')
      return false
    }

    try {
      await (screen.orientation as any).lock(targetOrientation)
      setIsLocked(true)
      return true
    } catch (error) {
      console.warn('Failed to lock orientation:', error)
      return false
    }
  }, [])

  const unlockOrientation = useCallback(() => {
    // Check if the unlock method exists (it may not be available in all browsers)
    if (!screen.orientation || !('unlock' in screen.orientation)) {
      console.warn('Orientation unlock not supported')
      return false
    }

    try {
      (screen.orientation as any).unlock()
      setIsLocked(false)
      return true
    } catch (error) {
      console.warn('Failed to unlock orientation:', error)
      return false
    }
  }, [])

  return {
    orientation,
    isLocked,
    lockOrientation,
    unlockOrientation
  }
}

// Mobile performance monitoring
export const useMobilePerformance = () => {
  const [performance, setPerformance] = useState({
    memory: { used: 0, total: 0, limit: 0 },
    battery: { level: 1, charging: false },
    fps: 60,
    connectionSpeed: 'fast' as 'slow' | 'fast'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updatePerformance = async () => {
      const perfData = { ...performance }

      // Memory information
      if (typeof window !== 'undefined' && window.performance && 'memory' in window.performance) {
        const memory = (window.performance as any).memory
        perfData.memory = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        }
      }

      // Battery information
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery()
          perfData.battery = {
            level: battery.level,
            charging: battery.charging
          }
        } catch (error) {
          // Battery API not available
        }
      }

      // FPS estimation (check if performance.now is available)
      if (typeof window !== 'undefined' && window.performance && window.performance.now) {
        let lastTime = window.performance.now()
        let frameCount = 0
        
        const countFrames = () => {
          frameCount++
          if (frameCount === 60) {
            const currentTime = window.performance.now()
            const fps = Math.round(60000 / (currentTime - lastTime))
            perfData.fps = fps
            setPerformance(perfData)
            frameCount = 0
            lastTime = currentTime
          }
          requestAnimationFrame(countFrames)
        }
        requestAnimationFrame(countFrames)
      }

      // Connection speed estimation
      const connection = (navigator as any).connection
      if (connection) {
        perfData.connectionSpeed = connection.effectiveType === '4g' ? 'fast' : 'slow'
      }

      setPerformance(perfData)
    }

    updatePerformance()
  }, [])

  return performance
}