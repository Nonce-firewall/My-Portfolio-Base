import React from 'react'
import TechStackMarquee from './TechStackMarquee'

// Define the type for a tech logo
interface TechLogo {
  src: string
  alt: string
  name: string
}

// Array of technology logos with .webp format
const logos: TechLogo[] = [
  { src: '/tech-logos/react.webp', alt: 'React Logo', name: 'React' },
  { src: '/tech-logos/nextjs.webp', alt: 'Next.js Logo', name: 'Next.js' },
  { src: '/tech-logos/nodejs.webp', alt: 'Node.js Logo', name: 'Node.js' },
  { src: '/tech-logos/typescript.webp', alt: 'TypeScript Logo', name: 'TypeScript' },
  { src: '/tech-logos/javascript.webp', alt: 'JavaScript Logo', name: 'JavaScript' },
  { src: '/tech-logos/tailwindcss.webp', alt: 'Tailwind CSS Logo', name: 'Tailwind CSS' },
  { src: '/tech-logos/supabase.webp', alt: 'Supabase Logo', name: 'Supabase' },
  { src: '/tech-logos/postgresql.webp', alt: 'PostgreSQL Logo', name: 'PostgreSQL' },
  { src: '/tech-logos/mongodb.webp', alt: 'MongoDB Logo', name: 'MongoDB' },
  { src: '/tech-logos/docker.webp', alt: 'Docker Logo', name: 'Docker' },
  { src: '/tech-logos/git.webp', alt: 'Git Logo', name: 'Git' },
  { src: '/tech-logos/figma.webp', alt: 'Figma Logo', name: 'Figma' },
]

const TechStack: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 -mt-16 sm:-mt-20 md:-mt-24 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TechStackMarquee logos={logos} speed="normal" />
      </div>
    </section>
  )
}

export default TechStack
