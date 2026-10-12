import type { Access, CollectionConfig, GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'

// Services covered by Location Sites.
// Each one becomes its own sidebar item (and its own database table).
export const LOCATION_SITE_SERVICES = [
  { slug: 'location-sites-plumbing', label: 'Plumbing', example: 'Liverpool Emergency Plumber' },
  { slug: 'location-sites-heating', label: 'Heating', example: 'Liverpool Emergency Heating' },
  {
    slug: 'location-sites-electrics',
    label: 'Electrics',
    example: 'Liverpool Emergency Electrician',
  },
] as const

type LocationSiteService = (typeof LOCATION_SITE_SERVICES)[number]

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
    description: `Single-page ${service.label.toLowerCase()} sites, one per location. They all share the same layout and ${service.label} images.`,
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
            description: 'Shown in the nav, footer and page titles',
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
              'Tick and save to write the page content from the keywords. This overwrites the current content.',
          },
        },
      ],
    },
  ],
  timestamps: true,
})

export const LocationSitesCollections: CollectionConfig[] = LOCATION_SITE_SERVICES.map(
  createLocationSiteCollection,
)

// Shared images for every Location Site, one tab per trade.
// Every site in a trade uses that trade's images, so changing one here updates them all.
export const LocationSitesImages: GlobalConfig = {
  slug: 'location-sites-images',
  label: 'Images',
  admin: {
    group: 'Location Sites',
    description:
      'Shared by every location site in each trade. Change an image here and it updates all of them.',
  },
  access: {
    read: () => true,
    update: isAdminOrSuperAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: LOCATION_SITE_SERVICES.map((service) => ({
        name: service.slug.replace('location-sites-', ''),
        label: service.label,
        fields: [
          {
            name: 'logoIcon',
            label: 'Logo Icon',
            type: 'upload',
            relationTo: 'media',
            admin: {
              description: `The icon shown next to the brand name on every ${service.label} site. SVG preferred.`,
            },
          },
        ],
      })),
    },
  ],
}
