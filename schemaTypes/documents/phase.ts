import { defineType, defineField } from 'sanity'
import { ProjectsIcon } from '@sanity/icons'

export const phaseDocument = defineType({
  name: 'phase',
  title: 'Phase',
  type: 'document',
  icon: ProjectsIcon,
  description: 'A stage in the design process. Keep these high-level — they\'re the primary lens for organising all knowledge.',
  fields: [
    defineField({
      name: 'name',
      title: 'Phase name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What is the goal of this phase? What questions is the team trying to answer?',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls display order. 1 = first.',
    }),
    defineField({
      name: 'color',
      title: 'Colour',
      type: 'string',
      description: 'Optional hex colour for visual differentiation in the studio',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex colour' }).warning(),
    }),
  ],
  orderings: [
    {
      title: 'Process order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'description' },
    prepare({ title, subtitle }) {
      return { title, subtitle }
    },
  },
})
