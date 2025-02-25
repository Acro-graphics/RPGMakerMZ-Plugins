# RPGMakerMZ プラグイン

strayedwaveが制作したRPGMakerMZ向けプラグインの公開場所です。

## 配布中のプラグイン

### stwv_accumulationBattleLog.js

* バトルログを累積型にするプラグインです。
* バトルログは累積されていき、一定件数を超えた場合は古いログから削除されます。
* 最大ログ件数や、ログのフォントサイズ、行の高さ、オフセット、アウトライン幅、アウトライン色などを設定できます。

#### プラグインコマンド

プラグインコマンドはありません。

![stwv_accumulationBattleLog.jsのプレビュー]()



[ダウンロード]()

### stwv_coloredBattleLog.js

* バトルログ内のアクター名、エネミー名、アイテム名、スキル名に色をつけるプラグインです。
* プラグインパラメータから色コードと色をつけるキーワードを登録することができます。
* 色コードはRPGMakerMZのシステム画像を参照しますので、適切な番号を指定してください。（#で始まる一般的なカラーコードは認識しません。）
* 一度読み込んだキーワードはキャッシュに保存され、再度同じキーワードを読み込む際にはキャッシュを参照します。
* キャッシュの最大項目数はプラグインパラメータで設定できます。
* キャッシュはマップの移動時に自動で破棄されます。

#### プラグインコマンド

clearCache: プラグインで保存しているキャッシュを破棄します。

![stwv_stwv_coloredBattleLog.jsのプレビュー](https://raw.githubusercontent.com/Acro-graphics/RPGMakerMZ-Plugins/refs/heads/images/images/coloredBattleLog_preview.png)

![stwv_stwv_coloredBattleLog.jsのプラグインパラメータ](https://raw.githubusercontent.com/Acro-graphics/RPGMakerMZ-Plugins/refs/heads/images/images/coloredBattleLog_parameter.png)

[ダウンロード](https://raw.githubusercontent.com/Acro-graphics/RPGMakerMZ-Plugins/refs/heads/main/stwv_coloredBattleLog.js)

## 制作予定のプラグイン

今のところ特に思いついてません。

[@strayedwave](https://x.com/strayedwave)