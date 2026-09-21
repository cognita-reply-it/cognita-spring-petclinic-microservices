# Scenari di verifica e tracciabilità

[Torna all'indice](README.md). **Gli scenari sotto sono descritti, non eseguiti in questa analisi.** «Test esistente» significa copertura nel sorgente del test, non esito di una nuova esecuzione. Per le verifiche realmente svolte vedere [attendibilità](attendibilita.md).

## Scenari funzionali

Usare esclusivamente dati sintetici e un ambiente isolato. Esempio anagrafica: nome «Persona», cognome «Esempio», indirizzo «Via Test», città «Città Demo», telefono composto da 12 cifre sintetiche. Non utilizzare dati personali. Dove si citano A e B, creare due record distinti di test. «Derivato» indica un risultato ricostruito dal codice; «da confermare» indica un esito ambientale o un requisito non stabilito.

| ID / funzione | Precondizioni e dati | Azione/evento | Risultato atteso verificabile | Evidenza/stato |
|---|---|---|---|---|
| S-01 / F-01 | Due proprietari sintetici con nomi diversi | Aprire elenco, digitare filtro, svuotarlo | Filtro applicato senza nuova ricerca HTTP; svuotando tornano le righe | Derivato E-02/E-03 |
| S-02 / F-02 | Dati validi, nessun ID | Inviare form nuovo; poi modificare città dal dettaglio | POST 201 e ritorno elenco; PUT 204 e città aggiornata rileggendo; ID stabile | Derivato E-03; scritture non coperte dai test letti |
| S-03 / F-02 | Altri campi validi; telefono di 10 cifre, poi 12, poi 13 | Confrontare invio form e richiesta diretta API | 10 incompatibile con pattern UI ma compatibile con vincolo backend; 12 compatibile; 13 rifiutato dal vincolo backend | Derivato R-02; presentazione degli errori da provare |
| S-04 / F-02 | Campo nome vuoto/spazi; ID di modifica inesistente | POST invalido; PUT valido verso ID assente | Violazione NotBlank sul primo; 404 sul secondo; nessun salvataggio del percorso normale | Derivato E-03 |
| S-05 / F-03 | Proprietario e tipo esistenti | Aggiungere animale, rileggerlo, cambiare nome/tipo | 201 poi lettura JSON coerente, PUT 204 e dati aggiornati | Derivato; sola lettura JSON in `PetResourceTest.shouldGetAPetInJSonFormat` |
| S-06 / F-03 | Animale A e B; corpo con ID B, URL con ID A e proprietario non coerente | PUT in ambiente isolato | Il controller seleziona B dal corpo senza verifica del proprietario; accertare B aggiornato e A invariato | Derivato E-04; è caratterizzazione dell'anomalia, non requisito di permesso |
| S-07 / F-03 | Proprietario assente; poi proprietario valido e tipo inesistente | POST animale nei due casi | Primo 404; secondo nessun errore funzionale tipo dedicato, possibile errore persistente; documentare status reale | Derivato primo, secondo da confermare; E-04 |
| S-08 / F-04 | Proprietario con due animali e visite con petId distinti | GET dettaglio | Ogni visita appare solo sotto il proprio animale | Test esistente `ApiGatewayControllerTest.getOwnerDetails_withAvailableVisitsService`, dipendenze mock |
| S-09 / F-04 | Customers disponibile, Visits simulato in errore | GET dettaglio | 200, dati proprietario/animale presenti e lista visite vuota | Test esistente `getOwnerDetails_withServiceError`; nessun banner nel template |
| S-10 / F-04 | Customers in errore, poi proprietario senza animali | GET dettaglio nei due casi | Primo senza fallback proprietario; secondo verificare risposta alla lista petId vuota senza inventare 404/200 | Da confermare runtime, E-05 |
| S-11 / F-05 | Animale sintetico esistente | Aprire visite, inviare data/descrizione, rileggere | 201, petId dal percorso, nuova visita nel dettaglio; nessuna notifica o assegnazione medico nel flusso | Derivato E-06 |
| S-12 / F-05 | Richiesta diretta con descrizione vuota, 8192 e 8193 caratteri | Tre POST isolati | Vuota compatibile col backend ma non con required UI; 8192 compatibile; 8193 viola Size | Derivato E-06; data/null da caratterizzare separatamente |
| S-13 / F-05 | petId inesistente; DB HSQLDB e MySQL isolati con schemi verificati | POST visita; ripetere con segmento proprietario diverso | Nessuna chiamata Customers dal controller; integrità dipende dal profilo, MySQL può rifiutare FK; proprietario non controllato | Derivato/da confermare persistenza; E-06 |
| S-14 / F-05 | Visite simulate per petId 111 e 222 | GET `/pets/visits?petId=111,222` | Oggetto items con tre visite e corretti petId nella fixture | Test esistente `VisitResourceTest.shouldFetchVisits`, repository mock |
| S-15 / F-06 | Veterinario simulato con ID 1 | GET `/vets`; UI con specialità vuota | Lista con ID 1; cella specialità vuota nel template | Test esistente `VetResourceTest.shouldGetAListOfVets` per API; UI derivata |
| S-16 / F-07 | Chat disponibile; messaggio vuoto poi testo; provider sostituibile | Inviare, poi simulare errore provider/rete | Vuoto non inviato; testo mostrato subito; errore reso come messaggio; nessuno streaming | Derivato E-08/E-09; nessun test GenAI presente |
| S-17 / F-07 | Dati isolati, tool/provider controllato | Richiedere creazione proprietario; simulare errore dopo salvataggio; rileggere dati | Possibile record presente nonostante testo d'errore; nessuna compensazione o conferma applicativa | Scenario di caratterizzazione da confermare; E-09 |
| S-18 / F-07 | Indice controllato con oltre 50 documenti | Invocare ricerca con richiesta null, poi oggetto non null | topK impostato rispettivamente 50 e 20; non promettere conteggio completo | Derivato `AIDataProvider.getVets`; risposta linguistica non deterministica |
| S-19 / F-07 | Chat con messaggi sintetici | Ricaricare pagina; inviare da due sessioni distinte | HTML visibile ripristinato dal localStorage della stessa origine; isolamento memoria server da verificare | Derivato browser, isolamento da confermare; E-08/E-09 |
| S-20 / F-08 | Avvio con indice incluso, poi senza, provider simulato | Avviare nei due casi; provare anche JAR | Primo carica file senza lettura Vets; secondo legge Vets e indicizza; verificare getFile nel JAR | Derivato/da confermare packaging; E-10 |
| S-21 / F-02/F-03/F-05 | Ambiente isolato; stessa richiesta di creazione ripetuta | Doppio invio e simulazione 503 gateway | Nessuna deduplicazione esplicita; misurare numero record e richieste, senza presumere una sola creazione | Caratterizzazione proposta E-01/E-03/E-04/E-06 |
| S-22 / F-03/F-09 | API raggiungibile in ambiente di test, nessun login | Leggere animale con segmento proprietario diverso | Nessun controllo identità/appartenenza nel controller; distinguere eventuale blocco di rete esterno | Derivato E-04; non è approvazione di esposizione pubblica |
| S-23 / F-09 | Config/discovery di test non disponibili | Avvio profilo docker e richiesta dipendente | Registrare fallimento configurazione/risoluzione e impatto sui flussi; nessuna garanzia di recupero automatico | Da confermare ambiente, E-11 |
| S-24 / F-01–F-06 | Risposta d'errore con e senza array errors | Invocare una schermata AngularJS | Con array il codice prepara alert; senza array verificare errore JS; controllare se parte il callback di successo | Caratterizzazione proposta E-02 |

Proposte che richiedono approvazione business: rifiutare ogni accesso non appartenente all'utente, impedire doppie creazioni, avvisare delle visite mancanti e chiedere conferma prima dei tool. Non sono risultati attesi dell'implementazione attuale e non vengono confusi con gli scenari sopra.

## Matrice di tracciabilità

| Funzione | Regole | Diagrammi | Scenari | Evidenze |
|---|---|---|---|---|
| F-01 | R-01 | D-01, D-02 | S-01, S-24 | E-02, E-03 |
| F-02 | R-02, R-12 | D-02, D-04 | S-02–S-04, S-17, S-21, S-24 | E-01, E-03, E-09 |
| F-03 | R-03, R-04, R-12 | D-02, D-04, D-06 | S-05–S-07, S-21, S-22, S-24 | E-01, E-04, E-09, E-12 |
| F-04 | R-05 | D-03 | S-08–S-10, S-24 | E-05, E-12 |
| F-05 | R-06, R-07, R-12 | D-02, D-03, D-06 | S-11–S-14, S-21, S-24 | E-01, E-06, E-12 |
| F-06 | R-08 | D-01, D-06 | S-15, S-24 | E-07, E-12 |
| F-07 | R-09, R-10 | D-04 | S-16–S-19 | E-08, E-09 |
| F-08 | R-11 | D-05 | S-20 | E-10 |
| F-09 | R-12 | D-01 | S-21–S-23 | E-01, E-11, E-12 |

I diagrammi sono in [processi-dati](processi-dati.md), le schede in [funzionalita](funzionalita.md), le regole in [regole-integrazioni](regole-integrazioni.md). Il registro seguente usa link relativi al repository e simboli, più stabili delle righe dopo modifiche future.

## Registro delle evidenze

### E-01 — Struttura e ingresso

- [pom.xml](../../pom.xml)
- [spring-petclinic-api-gateway/src/main/resources/application.yml](../../spring-petclinic-api-gateway/src/main/resources/application.yml)
- [spring-petclinic-api-gateway/pom.xml](../../spring-petclinic-api-gateway/pom.xml)

### E-02 — UI comune

- [spring-petclinic-api-gateway/src/main/resources/static/index.html](../../spring-petclinic-api-gateway/src/main/resources/static/index.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/app.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/app.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/nav.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/nav.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/httpErrorHandlingInterceptor.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/httpErrorHandlingInterceptor.js)

### E-03 — Proprietari

Simboli: createOwner, findOwner, findAll, updateOwner, map, getPets; submitOwnerForm e filtro nel template.

- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerRequest.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerRequest.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/mapper/OwnerEntityMapper.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/mapper/OwnerEntityMapper.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Owner.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Owner.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/OwnerRepository.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/OwnerRepository.java)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.component.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.component.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.template.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.component.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.component.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.component.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.component.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html)

