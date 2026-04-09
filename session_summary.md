# InPursuit — Session Summary
> Last updated: 2026-04-09 (Session 14)

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

## Session History (condensed)

### Sessions 1–4 — Foundation
- **S1:** Extracted login into `useLoginFlow.js`; merged `OrbitInpursuitPosts` into `OrbitPosts` via `apiType` prop; added `withProcessing` helper.
- **S2:** Added responsive desktop layout to `PhoneUI.vue` (fixed sidebar + page header bar).
- **S3:** Web push notifications — custom SW (`sw.js`), `usePushNotifications.js` composable, toggle in `Profile.vue`.
- **S4:** Auth audit; fixed missing auth headers on `requestHistory()`.

### Sessions 5–6 — Design foundation (`fresh-design` branch)
- Redesigned `PhoneUI` shell (light sidebar, white mobile header, active nav pill).
- New `MembersGrid` template with monogram avatars, desktop table, status dots.
- `SingleMember` fully rebuilt — custom layout, purple hero, sticky glass top bar, tabbed activity panel.

### Session 7 — Events + HistoryList
- `SingleMember` + `SingleEvent` gained full nav shell (desktop sidebar + mobile bottom nav).
- `HistoryList` redesigned: dot timeline for events, monogram cards for comments; fixed category normalisation bug.
- New `EventsGrid` template; `SingleEvent` rebuilt with hero, pill chips, attendees section.

### Session 8 — Dashboard + Comments
- `Home.vue` → Dashboard with `StatsBar`, Coming Up section, comments grouped by member, activity timeline.
- Comments templates redesigned with round avatars and gradient monograms.

### Sessions 9–10 — Polish sweep
- Removed mobile phone chrome (no more device frame).
- Consistent `PhoneUI` usage across all views; `Gradients.js` utility extracted.
- Design refactor sweep: color tokens, spacing, typography, button styles aligned across all views.

### Session 11 — Team, Analytics, Forms
- `Team.vue` + `Analytics.vue` redesigned to match Members/Events language.
- `SingleTeamMember` rebuilt with hero section.
- All form views (`NewMember`, `NewEvent`, `NewCategory`, `NewCommentsCategory`) use shared pattern: non-sticky header, sectioned fields, 2-col desktop grid, full-width submit button, Danger Zone.
- Field components redesigned: `DropDownField`, `TextAreaField`, `CheckboxGroupField` (pill toggles).

### Session 12 — Categories, Nav, Icons
- `Categories` + `CommentsCategory` list rows redesigned with icon badges and count sub-queries.
- New `MembersCount.vue` template for inline member counts in category rows.
- Mobile bottom nav overhauled: 4 primary items + **More** drawer (bottom sheet with overflow items).
- `Profile` icon fixed (was showing gear/Settings icon).
- `← Settings` back links added to `Categories` and `CommentsCategory`.

### Session 14 — Dead Code Removal + Team Page Polish

- **Dead code sweep:** removed 14 stale files — Vite scaffold cluster (`HelloWorld`, `TheWelcome`, `WelcomeItem`, `AboutView`, `HomeView`), superseded PhoneUI templates (`Header.vue`, `Title.vue`), orphaned animation template (`MemberAvatars.vue`), and unused components (`HeaderMenu`, `EventTags`, `FilterTags`, `UserTags`, `ProgressBarItem`, `SettingItem`).
- **`Team.vue` loading skeleton:** new `templates/Animation/TeamList.vue` skeleton matches the actual row layout exactly — circular monogram placeholder, name + email lines at varied widths, status pill stub, action button placeholder.
- **`Team.vue` caching:** migrated from manual `ref + API.requestUsers()` to `useQuery("teamMembers", ...)` (vue-query), consistent with the rest of the app. Cached data returns instantly on revisit; skeleton only shows on first load.

### Session 13 — Settings Modals + Skeleton Loader
- Add/edit for all category types (groups, genders, locations, professions, event-types, status) and comment types now happens in an inline modal on the listing page — no separate route navigation.
- `Posts/ListWithTermName.vue` + `InpursuitPosts/ListWithTermName.vue`: edit pencil button changed from `router-link` to `$emit('edit-item', post)`; `@edit-item` handler on `<OrbitPosts>` propagates via `v-bind="$attrs"` to the template.
- `Categories.vue` + `CommentsCategory.vue`: all three "new" entry points (header button, empty-state CTA, FAB) now open a `<Teleport>`-based modal; modal handles create, update, and Danger Zone delete; list refreshes by bumping `params.unique_id`.
- New `CategoryList.vue` skeleton animation matches the actual `ListWithTermName` row exactly (icon badge, varied-width name line, count stub, edit button placeholder); replaces the old generic `ListWithImage` / `SimpleList` skeletons in both views.

---

## Member Post Fields (confirmed)

Direct properties on the post object: `post.gender`, `post.location`, `post.member_status`, `post.profession`, `post.group` (array), `post.phone`, `post.age`. Use `formatField()` to guard against raw IDs and empty arrays.

---

## Remaining Refactoring Opportunities

| Priority | Issue |
|---|---|
| Medium | `getAccountSettings` in Vuex makes async API call inside a mutation — move to action |
| Medium | `btoa(username:password)` duplicated in `api.js` and `store/index.js` |
| Medium | `selectDropdownItem()` near-identical in `Members.vue`, `Events.vue`, `Comments.vue` |
| Low | `Helper.js` (17 lines, just `debounceEvent()`) should merge into `Util.js` |
| Low | Dead/commented-out code in `Util.js` and `Home.vue` |
| Low | `==` instead of `===` in 10+ files — enable ESLint `eqeqeq` |

---

## Custom WordPress Endpoints (InPursuit Plugin)

- `/wp-json/inpursuit/v1` — plugin validation
- `/wp-json/inpursuit/v1/verify/` — OTP send
- `/wp-json/inpursuit/v1/authentication/` — credential generation
- `/wp-json/inpursuit/v1/comments`, `/history`, `/settings`, `/analytics`, `/special-dates`
- `/push/vapid-public-key`, `/push/subscribe` — web push
