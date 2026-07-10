import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const YEFServicePages: CollectionConfig = {
  slug: 'yef-service-pages',
  labels: {
    singular: 'Service Page',
    plural: 'Service Pages',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Your Emergency Fixed',
  },
  access: {
    read: () => true,
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
      admin: { hidden: true },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Emergency Plumbing' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. emergency-plumbing' },
    },
    {
      name: 'serviceType',
      label: 'Service Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Plumbing', value: 'plumbing' },
        { label: 'Heating', value: 'heating' },
        { label: 'Electrics', value: 'electrics' },
      ],
    },
    {
      name: 'primaryColour',
      label: 'Primary Colour (hex)',
      type: 'text',
      required: true,
      admin: { description: 'e.g. #1281E2' },
    },
    {
      name: 'metaDescription',
      label: 'Meta Description',
      type: 'textarea',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroHeadlineLine1', label: 'Headline Line 1 (Coloured)', type: 'text' },
            { name: 'heroHeadlineLine2', label: 'Headline Line 2 (Dark)', type: 'text' },
            { name: 'heroEngineerImage', label: 'Engineer Image', type: 'upload', relationTo: 'media' },
            { name: 'heroEngineerLabel', label: 'Engineer Label (e.g. Meet Asif, One of Our Best Plumbers)', type: 'text' },
            { name: 'heroCtaText', label: 'CTA Button Text', type: 'text' },
            {
              name: 'heroBullets',
              label: 'Bullet Points',
              type: 'array',
              fields: [
                { name: 'text', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Whatever Section',
          fields: [
            { name: 'whateverHeadlineLine1', label: 'Headline Line 1 (Dark)', type: 'text' },
            { name: 'whateverHeadlineLine2', label: 'Headline Line 2 (Coloured)', type: 'text' },
            { name: 'whateverBody', label: 'Body Text', type: 'textarea' },
            { name: 'whateverImage', label: 'Image', type: 'upload', relationTo: 'media' },
            {
              name: 'whateverServices',
              label: 'Service List Items',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            { name: 'faqHeadlineLine1', label: 'Headline Line 1 (Coloured)', type: 'text' },
            { name: 'faqHeadlineLine2', label: 'Headline Line 2 (Dark)', type: 'text' },
            { name: 'faqBody', label: 'Body Text', type: 'textarea' },
            { name: 'faqCtaText', label: 'CTA Button Text', type: 'text' },
            {
              name: 'faqItems',
              label: 'FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [triggerDeployHook],
  },
}
