# TriNetX 研究設計樣式庫（Design Methods Library）

自 15 篇 TriNetX 腎臟領域論文（見 [`README.md`](./README.md)）的 Methods 萃取的**設計骨架**,作為 [`.claude/skills/trinetx-design`](../../.claude/skills/trinetx-design/SKILL.md) 技能快速生成分析欄位的知識庫。

- 第一部分:**標準設計配方**(canonical recipe)。
- 第二部分:**設計維度選單**(每個決策點 → 文獻中的選項 → 出處),供依研究問題選配。
- 第三部分:**15 篇設計矩陣**速查表。
- 論文代號 P1–P15 對應見 `codelists.json` 之 `paper_index`。

---

## 第一部分:標準 TriNetX RWD 研究設計配方

絕大多數論文遵循 **「new-user, active-comparator, propensity-matched cohort（常以 target trial emulation 框架）」**。標準八步驟:

1. **資料網路**:選定 TriNetX 子網路(US Collaborative / Global Collaborative / Research / Dataworks USA)。記錄 HCO 數、國別、擷取日。
2. **來源族群與時間窗**:疾病/暴露診斷碼 + 研究起訖(常綁定藥物 FDA 核准日,如 finerenone 2021-07-09)。
3. **暴露 vs 對照(new-user)**:首次處方為 index;**active comparator**(同適應症他藥)優於 non-user;washout = index 前 6 個月無對側暴露。
4. **納入/排除**:年齡 ≥18;疾病確認(診斷碼 + 檢驗/蛋白尿閾值);排除既有結局、競爭事件、禁忌(如近期 ACS/stroke、ESRD、baseline 高血鉀)。
5. **Index date 與 landmark**:index = 暴露起始日;**追蹤起點延後**(index + 30/90 天,或合併治療 index + 4 個月)以避免 immortal-time / protopathic bias。
6. **基線特徵窗**:index 前 1 年(或 3 年)擷取共病、藥物、檢驗作為 covariate。
7. **配對**:**1:1 greedy nearest-neighbor PSM,caliper 0.1 pooled SD of logit**;報告匹配後 SMD(<0.1 為平衡)。
8. **分析與偏差控制**:ITT Cox(HR)或 logistic(OR);KM 存活;**negative control outcome**(±positive control、exposure control)偵測殘餘混淆;敏感度(landmark 變動、劑量限制、排除 switcher、首 30 天事件設限)。

---

## 第二部分:設計維度選單（依研究問題選配）

### D1. 資料網路
| 選項 | 適用情境 | 出處 |
|------|----------|------|
| US Collaborative Network | 聚焦美國、規模大 | P2, P4 |
| Global Collaborative Network | 跨國、亞太族群、樣本最大 | P1, P3, P7, P8, P9, P11, P13 |
| Research / Research Collaborative Network | 含 ML / 大樣本研究 | P10, P14, P15 |
| Dataworks USA Network | 長期(≥10 年)縱貫資料 | P12 |

### D2. 研究設計類型
| 選項 | 出處 |
|------|------|
| Target trial emulation | P1, P5 |
| New-user active-comparator cohort | P2, P3, P6, P8, P14 |
| New-user vs non-user cohort | P4 |
| Exposure-defined(疾病暴露,如 HCV / 發炎 / 醛固酮) | P10, P11, P12 |
| Prediction model（emulated prospective） | P15 |

### D3. Index date 定義
| 選項 | 出處 |
|------|------|
| 首次標的藥物處方 | P1, P2, P3, P4, P5, P6, P8, P14 |
| 手術/事件日（如腎移植 Z94.0） | P7, P10 |
| 首次檢驗值（hsCRP / aldosterone / vitamin D） | P9, P11, P12, P13 |
| 研究起始後首次就診 | P15 |

### D4. Washout / 新使用者窗
| 選項 | 出處 |
|------|------|
| index 前 6 個月無對側暴露 | P1, P2, P3 |
| index 前 3 個月內無暴露(或起始) | P4, P7 |
| 基線特徵窗 1 年 | P5, P11, P15 |
| 基線特徵窗 3 年 | P14 |

### D5. 追蹤起點 landmark（降偏差）
| 選項 | 出處 |
|------|------|
| index + 30 天 | P4 |
| index + 90 天 | P5 |
| index + 3 個月（移植後） | P7 |
| index + 4 個月（合併治療 landmark） | P2 |
| index + 1 天 | P8, P11 |

