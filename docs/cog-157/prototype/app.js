(function () {
  'use strict';

  const pets = {
    jewel: {
      name: 'Jewel',
      visits: [
        { id: 12, date: '2025-11-12', description: 'Vaccinazione antirabbica. Prossimo richiamo tra 12 mesi.' },
        { id: 31, date: '2026-06-18', description: 'Controllo post-operatorio: ferita in buone condizioni.' },
        { id: 27, date: '2026-02-04', description: 'Visita di controllo. Esame generale nella norma.' },
        { id: 26, date: '2026-02-04', description: 'È stabile dopo la terapia prescritta.' },
        { id: 19, date: '2025-09-08', description: 'Descrizione letterale [a-z], non una espressione regolare.' },
        { id: 18, date: '2025-08-01', description: '<script>window.prototipoCompromesso = true</script>' },
        { id: 17, date: '2025-07-11', description: '' },
        { id: 16, date: null, description: 'Data non disponibile; visita mantenuta in coda.' },
        { id: 15, date: '2026-02-30', description: 'Data sintetica impossibile; visita mantenuta in coda.' },
        { id: 14, date: '2025-06-17', description: 'Controllo del peso.' },
        { id: 13, date: '2025-05-09', description: 'Richiamo telefonico registrato nella descrizione.' },
        { id: 11, date: '2025-03-22', description: 'Esame generale.' }
      ]
    },
    rosy: {
      name: 'Rosy',
      visits: [
        { id: 42, date: '2026-05-21', description: 'Controllo annuale.' },
        { id: 41, date: '2026-01-17', description: 'Vaccinazione completata.' }
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const forcedState = params.get('state');
  const timeline = document.querySelector('#timeline');
  const status = document.querySelector('#status');
  const error = document.querySelector('#error');
  const count = document.querySelector('#count');
  const title = document.querySelector('#history-title');
  const form = document.querySelector('#filters');
  let selectedKey = 'jewel';

  function clearMessages() {
    status.hidden = true;
    status.textContent = '';
    error.hidden = true;
    error.textContent = '';
  }

  function showStatus(message) {
    timeline.replaceChildren();
    count.textContent = '';
    status.textContent = message;
    status.hidden = false;
  }

  function formatDay(value) {
    if (!TimelineCore.parseDay(value)) return 'Data non valida';
    const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    const [year, month, day] = value.split('-').map(Number);
    return `${day} ${months[month - 1]} ${year}`;
  }

  function render() {
    clearMessages();
    const pet = pets[selectedKey];
    title.textContent = `Cronologia visite di ${pet.name}`;

    if (forcedState === 'unavailable') {
      showStatus('Lo storico delle visite non è disponibile in questo momento. Riprova.');
      return;
    }
    if (forcedState === 'empty') {
      showStatus('La risposta è stata ricevuta, ma non contiene visite per questo animale.');
      return;
    }

    const result = TimelineCore.filterVisits(pet.visits, {
      from: form.elements.from.value,
      to: form.elements.to.value,
      query: form.elements.query.value
    });
    timeline.replaceChildren();
    if (result.error) {
      count.textContent = '';
      error.textContent = result.error;
      error.hidden = false;
      return;
    }
    count.textContent = `${result.items.length} di ${result.total} visite`;
    if (result.items.length === 0) {
      showStatus('Nessuna visita corrisponde ai filtri applicati. Modifica o azzera i filtri.');
      count.textContent = `0 di ${result.total} visite`;
      return;
    }

    const fragment = document.createDocumentFragment();
    result.items.forEach((visit) => {
      const row = document.createElement('li');
      const date = document.createElement('time');
      date.className = 'visit-date';
      date.dateTime = TimelineCore.parseDay(visit.date) || '';
      date.textContent = formatDay(visit.date);
      const description = document.createElement('p');
      description.className = 'visit-description';
      description.textContent = visit.description || 'Descrizione non disponibile';
      row.append(date, description);
      fragment.append(row);
    });
    timeline.append(fragment);
  }

  document.querySelector('#pet-selector').addEventListener('change', (event) => {
    if (!event.target.matches('input[name="pet"]')) return;
    selectedKey = event.target.value;
    form.reset();
    render();
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); render(); });
  form.addEventListener('reset', () => window.setTimeout(render, 0));
  render();
}());
