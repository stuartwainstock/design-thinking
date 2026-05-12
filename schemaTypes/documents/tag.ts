import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const tagDocument = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'label' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Groups tags in the UI and helps the agent understand tag intent',
      options: {
        list: [
          { title: 'Discipline — area of design practice', value: 'discipline' },
          { title: 'Activity — a type of work or exercise', value: 'activity' },
          { title: 'Mindset — a way of thinking or orienting', value: 'mindset' },
          { title: 'Stakeholder — who this involves', value: 'stakeholder' },
          { title: 'Quality — a standard or attribute of good work', value: 'quality' },
          { title: 'Tool — a specific tool or medium', value: 'tool' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional clarification for when the tag label alone is ambiguous',
    }),
  ],
  orderings: [
    {
      title: 'Category then label',
      name: 'categoryLabel',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'label', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'label', subtitle: 'category' },
  },
})
