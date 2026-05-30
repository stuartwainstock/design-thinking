import {createClient, type SanityClient} from '@sanity/client'

let client: SanityClient | null = null

export function getSanityReadClient(): SanityClient {
  if (client) return client
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  const token = process.env.SANITY_API_READ_TOKEN
  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  }
  client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION ?? '2024-01-01',
    useCdn: !token,
    token: token || undefined,
  })
  return client
}

/* ── Site content singleton ── */

export type FeatureCard = {
  icon: string
  label: string
  description: string
}

export type SiteContent = {
  landingEyebrow: string
  landingHeadline: string
  landingDescription: string
  landingCta: string
  featureCards: FeatureCard[]
  chatEyebrow: string
  chatHeadline: string
  chatDescription: string
  chatEmptyMessage: string
  chatStarters: string[]
}

const SITE_CONTENT_DEFAULTS: SiteContent = {
  landingEyebrow: 'Design thinking',
  landingHeadline: "Your team's\ndesign wisdom,\nalways within reach",
  landingDescription:
    "Frameworks, processes, principles, and insights — curated by your design leaders, ready whenever you need them. Ask a question, get an opinionated answer grounded in what your team actually believes.",
  landingCta: 'Open knowledge chat',
  featureCards: [
    {icon: '💡', label: 'Frameworks & models', description: 'Mental models your team uses daily'},
    {icon: '🧭', label: 'Processes & steps', description: 'How we actually do things here'},
    {icon: '✨', label: 'Principles & insights', description: 'Hard-won opinions, not platitudes'},
  ],
  chatEyebrow: 'Knowledge chat',
  chatHeadline: "Ask your team's brain",
  chatDescription:
    "Every answer is grounded in your published frameworks, processes, and insights. Think of it as a conversation with your team's collected wisdom.",
  chatEmptyMessage:
    'Ask about frameworks, processes, principles, or insights.\nAnswers come from your published knowledge base.',
  chatStarters: [
    'What frameworks help with problem framing?',
    'Walk me through our discovery process',
    'What principles guide critique?',
  ],
}

const SITE_CONTENT_QUERY = `*[_type == "siteContent" && _id == "siteContent"][0]{
  landingEyebrow,
  landingHeadline,
  landingDescription,
  landingCta,
  featureCards[]{ icon, label, description },
  chatEyebrow,
  chatHeadline,
  chatDescription,
  chatEmptyMessage,
  chatStarters,
}`

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const data = await getSanityReadClient().fetch<Partial<SiteContent> | null>(
      SITE_CONTENT_QUERY,
      {},
      {next: {revalidate: 60}},
    )
    if (!data) return SITE_CONTENT_DEFAULTS
    const merged: SiteContent = {...SITE_CONTENT_DEFAULTS, ...stripNulls(data)}

    if (Array.isArray(data.featureCards)) {
      merged.featureCards = data.featureCards
        .filter(
          (c): c is FeatureCard =>
            c != null &&
            typeof c.label === 'string' &&
            c.label.trim().length > 0,
        )
        .map((c) => ({
          icon: typeof c.icon === 'string' ? c.icon : '•',
          label: c.label.trim(),
          description: typeof c.description === 'string' ? c.description : '',
        }))
    }

    if (Array.isArray(data.chatStarters)) {
      merged.chatStarters = data.chatStarters.filter(
        (s) => typeof s === 'string' && s.trim().length > 0,
      )
    }

    return merged
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getSiteContent]', e)
    }
    return SITE_CONTENT_DEFAULTS
  }
}

function stripNulls<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v != null) result[k] = v
  }
  return result as Partial<T>
}
