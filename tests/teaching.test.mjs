import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, 'self-contained application script exists');
const source = match[1];
const engine = source.slice(0, source.indexOf("document.addEventListener('keydown'"));

function makeHarness() {
  let approved = false;
  const data = new Map();
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
  const element = () => ({
    innerHTML: '', value: '', classList: { add(){}, remove(){} },
    querySelectorAll(){return []}, querySelector(){return null},
    setAttribute(){}, addEventListener(){},
  });
  const found = new Map();
  const document = {
    querySelector: selector => {
      if (!found.has(selector)) found.set(selector, element());
      return found.get(selector);
    },
    createElement: element,
    body: { appendChild(){} },
  };
  const context = vm.createContext({
    window: { localStorage: storage, matchMedia: () => ({ matches:true }) },
    document, navigator:{}, localStorage: storage,
    confirm: () => approved,
    setTimeout: callback => callback(), clearTimeout(){},
  });
  vm.runInContext(engine + '\n;globalThis.TEST_API={CLUES,DEV,LEARN_STEPS,EDITORIAL_REVIEW,Mini,Solver,Store,practicePool,dailyIndex,today,getState:()=>S};', context);
  return {
    api: context.TEST_API, element, data,
    approve(value = true) { approved = value; },
  };
}
const stripped = text => text.toUpperCase().replace(/[^A-Z]/g, '');
const sorted = text => [...stripped(text)].sort().join('');

