import { useEffect, RefObject } from 'react'

export const useFocusTrap = (
  ref: RefObject<HTMLElement>,
  isActive: boolean = true
) => {
  useEffect(() => {
    if (!isActive) return

    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    firstElement?.focus()

    element.addEventListener('keydown', handleTabKey)

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [ref, isActive])
}
