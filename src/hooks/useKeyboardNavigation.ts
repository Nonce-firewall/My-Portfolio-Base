import { useEffect, RefObject } from 'react'

interface UseKeyboardNavigationOptions {
  onEnter?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onSpace?: () => void
}

export const useKeyboardNavigation = (
  ref: RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions = {}
) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (options.onEnter) {
            event.preventDefault()
            options.onEnter()
          }
          break
        case 'Escape':
          if (options.onEscape) {
            event.preventDefault()
            options.onEscape()
          }
          break
        case 'ArrowUp':
          if (options.onArrowUp) {
            event.preventDefault()
            options.onArrowUp()
          }
          break
        case 'ArrowDown':
          if (options.onArrowDown) {
            event.preventDefault()
            options.onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (options.onArrowLeft) {
            event.preventDefault()
            options.onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (options.onArrowRight) {
            event.preventDefault()
            options.onArrowRight()
          }
          break
        case ' ':
          if (options.onSpace) {
            event.preventDefault()
            options.onSpace()
          }
          break
        default:
          break
      }
    }

    element.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, options])
}
