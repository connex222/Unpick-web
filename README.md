# Unpick

**Unpick** is an offline cryptic-crossword trainer. Every clue comes apart when you solve it.

Web release **v4.4**: **1,148 clues** across **12 wordplay types**, plus Daily, Practice, two-clue Minis, a short **three-step Learn** course and skill-based progress tracking. Full answers and worked examples stay hidden until requested.

**Open the web app:** https://connex222.github.io/Unpick-web/

On a phone, open it in Chrome, Edge or Safari, then use **Add to Home Screen** if preferred. Alternatively, download `index.html` and open it locally — the app has no runtime network or third-party dependencies. It includes light/dark themes and the fonts are embedded.

## Progress and upgrades

Progress remains on your device under the existing `unpick.v1` local storage key. Version 4.4 automatically migrates progress from the older 1,164-clue catalogue after 16 unfair or unclear records were removed. Scores, completed lessons and solved-history entries survive; an in-progress mini crossing grid may need restarting once.

More about the content decision and QA: [EDITORIAL-QA.md](EDITORIAL-QA.md). Automated tests: `node --test tests/teaching.test.mjs`.

Unpick is also published as a separate Android app. This GitHub repository is the **web** application; Android releases need their own corpus update. Privacy policy for the published listing: [privacy.html](privacy.html).

Made by Shaun Ellison ([portfolio](https://connex222.github.io)).
