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
  'embed',
  'api',
]

const TEXT_HELP =
  'Leave a blank line between paragraphs. **double asterisks** = bold. [link text](https://...) = link.'

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
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value) return 'Page URL is required'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
          return 'Use lowercase letters, numbers and hyphens only (no spaces)'
        if (RESERVED_SLUGS.includes(value))
          return `"${value}" is already used by another page on the site`
        return true
      },
    },
    {
      name: 'pageLayout',
      label: 'Page Layout',
      type: 'select',
      defaultValue: 'home',
      required: true,
      options: [
        { label: "Homepage — What's Covered, Plans, Who We Are, How It Works", value: 'home' },
        { label: 'About — Who We Are, Plans + Compare, FAQs', value: 'about' },
      ],
      admin: {
        description:
          'Sets which sections show and in what order. Campaign pages normally use Homepage.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        // HERO
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroSize',
              label: 'Hero Size',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full (homepage)', value: 'full' },
                { label: 'Compact (e.g. About page)', value: 'compact' },
              ],
            },
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
              admin: { description: 'Not shown on a Compact hero.' },
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
            {
              name: 'reviewLogos',
              label: 'Review Logos (under the reviews)',
              type: 'array',
              admin: {
                description:
                  'Shown faded under the reviews. Any colour logo works — they are turned white automatically.',
              },
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', required: true },
                { name: 'url', label: 'Link (optional)', type: 'text' },
              ],
            },
          ],
        },

        // PLANS
        {
          label: 'Plans',
          fields: [
            {
              name: 'plansBackground',
              label: 'Background',
              type: 'select',
              defaultValue: 'white',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Navy', value: 'navy' },
              ],
            },
            {
              name: 'plansBackgroundImage',
              label: 'Background Photo (Navy only)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional. Shown faintly (10%) behind the navy. Leave empty for plain navy.',
                condition: (data) => data?.plansBackground === 'navy',
              },
            },
            { name: 'plansEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'plansHeadline', label: 'Headline', type: 'text' },
            {
              name: 'plansSubheading',
              label: 'Subheading',
              type: 'text',
              admin: {
                description:
                  'Wrap words in **double asterisks** to make them bold, e.g. with promo code **GRANDHERO**',
              },
            },
            // Promo box fields — not currently used (discount is applied via the Stripe link). Kept for possible reuse.
            {
              name: 'promoLabel',
              label: 'Promo Box — Label',
              type: 'text',
              defaultValue: 'Promo Code',
              admin: { hidden: true },
            },
            {
              name: 'promoPlaceholder',
              label: 'Promo Box — Placeholder',
              type: 'text',
              defaultValue: 'Enter Promo Code',
              admin: { hidden: true },
            },
            {
              name: 'promoSuccessMessage',
              label: 'Promo Box — Success Message',
              type: 'text',
              admin: { hidden: true },
            },
            {
              name: 'promoErrorMessage',
              label: 'Promo Box — Error Message',
              type: 'text',
              admin: { hidden: true },
            },
            {
              name: 'plans',
              label: 'Plans',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                {
                  name: 'tagline',
                  type: 'text',
                  admin: { description: 'Optional line under the price. Leave empty to hide.' },
                },
                {
                  name: 'price',
                  type: 'text',
                  admin: { description: 'e.g. £14.99' },
                },
                {
                  name: 'pricePeriod',
                  label: 'Price Period',
                  type: 'text',
                  defaultValue: 'per month',
                },
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
                  admin: {
                    description:
                      'Full payment link URL. To apply a discount code automatically, add ?prefilled_promo_code=CODE to the end, e.g. https://buy.stripe.com/abc123?prefilled_promo_code=GRANDHERO',
                  },
                  validate: (value: unknown) => {
                    if (!value) return true
                    if (typeof value !== 'string' || !/^https:\/\/\S+$/.test(value.trim()))
                      return 'Must be a full link starting with https://'
                    return true
                  },
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

        // WHO WE ARE
        {
          label: 'Who We Are',
          fields: [
            {
              name: 'whoShow',
              label: 'Show this section',
              type: 'checkbox',
              defaultValue: false,
            },
            { name: 'whoEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'whoHeadline', label: 'Headline', type: 'text' },
            { name: 'whoBody', label: 'Text', type: 'textarea', admin: { description: TEXT_HELP } },
            {
              name: 'whoButtonText',
              label: 'Button Text (optional)',
              type: 'text',
              admin: { description: 'e.g. About Us. Leave empty to hide the button.' },
            },
            {
              name: 'whoButtonLink',
              label: 'Button Link',
              type: 'text',
              defaultValue: '/about-us/',
            },
            {
              name: 'whoTeam',
              label: 'Team Members',
              type: 'array',
              admin: { description: 'Arrows appear when there is more than one person.' },
              fields: [
                { name: 'photo', type: 'upload', relationTo: 'media', required: true },
                { name: 'name', type: 'text' },
                { name: 'role', type: 'text' },
              ],
            },
          ],
        },

        // COMPARE (About layout)
        {
          label: 'Compare',
          description: 'Shown on pages using the About layout, under the plans.',
          fields: [
            { name: 'compareEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'compareHeadline', label: 'Headline', type: 'text' },
            { name: 'compareBody', label: 'Text', type: 'textarea' },
            { name: 'compareButtonText', label: 'Button Text (optional)', type: 'text' },
            {
              name: 'compareButtonLink',
              label: 'Button Link',
              type: 'text',
              defaultValue: '#plans',
            },
            {
              name: 'compareColumn1Label',
              label: 'Column 1 Name',
              type: 'text',
              defaultValue: 'HeroCare',
            },
            {
              name: 'compareColumn2Label',
              label: 'Column 2 Name',
              type: 'text',
              defaultValue: 'Insurance',
            },
            {
              name: 'compareRows',
              label: 'Rows',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'column1', label: 'Column 1 — tick', type: 'checkbox', defaultValue: true },
                {
                  name: 'column2',
                  label: 'Column 2 — tick',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
        },

        // FAQS (About layout)
        {
          label: 'FAQs',
          description: 'Shown on pages using the About layout.',
          fields: [
            { name: 'faqsEyebrow', label: 'Eyebrow (small pink label)', type: 'text' },
            { name: 'faqsHeadline', label: 'Headline', type: 'text' },
            {
              name: 'faqItems',
              label: 'Questions',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  admin: { description: TEXT_HELP },
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
                    description:
                      'Section anchors: #whats-covered, #plans, #who-we-are, #how-it-works, #reviews, #compare, #faqs',
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
