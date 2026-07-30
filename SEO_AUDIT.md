# SEO Audit & Strategy — New South Technologies (newsouthtechnologies.com)

**Audit date:** 2026-07-30
**Auditor scope:** Full technical + on-page + content + entity-disambiguation audit for Google, Bing, and AI answer engines.
**Primary business goal:** Be found by D.C.-area **federal civilian** and **state government** IT/procurement decision-makers for **legacy mainframe modernization** — and be reliably distinguished from the unrelated **NewSouth Technologies, Inc.** (newsouthtech.com, Raleigh NC, est. 1998).

---

## 0. Executive summary

The site is far more mature than a greenfield build: it already has `robots.txt`, `sitemap.xml`, a blog with canonical tags, three service pages with Service schema + Open Graph, a training portfolio page, federal proof points (UEI, SAM.gov status, designations), leadership bios (E-E-A-T), and an accessibility program. That is a strong foundation.

The material gaps are concentrated in three areas:

1. **The homepage — the most-linked, highest-authority page — has no canonical, no Open Graph/Twitter tags, and no `Organization` structured data at all.** For an entity-disambiguation problem, this is the single most damaging gap. Fixed in this pass.
2. **No entity/disambiguation layer exists anywhere.** There is no `Organization` schema with `address`, `foundingDate`, `sameAs`, or a description that separates us from the Raleigh company; no visible, crawlable "who we are / who we are *not*" content; no FAQ answering the confusion directly for AI answer engines. Built in this pass.
3. **Brand-string inconsistency actively *worsens* the confusion.** Several pages render the one-word **"NewSouth Technologies"** — which is the *competitor's* exact brand string — instead of our two-word **"New South Technologies."** (See §4.) Normalized in this pass.

A prioritized action list is in §11.

---

## 1. Page / route inventory

Static HTML site (Cloudflare Pages; `.html` extensions, some pretty-URL routes in sitemap). Pages found:

### Indexable marketing / content pages (keep in index)
| Route | Purpose |
|---|---|
| `/index.html` | Homepage — modernization, governed agility, responsible AI, leadership |
| `/modernization.html` | Service: federal legacy modernization |
| `/governed-agility.html` | Service: governed agility / DevSecOps |
| `/responsible-ai.html` | Service: responsible AI & data governance |
| `/training.html` | Certification training portfolio |
| `/request-training.html` | Training lead-capture form |
| `/case-studies.html` | Case studies (currently placeholder templates) |
| `/careers.html` | Careers + application form |
| `/blog.html` | Insights index |
| `/blog/strangler-fig-modernization.html` | Article |
| `/blog/fedramp-agile-atop.html` | Article |
| `/blog/governed-agility-vs-speed.html` | Article |
| `/blog/omb-m26-04-guide.html` | Article |
| `/blog/explainable-ai-xai.html` | Article |
| `/blog/cmmc-2-checklist.html` | Article |
| `/blog/5-signs-legacy-risk.html` | Article |
| `/cmmc-calculator.html` | Interactive CMMC 2.0 readiness tool |
| `/contact.html` | Contact |
| `/feedback.html` | Training feedback & quality |

### Legal / trust pages (keep, low priority)
`/privacy-policy.html`, `/privacy-form-submissions.html`, `/terms.html`, `/accessibility.html`, `/responsible-ai.html`

### Utility / internal / one-off pages — **should NOT be indexed** (see §5)
`/thanks.html`, `/cage.html`, `/download-crp.html`, `/customer-resolution-process.html`, `/resolution-summary.html`, `/feedback1.html`, `/pm-training-invoice.html`, `/pm-training-invoice-2024.html`, `/pm-training-invoice-2026.html`, `/QA-Peer-Review-Report.html`, `/visual.html`, `/accessible-comparison.html`, `/flywheel-explainer.html`

### Pages that DID NOT exist before this pass (built now — see §9)
`/about.html`, `/services.html`, `/capability-statement.html`, `/faq.html`, `/compliance-resources.html`, and a training/courses section: `/courses/fedramp-landing-zone-readiness.html`, `/courses/strangler-fig-migration-federal-it.html`, `/courses/legacy-mainframe-decoupling-bootcamp.html`.

---

## 2. Per-page title / meta description / heading audit (as found)

Titles were unique and mostly well-formed. Key findings:

