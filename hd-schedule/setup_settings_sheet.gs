/**
 * 血透室排班 · 設定表建置腳本（Google Apps Script）
 *
 * 用法：
 *   1. 開啟設定用 Google Sheet
 *   2. 上方選單「擴充功能 → Apps Script」
 *   3. 把本檔內容整段貼上，存檔
 *   4. 函式選 setupSettingsSheet → 執行 → 首次會要求授權，同意即可
 *   5. 回到試算表，會多出四個分頁：醫師偏好 / 每月班別設定 / 醫師配額 / 自動排班草稿
 *
 * 特性：
 *   - 只在分頁「空白」時寫入表頭與範例，已填資料不會被覆蓋（可重複執行）。
 *   - 表頭放第 1 列（凍結），之後前端用 gviz 讀取乾淨；說明用儲存格註解（hover）不佔列。
 *   - 星期 / 時段 欄位加下拉選單，減少手動輸入錯字。
 */
function setupSettingsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var TEAL = '#0f766e';

  var specs = [
    {
      name: '醫師偏好',
      note: 'S6 院內時段偏好：一列一筆。星期只到週六（院內時段無週日）；優先序越小越優先。',
      headers: ['醫師', '星期', '時段', '優先序', '備註'],
      widths:  [70, 60, 60, 70, 240],
      examples: [
        ['王', '一', '早', 1, ''],
        ['王', '三', '中', 2, ''],
        ['徐', '二', '晚', 1, '範例，可刪改']
      ],
      // 0-based 欄索引 → 允許值（下拉）
      validation: { 1: ['一', '二', '三', '四', '五', '六'], 2: ['早', '中', '晚'] }
    },
    {
      name: '每月班別設定',
      note: '一列一個月。名單／順序用半形逗號分隔。值班順序見規則 H5（徐,王,賴,林,郭,鄧,翔）；值班本月起始留空＝接續上月。',
      headers: ['月份', '啟用醫師', '值班順序', '值班本月起始', '花蓮HD診預設', '花蓮特約診預設', '備註'],
      widths:  [90, 330, 220, 110, 120, 120, 240],
      examples: [
        ['2026-07', '徐,王,賴,林,郭,超,鄧,翔,祺,禮', '徐,王,賴,林,郭,鄧,翔', '徐', '', '', '範例，可改']
      ],
      validation: {}
    },
    {
      name: '醫師配額',
      note: '每月每人院內HD配額（每月班別設定的細項）。配額方式：比率(參數填%,如12)／每週(參數填每週班數)／固定(參數填月班數)。' +
            '計算：總格數=(當月天數−週日數)×3；比率制分「餘數」(總格數−每週制與固定制之和)；比率先無條件捨去，' +
            '餘數依「優先序」小→大逐人+1，直到加總=總格數（保證剛好用完、每天非週日都有HD）。晚班為固定人頭數、可微調，且⊆總班數。採用總班留空=用建議值。',
      headers: ['月份', '醫師', '配額方式', '參數', '優先序', '晚班', '採用總班', '備註'],
      widths:  [90, 60, 90, 70, 70, 60, 90, 240],
      examples: [
        ['2026-07', '鄧', '比率', 24, 1, 3, '', ''],
        ['2026-07', '林', '比率', 20, 2, 3, '', ''],
        ['2026-07', '郭', '比率', 20, 3, 3, '', ''],
        ['2026-07', '徐', '比率', 12, 4, 3, '', ''],
        ['2026-07', '王', '比率', 12, 5, 3, '', ''],
        ['2026-07', '賴', '比率', 12, 6, 3, '', ''],
        ['2026-07', '翔', '每週', 2,  7, 3, '', ''],
        ['2026-07', '超', '每週', 1,  8, 2, '', ''],
        ['2026-07', '祺', '每週', 1,  9, 2, '', ''],
        ['2026-07', '禮', '固定', 9,  10, 2, '', '禮的晚班可 2~3，補足當月晚班總數']
      ],
      validation: { 2: ['比率', '每週', '固定'] }
    },
    {
      name: '自動排班草稿',
      note: '對齊班表欄位，供 Task 3 自動排班產出／回填。日期建議 YYYY-MM-DD 或 M/D。',
      headers: ['日期', '星期', '值班', '早', '中', '晚', '花蓮HD', '花蓮特約',
                '玉里', '關山', '聯安', '聯安掛名', '休假', '未滿足軟規則'],
      widths:  [92, 52, 52, 52, 52, 52, 68, 80, 52, 52, 52, 80, 92, 240],
      examples: [],
      validation: {}
    }
  ];

  specs.forEach(function (spec) {
    var sh = ss.getSheetByName(spec.name) || ss.insertSheet(spec.name);
    if (sh.getLastRow() > 0) return;   // 已有資料 → 不動

    var ncol = spec.headers.length;

    // 表頭（第 1 列）
    var head = sh.getRange(1, 1, 1, ncol);
    head.setValues([spec.headers])
        .setFontWeight('bold').setBackground(TEAL).setFontColor('#ffffff')
        .setHorizontalAlignment('center');
    sh.getRange(1, 1).setNote(spec.note);   // 說明用 hover 註解，不佔列
    sh.setFrozenRows(1);

    // 範例列
    if (spec.examples.length) {
      sh.getRange(2, 1, spec.examples.length, ncol).setValues(spec.examples);
    }

    // 欄寬
    spec.widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

    // 下拉驗證（套用到第 2~501 列）
    Object.keys(spec.validation).forEach(function (ci) {
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(spec.validation[ci], true).build();
      sh.getRange(2, Number(ci) + 1, 500, 1).setDataValidation(rule);
    });

    sh.setTabColor(TEAL);
  });

  // 移除預設空白分頁「工作表1」（僅在空白且不是唯一分頁時）
  var def = ss.getSheetByName('工作表1');
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);

  try {
    SpreadsheetApp.getUi().alert('完成！已建立：醫師偏好 / 每月班別設定 / 醫師配額 / 自動排班草稿');
  } catch (e) { /* 非 UI 環境執行時忽略 */ }
}
