import { defineType, defineField } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons'
import {
  confidenceField,
  phaseField,
  tagsField,
  relatedEntriesField,
  maturityField,
} from '../objects/sharedFields'

export const insightDocument = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  icon: BulbOutlineIcon,
  description: 'A learning from research, reading, or lived experience — with your interpretation attached.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'taxonomy', title: 'Taxonomy & relations' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'A short, memorable label for this insight. Not the quote — your framing of it.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Source quote or observation',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'The raw material — a pull quote, a research finding, or an observation.',
    }),
    defineField({
      name: 'myTake',
      title: 'My take',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description: 'Your interpretation. Why does this matter? What does it mean for how your team works? This is the most valuable field — it\'s what makes this your knowledge base, not just a bookmark list.',
    }),
    defineField({
      name: 'implications',
      title: 'Practical implications',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'What should someone do differently because of this insight?',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      group: 'content',
    }),
    defineField({
      name: 'sourceAuthor',
      title: 'Source author',
      type: 'reference',
      group: 'content',
      to: [{type: 'sourceAuthor'}],
      options: {
        disableNew: false,
      },
      description: 'Pick an existing author or create one — reuse across insights.',
    }),
    defineField({
      name: 'sourceTitle',
      title: 'Source title',
      type: 'string',
      group: 'content',
      description: 'Book, article, talk, podcast episode, etc.',
    }),
    { ...phaseField, group: 'taxonomy' },
    { ...tagsField, group: 'taxonomy' },
    { ...confidenceField, group: 'taxonomy' },
    { ...maturityField, group: 'taxonomy' },
    { ...relatedEntriesField, group: 'taxonomy' },
  ],
  preview: {
    select: {
      title: 'title',
      authorName: 'sourceAuthor.name',
      confidence: 'confidence',
    },
    prepare({ title, authorName, confidence }) {
      const icons: Record<string, string> = {
        evergreen: '🌲',
        evolving: '🌱',
        experimental: '🧪',
        retired: '🗄️',
      }
      return {
        title: `${icons[confidence] ?? ''} ${title}`,
        subtitle: authorName ? `via ${authorName}` : undefined,
      }
    },
  },
})
