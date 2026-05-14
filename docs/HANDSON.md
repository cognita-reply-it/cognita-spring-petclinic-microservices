# Spring Petclinic Microservices - briefing hands-on

Documento operativo per chi deve orientarsi nel repository durante un hands-on Codex App.

## Scopo del progetto

Questo repository contiene la versione distribuita di Spring Petclinic: una applicazione di esempio divisa in microservizi Spring Boot e Spring Cloud. Il README spiega che il progetto serve a mostrare come separare la sample application Petclinic in microservizi usando Spring Cloud Gateway, Spring Cloud Circuit Breaker, Spring Cloud Config, Micrometer Tracing, Resilience4j, OpenTelemetry ed Eureka Service Discovery.

Il `pom.xml` principale mostra che il repository e' un progetto Maven multi-modulo basato su Spring Boot `4.0.1`, Java `17` e Spring Cloud `2025.1.0`.

## Struttura principale

| Percorso | Ruolo |
| --- | --- |
| `spring-petclinic-api-gateway` | API Gateway e frontend AngularJS esposto dal gateway |
| `spring-petclinic-customers-service` | gestione dei dati dei clienti/proprietari e pet |
| `spring-petclinic-vets-service` | gestione delle informazioni sui veterinari |
| `spring-petclinic-visits-service` | gestione delle visite |
| `spring-petclinic-genai-service` | servizio chatbot basato su Spring AI |
| `spring-petclinic-config-server` | configurazione centralizzata con Spring Cloud Config Server |
| `spring-petclinic-discovery-server` | service registry Eureka |
| `spring-petclinic-admin-server` | Spring Boot Admin server |
| `docker/grafana` | immagine/configurazione Grafana usata da Docker Compose |
| `docker/prometheus` | immagine/configurazione Prometheus usata da Docker Compose |
| `scripts` | script di supporto citati dal README, inclusi bootstrap, run_all e chaos |
| `docs` | documentazione e asset del progetto |

## Servizi presenti

### Servizi applicativi

- `api-gateway`: instrada le richieste client verso i servizi e serve il frontend AngularJS. Nel POM usa Spring Cloud Gateway WebFlux, Eureka client, Config client, Circuit Breaker Reactor Resilience4j, Actuator, Zipkin, Micrometer Prometheus e WebJars per AngularJS, Bootstrap, Font Awesome, Angular UI Router e Marked.
- `customers-service`: gestisce i dati customer/pet. Nel POM usa Spring WebMVC, Spring Data JPA, Actuator, Zipkin, Config client, Eureka client, HSQLDB, MySQL Connector/J, Jolokia, Micrometer Prometheus, Chaos Monkey e datasource Micrometer.
- `vets-service`: gestisce i veterinari. Nel POM usa Spring WebMVC, Spring Data JPA, cache, Actuator, Zipkin, Config client, Eureka client, HSQLDB, MySQL Connector/J, Caffeine, cache-api, Jolokia, Micrometer Prometheus, Chaos Monkey e datasource Micrometer.
- `visits-service`: gestisce le visite. Nel POM usa Spring WebMVC, Spring Data JPA, Actuator, Zipkin, Config client, Eureka client, HSQLDB, MySQL Connector/J, Jolokia, Micrometer Prometheus, Chaos Monkey e datasource Micrometer.
- `genai-service`: espone la funzionalita' chatbot. Nel README e nel POM e' collegato a Spring AI, con lo starter OpenAI attivo; il README indica Azure OpenAI come alternativa ottenibile modificando il `pom.xml`. Usa variabili d'ambiente per OpenAI o Azure OpenAI quando si usa il provider scelto.

### Servizi di piattaforma

- `config-server`: Config Server centralizzato. Il README richiede di avviarlo prima degli altri servizi applicativi quando si lavora senza Docker.
- `discovery-server`: registry Eureka. Il README richiede di avviarlo prima di Customers, Vets, Visits e API Gateway quando si lavora senza Docker.
- `admin-server`: Spring Boot Admin. Il README lo elenca tra i servizi opzionali all'avvio locale.

### Servizi di osservabilita' e infrastruttura Compose

