# Measurement and advertising launch gate

Current status: diagnostic dataLayer / lp:analytics events only; no collector, revenue tracking or live A/B allocation. Official links generate no affiliate revenue. Do not buy traffic yet.

## Events
- lp_view: page view, baseline/A, page version, selected business type.
- compare_click: internal navigation; never count as a lead.
- business_type_select: declared business type; never infer eligibility.
- provider_outbound: provider, CTA position, business type, official link kind; never count as application or approved conversion.

Configure an authorized analytics property/collector, update the privacy disclosure to actual processing, and validate receipt on real navigation before launch. Never send form content, full query strings, contact details or financial data. Define permitted campaign IDs and ASP sub-ID format from the actual program terms; do not append arbitrary parameters to affiliate URLs.

## Revenue data
Join ad platform campaign/day spend, impressions and clicks with analytics LP sessions/outbound clicks and ASP application/approval/rejection/approved reward exports. Use permitted campaign/variant sub-ID, timezone Asia/Tokyo, conversion cohort and attribution window. Deduplicate by ASP transaction ID; account for reporting delays and refunds. Keep private financial exports out of this public repository.

CTR = ad clicks / impressions; CPC = spend / ad clicks; LP outbound rate = outbound sessions / LP sessions; application CVR = attributed applications / ad clicks; approval rate = approved / decided applications (exclude pending); approved CPA = spend / approved outcomes; ROAS = approved reward / spend; contribution = approved reward - ad spend - variable costs. Zero denominators are unavailable, not zero. Profit after overhead is distinct from contribution.

Break-even CPC = application CVR × approval rate × reward per approved outcome (single reward assumption, before other costs). Mixed providers require cohort-weighted reward. Do not use historic EPC or guessed CVR as profit evidence.

## Launch checklist
1. Verify each ASP's account-specific approval, reward, outcome definition, rejection rules, cookie/attribution window, paid search/brand keyword/display permissions, comparison page rules and allowed landing domains. Record source/date; all are currently NOT VERIFIED.
2. Install issued affiliate URLs; label PR near comparison and affiliate links; use rel=sponsored for paid links.
3. Provide verified operator contact channel; do not invent email/address.
4. Connect collector and verify lp_view, type selection, outbound and ASP test attribution; distinguish click from lead.
5. Check 320/375/390px, keyboard, focus, sticky footer occlusion, real device and slow network. Measure LCP/CLS/INP; page size alone is not speed evidence.
6. Define maximum test loss and stop rule before spending.

## First experiment (not active)
Only after launch gates pass: baseline approved headline vs same headline plus shorter benefit explanation; one change only, stable random 50/50 assignment, experiment/variant attached to allowed ASP sub-ID. Primary metric: approved contribution per ad click; guardrails: approval rate, approved CPA. Predetermine minimum meaningful effect, sample size from baseline rates, decision window and ASP maturity period. Avoid stopping early on outbound clicks. With low volume, gather a baseline before splitting traffic. Comparison order remains unranked until an explicit experiment.
