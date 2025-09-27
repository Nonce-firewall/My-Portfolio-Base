// hooks/usePWA.ts

import { useState, useEffect, useCallback } from 'react'

// Define the event interface for older TypeScript versions
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = (onInstallSuccess?: () => void) => {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  
  // ADDED: State for handling updates
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // FIX: Wrapped handlers in useCallback to stabilize them for useEffect
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault()
    setIsInstallable(true)
    setInstallPrompt(e as BeforeInstallPromptEvent)
    console.log('beforeinstallprompt event fired')
  }, [])

  const handleAppInstalled = useCallback(() => {
    console.log('PWA was installed')
    setIsInstalled(true)
    setInstallPrompt(null) // Clear the prompt event
    setIsInstallable(false)
    if (onInstallSuccess) {
      onInstallSuccess() // Notify parent component of success
    }
  }, [onInstallSuccess])
  
  // ADDED: Handler for when a service worker update is found
  const onSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    console.log('Service worker update found')
    setShowUpdatePrompt(true)
    setSwRegistration(registration)
  }, [])

  // FIX: Simplified useEffect to only run once on mount
  useEffect(() => {
    // Check initial installation status
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://')
    setIsInstalled(isStandalone)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // ADDED: Listener for service worker updates from your registration file
    // Your sw-registration logic should dispatch a custom event like this:
    // document.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
    const handleSWUpdate = (e: Event) => onSWUpdate((e as CustomEvent).detail)
    document.addEventListener('swUpdate', handleSWUpdate)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      document.removeEventListener('swUpdate', handleSWUpdate)
    }
  }, [handleBeforeInstallPrompt, handleAppInstalled, onSWUpdate])

  const installApp = async () => {
    // FIX: The main bug was here. We must use a local variable.
    const promptToUse = installPrompt
    if (!promptToUse) {
      return false
    }

    try {
      // Show the native browser install prompt
      await promptToUse.prompt()
      
      // Wait for the user's choice
      const { outcome } = await promptToUse.userChoice
      
      if (outcome === 'accepted') {
        // The 'appinstalled' event listener will handle the state update.
        console.log('PWA installation accepted by user')
        return true
      } else {
        console.log('PWA installation dismissed by user')
        return false
      }
    } catch (error) {
      console.error('Error during PWA installation:', error)
      return false
    } finally {
      // We no longer need the prompt event, clear it
      setIsInstallable(false)
      setInstallPrompt(null)
    }
  }
  
  // ADDED: Function to handle the update action
  const updateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      // The page will reload once the new service worker takes control.
      // You might add a listener for the 'controllerchange' event to reload.
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }
    setShowUpdatePrompt(false)
  }
  
  const dismissUpdatePrompt = () => {
    setShowUpdatePrompt(false)
  }

  return {
    isInstallable,
    isInstalled,
    installApp,
    // ADDED: Exposing update-related state and functions
    showUpdatePrompt,
    updateApp,
    dismissUpdatePrompt,
  }
}
