import type {MetadataRoute} from 'next'
import {getSiteUrl} from '@/lib/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const lastModified = new Date()

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/chat`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
