#!/usr/bin/env python3
"""One-off generator for New South Technologies SEO pages.
Produces About, Services, Capability Statement, Compliance Resources, FAQ, and
three Course pages with consistent nav/footer + per-page structured data.
Re-runnable: overwrites only the generated files."""
import json, os

OG_IMG = "https://newsouthtechnologies.com/assets/images/og-image.png"
BASE = "https://newsouthtechnologies.com/"

ORG_LD = {
    "@context": "https://schema.org", "@type": "Organization",
    "@id": BASE + "#organization",
    "name": "New South Technologies", "legalName": "New South Technologies, LLC",
    "url": BASE, "logo": OG_IMG, "image": OG_IMG,
    "description": ("New South Technologies is a Washington, D.C. metro area firm that helps "
        "federal civilian agencies and state governments modernize legacy mainframe systems "
        "using incremental strangler-fig migration to FedRAMP-aligned cloud landing zones, "
        "producing an auditable compliance posture at every step. Not affiliated with "
        "NewSouth Technologies, Inc. of Raleigh, North Carolina."),
    "foundingDate": "2019",
    "address": {"@type": "PostalAddress", "addressLocality": "Washington",
                "addressRegion": "DC", "addressCountry": "US"},
    "areaServed": [
        {"@type": "AdministrativeArea", "name": "Washington, D.C. Metropolitan Area (DC-MD-VA)"},
        {"@type": "Country", "name": "United States"}],
    "knowsAbout": ["Federal legacy mainframe modernization", "Strangler-fig migration",
        "FedRAMP-aligned landing zones", "Governed agility and DevSecOps",
        "NIST 800-53 and continuous authorization", "Responsible AI and NIST AI RMF governance"],
    "contactPoint": [
        {"@type": "ContactPoint", "contactType": "sales", "email": "info@newsouthtechnologies.com",
         "areaServed": "US", "availableLanguage": "English"},
        {"@type": "ContactPoint", "contactType": "procurement", "email": "procurement@newsouthtechnologies.com",
         "areaServed": "US"}],
    "sameAs": []
}

def ld(obj):
    body = json.dumps(obj, indent=2).replace("\n", "\n    ")
    return '    <script type="application/ld+json">\n    ' + body + '\n    </script>\n'

def crumbs(items, prefix):
    els = []
    for i, (name, url) in enumerate(items, 1):
        el = {"@type": "ListItem", "position": i, "name": name}
        if url: el["item"] = url
        els.append(el)
    return ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": els})

def head(title, desc, canonical, extra="", prefix="./", keywords=""):
    kw = f'\n    <meta name="keywords" content="{keywords}">' if keywords else ""
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{desc}">{kw}
    <meta name="theme-color" content="#0F172A">
    <title>{title}</title>
    <link rel="canonical" href="{canonical}">


    <meta property="og:type" content="website">
    <meta property="og:site_name" content="New South Technologies">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="{OG_IMG}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title}">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="{OG_IMG}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="{prefix}favicon.ico" sizes="any">
    <link rel="icon" href="{prefix}favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{prefix}apple-touch-icon.png">
    <link rel="stylesheet" href="{prefix}css/style.css">
    <link rel="stylesheet" href="{prefix}css/article.css">
{extra}</head>
<body>
'''

def nav(active, prefix="./"):
    c = lambda n: ' aria-current="page"' if n == active else ''
    return f'''    <nav class="navbar">
        <div class="container nav-inner">
            <a href="{prefix}index.html" class="logo" aria-label="New South Technologies Home">
                <img src="{prefix}assets/images/logo-lockup.svg" alt="New South Technologies Logo" class="logo-img">
            </a>
            <button class="mobile-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Toggle navigation menu">
                <span class="hamburger-icon"></span>
            </button>
            <ul id="main-nav" class="nav-links">
                <li><a href="{prefix}index.html"{c('home')}>Home</a></li>
                <li><a href="{prefix}services.html"{c('services')}>Services</a></li>
                <li><a href="{prefix}training.html"{c('training')}>Training</a></li>
                <li><a href="{prefix}about.html"{c('about')}>About</a></li>
                <li><a href="{prefix}capability-statement.html"{c('cap')}>Capability</a></li>
                <li><a href="{prefix}blog.html"{c('blog')}>Insights</a></li>
                <li><a href="{prefix}index.html#contact" class="btn btn-primary">Request Audit</a></li>
            </ul>
        </div>
    </nav>
