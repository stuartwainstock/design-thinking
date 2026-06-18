import type {Meta, StoryObj} from '@storybook/react-vite'

const meta: Meta = {
  title: 'Design System/Foundations/Motion',
  parameters: {layout: 'padded'},
}

export default meta

type Story = StoryObj

export const FloatingShapes: Story = {
  render: () => (
    <div className="relative flex h-64 items-center justify-center gap-8 rounded-3xl border-2 border-dashed border-border-playful">
      <div className="animate-float">
        <div className="bg-sunshine blob-1 size-14 opacity-60" />
      </div>
      <div className="animate-float-slow">
        <div className="bg-pink blob-2 size-10 opacity-40" />
      </div>
      <div className="animate-bounce-gentle">
        <div className="bg-brand blob-3 size-9 opacity-30" />
      </div>
      <div className="animate-wiggle">
        <div className="bg-green size-7 rounded-full opacity-40" />
      </div>
      <div className="animate-pulse-soft">
        <div className="bg-purple size-6 rounded-full opacity-35" />
      </div>
    </div>
  ),
}

export const HoverLift: Story = {
  render: () => (
    <button
      type="button"
      className="hover-lift bg-cta rounded-full px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg"
    >
      Hover me
    </button>
  ),
}
