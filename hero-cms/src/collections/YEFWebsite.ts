import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const YEFWebsite: CollectionConfig = {
  slug: 'yef-website',
  labels: {
    singular: 'Website',
    plural: 'Website',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Your Emergency Fixed',
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
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Your Emergency Fixed Website',
      admin: { hidden: true },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Globals',
          fields: [
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', label: 'Logo (Dark)', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
            { name: 'reviewsRating', label: 'Reviews Rating', type: 'number' },
            { name: 'reviewsCount', label: 'Reviews Count', type: 'number' },
            { name: 'reviewsPlatformsLabel', label: 'Reviews Platforms Label', type: 'text' },
            { name: 'heroBackgroundImage', label: 'Hero — Background Image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Home',
          fields: [
            { name: 'homeHeroHeadline', label: 'Hero — Headline', type: 'text' },
            { name: 'homeHeroSubheading', label: 'Hero — Subheading', type: 'text' },
            { name: 'homeHeroCtaText', label: 'Hero — CTA Button Text', type: 'text' },
          ],
        },
        {
          label: 'Policies',
          fields: [
            {
              name: 'policies',
              label: 'Policy Pages',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true },
                { name: 'content', type: 'richText' },
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
