# UNPICK v4.3 teaching — editorial and QA report

Branch: `improvement/unpick-teaching`. Target: `main`. **Not merged or deployed.**

## Scope and limits

The original 1,164 clue records across 12 devices were inspected with full-corpus
mechanical validation. Enumeration, anagram letter multisets, hidden-letter presence,
reversal construction, initial-letter runs and alternate-letter selection passed
the automated checks. These are **necessary, not sufficient** conditions for a
fair cryptic clue. They do not verify sense, grammar, idiom, indicator fairness,
homophone accent, double-definition equivalence, or every complex charade/container
parse. No honest automated test can certify all 1,164 explanations editorially.

The following 16 clue records have been **quarantined from Practice and Minis**.
Their index numbers have not changed, preserving the published daily permutation
and existing saved progress. If a flagged record is due to appear in Daily,
the app labels it as disputed and withholds its explanatory parsing. Nothing has
been silently rewritten or substituted into a live daily clue.

| Index (zero-based) | Clue fragment | Editorial concern |
|---:|---|---|
| 139 | Prints run off at a sprint | Definition already prints the exact solution; weak wordplay test |
| 141 | Recipes revised for accuracy | 'Accuracy' (noun) cannot directly define PRECISE (adjective) |
| 170 | Pools drained through the loops | Definition names LOOPS outright |
| 173 | Warned about the new subscriber | 'New subscriber' does not define ANDREW |
| 174 | Phantom disturbed at Hampton | 'At Hampton' is not a fair definition; name embedded |
| 175 | Neural connections rebuilt for Lauren | Definition explicitly names LAUREN |
| 181 | Layer removed in the relay | Definition includes RELAY outright |
| 225 | Panels dismantled at Naples | Definition names NAPLES outright |
| 226 | Enemy restructured, is in Yemen | Definition contains YEMEN outright |
| 227 | Analog conversion in Angola | Definition names ANGOLA outright |
| 233 | Suites converted for the tissue | Definition contains TISSUE outright |
| 251 | Loans arranged in the hair salon | Definition includes SALON outright |
| 274 | Testing changes to the setting | Definition contains SETTING outright |
| 292 | Drove around Dover | Definition names DOVER outright |
| 405 | First of slate, laid, atop, tile, edge | SLATE is explicitly printed as source word, weakening the initial-letter exercise |
| 620 | Duck below the connection | LINK is not fairly defined by 'duck below'; accompanying golf-hole explanation is inaccurate |

**Editorial decision:** flag for rewriting and human setter review; do not invent
defences of questionable clues or assert their existing explanation is sound.

## Teaching corrections made

- Progressive stages: clue type, likely definition, then indicator/wordplay.
  The three curated lesson indicators were checked individually.
- Removed answer-initial and answer-final letter leaks from generic hints.
- Kept full answers behind a specifically named action and confirmation.
- Changed worked examples in the Guide to closed-by-default disclosures.
- Removed misleading generic failure instruction ('try hint two') and instead
  supplied feedback tied to missing letters, definitions and indicators.
- Added three curated lessons: ANAGRAM (index 0), HIDDEN WORD (295), CHARADE (442).
- Added evidence-based proficiency by device: unaided, first-attempt solves and
  a streak of three independent solves, instead of arbitrary points.
- Preserved `unpick.v1`; added optional nested session, lesson and mastery
  fields. Daily save resumes only for the same local date.
- Mini reveal cannot count as a solved clue; once awarded, a mini clue cannot
  be counted a second time by changing and re-entering its answer.

## Three-clue novice acceptance journey

1. **Anagram** — 'Silent, out of order — pay attention (6)': identify the
   anagram, locate 'pay attention' and the phrase 'out of order'. Answer is
   revealed only after the learner submits it or deliberately requests it.
2. **Hidden word** — 'Rock concealed by the best ones (5)': spot the definition
   'Rock', find 'concealed by', then read through 'beST ONEs' to obtain the answer.
3. **Charade** — 'Vehicle with an animal covers the floor (6)': recognise
   the charade, identify 'covers the floor' as the definition and use the two
   smaller components joined by 'with'.

The automated journey types the answer for each stage without requiring a reveal,
then verifies completion, independent mastery and persistent progress. This is a
functional simulation, not a human usability study.

## QA and outstanding review

Run `node --test tests/teaching.test.mjs` from the repository root (Node 20+).
The GitHub Action `UNPICK teaching QA` runs that same suite on branch pushes
and pull requests, without deploying anything.

**Still requires:** hands-on mobile portrait checks, real screen-reader reading,
physical keyboard/browser console checks, a human semantic review of the remaining
corpus and comparison of approved clue changes with the Android app. The automated
suite cannot establish those facts. No merge/deploy should be approved until the
editorial decisions and device acceptance are complete.
