import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const HeroCareForms: CollectionConfig = {
  slug: 'herocare-forms',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  admin: {
    group: 'HeroCare',
    useAsTitle: 'name',
    defaultColumns: ['name', 'page', 'views', 'attempts', 'completions'],
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
      admin: {
        hidden: false,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Homeowner Popup, Header Form',
      },
    },
    {
      name: 'page',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Homepage, Pricing',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times the form was seen',
      },
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times a user started interacting',
      },
    },
    {
      name: 'completions',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of successful submissions',
      },
    },
    {
      name: 'submissions',
      type: 'join',
      collection: 'herocare-submissions',
      on: 'form',
      admin: {
        description: 'Submissions for this form',
      },
    },
  ],
}
