"use client";

import * as React from "react";
import { X, ArrowRight, ArrowLeft, UserPlus, ShieldAlert } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createStudent, listCampuses } from "@/lib/api/school";
import type { AdmissionType } from "@/lib/api/types";
import { toast } from "sonner";
import { cn } from "cn";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onStudentCreated: () => void;
}

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

/**
 * Ritik's multi-step admit wizard, rewired to POST /students. Steps map to
 * what the contract actually accepts: person, enrolment, contacts/address.
 * The guardian step became an honest note - guardian linking is a separate
 * endpoint that does not exist yet, and students start as applicants.
 */
export function AddStudentModal({ open, onClose, onStudentCreated }: AddStudentModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  // Step 1: person
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");
  const [dob, setDob] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");

  // Step 2: enrolment
  const [campusId, setCampusId] = React.useState("");
  const [admissionDate, setAdmissionDate] = React.useState("");
  const [admissionType, setAdmissionType] = React.useState<AdmissionType>("new");
  const [emisId, setEmisId] = React.useState("");
  const [hasSpecialNeeds, setHasSpecialNeeds] = React.useState(false);
  const [previousSchoolName, setPreviousSchoolName] = React.useState("");
  const [previousTcNo, setPreviousTcNo] = React.useState("");

  // Step 3: contacts & address
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [line1, setLine1] = React.useState("");
  const [ward, setWard] = React.useState("");
  const [municipality, setMunicipality] = React.useState("");
  const [district, setDistrict] = React.useState("");

  const campuses = useQuery({ queryKey: ["campuses"], queryFn: listCampuses, retry: false });

  /**
   * Put every field back to its first-day state. The modal closes on success,
   * but this component stays mounted with open={false}, so without this the
   * next admitted student would start with the previous child's details.
   */
  const resetForm = React.useCallback(() => {
    setCurrentStep(1);
    setFirstName("");
    setLastName("");
    setGender("male");
    setDob("");
    setBloodGroup("");
    setCampusId("");
    setAdmissionDate("");
    setAdmissionType("new");
    setEmisId("");
    setHasSpecialNeeds(false);
    setPreviousSchoolName("");
    setPreviousTcNo("");
    setPhone("");
    setEmail("");
    setLine1("");
    setWard("");
    setMunicipality("");
    setDistrict("");
  }, []);

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: (created) => {
      toast.success(`${created.person.displayName} admitted as ${created.admissionNo} (applicant).`);
      onStudentCreated();
      resetForm();
      onClose();
    },
    onError: (error: Error) => toast.error(error.message || "Admission failed - check the fields."),
  });

  if (!open) return null;

  const validateStep = (step: number): boolean => {
    if (step === 1 && !firstName.trim()) {
      toast.error("Step 1 - first name is required.");
      return false;
    }
    if (step === 2) {
      if (!admissionDate) {
        toast.error("Step 2 - admission date is required.");
        return false;
      }
      if (emisId && !/^[0-9A-Za-z-]{1,30}$/.test(emisId)) {
        toast.error("Step 2 - EMIS id: max 30 characters of letters, digits and dashes.");
        return false;
      }
      if (admissionType === "transfer_in" && (!previousSchoolName.trim() || !previousTcNo.trim())) {
        toast.error("Step 2 - transfer-in needs the previous school name and TC number.");
        return false;
      }
    }
    if (step === 3) {
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Step 3 - that email does not look valid.");
        return false;
      }
      if (phone && !/^\+?\d{7,15}$/.test(phone)) {
        toast.error("Step 3 - phone: 7-15 digits, optional leading +.");
        return false;
      }
    }
    return true;
  };

  /**
   * Jumping between steps by clicking the numbered chips.
   * Backwards is always free - you are allowed to correct anything you typed.
   * Forwards has to pass the same checks the "Next step" button runs, one step
   * at a time, so nobody can click straight to Confirm with an empty name.
   */
  const goToStep = (target: number) => {
    if (target === currentStep || createMutation.isPending) return;
    if (target < currentStep) {
      setCurrentStep(target);
      return;
    }
    for (let step = currentStep; step < target; step += 1) {
      if (!validateStep(step)) return;
    }
    setCurrentStep(target);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      return;
    }
    createMutation.mutate({
      person: {
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
        gender,
        dob: dob || null,
        bloodGroup: bloodGroup || null,
        ...(phone || email
          ? {
              contacts: [
                ...(phone ? [{ type: "phone", value: phone, isPrimary: true }] : []),
                ...(email ? [{ type: "email", value: email, isPrimary: !phone }] : []),
              ],
            }
          : {}),
        ...(line1 || ward || municipality || district
          ? {
              addresses: [
                {
                  type: "postal",
                  line1: line1 || null,
                  ward: ward || null,
                  municipality: municipality || null,
                  district: district || null,
                  country: "NP",
                },
              ],
            }
          : {}),
      },
      ...(campusId ? { campusId } : {}),
      admissionDate,
      admissionType,
      ...(emisId ? { emisId } : {}),
      hasSpecialNeeds,
      ...(admissionType === "transfer_in"
        ? { previousSchoolName: previousSchoolName.trim(), previousTcNo: previousTcNo.trim() }
        : {}),
    });
  };

  const STEPS = [
    { num: 1, title: "Personal" },
    { num: 2, title: "Admission" },
    { num: 3, title: "Contact & Address" },
    { num: 4, title: "Confirm" },
  ];

  const label = "block text-[13px] font-medium text-slate-700 mb-1";
  const input = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-[#2570D3]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#DDE5F0] bg-white p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#2570D3]" />
            <h3 className="font-semibold text-base text-slate-900">Admit a new student</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator - every chip is clickable (keyboard included) */}
        <div className="flex items-center gap-2 py-4">
          {STEPS.map((step, i) => {
            const isCurrent = currentStep === step.num;
            const isDone = currentStep > step.num;
            return (
              <React.Fragment key={step.num}>
                <button
                  type="button"
                  onClick={() => goToStep(step.num)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${step.num}: ${step.title}`}
                  title={
                    isCurrent
                      ? `You are on step ${step.num}`
                      : `Go to step ${step.num}: ${step.title}`
                  }
                  className={cn(
                    "relative overflow-hidden flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer",
                    "before:absolute before:inset-0 before:-translate-x-full before:bg-white/25 before:transition-transform before:duration-500 hover:before:translate-x-full",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2570D3]",
                    isCurrent
                      ? "bg-[#2570D3] text-white shadow-xs cursor-default"
                      : isDone
                        ? "bg-emerald-50 text-emerald-700 hover:-translate-y-0.5 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:-translate-y-0.5 hover:bg-slate-200 hover:text-slate-700"
                  )}
                >
                  {step.num}. {step.title}
                </button>
                {i < STEPS.length - 1 && <div className="h-px flex-1 bg-slate-200" />}
              </React.Fragment>
            );
          })}
        </div>

        <form onSubmit={handleNext} className="mt-2 space-y-4 text-sm">
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>First name *</label>
                <input className={input} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Aarav" />
              </div>
              <div>
                <label className={label}>Last name</label>
                <input className={input} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Sharma" />
              </div>
              <div>
                <label className={label}>Gender</label>
                <select className={input} value={gender} onChange={(e) => setGender(e.target.value as typeof gender)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={label}>Date of birth</label>
                <input type="date" className={input} value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={label}>Blood group</label>
                <select className={input} value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  <option value="">Not recorded</option>
                  {BLOOD_GROUPS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Campus</label>
                <select className={input} value={campusId} onChange={(e) => setCampusId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {campuses.data?.items.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Admission date *</label>
                <input type="date" className={input} value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} />
              </div>
              <div>
                <label className={label}>Admission type</label>
                <select className={input} value={admissionType} onChange={(e) => setAdmissionType(e.target.value as AdmissionType)}>
                  <option value="new">New</option>
                  <option value="transfer_in">Transfer in</option>
                  <option value="readmission">Readmission</option>
                </select>
              </div>
              <div>
                <label className={label}>EMIS id (optional)</label>
                <input className={input} value={emisId} onChange={(e) => setEmisId(e.target.value)} placeholder="Government id, if issued" />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  id="special-needs"
                  type="checkbox"
                  checked={hasSpecialNeeds}
                  onChange={(e) => setHasSpecialNeeds(e.target.checked)}
                  className="rounded border-slate-300 text-[#2570D3]"
                />
                <label htmlFor="special-needs" className="text-slate-700">
                  This student has special needs
                </label>
              </div>
              {admissionType === "transfer_in" && (
                <>
                  <div>
                    <label className={label}>Previous school *</label>
                    <input className={input} value={previousSchoolName} onChange={(e) => setPreviousSchoolName(e.target.value)} />
                  </div>
                  <div>
                    <label className={label}>Previous TC number *</label>
                    <input className={input} value={previousTcNo} onChange={(e) => setPreviousTcNo(e.target.value)} />
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Guardian / contact phone</label>
                <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 98..." />
              </div>
              <div>
                <label className={label}>Contact email</label>
                <input className={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@example.com" />
              </div>
              <div className="col-span-2">
                <label className={label}>Street / Tole</label>
                <input className={input} value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="e.g. Minbhawan Marga" />
              </div>
              <div>
                <label className={label}>Ward</label>
                <input className={input} value={ward} onChange={(e) => setWard(e.target.value)} />
              </div>
              <div>
                <label className={label}>Municipality</label>
                <input className={input} value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={label}>District</label>
                <input className={input} value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
              <p className="col-span-2 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Parents and guardians are linked to the student after admission,
                from the student&apos;s profile page. The contacts in this step belong
                to the student only.
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 space-y-3">
              <p className="font-semibold text-slate-900">Please verify the new enrollment:</p>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400">Student:</span>
                  <p className="font-semibold">{firstName} {lastName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Admission:</span>
                  <p className="font-semibold">
                    {admissionDate} • {admissionType.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <p className="font-semibold">{phone || email || "—"}</p>
                </div>
                <div>
                  <span className="text-slate-400">Campus:</span>
                  <p className="font-semibold">
                    {campuses.data?.items.find((c) => c.id === campusId)?.name ?? "Unassigned"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                The server generates the admission number and the record starts as
                &quot;applicant&quot;. Activating a student is a separate status change once
                guardians are linked.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="relative overflow-hidden shadow-xs inline-flex items-center gap-1.5 rounded-lg bg-[#2570D3] px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1C5BB0] before:absolute before:inset-0 before:-translate-x-full before:bg-white/20 before:transition-transform before:duration-500 hover:before:translate-x-full disabled:opacity-50"
              >
                <span>{currentStep === 4 ? (createMutation.isPending ? "Admitting..." : "Confirm & enroll") : "Next step"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