'''

def footer(prefix="./"):
    return f'''    <footer id="contact">
        <div class="container footer-grid">
            <div class="footer-brand">
                <h3>New South Technologies</h3>
                <p class="footer-brand-id">newsouthtechnologies.com &middot; Washington, D.C. Metro</p>
                <p>Federal legacy mainframe modernization for D.C.-area civilian agencies and state governments.</p>
                <p class="footer-disambig"><small>New South Technologies, LLC is a Washington, D.C. metro firm and is not affiliated with NewSouth Technologies, Inc. of Raleigh, North Carolina.</small></p>
            </div>
            <div class="footer-links">
                <h4>Company</h4>
                <ul>
                    <li><a href="{prefix}about.html">About</a></li>
                    <li><a href="{prefix}services.html">Services</a></li>
                    <li><a href="{prefix}capability-statement.html">Capability Statement</a></li>
                    <li><a href="{prefix}compliance-resources.html">Compliance Resources</a></li>
                    <li><a href="{prefix}faq.html">FAQ</a></li>
                    <li><a href="{prefix}case-studies.html">Case Studies</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>Capabilities</h4>
                <ul>
                    <li><a href="{prefix}modernization.html">Modernize</a></li>
                    <li><a href="{prefix}governed-agility.html">Governed Agile</a></li>
                    <li><a href="{prefix}responsible-ai.html">Responsible AI</a></li>
                    <li><a href="{prefix}training.html">Training</a></li>
                    <li><a href="{prefix}careers.html">Careers</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h4>Contact</h4>
                <a href="mailto:info@newsouthtechnologies.com" class="btn btn-primary">Request a Compliance Audit</a>
                <p>Washington, D.C. Metro</p>
            </div>
        </div>
        <div class="footer-bottom">
            <nav class="footer-nav" aria-label="Legal">
                <a href="{prefix}privacy-policy.html">Privacy Policy</a>
                <a href="{prefix}privacy-form-submissions.html">Form Submissions Notice</a>
                <a href="{prefix}accessibility.html">Accessibility</a>
                <a href="{prefix}terms.html">Terms of Service</a>
                <a href="{prefix}contact.html">Contact</a>
            </nav>
            <p>&copy; 2026 New South Technologies, LLC. All rights reserved.</p>
        </div>
    </footer>
    <script src="{prefix}js/main.js" defer></script>
