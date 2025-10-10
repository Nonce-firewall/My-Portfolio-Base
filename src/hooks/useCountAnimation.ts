import { useState, useEffect, useRef, useCallback } from 'react'

export const useCountAnimation = (
  endValue: number,
  duration: number = 2000,
  startOnView: boolean = true
) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  const animateCount = useCallback(() => {
    if (hasAnimated) return

    const startTime = performance.now()
    const startValue = 0

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCount)
      } else {
        setCount(endValue)
        setHasAnimated(true)
      }
    }

    rafRef.current = requestAnimationFrame(updateCount)
  }, [endValue, duration, hasAnimated])

  useEffect(() => {
    if (!startOnView) {
      animateCount()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCount()
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    )

    const element = elementRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      observer.disconnect()
    }
  }, [animateCount, hasAnimated, startOnView])

  return { count, elementRef }
}