/**
 * Import MyMind entries into Sanity
 * ─────────────────────────────────────────────────────────────────
 * Reads mymind-import-review.json and creates Sanity documents.
 *
 * Prerequisites:
 *   - SANITY_API_TOKEN env var with write access (or SANITY_AUTH_TOKEN)
 *   - npm install @sanity/client (already available via the sanity package)
 *
 * Usage:
 *   npx tsx scripts/import-mymind.ts
 *   npx tsx scripts/import-mymind.ts --dry-run   # preview without writing
 *
 * What it does:
 *   1. Reads the review JSON
 *   2. Creates any missing sourceAuthor documents
 *   3. Creates any missing tag documents
 *   4. Creates knowledge documents (insight, principle, process, externalResource)
 *   5. Reports results
 *
 * Safe to re-run: uses deterministic _id based on mymind ID to avoid duplicates.
 */

import {createClient} from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// ── Config ──────────────────────────────────────────────────────

const PROJECT_ID = 'eff153ps'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

const DRY_RUN = process.argv.includes('--dry-run')

const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN
if (!token && !DRY_RUN) {
  console.error('❌ Set SANITY_API_TOKEN or SANITY_AUTH_TOKEN to a write token.')
  console.error('   Create one at: https://www.sanity.io/manage/project/eff153ps/api#tokens')
  console.error('   Or run with --dry-run to preview.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: token ?? undefined,
  useCdn: false,
})

// ── Types ───────────────────────────────────────────────────────

type ReviewEntry = {
  _review_status: string
  _mymind_ids: string[]
  _mymind_created: string
  sanity_type: 'insight' | 'principle' | 'process' | 'externalResource'
  title: string
  slug: string
  confidence: string
  maturity: string
  suggested_tags: string[]
  sourceAuthor?: string
  sourceTitle?: string
  sourceUrl?: string
  // Type-specific
  quote?: string
  myTake?: string
  statement?: string
  elaboration?: string
  url?: string
  whyItMatters?: string
  resourceType?: string
  body?: string
  summary?: string
}

// ── Helpers ─────────────────────────────────────────────────────

/** Deterministic Sanity _id from mymind ID. */
function sanityId(prefix: string, key: string): string {
  return `${prefix}-${key.replace(/[^a-zA-Z0-9]/g, '-')}`
}

/** Convert plain text to a minimal Portable Text block array. */
function toPortableText(text: string): Array<Record<string, unknown>> {
  if (!text) return []
  // Split on double newlines for paragraphs
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim())
  return paragraphs.map((p, i) => ({
    _type: 'block',
    _key: `block-${i}`,
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: `span-${i}`,
        text: p.trim(),
        marks: [],
      },
    ],
    markDefs: [],
  }))
}

