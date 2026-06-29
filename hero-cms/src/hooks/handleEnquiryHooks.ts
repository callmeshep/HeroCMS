import type { CollectionAfterChangeHook } from 'payload'

const replaceMergeTags = (template: string, data: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_match, key) => data[key] ?? '')

const GHL_CONFIG: Record<
  string,
  {
    pipelineId: string
    stageId: string
    tag: string
    formCollection: string
    submissionCollection: string
    emailCollection: string
  }
> = {
  herocare: {
    pipelineId: '4yIDNr79Pd1K52wi5k9t',
    stageId: 'a7d5ba56-4b90-46e5-a219-b6de14fd90d0',
    tag: 'HeroCare',
    formCollection: 'herocare-forms',
    submissionCollection: 'herocare-submissions',
    emailCollection: 'herocare-email-templates',
  },
  'your-emergency-fixed': {
    pipelineId: '9kgOOclKY2OQVIFajnPD',
    stageId: '7b6606df-5acd-4647-a63f-4b53497b3e98',
    tag: 'Your Emergency Fixed',
    formCollection: 'yef-forms',
    submissionCollection: 'yef-submissions',
    emailCollection: 'yef-email-templates',
  },
}

async function ghlRequest(path: string, method: string, apiKey: string, body?: object) {
  const res = await fetch(`https://services.leadconnectorhq.com${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GHL ${method} ${path} failed: ${err}`)
  }
  return res.json()
}

function normalisePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('44')) return `+${digits}`
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`
  return `+${digits}`
}

async function findGHLContactByPhone(
  locationId: string,
  apiKey: string,
  phone: string,
): Promise<string | null> {
  const normalised = normalisePhone(phone)
  const data = await ghlRequest(
    `/contacts/?locationId=${locationId}&query=${encodeURIComponent(normalised)}`,
    'GET',
    apiKey,
  )
  return data.contacts?.[0]?.id ?? null
}

async function findGHLOpportunityByContactId(
  locationId: string,
  apiKey: string,
  contactId: string,
  pipelineId: string,
): Promise<string | null> {
  const data = await ghlRequest(
    `/opportunities/search?locationId=${locationId}&contactId=${contactId}&pipelineId=${pipelineId}`,
    'GET',
    apiKey,
  )
  return data.opportunities?.[0]?.id ?? null
}

export const handleEnquiryHooks: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    const tenantId = typeof doc.tenant === 'object' ? doc.tenant.id : doc.tenant
    if (!tenantId) return doc

    const apiKeyRecord = await req.payload.find({
      collection: 'api-keys',
      where: { tenant: { equals: tenantId } },
      limit: 1,
    })

    const config = apiKeyRecord.docs[0]
    if (!config) return doc

    const tenantRecord = await req.payload.findByID({ collection: 'tenants', id: tenantId })
    const tenantSlug: string = tenantRecord?.slug ?? ''
    const ghl = GHL_CONFIG[tenantSlug] ?? GHL_CONFIG['herocare']

    const formId = typeof doc.form === 'object' ? doc.form.id : doc.form
    let form: any = null
    if (formId) {
      try {
        form = await req.payload.findByID({ collection: ghl.formCollection as any, id: formId })
      } catch {
        form = null
      }
    }

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

    // GHL integration
    if (config.crmWebhookURL && config.crmAPIKey) {
      const locationId = config.crmWebhookURL
      const apiKey = config.crmAPIKey

      try {
        const isStage2 = doc.stage === 'step-2' && doc.journey === 'homeowner'

        if (!isStage2) {
          // Stage 1 — create contact and opportunity
          const contactPayload: Record<string, any> = {
            locationId,
            name: doc.journey === 'landlord' ? doc.companyName : (doc.name ?? ''),
            phone: normalisePhone(doc.phoneNumber),
            tags: [ghl.tag],
          }

          const contactData = await ghlRequest('/contacts/', 'POST', apiKey, contactPayload)
          const contactId = contactData.contact?.id

          if (contactId) {
            const opportunityTitle =
              doc.journey === 'homeowner'
                ? `Homeowner Enquiry — ${doc.name}`
                : doc.service
                  ? `${doc.service} Enquiry — ${doc.name}`
                  : `Enquiry — ${doc.name}`

            await ghlRequest('/opportunities/', 'POST', apiKey, {
              locationId,
              name: opportunityTitle,
              pipelineId: ghl.pipelineId,
              pipelineStageId: ghl.stageId,
              contactId,
              status: 'open',
            })
          }
        } else {
          // Stage 2 — find existing contact by phone, update contact and opportunity
          const contactId = await findGHLContactByPhone(locationId, apiKey, doc.phoneNumber)

          if (contactId) {
            await ghlRequest(`/contacts/${contactId}`, 'PUT', apiKey, {
              email: doc.email,
              postalCode: doc.postcode,
            })

            const opportunityId = await findGHLOpportunityByContactId(
              locationId,
              apiKey,
              contactId,
              ghl.pipelineId,
            )

            if (opportunityId) {
              await ghlRequest(`/opportunities/${opportunityId}`, 'PUT', apiKey, {
                name: `Homeowner Enquiry — ${doc.name} — ${doc.postcode}`,
              })
            }
          }
        }

        try {
          await req.payload.update({
            collection: ghl.submissionCollection as any,
            id: doc.id,
            data: { webhookStatus: 'sent' },
          })
        } catch {
          console.error('webhookStatus update error (sent)')
        }
      } catch (ghlErr) {
        console.error('GHL integration error:', ghlErr)
        try {
          await req.payload.update({
            collection: ghl.submissionCollection as any,
            id: doc.id,
            data: { webhookStatus: 'failed' },
          })
        } catch {
          console.error('webhookStatus update error (failed)')
        }
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
        collection: ghl.emailCollection as any,
        where: { tenant: { equals: tenantId } },
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
