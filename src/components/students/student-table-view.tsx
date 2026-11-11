"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Printer,
  ChevronRight,
  ArrowUpDown,
  Users,
} from "lucide-react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getStudent, listCampuses, listStudents } from "@/lib/api/school";
import type {
  AdmissionType,
  StudentDetail,
  StudentListItem,
  StudentStatus,
} from "@/lib/api/types";
import { useTenant } from "@/providers/tenant-provider";
import { useHasPermission } from "@/store/session-store";
import { AddStudentModal } from "./add-student-modal";
import { StudentIdCardModal } from "./student-id-card-modal";
import { toast } from "sonner";
import { cn } from "cn";

const STATUS_OPTIONS: StudentStatus[] = [
  "applicant",
  "active",
  "alumni",
  "transferred_out",
  "dropped",
  "suspended",
];

const ADMISSION_TYPES: AdmissionType[] = ["new", "transfer_in", "readmission"];

const STATUS_BADGE: Record<StudentStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  applicant: "bg-sky-50 text-sky-700",
  suspended: "bg-rose-50 text-rose-700",
  dropped: "bg-rose-50 text-rose-700",
  transferred_out: "bg-slate-100 text-slate-700",
  alumni: "bg-slate-100 text-slate-700",
};

type SortField = "name" | "admissionNo" | "admissionDate";

/** Declared outside render so React sees a stable component identity. */
function SortHeader({
  field,
  label,
  active,
  onToggle,
}: {
  field: SortField;
  label: string;
  active: boolean;
  onToggle: (f: SortField) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className="inline-flex items-center gap-1 hover:text-slate-900"
      title="Sorts the current page only - the API contract has no server sort"
    >
      <span>{label}</span>
      <ArrowUpDown className={cn("h-3 w-3", active ? "text-[#2570D3]" : "text-slate-400")} />
    </button>
  );
}

/**
 * Ritik's directory design, rewired to the real GET /students API.
 * Filters/search/paging run server-side; sorting runs on the current page
 * only because the contract has no sort parameter (the note says so).
 * Rows are links: the profile is a real route, not inline state.
 */
