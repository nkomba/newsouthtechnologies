#!/usr/bin/env node
/**
 * a11y/build.js — Single-source accessibility statement sync.
 *
 * Reads a11y/statement.config.json (the ONE source of truth) and regenerates:
 *   1. The accessibility notice in every document template (documents/Templates/*.html)
 *   2. The volatile fields inside accessibility.html (dates, conformance level)
 *
 * Generated regions are delimited so re-running only touches the managed block:
 *   - Templates:  <!-- A11Y:notice:start --> ... <!-- A11Y:notice:end -->
 *   - Inline:     <!--A11Y:field-->value<!--/A11Y:field-->
 *
 * Usage:  node a11y/build.js          (write changes)
 *         node a11y/build.js --check  (fail if anything is out of sync; for CI)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'statement.config.json'), 'utf8'));
const CHECK = process.argv.includes('--check');

const NOTICE_START = '<!-- A11Y:notice:start -->';
const NOTICE_END = '<!-- A11Y:notice:end -->';

function noticeHtml() {
  const c = CONFIG;
  const standards = c.standards
    .map(s => `<strong>${s}</strong>`)
    .join(' and ');
  return [
    '    ' + NOTICE_START,
    '    <div class="accessibility-notice" style="margin-top:16px;padding:10px 12px;border-top:1px solid #cccccc;font-size:9pt;line-height:1.5;color:#555555;font-family:Arial,Helvetica,sans-serif;">',
    `        <strong>Accessibility:</strong> ${c.organization} is committed to digital accessibility and conformance with ${standards}. Read our full <a href="${c.urls.statement}" style="color:#0D9488;">Accessibility Statement</a>, <a href="${c.urls.contact}" style="color:#0D9488;">contact us</a>, or email <a href="mailto:${c.emails.accessibility}" style="color:#0D9488;">${c.emails.accessibility}</a>. We aim to respond within ${c.responseBusinessDays} business days.`,
    '    </div>',
    '    ' + NOTICE_END
  ].join('\n');
}

let changed = 0, checked = 0, outOfSync = [];

function write(file, next, original) {
  checked++;
  if (next === original) return;
  outOfSync.push(path.relative(ROOT, file));
  if (!CHECK) { fs.writeFileSync(file, next); changed++; }
}

/* ---- 1. Template notices ---- */
const tplDir = path.join(ROOT, 'documents', 'Templates');
const block = noticeHtml();
for (const f of fs.readdirSync(tplDir).filter(n => n.endsWith('.html'))) {
  const file = path.join(tplDir, f);
  const src = fs.readFileSync(file, 'utf8');
  let next;
  if (src.includes(NOTICE_START) && src.includes(NOTICE_END)) {
    next = src.replace(
      new RegExp('[ \\t]*' + escape(NOTICE_START) + '[\\s\\S]*?' + escape(NOTICE_END)),
      block
    );
  } else if (/<div class="accessibility-notice"[\s\S]*?<\/div>/.test(src)) {
    next = src.replace(/[ \t]*<div class="accessibility-notice"[\s\S]*?<\/div>/, block);
  } else {
    const i = src.lastIndexOf('</body>');
    next = i === -1 ? src : src.slice(0, i) + block + '\n</body>' + src.slice(i + 7);
  }
  write(file, next, src);
}

/* ---- 2. Inline fields in accessibility.html ---- */
const fields = {
  evaluationDate: CONFIG.evaluationDate,
  lastUpdated: CONFIG.lastUpdated,
  conformanceLevel: CONFIG.conformanceLevel
};
const accFile = path.join(ROOT, 'accessibility.html');
if (fs.existsSync(accFile)) {
  let src = fs.readFileSync(accFile, 'utf8');
  const before = src;
  for (const [key, val] of Object.entries(fields)) {
    src = src.replace(
      new RegExp('<!--A11Y:' + key + '-->[\\s\\S]*?<!--/A11Y:' + key + '-->'),
      '<!--A11Y:' + key + '-->' + val + '<!--/A11Y:' + key + '-->'
    );
  }
  write(accFile, src, before);
}

function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* ---- report ---- */
if (CHECK) {
  if (outOfSync.length) {
    console.error('✗ Out of sync with a11y/statement.config.json:\n  - ' + outOfSync.join('\n  - '));
    console.error('\nRun `npm run a11y:sync` to fix.');
    process.exit(1);
  }
  console.log(`✓ Accessibility statement in sync across ${checked} file(s).`);
} else {
  console.log(`✓ Synced accessibility statement: ${changed} file(s) updated, ${checked} checked.`);
}
