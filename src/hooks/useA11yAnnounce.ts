import { useEffect, useRef } from 'react'

export const useA11yAnnounce = () => {
  const announceRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!announceRef.current) {
      const div = document.createElement('div')
      div.setAttribute('role', 'status')
      div.setAttribute('aria-live', 'polite')
      div.setAttribute('aria-atomic', 'true')
      div.className = 'sr-only'
      document.body.appendChild(div)
      announceRef.current = div
    }

    return () => {
      if (announceRef.current) {
        document.body.removeChild(announceRef.current)
        announceRef.current = null
      }
    }
  }, [])

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = ''

      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = message
        }
      }, 100)
    }
  }

  return announce
}
