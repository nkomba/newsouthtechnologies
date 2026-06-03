New South Technologies — Project Blueprint
README.md
New South Technologies — Static Website
Project Overview
New South Technologies is a D.C.-metro IT consulting firm specializing in legacy modernization, governed agility, and responsible AI adoption for civilian federal agencies and state/local governments (VA/MD/DC). The website positions the firm not as a generic IT vendor, but as a governance-first transformation partner — the firm that turns AI-enabled modernization into something OIGs, state auditors, and councils can clearly understand and defend.

Live URL: newsouthtech.com (via Cloudflare Pages) Repository: new-south-technologies (GitHub) Deployment: Automatic via Cloudflare Pages on push to main

Target Audience
Primary: CIOs, CXOs, and Program Directors at cabinet-level civilian federal agencies
Secondary: CIOs and IT leadership at Virginia, Maryland, and D.C. state/local government agencies
Tertiary: Federal procurement officers evaluating vendors for modernization RFIs
Mindset of the Visitor: Risk-averse, oversight-conscious, understaffed, pressured to show measurable outcomes. They distrust buzzwords. They need to see governance, auditability, and risk reduction — not innovation theater.

Brand Positioning
One-Line Value Proposition: "Modernization with audit-ready governance — for agencies that answer to OIGs, not just CIOs."

Tone & Voice:

Direct, institutional, and reassuring
No "synergy," no "paradigm shift," no "best-in-class"
Lead with risk language, then resolve it
Write for someone who will print this page and hand it to an Inspector General
Visual Identity — "Institutional Clarity":

Calm, diagram-rich, low-stock-photo aesthetic
Typography: Humanist sans-serif (e.g., Inter) — legible, serious, modern-but-not-startup
Color Palette: Deep navy primary, slate grey secondary, muted teal accent (distinct from generic "federal blue"), off-white backgrounds
Imagery: Architecture diagrams, governance flowcharts, before/after state visuals — NOT stock photos of people pointing at screens
Whitespace: Generous. Signals confidence and seriousness.
Core Differentiation (vs. Competitor Weaknesses)
Competitor Weakness	Our Counter-Move
Abstract tech visuals, no concrete outcomes	Before/after architecture diagrams showing legacy → governed cloud
Governance described in text, never shown	Visual governance workflows with decision gates and control points
Outcome opacity — no visible risk reduction metrics	Stepwise compliance posture improvement visuals
Dense, overloaded pages	Clean hierarchy: one idea per section, scannable in 60 seconds
Generic patriotic imagery	Institutional, oversight-friendly aesthetic
Folder Structure
/new-south-technologies
├── index.html                  # Homepage (single-page site, MVP)
├── README.md                   # This file
├── css/
│   └── style.css               # All styles: variables, components, responsive
├── js/
│   └── main.js                 # All interactions: slider, mobile menu, smooth scroll
├── assets/
│   ├── images/
│   │   ├── logo.svg            # New South Technologies wordmark + mark
│   │   ├── icon-modernize.svg  # Outcome Card 1 icon
│   │   ├── icon-agility.svg    # Outcome Card 2 icon
│   │   ├── icon-ai.svg         # Outcome Card 3 icon
│   │   ├── badge-fedramp.svg   # Compliance bar badge
│   │   ├── badge-nist.svg      # Compliance bar badge
│   │   ├── badge-cmmc.svg      # Compliance bar badge
│   │   ├── badge-zerotrust.svg # Compliance bar badge
│   │   ├── badge-omb-m26.svg   # Compliance bar badge (OMB M-26-04)
│   │   ├── hero-pattern.svg    # Subtle background pattern (geometric nodes)
│   │   └── favicon.svg         # Browser tab icon
│   └── fonts/
│       └── (Google Fonts via CDN — no local font files for MVP)
├── .gitignore                  # Exclude DS_Store, etc.
└── _headers                    # Cloudflare Pages security headers
Homepage Content Architecture
Section 1: Navigation Bar
Left: Logo SVG (mark + "New South Technologies")
Right (Desktop): Modernize | Governed Agile | Responsible AI | Request a Compliance Audit (primary CTA button)
Right (Mobile): Hamburger menu icon
Behavior: Sticky on scroll. Background becomes opaque white on scroll.
Section 2: Hero
Background: Deep navy gradient with subtle hero-pattern.svg overlay (geometric node/connection lines at ~5% opacity — suggests network/architecture without being distracting)
Headline (H1):
Modernize Critical Systems with Zero Unplanned Downtime — and Full Auditability at Every Step.

