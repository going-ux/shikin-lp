# shikin-lp AI development rules

## Goal
Build a mobile-first landing page for Japanese sole proprietors and small construction contractors, optimizing verified affiliate conversions and profitability, not superficial design scores.

## Product requirements
- Domain: shikin.diggworks.com (GitHub Pages).
- Core copy: 「仕事はある。売上もある。でも、入金はまだ先。」
- Visual identity: blue, white and yellow; use craftspeople and actual jobsite context, not generic site managers.
- Flow: empathy → payment timing mismatch → factoring explanation → company/sole proprietor choice → verified comparison of QuQuMo, アクセルファクター and No.1 → FAQ → CTA.
- Communicate the offer clearly within approximately five seconds on mobile.
- Never invent fees, approval rates, payout timing, customer testimonials, rankings or affiliate program conditions. Confirm current terms and advertising permissions before publishing.
- Disclose advertising/affiliate relationships and explain factoring costs, eligibility and risks accurately.

## Workflow
1. Inspect the repository and identify the exact files to change.
2. Define acceptance criteria and verification steps before implementation.
3. Implement the smallest focused change; preserve CNAME, DNS and GitHub Pages behavior.
4. Review the result separately against requirements, accessibility, links, mobile layout, and claims.
5. Run available tests; distinguish passed checks from unverified checks.
6. Log material changes, failures and lessons in docs/improvement-log.md.
7. Do not declare a conversion improvement without measured experiment data.

## Quality gates
- Mobile widths 320px, 375px and 390px: no horizontal scrolling or clipped CTA.
- Functional navigation and CTA destinations; no broken links.
- Semantic headings, accessible labels, keyboard operation and visible focus.
- Reasonable loading performance and optimized assets.
- No misleading or unverified financial claims.
- No change to live publication settings without explicit need.

## Continuous improvement
Extract recurring errors and missed steps from available session or development logs. Propose precise updates to instructions, skills or automated tests; do not silently rewrite policies or claim access to unavailable session history.

## Cross-project lessons (2026-10-14)
- Preserve previously approved visual direction and wording; do not restart the design from scratch without a reason. The fixed visual direction is blue/white/yellow, refined mobile layout and a construction-specific payment-gap story.
- Lead with the payment mismatch, not a corporation/sole-proprietor gate. Put business-type choice later in the funnel.
- In payment-cycle examples, label actual example dates such as 「5月末」「6月末」 rather than vague month references; never assert a universal 30–60-day payment term.
- Compare providers by verified conditions (fees, eligibility, funding speed, online completion, required documents, debtor notification), not invented ranking.
- Before implementing commercial CTAs, verify affiliate offer availability, approval status, conversion event, EPC, confirmation rate, rejection terms, paid-search/trademark restrictions and landing-page URL submission requirements. No unverified offer is a launch-ready offer.
- Work in stages: validate offer economics and restrictions → define ad-to-LP message match → implement → inspect on real mobile viewport → test links/events → run small paid experiment. Avoid building a polished but commercially unusable page.
- Distinguish observed facts, estimates, assumptions and unverified items; public keyword volume and CPC estimates are not measured performance.
- Treat user feedback as a requirement change: capture it once in the appropriate instruction or skill, then test it on the next task.
- Do not promise direct account access, automated history ingestion, night-time GitHub updates or completed browser testing unless the specific integration/action has succeeded.
