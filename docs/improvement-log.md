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


## 2026-10-15 — 共通ドキュメント管理基盤
- README、docs 全体、AGENTS.md、Git 履歴と main 4566158 を確認。Chat・Work・Codex の引き継ぎ先をリポジトリに統一し、README から project-state.md / handoff.md / 既存履歴へ案内。
- project-state.md に現状・事業決定・提案・未解決事項・次の作業を集約し、詳細の計測／広告／監査文書は再利用。handoff.md に開始・完了時の更新手順と証拠の扱いを記載。GA4 review は履歴として明示し、measurement.md の古い未接続・レビュー待ち記述を訂正。
- GA4 は実装済み・ローカルテスト成功・対象コミットのデプロイ成功と、公開ファイル一致／送信／本番受信未確認を分離。利用者共有画面の0人表示は観測にとどめ、原因・成功を推測しない。
- 文書のみの変更。コード、デザイン、GA4 設定、AGENTS.md、CNAME、公開設定は変更なし。文書リンクと差分を確認し、アプリテストは変更対象外のため再実行しない。
- 次: この文書ブランチをレビュー後に統合し、公開ファイルと GA4 実受信の切り分けを進める。文書ブランチは main 未反映で、今回マージ／公開操作は行わない。


## 2026-10-15 — 入金サイクル図の開発試作
- 利用者が採用した融合方針に基づき、新ブランチ feat/mobile-payment-cycle、main 829231f を基に試作。図解のみ縦3段へ変更し、材料費・応援職人・契約による時期差を短文で明示。
- 青白黄、固定コピー、比較機能、CTA、GA4、CNAME、公開設定は維持。ローカルでのスクリーンショットと操作を docs/payment-cycle-prototype.md / evidence/payment-cycle に記録。
- PASS: 320/375/390×780px Chromium、横溢れなし、切替3→3→5→3、CTA実操作、page_view1回、比較切替・内部CTA・外部クリックのキュー検証、ページ例外0。外部通信と外部遷移を抑止したローカル検証で、実受信ではない。既存の静的・UI・GA4テスト成功。
- レビューで改行の端数と図の列幅を調整し再撮影。セクションは縦長になるため、理解と離脱の影響は未測定。実機、safe-area、GA4本番受信、外部到着、A8成果は未確認。
- mainマージ・本番公開・広告出稿なし。次は変更前後の図と長さをレビュー。取り消しは試作ブランチのindex.html変更を戻す。


## 2026-10-16 — 実装指示に基づくローカル単社試作
- main 829231fを照合し、新ブランチfeat/lp-brief-20261016へ縦3段の未公開試作を再利用。利用者回答によりQuQuMo単社紹介とし、他社データ・比較機能を保持して非表示。新規外部pushやmainマージはしない。
- 固定コピー・青白黄・黄色CTA・GA4 ID・自動page_view無効・手動1回を維持。図解注記、単社の文言、試作ボタン、activeProviders/previewMode、設定失敗時にも未公開候補を表示しないガードを追加。
- compare_view（見出し表示到達1回）をcompare_clickから分離。試作CTAはcta_click/disabledで記録し、provider_outboundを作らない。単社で未選択の属性はunspecified。最新の公式情報は403で未取得のため古い最低手数料等を表示から外した。
- PASS: 静的検査・UI/GA4単体・JS構文、320/375/390pxのChromium（高さ780/640）、FAQ、キーボード、固定CTA、横溢れ、到達の重複防止/直接アンカー/スクロール、JavaScript無効/設定失敗、旧複数社3→3→5→3と外部クリックの互換。外部通信を遮断したローカル検証で、本番受信ではない。
- 試作aria-disabledの検査は意図的操作のforceクリック、プライバシーは閉じた欄を開いて確認するよう修正し再実行成功。詳細・画像・差分・イベント仕様はdocs/implementation-review-20261016.md。
- 未確認: 添付2件目、最新条件、掲載/広告許可、全GA4実受信、A8帰属、メール受信、実機とCVR/利益。添付そのもの・非公開案件数値はコミットしない。
- 次: 不足資料との照合、試作レビュー、送客稼働に必要な条件確認と別途承認。外部公開・mainマージ・広告出稿・A8申請・問い合わせ送信なし。


## 2026-10-16 — 追加戦略資料の受領・照合
- 追加資料を全体確認し、単社紹介・他社保持・外部送客停止・既存デザイン/計測維持の実装と照合。コードの追加変更は不要。
- 最新状態の資料未受領記述を訂正。会員向け数値・非公開条件・資料本体はリポジトリや共有ZIPに転記しない。過去の未受領記録は当時の履歴として保持。
- 個別の掲載/広告経路の許可、公開用条件、リンク/掲載面、GA4実受信、A8帰属は未完了。資料内の計画を広告開始承認としない。
- 文書差分と共有ZIPの内容を検査。コード変更なしのためアプリテスト再実行なし。外部push・公開・mainマージ・広告・問い合わせ送信なし。


