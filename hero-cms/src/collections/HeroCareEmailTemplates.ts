import type { CollectionConfig } from 'payload'

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
  fields: [
    {
      name: 'name',
      type: 'select',
      required: true,
      unique: true,
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