</body>
</html>
'''

def page(fname, title, desc, canonical, active, main_html, extra="", prefix="./", keywords=""):
    html = head(title, desc, canonical, extra, prefix, keywords) + nav(active, prefix) + \
           "    <main>\n" + main_html + "\n    </main>\n" + footer(prefix)
    with open(fname, "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print("wrote", fname)

# ---------------------------------------------------------------- ABOUT
about_extra = ld(ORG_LD) + crumbs([("Home", BASE), ("About", BASE + "about.html")], "./")
about_main = '''        <header class="hero hero--interior">
            <div class="container hero-content">
                <h1>About New South Technologies</h1>
                <p>A Washington, D.C. metro firm built to modernize federal legacy mainframes without mission disruption &mdash; and to prove compliance at every step.</p>
            </div>
        </header>

        <section class="section">
            <div class="container">
                <h2>Who we are</h2>
                <p><strong>New South Technologies, LLC</strong> is a technology modernization firm headquartered in the <strong>Washington, D.C. metropolitan area (DC&ndash;MD&ndash;VA)</strong>. We help <strong>federal civilian agencies</strong> and <strong>state governments</strong> retire high-risk legacy mainframe systems and move to <strong>FedRAMP-aligned cloud landing zones</strong> using an incremental <strong>&ldquo;strangler-fig&rdquo; migration</strong> pattern &mdash; no big-bang cutover, no mission downtime, and an auditable compliance posture at every step.</p>
                <p>Our practice is deliberately narrow: legacy decoupling, governed agility (compliance-as-code DevSecOps), and responsible AI governance for the public sector. Every engagement ships with the evidence trail that Authorizing Officials, auditors, and Inspectors General actually ask for.</p>
            </div>
        </section>

        <section class="section section--alt" aria-labelledby="disambig">
            <div class="container">
                <h2 id="disambig">A note on our name (important)</h2>
                <p>Because company names in government IT can look alike, here is exactly who we are:</p>
                <ul class="fact-list">
                    <li><strong>Legal name:</strong> New South Technologies, LLC (two words &mdash; &ldquo;New South&rdquo;)</li>
                    <li><strong>Website:</strong> newsouthtechnologies.com</li>
                    <li><strong>Location:</strong> Washington, D.C. metropolitan area</li>
                    <li><strong>Focus:</strong> Federal civilian &amp; state legacy mainframe modernization, FedRAMP landing zones, governed agility, responsible AI</li>
                </ul>
                <p>We are <strong>not affiliated with NewSouth Technologies, Inc.</strong> (one word, &ldquo;NewSouth&rdquo;), a separate and unrelated company founded in 1998 and headquartered in Raleigh, North Carolina, that provides state and local government IT consulting at newsouthtech.com. The two firms have different owners, different locations, and different service focuses. If you are evaluating vendors, please confirm you are contacting <strong>New South Technologies, LLC of Washington, D.C.</strong> at <a href="mailto:info@newsouthtechnologies.com">info@newsouthtechnologies.com</a>.</p>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2>How we work</h2>
                <p>We plan, procure, and implement modernization one auditable step at a time. Business logic is decoupled from the mainframe incrementally; each slice lands in a governed, FedRAMP-aligned environment with identity, logging, encryption, and network controls documented from day one. Because controls are built into the pipeline rather than bolted on afterward, agencies move toward continuous authorization instead of a once-a-year scramble.</p>
                <div class="cta-row">
                    <a href="./services.html" class="btn btn-primary">Explore our services</a>
                    <a href="./capability-statement.html" class="btn btn-secondary">View capability statement</a>
                </div>
            </div>
        </section>

        <section class="section section--alt">
            <div class="container">
                <h2>Leadership</h2>
                <p>New South Technologies is led by practitioners with decades of federal and state modernization experience, holding active <strong>Secret</strong> and <strong>TS/SCI</strong> clearances and certifications including PMP, SAFe (SPC6), LSSMBB, CISA, CISM, and AWS GovCloud.</p>
                <div class="team-grid">
                    <article class="team-card">
                        <h3>Catherine A. Nkomba, PMP, SPC6</h3>
                        <p class="title">Co-Managing Partner</p>
                        <p>30+ years solving mission-critical challenges for federal and state agencies. Specializes in strategic team orchestration and building the governance frameworks that let innovation move safely.</p>
                    </article>
                    <article class="team-card">
                        <h3>Eugene-Patrice Nkomba, MBA, LSSMBB, PCC</h3>
                        <p class="title">Co-Managing Partner &amp; Executive Coach</p>
                        <p>30+ years bridging technology strategy and human performance. A Six Sigma Master Black Belt and ICF-credentialed coach who aligns leadership behavior with rigorous governance during high-stakes transformations.</p>
                    </article>
                </div>
            </div>
        </section>
