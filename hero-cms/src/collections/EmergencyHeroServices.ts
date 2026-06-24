import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EmergencyHeroServices: CollectionConfig = {
  slug: 'emergency-hero-services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  admin: {
    group: 'Emergency Hero',
    useAsTitle: 'serviceName',
    defaultColumns: ['serviceName', 'slug', 'enabled', 'accentColour'],
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: isAdminOrSuperAdmin,
    update: isAdminOrSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'enabled', label: 'Enabled', type: 'checkbox', defaultValue: true },
    { name: 'accentColour', label: 'Accent Colour (hex)', type: 'text' },
    { name: 'navLabel', label: 'Nav Label', type: 'text' },
    {
      name: 'heroCharacterImage',
      label: 'Hero Character Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroBackgroundImage',
      label: 'Hero Background Image',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'reviewCategory', label: 'Review Category Slug', type: 'text' },
    { name: 'rngMin', label: 'RNG Min (engineer count)', type: 'number' },
    { name: 'rngMax', label: 'RNG Max (engineer count)', type: 'number' },
  ],
}
