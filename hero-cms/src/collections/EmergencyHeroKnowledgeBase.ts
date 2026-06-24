import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EmergencyHeroKnowledgeBase: CollectionConfig = {
  slug: 'emergency-hero-knowledge-base',
  labels: {
    singular: 'Article',
    plural: 'Knowledge Base',
  },
  admin: {
    group: 'Emergency Hero',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'publishedAt'],
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
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Plumbing', value: 'plumbing' },
        { label: 'Heating', value: 'heating' },
        { label: 'Electrics', value: 'electrics' },
        { label: 'Drainage', value: 'drainage' },
        { label: 'Locksmiths', value: 'locksmiths' },
        { label: 'Homecare', value: 'homecare' },
        { label: 'Company', value: 'company' },
      ],
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'heroImage', label: 'Hero Image', type: 'upload', relationTo: 'media' },
    { name: 'bodyContent', label: 'Body Content', type: 'richText' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedAt', label: 'Published At', type: 'date' },
    { name: 'seoTitle', label: 'SEO Title', type: 'text' },
    { name: 'seoDescription', label: 'SEO Description', type: 'textarea' },
  ],
}
