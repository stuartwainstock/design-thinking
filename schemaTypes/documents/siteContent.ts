import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const siteContentDocument = defineType({
  name: 'siteContent',
  title: 'Site content',
  type: 'document',
  icon: HomeIcon,
  description: 'Editable content for the landing page and chat page.',
  fields: [
    // ── Landing page ──
    defineField({
      name: 'landingEyebrow',
      title: 'Landing eyebrow',
      type: 'string',
      description: 'Small uppercase label above the headline (e.g. "Design thinking").',
      initialValue: 'Design thinking',
    }),
    defineField({
      name: 'landingHeadline',
      title: 'Landing headline',
      type: 'text',
      rows: 3,
      description:
        'Main hero headline. Use line breaks; the second line is shown in brand color on the web app (typically the value line — e.g. “design wisdom,”). Other lines use the default foreground color.',
      initialValue: "Your team's\ndesign wisdom,\nalways within reach",
    }),
    defineField({
      name: 'landingDescription',
      title: 'Landing description',
      type: 'text',
      rows: 3,
      description: 'Supporting paragraph below the headline.',
      initialValue:
        "Frameworks, processes, principles, and insights — curated by your design leaders, ready whenever you need them. Ask a question, get an opinionated answer grounded in what your team actually believes.",
    }),
    defineField({
      name: 'landingCta',
      title: 'Landing CTA label',
      type: 'string',
      description: 'Text for the main call-to-action button.',
      initialValue: 'Open knowledge chat',
    }),
    defineField({
      name: 'featureCards',
      title: 'Feature cards',
      type: 'array',
      description: 'The three feature highlight cards below the hero.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'icon', title: 'Emoji icon', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'string'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'description'},
          },
        }),
      ],
      initialValue: [
        {icon: '💡', label: 'Frameworks & models', description: 'Mental models your team uses daily'},
        {icon: '🧭', label: 'Processes & steps', description: 'How we actually do things here'},
        {icon: '✨', label: 'Principles & insights', description: 'Hard-won opinions, not platitudes'},
      ],
    }),

    // ── Chat page ──
    defineField({
      name: 'chatEyebrow',
      title: 'Chat eyebrow',
      type: 'string',
      description: 'Small uppercase label above the chat heading.',
      initialValue: 'Knowledge chat',
    }),
    defineField({
      name: 'chatHeadline',
      title: 'Chat headline',
      type: 'string',
      description: 'Main heading on the chat page.',
      initialValue: "Ask your team's brain",
    }),
    defineField({
      name: 'chatDescription',
      title: 'Chat description',
      type: 'text',
      rows: 2,
      description: 'Supporting text below the chat heading.',
      initialValue:
        "Every answer is grounded in your published frameworks, processes, and insights. Think of it as a conversation with your team's collected wisdom.",
    }),
    defineField({
      name: 'chatEmptyMessage',
      title: 'Chat empty state message',
      type: 'text',
      rows: 2,
      description: 'Text shown before the first message is sent.',
      initialValue:
        'Ask about frameworks, processes, principles, or insights.\nAnswers come from your published knowledge base.',
    }),
    defineField({
      name: 'chatStarters',
      title: 'Starter prompts',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Clickable prompt suggestions shown in the empty chat state.',
      initialValue: [
        'What frameworks help with problem framing?',
        'Walk me through our discovery process',
        'What principles guide critique?',
      ],
    }),
  ],

  // Singleton: only one document of this type should exist
  preview: {
    prepare: () => ({title: 'Site content'}),
  },
})
