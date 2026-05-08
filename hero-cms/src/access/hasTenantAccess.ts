import type { Access } from 'payload'

export const hasTenantAccess =
  (tenantField = 'tenant'): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'super-admin') return true
    if (!user.tenants || user.tenants.length === 0) return false

    const tenantIds = user.tenants.map((t: any) => (typeof t === 'object' ? t.id : t))

    return {
      [tenantField]: {
        in: tenantIds,
      },
    }
  }
