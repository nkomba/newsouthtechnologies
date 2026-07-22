===============================================================================
          NEWSOUTH TECHNOLOGIES — DOCUMENT TEMPLATES SUITE
===============================================================================

Version:          1.0
Created:          July 2026
Last Updated:     July 19, 2026
Owner:            NewSouth Technologies
Location:         C:\NewSouthTechnologies\documents\templates\

===============================================================================
PURPOSE
===============================================================================

This folder contains the complete set of professional document templates for
NewSouth Technologies. All files are HTML-based, styled for print, and designed
to be opened in a web browser then saved as PDF via the browser's print dialog.

These templates are NOT designed to be viewed live on the website. They are
internal documents used to generate client-facing PDFs.

===============================================================================
HOW TO USE THESE TEMPLATES
===============================================================================

1. Open the desired HTML file in your web browser (Chrome, Firefox, Edge)
2. Replace all bracketed fields [LIKE THIS] with real data
   - Tip: Use Ctrl+H (Find and Replace) for repeated fields like [PHONE]
3. Click the "Print / Save as PDF" button in the top-right corner
4. In the print dialog:
   - Destination: Save as PDF
   - Margins: None (CSS handles internal margins)
   - Scale: 100%
   - Paper size: Letter (8.5" x 11")
5. Save the PDF with a meaningful filename:
   - Format: [DOCUMENT TYPE]_[CLIENT NAME]_[DATE].pdf
   - Example: Proposal_DoS_2026-07-19.pdf

===============================================================================
FILE INDEX
===============================================================================

  #  FILENAME                               PURPOSE
  --  ------------------------------------  --------------------------------------
  1   letterhead.html                       Branded letterhead for formal letters
  2   proposal-template.html                Full client proposals (multi-page)
  3   capability-statement.html              One-pager for RFP/bid responses
  4   sow-template.html                     Statement of Work per engagement
  5   invoice-template.html                 Client billing invoices
  6   engagement-letter.html                Short-form engagement authorization
  7   nda-mutual.html                       Mutual Non-Disclosure Agreement
  8   email-signature.html                  Email signature setup guide
  9   meeting-minutes.html                  Client meeting minutes
  10  status-report.html                    Weekly/biweekly project status reports
  11  presentation-deck.html                Slide deck for proposals/pitches
  12  business-card.html                    Business card layout (front/back)
  13  msa-master-services-agreement.html    Master Services Agreement (legal)
  14  quick-reference-guide.html           Team member quick reference (this guide)

===============================================================================
WHEN TO USE EACH DOCUMENT
===============================================================================

SCENARIO                                     WHICH TEMPLATE(S) TO USE
-------------------------------------------- --------------------------------------
Initial client outreach                      letterhead.html
Sending a proposal                           proposal-template.html + nda-mutual.html
Responding to an RFP                         capability-statement.html +
                                             proposal-template.html
Formalizing an engagement                    msa-master-services-agreement.html +
                                             sow-template.html +
                                             engagement-letter.html
Starting project work                        nda-mutual.html + sow-template.html
Weekly client updates                        status-report.html
Client meeting follow-up                      meeting-minutes.html
Billing the client                           invoice-template.html
Presenting to client (in-person/virtual)     presentation-deck.html
Setting up email                             email-signature.html
Ordering business cards                      business-card.html

===============================================================================
BRAND STANDARDS
===============================================================================

Primary Color (Navy):      #1a2332
Accent Color (Gold):       #c9a961
Text Color (Dark Gray):    #333333
Font (Headings):           Helvetica Neue, Arial, sans-serif
Font (Body):               Georgia, Times New Roman, serif
Logo Treatment:            "NewSouth" + "Technologies" (gold accent on
                           "Technologies")
Tagline:                   Legacy Modernization · Governed Agility ·
                           Cybersecurity · AI Governance
Standard Paper Size:       US Letter (8.5" x 11")

===============================================================================
PLACEHOLDER GUIDE
===============================================================================

The following bracketed placeholders appear throughout the templates. Replace
each with the appropriate real-world value:

