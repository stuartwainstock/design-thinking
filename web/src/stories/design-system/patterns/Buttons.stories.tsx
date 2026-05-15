import type {Meta, StoryObj} from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Patterns/Buttons',
  parameters: {layout: 'centered'},
}

export default meta

type Story = StoryObj

export const PrimaryCta: Story = {
  name: 'Primary CTA (landing)',
  render: () => (
    <a
      href="/chat"
      className="bg-cta hover:bg-cta-hover hover-lift inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold tracking-wide text-white uppercase shadow-lg transition-all"
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Open knowledge chat
    </a>
  ),
}

export const NavChatPill: Story = {
  name: 'Nav chat pill',
  render: () => (
    <a
      href="/chat"
      className="bg-cta hover:bg-cta-hover hover-lift rounded-full px-5 py-2.5 text-sm font-extrabold tracking-wide text-white uppercase shadow-sm transition-colors"
    >
      Chat
    </a>
  ),
}

export const StarterChip: Story = {
  name: 'Starter prompt chip',
  render: () => (
    <button
      type="button"
      className="border-border-playful text-brand hover:bg-sunshine-wash hover-lift rounded-full border-2 px-4 py-2 text-xs font-bold transition-all"
    >
      What frameworks help with problem framing?
    </button>
  ),
}

export const SendIcon: Story = {
  name: 'Send (icon button)',
  render: () => (
    <button
      type="button"
      className="bg-cta hover:bg-cta-hover flex size-10 items-center justify-center rounded-xl text-white shadow-sm transition-colors"
      aria-label="Send message"
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  ),
}
