import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import { useTypingAnimation } from '../hooks/useTypingAnimation'
import TechStackMarquee from './TechStackMarquee'

// Lazy load non-critical components
const AnimatedStats = React.lazy(() => import('./AnimatedStats'))

import { db, subscribeToTable, unsubscribeFromTable } from '../lib/supabase'
import type { SiteSettings } from '../types'

interface HeroProps {
}

const Hero: React.FC<HeroProps> = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const roles = ['Front-end Developer', 'Full-Stack Developer', 'Prototype Designer']
  const currentRole = useTypingAnimation(roles, 70, 50, 1500)
  const navigate = useNavigate()

  // Tech stack logos data
  const techLogos = [
    {
      src: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'React Logo',
      name: 'React'
    },
    {
      src: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'TypeScript Logo', 
      name: 'TypeScript'
    },
    {
      src: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Node.js Logo',
      name: 'Node.js'
    },
    {
      src: 'https://images.pexels.com/photos/11035384/pexels-photo-11035384.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Tailwind CSS Logo',
      name: 'Tailwind CSS'
    },
    {
      src: 'https://images.pexels.com/photos/11035469/pexels-photo-11035469.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Figma Logo',
      name: 'Figma'
    },
    {
      src: 'https://images.pexels.com/photos/11035467/pexels-photo-11035467.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Framer Motion Logo',
      name: 'Framer Motion'
    },
    {
      src: 'https://images.pexels.com/photos/11035466/pexels-photo-11035466.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'WordPress Logo',
      name: 'WordPress'
    },
    {
      src: 'https://images.pexels.com/photos/11035383/pexels-photo-11035383.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      alt: 'Next.js Logo',
      name: 'Next.js'
    }
  ]
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await db.getSiteSettings()
      if (data) setSettings(data)
    }
    fetchSettings()
    
    // Subscribe to real-time changes
    subscribeToTable('site_settings', () => {
      fetchSettings()
    })
    
    return () => {
      unsubscribeFromTable('site_settings')
    }
  }, [])

  const scrollToNext = () => {
    const nextSection = document.getElementById('about-section')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-[calc(100vh-64px)] pt-16 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900">
              <span className="text-gray-600 font-medium text-2xl sm:text-4xl lg:text-5xl block mb-2">Hello, I'm</span>
              <span className="gradient-text">{settings?.hero_title || 'Nonce Firewall'}</span>
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-600 h-12 flex items-center justify-center">
              <span className="typing-cursor">{currentRole}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings?.hero_subtitle || 'Crafting exceptional digital experiences with modern web technologies. Specialized in React, Node.js, and full-stack development.'}
            </p>
          </div>

          <div className="flex flex-row sm:flex-row gap-4 justify-center items-center">
  <button
    onClick={() => navigate('/projects')}
    className="py-2 px-4 bg-indigo-600 text-white hover:bg-gray-800 transition-all duration-300 rounded-md transform hover:scale-105 active:scale-95 hover:shadow-lg"
  >
          {/* Tech Stack Marquee */}
          <div className="marquee-container animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <TechStackMarquee logos={techLogos} speed="normal" direction="left" />
          </div>

          {/* Stats */}
          {settings && (
            <React.Suspense fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-12 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            }>
              <AnimatedStats
                yearsExperience={settings.years_experience}
                projectsCompleted={settings.projects_completed}
                happyClients={settings.happy_clients}
                commitsCount={settings.commits_count}
              />
            </React.Suspense>
          )}
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 hover:text-gray-900 transition-colors duration-300 animate-bounce opacity-0 animate-fade-in"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
        >
          <ArrowDown size={24} />
        </button>
      </header>
    </section>
  )
}

export default Hero
