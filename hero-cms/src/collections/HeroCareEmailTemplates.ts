import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const HeroCareEmailTemplates: CollectionConfig = {
  slug: 'herocare-email-templates',
  labels: {
    singular: 'Email Template',
    plural: 'Email Templates',
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
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'name',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin Notification', value: 'admin-notification' },
        { label: 'Customer Notification', value: 'customer-notification' },
      ],
    },
    {
      name: 'subjectLine',
      label: 'Subject Line',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'relationship',
      relationTo: 'herocare-brand-assets',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'bodyText',
      label: 'Body Text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'buttonText',
      label: 'Button Text',
      type: 'text',
    },
    {
      name: 'buttonURL',
      label: 'Button URL',
      type: 'text',
    },
  ],
}
