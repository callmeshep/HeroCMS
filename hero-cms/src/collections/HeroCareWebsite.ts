import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const HeroCareWebsite: CollectionConfig = {
  slug: 'herocare-website',
  labels: {
    singular: 'Website',
    plural: 'Website',
  },
  admin: {
    useAsTitle: 'title',
    group: 'HeroCare',
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
      defaultValue: 'HeroCare Website',
      admin: { hidden: true },
    },
    {
      type: 'tabs',
      tabs: [
        // GLOBALS TAB
        {
          label: 'Globals',
          fields: [
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', label: 'Logo (Dark)', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
            { name: 'navCtaText', label: 'Nav CTA Text', type: 'text' },
            { name: 'navCtaLink', label: 'Nav CTA Link', type: 'text' },
            { name: 'topBarHomeownersLabel', label: 'Top Bar — Homeowners Label', type: 'text' },
            { name: 'topBarHomeownersURL', label: 'Top Bar — Homeowners URL', type: 'text' },
            { name: 'topBarLandlordsLabel', label: 'Top Bar — Landlords Label', type: 'text' },
            { name: 'topBarLandlordsURL', label: 'Top Bar — Landlords URL', type: 'text' },
            {
              name: 'emergencyHeroLogo',
              label: 'Emergency Hero Logo',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'emergencyHeroLink', label: 'Emergency Hero Link', type: 'text' },
            { name: 'trustpilotRating', label: 'Trustpilot Rating', type: 'number' },
            { name: 'trustpilotReviewCount', label: 'Trustpilot Review Count', type: 'number' },
            { name: 'trustpilotLink', label: 'Trustpilot Link', type: 'text' },
          ],
        },

        // HOMEOWNERS TAB
        {
          label: 'Homeowners',
          fields: [
            { name: 'heroHeadlineLine1', label: 'Hero — Headline Line 1', type: 'text' },
            { name: 'heroHeadlineLine2', label: 'Hero — Headline Line 2', type: 'text' },
            {
              name: 'heroBulletPoints',
              label: 'Hero — Bullet Points',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'heroFormSubheading', label: 'Hero — Form Subheading', type: 'text' },
            { name: 'heroFormCtaText', label: 'Hero — Form CTA Button Text', type: 'text' },
            { name: 'heroImage', label: 'Hero — Image', type: 'upload', relationTo: 'media' },
            {
              name: 'includedHeadlineLine1',
              label: "What's Included — Headline Line 1",
              type: 'text',
            },
            {
              name: 'includedHeadlineLine2',
              label: "What's Included — Headline Line 2",
              type: 'text',
            },
            { name: 'includedSubheading', label: "What's Included — Subheading", type: 'text' },
            {
              name: 'includedCards',
              label: "What's Included — Cards",
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
              ],
            },
            { name: 'howItWorksHeadline', label: 'How It Works — Headline', type: 'text' },
            {
              name: 'howItWorksSteps',
              label: 'How It Works — Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'whyUsHeadlineLine1', label: 'Why Us — Headline Line 1', type: 'text' },
            { name: 'whyUsHeadlineLine2', label: 'Why Us — Headline Line 2', type: 'text' },
            { name: 'whyUsSubheading', label: 'Why Us — Subheading', type: 'text' },
            { name: 'whyUsCtaText', label: 'Why Us — CTA Button Text', type: 'text' },
            {
              name: 'whyUsCards',
              label: 'Why Us — Cards',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'faqsHeadlineLine1', label: 'FAQs — Headline Line 1', type: 'text' },
            { name: 'faqsHeadlineLine2', label: 'FAQs — Headline Line 2', type: 'text' },
            { name: 'faqsSubheading', label: 'FAQs — Subheading', type: 'text' },
            {
              name: 'faqItems',
              label: 'FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            { name: 'ctaHeadlineLine1', label: 'CTA — Headline Line 1', type: 'text' },
            { name: 'ctaHeadlineLine2', label: 'CTA — Headline Line 2 (Pink)', type: 'text' },
            { name: 'ctaSubheading', label: 'CTA — Subheading', type: 'text' },
            { name: 'ctaButtonText', label: 'CTA — Button Text', type: 'text' },
            { name: 'ctaImage', label: 'CTA — Image', type: 'upload', relationTo: 'media' },
            { name: 'popupHeadline', label: 'Pop-up — Headline', type: 'text' },
            { name: 'popupImage', label: 'Pop-up — Image', type: 'upload', relationTo: 'media' },
            { name: 'popupCtaText', label: 'Pop-up — CTA Button Text', type: 'text' },
            { name: 'popupThankYouMessage', label: 'Pop-up — Thank You Message', type: 'text' },
            { name: 'tyHeadlineLine1', label: 'Thank You — Headline Line 1', type: 'text' },
            { name: 'tyHeadlineLine2', label: 'Thank You — Headline Line 2 (Pink)', type: 'text' },
            { name: 'tySubheading', label: 'Thank You — Subheading', type: 'text' },
            { name: 'tyAppStoreLink', label: 'Thank You — App Store Link', type: 'text' },
            { name: 'tyGooglePlayLink', label: 'Thank You — Google Play Link', type: 'text' },
            {
              name: 'tyPlanHeadlineLine1',
              label: 'Thank You — Plan Section Headline Line 1',
              type: 'text',
            },
            {
              name: 'tyPlanHeadlineLine2',
              label: 'Thank You — Plan Section Headline Line 2 (Pink)',
              type: 'text',
            },
          ],
        },

        // LANDLORDS TAB
        {
          label: 'Landlords',
          fields: [
            { name: 'landlordHeroHeadlineLine1', label: 'Hero — Headline Line 1', type: 'text' },
            { name: 'landlordHeroHeadlineLine2', label: 'Hero — Headline Line 2', type: 'text' },
            {
              name: 'landlordHeroBulletPoints',
              label: 'Hero — Bullet Points',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'landlordHeroCtaText', label: 'Hero — CTA Button Text', type: 'text' },
            {
              name: 'landlordHeroImage',
              label: 'Hero — Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'landlordIncludedHeadlineLine1',
              label: "What's Included — Headline Line 1",
              type: 'text',
            },
            {
              name: 'landlordIncludedHeadlineLine2',
              label: "What's Included — Headline Line 2",
              type: 'text',
            },
            {
              name: 'landlordIncludedSubheading',
              label: "What's Included — Subheading",
              type: 'text',
            },
            {
              name: 'landlordIncludedCards',
              label: "What's Included — Cards",
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
              ],
            },
            { name: 'landlordHowItWorksHeadline', label: 'How It Works — Headline', type: 'text' },
            {
              name: 'landlordHowItWorksSteps',
              label: 'How It Works — Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'landlordWhyUsHeadlineLine1', label: 'Why Us — Headline Line 1', type: 'text' },
            { name: 'landlordWhyUsHeadlineLine2', label: 'Why Us — Headline Line 2', type: 'text' },
            { name: 'landlordWhyUsSubheading', label: 'Why Us — Subheading', type: 'text' },
            { name: 'landlordWhyUsCtaText', label: 'Why Us — CTA Button Text', type: 'text' },
            {
              name: 'landlordWhyUsCards',
              label: 'Why Us — Cards',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'landlordFaqsHeadlineLine1', label: 'FAQs — Headline Line 1', type: 'text' },
            { name: 'landlordFaqsHeadlineLine2', label: 'FAQs — Headline Line 2', type: 'text' },
            { name: 'landlordFaqsSubheading', label: 'FAQs — Subheading', type: 'text' },
            {
              name: 'landlordFaqItems',
              label: 'FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            { name: 'landlordCtaHeadlineLine1', label: 'CTA — Headline Line 1', type: 'text' },
            {
              name: 'landlordCtaHeadlineLine2',
              label: 'CTA — Headline Line 2 (Pink)',
              type: 'text',
            },
            { name: 'landlordCtaSubheading', label: 'CTA — Subheading', type: 'text' },
            { name: 'landlordCtaButtonText', label: 'CTA — Button Text', type: 'text' },
            { name: 'landlordCtaImage', label: 'CTA — Image', type: 'upload', relationTo: 'media' },
            { name: 'landlordPopupHeadline', label: 'Pop-up — Headline', type: 'text' },
            {
              name: 'landlordPopupImage',
              label: 'Pop-up — Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'landlordPopupCtaText', label: 'Pop-up — CTA Button Text', type: 'text' },
          ],
        },

        // PRICING TAB
        {
          label: 'Pricing',
          fields: [
            { name: 'calloutFeeLabel', label: 'Call-out Fee Selector — Label', type: 'text' },
            {
              name: 'calloutFeeDescription',
              label: 'Call-out Fee Selector — Description',
              type: 'text',
            },
            {
              name: 'calloutFeeOptions',
              label: 'Call-out Fee Selector — Fee Options',
              type: 'array',
              fields: [
                { name: 'value', label: 'Fee Value (e.g. £75)', type: 'text', required: true },
              ],
            },
            {
              name: 'plans',
              label: 'Plans',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'priceHighCallout', label: 'Price at £75 Call-out Fee', type: 'text' },
                { name: 'priceLowCallout', label: 'Price at £0 Call-out Fee', type: 'text' },
                { name: 'pricePeriod', label: 'Price Period (e.g. Per Month)', type: 'text' },
                { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
                { name: 'stripeLink', label: 'Stripe Link', type: 'text' },
                { name: 'highlightColour', label: 'Highlight Colour (blue or pink)', type: 'text' },
              ],
            },
            {
              name: 'featureRows',
              label: 'Feature Rows',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'featureName', label: 'Feature Name', type: 'text', required: true },
                { name: 'includedInPlan1', label: 'Included in Plan 1', type: 'checkbox' },
                { name: 'includedInPlan2', label: 'Included in Plan 2', type: 'checkbox' },
                { name: 'worthNoting', label: 'Worth Noting (e.g. Worth Over £200)', type: 'text' },
              ],
            },
            {
              name: 'aboutYourPlanAccordion',
              label: 'About Your Plan — Accordion Items',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'aboutYourPlanCtaHeadlineLine1',
              label: 'About Your Plan — CTA Headline Line 1',
              type: 'text',
            },
            {
              name: 'aboutYourPlanCtaHeadlineLine2',
              label: 'About Your Plan — CTA Headline Line 2 (Pink)',
              type: 'text',
            },
            {
              name: 'aboutYourPlanCtaPhone',
              label: 'About Your Plan — CTA Phone Number',
              type: 'text',
            },
          ],
        },

        // POLICIES TAB
        {
          label: 'Policies',
          fields: [
            {
              name: 'policies',
              label: 'Policy Pages',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
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
