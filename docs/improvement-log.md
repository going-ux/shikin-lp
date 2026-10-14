# Improvement log

## 2026-10-14 — Initial AI development harness
- Added repository guidance, repeatable LP-improvement skill, release checklist and improvement log.
- Existing placeholder index.html, README.md and CNAME intentionally unchanged.
- No browser, conversion tracking or automated test results claimed.
- Next: implement a mobile-first LP prototype with defined acceptance criteria; review before release.

## 2026-10-14 — Existing LP audit and focused fixes
- Baseline bfe71f8 confirmed; live GitHub Pages returned HTTP 200 and browser showed initial prototype.
- Maintained blue/white/yellow, approved headline, HTML/CSS/JS and CNAME.
- Replaced dead-end CTAs with sourced official links; No.1 type choice changes destination. Clarified factoring offer, minimum-fee caveat, cost/contract risks, operating/privacy disclosure, focus and safe-area padding.
- Extracted diagnostic analytics with view/type/internal/outbound events; no collector or approved conversion tracking claimed.
- Added docs/audit-20261014.md and docs/measurement.md with strict estimated 49/100 readiness, ASP/collector/contact/device blockers, revenue formulas and first experiment gates.
- Static checks, JS syntax and whitespace PASS. Changed-page mobile/browser/field-speed/ASP tracking NOT VERIFIED.
- Lesson: a populated dataLayer is not collected analytics, outbound is not a lead, official links are not affiliate revenue. Keep these distinctions in release reviews.

## 2026-10-14 — v2 audience comparison and launch preparation
- User approved flexible provider count and public-page improvements; header domain replaced by site name and visible PR explanation.
- Individual primary: QuQuMo/Accel/support organization. Corporate primary: QuQuMo/Accel/Mynavi; expandable support organization/TRY. Official links only; affiliate approvals/issued URLs are still pending.
- Public content adds operator, selection criteria/source date, privacy/risk text. Verified public inbox missing: contact remains incomplete, no invented email.
- GA4 connector implemented behind empty measurementId; user confirmed GA4 not created. Collector delivery NOT VERIFIED. Added advertising test proposal (¥10,000 cap, not authorized spend) and launch stop rules.
- Acceptance recorded before coding in docs/acceptance-20261014-v2.md. PASS: static targets/assets/CNAME, JS syntax, audience/expand/reset/event unit tests, whitespace.
- Three-width iframe QA surface added; browser evidence to follow. No CV uplift or realized profit claim.
- Public ASP/private account statistics are deliberately not copied into this public repository.
- Live 320/375/390px iframe browser QA: no horizontal overflow; individual 3, corporate 3, expansion 5 and reset 3 verified through real clicks at all widths. Fixed observed 320px headline/CTA wrapping in follow-up. Iframes have desktop scrollbar (15px), so effective content widths are 305/360/375; actual touch-device safe area remains unverified.
- Added offline normalized-cohort profit aggregation. Synthetic check confirms contribution, approved CPA and pending exclusion; actual ASP/ad data unavailable.

## 2026-10-14 — Operator contact
- User specified info@diggworks.com (corrected from shikin@). Added mailto link in static HTML and config, including JavaScript-disabled fallback. Delivery has not been tested; no email sent.

## 2026-10-14 — User-provided GA4 measurement ID
- Configured G-JGJTNJHVZ5 through the existing connector; no duplicate inline Google tag added. Acceptance: one tag/config, automatic page_view disabled, existing lp_view and outbound events retained, query-free custom page_location and activated privacy disclosure.
- PASS: static checks, existing audience/event tests, JavaScript syntax, and isolated GA-enabled execution covering tag/config uniqueness, lp_view, outbound event and privacy text.
- NOT VERIFIED: Google script loading in a real browser, actual GA4 receipt, enhanced-measurement settings, navigation-time delivery, and ASP attribution. No push or production publication performed. Earlier empty-ID statements describe historical status.
- Rollback: restore the empty measurementId in assets/config.js. Next: verify production receipt in GA4 Realtime/DebugView after deployment and review enhanced measurement before buying traffic.
- Review branch: feat/ga4-connection. External link events record clicks only; destination loading, applications and A8 outcomes are separate. Confirm applications and approvals in A8, never count a click as an approved outcome.
- Handoff: use this repository as the shared source of current state, decisions, uncertainties and next tasks; do not assume conversations are automatically shared. Read AGENTS.md and the latest development history at task start, then update changes, test results, unverified items and next tasks at completion. Production deployment remains pending review.