## 2026-10-16 — 戦略チーム向けGitHub共有の承認
- 利用者が公開リポジトリへのコード・画像のブランチpushを明示承認。公開可能な試作、画像、差分、テスト記録に限定して共有する。内部資料・会員向け数値・非公開条件・認証情報は追加しない。
- docs/strategy-review.mdを共有の入口に追加。mainマージ、Pagesデプロイ、広告出稿、A8申請・問い合わせ送信は承認範囲外で実施しない。GA4実受信とA8帰属は引き続き未確認。


## 2026-10-17 — 入金日の違いと先行支払いの説明
- 昨日の未push作業は環境に残っていなかったため、共有済み2494aacから同じ見出し・説明修正を再適用。作業ブランチはfeat/lp-brief-20261016。
- 「入金日はバラバラ。でも、支払いは先にやってくる。」と短い説明へ変更。図後の重複文を削除。図・注記・他セクション・CSS・CTA・GA4は維持。
- PASS: 指定375px画像の前後、320/375/390の横溢れなし/例外0、FAQ・CTA・計測キュー、静的/UI/GA4単体、差分検査。375pxのセクションは約52px増。外部通信遮断の検証で本番受信・CVR効果は未確認。
- docs/cycle-copy-review-20261017.mdに証跡を保存し、戦略チーム向け入口を更新。ブランチ共有のみ、本番公開・mainマージ・広告なし。次は表現と長さのレビュー。


## 2026-10-17 — A8設置枠と公開準備表記
- 利用者依頼に基づきfeat/lp-brief-20261016で公開準備。空で不活性なtemplate設置枠を用意し、previewMode:trueと無効CTAを維持。A8コード・リンク・計測画像を稼働化しない。
- PR・準備中案内・プライバシーを利用者向けに整備。静的HTMLにGoogleの説明/参照リンクを記載し、JSによる上書きを削除。コード内容を推測した広告URLや画像を作っていない。
- A8公式規約/FAQへのアクセスはCONNECT経路403で失敗。改変許可/計測画像削除の可否は未確認。発行コードを加工・画像省略しない保留方針と、条件確認後の別承認手順をdocs/a8-installation.mdへ記録。会員向け情報の転記なし。
- PASS: 静的/UI/GA4、320/375/390pxと高さ780/640px Chromium、FAQ・キーボード・CTA、空枠と合成fixtureの画像非読込、旧比較機能互換。結果と画像はdocs/release-review-20261017.md。GA4実受信・A8帰属・実機・CVR/利益は未確認。
- GitHub APIは通常/エスカレーションともForbiddenでPR作成失敗。本文と手動作成画面を保存。レビュー用ブランチへのpushのみ。本番公開・mainマージ・Google広告・A8申請/問い合わせ送信なし。
- 次: PRレビュー、A8最新のコード/画像/掲載条件と発行コードの確認、別途稼働承認、GA4/ASPの許される本番検証。


## 2026-10-17 — PR #8最終レビュー
- WebとGit refでPR #8 Draft、head7c5ba8f、base829231f、GitHubテストマージref5b280756を確認。baseはheadの祖先で競合なし。Checks画面はチェックなし、No reviews。保護ルール・実行者権限を含む最終可否はAPI403で未確認。Draft解除はしない。
- 静的/UI/GA4/JS構文と320/375/390px Chromiumを再検証して成功。追加の3幅×高さ640/780でPR・初期hero CTA・内部遷移後の見出し可視、固定CTAと重なりなし、A8リンク/画像なしを確認。
- 今回修正必須のアプリ不具合は確認されず、PR未作成の古い文書状態を訂正。docs/pr8-final-review-20261017.mdへ掲載・コード/画像・指定LP・クリック計測・本番受信・公開承認・広告開始のゲートを分けて記録。
- A8公式・公開アセットの取得は今回も経路403。コード/画像規定、実コード・GA4実受信・ASP帰属・実機・CVR等は未確認。内部資料・会員情報は転記せず。mainマージ・本番公開・広告・A8問い合わせ送信なし。


## 2026-10-18 — SEO検証用・送客停止版の公開準備
- 利用者依頼によりPR #8でSEO基本設定を追加。canonical・rootのみのsitemap・robots・OG・title/descriptionを整合。本文/CSS/図解/黄色CTAとGA4/CNAME/AGENTSは変更前と一致。
- A8空枠・previewMode:true・無効CTAを維持。実コード・計測画像・送客・広告を有効化しない。Search Consoleの所有権確認や送信も未実施。
- PASS: SEO/静的/UI/GA4/JS構文、320/375/390px Chromium、FAQ/内部・固定CTA、停止状態、ローカルHTTP200/配信内容一致。初回の古いサーバー応答失敗から別ポートに切替えて再実行成功。証跡はdocs/seo-release-review-20261018.md。
- SEO検証用の送客停止版としてレビュー可能と判断。公開後の実配信・GA4実受信・インデックス登録は未確認。mainマージ・本番公開・Google広告・A8稼働なし。Draft解除は操作結果を追記する。
