import { useEffect, useCallback, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  interactionLatency: number;
}

export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    interactionLatency: 0
  });
  const [isOptimizationEnabled, setIsOptimizationEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'performance' | 'quality' | 'balanced'>('balanced');
  const frameCount = useRef(0);
  const startTime = useRef(Date.now());
  const animationFrameId = useRef<number>();
  const interactionStart = useRef<number>();

  // FPS monitoring
  const monitorFPS = useCallback(() => {
    frameCount.current++;
    const currentTime = Date.now();
    const elapsed = currentTime - startTime.current;
    
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      setMetrics(prev => ({ ...prev, fps }));
      frameCount.current = 0;
      startTime.current = currentTime;
      
      // Auto-adjust performance mode based on FPS
      if (isOptimizationEnabled) {
        if (fps < 30) {
          setPerformanceMode('performance');
        } else if (fps > 55) {
          setPerformanceMode('quality');
        } else {
          setPerformanceMode('balanced');
        }
      }
    }
    
    animationFrameId.current = requestAnimationFrame(monitorFPS);
  }, [isOptimizationEnabled]);

  // Memory usage monitoring
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / (1024 * 1024)); // MB
      setMetrics(prev => ({ ...prev, memoryUsage }));
    }
  }, []);

  // Interaction latency tracking
  const trackInteractionStart = useCallback(() => {
    interactionStart.current = performance.now();
  }, []);

  const trackInteractionEnd = useCallback(() => {
    if (interactionStart.current) {
      const latency = performance.now() - interactionStart.current;
      setMetrics(prev => ({ ...prev, interactionLatency: Math.round(latency) }));
      interactionStart.current = undefined;
    }
  }, []);

  // Apply performance optimizations
  const applyOptimizations = useCallback(() => {
    const root = document.documentElement;
    
    switch (performanceMode) {
      case 'performance':
        // Reduce visual effects for better performance
        root.style.setProperty('--animation-duration', '150ms');
        root.style.setProperty('--transition-duration', '150ms');
        root.style.setProperty('--blur-intensity', '4px');
        root.style.setProperty('--shadow-intensity', '0.3');
        root.classList.add('performance-mode');
        break;
        
      case 'quality':
        // Full visual effects
        root.style.setProperty('--animation-duration', '300ms');
        root.style.setProperty('--transition-duration', '300ms');
        root.style.setProperty('--blur-intensity', '12px');
        root.style.setProperty('--shadow-intensity', '1.0');
        root.classList.remove('performance-mode');
        break;
        
      case 'balanced':
      default:
        // Balanced settings
        root.style.setProperty('--animation-duration', '250ms');
        root.style.setProperty('--transition-duration', '250ms');
        root.style.setProperty('--blur-intensity', '8px');
        root.style.setProperty('--shadow-intensity', '0.7');
        root.classList.remove('performance-mode');
        break;
    }
  }, [performanceMode]);

  // Lazy loading optimization
  const observeElementsForLazyLoading = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Load images lazily
            if (element.tagName === 'IMG' && element.dataset.src) {
              const img = element as HTMLImageElement;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(element);
            }
            
            // Animate elements on enter
            if (element.classList.contains('animate-on-scroll')) {
              element.classList.add('animate-in');
              observer.unobserve(element);
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all lazy-loadable elements
    const lazyImages = document.querySelectorAll('img[data-src]');
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    [...lazyImages, ...animateElements].forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  // Debounced scroll handler for better performance
  const createOptimizedScrollHandler = useCallback((handler: () => void, delay = 16) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecution = 0;
    
    return () => {
      const now = Date.now();
      
      if (now - lastExecution > delay) {
        handler();
        lastExecution = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handler();
          lastExecution = Date.now();
        }, delay);
      }
    };
  }, []);

  // Optimize animations based on device capabilities
  const optimizeAnimations = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasLowMemory = metrics.memoryUsage > 100; // > 100MB
    const hasLowFPS = metrics.fps < 45;
    
    if (prefersReducedMotion || hasLowMemory || hasLowFPS) {
      document.documentElement.classList.add('reduce-animations');
    } else {
      document.documentElement.classList.remove('reduce-animations');
    }
  }, [metrics.fps, metrics.memoryUsage]);

  // Add performance CSS optimizations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Performance mode optimizations */
      .performance-mode * {
        animation-duration: var(--animation-duration, 150ms) !important;
        transition-duration: var(--transition-duration, 150ms) !important;
      }
      
      .performance-mode .backdrop-blur-xl {
        backdrop-filter: blur(var(--blur-intensity, 4px)) !important;
      }
      
      .performance-mode .shadow-xl,
      .performance-mode .shadow-2xl {
        box-shadow: 0 4px 8px rgba(0, 0, 0, var(--shadow-intensity, 0.3)) !important;
      }
      
      /* Reduced animations for accessibility and performance */
      .reduce-animations * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
        scroll-behavior: auto !important;
      }
      
      /* Lazy loading states */
      img[data-src] {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      /* Scroll animations */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* GPU acceleration for better performance */
      .gpu-accelerated {
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Optimized scrolling */
      .smooth-scroll {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        overflow-anchor: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Initialize monitoring
  useEffect(() => {
    if (isOptimizationEnabled) {
      monitorFPS();
      const memoryInterval = setInterval(monitorMemory, 5000);
      const cleanupLazyLoading = observeElementsForLazyLoading();
      
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        clearInterval(memoryInterval);
        cleanupLazyLoading();
      };
    }
  }, [isOptimizationEnabled, monitorFPS, monitorMemory, observeElementsForLazyLoading]);

  // Apply optimizations when performance mode changes
  useEffect(() => {
    applyOptimizations();
    optimizeAnimations();
  }, [performanceMode, applyOptimizations, optimizeAnimations]);

  // Preload critical resources
  const preloadResource = useCallback((url: string, type: 'image' | 'font' | 'script' = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      case 'script':
        link.as = 'script';
        break;
    }
    
    document.head.appendChild(link);
  }, []);

  return {
    metrics,
    performanceMode,
    isOptimizationEnabled,
    setIsOptimizationEnabled,
    setPerformanceMode,
    trackInteractionStart,
    trackInteractionEnd,
    createOptimizedScrollHandler,
    preloadResource,
    applyOptimizations
  };
};