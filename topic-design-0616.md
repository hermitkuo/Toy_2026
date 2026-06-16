# MLoutcome · 尚未解決的研究問題 × `/trinetx-design` 驗收

- 日期：2026-06-16
- 產出者：`trinetx-design` skill（知識庫：`MLoutcome/Ref_TriNetx/` 15 篇 OA TriNetX 腎臟論文 P1–P15）
- 目的：(1) 針對與本專案（CKD / MAKE / RWD / ML 結局）相關、**目前文獻尚未解決**的臨床問題提出題庫；(2) 對其中**指定 1 題**實際跑完整 `/trinetx-design` 流程，產出可驅動 pipeline 的**分析欄位 schema**，作為 skill 的驗收（acceptance test）。

---

## Part A — 跟你相關、尚未解決的研究問題（題庫）

每題標註：與哪篇既有文獻接續（延伸而非重複）、為何仍未解決、以及目前 `codelists.json` 的代碼準備度。

| # | 研究問題（一句話） | 設計類型 | 為何尚未解決 | 接續 | 代碼準備度 |
|---|---|---|---|---|---|
| **Q1 ★指定** | T2D + CKD 且**已穩定使用 SGLT2i** 者，**加上 finerenone（三支柱 add-on）** vs 續用 SGLT2i 單藥，能否降低 **MAKE-D**？高血鉀代價多大？ | TTE / add-on new-user | CONFIDENCE 試驗只看 UACR 等中介指標、且為「同時起始」；**對已用 SGLT2i 者「序列加成」對硬結局（MAKE-D/ESKD）尚無 head-to-head RCT 或 RWD** | P1, P2, P3 | 結局齊備；finerenone/SGLT2i 藥碼在 supplement ⚠ |
| Q2 | **非糖尿病** CKD（含肥胖相關 CKD）使用 **GLP-1 RA** vs 主動對照，對腎臟結局是否有益？ | new-user active-comparator | FLOW 及多數 RWD 限定糖尿病；非糖尿病 CKD 的腎結局實證缺口 | P4, P5 | 結局齊備；GLP-1 RA RxNorm 在 supplement ⚠ |
| Q3 | 非透析 CKD 貧血，**HIF-PHI vs ESA** 的**心血管/血栓栓塞安全性**（非療效）是否有差？ | new-user active-comparator | 療效大致相當，但 MACE/VTE **安全性訊號**在亞洲、非透析族群仍未定 | P8 | 主結局齊備；P8 次要結局清單在 supplement ⚠ |
| Q4 | CKD+T2D 多支柱治療的**起始順序**（先 finerenone 後 SGLT2i vs 反向 vs 同時）是否影響 MAKE-D 與高血鉀？ | TTE / 序列暴露 | 各支柱證據獨立建立，**起始順序的比較效益**完全未研究 | P2 | 同 Q1，藥碼 supplement ⚠ |
| Q5 | 用 TriNetX baseline 特徵建立 **ML 模型預測 1 年 MAKE-D**，是否優於 KFRE / eGFR 斜率？（**MLoutcome 核心題**） | 預測模型（emulated prospective） | 既有 ML 多預測 AKI/CKD 發生，**對「複合 MAKE-D」的可移轉外部驗證仍少** | P15 | label（MAKE-D）齊備；特徵工程需另列 |
| Q6 | CKD + 維生素 D 缺乏者，**補充維生素 D（可介入）** vs 不補充，對 MAKE 的**因果**效益（把關聯升級為 TTE）？ | target trial emulation | P13 為「缺乏↔MAKE」關聯；**補充作為介入的因果效益**未經 TTE 驗證 | P9, P13 | vitD LOINC 35365-6 齊備；補充劑暴露需建碼 |

> 指定題：**Q1**。理由：(a) 臨床上最迫切（三支柱 add-on 是當前 CKD 照護的真實決策點且無 RCT）；(b) 能完整操練 schema 的每個欄位群——add-on 新使用者暴露、MAKE-D 主結局、**高血鉀同時作為安全結局與 positive control**、MACE、腎功能/檢驗、CKD 分期、配對/偏差控制、共病基線。

---

## Part B — `/trinetx-design` 完整輸出（指定題 Q1）

> 研究問題：**「在 ≥18 歲、T2D 合併 CKD（eGFR<60 確認）且已穩定使用 SGLT2i ≥90 天的成人中，加上 finerenone（三支柱 add-on）相較於續用 SGLT2i 單藥，是否降低 MAKE-D，並付出多少高血鉀代價？」**

### 1. PICOT

