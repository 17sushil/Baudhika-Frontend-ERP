import { del, get, patch, post } from "./client";
import type {
  CampusRef,
  CreateStudentInput,
  CreateUserInput,
  GrantRoleInput,
  Page,
  SchoolMe,
  StudentDetail,
  StudentHealth,
  StudentListItem,
  StudentListParams,
  StudentStatusEntry,
  User,
  UserListParams,
  UserStatus,
} from "./types";

/**
 * School-plane data calls. The `x-tenant-id` header is attached automatically
 * by the client from the URL, so these need no slug argument.
 */

/** Works even while a password change is pending. */
export function schoolMe() {
  return get<SchoolMe>("/auth/me");
}

/** /users CRUD lands here in Phase 3 - see INTEGRATION.md. */

// --- users -----------------------------------------------------------------
// Permission codes come straight from the API reference; the server enforces
// them on every call, and the UI hides what it cannot do anyway.

/** GET /users - paged, newest first. Needs user.read. */
export function listUsers(params: UserListParams = {}) {
  return get<Page<User>>("/users", { params });
}

/** GET /users/{id}. Needs user.read. */
export function getUser(id: string) {
  return get<User>(`/users/${id}`);
}

/** POST /users - 201. Needs user.create, plus role.assign when roles are sent. */
export function createUser(input: CreateUserInput) {
  return post<User>("/users", input);
}

/**
 * PATCH /users/{id}/status. Needs user.update.
 * Suspending or disabling logs the user out everywhere, immediately.
 */
export function setUserStatus(id: string, status: UserStatus) {
  return patch<User>(`/users/${id}/status`, { status });
}

/**
 * POST /users/{id}/reset-password. Needs user.update.
 * Clears any brute-force lockout and logs the user out everywhere.
 */
export function resetUserPassword(id: string, password: string, mustChangePassword = true) {
  return post<void>(`/users/${id}/reset-password`, { password, mustChangePassword });
}

/** POST /users/{id}/roles. Needs role.assign; you cannot grant what you lack. */
export function assignUserRole(id: string, input: GrantRoleInput) {
  return post<User>(`/users/${id}/roles`, input);
}

/** DELETE /users/{id}/roles/{assignmentId}. The last school-wide principal stays. */
export function removeUserRole(id: string, assignmentId: string) {
  return del<User>(`/users/${id}/roles/${assignmentId}`);
}

// --- campuses & students ---------------------------------------------------

/**
 * GET /campuses - the dropdown source for campus filters and admission.
 * The team endpoint returns a bare array (not a Page) and its query DTO
 * whitelists only isActive/kind, so we send no params and normalise here.
 */
export function listCampuses() {
  return get<CampusRef[] | Page<CampusRef>>("/campuses").then((r) =>
    Array.isArray(r) ? { items: r, total: r.length, page: 1, limit: 100 } : r,
  );
}

/** GET /students - paged; search = name contains or exact admission/EMIS id. */
export function listStudents(params: StudentListParams = {}) {
  return get<Page<StudentListItem>>("/students", { params });
}

/** GET /students/{id} - person, contacts, addresses and guardians in one call. */
export function getStudent(id: string) {
  return get<StudentDetail>(`/students/${id}`);
}

/** GET /students/{id}/status-history - append-only timeline. */
export function getStudentStatusHistory(id: string) {
  return get<StudentStatusEntry[]>(`/students/${id}/status-history`);
}

/** GET /students/{id}/health - sensitive; needs student.health.read; audited. */
export function getStudentHealth(id: string) {
  return get<StudentHealth>(`/students/${id}/health`);
}

/** POST /students - 201; admissionNo generated; starts as applicant. */
export function createStudent(input: CreateStudentInput) {
  return post<StudentDetail>("/students", input);
}
