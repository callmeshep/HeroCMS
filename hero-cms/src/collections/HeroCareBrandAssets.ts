import type { CollectionConfig } from 'payload'

export const HeroCareBrandAssets: CollectionConfig = {
  slug: 'herocare-brand-assets',
  labels: {
    singular: 'Brand Asset',
    plural: 'Brand Assets',
  },
  admin: {
    group: 'HeroCare',
    useAsTitle: 'name',
  },
  upload: {
    staticDir: 'media/herocare-brand',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
