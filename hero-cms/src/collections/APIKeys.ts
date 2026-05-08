import type { CollectionConfig } from 'payload'

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
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
