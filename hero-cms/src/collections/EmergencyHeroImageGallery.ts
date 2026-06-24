import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EmergencyHeroImageGallery: CollectionConfig = {
  slug: 'emergency-hero-image-gallery',
  labels: {
    singular: 'Image',
    plural: 'Image Gallery',
  },
  admin: {
    group: 'Emergency Hero',
    useAsTitle: 'filename',
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: isAdminOrSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  upload: {
    staticDir: 'media/emergency-hero-gallery',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'altText',
      label: 'Alt Text',
      type: 'text',
    },
  ],
}
