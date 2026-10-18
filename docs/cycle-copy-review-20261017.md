# 入金サイクル図の見出し・説明改善

2026-10-17、feat/lp-brief-20261016。変更前2494aac。利用者指定の核心「取引先ごとに入金日が異なり、材料費・外注費の支払いが先になることがある」を短く伝える。受け入れ条件は図解・契約条件の注記を維持し、図の前に説明を集約、375pxの前後を比較し、回帰を確認すること。CVR改善は未測定。

## 変更

見出し：**入金日はバラバラ。でも、支払いは先にやってくる。**

説明：取引先によって入金日は翌月・翌々月などさまざま。材料費や応援職人への支払いが先になると、売上があっても手元のお金が不足することがあります。

図の後の重複説明を削除。縦3段、契約で時期が異なる注記、固定コピー、CSS・配色、黄色CTA、GA4処理・設定は維持。

## 375px変更前後

| 変更前 | 変更後 |
| --- | --- |
| [図解部分](evidence/cycle-copy-20261017/before-375.png) | [図解部分](evidence/cycle-copy-20261017/after-375.png) |
| [ページ全体](evidence/cycle-copy-20261017/before-full-375.png) | [ページ全体](evidence/cycle-copy-20261017/after-full-375.png) |

![変更後375px](evidence/cycle-copy-20261017/after-375.png)

## 検証

- Chromium/Playwright、320/375/390×780pxの前後6ケース：横溢れ0、JS例外0、3段と注記を確認。
- ヒーローCTA、FAQ、単社表示、試作CTAの送客停止、page_view/compare_view/compare_click/cta_click各1回、provider_outbound 0回、query除外を確認。全外部通信を遮断したローカル検証で、GA4実受信ではない。
- python3 scripts/check-static.py、node scripts/test-ui.cjs、node scripts/test-ga4.cjs、git diff --check：PASS。図解セクション以外のHTMLとassetsの一致を確認。
- セクション高さ：375/390pxで約621→672px、320pxで約641→722px。文章の明確化と引き換えに高さが増える。実機、5秒理解、CVR/利益、GA4実受信は未検証。

[差分](evidence/cycle-copy-20261017/changes.patch) / [ブラウザ結果](evidence/cycle-copy-20261017/results.json)

mainマージ・本番公開・広告なし。次は見出しと説明のレビュー。取り消しはこの変更コミットを戻す。
