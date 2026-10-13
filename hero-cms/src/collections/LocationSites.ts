import type { Access, CollectionConfig, Field, GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { generateLocationSiteContent } from '../hooks/generateLocationSiteContent'

// Services covered by Location Sites.
// Each one becomes its own sidebar item (and its own database table).
export const LOCATION_SITE_SERVICES = [
  {
    slug: 'location-sites-plumbing',
    label: 'Plumbing',
    noun: 'Plumbers',
    example: 'Liverpool Emergency Plumbers',
  },
  {
    slug: 'location-sites-heating',
    label: 'Heating',
    noun: 'Heating Engineers',
    example: 'Liverpool Emergency Heating',
  },
  {
    slug: 'location-sites-electrics',
    label: 'Electrics',
    noun: 'Electricians',
    example: 'Liverpool Emergency Electricians',
  },
] as const

type LocationSiteService = (typeof LOCATION_SITE_SERVICES)[number]

// Number of fixed cards in each section of the page design
const ISSUE_COUNT = 4
const STEP_COUNT = 3
const REASON_COUNT = 3

const PLACEHOLDER_HELP =
  'You can use {brandName}, {locationName}, {domain} and {year} — they are filled in automatically for each site.'

const BRIEF_HELP =
  'What this card is about. Guides the AI when it writes each site — not shown on the site.'

// Builds numbered groups, e.g. issue1, issue2, issue3, issue4
const numbered = (prefix: string, label: string, count: number, fields: Field[]): Field[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `${prefix}${i + 1}`,
    label: `${label} ${i + 1}`,
    type: 'group' as const,
    fields,
  }))

// Title + text pair used for each card on a site
const cardFields: Field[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Text', type: 'textarea', admin: { rows: 3 } },
]

const headingField = (name = 'heading', label = 'Heading'): Field => ({
  name,
  label,
  type: 'text',
})

// ============================================
// LOCATION SITES (one collection per trade)
// ============================================

// Logged-in users see their tenant's sites. The public (the renderer) only sees Live sites.
const readLocationSites: Access = (args) => {
  if (!args.req.user) return { status: { equals: 'live' } }
  return hasTenantAccess('tenant')(args)
}

