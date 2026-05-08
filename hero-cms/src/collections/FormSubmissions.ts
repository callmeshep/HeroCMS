import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'journey', 'submittedAt', 'webhookStatus'],
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
      name: 'journey',
      type: 'select',
      required: true,
      options: [
        { label: 'Homeowner', value: 'homeowner' },
        { label: 'Landlord', value: 'landlord' },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'postcode',
      type: 'text',
      admin: {
        condition: (data) => data.journey === 'homeowner',
      },
    },
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      admin: {
        condition: (data) => data.journey === 'landlord',
      },
    },
    {
      name: 'numberOfProperties',
      label: 'No. of Properties',
      type: 'number',
      admin: {
        condition: (data) => data.journey === 'landlord',
      },
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'webhookStatus',
      label: 'Webhook Status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.submittedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
