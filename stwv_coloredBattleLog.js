/*:
 * @target MZ
 * @plugindesc This plugin colors actor names, enemy names, item names, and skill names in the battle log.
 *
 * @author strayedwave
 *
 * @param Actor Color
 * @desc Color code for actor names
 * @default 1
 *
 * @param Enemy Color
 * @desc Color code for enemy names
 * @default 26
 *
 * @param Item Color
 * @desc Color code for item names
 * @default 3
 *
 * @param Skill Color
 * @desc Color code for skill names
 * @default 4
 *
 * @param Additional Colors
 * @type struct<ColorKeyword>[]
 * @desc Specify additional color codes and keywords
 * @default []
 *
 * @param Cache Size
 * @desc Maximum number of items in the cache
 * @default 100
 *
 * @command clearCache
 * @text Clear Cache
 * @desc Clears the color battle log cache. (Be careful not to increase the cache too much)
 *
 * @help stwv_ColoredBattleLog.js
 * This plugin colors actor names, enemy names, item names, and skill names in the battle log.
 * You can register color codes and words to be colored from the plugin parameters.
 *
 * Once a word is loaded, it is saved in the cache, and the cache is referenced when the same word is loaded again.
 * The maximum number of items in the cache can be set in the plugin parameters.
 *
 * Plugin Commands:
 *  clearCache
 *  Clears the cache saved by the plugin.
 *
 *
 * Credit notation is not particularly necessary for this plugin, but if you do credit, please list it as strayedwave.
 */

/*~struct~ColorKeyword:
 * @param Color
 * @desc Color code
 * @default 0
 *
 * @param Keywords
 * @type string[]
 * @desc List of words to colorize in this color
 * @default []
 */

/*:ja
 * @target MZ
 * @plugindesc バトルログ内のアクター名、エネミー名、アイテム名、スキル名に色をつけるプラグインです。
 *
 * @author strayedwave
 *
 * @param Actor Color
 * @desc アクター名の色コード
 * @default 1
 *
 * @param Enemy Color
 * @desc エネミー名の色コード
 * @default 26
 *
 * @param Item Color
 * @desc アイテム名の色コード
 * @default 3
 *
 * @param Skill Color
 * @desc スキル名の色コード
 * @default 4
 *
 * @param Additional Colors
 * @type struct<ColorKeyword>[]
 * @desc 追加の色コードとキーワードを指定
 * @default []
 *
 * @param Cache Size
 * @desc キャッシュの最大項目数
 * @default 100
 *
 * @command clearCache
 * @text キャッシュを破棄
 * @desc カラーバトルログのキャッシュを破棄します。（キャッシュの増やし過ぎには注意してください）
 *
 * @help stwv_ColoredBattleLog.js
 * バトルログ内のアクター名、エネミー名、アイテム名、スキル名に色をつけるプラグインです。
 * プラグインパラメータから色コードと色をつける単語を登録することができます。
 *
 * 一度読み込んだ単語はキャッシュに保存され、再度同じ単語を読み込む際にはキャッシュを参照します。
 * キャッシュの最大項目数はプラグインパラメータで設定できます。
 * キャッシュはマップの移動時に自動で破棄されます。
 *
 * プラグインコマンド:
 *  clearCache
 *  プラグインで保存しているキャッシュを破棄します。
 *
 *
 * このプラグインは特にクレジット表記などは必要ありませんが、
 * もしクレジット表記をする場合はstrayedwaveと記載していただけると助かります。
 */

/*~struct~ColorKeyword:
 * @param Color
 * @desc 色コード
 * @default 0
 *
 * @param Keywords
 * @type string[]
 * @desc この色で色変えを行う単語のリスト
 * @default []
 */

(() => {
	const parameters = PluginManager.parameters("stwv_ColoredBattleLog");
	const COLOR_ACTOR = Number(parameters["Actor Color"] || 1);
	const COLOR_ENEMY = Number(parameters["Enemy Color"] || 26);
	const COLOR_ITEM = Number(parameters["Item Color"] || 3);
	const COLOR_SKILL = Number(parameters["Skill Color"] || 4);
	const CACHE_SIZE = Number(parameters["Cache Size"] || 100);

	function getNames(dataArray) {
		return dataArray
			? dataArray
					.slice(1)
					.filter((item) => item?.name)
					.map((item) => item.name)
			: [];
	}

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	// キャッシュ用のMapを用意
	const cache = new Map();

	function colorizeKeywords(inputText) {
		if (cache.has(inputText)) return cache.get(inputText);

		let text = inputText;
		const categories = [
			{ names: getNames($dataActors), color: COLOR_ACTOR },
			{ names: getNames($dataEnemies), color: COLOR_ENEMY },
			{ names: getNames($dataItems), color: COLOR_ITEM },
			{ names: getNames($dataSkills), color: COLOR_SKILL },
		];

		// 追加の色とキーワードを処理
		const additionalColors = JSON.parse(
			parameters["Additional Colors"] || "[]",
		);
		for (const colorKeyword of additionalColors) {
			const parsed = JSON.parse(colorKeyword);
			const color = Number(parsed.Color);
			const keywords = JSON.parse(parsed.Keywords || "[]");
			categories.push({
				names: keywords,
				color: color,
			});
		}

		for (const category of categories) {
			for (const name of category.names) {
				const re = new RegExp(escapeRegExp(name), "g");
				text = text.replace(re, `\\c[${category.color}]${name}\\c[0]`);
			}
		}
		cache.set(inputText, text);
		// キャッシュ内の項目数が指定された最大項目数を超えた場合、最も古い項目を削除
		if (cache.size > CACHE_SIZE) {
			const firstKey = cache.keys().next().value;
			cache.delete(firstKey);
		}
		return text;
	}

	const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
	Window_BattleLog.prototype.addText = function (text) {
		_Window_BattleLog_addText.call(this, colorizeKeywords(text));
	};

	const _Game_Map_setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function (mapId) {
		_Game_Map_setup.call(this, mapId);
		cache.clear();
	};

	// プラグインコマンドの登録
	PluginManager.registerCommand("stwv_ColoredBattleLog", "clearCache", () => {
		cache.clear();
	});
})();
