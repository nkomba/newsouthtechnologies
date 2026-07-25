#!/usr/bin/env python3
"""Generate the New South Technologies Capabilities Statement PDF from the
single source of truth (data/company-profile.json). Run: python3 data/gen_capstmt.py"""
import json, os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                HRFlowable, ListFlowable, ListItem)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CFG = json.load(open(os.path.join(HERE, "company-profile.json")))
OUT = os.path.join(ROOT, "assets", "downloads", "newsouth-capabilities-statement.pdf")

NAVY = colors.HexColor("#0F172A"); TEAL = colors.HexColor("#0D9488")
SLATE = colors.HexColor("#334155"); LIGHT = colors.HexColor("#F1F5F9")

def orval(v):
    return v.strip() if (v and str(v).strip()) else "Available on request"

uei = orval(CFG.get("uei"))
cage = orval(CFG.get("cageCode"))
naics = ", ".join(CFG.get("naics") or []) or "Available on request"
designations = " · ".join(CFG.get("designations") or [])
vehicles = CFG.get("contractVehicles", "")
sam = CFG.get("samStatus", "Registered")

doc = SimpleDocTemplate(OUT, pagesize=letter, leftMargin=0.7*inch, rightMargin=0.7*inch,
                        topMargin=0.6*inch, bottomMargin=0.6*inch,
                        title="New South Technologies — Capabilities Statement", author="New South Technologies")
ss = getSampleStyleSheet()
h_company = ParagraphStyle('c', parent=ss['Title'], textColor=NAVY, fontSize=22, spaceAfter=2, alignment=TA_LEFT)
h_tag = ParagraphStyle('t', parent=ss['Normal'], textColor=TEAL, fontSize=10.5, fontName='Helvetica-Bold', spaceAfter=2)
sect = ParagraphStyle('s', parent=ss['Heading2'], textColor=NAVY, fontSize=12, spaceBefore=10, spaceAfter=4)
body = ParagraphStyle('b', parent=ss['Normal'], textColor=SLATE, fontSize=9.5, leading=13)
small = ParagraphStyle('sm', parent=ss['Normal'], textColor=SLATE, fontSize=8, leading=10)
kv = ParagraphStyle('kv', parent=ss['Normal'], textColor=NAVY, fontSize=9, leading=13)

st = []
st.append(Paragraph("New South Technologies", h_company))
st.append(Paragraph("Governance-First Modernization for Federal &amp; State Government", h_tag))
st.append(Paragraph("Reston, Virginia &nbsp;&middot;&nbsp; Washington, D.C. Metro &nbsp;&middot;&nbsp; newsouthtechnologies.com", small))
st.append(Spacer(1, 6)); st.append(HRFlowable(width="100%", thickness=2, color=TEAL, spaceAfter=8))

def bullets(items):
    return ListFlowable([ListItem(Paragraph(t, body), leftIndent=10, value='•') for t in items],
                        bulletType='bullet', start='•', leftIndent=12, bulletColor=TEAL)

st.append(Paragraph("Core Competencies", sect))
st.append(bullets([
 "<b>Legacy Modernization</b> — incremental, strangler-fig migration off mainframes to FedRAMP-aligned cloud, with no big-bang cutover or mission disruption.",
 "<b>Governed Agility</b> — DevSecOps with controls-as-code and continuous authorization (cATO); compliance embedded in the pipeline with zero unplanned downtime.",
 "<b>Responsible AI &amp; Data Governance</b> — explainability, bias mitigation, monitoring, and data governance grounded in the NIST AI RMF; ready for OMB M-26-04 unbiased-LLM procurement.",
 "<b>Professional Certification Training</b> — PMP, SAFe, Lean Six Sigma, CISA/CISM, ITIL, and AI leadership, delivered by practitioners.",
]))

st.append(Paragraph("Why New South — Evidence, Not Adjectives", sect))
st.append(bullets([
 "<b>Evidence-based delivery.</b> Every engagement produces control-to-requirement traceability, a compliance evidence pack (NIST SP 800-53 / FedRAMP), an immutable audit log, and plain-language decision records an Inspector General can follow.",
 "<b>Governance-first, audit-ready by design</b> — compliance is a property of the delivery pipeline, not a downstream scramble.",
 "<b>Cleared practitioners</b> holding active Secret and TS/SCI clearances.",
]))

fw = Paragraph("<b>Frameworks &amp; Standards</b><br/>FedRAMP-aligned · NIST SP 800-53 · NIST AI RMF · CMMC 2.0 · Section 508 / WCAG 2.1 AA · OMB M-26-04", body)
cc = Paragraph("<b>Certifications &amp; Clearances</b><br/>PMP · SAFe (SPC) · AWS GovCloud<br/>Active clearances: Secret, TS/SCI", body)
t = Table([[fw, cc]], colWidths=[3.45*inch, 3.45*inch])
t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,-1),LIGHT),
                       ('BOX',(0,0),(-1,-1),0.5,colors.HexColor("#E2E8F0")),
                       ('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),
                       ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
st.append(Spacer(1,4)); st.append(t)

st.append(Paragraph("Federal Contracting &amp; Company Data", sect))
rows = [
 ["SAM.gov:", sam, "Designations:", designations],
 ["UEI:", uei, "CAGE Code:", cage],
 ["NAICS:", naics, "Contract vehicles:", vehicles],
 ["Point of contact:", CFG.get("procurementEmail",""), "General:", "info@newsouthtechnologies.com"],
]
ct = Table([[Paragraph(f"<b>{r[0]}</b>", kv), Paragraph(r[1], kv), Paragraph(f"<b>{r[2]}</b>", kv), Paragraph(r[3], kv)] for r in rows],
           colWidths=[1.0*inch, 2.45*inch, 1.4*inch, 2.05*inch])
ct.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-2),0.4,colors.HexColor("#E2E8F0")),
                        ('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
st.append(ct)

st.append(Paragraph("Past Performance", sect))
st.append(Paragraph("We publish only outcomes we can substantiate. Named, verifiable references are available to qualified evaluators under NDA; anonymized, evidence-backed case studies are maintained at "
                    "<font color='#0F766E'>newsouthtechnologies.com/case-studies</font>. Contact " + CFG.get("procurementEmail","") + " to request references.", body))

st.append(Spacer(1, 10)); st.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=4))
st.append(Paragraph("New South Technologies · Reston, Virginia · newsouthtechnologies.com · info@newsouthtechnologies.com<br/>"
                    "Fields marked &lsquo;Available on request&rsquo; are published here once finalized in SAM.gov. Edit data/company-profile.json and rerun to update.", small))
doc.build(st)
print("PDF written:", OUT)
