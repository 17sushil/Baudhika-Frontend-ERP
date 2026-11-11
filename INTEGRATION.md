# Frontend ↔ Backend integration

Written against **`School ERP API Reference`, 2 November 2026** and verified against the
`Stage` branch of `BaudhikaERP-BE`.

---

## 1. The shape of it

The backend issues tokens in the JSON body and sets **no cookies** (`main.ts`:
`credentials: false, // bearer tokens only, no cookies`). The requirement was that tokens
be stored in HTTPS-only cookies, set from the server side. Both are satisfied by putting a
thin auth layer in Next:

```
 BROWSER                         NEXT SERVER                       BACKEND
 ───────                         ───────────                       ───────
 POST /api/auth/school/login  ──►  route handler  ──────────────►  POST /auth/login
                                  │  ◄───────────────────────────  { accessToken,
                                  │                                  refreshToken }
                                  │  refreshToken → httpOnly cookie
                                  │  accessToken  → response body
        ◄─────────────────────────┘
   stores accessToken in Zustand (memory)
   calls the backend DIRECTLY from here on:
        GET /auth/me   Authorization: Bearer …   x-tenant-id: sunrise
```

Only the **token-bearing** responses go through Next. Everything else — `/auth/me`,
`/users`, `/tenants` — is called straight from the browser with the access token.

| Credential | Where it lives | Survives reload | Readable by JS |
|---|---|---|---|
| `refreshToken` | httpOnly cookie `erp_rt`, `Path=/api/auth`, `SameSite=Strict`, `Secure` in prod | **yes** (7 days sliding, 30 days absolute) | **no** |
| `accessToken` | Zustand, memory only | no — re-minted on boot | yes (15 min, that is the point of it) |

So a page reload does **not** sign the user out: `restoreSession()` trades the cookie for a
fresh access token. And nothing long-lived is ever reachable from JS, localStorage or
sessionStorage. Zustand is used with **no `persist` middleware**, as required.

`src/store/auth-flow-store.ts` still uses `persist(sessionStorage)`. That is unchanged and
correct: it holds *which step the form is on*, the typed identifier and the OTP challenge id —
no credentials. It dies with the tab.

---

## 2. Files

### New — server (Next route handlers)

| File | Purpose |
|---|---|
| `src/server/backend.ts` | Server-only fetch to erp-backend; unwraps the envelope, throws `BackendError` |
| `src/server/auth-cookies.ts` | Cookie names/options, read/set/clear, `isSameOriginRequest()` |
| `src/server/refresh-guard.ts` | Stops concurrent tabs from killing the session (see §4) |
| `src/server/route-utils.ts` | `errorResponse()`, `parseBody()` |
| `src/app/api/auth/platform/login/route.ts` | step 1, platform |
| `src/app/api/auth/platform/verify-otp/route.ts` | step 2, platform → sets cookies |
| `src/app/api/auth/school/login/route.ts` | both outcomes → sets cookies only when `authenticated` |
| `src/app/api/auth/school/verify-otp/route.ts` | sets cookies |
| `src/app/api/auth/school/change-password/route.ts` | forced change; rotates cookies |
| `src/app/api/auth/token/route.ts` | mint/rotate an access token from the cookie |
| `src/app/api/auth/logout/route.ts` | ends the session, clears cookies, never fails |

### New — client

| File | Purpose |
|---|---|
| `src/lib/api/types.ts` | Wire types transcribed from the API reference |
| `src/lib/api/errors.ts` | `ApiError`, `toApiError()`, `authErrorMessage()` |
| `src/lib/api/client.ts` | axios instance for direct backend calls; interceptors; `mintAccessToken()` |
| `src/lib/api/auth.ts` | All browser-side auth calls, via our own routes |
| `src/lib/api/tenants.ts` | `/tenants`, branding (platform admin) |
| `src/lib/api/school.ts` | `/auth/me` (and `/users` in Phase 3) |
| `src/store/session-store.ts` | Zustand session — **no persist** |
| `src/lib/tenant-slug.ts` | Slug from path *or* subdomain; `schoolPath()`; `isValidSlug()` |
| `src/lib/sign-in.ts` | `completeSignIn()` — loads the user, returns where to redirect |

### Changed

| File | What changed |
|---|---|
| `src/lib/schemas/auth.ts` | Split into `platformLoginSchema` (`email`) / `schoolLoginSchema` (`identifier`), plus `credentialsFormSchema(plane)`, `otpSchema`, `changePasswordSchema` |
| `src/lib/auth.ts` | Mocks removed (`DEMO_OTP`, fake `requestOtp`/`verifyOtp`); constants only |
| `src/store/auth-flow-store.ts` | Now carries `challengeId` + `destination`; `email` renamed `identifier` |
| `src/components/auth/credentials-step.tsx` | Plane-aware, calls the real API, handles both school outcomes |
| `src/components/auth/otp-step.tsx` | Real verification; resend removed (see §5) |
| `src/lib/axios.ts` | Deprecated shim re-exporting `api/client` |
| `src/lib/tenant.ts` | `console.log` and `@ts-ignore` removed, envelope typed |
| `src/components/tenant/tenant-theme-style.tsx` | Type bug fixed (`theme` fields may be `null`) |

