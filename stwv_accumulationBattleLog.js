/*:
 * @target MZ
 * @plugindesc This plugin accumulates battle logs and deletes old logs when a certain number is exceeded.
 * @author strayedwave
 *
 * @param maxLogCount
 * @text Maximum Log Count
 * @desc The maximum number of logs to keep (old logs will be deleted when this number is exceeded). Default: 8
 * @default 8
 *
 * @param noBattleLogBackground
 * @text Hide Log Background
 * @desc Hide the background of each battle log message. Default: true
 * @type boolean
 * @default true
 *
 * @param fontSize
 * @text Font Size
 * @desc Set the font size of the battle log. Default: 28
 * @type number
 * @default 28
 *
 * @param lineHeight
 * @text Line Height
 * @desc Set the line height of the battle log. Default: 36
 * @type number
 * @default 36
 *
 * @param offsetX
 * @text X Offset
 * @desc Set the X offset of the battle log. Default: 0
 * @type number
 * @default 0
 *
 * @param offsetY
 * @text Y Offset
 * @desc Set the Y offset of the battle log. Default: 0
 * @type number
 * @default 0
 *
 * @param outlineWidth
 * @text Outline Width
 * @desc Set the outline width of the battle log. Default: 3
 * @type number
 * @default 3
 *
 * @param outlineColor
 * @text Outline Color
 * @desc Set the outline color of the battle log. Default: rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param logWidth
 * @text Log Width
 * @desc Set the width of the battle log window. Default: 0
 * (If set to 0, the battle log will extend to the edge of the screen.)
 * @type number
 * @default 0
 *
 * @help accumulationBattleLog.js
 *
 * This plugin accumulates battle logs.
 * Battle logs are accumulated and old logs are deleted when a certain number is exceeded.
 *
 * You can set the maximum number of logs, font size, line height, offset, outline width, outline color, etc.
 *
 *
 * This plugin does not require any special credit notation, but if you want to give credit, please mention strayedwave.
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘ログを蓄積し、一定件数を超えた場合は古いログから削除するプラグインです。
 * @author strayedwave
 *
 * @param maxLogCount
 * @text 最大ログ件数
 * @desc ログを保持する最大件数（これを超えた場合、古いログから順に削除します）デフォルト: 8
 * @default 8
 *
 * @param noBattleLogBackground
 * @text ログ背景を非表示
 * @desc 各バトルログメッセージの背景を非表示にします デフォルト: true
 * @type boolean
 * @default true
 *
 * @param fontSize
 * @text フォントサイズ
 * @desc バトルログのフォントサイズを設定します デフォルト: 28
 * @type number
 * @default 28
 *
 * @param lineHeight
 * @text 行の高さ
 * @desc バトルログの行の高さを設定します デフォルト: 36
 * @type number
 * @default 36
 *
 * @param offsetX
 * @text X座標オフセット
 * @desc バトルログのX座標のオフセットを設定します デフォルト: 0
 * @type number
 * @default 0
 *
 * @param offsetY
 * @text Y座標オフセット
 * @desc バトルログのY座標のオフセットを設定します デフォルト: 0
 * @type number
 * @default 0
 *
 * @param outlineWidth
 * @text アウトライン幅
 * @desc バトルログのアウトライン幅を設定します デフォルト: 3
 * @type number
 * @default 3
 *
 * @param outlineColor
 * @text アウトライン色
 * @desc バトルログのアウトライン色を設定します デフォルト: rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param logWidth
 * @text ログ幅
 * @desc バトルログウィンドウの幅を設定します デフォルト: 0
 * (0にすると画面端までバトルログが伸びるようになります。)
 * @type number
 * @default 0
 *
 * @help accumulationBattleLog.js
 *
 * バトルログを累積型にするプラグインです。
 * バトルログは累積されていき、一定件数を超えた場合は古いログから削除されます。
 *
 * 最大ログ件数や、ログのフォントサイズ、行の高さ、オフセット、アウトライン幅、アウトライン色などを設定できます。
 *
 *
 * このプラグインは特にクレジット表記などは必要ありませんが、
 * もしクレジット表記をする場合はstrayedwaveと記載していただけると助かります。
 */

(() => {
	const parameters = PluginManager.parameters("stwv_accumulationBattleLog");
	const maxLogCount = Number(parameters.maxLogCount || 8);
	const noBattleLogBackground = parameters.noBattleLogBackground === "true";
	const fontSize = Number(parameters.fontSize || 28);
	const lineHeight = Number(parameters.lineHeight || 36);
	const offsetX = Number(parameters.offsetX || 0);
	const offsetY = Number(parameters.offsetY || 0);
	const outlineColor = parameters.outlineColor || "rgba(0, 0, 0, 0.6)";
	const outlineWidth = Number(parameters.outlineWidth || 3);
	const logWidth = Number(parameters.logWidth || 0);
	const yOffsetMargin = 4; // 1行目の上部に猶予を持たせるためのマージン
	const xOffsetMargin = 4; // 左部分に猶予を持たせるためのマージン

	const _Window_BattleLog_resetFontSettings =
		Window_BattleLog.prototype.resetFontSettings;
	Window_BattleLog.prototype.resetFontSettings = function () {
		_Window_BattleLog_resetFontSettings.call(this);
		this.contents.fontSize = fontSize;
		this.contents.outlineWidth = outlineWidth;
		this.contents.outlineColor = outlineColor;
	};

	Window_BattleLog.prototype.lineHeight = () => lineHeight;

	const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;

	Window_BattleLog.prototype.addText = function (text) {
		_Window_BattleLog_addText.call(this, text);
		this._accumulatedLogs = this._accumulatedLogs || [];
		this._accumulatedLogs.push(text);
		while (this._accumulatedLogs.length > maxLogCount) {
			this._accumulatedLogs.shift();
		}
		this._needsRefresh = true;
	};

	Window_BattleLog.prototype.refreshAccumulatedLogs = function () {
		if (!this._needsRefresh) return;
		this.contents.clear();
		this.contentsBack.clear();
		this.contents.fontSize = fontSize;
		let y = offsetY + yOffsetMargin;
		for (const line of this._accumulatedLogs) {
			// 背景を描画
			if (!noBattleLogBackground) {
				this.contentsBack.fillRect(
					offsetX,
					y - yOffsetMargin,
					this.contents.width - offsetX * 2,
					this.lineHeight(),
					"rgba(0, 0, 0, 0.25)",
				);
			}
			// テキストを描画
			this.drawTextEx(line, offsetX + xOffsetMargin, y);
			y += this.lineHeight();
		}
		this._needsRefresh = false;
	};

	Window_BattleLog.prototype.clear = function () {
		this.refreshAccumulatedLogs();
	};

	const _Window_BattleLog_update = Window_BattleLog.prototype.update;
	Window_BattleLog.prototype.update = function () {
		_Window_BattleLog_update.call(this);
		this.refreshAccumulatedLogs();
	};

	// ウィンドウの高さを計算する
	Window_BattleLog.prototype.windowHeight = function () {
		const numLines = Math.min(this._accumulatedLogs.length, maxLogCount);
		return this.fittingHeight(numLines);
	};

	// ウィンドウの幅を計算する
	Window_BattleLog.prototype.windowWidth = function () {
		return logWidth > 0 ? logWidth : Graphics.boxWidth - this.x;
	};

	const _BattleManager_endBattle = BattleManager.endBattle;
	BattleManager.endBattle = function (result) {
		_BattleManager_endBattle.call(this, result);
		if ($gameParty.inBattle()) {
			SceneManager._scene._logWindow._accumulatedLogs = [];
		}
	};
})();
