# 補充資料待補清單（Supplement Code Lists — Outstanding）

項目 2(從 supplement 取出完整代碼集)在本環境**部分受限**:此沙箱的網路允許清單封鎖所有出版商主機,PMC MCP 工具僅回傳「正文」內容、不含補充檔;WebFetch 與 curl 對所有主機(PMC、Nature/Springer、OUP、BMC、Taylor & Francis、EuropePMC,甚至 NCBI 與 Wikipedia 根網域)一律回 **HTTP 403**。

因此**正文內逐字列出的代碼皆已擷取**(進 `codelists.json` / `codelists.csv`),但下列論文將其完整 ICD/CPT/RxNorm/ATC/LOINC 清單置於補充檔,需**手動下載**或**將主機加入網路允許清單**後再補。

| Paper | DOI | 待補的代碼集 | 補充檔位置 |
|-------|-----|--------------|------------|
| P1 Finerenone vs spironolactone (Nat Commun) | 10.1038/s41467-025-64640-3 | MACE、MAKE、hyperkalemia、CKD、eligibility 全代碼 | Supplementary Information `41467_2025_64640_MOESM1_ESM.*`（static-content.springer.com） |
| P2 Finerenone/SGLT2i combined vs mono (NDT) | 10.1093/ndt/gfaf064 | MAKE、MACE、ESRD、CKD cohort、hyperkalemia 全代碼 | `gfaf064_Supplemental_File`（academic.oup.com / oup.silverchair-cdn.com） |
| P5 GLP-1 RA obesity (Diabetes Obes Metab) | 10.1111/dom.70054 | 所有 outcome 代碼 + 藥物 ATC/RxNorm | Supporting Information **Table S2**（Wiley） |
| P7 GLP-1 RA kidney transplant (Cardiovasc Diabetol) | 10.1186/s12933-025-02649-0 | MACE、MAKE、藥物代碼、transplant 處置碼 | Supplementary Material 1（BMC/Springer） |
| P8 HIF-PHI vs ESA (Renal Failure) | 10.1080/0886022X.2025.2592442 | 完整次要結局 ICD-10-CM 清單(sepsis/MACE/HF/malignancy/dementia/RRT/hyperkalemia/stroke/fracture/retinopathy) | `Supplement_1_HIF_20251116.docx`（Taylor & Francis） |

> 註:P3、P6、P10、P14 的關鍵代碼**正文已完整列出**,無待補。

## 如何補齊
1. **手動下載**上述補充檔(瀏覽器開 DOI → Supplementary),交給我解析後併入 `codelists.json`/`codelists.csv`;或
2. 若可調整環境網路政策,將 `static-content.springer.com`、`academic.oup.com`、`onlinelibrary.wiley.com`、`tandfonline.com` 等加入允許清單,我即可自動擷取;或
3. 以 TriNetX 平台內建的標準 codeset(platform-curated)為準,直接在 Query Builder 對照本專案 `outcome_spec.md` 的概念建立。
