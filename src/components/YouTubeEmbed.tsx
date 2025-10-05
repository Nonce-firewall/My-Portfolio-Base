import React from 'react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title = 'YouTube Video' }) => {
  return (
    <div className="flex justify-center my-8 w-full">
      <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=1`}
            title={title}
            className="absolute top-0 left-0 w-full h-full rounded-xl border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  )
}

export default YouTubeEmbed