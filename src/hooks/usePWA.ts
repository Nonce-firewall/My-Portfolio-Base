import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  showInstallPrompt: boolean
  installPrompt: BeforeInstallPromptEvent | null
}

const STORAGE_KEYS = {
  INSTALL_DISMISSED: 'pwa-install-dismissed',
  FIRST_VISIT: 'pwa-first-visit',
  LAST_VERSION: 'pwa-last-version'
}

const CURRENT_VERSION = '3.0.0'

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    showInstallPrompt: false,
    installPrompt: null
  })

  const checkIfFirstVisit = useCallback(() => {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT)
    if (!firstVisit) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, Date.now().toString())
      return true
    }
    return false
  }, [])

  const checkInstalled = useCallback(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://')
  }, [])

  useEffect(() => {
    const isInstalled = checkInstalled()
    const isFirstVisit = checkIfFirstVisit()

    setPwaState(prev => ({
      ...prev,
      isInstalled,
      isOffline: !navigator.onLine
    }))

    const updateOnlineStatus = () => {
      setPwaState(prev => ({ ...prev, isOffline: !navigator.onLine }))
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const installEvent = e as BeforeInstallPromptEvent

      const isDismissed = localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED)
      const isAdminPage = window.location.pathname.startsWith('/admin')

      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent,
        showInstallPrompt: false
      }))

      if (!isInstalled && !isDismissed && !isAdminPage) {
        setTimeout(() => {
          setPwaState(prev => ({
            ...prev,
            showInstallPrompt: true
          }))
        }, isFirstVisit ? 15000 : 30000)
      }
    }

    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        showInstallPrompt: false,
        installPrompt: null
      }))

      localStorage.removeItem(STORAGE_KEYS.INSTALL_DISMISSED)
      localStorage.setItem(STORAGE_KEYS.LAST_VERSION, CURRENT_VERSION)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const installApp = useCallback(async () => {
    if (!pwaState.installPrompt) {
      setPwaState(prev => ({ ...prev, showInstallPrompt: false }))
      return false
    }

    try {
      setPwaState(prev => ({ ...prev, showInstallPrompt: false }))

      await pwaState.installPrompt.prompt()
      const { outcome } = await pwaState.installPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('PWA installation accepted')
        localStorage.setItem(STORAGE_KEYS.LAST_VERSION, CURRENT_VERSION)
        return true
      } else {
        console.log('PWA installation dismissed')
        localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, 'true')

        setTimeout(() => {
          localStorage.removeItem(STORAGE_KEYS.INSTALL_DISMISSED)
        }, 7 * 24 * 60 * 60 * 1000)

        return false
      }
    } catch (error) {
      console.error('Error installing PWA:', error)
      setPwaState(prev => ({
        ...prev,
        showInstallPrompt: false
      }))
      return false
    }
  }, [pwaState.installPrompt])

  const dismissInstallPrompt = useCallback(() => {
    setPwaState(prev => ({ ...prev, showInstallPrompt: false }))
    localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, 'true')

    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.INSTALL_DISMISSED)
    }, 7 * 24 * 60 * 60 * 1000)
  }, [])

  const showInstallPromptManually = useCallback(() => {
    if (pwaState.isInstallable && !pwaState.isInstalled) {
      setPwaState(prev => ({ ...prev, showInstallPrompt: true }))
    }
  }, [pwaState.isInstallable, pwaState.isInstalled])

  return {
    ...pwaState,
    installApp,
    dismissInstallPrompt,
    showInstallPromptManually
  }
}