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

export type TechStackCard = {
  name: string
  descriptor: string
  role: string
}

export type Conviction = {
  label: string
  question: string
  description: string
}

export type SiteContent = {
  navBrandLabel: string
  navCtaLabel: string
  navCtaHref: string
  landingEyebrow: string
  landingHeadline: string
  landingDescription: string
  landingCta: string
  featureCards: FeatureCard[]
  aboutEyebrow: string
  aboutHeadline: string
  aboutBody: string
  aboutSubline: string
  stackSectionTitle: string
  stackCards: TechStackCard[]
  convictionsSectionTitle: string
  convictionsIntro: string
  convictions: Conviction[]
  chatEyebrow: string
  chatHeadline: string
  chatDescription: string
  chatEmptyMessage: string
  chatStarters: string[]
}

const SITE_CONTENT_DEFAULTS: SiteContent = {
  navBrandLabel: 'design thinking',
  navCtaLabel: 'Chat',
  navCtaHref: '/chat',
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
  aboutEyebrow: 'About',
  aboutHeadline: "Your design team's memory, made conversational.",
  aboutBody:
    'Every framework, principle, and hard-won lesson your team has earned — captured, structured, and ready to answer. Fieldnotes turns institutional design knowledge into something you can simply ask.',
  aboutSubline: "Not a wiki. Not a chatbot. Your team's judgment, on demand.",
  stackSectionTitle: 'What powers Fieldnotes',
  stackCards: [
    {
      name: 'SANITY',
      descriptor: 'Structured authoring environment',
      role: 'Where knowledge is written, structured, and published',
    },
    {
      name: 'SUPABASE',
      descriptor: 'Vector search with pgvector',
      role: 'Surfaces the most relevant knowledge for every question',
    },
    {
      name: 'CLAUDE',
      descriptor: "Anthropic's reasoning model",
      role: 'Turns retrieved knowledge into opinionated, grounded answers',
    },
    {
      name: 'NEXT.JS',
      descriptor: 'React framework on Vercel',
      role: 'Delivers the experience — fast, accessible, everywhere',
    },
  ],
  convictionsSectionTitle: 'Design convictions',
  convictionsIntro:
    'Every entry in Fieldnotes is calibrated before it earns trust. These are the questions we ask of our own knowledge.',
  convictions: [
    {
      label: 'confidence',
      question: 'Evergreen or experimental?',
      description: 'How settled an idea is — state it with conviction, or flag it as still forming.',
    },
    {
      label: 'maturity',
      question: 'Onboarding or senior?',
      description: 'Who the answer is for — calibrate the depth to the reader’s experience.',
    },
    {
      label: 'myTake',
      question: 'Bookmark or belief?',
      description: 'A quote without interpretation is just a link; the take is what makes it knowledge.',
    },
    {
      label: 'tension',
      question: 'Where does this break?',
      description: 'A principle without edges is a platitude — the good ones occasionally conflict.',
    },
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
  navBrandLabel,
  navCtaLabel,
  navCtaHref,
  landingEyebrow,
  landingHeadline,
  landingDescription,
  landingCta,
  featureCards[]{ icon, label, description },
  aboutEyebrow,
  aboutHeadline,
  aboutBody,
  aboutSubline,
  stackSectionTitle,
  stackCards[]{ name, descriptor, role },
  convictionsSectionTitle,
  convictionsIntro,
  convictions[]{ label, question, description },
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

    if (Array.isArray(data.stackCards)) {
      merged.stackCards = data.stackCards
        .filter(
          (c): c is TechStackCard =>
            c != null && typeof c.name === 'string' && c.name.trim().length > 0,
        )
        .map((c) => ({
          name: c.name.trim(),
          descriptor: typeof c.descriptor === 'string' ? c.descriptor : '',
          role: typeof c.role === 'string' ? c.role : '',
        }))
    }

    if (Array.isArray(data.convictions)) {
      merged.convictions = data.convictions
        .filter(
          (c): c is Conviction =>
            c != null &&
            ((typeof c.label === 'string' && c.label.trim().length > 0) ||
              (typeof c.question === 'string' && c.question.trim().length > 0)),
        )
        .map((c) => ({
          label: typeof c.label === 'string' ? c.label.trim() : '',
          question: typeof c.question === 'string' ? c.question.trim() : '',
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
