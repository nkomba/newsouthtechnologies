#!/usr/bin/env node
/**
 * data/build-profile.js — Single-source federal-contracting facts.
 *
 * Reads data/company-profile.json and propagates it to:
 *   1. The homepage "Federal Contracting & Company Data" section
 *      (between <!-- FEDPROFILE:start --> / <!-- FEDPROFILE:end -->)
 *   2. A concise federal line in every footer "Credentials" block
 *      (wrapped in <!-- FEDLINE:start --> / <!-- FEDLINE:end -->, inserted
 *       right after the Certifications line if not already present)
 *
 * Usage:  node data/build-profile.js          (write)
 *         node data/build-profile.js --check   (fail if out of sync; for CI)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'company-profile.json'), 'utf8'));
const CHECK = process.argv.includes('--check');

const val = v => (v && String(v).trim()) ? String(v).trim() : null;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const orRequest = v => val(v)
  ? `<span class="fed-value">${esc(v)}</span>`
  : `<span class="fed-value fed-pending">Available on request</span>`;
const naics = (CFG.naics && CFG.naics.length) ? CFG.naics.map(esc).join(' &middot; ') : '';
const designations = (CFG.designations || []).map(esc).join(' &middot; ');
const CERT_LINE = '<p>Certifications: PMP, SAFe, AWS GovCloud</p>';

function homepageSection() {
  return [
    '<!-- FEDPROFILE:start -->',
    '        <section class="fed-contracting" aria-label="Federal contracting and company data">',
    '            <div class="container">',
    '                <h2>Federal Contracting &amp; Company Data</h2>',
    '                <p class="fed-intro">The identifiers a contracting officer needs, in one place — active in SAM.gov and available to team on federal opportunities.</p>',
    '                <div class="fed-grid">',
    `                    <div class="fed-item"><span class="fed-label">SAM.gov</span><span class="fed-value">${esc(CFG.samStatus || 'Registered')}</span></div>`,
    `                    <div class="fed-item"><span class="fed-label">UEI</span>${orRequest(CFG.uei)}</div>`,
    `                    <div class="fed-item"><span class="fed-label">CAGE Code</span>${orRequest(CFG.cageCode)}</div>`,
    `                    <div class="fed-item"><span class="fed-label">NAICS</span>${orRequest(naics)}</div>`,
    `                    <div class="fed-item"><span class="fed-label">Designations</span><span class="fed-value">${designations}</span></div>`,
    `                    <div class="fed-item"><span class="fed-label">Contract Vehicles</span><span class="fed-value">${esc(CFG.contractVehicles || '')}</span></div>`,
    '                </div>',
    `                <p class="fed-note">Full registration details and named past-performance references are available to qualified evaluators — contact <a href="mailto:${CFG.procurementEmail}">${CFG.procurementEmail}</a> or download our <a href="./assets/downloads/newsouth-capabilities-statement.pdf" download>Capabilities Statement (PDF)</a>.</p>`,
    '            </div>',
    '        </section>',
    '        <!-- FEDPROFILE:end -->'
  ].join('\n');
}

function footerLine() {
  let parts = [`SAM.gov: ${esc(CFG.samStatus || 'Registered')}`];
  if (designations) parts.push((CFG.designations || []).map(esc).join(', '));
  if (val(CFG.uei)) parts.push(`UEI ${esc(CFG.uei)}`);
  if (val(CFG.cageCode)) parts.push(`CAGE ${esc(CFG.cageCode)}`);
  return `<!-- FEDLINE:start --><p>${parts.join(' &middot; ')}</p><!-- FEDLINE:end -->`;
}

let checked = 0, changed = 0, drift = [];
function write(file, next, orig) {
  checked++;
  if (next === orig) return;
  drift.push(path.relative(ROOT, file));
  if (!CHECK) { fs.writeFileSync(file, next); changed++; }
}

// 1. Homepage section (only where markers exist)
const idx = path.join(ROOT, 'index.html');
if (fs.existsSync(idx)) {
  const s = fs.readFileSync(idx, 'utf8');
  if (s.includes('<!-- FEDPROFILE:start -->')) {
    const next = s.replace(/[ \t]*<!-- FEDPROFILE:start -->[\s\S]*?<!-- FEDPROFILE:end -->/, homepageSection());
    write(idx, next, s);
  }
}

// 2. Footer line in every credentials block
const line = footerLine();
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git', 'documents'].includes(e.name)) walk(p); }
    else if (e.name.endsWith('.html')) patchFooter(p);
  }
}
function patchFooter(file) {
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes(CERT_LINE)) return;
  let next;
  if (s.includes('<!-- FEDLINE:start -->')) {
    next = s.replace(/<!-- FEDLINE:start -->[\s\S]*?<!-- FEDLINE:end -->/, line);
  } else {
    // insert right after the certifications line, preserving indentation
    next = s.replace(new RegExp('([ \\t]*)' + CERT_LINE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      (m, indent) => `${m}\n${indent}${line}`);
  }
  write(file, next, s);
}
walk(ROOT);

if (CHECK) {
  if (drift.length) { console.error('Out of sync:\n  - ' + drift.join('\n  - ') + '\nRun: node data/build-profile.js'); process.exit(1); }
  console.log(`In sync across ${checked} file(s).`);
} else {
  console.log(`Profile synced: ${changed} file(s) updated, ${checked} checked.`);
}
