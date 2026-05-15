import type {Meta, StoryObj} from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Foundations/Typography',
  parameters: {layout: 'padded'},
}

export default meta

type Story = StoryObj

export const Scale: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <p className="text-muted text-sm font-semibold">
        Font family: Nunito (500–800) via <code className="font-mono text-xs">next/font</code> in{' '}
        <code className="font-mono text-xs">layout.tsx</code>.
      </p>
      <div>
        <p className="text-cta mb-2 text-xs font-extrabold uppercase tracking-[0.2em]">
          Eyebrow
        </p>
        <p className="text-cta flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em]">
          <span className="bg-sunshine inline-block size-2 rounded-full" aria-hidden />
          Design thinking
        </p>
      </div>
      <div>
        <p className="text-muted mb-2 text-xs font-bold">Hero (md: text-6xl)</p>
        <h1 className="text-foreground text-4xl font-extrabold tracking-tight md:text-6xl md:leading-[1.08]">
          Your team&apos;s
          <br />
          <span className="text-brand">design wisdom,</span>
          <br />
          always within reach
        </h1>
      </div>
      <div>
        <p className="text-muted mb-2 text-xs font-bold">Body large</p>
        <p className="text-muted text-lg font-semibold leading-relaxed md:text-xl">
          Frameworks, processes, principles, and insights — curated by your design leaders.
        </p>
      </div>
      <div>
        <p className="text-muted mb-2 text-xs font-bold">Chat page title</p>
        <h2 className="text-brand text-3xl font-extrabold tracking-tight md:text-4xl">
          Ask your team&apos;s brain
        </h2>
      </div>
      <div>
        <p className="text-muted mb-2 text-xs font-bold">Label / chip</p>
        <span className="text-brand text-xs font-bold">Starter prompt</span>
      </div>
    </div>
  ),
}
