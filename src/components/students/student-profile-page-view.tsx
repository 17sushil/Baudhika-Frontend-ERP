"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Printer,
  Edit3,
  Phone,
  Mail,
  MapPin,
  FileText,
  HeartPulse,
  GraduationCap,
  Banknote,
  CalendarCheck2,
  ShieldCheck,
  Building2,
  History,
  Upload,
  Download,
  ReceiptText,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getStudent,
  getStudentHealth,
  getStudentStatusHistory,
} from "@/lib/api/school";
import { useHasPermission } from "@/store/session-store";
import { StudentIdCardModal } from "./student-id-card-modal";
import { cn } from "cn";

interface StudentProfilePageViewProps {
  studentId: string;
  onBack: () => void;
  /** Where the "Student directory" crumb and the back button belong. */
  directoryHref: string;
}

type TabType =
  | "personal"
  | "academic"
  | "documents"
  | "health"
  | "fees"
  | "attendance"
  | "history";

const TABS: { id: TabType; label: string }[] = [
  { id: "personal", label: "Personal Info" },
  { id: "academic", label: "Academic" },
  { id: "documents", label: "Documents" },
  { id: "health", label: "Health" },
  { id: "fees", label: "Fees & Dues" },
  { id: "attendance", label: "Attendance" },
  { id: "history", label: "Status history" },
];

/** Honest placeholder for modules that have no backend anywhere yet. */
function PendingModule({
  icon: Icon,
  module,
  detail,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  module: string;
  detail: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#DDE5F0] bg-white p-10 text-center shadow-2xs">
      <Icon className="mx-auto h-8 w-8 text-slate-300" />
      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        Arrives with the {module} module
      </h3>
      <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">{detail}</p>
      {children && <div className="mt-4 flex items-center justify-center gap-2">{children}</div>}
    </div>
  );
}

function DisabledStub({ label, icon: Icon, reason }: { label: string; icon: React.ComponentType<{ className?: string }>; reason: string }) {
  return (
    <button
      type="button"
      disabled
      title={reason}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-400 shadow-2xs cursor-not-allowed"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-40 shrink-0 text-[13px] font-medium text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800">
        {empty ? <span className="font-normal text-slate-300">—</span> : value}
      </span>
    </div>
  );
}

/**
 * Ritik's profile shell on top of the real GET /students/{id}. Tabs without a
 * backend show honest empty states; health stays permission-gated and every
 * health read is audit-logged server-side.
 */
