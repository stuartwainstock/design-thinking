import Anthropic from '@anthropic-ai/sdk'
import type {MessageParam} from '@anthropic-ai/sdk/resources/messages'
import {NextResponse} from 'next/server'
import {fetchKnowledgeContext, snippetsToContextJson} from '@/lib/knowledge'

export const maxDuration = 60

type ChatMessage = {role: 'user' | 'assistant'; content: string}

function checkChatToken(request: Request): boolean {
  const expected = process.env.CHAT_ACCESS_TOKEN
  if (!expected) return true
  const got = request.headers.get('x-chat-access-token')
  return got === expected
}

/** Anthropic requires alternating user/assistant; merge consecutive same-role turns. */
function toAnthropicMessages(messages: ChatMessage[]): MessageParam[] {
  const trimmed = messages.filter((m) => m?.content?.trim())
  while (trimmed.length && trimmed[0].role === 'assistant') trimmed.shift()
  const out: MessageParam[] = []
  for (const m of trimmed) {
    const last = out[out.length - 1]
    if (last && last.role === m.role) {
      last.content = `${last.content}\n\n${m.content}`
    } else {
      out.push({role: m.role, content: m.content})
    }
  }
  return out
}

function extractTextFromMessage(msg: Anthropic.Messages.Message): string {
  const parts: string[] = []
  for (const block of msg.content) {
    if (block.type === 'text') parts.push(block.text)
  }
  return parts.join('\n').trim()
}

export async function POST(request: Request) {
  if (!checkChatToken(request)) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {error: 'Server missing ANTHROPIC_API_KEY. Add it to web/.env.local.'},
      {status: 503},
    )
  }

  let body: {messages?: ChatMessage[]}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid JSON'}, {status: 400})
  }

  const raw = body.messages?.filter((m) => m?.role && m?.content) ?? []
  if (!raw.length) {
    return NextResponse.json({error: 'messages[] required'}, {status: 400})
  }

  const anthropicMessages = toAnthropicMessages(raw)
  if (!anthropicMessages.length || anthropicMessages[0].role !== 'user') {
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

  const model =
    process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514'

  const system = `You are the design-thinking knowledge assistant for a small internal team.
You must answer ONLY from the JSON CONTEXT below (published entries from their CMS). 
If the answer is not supported by CONTEXT, say you do not have that in the knowledge base and suggest what kind of entry would help.
Be concise. Cite entry types and titles when possible. Do not invent authors or sources.

CONTEXT:
${contextJson}`

  const client = new Anthropic({apiKey})

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    system,
    messages: anthropicMessages,
    temperature: 0.3,
  })

  const text = extractTextFromMessage(response)
  if (!text) {
    return NextResponse.json({error: 'Empty model response'}, {status: 502})
  }

  return NextResponse.json({reply: text})
}
