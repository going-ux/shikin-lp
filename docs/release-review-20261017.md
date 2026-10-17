# 公開準備レビュー（送客・公開は未承認）

対象: going-ux/shikin-lp / feat/lp-brief-20261016。作業前 d42473a、main 829231f。2026-10-17。

## 変更前の確認と受け入れ条件

固定コピー、青白黄、縦3段の入金サイクル図、黄色CTA、単社紹介、GA4手動page_view1回・自動無効を維持する。最新の375px図解と既存の静的/UI/GA4検証記録を確認した。

- A8コードを収容する設置枠を用意するが、実コードは未受領、リンク・計測画像を発火させない。条件と別途承認が揃うまで停止を維持。
- A8公式規約・FAQを確認する。取得できない項目は未確認とし、改変・画像削除の許可を推定しない。
- PR/プライバシー/試作文言を利用者向けに整える。準備中の申込みを利用可能と見せない。
- 320/375/390px、FAQ、内部CTA、固定CTA、GA4の回帰を実ブラウザと既存テストで確認する。A8計測画像が読み込まれないことも検証。
- mainマージ、Pagesデプロイ、Google広告、A8申請・問い合わせ送信なし。非公開A8情報はコード・PR・公開ログへ記載しない。

## 広告コードの取り扱い（現時点）

今回の公式アクセス先（公開ページ）:

- https://www.a8.net/compliance/prohibited-matter.php
- https://www.a8.net/compliance/media-userpolicy.php
- https://support.a8.net/a8/as/faq/
- https://www.a8.net/compliance/prNotation-urlSubmission.php

いずれも実行環境のCONNECTトンネルが403で拒否。本文を取得できず、最新規定の改変許容範囲・計測画像の扱い・掲載URL提出手順を独立確認できていない。サイトの障害や規約の禁止条項と解釈しない。

確認完了までの実装方針は「発行コードを加工しない、画像を省略しない、そもそも読み込まない」。これは保守的な保留方針であり、A8から変更許可を取得したという意味ではない。発行コード・送客先・掲載面・計測・公開用素材を確認してから、[設置手順](a8-installation.md)に従って別途変更・レビューする。

## 結果・残課題

実装とローカル検証は以下のとおり。GA4実受信、A8帰属、実機、最新の公開条件、掲載・検索広告経路の許可、連絡先受信、予算・停止条件は未完了。公開準備PRはレビュー用で、マージ可能・広告開始可能という判定ではない。


## 実装した内容

- PR表記を「PR｜ファクタリングのサービス紹介」に整備。公開画面から「開発試作」「（試作）」を除き、準備中で申込みできないことはボタン直下とフッターで明示。
- GA4利用・Cookie等・カスタムイベントの送信項目・Googleのプライバシー/データ利用/オプトアウトへの参照を静的HTMLへ記載。JavaScriptが説明を短文で上書きする処理は削除し、参照リンクを保持。
- QuQuMoの案内ボタンを設置枠ququmo-affiliate-slotに収め、空のtemplate#ququmo-a8-codeを追加。実コード・画像は入れておらず自動展開もしない。previewMode:trueを維持。
- ページ版を20261017-release-prepに更新。GA4 ID、手動page_view1回、自動無効、イベント名、単社表示、保留候補の非表示、図解と見出し・固定コピー・CSSは維持。
- 架空の広告URL・追跡ID・計測画像を本番HTMLへ作っていない。実広告コードと最新の許可条件の受領後に、別変更で稼働化をレビューする。

PRにはmainとの差分として、先行作業の縦3段図解・単社紹介・compare_view・送客停止機構も含まれる。今回の準備作業だけの差分ではない。

## 再テスト結果

| 検証 | 結果 |
| --- | --- |
| python3 scripts/check-static.py | PASS: 内部リンク、資産、CNAME、停止中CTA、空の広告枠、実A8コード/画像なし |
| node scripts/test-ui.cjs | PASS: 既存の複数社選択・開閉・イベント互換 |
| node scripts/test-ga4.cjs | PASS: page_view1回、自動無効、表示到達の重複なし、無効CTAと外部クリックの分離、query除外、静的プライバシー参照 |
| LP_EVIDENCE_DIR=docs/evidence/release-prep-20261017 node scripts/test-payment-cycle.cjs | PASS: Chromium、320/375/390px、高さ780/640px、横溢れなし、FAQ/キーボード/内部・固定CTA、単社/JS無効/設定失敗、GA4キュー、旧機能互換 |
| templateに合成リンク＋1px画像のfixtureを投入 | PASS: templateは不活性、画像リクエスト0、DOM上の広告リンク0、外部遷移0。fixtureはexample.invalid上のテスト専用値で、A8発行コードの再現ではない |
| JS構文・文書リンク・git diff --check | PASS |

全外部通信を遮断したローカル検証。本番GA4受信や実A8コードの動作・成果帰属を確認したものではない。実機・低速回線・スクリーンリーダー・5秒理解・CVR/利益も未確認。

### 画像

| 幅 | 公開準備後の全体 | サービス情報 |
| --- | --- | --- |
| 320px | [全体](evidence/release-prep-20261017/after-full-320.png) | [カード](evidence/release-prep-20261017/after-provider-320.png) |
| 375px | [全体](evidence/release-prep-20261017/after-full-375.png) | [カード](evidence/release-prep-20261017/after-provider-375.png) |
| 390px | [全体](evidence/release-prep-20261017/after-full-390.png) | [カード](evidence/release-prep-20261017/after-provider-390.png) |

[ブラウザ結果JSON](evidence/release-prep-20261017/results.json)。A8管理画面や内部資料の画像・数値は含まない。

## PR作成・公開状態（更新）

初回のAPI作成は403で失敗したが、その後利用者により [PR #8](https://github.com/going-ux/shikin-lp/pull/8) がDraftで作成されたことを確認。現在の最終レビューと公開までの残課題は [PR #8最終レビュー](pr8-final-review-20261017.md) を参照。履歴上の競合なし、Checksなし、Draftを維持。main未変更。

### 次の確認順序

1. 作成済みPR #8をレビューし、残課題を解消する。Draft解除・マージ/公開は別承認。
2. A8の最新公式案内で改変・計測画像・素材の扱い、掲載条件と指定経路、必要なURL提出等を確認。
3. 発行コードを対象サイト・掲載面と照合し、公開用のサービス条件・必要な開示・運営連絡先を確認。
4. 稼働化の別承認後に実コードを設置し、実ブラウザのGA4受信とASPの許される検証を行う。広告出稿の承認はさらに別。

