import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanName, validateName, initialState, submitName, placePiece, openDoor, restart, safeLabel, PIECE_IDS } from '../src/engine.mjs';

test('initial state is the form with empty progress', () => {
  assert.deepEqual(initialState(), { act: 'form', name: '', collected: [], message: 'Awaiting applicant.' });
});
test('names are trimmed, compacted and bounded', () => {
  assert.equal(cleanName('   Ada   Lovelace  '), 'Ada Lovelace');
  assert.equal(cleanName('x'.repeat(100)).length, 32);
});
test('control characters removed', () => assert.equal(cleanName('Al\u0000ex\n'), 'Alex'));
test('non-string names fail closed', () => assert.equal(cleanName(null), ''));
test('empty name produces safe validation message', () => assert.match(validateName(' ' ).error, /two characters/));
test('too-short name does not advance the act', () => assert.equal(submitName(initialState(),'a').act,'form'));
test('valid name starts fracture', () => {
  const result=submitName(initialState(), 'Alex');
  assert.equal(result.act, 'fracture');
  assert.equal(result.name, 'Alex');
});
test('submission cannot be repeated during fracture', () => {
  const state=submitName(initialState(), 'Alex');
  assert.equal(submitName(state,'Different'), state);
});
test('only known pieces can be placed', () => {
  const state=submitName(initialState(), 'Alex');
  assert.equal(placePiece(state, 'undefined'), state);
});
test('duplicate piece cannot be counted twice', () => {
  const a=placePiece(submitName(initialState(),'Alex'), PIECE_IDS[0]);
  assert.equal(placePiece(a, PIECE_IDS[0]), a);
});
test('all three unique pieces produce verdict', () => {
  let a=submitName(initialState(), 'Alex');
  for (const id of PIECE_IDS) a=placePiece(a,id);
  assert.equal(a.act,'verdict');
  assert.equal(a.collected.length,3);
});
test('door locked until verdict', () => assert.equal(openDoor(initialState()).act,'form'));
test('door opens after verdict', () => {
  let a=submitName(initialState(), 'Alex');
  for (const id of PIECE_IDS) a=placePiece(a,id);
  assert.equal(openDoor(a).act,'escaped');
});
test('restart returns clean state', () => assert.deepEqual(restart(), initialState()));
test('safe label never returns empty text', () => assert.equal(safeLabel(''), 'APPLICANT'));
