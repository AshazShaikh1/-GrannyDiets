import { requireAdmin } from '@/features/auth/utils/auth'
import { AdminLayout } from '@/features/admin/layout/admin-layout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect all /admin routes
  await requireAdmin()

  return <AdminLayout>{children}</AdminLayout>
}
