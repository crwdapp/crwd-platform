import AdminLayout from "@/components/layout/admin-layout"
import EventDetailContent from "@/components/events/event-detail-content"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <EventDetailContent eventId={params.id} />
    </AdminLayout>
  )
}

