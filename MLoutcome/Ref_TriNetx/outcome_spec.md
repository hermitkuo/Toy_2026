# TriNetX 腎臟結局 — 專案標準定義規格 (Outcome Spec v1.0)

本規格將 15 篇 TriNetX 腎臟領域論文(見 [`outcome_definitions.md`](./outcome_definitions.md))的作法**收斂成單一、可重用的專案標準**,供 MLoutcome 的 cohort/outcome 標註與 RWD 驗證使用。每項定義標註其文獻依據;`[normative]` 表示本專案在文獻分歧處所做的決定。

代碼以 [`codelists.json`](./codelists.json) / [`codelists.csv`](./codelists.csv) 為單一事實來源(single source of truth)。

---

## 0. 通用慣例

| 項目 | 專案標準 | 依據 |
|------|----------|------|
| eGFR 估算式 | **CKD-EPI 為主**;若資料僅有 MDRD 則記錄並於敏感度分析比較 `[normative]` | P10 同時用 MDRD+CKD-EPI;P1/P11 用 MDRD |
| Index date | 暴露組 = 首次標的藥物處方/事件日;對照組 = 對應比較藥物首次處方日 | P1, P6, P14 |
| Washout（新使用者） | index 前 **6 個月** 無對側類別暴露(藥物試驗);觀察期前 **12 個月** 基線 | P2, P3(6m);P1(6m);P5(12m baseline) |
| 追蹤起點 | **index 後 landmark**:藥物效果研究採 index+**90 天**(或合併治療 index+4 個月)以降低 immortal-time/protopathic bias `[normative]` | P4, P5(90d);P2(4m landmark);P7(3m) |
| 最長追蹤 | 主分析 **5 年**;短期藥效另報 1/3 年 `[normative]` | P7, P14(5y);P4(4y) |
| 配對 | **1:1 greedy nearest-neighbor PSM,caliper 0.1 pooled SD of logit**;匹配後 SMD < 0.1 為平衡 | P2, P5, P9, P13, P14 |
| 對照(control)結局 | 每個分析納入 ≥1 **negative control outcome** 與(藥物研究)**positive/negative exposure control** 以偵測殘餘偏差 | P1, P5, P7 |
| 排除「index 前已發生主要結局」 | 一律排除,避免盛行病例污染 | P5, P13 |

---

## 1. 腎臟硬終點

### 1.1 ESKD（末期腎病）— 專案標準
**定義**：滿足下列任一即為 ESKD（首次發生日為事件日）`[normative,合併多篇]`
1. 慢性透析(maintenance dialysis):`ICD-10-CM Z99.2` 或 `N18.6`,或 `CPT 90935–90999`;
2. 腎臟移植:`ICD-10-CM Z94.0` 或 `ICD-10-PCS 0TY1*`;
3. 持續 **eGFR < 15 mL/min/1.73m²**(建議 ≥2 次或持續 ≥90 天)。
- 文獻依據:P1/P2/P11(ESKD = 透析或移植);P5/P7(eGFR<15 納入 kidney failure)。

### 1.2 Kidney failure with RRT（需腎臟替代治療之腎衰竭）
直接採用 P14 完整代碼集(最完整且逐字可得):
`ICD-10-CM N18.6, Z99.2, Z94.0` + `CPT 1012740` + `ICD-10-PCS 0TY1, 0TY00Z1, 0TY10Z1, 0TY00Z0, 0TY10Z0`。

### 1.3 AKI（急性腎損傷）
**定義**：`ICD-10-CM N17`（含 N17.9）。可選擇加上 KDIGO lab-based(creatinine 升高)作為敏感度分析 `[normative]`。
- 依據:P14(N17.9)、P15(N17)。

---

## 2. 複合結局 MAKE（專案標準，固定組成）

> 文獻 MAKE 組成不一(見 outcome_definitions.md 對照表)。本專案**固定**如下,並提供兩個版本:

- **MAKE（腎臟）** = ESKD（§1.1） **或** 持續 eGFR < 15 **或** 慢性透析起始 **或** 腎移植。
- **MAKE-D（含死亡）** = MAKE **或** all-cause death。 ← 與 P7 一致,建議作為主結局 `[normative]`
- 事件日 = 各組成最早發生日。
- 依據:P5(ESKD+dialysis+eGFR<15)、P7(+death)、P2(stage5+ESRD)、P13。

