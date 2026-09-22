# Verifica funzionale, tracciabilità e punti aperti

[Indice](README.md) · [Funzioni](funzionalita.md) · [Regole](regole.md) · [Diagrammi](processi.md) · [Validazione eseguita](validazione.md)

## Scenari QA

**T** = comportamento già descritto da un test nel repository, qui letto, non necessariamente eseguito. **I** = scenario derivato dall'implementazione, da eseguire. **C** = proposta di verifica di un'incertezza, da confermare: non è un requisito approvato. Tutti i dati da preparare sono sintetici. Gli scenari con modifiche o errori indotti richiedono un ambiente di prova isolato.

| ID / funzione / base | Precondizioni e dati | Azione o evento | Risultato verificabile |
|---|---|---|---|
| S01 / F01 / I | Due proprietari con animali e dati differenti | Aprire elenco, filtrare per nome animale, svuotare filtro | Prima elenco completo, poi corrispondenze locali, poi ripristino; nessuna nuova richiesta di ricerca |
| S02 / F01 / I | Elenco vuoto oppure filtro senza corrispondenze | Aprire/filtrare | Nessuna riga; nessun messaggio dedicato nel template |
| S03 / F02 / I | Dati validi, telefono sintetico di 12 cifre | Creare, rileggere, modificare città e rileggere | POST 201 e ID; PUT 204; città aggiornata e animali preservati |
| S04 / F02 / I | ID non presente | PUT con corpo valido | 404; nessuna nuova anagrafica creata |
| S05 / F02 / I | Telefono di 10, 12, 13 cifre; campo nome vuoto | Provare form e richieste API separate | Differenze R01; API rifiuta nome vuoto e telefono oltre 12; form richiede 12 cifre |
| S06 / F02 / I | Corpo valido identico inviato due volte | Due POST senza ID | Due creazioni possibili; non esiste controllo applicativo di unicità |
| S07 / F03 / T | Fixture animale con tipo, repository mock | GET animale | 200 JSON con ID, nome e ID tipo; `PetResourceTest.shouldGetAPetInJSonFormat` |
| S08 / F03 / I | Proprietario esistente e tipo valido, poi proprietario inesistente | POST animale nei due casi | 201 e associazione nel primo; 404 nel secondo |
| S09 / F03 / C | Browser con data sintetica, diversi fusi orari | Inserire e rileggere data nascita via UI | Verificare compatibilità serializzazione Date/`yyyy-MM-dd` e assenza di scostamento; esito non dichiarato prima della prova |
| S10 / F03 / I | Animali A e B; proprietario del percorso non corrispondente | GET B; PUT percorso A con ID B nel corpo | GET cerca B; PUT aggiorna B, non A; nessun controllo di appartenenza nel metodo |
| S11 / F03 / I | Animale con tipo valido; ID tipo inesistente | Modificare tipo, poi tentare nuova creazione col tipo inesistente | Modifica conserva vecchio tipo; creazione senza errore business dedicato, rilevare errore effettivo e mancata persistenza |
| S12 / F04 / T | Mock Customers e Visits con visita associata | GET aggregato | 200, animale e descrizione visita; `getOwnerDetails_withAvailableVisitsService` |
| S13 / F04 / T | Customers disponibile; Visits mock con errore connessione | GET aggregato | 200 con animale e visite vuote; `getOwnerDetails_withServiceError` |
| S14 / F04 / I | Customers restituisce errore | GET aggregato | Nessun dettaglio sostitutivo dal fallback Visits |
| S15 / F04 / C | Proprietario senza animali; servizi reali di prova | Aprire dettaglio | Verificare risposta del parametro `petId` vuoto e resa UI; nessun ramo di omissione chiamata nel sorgente |
| S16 / F05 / T | Mock repository con visite per due ID animali | GET `/pets/visits?petId=111,222` | Oggetto `items` con ID visita e `petId` attesi; `VisitResourceTest.shouldFetchVisits` |
| S17 / F05 / I | Animale esistente; data e descrizione valide | Aggiungere visita e rileggere | 201; visita collegata al `petId` del percorso; ritorno al dettaglio |
| S18 / F05 / I | Corpo con descrizione di 8192 e poi 8193 caratteri; altro caso null/vuoto | POST diretti | Limite massimo validato; nessun obbligo di descrizione backend, a differenza del form |
| S19 / F05 / C | Fixture ID animale inesistente, HSQLDB/MySQL configurati come script | POST visita | Verificare differenza da FK: HSQLDB senza FK, MySQL con FK verso pets; non assumere medesimo esito |
| S20 / F05 / C | Visita esistente; POST con ID esistente e dati differenti | Inviare e rileggere | Verificare possibile aggiornamento da `save`; non assumere nuova visita per ogni POST |
| S21 / F06 / T | Repository Vets mock con un elemento | GET `/vets` | 200 e ID atteso; `VetResourceTest.shouldGetAListOfVets` |
| S22 / F06 / I | Veterinari con zero/più specializzazioni | Aprire elenco | Nomi e specializzazioni; cella vuota per nessuna, nomi specializzazioni ordinati |
| S23 / F07 / I | Chat aperta | Inviare soli spazi, poi testo | Spazi non inviati; testo mostrato e campo svuotato; risposta solo dopo completamento |
| S24 / F07 / I | Provider di prova e Customers disponibili, consenso al test di scrittura | Chiedere creazione proprietario sintetico | Se viene invocato il tool, POST a Customers e anagrafica rileggibile; nessuna approvazione strutturata intermedia |
| S25 / F07 / I | Indice con più di 50 documenti | Invocare ricerca tool con richiesta nulla e valorizzata | Richieste topK rispettivamente 50 e 20; nessuna garanzia di conteggio completo |
| S26 / F07 / I | Eccezione indotta nella chat; separatamente errore rete e fallback gateway | Inviare messaggio | Testo generico dal servizio; 503 dal fallback POST; testo o messaggio di trasporto mostrato dal browser |
| S27 / F07 / C | Due browser/sessioni, messaggi sintetici riconoscibili | Conversazioni distinte e ricarica pagina | Verificare isolamento memoria server; locale HTML ripristinato. Isolamento server non dimostrato dal controller |
| S28 / F08 / I | Indice classpath accessibile | Avviare listener | Caricamento file, nessuna lettura Vets in quel ramo |
| S29 / F08 / I | Indice assente, Vets ed embedding di prova disponibili | Avviare listener | Lettura Vets, popolamento indice, file temporaneo; nessun refresh periodico |
| S30 / F08 / C | Esecuzione da JAR o risorsa illeggibile | Avviare listener | Verificare `getFile()` e comportamento avvio su errore; nessun fallback automatico a ricostruzione |
| S31 / F02–F05 / C | Risposte di errore con/senza array `errors` | Inviare form e osservare console, alert, navigazione, rilettura | Verificare difetto intercettore: alert può fallire; risposta non esplicitamente rigettata; non confondere navigazione e salvataggio |
| S32 / F02–F05 / C | Endpoint di prova restituisce 503 dopo scrittura simulata | POST attraverso gateway | Verificare retry configurato e possibili duplicati, inclusa interazione fallback; nessuna garanzia exactly-once |
| S33 / F01–F07 / I | Deployment isolato senza protezioni esterne | Chiamare endpoint senza identità e cambiare ID proprietario nel percorso | Nessun controllo applicativo di ruolo/tenant nei metodi esaminati; registrare eventuali protezioni esterne separatamente |
| S34 / F04 / T | MockWebServer con risposta visite preparata | Invocare client Visits | Visita deserializzata con ID animale e descrizione; `VisitsServiceClientIntegrationTest` usa server simulato, non Visits reale |
| S35 / F02–F03 / C | Due client leggono la stessa entità e cambiano campi | Inviare modifiche quasi simultanee, rileggere | Verificare sovrascritture; nessun controllo di versione applicativo individuato |

