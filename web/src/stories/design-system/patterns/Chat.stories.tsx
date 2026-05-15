import type {Meta, StoryObj} from '@storybook/react'
import {ChatPanel} from '@/components/ChatPanel'

const meta: Meta<typeof ChatPanel> = {
  title: 'Design System/Components/ChatPanel',
  component: ChatPanel,
  parameters: {layout: 'padded'},
  args: {
    requiresAccessToken: false,
    emptyMessage:
      'Ask about frameworks, processes, principles, or insights.\nAnswers come from your published knowledge base.',
    starters: [
      'What frameworks help with problem framing?',
      'Walk me through our discovery process',
      'What principles guide critique?',
    ],
  },
}

export default meta

type Story = StoryObj<typeof ChatPanel>

export const EmptyState: Story = {}

export const TokenGate: Story = {
  args: {
    requiresAccessToken: true,
  },
}

export const MessageBubbles: Story = {
  render: () => (
    <div className="border-border-playful bg-surface max-w-2xl space-y-4 rounded-3xl border-2 p-6 shadow-lg">
      <div className="bg-brand text-white ml-16 rounded-2xl rounded-br-md px-4 py-3 text-sm font-medium shadow-sm">
        <span className="mb-1.5 block text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-white/70">
          You
        </span>
        <p className="whitespace-pre-wrap leading-relaxed">
          What frameworks help with problem framing?
        </p>
      </div>
      <div className="border-border-playful bg-surface-elevated text-foreground mr-16 rounded-2xl rounded-bl-md border-2 px-4 py-3 text-sm font-medium shadow-sm">
        <span className="text-cta mb-1.5 inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.15em]">
          <span className="bg-cta/60 inline-block size-1.5 rounded-full" aria-hidden />
          Knowledge base
        </span>
        <p className="whitespace-pre-wrap leading-relaxed">
          The framework &quot;How Might We&quot; suggests reframing problems as opportunities…
        </p>
      </div>
    </div>
  ),
}
