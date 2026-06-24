import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EmergencyHeroSubmissions: CollectionConfig = {
  slug: 'emergency-hero-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Form Submissions',
  },
  admin: {
    group: 'Emergency Hero',
    useAsTitle: 'name',
    defaultColumns: ['name', 'companyName', 'mobile', 'submittedAt', 'ghlWebhookStatus'],
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: isAdminOrSuperAdmin,
    update: isSuperAdmin,
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
    { name: 'name', type: 'text' },
    { name: 'companyName', label: 'Company Name', type: 'text' },
    { name: 'companyType', label: 'Company Type', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'mobile', type: 'text' },
    { name: 'website', type: 'text' },
    {
      name: 'skills',
      label: 'Skills',
      type: 'array',
      fields: [{ name: 'trade', type: 'text' }],
    },
    {
      name: 'uploadedDocuments',
      label: 'Uploaded Documents',
      type: 'array',
      fields: [
        { name: 'tradeName', label: 'Trade Name', type: 'text' },
        { name: 'documentLabel', label: 'Document Label', type: 'text' },
        { name: 'fileUrl', label: 'File URL (R2)', type: 'text' },
      ],
    },
    { name: 'workingDaysHours', label: 'Working Days / Hours', type: 'text' },
    { name: 'postcode', type: 'text' },
    { name: 'coverageRadius', label: 'Coverage Radius (km)', type: 'number' },
    { name: 'comments', type: 'textarea' },
    { name: 'submittedAt', label: 'Submitted At', type: 'date', admin: { readOnly: true } },
    {
      name: 'ghlWebhookStatus',
      label: 'GHL Webhook Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
    },
  ],
}
