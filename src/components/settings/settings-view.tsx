"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Settings,
  Building,
  School,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Database,
  CheckCircle2,
  Save,
  RotateCcw,
  Sliders,
  Bell,
  Lock,
} from "lucide-react";

function SettingsInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") || "institution";
  const activeTab: "institution" | "academic" | "grading" | "integrations" | "security" =
    ["institution", "academic", "grading", "integrations", "security"].includes(rawTab)
      ? (rawTab as any)
      : "institution";

  // Form states
  const [schoolName, setSchoolName] = React.useState("Sunrise Secondary English Boarding School");
  const [affiliationCode, setAffiliationCode] = React.useState("NEB-AFF-88421");
  const [contactEmail, setContactEmail] = React.useState("administration@sunrise.edu.np");
  const [contactPhone, setContactPhone] = React.useState("+977 1 4482910");
  const [schoolAddress, setSchoolAddress] = React.useState("Shantinagar, Ward 31, Kathmandu Metropolitan");
  const [currentSession, setCurrentSession] = React.useState("2024 - 2025");
  const [periodDuration, setPeriodDuration] = React.useState(45);
  const [minAttendancePct, setMinAttendancePct] = React.useState(75);
  const [passMarksPct, setPassMarksPct] = React.useState(40);
  const [smsGatewayActive, setSmsGatewayActive] = React.useState(true);
  const [biometricSyncActive, setBiometricSyncActive] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const updateTab = (newTab: typeof activeTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Institutional configurations saved successfully!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Settings & Configuration
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              School identity, academic session rules, grading policies, payment gateways, and system parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              System Version: 2.4.0 (Stable)
            </span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => updateTab("institution")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "institution"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <School className="w-4 h-4" />
            Institution Profile
          </button>

          <button
            type="button"
            onClick={() => updateTab("academic")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "academic"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sliders className="w-4 h-4" />
            Academic Parameters
          </button>

          <button
            type="button"
            onClick={() => updateTab("grading")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "grading"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Grading Scale
          </button>

          <button
            type="button"
            onClick={() => updateTab("integrations")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "integrations"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Gateways & Terminals
          </button>

          <button
            type="button"
            onClick={() => updateTab("security")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "security"
                ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Backup & Audit
          </button>
        </div>
      </div>

      {/* TAB 1: INSTITUTION PROFILE */}
      {activeTab === "institution" && (
        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              General Institutional Details
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official School Name</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Board / Ministry Affiliation Code</label>
                <input
                  type="text"
                  required
                  value={affiliationCode}
                  onChange={(e) => setAffiliationCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Active Academic Session</label>
                <select
                  value={currentSession}
                  onChange={(e) => setCurrentSession(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="2024 - 2025">2024 - 2025 (Current)</option>
                  <option value="2025 - 2026">2025 - 2026 (Upcoming)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Administrative Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Office Telephone / Hotline</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Physical Address</label>
              <input
                type="text"
                required
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ACADEMIC PARAMETERS */}
      {activeTab === "academic" && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Timetable & Roll Call Policies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Default Period Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={30}
                  max={90}
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Minimum Attendance Threshold (%)
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={minAttendancePct}
                  onChange={(e) => setMinAttendancePct(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
              >
                <Save className="w-4 h-4" />
                Save Parameters
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: GRADING SCALE */}
      {activeTab === "grading" && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden max-w-2xl">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Standard Grading System (Letter Grade & GPA)</h3>
            <span className="text-xs text-blue-600 font-semibold">Nepal Curriculum Standard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-5 py-3">Score Range</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">Grade Point (GPA)</th>
                  <th className="px-5 py-3">Performance Descriptor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { range: "90% - 100%", grade: "A+", gpa: "4.0", desc: "Outstanding" },
                  { range: "80% - 89%", grade: "A", gpa: "3.6", desc: "Excellent" },
                  { range: "70% - 79%", grade: "B+", gpa: "3.2", desc: "Very Good" },
                  { range: "60% - 69%", grade: "B", gpa: "2.8", desc: "Good" },
                  { range: "50% - 59%", grade: "C+", gpa: "2.4", desc: "Satisfactory" },
                  { range: "40% - 49%", grade: "C", gpa: "2.0", desc: "Acceptable" },
                  { range: "Below 40%", grade: "F", gpa: "0.0", desc: "Insufficient (Fail)" },
                ].map((row) => (
                  <tr key={row.grade} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-slate-700">{row.range}</td>
                    <td className="px-5 py-3 font-bold text-slate-900">{row.grade}</td>
                    <td className="px-5 py-3 font-mono font-bold text-blue-600">{row.gpa}</td>
                    <td className="px-5 py-3 text-slate-600">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            External Gateways & Hardware Terminals
          </h3>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">SMS Gateway Integration</div>
                <div className="text-slate-500 text-[11px]">Sparrow SMS API (Provider: Nepal Telecom / Ncell)</div>
              </div>
              <button
                type="button"
                onClick={() => setSmsGatewayActive(!smsGatewayActive)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  smsGatewayActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {smsGatewayActive ? "Connected" : "Disabled"}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Biometric Attendance Terminal</div>
                <div className="text-slate-500 text-[11px]">ZKTeco TCP/IP Sync (IP: 192.168.1.105)</div>
              </div>
              <button
                type="button"
                onClick={() => setBiometricSyncActive(!biometricSyncActive)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  biometricSyncActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                }`}
              >
                {biometricSyncActive ? "Online" : "Offline"}
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Digital Payment Gateway</div>
                <div className="text-slate-500 text-[11px]">eSewa & Khalti Merchant QR Checkout</div>
              </div>
              <span className="px-3 py-1.5 rounded-lg font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & AUDIT */}
      {activeTab === "security" && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Database Backup & System Maintenance
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Automated Daily Cloud Snapshot</div>
                <div className="text-slate-500 text-[11px]">Last successful snapshot: Today at 02:00 AM</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setToastMessage("Manual cloud backup initiated!");
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Backup Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SettingsView() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
          Loading settings...
        </div>
      }
    >
      <SettingsInner />
    </React.Suspense>
  );
}