Sub-headline:
We help civilian agencies and state governments turn high-risk legacy platforms into FedRAMP-aligned, governed cloud services — with compliance controls inspectors can follow.

Primary CTA: View Our Transformation Framework (links to Outcome Grid)
Secondary CTA: Request a Compliance Audit (links to Footer contact)
Note: No hero image. The typography and pattern carry the weight. White space is the design element.
Section 3: Compliance & Trust Bar
Background: White with subtle bottom border
Label (small caps, centered above badges): "BUILT FOR THE COMPLIANCE FRAMEWORKS THAT GOVERN YOUR MISSION"
Badges (horizontal row, evenly spaced):
Badge	Text Label
badge-fedramp.svg	FedRAMP Aligned
badge-nist.svg	NIST 800-53
badge-cmmc.svg	CMMC 2.0 Ready
badge-zerotrust.svg	Zero Trust Architecture
badge-omb-m26.svg	OMB M-26-04 Compliant
Behavior: On mobile, badges scroll horizontally or stack into a 2-column grid.
Section 4: Outcome Grid (3 Cards)
Section Header:
H2: "Outcomes Over Output"
Supporting text: "We don't count story points. We retire technical debt, tighten controls, and deliver modernization wins your OIG can verify."
Card 1: Modernization with Purpose

Icon: icon-modernize.svg (stylized mainframe-to-cloud transformation arrow)
H3: "Modernization with Purpose"
Body: "We decouple business logic from legacy mainframes using incremental strangler-fig patterns — no big-bang cutover, no mission disruption. Every migration step produces a FedRAMP-aligned landing zone and a compliance posture your auditors can trace."
Link: "See Our Modernization Approach →"
SEO keywords embedded: legacy modernization, mainframe to cloud, FedRAMP-aligned
Card 2: Governed Agility

Icon: icon-agility.svg (stylized governance gate/pipeline)
H3: "Governed Agility"
Body: "DevSecOps pipelines that audit themselves. Agile governance frameworks that teach PMOs and CIOs how to fund outcomes instead of outputs. We embed with your teams until governed delivery is how you work — not just what you say."
Link: "Explore Governed Agile Framework →"
SEO keywords embedded: governed agile, DevSecOps, agile governance, CMMC-ready
Card 3: Responsible AI

Icon: icon-ai.svg (stylized human-in-the-loop decision node)
H3: "Responsible AI & Data Governance"
Body: "From hype to trustworthy decision support. We implement explainable AI (XAI), model risk management, and data fabric strategies aligned with OMB M-26-04 and NIST's AI Risk Management Framework. Every model we deploy has an audit trail an Inspector General can follow."
Link: "Download Our AI Governance Playbook →"
SEO keywords embedded: responsible AI, explainable AI, AI governance, OMB M-26-04, data governance
Section 5: Interactive Transformation Demo
Background: Slate grey (visual break from white)
H2: "Experience the Transformation"
Supporting text: "See how governed modernization replaces legacy risk with auditable cloud services."
Interactive Element: Split-screen slider (range input controlling clip-path)
Left layer (Legacy): Styled as tangled, muted architecture diagram. Label: "LEGACY: COBOL / Siloed Data / Manual Compliance"
Right layer (Modern): Styled as clean, connected architecture. Label: "MODERN: Containerized / Unified Data / Automated Governance"
Below slider: Caption — "Drag to see the difference. Our strangler-fig approach moves you from left to right without stopping the mission."
Section 6: Regional & Vertical Signal
Background: Off-white
Content: A concise statement establishing D.C. metro credibility
H2: "Rooted in the Capital Region"
Body: "New South Technologies serves civilian cabinet agencies, Virginia and Maryland state governments, and D.C. local agencies. We understand the oversight landscape because we live in it."
Three sub-items (simple text + icon row):
Icon Concept	Label	Detail
Capitol dome outline	Federal Civilian	Cabinet agencies, independent agencies, GSA schedules
State outline (VA/MD/DC)	State & Local	VA, MD, DC government modernization initiatives
Handshake-outline	SLED Advisory	CIO advisory for state/local IT portfolio rationalization
Section 7: Social Proof / Executive Validation
Background: White
H2: "Trusted by Leaders Who Answer to Inspectors General"
Two testimonial blocks (placeholder — replace with real client quotes):
"They didn't just modernize our systems — they gave us a governance framework our OIG could actually follow. That's rare." — CIO, Cabinet-Level Agency
"New South understood that in state government, speed without auditability isn't progress — it's risk." — CTO, State Agency (VA)
Section 8: Footer (Conversion & Credentials)
Background: Deep navy
Four columns (desktop) / stacked (mobile):
Column	Content
Brand	Logo + one-liner: "Governance-first modernization for the capital region."
Capabilities	Modernize | Governed Agile | Responsible AI | Strategy-to-Execution
Credentials	Active Clearances: Secret, TS/SCI | Certifications: PMP, SAFe, AWS GovCloud
Contact	Email link, "Request a Compliance Audit" CTA button, small physical location: "Washington, D.C. Metro"
Bottom bar: © 2026 New South Technologies. Privacy Policy | Terms
SEO & Meta Strategy
Title Tag: New South Technologies | Federal Legacy Modernization & Governed AI — D.C. Metro