### D6. 最長追蹤
| 選項 | 出處 |
|------|------|
| 1 年 | P3, P13 |
| 1.5 年 | P1 |
| 3 年 | P6, P8, P9 |
| 4 年 | P4 |
| 5 年 | P7, P14 |
| 6 年 | P11 |
| ≥1 年（移植,10 年觀察） | P10 |

### D7. 配對 / 調整
| 選項 | 出處 |
|------|------|
| 1:1 greedy NN PSM, caliper 0.1 | P2, P9, P11, P13, P14 |
| 1:1 PSM（基本） | P3, P5, P8, P10 |
| PSM 變項數明示（57 / 95） | P11(57), P9(95) |
| 多變項 logistic aOR（無配對） | P12 |
| TRIPOD+AI 預測模型、70/30 split | P15 |

### D8. 偏差控制
| 機制 | 出處 |
|------|------|
| Negative control outcome | P1（cancer）, P2, P5, P7 |
| Positive control outcome | P2（hyperkalemia）, P7（GI 症狀） |
| Exposure controls（正/負） | P7（SGLT2i / topical urea） |
| 排除 index 前已發生結局 | P5, P13 |
| 敏感度:landmark 變動 | P1（3/6m）, P2（2/6m）, P4 |
| 敏感度:劑量限制 / 排除 switcher / 首30天設限 | P1 |

### D9. 子群 / 分層
| 選項 | 出處 |
|------|------|
| 糖尿病 vs 非糖尿病 | P11 |
| eGFR 分層（<30/30-45/45-60/≥60） | P6 |
| Ferritin / Hb 分層 | P8 |
| Race / Age 分層 | P12 |

---

## 第三部分:15 篇設計矩陣

| P | 設計類型 | 網路 | Index | Washout | Landmark | 追蹤 | 配對 | 控制 |
|---|----------|------|-------|---------|----------|------|------|------|
| P1 | TTE | Global | 首次 MRA | 6m | 3/6m(SA) | 1.5y | 1:1 PSM | neg(cancer) |
| P2 | active-comp | US Collab | 首次藥 | — | **4m** | ~1y | 1:1 PSM c0.1 | pos(K)/neg |
| P3 | active-comp | Global | 首次 MRA | 6m | — | 1y | 1:1 PSM | — |
| P4 | new vs non-user | US Collab | 首次藥 | — | 30d | 4y | 1:1 PSM | — |
| P5 | TTE | TriNetX | 首次藥 | 12m base | 90d | →1y SA | 1:1 PSM | neg controls |
| P6 | active-comp | Global | 用藥 day0 | — | — | 3y KM | covariate adj | — |
| P7 | exposure(移植) | Global | 移植日 Z94.0 | 3m | 3m | 5y | adj HR | pos/neg+exposure |
| P8 | active-comp | Global | 首次藥 | — | 1d | 3y | 1:1 PSM | — |
| P9 | exposure(檢驗) | Global | 透析+calcimimetic | — | — | 3y | 1:1 PSM 95var | Bonferroni-Holm |
| P10 | exposure(HCV) | Research | 移植日 | — | — | ≥1y/10y | 1:1 PSM | — |
| P11 | exposure(hsCRP) | Global | 首次 hsCRP | — | 1d | 6y | 1:1 PSM 57var c0.1 | DM 子群 |
| P12 | exposure(aldo) | Dataworks USA | 首次 aldosterone | — | — | HTN 1y/CKD any | logistic aOR | race/age 子群 |
| P13 | exposure(vitD) | Global | vitD 檢測日 | — | — | 1y | 1:1 PSM c0.1 | 排除前置結局 |
| P14 | active-comp | Research Collab | 首次睪固酮 | 3y base | — | 5y | 1:1 PSM c0.1 | — |
| P15 | 預測模型 | Research | 起始後首次就診 | 1y base | — | 1mo/1y label | 70/30 split | TRIPOD+AI |

> 縮寫:TTE = target trial emulation;active-comp = new-user active-comparator;SA = sensitivity analysis;c0.1 = caliper 0.1;base = 基線特徵窗。

---

## 引用聲明
設計資訊萃取自各論文 Methods,來源為 PubMed Central 全文。引用個別研究請標註其 DOI(見 README.md / codelists.json）。
