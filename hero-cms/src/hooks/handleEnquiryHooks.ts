import type { CollectionAfterChangeHook } from 'payload'

export const handleEnquiryHooks: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    const tenantId = typeof doc.tenant === 'object' ? doc.tenant.id : doc.tenant

    if (!tenantId) return doc

    const apiKeyRecord = await req.payload.find({
      collection: 'api-keys',
      where: {
        tenant: {
          equals: tenantId,
        },
      },
      limit: 1,
    })

    const config = apiKeyRecord.docs[0]
    if (!config) return doc

    // Build CRM card title
    const cardTitle =
      doc.journey === 'homeowner'
        ? `Homeowner Enquiry — ${doc.postcode}`
        : `Landlord Enquiry — ${doc.companyName} — ${doc.numberOfProperties} properties`

    // Fire CRM webhook
    if (config.crmWebhookURL) {
      try {
        const crmRes = await fetch(config.crmWebhookURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.crmAPIKey ? { Authorization: `Bearer ${config.crmAPIKey}` } : {}),
          },
          body: JSON.stringify({
            cardTitle,
            ...doc,
          }),
        })

        const webhookStatus = crmRes.ok ? 'sent' : 'failed'

        await req.payload.update({
          collection: 'herocare-submissions',
          id: doc.id,
          data: { webhookStatus },
        })
      } catch {
        await req.payload.update({
          collection: 'herocare-submissions',
          id: doc.id,
          data: { webhookStatus: 'failed' },
        })
      }
    }

    // Fire Resend emails
    if (config.resendFromEmail && config.resendFromName) {
      const templates = await req.payload.find({
        collection: 'herocare-email-templates',
        where: {
          tenant: {
            equals: tenantId,
          },
        },
      })

      const adminTemplate = templates.docs.find((t: any) => t.name === 'admin-notification')

      if (adminTemplate) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `${config.resendFromName} <${config.resendFromEmail}>`,
            to: config.resendFromEmail,
            subject: adminTemplate.subjectLine,
            html: `
              <h1>${adminTemplate.heading}</h1>
              <p>${adminTemplate.bodyText}</p>
              ${adminTemplate.buttonURL ? `<a href="${adminTemplate.buttonURL}">${adminTemplate.buttonText}</a>` : ''}
            `,
          }),
        })
      }
    }
  } catch (err) {
    console.error('Enquiry hook error:', err)
  }

  return doc
}