---

## 3. Using it

```ts
import { schoolLogin, schoolVerifyOtp, restoreSession, logout } from "@/lib/api/auth";

const outcome = await schoolLogin(slug, identifier, password);
if (outcome.status === "otp_required") showOtpStep(outcome.challengeId, outcome.destination);
// outcome.status === "authenticated" -> tokens already stored, just redirect
```

`completeSignIn()` does the rest: it calls `/auth/me`, fills the store, and returns the path
to redirect to. Both login components use it, so they cannot drift apart.

On app boot, before deciding whether to render a login page:

```ts
const granted = await restoreSession();   // null -> not signed in
```

Permission gating:

```tsx
const canCreate = useHasPermission("user.create");
```

Codes come from `GET /auth/me`, institution-scoped: `user.read`, `user.create`,
`user.update`, `role.read`, `role.assign`, `role.manage`, `person.sensitive.read`,
`guardian.sensitive.read`, `student.health.read`, `document.read`, `document.verify`,
`audit.read`.

---

## 4. Two hazards this code exists to prevent

**Refresh-token reuse kills the session.** `platform-token.service.ts` `rotate()` takes a
`pessimistic_write` lock and, if the presented token was already rotated, calls
`revokeFamily()` — *"assume theft, kill the whole session"*. There is **no grace window**.
Cookies are shared across tabs, so two tabs refreshing at the same instant both present the
same token and the user is logged out everywhere. Hence:

- `src/lib/api/client.ts` — one refresh at a time per tab (`refreshInFlight`).
- `src/server/refresh-guard.ts` — one rotation at a time per server, plus a 10 s window in
  which the same token returns the cached pair.

*Limitation:* the server guard is per-process. Behind several Next instances it needs the
same two maps in Redis.

**Slug handling differs by how you arrived.** `proxy.ts` rewrites
`sunrise.localhost:3000/x` → `/t/sunrise/x`. So on a subdomain you must navigate to `/x`;
navigating to `/t/sunrise/x` would be rewritten again into `/t/sunrise/t/sunrise/x` and 404.
On the root domain it is the reverse. Always use `schoolPath(slug, "/dashboard")`.

---

## 5. Behaviours the backend forces on the UI

| Situation | Backend | What the UI does |
|---|---|---|
| Wrong password / unknown user / **locked account** | `401 Invalid credentials`, identical on purpose | One generic message. Never reveal which |
| 5 wrong passwords | locked 15 min, *even the correct password is refused* | Same message; an admin reset unlocks it |
| Correct password, account suspended/disabled | `403 Account is not active` | Distinct message |
| OTP required, user has no email | `403 Two-step verification needs an email address…` | "Contact your administrator" |
| >10 login attempts/min per IP | `429` + `Retry-After` | Countdown. **Never auto-retry** |
| Reused refresh token | `401`, whole session revoked | Silent redirect to login |
| School token sent to another school | `401` | Silent redirect to login |
| **No resend-OTP endpoint** | a new code requires a new login | "Send a new code" signs in again server-side (password held in the memory-only `pending-credentials-store`, 30 s cooldown). After a reload the password is gone and the screen says go Back |
| `mustChangePassword: true` (school) | only `/auth/me` and `/auth/change-password` work | Redirect to `/t/<slug>/change-password` before anything else |
| `mustChangePassword: true` (platform) | **no platform change-password endpoint exists** | Blocking `<PasswordChangeRequired />` card instead of a 404 |

The "Keep me signed in" checkbox was removed: with the refresh cookie the session already
survives reloads and slides for 7 days, so it controlled nothing. If you want it back, the
honest mapping is `remember=false` → a session cookie (no `maxAge`) and `remember=true` →
7 days; that needs the flag threaded through the OTP step.

---

## 6. Environment

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

`NEXT_PUBLIC_ROOT_DOMAIN` must match the backend's `BASE_DOMAIN`, or slug resolution and CORS
disagree. The backend's `CORS_ORIGINS` must include `http://localhost:3000`.

Dev quirk: school pages need a real subdomain, so use `http://sunrise.localhost:3000`. If your
browser does not resolve `*.localhost`, add `127.0.0.1 sunrise.localhost` to
`C:\Windows\System32\drivers\etc\hosts`.

