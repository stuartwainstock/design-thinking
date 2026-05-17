import type {Meta, StoryObj} from '@storybook/react'
import {ExportSlidesButton} from '@/components/ExportSlidesButton'

const meta: Meta<typeof ExportSlidesButton> = {
  title: 'Design System/Patterns/Export slides',
  component: ExportSlidesButton,
  parameters: {layout: 'padded'},
  args: {
    onClick: () => undefined,
    loading: false,
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof ExportSlidesButton>

export const Default: Story = {}

export const Generating: Story = {
  args: {
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

/** Typical placement below an assistant bubble */
export const BelowAssistantMessage: Story = {
  render: () => (
    <div className="max-w-2xl space-y-1.5">
      <div className="border-border-playful bg-surface-elevated text-foreground mr-8 rounded-2xl rounded-bl-md border-2 px-4 py-3 text-sm font-medium shadow-sm md:mr-16">
        <span className="text-brand mb-1.5 inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.15em]">
          <span className="bg-brand/60 inline-block size-1.5 rounded-full" aria-hidden />
          Knowledge base
        </span>
        <p className="text-muted text-sm font-semibold leading-relaxed">
          Response content renders as markdown above this control.
        </p>
      </div>
      <div className="mr-8 flex md:mr-16">
        <ExportSlidesButton onClick={() => undefined} />
      </div>
    </div>
  ),
}
