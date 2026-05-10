import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const HeroCareSubmissions: CollectionConfig = {
  slug: 'herocare-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    group: 'HeroCare',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'journey',
      'trigger',
      'stage',
      'device',
      'submittedAt',
      'webhookStatus',
    ],
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: () => true,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          data.submittedAt = new Date().toISOString()
          const tenant = await req.payload.find({
            collection: 'tenants',
            where: { slug: { equals: 'herocare' } },
            limit: 1,
          })
          if (tenant.docs[0]) {
            data.tenant = tenant.docs[0].id
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'herocare-forms',
      required: true,
      admin: {
        description: 'The form this submission belongs to',
      },
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
      name: 'trigger',
      type: 'select',
      required: true,
      options: [
        { label: 'Button Click', value: 'button-click' },
        { label: 'Header Form', value: 'header-form' },
      ],
    },
    {
      name: 'stage',
      type: 'select',
      required: true,
      options: [
        { label: 'Step 1 — Header Form', value: 'step-1' },
        { label: 'Step 2 — Popup', value: 'step-2' },
      ],
    },
    {
      name: 'device',
      type: 'select',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
      ],
    },
    {
      name: 'name',
      type: 'text',
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
}
