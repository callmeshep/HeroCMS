import type { CollectionConfig } from 'payload'

export const HeroCareImageGallery: CollectionConfig = {
  slug: 'herocare-image-gallery',
  labels: {
    singular: 'Image',
    plural: 'Image Gallery',
  },
  admin: {
    group: 'HeroCare',
  },
  upload: {
    staticDir: 'media/herocare',
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      defaultValue: async () => null,
      admin: {
        hidden: true,
      },
    },
  ],
}
