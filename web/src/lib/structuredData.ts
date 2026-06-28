import type {FaqItem, SiteContent} from '@/lib/sanity'

/**
 * JSON-LD builders. Each returns a plain object (no `@context` — that is set
 * once at the top level of the `@graph`). Keep output grounded in CMS data.
 */

export function organizationSchema(site: SiteContent, siteUrl: string): Record<string, unknown> {
  const name = site.seo.siteName || 'fieldnotes'
  const schema: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name,
    url: siteUrl,
    description: site.seo.tagline || site.landingDescription,
    logo: `${siteUrl}/opengraph-image`,
  }
  if (site.seo.sameAs.length > 0) schema.sameAs = site.seo.sameAs
  return schema
}

export function websiteSchema(site: SiteContent, siteUrl: string): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: site.seo.siteName || 'fieldnotes',
    url: siteUrl,
    description: site.seo.landingMetaDescription || site.landingDescription,
    publisher: {'@id': `${siteUrl}/#organization`},
  }
}

export function faqSchema(faq: FaqItem[]): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/** Wrap one or more schema nodes into a single @graph document. */
export function graph(...nodes: Record<string, unknown>[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}