## Matrice di tracciabilità

Ogni funzione ha regole, scenari e prove. D06 comprende due blocchi diagramma dello stesso modello concettuale.

| Funzione | Regole | Processo / diagrammi | Scenari | Evidenze |
|---|---|---|---|---|
| F01 | R08, R14 | D01 | S01–S02, S33 | E02, E06, E09 |
| F02 | R01, R06–R07, R12–R14 | P01/D02, P03/D05, D06 | S03–S06, S24, S31–S33, S35 | E02, E06–E07, E09–E10, E13 |
| F03 | R02–R03, R06–R07, R12–R14 | P01/D02, P03/D05, D06 | S07–S11, S31–S33, S35 | E03, E06–E07, E09–E10, E13–E14 |
| F04 | R05, R12, R14 | P02/D03 | S12–S15, S33–S34 | E06, E08, E15 |
| F05 | R04, R06, R12–R14 | P01/D02, D06 | S16–S20, S31–S33 | E04, E06–E07, E13, E16 |
| F06 | R09, R14 | D01, D06 | S21–S22, S25, S33 | E05–E06, E10, E17 |
| F07 | R01–R02, R06–R07, R09–R10, R12, R14 | P03/D05 | S23–S27, S32–S33 | E06–E12 |
| F08 | R09, R11 | P03/D04 | S28–S30 | E10–E12 |

