import {revalidatePath} from 'next/cache'
import {NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'

const SITE_CONTENT_TYPE = 'siteContent'
const SITE_CONTENT_ID = 'siteContent'

function checkRevalidateSecret(request: Request): boolean {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected) return false
  const header = request.headers.get('x-revalidate-secret')
  const query = new URL(request.url).searchParams.get('secret')
  return header === expected || query === expected
}

/** True when the webhook is for Site content (or body omitted for manual pings). */
function shouldRevalidateSiteContent(body: unknown): boolean {
  if (body == null) return true
  if (typeof body !== 'object') return false
  const o = body as Record<string, unknown>
  const docType = o._type ?? o.documentType
  const docId = o._id ?? o.documentId
  if (docType === SITE_CONTENT_TYPE || docId === SITE_CONTENT_ID) return true
  if (docType == null && docId == null) return true
  return false
}

export async function POST(request: Request) {
  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      {error: 'REVALIDATE_SECRET is not configured on the server'},
      {status: 503},
    )
  }

  if (!checkRevalidateSecret(request)) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  let body: unknown = null
  try {
    const text = await request.text()
    if (text.trim()) body = JSON.parse(text)
  } catch {
    return NextResponse.json({error: 'Invalid JSON body'}, {status: 400})
  }

  if (!shouldRevalidateSiteContent(body)) {
    return NextResponse.json({
      skipped: true,
      reason: `expected ${SITE_CONTENT_TYPE}, got ${String((body as Record<string, unknown>)?._type ?? 'unknown')}`,
    })
  }

  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/chat')

  return NextResponse.json({
    revalidated: true,
    paths: ['/', '/chat'],
    at: new Date().toISOString(),
  })
}
