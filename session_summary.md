# InPursuit — Session Summary
> Last updated: 2026-04-08 (Session 4)

---

## What Is This App

**InPursuit** is a Vue 3 Progressive Web App (PWA) for church/community management. It is hosted on Vercel and uses WordPress as its backend database. The app is intentionally designed to be **multi-tenant** — it can connect to any WordPress instance, making it reusable across multiple organizations without changing the frontend code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build Tool | Vite |
| State Management | Vuex 4 |
| Data Fetching | vue-query (useInfiniteQuery) |
| HTTP Client | Axios + vue-axios |
| Routing | Vue Router 4 |
| Styling | Tailwind CSS + PostCSS |
| PWA | vite-plugin-pwa + register-service-worker |
| Backend | WordPress REST API (per workspace) |
| Testing | Vitest + JSDOM |
| Utilities | javascript-time-ago, vue3-circle-progress |

---

## Project Structure

```
src/
├── main.js                     # Vue app entry point
├── App.vue                     # Root component, loads settings from localStorage
├── api.js                      # All HTTP requests, auth headers, URL construction
├── registerServiceWorker.js    # PWA service worker registration
│
├── assets/                     # CSS, images, logos
│
├── components/                 # Reusable UI components (50+ files)
│   ├── PhoneUI.vue             # Mobile-first phone wrapper layout
│   ├── Modal.vue               # Generic modal
│   ├── TextField.vue           # Form field components
│   ├── TextAreaField.vue
│   ├── DropDownField.vue
│   └── icons/                  # SVG icon components
│
├── lib/                        # Data fetching + helpers
│   ├── OrbitQuery.js           # Core infinite scroll query handler (vue-query)
│   ├── OrbitPosts.vue          # Data fetcher — handles both WP REST and InPursuit post types (apiType prop)
│   ├── OrbitComments.vue       # Comments data fetcher
│   ├── OrbitDates.vue          # Special dates fetcher
│   ├── useLoginFlow.js         # Composable — all login logic (URL validation, OTP, steps, focus)
│   ├── PostEdit.js             # Create/update/delete post logic (DOM-coupled, WP post types)
│   ├── FormEdit.js             # Generic create/update/delete (requestAPI injection pattern)
│   ├── MembersHelper.js        # Members page composable (params, filters, search)
│   ├── Helper.js               # Only contains debounceEvent() — 17 lines
│   ├── Util.js                 # General utilities (112 lines)
│   ├── CategoryHelper.js
│   ├── FiltersHelper.js
│   └── ImageUtil.js
│
├── router/
│   └── index.js                # Route definitions (22 page routes)
│
├── store/
│   └── index.js                # Vuex store (auth settings, errors, processing flag)
│
├── templates/                  # Presentational-only components (no logic)
│   ├── Animation/              # Skeleton loading states
│   ├── Comments/               # Comment display
│   ├── InpursuitPosts/         # Custom post type display
│   ├── Misc/                   # Miscellaneous
│   ├── PhoneUI/                # Phone UI sub-templates
│   ├── Post/                   # Single post display
│   ├── Posts/                  # Multi-post list templates
│   └── SpecialDates/           # Birthdays, anniversaries display
│
└── views/                      # Page-level components (22 pages)
    ├── Login.vue               # Multi-step login page
    ├── Home.vue                # Dashboard
    ├── Members.vue             # Members listing
    ├── SingleMember.vue        # Member detail
    ├── Events.vue              # Events listing
    ├── SingleEvent.vue         # Event detail
    ├── Team.vue                # Leadership/team users
    ├── Comments.vue            # Comments section
    ├── Analytics.vue           # Stats/metrics
    └── NewMember.vue           # Add member form
```

---

## Multi-Workspace Architecture

The core concept: **no hardcoded backend**. The app is a stateless client that targets whichever WordPress instance the user provides at login.

```
User A → logs into https://church-a.com
  All API calls → https://church-a.com/wp-json/inpursuit/v1/...

User B → logs into https://church-b.com
  All API calls → https://church-b.com/wp-json/inpursuit/v1/...
```

**How it works:**
- User enters their `account_url` (WordPress site URL) at login step 1
- URL is stored in `localStorage.inpursuit_settings.account_url`
- Every API call dynamically prepends this URL via `api.js`:
  ```js
  _getURL: (endpoint) => store.state.settings.account_url + endpoint
  ```
- Logging out clears localStorage, allowing login to a different workspace

Each WordPress instance has its own database and the InPursuit WordPress plugin installed.

---

## Authentication Flow (3 Steps)

### Step 1 — Workspace URL Validation
- User enters: `account_url` (e.g. `https://example.com`)
- `validateURL()` normalizes it (adds `https://`, strips trailing slash)
- `GET {account_url}/wp-json/inpursuit/v1` — validates the InPursuit plugin is installed

