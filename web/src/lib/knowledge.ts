import {getSanityReadClient} from './sanity'

/** Bounded fetch of published knowledge for LLM context (no user-supplied GROQ). */
export const KNOWLEDGE_SNIPPET_QUERY = `*[_type in $types]|order(_updatedAt desc)[0...40]{
  _type,
  _id,
  title,
  name,
  statement,
  summary,
  quote,
  "slug": slug.current,
  "sourceAuthor": sourceAuthor->name,
  "author": author->name,
  "resourceType": resourceType
}`

export type KnowledgeSnippet = Record<string, unknown>

export async function fetchKnowledgeContext(): Promise<KnowledgeSnippet[]> {
  const sanity = getSanityReadClient()
  return sanity.fetch(KNOWLEDGE_SNIPPET_QUERY, {
    types: [
      'framework',
      'process',
      'insight',
      'principle',
      'externalResource',
      'phase',
      'tag',
      'sourceAuthor',
    ],
  })
}

export function snippetsToContextJson(rows: KnowledgeSnippet[], maxChars = 14000): string {
  const compact = rows.map((r) => {
    const label =
      (r.title as string) ||
      (r.name as string) ||
      (r.statement as string) ||
      (r._id as string)
    return {
      type: r._type,
      label,
      slug: r.slug,
      summary: r.summary,
      statement: r.statement,
      quote: r.quote,
      sourceAuthor: r.sourceAuthor,
      author: r.author,
      resourceType: r.resourceType,
    }
  })
  let text = JSON.stringify(compact, null, 0)
  if (text.length > maxChars) {
    text = text.slice(0, maxChars) + '\n…(truncated)'
  }
  return text
}