export function StudentProfilePageView({
  studentId,
  onBack,
  directoryHref,
}: StudentProfilePageViewProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("personal");
  const [idCardOpen, setIdCardOpen] = React.useState(false);
  const canReadHealth = useHasPermission("student.health.read");
  const canReadSensitive = useHasPermission("person.sensitive.read");

  const detail = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudent(studentId),
  });
  const history = useQuery({
    queryKey: ["student-status-history", studentId],
    queryFn: () => getStudentStatusHistory(studentId),
  });
  const health = useQuery({
    queryKey: ["student-health", studentId],
    queryFn: () => getStudentHealth(studentId),
    enabled: canReadHealth,
  });

  // A skeleton in the shape of the record being loaded: the page does not jump
  // when the data lands, and nobody stares at a blank screen.
  if (detail.isLoading) {
    return (
      <div className="space-y-6 pb-16" aria-busy="true" aria-label="Loading student record">
        <div className="h-9 w-52 animate-pulse rounded-lg bg-slate-100" />
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="h-28 w-28 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-64 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }
  if (detail.error || !detail.data) {
    const reason =
      detail.error instanceof Error && detail.error.message
        ? detail.error.message
        : "The record could not be fetched.";
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[#DDE5F0] bg-white p-8 text-center shadow-2xs">
        <AlertCircle className="mx-auto h-8 w-8 text-[#D64545]" />
        <h2 className="mt-3 text-base font-semibold text-slate-900">
          We couldn&apos;t load this student
        </h2>
        <p className="mt-1 text-sm text-slate-500">{reason}</p>
        <p className="mt-1 text-xs text-slate-400">
          The record may have been removed, or the connection dropped.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => void detail.refetch()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-2 text-sm font-medium text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1C5BB0]"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-[#DDE5F0] bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Back to directory
          </button>
        </div>
      </div>
    );
  }

  const student = detail.data;
  const person = student.person;
  const primaryGuardian = student.guardians.find((g) => g.isPrimary) ?? student.guardians[0];
  const primaryAddress = person.addresses[0];

  const STATUS_BADGE: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    applicant: "bg-sky-50 text-sky-700 border-sky-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
    dropped: "bg-rose-50 text-rose-700 border-rose-200",
    transferred_out: "bg-slate-100 text-slate-700 border-slate-200",
    alumni: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE5F0] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to directory</span>
          </button>
          <span className="text-slate-300">/</span>
          <Link
            href={directoryHref}
            className="rounded text-[13px] text-slate-500 transition-colors hover:text-[#2570D3] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2570D3]"
          >
            Student directory
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-[#2570D3]">
            {person.displayName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIdCardOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-[#2570D3]" />
            <span>Print ID card</span>
          </button>
          <button
            type="button"
            disabled
            title="Editing will arrive in a future update"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-300 px-3.5 py-1.5 text-xs font-medium text-white cursor-not-allowed"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit record</span>
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 shadow-xs text-slate-700 text-3xl font-bold">
            {person.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {person.displayName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-semibold",
                    STATUS_BADGE[student.status]
                  )}
                >
                  {student.status.replace("_", " ")}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-slate-700">
                  {student.admissionNo}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
                  {student.admissionType.replace("_", " ")}
                </span>
                {student.campus && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
                    <Building2 className="h-3 w-3" />
                    {student.campus.name}
                  </span>
                )}
                {student.emisId && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-slate-600">
                    EMIS {student.emisId}
                  </span>
                )}
                {student.hasSpecialNeeds && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                    special needs
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Admitted on" value={student.admissionDate} />
              <Row
                label="Guardian"
                value={
                  primaryGuardian
                    ? `${primaryGuardian.displayName} (${primaryGuardian.relation})`
                    : "No guardian linked yet"
                }
              />
              <Row label="Emergency phone" value={primaryGuardian?.primaryPhone ?? "—"} />
            </div>
          </div>
        </div>
      </div>

      {/* Pill Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2.5 transition-all duration-200 cursor-pointer whitespace-nowrap",
              activeTab === tab.id
                ? "bg-[#2570D3] text-white shadow-xs font-semibold"
                : "bg-white border border-[#DDE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PERSONAL */}
      {activeTab === "personal" && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Personal Info
            </h3>
            <div className="space-y-3 text-sm">
              <Row label="Gender" value={person.gender} />
              <Row label="Date of birth" value={person.dob} />
              <Row label="Blood group" value={person.bloodGroup} />
              <Row label="Birth place" value={person.birthPlace} />
              <Row label="Mother tongue" value={person.motherTongue} />
              <Row label="Nationality" value={person.nationality} />
              {canReadSensitive && (
                <>
                  <Row label="National ID" value={person.nationalId} />
                  <Row label="Religion" value={person.religion} />
                  <Row label="Ethnicity" value={person.ethnicity} />
                </>
              )}
              {!canReadSensitive && (
                <p className="text-xs text-slate-400">
                  National ID, religion and ethnicity need the person.sensitive.read permission.
                </p>
              )}
              <Row
                label="Address"
                value={
                  primaryAddress
                    ? [primaryAddress.line1, primaryAddress.ward, primaryAddress.municipality, primaryAddress.district]
                        .filter(Boolean)
                        .join(", ")
                    : null
                }
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-semibold text-[13px] text-slate-700 mb-2">Contacts</h4>
              {person.contacts.length === 0 ? (
                <p className="text-xs text-slate-400">No contacts recorded.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {person.contacts.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 text-slate-700">
                      {c.type === "email" ? (
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span className="font-medium">{c.value}</span>
                      <span className="text-slate-400">({c.type})</span>
                      {c.isPrimary && (
                        <span className="rounded-full bg-[#2570D3]/10 px-1.5 text-[11px] font-semibold text-[#2570D3]">
                          primary
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Guardians
              </h3>
              {student.guardians.length === 0 ? (
                <p className="pt-3 text-xs text-slate-400">
                  No guardians linked yet. You will be able to link parents and
                  guardians from this page in a future update.
                </p>
              ) : (
                <ul className="pt-3 space-y-3 text-sm">
                  {student.guardians.map((g) => (
                    <li key={g.guardianId} className="rounded-xl border border-slate-100 p-3">
                      <p className="font-semibold text-slate-900">
                        {g.displayName}{" "}
                        <span className="font-normal text-slate-500">({g.relation})</span>
                      </p>
                      <p className="text-slate-600 font-mono text-xs">{g.primaryPhone ?? "no phone"}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[11px]">
                        {g.isPrimary && <span className="rounded-full bg-[#2570D3]/10 px-1.5 py-0.5 font-semibold text-[#2570D3]">primary</span>}
                        {g.isEmergencyContact && <span className="rounded-full bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-700">emergency</span>}
                        {g.canPickup && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-600">pickup</span>}
                        {g.canPayFees && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-600">pay fees</span>}
                        {g.hasCustody && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-600">custody</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Addresses
              </h3>
              {person.addresses.length === 0 ? (
                <p className="pt-3 text-xs text-slate-400">No address recorded.</p>
              ) : (
                <ul className="pt-3 space-y-2 text-sm text-slate-700">
                  {person.addresses.map((a) => (
                    <li key={a.id} className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                      <span>
                        <span className="font-semibold">({a.type})</span>{" "}
                        {[a.line1, a.line2, a.ward, a.municipality, a.district, a.province, a.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Admission record: everything the student row itself stores, so a
            profile never hides a field that was captured at admission. */}
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
          <h3 className="flex items-center gap-2 font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
            <GraduationCap className="h-4 w-4 text-[#2570D3]" />
            Admission record
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <Row label="Admission number" value={student.admissionNo} />
            <Row label="Admission date" value={student.admissionDate} />
            <Row label="Admission type" value={student.admissionType.replace("_", " ")} />
            <Row label="Status" value={student.status.replace("_", " ")} />
            <Row label="Campus" value={student.campus ? `${student.campus.name} (${student.campus.code})` : null} />
            <Row label="EMIS id" value={student.emisId} />
            <Row label="Previous school" value={student.previousSchoolName} />
            <Row label="Previous class" value={student.previousSchoolClass} />
            <Row label="Transfer certificate" value={student.previousTcNo} />
            <Row label="Special needs" value={student.hasSpecialNeeds ? "Yes" : "No"} />
            <Row label="Leaving date" value={student.leavingDate} />
            <Row label="Leaving reason" value={student.leavingReason} />
            <Row label="TC issued no" value={student.tcIssuedNo} />
            <Row label="Record created" value={new Date(student.createdAt).toLocaleString()} />
            <Row label="Last updated" value={new Date(student.updatedAt).toLocaleString()} />
            <div className="sm:col-span-2">
              <Row label="Remarks" value={student.remarks} />
            </div>
          </div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
            These are the admission fields the server stores. Anything showing a
            dash was left empty when the student was created - it was never
            collected, not lost.
          </p>
        </div>
        </>
      )}

      {/* ACADEMIC */}
      {activeTab === "academic" && (
        <PendingModule
          icon={GraduationCap}
          module="academics"
          detail="Grades, sections, roll numbers and results have no backend or API contract yet. Nothing here will be invented."
        >
          <DisabledStub label="Marksheet PDF" icon={Download} reason="Waiting on the academics module" />
        </PendingModule>
      )}

      {/* DOCUMENTS */}
      {activeTab === "documents" && (
        <PendingModule
          icon={FileText}
          module="files"
          detail="Document upload and verification need a storage backend. The contract only reserves person.photoFileId for now."
        >
          <DisabledStub label="Upload document" icon={Upload} reason="Waiting on the files module" />
        </PendingModule>
      )}

      {/* HEALTH */}
      {activeTab === "health" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
          <h3 className="flex items-center gap-2 font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
            <HeartPulse className="h-4 w-4 text-[#2570D3]" />
            Health record
          </h3>
          {!canReadHealth ? (
            <p className="flex items-center gap-2 pt-4 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              Needs student.health.read. Every read of this panel is written to the audit log.
            </p>
          ) : health.isLoading ? (
            <p className="pt-4 text-sm text-slate-400">Loading health record...</p>
          ) : health.error ? (
            <p className="pt-4 text-sm text-[#D64545]">Could not load the health record.</p>
          ) : (
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {(
                [
                  ["Allergies", health.data?.allergies],
                  ["Medical conditions", health.data?.medicalConditions],
                  ["Medications", health.data?.medications],
                  ["Disability", health.data?.disabilityType],
                  ["Doctor", health.data?.doctorName],
                  ["Doctor phone", health.data?.doctorPhone],
                  ["Insurance no", health.data?.insuranceNo],
                  ["Emergency instructions", health.data?.emergencyInstructions],
                ] as [string, string | null][]
              ).map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
              <p className="sm:col-span-2 pt-2 text-xs text-slate-400">
                {health.data?.updatedAt
                  ? `Last updated ${new Date(health.data.updatedAt).toLocaleString()} by ${
                      health.data.updatedBy ? `${health.data.updatedBy.slice(0, 8)}…` : "system"
                    }.`
                  : "No health record saved yet - these fields are empty, not missing."}{" "}
                Opening this panel wrote an audit row.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FEES */}
      {activeTab === "fees" && (
        <PendingModule
          icon={Banknote}
          module="fees"
          detail="Fee ledgers, dues and receipts live in the finance module, which has no backend yet."
        >
          <DisabledStub label="Collect fee" icon={ReceiptText} reason="Waiting on the fees module" />
        </PendingModule>
      )}

      {/* ATTENDANCE */}
      {activeTab === "attendance" && (
        <PendingModule
          icon={CalendarCheck2}
          module="attendance"
          detail="Daily attendance and percentage summaries arrive with the attendance module."
        />
      )}

      {/* STATUS HISTORY */}
      {activeTab === "history" && (
        <div className="rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xs">
          <h3 className="flex items-center gap-2 font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
            <History className="h-4 w-4 text-[#2570D3]" />
            Status history
          </h3>
          {history.isLoading ? (
            <p className="pt-4 text-sm text-slate-400">Loading timeline...</p>
          ) : (history.data?.length ?? 0) === 0 ? (
            <p className="pt-4 text-sm text-slate-400">No status changes recorded.</p>
          ) : (
            <ol className="pt-4 space-y-3 text-sm">
              {history.data?.map((entry) => (
                <li key={entry.id} className="flex items-baseline gap-3">
                  <span className="w-36 shrink-0 font-mono text-xs text-slate-400">
                    {new Date(entry.changedAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {entry.fromStatus ? entry.fromStatus.replace("_", " ") : "—"} →{" "}
                    {entry.toStatus.replace("_", " ")}
                  </span>
                  <span className="text-slate-500" title={entry.changedBy ?? "system"}>
                    by {entry.changedBy ? `${entry.changedBy.slice(0, 8)}…` : "system"}
                  </span>
                  {entry.reason && <span className="text-slate-400">({entry.reason})</span>}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {idCardOpen && (
        <StudentIdCardModal student={student} onClose={() => setIdCardOpen(false)} />
      )}
    </div>
  );
}