- `tracing-server`: Zipkin, usato come tracing server.
- `grafana-server`: Grafana, definito in `docker-compose.yml` con build da `docker/grafana`.
- `prometheus-server`: Prometheus, definito in `docker-compose.yml` con build da `docker/prometheus`.

## Porte esposte

| Servizio | Avvio locale senza Docker, secondo README | Docker Compose |
| --- | --- | --- |
| Discovery Server | `http://localhost:8761` | `8761:8761` |
| Config Server | `http://localhost:8888` | `8888:8888` |
| API Gateway / frontend AngularJS | `http://localhost:8080` | `8080:8080` |
| Customers Service | porta random, da verificare in Eureka Dashboard | `8081:8081` |
| Visits Service | porta random, da verificare in Eureka Dashboard | `8082:8082` |
| Vets Service | porta random, da verificare in Eureka Dashboard | `8083:8083` |
| GenAI Service | porta random, da verificare in Eureka Dashboard | `8084:8084` |
| Tracing Server / Zipkin | `http://localhost:9411/zipkin/` | `9411:9411` |
| Admin Server | `http://localhost:9090` | `9090:9090` |
| Grafana | `http://localhost:3030` | `3030:3000` |
| Prometheus | `http://localhost:9091` | `9091:9090` |

Nota operativa: in locale senza Docker, il README dice che Customers, Vets, Visits e GenAI usano porte random e vanno cercati nella dashboard Eureka. In Docker Compose, invece, `docker-compose.yml` pubblica porte host esplicite per questi container.

## Dipendenze principali

- Runtime/build: Java `17`, Maven Wrapper (`mvnw` / `mvnw.cmd`), Spring Boot `4.0.1`.
- Spring Cloud: BOM `2025.1.0`, Config Server/Client, Eureka Server/Client, Gateway WebFlux, Circuit Breaker Reactor Resilience4j.
- Dati: Spring Data JPA nei servizi Customers, Vets, Visits e GenAI; HSQLDB runtime; MySQL Connector/J runtime per il profilo MySQL descritto dal README.
- Osservabilita': Spring Boot Actuator, Micrometer Prometheus, Zipkin starter, Jolokia, datasource Micrometer; Compose include Zipkin, Grafana e Prometheus.
- Resilienza e metriche: Resilience4j nel gateway e nel servizio GenAI; Resilience4j Micrometer nel gateway.
- Frontend: il gateway include WebJars per AngularJS, Bootstrap, Font Awesome, Angular UI Router, WebJars Locator e Marked.
- GenAI: Spring AI `2.0.0-M1`, starter OpenAI attivo, vector store, repository Maven `spring-milestones`; il README cita OpenAI come default e Azure OpenAI come alternativa.
- Admin: Spring Boot Admin `4.0.2` nel modulo `spring-petclinic-admin-server`.
- Container: profilo Maven `buildDocker`, Dockerfile comune in `docker/Dockerfile`, immagini `springcommunity/*` in Compose e supporto README per Docker o Podman.

## Core e opzionale

### Core per eseguire la Petclinic distribuita

- `config-server`: necessario come servizio di configurazione di supporto, da avviare prima degli altri servizi in locale.
- `discovery-server`: necessario come service registry, da avviare prima degli altri servizi in locale.
- `api-gateway`: punto di accesso al frontend e alle route verso i servizi.
- `customers-service`, `vets-service`, `visits-service`: servizi di dominio descritti dal README per clienti, veterinari e visite.

### Servizi applicativi con prerequisiti propri

- `genai-service`: e' parte dei microservizi elencati dal README e fornisce il chatbot. Il README chiede di scegliere OpenAI o Azure OpenAI e indica le variabili d'ambiente del provider scelto (`OPENAI_API_KEY`, oppure `AZURE_OPENAI_ENDPOINT` e `AZURE_OPENAI_KEY`).

### Opzionale secondo il README o legato a scenari specifici