### E-04 — Animali

Simboli: processCreationForm, processUpdateForm, save, findPet, findPetById, findPetTypes; vincoli PetRequest e schema.

- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetResource.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetResource.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetRequest.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetRequest.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetDetails.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetDetails.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Pet.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Pet.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetRepository.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetRepository.java)
- [spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetType.java](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetType.java)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.component.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.component.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.template.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.js)
- [spring-petclinic-customers-service/src/main/resources/db/hsqldb/schema.sql](../../spring-petclinic-customers-service/src/main/resources/db/hsqldb/schema.sql)
- [spring-petclinic-customers-service/src/main/resources/db/mysql/schema.sql](../../spring-petclinic-customers-service/src/main/resources/db/mysql/schema.sql)

### E-05 — Aggregazione

Simboli: getOwnerDetails, addVisitsToOwner, emptyVisitsForPets, getVisitsForPets, fallback.

- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java)
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java)
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java)
- [spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/FallbackController.java](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/FallbackController.java)

### E-06 — Visite

Simboli: create, entrambe le overload read, findByPetId e findByPetIdIn; Visit.date/description/petId.

- [spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java)
- [spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/Visit.java](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/Visit.java)
- [spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/VisitRepository.java](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/VisitRepository.java)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.component.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.component.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.template.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js)
- [spring-petclinic-visits-service/src/main/resources/db/hsqldb/schema.sql](../../spring-petclinic-visits-service/src/main/resources/db/hsqldb/schema.sql)
- [spring-petclinic-visits-service/src/main/resources/db/mysql/schema.sql](../../spring-petclinic-visits-service/src/main/resources/db/mysql/schema.sql)

