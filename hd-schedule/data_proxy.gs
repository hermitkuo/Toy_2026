/**
 * 血透室班表 · 唯讀資料代理（Google Apps Script Web App）
 *
 * 目的：試算表維持「限制（僅自己）」，網頁不再直接連試算表、原始碼不含試算表 ID。
 * 網頁以 JSONP 呼叫本端點：  <EXEC_URL>?k=<資料代號>&callback=<函式名>[&headers=0]
 * 本端點以「擁有者身分」向 Google 的 gviz 介面取資料，原樣包成 callback(...) 回傳，
 * 所以網頁端的解析程式完全不用改（資料格式與先前直接讀 gviz 相同）。
 *
 * 只開放 SOURCES 白名單裡的分頁；其他分頁、其他試算表一律拒絕。
 *
 * ───────── 部署步驟（做一次）─────────
 *   1. 開 https://script.google.com →「新增專案」（獨立專案，不要貼進 publish_webapp.gs 那個專案，
 *      兩邊都有 doGet 會互相衝突）。專案名稱例：血透班表資料代理
 *   2. 把本檔整段貼進 Code.gs（取代原內容），下方 SHEETS 填入兩份試算表 ID
 *   3. 上方函式選單選 setupCheck → 執行 → 依指示授權（會要求讀取試算表／雲端硬碟、連外部服務）
 *      執行紀錄出現「OK」表示讀得到所有分頁
 *   4. 右上「部署 → 新增部署 → 類型：網頁應用程式」
 *        - 執行身分：我（擁有者）
 *        - 具有存取權：任何人
 *   5. 複製 /exec 網址 → 貼到 index.html 與 schedule.html 的 HD_DATA_URL
 *   6. 用瀏覽器開 <EXEC_URL>?k=banbiao 應看到 JSON（確認後再把兩份試算表共用改為「限制」）
 *
 * 之後改了本檔：「部署 → 管理部署 → 編輯（鉛筆）→ 版本：新版本 → 部署」，/exec 網址不變。
 */

// 試算表 ID 只存在這裡（Apps Script 專案預設只有你看得到）
var SHEETS = {
  main: 'PASTE-班表試算表-ID',      // 班表／歷史班表／輪值母表 所在試算表
  hol:  'PASTE-國定假日表-ID'       // 國定假日表
};

// 開放的資料代號 → {試算表, 分頁 gid}。網頁只能用這些代號取資料。
var SOURCES = {
  banbiao: { sheet: 'main', gid: '1837573287' },  // 現行「班表」分頁（找班表／統計 現行）
  hist:    { sheet: 'main', gid: '834332171'  },  // 歷史班表（統計 2026 以前）
  master:  { sheet: 'main', gid: '1810798741' },  // 輪值母表（找空檔／找我有空 OPD／統計 OPD 投影／排班工具）
  raw:     { sheet: 'main', gid: '0'          },  // 原始母表（有事 !早/!中/!晚）
  hol:     { sheet: 'hol',  gid: '600263934'  }   // 國定假日表
  // 啟用「自動排班草稿」分頁時，在此加：draft: { sheet: 'main', gid: '<草稿分頁 gid>' }
};

function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = String(p.callback || '');
  if (!/^[A-Za-z_$][\w$]{0,63}$/.test(cb)) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', errors: [{ detailed_message: 'missing/invalid callback' }] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var out;
  try {
    var src = SOURCES[String(p.k || '')];
    if (!src) throw new Error('unknown source');
    out = fetchGviz_(SHEETS[src.sheet], src.gid, p.headers === '0');
  } catch (err) {
    out = JSON.stringify({ status: 'error', errors: [{ detailed_message: '資料代理錯誤：' + (err && err.message || err) }] });
  }
  return ContentService.createTextOutput(cb + '(' + out + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// 以擁有者 OAuth token 呼叫 gviz，回傳 setResponse(...) 內的 JSON 字串
function fetchGviz_(sheetId, gid, noHeaders) {
  var url = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?gid=' + encodeURIComponent(gid)
          + (noHeaders ? '&headers=0' : '') + '&tqx=out:json';
  var res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('HTTP ' + res.getResponseCode());
  var txt = res.getContentText();
  var m = txt.match(/setResponse\(([\s\S]*)\);?\s*$/);
  if (!m) throw new Error('unexpected gviz response');
  return m[1];
}

// 部署前執行一次：觸發授權，並確認每個資料代號都讀得到
function setupCheck() {
  // 以下兩行讓 Apps Script 自動要求「試算表／雲端硬碟」讀取權限（gviz 需要）
  SpreadsheetApp.openById(SHEETS.main).getName();
  DriveApp.getFileById(SHEETS.hol).getName();
  Object.keys(SOURCES).forEach(function (k) {
    var s = SOURCES[k], json = JSON.parse(fetchGviz_(SHEETS[s.sheet], s.gid, k === 'raw'));
    if (json.status === 'error') throw new Error(k + '：' + JSON.stringify(json.errors));
    Logger.log('OK  %s  rows=%s', k, (json.table && json.table.rows || []).length);
  });
}
