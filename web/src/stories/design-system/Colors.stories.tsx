import type {Meta, StoryObj} from '@storybook/react-vite'
import {colorTokens, tailwindColorClasses} from './tokenData'

function Swatch({token}: {token: (typeof colorTokens)[number]}) {
  return (
    <div className="border-border-playful bg-surface flex flex-col overflow-hidden rounded-2xl border-2">
      <div className="h-20 w-full" style={{backgroundColor: `var(${token.variable})`}} />
      <div className="space-y-1 p-4">
        <p className="text-foreground text-sm font-extrabold">{token.name}</p>
        <p className="text-muted font-mono text-xs">{token.variable}</p>
        <p className="text-muted font-mono text-xs">{token.hex}</p>
        <p className="text-muted text-xs font-semibold leading-snug">{token.usage}</p>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Design System/Foundations/Colors',
  parameters: {layout: 'padded'},
}

export default meta

type Story = StoryObj

export const Palette: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {colorTokens.map((token) => (
        <Swatch key={token.variable} token={token} />
      ))}
    </div>
  ),
}

export const TailwindMappings: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-muted max-w-2xl text-sm font-semibold">
        Tailwind reads these via <code className="font-mono text-xs">@theme inline</code> in{' '}
        <code className="font-mono text-xs">globals.css</code>.
      </p>
      <ul className="border-border-playful bg-surface divide-border-playful divide-y rounded-2xl border-2">
        {tailwindColorClasses.map((cls) => (
          <li key={cls} className="flex items-center justify-between gap-4 px-4 py-3">
            <code className="text-brand font-mono text-sm font-bold">{cls}</code>
            <span
              className={`${cls} border-border-playful h-8 min-w-24 rounded-lg border-2 px-3 py-1 text-xs font-bold`}
            >
              sample
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
}
