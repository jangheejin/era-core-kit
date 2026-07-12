# Site Route Inventory & Deletion Plan — apps/site

- **Date:** 2026-07-12 02:22
- **Branch:** `refactor/site-route-inventory` @ `908e691` (working tree clean at investigation time)
- **Scope:** every route file under `apps/site/app` (`page.tsx`, `layout.tsx`, `route.ts`, loading/error/not-found). **No code was modified; this is a plan only.**
- **Found:** 31 `page.tsx` + 4 `layout.tsx` = **35 route files, 31 URLs**. Zero `route.ts` (no API routes), zero loading/error/not-found/template files, **no `next.config.*`, no `middleware.ts`** — routing is purely file-based, no rewrites/redirects can resurrect a deleted path.

> ⚠️ **Branch-base flag:** this branch's HEAD (`908e691`) does **not** contain the later pass-1 import-repoint commit (`d977d8f`), the ESLint flat-config migration, or the `/edit` page `setBlocks` fix (here `app/edit/page.tsx:47` still has `_setBlocks`, and old `@components/…`-style aliases are live). Route *structure* is identical, but the deletion branch should be cut from the tip that contains those fixes, not from here.

## Data-source legend

- **store** — `useAdminCaseStudies` / `useAdminClientPages` / `useAdminHomeContent` / `useAdminTeamMembers`: browser-localStorage demo stores. `AdminCaseStudyStore.tsx:2` says "only in memory for the current browser session" and seeds from `CASE_STUDIES_FIXTURE` (`:298`); `AdminClientPageStore.tsx:2` says "Demo-only client-side store (localStorage)".
- **fixtures (server)** — `@/lib/publicCaseStudiesRepo.server`, `@/lib/caseStudies`, `@/lib/tags`: server-side fixture-backed repo (DB/API is a TODO).

## 1. Route inventory table

Paths relative to `apps/site/app/`. "Linked from" = internal `href`/`router.push`/`window.open` evidence (file:line); "—" = zero inbound links found anywhere in the repo.

