# 10 - Error Handling UI

## Prompt

Migliora la gestione errori end-to-end.

Backend:

- rendi coerenti i `404`;
- rendi leggibili gli errori di validazione per owners, pets e visits;
- usa un contratto errore stabile e documentato.

Frontend:

- mostra messaggi inline nei form;
- evita fallimenti silenziosi;
- mantieni l'interceptor generico solo per errori globali.

Aggiorna `docs/BACKEND.md` con il contratto errore.

## Expected Output

Error handling piu' chiaro lato API e lato UI, senza refactor ampio.

## Validation

- Aggiungi o aggiorna test backend sugli errori.
- Verifica almeno un caso UI rappresentativo.