`secure` on the cookies is `NODE_ENV === "production"` only, so `http://localhost` keeps
working. In production the app must be served over HTTPS — the backend already sends
`Strict-Transport-Security` via helmet.

---

## 7. Still to do

**Phase 2 — DONE, shipped as `fe-auth-phase2`.** `<RequireAuth>` guards both `(private)`
groups, `<SessionBoot>` in the root layout mints an access token from the cookie on every
app load, `/t/<slug>/change-password` handles the forced change, and `<LogoutButton>` sits
in both dashboards. What remains of Phase 2 is only wiring these into your own screens as
you build them.

**Phase 3** — `/users` CRUD screens. **§8, §9 and §10 are missing from the API reference PDF** (it ends at
page 15, mid-§7). They will be transcribed from the backend source:
`POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id/status`,
`POST /users/:id/reset-password`. Ask for the complete document — §10's machine-readable
error codes are worth having.

**Verify before merging:** `npx tsc --noEmit` should report exactly one error,
`Cannot find name 'LayoutProps'` in `src/app/layout.tsx`. That is a Next-generated type that
appears after the first `next dev`; it is present on pristine `Stage` too.

## 8. Next 16 `cacheComponents` note

This repo sets `cacheComponents: true` in `next.config.ts`, which **bans the
`export const dynamic = "force-dynamic"` route-segment config** (build error at
`npm run dev`, invisible to `tsc`). Our auth route handlers therefore carry no
segment config at all: they are all POST-only (never cached), and the `cookies()`
calls inside `src/server/auth-cookies.ts` make them dynamic at runtime anyway.
Do not re-add `dynamic` to any route handler.

## 9. Wire schemas vs form schemas

A route handler must NEVER validate its request body with a FORM schema. The two
deliberately differ:

- the OTP form value is an array of six single-digit strings (one box each), but
  the client joins them and sends `code` as ONE string;
- the change-password form collects `confirmPassword`, which never leaves the
  browser.

Reusing `otpSchema`/`changePasswordSchema` in a handler produced a 400
"Invalid input: expected array, received string" that looked like a backend
failure but was the handler rejecting its own client. Handlers now use
`verifyOtpBodySchema` / `changePasswordBodySchema` from `src/lib/schemas/auth.ts`.

## 10. Where the axios baseURL lives

`src/lib/axios.ts` creates the ONE browser-side axios instance:
`baseURL = NEXT_PUBLIC_API_URL`, request interceptor adds `Authorization` and
`x-tenant-id`, response interceptor unwraps `{ statusCode, message, data }` and
replays a single 401 after refreshing through `/api/auth/token`.
`src/lib/api/client.ts` only adds the `get/post/put/del` verb helpers on top.
Auth never uses this instance - it uses same-origin `fetch` against our own
route handlers, because those are the responses that carry tokens.

## 11. Platform change-password: blocked on the backend

`platform-auth.controller.ts` exposes only login / verify-otp / refresh /
logout. There is no `POST /platform/auth/change-password`, so the platform
forced-change screen cannot be built yet. When the backend adds it (mirror the
tenant `ChangePasswordDto`: `currentPassword`, `newPassword` matching
PASSWORD_POLICY_RE), wire it exactly like the school handler:
new route `src/app/api/auth/platform/change-password/route.ts`, client fn
`platformChangePassword()` in `src/lib/api/auth.ts`, and swap the
`<PasswordChangeRequired />` branch in `require-auth.tsx` for a redirect.

## 13. Users module (first data module on top of auth)

| Endpoint | Client fn (`src/lib/api/school.ts`) | UI |
|---|---|---|
| `GET /users` (page/limit/search/status) | `listUsers` | `components/users/users-table.tsx` |
| `GET /users/{id}` | `getUser` | (available; no screen yet) |
| `POST /users` 201 | `createUser` | `components/users/create-user-form.tsx` |
| `PATCH /users/{id}/status` | `setUserStatus` | row action, `user.update` |
| `POST /users/{id}/reset-password` | `resetUserPassword` | Manage panel, `user.update` |
| `POST /users/{id}/roles` (body field `role`) | `assignUserRole` | Manage panel, `role.assign` |
| `DELETE /users/{id}/roles/{assignmentId}` | `removeUserRole` | role chip ×, `role.assign` |

Route: `/t/<slug>/users`, guarded by the `(private)` layout. Permission codes gate
the controls client-side; the server enforces them regardless. List envelope is
`{ items, total, page, limit }` - the `Page<T>` type in `types.ts` models it for
every future module. `patch` verb helper added to `api/client.ts`.

## 14. Security audit of merged Stage work (c8f5a7c) + hardening

