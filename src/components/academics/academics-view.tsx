"use client";

import * as React from "react";
import {
  ACADEMIC_YEARS,
  GRADES_LIST,
  SECTIONS_LIST,
  MOCK_CLASS_INFO,
  MOCK_SUBJECT_ALLOCATIONS,
  MOCK_ALL_CLASSES_OVERVIEW,
} from "./academic-mock-data";
import { SubjectAllocation, SubjectCategory } from "./academic-types";
import { ClassTimetableGrid } from "./class-timetable-grid";
import { SyllabusProgressCard } from "./syllabus-progress-card";
import { AssignSubjectModal } from "./assign-subject-modal";
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Search,
  CheckCircle2,
  Filter,
  Layers,
  GraduationCap,
  Users,
  Building,
  School,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

export function AcademicsView() {
  const [academicYear, setAcademicYear] = React.useState("2024 - 2025");
  const [grade, setGrade] = React.useState("Grade 8");
  const [section, setSection] = React.useState("A");
  const [activeTab, setActiveTab] = React.useState<
    "allocation" | "timetable" | "syllabus" | "overview"
  >("allocation");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);

  const classKey = `${grade}-${section}`;
  const classInfo = MOCK_CLASS_INFO[classKey] ?? {
    id: `cls-${grade}-${section}`,
    academicYear,
    grade,
    section,
    classTeacher: { name: "Ms. Neha Sharma", department: "Faculty of Mathematics" },
    assignedRoom: "101 (Main Block)",
    totalStudents: 42,
    capacity: 45,
    totalWeeklyPeriods: 36,
  };

  const [subjectsList, setSubjectsList] = React.useState<SubjectAllocation[]>(
    MOCK_SUBJECT_ALLOCATIONS[classKey] ?? MOCK_SUBJECT_ALLOCATIONS["Grade 8-A"]
  );

  // Update subjects when grade/section changes
  React.useEffect(() => {
    const defaultData =
      MOCK_SUBJECT_ALLOCATIONS[classKey] ?? MOCK_SUBJECT_ALLOCATIONS["Grade 8-A"];
    setSubjectsList(defaultData);
  }, [classKey]);

  const handleAddSubject = (newSubject: SubjectAllocation) => {
    setSubjectsList((prev) => [newSubject, ...prev]);
  };

  const filteredSubjects = subjectsList.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.teacher.name.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q)
    );
  });

  const getCategoryBadge = (category: SubjectCategory) => {
    switch (category) {
      case "core":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "practical":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "elective":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "language":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Page Title & Main Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF3FE] text-[#1E6DEB]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F243E]">
              Academic Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Class sections, teacher allocations, curricula, and weekly timetable
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E6DEB] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1858c2] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Assign subject</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon: Academic Year, Class, Section (Matches Roadmap Concept Screenshot) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
            {/* Academic Year Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden cursor-pointer"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Class
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden cursor-pointer"
              >
                {GRADES_LIST.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden cursor-pointer"
              >
                {SECTIONS_LIST.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats Pill for the Selected Class */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-2 text-xs">
              <span className="text-[10px] text-slate-400 block font-medium">Class Teacher</span>
              <span className="font-bold text-slate-900">{classInfo.classTeacher.name}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-2 text-xs">
              <span className="text-[10px] text-slate-400 block font-medium">Enrolled</span>
              <span className="font-bold text-slate-900">
                {classInfo.totalStudents}/{classInfo.capacity} students
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-2 text-xs">
              <span className="text-[10px] text-slate-400 block font-medium">Room</span>
              <span className="font-bold text-slate-900">{classInfo.assignedRoom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex items-center gap-6 text-xs font-bold" aria-label="Academics sub tabs">
          <button
            type="button"
            onClick={() => setActiveTab("allocation")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "allocation"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Class & Section Allocation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timetable")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "timetable"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Weekly Timetable
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("syllabus")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "syllabus"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Curriculum & Syllabus
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-[#1E6DEB] text-[#1E6DEB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            All Classes & Capacity
          </button>
        </nav>
      </div>

      {/* TAB 1: Class & Section Allocation (The exact table from roadmap_img-001.png) */}
      {activeTab === "allocation" && (
        <div className="space-y-4">
          {/* Card Container for Class & Section matching the reference mockup */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Mockup Title bar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1E6DEB]" />
                <h2 className="text-lg font-bold text-[#0F243E]">
                  Class & Section
                </h2>
                <span className="text-xs text-slate-500 ml-2">
                  ({grade} - Section {section})
                </span>
              </div>

              {/* Search bar inside the card */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject or teacher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-[#1E6DEB] focus:ring-2 focus:ring-[#1E6DEB]/20 outline-hidden"
                />
              </div>
            </div>

            {/* Table matching the roadmap design */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700">
                    <th className="py-3 px-5 font-bold text-xs">Subject</th>
                    <th className="py-3 px-5 font-bold text-xs">Teacher</th>
                    <th className="py-3 px-5 font-bold text-xs">Room</th>
                    <th className="py-3 px-5 font-bold text-xs">Schedule</th>
                    <th className="py-3 px-5 font-bold text-xs">Syllabus Progress</th>
                    <th className="py-3 px-5 font-bold text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No subjects match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* Subject Column */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#12294D] font-bold text-xs">
                              {subject.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-[#1E6DEB] transition-colors">
                                {subject.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[10px] text-slate-400">
                                  {subject.code}
                                </span>
                                <span className="text-[10px] text-slate-300">•</span>
                                <span
                                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold border ${getCategoryBadge(
                                    subject.category
                                  )}`}
                                >
                                  {subject.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Teacher Column */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#12294D] text-white text-[11px] font-bold">
                              {subject.teacher.initials}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {subject.teacher.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {subject.teacher.department}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Room Column */}
                        <td className="py-3.5 px-5">
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-slate-800 font-mono text-xs">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{subject.room}</span>
                          </div>
                        </td>

                        {/* Schedule Column */}
                        <td className="py-3.5 px-5">
                          <div>
                            <p className="font-medium text-slate-800">
                              {subject.scheduleDays}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {subject.timeSlot} ({subject.weeklyPeriods} periods/wk)
                            </p>
                          </div>
                        </td>

                        {/* Syllabus Progress Bar */}
                        <td className="py-3.5 px-5 w-44">
                          <div>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-semibold text-slate-700">
                                {subject.syllabusProgress}%
                              </span>
                              <span className="text-slate-400 font-mono">
                                {subject.completedChapters}/{subject.totalChapters} ch
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#1E6DEB]"
                                style={{ width: `${subject.syllabusProgress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setActiveTab("syllabus")}
                              className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              Syllabus
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab("timetable")}
                              className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-[#1E6DEB] hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              Timetable
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <span className="font-bold text-slate-800">{filteredSubjects.length}</span> subjects allocated to {grade} - Section {section}
              </div>
              <div className="text-slate-400">
                Total weekly load: {filteredSubjects.reduce((acc, curr) => acc + curr.weeklyPeriods, 0)} periods
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Weekly Timetable */}
      {activeTab === "timetable" && (
        <ClassTimetableGrid
          grade={grade}
          section={section}
          academicYear={academicYear}
        />
      )}

      {/* TAB 3: Curriculum & Syllabus */}
      {activeTab === "syllabus" && (
        <SyllabusProgressCard grade={grade} section={section} />
      )}

      {/* TAB 4: All Classes Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_ALL_CLASSES_OVERVIEW.map((c) => (
              <div
                key={c.grade}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#1E6DEB]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-xs text-[#0F243E]">
                      {c.grade.replace("Grade ", "G")}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0F243E]">{c.grade}</h4>
                      <p className="text-[11px] text-slate-400">
                        {c.sections.length} Sections ({c.sections.join(", ")})
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {c.attendanceToday}% Present
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Class Teacher</span>
                    <span className="font-medium text-slate-800">{c.classTeacher}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Students</span>
                    <span className="font-bold text-slate-900">{c.totalStudents}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {c.room}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setGrade(c.grade);
                      setSection("A");
                      setActiveTab("allocation");
                    }}
                    className="text-xs font-semibold text-[#1E6DEB] hover:underline cursor-pointer"
                  >
                    View Section A →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for adding a new subject allocation */}
      <AssignSubjectModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        grade={grade}
        section={section}
        academicYear={academicYear}
        onAddSubject={handleAddSubject}
      />
    </div>
  );
}
