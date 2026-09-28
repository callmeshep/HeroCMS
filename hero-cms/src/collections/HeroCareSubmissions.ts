import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { hasTenantAccess } from '../access/hasTenantAccess'
import { handleEnquiryHooks } from '../hooks/handleEnquiryHooks'

const isPurchase = (data: any) => data?.journey === 'purchase'

export const HeroCareSubmissions: CollectionConfig = {
  slug: 'herocare-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    group: 'HeroCare',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'journey',
      'plan',
      'promoCode',
      'trigger',
      'stage',
      'submittedAt',
      'webhookStatus',
    ],
  },
  access: {
    read: hasTenantAccess('tenant'),
    create: () => true,
    update: hasTenantAccess('tenant'),
    delete: isSuperAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        // Purchases come only from the Stripe webhook — reject anything without the shared secret
        if (operation === 'create' && isPurchase(data)) {
          const expected = process.env.HEROCARE_WEBHOOK_SECRET
          const provided = req.headers?.get?.('x-herocare-webhook-secret')
          if (!expected || !provided || provided !== expected) {
            throw new APIError('Unauthorised purchase submission', 401)
          }

          const checkoutForm = await req.payload.find({
            collection: 'herocare-forms',
            where: { name: { equals: 'Stripe Checkout' } },
            limit: 1,
            overrideAccess: true,
          })
          if (!checkoutForm.docs[0]) {
            throw new APIError('HeroCare form record "Stripe Checkout" is missing', 500)
          }

          const tenant = await req.payload.find({
            collection: 'tenants',
            where: { slug: { equals: 'herocare' } },
            limit: 1,
            overrideAccess: true,
          })

          return {
            ...data,
            form: checkoutForm.docs[0].id,
            tenant: tenant.docs[0]?.id,
            trigger: 'stripe-checkout',
            stage: 'purchase',
          }
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          data.submittedAt = new Date().toISOString()
          const tenant = await req.payload.find({
            collection: 'tenants',
            where: { slug: { equals: 'herocare' } },
            limit: 1,
          })
          if (tenant.docs[0]) {
            data.tenant = tenant.docs[0].id
          }
        }
        return data
      },
    ],
    afterChange: [handleEnquiryHooks],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'herocare-forms',
      required: true,
      admin: {
        description: 'The form this submission belongs to',
      },
    },
    {
      name: 'journey',
      type: 'select',
      required: true,
      options: [
        { label: 'Homeowner', value: 'homeowner' },
        { label: 'Landlord', value: 'landlord' },
        { label: 'Purchase', value: 'purchase' },
      ],
    },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      options: [
        { label: 'Button Click', value: 'button-click' },
        { label: 'Header Form', value: 'header-form' },
        { label: 'Stripe Checkout', value: 'stripe-checkout' },
      ],
    },
    {
      name: 'stage',
      type: 'select',
      required: true,
      options: [
        { label: 'Step 1 — Header Form', value: 'step-1' },
        { label: 'Step 2 — Popup', value: 'step-2' },
        { label: 'Purchase Complete', value: 'purchase' },
      ],
    },
    {
      name: 'device',
      type: 'select',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
      ],
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'postcode',
      type: 'text',
      admin: {
        condition: (data) => data.journey === 'homeowner' || data.journey === 'purchase',
      },
    },
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      admin: {
        condition: (data) => data.journey === 'landlord',
      },
    },
    {
      name: 'numberOfProperties',
      label: 'No. of Properties',
      type: 'number',
      admin: {
        condition: (data) => data.journey === 'landlord',
      },
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'text',
    },
    {
      type: 'collapsible',
      label: 'Purchase Details',
      admin: {
        condition: (data) => data.journey === 'purchase',
        initCollapsed: false,
      },
      fields: [
        { name: 'addressLine1', label: 'Property Address — Line 1', type: 'text' },
        { name: 'addressLine2', label: 'Property Address — Line 2', type: 'text' },
        { name: 'city', label: 'Town / City', type: 'text' },
        { name: 'plan', label: 'Plan', type: 'text' },
        { name: 'priceId', label: 'Stripe Price ID', type: 'text' },
        { name: 'monthlyAmount', label: 'Monthly Price (£)', type: 'text' },
        { name: 'promoCode', label: 'Promo Code', type: 'text' },
        { name: 'trialEnd', label: 'First Payment Date', type: 'date' },
        {
          name: 'stripeSessionId',
          label: 'Stripe Checkout Session ID',
          type: 'text',
          unique: true,
        },
        { name: 'stripeCustomerId', label: 'Stripe Customer ID', type: 'text' },
        { name: 'stripeSubscriptionId', label: 'Stripe Subscription ID', type: 'text' },
      ],
    },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'webhookStatus',
      label: 'Webhook Status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}
