# Spring Petclinic Microservices: briefing operativo

Questo repository contiene la versione a microservizi della Spring Petclinic sample application. Il `README.md` la presenta come esempio di suddivisione di una stessa applicazione in servizi Spring Boot, con Spring Cloud per gateway, configurazione e service discovery.

## Componenti da conoscere

Il `pom.xml` root aggrega otto moduli:

| Modulo | Ruolo documentato |
| --- | --- |
| `spring-petclinic-config-server` | Configurazione centralizzata. |
| `spring-petclinic-discovery-server` | Registro dei servizi basato su Eureka. |
| `spring-petclinic-api-gateway` | Gateway e punto di accesso del frontend AngularJS. |
| `spring-petclinic-customers-service` | Gestione dei dati dei clienti. |
| `spring-petclinic-vets-service` | Gestione delle informazioni sui veterinari. |
| `spring-petclinic-visits-service` | Gestione delle visite degli animali. |
| `spring-petclinic-genai-service` | Interfaccia chatbot dell'applicazione. |
| `spring-petclinic-admin-server` | Spring Boot Admin server. |

Lo stack di Compose aggiunge inoltre `tracing-server` (immagine Zipkin), `grafana-server` e `prometheus-server`.

## Porte pubblicate

Quando si usa `docker compose`, `docker-compose.yml` pubblica le porte seguenti sul computer host:

| Porta host | Componente |
| --- | --- |
| `8080` | API Gateway / frontend AngularJS |
| `8081` | Customers service |
| `8082` | Visits service |
| `8083` | Vets service |
| `8084` | GenAI service |
| `8761` | Discovery server (Eureka) |
| `8888` | Config server |
| `9090` | Admin server |
| `9411` | Tracing server / Zipkin |
| `3030` | Grafana (mappata alla porta container `3000`) |
| `9091` | Prometheus (mappata alla porta container `9090`) |

Per l'avvio locale senza Docker, il `README.md` indica `8761`, `8888`, `8080`, `9411`, `9090`, `3030` e `9091` per i componenti corrispondenti; Customers, Vets, Visits e GenAI usano invece una porta casuale da verificare nel dashboard Eureka.

## Dipendenze principali

Il parent Maven è Spring Boot `4.0.1`; il progetto richiede Java `17` e importa Spring Cloud `2025.1.0`. I POM dei moduli mostrano in particolare:

- Spring Cloud Config, Eureka e Gateway;
- Circuit Breaker con Resilience4j;
- Spring Boot Actuator, Micrometer Prometheus e Zipkin;
- Spring Boot Admin nel modulo Admin;
- Spring Data JPA, HSQLDB a runtime e MySQL Connector/J a runtime nei servizi dati;
- Spring AI con starter OpenAI e vector store nel servizio GenAI;
- AngularJS, Bootstrap e Angular UI Router nel gateway, che ospita il frontend.

Il `README.md` descrive HSQLDB come database in-memory predefinito e documenta un profilo `mysql` per una configurazione persistente alternativa. Per il chatbot, il README indica OpenAI come provider predefinito e Azure OpenAI come alternativa.

## Cosa serve per il percorso base

Per usare l'applicazione Petclinic descritta nel README servono Config Server e Discovery Server, da avviare prima dei servizi applicativi. Il percorso applicativo base comprende API Gateway, Customers, Vets e Visits.

Sono invece documentati come opzionali l'avvio di tracing server, Admin server, Grafana e Prometheus. Il servizio GenAI è un componente del repository, ma richiede le credenziali del provider scelto: Compose inoltra `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`. Il profilo MySQL è opzionale rispetto al database in-memory predefinito.

## Avvio locale senza Docker

Ogni microservizio è una Spring Boot application. Il README indica di avviarlo dall'IDE oppure dal suo modulo con:

```bash
../mvnw spring-boot:run
```

Sequenza operativa:

1. avviare `config-server`;
2. avviare `discovery-server`;
3. avviare Customers, Vets, Visits e API Gateway;
4. aggiungere gli strumenti opzionali solo quando servono.

Con questo percorso si gestiscono esplicitamente processi e ordine di avvio. Se Config Server deve usare un repository Git locale, il README documenta il profilo `native` con la variabile `GIT_REPO`.

## Avvio con Docker Compose

Prima si costruiscono le immagini dei moduli:

```bash
./mvnw clean install -P buildDocker
```

Poi si avvia lo stack:

```bash
docker compose up
```

Il README documenta anche `podman-compose up` e la costruzione con Podman. Nel POM root il profilo `buildDocker` esegue la build dell'immagine OCI; il README richiede che Docker/Docker Desktop (o Podman/Podman Desktop) sia installato e in esecuzione.

Compose pubblica porte fisse e coordina parte dell'ordine di avvio: Config Server e Discovery Server hanno healthcheck; Discovery e i servizi che ne dipendono usano `depends_on` con condizione `service_healthy`. Dopo l'avvio, il README avverte che il gateway può impiegare un po' di tempo a sincronizzarsi con il service registry e quindi produrre timeout iniziali.

## Differenza pratica

| Senza Docker | Con Docker Compose |
| --- | --- |
| Si avviano singole applicazioni Spring Boot dall'IDE o con Maven. | Si costruiscono le immagini e si avvia lo stack con Compose. |
| L'operatore rispetta l'ordine Config/Discovery prima delle applicazioni dipendenti. | Compose gestisce le dipendenze dichiarate e le attese sui healthcheck. |
| Le porte dei servizi applicativi Customers, Vets, Visits e GenAI sono indicate come casuali nel README. | Le porte dello stack sono pubblicate esplicitamente nel file Compose. |
| È utile per lavorare su un singolo processo o osservare direttamente i log locali. | Include anche i container di tracing e monitoraggio definiti da Compose. |

## Fonti del briefing

Questo documento usa soltanto `README.md`, i `pom.xml`, `docker-compose.yml` e la struttura dei moduli del repository.