### Step 2 — Email + OTP
- User enters: `email_address`
- App generates a random 6-digit OTP **client-side**
- `POST {account_url}/wp-json/inpursuit/v1/verify/`
  ```json
  {
    "email_address": "btoa(email)",
    "email_otp": "btoa(otp)"
  }
  ```
- Server validates the email exists and sends the OTP to the user

### Step 3 — OTP Verification + Credential Generation
- User enters the OTP received by email
- App compares against locally generated OTP
- `POST {account_url}/wp-json/inpursuit/v1/authentication/`
  ```json
  { "email_address": "btoa(email)" }
  ```
- Server responds with:
  ```json
  {
    "user": { "ID": 1, "user_login": "..." },
    "password": "generated_secure_password"
  }
  ```

### Credential Storage
```js
localStorage.inpursuit_settings = {
  id: user_id,
  username: user_login,
  password: generated_password,
  account_url: "https://example.com"
}
```

### Subsequent Requests
All API calls use HTTP Basic Auth:
```js
Authorization: "Basic " + btoa(username + ":" + password)
```

---

## API Module (api.js)

Central request handler. All requests go through `makeRequest()`.

**Key methods:**
| Method | Endpoint |
|---|---|
| `requestPosts(post_type, params)` | `GET /wp-json/wp/v2/{type}/` |
| `requestPost(post_type, id)` | `GET /wp-json/wp/v2/{type}/{id}` |
| `createPost(newPost)` | `POST /wp-json/wp/v2/{type}/` |
| `requestInpursuitPosts(post_type, params)` | `GET /wp-json/inpursuit/v1/{type}/` |
| `requestInpursuitPost(post_type, id)` | `GET /wp-json/inpursuit/v1/{type}/{id}` |
| `requestUsers(params)` | `GET /wp-json/wp/v2/users` |
| `requestComments(params)` | `GET /wp-json/inpursuit/v1/comments` |
| `requestHistory(params)` | `GET /wp-json/inpursuit/v1/history` |
| `requestSettings()` | `GET /wp-json/inpursuit/v1/settings` |
| `requestAnalytics(params)` | `GET /wp-json/inpursuit/v1/analytics` |
| `requestSpecialDates(params)` | `GET /wp-json/inpursuit/v1/special-dates` |
| `requestProfile()` | `GET /wp-json/wp/v2/users/me` |
| `createAttachment(attachment)` | `POST /wp-json/wp/v2/media/` |

**Parameter cleaning:** Before sending, non-API params (`pagination`, `style`, `post_type`, `method`) are stripped so components can reuse the same param object internally and for API calls.

---

## Data Fetching Pattern (vue-query + Infinite Scroll)

`OrbitQuery.js` is the core data layer. Uses `useInfiniteQuery`:

```js
useInfiniteQuery(
  ['OrbitQuery', params],           // cache key
  ({ pageParam = 1 }) => API.requestPosts(params.post_type, { ...params, page: pageParam }),
  queryConfig
)
```

Pagination is detected from WordPress response headers:
- `x-wp-total` — total item count
- `x-wp-totalpages` — total pages

Exposed computed properties: `items`, `total`, `hasMorePages`, `status`, `isFetchingNextPage`.

---

## Vuex Store (store/index.js)

**State:**
- `settings` — auth credentials + account_url (loaded from localStorage)
- `processing` — global loading flag
- `error` — global error message
- `cachedMember` — last viewed member (avoids re-fetch on back navigation)
- `accountSettings` — workspace-level config from server

**Key mutations:**
- `getLocalSettings` — loads from localStorage
- `flushLocalSettings` — logout/clear
- `setProcessing` — toggle loading state
- `setError` — set error message
- `setCachedMember` — cache a member post
- `getAccountSettings` — **makes async API call inside a mutation (anti-pattern)**

---

## Key Patterns Used

### PhoneUI Slot Layout
```vue
<PhoneUI title="Page Title">
  <template v-slot:headericon>...</template>
  <template v-slot:headerright>...</template>
  <template v-slot:phonebody>...</template>
</PhoneUI>
```

### Helper Factory Composable Pattern
```js
// MembersHelper.js
const membershelper = () => {
  const params = ref({...});
  const onSearch = () => { ... };
  return { params, onSearch };
};

// In component:
setup() { return MembersHelper(); }
```

### Dynamic Template Rendering
```vue
<component :is="params.style" :posts="items" />
<!-- Renders PostImagesSlider | EventList | AvatarsStacked | etc. -->
```

### Post Caching for Back Navigation
```js
store.commit("setCachedMember", post);
// Avoids re-fetching when returning from detail view to list
```

---

## Custom WordPress Post Types

- `inpursuit-members` — community/church members
- `inpursuit-events` — events and activities
- Standard WordPress posts (for news/announcements)