PLACEHOLDER              REPLACE WITH
-----------------------  -----------------------------------------------
[COMPANY ADDRESS]        Full street address of NewSouth Technologies
[CITY, STATE ZIP]        City, state, and ZIP code
[PHONE]                 Primary business phone number
[EMAIL]                  Primary business email address
[INVOICING EMAIL]        Dedicated billing email (if different)
[FULL ADDRESS]           Complete mailing address (used in footers)
[DUNS Number]            DUNS number (capability statement)
[UEI Number]             Unique Entity ID (capability statement)

CLIENT-SPECIFIC PLACEHOLDERS (replace per engagement):

PLACEHOLDER              REPLACE WITH
-----------------------  -----------------------------------------------
[CLIENT ORGANIZATION]    Client company name
[CLIENT NAME]            Primary client contact name
[CLIENT SIGNATORY]       Authorized signing officer name/title
[CLIENT ADDRESS]         Client's full address
[CLIENT BILLING EMAIL]  Client accounts payable email
[PO NUMBER]              Client purchase order number (if applicable)
[SOW NUMBER]             SOW tracking number (format: SOW-YYYY-NNN)
[PROPOSAL NUMBER]        Proposal tracking number (format: PROP-YYYY-NNN)

FINANCIAL PLACEHOLDERS:

PLACEHOLDER              REPLACE WITH
-----------------------  -----------------------------------------------
[$RATE]                 Hourly or daily billing rate
[$AMOUNT]               Specific dollar amount
[$SUBTOTAL]             Pre-tax subtotal
[$TAX]                  Tax amount (if applicable)
[$TOTAL]                Total invoice/contract value
[HOURS]                 Number of billable hours

DATES & TIMELINES:

PLACEHOLDER              REPLACE WITH
-----------------------  -----------------------------------------------
[DATE]                   Specific date (format: Month DD, YYYY)
[START DATE]             Engagement/project start date
[END DATE]               Engagement/project end date
[DUE DATE]               Payment or deliverable due date
[WEEK ENDING DATE]       End of reporting period (status reports)

===============================================================================
NAMING CONVENTIONS FOR GENERATED PDFs
===============================================================================

When saving a generated PDF, use this format:

[TYPE]_[CLIENT]_[DATE YYYY-MM-DD].pdf

Examples:
  Proposal_GSA_2026-07-19.pdf
  SOW_DoS_2026-07-19.pdf
  Invoice_INV-2026-015_DoS_2026-08-01.pdf
  StatusReport_HHS_2026-07-19.pdf
  NDA_LockheedMartin_2026-07-19.pdf

Keep generated PDFs in:
  C:\NewSouthTechnologies\documents\executed\

Create subfolders per client if volume increases.

===============================================================================
IMPORTANT NOTES
===============================================================================

1. LEGAL DOCUMENTS (MSA, NDA, Engagement Letter)
   These templates provide a solid legal foundation but are NOT a substitute
   for qualified legal counsel. Have an attorney review and customize these
   documents for your specific jurisdiction, insurance requirements, and
   business needs before using them with clients.

2. PRINTING
   - Always test-print to verify layout before sending to clients
   - Set print margins to "None" — CSS handles internal spacing
   - Ensure "Background graphics" is enabled in print settings
   - For the presentation deck, each slide prints as a separate page

3. UPDATING TEMPLATES
   - Update the "Last Updated" date in this README when modifying templates
   - Keep backup copies before making structural changes
   - Maintain consistent branding across all documents

4. PRESENTATION DECK
   The presentation deck includes on-screen navigation (arrow keys, spacebar,
   or buttons). When printed, each slide becomes its own page automatically.

5. BUSINESS CARDS
   - Card dimensions include 0.125" bleed for professional printing
   - Send exported PDF to a print shop (Vistaprint, Moo, local printer)
   - The template includes three design variants to choose from

===============================================================================
VERSION HISTORY
===============================================================================

Version | Date       | Changes
--------|------------|------------------------------------------------------------
1.0     | 2026-07-19 | Initial creation of 13-document template suite +
        |            | README and quick reference guide

===============================================================================
SUPPORT
===============================================================================

Questions about these templates?
Contact: [INTERNAL CONTACT NAME]
Email:   [INTERNAL SUPPORT EMAIL]

For branding or design changes, coordinate with [DESIGN OWNER].

===============================================================================
                          END OF README
===============================================================================