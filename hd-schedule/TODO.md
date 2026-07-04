---
project: hd-schedule
last_checkout: 2026-07-04 17:54
---

# TODO — 花蓮慈院血透室班表頁

## Status
檢查 `setup_settings_sheet.gs`：功能邏輯健全（欄數／validation／重跑保護皆正確），修正過時提示——檔頭與完成 alert 由「三個分頁」改為「四個分頁」，補上遺漏的「醫師配額」。

## Next
- 部署 `publish_webapp.gs` 成 Web App、填 schedule.html 的 /exec 網址+通關碼；把草稿分頁 gid 填進 index.html `DRAFT_GID` 啟用 B。
- schedule.html 優化：S6 偏好納入排班、掛名輪替（目前偏集中）、遞補自動套用（目前僅建議）。
- 接後端讓 leave.html / preference.html 真正送出（Apps Script 寫入 醫師偏好/請假分頁）。

## Sessions
- sess_unknown (2026-07-04): 檢查並修正 setup_settings_sheet.gs 過時提示（3→4 分頁，補「醫師配額」）
- sess_unknown (2026-07-04): 建立排班全鏈路四頁+兩支 Apps Script+規則 v1.0，閱覽頁可讀草稿分頁(B)，全部已 push

## 計劃 — 自動化排班（新增）

- [~] 1. 建立收集醫師請假與有事資料的填寫頁面
      → `leave.html`（mock，尚未連動送出）。請假＝整天硬限制；有事＝單一時段（早/中/晚）硬限制。
        送出產生 payload：`{doctor, month, fullDayLeave[], sessionBusy[], note}`，暫存 localStorage。
      → `preference.html`（mock）：S6 醫師偏好，收「星期幾×院內時段早中晚」+ 優先序。
        payload：`{doctor, preferred:[{weekday,session,rank}], note}`。
      待辦：接後端送出（Google 表單/Apps Script）。
- [x] 2. 建立醫師排班規則順位
      → `排班規則_草稿.md` **v1.0 規則定案**。硬限制 H1–H9、軟限制 S1–S7、需求各一人。
        重點：H5 值班輪值（徐王賴林郭鄧翔，一人一天、週末連兩天、跨月延續、值班日可兼外派）、
        §0.1 掛名欄、§0.2 院內 HD 患者六組、S1–S3 依母表/輪值、S4/S5 避免連續（週六例外）、
        H8/H9 掛名檢核（花蓮HD/特約 不得與 聯安掛名/玉里/關山/請假 同人，衝突拆早中晚）+ S7、
        S6 偏好收「星期幾×院內時段早中晚」。
      後續建置：S6 偏好表頁（可比照 leave.html）→ 屬 Task 3 前置。
- [~] 3. 依照排班規則建立自動化排班（＋編輯頁）
      → `schedule.html` = 排班「編輯頁」（排班者用，確認後供醫師閱覽）。Approach A：以母表展開。已驗證：
        自動排班：
        · 讀輪值母表(gviz)→展開當月；花蓮OPD/PD→院內早/中/晚、玉里/關山/聯安→同名(H6)
        · 值班輪值(徐王賴林郭鄧翔)：一人一天、週末連兩天、跨月延續，起點可選(預設8/1翔)
        · 聯安掛名 H7(祺/翔/超/禮 解耦留空)、花蓮HD/特約 掛名自動建議(排除外派/請假)
        · 讀 localStorage 請假/有事 → 標紅(整天)/橘(時段)衝突 + 建議遞補；H8/H9/S7/H2 檢核
        人工微調＋工作流：
        · 點格編輯器(醫師 chip 勾選 + 可加院外名如「佳文」)、重新檢核
        · 草稿自動存 localStorage(hd_sched_draft_<月>)、換月/重開不遺失
        · 狀態徽章 草稿/已確認；「✔ 確認並鎖定」→ 存 hd_sched_pub_<月> + 鎖定不可編輯
        · 發布區：複製 JSON / 下載 CSV(貼回試算表橋接)；可「解鎖再修改」
      → 一鍵發布：`publish_webapp.gs`（Apps Script doPost，token 驗證）寫入「自動排班草稿」分頁；
        schedule.html 發布區填 /exec 網址+通關碼即可 POST（text/plain 避開 CORS preflight）。已驗證前端 payload。
        待排班者部署 Web App 並填網址後可實測。
      → 閱覽頁讀草稿(B 已做)：index.html 加 DRAFT_GID/DRAFT_SHEET_ID 設定 → 填「自動排班草稿」分頁 gid
        即改讀草稿（草稿為空自動退回原班表、不弄壞頁面）；parseDate 支援文字日期、休假單欄。
        預設留空＝現況不變。已驗證原班表與我的時段皆正常、草稿格式解析正確。
      待辦：排班者填 DRAFT_GID 啟用；S6 偏好納入優化、掛名輪替、遞補自動套用。

