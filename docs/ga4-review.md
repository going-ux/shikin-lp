## 変更内容
GA4 測定 ID が空で計測が無効だったため、ユーザー指定の `G-JGJTNJHVZ5` を既存コネクターに設定します。タグの追加は行わず、LP デザイン・CNAME・公開設定は維持しています。

実装済みのイベントは `lp_view`（ページ表示）、`business_type_select`（比較切替）、`comparison_expand`（追加候補の開閉）、`compare_click`（内部 CTA）、`provider_outbound`（外部リンククリック）です。自動 `page_view` は無効で、標準 `page_view` への変更はこの PR に含みません。

外部リンクのクリックは「外部リンククリック」として記録し、遷移先の表示完了・申込完了・A8成果発生とは区別します。クリックだけで成果として扱いません。現在のリンクは通常の公式リンクで、申込・承認は A8 側で別途確認する必要があります。

## テスト済み
- `python3 scripts/check-static.py`: 内部リンク、スクリプト参照、CNAME、プレースホルダー検査 PASS
- `node scripts/test-ui.cjs`: 比較切替、開閉・リセット、クリックイベント PASS
- `node --check assets/config.js` / `node --check assets/analytics.js`: PASS
- GA4 有効時の隔離実行: タグ/config の単一生成、自動 page_view 無効、lp_view、外部クリック、クエリなし page_location、プライバシー文言更新 PASS
- `git diff --check`: PASS

## 未確認事項
- 実ブラウザでの Google スクリプト読み込み、外部遷移時のイベント送信
- GA4 リアルタイム / DebugView の実受信、拡張計測・データ処理設定
- 今回の変更後のスマホ実機表示（HTML/CSS は変更なし）
- ASP 承認・発行済み成果 URL・A8 帰属・申込/承認
- 標準 page_view イベントの追加は未実装。現状は lp_view を使用

## 次の作業・公開
本番反映はレビュー後に進めます。この PR 作成時点では main へのマージ・本番反映は行いません。レビュー後に本番でページ表示・比較切替・CTA を操作し、GA4 の実受信と重複がないことを確認します。収益化と広告開始は別途の承認・検証が必要です。

共通の引き継ぎ先は going-ux/shikin-lp とし、現在の状態・決定事項・未確認事項・次の作業を残します。作業開始時に AGENTS.md と最新の開発履歴を確認し、完了時に変更内容・テスト結果・未確認事項・次の作業を更新します。会話が自動共有される前提にはしません。

ロールバックは assets/config.js の measurementId を空に戻すことで計測を無効化できます。
