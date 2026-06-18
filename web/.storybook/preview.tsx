import type {Preview} from '@storybook/react-vite'
import '../src/app/globals.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        className="text-foreground min-h-screen antialiased"
        style={{
          background: 'var(--background)',
          fontFamily: "Nunito, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {disable: true},
    options: {
      storySort: {
        order: [
          'Design System',
          ['Introduction', 'Foundations', 'Patterns', 'Components'],
        ],
      },
    },
  },
}

export default preview
