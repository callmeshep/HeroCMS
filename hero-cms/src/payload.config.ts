import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { APIKeys } from './collections/APIKeys'
import { HeroCareWebsite } from './collections/HeroCareWebsite'
import { HeroCareImageGallery } from './collections/HeroCareImageGallery'
import { HeroCareBrandAssets } from './collections/HeroCareBrandAssets'
import { HeroCareEmailTemplates } from './collections/HeroCareEmailTemplates'
import { EmergencyHeroBrandAssets } from './collections/EmergencyHeroBrandAssets'
import { EmergencyHeroWebsite } from './collections/EmergencyHeroWebsite'
import { EmergencyHeroServices } from './collections/EmergencyHeroServices'
import { EngineerHubWebsite } from './collections/EngineerHubWebsite'
import { EmergencyHeroKnowledgeBase } from './collections/EmergencyHeroKnowledgeBase'
import { EmergencyHeroTeamMembers } from './collections/EmergencyHeroTeamMembers'
import { EmergencyHeroSubmissions } from './collections/EmergencyHeroSubmissions'
import { EmergencyHeroImageGallery } from './collections/EmergencyHeroImageGallery'
import { EmergencyHeroEmailTemplates } from './collections/EmergencyHeroEmailTemplates'
import { HeroCareForms } from './collections/HeroCareForms'
import { HeroCareSubmissions } from './collections/HeroCareSubmissions'
import { Reviews } from './collections/Reviews'
import { ReviewWebsiteWebsite } from './collections/ReviewWebsiteWebsite'
import { YEFBrandAssets } from './collections/YEFBrandAssets'
import { YEFEmailTemplates } from './collections/YEFEmailTemplates'
import { YEFImageGallery } from './collections/YEFImageGallery'
import { YEFForms } from './collections/YEFForms'
import { YEFSubmissions } from './collections/YEFSubmissions'
import { YEFWebsite } from './collections/YEFWebsite'
import { YEFServicePages } from './collections/YEFServicePages'
import { YEFBlogPosts } from './collections/YEFBlogPosts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: [
    'https://herocare-astro.pages.dev',
    'https://www.herocare.co.uk',
    'https://herocare.co.uk',
    'https://emergencyheroreviews.com',
    'https://www.emergencyheroreviews.com',
    'https://emergency-hero-reviews.pages.dev',
    'https://herowebsite.pages.dev',
    'https://emergencyhero.co.uk',
    'https://www.emergencyhero.co.uk',
    'http://localhost:4321',
    'https://herocms.app',
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'light',
    meta: {
      titleSuffix: '— Hero CMS',
      icons: [
        {
          type: 'image/svg+xml',
          rel: 'icon',
          url: '/api/emergency-hero-brand-assets/file/Asset%204.svg',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '/graphics/Logo/index.tsx#Logo',
        Icon: '/graphics/Icon/index.tsx#Icon',
      },
      beforeNavLinks: ['/graphics/Logo/index.tsx#Logo'],
    },
  },
  collections: [
    Media,
    Tenants,
    Users,
    APIKeys,
    HeroCareBrandAssets,
    HeroCareEmailTemplates,
    HeroCareImageGallery,
    HeroCareForms,
    HeroCareSubmissions,
    HeroCareWebsite,
    EmergencyHeroBrandAssets,
    EmergencyHeroWebsite,
    EmergencyHeroServices,
    EngineerHubWebsite,
    EmergencyHeroKnowledgeBase,
    EmergencyHeroTeamMembers,
    EmergencyHeroSubmissions,
    EmergencyHeroImageGallery,
    EmergencyHeroEmailTemplates,
    Reviews,
    ReviewWebsiteWebsite,
    YEFBrandAssets,
    YEFEmailTemplates,
    YEFImageGallery,
    YEFForms,
    YEFSubmissions,
    YEFWebsite,
    YEFServicePages,
    YEFBlogPosts,
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
    migrationDir: './src/migrations',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename }) =>
            `https://pub-defbc79b6f1c472f9b6480d90f974810.r2.dev/${filename}`,
        },
        'herocare-image-gallery': {
          generateFileURL: ({ filename }) =>
            `https://pub-defbc79b6f1c472f9b6480d90f974810.r2.dev/${filename}`,
        },
        'herocare-brand-assets': {
          generateFileURL: ({ filename }) =>
            `https://pub-defbc79b6f1c472f9b6480d90f974810.r2.dev/${filename}`,
        },
        'emergency-hero-brand-assets': {
          generateFileURL: ({ filename }) =>
            `https://pub-defbc79b6f1c472f9b6480d90f974810.r2.dev/${filename}`,
        },
        'emergency-hero-image-gallery': {
          generateFileURL: ({ filename }) =>
            `https://pub-defbc79b6f1c472f9b6480d90f974810.r2.dev/${filename}`,
        },
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
