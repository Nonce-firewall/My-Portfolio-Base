import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowRight, Mail, MessageCircle, Clock } from 'lucide-react'
import Hero from '../components/Hero'
import TechStack from '../components/TechStack'
import ProjectCard from '../components/ProjectCard'
import ReviewCard from '../components/ReviewCard'
import TeamMemberCard from '../components/TeamMemberCard'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import SEOHead from '../components/SEOHead'
import { db } from '../lib/supabase'
import type { Project, Review, SiteSettings, TeamMember } from '../types'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isTeamTransitioning, setIsTeamTransitioning] = useState(true)
  const navigate = useNavigate()

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const explainerVideoUrl = "https://cxhspurcxgcseikfwnpm.supabase.co/storage/v1/object/public/new-images-bucket/projects_20250922_010222897.mp4";

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const arraysEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false
    return a.every((item, index) => JSON.stringify(item) === JSON.stringify(b[index]))
  }

  const fetchData = async () => {
    const [featuredProjectsResult, allProjectsResult, reviewsResult, teamMembersResult, settingsResult] = await Promise.all([
      db.getProjects(true),
      db.getProjects(),
      db.getReviews(true, 4),
      db.getTeamMembers(true),
      db.getSiteSettings()
    ])
    
    if (featuredProjectsResult.data) {
      setFeaturedProjects(featuredProjectsResult.data.slice(0, 4))
    }
    if (allProjectsResult.data) setAllProjects(allProjectsResult.data)
    
    if (reviewsResult.data && !arraysEqual(reviewsResult.data, reviews)) {
      setReviews(reviewsResult.data)
    }
    
    if (teamMembersResult.data && !arraysEqual(teamMembersResult.data, teamMembers)) {
      setTeamMembers(teamMembersResult.data)
    }
    
    if (settingsResult.data) setSettings(settingsResult.data)
  }

  useEffect(() => {
    fetchData()
    
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      subscribeToTable('projects', fetchData)
      subscribeToTable('reviews', fetchData)
      subscribeToTable('team_members', fetchData)
      subscribeToTable('site_settings', fetchData)
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('projects')
        unsubscribeFromTable('reviews')
        unsubscribeFromTable('team_members')
        unsubscribeFromTable('site_settings')
      }
      cleanup()
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.5 }
    );
    const currentVideoSection = videoSectionRef.current;
    if (currentVideoSection) {
      observer.observe(currentVideoSection);
    }
    return () => {
      if (currentVideoSection) {
        observer.unobserve(currentVideoSection);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isIntersecting) {
        videoRef.current.play().catch(error => {
          console.error("Video autoplay was prevented:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isIntersecting]);

  const displayReviews = useMemo(() => {
    return reviews.length > 0 ? [...reviews, reviews[0]] : []
  }, [reviews])

  const displayTeamMembers = useMemo(() => {
    return teamMembers.length > 0 ? [...teamMembers, teamMembers[0]] : []
  }, [teamMembers])
  
  useEffect(() => {
    if (displayReviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => prev + 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [displayReviews.length])

  useEffect(() => {
    if (displayTeamMembers.length > 1) {
      const interval = setInterval(() => {
        setCurrentTeamIndex((prev) => prev + 1)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [displayTeamMembers.length])

  useEffect(() => {
    if (currentReviewIndex === reviews.length && reviews.length > 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentReviewIndex(0)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentReviewIndex, reviews.length])

  useEffect(() => {
    if (currentTeamIndex === teamMembers.length && teamMembers.length > 0) {
      const timer = setTimeout(() => {
        setIsTeamTransitioning(false)
        setCurrentTeamIndex(0)
        setTimeout(() => setIsTeamTransitioning(true), 50)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentTeamIndex, teamMembers.length])

  return (
    <div className="min-h-screen animate-fade-in">
      <SEOHead
        title="Nonce Firewall - Expert Full-Stack Developer | React, Next.js & Node.js | Custom Web Development"
        description="Professional full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. Custom web applications, e-commerce solutions, API development, and scalable development services. 5+ years experience with 50+ completed projects."
        keywords="full-stack developer, react developer, web development, javascript, typescript, node.js, Next.js, frontend developer, backend developer, web applications, portfolio, custom web development, e-commerce development, API development, database design, responsive design, mobile-first development, modern web technologies, scalable applications, user experience design, performance optimization"
        url="/"
        type="website"
      />
      <ScrollToTopAndBottomButtons showScrollDownButton={false} />
      <Hero />
      <TechStack />
      
      {/* About Section */}
      <section id="about-section" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              About Me
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
              Building Digital Solutions That Matter
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {settings?.about_text || 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems and deliver exceptional user experiences.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Full-Stack Expertise</h3>
              <p className="text-gray-600 leading-relaxed">
                End-to-end development with modern frameworks and best practices for scalable solutions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Focused</h3>
              <p className="text-gray-600 leading-relaxed">
                Optimized applications that load fast and deliver exceptional user experiences.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">
                Rigorous testing and code reviews ensure reliable, maintainable solutions.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => handleNavigation('/about')}
              className="group inline-flex items-center px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
            >
              <span>Discover My Journey</span>
              <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Explainer Video Section */}
      <section ref={videoSectionRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
                Your Success Story
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
                Get Noticed. Go Global.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                An affordable website with prompt delivery to help boost your online presence and increase global reach. Watch how I transform ideas into powerful digital experiences.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fast Turnaround</h4>
                    <p className="text-gray-600">Projects delivered on time, every time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Affordable Pricing</h4>
                    <p className="text-gray-600">Quality solutions that fit your budget</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Global Reach</h4>
                    <p className="text-gray-600">Expand your presence worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  <video
                    ref={videoRef}
                    src={explainerVideoUrl}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">Featured Projects</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore real-world applications I've built, showcasing technical expertise and creative problem-solving across diverse industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="transform transition-all duration-300 hover:-translate-y-2">
                <ProjectCard
                  project={project}
                  onClick={() => {
                    navigate(`/projects/${project.id}`)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </div>
            ))}
          </div>

          {featuredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No featured projects yet</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => handleNavigation('/projects')}
              className="group inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
            >
              <span>View All Projects</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {displayReviews && displayReviews.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full mb-4">
                Client Testimonials
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">What Clients Say</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Real results, real feedback. These testimonials reflect the quality and dedication I bring to every project.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <div className="relative overflow-hidden">
                    <div
                      className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                      style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                    >
                      {displayReviews.map((review, index) => (
                        <div key={`${review.id}-${index}`} className="w-full flex-shrink-0 px-4">
                          <ReviewCard
                            review={review}
                            variant="preview"
                            project={review.project_id ? allProjects.find(p => p.id === review.project_id) : undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center items-center mt-8 space-x-4">
                    <div className="flex space-x-2">
                      {reviews.map((_, reviewIndex) => (
                        <button
                          key={reviewIndex}
                          onClick={() => {
                            setIsTransitioning(true)
                            setCurrentReviewIndex(reviewIndex)
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            reviewIndex === currentReviewIndex || (currentReviewIndex === reviews.length && reviewIndex === 0)
                              ? 'w-8 bg-blue-600'
                              : 'w-2 bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to testimonial ${reviewIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => handleNavigation('/reviews')}
                  className="group inline-flex items-center px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <span>Read All Testimonials</span>
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {displayTeamMembers && displayTeamMembers.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                Our Team
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">Meet The Team</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                I believe in a collaborative approach, ensuring every detail is perfect and your project is delivered with excellence. We're passionate creators working in sync to turn your vision into a stunning reality, fast.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <div className="relative overflow-hidden">
                    <div
                      className={`flex ${isTeamTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                      style={{ transform: `translateX(-${currentTeamIndex * 100}%)` }}
                    >
                      {displayTeamMembers.map((member, index) => (
                        <div key={`${member.id}-${index}`} className="w-full flex-shrink-0 px-4">
                          <React.Suspense fallback={
                            <div className="bg-white rounded-xl p-6 text-center animate-pulse">
                              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                              <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                              <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                              </div>
                            </div>
                          }>
                            <TeamMemberCard teamMember={member} variant="preview" />
                          </React.Suspense>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center mt-8 space-x-2">
                    {teamMembers.map((_, memberIndex) => (
                      <button
                        key={memberIndex}
                        onClick={() => {
                          setIsTeamTransitioning(true)
                          setCurrentTeamIndex(memberIndex)
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          memberIndex === currentTeamIndex || (currentTeamIndex === teamMembers.length && memberIndex === 0)
                            ? 'w-8 bg-purple-600'
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to team member ${memberIndex + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-full mb-4 backdrop-blur-sm">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready To Launch?</h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Let's discuss how we can help bring your ideas to life. Get in touch and let's create something amazing for your online presence.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Let's Connect</h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                          <p className="text-gray-600">{settings?.email || 'hello@noncefirewall.dev'}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                          <MessageCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">WhatsApp</h4>
                          <p className="text-gray-600">Available for quick chats</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Response Time</h4>
                          <p className="text-gray-600">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Ready to get started? Use our contact form to provide detailed information about your project requirements.
                  </p>
                  <button
                    onClick={() => handleNavigation('/contact')}
                    className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
                  >
                    <span>Open Contact Form</span>
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