/** Slugify consistently with the review file. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '')
}

// ── Step 1: Read the review file ────────────────────────────────

const reviewPath = path.resolve(__dirname, '..', 'mymind-import-review.json')
const entries: ReviewEntry[] = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'))
console.log(`📄 Loaded ${entries.length} entries from review file\n`)

// ── Step 2: Ensure sourceAuthor documents exist ─────────────────

async function ensureAuthors(entries: ReviewEntry[]): Promise<Map<string, string>> {
  const authorNames = Array.from(new Set(entries.map((e) => e.sourceAuthor).filter(Boolean))) as string[]
  const authorIdMap = new Map<string, string>()

  if (!authorNames.length) return authorIdMap

  // Check which already exist
  const existing = await client.fetch<Array<{_id: string; name: string}>>(
    `*[_type == "sourceAuthor" && name in $names]{_id, name}`,
    {names: authorNames},
  )
  for (const a of existing) {
    authorIdMap.set(a.name, a._id)
  }

  // Create missing ones
  const missing = authorNames.filter((n) => !authorIdMap.has(n))
  for (const name of missing) {
    const _id = sanityId('author', slugify(name))
    const doc = {
      _id,
      _type: 'sourceAuthor' as const,
      name,
      slug: {current: slugify(name)},
    }

    if (DRY_RUN) {
      console.log(`  [dry-run] Would create sourceAuthor: ${name} (${_id})`)
    } else {
      await client.createIfNotExists(doc)
      console.log(`  ✓ Created sourceAuthor: ${name}`)
    }
    authorIdMap.set(name, _id)
  }

  return authorIdMap
}

// ── Step 3: Ensure tag documents exist ──────────────────────────

async function ensureTags(entries: ReviewEntry[]): Promise<Map<string, string>> {
  const allTagNames = Array.from(new Set(entries.flatMap((e) => e.suggested_tags)))
  const tagIdMap = new Map<string, string>()

  if (!allTagNames.length) return tagIdMap

  // Check which already exist (match by label, case-insensitive)
  const existing = await client.fetch<Array<{_id: string; label: string}>>(
    `*[_type == "tag"]{_id, label}`,
  )
  for (const t of existing) {
    tagIdMap.set(t.label, t._id)
    // Also map common variations
    tagIdMap.set(t.label.toLowerCase(), t._id)
  }

  // Determine category for new tags
  const categoryMap: Record<string, string> = {
    'DesignOps': 'discipline',
    'Design Leadership': 'activity',
    'Design Systems': 'discipline',
    'Leadership': 'stakeholder',
    'UX': 'discipline',
    'Communication': 'activity',
    'Decision Making': 'activity',
    'Feedback': 'activity',
    'Hiring': 'activity',
    'Teams': 'stakeholder',
    'Collaboration': 'activity',
    'Strategy': 'mindset',
    'Meetings': 'activity',
    'Process': 'activity',
    'Stakeholder Engagement': 'activity',
    'Presenting': 'activity',
    'Storytelling': 'activity',
    'Product Design': 'discipline',
    'Management': 'activity',
    'Innovation': 'mindset',
    'Business': 'stakeholder',
  }

  const missing = allTagNames.filter((n) => !tagIdMap.has(n) && !tagIdMap.has(n.toLowerCase()))
  for (const label of missing) {
    const _id = sanityId('tag', slugify(label))
    const doc = {
      _id,
      _type: 'tag' as const,
      label,
      slug: {current: slugify(label)},
      category: categoryMap[label] ?? 'activity',
    }

    if (DRY_RUN) {
      console.log(`  [dry-run] Would create tag: ${label} (${_id}, category: ${doc.category})`)
    } else {
      await client.createIfNotExists(doc)
      console.log(`  ✓ Created tag: ${label} (${doc.category})`)
    }
    tagIdMap.set(label, _id)
  }

  return tagIdMap
}

// ── Step 4: Create knowledge documents ──────────────────────────

function buildInsightDoc(
  entry: ReviewEntry,
  _id: string,
  authorIdMap: Map<string, string>,
  tagIdMap: Map<string, string>,
) {
  const doc: Record<string, unknown> = {
    _id,
    _type: 'insight',
    title: entry.title,
    slug: {current: entry.slug},
    confidence: entry.confidence,
    maturity: entry.maturity,
  }

  if (entry.quote) {
    doc.quote = entry.quote
  }
  if (entry.myTake && !entry.myTake.startsWith('←')) {
    doc.myTake = toPortableText(entry.myTake)
  }
  if (entry.sourceAuthor && authorIdMap.has(entry.sourceAuthor)) {
    doc.sourceAuthor = {_type: 'reference', _ref: authorIdMap.get(entry.sourceAuthor)}
  }
  if (entry.sourceTitle) doc.sourceTitle = entry.sourceTitle
  if (entry.sourceUrl) doc.sourceUrl = entry.sourceUrl

  // Tags
  if (entry.suggested_tags.length) {
    doc.tags = entry.suggested_tags
      .map((t) => tagIdMap.get(t) ?? tagIdMap.get(t.toLowerCase()))
      .filter(Boolean)
      .map((id, i) => ({_type: 'reference', _ref: id, _key: `tag-${i}`}))
  }

  return doc
}

function buildPrincipleDoc(
  entry: ReviewEntry,
  _id: string,
  authorIdMap: Map<string, string>,
  tagIdMap: Map<string, string>,
) {
  const doc: Record<string, unknown> = {
    _id,
    _type: 'principle',
    statement: entry.statement ?? entry.title,
    slug: {current: entry.slug},
    confidence: entry.confidence,
    maturity: entry.maturity,
  }

  if (entry.elaboration) {
    doc.elaboration = toPortableText(entry.elaboration)
  }
  if (entry.sourceAuthor && authorIdMap.has(entry.sourceAuthor)) {
    doc.sourceAuthor = {_type: 'reference', _ref: authorIdMap.get(entry.sourceAuthor)}
  }
  if (entry.sourceTitle) doc.sourceTitle = entry.sourceTitle
  if (entry.sourceUrl) doc.sourceUrl = entry.sourceUrl

  if (entry.suggested_tags.length) {
    doc.tags = entry.suggested_tags
      .map((t) => tagIdMap.get(t) ?? tagIdMap.get(t.toLowerCase()))
      .filter(Boolean)
      .map((id, i) => ({_type: 'reference', _ref: id, _key: `tag-${i}`}))
  }

  return doc
}

function buildProcessDoc(
  entry: ReviewEntry,
  _id: string,
  authorIdMap: Map<string, string>,
  tagIdMap: Map<string, string>,
) {
  const bodyText = (entry.body ?? entry.quote ?? '').trim()
  const summaryText =
    (entry.summary ?? '').trim() ||
    (bodyText ? bodyText.slice(0, 400) : entry.title)

  const doc: Record<string, unknown> = {
    _id,
    _type: 'process',
    title: entry.title,
    slug: {current: entry.slug},
    summary: summaryText,
    confidence: entry.confidence,
    maturity: entry.maturity,
    // Schema requires at least one step — use one placeholder, refine in Studio.
    steps: [
      {
        _type: 'step',
        _key: 'mymind-import-placeholder',
        title: 'Imported from MyMind (split into steps)',
        description: toPortableText(bodyText || summaryText),
      },
    ],
  }

  if (entry.sourceAuthor && authorIdMap.has(entry.sourceAuthor)) {
    doc.sourceAuthor = {_type: 'reference', _ref: authorIdMap.get(entry.sourceAuthor)}
  }
  if (entry.sourceTitle) doc.sourceTitle = entry.sourceTitle
  if (entry.sourceUrl) doc.sourceUrl = entry.sourceUrl

  if (entry.suggested_tags.length) {
    doc.tags = entry.suggested_tags
      .map((t) => tagIdMap.get(t) ?? tagIdMap.get(t.toLowerCase()))
      .filter(Boolean)
      .map((id, i) => ({_type: 'reference', _ref: id, _key: `tag-${i}`}))
  }

  return doc
}

function buildExternalResourceDoc(
  entry: ReviewEntry,
  _id: string,
  authorIdMap: Map<string, string>,
  tagIdMap: Map<string, string>,
) {
  const why =
    (entry.whyItMatters ?? '').trim() ||
    'Imported from MyMind — replace with a specific reason this resource matters for your team.'

  const doc: Record<string, unknown> = {
    _id,
    _type: 'externalResource',
    title: entry.title,
    slug: {current: entry.slug},
    url: entry.url ?? entry.sourceUrl,
    resourceType: entry.resourceType ?? 'article',
    whyItMatters: why,
    confidence: entry.confidence,
    maturity: entry.maturity,
  }

  if (entry.sourceAuthor && authorIdMap.has(entry.sourceAuthor)) {
    doc.author = {_type: 'reference', _ref: authorIdMap.get(entry.sourceAuthor)}
  }

  if (entry.suggested_tags.length) {
    doc.tags = entry.suggested_tags
      .map((t) => tagIdMap.get(t) ?? tagIdMap.get(t.toLowerCase()))
      .filter(Boolean)
      .map((id, i) => ({_type: 'reference', _ref: id, _key: `tag-${i}`}))
  }

  return doc
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  if (DRY_RUN) {
    console.log('🔍 DRY RUN — no documents will be created\n')
  }

  // Step 2: Authors
  console.log('👤 Ensuring sourceAuthor documents...')
  const authorIdMap = await ensureAuthors(entries)
  console.log(`   ${authorIdMap.size} authors ready\n`)

  // Step 3: Tags
  console.log('🏷️  Ensuring tag documents...')
  const tagIdMap = await ensureTags(entries)
  console.log(`   ${tagIdMap.size} tags ready\n`)

  // Step 4: Knowledge documents
  console.log('📚 Creating knowledge documents...')
  const results = {created: 0, skipped: 0, errors: 0}

  for (const entry of entries) {
    const primaryId = entry._mymind_ids[0]
    const _id = sanityId('mymind', primaryId)

    const builders: Record<string, typeof buildInsightDoc> = {
      insight: buildInsightDoc,
      principle: buildPrincipleDoc,
      process: buildProcessDoc,
      externalResource: buildExternalResourceDoc,
    }

    const builder = builders[entry.sanity_type]
    if (!builder) {
      console.error(`   ❌ Unknown type: ${entry.sanity_type} for "${entry.title}"`)
      results.errors++
      continue
    }

    const doc = builder(entry, _id, authorIdMap, tagIdMap)

    if (DRY_RUN) {
      console.log(`   [dry-run] ${entry.sanity_type}: ${entry.title}`)
      results.created++
      continue
    }

    try {
      await client.createIfNotExists(doc as Parameters<typeof client.createIfNotExists>[0])
      console.log(`   ✓ ${entry.sanity_type}: ${entry.title}`)
      results.created++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`   ❌ ${entry.title}: ${msg}`)
      results.errors++
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60))
  console.log(`✅ Import complete${DRY_RUN ? ' (dry run)' : ''}`)
  console.log(`   Created: ${results.created}`)
  console.log(`   Errors:  ${results.errors}`)
  console.log('')
  if (!DRY_RUN && results.created > 0) {
    console.log('📌 Next steps:')
    console.log('   1. Open Sanity Studio and review the imported documents')
    console.log('   2. Add your "My Take" interpretation to insights — that\'s the gold')
    console.log('   3. Adjust confidence levels (evergreen/evolving/experimental)')
    console.log('   4. Connect related entries to build the knowledge graph')
    console.log('   5. Publish documents to trigger the webhook → embedding pipeline')
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
