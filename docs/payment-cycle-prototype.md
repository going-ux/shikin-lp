# 入金サイクル図の開発試作

## 仮説・受け入れ条件（実装前）

対象: 829231f の既存サイクル図。工程・具体例・契約による差を明示すれば、スマートフォンで支払いと入金の順序を理解しやすくなるという仮説。CVR 向上は未測定。

- 既存の図解だけを縦3段へ置き換える。工事中の支払い→工事完了・請求→契約上の支払日に入金。
- 材料費・応援職人への支払いを短く例示し、実際の時期は契約で異なると明記。
- 青白黄、固定コピー、比較機能、CTA、GA4 と CNAME を維持。
- 320/375/390px の変更前後を Chromium で撮影し、横溢れ・図解の収まり・CTA・切替を検証。
- 静的チェック、UI テスト、GA4 テストを実行。ブラウザ検証では外部通信を遮断し、GA4 実受信と区別。
- 新ブランチのみ。main マージ、本番公開、広告出稿は行わない。

## 結果

検証日: 2026-10-15。ブランチ feat/mobile-payment-cycle、変更前 829231f。Chromium + Playwright のモバイルエミュレーション、各幅×高さ780px、DPR1。実機の検証ではない。

| 幅 | 変更前 | 変更後 | ブラウザ確認 |
| --- | --- | --- | --- |
| 320px | [画像](evidence/payment-cycle/before-320.png) | [画像](evidence/payment-cycle/after-320.png) / [固定CTA込み](evidence/payment-cycle/after-viewport-320.png) | 横溢れなし、縦3段、比較・CTA・イベント成功 |
| 375px | [画像](evidence/payment-cycle/before-375.png) | [画像](evidence/payment-cycle/after-375.png) / [固定CTA込み](evidence/payment-cycle/after-viewport-375.png) | 横溢れなし、縦3段、比較・CTA・イベント成功 |
| 390px | [画像](evidence/payment-cycle/before-390.png) | [画像](evidence/payment-cycle/after-390.png) / [固定CTA込み](evidence/payment-cycle/after-viewport-390.png) | 横溢れなし、縦3段、比較・CTA・イベント成功 |

- [機械検証結果](evidence/payment-cycle/results.json)、[index.html の差分](evidence/payment-cycle/index.patch)。
- 全幅の変更前後で、個人3→法人3→展開5→個人3、ヒーローと固定 CTA を実クリック。外部クリックは遷移を抑止して記録だけ検査。ページ例外0、page_view 1回、切替2回、展開1回、内部 CTA 1回、外部クリック1回（結果JSONは固定CTA押下前）。
- ローカル静的／UI／GA4テスト、JS構文、差分チェック成功。GA4 と設定、CNAME、固定コピー、図解以外の本文はベースと一致。
- 全外部通信を遮断。Google本番受信、実際の外部到着、A8成果、実iOS/Android・safe-area、スクリーンリーダー、CVRへの効果は未確認。

### 長さのトレードオフ

- 320px: 図解セクション高さ 317px → 641px。
- 375px: 図解セクション高さ 317px → 641px。
- 390px: 図解セクション高さ 317px → 621px。

既存セクションの置換だが、縦3段と注記により比較までのスクロール量は増える。固定CTAで比較へ直行できることは検証済み。理解改善・離脱への影響は利用者レビューと将来の実測で評価し、改善を断定しない。

### 開発環境での確認・再実行

リポジトリ直下で python3 -m http.server 8001 --bind 127.0.0.1 を起動。開発環境内のブラウザで図解と比較を確認する。外部GA送信を避ける検証は下記のPlaywrightを使う。通常ブラウザで開くと既存GA設定が動作する点に注意。

変更前用の一時ディレクトリへ git show 829231f:index.html と同コミットの assets/config.js、assets/analytics.js を配置し、ポート8002で同様に配信する。Chromium (/usr/bin/chromium) と Playwright が必要。両サーバー起動後に node scripts/test-payment-cycle.cjs をリポジトリ直下で実行すると画像とJSONを再生成する。HTML/JSは一時コピーで、追跡ファイルを変更しない。検証用ブラウザは外部通信を遮断する。

ロールバックは本ブランチの index.html 変更を取り消す。次の実験は本試作の読みやすさをレビューし、計測・商用条件が揃ってから基準データと比較する。
