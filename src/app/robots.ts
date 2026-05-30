import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://nlitedu.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/profile', '/signin', '/signup', '/enroll'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
