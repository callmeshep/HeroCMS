import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { handleEnquiryHooks } from '../hooks/handleEnquiryHooks'

export const YEFSubmissions: CollectionConfig = {
  slug: 'yef-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    group: 'Your Emergency Fixed',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phoneNumber', 'service', 'submittedAt', 'webhookStatus'],
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
            where: { slug: { equals: 'your-emergency-fixed' } },
            limit: 1,
          })
          if (tenant.docs[0]) {
            data.tenant = tenant.docs[0].id
          }
        }
        return data
      },
    ],
    afterChange: [handleEnquiryHooks],
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
      name: 'form',
      type: 'relationship',
      relationTo: 'yef-forms',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'postcode',
      type: 'text',
    },
    {
      name: 'service',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: { readOnly: true },
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
