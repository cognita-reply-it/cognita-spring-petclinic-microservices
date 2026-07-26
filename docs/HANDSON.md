# Hands-on: Spring Petclinic Microservices

## Scopo

Questo repository contiene la versione distribuita dell'applicazione di esempio
Spring Petclinic. Il progetto mostra come suddividere l'applicazione in
microservizi e usa Spring Cloud per gateway, configurazione centralizzata e
service discovery. Include anche tracing, circuit breaker, metriche e un
servizio GenAI con chatbot.

Il build Maven radice richiede Java 17, usa Spring Boot 4.0.1 e importa le
dipendenze Spring Cloud 2025.1.0.

## Componenti presenti

I moduli Maven e le directory del repository identificano questi servizi:

| Componente | Ruolo dichiarato | Esposizione locale |
| --- | --- | --- |
| API Gateway | punto di accesso dell'interfaccia AngularJS e instradamento verso i servizi | `8080` |
| Config Server | configurazione centralizzata | `8888` |
| Discovery Server | registry dei servizi basato su Eureka | `8761` |
| Customers Service | gestione dei dati dei proprietari | `8081` con Compose; porta casuale nell'avvio locale indicato dal README |
| Vets Service | informazioni sui veterinari | `8083` con Compose; porta casuale nell'avvio locale indicato dal README |
| Visits Service | gestione delle visite | `8082` con Compose; porta casuale nell'avvio locale indicato dal README |
| GenAI Service | chatbot dell'applicazione | `8084` con Compose; porta casuale nell'avvio locale indicato dal README |
| Admin Server | Spring Boot Admin | `9090` |
| Tracing Server | Zipkin | `9411` |
| Grafana | dashboard delle metriche | `3030` (porta interna `3000`) |
| Prometheus | raccolta delle metriche | `9091` (porta interna `9090`) |

Le porte della colonna Compose provengono da `docker-compose.yml`. Per
l'avvio locale il README espone gateway, config e discovery sulle stesse porte,
mentre Customers, Vets, Visits e GenAI usano una porta casuale da verificare
nella dashboard Eureka.

## Dipendenze principali

Le dipendenze dichiarate descrivono una piattaforma Spring Boot/Spring Cloud:

- Spring Cloud Config e Netflix Eureka per configurazione e discovery;
- Spring Cloud Gateway e Resilience4j per gateway e circuit breaker;
- Micrometer/Prometheus, Zipkin e OpenTelemetry per osservabilita e tracing;
- Spring Data JPA, HSQLDB e MySQL Connector/J per i servizi dati;
- Spring Boot Admin e Jolokia per amministrazione;
- AngularJS, Bootstrap e WebJars nel gateway per la UI;
- Spring AI, con starter OpenAI abilitato nel POM del servizio GenAI; il README
  documenta anche Azure OpenAI come alternativa;
- Grafana e Prometheus, definiti come servizi Compose.

## Core e opzionale

Per eseguire l'applicazione in locale, il README richiede di avviare prima
Config Server e Discovery Server; poi Customers, Vets, Visits e API Gateway.
Questi sono quindi il percorso operativo core del sistema Petclinic.

Il README indica come opzionali Tracing Server, Admin Server, Grafana e
Prometheus. Il servizio GenAI e presente sia tra i moduli sia in Compose, ma
ha una configurazione dedicata del provider LLM: Compose inoltra le variabili
`OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`. Il README
documenta OpenAI come predefinito e Azure OpenAI come alternativa; non
classifica esplicitamente GenAI come core oppure opzionale.

Per i dati, la configurazione predefinita usa HSQLDB in memoria e inizializza i
dati all'avvio. MySQL e un'alternativa persistente: il README richiede il
profilo Spring `mysql` per Customers, Vets e Visits.

## Avvio locale senza Docker

Ogni microservizio e un'applicazione Spring Boot. Avvialo dall'IDE oppure dalla
directory del modulo con:

```bash
../mvnw spring-boot:run
```

Avvia prima Config Server e Discovery Server, quindi Customers, Vets, Visits e
API Gateway. L'interfaccia Petclinic e disponibile tramite il gateway su
<http://localhost:8080/>. Eureka e disponibile su
<http://localhost:8761/> e permette di verificare le porte casuali dei servizi
di dominio.

Per puntare Config Server a un repository Git locale, il README documenta il
profilo `native` con la variabile `GIT_REPO`, ad esempio:

```bash
../mvnw spring-boot:run -Dspring.profiles.active=native -DGIT_REPO=/percorso/al/config-repository
```

## Avvio con Docker Compose

Prima crea le immagini dei moduli con il profilo Maven `buildDocker`:

```bash
./mvnw clean install -P buildDocker
docker compose up
```

Docker (o Docker Desktop) deve essere in esecuzione. Il README documenta anche
Podman tramite `-Dcontainer.executable=podman` e `podman-compose up`.

Compose avvia Config Server e Discovery Server prima dei servizi che dipendono
da loro: le dipendenze usano la condizione `service_healthy` e i healthcheck
dei container. Subito dopo l'avvio il gateway puo produrre timeout finche non
si sincronizza con il registry; usa Eureka per seguire la disponibilita dei
servizi.

### Differenza pratica

| Senza Docker | Con Docker Compose |
| --- | --- |
| Si avvia ogni applicazione Spring Boot separatamente, dall'IDE o con Maven. | Si costruiscono prima le immagini e poi si avvia l'insieme con un comando Compose. |
| L'ordine operativo e manuale: Config e Discovery precedono gli altri servizi. | L'ordine tra i servizi dipendenti e coordinato da `depends_on`, healthcheck e `service_healthy`. |
| Customers, Vets, Visits e GenAI sono indicati dal README su porte casuali, da controllare in Eureka. | Compose pubblica porte host fisse per tali servizi (`8081`-`8084`). |
| Non richiede un runtime container. | Richiede Docker/Docker Desktop, oppure Podman/Podman Desktop con il relativo comando documentato. |

## Riferimenti verificati

Questo documento si basa esclusivamente su `README.md`, `pom.xml`, i POM dei
moduli, `docker-compose.yml` e la struttura delle directory del repository.
