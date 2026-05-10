# 05 - Local AGENTS.md

## Prompt

Crea un `AGENTS.md` locale per rendere il repository agentic-friendly.

Il file deve contenere regole repo-specifiche per Codex:

- file da leggere prima di lavorare;
- distinzione tra frontend, backend, observability e GenAI;
- divieto di fake data non dichiarati;
- uso di HSQLDB come default locale;
- uso di MySQL solo quando richiesto;
- uso di Docker solo quando il task lo richiede;
- validazione Maven attesa per modifiche backend;
- verifica Playwright per modifiche frontend;
- aggiornamento della documentazione quando cambia un contratto;
- criterio finale di reporting.

Non duplicare regole globali generiche se non servono al repository.

## Expected Output

Un `AGENTS.md` locale chiaro, breve e operativo.

## Validation

- Verifica che le regole siano coerenti con `README.md`, `pom.xml` e `docker-compose.yml`.
- Non inserire preferenze personali non specifiche del repository.
