import type { CollectionAfterChangeHook } from 'payload'

// Emails every new Location Sites lead, independently of GHL, so a lead still arrives if GHL is down.
// Runs before the GHL hook. Uses Resend (RESEND_API_KEY on the CMS server) and the sender name/address
// from the API Keys record of the tenant chosen in Globals → All Sites → GHL ("Use GHL connection from").
// Recipients: Globals → All Sites → Lead Emails, or that API Keys record's Admin Notification Email.
// The result is written back to the submission as Email: Sent / Failed (+ Email Error).

const TRADE_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  heating: 'Heating',
  electrics: 'Electrics',
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const sendLocationSiteLeadEmail: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  const setResult = async (emailSync: 'sent' | 'failed', emailError = '') => {
    try {
      await req.payload.update({
        collection: 'location-sites-submissions' as any,
        id: doc.id,
        data: { emailSync, emailError } as any,
        overrideAccess: true,
        req,
      })
    } catch (error) {
      req.payload.logger.error(`Could not save email result on submission ${doc.id}: ${error}`)
    }
  }

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set on the CMS server')

    const globals: any = await req.payload.findGlobal({
      slug: 'location-sites-globals',
      depth: 0,
      overrideAccess: true,
      req,
    } as any)
    const settings = globals?.allSites ?? {}

    const tenantId =
      typeof settings.ghlTenant === 'object' ? settings.ghlTenant?.id : settings.ghlTenant
    let config: any = null
    if (tenantId) {
      const keys = await req.payload.find({
        collection: 'api-keys' as any,
        where: { tenant: { equals: tenantId } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      config = keys.docs[0] ?? null
    }

    const recipients = String(settings.leadEmails ?? '')
      .split(/[\s,;]+/)
      .map((email) => email.trim())
      .filter((email) => EMAIL_PATTERN.test(email))
    if (!recipients.length && config?.adminNotificationEmail) recipients.push(config.adminNotificationEmail)
    if (!recipients.length) {
      throw new Error('No lead email address set (Globals → All Sites → Lead Emails)')
    }

    const fromEmail = config?.resendFromEmail
    const fromName = config?.resendFromName || 'Location Sites'
    if (!fromEmail) {
      throw new Error(
        "No sender address: add Resend From Email to the API Keys record of the tenant chosen under Globals → All Sites → GHL",
      )
    }

    const trade = TRADE_LABELS[doc.service] ?? doc.service ?? 'Lead'
    const location = doc.locationName || ''
    const phone = String(doc.phone ?? '').trim()
    const telHref = phone.replace(/[^\d+]/g, '')
    const received = new Date(doc.createdAt ?? Date.now()).toLocaleString('en-GB', {
      timeZone: 'Europe/London',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    const subject = `New lead: ${doc.postcode || 'No postcode'} – ${trade}${location ? ` (${location})` : ''}`

    const rows: [string, string][] = [
      ['Phone', telHref ? `<a href="tel:${escapeHtml(telHref)}">${escapeHtml(phone)}</a>` : '—'],
      ['Postcode', escapeHtml(doc.postcode || '—')],
      ['Trade', escapeHtml(trade)],
      ['Location', escapeHtml(location || '—')],
      ['Site', escapeHtml([doc.brandName, doc.domain].filter(Boolean).join(' · ') || '—')],
      ['Received', escapeHtml(received)],
    ]
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#10153d">
        <h2 style="margin:0 0 12px">New location site lead</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows
            .map(
              ([label, value]) =>
                `<tr><td style="color:#555b7a;padding-right:16px">${label}</td><td><strong>${value}</strong></td></tr>`,
            )
            .join('')}
        </table>
        <p style="color:#555b7a;font-size:13px;margin-top:16px">
          Sent straight from Hero CMS so leads arrive even if GHL is unavailable. Check the GHL
          status of this lead in Hero CMS → Location Sites → Form Submissions.
        </p>
      </div>`
    const text = [
      'New location site lead',
      `Phone: ${phone || '—'}`,
      `Postcode: ${doc.postcode || '—'}`,
      `Trade: ${trade}`,
      `Location: ${location || '—'}`,
      `Site: ${[doc.brandName, doc.domain].filter(Boolean).join(' · ') || '—'}`,
      `Received: ${received}`,
    ].join('\n')

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: recipients,
        subject,
        html,
        text,
      }),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`)
    }

    await setResult('sent')
  } catch (error: any) {
    req.payload.logger.error(`Location Sites lead ${doc.id} email not sent: ${error?.message}`)
    await setResult('failed', error?.message ?? String(error))
  }

  return doc
}
