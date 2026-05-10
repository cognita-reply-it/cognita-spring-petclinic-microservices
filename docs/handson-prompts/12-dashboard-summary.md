# 12 - Dashboard Summary

## Prompt

Implementa una dashboard summary nella home.

Backend:

- aggiungi un endpoint Gateway che aggrega conteggi di owners, pets, vets e visits;
- includi uno stato base dei servizi quando ragionevole;
- proteggi l'aggregazione con fallback dove serve.

Frontend:

- aggiorna la welcome page con indicatori compatti;
- aggiungi link alle sezioni principali;
- mantieni il design semplice, operativo e coerente con il frontend esistente.

Aggiorna la documentazione backend/frontend se vengono aggiunti endpoint o viste.

## Expected Output

Una home piu' utile per orientarsi nel sistema durante l'hands-on.

## Validation

- Aggiungi test per l'endpoint Gateway.
- Verifica la pagina in browser con Playwright se possibile.
