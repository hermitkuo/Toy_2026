# TriNetX 腎臟領域研究 — Outcome 操作型定義彙整 (2025–2026)

本文件自 [`README.md`](./README.md) 收錄之 15 篇 TriNetX 腎臟領域 Open Access 論文中,萃取每篇研究的 **結局（outcome）操作型定義**,作為自建 ML outcome 標註與 cohort 定義之參考。

- 內容包含:主要/次要結局、複合結局組成、診斷/處置/藥物/檢驗代碼(ICD-10-CM、ICD-10-PCS、CPT、RxNorm、ATC、LOINC、TNX)、實驗室閾值、追蹤時間窗與 index date 定義。
- 代碼與閾值盡量**逐字保留原文**。若原文僅以敘述定義、代碼置於補充資料(supplementary)未列於正文者,均明確標註。
- 資料來源:**PubMed Central 全文**;每篇附 DOI。檢索/萃取日期:2026-06-15。

> ⚠️ 重要提醒:多篇論文將實際代碼清單放在 supplementary tables(正文未列出)。下方標示「Supplement only」者,需回原文補充檔取得完整代碼集。各研究的 eGFR 估算公式(MDRD / CKD-EPI / Cockcroft–Gault)與 TriNetX 子網路不盡相同,套用前務必確認。

---

## 第一部分:跨研究腎臟結局定義對照（可重用速查表）