### E-07 — Veterinari

Simboli: showResourcesVetList, getSpecialties; CacheConfig e VetsProperties.

- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java)
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Vet.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Vet.java)
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Specialty.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Specialty.java)
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/CacheConfig.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/CacheConfig.java)
- [spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/VetsProperties.java](../../spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/VetsProperties.java)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.js)
- [spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.component.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.component.js)
- [spring-petclinic-vets-service/src/main/resources/db/hsqldb/schema.sql](../../spring-petclinic-vets-service/src/main/resources/db/hsqldb/schema.sql)
- [spring-petclinic-vets-service/src/main/resources/db/mysql/schema.sql](../../spring-petclinic-vets-service/src/main/resources/db/mysql/schema.sql)

### E-08 — Chat browser

- [spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js](../../spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js)

### E-09 — Chat e tool

Simboli: exchange, listOwners, addOwnerToPetclinic, addPetToOwner, listVets, getVets, getCustomerServiceUri.

- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java)
- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicTools.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicTools.java)
- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIDataProvider.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIDataProvider.java)
- [spring-petclinic-genai-service/pom.xml](../../spring-petclinic-genai-service/pom.xml)
- [spring-petclinic-genai-service/src/main/resources/application.yml](../../spring-petclinic-genai-service/src/main/resources/application.yml)

### E-10 — Indice

Simboli: loadVetDataToVectorStoreOnStartup, convertListToJsonResource, vectorStore. Il file indice è verificato come risorsa presente, non come contenuto clinico aggiornato.

- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/VectorStoreController.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/VectorStoreController.java)
- [spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIBeanConfiguration.java](../../spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIBeanConfiguration.java)
- [spring-petclinic-genai-service/src/main/resources/vectorstore.json](../../spring-petclinic-genai-service/src/main/resources/vectorstore.json)

### E-11 — Supporto operativo