## Registro delle evidenze

Percorsi relativi alla radice del repository, risolti dai collegamenti. Il simbolo indicato delimita il comportamento rilevante. I test sono evidenza dell'atteso, con i limiti dei mock indicati sopra.

### E01

- [README.md](../../README.md) — Scopo dimostrativo, moduli, avvio, database e descrizione chatbot.
- [WORKFLOW.md](../../WORKFLOW.md) — Contratto di consegna.
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Contributi e test.

### E02

- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java) — createOwner, findOwner, findAll, updateOwner.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerRequest.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerRequest.java) — Vincoli input.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/mapper/OwnerEntityMapper.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/mapper/OwnerEntityMapper.java) — map.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Owner.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Owner.java) — getPets, addPet e campi.

### E03

- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetResource.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetResource.java) — getPetTypes, processCreationForm, processUpdateForm, save, findPet.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetRequest.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetRequest.java) — Campi e annotazioni.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetDetails.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetDetails.java) — Dati lettura.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetRepository.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetRepository.java) — findPetTypes, findPetTypeById.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Pet.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Pet.java) — Associazioni e toString.
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/ResourceNotFoundException.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/ResourceNotFoundException.java) — 404.

### E04

- [spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java) — create e read.
- [spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/Visit.java](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/Visit.java) — Campi, vincoli e ID scrivibile.
- [spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/VisitRepository.java](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/VisitRepository.java) — findByPetId, findByPetIdIn.

### E05

- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java) — showResourcesVetList.
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Vet.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Vet.java) — getSpecialties e relazioni.
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/CacheConfig.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/CacheConfig.java) — Profilo production.
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/VetsProperties.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/VetsProperties.java) — Proprietà cache.

### E06

- [spring-petclinic-api-gateway/src/main/resources/static/index.html](../../spring-petclinic-api-gateway/src/main/resources/static/index.html) — Navigazione e chat.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/app.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/app.js) — Routing e intercettore.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js) — sendMessage, saveChatMessages, loadChatMessages.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/httpErrorHandlingInterceptor.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/httpErrorHandlingInterceptor.js) — responseError.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js) — owner-list controller.js.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html) — owner-list template.html.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js) — owner-form controller.js.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.template.html) — owner-form template.html.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js) — owner-details controller.js.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html) — owner-details template.html.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js) — pet-form controller.js.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.template.html) — pet-form template.html.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js) — visits controller.js.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.template.html) — visits template.html.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js) — vet-list controller.js.
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html) — vet-list template.html.

### E07

- [spring-petclinic-api-gateway/src/main/resources/application.yml](../../spring-petclinic-api-gateway/src/main/resources/application.yml) — Route, retry e fallback.
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/FallbackController.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/FallbackController.java) — fallback.

### E08

- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java) — getOwnerDetails, addVisitsToOwner, emptyVisitsForPets.
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java) — getOwner.
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java) — getVisitsForPets.
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/ApiGatewayApplication.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/ApiGatewayApplication.java) — defaultCustomizer.

### E09

- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java) — exchange e costruzione chat.
- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicTools.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicTools.java) — Quattro tool e OwnerRequest.

### E10

- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIDataProvider.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIDataProvider.java) — getAllOwners, getVets, addPetToOwner, addOwnerToPetclinic, getCustomerServiceUri.

