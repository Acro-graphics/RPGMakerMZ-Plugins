/*:
 * @target MZ
 * @plugindesc This plugin colors actor names, enemy names, item names, and skill names in the battle log.
 *
 * @author strayedwave
 *
 * @param Actor Color
 * @text Actor Name Color
 * @desc Color code for actor names
 * @default 1
 *
 * @param Actor Color Enabled
 * @text Enable Actor Name Coloring
 * @type boolean
 * @desc Enable or disable coloring for actor names
 * @default true
 *
 * @param Enemy Color
 * @text Enemy Name Color
 * @desc Color code for enemy names
 * @default 26
 *
 * @param Enemy Color Enabled
 * @text Enable Enemy Name Coloring
 * @type boolean
 * @desc Enable or disable coloring for enemy names
 * @default true
 *
 * @param Item Color
 * @text Item Name Color
 * @desc Color code for item names
 * @default 3
 *
 * @param Item Color Enabled
 * @text Enable Item Name Coloring
 * @type boolean
 * @desc Enable or disable coloring for item names
 * @default true
 *
 * @param Skill Color
 * @text Skill Name Color
 * @desc Color code for skill names
 * @default 4
 *
 * @param Skill Color Enabled
 * @text Enable Skill Name Coloring
 * @type boolean
 * @desc Enable or disable coloring for skill names
 * @default true
 *
 * @param Additional Colors
 * @text Additional Colors and Keywords
 * @type struct<ColorKeyword>[]
 * @desc Specify additional color codes and keywords
 * @default []
 *
 * @param Cache Size
 * @text Cache Maximum Items
 * @desc Maximum number of items in the cache
 * @default 100
 *
 * @command clearCache
 * @text Clear Cache
 * @desc Clears the cache of the colored battle log. (Be careful not to increase the cache too much)
 *
 * @help stwv_ColoredBattleLog.js
 *
 * This plugin colors actor names, enemy names, item names, and skill names in the battle log.
 * You can register color codes and keywords to be colored from the plugin parameters.
 * The color codes refer to the system images of RPGMakerMZ, so specify the appropriate number.
 * (General color codes starting with # are not recognized.)
 *
 * Once a keyword is loaded, it is saved in the cache, and the cache is referenced when the same keyword is loaded again.
 * The maximum number of items in the cache can be set in the plugin parameters.
 * The cache is automatically cleared when moving maps.
 *
 * Plugin Command:
 *  clearCache
 *  Clears the cache saved by the plugin.
 *
 *
 * This plugin does not require any special credit notation, but if you want to give credit, please mention strayedwave.
 */

/*:ja
 * @target MZ
 * @plugindesc バトルログ内のアクター名、エネミー名、アイテム名、スキル名に色をつけるプラグインです。
 *
 * @author strayedwave
 *
 * @param Actor Color
 * @text アクター名の色
 * @desc アクター名の色コード
 * @default 1
 *
 * @param Actor Color Enabled
 * @text アクター名の色付け有効化
 * @type boolean
 * @desc アクター名の色付けを有効または無効にします
 * @default true
 *
 * @param Enemy Color
 * @text エネミー名の色
 * @desc エネミー名の色コード
 * @default 26
 *
 * @param Enemy Color Enabled
 * @text エネミー名の色付け有効化
 * @type boolean
 * @desc エネミー名の色付けを有効または無効にします
 * @default true
 *
 * @param Item Color
 * @text アイテム名の色
 * @desc アイテム名の色コード
 * @default 3
 *
 * @param Item Color Enabled
 * @text アイテム名の色付け有効化
 * @type boolean
 * @desc アイテム名の色付けを有効または無効にします
 * @default true
 *
 * @param Skill Color
 * @text スキル名の色
 * @desc スキル名の色コード
 * @default 4
 *
 * @param Skill Color Enabled
 * @text スキル名の色付け有効化
 * @type boolean
 * @desc スキル名の色付けを有効または無効にします
 * @default true
 *
 * @param Additional Colors
 * @text 追加の色とキーワード
 * @type struct<ColorKeyword>[]
 * @desc 追加の色コードとキーワードを指定
 * @default []
 *
 * @param Cache Size
 * @text キャッシュの最大項目数
 * @desc キャッシュの最大項目数
 * @default 100
 *
 * @command clearCache
 * @text キャッシュを破棄
 * @desc カラーバトルログのキャッシュを破棄します。（キャッシュの増やし過ぎには注意してください）
 *
 * @help stwv_ColoredBattleLog.js
 *
 * バトルログ内のアクター名、エネミー名、アイテム名、スキル名に色をつけるプラグインです。
 * プラグインパラメータから色コードと色をつけるキーワードを登録することができます。
 * 色コードはRPGMakerMZのシステム画像を参照しますので、適切な番号を指定してください。
 * （#で始まる一般的なカラーコードは認識しません。）
 *
 * 一度読み込んだキーワードはキャッシュに保存され、再度同じキーワードを読み込む際にはキャッシュを参照します。
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
 * @text 色
 * @desc 色コード（RPGMakerMZのシステム画像を参照）
 * @default 0
 *
 * @param Keywords
 * @text キーワード
 * @type string[]
 * @desc この色で色変えを行うキーワードのリスト
 * @default []
 */
