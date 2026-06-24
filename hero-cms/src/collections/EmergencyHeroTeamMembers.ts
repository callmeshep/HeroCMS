import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EmergencyHeroTeamMembers: CollectionConfig = {
  slug: 'emergency-hero-team-members',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  admin: {
    group: 'Emergency Hero',
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle', 'order'],
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: isAdminOrSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { hidden: true },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job Title', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'order', label: 'Display Order', type: 'number' },
  ],
}
