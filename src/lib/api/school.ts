import { get } from "./client";
import type { SchoolMe } from "./types";

/**
 * School-plane data calls. The `x-tenant-id` header is attached automatically
 * by the client from the URL, so these need no slug argument.
 */

/** Works even while a password change is pending. */
export function schoolMe() {
  return get<SchoolMe>("/auth/me");
}

/** /users CRUD lands here in Phase 3 - see INTEGRATION.md. */