---

## 3. CKD 定義與分期

| 概念 | 專案標準 | 依據 |
|------|----------|------|
| CKD（診斷） | `ICD-10-CM N18` **且** 至少 1 項:eGFR<60(≥2 次間隔≥90 天)、UACR≥30 mg/g、或 UPCR≥150 mg/g | P1, P2 |
| Incident CKD | 2 次 **eGFR < 60** 間隔 ≥ 90 天 | P1 |
| Stage 3–4 | eGFR 15–60(KDIGO G3–G4)或 UACR>200 mg/g(A3) | P11 |
| Stage 4 | eGFR 15–30(≥2 次) | P8 |
| Advanced CKD（入組） | eGFR ≤ 45 | P4 |
| Stage 5 / ESRD | 見 §1.1 | P2 |

---

## 4. 心血管與安全性結局（腎臟研究常並列）

| 結局 | 專案標準代碼/閾值 | 依據 |
|------|-------------------|------|
| MACE | 複合:AMI(`I21`)+ stroke(`I61, I63`)+ HF + cardiac arrest/cardiogenic shock `[normative]` | P1/P2/P4/P5/P7 |
| Acute HF | `I50.21, I50.23, I50.31, I50.33, I50.41, I50.43, I50.811, I50.813` | P6 |
| Hyperkalemia | K⁺ **> 5.5 mmol/L**;嚴重 **> 6.0**;極重 **≥ 6.5** | P1, P3 |
| All-cause mortality | EHR 死亡旗標(注意非全國死亡登錄,低估可能) | P14 等 |

---

## 5. 關鍵實驗室閾值（速查）

| 項目 | 閾值 | LOINC/代碼 | 依據 |
|------|------|------------|------|
| eGFR kidney failure | < 15 | — | P5, P7 |
| eGFR CKD | < 60 | — | P1, P2 |
| 血鉀 hyperkalemia | >5.5 / >6.0 / ≥6.5 mmol/L | — | P1, P3 |
| 25(OH)D 缺乏/充足 | <20 / ≥30 ng/mL | LOINC 35365-6 | P9, P13 |
| 鈣 低/高 | ≤8.5 / >10.5 mg/dL | — | P9 |
| PTH 抑制 | ≤300 pg/mL | — | P9 |
| hsCRP 發炎 | ≥2 mg/L | — | P11 |
| creatinine（graft failure） | ≥6.00 mg/dL | TNX:9024 | P10 |
| UACR / UPCR | ≥30 / ≥150 mg/g(A3: >200) | — | P2, P11 |

---

## 6. 套用到 RWD 驗證的最小欄位集（cohort-level）

建立任一 TriNetX 腎臟分析至少需具備下列欄位(對應 §0–§5):

- **識別/時間**：patient_id、index_date、follow_up_start(index+landmark)、follow_up_end、censor_reason
- **暴露**：exposure_group、exposure_first_date、comparator、washout_pass(bool)
- **結局(每項一旗標+日期)**：ESKD、kidney_failure_RRT、AKI、MAKE、MAKE_D、MACE、acute_HF、hyperkalemia、all_cause_death
- **腎功能/檢驗**：egfr_baseline、egfr_equation、egfr_min_followup、uacr、upcr、potassium_max、hb_baseline
- **CKD 分期**：ckd_stage、ckd_incident(bool)
- **配對/偏差控制**：ps_score、matched_pair_id、smd_flag、negative_control_outcome、positive_control_outcome
- **共病基線**：T2DM、HF、HTN、obesity、(transplant_status、hcv 等依研究)

> 此欄位集即為後續「TriNetX design skill」自動生成分析骨架的目標 schema(見 SUPPLEMENTS_TODO.md / 後續規劃)。

---

## 變更紀錄
- v1.0 (2026-06-15)：自 15 篇 OA 論文初版收斂。代碼以 in-text 可取得者為準;supplement-only 代碼待補(見 `SUPPLEMENTS_TODO.md`)。