(() => {
	const parameters = PluginManager.parameters("stwv_ColoredBattleLog");
	const COLOR_ACTOR = Number(parameters["Actor Color"] || 1);
	const COLOR_ACTOR_ENABLED = parameters["Actor Color Enabled"] === "true";
	const COLOR_ENEMY = Number(parameters["Enemy Color"] || 26);
	const COLOR_ENEMY_ENABLED = parameters["Enemy Color Enabled"] === "true";
	const COLOR_ITEM = Number(parameters["Item Color"] || 3);
	const COLOR_ITEM_ENABLED = parameters["Item Color Enabled"] === "true";
	const COLOR_SKILL = Number(parameters["Skill Color"] || 4);
	const COLOR_SKILL_ENABLED = parameters["Skill Color Enabled"] === "true";
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

	// キーワードと色の組み合わせ用キャッシュ
	const replacementCache = new Map();

	function colorizeKeywords(inputText) {
		let text = inputText;
		const categories = [
			{
				names: getNames($dataActors),
				color: COLOR_ACTOR,
				enabled: COLOR_ACTOR_ENABLED,
			},
			{
				names: getNames($dataEnemies),
				color: COLOR_ENEMY,
				enabled: COLOR_ENEMY_ENABLED,
			},
			{
				names: getNames($dataItems),
				color: COLOR_ITEM,
				enabled: COLOR_ITEM_ENABLED,
			},
			{
				names: getNames($dataSkills),
				color: COLOR_SKILL,
				enabled: COLOR_SKILL_ENABLED,
			},
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
				enabled: true, // 追加の色は常に有効
			});
		}

		for (const category of categories) {
			if (!category.enabled) continue;
			for (const name of category.names) {
				const key = `${name}_${category.color}`;
				// キーワードがテキスト中に存在するかチェック
				const re = new RegExp(escapeRegExp(name), "g");
				if (!re.test(text)) continue;
				let replacement;
				if (replacementCache.has(key)) {
					replacement = replacementCache.get(key);
				} else {
					replacement = `\\c[${category.color}]${name}\\c[0]`;
					replacementCache.set(key, replacement);
					console.log(
						`Cached keyword-color combination: ${name}, color: ${category.color}`,
					);
					// キャッシュサイズが上限を超えた場合、最も古い項目を削除
					if (replacementCache.size > CACHE_SIZE) {
						const firstKey = replacementCache.keys().next().value;
						replacementCache.delete(firstKey);
					}
				}
				text = text.replace(re, replacement);
			}
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
		// マップ移動時にキャッシュをクリア
		replacementCache.clear();
	};

	// プラグインコマンドの登録
	PluginManager.registerCommand("stwv_ColoredBattleLog", "clearCache", () => {
		replacementCache.clear();
	});
})();
