# 02 - Backend Documentation

## Prompt

Crea `docs/BACKEND.md` documentando l'architettura backend del repository.

Mappa:

- microservizi;
- responsabilita' di ogni servizio;
- endpoint principali;
- flussi tra API Gateway, Customers, Vets, Visits e GenAI;
- dipendenze runtime: Config Server, Discovery Server, HSQLDB, MySQL opzionale, OpenAI/Azure OpenAI opzionale;
- test backend esistenti e come eseguirli.

Includi almeno due diagrammi Mermaid:

- routing dell'API Gateway;
- aggregazione owner details tra Gateway, Customers Service e Visits Service.

Non modificare codice.

## Expected Output

Un documento `docs/BACKEND.md` tecnico ma pratico, adatto a guidare successive feature backend.

## Validation

- Controlla che gli endpoint documentati esistano realmente nel codice o nella configurazione.
- Riporta eventuali gap o comportamenti opzionali, senza presentarli come production-ready.
