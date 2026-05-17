import type {Meta, StoryObj} from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Patterns/Navigation',
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj

export const SiteNav: Story = {
  name: 'Site header nav',
  render: () => (
    <header className="px-4 pt-4 pb-2">
      <nav className="border-border-playful bg-surface/90 text-foreground mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border-2 px-3 py-2 pl-5 text-sm font-semibold shadow-md backdrop-blur-md">
        <a
          href="/"
          className="text-brand hover:text-brand-muted group inline-flex items-center gap-2.5 lowercase transition-colors"
        >
          <span className="flex flex-col gap-0.5" aria-hidden>
            <span className="flex gap-0.5">
              <span className="bg-cta-accent size-1.5 rounded-full transition-transform group-hover:scale-125" />
              <span className="bg-sunshine size-1.5 rounded-full transition-transform group-hover:scale-125" />
            </span>
            <span className="flex gap-0.5">
              <span className="bg-brand size-1.5 rounded-full transition-transform group-hover:scale-125" />
              <span className="bg-pink size-1.5 rounded-full transition-transform group-hover:scale-125" />
            </span>
          </span>
          <span className="text-base font-extrabold leading-none tracking-tight">design thinking</span>
        </a>
        <a
          href="/chat"
          className="bg-cta hover:bg-cta-hover hover-lift rounded-full px-5 py-2.5 text-sm font-extrabold tracking-wide text-white uppercase shadow-sm transition-colors"
        >
          Chat
        </a>
      </nav>
    </header>
  ),
}

export const Footer: Story = {
  render: () => (
    <footer className="border-border-playful border-t-2 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
        <div className="flex gap-2" aria-hidden>
          <span className="bg-pink size-2.5 rounded-full" />
          <span className="bg-sunshine size-2.5 rounded-full" />
          <span className="bg-brand size-2.5 rounded-full" />
          <span className="bg-green size-2.5 rounded-full" />
          <span className="bg-purple size-2.5 rounded-full" />
        </div>
        <p className="text-muted text-center text-xs font-semibold leading-relaxed">
          Built with care on{' '}
          <a href="https://www.sanity.io" className="text-brand hover:text-brand-muted font-bold">
            Sanity
          </a>
          {' · '}
          Powered by{' '}
          <a href="https://www.anthropic.com" className="text-brand hover:text-brand-muted font-bold">
            Claude
          </a>
        </p>
      </div>
    </footer>
  ),
}