export function StudentTableView() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const canCreate = useHasPermission("student.create");

  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"" | StudentStatus>("");
  const [admissionType, setAdmissionType] = React.useState<"" | AdmissionType>("");
  const [campusId, setCampusId] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 8;

  const [sortField, setSortField] = React.useState<SortField>("name");
  const [sortAsc, setSortAsc] = React.useState(true);

  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [idCardStudent, setIdCardStudent] = React.useState<StudentDetail | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Debounce typing so every keystroke is not a server round-trip.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const studentsQuery = useQuery({
    queryKey: ["students", { search, status, admissionType, campusId, page, pageSize, refreshKey }],
    queryFn: () =>
      listStudents({
        page,
        limit: pageSize,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(admissionType ? { admissionType } : {}),
        ...(campusId ? { campusId } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  // Campus dropdown; hidden entirely if the role cannot list campuses.
  const campusesQuery = useQuery({
    queryKey: ["campuses"],
    queryFn: listCampuses,
    retry: false,
  });

  const rows = React.useMemo(() => {
    const items = studentsQuery.data?.items ?? [];
    const sorted = [...items].sort((a, b) => {
      const pick = (s: StudentListItem) =>
        sortField === "name"
          ? s.person.displayName.toLowerCase()
          : sortField === "admissionNo"
            ? s.admissionNo.toLowerCase()
            : s.admissionDate;
      const cmp = pick(a) < pick(b) ? -1 : pick(a) > pick(b) ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
    return sorted;
  }, [studentsQuery.data, sortField, sortAsc]);

  const total = studentsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = Boolean(search || status || admissionType || campusId);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc((v) => !v);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const openIdCard = async (id: string) => {
    try {
      const detail = await queryClient.ensureQueryData({
        queryKey: ["student", id],
        queryFn: () => getStudent(id),
      });
      setIdCardStudent(detail);
    } catch {
      toast.error("Could not load the full record for the ID card.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE5F0] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Home</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-[#2570D3]">Student directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Find and manage student enrollments, profiles, guardians, and academic history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Export will arrive in a future update"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE5F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-400 shadow-2xs cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export</span>
          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#1C5BB0] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-[#DDE5F0] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, or exact admission / EMIS number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-[#2570D3] outline-hidden placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as "" | StudentStatus);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>

            <select
              value={admissionType}
              onChange={(e) => {
                setAdmissionType(e.target.value as "" | AdmissionType);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
            >
              <option value="">All admission types</option>
              {ADMISSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>

            {campusesQuery.data && (
              <select
                value={campusId}
                onChange={(e) => {
                  setCampusId(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-hidden"
              >
                <option value="">All campuses</option>
                {campusesQuery.data.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setStatus("");
                  setAdmissionType("");
                  setCampusId("");
                  setPage(1);
                }}
                className="rounded-lg px-2.5 py-1.5 text-xs text-[#2570D3] hover:bg-[#2570D3]/5"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Search matches names (contains) or an exact admission / EMIS number. Grade,
          section and fee filters were removed: no backend stores those fields yet.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#DDE5F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-[#DDE5F0]">
              <tr>
                <th className="py-3 px-3">
                  <SortHeader field="name" label="Student" active={sortField === "name"} onToggle={toggleSort} />
                </th>
                <th className="py-3 px-3">Campus</th>
                <th className="py-3 px-3">
                  <SortHeader field="admissionNo" label="Admission no" active={sortField === "admissionNo"} onToggle={toggleSort} />
                </th>
                <th className="py-3 px-3">
                  <SortHeader field="admissionDate" label="Admitted" active={sortField === "admissionDate"} onToggle={toggleSort} />
                </th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentsQuery.isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading students...
                  </td>
                </tr>
              ) : studentsQuery.error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#D64545]">
                    Could not load students. Check your session and permissions.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                    {hasFilters
                      ? "No students match the current filters."
                      : "No students yet. Admit the first one to see the directory come alive."}
                  </td>
                </tr>
              ) : (
                rows.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition-colors"
                    onMouseEnter={() => {
                      void queryClient.prefetchQuery({
                        queryKey: ["student", student.id],
                        queryFn: () => getStudent(student.id),
                      });
                    }}
                  >
                    <td className="py-3 px-3">
                      <Link
                        href={`/t/${tenant.slug}/students/${student.id}`}
                        className="flex items-center gap-2.5 group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#12294D] text-white text-xs font-semibold">
                          {student.person.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-[#2570D3] transition-colors">
                            {student.person.displayName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {student.person.gender ?? "—"}
                            {student.person.dob ? ` • b. ${student.person.dob}` : ""}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800">{student.campus?.name ?? "—"}</span>
                      <p className="text-[11px] text-slate-400">{student.campus?.code ?? ""}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-800">
                      {student.admissionNo}
                      <p className="text-slate-400">{student.emisId ?? "no EMIS yet"}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800">{student.admissionDate}</span>
                      <p className="text-[11px] text-slate-400">
                        {student.admissionType.replace("_", " ")}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          STATUS_BADGE[student.status]
                        )}
                      >
                        {student.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/t/${tenant.slug}/students/${student.id}`}
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-[#2570D3] font-medium hover:bg-[#2570D3] hover:text-white transition-colors"
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => void openIdCard(student.id)}
                          className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Print identity card"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {total === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(page * pageSize, total)}
            </span>{" "}
            of <span className="font-semibold text-slate-800">{total}</span> students
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1 || studentsQuery.isPlaceholderData}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || studentsQuery.isPlaceholderData}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        Column sorting applies to the current page only - the API contract has no
        server-side sort parameter yet.
      </p>

      <AddStudentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onStudentCreated={() => {
          setRefreshKey((k) => k + 1);
          void queryClient.invalidateQueries({ queryKey: ["students"] });
        }}
      />

      <StudentIdCardModal student={idCardStudent} onClose={() => setIdCardStudent(null)} />
    </div>
  );
}
