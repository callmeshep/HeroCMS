import type { CollectionAfterChangeHook } from 'payload'

export const triggerDeployHook: CollectionAfterChangeHook = async ({ doc, req }) => {
  console.log(
    '[DeployHook] fired, collection doc id:',
    doc.id,
    'tenant:',
    JSON.stringify(doc.tenant),
  )
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

    if (!config?.cloudflareDeployHook) return doc

    await fetch(config.cloudflareDeployHook, { method: 'POST' })
  } catch (err) {
    console.error('Deploy hook error:', err)
  }

  return doc
}
