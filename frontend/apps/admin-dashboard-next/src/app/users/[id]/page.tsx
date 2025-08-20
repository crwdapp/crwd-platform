"use client"

import AdminLayout from "@/components/layout/admin-layout"
import UserDetailContent from "@/components/users/user-detail-content"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return (
    <AdminLayout>
      <UserDetailContent userId={params.id} />
    </AdminLayout>
  )
}

