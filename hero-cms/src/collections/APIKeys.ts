import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',
  labels: {
    singular: 'API Key',
    plural: 'API Keys',
  },
  admin: {
    useAsTitle: 'tenant',
    group: 'Admin',
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: isSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      unique: true,
    },
    {
      name: 'cloudflareDeployHook',
      label: 'Cloudflare Pages Deploy Hook URL',
      type: 'text',
    },
    {
      name: 'resendFromName',
      label: 'Resend — From Name',
      type: 'text',
    },
    {
      name: 'resendFromEmail',
      label: 'Resend — From Email',
      type: 'email',
    },
    {
      name: 'crmWebhookURL',
      label: 'CRM Webhook URL',
      type: 'text',
    },
    {
      name: 'crmAPIKey',
      label: 'CRM API Key',
      type: 'text',
    },
  ],
}
