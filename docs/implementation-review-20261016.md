# 2026-10-16 開発環境での実装・検証

## 現状調査と変更範囲（実装前）

基準 main 829231f。新規ブランチ feat/lp-brief-20261016 に前回の縦3段試作 15db352 を再利用した。既存の LP 改善手順に従い、図解の理解を助け、クリックと表示到達を分ける仮説を検証する。CVR 改善は未測定。

実装指示書と追加受領した戦略資料を照合済み。資料に記録されたアカウント状況と、個別の掲載・広告経路の許可、公開用条件の確認は別に扱う。会員画面を本作業で独立検証したものではない。添付そのものや内部の案件情報はコミット・公開しない。

| 項目 | main の状態 | 本作業の範囲 |
| --- | --- | --- |
| 図解 | 横3段。未マージの縦3段試作あり | 試作を再利用し注記を指示に合わせる |
| 比較 | 個人3社、法人3社＋2社 | 利用者がQuQuMo 1社表示を選択。他社は削除せず非表示。未確認の提携を認定しない |
| CTA | 内部アンカーと通常の公式URL | QuQuMoは送客しない試作ボタンへ。他社の既存データは非表示で保持 |
| GA4 | page_view手動1回、自動無効、切替/開閉/内部/外部クリック | 比較見出し表示を一度だけ記録し、内部クリックと区別する |
| FAQ | details/summary | 実ブラウザで開閉確認 |
| PR・運営・連絡先・リスク | 本文にあり、メール受信未確認 | 残し、表示とプライバシー更新を確認 |
| 配信 | 本番内容一致は取得経路403のため未確認 | 非公開と称する外部URLは提供せずローカル検証 |

## 受け入れ条件

- 320/375/390pxで横溢れ、固定CTA重なり、図解の改行、FAQ、候補切替、CTA状態を実ブラウザエミュレーションで確認。
- page_view 1回、内部CTAと比較表示到達を別々に検証。スクロール・直接アンカーでも表示を記録し、一訪問中の再表示で重複しない。
- 既存イベント名を維持。カスタムpage_locationにquery/fragmentを含めず、個人情報を追加しない。
- 変更前後画像・差分・テスト結果を記録。コード、ローカル発火、GA4実受信、A8帰属を分離。
- mainマージ・デプロイ・広告出稿・A8申請・問い合わせ送信なし。承認前に公開リポジトリへの新規pushも行わない（後に利用者がコード・画像のブランチ共有のみ承認）。

## 未確認・承認待ち

最新の公開条件、ASP掲載/広告許可・有効URL、公開ファイル一致、全イベントのGA4実受信、A8成果帰属、メール受信。人数変化の報告は指示書経由の利用者申告であり、本作業での受信検証ではない。

検証結果は作業後に追記する。ロールバックは本ブランチを未採用にするか、変更コミットを戻す。次は非公開試作のレビューと未回答の許可・公開条件の確認。


## 実装結果・決定事項

変更ファイル: index.html、assets/config.js、assets/analytics.js、scripts/check-static.py、scripts/test-ga4.cjs、scripts/test-payment-cycle.cjs。引き継ぎはREADME.md、docs/project-state.md、docs/measurement.md、docs/improvement-log.md、本レポートを更新。旧図解試作レポートには最新レポートへの参照を付け、旧画像は過去証跡として保持。今回の画像・結果JSON・差分はdocs/evidence/implementation-20261016に保存。

- 利用者回答によりQuQuMo 1社紹介を採用。他社4社のHTMLと複数候補の切替機能は保持し、画面には出さない。個人・法人で同じサービスになるため、選択を強制せず切替と追加候補ボタンを非表示にした。
- activeProviders と previewMode を最小限の設定として追加。HTML側にも保留状態を持たせ、設定読込失敗・JavaScript無効時でも未公開候補が露出しない。GA4 IDと手動page_view1回・自動無効は維持。
- 見出し、内部CTA、説明を単社紹介へ整合。古い最低手数料とオンライン完結の断定は表示から外し、総費用・対象・必要書類の確認を促す。公式情報の再取得も403で失敗したため、最新確認済みとしない。
- QuQuMoのCTAはhrefを持たない試作用ボタン。押下やEnterでは移動せず、disabled:trueのcta_clickだけを記録。provider_outboundや申込成果は作らない。実送客の有効化には、A8発行URL・サイト/掲載面・許可・公開状態の確認と別途承認が必要。
- 比較エリアの見出しが画面に半分以上入ったときにcompare_viewを一度だけ記録。固定CTA領域を避けるため下90pxを観測対象から除外。内部アンカー操作compare_clickと到達を分離。IntersectionObserver非対応時は到達を捏造しない。
- 単社で事業形態を選んでいない訪問者のbusiness_typeはunspecifiedとし、個人事業主と推測しない。

## イベント仕様

全カスタムイベントの共通パラメータ: business_type、experiment_id（baseline）、variant（A）、page_version（20261016-dev）、query/fragmentなしのpage_location。実験の配信や割付は開始していない。

