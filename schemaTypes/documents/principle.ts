import { defineType, defineField } from 'sanity'
import { BlockquoteIcon } from '@sanity/icons'
import {
  confidenceField,
  phaseField,
  tagsField,
  relatedEntriesField,
  maturityField,
  sourceAuthorField,
  sourceTitleField,
  sourceUrlField,
} from '../objects/sharedFields'

export const principleDocument = defineType({
  name: 'principle',
  title: 'Principle',
  type: 'document',
  icon: BlockquoteIcon,
  description: 'A core belief, one-liner, or opinionated stance on how good design work gets done.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'attribution', title: 'Attribution' },
    { name: 'taxonomy', title: 'Taxonomy & relations' },
  ],
  fields: [
    defineField({
      name: 'statement',
      title: 'The principle',
      type: 'string',
      group: 'content',
      description: 'The one-liner itself. Should be quotable and memorable — the kind of thing you\'d say in a critique.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'statement' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'elaboration',
      title: 'Elaboration',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description: 'The thinking behind it. What does this mean in practice? Where does it come from?',
    }),
    defineField({
      name: 'origin',
      title: 'Origin',
      type: 'string',
      group: 'content',
      description: 'Where did this come from? Your own experience, a mentor, a book? Attribution builds credibility.',
    }),
    defineField({
      name: 'goodExample',
      title: 'Good example',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'A concrete situation where this principle led to better work.',
    }),
    defineField({
      name: 'antiExample',
      title: 'Counter-example',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'What does violating this principle look like in practice? Negative examples teach as much as positive ones.',
    }),
    defineField({
      name: 'tension',
      title: 'Tensions',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Are there situations where this principle conflicts with another? Good principles have edges.',
    }),
    { ...sourceAuthorField, group: 'attribution' },
    { ...sourceTitleField, group: 'attribution' },
    { ...sourceUrlField, group: 'attribution' },
    { ...phaseField, group: 'taxonomy' },
    { ...tagsField, group: 'taxonomy' },
    { ...confidenceField, group: 'taxonomy' },
    { ...maturityField, group: 'taxonomy' },
    { ...relatedEntriesField, group: 'taxonomy' },
  ],
  preview: {
    select: {
      title: 'statement',
      subtitle: 'origin',
      confidence: 'confidence',
    },
    prepare({ title, subtitle, confidence }) {
      const icons: Record<string, string> = {
        evergreen: '🌲',
        evolving: '🌱',
        experimental: '🧪',
        retired: '🗄️',
      }
      return {
        title: `${icons[confidence] ?? ''} ${title}`,
        subtitle: subtitle ? `— ${subtitle}` : undefined,
      }
    },
  },
})
