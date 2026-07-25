#!/usr/bin/env node
/**
 * a11y/axe-scan.js — Automated Section 508 / WCAG 2.1 AA audit.
 *
 * Serves the site locally, loads every page in headless Chromium, and runs
 * axe-core against the government-mandate rule sets. Produces a machine- and
 * human-readable report and exits non-zero if any violations are found — so it
 * can gate a commit or CI build, or be handed to procurement reviewers.
 *
 * Usage:
 *   npm run a11y                 scan every page
 *   node a11y/axe-scan.js --page index.html      scan one page
 *
 * Requires (one-time):  npm install  &&  npx playwright install chromium
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(__dirname, 'report');

// The rule tags that make up the mandate: WCAG 2.0/2.1 A & AA, plus Section 508.
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'section508'];

// Directories that aren't standalone published web pages.
const SKIP_DIRS = new Set(['documents', 'components', 'a11y', 'node_modules', '.git']);

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.json': 'application/json', '.txt': 'text/plain'
};

function listPages(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? base + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...listPages(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404); res.end('Not found'); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise(resolve => server.listen(0, () => resolve(server)));
}

async function main() {
  const only = process.argv.includes('--page') ? process.argv[process.argv.indexOf('--page') + 1] : null;
  let pages = listPages(ROOT).sort();
  if (only) pages = pages.filter(p => p === only || p === only.replace(/^\.?\//, ''));
  if (!pages.length) { console.error('No pages found to scan.'); process.exit(2); }

  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  const results = [];
  let totalViolations = 0;

  console.log(`\nScanning ${pages.length} page(s) against: ${TAGS.join(', ')}\n`);

  for (const page of pages) {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${port}/${page}`, { waitUntil: 'networkidle' });
    const { violations } = await new AxeBuilder({ page: p }).withTags(TAGS).analyze();
    await ctx.close();

    const count = violations.reduce((n, v) => n + v.nodes.length, 0);
    totalViolations += count;
    results.push({ page, violationCount: count, violations });

    const label = count === 0 ? 'PASS' : `FAIL (${count})`;
    console.log(`  ${label.padEnd(10)} ${page}`);
    for (const v of violations) {
      console.log(`      • [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) — ${v.helpUrl}`);
    }
  }

  await browser.close();
  server.close();

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    standards: TAGS,
    pagesScanned: pages.length,
    totalViolations,
    results: results.map(r => ({
      page: r.page,
      violationCount: r.violationCount,
      violations: r.violations.map(v => ({
        id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
        tags: v.tags, nodes: v.nodes.map(n => ({ target: n.target, html: n.html }))
      }))
    }))
  };
  fs.writeFileSync(path.join(REPORT_DIR, 'axe-report.json'), JSON.stringify(report, null, 2));

  console.log(`\n${totalViolations === 0 ? '✓ PASS' : '✗ FAIL'} — ${totalViolations} violation(s) across ${pages.length} page(s).`);
  console.log(`Report written to a11y/report/axe-report.json\n`);
  process.exit(totalViolations === 0 ? 0 : 1);
}

main().catch(err => { console.error(err); process.exit(2); });
