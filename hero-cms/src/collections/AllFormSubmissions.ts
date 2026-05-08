import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'

export const AllFormSubmissions: CollectionConfig = {
  slug: 'all-form-submissions',
  labels: {
    singular: 'Form Submission',
    plural: 'All Form Submissions',
  },
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'journey', 'tenant', 'submittedAt', 'webhookStatus'],
  },
  access: {
    read: isSuperAdmin,
    create: () => false,
    update: () => false,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
    },
    {
      name: 'journey',
      type: 'select',
      options: [
        { label: 'Homeowner', value: 'homeowner' },
        { label: 'Landlord', value: 'landlord' },
      ],
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'postcode',
      type: 'text',
    },
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
    },
    {
      name: 'numberOfProperties',
      label: 'No. of Properties',
      type: 'number',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
    },
    {
      name: 'webhookStatus',
      label: 'Webhook Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}
