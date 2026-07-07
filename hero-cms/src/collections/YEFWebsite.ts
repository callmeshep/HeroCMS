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
            {
              name: 'heroBackgroundImage',
              label: 'Hero — Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroHeadlineUnderlineSVG',
              label: 'Hero — Headline Underline SVG',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Home',
          fields: [
            {
              name: 'homeHeroHeadlineLine1',
              label: 'Hero — Headline (Green, e.g. "Same day")',
              type: 'text',
            },
            {
              name: 'homeHeroHeadlineLine2',
              label: 'Hero — Headline (Dark, e.g. "UK home emergency repairs")',
              type: 'text',
            },
            { name: 'homeHeroSubheading', label: 'Hero — Subheading', type: 'text' },
            { name: 'homeHeroCtaText', label: 'Hero — CTA Button Text', type: 'text' },
            {
              name: 'homeWhateverHeadlineLine1',
              label: 'Whatever Section — Headline Line 1 (Dark)',
              type: 'text',
            },
            {
              name: 'homeWhateverHeadlineLine2',
              label: 'Whatever Section — Headline Line 2 (Green)',
              type: 'text',
            },
            { name: 'homeWhateverBody', label: 'Whatever Section — Body Text', type: 'textarea' },
            {
              name: 'homeWhateverImage',
              label: 'Whatever Section — Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'homeWhateverServices',
              label: 'Whatever Section — Service Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text' },
              ],
            },
            { name: 'homeCtaBannerHeadline', label: 'CTA Banner — Headline', type: 'text' },
            { name: 'homeCtaBannerCtaText', label: 'CTA Banner — CTA Button Text', type: 'text' },
            {
              name: 'homeCtaBannerImage',
              label: 'CTA Banner — Background Image (Desktop)',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'homeCtaBannerImageMobile',
              label: 'CTA Banner — Background Image (Mobile)',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'homePromiseHeadlineLine1',
              label: 'Promise — Headline Line 1 (Green)',
              type: 'text',
            },
            {
              name: 'homePromiseHeadlineLine2',
              label: 'Promise — Headline Line 2 (Dark)',
              type: 'text',
            },
            {
              name: 'homePromiseCards',
              label: 'Promise — USP Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'text', required: true },
              ],
            },
            {
              name: 'homeHowItWorksHeadlineLine1',
              label: 'How It Works — Headline Line 1 (Green)',
              type: 'text',
            },
            {
              name: 'homeHowItWorksHeadlineLine2',
              label: 'How It Works — Headline Line 2 (Dark)',
              type: 'text',
            },
            {
              name: 'homeHowItWorksSteps',
              label: 'How It Works — Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'text', required: true },
              ],
            },
            { name: 'homeFaqHeadlineLine1', label: 'FAQ — Headline Line 1 (Dark)', type: 'text' },
            { name: 'homeFaqHeadlineLine2', label: 'FAQ — Headline Line 2 (Green)', type: 'text' },
            { name: 'homeFaqBody', label: 'FAQ — Body Text', type: 'textarea' },
            { name: 'homeFaqCtaText', label: 'FAQ — CTA Button Text', type: 'text' },
            {
              name: 'homeFaqItems',
              label: 'FAQ — Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
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