- **Homepage title/description:** good ("New South Technologies | Federal Legacy Modernization & Governed AI"). Single H1, keyword-rich.
- **Service pages** (`modernization`, `governed-agility`, `responsible-ai`): unique titles, descriptions, single H1, Service JSON-LD, OG + Twitter present. Good.
- **Blog posts:** unique titles + descriptions, canonical present, single H1. **Missing:** OG/Twitter tags and `BlogPosting`/`Article` schema (weakens social + AI-answer surfacing).
- **Missing `<meta name="description">`:** `QA-Peer-Review-Report`, `accessible-comparison`, `cage`, `customer-resolution-process`, `flywheel-explainer`, `pm-training-invoice*`, `privacy-policy`, `thanks`, `visual`. Most of these should be `noindex` anyway (§5), so description is moot — but `privacy-policy.html` should get one.
- **Heading hierarchy:** single `<h1>` on every content page (good). `accessible-comparison.html`, `flywheel-explainer.html`, `visual.html` have **no H1** — acceptable only because they should be `noindex`.

---

## 3. Technical SEO presence/absence (as found)

| Signal | Status before this pass |
|---|---|
| `robots.txt` | ✅ Present, minimal, one sitemap directive (intentional re: Cloudflare managed block). |
| XML sitemap | ✅ Present, but missing the new pages and some blog posts; uses pretty URLs. |
| Canonical tags | ⚠️ Present on service pages + blog + a few others; **absent on homepage**, `index`, `training`, `contact`, `careers`, `blog.html`, `cmmc-calculator`, `feedback`. |
| Organization structured data | ❌ **Absent site-wide.** Only `Service` schema on 3 pages + one on cmmc-calculator. No `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Course`, or `Article`. |
| Open Graph | ⚠️ Only on 3 service pages + case-studies. **Absent on homepage** and everywhere else. |
| Twitter Card | ⚠️ Only on 3 service pages. Absent elsewhere. |
| Image alt text | ✅ Good — no `<img>` without `alt` found; decorative icons correctly use `alt="" aria-hidden`. |
| HTTPS enforcement | ⚠️ Site served over HTTPS via Cloudflare; no in-repo redirect/HSTS config confirmed. Recommend explicit HSTS + HTTP→HTTPS redirect at Cloudflare (see §8). All internal links already absolute-HTTPS or relative — good. |
| Mobile viewport | ✅ Present on every page. |
| `theme-color` | ✅ Present on main pages. |
| Favicon set | ✅ Present. |

---

## 4. Brand-string inconsistency — a disambiguation liability (critical)

The competitor's brand is the **one-word** string "NewSouth Technologies." Our brand is the **two-word** "New South Technologies." Rendering the one-word form on our own site trains crawlers and AI models to treat the strings as interchangeable — the opposite of what we need. Found on:

- `download-crp.html` — title "Download Customer Resolution Process — **NewSouth** Technologies"
- `feedback1.html` — title "Submit a Concern — **NewSouth** Technologies"
- `resolution-summary.html` — title "Customer Resolution Process — **NewSouth** Technologies"
- `cage.html` — "New South Technologies, **LLC**" (LLC suffix is fine and legally useful, but keep the two-word root)
- `data/company-profile.json` proc email / capability PDF filename uses `newsouth-...` slug (cosmetic, lower risk).

**Action:** normalize every visible instance to the two-word **"New South Technologies"** (or legal "New South Technologies, LLC"), and *never* the competitor's one-word form. Most affected pages are `noindex` utility pages, but the string still matters for any crawler that reaches them. Normalized in this pass.

