# InPursuit — Session Summary
> Date: 2026-04-08

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
│   ├── LoginForm.vue           # (appears unused)
│   ├── LoginFormWithSteps.vue  # Actual login form (3-step)
│   ├── PhoneUI.vue             # Mobile-first phone wrapper layout
│   ├── Modal.vue               # Generic modal
│   ├── TextField.vue           # Form field components
│   ├── TextAreaField.vue
│   ├── DropDownField.vue
│   └── icons/                  # SVG icon components
│
├── lib/                        # Data fetching + helpers
│   ├── OrbitQuery.js           # Core infinite scroll query handler (vue-query)
│   ├── OrbitPosts.vue          # Data fetcher for WP REST posts
│   ├── OrbitInpursuitPosts.vue # Data fetcher for custom InPursuit post types
│   ├── OrbitComments.vue       # Comments data fetcher
│   ├── OrbitDates.vue          # Special dates fetcher
│   ├── PostEdit.js             # Create/update/delete post logic (DOM-coupled)
│   ├── FormEdit.js             # Generic create/update/delete (cleaner pattern)
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

## Refactoring Opportunities Identified

### High Priority
1. **Login triplication** — `LoginForm.vue` (unused), `LoginFormWithSteps.vue`, and `Login.vue` all contain identical `validateURL`, `generateOTP`, `testAccountURL`, `sendEmailOTP`, `verifyOTP`, `focusInput`. Should be one `useLoginFlow.js` composable.
2. **OrbitPosts vs OrbitInpursuitPosts** — 95% identical, only differ in which API method they call. Should be one generic `OrbitList.vue` accepting an API function as a prop.
3. **PostEdit.js vs FormEdit.js** — overlapping CRUD logic. `FormEdit.js` is the cleaner pattern and should be consolidated.

### Medium Priority
4. **Async inside Vuex mutation** — `getAccountSettings` in `store/index.js` makes an API call inside a mutation, which is an anti-pattern. Must move to an action.
5. **Duplicate auth header generation** — `btoa(username + ":" + password)` exists in both `api.js` and `store/index.js`. Single source of truth should be in `api.js`.
6. **Repeated filter logic** — `selectDropdownItem()` is nearly identical in `Members.vue`, `Events.vue`, and `Comments.vue`. Should be a shared composable.
7. **btoa() double-encoding confusion** — credentials are `btoa()`-encoded before being sent AND the API wraps them in Basic Auth (`btoa()` again). Only the Basic Auth header should use `btoa()`.

### Low Priority
8. **Mixed Options API + Composition API** — `SingleMember.vue` uses both `data()` and `setup()`. Should standardize to Composition API.
9. **Helper.js should merge into Util.js** — `Helper.js` is 17 lines with one function (`debounceEvent`). `Util.js` even has it commented out.
10. **Dead code** — Commented-out functions in `Util.js` and `Home.vue`. `LoginForm.vue` appears entirely unused.
11. **Loose equality** — `==` used instead of `===` throughout 10+ files. Should enable ESLint `eqeqeq` rule.
12. **Bad v-for key** — `NewMember.vue` uses `:key="field"` (object reference) instead of `:key="field.id"`.