- [docker-compose.yml](../../docker-compose.yml)
- [spring-petclinic-visits-service/src/main/resources/application.yml](../../spring-petclinic-visits-service/src/main/resources/application.yml)
- [spring-petclinic-config-server/src/main/resources/application.yml](../../spring-petclinic-config-server/src/main/resources/application.yml)
- [spring-petclinic-api-gateway/src/main/resources/application.yml](../../spring-petclinic-api-gateway/src/main/resources/application.yml)
- [spring-petclinic-customers-service/src/main/resources/application.yml](../../spring-petclinic-customers-service/src/main/resources/application.yml)
- [spring-petclinic-discovery-server/src/main/resources/application.yml](../../spring-petclinic-discovery-server/src/main/resources/application.yml)
- [spring-petclinic-vets-service/src/main/resources/application.yml](../../spring-petclinic-vets-service/src/main/resources/application.yml)
- [spring-petclinic-admin-server/src/main/resources/application.yml](../../spring-petclinic-admin-server/src/main/resources/application.yml)
- [spring-petclinic-genai-service/src/main/resources/application.yml](../../spring-petclinic-genai-service/src/main/resources/application.yml)
- [spring-petclinic-visits-service/src/main/resources/logback-spring.xml](../../spring-petclinic-visits-service/src/main/resources/logback-spring.xml)
- [spring-petclinic-api-gateway/src/main/resources/logback-spring.xml](../../spring-petclinic-api-gateway/src/main/resources/logback-spring.xml)
- [spring-petclinic-customers-service/src/main/resources/logback-spring.xml](../../spring-petclinic-customers-service/src/main/resources/logback-spring.xml)
- [spring-petclinic-vets-service/src/main/resources/logback-spring.xml](../../spring-petclinic-vets-service/src/main/resources/logback-spring.xml)
- [spring-petclinic-admin-server/src/main/resources/logback-spring.xml](../../spring-petclinic-admin-server/src/main/resources/logback-spring.xml)
- [spring-petclinic-genai-service/src/main/resources/logback-spring.xml](../../spring-petclinic-genai-service/src/main/resources/logback-spring.xml)
- [docker/prometheus/prometheus.yml](../../docker/prometheus/prometheus.yml)
- [docker/grafana/provisioning](../../docker/grafana/provisioning)
- [spring-petclinic-admin-server/pom.xml](../../spring-petclinic-admin-server/pom.xml)
- [spring-petclinic-admin-server/src/main/java/org/springframework/samples/petclinic/admin/SpringBootAdminApplication.java](../../spring-petclinic-admin-server/src/main/java/org/springframework/samples/petclinic/admin/SpringBootAdminApplication.java)
- [spring-petclinic-discovery-server/src/main/java/org/springframework/samples/petclinic/discovery/DiscoveryServerApplication.java](../../spring-petclinic-discovery-server/src/main/java/org/springframework/samples/petclinic/discovery/DiscoveryServerApplication.java)
- [spring-petclinic-config-server/src/main/java/org/springframework/samples/petclinic/config/ConfigServerApplication.java](../../spring-petclinic-config-server/src/main/java/org/springframework/samples/petclinic/config/ConfigServerApplication.java)

### E-12 — Test e limiti

Mock MVC e client non verificano DB né browser. Otto classi di test concrete, nove metodi @Test; nessun src/test GenAI/Admin rilevato.

- [spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java](../../spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java)
- [spring-petclinic-config-server/src/test/java/org/springframework/samples/petclinic/config/PetclinicConfigServerApplicationTests.java](../../spring-petclinic-config-server/src/test/java/org/springframework/samples/petclinic/config/PetclinicConfigServerApplicationTests.java)
- [spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/ApiGatewayApplicationTests.java](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/ApiGatewayApplicationTests.java)
- [spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/application/VisitsServiceClientIntegrationTest.java](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/application/VisitsServiceClientIntegrationTest.java)
- [spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java)
- [spring-petclinic-customers-service/src/test/java/org/springframework/samples/petclinic/customers/web/PetResourceTest.java](../../spring-petclinic-customers-service/src/test/java/org/springframework/samples/petclinic/customers/web/PetResourceTest.java)
- [spring-petclinic-discovery-server/src/test/java/org/springframework/samples/petclinic/discovery/DiscoveryServerApplicationTests.java](../../spring-petclinic-discovery-server/src/test/java/org/springframework/samples/petclinic/discovery/DiscoveryServerApplicationTests.java)
- [spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java](../../spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java)
- [docs/agent-readiness/checks.md](../../docs/agent-readiness/checks.md)
- [.github/workflows/maven-build.yml](../../.github/workflows/maven-build.yml)
