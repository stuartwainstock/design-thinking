# Build: Export chat responses to PPTX

## What we're building

Add an "Export as slides" feature to the design knowledge agent chat. When the agent gives an actionable insight, a suggested prompt CTA appears below the response. Clicking it triggers a flow that structures the content into slides and generates a downloadable .pptx file.

## Architecture

```
User clicks "Export as slides" CTA
  → POST /api/export with { content, question }
  → API route calls Claude to structure markdown into slide layout JSON
  → PptxGenJS generates .pptx from the structured layout
  → Binary response triggers browser download
```

## Implementation steps

### 1. Install PptxGenJS

```bash
cd web && npm install pptxgenjs
```

### 2. Create the export API route at `web/src/app/api/export/route.ts`

This route:
- Accepts `{ content: string, question: string }` — the assistant's markdown response and the user's original question
- Calls Claude (same Anthropic SDK pattern as `api/chat/route.ts`) with a system prompt that instructs it to restructure the content into 1-3 slides, returning JSON like:
  ```json
  {
    "slides": [
      {
        "title": "...",
        "points": ["...", "..."],
        "takeaway": "..."
      }
    ]
  }
  ```
- Passes that JSON to PptxGenJS to render a .pptx
- Returns the binary with `Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation` and `Content-Disposition: attachment; filename="insight.pptx"`
- Uses the same `ANTHROPIC_API_KEY` env var and auth check pattern (`x-chat-access-token`) from `route.ts`

The Claude prompt for structuring should emphasize:
- Use the user's question as context for the slide title
- Extract key points, not verbatim markdown — concise, presentation-ready language
- Include a clear takeaway or "so what" on each slide
- Keep it to 1-3 slides — don't over-split

### 3. Create a slide template

Define a simple branded template in the export route or a shared `lib/slideTemplate.ts`:
- Clean, minimal layout (white background, dark text)
- Title slide uses the question/topic as the heading
- Content slides: title at top, bullet points in body, takeaway as a highlighted footer line
- Keep it simple — users will customize in their target app (Keynote, Google Slides, etc.)

### 4. Add the CTA to ChatPanel.tsx

In `web/src/components/ChatPanel.tsx`, add an "Export as slides" button below assistant messages. Key details:
- The component currently renders assistant messages using `<AssistantMarkdown>` (see line ~214 area)
- The message type is `{role: 'user' | 'assistant', content: string}`
- Add the CTA below assistant messages — style it like the existing conversation starters (subtle, pill-shaped)
- Only show it on assistant responses (not user messages), and not while loading
- On click: POST to `/api/export` with the message content and the preceding user message as the question
- Handle the binary response as a file download (create a blob URL, trigger click on a temp anchor)
- Show a brief loading state on the button while generating

### 5. File reference

These are the key files to understand before writing code:
- `web/src/app/api/chat/route.ts` — existing API pattern, auth check, Anthropic SDK usage
- `web/src/components/ChatPanel.tsx` — chat UI, message rendering, where the CTA goes
- `web/src/components/AssistantMarkdown.tsx` — how markdown is currently rendered (for reference)
- `web/src/lib/knowledge.ts` — types and retrieval (not directly needed, but useful context)
- `web/src/app/chat/page.tsx` — chat page wrapper

Read `CLAUDE.md` in the project root for full architecture context, coding conventions, and env var patterns.

## What "done" looks like

- An "Export as slides" CTA appears below actionable assistant responses
- Clicking it generates a .pptx and triggers a browser download
- The slides are well-structured (not just dumped markdown) — Claude reformats the content for presentation
- The .pptx opens cleanly in Keynote, Google Slides, Figma Slides, and PowerPoint
- No changes to the existing chat flow, RAG pipeline, or database
