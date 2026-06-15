---
name: trinetx-design
description: Generate a TriNetX real-world-data (RWD) study design and the analysis field/column schema needed for data validation, from a clinical research question. Use when the user wants to design a TriNetX nephrology (or general RWD) cohort study, scaffold a propensity-matched / target-trial-emulation analysis, map outcomes & cohorts to ICD-10/CPT/RxNorm/LOINC codes, or produce the field set for RWD validation. Triggers: "TriNetX design", "design a RWD study", "generate analysis fields", "build a cohort spec", "outcome/cohort codelist for...".
---

# TriNetX Design Skill

Turn a clinical research question into (1) a complete TriNetX study-design spec and (2) the machine-readable **analysis field schema** used for RWD data validation. Grounded in a curated library of 15 TriNetX nephrology papers.

## Knowledge base (read these first)

All under `MLoutcome/Ref_TriNetx/` (relative to repo root). Resolve the path even if invoked from elsewhere.

- `design_methods.md` — design pattern library: the **standard 8-step recipe**, a **design-dimension menu (D1–D9)**, and a 15-paper design matrix. Use it to pick design options.
- `outcome_spec.md` — the project's **canonical outcome definitions** (MAKE/MAKE-D, ESKD, AKI, CKD staging, hyperkalemia), general conventions (§0), and the **minimal field set (§6)**.
- `codelists.json` / `codelists.csv` — **single source of truth for codes** (concept → ICD-10-CM / ICD-10-PCS / CPT / RxNorm / LOINC / TNX). Always pull codes from here; never invent codes.
- `SUPPLEMENTS_TODO.md` — which code lists are still in unreachable publisher supplements. If a needed concept is `supplement_not_retrieved`, flag it.
- `outcome_definitions.md` / `README.md` — per-paper detail and citations for justification.

## Workflow

When invoked, do the following in order.

### 1. Parse the research question into PICOT
Extract: **Population** (disease, age, CKD stage, network preference), **Intervention/Exposure**, **Comparator** (prefer an active comparator), **Outcome(s)**, **Time** (follow-up horizon). If any of P/I/C/O is missing or ambiguous, ask the user 1–3 focused questions before proceeding — do not guess the exposure or primary outcome.

### 2. Select the design (from `design_methods.md`)
Choose and state, with the matching dimension code:
- Design type (D2): target trial emulation / new-user active-comparator / exposure-defined / prediction.
- Network (D1), Index date (D3), Washout (D4), Landmark follow-up start (D5), Max follow-up (D6), Matching/adjustment (D7), Bias controls (D8: at least one negative control outcome; positive/exposure controls when drug-comparative), Subgroups (D9).
- Default to the standard recipe unless the question demands otherwise; justify any deviation in one line.

### 3. Define cohort, exposure, outcomes with codes (from `codelists.json` + `outcome_spec.md`)
- Map each inclusion/exclusion criterion, exposure, comparator, and outcome to concrete codes pulled from `codelists.json`. Quote the code system and value.
- Use `outcome_spec.md` canonical definitions for ESKD/AKI/MAKE/CKD/hyperkalemia and the relevant eGFR/lab thresholds.
- If a needed code is only in a supplement (`supplement_not_retrieved`), include the concept but mark it `⚠ needs supplement (see SUPPLEMENTS_TODO.md)` rather than fabricating.

### 4. Emit the analysis field schema (the primary deliverable)
Produce the column/field set for RWD validation by extending `outcome_spec.md` §6, tailored to this study. For **each field** give: `field_name`, `type` (id/date/bool/float/categorical/code), `definition/source`, and `code_or_threshold`. Always include the field groups: identifiers/time, exposure, each outcome (flag + date), renal labs, CKD staging, matching/bias-control, baseline comorbidities. Output as a Markdown table AND a JSON block so it can drive a pipeline.

### 5. RWD validation checklist
Close with a short checklist to validate the extracted RWD table: row counts per cohort, % missing for each required lab (eGFR, creatinine, potassium), SMD balance after matching (<0.1), index/landmark date ordering (follow_up_start ≥ index_date), no outcome before follow_up_start, negative-control outcome HR ≈ 1.0 sanity check.

## Output format

1. **PICOT summary** (one block).
2. **Design spec** — bulleted, each line tagged with its D-code and paper precedent (e.g. `[D5: landmark index+90d — P5]`).
3. **Cohort / exposure / outcome definitions** — with codes from `codelists.json`.
4. **Analysis field schema** — Markdown table + JSON.
5. **Validation checklist**.
6. **Citations / caveats** — note any `supplement_not_retrieved` gaps and which canonical `[normative]` choices were applied.

## Rules

- Codes come ONLY from `codelists.json`/`codelists.csv`. If absent, say so — never invent ICD/CPT/RxNorm/LOINC values.
- Outcome definitions follow `outcome_spec.md`; if the user wants a different MAKE composition or eGFR threshold, honor it but flag the deviation from the project standard.
- Prefer active-comparator new-user designs and a landmark follow-up start to control immortal-time / protopathic bias; always include ≥1 negative control outcome.
- Keep eGFR equation explicit (CKD-EPI default per spec) since thresholds depend on it.
- This knowledge base is nephrology-derived; for non-renal questions, reuse the design recipe but tell the user the codelists need extension.
