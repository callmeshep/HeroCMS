import type { CollectionAfterChangeHook } from 'payload'

const replaceMergeTags = (template: string, data: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_match, key) => data[key] ?? '')

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

    // Resolve the parent form for recipients and merge data
    const formId = typeof doc.form === 'object' ? doc.form.id : doc.form
    let form: any = null

    if (formId) {
      try {
        form = await req.payload.findByID({
          collection: 'herocare-forms',
          id: formId,
        })
      } catch {
        form = null
      }
    }

    // Merge tag data available to subject, heading, and body
    const mergeData: Record<string, string> = {
      name: doc.name ?? '',
      postcode: doc.postcode ?? '',
      phone: doc.phoneNumber ?? '',
      email: doc.email ?? '',
      companyName: doc.companyName ?? '',
      noOfProperties: doc.numberOfProperties != null ? String(doc.numberOfProperties) : '',
      formName: form?.name ?? '',
      page: form?.page ?? '',
      journey: doc.journey === 'homeowner' ? 'Homeowner' : 'Landlord',
    }

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

    // Fire Resend notification emails to the form's recipients
    const recipients: string[] = (form?.notificationRecipients ?? [])
      .map((r: { email?: string }) => r.email)
      .filter(Boolean)

    const notificationsEnabled = form?.notificationsEnabled !== false

    if (
      notificationsEnabled &&
      recipients.length > 0 &&
      config.resendFromEmail &&
      config.resendFromName
    ) {
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
        const subject = replaceMergeTags(adminTemplate.subjectLine ?? '', mergeData)
        const heading = replaceMergeTags(adminTemplate.heading ?? '', mergeData)
        const bodyText = replaceMergeTags(adminTemplate.bodyText ?? '', mergeData).replace(
          /\n/g,
          '<br>',
        )

        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `${config.resendFromName} <${config.resendFromEmail}>`,
              to: recipients,
              subject,
              html: `
                <h1>${heading}</h1>
                <p>${bodyText}</p>
                ${adminTemplate.buttonURL ? `<a href="${adminTemplate.buttonURL}">${adminTemplate.buttonText}</a>` : ''}
              `,
            }),
          })
        } catch (emailErr) {
          console.error('Resend notification error:', emailErr)
        }
      }
    }
  } catch (err) {
    console.error('Enquiry hook error:', err)
  }

  return doc
}