---

## Custom WordPress Endpoints (InPursuit Plugin)

The WordPress backend has a custom plugin that exposes:
- `/wp-json/inpursuit/v1` — plugin validation
- `/wp-json/inpursuit/v1/verify/` — OTP sending
- `/wp-json/inpursuit/v1/authentication/` — credential generation
- `/wp-json/inpursuit/v1/comments` — comments with extra meta
- `/wp-json/inpursuit/v1/history` — activity timeline
- `/wp-json/inpursuit/v1/settings` — workspace config
- `/wp-json/inpursuit/v1/analytics` — engagement metrics
- `/wp-json/inpursuit/v1/special-dates` — birthdays/anniversaries

---

## Refactoring Log

### Completed (branch: refactor/code-cleanup)

#### 1. Login composable — `src/lib/useLoginFlow.js`
- Extracted all shared login logic into a single composable: URL validation, OTP generation, step navigation, API calls, focus management
- `Login.vue` script reduced from 278 lines → 14 lines (template unchanged)
- Deleted `LoginForm.vue` and `LoginFormWithSteps.vue` — both were unused dead files

#### 2. OrbitPosts / OrbitInpursuitPosts merge
- `OrbitPosts.vue` now accepts an `apiType` prop (`"posts"` default, `"inpursuit"` for custom endpoints)
- `ListWithTermName` naming collision resolved via `resolvedStyle` computed: maps to `PostsListWithTermName` or `InpursuitListWithTermName` based on `apiType`
- `CommentsCategory.vue` updated: `<OrbitInpursuitPosts>` → `<OrbitPosts apiType="inpursuit">`
- `OrbitInpursuitPosts.vue` deleted, removed from `main.js`

#### 3. withProcessing helper — PostEdit.js + FormEdit.js
- Both files now have a local `withProcessing(apiCall, onSuccess, onError)` helper
- Eliminated repeated `setProcessing(true/false)` + `.then()` boilerplate from every CRUD function
- Fixed subtle mutation bug in `FormEdit.js`: was mutating `data.value` directly with `method = "post"` — now uses `{ ...data.value, method: "post" }`

---

## Remaining Refactoring Opportunities

### Medium Priority
1. **Async inside Vuex mutation** — `getAccountSettings` in `store/index.js` makes an API call inside a mutation (anti-pattern). Should move to an action.
2. **Duplicate auth header generation** — `btoa(username + ":" + password)` exists in both `api.js` and `store/index.js`. Should have a single source of truth in `api.js`.
3. **Repeated filter logic** — `selectDropdownItem()` is nearly identical in `Members.vue`, `Events.vue`, and `Comments.vue`. Should be a shared composable.
4. **btoa() confusion** — credentials are `btoa()`-encoded before sending AND the API wraps them in Basic Auth again. Only the Basic Auth header should use `btoa()`.

### Low Priority
5. **Mixed Options API + Composition API** — `SingleMember.vue` uses both `data()` and `setup()`. Should standardize to Composition API.
6. **Helper.js should merge into Util.js** — `Helper.js` is 17 lines containing only `debounceEvent()`. `Util.js` even has it commented out.
7. **Dead code** — Commented-out functions in `Util.js` and `Home.vue`.
8. **Loose equality** — `==` used instead of `===` throughout 10+ files. Enable ESLint `eqeqeq` rule.
9. **Bad v-for key** — `NewMember.vue` uses `:key="field"` (object reference) instead of `:key="field.id"`.

---

## Session 2 — Desktop Layout (2026-04-08)

### Goal
Make the app look good on desktop without touching any page or feature logic. All changes are isolated to the `PhoneUI` layout shell and its sub-templates.

### Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Mobile `< 768px` | Unchanged — sticky header + purple title banner + content + bottom nav |
| Desktop `≥ 768px` | Fixed left sidebar + clean white page header bar + full-width content |

### Files Changed

#### `src/components/PhoneUI.vue`
- Root div: `md:flex md:min-h-screen`
- Added `hidden md:flex` **left sidebar**: sticky, 224px wide, purple bg (`#89558d`), "InPursuit" wordmark, vertical nav links (Home / Members / Events / Comments / Profile) with active-route highlight (`bg-white/15 text-white`); inactive links `text-white/60` with hover lift
- Added `hidden md:flex` **desktop page header bar**: white bg, `border-b border-lightgray`, page `title` on the left, `headerright` slot content on the right — this preserves all action buttons (+ add, save, logout, edit) on desktop
- CSS override: `.desktop-page-header .text-white { color: #89558d }` — all views pass `text-white` on their action icons (designed for the purple mobile header); this makes them visible on the white desktop bar without touching any view files
- Content body padding: `p-4` mobile → `md:p-8` desktop
- Added `Icon` component import + `navItems` data array for the sidebar links

