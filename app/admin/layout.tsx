import AdminLayout from "./layout/Layout"
import { ReactNode } from "react"
 
export default function AdminSectionLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
} 