| # | Finding | Severity | Disposition |
|---|---|---|---|
| 1 | `tenant.ts` catch fabricated an **active** tenant for any slug when the backend was unreachable - in production, incl. suspended/unknown schools | Medium | **Fixed**: prod returns null; dev-only fallback |
| 2 | Chat widget = third-party script (supply-chain XSS) dropping Snowplow/OneTrust cookies | Medium | **Mitigated**: promo routes only, prod CSP pins the single script host, `NEXT_PUBLIC_CHAT_WIDGET=disabled` kill switch; recommend self-hosting the bundle later |
| 3 | No security headers: admin UI frameable (clickjacking), MIME sniffing, referrer leaks | Medium | **Fixed**: nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy always; HSTS + CSP in prod |
| 4 | CSS injection sinks: `promotional/styles.tsx` (static strings) and `tenant-theme-style.tsx` (hex-sanitized) | Low | **Accepted**: no dynamic un-sanitized input reaches either |
| 5 | Unsplash hotlinks (IP/referrer privacy, availability) | Low | **Accepted**: asset choice, not an auth risk; self-host when branding allows |
| 6 | Token/password leakage, stray localStorage, eval, unsafe `target=_blank` in new UI | - | **Clean**: none found |

CSP is production-only by design (dev overlay/HMR need eval + ws). `script-src`
keeps `'unsafe-inline'` because next-themes injects an inline script; the upgrade
path is per-request nonces. `connect-src 'self' + widget host` is the exfil wall.

## 15. Students module (real API, dynamic routing)

Replaces the design-prototype mock table. Filters mirror the backend exactly:
`search` (name contains / exact admission no / EMIS id), `status` (6 enums),
`campusId`, `admissionType`, plus `page`/`limit`. Prototype-only filters
(grade, section, fee status) do not exist server-side and were removed.

| Endpoint | Client fn | UI |
|---|---|---|
| `GET /students` | `listStudents` | `components/students/students-table.tsx` |
| `GET /students/{id}` | `getStudent` | `students/[studentId]/page.tsx` (dynamic route) |
| `GET /students/{id}/status-history` | `getStudentStatusHistory` | profile timeline |
| `GET /students/{id}/health` | `getStudentHealth` | profile panel, gated `student.health.read`, audited |
| `GET /campuses` | `listCampuses` | campus filter + admission form |
| `POST /students` | `createStudent` | `components/students/add-student-form.tsx` |

Navigation performance: rows are `next/link` (route prefetch), the list query
uses `placeholderData: keepPreviousData` (no table flash on filter/page
change), row hover prefetches the detail query, and the root QueryClient's
`staleTime: 60s` makes back-navigation instant from cache. Profiles are URLs,
not drawer state, so back/forward and sharing work.

"Bucket": no bucket concept exists in this API. The nearest relatives are the
KPI status buckets (`/dashboard/kpis`), future file storage behind
`person.photoFileId` (permission text mentions uploaded documents), and
Next/react-query prefetching - which is what was implemented here. If a
storage-bucket endpoint lands later, it belongs in a files module, not here.

## 16. Students UI on Ritik's design, real data (supersedes §15 stopgaps)

The directory, profile, admit wizard and ID card are Ritik's components with
the mock array removed as a data source. Every read/write goes through the
students API; nothing renders invented values.

| Component | Endpoint(s) | Notes |
|---|---|---|
| `student-table-view.tsx` | `GET /students`, `GET /campuses` | server-side search/status/admissionType/campusId + paging (8/page); sort is current-page only (no contract param) with a visible note; rows are `next/link`; hover prefetches detail; printer icon fetches detail then opens ID card |
| `student-profile-page-view.tsx` | `GET /students/{id}`, `.../status-history`, `.../health` | tabs without a backend (academic/documents/fees/attendance) show honest "arrives with module" states and disabled stubs with tooltips; health gated `student.health.read`, audit-logged; sensitive person fields gated `person.sensitive.read` |
| `add-student-modal.tsx` | `POST /students`, `GET /campuses` | 4 steps: person / enrolment / contacts+address / confirm; server generates admissionNo; starts as applicant |
| `student-id-card-modal.tsx` | (uses detail already fetched) | grade/section/roll print as dashes until the academics module exists |

Decisions recorded with the product owner: unbuilt sections use honest empty
states (not demo data); contract-unsupported controls are disabled with
reasons (not fake success toasts); bulk selection removed until a bulk
endpoint exists; Export disabled until an export endpoint exists.

My §15 stopgap components (`students-table.tsx`, `student-profile.tsx`,
`add-student-form.tsx`) are now dead code - delete in the mock-cleanup PR
together with Ritik's unused mock files.

Test hygiene (backend): `npm run cleanup:test-students` empties student test
rows in every tenant while keeping tables, permission codes and campuses.
Admission numbers restart at 0001 afterwards.
