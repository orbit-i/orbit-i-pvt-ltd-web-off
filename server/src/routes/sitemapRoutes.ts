import { Router } from 'express'
import { env } from '../config/env'
import { isMySQLActive, query } from '../config/mysql'

const router = Router()

// Dynamic sitemap.xml generator
router.get('/sitemap.xml', async (_req, res) => {
  const baseUrl = env.publicSiteUrl || 'https://orbit-i.tech'
  const currentDate = new Date().toISOString().split('T')[0]

  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/about', changefreq: 'monthly', priority: '0.8' },
    { url: '/services', changefreq: 'weekly', priority: '0.9' },
    { url: '/products', changefreq: 'weekly', priority: '0.8' },
    { url: '/team', changefreq: 'monthly', priority: '0.8' },
    { url: '/partners', changefreq: 'monthly', priority: '0.8' },
    { url: '/case-studies', changefreq: 'weekly', priority: '0.8' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/careers', changefreq: 'weekly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
    { url: '/verify', changefreq: 'weekly', priority: '0.6' },
  ]

  let dynamicRoutes: Array<{ url: string; changefreq: string; priority: string; lastmod?: string }> = []

  if (isMySQLActive()) {
    try {
      const posts = await query<any>(
        'SELECT slug, updated_at FROM blog_posts WHERE status = "published" ORDER BY updated_at DESC'
      )
      if (posts) {
        posts.forEach((p) => {
          dynamicRoutes.push({
            url: `/blog/${p.slug}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : currentDate,
          })
        })
      }

      const services = await query<any>('SELECT slug, updated_at FROM services')
      if (services) {
        services.forEach((s) => {
          dynamicRoutes.push({
            url: `/services/${s.slug}`,
            changefreq: 'monthly',
            priority: '0.8',
            lastmod: s.updated_at ? new Date(s.updated_at).toISOString().split('T')[0] : currentDate,
          })
        })
      }
    } catch (err) {
      console.warn('[sitemap] Failed to query dynamic MySQL routes:', err)
    }
  }

  const allUrls = [...staticRoutes, ...dynamicRoutes]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${(item as any).lastmod || currentDate}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  res.header('Content-Type', 'application/xml')
  res.send(xml)
})

// Dynamic robots.txt
router.get('/robots.txt', (_req, res) => {
  const baseUrl = env.publicSiteUrl || 'https://orbit-i.tech'
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /client/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}
`
  res.header('Content-Type', 'text/plain')
  res.send(robots)
})

export default router
