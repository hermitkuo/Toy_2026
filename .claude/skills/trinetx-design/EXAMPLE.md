# trinetx-design — Worked Example

Demonstrates the expected output of the skill for one question. Used to validate the workflow end-to-end.

**Question:** *"In adults with type 2 diabetes and CKD, does an SGLT2 inhibitor vs a GLP-1 receptor agonist reduce major adverse kidney events?"*

## 1. PICOT
- **P**: adults ≥18 with T2DM + CKD (eGFR<60 confirmed) — Global Collaborative Network.
- **I**: SGLT2 inhibitor (new user).
- **C**: GLP-1 receptor agonist (active comparator, new user).
- **O**: primary = MAKE-D; secondary = ESKD, AKI, all-cause death, hyperkalemia.
- **T**: 3-year follow-up.

## 2. Design spec
- Design: new-user active-comparator cohort `[D2 — P2/P3/P8]`
- Network: Global Collaborative `[D1 — P1/P8/P11]`
- Index: first prescription of SGLT2i or GLP-1 RA `[D3 — P2]`
- Washout: 6 months no opposite-class exposure `[D4 — P1/P2/P3]`
- Landmark: follow-up starts index + 90 days `[D5 — P5]`
- Max follow-up: 3 years `[D6 — P8]`
- Matching: 1:1 greedy NN PSM, caliper 0.1 pooled-SD-logit `[D7 — P2/P11]`
- Bias control: negative control outcome = sebaceous cyst; positive control = hyperkalemia (vs SGLT2i) `[D8 — P2/P5]`
- Sensitivity: landmark 30d & 6m; exclude switchers `[D8 — P1]`

## 3. Cohort / exposure / outcome definitions (codes from codelists.json)
- T2DM: `ICD-10-CM E11` · CKD: `ICD-10-CM N18` + eGFR<60 (≥2×, ≥90 d apart, CKD-EPI)
- Exclude: ESRD/dialysis pre-index (`N18.5, N18.6, Z99.2, CPT 90935–90999`), prior transplant (`Z94.0`), baseline K⁺ ≥5.5
- Exposure/comparator drug codes: ATC/RxNorm — ⚠ needs supplement (SGLT2i/GLP-1 RA lists are `supplement_not_retrieved`; use TriNetX platform drug class)
- MAKE-D (per outcome_spec §2) = ESKD (`Z99.2`/`N18.6`/`Z94.0`/`0TY1*`/`CPT 90935–90999` **or** eGFR<15) **or** all-cause death
- AKI: `ICD-10-CM N17` · Hyperkalemia: K⁺ >5.5 / >6.0 mmol/L

## 4. Analysis field schema

| field_name | type | definition / source | code_or_threshold |
|---|---|---|---|
| patient_id | id | TriNetX patient key | — |
| index_date | date | first SGLT2i/GLP-1 RA Rx | — |
| follow_up_start | date | index + 90d | landmark |
| follow_up_end | date | min(event, death, +3y, censor) | — |
| exposure_group | categorical | SGLT2i vs GLP-1 RA | ATC/RxNorm (⚠ supplement) |
| washout_pass | bool | no opposite class in prior 6m | — |
| egfr_baseline | float | CKD-EPI nearest pre-index | — |
| egfr_min_fu | float | min eGFR in follow-up | <15 = kidney failure |
| ckd_incident | bool | 2× eGFR<60 ≥90d apart | N18 |
| potassium_max | float | max K⁺ in follow-up | >5.5 / >6.0 |
| make_d_flag / make_d_date | bool/date | ESKD∪eGFR<15∪death | see §3 |
| eskd_flag / eskd_date | bool/date | dialysis∪transplant∪eGFR<15 | Z99.2/N18.6/Z94.0/0TY1* |
| aki_flag / aki_date | bool/date | acute kidney injury | N17 |
| death_flag / death_date | bool/date | EHR mortality | — |
| hyperkalemia_flag | bool | K⁺ >5.5 | — |
| ps_score / matched_pair_id / smd_flag | float/id/bool | PSM diagnostics | caliper 0.1 |
| neg_control_outcome | bool | sebaceous cyst | — |
| cm_t2dm / cm_hf / cm_htn / cm_obesity | bool | baseline comorbidities | E11 / I50 / I10-I15 / E66 |

```json
{"fields":[
 {"name":"patient_id","type":"id"},
 {"name":"index_date","type":"date"},
 {"name":"follow_up_start","type":"date","rule":"index+90d"},
 {"name":"follow_up_end","type":"date"},
 {"name":"exposure_group","type":"categorical","values":["SGLT2i","GLP1RA"],"codes":"ATC/RxNorm(supplement)"},
 {"name":"washout_pass","type":"bool"},
 {"name":"egfr_baseline","type":"float","equation":"CKD-EPI"},
 {"name":"egfr_min_fu","type":"float","threshold":"<15"},
 {"name":"ckd_incident","type":"bool","code":"N18","rule":"2x eGFR<60 >=90d"},
 {"name":"potassium_max","type":"float","threshold":">5.5;>6.0"},
 {"name":"make_d","type":"event","def":"ESKD|eGFR<15|death"},
 {"name":"eskd","type":"event","codes":["Z99.2","N18.6","Z94.0","0TY1*","CPT90935-90999"]},
 {"name":"aki","type":"event","code":"N17"},
 {"name":"death","type":"event"},
 {"name":"hyperkalemia","type":"event","threshold":">5.5"},
 {"name":"ps_score","type":"float"},
 {"name":"matched_pair_id","type":"id"},
 {"name":"neg_control_outcome","type":"bool","def":"sebaceous cyst"},
 {"name":"cm_t2dm","type":"bool","code":"E11"},
 {"name":"cm_hf","type":"bool","code":"I50"},
 {"name":"cm_htn","type":"bool","code":"I10-I15"},
 {"name":"cm_obesity","type":"bool","code":"E66"}
]}
```

## 5. RWD validation checklist
- [ ] Cohort row counts reported pre/post-match; 1:1 achieved.
- [ ] % missing for egfr_baseline, potassium_max, creatinine within tolerance.
- [ ] All SMD < 0.1 after matching.
- [ ] follow_up_start ≥ index_date for every row; no outcome date < follow_up_start.
- [ ] Negative-control outcome (sebaceous cyst) HR ≈ 1.0.

## 6. Caveats
- SGLT2i / GLP-1 RA drug code lists are `supplement_not_retrieved` → use TriNetX platform-curated drug classes.
- MAKE-D and CKD-EPI defaults applied per `outcome_spec.md` `[normative]`.
