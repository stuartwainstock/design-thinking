import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const sourceAuthorDocument = defineType({
  name: 'sourceAuthor',
  title: 'Source author',
  type: 'document',
  icon: UserIcon,
  description:
    'Reusable people or orgs you cite (books, articles, talks). Link insights and references here instead of retyping names.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role or label',
      type: 'string',
      description: 'e.g. Author, Researcher, Organisation',
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      description: 'Optional — helps the team remember who this is.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
