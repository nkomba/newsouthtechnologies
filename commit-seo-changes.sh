#!/usr/bin/env bash
# Run from the repo root on your own machine (Git Bash / WSL / macOS / Linux),
# where git can write .git locks normally.
#
#   1) If a stale lock remains from the sandbox session, remove it first:
#        Windows CMD:  del .git\HEAD.lock
#        Git Bash:     rm -f .git/HEAD.lock
#   2) Then run:  bash commit-seo-changes.sh
#
# Commit #1 (audit + generator) was already made in-session. This recreates the
# remaining SEO work as clean, grouped commits.
set -e

git reset -q  # unstage everything so we can group cleanly (keeps working-tree changes)

git add index.html
git commit -m "SEO(home): Organization+WebSite JSON-LD, canonical, OG/Twitter, disambiguation"

git add about.html services.html capability-statement.html compliance-resources.html faq.html
git commit -m "SEO(pages): add About, Services, Capability Statement, Compliance, FAQ (+FAQPage/Org schema)"

git add courses training.html
git commit -m "SEO(training): courses section with Course schema + lead capture; link from training"

git add sitemap.xml robots.txt a7f3c9e14b8d42f6a1e05c7b93d28f6e.txt \
        thanks.html cage.html download-crp.html customer-resolution-process.html \
        resolution-summary.html feedback1.html pm-training-invoice*.html \
        accessibility.html blog.html careers.html cmmc-calculator.html contact.html \
        feedback.html privacy-form-submissions.html privacy-policy.html terms.html
git commit -m "SEO(technical): noindex utility pages, canonicals, brand normalization, sitemap, IndexNow"

git add blog css/style.css
git commit -m "SEO(blog+css): OG/Twitter + BlogPosting schema on posts; styles for new pages"

# QA-Peer-Review-Report.html and visual.html / accessible-comparison.html / flywheel-explainer.html
# were noindex-tagged too but may be .gitignored on your deploy — add with -f only if you intend to track them.

echo "Done. Review with: git log --oneline -6"
