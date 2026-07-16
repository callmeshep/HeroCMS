import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const EngineerHubKnowledgeArticles: CollectionConfig = {
  slug: 'engineer-hub-knowledge-articles',
  labels: {
    singular: 'Knowledge Hub Article',
    plural: 'Knowledge Hub Articles',
  },
  admin: {
    group: 'Engineer Hub',
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'tag', 'order'],
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
    { name: 'title', label: 'Title', type: 'text', required: true },
    {
      name: 'tag',
      label: 'Tag',
      type: 'select',
      options: ['Update', 'Tip', 'How-to', 'FAQ', 'Guide'],
      required: true,
    },
    {
      name: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['Peach', 'Pink', 'Blue', 'Lavender', 'Mint', 'Yellow', 'White'],
      required: true,
    },
    {
      name: 'icon',
      label: 'Icon (Material Symbol name)',
      type: 'text',
      defaultValue: 'article',
      admin: {
        description:
          'Look up icon names at fonts.google.com/icons — copy the name shown under the icon (e.g. "lightbulb", "report_problem") and paste it here.',
      },
    },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
    { name: 'postedDate', label: 'Posted Date', type: 'date' },
    { name: 'body', label: 'Body', type: 'richText', required: true },
    {
      name: 'section',
      label: 'Section',
      type: 'select',
      options: ['Knowledge Hub', 'The App', 'Membership'],
      required: true,
    },
    {
      name: 'order',
      label: 'Order',
      type: 'number',
      admin: {
        description:
          'Controls position and which articles fall behind "Load more" (first 6 per section shown)',
      },
    },
  ],
}
