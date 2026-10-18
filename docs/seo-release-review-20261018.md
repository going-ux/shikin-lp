# PR #8 SEO検証用の公開準備

2026-10-18、日本時間。ブランチfeat/lp-brief-20261016、変更前ee39c49、main829231f。これはSEO検証用・送客停止版のレビュー準備であり、A8稼働版やGoogle検索広告の公開承認ではない。

## 変更前確認・受け入れ条件

- 固定コピー、CSS/配色、縦3段図、黄色CTAと本文は維持。
- title/descriptionを単社型の説明内容に整合し、canonicalとOG情報を追加する。
- robots.txtとsitemap.xmlを追加。rootのみをsitemapへ登録し、開発資料を検索対象として積極的に案内しない。robotsはアクセス制限ではない。
- GA4 ID・自動page_view無効・手動1回・query除外を維持。A8コード/画像・送客は停止、空の設置枠と準備中案内は維持。
- 320/375/390px、FAQ、内部/固定CTA、単社表示と計測を再テストしてGitHubに記録。
- 問題がなければDraftをReady for reviewへ変更する。mainマージ・Pages公開・広告・A8稼働はしない。

## 完了としないもの

本番HTML/ヘッダー・robots/sitemapの配信、本番GA4全イベント受信、Search Console確認・sitemap送信・インデックス登録/掲載順位、最新サービス条件、実機/CWV、A8条件・実コード・成果帰属、Google広告は未確認。設定追加だけで検索流入・順位・利益改善を保証しない。公開後の確認とA8稼働の確認は分離する。

## 実施内容

- titleとdescriptionを建設業の入金待ち・資金繰り・QuQuMo確認ポイントへ整合。申込み準備中であることをdescriptionでも明示。
- canonical=https://shikin.diggworks.com/、robots=index,follow、OG title/description/type/urlを設定。/index.htmlとrootの重複をrootへ正規化する意図。canonical採用や掲載は検索エンジンの判断であり保証ではない。
- robots.txtはroot/資産のクロールを許可、docs/tests/scriptsを抑制。sitemapはroot1件のみ、lastmodは今回のメタ情報変更日2026-10-18。QAページの既存noindexは維持。
- 架空の評価・料金・FAQリッチリザルト・実績の構造化データは追加しない。本文/CSS/縦図/CTAは変更前と一致、GA4コードと設定・CNAME・AGENTSも一致。
- ブラウザ検証のポートを環境変数で選べるようにし、以前のサーバーが応答しない場合でも再実行できるようにした。

## 再テスト結果

| コマンド・確認 | 結果 |
| --- | --- |
| python3 scripts/check-seo.py | PASS: 日本語、h1 1つ、title/description/viewport、canonical・OG・sitemap一致、root許可、QA noindex |
| python3 scripts/check-static.py | PASS: 内部リンク、資産、CNAME、空A8枠、送客停止 |
| node scripts/test-ui.cjs | PASS: 旧複数候補・開閉・外部クリック互換 |
| node scripts/test-ga4.cjs | PASS: 手動page_view1回、自動無効、表示到達重複防止、無効CTAと外部クリック分離、query除外 |
| LP_CURRENT_PORT=8031 LP_BASE_PORT=8032 LP_EVIDENCE_DIR=docs/evidence/seo-release-20261018 node scripts/test-payment-cycle.cjs | PASS: 320/375/390px、780/640px高、FAQ、キーボード、内部/固定CTA、単社/JS無効/設定失敗、GA4キュー、A8枠の非読込、旧機能互換 |
| node --check assets/analytics.js / assets/config.js / scripts/test-payment-cycle.cjs | PASS |
| ローカルHTTPで /、/robots.txt、/sitemap.xml | PASS: HTTP200、元ファイルとの完全一致、HTML/text/XMLとして配信 |
| 本文・CSS・GA4・CNAME・AGENTSの変更前照合、git diff --check | PASS |

初回のブラウザ実行は前日のローカルサーバーがERR_EMPTY_RESPONSEを返して失敗。その後の同ポート起動も使用中となったため、別ポート8031/8032で再起動・再実行し完了を確認。アプリの表示/機能失敗とは分離し、失敗を成功に読み替えない。

[検証JSON](evidence/seo-release-20261018/results.json) / [320px](evidence/seo-release-20261018/after-full-320.png) / [375px](evidence/seo-release-20261018/after-full-375.png) / [390px](evidence/seo-release-20261018/after-full-390.png)

全外部通信を遮断したローカル検証。GA4本番受信や実A8成果ではない。リンクと計測画像を含む実広告コードは入れていない。

## レビュー判定と公開後に行うこと

SEO検証用・送客停止版としてローカルの受け入れ条件は成功し、レビューへ進める判断。前日の「A8送客版は公開保留」と矛盾せず、今回もA8稼働とGoogle広告は対象外。

最終のマージ/公開承認後に、公開rootのHTTP200、canonical/robotsとレスポンスのX-Robots-Tag、robots/sitemapの内容・CNAME/HTTPS・配信版を実確認する。Search Consoleの所有権/権限を確認してsitemap送信・URL検査を行い、GA4の各イベントを実ブラウザ/Realtimeで突合する。今回はDNS変更・所有権確認・送信・インデックス登録要求は実施しない。

構文や設定の成功はSEO順位・インデックス登録・流入を証明しない。現在のページは申込み準備中であり、A8成果や申込みCVRを評価する段階ではない。
