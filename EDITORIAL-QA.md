# UNPICK v4.4 — editorial closure and regression QA

Release branch: `improvement/unpick-teaching`. Production target: GitHub Pages from `main`.

## Editorial decision: 16 clues permanently retired

The former set contained **1,164** clues. All 16 rejected records below have been **physically removed** from the `CLUES` data in `index.html`. The app now contains **1,148** clues across **12** wordplay devices. No unusable or disputed clue remains in the teaching, daily, practice or mini pools under its original record.

| Original zero-based ID | Retired answer | Editorial reason |
|---:|---|---|
| 139 | SPRINT | Answer printed verbatim in definition |
| 141 | PRECISE | Noun/adjective definition mismatch |
| 170 | LOOPS | Answer printed verbatim |
| 173 | ANDREW | 'New subscriber' does not directly define a given name |
| 174 | HAMPTON | Place name supplied directly; definition unfair |
| 175 | LAUREN | Name printed outright |
| 181 | RELAY | Answer printed outright |
| 225 | NAPLES | Place name printed outright |
| 226 | YEMEN | Place name printed outright |
| 227 | ANGOLA | Place name printed outright |
| 233 | TISSUE | Answer printed outright |
| 251 | SALON | Answer printed outright |
| 274 | SETTING | Answer printed outright |
| 292 | DOVER | Place name printed outright |
| 405 | SLATE | Whole source word openly repeated as the definition |
| 620 | LINK | Definitional mismatch and questionable golf explanation |

This table records why content was rejected; it is **not an active clue catalogue**. The retired answers may still legitimately occur in other independently sound clues. The invariant is the deletion of these 16 *records*, not the prohibition of every such word.

## Save migration and daily schedule

- The save key remains `unpick.v1`. On first open, `corpusVersion` advances to `2` and the existing seen-clue bitset, saved daily/practice/lesson clue IDs, and learner-history IDs are remapped from the original positions. The migration is idempotent and preserves all historic scores, streaks, solved counts, device mastery and completed mini counts.
- A saved in-progress clue deleted with this release cannot be resumed and is discarded; the user receives a valid clue instead.
- A saved **in-progress mini grid** is reset once, because the crossing puzzle was selected from the old pool. Past mini achievements remain.
- The original deterministic 1,164-position daily permutation is retained. Dates on which the old daily entry survived receive the same clue. The 16 dates originally assigned a rejected clue receive a distant valid substitute. Those rare substitutions necessarily introduce repeats within the 1,164-day schedule; there is no misleading guarantee of absolute non-repetition.

## Learning experience

The new **Learn** tab contains three verified examples in increasing complexity:

1. Anagram — 'Silent, out of order — pay attention (6)' (LISTEN).
2. Hidden word — 'Rock concealed by the best ones (5)' (STONE).
3. Charade — 'Vehicle with an animal covers the floor (6)' (CARPET).

Hints progress from device to definition to indicator. No default hint yields the complete answer or gratuitous answer letters. The full answer requires explicit action and confirmation. Worked examples in Guide stay collapsed unless requested. Practice can target any of the 12 clue types and difficulty bands, and a clean solving sequence is recorded as a mastery measure instead of arbitrary experience points. Mistakes receive process-based feedback and repeated rejected answers invite editorial reports.

## Automated validation

Workflow: `.github/workflows/unpick-teaching-qa.yml`. Command:
`node --test tests/teaching.test.mjs` (Node 20+).

The suite includes 15 tests for all 1,148 remaining clue records: enumeration and elementary wordplay construction, removal of the 16 rejected records, the independent three-clue novice journey without involuntary answer reveal, wrong attempts, consent before spoilers, save/reload, deterministic daily continuity and daily replay protection, mini resume and score safety, accessible markup, offline operation, clue reports, practice-type filtering, and migration of historic state.

Mechanical checks are **not** a complete semantic editorial certification of the remaining 1,148 clues, particularly homophones, double definitions and multi-step cryptic wordplay. Full manual editorial review, real mobile/browser/screen-reader usability checks, and parity with the separate published Android app are still unverified. This web repository does not contain Android release source code; the Android corpus needs a corresponding release separately.

## Deployment and consolidation

Approved release path: merge PR #1 into `main`. GitHub Pages serves `main`; confirm Pages publication and the live page after merging. Retain this report as the permanent record of the editorial removals and state migration.
