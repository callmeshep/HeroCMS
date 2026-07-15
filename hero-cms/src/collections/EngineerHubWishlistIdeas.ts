import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const EngineerHubWishlistIdeas: CollectionConfig = {
  slug: 'engineer-hub-wishlist-ideas',
  labels: {
    singular: 'Wishlist Idea',
    plural: 'Wishlist Ideas',
  },
  admin: {
    group: 'Engineer Hub',
    useAsTitle: 'ideaText',
    defaultColumns: ['ideaText', 'reviewStatus', 'voteCount', 'submittedAt'],
  },
  access: {
    // Public front-end reads only need Approved ideas — filtering happens in the
    // Astro fetch query (where: reviewStatus equals Approved), not here.
    read: () => true,
    // Idea submissions come in unauthenticated from the public site via the
    // wishlist modal, so create has to be open.
    create: () => true,
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
    { name: 'ideaText', label: 'Idea Text', type: 'text', required: true },
    { name: 'whyItWouldHelp', label: 'Why It Would Help', type: 'textarea' },
    {
      name: 'submittedByEmail',
      label: 'Submitted By (Email)',
      type: 'text',
      admin: { description: 'From the gate session — not shown publicly' },
    },
    {
      name: 'reviewStatus',
      label: 'Review Status',
      type: 'select',
      options: ['Pending', 'Approved', 'Rejected'],
      defaultValue: 'Pending',
      required: true,
    },
    {
      name: 'voteCount',
      label: 'Vote Count',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'voterEmails',
      label: 'Voter Emails',
      type: 'array',
      admin: { description: 'Used to stop the same engineer voting twice — not exposed publicly' },
      fields: [{ name: 'email', type: 'text', required: true }],
    },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
