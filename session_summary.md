# InPursuit — Session Summary
> Last updated: 2026-04-08 (Session 5)

---

## What Is This App

**InPursuit** is a Vue 3 PWA for church/community management, hosted on Vercel with WordPress as the backend. It is **multi-tenant** — any WordPress instance with the InPursuit plugin can be targeted at login, with no hardcoded backend URLs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build / State | Vite, Vuex 4 |
| Data Fetching | vue-query (useInfiniteQuery) |
| HTTP | Axios + vue-axios |
| Styling | Tailwind CSS |
| PWA | vite-plugin-pwa (injectManifest) |
| Backend | WordPress REST API (per workspace) |
| Testing | Vitest + JSDOM |

---

## Project Structure

```
src/
├── main.js / App.vue          # Entry point, loads settings from localStorage
├── api.js                     # All HTTP requests, auth headers, URL construction
├── registerServiceWorker.js   # PWA service worker registration
├── sw.js                      # Custom service worker (Workbox + push events)
├── components/                # Reusable UI (PhoneUI, Modal, fields, icons)
├── lib/                       # Composables + helpers
│   ├── OrbitQuery.js          # Core infinite scroll query handler
│   ├── OrbitPosts.vue         # Unified data fetcher (apiType: "posts" | "inpursuit")
│   ├── useLoginFlow.js        # All login logic (URL validation, OTP, steps)
│   ├── usePushNotifications.js # Web push subscribe/unsubscribe composable
│   ├── PostEdit.js / FormEdit.js # CRUD helpers with withProcessing wrapper
│   ├── MembersHelper.js       # Members page composable
│   └── Util.js / Helper.js / ImageUtil.js
├── router/index.js            # 22 page routes
├── store/index.js             # Vuex store (auth, processing, error, cache)
├── templates/                 # Presentational-only components
└── views/                     # 22 page-level components
```

---

## Key Architecture

- **No hardcoded backend.** `account_url` stored in localStorage; all API calls prepend it via `api.js._getURL()`.
- **Auth:** 3-step login (URL validate → email + OTP → OTP verify). Credentials stored in localStorage as `{ id, username, password, account_url }`. All subsequent requests use HTTP Basic Auth (`btoa(username:password)`).
- **Data fetching:** `OrbitQuery.js` + `useInfiniteQuery`; pagination from WP headers (`x-wp-total`, `x-wp-totalpages`).
- **Layout:** `PhoneUI.vue` slot-based shell — `headericon`, `headerright`, `mainttitle_footer`, `phonebody`.
- **Dynamic templates:** `<component :is="params.style" />` renders different list/card templates from the same data fetcher.

---

## API Methods (api.js)

| Method | Endpoint |
|---|---|
| `requestPosts` / `requestPost` | `GET /wp-json/wp/v2/{type}/` |
| `requestInpursuitPosts` / `requestInpursuitPost` | `GET /wp-json/inpursuit/v1/{type}/` |
| `requestUsers` / `requestComments` / `requestHistory` | WP + InPursuit endpoints |
| `requestSettings` / `requestAnalytics` / `requestSpecialDates` | InPursuit plugin endpoints |
| `requestProfile` / `createPost` / `createAttachment` | WP REST API |

---

## Work Done (Sessions 1–4)

### Session 1 — Code Refactoring (`refactor/code-cleanup`)
- **Login composable:** Extracted all login logic into `useLoginFlow.js`; `Login.vue` reduced from 278 → 14 lines. Deleted dead files `LoginForm.vue` and `LoginFormWithSteps.vue`.
- **OrbitPosts merge:** `OrbitPosts.vue` now accepts `apiType` prop, absorbing `OrbitInpursuitPosts.vue` (deleted). `resolvedStyle` computed handles naming collision.
- **withProcessing helper:** Added to `PostEdit.js` + `FormEdit.js` to eliminate repeated `setProcessing` boilerplate. Fixed mutation bug in `FormEdit.js` (was mutating `data.value` directly).

### Session 2 — Desktop Layout
- Added responsive desktop layout to `PhoneUI.vue`: fixed left sidebar (224px, purple) + white page header bar replacing mobile header/title.
- `Footer.vue`, `Header.vue`, `Title.vue` all get `md:hidden` — desktop sidebar/header takes over.
- CSS override in `PhoneUI.vue` recolors `text-white` icons to purple on the white desktop bar — no view files touched.

### Session 3 — Web Push Notifications
- Created `src/sw.js`: custom Workbox service worker with `push` event listener.
- Created `src/lib/usePushNotifications.js`: fetches VAPID key, subscribes via `pushManager`, POSTs to `/push/subscribe` with auth. Exposes `isSubscribed`, `isProcessing`, `successMessage`, `toggleNotifications()`.
- `Profile.vue`: notification toggle UI with loading/success states.
- `Logout.vue`: fire-and-forget unsubscribe before credential flush.
- `vite.config.js`: switched to `injectManifest` strategy to support custom SW.

