(async function () {
  'use strict';

  const target = document.querySelector('#render-target');
  const rows = document.querySelector('#benchmark-results');
  const status = document.querySelector('#benchmark-status');
  const longText = 'Descrizione sintetica di controllo. '.repeat(300).slice(0, 8192);
  const visits = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    date: index % 97 === 0 ? null : `${2023 + (index % 4)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    description: index % 20 === 0
      ? longText
      : index % 31 === 0
        ? '<script>testo sintetico</script>'
        : `Visita sintetica ${index + 1}: controllo periodico.`
  }));
  const scenarios = [
    { name: 'Data, quasi completo', criteria: { from: '2023-02-01' } },
    { name: 'Testo, vuoto', criteria: { query: 'sequenza certamente assente' } },
    { name: 'Data + testo, quasi completo', criteria: { from: '2023-02-01', query: 'visita sintetica' } }
  ];

  function visibleCommit(items) {
    const fragment = document.createDocumentFragment();
    items.forEach((visit) => {
      const row = document.createElement('p');
      row.textContent = `${visit.date || 'Data non valida'} ${visit.description || ''}`;
      fragment.append(row);
    });
    target.replaceChildren(fragment);
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  function p95(values) {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[94];
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));
  const results = [];
  for (const scenario of scenarios) {
    const measures = [];
    let matchCount = 0;
    for (let run = 0; run < 100; run += 1) {
      const start = performance.now();
      const result = TimelineCore.filterVisits(visits, scenario.criteria);
      matchCount = result.items.length;
      await visibleCommit(result.items);
      measures.push(performance.now() - start);
    }
    results.push({ ...scenario, matchCount, measures, p95: p95(measures) });
  }

  results.forEach((result) => {
    const tr = document.createElement('tr');
    const values = [
      result.name,
      String(result.matchCount),
      String(result.measures.length),
      `${result.p95.toFixed(2)} ms`,
      '≤ 200 ms',
      result.p95 <= 200 ? 'PASS' : 'FAIL'
    ];
    values.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      tr.append(cell);
    });
    rows.append(tr);
  });
  window.cog157Benchmark = results.map(({ name, matchCount, measures, p95: value }) => ({
    name, matchCount, measureCount: measures.length, p95: value, max: Math.max(...measures)
  }));
  const passed = results.every((result) => result.p95 <= 200);
  status.textContent = passed
    ? 'Benchmark completato: tutti gli scenari rispettano la soglia del prototipo.'
    : 'Benchmark completato: almeno uno scenario supera la soglia; il design richiede revisione.';
}());
