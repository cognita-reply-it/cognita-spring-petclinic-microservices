# COG-316 — consultazione visite: evidenze e blocco implementativo

Stato al 2026-09-23: **implementazione bloccata**, contratto CRM non concordato e controlli di accesso nell'ambiente autorizzato non verificati. Questa consegna documenta la preparazione; non realizza né abilita l'integrazione. Ticket: [COG-316](https://linear.app/cognita-reply/issue/COG-316/realizzare-la-consultazione-autorizzata-delle-visite-nel-sistema).

## Evidenza nella revisione corrente

Revisione esaminata: `ad874c63673aaf6d1407ff359703481e85f473f4`, sincronizzata con `origin/main`. Il grafo locale indicizza la stessa revisione; consultati health, ricerca, relazioni di `getOwnerDetails` e cambi recenti. La ricerca iniziale era limitata a 8 risultati su 37; le 9 relazioni del metodo erano complete. Le conclusioni sotto derivano dai file, non dalla sola ricerca nel grafo.

- [ApiGatewayController](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java): GET `/api/gateway/owners/{ownerId}` legge il proprietario, ricava gli ID dei suoi animali, richiede le visite e le associa per `petId`. Il circuito `getOwnerDetails` sostituisce gli errori delle visite con `emptyVisitsForPets`, senza indicatore di guasto. Non verifica identità o diritto dell'operatore prima della lettura del proprietario.
- [CustomersServiceClient](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java) chiama GET `/owners/{ownerId}`; [VisitsServiceClient](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java) chiama GET `/pets/visits?petId=…`. I metodi esaminati non trasmettono una prova esplicita di autorizzazione del singolo operatore.
- [Owner](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Owner.java) possiede la relazione con gli animali; [Pet](../../spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Pet.java) ha `owner_id`. [OwnerDetails](../../spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/OwnerDetails.java) espone anche nome, cognome, indirizzo, città e telefono: non è una proiezione minima per la consultazione CRM.
- [VisitResource](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java) legge per ID animale o lista di ID. Il segmento `owners/*` non verifica il proprietario; il servizio espone anche una creazione POST. [Visit](../../spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/Visit.java) contiene ID, `petId`, data clinica e descrizione. Non contiene istante di lettura riuscita, copia CRM o prova di sincronizzazione.
- [ApiGatewayControllerTest](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java) prevede espressamente 200 e visite vuote dopo `ConnectException`. [VisitsServiceClientIntegrationTest](../../spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/application/VisitsServiceClientIntegrationTest.java) copre una risposta disponibile con MockWebServer; [VisitResourceTest](../../spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java) verifica una lettura multipla con repository simulato. Questi test non provano autorizzazione né isolamento tra operatori/proprietari.

Il contratto effettivo attuale è quindi un'aggregazione demo che può nascondere un guasto. Non esiste in questa consegna un contratto CRM effettivo. Le osservazioni sul codice non attestano i controlli eventualmente presenti nel deployment esterno.

## Prerequisiti da concordare prima del codice

Nessun accordo, credenziale operatore, ambiente di verifica autorizzato o mapping CRM è allegato al ticket corrente. La ricerca nel repository di CRM, Salesforce e configurazioni/annotazioni comuni di Spring Security non ha restituito evidenze. Company Knowledge è dichiarata non associata dal contesto Maestro; il tool `company-knowledge.catalog` non è disponibile nella discovery runtime. Nessuna evidenza aziendale è stata recuperata: ciò non prova l'assenza di documenti esterni.

| Responsabilità da confermare | Decisione / prova richiesta | Stato |
|---|---|---|
| Team CRM e responsabile Customers | Mapping univoco dell'identificativo CRM al proprietario Petclinic; comportamento per mapping assente/ambiguo | Non concordato |
| Responsabile identità e team CRM | Prova verificabile dell'identità del singolo operatore, validità/revoca e diritto a consultare quel proprietario; credenziale del sistema chiamante separata dal diritto dell'operatore | Non verificato |
| Responsabile ambiente | Ambiente autorizzato, revisione configurazione, punti di ingresso e controlli anche sui percorsi diretti ai servizi; prove con soli dati sintetici | Non fornito |
| Team CRM e responsabili Gateway/Visits | Percorso/versione API, campi indispensabili, eventuale esposizione della descrizione clinica, limiti di animali/visite/risposta, ordinamento e completezza/paginazione | Non concordato |
| Team CRM e responsabile Gateway | Codici HTTP e applicativi per visite presenti, vuoto valido, diniego, guasto, timeout; identità mancante/invalida e proprietario inesistente senza rivelazioni improprie | Non concordato |
| Responsabili dei servizi | Budget timeout per fase e complessivo, gestione circuito aperto/errori/malformed response e politica retry | Non concordato |
| Team CRM e responsabile dati | Provenienza e formato dell'istante di lettura riuscita, semantica di una lettura attraverso servizi distinti | Non concordato |

Il ticket richiede esplicitamente di implementare **solo dopo** contratto e controlli verificati. Non introdurre un header fidato, una mappa statica operatore/proprietario o gli ID animali come sostituti di tali prove. Salesforce, la sua vista e la sua configurazione restano fuori perimetro.

## Vincoli della futura implementazione

Dopo la chiusura dei prerequisiti, preferire un percorso dedicato di sola lettura, da confermare nel contratto. Validare identità e diritto sul proprietario prima di leggere Customers; derivare gli animali dalla relazione autorevole e restituire solo le loro visite. Gli ID forniti dal chiamante non sono prova di accesso. Definire la gestione di risposte estranee o incomplete senza dichiarare un successo vuoto.

La risposta deve distinguere successo con visite, successo vuoto, diniego, guasto e timeout. Il fallback dell'aggregazione corrente non può essere usato come prova di assenza di visite. Emettere l'istante di lettura soltanto dopo il completamento riuscito di tutte le letture necessarie; non usare la data clinica come freschezza e non promettere uno snapshot atomico tra servizi. Nessuno stato «dato non aggiornato» è giustificato senza una copia e una sincronizzazione verificate. Non esporre anagrafica superflua o operazioni di modifica.

## Matrice di accettazione da eseguire dopo lo sblocco

Fixture esclusivamente sintetiche: proprietario A=101 con animale 1001/visita 5001; proprietario B=202 con animale 2002/visita 6002; operatore OA autorizzato solo ad A, OB solo a B. I numeri sono fixture, non mapping CRM.

| Caso | Risultato da verificare nel contratto e nei componenti |
|---|---|
| OA legge A, visita presente | Solo visita 5001; provenienza concordata e istante dopo successo; nessuna anagrafica extra |
| OA legge A, elenco visite realmente vuoto | Esito di assenza valida con istante di successo; distinguibile dal guasto |
| Proprietario autorizzato senza animali | Vuoto valido dopo lettura Customers riuscita; nessuna richiesta visite con lista vuota ambigua |
| OA tenta B o fornisce animale 2002 | Diniego prima della lettura di proprietario/animali/visite; nessun dato di B né istante di successo |
| Identità assente, non valida o revocata | Diniego secondo contratto; nessuna chiamata ai client dei dati |
| Risposta Visits contiene anche visita 6002 per OA/A | Nessuna visita estranea in uscita; gestione dell'anomalia secondo contratto |
| Errore Customers o Visits / circuito aperto / risposta incompleta | Esito di guasto, mai «nessuna visita», nessun istante di successo |
| Timeout Customers o Visits | Esito timeout distinto entro budget; nessun payload parziale di successo né istante di successo |
| Data clinica molto vecchia, lettura riuscita oggi | Data clinica preservata; istante di lettura separato; nessuno stato stale inventato |
| Verifica integrata dell'ambiente | Ripetere presenza, vuoto, diniego, guasto e timeout attraverso identità reale di test e routing autorizzato; verificare bypass diretti e assenza di scritture |

Le prove di errore e timeout devono includere l'asserzione negativa sul timestamp e sulla classificazione «vuoto». Il test attuale del fallback è una riproduzione del rischio, non un test di accettazione del percorso CRM. I test nuovi restano da scrivere dopo la definizione del contratto; nessuna delle righe sopra è dichiarata superata.

## Handoff e validazione

Modifica prevista: solo questo documento, senza cambi a codice, dipendenze, autenticazione, configurazione o comportamento. Il workpad Linear conserva commit, PR e stato dei controlli. Il prossimo passo implementativo richiede evidenza dell'accordo CRM e della verifica d'accesso, poi codice e prove della matrice; l'attivazione CRM richiede le prove integrate. Una revisione o merge di questa nota non completa la funzionalità.

Controlli locali del 2026-09-23:

- `./mvnw -B -pl spring-petclinic-api-gateway -Dtest=ApiGatewayControllerTest test`: primo tentativo exit 1, Java non disponibile nel PATH/JAVA_HOME. Il JDK x86_64 trovato localmente non era eseguibile nel worker ARM64 (exit 255).
- `JAVA_HOME=/opt/project/logs/cog-172/jdk-arm64 ./mvnw -B -pl spring-petclinic-api-gateway -Dtest=ApiGatewayControllerTest test`: exit 0, 2 test, 0 errori/fallimenti/skipped. Log runtime: `/opt/project/logs/COG-316-gateway-baseline.log`. Config Server locale opzionale non disponibile: questi sono test con client simulati, non prove integrate.
- `python3 scripts/check-agent-docs.py`: exit 0 (13 documenti del perimetro agent-readiness, 8 moduli); i link relativi di questa nuova nota sono verificati separatamente.
- `git diff --check`: exit 0. Nessuna nuova prova di autorizzazione o ambiente CRM eseguita.
