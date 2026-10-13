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