## 背景

- 目前 `index.html` 是純靜態頁，直接用 **gviz JSONP** 從公開 Google Sheet 抓班表。
- 現況問題：
  1. `SHEET_ID` 寫死在前端（`index.html:240`），任何人看原始碼 / Network 分頁都拿得到。
  2. gviz 需要試算表設「知道連結的人可檢視」→ 資料（含醫師姓名）等於**全公開**。
- 純前端無法真正隱藏 ID（混淆無效）→ 需加一層 server-side 代理。

## 目標

改用 **Google Apps Script Web App** 當代理，同時達成：
- [ ] Sheet ID 不再出現在前端
- [ ] 試算表可改回**私有**（Apps Script 以擁有者身分讀）
- [ ] 前端改讀 Apps Script 回傳的 JSON，功能與畫面不變

## 工作項目

### 1. Apps Script Web App（資料端）
- [ ] 在目標試算表開啟 Apps Script
- [ ] 寫 `doGet()`：讀取工作表 → 回傳 JSON，欄位結構對齊現有 `SHIFT_COLS`
      （日期、星期、值班、早/中/晚、花蓮HD、特約、玉里/關山/聯安/聯安掛名、休假四欄合併）
- [ ] 部署成 Web App（執行身分＝擁有者，存取權＝任何人）
- [ ] 記下部署後的 `/macros/...` 網址

### 2. 前端改造（`index.html`）
- [ ] 移除 `SHEET_ID` / `GID` 與 gviz JSONP 載入邏輯（`load()` + `window[CB]`，約 280–316 行）
- [ ] 改用 `fetch('<Apps Script 網址>')` 取 JSON
- [ ] 調整 `parse()` 以吃新的 JSON 結構（不再是 gviz table 格式）
- [ ] 頁尾「Google 試算表」連結：改為不外露原始表，或指向唯讀版本
- [ ] 確認錯誤處理 / 逾時 / 重新整理（↻）仍運作

### 3. 收尾
- [ ] 試算表分享權限改回**私有**，確認頁面仍正常載入
- [ ] 驗證：多人同時看、手機、換月、醫師高亮皆正常
- [ ] 部署到 GitHub Pages 後線上驗證

## 待決策 / 注意

- **藏 ID ≠ 資料私密**：Apps Script 端點仍對所有人開放，任何人打該 URL 一樣拿得到整份班表。
  - 若要連「資料本身」都不外流 → 需再對端點加身分驗證（本次範圍暫不含，待確認需求）。
- Apps Script 有配額、回應略慢於 gviz，但班表流量極低，實務無感。

## 已排除的方案

- 前端混淆 ID（base64／拆字串）：擋不住 Network 分頁，無效。
- 直接上 Supabase：資料庫功能強，但原生後台編輯體驗對非技術人員不友善，且醫師需重新學習 → 暫不採用，保留 Sheets 編輯習慣。
