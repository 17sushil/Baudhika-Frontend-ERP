"use client";

import { useParams } from "next/navigation";
import { StudentProfile } from "@/components/students/student-profile";
import { useTenant } from "@/providers/tenant-provider";

/**
 * Dynamic route: /t/<slug>/students/<studentId>.
 * A URL instead of a drawer, so back/forward, sharing and prefetching behave
 * like the rest of the app. Data comes from GET /students/{id} (cached by
 * react-query; the list page warms this query on row hover).
 */
export default function StudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const { tenant } = useTenant();

  return (
    <main className="min-h-screen p-6 md:p-8">
      <StudentProfile slug={tenant.slug} studentId={params.studentId} />
    </main>
  );
}
