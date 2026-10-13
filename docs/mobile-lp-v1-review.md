# Mobile LP v1 — pre-release evaluation (2026-10-14)

## Hypothesis
A construction-specific headline, payment-cycle explanation, clear comparison section and mobile sticky CTA will make the service options easier to understand. Conversion lift is **not measured**.

## Changes
- Added `preview/index.html` as a standalone responsive prototype.
- Existing production `index.html`, `CNAME` and DNS settings remain untouched.
- No third-party tracking, affiliate links or external dependencies added.

## Independent checklist
- PASS (source inspection): approved headline, blue/white/yellow theme, ad disclosure, construction-specific explanation, FAQ, anchor CTAs, semantic buttons, aria-pressed selection state and live announcement.
- PASS (source inspection): three provider names displayed without unsupported fees, rankings, speed or eligibility claims.
- PASS (source inspection): mobile breakpoints and small-width adjustments are defined.
- NOT VERIFIED: actual rendering at 320/375/390px, overflow, touch target ergonomics, keyboard screen-reader tests, Lighthouse performance and live browser behavior.
- NOT VERIFIED: service terms, current affiliate approval, ad-platform policies and destination URLs.
- NOT VERIFIED: CTR, CVR, CPA, EPC and commercial profitability.

## Release blockers
- Provider outbound CTAs are deliberately disabled pending verified affiliate URLs and permissions. This preview is not suitable for paid-traffic launch.
- Mobile/browser tests and commercial/legal review required before publishing.
- Add privacy policy and tracking consent assessment before deploying analytics.

## Next experiment
After links and measurement are ready, compare hero CTA copy emphasizing service comparison versus payment-gap relief. Define qualified outbound click and confirmed conversion events, allocation and stopping criteria before launch.
