# InPursuit — Session Summary
> Last updated: 2026-04-09 (Session 8)

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

### Session 8 — Dashboard + Comments UI Overhaul (`fresh-design` branch)

#### Summary
Redesigned the Home page into a proper Dashboard. Overhauled the Comments page and homepage comment sections for visual consistency. Added Special Events to the left nav.

#### Dashboard (`Home.vue`)
- Page renamed "Dashboard" — heading + meta subtitle in phonebody; sticky header title removed (was always-visible "Home").
- **StatsBar** *(new — `src/templates/Misc/StatsBar.vue`)*: 2-col mobile / 4-col desktop grid of clickable stat cards. Fetches live totals (Members, Events, Comments, Special Events) via `x-wp-total` response headers with skeleton loading.
- **Coming Up section**: `OrbitDates` (3 items) with `SpecialDates` style. Conditionally shown — hidden when `x-wp-total = 0` for special dates.
- **Comments grouped by member** *(new — `UsersListGrouped.vue`)*: Groups incoming comments by `member.id`, shows count badge when a member has multiple, latest comment capped at 2 lines (`line-clamp-2`).
- **Recent Activity timeline** *(new — `ActivityTimeline.vue`)*: Fetches last 8 events; each item shows a gradient monogram square (first letter, `rounded-xl`, gradient seeded from name), bold event title, relative date below. No icons.
- All sections white with `border-t border-lightgray` dividers (gray panel backgrounds removed).

#### Comments Page (`UsersListWithComment.vue`, `UsersList.vue`)
- Both templates fully redesigned to match member list style.
- **Round avatars** (`rounded-full`) replacing square thumbnails.
- **Double-letter monogram** fallback with name-seeded gradient (8-colour palette) when `featured_image` is default.
- **Layout**: avatar + right column (name · time ago by COMMENTER, comment text as focal point with `font-medium text-darkblack`).
- Dividers removed from list.

#### SpecialDates.vue
- Single-letter monogram replaced with **double-letter initials** + gradient background (consistent with rest of app).

#### MainTitle.vue
- "View All" link redesigned as a small **outlined button** (`border border-purple rounded-md px-2.5 py-1`) with hover fill.

#### Navigation
- **Special Events** added to left nav (between Comments and Profile) using existing `SpecialEvent` icon.
- Nav item "Home" renamed to **"Dashboard"**.

---

### Session 7 — Events Redesign + Nav Shell + HistoryList Polish (`fresh-design` branch)

#### Summary
Continued design work on `fresh-design`. `SingleMember` gained the app-level nav shell (desktop sidebar + mobile bottom nav). `HistoryList` was substantially redesigned: events become a dot timeline, comments show author monograms and emphasise the comment text. `Events.vue` and `SingleEvent.vue` were fully redesigned to match the members design language. `/members` route now points at `MembersNew`.

#### Navigation Shell
- **`SingleMember.vue`**: Added `PhoneUI`-style desktop sidebar (`bg-lightergray`, nav items, "New Entry" CTA) and mobile bottom nav bar directly in the component. Sticky top bar removed; back button moved inside the purple hero. 3-dot button now opens a **bottom sheet** (`<Teleport to="body">`, slide-up transition, semi-transparent backdrop, drag handle pill, max-width capped at `max-w-lg`) with Edit / Archive / Delete options. Inactive tab buttons no longer render a border.
- **`SingleEvent.vue`**: Identical nav shell added (sidebar + bottom nav). Events nav item is highlighted as active via `allowedRoutes`.

#### HistoryList.vue — Full Redesign
- **Events**: Replaced card + icon badge with a **dot timeline**. Each item gets a coloured dot (8-colour palette, index-seeded) connected by a vertical grey line. Event name is bold, relative date sits below it in `text-xs text-gray`.
- **Comments**: Icon badge replaced by **author monogram** — `rounded-full` circle with 2-letter initials, colour seeded from the first 3 chars of `author_name`. Card border removed. Comment text is now the prominent element (`font-medium text-darkblack`); attribution line below shows `AUTHOR NAME · Category pill · date` all in `text-xs text-gray`. Author name is `uppercase tracking-wide`. Category renders as a soft pill with colour seeded from `term_id`.
- **Category bug fix**: Added `normaliseTerms()` helper that wraps a bare integer into an array before iterating — fixes categories not showing when the API returns a single number instead of `[n]`. `showCategories` now delegates to `getCommentCategories().length > 0` to prevent the separator dot rendering when no pills resolve.
- **Empty states**: Both event and comment tabs show a centred icon + message when `visibleCount === 0` and loading is complete.

#### Icon.vue — Consistency Fix
- `Edit` SVG: removed hardcoded `class="h-6 w-6"` so passed size classes take effect.
- `Delete` SVG: added `v-bind="$attrs"` and removed hardcoded `class="h-5 w-5"`.

#### Events Page Redesign
- **`EventsGrid.vue`** *(new)*: Template matching `MembersGrid` design. Mobile: list rows with a coloured calendar icon badge (colour seeded from `event_type` ID), event name, date + type pill. Desktop: table with Event, Type, Status, Date, hover-reveal View columns.
- **`Events.vue`**: Rebuilt to mirror `MembersNew` — `EventsGrid` style, polished empty state with icon + "Add First Event" CTA, mobile FAB, search wired into desktop header slot.
- **`OrbitPosts.vue`**: Registered `EventsGrid` as a local component.

