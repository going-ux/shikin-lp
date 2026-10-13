---
name: lp-improvement
description: Analyze, implement and independently verify conversion-focused improvements to the construction finance landing page.
---

# LP improvement procedure

1. **Baseline:** Record the page, target audience, ad message, existing behavior, and available analytics.
2. **Hypothesis:** State the problem, proposed change, expected user behavior and primary metric (e.g. qualified affiliate click-through or confirmed conversions).
3. **Acceptance criteria:** Specify mobile behavior, link targets, accuracy requirements, accessibility checks and rollback plan before coding.
4. **Implementation:** Change only necessary files and preserve CNAME.
5. **Independent evaluation:** Review implementation against criteria without assuming the creator's assertions are correct. Classify each check PASS / FAIL / NOT VERIFIED.
6. **Measurement:** For an A/B test, define assignment, event tracking, sample size considerations and a decision rule before traffic is sent. Do not claim causal lift from a visual review.
7. **Learning:** Add meaningful defects, fixes, verification results and follow-up hypotheses to docs/improvement-log.md. Promote repeated findings to AGENTS.md or automated tests only after review.

## Required output
- Files changed
- Hypothesis and acceptance criteria
- Verification evidence and unverified items
- Risks and rollback
- Next measurable experiment

## Reusable lessons from other projects
1. **Offer research before copy:** Build a provider evidence matrix with source, retrieval date, advertiser permission, business-type eligibility, fees, funding timing, required documents, notification rules, reward, approval rate, EPC, conversion event and restrictions. Mark unknowns explicitly.
2. **Unit economics:** Estimate allowable CPA from verified reward × approval probability, then deduct expected ad cost and any other costs. Treat this as a model until measured. Start with a controlled small-budget test, not an assumed profitable campaign.
3. **Design continuity:** Compare each iteration to the approved blue/white/yellow direction and headline. Maintain clear construction-specific visuals, a dated payment timeline and restrained mobile information density.
4. **Independent research tracks:** Investigate offer rules and existing code separately when possible; merge evidence into one implementation plan. Never substitute generic market claims for provider-specific verification.
5. **Verification first:** State exact completion conditions and how to verify them before implementation. Do not treat an AI screenshot impression as device/browser testing.
6. **Feedback capture:** After each meaningful review, write problem → observed evidence → root cause hypothesis → updated rule/check → verification → remaining uncertainty.
7. **Transfer carefully:** Reuse general patterns from WordPress and construction-app work (staged rollout, backups, real-environment checks) but do not copy unrelated project-specific requirements into this LP.
