import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Review',
    plural: 'Reviews',
  },
  admin: {
    group: 'Admin',
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'rating', 'serviceType', 'tenant', 'visible'],
  },
  access: {
    read: isAdminOrSuperAdmin,
    create: isAdminOrSuperAdmin,
    update: isAdminOrSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      label: 'Rating',
      type: 'select',
      required: true,
      options: [
        { label: '⭐ 1 Star', value: '1' },
        { label: '⭐⭐ 2 Stars', value: '2' },
        { label: '⭐⭐⭐ 3 Stars', value: '3' },
        { label: '⭐⭐⭐⭐ 4 Stars', value: '4' },
        { label: '⭐⭐⭐⭐⭐ 5 Stars', value: '5' },
      ],
    },
    {
      name: 'serviceType',
      label: 'Service Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Home Care', value: 'home-care' },
        { label: 'Plumbing', value: 'plumbing' },
        { label: 'Heating', value: 'heating' },
        { label: 'Electrics', value: 'electrics' },
        { label: 'Drainage', value: 'drainage' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'reviewBody',
      label: 'Review',
      type: 'textarea',
    },
    {
      name: 'tenant',
      label: 'Tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'visible',
      label: 'Visible',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
