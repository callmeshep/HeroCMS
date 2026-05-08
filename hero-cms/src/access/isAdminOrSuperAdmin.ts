import type { Access } from 'payload'

export const isAdminOrSuperAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin'
}
