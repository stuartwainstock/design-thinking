/**
 * Renders a JSON-LD <script> tag. Data must come from a trusted source (our
 * Sanity CMS), so JSON.stringify output is safe to inline. We escape `<` to
 * avoid prematurely closing the script tag if content ever contains markup.
 */
export function JsonLd({data}: {data: Record<string, unknown>}) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: json}} />
}
