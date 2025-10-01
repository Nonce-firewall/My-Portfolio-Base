import { db } from '../lib/supabase'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export async function generateSitemap(): Promise<string> {
  const baseUrl = 'https://noncefirewall.tech'
  const urls: SitemapUrl[] = []

  urls.push({
    loc: baseUrl,
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0]
  })

  urls.push({
    loc: `${baseUrl}/about`,
    changefreq: 'monthly',
    priority: 0.8
  })

  urls.push({
    loc: `${baseUrl}/projects`,
    changefreq: 'weekly',
    priority: 0.9
  })

  urls.push({
    loc: `${baseUrl}/blog`,
    changefreq: 'daily',
    priority: 0.9
  })

  urls.push({
    loc: `${baseUrl}/products`,
    changefreq: 'weekly',
    priority: 0.8
  })

  urls.push({
    loc: `${baseUrl}/reviews`,
    changefreq: 'monthly',
    priority: 0.7
  })

  urls.push({
    loc: `${baseUrl}/contact`,
    changefreq: 'monthly',
    priority: 0.7
  })

  try {
    const { data: projects } = await db.getProjects()
    if (projects) {
      projects.forEach(project => {
        urls.push({
          loc: `${baseUrl}/projects/${project.id}`,
          changefreq: 'monthly',
          priority: 0.7,
          lastmod: project.updated_at ? new Date(project.updated_at).toISOString().split('T')[0] : undefined
        })
      })
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  try {
    const { data: posts } = await db.getBlogPosts(true)
    if (posts) {
      posts.forEach(post => {
        urls.push({
          loc: `${baseUrl}/blog/${post.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : undefined
        })
      })
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
    <priority>${url.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

  return xml
}

export async function saveSitemap(): Promise<void> {
  try {
    const sitemapXml = await generateSitemap()
    const blob = new Blob([sitemapXml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error saving sitemap:', error)
  }
}
