import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
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
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'productCategory'}]}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'color'}]}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'XS', value: 'xs'},
          {title: 'S', value: 's'},
          {title: 'M', value: 'm'},
          {title: 'L', value: 'l'},
          {title: 'XL', value: 'xl'},
          {title: 'XXL', value: 'xxl'},
          {title: 'XXXL', value: 'xxxl'},
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'coverImage',
              type: 'boolean',
              title: 'Cover Image',
              initialValue: false,
              validation: (Rule) => Rule.required(),
            }
          ],
        },
      ],
      // at least one image is required and at least one cover image
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((images) => {
            if (!Array.isArray(images)) {
              return 'At least one image is required'
            }
            const coverImage = images.find((image: any) => image?.coverImage)
            if (!coverImage) {
              return 'At least one cover image is required'
            }
            return true
          }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark this shirt as featured',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      types: 'type',
      media: 'images.0',
    },
    prepare({title, types, media}) {
      return {
        title,
        subtitle: types?.length ? `${types.length} type(s)` : 'No types',
        media,
      }
    },
  },
})
