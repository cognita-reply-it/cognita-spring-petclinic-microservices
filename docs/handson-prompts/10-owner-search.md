# 10 - Owner Search

## Prompt

Implementa la feature "Owner Search".

Backend:

- aggiungi filtri realistici sugli owners;
- supporta almeno `lastName` e `city`;
- mantieni compatibile il comportamento esistente quando non vengono passati filtri;
- aggiungi o aggiorna test backend.

Frontend:

- aggiorna la pagina Find Owners con campi filtro;
- mostra uno stato vuoto quando non ci sono risultati;
- evita duplicazioni di logica nel controller.

Aggiorna la documentazione se cambia il contratto API.

## Expected Output

Una ricerca owner end-to-end funzionante, verificata con test backend e controllo frontend.

## Validation

- Esegui il test Maven piu' mirato possibile.
- Se modifichi UI, verifica con Playwright o spiega perche' non e' stato possibile.
