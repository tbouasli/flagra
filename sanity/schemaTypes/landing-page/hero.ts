import { defineField, defineType } from "sanity";

// hero has an image and text content
// text content can be small, medium or large

export const heroTextType = defineType({
  name: 'heroText',
  title: 'Hero Text',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: ['small', 'medium', 'large'],
        layout: 'dropdown',
      },
    }),
  ],
})

export const heroType = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [{type: 'heroText'}],
    }),
  ],
})