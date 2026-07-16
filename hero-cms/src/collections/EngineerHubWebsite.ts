import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const EngineerHubWebsite: CollectionConfig = {
  slug: 'engineer-hub-website',
  labels: {
    singular: 'Website',
    plural: 'Website',
  },
  admin: {
    group: 'Engineer Hub',
    useAsTitle: 'internalTitle',
  },
  access: {
    read: () => true,
    create: isAdminOrSuperAdmin,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  hooks: {
    afterChange: [triggerDeployHook],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'internalTitle',
      label: 'Internal Title',
      type: 'text',
      defaultValue: 'Engineer Hub Website',
      admin: { hidden: true },
    },
    {
      type: 'tabs',
      tabs: [
        // GLOBALS
        {
          label: 'Globals',
          fields: [
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
            { name: 'footerLogo', label: 'Footer Logo', type: 'upload', relationTo: 'media' },
            { name: 'footerStrapline', label: 'Footer Strapline', type: 'text' },
            { name: 'footerCopyrightText', label: 'Footer Copyright Text', type: 'text' },
          ],
        },

        // KNOWN ISSUE BANNER
        {
          label: 'Known Issue Banner',
          fields: [
            { name: 'issueActive', label: 'Active', type: 'checkbox', defaultValue: false },
            { name: 'issuePillLabel', label: 'Pill Label', type: 'text' },
            { name: 'issueTitle', label: 'Issue Title', type: 'text' },
            {
              name: 'issueAnnouncedAt',
              label: 'Announced At',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            { name: 'issueBody', label: 'Body', type: 'richText' },
          ],
        },

        // KNOWLEDGE HUB
        {
          label: 'Knowledge Hub',
          fields: [
            {
              name: 'khSectionHeadline',
              label: 'Section Headline',
              type: 'text',
              defaultValue: 'Knowledge Hub',
            },
          ],
        },

        // THE APP
        {
          label: 'The App',
          fields: [
            {
              name: 'appSectionHeadline',
              label: 'Section Headline',
              type: 'text',
              defaultValue: 'The App',
            },
            {
              name: 'wishlistHeadline',
              label: 'Wishlist Card — Headline',
              type: 'text',
              defaultValue: 'App Wishlist',
            },
            { name: 'wishlistBodyText', label: 'Wishlist Card — Body Text', type: 'textarea' },
            {
              name: 'updateLogHeadline',
              label: 'Update Log Card — Headline',
              type: 'text',
              defaultValue: 'App Update Log',
            },
            { name: 'updateLogBodyText', label: 'Update Log Card — Body Text', type: 'textarea' },
            {
              name: 'updateLogEntries',
              label: 'Update Log Entries',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  label: 'Tag',
                  type: 'select',
                  options: ['Fixed', 'Added'],
                  required: true,
                },
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'date', label: 'Date', type: 'date' },
              ],
            },
          ],
        },

        // FORMS & SURVEYS
        {
          label: 'Forms & Surveys',
          fields: [
            {
              name: 'formsSectionHeadline',
              label: 'Section Headline',
              type: 'text',
              defaultValue: 'Forms & Surveys',
            },
            {
              name: 'reportProblemHeadline',
              label: 'Report a Problem — Headline',
              type: 'text',
              defaultValue: 'Report a Problem',
            },
            {
              name: 'reportProblemBodyText',
              label: 'Report a Problem — Body Text',
              type: 'textarea',
            },
            {
              name: 'insuranceHeadline',
              label: 'Insurance & Docs — Headline',
              type: 'text',
              defaultValue: 'Insurance & docs',
            },
            { name: 'insuranceBodyText', label: 'Insurance & Docs — Body Text', type: 'textarea' },
            {
              name: 'surveys',
              label: 'Surveys',
              type: 'array',
              fields: [
                {
                  name: 'surveyId',
                  label: 'Survey ID (used by front-end)',
                  type: 'text',
                  required: true,
                },
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea' },
                {
                  name: 'tone',
                  label: 'Card Colour',
                  type: 'select',
                  options: ['Peach', 'Pink', 'Blue', 'Lavender', 'Mint', 'Yellow', 'White'],
                },
              ],
            },
          ],
        },

        // MEMBERSHIP
        {
          label: 'Membership',
          fields: [
            {
              name: 'membershipSectionHeadline',
              label: 'Section Headline',
              type: 'text',
              defaultValue: 'Membership',
            },
            {
              name: 'tiers',
              label: 'Tiers',
              type: 'array',
              fields: [
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'price', label: 'Price', type: 'text' },
                { name: 'pricePeriod', label: 'Price Period (e.g. /mo)', type: 'text' },
                {
                  name: 'features',
                  label: 'Feature Bullets',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                { name: 'ctaButtonText', label: 'CTA Button Text', type: 'text' },
              ],
            },
          ],
        },

        // CONTACT
        {
          label: 'Get in Touch',
          fields: [
            {
              name: 'contactSectionHeadline',
              label: 'Section Headline',
              type: 'text',
              defaultValue: 'Get in touch',
            },
            {
              name: 'contacts',
              label: 'Contacts',
              type: 'array',
              fields: [
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'role', label: 'Role', type: 'text' },
                { name: 'avatar', label: 'Avatar', type: 'upload', relationTo: 'media' },
                { name: 'phone', label: 'Phone', type: 'text' },
                { name: 'email', label: 'Email', type: 'text' },
              ],
            },
            {
              name: 'messageCardHeadline',
              label: '"Leave a message" Card — Headline',
              type: 'text',
              defaultValue: 'Leave a message',
            },
            {
              name: 'messageCardRoleLabel',
              label: '"Leave a message" Card — Role Label',
              type: 'text',
              defaultValue: 'General enquiries',
            },
            {
              name: 'messageCardCtaText',
              label: '"Leave a message" Card — CTA Text',
              type: 'text',
              defaultValue: 'Write a message',
            },
          ],
        },

        // POLICIES
        {
          label: 'Policies',
          fields: [
            {
              name: 'policies',
              label: 'Policies',
              type: 'array',
              fields: [
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'lastUpdated', label: 'Last Updated', type: 'date' },
                { name: 'content', label: 'Content', type: 'richText' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
