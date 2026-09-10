'use strict';

const assert = require('node:assert/strict');
const { filterVisits, parseDay, sortVisits } = require('./timeline-core.js');

const source = [
  { id: 2, date: '2026-02-04', description: 'è stabile' },
  { id: 10, date: '2026-02-04', description: 'Controllo.' },
  { id: 8, date: '2025-11-12', description: '[a-z] letterale' },
  { id: 7, date: null, description: '' },
  { id: 6, date: '2026-02-30', description: '<script>testo</script>' }
];
const snapshot = JSON.stringify(source);

assert.equal(parseDay('2026-02-04'), '2026-02-04');
assert.equal(parseDay('2026-02-30'), null);
assert.deepEqual(sortVisits(source).map((visit) => visit.id), [10, 2, 8, 7, 6]);
assert.deepEqual(filterVisits(source, { from: '2026-02-04', to: '2026-02-04' }).items.map((visit) => visit.id), [10, 2]);
assert.deepEqual(filterVisits(source, { to: '2025-11-12' }).items.map((visit) => visit.id), [8]);
assert.deepEqual(filterVisits(source, { query: '[a-z]' }).items.map((visit) => visit.id), [8]);
assert.deepEqual(filterVisits(source, { query: '.' }).items.map((visit) => visit.id), [10]);
assert.deepEqual(filterVisits(source, { query: 'È' }).items.map((visit) => visit.id), [2]);
assert.deepEqual(filterVisits(source, { query: 'e stabile' }).items, []);
assert.deepEqual(filterVisits(source, { from: '2025-01-01', query: 'controllo' }).items.map((visit) => visit.id), [10]);
assert.match(filterVisits(source, { from: '2026-03-01', to: '2026-02-01' }).error, /precedere/);
assert.equal(JSON.stringify(source), snapshot, 'source visits must not be mutated');

console.log('COG-157 prototype rules: 11 checks passed.');
