# A8設置候補のローカル非公開プレビュー

2026-10-26（日本時間）。main `58a51813aa70cbbfcb31e2feb21ffa3dd4172f0c`、A8準備ブランチ `f15c3cf2892775b9ab07a320621593b9b9df0d80` をリモートと照合。mainは準備ブランチの祖先。未コミット変更なしから `feat/private-a8-preview-20261026` を作成。

README、AGENTS、project-state、handoff、improvement-log、a8-installation、seo-release-review-20261018、ququmo-a8-review-20261026を確認。指定資料の欠落なし。新規公開サイトや外部プレビューサービスは作成していない。

## 見て操作する方法

Python 3のみでプレビューを起動できる。Node/Playwright/Chromiumは自動検証用で、閲覧には不要。

```sh
git fetch origin feat/private-a8-preview-20261026
git switch feat/private-a8-preview-20261026
python3 scripts/preview-a8.py
```

起動したPC自身のブラウザで `http://127.0.0.1:8067/` を開く。幅選択320/375/390/1024px、A/Bの個別スクロール、内部/固定CTA、FAQ、キーボード操作、模擬遷移、下部イベントログを確認できる。「最初から確認」でリセット。終了は端末でCtrl+C。ポート使用中なら `--port 8070` 等を指定する。

これは実際にブラウザ操作できるページだが、クラウド環境の127.0.0.1を利用者の端末から開ける共有URLではない。利用者のPCで起動する。外部公開URLは発行していない。0.0.0.0へのbind・トンネル・転送は行わない。スマホ相当幅はPC上のフレームで確認できるが、スマホ実機からの接続は用意していない。

この作業環境にはGit不要のローカル起動用ZIPも作成する。解凍した `shikin-private-preview` フォルダで `python3 scripts/preview-a8.py` を実行。同梱のpreview-baseline.htmlはmainのスナップショットで、公開LPファイルではない。ZIPはGitHub Pagesへ置かない。

## 比較内容

| 項目 | A: 本番相当 | B: 完成候補の表示用複製 |
| --- | --- | --- |
| 基準 | main58a5181のHTML | 準備ブランチのHTML |
| QuQuMo操作 | 準備中・送客停止 | 黄色CTA、候補文言、ローカル模擬遷移 |
| 1px画像 | 読込みなし | ローカルの1px GIFだけを読込む |
| GA4 | ローカルキューのみ | ローカルキューのみ。cta_click/provider_outbound各1回 |
| JS無効 | 停止 | 停止（templateを展開しない） |

発行コード原文は準備ブランチのtemplateと比較画面の読取り専用欄に保持。元のindex.html・assetsは一切変更していない。表示用複製では広告URL/画像URLを明示的にローカルモックへ差し替えるため、発行コードそのままの実送客試験ではない。これは非公開プレビューの安全措置であり、本番素材の改変許可を意味しない。原文への独自パラメータ・独自リダイレクトは追加していない。

Bの自由テキスト、CSS装飾、属性/画像の扱いは未承認。公開用完成版という承認は得ていない。

## 安全措置

- サーバーは127.0.0.1だけにbindし、Hostをlocalhost/127.0.0.1の所定ポートに限定。任意ファイルを配信する汎用サーバーではない。
- A8アンカー/画像はBのDOM複製内だけでローカルモックへ変更。その他の外部リンクもローカルスタブ。フォーム送信なし。
- Googleのタグ読込み先もローカルの空スタブへ変更。元の測定ID・タグ数・イベント設計はソースで保持。
- CSPで外部スクリプト/画像/接続/フォームを禁止。フレームは同一オリジンのみでsandbox付き。noindex、no-store、no-referrerをプレビュー応答に設定。
- 発行コード原文templateは不活性。JavaScript無効なら両版とも停止。
- sourceのcanonical/robots/sitemap/所有権ファイルは変更なし。プレビュー応答のnoindexや外部リンク置換は、公開ファイルの変更ではない。

## テストと画像

`node scripts/test-private-preview.cjs`は起動中のサーバーを使用する。別ポートなら `LP_PREVIEW_ORIGIN=http://127.0.0.1:8070` を指定。

PASS（終了0）: A/B×320/375/390/1024px、横溢れ/CTA横切れ/固定CTA重なりなし、初期コピーとCTA可視、FAQ、内部・固定CTA、Enter操作、page_view初回1回、Aのoutbound0、Bのcta_click/provider_outbound各1回、ローカル画像1px/要求1回、JS無効の安全停止、計測例外でも模擬遷移。実A8クリック/画像リクエスト/申込0。外部リクエスト検査0。

PASS（各終了0）: check-static.py、test-ui.cjs、test-ga4.cjs、assets/analytics.jsとconfig.jsのnode --check、check-seo.py、既存test-a8.cjs、git diff --check。既存test-a8には証跡出力先の環境変数だけ追加し、今回の回帰検証は `/tmp/shikin-a8-regression-20261026` に出力（過去証跡は上書きしない）。

- [PCでのA/B比較画面](evidence/private-preview-20261026/comparison-desktop.png)
- [375px AのCTA](evidence/private-preview-20261026/a-cta-375.png) / [375px BのCTA](evidence/private-preview-20261026/b-cta-375.png)
- [PC 1024px A](evidence/private-preview-20261026/a-full-1024.png) / [PC 1024px B](evidence/private-preview-20261026/b-full-1024.png)
- [375px全体 A](evidence/private-preview-20261026/a-full-375.png) / [375px全体 B](evidence/private-preview-20261026/b-full-375.png)
- [全8ケースの結果JSON](evidence/private-preview-20261026/results.json)。320/390px画像も同フォルダ。

目視でも375pxのCTAと比較画面を確認。GitなしのZIPを実際に解凍し、別ポート8071で起動して同じ全8ケースの検証も終了0。実機/スクリーンリーダー/文字拡大/5秒理解の利用者テストは未確認。ローカルキューはGoogleのネットワーク送信・管理画面受信ではない。

## 更新された本番情報と残課題

利用者は2026-10-26にSearch Console所有権確認、sitemap送信、インデックス登録、GA4本番イベント受信を利用者側で確認済みと申告。当環境での独立確認や全イベント別の突合を行ったとはしない。過去ログの未確認は当時の状態。SEO流入実績、A8成果帰属、広告収益性は未検証。

通常掲載面の可否、自由テキスト表現、CSSボタン化/属性/画像の扱いは[既存確認事項](ququmo-a8-review-20261026.md)のまま未確認。公式確認の証拠を新規取得したとはしない。問い合わせ・申請は送信していない。検索広告の許可とは別に判定する。

次は利用者の見た目・操作レビューと適用条件の確認。公開に進むには、通常掲載/素材条件の解消、許された実コードの別実装、広告/プライバシー表記、実コードの再テスト、PR/保護ルール確認、公開範囲の承認が必要。今回mainマージ・Pages公開・A8稼働・広告出稿は行わない。

## GitHubへの提出

作業ブランチにコード・画像・記録をpushする。公開リポジトリ上の資料であり、動作するプレビューを一般公開するものではない。会員向け数値・条件や認証画面は含めない。

今回はPRの自動作成を実施しない（前作業で通常/権限昇格ともAPI403）。必要なら[Draft PR作成画面](https://github.com/going-ux/shikin-lp/compare/main...feat/private-a8-preview-20261026?expand=1)で本書を本文として使用する。Draftから解除・マージしない。