// Turns "https://www.Example.co.uk/page" into "example.co.uk"
const normaliseDomain = ({ value }: { value?: unknown }) => {
  if (typeof value !== 'string') return value
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[/?#].*$/, '')
  return cleaned || null
}

// Domain must be valid, unique across every Location Sites collection, and present before going Live
const validateDomain =
  (ownSlug: LocationSiteService['slug']) =>
  async (value: string | null | undefined, { req, id, data }: any): Promise<string | true> => {
    if (!value) {
      return data?.status === 'live' ? 'A domain is required before a site can go Live' : true
    }

    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value)) {
      return 'Enter a domain like liverpoolemergencyplumber.co.uk (no https:// or www.)'
    }

    for (const service of LOCATION_SITE_SERVICES) {
      const existing = await req.payload.find({
        collection: service.slug,
        where: {
          and: [
            { domain: { equals: value } },
            ...(service.slug === ownSlug && id ? [{ id: { not_equals: id } }] : []),
          ],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.totalDocs > 0) {
        return `This domain is already used by a ${service.label} location site`
      }
    }

    return true
  }

const createLocationSiteCollection = (service: LocationSiteService): CollectionConfig => ({
  slug: service.slug,
  labels: {
    singular: `${service.label} Site`,
    plural: service.label,
  },
  admin: {
    group: 'Location Sites',
    useAsTitle: 'brandName',
    defaultColumns: ['brandName', 'locationName', 'domain', 'status', 'updatedAt'],
    description: `Single-page ${service.label.toLowerCase()} sites, one per location. Images and logo come from Globals → ${service.label}.`,
  },
  hooks: {
    beforeChange: [
      generateLocationSiteContent({
        key: service.slug.replace('location-sites-', ''),
        label: service.label,
        noun: service.noun,
        slug: service.slug,
      }),
    ],
  },
  access: {
    read: readLocationSites,
    create: isAdminOrSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  fields: [
    // Sidebar
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Live', value: 'live' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only Live sites are shown on their domain',
      },
    },

    // Site details
    {
      type: 'row',
      fields: [
        {
          name: 'locationName',
          label: 'Location Name',
          type: 'text',
          required: true,
          admin: { width: '50%', placeholder: 'Liverpool' },
        },
        {
          name: 'brandName',
          label: 'Brand Name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            placeholder: service.example,
            description: 'Used in headings, the footer and page titles',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'domain',
          label: 'Domain',
          type: 'text',
          unique: true,
          index: true,
          hooks: { beforeValidate: [normaliseDomain] },
          validate: validateDomain(service.slug),
          admin: {
            width: '100%',
            placeholder: 'liverpoolemergencyplumber.co.uk',
            description:
              'No https:// or www. Must also be added as a custom domain on the Cloudflare Pages project.',
          },
        },
      ],
    },

    // Content generation
    {
      type: 'collapsible',
      label: 'Content Generation',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'keywords',
          label: 'Keywords',
          type: 'textarea',
          admin: {
            rows: 4,
            placeholder: 'emergency plumber liverpool, burst pipe repair, 24 hour plumber',
            description: 'Comma separated. Used to generate the page content.',
          },
        },
        {
          name: 'generateContent',
          label: 'Generate content on save',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Tick and save to write the page content from the keywords. This overwrites the content below.',
          },
        },
      ],
    },

    // Per-site content — every word is written for this site
    {
      type: 'collapsible',
      label: 'Page Content',
      admin: {
        initCollapsed: true,
        description: `Written for this site by AI — edit freely. Images come from Globals → ${service.label}.`,
      },
      fields: [
        {
          name: 'hero',
          label: 'Hero',
          type: 'group',
          fields: [
            { name: 'eyebrow', label: 'Small Line Above Headline', type: 'text' },
            {
              name: 'headline',
              label: 'Headline',
              type: 'text',
              admin: {
                description: 'Must include the location name — it is shown in the accent colour',
              },
            },
          ],
        },
        {
          name: 'issues',
          label: 'What Seems To Be The Issue',
          type: 'group',
          fields: [
            headingField(),
            { name: 'subheading', label: 'Subheading', type: 'text' },
            ...numbered('issue', 'Issue', ISSUE_COUNT, cardFields),
          ],
        },
        {
          name: 'reviews',
          label: 'Reviews Section',
          type: 'group',
          fields: [
            headingField(),
            {
              name: 'text',
              label: 'Text (most populated areas within the location)',
              type: 'textarea',
              admin: { rows: 2 },
            },
          ],
        },
        {
          name: 'steps',
          label: 'Booking Steps',
          type: 'group',
          fields: [headingField(), ...numbered('step', 'Step', STEP_COUNT, cardFields)],
        },
        {
          name: 'reasons',
          label: 'Why Choose Us',
          type: 'group',
          fields: [
            headingField(),
            {
              name: 'intro',
              label: 'Intro (surrounding areas)',
              type: 'textarea',
              admin: { rows: 2 },
            },
            ...numbered('reason', 'Reason', REASON_COUNT, cardFields),
          ],
        },
        headingField('faqsHeading', 'FAQs Heading'),
        {
          name: 'faqs',
          label: 'FAQs',
          type: 'array',
          maxRows: 6,
          labels: { singular: 'FAQ', plural: 'FAQs' },
          fields: [
            { name: 'question', label: 'Question', type: 'text', required: true },
            { name: 'answer', label: 'Answer', type: 'textarea', required: true },
          ],
        },
        {
          name: 'check',
          label: 'Availability Check',
          type: 'group',
          fields: [
            headingField(),
            {
              name: 'bullets',
              label: 'Tick Points',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Tick Point', plural: 'Tick Points' },
              fields: [{ name: 'text', label: 'Text', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'areas',
          label: 'Areas Covered',
          type: 'array',
          maxRows: 8,
          labels: { singular: 'Area', plural: 'Areas' },
          admin: { description: 'Shown in the footer under "{Location} Areas"' },
          fields: [{ name: 'area', label: 'Area', type: 'text', required: true }],
        },
        {
          name: 'footerBlurb',
          label: 'Footer Blurb',
          type: 'textarea',
          admin: {
            rows: 2,
            placeholder:
              "Looking for an emergency plumber in Liverpool & surrounding areas? We've got you covered.",
          },
        },
        {
          name: 'seo',
          label: 'SEO',
          type: 'group',
          fields: [
            { name: 'metaTitle', label: 'Meta Title', type: 'text' },
            {
              name: 'metaDescription',
              label: 'Meta Description',
              type: 'textarea',
              admin: { rows: 2 },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
})

// ============================================
// FORM SUBMISSIONS (shared by all trades)
// ============================================

export const LocationSitesSubmissions: CollectionConfig = {
  slug: 'location-sites-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Form Submissions',
  },
  admin: {
    group: 'Location Sites',
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'postcode', 'service', 'brandName', 'ghlSync', 'createdAt'],
    description: 'Availability checks submitted on any location site',
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
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'postcode', label: 'Postcode', type: 'text', admin: { width: '50%' } },
        { name: 'phone', label: 'Phone Number', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'service',
      label: 'Service',
      type: 'select',
      options: LOCATION_SITE_SERVICES.map((service) => ({
        label: service.label,
        value: service.slug.replace('location-sites-', ''),
      })),
    },
    {
      type: 'row',
      fields: [
        { name: 'brandName', label: 'Brand Name', type: 'text', admin: { width: '33%' } },
        { name: 'locationName', label: 'Location', type: 'text', admin: { width: '33%' } },
        { name: 'domain', label: 'Domain', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      name: 'ghlSync',
      label: 'GHL Sync',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'ghlError',
      label: 'GHL Error',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.ghlSync === 'failed',
      },
    },
  ],
  timestamps: true,
}

export const LocationSitesCollections: CollectionConfig[] = [
  ...LOCATION_SITE_SERVICES.map(createLocationSiteCollection),
  LocationSitesSubmissions,
]

// ============================================
// GLOBALS
// "All Sites" applies to every site; each trade tab applies to every site in that trade.
// ============================================

// Hex colour field, e.g. #0E2C43
const colourField = (name: string, label: string, description: string) => ({
  name,
  label,
  type: 'text' as const,
  validate: (value: string | null | undefined) =>
    !value || /^#[0-9a-fA-F]{6}$/.test(value) ? true : 'Enter a 6-digit hex colour, e.g. #0E2C43',
  admin: { width: '33%', placeholder: '#0E2C43', description },
})

const imageField = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  admin: description ? { description } : {},
})

const createTradeTab = (service: LocationSiteService) => ({
  name: service.slug.replace('location-sites-', ''),
  label: service.label,
  fields: [
    {
      type: 'row' as const,
      fields: [
        colourField(
          'accentColour',
          'Accent Colour',
          `Accent colour for every ${service.label} site`,
        ),
      ],
    },
    {
      type: 'row' as const,
      fields: [
        {
          ...imageField(
            'logoIcon',
            'Logo Icon',
            'Shown next to the location name in the logo. SVG preferred.',
          ),
          admin: {
            width: '50%',
            description: 'Shown next to the location name in the logo. SVG preferred.',
          },
        } as Field,
        {
          name: 'logoSubtitle',
          label: 'Logo Subtitle',
          type: 'text',
          admin: {
            width: '50%',
            placeholder: `Emergency ${service.noun}`,
            description: 'Second line of the logo, under the location name',
          },
        } as Field,
      ],
    },
    {
      type: 'collapsible' as const,
      label: 'Hero',
      fields: [imageField('heroImage', 'Background Image')],
    },
    {
      type: 'collapsible' as const,
      label: 'Featured Review',
      fields: [
        {
          name: 'featuredReview',
          label: 'Featured Review',
          type: 'relationship',
          relationTo: 'reviews',
          filterOptions: {
            serviceType: { equals: service.slug.replace('location-sites-', '') },
            visible: { equals: true },
          },
          admin: {
            description: `The pull quote under the hero on every ${service.label} site. Pick one that doesn't mention a place or Emergency Hero.`,
          },
        } as Field,
      ],
    },
    {
      type: 'collapsible' as const,
      label: 'What Seems To Be The Issue',
      fields: numbered('issue', 'Issue', ISSUE_COUNT, [
        {
          name: 'brief',
          label: 'AI Brief',
          type: 'textarea',
          admin: { rows: 2, placeholder: 'Dripping or leaking taps', description: BRIEF_HELP },
        },
        imageField('image', 'Image'),
      ]),
    },
    {
      type: 'collapsible' as const,
      label: 'Booking Steps',
      fields: [
        imageField('stepsBackground', 'Background Image'),
        ...numbered('step', 'Step', STEP_COUNT, [
          {
            name: 'brief',
            label: 'AI Brief',
            type: 'textarea',
            admin: {
              rows: 2,
              placeholder: 'Customer calls our UK-based team',
              description: BRIEF_HELP,
            },
          },
        ]),
      ],
    },
    {
      type: 'collapsible' as const,
      label: 'Why Choose Us',
      fields: numbered('reason', 'Reason', REASON_COUNT, [
        imageField('icon', 'Icon', 'SVG preferred'),
        {
          name: 'brief',
          label: 'AI Brief',
          type: 'textarea',
          admin: {
            rows: 2,
            placeholder: 'Fixed price guarantee — quote agreed before any work starts',
            description: BRIEF_HELP,
          },
        },
      ]),
    },
    {
      type: 'collapsible' as const,
      label: 'FAQs',
      fields: [imageField('faqsBackground', 'Background Image')],
    },
    {
      type: 'collapsible' as const,
      label: 'Footer',
      fields: [
        {
          name: 'whatWeDo',
          label: 'What We Do',
          type: 'array',
          maxRows: 8,
          labels: { singular: 'Service', plural: 'Services' },
          admin: { description: 'Fixed list, the same on every site in this trade' },
          fields: [{ name: 'service', label: 'Service', type: 'text', required: true }],
        } as Field,
      ],
    },
  ],
})

export const LocationSitesGlobals: GlobalConfig = {
  slug: 'location-sites-globals',
  label: 'Globals',
  admin: {
    group: 'Location Sites',
    description: 'Shared by every location site. Change something here and it updates all of them.',
  },
  access: {
    read: () => true,
    update: isAdminOrSuperAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'allSites',
          label: 'All Sites',
          fields: [
            {
              type: 'row',
              fields: [
                colourField(
                  'primaryColour',
                  'Primary Colour',
                  'Main brand blue, used on every site',
                ),
                colourField(
                  'backgroundColour',
                  'Background Colour',
                  'Background blue, used on every site',
                ),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phoneNumber',
                  label: 'Phone Number',
                  type: 'text',
                  admin: {
                    width: '33%',
                    placeholder: '07123 456789',
                    description: 'Used for every call button and the phone icon on every site',
                  },
                },
                {
                  name: 'navButtonLabel',
                  label: 'Nav Button Text',
                  type: 'text',
                  admin: { width: '33%', placeholder: 'Check Availability' },
                },
              ],
            },
            {
              name: 'approvedClaims',
              label: 'Approved Facts & Promises',
              type: 'textarea',
              admin: {
                rows: 5,
                placeholder:
                  'Same day emergency attendance\nPay nothing until the work is completed\nUK-based call team',
                description:
                  'One per line. The only claims the AI may make when writing sites — it will not invent guarantees, prices, response times or accreditations.',
              },
            },
            {
              name: 'reviewLogos',
              label: 'Review Logos Banner',
              type: 'array',
              maxRows: 5,
              labels: { singular: 'Review Logo', plural: 'Review Logos' },
              admin: {
                description:
                  'Up to 5 review logos shown in a scrolling banner in the hero of every site. Drag to reorder.',
              },
              fields: [
                {
                  name: 'logo',
                  label: 'Logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'footerText',
              label: 'Footer Text',
              type: 'textarea',
              defaultValue:
                '{brandName} is a trading name of Emergency Hero Ltd. Registered in England and Wales, company number 14389904. © {year} Emergency Hero Ltd. All rights reserved.',
              admin: { rows: 2, description: PLACEHOLDER_HELP },
            },
            {
              name: 'privacyPolicy',
              label: 'Privacy Policy',
              type: 'richText',
              admin: { description: PLACEHOLDER_HELP },
            },
            {
              name: 'cookiePolicy',
              label: 'Cookie Policy',
              type: 'richText',
              admin: { description: PLACEHOLDER_HELP },
            },
            {
              name: 'termsAndConditions',
              label: 'Terms & Conditions',
              type: 'richText',
              admin: { description: PLACEHOLDER_HELP },
            },
          ],
        },
        ...LOCATION_SITE_SERVICES.map(createTradeTab),
      ],
    },
  ],
}