'''
page("about.html", "About New South Technologies | Federal Legacy Modernization (Washington, D.C.)",
     "New South Technologies, LLC is a Washington, D.C. metro firm modernizing federal legacy mainframes with strangler-fig migration to FedRAMP-aligned cloud. Not affiliated with NewSouth Technologies, Inc. of Raleigh, NC.",
     BASE + "about.html", "about", about_main, about_extra,
     keywords="New South Technologies, about New South Technologies, federal legacy modernization firm, Washington DC modernization, New South Technologies LLC")

# ---------------------------------------------------------------- SERVICES
services_extra = crumbs([("Home", BASE), ("Services", BASE + "services.html")], "./")
services_main = '''        <header class="hero hero--interior">
            <div class="container hero-content">
                <h1>Federal Modernization Services</h1>
                <p>Three tightly-integrated practices that take D.C.-area civilian agencies and state governments from brittle legacy systems to governed, auditable cloud.</p>
            </div>
        </header>
        <section class="section">
            <div class="container">
                <div class="grid">
                    <article class="card">
                        <h2><a href="./modernization.html">Legacy Modernization</a></h2>
                        <p>Incremental strangler-fig migration off mainframes to FedRAMP-aligned cloud &mdash; no big-bang cutover, no mission disruption, audit-ready evidence at every step.</p>
                        <a href="./modernization.html" class="btn btn-outline">Learn more &rarr;</a>
                    </article>
                    <article class="card">
                        <h2><a href="./governed-agility.html">Governed Agility &amp; DevSecOps</a></h2>
                        <p>Compliance-as-code pipelines that embed NIST 800-53 controls into delivery, moving agencies toward continuous authorization without slowing releases.</p>
                        <a href="./governed-agility.html" class="btn btn-outline">Learn more &rarr;</a>
                    </article>
                    <article class="card">
                        <h2><a href="./responsible-ai.html">Responsible AI &amp; Data Governance</a></h2>
                        <p>AI systems that pass audit: explainability, bias mitigation, and continuous monitoring on the NIST AI RMF, ready for OMB M-26-04 procurement.</p>
                        <a href="./responsible-ai.html" class="btn btn-outline">Learn more &rarr;</a>
                    </article>
                </div>
            </div>
        </section>
        <section class="section section--alt">
            <div class="container">
                <h2>Training &amp; enablement</h2>
                <p>We also transfer these capabilities to your teams through hands-on courses &mdash; from <a href="./courses/fedramp-landing-zone-readiness.html">FedRAMP Landing Zone Readiness</a> to the <a href="./courses/legacy-mainframe-decoupling-bootcamp.html">Legacy Mainframe Decoupling Bootcamp</a>. See the full <a href="./training.html">training portfolio</a>.</p>
                <div class="cta-row">
                    <a href="./capability-statement.html" class="btn btn-primary">Capability statement</a>
                    <a href="./compliance-resources.html" class="btn btn-secondary">Compliance resources</a>
                </div>
            </div>
        </section>
