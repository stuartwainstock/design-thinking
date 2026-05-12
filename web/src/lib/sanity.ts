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