- **P**：≥18 歲，T2D + CKD（`N18` 且 eGFR<60，≥2 次間隔≥90 天，CKD-EPI），index 前已穩定使用 SGLT2i ≥90 天 — Global Collaborative Network。
- **I**：**加上 finerenone**（finerenone 新使用者；維持原 SGLT2i）。
- **C**：**續用 SGLT2i 單藥**（同期合格但未起始 finerenone 者，配對於對應就診日）— 主動對照、避免 non-user 偏差。
- **O**：主要 = **MAKE-D**；次要 = ESKD、AKI、MACE、all-cause death；**安全性 = hyperkalemia**（同時為 positive control）。
- **T**：主分析 **3 年**（另報 1 年）。

### 2. Design spec（D 維度 + 文獻出處）

- 設計：target trial emulation，**add-on 新使用者 × 主動對照** `[D2 — P1/P5；對照概念 P2]`
- 網路：Global Collaborative Network `[D1 — P1/P2/P11]`
- Index：暴露 = 首次 finerenone 處方日；對照 = 已用 SGLT2i 背景下對應合格就診日（matched index）`[D3 — P1/P2]`
- Washout / 新使用者：index 前 **6 個月**無 finerenone 或任何 MRA 暴露；兩組 index 前 **≥90 天**已穩定 SGLT2i（確立 add-on 情境）；基線特徵窗 **1 年** `[D4 — P1/P2/P5]`
- Landmark：追蹤起點 = **index + 90 天**（降 immortal-time / protopathic bias）`[D5 — P5]`
- 最長追蹤：主分析 **3 年**，另報 1 年 `[D6 — P8]`
  - *偏離說明*：spec 預設主分析 5 年；因 finerenone 2021-07 上市、長追蹤樣本不足，主分析取 3 年 `[deviation — justified]`。
- 配對：**1:1 greedy NN PSM，caliper 0.1 pooled-SD-logit**；匹配後 SMD<0.1 `[D7 — P2/P11/P14]`
- 偏差控制：**negative control outcome = 脂肪囊腫 / 帶狀皰疹（HR 應 ≈1.0）**；**positive control = hyperkalemia（finerenone 應 ↑）**`[D8 — P1/P2/P5]`
- 敏感度：landmark 改 30d / 180d；排除 switcher；首 90 天事件設限；排除 baseline K⁺ 邊界者 `[D8 — P1]`
- 子群：eGFR 分層（<30 / 30–45 / 45–60）、albuminuria A2/A3、baseline K⁺ 分層 `[D9 — P6/P11]`

### 3. Cohort / exposure / outcome 定義（代碼來自 `codelists.json`）

**納入**
- T2DM：`ICD-10-CM E11`（P3/P6）、`E11.8, E11.9, E13.9, E08.9, E14`（P14）
- CKD：`ICD-10-CM N18` **且** eGFR<60（≥2 次，間隔≥90 天，**CKD-EPI**）（outcome_spec §3；P1/P2）；可選 UACR≥30 mg/g（P2）
- 背景暴露：index 前已用 SGLT2i ≥90 天 — *藥碼 ⚠ 需 supplement（SGLT2i 清單未在 codelists；GLP-1/SGLT2i ATC/RxNorm 為 `supplement_not_retrieved`，改用 TriNetX 平台藥物類別）*

**暴露 / 對照**
- finerenone（暴露）：VA Drug Class + RxNorm — **⚠ 需 supplement（P1/P2/P3 `codes_source: supplement`）；改用平台藥物類別**
- 對照：合格 SGLT2i 單藥使用者（同上藥碼註記）

**排除**
- 既有 ESKD/透析：`N18.5, N18.6, Z99.2`、`CPT 90935–90999`（P8 排除集）
- 既往腎移植：`Z94.0`（P7/P10/P14）
- baseline 高血鉀：K⁺ ≥5.0（finerenone 起始禁忌，保守）/ ≥5.5（hyperkalemia 定義，P1/P3）
- 既往 finerenone 或任何 MRA 暴露（washout 失敗者）
- index 前已發生主要結局（排除盛行病例，outcome_spec §0；P5/P13）

**結局（每項：旗標 + 日期；事件日 = 最早發生日）**
- **主要 MAKE-D**（outcome_spec §2，固定組成）= ESKD ∪ 持續 eGFR<15 ∪ 慢性透析起始 ∪ 腎移植 ∪ all-cause death
  - 透析：`Z99.2, N18.6`、`CPT 90935–90999`（P8/P9/P14）
  - 移植：`Z94.0`、`ICD-10-PCS 0TY1*`（P14）
  - kidney failure w/ RRT 完整集（P14）：`N18.6, Z99.2, Z94.0` + `CPT 1012740` + `0TY1, 0TY00Z1, 0TY10Z1, 0TY00Z0, 0TY10Z0`
  - eGFR<15（kidney failure 成分，P5/P7）