- `tracing-server` / Zipkin: il README indica il tracing server come opzionale nell'avvio locale.
- `admin-server`: il README lo indica come opzionale nell'avvio locale.
- `grafana-server` e `prometheus-server`: il README indica Grafana e Prometheus come opzionali nell'avvio locale; sono comunque inclusi in `docker-compose.yml`.
- MySQL: il README dice che la configurazione di default usa HSQLDB in memoria e che MySQL e' disponibile quando serve un database persistente, usando il profilo Spring `mysql` per `visits-service`, `customers-service` e `vets-service`.
- Chaos Monkey: presente nei POM dei servizi applicativi e citato dal README per lo script `run_all.sh` con profilo `chaos-monkey`.

## Avvio locale senza Docker

Il README dice che ogni microservizio e' una applicazione Spring Boot avviabile da IDE oppure con:

```bash
../mvnw spring-boot:run
```

Ordine operativo indicato dal README:

1. Avviare prima i servizi di supporto:
   - `spring-petclinic-config-server`
   - `spring-petclinic-discovery-server`
2. Avviare poi i servizi applicativi indicati esplicitamente nel README:
   - `spring-petclinic-customers-service`
   - `spring-petclinic-vets-service`
   - `spring-petclinic-visits-service`
   - `spring-petclinic-api-gateway`
3. Avviare solo se servono:
   - tracing server / Zipkin
   - admin server
   - Grafana
   - Prometheus

Per il Config Server, il README documenta anche l'uso del profilo Spring `native` e della variabile `GIT_REPO` per puntare a un repository Git locale di configurazione.

Il `spring-petclinic-genai-service` e' documentato separatamente nella sezione README dedicata al chatbot: per eseguirlo servono anche le variabili d'ambiente del provider scelto (`OPENAI_API_KEY` oppure `AZURE_OPENAI_ENDPOINT` e `AZURE_OPENAI_KEY`).

## Avvio con Docker Compose

Il README richiede prima di costruire le immagini:

```bash
./mvnw clean install -P buildDocker
```

Poi si avvia l'infrastruttura con:

```bash
docker compose up
```

Il README documenta anche l'alternativa Podman:

```bash
./mvnw clean install -PbuildDocker -Dcontainer.executable=podman
podman-compose up
```

Differenze operative rispetto all'avvio senza Docker:

- Compose usa le immagini `springcommunity/spring-petclinic-*` per i servizi applicativi e di piattaforma, piu' `openzipkin/zipkin` per Zipkin.
- Compose pubblica porte fisse anche per Customers, Visits, Vets e GenAI, mentre l'avvio locale senza Docker usa porte random per questi servizi.
- Compose coordina l'ordine di startup con `depends_on` e condizione `service_healthy` per Config Server e Discovery Server.
- Il README avvisa che, dopo l'avvio, API Gateway puo' impiegare un po' a sincronizzarsi con il service registry e possono comparire timeout iniziali.
- Grafana e Prometheus sono inclusi direttamente nel file Compose tramite build dalle directory `docker/grafana` e `docker/prometheus`.
- Il container `genai-service` riceve da Compose le variabili `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT` dall'ambiente host.

## Database

Il README dice che la configurazione di default usa HSQLDB in memoria, popolato allo startup. Per uno scenario persistente e' disponibile MySQL:

- il driver MySQL Connector/J e' presente nei POM dei servizi interessati;
- il README propone MySQL `8.4.5`;
- il profilo Spring `mysql` riguarda `visits-service`, `customers-service` e `vets-service`;
- in Docker, il README richiede di aggiungere il profilo `mysql` nel Dockerfile e adeguare host/porta della JDBC connection string nella configurazione.

## Evidenze usate

Questo documento e' basato su:

- `README.md`
- `pom.xml`
- `spring-petclinic-admin-server/pom.xml`
- `spring-petclinic-api-gateway/pom.xml`
- `spring-petclinic-config-server/pom.xml`
- `spring-petclinic-customers-service/pom.xml`
- `spring-petclinic-discovery-server/pom.xml`
- `spring-petclinic-genai-service/pom.xml`
- `spring-petclinic-vets-service/pom.xml`
- `spring-petclinic-visits-service/pom.xml`
- `docker-compose.yml`
- struttura delle directory del repository
