# 08 - Agentic-Friendly Migration

## Prompt

Migra questo repository verso una struttura agentic-friendly per Codex App.

Obiettivo: rendere il repo facile da capire, modificare e verificare da parte di agenti software, senza cambiare il comportamento applicativo.

Crea o aggiorna:

- `AGENTS.md` con regole repo-specifiche;
- `docs/HANDSON.md` con overview operativa;
- `docs/BACKEND.md` con servizi, endpoint e flussi;
- `docs/FRONTEND.md` con struttura AngularJS, route, controller, template e API;
- `docs/RUNBOOK.md` o `docs/BOOTSTRAP.md` con setup Windows-first, Docker e Maven;
- `BACKLOG.md` con feature ordinate per hands-on;
- `INIT_PROMPT.md` con prompt iniziale riusabile per Codex App;
- eventuale `.codex/agents/` minimale per documentation, Spring backend, legacy Angular frontend e QA.

Vincoli:

- Non implementare nuove feature applicative.
- Non introdurre fake data.
- Non installare Spring globalmente: Spring Boot e Spring Cloud sono gestiti da Maven.
- Mantieni Docker utile ma non confonderlo con il core Java flow.
- Usa il codice reale e i file esistenti come fonte di verita'.
- Mantieni tutto asciutto, operativo e verificabile.

## Expected Output

Un repository piu' leggibile e operabile da Codex App, con contratti locali, documentazione tecnica e prompt iniziale riusabile.

## Validation

- Verifica che i documenti citino file, comandi ed endpoint reali.
- Controlla che gli script siano coerenti con Windows e Maven Wrapper.
- Esegui validazioni statiche disponibili.
- Nel final answer indica file creati/modificati e cosa resta non verificato.