'''
page("services.html", "Federal Modernization Services | New South Technologies",
     "Federal legacy modernization, governed agility/DevSecOps, and responsible AI governance for D.C.-area civilian agencies and state governments from New South Technologies.",
     BASE + "services.html", "services", services_main, services_extra,
     keywords="federal modernization services, government IT modernization, FedRAMP migration services, governed agility, responsible AI government")

# ---------------------------------------------------------------- CAPABILITY STATEMENT
cap_extra = ld(ORG_LD) + crumbs([("Home", BASE), ("Capability Statement", BASE + "capability-statement.html")], "./")
cap_main = '''        <header class="hero hero--interior">
            <div class="container hero-content">
                <h1>Capability Statement</h1>
                <p>The company data, core competencies, and differentiators a contracting officer needs &mdash; in one place.</p>
            </div>
        </header>
        <section class="section">
            <div class="container">
                <h2>Company data</h2>
                <div class="fed-grid">
                    <div class="fed-item"><span class="fed-label">Legal name</span><span class="fed-value">New South Technologies, LLC</span></div>
                    <div class="fed-item"><span class="fed-label">Location</span><span class="fed-value">Washington, D.C. Metro (DC&ndash;MD&ndash;VA)</span></div>
                    <div class="fed-item"><span class="fed-label">SAM.gov</span><span class="fed-value">Registered &amp; active</span></div>
                    <div class="fed-item"><span class="fed-label">UEI</span><span class="fed-value">MCWZEB6BM5C5</span></div>
                    <div class="fed-item"><span class="fed-label">CAGE Code</span><span class="fed-value">Available on request</span></div>
                    <div class="fed-item"><span class="fed-label">NAICS</span><span class="fed-value">541512 &middot; 541519 &middot; 541611 &middot; 611430</span></div>
                    <div class="fed-item"><span class="fed-label">Designations</span><span class="fed-value">Small Business &middot; 8(a) / SDB &middot; SDVOSB / VOSB</span></div>
                    <div class="fed-item"><span class="fed-label">Contract vehicles</span><span class="fed-value">Available for teaming &amp; subcontracting</span></div>
                </div>
            </div>
        </section>
        <section class="section section--alt">
            <div class="container">
                <h2>Core competencies</h2>
                <ul class="fact-list">
                    <li>Federal legacy mainframe modernization &amp; application decoupling (strangler-fig pattern)</li>
                    <li>FedRAMP-aligned landing-zone design and build (identity, logging, encryption, network)</li>
                    <li>Governed agility / DevSecOps &amp; continuous authorization (NIST SP 800-53)</li>
                    <li>Responsible AI &amp; data governance (NIST AI RMF, OMB M-26-04 readiness)</li>
                    <li>Compliance evidence packaging for ATO, OIG, and audit</li>
                    <li>Professional &amp; management training (agile, delivery, governance, quality, AI)</li>
                </ul>
                <h2>NAICS codes</h2>
                <p>541512 Computer Systems Design &middot; 541519 Other Computer Related Services &middot; 541611 Administrative &amp; General Management Consulting &middot; 611430 Professional &amp; Management Development Training</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <h2>Differentiators</h2>
                <p>Unlike broad staff-augmentation shops, New South Technologies is a D.C.-metro specialist in <strong>federal civilian legacy mainframe modernization</strong>. Every engagement is incremental (no big-bang cutover) and produces auditable compliance evidence at each step. We are not affiliated with the similarly-named NewSouth Technologies, Inc. of Raleigh, NC.</p>
                <h2>Point of contact</h2>
                <p>Procurement &amp; teaming: <a href="mailto:procurement@newsouthtechnologies.com">procurement@newsouthtechnologies.com</a><br>
                General: <a href="mailto:info@newsouthtechnologies.com">info@newsouthtechnologies.com</a></p>
                <div class="cta-row">
                    <a href="./assets/downloads/newsouth-capabilities-statement.pdf" class="btn btn-primary" download>Download the one-page PDF</a>
                    <a href="./about.html" class="btn btn-secondary">About the company</a>
                </div>
            </div>
        </section>
'''
page("capability-statement.html", "Capability Statement | New South Technologies (Federal Modernization, D.C.)",
     "New South Technologies capability statement: UEI, NAICS (541512, 541519, 541611, 611430), small-business/8(a)/SDVOSB designations, core competencies, and differentiators for federal legacy modernization.",
     BASE + "capability-statement.html", "cap", cap_main, cap_extra,
     keywords="capability statement, federal modernization vendor, SAM.gov, UEI, NAICS 541512, 8(a) SDVOSB, D.C. federal contractor")

# ---------------------------------------------------------------- COMPLIANCE RESOURCES
comp_extra = crumbs([("Home", BASE), ("Compliance Resources", BASE + "compliance-resources.html")], "./")
comp_main = '''        <header class="hero hero--interior">
            <div class="container hero-content">
                <h1>Compliance Resources: FedRAMP Alignment for Modernization</h1>
                <p>How we build FedRAMP-aligned landing zones and keep agencies audit-ready throughout an incremental migration.</p>
            </div>
        </header>
        <section class="section">
            <div class="container">
                <h2>What &ldquo;FedRAMP-aligned&rdquo; means in our work</h2>
                <p>A FedRAMP-aligned landing zone is a cloud environment whose identity, logging, encryption, and network controls are designed against the FedRAMP and NIST SP 800-53 baselines from day one &mdash; so that as each slice of a legacy system is migrated, it inherits documented, assessable controls rather than accumulating undocumented risk.</p>
                <h2>The evidence we produce</h2>
                <ul class="fact-list">
                    <li>Control-to-requirement traceability matrix (requirement &rarr; control &rarr; deployed implementation)</li>
                    <li>Compliance evidence pack mapped to NIST SP 800-53 and FedRAMP baselines</li>
                    <li>Immutable audit log and change history (who changed what, when, why)</li>
                    <li>Automated test, scan, and security results generated by the pipeline</li>
                    <li>FedRAMP-aligned landing-zone documentation</li>
                    <li>Plain-language decision records readable by auditors and OIG</li>
                </ul>
            </div>
        </section>
        <section class="section section--alt">
            <div class="container">
                <h2>Frameworks we align to</h2>
                <p>FedRAMP &middot; NIST SP 800-53 &middot; NIST AI RMF &middot; CMMC 2.0 &middot; Zero Trust (OMB M-22-09) &middot; OMB M-26-04. Use our <a href="./cmmc-calculator.html">CMMC 2.0 Readiness Calculator</a> for a quick self-assessment.</p>
                <h2>Related reading</h2>
                <ul class="fact-list">
                    <li><a href="./blog/fedramp-agile-atop.html">How to Achieve FedRAMP ATO Without Slowing Down Agile Delivery</a></li>
                    <li><a href="./blog/strangler-fig-modernization.html">The Strangler Fig Pattern: Modernizing Mainframes Without Mission Disruption</a></li>
                    <li><a href="./blog/omb-m26-04-guide.html">Understanding OMB M-26-04: A Practical Guide for Federal AI Procurement</a></li>
                </ul>
                <div class="cta-row">
                    <a href="./courses/fedramp-landing-zone-readiness.html" class="btn btn-primary">FedRAMP training course</a>
                    <a href="./index.html#contact" class="btn btn-secondary">Request a compliance audit</a>
                </div>
            </div>
        </section>
