import { defineType, defineField } from 'sanity'
import { ListIcon } from '@sanity/icons'

export const stepObject = defineType({
  name: 'step',
  title: 'Step',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Step title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'What happens in this step',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tips',
      title: 'Tips for doing this well',
      type: 'array',
      of: [{ type: 'string' }],
      options: { sortable: true },
    }),
    defineField({
      name: 'watchOuts',
      title: 'Watch-outs',
      description: 'Common mistakes or failure modes at this step',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'outputs',
      title: 'What this step produces',
      type: 'string',
      description: 'The tangible artifact or decision that comes out of this step',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'outputs' },
  },
})
