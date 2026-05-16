import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type {Components} from 'react-markdown'

const components: Components = {
  h2: ({children}) => (
    <h2 className="text-brand mt-4 mb-2 text-base font-extrabold first:mt-0">{children}</h2>
  ),
  h3: ({children}) => (
    <h3 className="text-foreground mt-3 mb-1.5 text-sm font-extrabold">{children}</h3>
  ),
  p: ({children}) => <p className="mb-3 font-medium leading-relaxed last:mb-0">{children}</p>,
  strong: ({children}) => <strong className="font-extrabold">{children}</strong>,
  em: ({children}) => <em className="italic">{children}</em>,
  blockquote: ({children}) => (
    <blockquote className="border-brand/40 bg-brand-light/60 text-foreground my-3 border-l-4 py-2 pl-4 not-italic">
      {children}
    </blockquote>
  ),
  ul: ({children}) => <ul className="mb-3 list-disc space-y-1.5 pl-5 font-medium">{children}</ul>,
  ol: ({children}) => <ol className="mb-3 list-decimal space-y-1.5 pl-5 font-medium">{children}</ol>,
  li: ({children}) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="border-border-playful my-4 border-t-2" />,
  a: ({href, children}) => (
    <a
      href={href}
      className="text-brand font-bold underline decoration-brand/40 underline-offset-2 hover:text-brand-muted"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  pre: ({children}) => (
    <pre className="bg-sunshine-wash border-border-playful my-3 overflow-x-auto rounded-xl border p-3 font-mono text-xs font-semibold leading-relaxed">
      {children}
    </pre>
  ),
  code: ({className, children}) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-sunshine-wash text-brand rounded px-1 py-0.5 font-mono text-[0.85em] font-semibold">
        {children}
      </code>
    ),
}

export function AssistantMarkdown({content}: {content: string}) {
  return (
    <div className="chat-markdown text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
