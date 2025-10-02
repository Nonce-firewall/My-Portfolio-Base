import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock } from 'lucide-react'
import type { BlogPost } from '../types'

interface RelatedPostsProps {
  posts: BlogPost[]
  currentPostId: string
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, currentPostId }) => {
  const navigate = useNavigate()

  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 5)

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 sticky top-24 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Trending on Nonce Firewall</h3>

      <div className="space-y-6">
        {relatedPosts.map((post, index) => (
          <div
            key={post.id}
            onClick={() => handlePostClick(post.slug)}
            className="group cursor-pointer"
          >
            <div className="flex gap-4">
              {post.featured_image_url && (
                <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gray-700">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
                  {post.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{post.reading_time} min</span>
                  </div>
                </div>

                {post.category && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {index < relatedPosts.length - 1 && (
              <div className="mt-6 border-t border-gray-700"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedPosts
