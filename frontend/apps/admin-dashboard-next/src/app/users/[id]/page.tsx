import AdminLayout from "@/components/layout/admin-layout"
import UserDetailContent from "@/components/users/user-detail-content"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <UserDetailContent userId={params.id} />
    </AdminLayout>
  )
}