### Session 4 — Auth Audit
- Audited all API calls for missing auth headers.
- **Bug fixed:** `requestHistory()` was missing `headers: this.getAuthHeaders()` → 401 on history tab in `SingleMember`. Fixed in `api.js`.
- Intentionally unauthenticated calls (pre-login): plugin validate, OTP send, authentication, VAPID public key fetch.

### Session 5 — Fresh Design Overhaul (`fresh-design` branch)

#### Shell / Layout
- **`PhoneUI.vue`**: Desktop sidebar redesigned — light gray (`bg-lightergray`), dark text, "Admin Console" subtitle, active nav pill is white+purple, "New Entry" CTA at bottom. Mobile title default changed from `bg-purple text-white` → `bg-white text-purple`. CSS overrides (`maintitle`, `phone-sticky-header`) recolour `text-white` icons to purple without touching view files.
- **`Title.vue`**: Page title now `font-bold`.
- **`Header.vue`**: Added `phone-sticky-header` class + `shadow-sm` on scroll.
- **`Footer.vue`**: White bg, `text-darkgray` inactive icons, `uppercase tracking-widest` labels.

#### Components
- **`SearchField.vue`**: Pill shape (`rounded-full`), `bg-lightergray`, `text-sm`, purple focus border.
- **`ButtonPopupModal.vue`**: Active chip (has badge) gets purple border + text; badge flips to white-on-purple.
- **`Modal.vue`**: Drag handle pill, white body, softened backdrop (0.5 opacity), upward shadow, `rounded-t-2xl`.
- **`TextField.vue`**: `border border-lightgray`, `rounded-xl`, `bg-lightergray` rest / `bg-white` focus, `focus:border-purple`.

#### Templates
- **`FeaturedImage.vue`**: `rounded-full`, `w-14 h-14`, ring removed.
- **`Post/Title.vue`**: `font-semibold text-darkblack no-underline`.
- **`Misc/MainTitle.vue`**: "View All" changed from `text-orange` → `text-purple`.
- **`Misc/SubTitle.vue`**: Unchanged.
- **`Posts/ListWithImage.vue`**: Mobile list (`md:hidden`) + desktop table (Member Name, Last Seen columns).
- **`Animation/ListWithImage.vue`**: Skeleton avatar updated to `rounded-full w-14 h-14`.
- **`Animation/PaginationLoader.vue`**: Replaced orange button with a horizontal divider + centered spinner + "LOADING MORE" label.
- **`Posts/MembersGrid.vue`** *(new)*: Custom template for `/members-new`. Mobile: contact list with monogram avatar, status dot, extra field chips (gender, profile type, location, profession). Desktop: 8-column table (Member, Status, Gender, Profile Type, Location, Profession, Last Seen, Actions) with `overflow-x-auto`. Monogram uses two-letter initials with name-seeded gradient. Real photo shown if `featured_image` doesn't include `default-profile.png`.

#### Views
- **`Members.vue`**: Added mobile FAB (fixed, bottom-right, `rounded-2xl`).
- **`SingleMember.vue`**: Profile avatar `rounded-2xl`, card `rounded-2xl`, archive button `bg-red`.
- **`MembersNew.vue`** *(new)*: `/members-new` route. Desktop stats bar (total count, last sync). Uses `MembersGrid` template. Improved empty state with icon + "Add First Member" CTA.

#### Config
- **`tailwind.config.js`**: Added `green: '#16a34a'` for status badges.
- **`router/index.js`**: Added `/members-new` → `MembersNew` route.
- **`OrbitPosts.vue`**: Registered `MembersGrid` as a local component.

#### Member post fields (confirmed)
Direct properties on the post object: `post.gender`, `post.location`, `post.member_status`, `post.profession`, `post.group` (array), `post.phone`, `post.age`. Taxonomy fields may return numeric IDs from the API — use `formatField()` to guard against raw IDs and empty arrays.

---

## Remaining Refactoring Opportunities

| Priority | Issue |
|---|---|
| Medium | `getAccountSettings` in Vuex makes async API call inside a mutation — move to action |
| Medium | `btoa(username:password)` duplicated in `api.js` and `store/index.js` |
| Medium | `selectDropdownItem()` near-identical in `Members.vue`, `Events.vue`, `Comments.vue` |
| Medium | `btoa()` used on credentials before sending AND in Basic Auth header — only header should use it |
| Low | `SingleMember.vue` mixes Options API (`data()`) and Composition API (`setup()`) |
| Low | `Helper.js` (17 lines, just `debounceEvent()`) should merge into `Util.js` |
| Low | Dead/commented-out code in `Util.js` and `Home.vue` |
| Low | `==` instead of `===` in 10+ files — enable ESLint `eqeqeq` |
| Low | `NewMember.vue` uses `:key="field"` (object ref) — should be `:key="field.id"` |

---

## Custom WordPress Endpoints (InPursuit Plugin)

- `/wp-json/inpursuit/v1` — plugin validation
- `/wp-json/inpursuit/v1/verify/` — OTP send
- `/wp-json/inpursuit/v1/authentication/` — credential generation
- `/wp-json/inpursuit/v1/comments`, `/history`, `/settings`, `/analytics`, `/special-dates`
- `/push/vapid-public-key`, `/push/subscribe` — web push
