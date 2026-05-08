import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { EmergencyHeroBrandAssets } from './collections/EmergencyHeroBrandAssets'
import { AllFormSubmissions } from './collections/AllFormSubmissions'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { APIKeys } from './collections/APIKeys'
import { FormSubmissions } from './collections/FormSubmissions'
import { HeroCareWebsite } from './collections/HeroCareWebsite'
import { HeroCareImageGallery } from './collections/HeroCareImageGallery'
import { HeroCareBrandAssets } from './collections/HeroCareBrandAssets'
import { HeroCareEmailTemplates } from './collections/HeroCareEmailTemplates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'light',
  },
  collections: [
    Users,
    Media,
    Tenants,
    APIKeys,
    FormSubmissions,
    HeroCareWebsite,
    HeroCareImageGallery,
    HeroCareBrandAssets,
    HeroCareEmailTemplates,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
        'herocare-image-gallery': true,
        'herocare-brand-assets': true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        forcePathStyle: true,
      },
    }),
  ],
})
