# Verifica, tracciabilità e punti aperti

## Scenari di verifica funzionale

| ID | Funzione | Tipo/evidenza | Precondizioni e azioni | Risultato atteso verificabile |
|---|---|---|---|---|
| SCN-OWN-01 | FUN-OWN-02 | derivato dal codice | Invia proprietario con cinque campi validi. | 201; record leggibile nell'elenco. |
| SCN-OWN-02 | FUN-OWN-02 | derivato dal codice | Aggiorna un ID inesistente. | 404. |
| SCN-OWN-03 | FUN-OWN-02 | proposta (divergenza UI/backend) | Invia telefono di 10 cifre via API e via UI. | API lo accetta entro 12 cifre; UI lo blocca: decisione PO necessaria. |
| SCN-PET-01 | FUN-PET-01 | test presente | Crea animale con proprietario esistente e tipo esistente. | 201, collegamento al proprietario; coperto da `PetResourceTest`. |
| SCN-PET-02 | FUN-PET-01 | test presente | Crea animale per proprietario inesistente. | 404; coperto da `PetResourceTest`. |
| SCN-PET-03 | FUN-PET-01 | proposta | Modifica URL `petId=A` con body `id=B`. | Verificare quale animale viene modificato: il codice indica B. |
| SCN-VIS-01 | FUN-VIS-01 | test presente | Crea visita con descrizione e `petId` path valido. | 201 e `petId` della risorsa coincide col path; coperto da `VisitResourceTest`. |
| SCN-VIS-02 | FUN-VIS-01 | test presente | Invia descrizione oltre 8.192 caratteri o `petId=0`. | errore di validazione; coperto da `VisitResourceTest`. |
| SCN-DET-01 | FUN-OWN-03 | test presente | Servizio Visits non disponibile nel dettaglio. | Proprietario restituito con visite vuote; coperto da `ApiGatewayControllerTest`. |
| SCN-VET-01 | FUN-VET-01 | test presente | Richiede lista veterinari. | Elenco con specializzazioni; coperto da `VetResourceTest`. |
| SCN-GEN-01 | FUN-GEN-01 | proposta, condizionata | Configura provider valido e invia una domanda di lettura. | Risposta testuale; verificare non-regressione e dati esposti. |
| SCN-GEN-02 | FUN-GEN-01 | proposta | Simula errore provider. | Testo standard di indisponibilità; verificare status HTTP effettivo (codice indica 200). |

Questi sono scenari documentati, non esecuzioni; le menzioni “test presente” si riferiscono a test repository esaminati.

## Matrice di tracciabilità

| Funzionalità | Regole | Diagrammi/processi | Scenari | Evidenze principali |
|---|---|---|---|---|
| FUN-OWN-01/02 | RB-OWN-01 | — | SCN-OWN-01..03 | `OwnerResource`, `OwnerRequest`, `owner-*.controller.js` |
| FUN-PET-01 | RB-PET-01, RB-PET-02 | — | SCN-PET-01..03 | `PetResource`, `PetRequest`, `pet-form.controller.js`, `PetResourceTest` |
| FUN-VIS-01 | RB-VIS-01 | PROC-REG-01 | SCN-VIS-01..02 | `VisitResource`, `Visit`, `visits.controller.js`, `VisitResourceTest` |
| FUN-OWN-03 | RB-DET-01 | DGM-SEQ-01 / PROC-DET-01 | SCN-DET-01 | `ApiGatewayController`, client Customers/Visits, `ApiGatewayControllerTest` |
| FUN-VET-01 | RB-GEN-02 | DGM-CTX-01 | SCN-VET-01 | `VetResource`, `AIDataProvider.getVets`, `VetResourceTest` |
| FUN-GEN-01 | RB-GEN-01, RB-GEN-02 | DGM-CTX-01 | SCN-GEN-01..02 | `PetclinicChatClient`, `PetclinicTools`, `AIDataProvider`, `chat.js` |
| FUN-OPS-01 | — | DGM-CTX-01 | — | Gateway `application.yml`, `ApiGatewayApplication`, `docker-compose.yml` |

**Nota diagrammi.** `DGM-CTX-01` è in [Sistema e dati](sistema-e-dati.md#contesto-dgm-ctx-01); il diagramma di sequenza del dettaglio costituisce `DGM-SEQ-01` in [Funzionalità e processi](funzionalita-e-processi.md#fun-own-03--scheda-proprietario-aggregata). Mermaid CLI è disponibile, ma il rendering non è stato possibile: manca `chrome-headless-shell` richiesto da Puppeteer. I blocchi restano controllati visivamente e con delimitatori bilanciati.

## Fatti, deduzioni e anomalie

### Fatti verificati

- Le route Gateway separano i servizi con i quattro prefissi configurati e rimuovono i primi due segmenti di path.
- Proprietari e animali sono mantenuti nel Customers service; le visite mantengono solo un `petId` nel Visits service.
- Il dettaglio utilizza il circuit breaker soltanto sulla richiesta visite; il fallback restituisce liste vuote.
- Il chatbot ha endpoint, UI e strumenti di creazione/lettura implementati, ma richiede configurazione esterna per produrre risposte del modello.

### Deduzioni da confermare

- Il “cliente” che usa l'interfaccia sembra un operatore della clinica, ma il repository non definisce un profilo business né i suoi permessi.
- La configurazione centralizzata può sovrascrivere dati, sicurezza e profili locali; non è possibile dedurne il contenuto dal checkout.

### Contraddizioni/anomalie osservate

- UI telefono: esattamente 12 cifre; backend: massimo 12 (SCN-OWN-03).
- L'istruzione prompt dello strumento GenAI parla di telefono a 10 cifre, mentre il DTO permette fino a 12 e la UI richiede 12.
- L'aggiornamento animale non vincola l'ID nel body al `petId` URL.
- La visita può essere creata per un ID animale formalmente valido senza chiamare Customers; non è verificata integrità inter-servizio.
- La funzione di persistenza chat in `chat.js` non è chiamata; non è una funzionalità attiva verificata.
- Il file README afferma che GenAI permette conversazione, ma non può dimostrarne l'operatività in assenza di credenziali/provider.

## Domande aperte ordinate per impatto

1. **Alta — autorizzazioni:** quali persone possono leggere/modificare dati personali e usare azioni di creazione del chatbot? Devono esistere ruoli o confini tra organizzazioni?
2. **Alta — GenAI:** è approvato che un LLM riceva dati di proprietari e possa creare proprietari/animali? Quali provider, limiti, consenso e audit sono richiesti?
3. **Alta — integrità visite:** una visita deve essere rifiutata quando l'animale non esiste o non appartiene al proprietario nel path?
4. **Media — telefono:** qual è la regola di lunghezza corretta (10, fino a 12, esattamente 12) e in quali paesi vale?
5. **Media — errore dettaglio:** è corretto mostrare una scheda senza visite quando il servizio è indisponibile, e l'utente deve essere avvisato del dato parziale?
6. **Media — conservazione:** quali regole servono per modifica, cancellazione, storico e recupero di anagrafiche e visite?

## Proposte separate dal comportamento attuale

Le seguenti non sono requisiti implementati: allineare validazione telefono e ID animale; rendere esplicito lo stato “dati parziali”; introdurre autorizzazione/audit e conferma utente per azioni GenAI; definire idempotenza per i POST; stabilire retention e gestione degli errori del chatbot.
