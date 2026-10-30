import {test} from 'node:test';
import assert from 'node:assert/strict';
import {transferRate} from '../core/stream-progress.mjs';
test('measured rolling rate bridges packet gaps and reaches zero on a stall',()=>{
  const rate=transferRate(0,0);
  assert.equal(rate(1000,500),2000);
  assert.equal(rate(1000,1000),1000);
  assert.equal(rate(3000,1500),2000);
  rate(3000,2000); rate(3000,2500); rate(3000,3000);
  assert.equal(rate(3000,3500),0);
  assert.equal(rate(0,4000),0);
  assert.equal(rate(1000,4500),2000);
});