#### SingleEvent.vue — Full Redesign
No longer uses `PhoneUI`. Custom layout matching `SingleMember`:
- **Hero**: purple band, event initial letter badge (first letter of event name, replacing generic calendar icon), event name, status pill + event type + relative date.
- **Left panel removed**: attendance donut ring and meta rows replaced with compact inline pill chips (Event Type, Date, attendance %) below the hero.
- **Attendees section**: full-width, `SearchField`, `MembersDropdown` filters, `OrbitPosts` with `MemberListWithSwitch`. `per_page` set to 20 (overrides `MembersHelper` default of 10) to ensure enough content for scroll-based pagination to trigger.
- **Attendance %**: pill shows `post.attendants_percentage` (confirmed field from event API) — not `totalItems` which reflects total members, not attendees.
- **3-dot bottom sheet**: Edit Event only.
- Removed `CircularProgressBar`, `defaultMixin`, `paginationMixin` dependencies.

#### MemberListWithSwitch.vue — Redesign
- **Avatar**: real photo (`rounded-full`) or name-seeded gradient monogram (2-letter initials) — same design as `MembersGrid`. Replaced old `PostFeaturedImage` + `PostTitle` components.
- **Layout**: compact `ul` list with `border-b` row separators. Desktop: `md:grid-cols-2` two-column grid with `gap-x-8`. Switch wrapped in `shrink-0` div to prevent flex crowding.
- **Name**: rendered via `v-html="user.title.rendered"` inside a `div` (not `p`) to avoid browser auto-closing block-level nesting which broke desktop display.
- **`getName()` method**: safe fallback — checks `title.rendered` first, then plain `title` string, then empty string.

#### Router
- **`/members`** now loads `MembersNew.vue` (import alias changed). Route name stays `'Members'` — all nav links unchanged.
- **`/members-new`** route removed.

---

### Session 6 — SingleMember Redesign + MembersNew Polish (`fresh-design` branch)

#### Summary
Continued design work on the `fresh-design` branch. `SingleMember.vue` was fully rebuilt without `PhoneUI`. `MembersNew.vue` received several polish fixes. `HistoryList.vue` gained a `type` filter prop and a card-based item layout.

#### Components
- **`HistoryList.vue`**: Added optional `type` prop (`"event"` | `"comment"`). Passed to API params; also applied as `v-show` client-side filter. Items redesigned from a divided list into individual `rounded-2xl border border-lightgray` cards. Each card has a small colored icon badge (soft red for events, soft purple for comments), title/author + right-aligned date, description text, category chips, and a hover-reveal delete button.
- **`MembersDropdown.vue`**: Removed `border-b border-lightgray` divider from the filter chip row.

---

### Session 5 — Fresh Design Overhaul (`fresh-design` branch)

#### Shell / Layout
- **`PhoneUI.vue`**: Desktop sidebar redesigned — light gray (`bg-lightergray`), dark text, "Admin Console" subtitle, active nav pill is white+purple, "New Entry" CTA at bottom. Mobile title default changed from `bg-purple text-white` → `bg-white text-purple`. CSS overrides (`maintitle`, `phone-sticky-header`) recolour `text-white` icons to purple without touching view files. Desktop page header now renders the `mainttitle_footer` slot (search field appears on desktop). Added `hide_desktop_header` configUI option (`v-if` on the desktop header bar). Added `hide_desktop_header` to setup/return.
- **`Title.vue`**: Page title now `font-bold`. Added `v-if="!hide_maintitle || $slots['mainttitle_footer']"` on the root div — prevents an empty padded bar rendering on pages like `SingleMember` that hide the title and have no slot content.
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
- **`MembersNew.vue`** *(new)*: `/members-new` route. Uses `MembersGrid` template. Desktop stats bar removed. Filter divider removed (`MembersDropdown` `border-b` stripped). Search field wired into desktop page header via `mainttitle_footer` slot. Improved empty state with icon + "Add First Member" CTA.
- **`SingleMember.vue`** *(fully redesigned, Session 6)*: No longer uses `PhoneUI`. Fully custom layout:
  - **Top bar**: sticky glass (`bg-white/90 backdrop-blur-md`), back button left, edit icon right.
  - **Hero**: `bg-purple` full-width band, left-aligned round avatar (real photo or monogram with name-seeded gradient color), member name in white, status pill (`bg-white/20`), profile type + member ID.
  - **Desktop layout**: `grid-cols-[300px_1fr]`. Left panel is sticky (`top-14`, `h-[calc(100vh-3.5rem)]`, scrollable). Right panel scrolls freely.
  - **Left panel**: action cards (Comment / WhatsApp / Archive) + labeled meta rows (Location, Gender & Age, Profession, Group, Phone) each with a soft-colored icon badge using inline styles.
  - **Right panel**: underline-style tab bar (Events / Comments) + `HistoryList` per tab.
  - **Mobile**: all sections stack vertically; meta rows sit in a `bg-lightergray` section between actions and activity.

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
