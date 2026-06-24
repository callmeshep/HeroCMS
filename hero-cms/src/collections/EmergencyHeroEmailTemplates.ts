import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EmergencyHeroEmailTemplates: CollectionConfig = {
  slug: 'emergency-hero-email-templates',
  labels: {
    singular: 'Email Template',
    plural: 'Email Templates',
  },
  admin: {
    group: 'Emergency Hero',
    useAsTitle: 'templateName',
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
    {
      name: 'templateName',
      label: 'Template Name',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin Notification', value: 'admin-notification' },
        { label: 'Customer Notification', value: 'customer-notification' },
      ],
    },
    { name: 'subjectLine', label: 'Subject Line', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', label: 'Body Text', type: 'richText' },
    { name: 'buttonText', label: 'Button Text', type: 'text' },
    { name: 'buttonUrl', label: 'Button URL', type: 'text' },
  ],
}
