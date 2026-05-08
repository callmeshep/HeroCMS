import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

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
  access: {
    read: hasTenantAccess('tenant'),
    create: isAdminOrSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
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
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        hidden: true,
      },
    },
  ],
}
