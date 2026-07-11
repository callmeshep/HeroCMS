import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const YEFBlogPosts: CollectionConfig = {
  slug: 'yef-blog-posts',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Your Emergency Fixed',
    defaultColumns: ['title', 'publishedDate', 'slug'],
  },
  access: {
    read: () => true,
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
      type: 'text',
      required: true,
      admin: { description: 'e.g. What to Do If You Think You Can Smell Gas' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. what-to-do-if-you-think-you-can-smell-gas — page will be at /blog/[slug]' },
    },
    {
      name: 'publishedDate',
      label: 'Published Date',
      type: 'date',
      required: true,
      admin: { description: 'Displayed on the post, e.g. 11th September 2026' },
    },
    {
      name: 'bodyContent',
      label: 'Body Content',
      type: 'richText',
      required: true,
    },
    {
      name: 'seoTitle',
      label: 'SEO Title',
      type: 'text',
    },
    {
      name: 'seoDescription',
      label: 'SEO Description',
      type: 'textarea',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const tenant = await req.payload.find({
            collection: 'tenants',
            where: { slug: { equals: 'your-emergency-fixed' } },
            limit: 1,
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
