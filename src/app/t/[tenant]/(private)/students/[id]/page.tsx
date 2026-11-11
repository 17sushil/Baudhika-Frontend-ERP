import { StudentDetailRouteView } from "@/components/students/student-detail-route-view";

interface PageProps {
  params: Promise<{ tenant: string; id: string }>;
}

export default async function TenantStudentDetailPage({ params }: PageProps) {
  const { tenant, id } = await params;
  return <StudentDetailRouteView studentId={id} backHref={`/t/${tenant}/students`} />;
}
