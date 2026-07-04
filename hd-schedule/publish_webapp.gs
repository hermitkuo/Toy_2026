/**
 * 血透室排班 · 一鍵發布端點（Google Apps Script Web App）
 *
 * 搭配 setup_settings_sheet.gs 使用（貼在「同一個」Apps Script 專案裡即可）。
 * 作用：schedule.html 按「🚀 一鍵發布」→ 把已確認的當月班表寫進「自動排班草稿」分頁。
 *
 * 部署步驟（排班者做一次）：
 *   1. 開啟設定用 Google Sheet →「擴充功能 → Apps Script」
 *   2. 新增一個檔案，把本檔整段貼上；把下面 PUBLISH_TOKEN 改成你自訂的通關碼
 *   3. 右上「部署 → 新增部署 → 類型：網頁應用程式」
 *        - 執行身分：我（擁有者）
 *        - 具有存取權：任何人
 *   4. 複製部署後的 /exec 網址
 *   5. 回 schedule.html「發布設定」貼上該網址 + 同一組通關碼
 *
 * 安全性：端點對外開放，故用 PUBLISH_TOKEN 擋未授權寫入。前後端 token 必須一致。
 * 注意：只覆蓋「該月」的列，其它月份不動。醫師閱覽頁（index.html）若讀正式班表分頁，
 *      需另把「自動排班草稿」升為正式班表（或把閱覽頁指向本分頁）。
 */

var PUBLISH_TOKEN = 'CHANGE-ME-請改成你自訂的通關碼';
var DRAFT_TAB = '自動排班草稿';
var DRAFT_HEADERS = ['日期','星期','值班','早','中','晚','花蓮HD','花蓮特約',
                     '玉里','關山','聯安','聯安掛名','休假','未滿足軟規則'];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ ok: false, error: 'no body' });
    var body = JSON.parse(e.postData.contents);
    if (String(body.token || '') !== PUBLISH_TOKEN) return json_({ ok: false, error: 'unauthorized' });
    if (!body.month || !body.days || !body.days.length) return json_({ ok: false, error: 'empty payload' });
    var n = writeDraft_(body);
    return json_({ ok: true, month: body.month, written: n });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

// 讓部署後用瀏覽器直接開 /exec 能看到狀態（方便確認部署成功）
function doGet() {
  return json_({ ok: true, service: 'hd-schedule publish', tab: DRAFT_TAB });
}

function writeDraft_(body) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(DRAFT_TAB);
  if (!sh) throw new Error('找不到「' + DRAFT_TAB + '」分頁，請先執行 setupSettingsSheet');

  // 確保表頭存在（空表時補上）
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, DRAFT_HEADERS.length).setValues([DRAFT_HEADERS])
      .setFontWeight('bold').setBackground('#0f766e').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }

  var month = String(body.month);   // "2026-08"

  // 刪掉舊的「該月」資料列（由下往上刪，避免索引位移）
  var last = sh.getLastRow();
  if (last >= 2) {
    var dates = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var r = dates.length - 1; r >= 0; r--) {
      if (String(dates[r][0]).indexOf(month) === 0) sh.deleteRow(r + 2);
    }
  }

  // 組新列並附加
  var rows = body.days.map(function (d) {
    return [ d.date, d.weekday, J_(d.duty), J_(d.am), J_(d.pm), J_(d.eve),
             J_(d.hd), J_(d.teyue), J_(d.yuli), J_(d.guanshan),
             J_(d.lianan), J_(d.liananhm), J_(d.leave), d.warn || '' ];
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, DRAFT_HEADERS.length).setValues(rows);

  // 依日期排序（含既有其它月份）
  var lr = sh.getLastRow();
  if (lr > 2) sh.getRange(2, 1, lr - 1, DRAFT_HEADERS.length).sort({ column: 1, ascending: true });

  return rows.length;
}

function J_(a) { return (a && a.join) ? a.join('、') : (a || ''); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