- ESKD（outcome_spec §1.1）：透析 ∪ 移植 ∪ 持續 eGFR<15
- AKI：`ICD-10-CM N17`（N17.9 P14；N17 P15）
- MACE（outcome_spec §4，固定組成）= AMI ∪ stroke ∪ HF ∪ cardiac arrest/cardiogenic shock
  - AMI `I21`（P6）、stroke `I61, I63`（P6）、acute HF `I50.21/.23/.31/.33/.41/.43/.811/.813`（P6）
  - **⚠ cardiac arrest / cardiogenic shock 成分碼 `supplement_not_retrieved`（P1/P2）**
- all-cause death：EHR 死亡旗標（非全國登錄，可能低估；P14 註）
- **hyperkalemia（安全 + positive control）**：K⁺ **>5.5**（>6.0 嚴重；≥6.5 極重）mmol/L（P1/P3）

### 4. 分析欄位 schema（主要交付物）

延伸 `outcome_spec.md` §6，依本研究客製。Markdown 表 + JSON 各一份。

| field_name | type | definition / source | code_or_threshold |
|---|---|---|---|
| patient_id | id | TriNetX patient key | — |
| index_date | date | 暴露=首次 finerenone Rx；對照=配對就診日 | — |
| follow_up_start | date | index + 90d（landmark） | — |
| follow_up_end | date | min(event, death, +3y, censor) | — |
| censor_reason | categorical | event / death / end_of_fu / lost | — |
| exposure_group | categorical | finerenone_addon vs sglt2i_only | 平台藥物類別 ⚠ supplement |
| bg_sglt2i_days | float | index 前 SGLT2i 連續天數 | ≥90 納入 |
| washout_pass | bool | 前 6m 無 finerenone/MRA | — |
| baseline_k | float | index 最近 K⁺ | 排除 ≥5.0/≥5.5 |
| egfr_baseline | float | CKD-EPI，index 前最近值 | <60 納入 |
| egfr_equation | categorical | 估算式 | CKD-EPI（預設） |
| egfr_min_fu | float | 追蹤期最低 eGFR | <15 = kidney failure |
| uacr / upcr | float | 蛋白尿 | ≥30 / ≥150 mg/g（A3>200） |
| hb_baseline | float | 基線血色素 | — |
| ckd_stage | categorical | KDIGO G3a/G3b/G4 | eGFR 45–60 / 30–45 / 15–30 |
| ckd_incident | bool | 2× eGFR<60 ≥90d | N18 |
| make_d_flag / make_d_date | bool/date | **主要**：ESKD∪eGFR<15∪透析∪移植∪death | 見 §3 |
| eskd_flag / eskd_date | bool/date | 透析∪移植∪eGFR<15 | Z99.2/N18.6/Z94.0/0TY1*/CPT90935-90999 |
| aki_flag / aki_date | bool/date | 急性腎損傷 | N17 |
| mace_flag / mace_date | bool/date | AMI∪stroke∪HF∪arrest | I21/I61/I63/I50.x（arrest ⚠ supplement） |
| death_flag / death_date | bool/date | EHR 死亡 | — |
| hyperkalemia_flag / hyperkalemia_date | bool/date | **安全 + positive control** | K⁺ >5.5（>6.0/≥6.5） |
| ps_score | float | 傾向分數 | — |
| matched_pair_id | id | 1:1 配對 | caliper 0.1 |
| smd_flag | bool | 任一共變數 SMD≥0.1 | — |
| neg_control_outcome | bool | 脂肪囊腫/帶狀皰疹（HR≈1.0） | — |
| pos_control_outcome | bool | hyperkalemia（=上欄） | K⁺ >5.5 |
| cm_t2dm / cm_hf / cm_htn / cm_obesity | bool | 基線共病 | E11 / I50 / I10-I15 / E66 |

