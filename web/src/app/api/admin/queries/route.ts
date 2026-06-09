import {NextResponse} from 'next/server'
import {checkAdminToken, getQueryAnalytics} from '@/lib/queryAnalytics'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!process.env.ADMIN_ACCESS_TOKEN) {
    return NextResponse.json(
      {error: 'ADMIN_ACCESS_TOKEN is not configured on the server'},
      {status: 503},
    )
  }

  if (!checkAdminToken(request)) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  try {
    const data = await getQueryAnalytics()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load analytics'
    return NextResponse.json({error: message}, {status: 502})
  }
}
