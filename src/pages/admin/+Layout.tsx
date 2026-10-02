import type { ReactNode } from 'react'
import { AdminAuthProvider } from '../../admin/auth/AdminAuthProvider'
import '../../admin/admin.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="adm-root">{children}</div>
    </AdminAuthProvider>
  )
}