'''
page("compliance-resources.html", "FedRAMP Compliance Resources for Federal Modernization | New South Technologies",
     "How New South Technologies builds FedRAMP-aligned landing zones and audit-ready compliance evidence (NIST 800-53, CMMC 2.0, Zero Trust) throughout incremental federal modernization.",
     BASE + "compliance-resources.html", "", comp_main, comp_extra,
     keywords="FedRAMP alignment, NIST 800-53, FedRAMP landing zone, ATO, continuous authorization, CMMC 2.0, federal compliance")

# ---------------------------------------------------------------- FAQ
faq_items = [
    ("Is New South Technologies the same company as NewSouth Technologies, Inc. of Raleigh, NC?",
     "No. New South Technologies, LLC (two words, newsouthtechnologies.com) is a Washington, D.C. metro area firm focused on federal civilian and state legacy mainframe modernization. NewSouth Technologies, Inc. (one word, newsouthtech.com) is a separate, unrelated company founded in 1998 and headquartered in Raleigh, North Carolina. The two firms have different owners, locations, and service focuses and are not affiliated."),
    ("Who does New South Technologies serve?",
     "D.C.-area federal civilian agencies and state governments — specifically IT decision-makers, CIOs, compliance officers, procurement and contracting officers, and auditors evaluating modernization vendors."),
    ("What is a strangler-fig migration?",
     "It is an incremental modernization pattern in which functionality is peeled off a legacy mainframe one slice at a time and re-implemented in a governed cloud environment, until the legacy system can be retired. There is no big-bang cutover and no mission downtime, and each step produces auditable compliance evidence."),
    ("What does “FedRAMP-aligned landing zone” mean?",
     "A cloud environment whose identity, logging, encryption, and network controls are designed against FedRAMP and NIST SP 800-53 baselines from day one, so migrated workloads inherit documented, assessable controls."),
    ("Is New South Technologies registered to work with the federal government?",
     "Yes. New South Technologies, LLC is registered and active in SAM.gov (UEI MCWZEB6BM5C5) and is available for teaming and subcontracting. See our capability statement for NAICS codes and designations."),
    ("How do I contact New South Technologies about a procurement or RFP?",
     "Email procurement@newsouthtechnologies.com, or info@newsouthtechnologies.com for general inquiries. We serve the Washington, D.C. metropolitan area (DC-MD-VA)."),
]
faq_ld = {"@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [{"@type": "Question", "name": q,
                          "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq_items]}
faq_extra = ld(faq_ld) + crumbs([("Home", BASE), ("FAQ", BASE + "faq.html")], "./")
faq_body = '''        <header class="hero hero--interior">
            <div class="container hero-content">
                <h1>Frequently Asked Questions</h1>
                <p>Answers for federal and state IT, compliance, and procurement decision-makers.</p>
            </div>
        </header>
        <section class="section">
            <div class="container">