### 複合腎臟結局 MAKE (Major Adverse Kidney Events)
| 研究 | MAKE 組成定義 |
|------|---------------|
| GLP-1 RA in obesity (DOM, #5) | ESKD + dialysis + **eGFR < 15 mL/min/1.73 m²** |
| GLP-1 RA in kidney transplant (Cardiovasc Diabetol, #7) | dialysis dependence + **eGFR < 15** + death |
| Finerenone/SGLT2i combined vs mono (NDT, #2) | **stage 5 CKD + ESRD**(ESRD = 透析或腎移植) |
| Vitamin D & MAKE in CKD (Front Nutr, #13) | ESKD + urgent dialysis initiation + dialysis dependence(敘述,無 component 代碼) |

### ESKD / ESRD
| 研究 | 定義 |
|------|------|
| Finerenone vs spironolactone (Nat Commun, #1) | ESKD 或 dialysis initiation（屬 MAKE） |
| Finerenone/SGLT2i (NDT, #2) | ESRD = 透析治療或腎移植 |
| Systemic inflammation (Kidney Int Rep, #11) | **chronic dialysis 或 renal transplantation** |

### AKI(急性腎損傷）
| 研究 | 代碼/定義 |
|------|-----------|
| Testosterone (Cardiovasc Diabetol, #14) | **ICD-10 N17.9** |
| ML prediction (EBioMedicine, #15) | **ICD-10-CM N17**(label） |
| GLP-1 RA in obesity (DOM, #5) | AKI(次要結局,敘述） |

### Kidney failure / 透析依賴 / 腎移植狀態(代碼層級)
| 概念 | 代碼（出處） |
|------|--------------|
| Kidney failure with RRT | **N18.6; Z99.2; Z94.0; CPT 1012740; ICD-10-PCS 0TY1, 0TY00Z1, 0TY10Z1, 0TY00Z0, 0TY10Z0**（Testosterone, #14） |
| 透析依賴(graft failure) | **Z99.2**;creatinine ≥ 6.00 mg/dL(TNX:9024);eGFR(MDRD)≤ 5.00(TNX:8001);eGFR(CKD-EPI)≤ 5.00(LOINC 62238-1)（HCV transplant, #10） |
| ESRD / 透析排除條件 | **N18.5, N18.6** + **CPT 90935–90999**（HIF-PHI vs ESA, #8） |
| 腎移植 index/狀態 | **ICD-10-CM Z94.0**（#7, #10, #14) |
| 維持性透析 cohort | **ICD-10 N18.6**（calcimimetic dialysis, #9） |

### CKD 定義與關鍵 eGFR 閾值
| 概念 | 出處與閾值 |
|------|-----------|
| CKD 診斷碼 | **ICD-10 N18**（semaglutide #6、Front Nutr #13、ML #15） |
| Incident CKD | 2 次 **eGFR < 60**(MDRD)間隔 ≥ 90 天（Nat Commun #1） |
| CKD 入組 | CKD 診斷碼 + (eGFR<60 或 蛋白尿 或 **UACR≥30 mg/g** 或 **UPCR≥150 mg/g**)（NDT #2） |
| Stage IV CKD | **eGFR 15–30**(×2)（HIF-PHI #8) |
| CKD(發炎研究) | eGFR(MDRD)**15–60**(KDIGO 3–4) 或 **UACR > 200 mg/g**(A3)（Kidney Int Rep #11） |
| Kidney failure 閾值 | **eGFR < 15**(#1 排除、#5/#7 MAKE 組成) |

### 高血鉀(MRA 安全性結局常用)
| 研究 | 閾值 |
|------|------|
| Finerenone vs spironolactone (#1) | 高血鉀 ≥ 5.5(亦報 ≥6.0、≥6.5 mmol/L);baseline 排除 K⁺ ≥ 5.5 |
| ns vs steroidal MRA (#3) | 高血鉀 **> 5.5 mmol/L**;嚴重 **> 6.0 mmol/L** |
| Finerenone/SGLT2i (#2) | 高血鉀作為 positive control outcome |

---

## 第二部分:各論文逐篇 Outcome 定義

> 群組與編號對應 `README.md`。

## A. MRA / Finerenone

### 1. Finerenone vs. spironolactone in CKD + T2D（target trial emulation）
*Nat Commun 2025 — DOI [10.1038/s41467-025-64640-3](https://doi.org/10.1038/s41467-025-64640-3) — PMC12579246*
- **資料源**：TriNetX **Global Collaborative Network**(146 HCOs / 21 國)。Target trial emulation;coding 標準為 ICD-10(generic)。
- **主要結局(3 項)**：
  - **MACE** — acute coronary syndromes、nonfatal stroke、hemorrhagic stroke、cardiac arrest、cardiogenic shock（另有以較窄 MI 準則的替代定義）。
  - **MAKE** — **progression to ESKD 或 initiation of dialysis**。
  - **All-cause mortality**。
- **次要結局**：**Hyperkalemia**，閾值 **≥ 5.5 mEq/L**(亦報 ≥6.0、嚴重 ≥6.5 mmol/L)。Negative control = overall cancer incidence。
- **關鍵定義**：Incident CKD = 2 次 eGFR<60(MDRD)間隔 ≥90 天;排除 eGFR<15、ESRD、近期 ACS/stroke/cardiac arrest/cardiogenic shock 或 60 天內曾透析、腎上腺功能不全、強效 CYP3A4 抑制劑、**baseline 高血鉀 K⁺ ≥ 5.5 mmol/L**。
- **追蹤時間窗**：index→事件/失追/死亡/行政設限(2025-03-14)/**最長 1.5 年**;中位 1.3 年。ITT Cox + 1:1 PSM。敏感度:30 天內事件設限、限制劑量、排除 switcher、landmark 3/6 個月。
- **代碼/閾值(逐字)**：eGFR<60(×2,≥90 天,MDRD)、eGFR<15(排除)、K⁺ ≥5.5/≥6.0/≥6.5 mmol/L。**正文無 ICD/CPT/RxNorm/LOINC 代碼清單**(置於 Supplement)。

### 2. Cardio-kidney outcomes：finerenone 或 SGLT2i 合併 vs 單藥（CKD）
*Nephrol Dial Transplant 2025 — DOI [10.1093/ndt/gfaf064](https://doi.org/10.1093/ndt/gfaf064) — PMC12477464*
- **資料源**：TriNetX **US Collaborative Network**(62 HCOs,>1 億人)。Coding 系統明列:診斷 **ICD-10-CM**、藥物 **VA Drug Class + RxNorm**、處置 **ICD-10-PCS / CPT**、檢驗 **LOINC**。
- **主要結局**：**MAKE** = **stage 5 CKD + ESRD**(ESRD = 透析治療或腎移植)。
- **次要結局**：All-cause mortality;**MACE**(MI、缺血/出血性中風、cardiac death);MAKE 或全因死亡之複合;MACE 或全因死亡之複合;**ESRD**。Positive control = 高血鉀(vs SGLT2i);negative controls = 外傷、感音神經性聽損、URI、憂鬱發作。
- **入組定義**：≥18 歲 CKD,2021-07-09(finerenone FDA 核准)至 2023-11-30;CKD = 診斷碼 + (eGFR<60 或 蛋白尿診斷 或 **UACR≥30 mg/g** 或 **UPCR≥150 mg/g**);排除 60 天內 spironolactone/eplerenone、stage 5 CKD/ESRD/透析依賴、60 天內 AMI/顱內出血/腦梗塞。
- **追蹤時間窗**：**Landmark 設計** — 合併組兩藥需 ≤4 個月內起始,各組追蹤起點統一為 index 後 4 個月;追蹤至 2024-07-15 或死亡(平均 ~12–13 個月)。敏感度:2、6 個月 landmark。1:1 greedy PSM(caliper 0.1)。
- **代碼/閾值(逐字)**：eGFR<60、UACR≥30 mg/g、UPCR≥150 mg/g、排除窗 60 天。**具體代碼清單置於 Supplement**(正文僅列 coding 系統名稱)。

### 3. 非類固醇 vs 類固醇 MRA：CV 結局與高血鉀（DM+CKD+HF）
*Cureus 2025 — DOI [10.7759/cureus.97588](https://doi.org/10.7759/cureus.97588) — PMC12641577*
- **資料源**：TriNetX **Global Collaborative Network**(>148 HCOs)。New-user 設計。
- **入組(正文內含 ICD-10)**：成人同時具 **T2DM = E11**、**CKD = N18**、**HF = I50.2, I50.3**;2020-01-01 至 2024-12-31 起始 finerenone(非類固醇)或 spironolactone/eplerenone(類固醇);index = 首次 MRA 處方;排除 index 前 6 個月有對側類別 MRA。
- **主要(安全性)結局**：**Hyperkalemia = 血清 K⁺ > 5.5 mmol/L**;**Severe hyperkalemia = > 6.0 mmol/L**。
- **次要(療效)結局**：Arrhythmia(AF/flutter、VT、VF 複合);MI;Stroke(缺血性中風或腦梗塞);All-cause mortality。
- **追蹤時間窗**：index 起 **12 個月**。1:1 PSM(780/組)。
- **代碼/閾值(逐字)**：入組 ICD-10 **E11, N18, I50.2, I50.3**;K⁺ >5.5、>6.0 mmol/L;covariate 含 eGFR 30–60。**結局事件本身無專屬 ICD 代碼**(複合/敘述定義);無 CPT/RxNorm/SNOMED/LOINC。

## B. SGLT2i / GLP-1 受體促效劑

### 4. GLP-1 RA in T2D + advanced CKD：腎臟與 CV 結局
*Clin Kidney J 2025 — DOI [10.1093/ckj/sfaf172](https://doi.org/10.1093/ckj/sfaf172) — PMC12160804*
- **資料源**：TriNetX **US Collaborative Network**(69 HCOs;2024-12 擷取)。New-user 設計。
- **入組**：≥18 歲 T2DM + **eGFR ≤ 45 mL/min/1.73 m²**(2018-01-01 至 2022-12-31);GLP-1 RA users vs nonusers;排除 index 前 12 個月任何惡性腫瘤、移植、透析、CABG。
- **主要/評估結局**：進入**透析(dialysis)**、**all-cause mortality**、**MACE**。
  - **MACE** = MI、stroke、heart failure、arrhythmia、cardiac arrest 複合。
  - **Dialysis initiation** = 首次開始任何型式透析(不分急/慢性)。
- **次要結局**:多項個別 CV 事件(缺血性視神經病變、缺血/出血性中風、AMI、cardiogenic shock、TIA、AF/flutter、HF、cardiac arrest、PE、DVT)。
- **追蹤時間窗**：自 index 後 30 天起追蹤 **4 年**(評估窗 3 個月–4 年);中位 ~2.6/2.4 年。ITT;1:1 greedy PSM。敏感度:index 窗 3→6 個月;追蹤分段 3 個月–1/2/3 年。
- **代碼/閾值(逐字)**：唯一數值門檻為入組 **eGFR ≤ 45**;**無任何 ICD/CPT/RxNorm/SNOMED/LOINC 代碼**(全敘述)。

### 5. CV 與腎臟結局：GLP-1 RA in obesity（target trial emulation）
*Diabetes Obes Metab 2025 — DOI [10.1111/dom.70054](https://doi.org/10.1111/dom.70054) — PMC12515787*
- **資料源**：TriNetX(未明指子網路)。2021-07 至 2025-05。藥物以 ATC/RxNorm 辨識(代碼於 Table S2)。
- **主要結局**：
  - **MACE** = acute coronary syndrome + heart failure + stroke 複合。
  - **MAKE** = **ESKD + dialysis + eGFR < 15 mL/min/1.73 m²** 複合。
  - **All-cause mortality**。
- **次要結局**:ACS;HF;stroke;**AKI**;心理健康(自殺意念/企圖、憂鬱、物質使用障礙);安全性(急性胰臟炎、低血糖、GI 症狀)。Negative controls:狗咬傷、指甲疾患、正常聽力測試、皮脂腺囊腫。
- **關鍵定義**:**Obesity(入組)** = BMI≥30 或 ICD-10-CM **E66.01, Z68.3, Z68.4**(1 年基線內理學檢查);**排除糖尿病** = 糖尿病診斷、任何降糖藥、或 **HbA1c ≥ 6.5%**;Exposure = liraglutide/semaglutide/tirzepatide(new users);comparator AOM = orlistat、naltrexone/bupropion、phentermine/topiramate、lorcaserin;排除既有 ESKD/透析。
- **追蹤時間窗**：index = 首次處方;基線 1 年;**追蹤自 index 後 90 天起**至事件/死亡/末次就診/研究結束;敏感度限 1 年。
- **代碼/閾值(逐字)**:ICD-10-CM **E66.01, Z68.3, Z68.4**;HbA1c≥6.5%;**eGFR<15**(MAKE 組成)。其餘結局/疾病/藥物代碼於 **Supporting Table S2**(正文未列)。

### 6. Semaglutide 對 T2D + CKD 存活之成效
*Open Heart 2025 — DOI [10.1136/openhrt-2025-003382](https://doi.org/10.1136/openhrt-2025-003382) — PMC12243591*
- **資料源**：TriNetX 全球研究網路(>2.5 億人,>130 HCOs)。診斷 ICD-10、處置 CPT。建構於 2025-04-01。
- **主要結局**：**3 年 all-cause death 發生率**。
- **次要結局(逐字代碼)**：
  - **Acute heart failure** — ICD-10 **I50.21, I50.23, I50.31, I50.33, I50.41, I50.43, I50.811, I50.813**。
  - **Acute MI** — ICD-10 **I21**。
  - **Stroke**(腦梗塞或非外傷性腦出血)— ICD-10 **I61, I63**。
- **關鍵定義**：**T2D = ICD-10 E11**;**CKD = ICD-10 N18**;Exposure = T2D+CKD 診斷後起始 semaglutide(2018-01-01 至 2020-12-31);Control = sitagliptin(DPP-4i)。
- **追蹤時間窗**：index = 用藥當日(day 0);covariate 取 day 0 前 1 個月至 day 0;**3 年追蹤**(KM)。GFR 次組 cut:<30、30–44.9、45–59.9、≥60。
- **代碼/閾值(逐字)**：HF(I50.x 上列)、AMI(I21)、stroke(I61, I63)、T2D(E11)、CKD(N18)。Covariate 定義於線上補充檔。

### 7. GLP-1 RA 在糖尿病腎移植受者之 CV 與腎臟結局
*Cardiovasc Diabetol 2025 — DOI [10.1186/s12933-025-02649-0](https://doi.org/10.1186/s12933-025-02649-0) — PMC11846168*
- **資料源**：TriNetX **Global Collaborative Network**(127 HCOs,>1.31 億人,21 國)。2006-01-01 至 2023-06-01。診斷 ICD-10-GM、處置 ICD-10-PCS、藥物 ATC/RxNorm、檢驗 LOINC(詳碼於 Supplement)。
- **主要結局**：**All-cause mortality**。
- **次要結局**：
  - **MACE** = stroke(缺血/出血)+ AMI + cardiac arrest + cardiogenic shock + death 複合。
  - **MAKE** = **dialysis dependence + eGFR < 15 + death** 複合。
  - Component(specificity)結局:dialysis dependence、eGFR<15、cardiac arrest/cardiogenic shock。
- **關鍵定義**：Cohort = >18 歲腎移植受者、T2DM 於移植前或移植後 3 個月內診斷;**index = 移植日,ICD-10-CM Z94.0 + 處置碼**;排除移植後 1–3 個月內透析或死亡;Exposure = 移植後 3 個月內使用 GLP-1 RA(排除 tirzepatide);user 子型:ever/new/persistent。Positive control outcomes:噁心、嘔吐、腹瀉;negative:曬傷、椎間盤突出、車禍、肺炎。
- **追蹤時間窗**：**自 index 後 3 個月起追蹤,最長 5 年**;中位 2.5 年;另於 1 年、3 年分析;landmark 2/6/9/12 個月。
- **代碼/閾值(逐字)**：**Z94.0**(移植 index);**eGFR<15**(kidney failure 閾值)。其餘代碼於 Supplement。

### 8. HIF-PHI vs ESA 對非透析 CKD 預後
*Renal Failure 2025 — DOI [10.1080/0886022X.2025.2592442](https://doi.org/10.1080/0886022X.2025.2592442) — PMC12679846*（CC BY 4.0）
- **資料源**：TriNetX **Global Collaborative Network**(141 HCOs;2025-02-03 分析;2020-01-01 至 2024-12-31)。族群近乎全 APAC。
- **主要結局**：**All-cause mortality**。
- **次要結局**：sepsis、CV events/MACE、heart failure、malignancy、認知障礙/失智、**renal replacement therapy**、hyperkalemia、缺血性中風、骨折、視網膜病變(完整清單與 ICD-10-CM 碼於 Supplement 1)。
- **關鍵定義**：**Stage IV CKD = eGFR 15–30(×2)**;Hb ≥ 9 g/dL;≥20 歲。排除曾透析/ESRD(**ICD-10-CM N18.5, N18.6** 或 **CPT 90935–90999**)、雙重用藥、無暴露者。index = stage IV 確認後首次處方。HIF-PHI:daprodustat/vadadustat/roxadustat;ESA:epoetin alfa/darbepoetin alfa/methoxy PEG-epoetin beta。**ESA 子組 RxNorm**:短效 **1816044, 1816005**;長效 **2583538, 729986**。Ferritin 分層 <100/100–299/≥300;Hb 分層 <9/9–11/>11。
- **追蹤時間窗**：自 index 後 1 天起 **3 年(1095 天)**;中位 1.5 年。
- **代碼/閾值(逐字)**：eGFR 15–30(×2)、Hb≥9、**N18.5, N18.6**、**CPT 90935–90999**、RxNorm **1816044, 1816005, 2583538, 729986**。結局 ICD-10-CM 碼於 Supplement 1。

## C. 貧血、礦物質骨病變與透析

### 9. 維生素 D 缺乏與透析病人 calcimimetic 治療結局
*Nutrients 2025 — DOI [10.3390/nu17091536](https://doi.org/10.3390/nu17091536) — PMC12073363*（CC BY 4.0）
- **資料源**：TriNetX **Global Collaborative Network**(52 HCOs;2024-12-08)。ICD-10 查詢。
- **主要結局**：All-cause mortality(校正後唯一仍顯著;index 後 3 年)。
- **次要結局(共 7 項)**：MACE、骨折、**hypocalcemia(Ca ≤ 8.5 mg/dL)**、**PTH 抑制(PTH ≤ 300 pg/mL)**、heart failure(+ 上述死亡與 MACE)。
- **關鍵定義**：維持性透析 cohort = **ICD-10 N18.6**(2010–2024)+ calcimimetic(cinacalcet 或 etelcalcetide);VDD = **25(OH)D < 20 ng/mL**(僅取 **LOINC 35365-6**);VDA = **≥ 30 ng/mL**;排除 <20 歲、原發性副甲亢/副甲狀腺腫瘤。
- **追蹤時間窗**：自首次「透析 + calcimimetic」起 3 年;25(OH)D 量測窗 = calcimimetic 起始前 6 個月至後 5 年。
- **代碼/閾值(逐字)**：**N18.6**、**LOINC 35365-6**、25(OH)D <20/≥30 ng/mL、Ca≤8.5 mg/dL、PTH≤300 pg/mL、hypercalcemia Ca>10.5、albumin<3.5、Hb~10、BMI>25、LDL>100。1:1 PSM(95 變項);Bonferroni–Holm。無 CPT/SNOMED/RxNorm。

## D. 腎臟移植

### 10. 慢性 HCV 感染腎移植病人之肝臟併發症高風險
*Sci Rep 2025 — DOI [10.1038/s41598-025-15169-4](https://doi.org/10.1038/s41598-025-15169-4) — PMC12336315*
- **資料源**：TriNetX **Research Network**(89 HCOs;195,071 移植個案)。ICD-10 編碼;1:1 PSM;10 年觀察;排除 <18 歲。
- **入組**：case = 腎移植(**ICD-10 Z94.0**)+ 移植前 HCV;control = 移植無 HCV。
- **主要結局(7 項,均於 index 後 ≥1 年)**:
  1. **Death**。
  2. **Overall hepatic disease** — liver cell carcinoma(**C22.0**)、ICDO3 C22.0、fibrosis/cirrhosis(**K74**)、hepatic failure NEC(**K72**)。
  3. **Hepatoma** — **C22.0**。
  4. **Cirrhosis** — **K74.60**、hepatic fibrosis **K74.0**。
  5. **Hepatic failure** — **K72**。
  6. **Graft failure** — 透析依賴(**Z99.2**)、creatinine ≥ 6.00 mg/dL(**TNX:9024**)、eGFR(MDRD)≤ 5.00(**TNX:8001**)、eGFR(CKD-EPI)≤ 5.00(**LOINC 62238-1**)。
  7. **Rejection** — **T86.11**。
- **covariate 定義(index 前 10 年內)**:HTN(**I10–I15**)、HF(**I50**)、T2DM(**E11**)、過重/肥胖(**E66**)、腎絲球疾病(**N00–N08**)、HBV(**B19.1**);藥物:glucocorticoids、tacrolimus、MMF、mycophenolic acid、basiliximab。
- **追蹤時間窗**：結局定義為 index(移植日)後 ≥1 年;10 年觀察。
- **代碼/閾值(逐字)**：如上(ICD-10、ICDO3、TNX 專屬檢驗碼、LOINC 62238-1);creatinine≥6.00、eGFR≤5.00。無 CPT/RxNorm。

## E. 風險因子與預測模型

### 11. 全身性發炎與 ESKD、MACE、死亡
*Kidney Int Rep 2026 — DOI [10.1016/j.ekir.2026.106364](https://doi.org/10.1016/j.ekir.2026.106364) — PMC12995490*
- **資料源**：TriNetX **Global Collaborative Network**(~1.51 億人,126 HCOs,17 國)。
- **暴露/index**：首次 **hsCRP**;Cohort A = **hsCRP ≥ 2 mg/l**(定義為 systemic inflammation),Cohort B = **< 2 mg/l**。
- **CKD 定義**：eGFR(MDRD)**15–60**(KDIGO 3–4)或 **UACR > 200 mg/g**(A3);排除合併感染。
- **主要結局(time-to-event;全體 + 糖尿病次組)**：
  - **ESKD** = **chronic dialysis 或 renal transplantation**。
  - **MACE** = 缺血性中風、血栓栓塞、AF、cardiac arrest、MI、HF 住院(亦評估心房/心室心律不整)。
  - **All-cause death**。
- **追蹤時間窗**：index 後 1 天起至 **6 年**;中位 ~501 天(≥2)/~633 天(<2)。1:1 greedy PSM(57 covariate)。
- **代碼/閾值(逐字)**：hsCRP ≥2 vs <2 mg/l;eGFR 15–60;UACR >200 mg/g。**正文無 ICD/CPT/SNOMED/LOINC/RxNorm 代碼**(敘述定義)。

### 12. 醛固酮失調後的高血壓與 CKD 風險
*Am J Hypertens 2026 — DOI [10.1093/ajh/hpaf183](https://doi.org/10.1093/ajh/hpaf183) — PMC12802914*
- **資料源**：TriNetX **Dataworks USA Network**(~1.05 億人)。
- **index**：首次合格 **plasma aldosterone**(2013-01-01 至 2023-01-01);需 index 後 12 個月內有 SBP、index 前 12 個月內 **低 renin(≤ 1 ng/mL/h)**;aldosterone <0 或 >40 ng/dL 視為錯誤剔除。
- **暴露(aldosterone dysregulation)**：低 renin 下 plasma aldosterone **≥ 5** 或 **≥ 10 ng/dL**(敏感度 **≥ 15**);comparator = < 5 ng/dL。
- **主要結局**：**Uncontrolled HTN = SBP ≥ 130 mmHg**(LOINC 取得),依 aldosterone 分層。
- **次要結局**：
  - **Stage 2 HTN = SBP ≥ 140 mmHg**(SBP 分類:normal<120、elevated 120–<130、stage1 130–<140、stage2 ≥140)。
  - **CKD = eGFR < 60 mL/min/1.73 m²**(LOINC 血清 creatinine 計算)**或** CKD/腎衰竭 ICD-9/10-CM 診斷碼 **或** 腎臟透析處置碼。
- **探索性**：上述依 race、age 分層。
- **追蹤時間窗**：**HTN 結局 = index 後 12 個月;CKD 結局 = index 後任何時間**。
- **代碼/閾值(逐字)**：aldosterone ≥5/≥10/≥15 ng/dL(有效 0–40)、renin ≤1 ng/mL/h、SBP ≥130/≥140、eGFR<60;coding 系統(LOINC 檢驗、ICD-9/10-CM 共病/CKD、處置碼透析)有名但**未列具體碼**。

### 13. CKD 病人維生素 D 缺乏與 MAKE
*Front Nutr 2025 — DOI [10.3389/fnut.2025.1650514](https://doi.org/10.3389/fnut.2025.1650514) — PMC12537428*
- **資料源**：TriNetX **Global Collaborative Network**(>1.6 億人,140 HCOs)。1:1 PSM(每組 n=29,654)。
- **主要結局**：**MAKE** = ESKD + urgent dialysis initiation + dialysis dependence(敘述:腎功能持續惡化、起始 RRT[透析或移植]、或腎相關死亡);**無 component 代碼**。
- **次要結局**：all-cause mortality;all-cause hospitalization(無代碼)。
- **關鍵定義**：**CKD = ICD-10-CM N18**(全文唯一診斷碼);VDD(暴露)= 維生素 D **< 20 ng/mL**;control = **> 30 ng/mL**;排除 insufficiency 21–29 ng/mL。**index = 維生素 D 檢測日**(須於 CKD 診斷前 3 個月內量測);≥18 歲、≥2 筆 EMR。
- **追蹤時間窗**：index 次日起至末次就診/死亡/**1 年**;排除 index 前已發生主要結局者。研究期 2010-01-01 至 2025-01-31。
- **代碼/閾值(逐字)**：CKD = **N18**;VDD<20、control>30、排除 21–29 ng/mL。MAKE/ESKD/透析/死亡/住院**無代碼**。

### 14. 睪固酮治療與 AKI、需 RRT 腎衰竭、CV 事件
*Cardiovasc Diabetol 2025 — DOI [10.1186/s12933-025-02930-2](https://doi.org/10.1186/s12933-025-02930-2) — PMC12487499*
- **資料源**：TriNetX **Research Collaborative Network**(~1.5 億人,143 HCOs)。1:1 PSM(每組 n=26,027)。
- **主要結局(腎臟)**：
  - **AKI** = ICD-10 **N17.9**。
  - **Kidney failure with replacement therapy**(透析或移植)= **N18.6;Z99.2;Z94.0;CPT 1012740;ICD-10-PCS 0TY1, 0TY00Z1, 0TY10Z1, 0TY00Z0, 0TY10Z0**。
- **次要結局**：ischemic stroke、AMI、all-cause death(+ 結果表 AF);無專屬代碼;死亡取自 HCO EHR。
- **關鍵定義**：糖尿病 = **E11.8, E13.9, E08.9, E14, E11.9**;hypogonadism = **E29.1, E23.0, G11.5, Q53, Q98.0, Q98.1, Q98.4**(糖尿病診斷須早於 hypogonadism);睪固酮暴露 = **RxNorm 10379**;index = 首次睪固酮(治療組)/ 首次 hypogonadism 診斷(對照組);基線 = index 前 3 年。
- **追蹤時間窗**：index 起 **最長 5 年**;達成 3.3±1.8 年(中位 3.9)。研究期 2005-01-01 至 2024-12-31。
- **代碼/閾值(逐字)**：上列 ICD-10 / CPT / ICD-10-PCS / RxNorm 全數提供;結局以代碼定義,無 eGFR/creatinine 閾值。

### 15. 機器學習預測後 COVID-19 時代的 AKI 與 CKD
*EBioMedicine 2025 — DOI [10.1016/j.ebiom.2025.105726](https://doi.org/10.1016/j.ebiom.2025.105726) — PMC12056805*
- **資料源**：TriNetX **Research Network**(全美 ~2.5 億人,120 HCOs)。70/30 train/test;TRIPOD+AI。
- **預測標的(outcome labels,二元)**：
  - **AKI** = ICD-10-CM **N17**。
  - **CKD** = ICD-10-CM **N18**。
  - (不以 eGFR/creatinine 閾值定義 label;creatinine 為必要 predictor;無 ESKD/透析結局。)
- **預測時間窗(訓練 label)**：自 index 起 **1 個月** 與 **1 年** 兩個窗;正例 = 該窗內出現 N17(AKI)/N18(CKD)。
- **關鍵定義**：**index = 研究起始日(2022-07-01)後首次住院或門診就診**;「後 COVID 時代」以世代時間界定(非個人 COVID 陽性 index);招募 2022-07-01,追蹤至 2024-03-31;排除缺人口學、非美國、僅 2022-07-01 前就診、**index 前已有腎病史**、缺 creatinine(最終 n=104,565)。基線 covariate 窗 = index 前 1 年(29 共病 ICD-10-CM;13 藥物類 RxNorm;COVID 相關;住院/ICU 次數);檢驗/生命徵象 LOINC(index 前 13 個月);Winsorize 1%/99%。
- **追蹤時間窗**：世代 2022-07-01 至 2024-03-31;預測於 index 後 1 個月與 1 年。整體資料期 2020-01-01 至 2024-03-31。
- **代碼/閾值(逐字)**：AKI = **N17**;CKD = **N18**;covariate 經 ICD-10-CM / RxNorm / LOINC(完整清單於 Supplement)。

---

## 引用聲明

本文件之全文內容與書目資料取自 **PubMed / PubMed Central (PMC)**。引用個別研究時請一併標註其 DOI 及原始出處。各論文之代碼集若標示「Supplement only」,請回原文補充資料核對完整清單後再用於實作。
