import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { triggerDeployHook } from '../hooks/triggerDeployHook'

export const EmergencyHeroWebsite: CollectionConfig = {
  slug: 'emergency-hero-website',
  labels: {
    singular: 'Website',
    plural: 'Website',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Emergency Hero',
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
      defaultValue: 'Emergency Hero Website',
    },
    {
      type: 'tabs',
      tabs: [
        // GLOBALS TAB
        {
          label: 'Globals',
          fields: [
            { name: 'logoLight', label: 'Logo (Light)', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', label: 'Logo (Dark)', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
            { name: 'navCtaText', label: 'Nav CTA Text', type: 'text' },
            { name: 'trustpilotRating', label: 'Trustpilot Rating', type: 'number' },
            { name: 'trustpilotReviewCount', label: 'Trustpilot Review Count', type: 'text' },
            { name: 'trustpilotPlatformsLabel', label: 'Trustpilot Platforms Label', type: 'text' },
            { name: 'appStoreUrl', label: 'App Store URL', type: 'text' },
            { name: 'googlePlayUrl', label: 'Google Play URL', type: 'text' },
            {
              name: 'appScreenshotImage',
              label: 'App Screenshot Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'appBlockHeadline', label: 'App Block — Headline', type: 'text' },
            { name: 'appBlockBody', label: 'App Block — Body Text', type: 'richText' },
            {
              name: 'appBlockBullets',
              label: 'App Block — Bullet Points',
              type: 'array',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'bottomCtaHeadline', label: 'Bottom CTA — Headline', type: 'text' },
            { name: 'bottomCtaButtonText', label: 'Bottom CTA — Button Text', type: 'text' },
            {
              name: 'bottomCtaImageLeft',
              label: 'Bottom CTA — Character Image Left',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'bottomCtaImageRight',
              label: 'Bottom CTA — Character Image Right',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'footerStrapline', label: 'Footer — Strapline', type: 'text' },
            { name: 'footerFacebookUrl', label: 'Footer — Facebook URL', type: 'text' },
            { name: 'footerInstagramUrl', label: 'Footer — Instagram URL', type: 'text' },
            { name: 'footerTwitterUrl', label: 'Footer — Twitter URL', type: 'text' },
            {
              name: 'footerAppBannerImage',
              label: 'Footer — App Banner Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'footerCopyrightText', label: 'Footer — Copyright Text', type: 'text' },
            {
              name: 'footerServicesLinks',
              label: 'Footer — Services Links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'footerCompanyLinks',
              label: 'Footer — Company Links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'footerPoliciesLinks',
              label: 'Footer — Policies Links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'mobileMenuImageLeft',
              label: 'Mobile Menu — Character Image Left',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'mobileMenuImageRight',
              label: 'Mobile Menu — Character Image Right',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },

        // HOME TAB
        {
          label: 'Home',
          fields: [
            {
              name: 'homeHeroBackgroundImage',
              label: 'Hero — Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'homeHeroHeadline', label: 'Hero — Headline', type: 'text' },
            { name: 'homeHeroSubheading', label: 'Hero — Subheading', type: 'text' },
            { name: 'homeHeroFormCtaText', label: 'Hero — Form CTA Button Text', type: 'text' },
            {
              name: 'homeHeroImageLeft',
              label: 'Hero — Character Image Left',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'homeHeroImageRight',
              label: 'Hero — Character Image Right',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'homeModalHeadline', label: 'Modal — Headline', type: 'text' },
            {
              name: 'homeModalCharacterImage',
              label: 'Modal — Character Image',
              type: 'upload',
              relationTo: 'emergency-hero-image-gallery',
            },
            {
              name: 'logoBarLogos',
              label: 'Logo Bar — Logos',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'url', type: 'text' },
              ],
            },
            { name: 'servicesGridHeadline', label: 'Services Grid — Headline', type: 'text' },
            { name: 'servicesGridSubheading', label: 'Services Grid — Subheading', type: 'text' },
            { name: 'homecareCardHeadline', label: 'Homecare Card — Headline', type: 'text' },
            { name: 'homecareCardBody', label: 'Homecare Card — Body Text', type: 'text' },
            { name: 'homecareCardCtaText', label: 'Homecare Card — CTA Text', type: 'text' },
            {
              name: 'homecareCardCtaUrl',
              label: 'Homecare Card — CTA URL',
              type: 'text',
              defaultValue: 'https://herocare.co.uk',
            },
            {
              name: 'homecareCardImage',
              label: 'Homecare Card — Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'homecareCardAccentColour',
              label: 'Homecare Card — Accent Colour (hex)',
              type: 'text',
            },
            { name: 'whoWeAreHeadline', label: 'Who We Are — Headline', type: 'text' },
            { name: 'whoWeAreSubheading', label: 'Who We Are — Subheading', type: 'text' },
            { name: 'whoWeAreVideoUrl', label: 'Who We Are — Video Embed URL', type: 'text' },
            { name: 'homeFaqsHeadline', label: 'FAQs — Headline', type: 'text' },
            { name: 'homeFaqsBody', label: 'FAQs — Body Text', type: 'richText' },
            {
              name: 'homeFaqsHaveAnotherQuestion',
              label: 'FAQs — Have Another Question Label',
              type: 'text',
            },
            {
              name: 'homeFaqItems',
              label: 'FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
            {
              name: 'knowledgeBaseHeadline',
              label: 'Latest from the Knowledge Base — Headline',
              type: 'text',
            },
          ],
        },

        // SERVICES TAB
        {
          label: 'Services',
          fields: [
            // Plumbing
            {
              name: 'plumbingHeroBgImage',
              label: 'Plumbing — Hero Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'plumbingHeroHeadline', label: 'Plumbing — Hero Headline', type: 'text' },
            { name: 'plumbingHeroSubheading', label: 'Plumbing — Hero Subheading', type: 'text' },
            {
              name: 'plumbingHeroFormCtaText',
              label: 'Plumbing — Hero Form CTA Text',
              type: 'text',
            },
            {
              name: 'plumbingIssuesHeadline',
              label: 'Plumbing — Issues Grid Headline',
              type: 'text',
            },
            {
              name: 'plumbingIssuesSubheading',
              label: 'Plumbing — Issues Grid Subheading',
              type: 'text',
            },
            {
              name: 'plumbingIssueCards',
              label: 'Plumbing — Issue Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', type: 'text' },
              ],
            },
            {
              name: 'plumbingWhyUsHeadline',
              label: 'Plumbing — Why Choose Us Headline',
              type: 'text',
            },
            {
              name: 'plumbingWhyUsSubheading',
              label: 'Plumbing — Why Choose Us Subheading',
              type: 'text',
            },
            {
              name: 'plumbingWhyUsCards',
              label: 'Plumbing — Why Choose Us Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'plumbingHowItWorksHeadline',
              label: 'Plumbing — How It Works Headline',
              type: 'text',
            },
            {
              name: 'plumbingHowItWorksSteps',
              label: 'Plumbing — How It Works Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'plumbingFaqsHeadline', label: 'Plumbing — FAQs Headline', type: 'text' },
            { name: 'plumbingFaqsBody', label: 'Plumbing — FAQs Body Text', type: 'richText' },
            {
              name: 'plumbingFaqItems',
              label: 'Plumbing — FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
            {
              name: 'plumbingTySubheading',
              label: 'Plumbing — Thank You Subheading',
              type: 'text',
            },
            {
              name: 'plumbingTyCallCtaText',
              label: 'Plumbing — Thank You Call CTA Text',
              type: 'text',
            },

            // Heating
            {
              name: 'heatingHeroBgImage',
              label: 'Heating — Hero Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'heatingHeroHeadline', label: 'Heating — Hero Headline', type: 'text' },
            { name: 'heatingHeroSubheading', label: 'Heating — Hero Subheading', type: 'text' },
            { name: 'heatingHeroFormCtaText', label: 'Heating — Hero Form CTA Text', type: 'text' },
            {
              name: 'heatingIssuesHeadline',
              label: 'Heating — Issues Grid Headline',
              type: 'text',
            },
            {
              name: 'heatingIssuesSubheading',
              label: 'Heating — Issues Grid Subheading',
              type: 'text',
            },
            {
              name: 'heatingIssueCards',
              label: 'Heating — Issue Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', type: 'text' },
              ],
            },
            {
              name: 'heatingWhyUsHeadline',
              label: 'Heating — Why Choose Us Headline',
              type: 'text',
            },
            {
              name: 'heatingWhyUsSubheading',
              label: 'Heating — Why Choose Us Subheading',
              type: 'text',
            },
            {
              name: 'heatingWhyUsCards',
              label: 'Heating — Why Choose Us Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'heatingHowItWorksHeadline',
              label: 'Heating — How It Works Headline',
              type: 'text',
            },
            {
              name: 'heatingHowItWorksSteps',
              label: 'Heating — How It Works Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'heatingFaqsHeadline', label: 'Heating — FAQs Headline', type: 'text' },
            { name: 'heatingFaqsBody', label: 'Heating — FAQs Body Text', type: 'richText' },
            {
              name: 'heatingFaqItems',
              label: 'Heating — FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
            { name: 'heatingTySubheading', label: 'Heating — Thank You Subheading', type: 'text' },
            {
              name: 'heatingTyCallCtaText',
              label: 'Heating — Thank You Call CTA Text',
              type: 'text',
            },

            // Electrics
            {
              name: 'electricsHeroBgImage',
              label: 'Electrics — Hero Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'electricsHeroHeadline', label: 'Electrics — Hero Headline', type: 'text' },
            { name: 'electricsHeroSubheading', label: 'Electrics — Hero Subheading', type: 'text' },
            {
              name: 'electricsHeroFormCtaText',
              label: 'Electrics — Hero Form CTA Text',
              type: 'text',
            },
            {
              name: 'electricsIssuesHeadline',
              label: 'Electrics — Issues Grid Headline',
              type: 'text',
            },
            {
              name: 'electricsIssuesSubheading',
              label: 'Electrics — Issues Grid Subheading',
              type: 'text',
            },
            {
              name: 'electricsIssueCards',
              label: 'Electrics — Issue Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', type: 'text' },
              ],
            },
            {
              name: 'electricsWhyUsHeadline',
              label: 'Electrics — Why Choose Us Headline',
              type: 'text',
            },
            {
              name: 'electricsWhyUsSubheading',
              label: 'Electrics — Why Choose Us Subheading',
              type: 'text',
            },
            {
              name: 'electricsWhyUsCards',
              label: 'Electrics — Why Choose Us Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'electricsHowItWorksHeadline',
              label: 'Electrics — How It Works Headline',
              type: 'text',
            },
            {
              name: 'electricsHowItWorksSteps',
              label: 'Electrics — How It Works Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'electricsFaqsHeadline', label: 'Electrics — FAQs Headline', type: 'text' },
            { name: 'electricsFaqsBody', label: 'Electrics — FAQs Body Text', type: 'richText' },
            {
              name: 'electricsFaqItems',
              label: 'Electrics — FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
            {
              name: 'electricsTySubheading',
              label: 'Electrics — Thank You Subheading',
              type: 'text',
            },
            {
              name: 'electricsTyCallCtaText',
              label: 'Electrics — Thank You Call CTA Text',
              type: 'text',
            },

            // Drainage
            {
              name: 'drainageHeroBgImage',
              label: 'Drainage — Hero Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'drainageHeroHeadline', label: 'Drainage — Hero Headline', type: 'text' },
            { name: 'drainageHeroSubheading', label: 'Drainage — Hero Subheading', type: 'text' },
            {
              name: 'drainageHeroFormCtaText',
              label: 'Drainage — Hero Form CTA Text',
              type: 'text',
            },
            {
              name: 'drainageIssuesHeadline',
              label: 'Drainage — Issues Grid Headline',
              type: 'text',
            },
            {
              name: 'drainageIssuesSubheading',
              label: 'Drainage — Issues Grid Subheading',
              type: 'text',
            },
            {
              name: 'drainageIssueCards',
              label: 'Drainage — Issue Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', type: 'text' },
              ],
            },
            {
              name: 'drainageWhyUsHeadline',
              label: 'Drainage — Why Choose Us Headline',
              type: 'text',
            },
            {
              name: 'drainageWhyUsSubheading',
              label: 'Drainage — Why Choose Us Subheading',
              type: 'text',
            },
            {
              name: 'drainageWhyUsCards',
              label: 'Drainage — Why Choose Us Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'drainageHowItWorksHeadline',
              label: 'Drainage — How It Works Headline',
              type: 'text',
            },
            {
              name: 'drainageHowItWorksSteps',
              label: 'Drainage — How It Works Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'drainageFaqsHeadline', label: 'Drainage — FAQs Headline', type: 'text' },
            { name: 'drainageFaqsBody', label: 'Drainage — FAQs Body Text', type: 'richText' },
            {
              name: 'drainageFaqItems',
              label: 'Drainage — FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
            {
              name: 'drainageTySubheading',
              label: 'Drainage — Thank You Subheading',
              type: 'text',
            },
            {
              name: 'drainageTyCallCtaText',
              label: 'Drainage — Thank You Call CTA Text',
              type: 'text',
            },

            // Locksmiths
            {
              name: 'locksmithsHeroBgImage',
              label: 'Locksmiths — Hero Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'locksmithsHeroHeadline', label: 'Locksmiths — Hero Headline', type: 'text' },
            {
              name: 'locksmithsHeroSubheading',
              label: 'Locksmiths — Hero Subheading',
              type: 'text',
            },
            {
              name: 'locksmithsHeroFormCtaText',
              label: 'Locksmiths — Hero Form CTA Text',
              type: 'text',
            },
            {
              name: 'locksmithsIssuesHeadline',
              label: 'Locksmiths — Issues Grid Headline',
              type: 'text',
            },
            {
              name: 'locksmithsIssuesSubheading',
              label: 'Locksmiths — Issues Grid Subheading',
              type: 'text',
            },
            {
              name: 'locksmithsIssueCards',
              label: 'Locksmiths — Issue Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
                { name: 'ctaText', type: 'text' },
              ],
            },
            {
              name: 'locksmithsWhyUsHeadline',
              label: 'Locksmiths — Why Choose Us Headline',
              type: 'text',
            },
            {
              name: 'locksmithsWhyUsSubheading',
              label: 'Locksmiths — Why Choose Us Subheading',
              type: 'text',
            },
            {
              name: 'locksmithsWhyUsCards',
              label: 'Locksmiths — Why Choose Us Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            {
              name: 'locksmithsHowItWorksHeadline',
              label: 'Locksmiths — How It Works Headline',
              type: 'text',
            },
            {
              name: 'locksmithsHowItWorksSteps',
              label: 'Locksmiths — How It Works Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'locksmithsFaqsHeadline', label: 'Locksmiths — FAQs Headline', type: 'text' },
            { name: 'locksmithsFaqsBody', label: 'Locksmiths — FAQs Body Text', type: 'richText' },
            {
              name: 'locksmithsFaqItems',
              label: 'Locksmiths — FAQ Items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'richText', required: true },
              ],
            },
            {
              name: 'locksmithsTySubheading',
              label: 'Locksmiths — Thank You Subheading',
              type: 'text',
            },
            {
              name: 'locksmithsTyCallCtaText',
              label: 'Locksmiths — Thank You Call CTA Text',
              type: 'text',
            },
          ],
        },

        // KNOWLEDGE BASE TAB
        {
          label: 'Knowledge Base',
          fields: [
            {
              name: 'kbHeroBgImage',
              label: 'Hero — Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'kbHeroHeadline', label: 'Hero — Headline', type: 'text' },
            { name: 'kbHeroSubheading', label: 'Hero — Subheading', type: 'text' },
            { name: 'kbGridHeadline', label: 'Article Grid — Headline', type: 'text' },
          ],
        },

        // ABOUT TAB
        {
          label: 'About',
          fields: [
            {
              name: 'aboutHeroBgImage',
              label: 'Hero — Background / Video',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'aboutHeroHeadline', label: 'Hero — Headline', type: 'text' },
            { name: 'aboutHeroSubheading', label: 'Hero — Subheading', type: 'text' },
            { name: 'asSeenOnLabel', label: 'As Seen On — Label', type: 'text' },
            {
              name: 'asSeenOnLogos',
              label: 'As Seen On — Logos',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'url', type: 'text' },
              ],
            },
            {
              name: 'storyBlocks',
              label: 'Story Blocks',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'headline', type: 'text', required: true },
                { name: 'body', type: 'richText' },
              ],
            },
            { name: 'brandValuesHeadline', label: 'Brand Values — Headline', type: 'text' },
            { name: 'brandValuesSubheading', label: 'Brand Values — Subheading', type: 'text' },
            {
              name: 'brandValueCards',
              label: 'Brand Values — Cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'teamHeadline', label: 'Meet the Team — Headline', type: 'text' },
            { name: 'teamBody', label: 'Meet the Team — Body Text', type: 'richText' },
          ],
        },

        // BECOME A HERO TAB
        {
          label: 'Become a Hero',
          fields: [
            {
              name: 'bahHeroBgImage',
              label: 'Hero — Background Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'bahHeroHeadline', label: 'Hero — Headline', type: 'text' },
            { name: 'bahHeroSubheading', label: 'Hero — Subheading', type: 'text' },
            { name: 'bahHeroCtaText', label: 'Hero — CTA Button Text', type: 'text' },
            { name: 'bahHowItWorksHeadline', label: 'How It Works — Headline', type: 'text' },
            {
              name: 'bahHowItWorksSteps',
              label: 'How It Works — Steps',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
            { name: 'bahPlansHeadline', label: 'Plans — Headline', type: 'text' },
            { name: 'bahPlansSubheading', label: 'Plans — Subheading', type: 'text' },
            {
              name: 'bahPlans',
              label: 'Plans',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
                { name: 'stripeLink', label: 'Stripe Link', type: 'text' },
              ],
            },
            {
              name: 'bahFeatureRows',
              label: 'Plans — Feature Rows',
              type: 'array',
              fields: [
                { name: 'featureName', label: 'Feature Name', type: 'text', required: true },
                {
                  name: 'planValues',
                  label: 'Value Per Plan',
                  type: 'array',
                  fields: [{ name: 'value', type: 'text', required: true }],
                },
              ],
            },
            { name: 'bahPlansFootnote', label: 'Plans — Footnote', type: 'richText' },
            {
              name: 'bahStoryImage',
              label: 'Story Block — Image',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'bahStoryHeadline', label: 'Story Block — Headline', type: 'text' },
            { name: 'bahStoryBody', label: 'Story Block — Body Text', type: 'richText' },
            { name: 'bahStoryCtaText', label: 'Story Block — CTA Button Text', type: 'text' },
            { name: 'bahStoryCtaLink', label: 'Story Block — CTA Link', type: 'text' },
            {
              name: 'bahTradeDocuments',
              label: 'Application Form — Trade Documents',
              type: 'array',
              fields: [
                { name: 'tradeName', label: 'Trade Name', type: 'text', required: true },
                {
                  name: 'tradePluralLabel',
                  label: 'Trade Plural Label',
                  type: 'text',
                  required: true,
                },
                { name: 'microcopy', label: 'Microcopy Template', type: 'richText' },
                {
                  name: 'requiredDocuments',
                  label: 'Required Documents',
                  type: 'array',
                  fields: [
                    { name: 'label', label: 'Document Label', type: 'text', required: true },
                    { name: 'required', type: 'checkbox', defaultValue: true },
                  ],
                },
              ],
            },
          ],
        },

        // POLICIES TAB
        {
          label: 'Policies',
          fields: [
            {
              name: 'ehPolicies',
              label: 'Policy Pages',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true },
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
