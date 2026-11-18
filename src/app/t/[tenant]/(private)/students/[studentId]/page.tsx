"use client";

import { useParams, useRouter } from "next/navigation";
import { StudentProfilePageView } from "@/components/students/student-profile-page-view";

/**
 * A student profile is a URL, not drawer state: back/forward, refresh and
 * shared links all behave. The view itself is Ritik's design, rewired to
 * GET /students/{id} (+ status history, + permission-gated health).
 */
export default function TenantStudentProfilePage() {
  const params = useParams<{ studentId: string }>();
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 md:p-8">
      <StudentProfilePageView
        studentId={params.studentId}
        onBack={() => router.back()}
      />
    </main>
  );
}
