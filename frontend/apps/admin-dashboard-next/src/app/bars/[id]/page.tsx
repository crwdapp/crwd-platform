"use client"

import AdminLayout from "@/components/layout/admin-layout"
import BarDetailContent from "@/components/bars/bar-detail-content"

export default function BarDetailPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <BarDetailContent barId={params.id} />
    </AdminLayout>
  )
}
