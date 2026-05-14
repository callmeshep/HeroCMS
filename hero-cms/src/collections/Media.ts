import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data.alt) return data
        const filename = req.file?.name ?? ''
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        data.alt = nameWithoutExt
        return data
      },
    ],
  },
}
