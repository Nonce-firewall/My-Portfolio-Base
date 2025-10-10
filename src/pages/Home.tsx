import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowRight, Mail, MessageCircle, Clock, UserPlus } from 'lucide-react'
import Hero from '../components/Hero'
import TechStack from '../components/TechStack'
import ProjectCard from '../components/ProjectCard'
import ReviewCard from '../components/ReviewCard'
import TeamMemberCard from '../components/TeamMemberCard'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import SEOHead from '../components/SEOHead'
import JoinTeamModal from '../components/JoinTeamModal'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
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
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false)
  const navigate = useNavigate()

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const explainerVideoUrl = "https://cxhspurcxgcseikfwnpm.supabase.co/storage/v1/object/public/new-images-bucket/projects_20250922_010222897.mp4";

  const aboutSection = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  const videoSection = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  const projectsSection = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  const contactSection = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

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
    const currentVideoSection = videoSection.elementRef.current;
    if (currentVideoSection) {
      observer.observe(currentVideoSection);
    }
    return () => {
      if (currentVideoSection) {
        observer.unobserve(currentVideoSection);
      }
    };
  }, [videoSection.elementRef]);

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
      
      <section
        id="about-section"
        ref={aboutSection.elementRef}
        className={`py-20 bg-white transition-opacity duration-1000 ${
          aboutSection.isIntersecting
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">About</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings?.about_text || 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems and deliver exceptional user experiences.'}
            </p>
            <div className="mt-8">
              <button
                onClick={() => handleNavigation('/about')}
                className="group relative inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <span className="relative z-10">Learn More</span>
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={videoSection.elementRef}
        className={`py-20 bg-fuchsia-50 rounded-3xl ring-2 ring-blue-800/12 transition-opacity duration-1000 ${
          videoSection.isIntersecting
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Get Noticed. Get Global✓</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                An affordable website with prompt delivery to help boost your online presence and increase global reach!
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="aspect-w-16 aspect-h-9 rounded-2xl shadow-1xl overflow-hidden ring-1 ring-gray-800/10">
                <video
                  ref={videoRef}
                  src={explainerVideoUrl}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  preload="none"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%23fdf4ff' width='16' height='9'/%3E%3C/svg%3E"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={projectsSection.elementRef}
        className={`py-20 bg-white rounded-3xl ring-2 ring-blue-800/12 transition-opacity duration-1000 ${
          projectsSection.isIntersecting
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Featured Projects</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recent projects that showcase my skills and expertise in web development.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {featuredProjects.slice(0, 3).map((project) => (
              <div key={project.id}>
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
          <div className="text-center">
            <button
              onClick={() => handleNavigation('/projects')}
              className="btn-primary px-3 py-1 rounded-xl inline-flex items-center transform hover:scale-105 active:scale-95"
            >
              Projects
              <ArrowRight size={17} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {displayReviews && displayReviews.length > 0 && (
        <section
          className="py-20 bg-fuchsia-50 rounded-3xl ring-2 ring-blue-800/12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Testimonials</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real results, real feedback. These testimonials reflect the quality and dedication I bring to every project.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
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
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      reviewIndex === currentReviewIndex || (currentReviewIndex === reviews.length && reviewIndex === 0) ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
                </div>
                <button
                  onClick={() => handleNavigation('/reviews')}
                  className="group flex items-center space-x-2 px-1 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-md"
                  title="View all reviews"
                >
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {displayTeamMembers && displayTeamMembers.length > 0 && (
        <section
          className="py-20 bg-white rounded-3xl ring-2 ring-blue-800/12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Meet The Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                I believe in a collaborative approach, ensuring every detail is perfect and your project is delivered with excellence. We're passionate creators working in sync to turn your vision into a stunning reality, fast⚡
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden">
                <div 
                  className={`flex ${isTeamTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${currentTeamIndex * 100}%)` }}
                >
                  {displayTeamMembers.map((member, index) => (
                    <div key={`${member.id}-${index}`} className="w-full flex-shrink-0 px-4">
                      <React.Suspense fallback={
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center animate-pulse">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
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
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      memberIndex === currentTeamIndex || (currentTeamIndex === teamMembers.length && memberIndex === 0) ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setIsJoinTeamModalOpen(true)}
                  className="group inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
                >
                  <UserPlus size={20} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Join Our Team</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <JoinTeamModal
        isOpen={isJoinTeamModalOpen}
        onClose={() => setIsJoinTeamModalOpen(false)}
      />

      <section
        ref={contactSection.elementRef}
        className={`py-20 bg-fuchsia-50 rounded-3xl ring-2 ring-blue-800/12 transition-opacity duration-1000 ${
          contactSection.isIntersecting
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Ready To Launch?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Let's discuss how we can help bring your ideas to life. Get in touch and let's create something amazing for your online presence.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h3>
                    <div className="space-y-6">
                      <a
                        href={`mailto:${settings?.email || 'hello@noncefirewall.dev'}`}
                        className="flex items-center space-x-4 hover:bg-blue-50 bg-gradient-to-r from-blue-50/30 to-transparent rounded-lg p-3 -m-3 transition-all duration-300 group cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md border border-blue-100/50 hover:border-blue-200"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
                          <Mail className="w-6 h-6 text-blue-500 group-hover:animate-bounce" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            Email
                            <span className="text-xs text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300">Tap to send</span>
                          </h4>
                          <p className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300 underline decoration-blue-300 group-hover:decoration-blue-500 underline-offset-2">{settings?.email || 'hello@noncefirewall.dev'}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-blue-500 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                      </a>
                      {settings?.whatsapp_link && (
                        <a
                          href={settings.whatsapp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-4 hover:bg-green-50 bg-gradient-to-r from-green-50/30 to-transparent rounded-lg p-3 -m-3 transition-all duration-300 group cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md border border-green-100/50 hover:border-green-200"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
                            <MessageCircle className="w-6 h-6 text-green-500 group-hover:animate-bounce" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              WhatsApp
                              <span className="text-xs text-green-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300">Tap to chat</span>
                            </h4>
                            <p className="text-green-600 group-hover:text-green-700 transition-colors duration-300 underline decoration-green-300 group-hover:decoration-green-500 underline-offset-2">Available for quick chats</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-green-500 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                        </a>
                      )}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Response Time</h4>
                          <p className="text-gray-600">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Ready To Launch? Use the contact form to provide detailed information about your requirements.
                    </p>
                    <button
                      onClick={() => handleNavigation('/contact')}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center transform hover:scale-105 active:scale-95"
                    >
                      Open Form
                      <ArrowRight size={17} className="ml-2" />
                    </button>
                  </div>
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
