import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const siteContentDocument = defineType({
  name: 'siteContent',
  title: 'Site content',
  type: 'document',
  icon: HomeIcon,
  description: 'Editable content for the landing page and chat page.',
  fields: [
    // ── Global navigation ──
    defineField({
      name: 'navBrandLabel',
      title: 'Nav brand label',
      type: 'string',
      description: 'Wordmark text in the top-left of the nav bar (displayed in lowercase).',
      initialValue: 'design thinking',
    }),
    defineField({
      name: 'navCtaLabel',
      title: 'Nav CTA label',
      type: 'string',
      description: 'Text on the top-right nav button.',
      initialValue: 'Chat',
    }),
    defineField({
      name: 'navCtaHref',
      title: 'Nav CTA link',
      type: 'string',
      description: 'Where the nav button points. Use a path like "/chat" for internal pages.',
      initialValue: '/chat',
    }),

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

    // ── About / Mission ──
    defineField({
      name: 'aboutEyebrow',
      title: 'About eyebrow',
      type: 'string',
      description: 'Short uppercase label above the mission headline.',
      initialValue: 'About',
    }),
    defineField({
      name: 'aboutHeadline',
      title: 'About headline',
      type: 'string',
      description: 'The primary mission statement.',
      initialValue: "Your design team's memory, made conversational.",
    }),
    defineField({
      name: 'aboutBody',
      title: 'About body',
      type: 'text',
      rows: 4,
      description: 'Supporting paragraph beneath the mission headline. Line breaks are preserved.',
      initialValue:
        'Every framework, principle, and hard-won lesson your team has earned — captured, structured, and ready to answer. Fieldnotes turns institutional design knowledge into something you can simply ask.',
    }),
    defineField({
      name: 'aboutSubline',
      title: 'About subline',
      type: 'string',
      description: 'Optional secondary statement beneath the body.',
      initialValue: "Not a wiki. Not a chatbot. Your team's judgment, on demand.",
    }),

    // ── Tech stack ──
    defineField({
      name: 'stackSectionTitle',
      title: 'Tech stack section title',
      type: 'string',
      description: 'Heading for the tech stack section.',
      initialValue: 'What powers Fieldnotes',
    }),
    defineField({
      name: 'stackCards',
      title: 'Tech stack cards',
      type: 'array',
      description: 'The tools behind Fieldnotes, presented as cards.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Tool name in all caps (e.g. SANITY).',
            }),
            defineField({
              name: 'descriptor',
              title: 'Descriptor',
              type: 'string',
              description: 'What it does (e.g. "Structured authoring environment").',
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'Why it is here (e.g. "Where knowledge is written, structured, and published").',
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'descriptor'},
          },
        }),
      ],
      initialValue: [
        {
          name: 'SANITY',
          descriptor: 'Structured authoring environment',
          role: 'Where knowledge is written, structured, and published',
        },
        {
          name: 'SUPABASE',
          descriptor: 'Vector search with pgvector',
          role: 'Surfaces the most relevant knowledge for every question',
        },
        {
          name: 'CLAUDE',
          descriptor: "Anthropic's reasoning model",
          role: 'Turns retrieved knowledge into opinionated, grounded answers',
        },
        {
          name: 'NEXT.JS',
          descriptor: 'React framework on Vercel',
          role: 'Delivers the experience — fast, accessible, everywhere',
        },
      ],
    }),

    // ── Design convictions ──
    defineField({
      name: 'convictionsSectionTitle',
      title: 'Design convictions section title',
      type: 'string',
      description: 'Heading for the design convictions section.',
      initialValue: 'Design convictions',
    }),
    defineField({
      name: 'convictionsIntro',
      title: 'Design convictions intro',
      type: 'text',
      rows: 2,
      description: 'One or two sentence intro for the convictions section.',
      initialValue:
        'Every entry in Fieldnotes is calibrated before it earns trust. These are the questions we ask of our own knowledge.',
    }),
    defineField({
      name: 'convictions',
      title: 'Design convictions',
      type: 'array',
      description: 'The calibration fields that keep the knowledge base honest.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'The field name (e.g. "confidence").',
            }),
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              description: 'The calibration question (e.g. "Evergreen or experimental?").',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'One sentence elaboration.',
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'question'},
          },
        }),
      ],
      initialValue: [
        {
          label: 'confidence',
          question: 'Evergreen or experimental?',
          description: 'How settled an idea is — state it with conviction, or flag it as still forming.',
        },
        {
          label: 'maturity',
          question: 'Onboarding or senior?',
          description: 'Who the answer is for — calibrate the depth to the reader’s experience.',
        },
        {
          label: 'myTake',
          question: 'Bookmark or belief?',
          description: 'A quote without interpretation is just a link; the take is what makes it knowledge.',
        },
        {
          label: 'tension',
          question: 'Where does this break?',
          description: 'A principle without edges is a platitude — the good ones occasionally conflict.',
        },
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