| イベント | 発火条件 | 固有パラメータ・試作での状態 |
| --- | --- | --- |
| page_view | 初回実行に手動1回 | 自動無効、旧lp_viewなし |
| compare_click | 内部のサービス情報へのCTA操作 | cta_id、provider=none、link_kind=internal。到達成功とは区別 |
| compare_view | サービス情報の見出し50%以上表示 | section_id=compare。一訪問中1回、クリックなしのスクロール/直接アンカーも対象 |
| business_type_select | 対象切替 | 互換機能を保持。今回の単社画面では選択肢非表示で自然発火なし |
| comparison_expand | 追加候補開閉 | expanded。互換機能を保持、単社画面では非表示 |
| cta_click | 試作の無効なサービスCTA操作 | cta_id、provider=ququmo、link_kind=disabled、disabled=true。外部送客・成果と扱わない |
| provider_outbound | 通常の外部リンク操作 | 既存互換性を維持。今回の試作では0件。外部到着・申込・A8成果とは別 |

GA4拡張計測による追加イベント、referrer等を含むGoogle側の自動送信設定は未確認。カスタムパラメータのquery除外だけで全送信の匿名化を保証しない。個別の氏名・メール・電話・請求書・財務データは追加していない。

## テスト結果（2026-10-16）

| コマンド・確認 | 結果・限界 |
| --- | --- |
| python3 scripts/check-static.py | PASS: 内部アンカー、資産、CNAME、試作CTA、保持した他社の初期非表示 |
| node scripts/test-ui.cjs | PASS: 従来の複数候補3→3→5→3と外部クリック互換 |
| node scripts/test-ga4.cjs | PASS: 設定・タグ1つ、自動page_view無効、page_view1回、到達しきい値と重複防止、無効CTA、query除外 |
| node scripts/test-payment-cycle.cjs | PASS: Chromium実表示、下記3幅と高さ780/640px。実機ではない |
| node --check assets/analytics.js / assets/config.js | PASS |
| git diff --check、文書内ローカルリンク | PASS |

ブラウザではFAQ開閉、キーボードEnter、固定CTA、横溢れなし、図解の縦順、単社表示、JavaScript無効、設定失敗時の非表示維持を確認。内部クリックとcompare_viewの分離、再到達の重複なし、直接アンカー・スクロール時の到達を検証。元のHTML/configに新analyticsを適用した追加検証で複数社切替と外部クリックの互換性も確認した。

初回のブラウザ検証ではaria-disabledをPlaywrightが操作不能として待機したため、意図的な試作操作の検査だけforceクリックに変更。閉じたプライバシー欄は開いて表示を検査するよう修正し、再実行は成功。検査を無効化して合格扱いにはしていない。

全外部通信を遮断し、実送客やGoogleへのイベント送信を行わず、ローカルdataLayerを検証した。GA4本番受信・A8帰属の成功を意味しない。

## スクリーンショット・差分

変更前: main 829231f。変更後: この作業ブランチ。ブラウザ幅はCSSピクセル、DPR1。

| 幅 | 変更前全体 | 変更後全体 | 図解・サービスカード |
| --- | --- | --- | --- |
| 320px | [前](evidence/implementation-20261016/before-full-320.png) | [後](evidence/implementation-20261016/after-full-320.png) | [図](evidence/implementation-20261016/after-cycle-320.png) / [紹介](evidence/implementation-20261016/after-provider-320.png) |
| 375px | [前](evidence/implementation-20261016/before-full-375.png) | [後](evidence/implementation-20261016/after-full-375.png) | [図](evidence/implementation-20261016/after-cycle-375.png) / [紹介](evidence/implementation-20261016/after-provider-375.png) |
| 390px | [前](evidence/implementation-20261016/before-full-390.png) | [後](evidence/implementation-20261016/after-full-390.png) | [図](evidence/implementation-20261016/after-cycle-390.png) / [紹介](evidence/implementation-20261016/after-provider-390.png) |

[コード差分](evidence/implementation-20261016/changes.patch) / [ブラウザ検査結果](evidence/implementation-20261016/results.json)。スクリーンショットはローカル成果物であり外部プレビューではない。利用者承認によりコード・画像をGitHubの作業ブランチで共有する。Pages公開・mainマージ・広告配信は行わない。

## 再確認手順

リポジトリ直下をローカルポート8011、main 829231fのindex.htmlとassetsを一時コピーしたディレクトリを8012に、python3 -m http.server <port> --bind 127.0.0.1 で配信。ChromiumとPlaywrightが使える環境でnode scripts/test-payment-cycle.cjsを実行する。外部通信はテストが遮断する。手動で通常ブラウザを使う場合は開発用プロファイル等でGoogleへの通信も遮断し、本番分析へ開発アクセスを混入させない。

5秒理解、実iOS/Android、実safe-area、スクリーンリーダー、低速回線、CVR/利益は未検証。図解は縦長になるが、既存セクションの置換で別セクションは増やしていない。


## 追加戦略資料との照合

2026-10-16、2件目の資料を受領して全体を確認。単社紹介、結果が同じ対象選択の省略、他社データの保持、外部送客停止、既存デザイン・GA4の維持という試作方針は整合している。LPコードは追加変更しない。

資料内の成果報酬・EPC・確定率・識別情報・非公開条件は本レポートや共有ZIPに転載しない。アカウント状態は資料の記録であって、個別広告経路の許可や自サイトの成果実績ではない。資料内の予算計画も広告出稿の承認とは扱わない。

公開前に、掲載面・具体的な広告経路・指定リンク・掲載URL提出・公開用サービス条件と、GA4/A8の検証可能範囲を確認する。問い合わせ送信・A8申請・広告開始は行っていない。既存テスト結果はc93d61a時点のコード検証で、今回の文書照合で本番受信済みに変更しない。