#### `src/templates/PhoneUI/Footer.vue`
- Added `md:hidden` to root `div` — bottom nav hidden on desktop (sidebar replaces it)

#### `src/templates/PhoneUI/Header.vue`
- Added `md:hidden` to root `div` — mobile sticky scroll-in header hidden on desktop (desktop page header bar replaces it)

#### `src/templates/PhoneUI/Title.vue`
- Added `md:hidden` to root `div` — big purple title banner hidden on desktop (desktop page header bar replaces it)

### PhoneUI Slot Reference (updated)

| Slot | Mobile | Desktop |
|---|---|---|
| `headericon` | Left icon in sticky header (back button) | Hidden (`header` is `md:hidden`) |
| `headerright` | Right action in sticky header (+ / save / logout) | Shown in desktop page header bar (right side) |
| `mainttitle_footer` | Below title in purple banner (search field) | Hidden (`title` is `md:hidden`) |
| `phonebody` | Main page content | Main page content (same) |

### Commit
- Branch: `refactor/code-cleanup`
- Commit: `eb07105`
- Remote: `https://github.com/samvthom16/testvue`

---

## Session 3 — Web Push Notifications (2026-04-08)

### Goal
Integrate web push notifications into the frontend, connected to the WordPress backend's push API.

### Files Created

#### `src/sw.js`
- Custom service worker using Workbox `precacheAndRoute` (injected by VitePWA)
- Listens for `push` events and calls `showNotification()` with `{ title, body }` from JSON payload

#### `src/lib/usePushNotifications.js`
- `unsubscribeFromNotifications()` — standalone async export, safe to call outside `setup()` (used in Logout)
- `usePushNotifications()` — composable exposing `isSubscribed`, `isProcessing`, `successMessage`, `isSupported`, `toggleNotifications()`
- Fetches VAPID public key from `/push/vapid-public-key`, subscribes via `pushManager.subscribe()`, POSTs subscription to `/push/subscribe` with Basic Auth
- All API calls use `store.state.settings.account_url` — fully multi-tenant, no hardcoded URLs

### Files Modified

#### `vite.config.js`
- Switched VitePWA from `generateSW` to `injectManifest` strategy (`srcDir: "src"`, `filename: "sw.js"`)
- Required so custom push event listener in `src/sw.js` survives the production build

#### `src/components/Icon.vue`
- Added `Bell` SVG icon (`type="Bell"`)

#### `src/views/Profile.vue`
- Added notification toggle row to MORE OPTIONS section
- Shows "Enable Notifications" / "Disable Notifications" based on subscription state
- Shows "Enabling..." / "Disabling..." while async operation is in progress
- Flashes "Notifications enabled!" / "Notifications disabled." for 2.5s on success
- Hidden if browser doesn't support push (`v-if="isSupported"`)

#### `src/views/Logout.vue`
- Calls `unsubscribeFromNotifications().catch(() => {})` before flushing credentials
- Fire-and-forget so logout is not blocked if push server is unreachable

### Architecture Notes
- Multi-tenant: all push endpoints use `store.state.settings.account_url`, same as the rest of the app
- Backend triggers needed: `wp_insert_comment`, `save_post_inpursuit-members`, `save_post_inpursuit-events`
- Push payload format: `{ title: "...", body: "..." }`

### Commits
- `80a0cc9` — feat: add web push notification support
- `78d95c1` — feat: add loading and success feedback to notification toggle

---

## Session 4 — Auth Audit + History Fix (2026-04-08)

### Goal
Audit all API requests for missing authentication headers and fix any bugs found.

### Findings

All API calls in `api.js` pass `headers: this.getAuthHeaders()` — except `requestHistory()`, which was missing it entirely, causing a 401 on the history tab in `SingleMember`.

**Unauthenticated requests — by design (pre-login):**
| Call | File | Endpoint |
|---|---|---|
| Plugin validation | `useLoginFlow.js:97` | `GET /wp-json/inpursuit/v1` |
| OTP send | `useLoginFlow.js:117` | `POST /wp-json/inpursuit/v1/verify/` |
| Authentication | `useLoginFlow.js:149` | `POST /wp-json/inpursuit/v1/authentication/` |
| VAPID public key | `usePushNotifications.js:54` | `GET /push/vapid-public-key` |

**Unauthenticated request — bug (fixed):**
- `requestHistory()` in `api.js` — missing `headers: this.getAuthHeaders()`

### Fix

#### `src/api.js`
- Added `headers: this.getAuthHeaders()` to `requestHistory()` — now consistent with every other method in the file
- Root cause: `HistoryList.vue` calls `API.requestHistory()` via `OrbitQuery`, which hits `/wp-json/inpursuit/v1/history` without an `Authorization` header → WordPress returns 401
