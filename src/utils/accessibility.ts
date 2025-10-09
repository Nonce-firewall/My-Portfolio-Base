export const generateAriaLabel = (text: string, context?: string): string => {
  if (context) {
    return `${text} - ${context}`
  }
  return text
}

export const getContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const [rs, gs, bs] = [r, g, b].map(c => {
      const val = c / 255
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export const meetsWCAGAA = (foreground: string, background: string): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return ratio >= 4.5
}

export const meetsWCAGAAA = (foreground: string, background: string): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return ratio >= 7
}

export const createA11yId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const getReducedMotionPreference = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const getHighContrastPreference = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

export const focusElement = (element: HTMLElement | null, options?: FocusOptions) => {
  if (!element) return

  requestAnimationFrame(() => {
    element.focus(options)
  })
}

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  return (event: KeyboardEvent) => {
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
}
