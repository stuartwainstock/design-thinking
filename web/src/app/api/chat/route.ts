import {NextResponse} from 'next/server'
import OpenAI from 'openai'
import {fetchKnowledgeContext, snippetsToContextJson} from '@/lib/knowledge'

export const maxDuration = 60

type ChatMessage = {role: 'user' | 'assistant'; content: string}

function checkChatToken(request: Request): boolean {
  const expected = process.env.CHAT_ACCESS_TOKEN
  if (!expected) return true
  const got = request.headers.get('x-chat-access-token')
  return got === expected
}

export async function POST(request: Request) {
  if (!checkChatToken(request)) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {error: 'Server missing OPENAI_API_KEY. Add it to web/.env.local.'},
      {status: 503},
    )
  }

  let body: {messages?: ChatMessage[]}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid JSON'}, {status: 400})
  }

  const messages = body.messages?.filter((m) => m?.role && m?.content) ?? []
  if (!messages.length) {
    return NextResponse.json({error: 'messages[] required'}, {status: 400})
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser) {
    return NextResponse.json({error: 'Include at least one user message'}, {status: 400})
  }

  let contextJson: string
  try {
    const rows = await fetchKnowledgeContext()
    contextJson = snippetsToContextJson(rows)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Sanity fetch failed'
    return NextResponse.json({error: msg}, {status: 502})
  }

  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

  const openai = new OpenAI({apiKey})

  const system = `You are the design-thinking knowledge assistant for a small internal team.
You must answer ONLY from the JSON CONTEXT below (published entries from their CMS). 
If the answer is not supported by CONTEXT, say you do not have that in the knowledge base and suggest what kind of entry would help.
Be concise. Cite entry types and titles when possible. Do not invent authors or sources.

CONTEXT:
${contextJson}`

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {role: 'system', content: system},
      ...messages.map((m) => ({role: m.role, content: m.content})),
    ],
    temperature: 0.3,
  })

  const text = completion.choices[0]?.message?.content?.trim()
  if (!text) {
    return NextResponse.json({error: 'Empty model response'}, {status: 502})
  }

  return NextResponse.json({reply: text})
}
