import {revalidatePath} from 'next/cache'
import {NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET
  const secret = new URL(request.url).searchParams.get('secret')
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  revalidatePath('/')
  revalidatePath('/chat')

  return NextResponse.json({revalidated: true})
}