| # | File | URL | Data source | Linked from (evidence) | Superseded by | Class |
|---|------|-----|-------------|------------------------|---------------|-------|
| 1 | `layout.tsx` | (root layout) | Header/Footer chrome, Eruda dev tool | n/a | — | structural |
| 2 | `page.tsx` | `/` | store (via `HomeLayoutFromCMS` → `AdminHomeStore`) | Header/Footer brand, AdminTopNav "Public Site", admin dashboard | — | public, active |
| 3 | `(sector-pages)/[sector]/page.tsx` | `/{sector}` (top-level dynamic; falls back to tag render) | store (SectorPageView→`SectorPageClient`; `TagPageClient`) | **—** | overlaps #4 | public, duplicate — **human decision** |
| 4 | `sectors/[sector]/page.tsx` | `/sectors/{sector}` | store (same `SectorPageView`) | `admin/case-studies/list/ListClient.tsx:183` (preview `window.open`) | comment `:5` calls itself "the canonical sector archive route" | public, active (admin-driven) |
| 5 | `demo/page.tsx` | `/demo` | none — static stub; original `cms.get()` impl fully commented out (lines 2–16) | **—** | — | dev placeholder |
| 6 | `edit/page.tsx` | `/edit` | local mock state + `BlockRenderer` (block-editor sandbox) | **—** | — | dev tool (repaired on later branch, absent here) |
| 7 | `our-team/page.tsx` | `/our-team` | store (`TeamPageClient` → `AdminTeamStore`) | Header:47, Footer:43 | — | public, active |
| 8 | `our-work/page.tsx` | `/our-work` | store (`OurWorkOverviewClient` → case-study + home stores; `CaseGrid` links out to `/case-studies/{slug}`) | Header:41, Footer:37, `WorkWithCaseGridSmart.tsx:116` | — | public, active |
| 9 | `our-work/archive/page.tsx` | `/our-work/archive` | store (`OurWorkDataBridge` → `OurWorkClient`, links `/our-work/{slug}`) | Footer:59 | — | public, active |
| 10 | `our-work/[slug]/page.tsx` | `/our-work/{slug}` | **fixtures (server)** `getPublicCaseStudyBySlug` + `?demo=1` `DemoGate` | `OurWorkClient.tsx:79,145` (`${basePath}/${slug}`) | — | public, active — note data-source mismatch vs #15 |
| 11 | `tag/page.tsx` | `/tag` | fixtures (server) `getTagIndex` → `@/lib/tags` → `@/lib/caseStudies` | **—** | — | public index, unlinked — **human decision** |
| 12 | `tag/[tag]/page.tsx` | `/tag/{tag}` | store (`TagPageClient`) | `tag/page.tsx:19`, `ListClient.tsx:187` (preview) | — | public, active |
| 13 | `case-studies/layout.tsx` | (layout) | css only | n/a | — | structural |
| 14 | `case-studies/page.tsx` | `/case-studies` | store — page itself prints "Demo mode: these entries are stored in this browser (localStorage)" | `CaseStudyPublicClient.tsx:20,68,77` back-links | — | public, active (demo-labeled) |
| 15 | `case-studies/[slug]/page.tsx` | `/case-studies/{slug}` | store (`CaseStudyPublicClient`) | `packages/blocks CaseGrid.tsx:62`, `TagPageClient:41`, `ClientPagePublicClient:133`, client-pages mock `:119`, `our-work/page.tsx:359` | — | public, active |
| 16 | `case-studies/view/page.tsx` | `/case-studies/view?slug=…` | store; header `:3` "testing out an alternate single-view page"; stale comment `:58` "Replace this once there is a full edit page route" (that route now exists) | **—** | #15 + admin `mock/[slug]` | legacy experiment — **delete candidate** |
| 17 | `client-pages/[slug]/page.tsx` | `/client-pages/{slug}` | store ×2 (`ClientPagePublicClient`) | admin client-pages mock `:85` "Open public URL" | — | public, active (client deliverable) |
| 18 | `admin/layout.tsx` | (admin layout) | `AdminTopNav` | n/a | — | structural |
| 19 | `admin/page.tsx` | `/admin` | store ×2; dashboard cards (old fake-login + `CMSDashboard` version commented out at `:250`) | AdminTopNav NAV, back-links from creators | — | admin, active |
| 20 | `admin/home/page.tsx` | `/admin/home` | store (`AdminHomeStore`) | dashboard `:135,:138`; AdminTopNav active-state `:94` | — | admin, active |
| 21 | `admin/team/page.tsx` | `/admin/team` | store (`AdminTeamClient`) | AdminTopNav NAV `:62`, dashboard `:153,:156` | — | admin, active |
| 22 | `admin/case-studies/layout.tsx` | (layout) | css only | n/a | — | structural |
| 23 | `admin/case-studies/list/page.tsx` | `/admin/case-studies/list` | store (`ListClient`) | AdminTopNav, dashboard `:98`, back-links from nearly every admin page | — | admin, active (the "Database") |
| 24 | `admin/case-studies/new/page.tsx` | `/admin/case-studies/new` | store — **canonical creator** | AdminTopNav create-menu `:213`, `:228` (commented block), dashboard `:102,:224`, `ListClient:432`, mock page `:25,:44` | — | admin, active |
| 25 | `admin/case-studies/create/page.tsx` | `/admin/case-studies/create` | store; header `:3` literally says "**alternate create page**" and carries `new/page.tsx`'s path comment `:5` | **—** | #24 | legacy fork — **delete candidate** |
| 26 | `admin/case-studies/new-old/page.tsx` | `/admin/case-studies/new-old` | store; header `:1` is `new/page.tsx`'s path comment (fork) | **—** | #24 | legacy fork — **delete candidate** |
| 27 | `admin/case-studies/newalt/page.tsx` | `/admin/case-studies/newalt` | store; header `:1` is `new/page.tsx`'s path comment (fork) | **—** | #24 | legacy fork — **delete candidate** |
| 28 | `admin/case-studies/simple/page.tsx` | `/admin/case-studies/simple` | `CMSDashboard` from `@kit/blocks` (its **only** live consumer); self-describes as "Simple mock builder … the original simple creator", "Nothing is saved outside this browser tab" | **—** | #24 | mock/dev — **human decision (archive?)** |
| 29 | `admin/case-studies/edit/page.tsx` (+ `EditClient.tsx`) | `/admin/case-studies/edit` | store — **broken by construction**: page passes `params.slug` but the segment is static, so `slug` is always `undefined` → `EditClient.tsx:56` always renders "Not found." | **—** (all `/admin/case-studies/edit/{slug}` links go to #30) | #30 | vestigial + non-functional — **delete candidate (strongest)** |
| 30 | `admin/case-studies/edit/[slug]/page.tsx` | `/admin/case-studies/edit/{slug}` | store (`EditCaseStudyClient`) | `ListClient:638`, self `router.replace:430` | — | admin, active |
| 31 | `admin/case-studies/mock/[slug]/page.tsx` | `/admin/case-studies/mock/{slug}` | store; wraps the **public** `CaseStudyPublicClient` with an admin `ContextBanner` — it is the standard admin preview | post-save `router.push` from new`:364,:379`, create`:330,:338`, new-old`:218`, newalt`:229`; `ListClient:627`; `EditCaseStudyClient:447,:476`; `EditClient:74` | — | admin, **active despite "mock" name — keep** |
| 32 | `admin/client-pages/page.tsx` | `/admin/client-pages` | store (client pages) | AdminTopNav NAV, dashboard `:117`, editor back-links, public client page "Go to admin" `:77,:96` | — | admin, active |
| 33 | `admin/client-pages/new/page.tsx` | `/admin/client-pages/new` | `ClientPageEditor` (create mode) | AdminTopNav create-menu `:219`, dashboard `:121`, index `:18` | — | admin, active |
| 34 | `admin/client-pages/edit/[slug]/page.tsx` | `/admin/client-pages/edit/{slug}` | `ClientPageEditor` | index `:133`, editor self `router.replace:212,:234` | — | admin, active |
| 35 | `admin/client-pages/mock/[slug]/page.tsx` | `/admin/client-pages/mock/{slug}` | store ×2; header `:3`: "Admin preview route to view a client page's filtered case studies" | index `:126`, `ClientPageEditor:278` | — | admin, **active despite "mock" name — keep** |

## 2. Suspected duplicate route groups

1. **Sector archives — same view, two URLs.** `(sector-pages)/[sector]` (`/{sector}`) and `sectors/[sector]` (`/sectors/{sector}`) both render `SectorPageView` with `generateStaticParams` over `SECTOR_ROUTE_SLUG`. They are *not* byte-duplicates in behavior: the root route additionally falls back to `TagPageClient` for tag-shaped params (and therefore swallows every unknown single-segment URL). Comments contradict each other: root file says it was added for "prettier urls" and "renders the exact same sector archive page"; `sectors/[sector]/page.tsx:5` claims to be "the canonical sector archive route". Only `/sectors/…` has an inbound link (`ListClient:183`).
2. **Case-study creators (quartet).** `new` (canonical, all nav links) vs `create` ("alternate create page"), `new-old`, `newalt` — three forks of the same form writing to the same store, zero inbound links each. `simple` is a fifth, minimal creator via `CMSDashboard`.
3. **Case-study single views.** `/case-studies/[slug]` (store-backed, heavily linked) vs `/case-studies/view?slug=` (query-param experiment, unlinked) vs admin `mock/[slug]` (the same public client wrapped in a preview banner — this one is the *intended* admin duplicate, keep).
4. **Case-study editors.** `edit/[slug]` (active) vs bare `edit` (static segment reading `params.slug` → always "Not found").
5. **Public detail routes with different data.** `/our-work/[slug]` (server fixtures repo) vs `/case-studies/[slug]` (browser store): a case study created in the admin store renders at `/case-studies/{slug}` but 404s at `/our-work/{slug}`; fixture-only entries do the reverse. The two public grids even disagree: `/our-work` (index) links items to `/case-studies/{slug}` while `/our-work/archive` links to `/our-work/{slug}`. Behavior difference, not a safe dedupe — needs the data-source decision.

## 3. Public routes that must NOT be deleted

`/` · `/our-work` · `/our-work/archive` · `/our-work/[slug]` · `/our-team` · `/case-studies` · `/case-studies/[slug]` · `/client-pages/[slug]` · `/tag/[tag]` · `/sectors/[sector]` — all have live inbound links (table column 5) from public chrome (Header/Footer), `CaseGrid`/`OurWorkClient` item links, or admin preview flows. Root `layout.tsx` and the two css-only layouts are structural.

## 4. Admin routes that appear active

`/admin` (dashboard) · `/admin/home` · `/admin/team` · `/admin/case-studies/list` · `/admin/case-studies/new` · `/admin/case-studies/edit/[slug]` · `/admin/case-studies/mock/[slug]` · `/admin/client-pages` · `/admin/client-pages/new` · `/admin/client-pages/edit/[slug]` · `/admin/client-pages/mock/[slug]`. Evidence: `AdminTopNav` NAV array + create menu, dashboard cards, and the save/preview flows in `ListClient`, `EditCaseStudyClient`, `ClientPageEditor`. **Both `mock/[slug]` routes are the working preview surfaces of the CMS — the "mock" in the name refers to the demo store, not to dead code.**

## 5. Mock/dev-only routes (unreachable but plausibly useful as dev tools)

| Route | What it is | Still works? |
|---|---|---|
| `/edit` | Block-editor sandbox over `BlockRenderer` (the page just repaired on the eslint-branch lineage — that fix is not in this branch) | yes (mock data) |
| `/demo` | Static placeholder; real demo impl commented out | renders a heading only |
| `/admin/case-studies/simple` | "Original simple creator" — sole live consumer of `@kit/blocks` `CMSDashboard` | yes (tab-local) |
| `/case-studies/view?slug=…` | Alternate single-view design experiment (own `csView*` css classes) | yes, via query param |
| `/tag` | Tag index over server fixtures | yes, just unlinked |

## 6. Legacy/deprecated route candidates

- `admin/case-studies/create`, `new-old`, `newalt` — three forks of `new` (headers literally carry `new/page.tsx`'s path comment; `create` self-describes as "alternate create page"); zero inbound links; every nav/list/preview flow points at `new`.
- `admin/case-studies/edit/page.tsx` + `EditClient.tsx` — pre-`[slug]` editor, now unreachable *and* non-functional (static segment ⇒ `params.slug` undefined ⇒ unconditional "Not found.").
- `case-studies/view` — self-described experiment, superseded by `/case-studies/[slug]` (public) and `mock/[slug]` (admin preview); its "replace once there is a full edit page route" comment is satisfied by `edit/[slug]`.

## 7. Routes safe to delete now — with evidence

Each of these satisfies **all** of: (a) zero inbound `href`/`push`/`window.open` anywhere in the repo (checked `apps/site`, `packages`, `docs`, `codex`, `scripts` — only historical mentions in `codex/session-notes/2026-01-25_*.md`, a lint-session file list, not code); (b) no module imports its page file (`from ".../page"` has zero hits repo-wide); (c) no rewrites/middleware exist that could route to it; (d) an actively-linked superseding route exists.

| Delete | Files | Evidence summary |
|---|---|---|
| `/admin/case-studies/edit` (bare) | `admin/case-studies/edit/page.tsx`, `admin/case-studies/edit/EditClient.tsx` | Unreachable **and** always renders "Not found." (`params.slug` never populated on a static segment — `EditClient.tsx:56`); superseded by `edit/[slug]` which all links target (`ListClient:638`) |
| `/admin/case-studies/create` | `admin/case-studies/create/page.tsx` | Header `:3` "alternate create page"; fork of `new`; zero inbound; `new` is linked from AdminTopNav/dashboard/list/mock |
| `/admin/case-studies/new-old` | `admin/case-studies/new-old/page.tsx` | Fork of `new` (copied header `:1`); zero inbound |
| `/admin/case-studies/newalt` | `admin/case-studies/newalt/page.tsx` | Fork of `new` (copied header `:1`); zero inbound |
| `/case-studies/view` | `case-studies/view/page.tsx` | Header `:3` "testing out an alternate single-view page"; zero inbound; superseded by `/case-studies/[slug]` + admin `mock/[slug]` |

Residual risk (applies to all five): external bookmarks or out-of-repo docs could reference the URLs; nothing in-repo does. All five write only to the same localStorage store their replacements use, so no data-path is lost.

## 8. Routes needing a human decision — with the exact question

1. **`(sector-pages)/[sector]` vs `sectors/[sector]`** — *"Which public URL should sector archives live at: `/{sector}` (pretty, currently unlinked, also swallows unknown root paths as tag lookups) or `/sectors/{sector}` (what the admin list preview opens, self-labeled canonical)? The loser should be deleted or become a redirect, and `ListClient.tsx:183` updated if the root form wins."*
2. **`/edit`** — *"Keep `/edit` as the BlockRenderer dev sandbox (it was just made genuinely functional on the eslint-fix branch lineage) or archive it? Deleting it here would discard a page you just paid to repair."*
3. **`/demo`** — *"Delete the placeholder, or is a `/demo` route reserved for something planned? Its original implementation is fully commented out in-file."*
4. **`/admin/case-studies/simple`** — *"Archive or delete? It is the original simple creator and the only live consumer of `@kit/blocks`' exported `CMSDashboard`; removing the route orphans that package export (the component itself stays in the package either way)."*
5. **`/tag` (index)** — *"Nothing links to `/tag`. Should it be linked from public UI, kept as an unlinked utility, or removed? (`/tag/[tag]` stays regardless — it has inbound links.)"*
6. **Data-source split for public detail pages** — *"Long-term, is the public case-study detail URL `/case-studies/{slug}` (browser-store demo) or `/our-work/{slug}` (server fixtures)? Today `/our-work` index links to the former while `/our-work/archive` links to the latter, and the two routes see different data sets."*

## 9. Suggested next branch plan

**Base the branch on the tip that already contains `d977d8f` (import repoint), the ESLint flat config, and the `/edit` fix** — not on `908e691` (see flag at top).

- **Commit 1 — remove clearly dead routes** (no decisions needed): delete `admin/case-studies/create/`, `admin/case-studies/new-old/`, `admin/case-studies/newalt/`, `admin/case-studies/edit/page.tsx` + `admin/case-studies/edit/EditClient.tsx` (keep `edit/[slug]/`!), `case-studies/view/`. Verify: `pnpm --filter site lint`, `pnpm exec tsc --noEmit -p tsconfig.json` (from `apps/site`), site build, and `grep -rE "case-studies/(view|create|new-old|newalt)" apps/site` → no live hits.
- **Commit 2 — archive mock/dev routes per answers to §8 Q2–Q5**: move `/demo`, `/edit`, `/admin/case-studies/simple` (and `/tag` if unwanted) into `apps/site/__archive__/` (the new flat ESLint config already ignores `__archive__/**`) or delete them. Nothing else imports these page files, so moving them cannot break compilation, but confirm the tsconfig `include` doesn't sweep `__archive__` into typechecking.
- **Commit 3 — routing/link updates per §8 Q1 & Q6**: resolve the sector URL scheme (delete or redirect the loser; update `ListClient.tsx:183`), optionally surface `/tag`, and unify the case-study detail link targets (`our-work` index vs archive inconsistency).

## 10. Commands run

```
git branch --show-current ; git log --oneline -5 ; git status --short ; date +%Y-%m-%d_%H%M ; ls docs
Glob apps/site/app/**/{page,layout,route,loading,error,not-found,template,default}.{ts,tsx,js,jsx}
Grep '^import ...' over apps/site/app/**/{page,layout}.tsx            # per-route imports
Grep 'href=/… | router.push | redirect( | <Link' over apps/site/**/*.{ts,tsx}   # link graph
Read: both sector pages, tag pages, case-studies index/view, create/new/new-old/newalt/simple heads,
      edit(bare)+EditClient, both mock/[slug] pages, SectorPageView/SectorPageClient, TagPageClient,
      AdminCaseStudyStore, our-work {page,DataBridge,[slug]}, OurWorkOverviewClient, AdminTopNav,
      admin/page.tsx (commented CMSDashboard block), demo page, src/lib/tags.ts
Grep 'localStorage|CASE_STUDIES_FIXTURE' over app/admin/Admin*Store.tsx
Grep link-targets for view/create/new-old/newalt/simple//edit//demo + '/sectors/' + hrefBase|basePath
Grep 'href=|Link|push(' over packages/blocks/src                      # CaseGrid links
Grep 'from ".../page"' repo-wide (zero hits) ; grep CMSDashboard consumers
ls apps/site/next.config* ; ls apps/site/middleware.*                 # none exist
grep -rnE 'case-studies/(view|create|new-old|newalt|simple)|case-studies/edit["'"'"'`/]' packages docs codex scripts *.md
git show HEAD history checks: git log --oneline --follow -- app/edit/page.tsx (earlier session)
```

## 11. git status --short (at investigation end, before this report file was created)

```
(clean — no output)
```

After this report is written, the only change will be: `?? docs/site-route-inventory-2026-07-12_0222.md`.
