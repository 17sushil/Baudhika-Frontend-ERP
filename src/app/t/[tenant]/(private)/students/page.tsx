"use client";

import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddStudentForm } from "@/components/students/add-student-form";
import { StudentsTable } from "@/components/students/students-table";
import { useHasPermission } from "@/store/session-store";
import { useTenant } from "@/providers/tenant-provider";

/**
 * School-plane students, backed by the REAL /students API. The previous
 * version rendered bundled mock data with filters (grade, section, fee
 * status) that do not exist server-side; those were removed rather than
 * faked. Profiles moved to a real dynamic route: /students/[studentId].
 */
export default function TenantStudentsPage() {
  const { tenant } = useTenant();
  const canRead = useHasPermission("student.read");
  const canCreate = useHasPermission("student.create");

  const [adding, setAdding] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!canRead) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-6 text-center">
          <Users className="mx-auto size-6 text-muted-foreground" />
          <h1 className="mt-3 text-[20px] font-semibold">Students are not visible to you</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            This screen needs the <code>student.read</code> permission.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Students</h1>
          <p className="text-[13px] text-muted-foreground">
            Live records for {tenant.name}. New admissions start as
            {" "}<code>applicant</code>; activation happens after a primary
            guardian is linked.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setAdding((a) => !a)} className="h-10 gap-2 rounded-xl">
            <UserPlus className="size-4" /> Admit student
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-5 max-w-2xl rounded-[calc(var(--radius)*2.2)] border border-border/80 bg-card/80 p-5">
          <AddStudentForm
            onCreated={() => {
              setAdding(false);
              setRefreshKey((k) => k + 1);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <StudentsTable key={refreshKey} slug={tenant.slug} />
    </main>
  );
}
