import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const output = join(here, 'measurement-register.csv');
const slots = [
  { id: 'O01', role: 'veterinario', offset: 0 },
  { id: 'O02', role: 'veterinario', offset: 4 },
  { id: 'O03', role: 'segreteria', offset: 8 },
  { id: 'O04', role: 'segreteria', offset: 12 },
  { id: 'O05', role: 'da_confermare', offset: 16 }
];
const rows = [[
  'study_run', 'condition', 'operator_slot', 'role', 'sequence_position',
  'task_slot', 'dataset_variant', 'case_id', 'elapsed_seconds', 'outcome',
  'penalty_seconds', 'validity_note'
]];

for (const condition of ['baseline', 'pilot']) {
  for (const operator of slots) {
    const baselineUsesA = Number(operator.id.slice(1)) % 2 === 1;
    const variant = condition === 'baseline'
      ? (baselineUsesA ? 'A' : 'B')
      : (baselineUsesA ? 'B' : 'A');
    const start = condition === 'baseline'
      ? operator.offset
      : (operator.offset + 10) % 20;
    for (let position = 0; position < 20; position += 1) {
      const taskNumber = ((start + position) % 20) + 1;
      const taskSlot = `T${String(taskNumber).padStart(2, '0')}`;
      rows.push([
        'UNASSIGNED', condition, operator.id, operator.role, position + 1,
        taskSlot, variant, `${variant}-${taskSlot}`, '', '', '', ''
      ]);
    }
  }
}

const csv = rows.map((row) => row.map((value) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}).join(',')).join('\n') + '\n';

writeFileSync(output, csv, 'utf8');
console.log(`Prepared ${rows.length - 1} assignments in ${output}`);
