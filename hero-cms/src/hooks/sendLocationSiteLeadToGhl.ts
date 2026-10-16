import type { CollectionAfterChangeHook } from 'payload'

// Sends each new Location Sites form submission to GHL:
//   1. creates/updates the contact (phone, postcode)
//   2. adds the tags from Globals → All Sites plus the site's own tag
//      (its GHL Tag field, or "Location Sites - <Location>" if that's blank)
//   3. creates an opportunity in the chosen pipeline and stage, named "<postcode> – <trade>"
// The result is written back to the submission as GHL Sync: Sent / Failed (+ GHL Error).
// Automations (notifications, follow-ups) are built as GHL workflows, not here.

const TRADE_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  heating: 'Heating',
  electrics: 'Electrics',
}

const ghlRequest = async (path: string, method: string, apiKey: string, body?: object) => {
  const response = await fetch(`https://services.leadconnectorhq.com${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
    },
    signal: AbortSignal.timeout(10000),
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GHL ${method} ${path} failed (${response.status}): ${detail.slice(0, 300)}`)
  }
  return response.json()
}

const normalisePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('44')) return `+${digits}`
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`
  return `+${digits}`
}

const findPipelineStage = async (
  locationId: string,
  apiKey: string,
  pipelineName: string,
  stageName: string,
) => {
  const data = await ghlRequest(`/opportunities/pipelines?locationId=${locationId}`, 'GET', apiKey)
  const pipeline = (data.pipelines ?? []).find(
    (p: any) => (p.name ?? '').trim().toLowerCase() === pipelineName.trim().toLowerCase(),
  )
  if (!pipeline) throw new Error(`GHL pipeline "${pipelineName}" not found`)
  const stage = (pipeline.stages ?? []).find(
    (s: any) => (s.name ?? '').trim().toLowerCase() === stageName.trim().toLowerCase(),
  )
  if (!stage) throw new Error(`Stage "${stageName}" not found in GHL pipeline "${pipelineName}"`)
  return { pipelineId: pipeline.id as string, stageId: stage.id as string }
}

export const sendLocationSiteLeadToGhl: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const setResult = async (ghlSync: 'sent' | 'failed', ghlError = '') => {
    try {
      await req.payload.update({
        collection: 'location-sites-submissions' as any,
        id: doc.id,
        data: { ghlSync, ghlError } as any,
        overrideAccess: true,
        req,
      })
    } catch (error) {
      req.payload.logger.error(`Could not save GHL result on submission ${doc.id}: ${error}`)
    }
  }

  try {
    const globals: any = await req.payload.findGlobal({
      slug: 'location-sites-globals',
      depth: 0,
      overrideAccess: true,
      req,
    } as any)
    const settings = globals?.allSites ?? {}
    const tenantId =
      typeof settings.ghlTenant === 'object' ? settings.ghlTenant?.id : settings.ghlTenant
    if (!tenantId) throw new Error('Choose "Use GHL connection from" in Globals → All Sites')

    const keys = await req.payload.find({
      collection: 'api-keys' as any,
      where: { tenant: { equals: tenantId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const config: any = keys.docs[0]
    const locationId = config?.crmWebhookURL
    const apiKey = config?.crmAPIKey
    if (!locationId || !apiKey) {
      throw new Error("The chosen tenant's API Keys record has no GHL location ID or token")
    }

    // The site's own tag: its GHL Tag field, or "Location Sites - <Location>"
    let siteTag = doc.locationName ? `Location Sites - ${doc.locationName}` : ''
    if (doc.service && doc.domain && doc.domain !== '(preview)') {
      const site = await req.payload.find({
        collection: `location-sites-${doc.service}` as any,
        where: { domain: { equals: doc.domain } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      siteTag = ((site.docs[0] as any)?.tracking?.ghlTag || siteTag).trim()
    }

    const tags = [
      ...(settings.ghlTags ?? []).map((t: any) => (t?.tag ?? '').trim()),
      siteTag,
    ].filter(Boolean)

    const upsert = await ghlRequest('/contacts/upsert', 'POST', apiKey, {
      locationId,
      phone: normalisePhone(doc.phone ?? ''),
      postalCode: doc.postcode || undefined,
      country: 'GB',
      source: `Location Sites — ${doc.domain || doc.brandName || 'unknown'}`,
    })
    const contactId = upsert.contact?.id
    if (!contactId) throw new Error('GHL returned no contact ID')

    if (tags.length) {
      await ghlRequest(`/contacts/${contactId}/tags`, 'POST', apiKey, { tags })
    }

    const { pipelineId, stageId } = await findPipelineStage(
      locationId,
      apiKey,
      settings.ghlPipeline || 'Inbound Callout Bookings',
      settings.ghlStage || 'New Lead',
    )

    const trade = TRADE_LABELS[doc.service] ?? doc.service ?? 'Lead'
    await ghlRequest('/opportunities/', 'POST', apiKey, {
      locationId,
      name: `${doc.postcode || 'No postcode'} – ${trade}`,
      pipelineId,
      pipelineStageId: stageId,
      contactId,
      status: 'open',
      source: doc.domain || undefined,
    })

    await setResult('sent')
  } catch (error: any) {
    req.payload.logger.error(`Location Sites lead ${doc.id} not sent to GHL: ${error?.message}`)
    await setResult('failed', error?.message ?? String(error))
  }

  return doc
}
