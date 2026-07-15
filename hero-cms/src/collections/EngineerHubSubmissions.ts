import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const EngineerHubSubmissions: CollectionConfig = {
  slug: 'engineer-hub-submissions',
  labels: {
    singular: 'Form Submission',
    plural: 'Form Submissions',
  },
  admin: {
    group: 'Engineer Hub',
    useAsTitle: 'formType',
    defaultColumns: ['formType', 'name', 'contactDetail', 'submittedAt', 'notificationStatus'],
  },
  access: {
    read: hasTenantAccess('tenant'),
    // Submissions come in unauthenticated from the site's modals (Report a
    // Problem, Insurance, Membership Enquiry, Message, Survey Response).
    create: () => true,
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
      name: 'formType',
      label: 'Form Type',
      type: 'select',
      options: [
        'Report a Problem',
        'Insurance Upload',
        'Membership Enquiry',
        'Message',
        'Survey Response',
      ],
      required: true,
    },
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'contactDetail', label: 'Contact Detail (phone/email)', type: 'text' },
    { name: 'categoryOrIssueType', label: 'Category / Issue Type', type: 'text' },
    { name: 'jobReference', label: 'Job Reference', type: 'text', admin: { description: 'Report a Problem only' } },
    { name: 'description', label: 'Description / Message', type: 'textarea' },
    {
      name: 'uploadedFile',
      label: 'Uploaded File',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Insurance uploads' },
    },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', admin: { description: 'Insurance uploads' } },
    { name: 'tierRequested', label: 'Tier Requested', type: 'text', admin: { description: 'Membership enquiry — Bronze/Silver/Gold' } },
    { name: 'surveyId', label: 'Survey ID', type: 'text' },
    { name: 'surveyResponse', label: 'Survey Response', type: 'text' },
    { name: 'surveyComment', label: 'Survey Comment', type: 'textarea' },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'notificationStatus',
      label: 'Notification Status',
      type: 'select',
      options: ['Pending', 'Sent', 'Failed'],
      defaultValue: 'Pending',
      admin: { description: 'Resend email to the mailbox — no CRM webhook for this tenant' },
    },
  ],
}
