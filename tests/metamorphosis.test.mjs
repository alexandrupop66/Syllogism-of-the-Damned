import test from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES_TO_FRAGMENTS, FLIGHT_DURATION_MS, planFlight } from '../src/metamorphosis.mjs';

const source = {left:100,top:200,width:400,height:55};
const target = {left:750,top:460,width:140,height:110};
test('each original control maps to one unique puzzle piece', () => {
  assert.deepEqual(SOURCES_TO_FRAGMENTS.map(x => x.id), ['identity','consent','authority']);
  assert.equal(new Set(SOURCES_TO_FRAGMENTS.map(x => x.source)).size, 3);
  assert.ok(FLIGHT_DURATION_MS >= 650 && FLIGHT_DURATION_MS <= 1400);
});
test('transition begins at the source, ends at the exact target centre and size', () => {
  const frames = planFlight(source,target);
  assert.equal(frames.length,4);
  assert.deepEqual(frames.map(x => x.offset), [0,.22,.72,1]);
  assert.equal(frames[0].transform,'translate(0px, 0px) rotate(0deg) scale(1, 1)');
  assert.ok(frames.at(-1).transform.includes('translate(520px, 287.5px)'));
  assert.ok(frames.at(-1).transform.includes('scale(0.35, 2)'));
  assert.equal(frames.at(-1).opacity,0);
});
test('transition rejects missing, invalid and zero-area geometry', () => {
  assert.throws(() => planFlight(null,target),TypeError);
  assert.throws(() => planFlight({...source,left:Infinity},target),TypeError);
  assert.throws(() => planFlight({...source,width:0},target),RangeError);
  assert.throws(() => planFlight(source,{...target,height:-1}),RangeError);
});
