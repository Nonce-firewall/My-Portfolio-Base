import React, { useState, useEffect, useRef, useCallback } from 'react'

interface AnimatedStatsProps {
  yearsExperience: number
  projectsCompleted: number
  happyClients: number
  commitsCount: number
}

const AnimatedStats: React.FC<AnimatedStatsProps> = ({
  yearsExperience,
  projectsCompleted,
  happyClients,
  commitsCount
}) => {
  const [years, setYears] = useState(0)
  const [projects, setProjects] = useState(0)
  const [clients, setClients] = useState(0)
  const [commits, setCommits] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()

  const animate = useCallback(() => {
    if (hasAnimated) return

    const startTime = performance.now()
    const duration = 2000

    const updateCounts = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setYears(Math.floor(yearsExperience * easeOutQuart))
      setProjects(Math.floor(projectsCompleted * easeOutQuart))
      setClients(Math.floor(happyClients * easeOutQuart))
      setCommits(Math.floor(commitsCount * easeOutQuart))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCounts)
      } else {
        setYears(yearsExperience)
        setProjects(projectsCompleted)
        setClients(happyClients)
        setCommits(commitsCount)
        setHasAnimated(true)
      }
    }

    rafRef.current = requestAnimationFrame(updateCounts)
  }, [yearsExperience, projectsCompleted, happyClients, commitsCount, hasAnimated])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animate()
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    )

    const element = containerRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      observer.disconnect()
    }
  }, [animate, hasAnimated])

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{years}+</div>
        <div className="text-gray-600 text-sm md:text-base">Years Experience</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{projects}+</div>
        <div className="text-gray-600 text-sm md:text-base">Projects Completed</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{clients}+</div>
        <div className="text-gray-600 text-sm md:text-base">Happy Clients</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{commits}+</div>
        <div className="text-gray-600 text-sm md:text-base">Commits</div>
      </div>
    </div>
  )
}

export default AnimatedStats