```json
{"study":"Q1_finerenone_addon_vs_sglt2i_only","fields":[
 {"name":"patient_id","type":"id"},
 {"name":"index_date","type":"date","rule":"exp=first finerenone Rx; comp=matched encounter"},
 {"name":"follow_up_start","type":"date","rule":"index+90d"},
 {"name":"follow_up_end","type":"date","rule":"min(event,death,+3y,censor)"},
 {"name":"censor_reason","type":"categorical","values":["event","death","end_of_fu","lost"]},
 {"name":"exposure_group","type":"categorical","values":["finerenone_addon","sglt2i_only"],"codes":"platform drug class (supplement)"},
 {"name":"bg_sglt2i_days","type":"float","rule":">=90 required"},
 {"name":"washout_pass","type":"bool","rule":"no finerenone/MRA prior 6m"},
 {"name":"baseline_k","type":"float","threshold":"exclude >=5.0/5.5"},
 {"name":"egfr_baseline","type":"float","equation":"CKD-EPI","threshold":"<60"},
 {"name":"egfr_equation","type":"categorical","default":"CKD-EPI"},
 {"name":"egfr_min_fu","type":"float","threshold":"<15"},
 {"name":"uacr","type":"float","threshold":">=30"},
 {"name":"upcr","type":"float","threshold":">=150"},
 {"name":"hb_baseline","type":"float"},
 {"name":"ckd_stage","type":"categorical","values":["G3a","G3b","G4"]},
 {"name":"ckd_incident","type":"bool","code":"N18","rule":"2x eGFR<60 >=90d"},
 {"name":"make_d","type":"event","def":"ESKD|eGFR<15|dialysis|transplant|death"},
 {"name":"eskd","type":"event","codes":["Z99.2","N18.6","Z94.0","0TY1*","CPT90935-90999"]},
 {"name":"aki","type":"event","code":"N17"},
 {"name":"mace","type":"event","codes":["I21","I61","I63","I50.21","I50.23","I50.31","I50.33","I50.41","I50.43","I50.811","I50.813"],"note":"cardiac arrest/shock codes supplement_not_retrieved"},
 {"name":"death","type":"event"},
 {"name":"hyperkalemia","type":"event","threshold":">5.5;>6.0;>=6.5","role":"safety+positive_control"},
 {"name":"ps_score","type":"float"},
 {"name":"matched_pair_id","type":"id","rule":"1:1 caliper0.1"},
 {"name":"smd_flag","type":"bool"},
 {"name":"neg_control_outcome","type":"bool","def":"lipoma/herpes zoster"},
 {"name":"cm_t2dm","type":"bool","code":"E11"},
 {"name":"cm_hf","type":"bool","code":"I50"},
 {"name":"cm_htn","type":"bool","code":"I10-I15"},
 {"name":"cm_obesity","type":"bool","code":"E66"}
]}
```

### 5. RWD 驗證 checklist

- [ ] 兩組 row count 報告 pre/post-match；達成 1:1。
- [ ] `bg_sglt2i_days ≥ 90` 100% 成立（add-on 情境純度）。
- [ ] `egfr_baseline`、`potassium`(baseline_k)、`creatinine` 缺失率在容忍範圍內。
- [ ] 配對後所有共變數 SMD<0.1（`smd_flag` 全 false）。
- [ ] 每列 `follow_up_start ≥ index_date`；無任何結局日期 < `follow_up_start`。
- [ ] 排除 index 前已發生 MAKE-D 之盛行病例。
- [ ] **negative control（脂肪囊腫/帶狀皰疹）HR ≈ 1.0**；**positive control（hyperkalemia）HR > 1** 且方向合理（finerenone 應升高）→ 殘餘混淆 sanity check。

### 6. Citations / caveats

- **適用 `[normative]` 預設**：MAKE-D 組成（outcome_spec §2）、CKD-EPI eGFR 估算式、index+90d landmark、主分析追蹤改 3 年（已說明偏離理由）。
- **`supplement_not_retrieved` 缺口**（見 `SUPPLEMENTS_TODO.md`）：
  - finerenone / SGLT2i 藥物代碼（P1/P2/P3）→ 改用 TriNetX 平台 curated 藥物類別。
  - MACE 之 cardiac arrest / cardiogenic shock 成分碼（P1/P2）→ 暫以正文已列成分（AMI/stroke/HF）建構，補充碼到位後再擴充。
- **代碼來源**：所有 ICD/CPT/PCS/LOINC 值均取自 `codelists.json`，未自行杜撰；缺者已標 ⚠。

---

## Part C — Skill 驗收結論（acceptance）

| 驗收項 | 結果 |
|---|---|
| PICOT 解析 | ✅ P/I/C/O/T 完整 |
| 設計維度 D1–D9 + 文獻出處 | ✅ 全部標註 |
| 代碼僅取自 `codelists.json`、缺者標 ⚠ | ✅ 未杜撰；2 處 supplement 缺口已標 |
| 欄位 schema（表 + JSON，可驅動 pipeline） | ✅ 含本研究客製欄位（bg_sglt2i_days / baseline_k / pos_control） |
| 驗證 checklist + negative/positive control | ✅ |
| 暴露藥碼缺口處理 | ⚠ 已正確 fallback 到平台藥物類別（codelists 需擴充 SGLT2i/finerenone RxNorm） |

**結論**：skill 在指定題 Q1 上端到端跑通，schema 可直接餵入 RWD 驗證 pipeline。唯一外部依賴為 supplement 藥碼，已依規則 fallback 並標記，符合「不杜撰代碼」的設計原則。
