import {defineField, defineType} from 'sanity'

export const colorType = defineType({
  name: 'color',
  title: 'Color',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Color Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hex',
      title: 'Hex Code',
      type: 'string',
      description: 'e.g., #FF0000 for red',
      validation: (Rule) => 
        Rule.required().custom((hex: string | undefined) => {
          if (!hex) return 'Hex code is required'
          const hexPattern = /^#[0-9A-Fa-f]{6}$/
          return hexPattern.test(hex) || 'Must be a valid hex color (e.g., #FF0000)'
        }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      hex: 'hex',
    },
    prepare({title, hex}) {
      return {
        title,
        subtitle: hex,
      }
    },
  },
})

