import React from 'react'
import OptimizedImage from './OptimizedImage'

interface TechLogo {
  src: string
  alt: string
  name: string
}

interface TechStackMarqueeProps {
  logos: TechLogo[]
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'left' | 'right'
}

const TechStackMarquee: React.FC<TechStackMarqueeProps> = ({ 
  logos, 
  speed = 'normal',
  direction = 'left' 
}) => {
  const getAnimationClass = () => {
    const baseClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
    
    switch (speed) {
      case 'slow':
        return `${baseClass}-slow`
      case 'fast':
        return `${baseClass}-fast`
      default:
        return baseClass
    }
  }

  return (
    <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 py-6">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Marquee container: Now uses inline-flex and flex-nowrap */}
        <div className="inline-flex flex-nowrap space-x-8">
          {/* First set of logos */}
          <div className={`flex items-center space-x-8 ${getAnimationClass()}`}>
            {logos.map((logo, index) => (
              <div
                key={`${logo.name}-first-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110 hover:-translate-y-1">
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    width={56}
                    height={56}
                    loading="lazy"
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                    {logo.name}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second, duplicated set of logos (aria-hidden for accessibility) */}
          <div className={`flex items-center space-x-8 ${getAnimationClass()}`} aria-hidden="true">
            {logos.map((logo, index) => (
              <div
                key={`${logo.name}-second-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110 hover:-translate-y-1">
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    width={56}
                    height={56}
                    loading="lazy"
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                    {logo.name}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Optional label */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 font-medium">Technologies I Work With</p>
      </div>
    </div>
  )
}

export default TechStackMarquee
