# Tracciabilità e scenari QA

## Scenari di verifica funzionale

Gli scenari sotto sono derivati dall’implementazione. Quelli marcati “test repository” hanno una classe/test corrispondente; non si dichiara che siano stati eseguiti in questa analisi.

| ID | Funzionalità | Precondizioni e azioni | Risultato atteso | Evidenza |
|---|---|---|---|---|
| S-01 | F-01 | Servizio clienti disponibile; aprire Owners | Elenco owner con dati e filtro locale | UI owner-list; `OwnerResource` |
| S-02 | F-02 | Inviare owner completo | 201 e owner creato; ritorno lista | `OwnerResourceTest` se presente per endpoint; `OwnerResource.java` |
| S-03 | F-02 | Telefono non numerico o campo blank | Errore di validazione e alert globale | Owner vincoli; interceptor |
| S-04 | F-02 | Modificare owner inesistente | Errore not found | `OwnerResource.java:83-90` |
| S-05 | F-03 | Owner esistente, tipo valido, pet completo | 201 e pet associato all’owner | `PetResourceTest`; `PetResource.java` |
| S-06 | F-03 | Tipo inesistente | Verificare comportamento: il metodo non solleva errore esplicito | `PetResource.java:76-85` |
| S-07 | F-03 | PUT con owner path diverso dal pet nel body | Verificare che il backend aggiorni il pet per ID senza controllo ownership | `PetResource.java:68-74` |
| S-08 | F-04 | Pet ID valido; inviare descrizione <=8192 | 201, visita con petId del path | `VisitResourceTest`; `VisitResource.java` |
| S-09 | F-04 | Descrizione oltre 8192 | Errore di validazione backend | `Visit.java:44-46` |
| S-10 | F-04 | Leggere visite per pet e per lista pet | Risposta lista corretta; test aggregato coperto | `VisitResourceTest:29-55` |
| S-11 | F-05 | Vets Service disponibile | Elenco veterinari e specialità | `VetResourceTest`; `VetResource.java` |
| S-12 | F-06 | Owner con più pet e visite | Dettaglio associa ogni visita al pet corretto | `ApiGatewayControllerTest`; controller gateway |
| S-13 | F-06 | Visits Service indisponibile | Owner restituito con visite vuote; verificare messaggio di incompletezza UI | Circuit breaker controller |
| S-14 | F-07 | Provider LLM e discovery disponibili; domanda elenco owner | Risposta chatbot derivata dai dati clienti | `PetclinicTools`; `AIDataProvider` |
| S-15 | F-07 | Errore LLM | Testo “Chat is currently unavailable...” | `PetclinicChatClient.java:57-70` |
| S-16 | F-07 | Domanda veterinari senza/ con filtro | Limite risultati rispettivamente 50/20 | `AIDataProvider.java:51-68` |
| S-17 | F-08 | Avvio Compose con Config/Discovery | Healthcheck e dipendenze consentono avvio dei servizi | `docker-compose.yml:1-114` |
| S-18 | Trasversale | Ripetere una POST o inviare due POST simultanee | Verificare se si creano duplicati; nessuna deduplica evidente | Codice senza idempotency key |
| S-19 | Autorizzazione | Chiamare API senza credenziali e con ID di altro owner | Verificare controllo accessi; nel repository non emerge alcun controllo | Ricerca `security/auth` negativa |

## Matrice di tracciabilità

| Funzionalità | Regole | Diagrammi/processi | Scenari | Evidenze principali |
|---|---|---|---|---|
| F-01 | BR-01 | — | S-01 | `api-gateway/.../owner-list/*`; `customers-service/.../OwnerResource.java` |
| F-02 | BR-01, BR-02, BR-03 | — | S-02–S-04 | `Owner.java`; `OwnerResource.java`; `owner-form/*` |
| F-03 | BR-04, BR-05 | P-01 | S-05–S-07 | `PetResource.java`; `Pet.java`; `PetResourceTest.java` |
| F-04 | BR-06, BR-07 | P-02 | S-08–S-10 | `VisitResource.java`; `Visit.java`; `VisitResourceTest.java` |
| F-05 | — | — | S-11 | `VetResource.java`; `VetResourceTest.java`; `vet-list/*` |
| F-06 | BR-08 | contesto, F-06 | S-12–S-13 | `ApiGatewayController.java`; `ApiGatewayControllerTest.java` |
| F-07 | BR-09 | contesto | S-14–S-16 | `PetclinicChatClient.java`; `PetclinicTools.java`; `AIDataProvider.java`; `genai/chat.js` |
| F-08 | — | contesto | S-17 | `application.yml`; `docker-compose.yml`; `README.md` |

## Evidenze test e verifiche svolte

È stata eseguita una verifica statica dei percorsi, degli endpoint, dei modelli, degli schemi, delle configurazioni e dei test elencati nel repository. Non è stata avviata l’intera infrastruttura Compose né eseguito un browser test. Sono presenti test mirati per Pet, Visite, Veterinari, Gateway e client visite, oltre a smoke test di Config/Discovery/Gateway; la copertura non comprende tutte le combinazioni UI, errori e autorizzazioni.

La sintassi dei diagrammi Mermaid è stata mantenuta nella forma standard `flowchart`, `sequenceDiagram` ed `erDiagram`; non è stato eseguito un renderer Mermaid nel checkout, quindi il rendering grafico resta da verificare in CI o in un viewer compatibile.

## Fatti, deduzioni e punti aperti

### Fatti verificati

- Endpoint e flussi principali sono implementati nei controller e richiamati dalla UI.
- Dati owner/pet/visite/vet hanno schemi e seed HSQLDB coerenti con il modello descritto.
- Il dettaglio owner aggrega due servizi e ha un fallback visite vuoto.
- GenAI espone quattro strumenti applicativi, con limiti di ricerca veterinari configurati nel codice.

### Deduzioni da confermare

- Una POST ripetuta probabilmente crea duplicati: non ci sono meccanismi di idempotenza visibili.
- Il backend sembra esposto senza autenticazione applicativa: non sono stati trovati componenti security, ma l’assenza di evidenza non prova la configurazione del deployment.
- Un pet potrebbe essere creato con un tipo non valido perché `save` ignora il caso `Optional.empty()`; va verificato con test runtime e vincoli DB.

### Informazioni non determinabili

- Provider/configurazione effettivamente attivi in produzione.
- SLA, tempi massimi, volumi, utenti reali, ruoli organizzativi e policy di retention.
- Durata/invalidation della cache veterinari e comportamento del repository Config remoto.
- Contratto esatto dei payload di errore in ogni servizio.

### Domande ordinate per impatto

1. Quali ruoli e quali controlli di accesso devono esistere per proprietari, animali, visite e chatbot?
2. Il sistema deve impedire duplicati o invii concorrenti? Qual è la chiave di idempotenza?
3. La creazione visita deve verificare l’esistenza del pet e validare data futura/passata?
4. Un tipo animale inesistente deve produrre errore o usare un default?
5. Il fallback del dettaglio deve essere segnalato all’operatore come dato parziale?
6. Quali provider GenAI, limiti, retention della chat e dati autorizzati sono approvati?
7. Quali comportamento di eliminazione, archiviazione, audit e recupero sono richiesti?