'''
for q, a in faq_items:
    faq_body += f'''                <details class="faq-item" open>
                    <summary><h2>{q}</h2></summary>
                    <p>{a}</p>
                </details>
'''
faq_body += '''            </div>
        </section>
'''
page("faq.html", "FAQ | New South Technologies (Federal Legacy Modernization)",
     "FAQs about New South Technologies: our federal modernization services, strangler-fig migration, FedRAMP alignment, SAM.gov registration, and how we differ from NewSouth Technologies, Inc. of Raleigh, NC.",
     BASE + "faq.html", "", faq_body, faq_extra,
     keywords="New South Technologies FAQ, strangler-fig migration, FedRAMP landing zone, federal modernization vendor")

print("core pages done")

# ---------------------------------------------------------------- COURSES
os.makedirs("courses", exist_ok=True)

def course_page(slug, title, short_desc, long_desc, audience, outcomes, modules, duration_days):
    url = BASE + "courses/" + slug + ".html"
    course_ld = {
        "@context": "https://schema.org", "@type": "Course",
        "name": title, "description": long_desc,
        "provider": {"@type": "Organization", "name": "New South Technologies",
                     "sameAs": BASE, "@id": BASE + "#organization"},
        "url": url,
        "audience": {"@type": "EducationalAudience", "educationalRole": "professional",
                     "audienceType": audience},
        "teaches": outcomes,
        "hasCourseInstance": [{
            "@type": "CourseInstance", "courseMode": ["online", "onsite"],
            "courseWorkload": f"P{duration_days}D",
            "location": {"@type": "Place", "name": "Washington, D.C. Metro (or virtual)"}
        }],
        "offers": {"@type": "Offer", "category": "Professional training",
                   "availability": "https://schema.org/InStock", "url": url}
    }
    extra = ld(course_ld) + crumbs([("Home", BASE), ("Training", BASE + "training.html"),
                                    (title, url)], "../")
    mod_html = "".join(f"                    <li><strong>{m[0]}.</strong> {m[1]}</li>\n" for m in modules)
    out_html = "".join(f"                    <li>{o}</li>\n" for o in outcomes)
    body = f'''        <header class="hero hero--interior">
            <div class="container hero-content">
                <p class="eyebrow">New South Technologies Training</p>
                <h1>{title}</h1>
                <p>{short_desc}</p>
            </div>
        </header>
        <section class="section">
            <div class="container course-layout">
                <div class="course-main">
                    <h2>Course overview</h2>
                    <p>{long_desc}</p>
                    <p><strong>Who it&rsquo;s for:</strong> {audience}. <strong>Format:</strong> {duration_days}-day cohort, delivered virtually or on-site in the D.C. metro.</p>
                    <h2>What you&rsquo;ll be able to do</h2>
                    <ul class="fact-list">
{out_html}                    </ul>
                    <h2>Curriculum</h2>
                    <ol class="module-list">
{mod_html}                    </ol>
                </div>
                <aside class="course-signup" aria-labelledby="reg">
                    <h2 id="reg">Register interest</h2>
                    <p>Tell us about your team and we&rsquo;ll send dates, pricing, and a syllabus.</p>
                    <form action="https://formspree.io/f/mvznzwav" method="POST" class="form-grid">
                        <input type="hidden" name="_subject" value="Course interest: {title}">
                        <input type="hidden" name="course" value="{title}">
                        <div class="form-group"><label for="name">Full name *</label><input type="text" id="name" name="name" required></div>
                        <div class="form-group"><label for="email">Work email *</label><input type="email" id="email" name="email" required placeholder="you@agency.gov"></div>
                        <div class="form-group"><label for="agency">Agency / organization</label><input type="text" id="agency" name="agency"></div>
                        <div class="form-group"><label for="team">Approx. team size</label><input type="text" id="team" name="team"></div>
                        <div class="form-consent">
                            <input type="checkbox" id="consent" name="privacyConsent" required>
                            <label for="consent">I consent to New South Technologies processing my information per the <a href="../privacy-form-submissions.html">Form Submissions Notice</a>. *</label>
                        </div>
                        <button type="submit" class="btn btn-primary btn-large">Request course details</button>
                    </form>
                </aside>
            </div>
        </section>
        <section class="section section--alt">
            <div class="container">
                <h2>Related</h2>
                <p>See the full <a href="../training.html">training portfolio</a>, our <a href="../compliance-resources.html">compliance resources</a>, or <a href="../modernization.html">legacy modernization services</a>.</p>
            </div>
        </section>
