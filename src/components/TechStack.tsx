import React from 'react'
import TechStackMarquee from './TechStackMarquee'

// Define the type for a tech logo
interface TechLogo {
  src: string
  alt: string
  name: string
}

[span_0](start_span)// Your technology logos array[span_0](end_span)
const logos: TechLogo[] = [
  { src: '/tech-logos/react.webp', alt: 'React Logo', name: 'React' },
  { src: '/tech-logos/nextjs.webp', alt: 'Next.js Logo', name: 'Next.js' },
  { src: '/tech-logos/typescript.webp', alt: 'TypeScript Logo', name: 'TypeScript' },
  { src: '/tech-logos/tailwindcss.webp', alt: 'Tailwind CSS Logo', name: 'Tailwind CSS' },
  { src: '/tech-logos/supabase.webp', alt: 'Supabase Logo', name: 'Supabase' },
  { src: '/tech-logos/postgresql.webp', alt: 'PostgreSQL Logo', name: 'PostgreSQL' },
  { src: '/tech-logos/wordpress.webp', alt: 'WordPress Logo', name: 'WordPress' },
  { src: '/tech-logos/figma.webp', alt: 'Figma Logo', name: 'Figma' },
  { src: '/tech-logos/motion.webp', alt: 'Framer Motion Logo', name: 'Framer Motion' },
  { src: '/tech-logos/html.webp', alt: 'HTML Logo', name: 'HTML' },
  { src: '/tech-logos/javascript.webp', alt: 'JavaScript Logo', name: 'JavaScript' },
  { src: '/tech-logos/github.webp', alt: 'Github Logo', name: 'Github' },
  { src: '/tech-logos/git.webp', alt: 'Git Logo', name: 'Git' }
]

const TechStack: React.FC = () => {
  return (
    // 1. The main section is now a positioning container.
    //    The blur and background styles have been removed from here.
    <section className="relative py-12 -mt-16 sm:-mt-20 md:-mt-24">
      
      {/* 2. This new div acts as the blurred background layer. */}
      {/* It's positioned absolutely to fill the parent section. */}
      <div
        className="absolute inset-0 bg-purple-200 blur-xl"
        aria-hidden="true"
      />

      {/* 3. This div holds the content and uses z-10 to sit on top. */}
      {/* It is not affected by the blur. */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TechStackMarquee logos={logos} speed="normal" />
      </div>
      
    </section>
  )
}

export default TechStack
