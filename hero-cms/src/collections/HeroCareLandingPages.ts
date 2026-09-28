import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

// Slugs already used by fixed pages on the HeroCare site — a landing page can't use these
const RESERVED_SLUGS = [
  'thank-you',
  'privacy-policy',
  'terms-and-conditions',
  'cookies-policy',
  'about-your-plan',
  'checking',
  'results',
  'affiliates',
  'landlords',
  'landlord-thank-you',
]

export const HeroCareLandingPages: CollectionConfig = {
  slug: 'herocare-landing-pages',
  labels: {
    singular: 'Landing Page',
    plural: 'Landing Pages',
  },
  admin: {
    useAsTitle: 'title',
    group: 'HeroCare',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description:
      'Each record is a full page. To start a new campaign, open an existing page, click Duplicate, then change the slug and content. The homepage is chosen in Website → Globals.',
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
      admin: { hidden: true },
    },
    {
      name: 'title',
      label: 'Page Name (internal)',
      type: 'text',
      required: true,
      admin: { description: 'For your reference only, e.g. Homepage or Winter Campaign' },
      hooks: {
        beforeDuplicate: [({ value }) => (value ? `${value} (Copy)` : value)],
      },
    },
    {
      name: 'slug',
      label: 'Page URL',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'e.g. winter-offer → herocare.co.uk/winter-offer. Lowercase letters, numbers and hyphens only.',
      },
      hooks: {
        beforeDuplicate: [({ value }) => (value ? `${value}-copy` : value)],
      },
      validate: (value) => {
        if (!value) return 'Page URL is required'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
          return 'Use lowercase letters, numbers and hyphens only (no spaces)'
        if (RESERVED_SLUGS.includes(value))
          return `"${value}" is already used by another page on the site`
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        // HERO
        {
          label: 'Hero',
          fields: [
            { name: 'heroHeadlineLine1', label: 'Headline Line 1', type: 'text' },
            { name: 'heroHeadlineLine2', label: 'Headline Line 2', type: 'text' },
            { name: 'heroSubheading', label: 'Subheading', type: 'text' },
            { name: 'heroCtaText', label: 'CTA Button Text', type: 'text' },
            {
              name: 'heroCtaLink',
              label: 'CTA Button Link',
              type: 'text',
              defaultValue: '#plans',
              admin: { description: '#plans scrolls to the plans section' },
            },
            {
              name: 'heroImageDesktop',
              label: 'Background Image — Desktop',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroImageMobile',
              label: 'Background Image — Mobile',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Portrait crop. Falls back to the desktop image if empty.' },
            },
            {
              name: 'heroAsSeenOnLabel',
              label: '"As Seen On" Label',
              type: 'text',
              defaultValue: 'As seen on',
            },
            {
              name: 'heroAsSeenOnLogos',
              label: '"As Seen On" Logos',
              type: 'array',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', required: true },
                { name: 'url', label: 'Link (optional)', type: 'text' },
              ],
            },
          ],
        },

        // TRUST BAR
        {
          label: 'Trust Bar',
          fields: [
            {
              name: 'trustBarItems',
              label: 'Trust Bar Items',
              type: 'array',
              admin: {
                description:
                  'Pink strip under the hero. Bold part shows first, e.g. Bold "Cancel" + Regular "any time".',
              },
              fields: [
                { name: 'boldText', label: 'Bold Text', type: 'text' },
                { name: 'regularText', label: 'Regular Text', type: 'text' },
              ],
            },
          ],
        },

        // WHAT'S COVERED
        {
          label: "What's Covered",
          fields: [
            { name: 'coveredEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'coveredHeadline', label: 'Headline', type: 'text' },
            { name: 'coveredSubheading', label: 'Subheading', type: 'text' },
            {
              name: 'coveredCards',
              label: 'Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                {
                  name: 'colour',
                  type: 'select',
                  defaultValue: 'blue',
                  options: [
                    { label: 'Coral', value: 'coral' },
                    { label: 'Blue', value: 'blue' },
                    { label: 'Amber', value: 'amber' },
                    { label: 'Purple', value: 'purple' },
                  ],
                },
              ],
            },
          ],
        },

        // HOW IT WORKS + REVIEWS
        {
          label: 'How It Works',
          fields: [
            { name: 'howEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'howHeadline', label: 'Headline', type: 'text' },
            {
              name: 'howSteps',
              label: 'Steps',
              type: 'array',
              admin: { description: 'Numbers are added automatically.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'featuredReviews',
              label: 'Featured Reviews',
              type: 'relationship',
              relationTo: 'reviews',
              hasMany: true,
              filterOptions: { visible: { equals: true } },
              admin: {
                description:
                  'Pick the reviews shown in the carousel. Drag to reorder. Only visible reviews are listed.',
              },
            },
          ],
        },

        // PLANS
        {
          label: 'Plans',
          fields: [
            { name: 'plansEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'plansHeadline', label: 'Headline', type: 'text' },
            {
              name: 'plans',
              label: 'Plans',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                {
                  name: 'colour',
                  type: 'select',
                  defaultValue: 'blue',
                  options: [
                    { label: 'Blue', value: 'blue' },
                    { label: 'Pink', value: 'pink' },
                  ],
                },
                {
                  name: 'features',
                  label: 'Feature Lines',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                { name: 'ctaText', label: 'Button Text', type: 'text' },
                {
                  name: 'stripeLink',
                  label: 'Stripe Payment Link',
                  type: 'text',
                  admin: { description: 'Full Stripe payment link URL for this plan' },
                },
                {
                  name: 'smallPrint',
                  label: 'Small Print',
                  type: 'textarea',
                  admin: {
                    description: 'e.g. then £14.99 per month from January with code GRANDHERO',
                  },
                },
              ],
            },
          ],
        },

        // NAV & FOOTER
        {
          label: 'Nav & Footer',
          fields: [
            {
              name: 'navLinks',
              label: 'Nav Links (desktop only)',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Section anchors: #whats-covered, #how-it-works, #reviews, #plans',
                  },
                },
              ],
            },
            { name: 'navCtaText', label: 'Nav CTA Text — Desktop', type: 'text' },
            {
              name: 'navCtaTextMobile',
              label: 'Nav CTA Text — Mobile',
              type: 'text',
              admin: { description: 'Falls back to the desktop text if empty' },
            },
            { name: 'navCtaLink', label: 'Nav CTA Link', type: 'text', defaultValue: '#plans' },
            { name: 'footerCtaText', label: 'Footer CTA Text', type: 'text' },
            {
              name: 'footerCtaLink',
              label: 'Footer CTA Link',
              type: 'text',
              defaultValue: '#plans',
            },
          ],
        },

        // SEO
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', label: 'Meta Title', type: 'text' },
            { name: 'metaDescription', label: 'Meta Description', type: 'textarea' },
            {
              name: 'noIndex',
              label: 'Hide from Google',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Tick for campaign pages that are near-copies of the homepage, to avoid duplicate-content issues.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const tenant = await req.payload.find({
            collection: 'tenants',
            where: { slug: { equals: 'herocare' } },
            limit: 1,
            overrideAccess: true,
          })
          if (tenant.docs[0]) {
            data.tenant = tenant.docs[0].id
          }
        }
        return data
      },
    ],
    afterChange: [triggerDeployHook],
  },
}