'''
    page(f"courses/{slug}.html", f"{title} | New South Technologies Training",
         short_desc, url, "training", body, extra, prefix="../",
         keywords=title + ", federal IT training, government modernization course, New South Technologies training")

course_page(
    "fedramp-landing-zone-readiness",
    "FedRAMP Landing Zone Readiness",
    "A hands-on course that prepares federal IT teams to design and stand up a FedRAMP-aligned cloud landing zone.",
    "This course walks federal and state IT teams through designing, building, and documenting a FedRAMP-aligned landing zone: identity, logging, encryption, and network controls mapped to NIST SP 800-53, with the evidence artifacts an Authorizing Official expects. Teams leave able to inherit documented controls for every workload they migrate.",
    "Federal/state cloud engineers, ISSOs, and modernization leads",
    ["Design a FedRAMP-aligned landing zone against NIST SP 800-53 baselines",
     "Implement identity, logging, encryption, and network guardrails as code",
     "Produce a control-to-requirement traceability matrix",
     "Package compliance evidence for ATO and continuous authorization"],
    [(1, "FedRAMP &amp; NIST 800-53 baseline foundations"),
     (2, "Landing-zone reference architecture &amp; guardrails"),
     (3, "Identity, logging, encryption, network controls as code"),
     (4, "Evidence, traceability, and the path to ATO")],
    3)

course_page(
    "strangler-fig-migration-federal-it",
    "Strangler-Fig Migration for Federal IT Teams",
    "Learn to modernize a legacy mainframe incrementally &mdash; no big-bang cutover, no mission downtime.",
    "A practitioner course on the strangler-fig pattern for public-sector modernization. Teams learn to identify seams in a legacy system, route traffic through a facade, migrate functionality slice by slice into governed cloud services, and retire the mainframe safely &mdash; keeping the mission running and auditors satisfied throughout.",
    "Federal/state application architects, delivery leads, and modernization program managers",
    ["Map a legacy system and identify safe migration seams",
     "Stand up a routing facade to move traffic incrementally",
     "Migrate and verify functionality slice by slice",
     "Plan a safe mainframe retirement with rollback options"],
    [(1, "Legacy assessment &amp; seam identification"),
     (2, "The facade pattern &amp; incremental routing"),
     (3, "Slice migration, data strategy &amp; verification"),
     (4, "Cutover, retirement &amp; compliance evidence")],
    3)

course_page(
    "legacy-mainframe-decoupling-bootcamp",
    "Legacy Mainframe Decoupling Bootcamp for Government Contractors",
    "An intensive bootcamp for government contractors decoupling business logic from aging mainframes.",
    "This bootcamp gives government contractors and agency teams the practical skills to decouple business logic from COBOL/legacy mainframes: domain analysis, anti-corruption layers, data synchronization, and governed cloud targets. Emphasis throughout is on auditability and FedRAMP alignment so decoupled services are ATO-ready.",
    "Government contractors, mainframe SMEs, and agency modernization teams",
    ["Analyze mainframe domains and extract business rules",
     "Design anti-corruption layers between legacy and cloud",
     "Synchronize data safely during a phased migration",
     "Deliver decoupled, FedRAMP-aligned, ATO-ready services"],
    [(1, "Mainframe domain analysis &amp; rule extraction"),
     (2, "Anti-corruption layers &amp; interface design"),
     (3, "Data synchronization &amp; phased cutover"),
     (4, "Governance, FedRAMP alignment &amp; ATO readiness")],
    5)

print("course pages done")
