import type { CollectionAfterChangeHook } from 'payload'

const replaceMergeTags = (template: string, data: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_match, key) => data[key] ?? '')

const GHL_PIPELINE_ID = '4yIDNr79Pd1K52wi5k9t'
const GHL_STAGE_ID = 'a7d5ba56-4b90-46e5-a219-b6de14fd90d0'

async function createGHLContact(
  locationId: string,
  apiKey: string,
  doc: any,
): Promise<string | null> {
  const payload: Record<string, any> = {
    locationId,
    phone: doc.phoneNumber,
    name: doc.name,
    tags: [doc.journey === 'homeowner' ? 'HeroCare Homeowner' : 'HeroCare Landlord'],
  }

  if (doc.journey === 'landlord') {
    payload.companyName = doc.companyName
  }

  const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GHL contact creation failed: ${err}`)
  }

  const data = await res.json()
  return data.contact?.id ?? null
}

async function createGHLOpportunity(
  locationId: string,
  apiKey: string,
  contactId: string,
  cardTitle: string,
): Promise<void> {
  const res = await fetch('https://services.leadconnectorhq.com/opportunities/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
    },
    body: JSON.stringify({
      locationId,
      name: cardTitle,
      pipelineId: GHL_PIPELINE_ID,
      pipelineStageId: GHL_STAGE_ID,
      contactId,
      status: 'open',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GHL opportunity creation failed: ${err}`)
  }
}

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

    // Merge tag data
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

    // GHL — create contact then opportunity
    // crmWebhookURL field repurposed to store GHL Location ID
    if (config.crmWebhookURL && config.crmAPIKey) {
      try {
        const contactId = await createGHLContact(config.crmWebhookURL, config.crmAPIKey, doc)

        if (contactId) {
          await createGHLOpportunity(config.crmWebhookURL, config.crmAPIKey, contactId, cardTitle)
        }

        await req.payload.update({
          collection: 'herocare-submissions',
          id: doc.id,
          data: { webhookStatus: 'sent' },
        })
      } catch (ghlErr) {
        console.error('GHL integration error:', ghlErr)
        await req.payload.update({
          collection: 'herocare-submissions',
          id: doc.id,
          data: { webhookStatus: 'failed' },
        })
      }
    }

    // Resend notification emails
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
