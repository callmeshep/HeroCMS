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
    {
      name: 'ga4MeasurementId',
      label: 'GA4 Measurement ID',
      type: 'text',
      admin: {
        description: 'e.g. G-XXXXXXXXXX — leave blank to disable GA4',
      },
    },
    {
      name: 'gtmContainerId',
      label: 'GTM Container ID',
      type: 'text',
      admin: {
        description: 'e.g. GTM-XXXXXXX — leave blank to disable GTM',
      },
    },
    {
      name: 'scripts',
      label: 'Custom Scripts',
      type: 'array',
      labels: {
        singular: 'Script',
        plural: 'Scripts',
      },
      admin: {
        description:
          'Third-party snippets injected into the site at build time — e.g. pixels, chat widgets, ClickFunnels',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. Meta Pixel, ClickFunnels',
          },
        },
        {
          name: 'placement',
          type: 'select',
          required: true,
          defaultValue: 'head',
          options: [
            { label: 'Head', value: 'head' },
            { label: 'Body Start', value: 'body-start' },
            { label: 'Body End', value: 'body-end' },
          ],
        },
        {
          name: 'code',
          type: 'code',
          required: true,
          admin: {
            language: 'html',
            description:
              'Paste the full snippet exactly as the tool provides it, including script tags',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
