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

## PR作成・公開状態

GitHub APIの通常呼出し・エスカレーション付き呼出しはいずれもForbiddenでPR作成に失敗。Webページの検索でも対象ブランチの既存PRは見つからなかった。PR作成の成功/番号/URLは確認できていない。コード・本文は作業ブランチに保存し、手動作成可能な画面を用意する。mainは変更しない。

### 次の確認順序

1. レビュー用PRを作成する（下の画面では本文が入力済み。可能ならDraftで作成）。マージ/公開はしない。
2. A8の最新公式案内で改変・計測画像・素材の扱い、掲載条件と指定経路、必要なURL提出等を確認。
3. 発行コードを対象サイト・掲載面と照合し、公開用のサービス条件・必要な開示・運営連絡先を確認。
4. 稼働化の別承認後に実コードを設置し、実ブラウザのGA4受信とASPの許される検証を行う。広告出稿の承認はさらに別。

[本文入力済みのPR作成画面](https://github.com/going-ux/shikin-lp/compare/main...feat/lp-brief-20261016?expand=1&title=%E5%85%AC%E9%96%8B%E6%BA%96%E5%82%99%EF%BC%9AQuQuMo%E5%8D%98%E7%A4%BE%E7%B4%B9%E4%BB%8B%E3%83%BBA8%E8%A8%AD%E7%BD%AE%E6%9E%A0%EF%BC%88%E9%80%81%E5%AE%A2%E5%81%9C%E6%AD%A2%EF%BC%89&body=%23%23+%E5%A4%89%E6%9B%B4%0AQuQuMo%E5%8D%98%E7%A4%BE%E7%B4%B9%E4%BB%8B%E3%80%81%E7%B8%A63%E6%AE%B5%E5%9B%B3%E3%80%81%E5%9B%BA%E5%AE%9A%E3%82%B3%E3%83%94%E3%83%BC%E3%83%BB%E9%85%8D%E8%89%B2%E3%83%BB%E9%BB%84%E8%89%B2CTA%E3%82%92%E7%B6%AD%E6%8C%81%E3%80%82%E7%A9%BA%E3%81%AEA8%E8%A8%AD%E7%BD%AE%E6%9E%A0%E3%81%A8%E5%85%AC%E9%96%8B%E5%90%91%E3%81%91PR%2F%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E8%A1%A8%E8%A8%98%E3%82%92%E6%BA%96%E5%82%99%E3%80%82%E5%AE%9F%E5%BA%83%E5%91%8A%E3%82%B3%E3%83%BC%E3%83%89%E3%83%BB%E8%A8%88%E6%B8%AC%E7%94%BB%E5%83%8F%E3%81%AF%E5%85%A5%E3%82%8C%E3%81%9A%E3%80%81%E5%A4%96%E9%83%A8%E9%80%81%E5%AE%A2%E5%81%9C%E6%AD%A2%E3%82%92%E7%B6%AD%E6%8C%81%E3%80%82%0A%0A%23%23+%E3%83%86%E3%82%B9%E3%83%88%0A320%2F375%2F390px%E3%80%81FAQ%E3%80%81%E5%86%85%E9%83%A8%E3%83%BB%E5%9B%BA%E5%AE%9ACTA%E3%80%81GA4%E5%8D%98%E4%BD%93%2F%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%82%AD%E3%83%A5%E3%83%BC%E3%80%81%E8%A8%AD%E7%BD%AE%E6%9E%A0%E3%81%AE%E9%9D%9E%E8%AA%AD%E8%BE%BC%E3%82%92%E7%A2%BA%E8%AA%8D%E3%80%82%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E3%83%86%E3%82%B9%E3%83%88PASS%E3%80%82%0A%0A%23%23+%E6%9C%AA%E7%A2%BA%E8%AA%8D%0AA8%E6%94%B9%E5%A4%89%2F%E7%94%BB%E5%83%8F%E8%A6%8F%E5%AE%9A%E3%81%AF%E5%85%AC%E5%BC%8F%E6%8E%A5%E7%B6%9A403%E3%81%A7%E6%9C%AA%E7%A2%BA%E8%AA%8D%E3%80%82%E5%AE%9F%E3%82%B3%E3%83%BC%E3%83%89%E3%83%BB%E6%8E%B2%E8%BC%89%2F%E5%BA%83%E5%91%8A%E8%A8%B1%E5%8F%AF%E3%80%81GA4%E6%9C%AC%E7%95%AA%E5%8F%97%E4%BF%A1%E3%80%81A8%E5%B8%B0%E5%B1%9E%E3%82%82%E6%9C%AA%E7%A2%BA%E8%AA%8D%E3%80%82%0A%0A%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC%E7%94%A8%E3%81%A7%E3%81%99%E3%80%82main%E3%83%9E%E3%83%BC%E3%82%B8%E3%83%BB%E6%9C%AC%E7%95%AA%E5%85%AC%E9%96%8B%E3%83%BB%E5%BA%83%E5%91%8A%E5%87%BA%E7%A8%BF%E3%81%AF%E8%A1%8C%E3%82%8F%E3%81%AA%E3%81%84%E3%81%A7%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82%0A%0A%E8%A9%B3%E7%B4%B0%E3%83%BB%E7%94%BB%E5%83%8F%3A+https%3A%2F%2Fgithub.com%2Fgoing-ux%2Fshikin-lp%2Fblob%2Ffeat%2Flp-brief-20261016%2Fdocs%2Frelease-review-20261017.md)