### E11

- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/VectorStoreController.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/VectorStoreController.java) — loadVetDataToVectorStoreOnStartup.
- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIBeanConfiguration.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIBeanConfiguration.java) — vectorStore.

### E12

- [spring-petclinic-config-server/src/main/resources/application.yml](../../spring-petclinic-config-server/src/main/resources/application.yml) — Configurazione locale config-server.
- [spring-petclinic-discovery-server/src/main/resources/application.yml](../../spring-petclinic-discovery-server/src/main/resources/application.yml) — Configurazione locale discovery-server.
- [spring-petclinic-admin-server/src/main/resources/application.yml](../../spring-petclinic-admin-server/src/main/resources/application.yml) — Configurazione locale admin-server.
- [spring-petclinic-customers-service/src/main/resources/application.yml](../../spring-petclinic-customers-service/src/main/resources/application.yml) — Configurazione locale customers-service.
- [spring-petclinic-visits-service/src/main/resources/application.yml](../../spring-petclinic-visits-service/src/main/resources/application.yml) — Configurazione locale visits-service.
- [spring-petclinic-vets-service/src/main/resources/application.yml](../../spring-petclinic-vets-service/src/main/resources/application.yml) — Configurazione locale vets-service.
- [spring-petclinic-genai-service/src/main/resources/application.yml](../../spring-petclinic-genai-service/src/main/resources/application.yml) — Configurazione locale genai-service.
- [spring-petclinic-genai-service/pom.xml](../../spring-petclinic-genai-service/pom.xml) — Provider attivo e alternativa commentata.

### E13

- [spring-petclinic-customers-service/src/main/resources/db/hsqldb/schema.sql](../../spring-petclinic-customers-service/src/main/resources/db/hsqldb/schema.sql) — Vincoli SQL customers hsqldb.
- [spring-petclinic-customers-service/src/main/resources/db/mysql/schema.sql](../../spring-petclinic-customers-service/src/main/resources/db/mysql/schema.sql) — Vincoli SQL customers mysql.
- [spring-petclinic-visits-service/src/main/resources/db/hsqldb/schema.sql](../../spring-petclinic-visits-service/src/main/resources/db/hsqldb/schema.sql) — Vincoli SQL visits hsqldb.
- [spring-petclinic-visits-service/src/main/resources/db/mysql/schema.sql](../../spring-petclinic-visits-service/src/main/resources/db/mysql/schema.sql) — Vincoli SQL visits mysql.
- [spring-petclinic-vets-service/src/main/resources/db/hsqldb/schema.sql](../../spring-petclinic-vets-service/src/main/resources/db/hsqldb/schema.sql) — Vincoli SQL vets hsqldb.
- [spring-petclinic-vets-service/src/main/resources/db/mysql/schema.sql](../../spring-petclinic-vets-service/src/main/resources/db/mysql/schema.sql) — Vincoli SQL vets mysql.

### E14

- [spring-petclinic-customers-service/src/test/java/org/springframework/samples/petclinic/customers/web/PetResourceTest.java](../../spring-petclinic-customers-service/src/test/java/org/springframework/samples/petclinic/customers/web/PetResourceTest.java) — shouldGetAPetInJSonFormat.

### E15

- [spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java) — Due scenari getOwnerDetails.
- [spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/application/VisitsServiceClientIntegrationTest.java](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/application/VisitsServiceClientIntegrationTest.java) — getVisitsForPets_withAvailableVisitsService.

### E16

- [spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java](../../spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java) — shouldFetchVisits.

### E17

- [spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java](../../spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java) — shouldGetAListOfVets.

### E18

- [docker-compose.yml](../../docker-compose.yml) — Servizi e dipendenze.
- [docker/prometheus/prometheus.yml](../../docker/prometheus/prometheus.yml) — Scrape e target.
- [.github/workflows/maven-build.yml](../../.github/workflows/maven-build.yml) — Build CI.
- [spring-petclinic-admin-server/src/main/java/org/springframework/samples/petclinic/admin/SpringBootAdminApplication.java](../../spring-petclinic-admin-server/src/main/java/org/springframework/samples/petclinic/admin/SpringBootAdminApplication.java) — Bootstrap Admin.

