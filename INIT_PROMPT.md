# Prompt iniziale per Codex App

Usa questo prompt per avviare una sessione hands-on su questo repository.

---

Sei Codex App dentro il repository Spring Petclinic Microservices. Prima di proporre o modificare file, orientati leggendo solo evidenze reali del repository.

## File da leggere all'inizio

Leggi questi file in quest'ordine:

1. `README.md`
2. `pom.xml`
3. `docker-compose.yml`
4. `docs/BOOTSTRAP.md`
5. `docs/handson-prompts/01-repo-briefing.md`
6. `docs/handson-prompts/02-backend-documentation.md`
7. `docs/handson-prompts/03-frontend-documentation.md`
8. `docs/handson-prompts/04-runbook-operativo.md`
9. `docs/handson-prompts/05-local-agents-contract.md`
10. `docs/handson-prompts/06-backlog-hands-on.md`

Poi, in base alla modifica richiesta, leggi i file del modulo coinvolto prima di editare. Per il primo esercizio consigliato sui veterinari parti da:

- `spring-petclinic-vets-service/pom.xml`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/VetRepository.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java`
- `spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java`
- `spring-petclinic-api-gateway/pom.xml`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html`

## Come interpretare il progetto

Interpreta il repository come un progetto Maven multi-modulo basato su Spring Boot, Spring Cloud e Java 17.

- `spring-petclinic-api-gateway` e' sia API Gateway sia frontend AngularJS legacy servito come risorsa statica.
- `spring-petclinic-customers-service`, `spring-petclinic-vets-service`, `spring-petclinic-visits-service` e `spring-petclinic-genai-service` sono servizi applicativi backend.
- `spring-petclinic-config-server` e `spring-petclinic-discovery-server` sono servizi di supporto necessari nel flusso locale standard senza Docker.
- `spring-petclinic-admin-server`, Zipkin, Prometheus e Grafana sono componenti operativi o di observability.
- Il frontend non ha una toolchain Node separata: HTML, CSS e AngularJS sono sotto `spring-petclinic-api-gateway/src/main/resources/static`.

## Vincoli di lavoro

- Non inventare architettura, endpoint, dati o comportamenti runtime: usa solo file presenti nel repository.
- Mantieni le modifiche piccole, mirate e coerenti con gli stili esistenti.
- Non introdurre Docker, MySQL, observability o GenAI provider se la feature non li richiede.
- Usa HSQLDB come default locale; considera MySQL solo se la richiesta cita il profilo `mysql` o persistenza.
- Se cambi contratti API, flussi di startup, UI o validazione, aggiorna anche la documentazione pertinente quando esiste.
- Non committare credenziali, chiavi API o output locali.
- Non usare dati fittizi nei comportamenti applicativi. Per test e demo usa i seed reali in:
  - `spring-petclinic-customers-service/src/main/resources/db/hsqldb/data.sql`
  - `spring-petclinic-vets-service/src/main/resources/db/hsqldb/data.sql`
  - `spring-petclinic-visits-service/src/main/resources/db/hsqldb/data.sql`

## Come distinguere le aree

- Core app: dominio Petclinic, controller REST, repository, DTO, route gateway e UI AngularJS per owners, pets, vets e visits.
- Observability e runtime: `docker-compose.yml`, directory `docker/`, Zipkin, Prometheus, Grafana, Spring Boot Admin, Actuator, script in `scripts/`.
- GenAI: `spring-petclinic-genai-service` e il widget chat in `spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js`.

Tratta GenAI come area separata: non richiedere credenziali OpenAI o Azure OpenAI per validare una modifica frontend non GenAI. Tratta observability come opzionale salvo richiesta esplicita.

## Validazione backend

Per modifiche backend, esegui il test piu' stretto che prova il comportamento:

- Gateway: `./mvnw -pl spring-petclinic-api-gateway test`
- Customers: `./mvnw -pl spring-petclinic-customers-service test`
- Vets: `./mvnw -pl spring-petclinic-vets-service test`
- Visits: `./mvnw -pl spring-petclinic-visits-service test`
- GenAI: `./mvnw -pl spring-petclinic-genai-service test`

Se tocchi piu' moduli, esegui i test dei moduli toccati. Usa `./mvnw test` solo quando la modifica attraversa contratti comuni o quando serve una verifica ampia.

## Validazione frontend

Per modifiche al frontend AngularJS sotto `spring-petclinic-api-gateway/src/main/resources/static`:

- verifica staticamente controller, component, template e URL chiamati;
- se possibile, avvia il gateway con i servizi necessari e verifica il flusso nel browser;
- se la verifica browser non e' possibile, dichiaralo nel final answer e spiega quale controllo statico hai fatto.

Per modifiche CSS/SCSS o alla shell `index.html`, controlla anche che gli asset referenziati esistano.

## Da quale feature partire

Se la sessione e' aperta e devi scegliere una prima feature, parti dal filtro veterinari per nome o specialita'. E' una feature piccola e didattica perche' attraversa:

- repository e controller del modulo `spring-petclinic-vets-service`;
- test `VetResourceTest`;
- controller e template AngularJS della pagina veterinari nel gateway.

Comportamento atteso: `GET /vets` continua a restituire la lista completa senza parametri; con parametri realistici filtra in modo coerente sui dati seed; la UI consente la ricerca senza rompere la tabella esistente.

## Come scrivere il final answer

Nel final answer:

- dichiara prima l'esito;
- elenca i file modificati;
- indica i test o le validazioni eseguite con i comandi esatti;
- dichiara cosa non hai validato, specialmente browser, Docker, observability e provider GenAI;
- se c'e' un blocco reale, descrivilo in modo concreto e riproducibile.

Non dire di aver avviato servizi, browser, Docker o provider GenAI se non lo hai fatto davvero.
