import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluate,initialState,selectSlot,swapSlots,undo,reset,submit,nextCase,outcomeCounts,distanceToGoal,allPermutations,CLASSES_1,CLASSES_2,START_1,START_2} from '../src/bureau-engine.mjs';

test('puzzle 1 initial detention is proven',()=>{let v=evaluate(1,START_1);assert.equal(v.outcome,'DETAINED');assert.ok(v.trace.some(t=>t.subject==='DETAINED'));});
test('puzzle 1 one swap opens the exit',()=>{let s=swapSlots(initialState(1),0,1);assert.equal(evaluate(1,s.slots).outcome,'GOAL');assert.equal(distanceToGoal(1,START_1),1);});
test('puzzle 1 R1 staffing limitation is explicit',()=>{let v=evaluate(1,['CLERK','APPLICANT','VISITOR']);assert.equal(v.outcome,'UNSUPPORTED');assert.equal(v.ruleValid,false);});
test('puzzle 1 exhaustive counts match contract',()=>assert.deepEqual(outcomeCounts(1),{DETAINED:2,UNSUPPORTED:3,CONTRADICTION:0,GOAL:1}));
test('puzzle 2 initial detention is proven',()=>{let v=evaluate(2,START_2);assert.equal(v.outcome,'DETAINED');assert.equal(v.authorised,false);});
test('puzzle 2 exhaustive counts match contract',()=>assert.deepEqual(outcomeCounts(2),{DETAINED:10,UNSUPPORTED:10,CONTRADICTION:2,GOAL:2}));
test('puzzle 2 minimum two swaps',()=>assert.equal(distanceToGoal(2,START_2),2));
test('puzzle 2 has an alternative valid goal',()=>assert.equal(allPermutations(CLASSES_2).filter(p=>evaluate(2,p).goal).length,2));
test('contradictions block submit but not editing',()=>{
  let s=initialState(2);s=swapSlots(s,1,2);assert.equal(evaluate(2,s.slots).outcome,'CONTRADICTION');
  assert.equal(submit(s).solved,false);assert.notDeepEqual(undo(s).slots,s.slots);
});
test('invalid slot cannot modify state',()=>{let s=initialState(1);assert.equal(swapSlots(s,0,17),s);assert.equal(selectSlot(s,-1),s);});
test('identical positions do not move',()=>{let s=initialState(1);assert.equal(swapSlots(s,1,1),s);});
test('no duplicate or missing tokens accepted',()=>{
  assert.throws(()=>evaluate(1,['APPLICANT','APPLICANT','CLERK']));
  assert.throws(()=>evaluate(2,['ESCAPEE','CLERK','WITNESS']));
});
test('selection and swap are two-step and deterministic',()=>{let s=selectSlot(initialState(1),0);assert.equal(s.selected,0);s=selectSlot(s,1);assert.deepEqual(s.slots,['VISITOR','APPLICANT','CLERK']);assert.equal(s.moves,1);});
test('reselect cancels selected token',()=>{let s=selectSlot(initialState(1),0);assert.equal(selectSlot(s,0).selected,null);});
test('undo restores previous state',()=>{let s=swapSlots(initialState(1),0,1);assert.deepEqual(undo(s).slots,START_1);});
test('undo on empty history is harmless',()=>{let s=initialState(1);assert.deepEqual(undo(s).slots,START_1);});
test('reset restores puzzle starting positions',()=>{let s=swapSlots(initialState(2),0,3);assert.deepEqual(reset(s),initialState(2));});
test('submit cannot open a detained case',()=>{let s=initialState(1);assert.equal(submit(s).solved,false);});
test('submit opens only a proven goal',()=>{let s=submit(swapSlots(initialState(1),0,1));assert.equal(s.solved,true);assert.equal(nextCase(s).puzzle,2);});
test('next case is gated',()=>assert.equal(nextCase(initialState(1)).puzzle,1));
test('solved case is immutable',()=>{let s=submit(swapSlots(initialState(1),0,1));assert.equal(swapSlots(s,0,1),s);assert.equal(selectSlot(s,1),s);});
test('full configuration count is 6 + 24',()=>{assert.equal(allPermutations(CLASSES_1).length,6);assert.equal(allPermutations(CLASSES_2).length,24);});
test('logic trace and statuses derive from facts, not move count',()=>{
 const a=evaluate(2,['VISITOR','ESCAPEE','CLERK','WITNESS']);
 const b=evaluate(2,['VISITOR','WITNESS','CLERK','ESCAPEE']);
 assert.equal(a.goal,true);assert.equal(b.goal,true);assert.ok(a.trace.some(t=>t.source==='C'));
});