**On-page reinforcement (answers brief item #5):** YES — the full two-word brand string *and* the specific domain should be rendered in visible copy near the logo/footer on every page, plus the D.C.-metro location, so users and crawlers always see a consistent, distinct brand entity (`New South Technologies · newsouthtechnologies.com · Washington, D.C. Metro`). Implemented in the footer brand block and the new About page.

---

## 5. Pages that should be `noindex`

These are internal, transactional, or duplicate and dilute crawl budget / risk ranking for the wrong queries. Add `<meta name="robots" content="noindex, follow">`:

`thanks.html`, `cage.html`, `download-crp.html`, `customer-resolution-process.html`, `resolution-summary.html`, `feedback1.html`, `pm-training-invoice.html`, `pm-training-invoice-2024.html`, `pm-training-invoice-2026.html`, `QA-Peer-Review-Report.html`, `visual.html`, `accessible-comparison.html`, `flywheel-explainer.html`.

(`feedback1.html` appears to be a duplicate/older variant of `feedback.html`; `resolution-summary.html` duplicates `customer-resolution-process.html` — noindex avoids duplicate-content signals.) Applied in this pass.

---

## 6. Core Web Vitals / page-speed assessment (static review)

No build step / bundler — plain HTML/CSS/vanilla JS, which is inherently fast. Observations:

- **Render-blocking:** Google Fonts loaded via blocking `<link>` in `<head>` on every page. `preconnect` is present (good). **Recommend:** add `&display=swap` (already present) and consider self-hosting Inter or adding `media="print" onload` swap; low priority given `display=swap` already mitigates FOIT.
- **Cookiebot script** loads early and blocking-mode auto — it is third-party and can delay interactivity; unavoidable for consent compliance but confirm it is `async`.
- **Images:** logos/badges are SVG (tiny, scalable — excellent). Two large team JPEGs (`eugene-nkomba_big.jpg`, `catherine-nkomba.JPEG` + `.jpg`) — ensure they are sized/compressed and add `loading="lazy"` + explicit `width`/`height` to prevent CLS. Homepage team photos currently lack `loading="lazy"` and intrinsic dimensions. **Recommended fix** (below-the-fold images only).
- **CSS:** multiple small stylesheets loaded per page; fine for HTTP/2 (Cloudflare). No obvious oversized bundle.
- **JS:** `defer` used on scripts (good, non-blocking).
- **No lazy-loading** attribute usage found on content images.

**Priority CWV actions:** add `loading="lazy"` + `width`/`height` to below-the-fold images (LCP/CLS); confirm Cloudflare Brotli + long cache headers on static assets; keep fonts on `display=swap`.

---

## 7. Accessibility issues that double as SEO issues

Accessibility is strong here (there is a dedicated a11y tooling pipeline, ARIA on interactive components, `sr-only` descriptions, semantic `<nav>/<main>/<header>/<footer>`). SEO-relevant items:

- **No missing alt text** found — good for image search + a11y.
- **Heading order:** clean single-H1 pattern on content pages. Verify no skipped levels within new pages (H1→H2→H3).
- **Link text:** mostly descriptive; a few "→"-only or icon links are paired with text (good).
- **Decorative SVGs** correctly `aria-hidden`.
- Ensure new pages preserve the semantic landmark structure and the skip pattern used site-wide.

---

## 8. HTTPS / security headers

- Site is on Cloudflare Pages (HTTPS by default). A prior commit "ship security headers" suggests a `_headers` file or Cloudflare rules exist.
- **Recommend confirming at Cloudflare / `_headers`:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, HTTP→HTTPS 301, `X-Content-Type-Options: nosniff`, and a canonical host redirect (`www` → apex or vice-versa) so only ONE hostname is indexed — important for entity consolidation.

---

## 9. Content gaps → new pages built this pass

| New page | Why it matters | Schema added |
|---|---|---|
| `/about.html` | E-E-A-T + the **primary disambiguation surface**: exact legal name, HQ metro, founding focus, niche, and an explicit "not affiliated with the Raleigh, NC firm" factual statement. | `Organization` (full), `BreadcrumbList` |
| `/services.html` | A crawlable services hub linking the three service pages; captures commercial-intent "federal modernization services" queries and improves internal linking. | `BreadcrumbList` |
| `/capability-statement.html` | Standard government-vendor artifact contracting officers look for; targets SAM.gov/NAICS/procurement queries. | `Organization` reference |
| `/faq.html` | Directly answers procurement + disambiguation questions ("Are you the same company as NewSouth Technologies in Raleigh?") — high value for **AI answer engines** (AI Overviews, Copilot, Perplexity). | `FAQPage` |
| `/compliance-resources.html` | FedRAMP-alignment hub; targets compliance-officer informational intent and earns topical authority. | `BreadcrumbList` |
| `/courses/fedramp-landing-zone-readiness.html` | Training + lead gen + topical authority + backlink magnet. | `Course` + lead form |
| `/courses/strangler-fig-migration-federal-it.html` | " | `Course` + lead form |
| `/courses/legacy-mainframe-decoupling-bootcamp.html` | " | `Course` + lead form |

---

## 10. Keyword strategy (clustered by intent, mapped to pages)

Filter applied to every term: *"Would a federal/state IT, compliance, or procurement decision-maker actually search this?"*

### A. Core service — commercial / procurement intent
| Keyword cluster | Target page |
|---|---|
| federal legacy modernization, government mainframe migration, legacy system modernization federal agency | `/modernization.html` |
| strangler fig migration federal, incremental mainframe modernization, no big-bang cutover migration | `/modernization.html`, `/courses/strangler-fig-...` |
| FedRAMP landing zone, FedRAMP-aligned cloud migration, continuous authorization DevSecOps | `/governed-agility.html`, `/compliance-resources.html` |
| governed agility federal IT, compliance-as-code pipeline government | `/governed-agility.html` |
| responsible AI government, NIST AI RMF, OMB M-26-04 unbiased LLM | `/responsible-ai.html` |
| federal modernization vendor, government IT modernization consultant D.C. | `/services.html`, `/index.html` |

### B. Compliance — informational intent
FedRAMP alignment checklist, NIST 800-53 controls mapping, CMMC 2.0 readiness, ATO without slowing agile, auditable modernization evidence → `/compliance-resources.html`, `/cmmc-calculator.html`, blog.

### C. Training — informational + lead intent
FedRAMP landing zone training, strangler-fig migration course federal IT, legacy mainframe decoupling bootcamp government, agile/SAFe certification for federal teams → `/training.html` + `/courses/*`.

### D. Procurement / government-specific
capability statement federal modernization, SAM.gov registered modernization vendor, 8(a) SDVOSB legacy modernization, NAICS 541512 541519 611430 vendor, D.C. metro federal IT contractor → `/capability-statement.html`, `/about.html`.

### E. Differentiation / branded (the terms we can actually own)
Do **not** fight for the bare "NewSouth Technologies" (27-year incumbent owns close variants). Instead own the **compound branded + service** long-tail:

- "New South Technologies federal legacy modernization"
- "New South Technologies FedRAMP mainframe"
- "New South Technologies strangler-fig migration"
- "New South Technologies Washington DC modernization"
- "New South Technologies capability statement"

These are low-competition, high-relevance, and unmistakably ours. Mapped to `/index.html`, `/about.html`, `/modernization.html`, `/capability-statement.html`.

---

## 11. Differentiation plan vs. NewSouth Technologies, Inc. (Raleigh)

| Signal | Them (newsouthtech.com) | Us (newsouthtechnologies.com) |
|---|---|---|
| Brand string | "NewSouth Technologies" (one word) | "New South Technologies" (two words) |
| Founded / HQ | 1998, Raleigh, NC | D.C. Metro |
| Market | State & **local** gov | **Federal civilian** + state gov |
| Domains | Health, Human Services, Criminal Justice, Education; PM/IV&V | **Legacy mainframe modernization**, FedRAMP landing zones, governed agility, responsible AI |
| Model | Staff-augmentation / IV&V consulting | Incremental strangler-fig migration w/ auditable compliance evidence |

**Tactics implemented (no disparagement — factual differentiators only):**

1. **`Organization` JSON-LD** on homepage + About with exact `name`, `url`, `logo`, `address` (Washington, D.C. metro), `foundingDate`, `description`, `knowsAbout`, and `sameAs` placeholders for LinkedIn/Crunchbase/SAM entity + (recommended) **Wikidata** item. Distinct `@id` anchored to our domain.
2. **About page disambiguation paragraph** stating our exact legal name, location, niche, and service model — phrased so AI answer engines can extract a clean "this is a different company" fact.
3. **FAQ entry** ("Is New South Technologies the same as NewSouth Technologies, Inc. of Raleigh, NC?") with `FAQPage` schema — the single most extractable format for AI Overviews / Copilot / Perplexity.
4. **Visible brand+domain+location string** in the footer brand block on every page.
5. **Brand-string normalization** across all pages (§4).
6. **Compound branded keyword targeting** (§10E) instead of the contested bare name.
7. **Recommended off-site (cannot be done in-repo, listed for the team):** create/point `sameAs` to a **Wikidata item**, LinkedIn Company Page, Crunchbase profile, and a **Google Business Profile + Bing Places** listing with the D.C.-metro service area. See §12.

---

## 12. Off-site / operational recommendations (not code — for the team)

1. **Google Business Profile:** create a Service-Area Business (no storefront needed) — name "New South Technologies," category "Software company / IT consultant," service area = Washington–Arlington–Alexandria DC-VA-MD metro. This is one of the strongest local-entity separators from a Raleigh company. A pre-filled field sheet is scaffolded at `/about.html` data + below.
2. **Bing Places for Business:** mirror the GBP listing; Bing's entity index is separate and also confuses similar names.
3. **Wikidata item:** create an item for "New South Technologies (Washington, D.C.)" with `instance of: business`, `country: USA`, `industry: IT modernization`, and an `official website` = newsouthtechnologies.com. Then add its URL to `sameAs`. No notability bar (unlike Wikipedia).
4. **LinkedIn + Crunchbase:** claim/verify company pages using the exact two-word name and D.C. location; add to `sameAs`.
5. **Bing Webmaster Tools + Google Search Console:** verify the domain (meta tag added for Bing in this pass — replace the placeholder token), submit `sitemap.xml`, and set the preferred domain.
6. **IndexNow:** enabled via a key file for instant Bing/Yandex indexing (scaffolded — see §13).
7. **Backlinks:** pursue gov-tech / training directory listings for the new `/courses/*` pages (e.g., training aggregators, GovTech, ACT-IAC) — these both build authority and reinforce the distinct entity.

### GBP / Bing Places field sheet (fill and submit)
```
Business name:      New South Technologies
Also lists domain:  newsouthtechnologies.com
Primary category:   Software Company  (secondary: Business Management Consultant)
Service area:       Washington, D.C.–Arlington–Alexandria (DC–MD–VA) metro
Description:        Federal legacy mainframe modernization for D.C.-area civilian
                    agencies and state governments using incremental strangler-fig
                    migration to FedRAMP-aligned landing zones with auditable
                    compliance at every step. (Not affiliated with NewSouth
                    Technologies, Inc. of Raleigh, NC.)
Contact:            info@newsouthtechnologies.com
```

---

## 13. Multi-engine & AI-answer-engine coverage

- **Google E-E-A-T:** leadership bios with named credentials already exist (Catherine A. Nkomba PMP/SPC6; Eugene-Patrice Nkomba MBA/MBB/PCC) — strengthened by linking them from About and adding author bylines to blog posts (recommended). `Organization` + `Person` linkage reinforces expertise.
- **Bing:** `msvalidate.01` verification meta added (placeholder token to replace); IndexNow key file scaffolded for instant submission.
- **AI answer engines (AI Overviews, Copilot, Perplexity, ChatGPT search):** the FAQ page + `FAQPage` schema + the About disambiguation paragraph are written as clean, extractable factual statements. Structured `Organization` data with `sameAs` gives these engines a machine-readable identity to cite, which is the mechanism by which they separate two similarly-named firms.

---

## 14. Prioritized action list

**P0 — entity/disambiguation (do first):**
1. ✅ Add `Organization` JSON-LD to homepage (name, url, logo, address, foundingDate, description, knowsAbout, sameAs). *(done)*
2. ✅ Homepage canonical + OG + Twitter. *(done)*
3. ✅ Build `/about.html` with disambiguation paragraph + full `Organization` schema. *(done)*
4. ✅ Build `/faq.html` with the "same company?" Q + `FAQPage` schema. *(done)*
5. ✅ Normalize all "NewSouth" → "New South" brand strings. *(done)*
6. ✅ Footer brand+domain+location string. *(done)*

**P1 — technical hygiene:**
7. ✅ `noindex` utility/duplicate pages. *(done)*
8. ✅ Add canonical to pages missing it (index, training, contact, careers, blog, cmmc-calculator, feedback). *(done)*
9. ✅ Update `sitemap.xml` with new pages; remove noindex pages. *(done)*
10. ✅ Bing verification meta + IndexNow key file. *(done)*
11. ◻️ Confirm HSTS + single-host redirect at Cloudflare. *(team/ops)*

**P2 — content & authority:**
12. ✅ `/services.html`, `/capability-statement.html`, `/compliance-resources.html`. *(done)*
13. ✅ Training/courses section (3 course pages) w/ `Course` schema + lead capture. *(done)*
14. ✅ OG/Twitter + `Article` schema on blog posts. *(done for new/edited; remaining blog OG recommended)*
15. ◻️ Fill real case-study content (currently placeholder). *(needs client-cleared data)*
16. ◻️ Add `loading="lazy"` + dimensions to below-fold images. *(done for team photos)*

**P3 — off-site (team):** GBP, Bing Places, Wikidata, LinkedIn/Crunchbase `sameAs`, GSC/BWT verification, backlink outreach (§12).

---

*Implementation details and the list of every file changed are in the final summary accompanying this audit.*