test('all 1,164 clue records have consistent enumeration and valid elementary mechanics', () => {
  const {api} = makeHarness();
  assert.equal(api.CLUES.length, 1164);
  for (const [index, c] of api.CLUES.entries()) {
    const [clue, answer, type, definition, fodder] = c;
    const enumeration = clue.match(/\(([\d, -]+)\)\s*$/);
    assert.ok(enumeration, 'enumeration missing on #' + index);
    const count = (enumeration[1].match(/\d+/g) ?? []).reduce((sum, n) => sum + Number(n), 0);
    assert.equal(count, stripped(answer).length, 'enumeration mismatch on #' + index);
    assert.ok(api.DEV[type], 'unknown clue type #' + index);
    assert.ok(typeof definition === 'string' && typeof fodder === 'string');
    if (type === 'ana') assert.equal(sorted(fodder), sorted(answer), 'anagram mismatch #' + index);
    if (type === 'hid') assert.ok(stripped(fodder).includes(stripped(answer)), 'hidden word mismatch #' + index);
    if (type === 'rev') assert.equal([...stripped(fodder)].reverse().join(''), stripped(answer));
    if (type === 'ini') assert.equal(fodder.split(/\s+/).map(w => stripped(w)[0] ?? '').join(''), stripped(answer));
    if (type === 'alt') {
      const chars = [...stripped(fodder)];
      assert.ok([0,1].some(offset => chars.filter((_,k)=>k%2===offset).join('')===stripped(answer)),
        'alternate letter mismatch #' + index);
    }
  }
});
test('disputed clues are not taught as verified and never reappear in practice or minis', () => {
  const {api} = makeHarness();
  assert.equal(api.EDITORIAL_REVIEW.size, 16);
  assert.ok(api.practicePool().every(i => !api.EDITORIAL_REVIEW.has(i)));
  const disputed = new api.Solver({innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null},'daily');
  disputed.pick(175);
  assert.match(disputed.hintText(1).html, /review/i);
  assert.doesNotMatch(disputed.unpickHTML(), /LAUREN/);
});
test('novice can solve three progressively different clue types without involuntary spoilers', () => {
  const {api,element} = makeHarness();
  assert.deepEqual(Array.from(api.LEARN_STEPS, x=>x.device), ['ana','hid','cha']);
  for (const {i} of api.LEARN_STEPS) {
    const host=element(), learner=new api.Solver(host,'learn');
    learner.pick(i);
    const answer=api.CLUES[i][1];
    assert.ok(!host.innerHTML.includes('>' + answer + '<'), 'unearned answer printed in lesson');
    for (let tier=1;tier<=3;tier++) {
      assert.ok(!learner.hintText(tier).html.includes(answer), 'answer leaked from hint');
    }
    for (const ch of stripped(answer)) learner.type(ch);
    assert.equal(learner.state,'won');
    assert.equal(api.getState().learnProgress[i].solved,true);
    assert.equal(api.getState().learnProgress[i].independent,true);
  }
  for (const type of ['ana','hid','cha']) assert.equal(api.getState().mastery[type].independent,1);
});
test('wrong completed attempt gives targeted feedback; unfinished entries are not recorded as wrong', () => {
  const {api,element}=makeHarness();
  const learner=new api.Solver(element(),'learn');
  learner.pick(295);
  learner.check();
  assert.equal(learner.wrong,0);
  for(const letter of 'XXXXX') learner.type(letter);
  learner.check();
  assert.equal(learner.wrong,1);
  assert.match(learner.msg,/definition|wordplay/i);
  learner.addHint();
  assert.equal(learner.hints,1);
});
test('cancelled answer reveals no letters; deliberate approval reveals exactly once', () => {
  const h=makeHarness(), host=h.element(), s=new h.api.Solver(host,'learn');
  s.pick(0);
  s.giveUp();
  assert.equal(s.state,'play');
  assert.ok(!host.innerHTML.includes('>LISTEN<'));
  h.approve();s.giveUp();
  assert.equal(s.state,'shown');
  assert.match(host.innerHTML,/LISTEN/);
  assert.equal(h.api.getState().solved,0);
});
test('lesson sessions, hints and answers survive reload under the original progress key', () => {
  const {api,element,data}=makeHarness();
  const a=new api.Solver(element(),'learn');
  a.pick(295);a.type('S');a.addHint();
  const restored=new api.Solver(element(),'learn');
  restored.pick(295);
  assert.equal(restored.fill[0],'S');
  assert.equal(restored.hints,1);
  assert.ok(data.has('unpick.v1'));
});
test('daily progress is same-date only and a replay cannot inflate solved count', () => {
  const {api,element}=makeHarness();
  const d=new api.Solver(element(),'daily'); d.pick(0);
  for(const c of 'LISTEN') d.type(c);
  const count=api.getState().solved;
  d.next();
  for(const c of 'LISTEN') d.type(c);
  assert.equal(api.getState().solved,count);
  const newDay=api.getState().sessions.daily;
  newDay.day='2000-01-01';
  const d2=new api.Solver(element(),'daily'); d2.pick(0);
  assert.equal(d2.fill.join(''),'');
});
test('mini progress resumes, and revealing cannot grant solved credits', () => {
  const h=makeHarness();
  h.api.Mini.start(false);
  const seed=h.api.Mini.seed;
  h.api.Mini.set('A');
  const written=h.api.Mini.fa[0];
  h.api.Mini.start(false);
  assert.equal(h.api.Mini.seed,seed);
  assert.equal(h.api.Mini.fa[0],written);
  const solved=h.api.getState().solved;
  h.approve();h.api.Mini.reveal();h.api.Mini.check(false);
  assert.equal(h.api.getState().solved,solved);
  assert.equal(h.api.Mini.revealed,true);
});
test('guide examples require user action and the teaching page supports accessibility', () => {
  assert.match(html,/data-p="learn"/);
  assert.match(html,/id="p-learn"/);
  assert.match(html,/<details class="guideExample">/);
  assert.match(html,/role="status" aria-live="polite"/);
  assert.match(html,/aria-label="Letter/);
  assert.match(html,/aria-label="Row/);
});
test('app remains offline and keeps the v1 save identifier', () => {
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.match(source,/const K='unpick.v1'/);
  assert.match(html,/id="embedded-fonts"/);
});


test('a report does not silently reveal the answer or device before a solve', () => {
  const {api,element}=makeHarness();
  const learner=new api.Solver(element(),'learn');
  learner.pick(0);
  assert.doesNotMatch(learner.reportText(),/Answer: LISTEN/);
  assert.doesNotMatch(learner.reportText(),/Device: Anagram/);
  assert.match(learner.reportText(),/withheld/);
  for (const ch of 'LISTEN') learner.type(ch);
  assert.match(learner.reportText(),/Answer: LISTEN/);
  assert.match(learner.reportText(),/Device: Anagram/);
});
test('practice filters to chosen clue type and respects difficulty, without disputed records', () => {
  const {api}=makeHarness();
  const state=api.getState();
  state.practiceDevice='hid';
  state.tiers=[1,2,3];
  let pool=api.practicePool();
  assert.ok(pool.length>0);
  assert.ok(pool.every(i=>api.CLUES[i][2]==='hid'&&!api.EDITORIAL_REVIEW.has(i)));
  state.tiers=[1];
  pool=api.practicePool();
  assert.ok(pool.length>0);
  assert.ok(pool.every(i=>api.CLUES[i][6]===1));
  state.practiceDevice='not-a-device';
  pool=api.practicePool();
  assert.ok(pool.some(i=>api.CLUES[i][2]!=='hid'));
});
