/** CSS custom properties from `src/app/globals.css` — single source for Storybook token docs. */
export type ColorToken = {
  name: string
  variable: string
  hex: string
  usage: string
}

export const colorTokens: ColorToken[] = [
  {name: 'Background', variable: '--background', hex: '#FFF8E1', usage: 'Page canvas'},
  {name: 'Foreground', variable: '--foreground', hex: '#1A1A2E', usage: 'Primary text'},
  {name: 'Sunshine', variable: '--sunshine', hex: '#FFD43B', usage: 'Accent, eyebrows, decorative shapes'},
  {name: 'Sunshine soft', variable: '--sunshine-soft', hex: '#FFF0B3', usage: 'Soft highlights'},
  {name: 'Sunshine wash', variable: '--sunshine-wash', hex: '#FFFCEB', usage: 'Hover fills, code chips'},
  {name: 'Brand', variable: '--brand', hex: '#2B4ACB', usage: 'Headlines, links, user chat bubbles'},
  {name: 'Brand muted', variable: '--brand-muted', hex: '#4A64D6', usage: 'Link hover'},
  {name: 'Brand light', variable: '--brand-light', hex: '#E8EDFF', usage: 'Feature card variant'},
  {name: 'CTA', variable: '--cta', hex: '#B8470F', usage: 'Primary button fill (white label text)'},
  {name: 'CTA hover', variable: '--cta-hover', hex: '#9E3D12', usage: 'Button hover'},
  {name: 'CTA accent', variable: '--cta-accent', hex: '#FF6B35', usage: 'Decorative dots only — not for text on light backgrounds'},
  {name: 'Pink', variable: '--pink', hex: '#FF4D6A', usage: 'Decorative accents'},
  {name: 'Green', variable: '--green', hex: '#00C389', usage: 'Decorative accents'},
  {name: 'Purple', variable: '--purple', hex: '#7B61FF', usage: 'Decorative accents'},
  {name: 'Surface', variable: '--surface', hex: '#FFFFFF', usage: 'Cards, nav pill, inputs'},
  {name: 'Surface elevated', variable: '--surface-elevated', hex: '#FFFEF5', usage: 'Assistant bubbles'},
  {name: 'Border playful', variable: '--border-playful', hex: '#F0E6C8', usage: 'Borders, dashed secondary controls'},
  {name: 'Muted', variable: '--muted', hex: '#6B6B80', usage: 'Secondary text'},
]

export const tailwindColorClasses = [
  'bg-background',
  'text-foreground',
  'bg-sunshine',
  'bg-brand',
  'text-brand',
  'bg-cta',
  'bg-surface',
  'border-border-playful',
  'text-muted',
] as const
