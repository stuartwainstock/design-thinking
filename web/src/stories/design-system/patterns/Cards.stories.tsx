import type {Meta, StoryObj} from '@storybook/react-vite'

const CARD_COLORS = [
  'bg-sunshine/20 border-sunshine/40',
  'bg-brand-light border-brand/20',
  'bg-pink/10 border-pink/25',
] as const

const meta: Meta = {
  title: 'Design System/Patterns/Cards',
  parameters: {layout: 'padded'},
}

export default meta

type Story = StoryObj

export const FeatureCard: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
      {[
        {icon: '💡', label: 'Frameworks & models', description: 'Mental models your team uses daily'},
        {icon: '🧭', label: 'Processes & steps', description: 'How we actually do things here'},
        {icon: '✨', label: 'Principles & insights', description: 'Hard-won opinions, not platitudes'},
      ].map((card, i) => (
        <div
          key={card.label}
          className={`hover-lift rounded-2xl border-2 ${CARD_COLORS[i % CARD_COLORS.length]} px-5 py-4`}
        >
          <span className="text-2xl" aria-hidden>
            {card.icon}
          </span>
          <p className="text-foreground mt-2 text-sm font-extrabold">{card.label}</p>
          <p className="text-muted mt-0.5 text-xs font-semibold leading-relaxed">{card.description}</p>
        </div>
      ))}
    </div>
  ),
}
