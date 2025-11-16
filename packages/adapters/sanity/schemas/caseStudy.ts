import { defineType, defineField } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, required: true }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'client', type: 'string' }),
    defineField({ name: 'year', type: 'string' }),
    defineField({ name: 'sector', type: 'string' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),

    defineField({ name: 'summaryShort', type: 'text', rows: 2 }),
    defineField({ name: 'brief', type: 'text', rows: 3 }),

    defineField({ name: 'bodyMDX', type: 'text', title: 'Body (MDX)' }),

    defineField({
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'bodyMDX', type: 'text' },
          ],
        },
      ],
    }),

    defineField({
      name: 'attachments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'url', type: 'url' },
            { name: 'kind', type: 'string', options: { list: ['pdf', 'ppt', 'doc', 'sheet', 'zip', 'other'] } },
            { name: 'internalOnly', type: 'boolean' },
          ],
        },
      ],
    }),

    defineField({
      name: 'links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'url', type: 'url' },
            { name: 'category', type: 'string', options: { list: ['client', 'impact', 'legislation', 'press', 'other'] } },
            { name: 'internalOnly', type: 'boolean' },
          ],
        },
      ],
    }),

    defineField({ name: 'isPublic', type: 'boolean', initialValue: true }),
  ],
})
