import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const YEFForms: CollectionConfig = {
  slug: 'yef-forms',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  admin: {
    group: 'Your Emergency Fixed',
    useAsTitle: 'name',
    defaultColumns: ['name', 'page', 'views', 'attempts', 'completions'],
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: isAdminOrSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Enquiry Form, Header Form',
      },
    },
    {
      name: 'page',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Homepage',
      },
    },
    {
      name: 'notificationsEnabled',
      label: 'Send Notifications',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'notificationRecipients',
      label: 'Notification Recipients',
      type: 'array',
      labels: {
        singular: 'Recipient',
        plural: 'Recipients',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'completions',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'submissions',
      type: 'join',
      collection: 'yef-submissions',
      on: 'form',
    },
  ],
}
