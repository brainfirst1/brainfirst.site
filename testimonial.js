import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: 'attributionName',
      title: 'Name',
      type: 'string',
      description: 'Leave blank to show as anonymous, e.g. "Founder, Brain Audit client".',
    }),
    defineField({
      name: 'attributionRole',
      title: 'Role / context',
      type: 'string',
      description: 'e.g. "Individual coaching client", "Founder, Brain Audit"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Service',
      type: 'string',
      options: {
        list: [
          { title: '1:1 Coaching', value: 'coaching' },
          { title: 'Founder Brain Audit', value: 'founder-audit' },
          { title: 'Organisational Consulting (CLOM)', value: 'clom' },
          { title: 'Screening Bundle', value: 'screening' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Text only', value: 'text' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
        ],
      },
      initialValue: 'text',
    }),
    defineField({
      name: 'mediaFile',
      title: 'Video/audio file',
      type: 'file',
      hidden: ({ document }) => document?.mediaType === 'text',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      description: 'Toggle on for the 3 quotes shown in the homepage quote-stack.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first.',
    }),
  ],
  preview: {
    select: { title: 'attributionRole', subtitle: 'quote' },
  },
})