## Fatti, deduzioni e informazioni non determinabili

**Fatti verificati nel sorgente:** percorsi dei controller e UI, annotazioni di validazione, fallback, tool disponibili, vincoli SQL, configurazioni locali e assert dei test citati. Non sono fatti di produzione.

**Deduzioni da confermare:** l'operatore di clinica come utilizzatore principale; necessità di riconciliazione manuale dopo esito incerto; impatto effettivo su utenti dei difetti di form/intercettore. Sono ricavate dai flussi, senza ricerca utenti o prove browser.

**Non determinabile:** deployment attivo, configurazione remota applicata, ruoli organizzativi, protezioni esterne, isolamento effettivo memoria AI, disponibilità provider, aggiornamento dell'indice, backup, retention, carichi e livelli di servizio. L'assenza di evidenze non dimostra assenza di funzioni fuori da questo repository.

## Contraddizioni e anomalie osservate

| ID | Evidenza e divergenza | Impatto |
|---|---|---|
| A01 | UI telefono esattamente 12, API massimo 12, tool testuale 10 (R01) | Dati accettati differenti secondo canale |
| A02 | Owner wildcard per animali/visite e ID corpo in modifica animale (R03–R04) | Contesto UI non garantito dal backend |
| A03 | Fallback Visits restituisce successo con visite vuote (R05) | Assenza dati confondibile con indisponibilità |
| A04 | Prompt chat menziona visite, ma nessun tool le recupera; DTO non basta (E09–E10) | Non promettere consultazione clinica completa tramite chat |
| A05 | Commento “10 previous messages” associato a `.order(10)` (E09) | Durata della memoria non documentabile con quel numero |
| A06 | README punta a `spring-petclinic-ui/`, assente; UI effettiva nel Gateway (E01, E06) | Percorsi di manutenzione documentati non aggiornati |
| A07 | README descrive una chiave demo gratuita, ma il repository prova solo un fallback di configurazione (E01, E12) | Non è prova di accesso utilizzabile al provider; nessuna verifica commerciale esterna svolta |
| A08 | Form senza nome atteso nei messaggi, intercettore fragile (R12) | Messaggi e navigazione dopo errore da provare |
| A09 | FK visite–animali presente MySQL, assente HSQLDB (E13) | Vincoli diversi in ambienti diversi |
| A10 | Indice classpath prioritario, nessun refresh e caricamento tramite file (E11) | Freschezza e comportamento da JAR da verificare |

## Domande non bloccanti per business e Product Owner

| Priorità | Domanda | Collegamento |
|---|---|---|
| Alta | Chi deve poter vedere e modificare quali anagrafiche? Sono previste organizzazioni separate? | R14, S33 |
| Alta | Le scritture AI devono richiedere una conferma esplicita? Come riconciliare esiti incerti e duplicati? | R06–R07, S24, S32 |
| Alta | L'assenza delle visite durante indisponibilità deve essere distinguibile da un elenco realmente vuoto? | R05, S13 |
| Alta | La visita rappresenta un evento passato o una prenotazione? Sono richiesti veterinario, stato o correzione/cancellazione? | F05, R13 |
| Media | Qual è il formato telefono corretto e quali campi devono essere obbligatori anche per le API? | R01–R02, S05 |
| Media | Quali regole valgono per appartenenza animale, trasferimenti e ID incongruenti? | R03–R04, S10 |
| Media | Quale sorgente/configurazione governa il database operativo e quali garanzie di conservazione sono richieste? | E12–E13, S19 |
| Media | Con quale frequenza deve aggiornarsi l'indice veterinari e come si comunica la parzialità dei risultati AI? | R09–R11 |
| Media | Come devono essere isolate e conservate conversazioni e log, e chi può consultarli? | R10, S27 |
| Bassa | Quali messaggi, stati vuoti e conferme di successo servono agli operatori? | R12, S31 |

Queste domande non hanno impedito la documentazione dello stato attuale. Eventuali miglioramenti — conferma scritture AI, avviso dati incompleti, validazioni uniformi, controlli di appartenenza, deduplicazione e storico — sono proposte da valutare separatamente, non requisiti approvati né modifiche implementate da COG-156.
