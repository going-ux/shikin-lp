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

## 2026-10-14 — PR #4 standard page_view correction
- Replaced lp_view with one manual standard page_view at initial execution, retaining send_page_view:false and query/fragment-free page_location. No HTML/CSS or publication setting changes.
- Added scripts/test-ga4.cjs using the actual config and analytics connector: PASS single tag/config, one page_view after interactions, zero lp_view, one selection/internal CTA/external click each, expansion event, sanitized URLs and privacy text. Existing UI tests, static checks and JS syntax PASS.
- Initial test failure came from cross-VM array prototypes in deepStrictEqual; normalize arrays in the host realm and rerun passed. No application failure was observed.
- Updated docs/measurement.md and docs/ga4-review.md. GitHub API rejected PR body editing with Forbidden; the revised body is retained in docs/ga4-review.md for manual update.
- NOT VERIFIED: network delivery, GA4 Realtime/DebugView receipt, enhanced measurement and navigation-time delivery, real-device layout, A8 attribution. External click events are not applications or approved outcomes.
- Next: copy docs/ga4-review.md into PR #4's description, review before merge, then verify production GA4 receipt. Production is not deployed by this change.

## 2026-10-14 — PR #4 merge and production deployment
- User confirmed review and authorized merging PR #4 and production deployment. GitHub GraphQL merge was Forbidden; merged the reviewed branch through native Git with a merge commit and pushed main. GitHub PR #4 now reports Merged. Application merge commit: eb9ac00.
- PASS on merged code: static checks, UI tests, GA4 event tests (one manual page_view, automatic disabled, no lp_view, selection/CTA/outbound events and query-free URLs).
- PASS: GitHub Pages run #12, https://github.com/going-ux/shikin-lp/actions/runs/38577750133, reports Success for eb9ac00; total duration 1m17s, deploy job 44s. Deployment target shown as shikin.diggworks.com. A stale initial summary showed In progress; a cache-busted read confirmed Success.
- NOT VERIFIED: direct public asset content. Requests to https://shikin.diggworks.com/assets/config.js and assets/analytics.js were rejected by this environment's network route with 403; an escalated read also returned 403. This does not establish a website failure. Deployed filesystem/content equality cannot be claimed from workflow success alone.
- NOT VERIFIED: actual GA4 Realtime/DebugView receipt; no authenticated GA4 administration/browser capability is available. No synthetic production events were sent to substitute for real browser reception. Applications and approvals remain separate A8 checks.
- Next: from an accessible browser check public config contains G-JGJTNJHVZ5 and analytics contains track('page_view') with send_page_view:false; visit the LP, operate selection/internal CTA/external link, and confirm GA4 receives page_view once and the corresponding events. Review enhanced measurement for additional automatic page views/outbound events. Record the observed results here; do not claim receipt or approved outcomes until verified.

## 2026-10-15 — 案件・検索市場・収益調査（公開資料）

- 参照main: 45661589537a76794f62c3577bb8c946ff1f033c。
- docs/affiliate-research-20261015.mdを追加。既存実装、案件別の確認課題、新規候補、検索意図、月1万/3万/5万/10万円の仮定試算、出稿前の条件、Codexへの実装依頼を記録。
- A8は認証後に管理画面を一度確認したが、その後再認証へ戻った。申込中データなしという表示だけでは承認/否認を判定できない。最新案件条件・提携状態・EPC・確定率は未確認。
- アクセルの個人対応とマイナビの金額条件について公式窓口間の違いを記録。指定広告LPとASP成果条件の照合を次の必須作業とした。
- A8の非公開報酬・統計や認証情報を公開リポジトリへ掲載していない。公式に公開されたFREENANCE直接紹介制度はA8と区別して記録。
- GA4 ID設定は現行コードで確認。実受信は未確認。公開LPのウェブ取得エラーをサイト障害やデプロイ失敗とは扱っていない。
- 検証: 数式・全予算ケースをJavaScriptで再計算、CPC/CTR/CVR等の仮定表示と出典をレビュー。資料のみのためUI/静的機能テストは今回未実行。
- 本番UI、広告リンク、GA4設定、CNAME、公開設定は変更なし。広告の開始・提携申請・問い合わせ送信は未実施。
- 次回: A8現条件の非公開台帳 → 広告許可/指定LP整合 → Keyword Planner実数 → 計測帰属確認 → 停止条件付きの初回テスト判断。
