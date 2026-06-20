import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'

export const ReviewWebsiteWebsite: CollectionConfig = {
  slug: 'review-website-website',
  labels: {
    singular: 'Website',
    plural: 'Website',
  },
  admin: {
    group: 'Review Website',
    useAsTitle: 'internalTitle',
  },
  access: {
    read: () => true,
    create: isAdminOrSuperAdmin,
    update: isAdminOrSuperAdmin,
    delete: isSuperAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const apiKeyRecord = await req.payload.find({
          collection: 'api-keys',
          where: { tenant: { equals: 3 } },
          limit: 1,
        })
        const deployHook = apiKeyRecord.docs[0]?.cloudflareDeployHook
        if (deployHook) {
          await fetch(deployHook, { method: 'POST' }).catch(() => null)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'internalTitle',
      label: 'Internal Title',
      type: 'text',
      defaultValue: 'Review Website',
      admin: { hidden: true },
    },
    {
      type: 'tabs',
      tabs: [
        // NAV
        {
          label: 'Nav',
          fields: [
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'navLinkVisitWebsiteLabel',
              label: 'Visit Website — Label',
              type: 'text',
              defaultValue: 'Visit Website',
            },
            {
              name: 'navLinkVisitWebsiteUrl',
              label: 'Visit Website — URL',
              type: 'text',
            },
            {
              name: 'navLinkGetHomeCoverLabel',
              label: 'Get Home Cover — Label',
              type: 'text',
              defaultValue: 'Get Home Cover',
            },
            {
              name: 'navLinkGetHomeCoverUrl',
              label: 'Get Home Cover — URL',
              type: 'text',
            },
            {
              name: 'navCtaLabel',
              label: 'CTA Button — Label',
              type: 'text',
              defaultValue: 'Leave a Review',
            },
          ],
        },

        // HERO
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroHeadline',
              label: 'Headline',
              type: 'text',
            },
            {
              name: 'heroSubheading',
              label: 'Subheading',
              type: 'textarea',
            },
            {
              name: 'heroImage',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroRatingText',
              label: 'Rating Text',
              type: 'text',
              defaultValue: 'Outstanding',
            },
            {
              name: 'heroReviewCount',
              label: 'Review Count Text',
              type: 'text',
              defaultValue: 'based on over 1700 reviews across multiple platforms such as',
            },
            {
              name: 'platformLogos',
              label: 'Platform Logos',
              type: 'array',
              fields: [
                {
                  name: 'logo',
                  label: 'Logo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'url',
                  label: 'Link URL',
                  type: 'text',
                },
                {
                  name: 'altText',
                  label: 'Alt Text',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // REVIEWS SECTION
        {
          label: 'Reviews Section',
          fields: [
            {
              name: 'reviewsSectionHeadline',
              label: 'Section Headline',
              type: 'text',
              defaultValue: 'Emergency Hero Reviews',
            },
            {
              name: 'filterLabel',
              label: 'Filter Label',
              type: 'text',
              defaultValue: 'Filter Reviews by Service',
            },
            {
              name: 'filterImages',
              label: 'Filter Category Images',
              type: 'array',
              fields: [
                {
                  name: 'serviceType',
                  label: 'Service Type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'General', value: 'general' },
                    { label: 'Heating', value: 'heating' },
                    { label: 'Plumbing', value: 'plumbing' },
                    { label: 'Drainage', value: 'drainage' },
                    { label: 'Electrics', value: 'electrics' },
                  ],
                },
                {
                  name: 'image',
                  label: 'Image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },

        // POPUP
        {
          label: 'Leave a Review Popup',
          fields: [
            {
              name: 'popupHeadline',
              label: 'Headline',
              type: 'text',
              defaultValue: 'Leave us a review',
            },
            {
              name: 'popupImage',
              label: 'Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'popupCtaLabel',
              label: 'Submit Button Label',
              type: 'text',
              defaultValue: 'Submit Your Review',
            },
            {
              name: 'popupThankYouMessage',
              label: 'Thank You Message',
              type: 'textarea',
              defaultValue: "Thank you for your review. We'll publish it shortly.",
            },
          ],
        },

        // FOOTER
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerLogo',
              label: 'Footer Logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'footerPrivacyPolicyUrl',
              label: 'Privacy Policy — URL',
              type: 'text',
            },
            {
              name: 'footerCookiesPolicyUrl',
              label: 'Cookies Policy — URL',
              type: 'text',
            },
            {
              name: 'footerVisitMainWebsiteUrl',
              label: 'Visit Main Website — URL',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