Meta Description: We help civilian agencies and state governments modernize legacy systems with audit-ready governance, FedRAMP-aligned cloud migration, and responsible AI deployment. Washington D.C. metro area.

Open Graph:

Title: Same as title tag
Description: Same as meta description
Image: logo.svg on navy background (1200x630 canvas)
Canonical URL: https://newsouthtech.com/

Structured Data (JSON-LD in <head>):

@type: Organization
name: New South Technologies
areaServed: Washington D.C. Metropolitan Area
serviceType: IT Consulting, Legacy Modernization, AI Governance
SVG Asset Manifest
Filename	Description	Design Notes
logo.svg	Primary logo: geometric mark + wordmark	Mark: abstract "NST" monogram or interconnected nodes suggesting governed architecture. Wordmark: "NEW SOUTH TECHNOLOGIES" in Inter Bold. Colors: Navy + Teal accent.
favicon.svg	Browser tab icon	Simplified version of logo mark only, 32x32 viewBox
icon-modernize.svg	Outcome Card 1 icon	Stylized mainframe block morphing into cloud node. Monoline style. Uses currentColor.
icon-agility.svg	Outcome Card 2 icon	Stylized pipeline with governance gate/checkpoint. Monoline style. Uses currentColor.
icon-ai.svg	Outcome Card 3 icon	Human silhouette with decision node loop (human-in-the-loop). Monoline style. Uses currentColor.
badge-fedramp.svg	Compliance badge	Shield outline with "FR" or cloud symbol. Monochrome. Scalable to ~48px height.
badge-nist.svg	Compliance badge	Shield/lock outline with "NI" or standards symbol.
badge-cmmc.svg	Compliance badge	Shield outline with "CM" or certification check.
badge-zerotrust.svg	Compliance badge	Circle with segmented ring (zero trust ring).
badge-omb-m26.svg	Compliance badge	Document/shield with "AI" indicator (representing OMB M-26-04 AI guidance).
hero-pattern.svg	Hero background overlay	Geometric pattern: thin lines connecting small dots/nodes at intersections. ~5% opacity when rendered. Repeatable tile or full-width. Navy colored.
SVG Conventions:

All icons use fill="currentColor" or stroke="currentColor" for CSS color control
All files include proper viewBox and xmlns
No embedded fonts in SVGs — use paths only
Optimize with SVGO or equivalent before deployment
JavaScript Functionality Requirements
Function Name	Purpose	Trigger
initSlider()	Control the split-screen transformation slider (update clip-path based on range input)	input event on #sliderInput
initSmoothScroll()	Smooth scroll to anchor sections on CTA clicks	click event on a[href^="#"]
initMobileMenu()	Toggle mobile nav visibility	click event on hamburger icon
initStickyNav()	Add background opacity on scroll past hero	scroll event with throttling
Cloudflare Pages Configuration
# wrangler.toml (if using Wrangler CLI)
name = "new-south-technologies"
compatibility_date = "2026-06-03"
pages_build_output_dir = "."
Build Settings (Cloudflare Dashboard):

Framework: None (static)
Build command: (empty)
Output directory: . (root)
_headers file (security hardening):

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:;
Next Steps
Step	Owner	Output
1. Review & approve this README	You	Confirmed blueprint
2. Generate index.html	Claude	Semantic, accessible markup
3. Generate css/style.css	Claude	Component styles with CSS variables
4. Generate js/main.js	Claude	Modular, vanilla JS interactions
5. Generate SVG assets	Claude	All 11 files from manifest
6. Local assembly & test	You	Working site in browser
7. Push to GitHub	You	main branch populated
8. Connect Cloudflare Pages	You	Auto-deploy on push
9. Configure custom domain	You	newsouthtech.com live
10. Replace placeholder testimonials	You	Real client quotes
Ready for Phase 2 (HTML Generation) on your approval.