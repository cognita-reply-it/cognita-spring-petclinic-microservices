(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TimelineCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function parseDay(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
      ? value
      : null;
  }

  function numericId(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
  }

  function sortVisits(visits) {
    return visits.map((visit, index) => ({ visit, index, day: parseDay(visit.date) }))
      .sort((left, right) => {
        if (left.day && right.day && left.day !== right.day) return right.day.localeCompare(left.day);
        if (left.day && !right.day) return -1;
        if (!left.day && right.day) return 1;
        const byId = numericId(right.visit.id) - numericId(left.visit.id);
        return byId || left.index - right.index;
      })
      .map(({ visit }) => visit);
  }

  function normalized(value) {
    return String(value == null ? '' : value).toLocaleLowerCase('it-IT');
  }

  function filterVisits(visits, criteria = {}) {
    const from = criteria.from ? parseDay(criteria.from) : null;
    const to = criteria.to ? parseDay(criteria.to) : null;
    const query = String(criteria.query || '').trim();

    if ((criteria.from && !from) || (criteria.to && !to)) {
      return { error: 'Inserisci date valide.', items: [], total: visits.length };
    }
    if (from && to && from > to) {
      return { error: 'La data iniziale deve precedere o coincidere con la data finale.', items: [], total: visits.length };
    }

    const hasDateFilter = Boolean(from || to);
    const literal = normalized(query);
    const items = sortVisits(visits).filter((visit) => {
      const day = parseDay(visit.date);
      if (hasDateFilter && !day) return false;
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (literal && !normalized(visit.description).includes(literal)) return false;
      return true;
    });
    return { error: null, items, total: visits.length };
  }

  return { filterVisits, parseDay, sortVisits };
}));
