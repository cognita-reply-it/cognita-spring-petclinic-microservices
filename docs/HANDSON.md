# Spring Petclinic Microservices - Hands-on Briefing

## Scopo del progetto

Questo repository contiene una variante distribuita della Spring PetClinic sample application. Dal `README.md` emerge che l'obiettivo e' mostrare come dividere una sample application Spring in microservizi usando Spring Cloud, Spring AI e lo stack correlato per configurazione, discovery, resilienza, tracing e gateway.

## Servizi presenti

La struttura del repository e il `pom.xml` indicano questi moduli:

- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`
- `spring-petclinic-genai-service`
- `spring-petclinic-admin-server`

Dal `README.md` i servizi applicativi principali sono:

- Customers Service
- Vets Service
- Visits Service
- GenAI Service
- API Gateway
- Config Server
- Discovery Server

## Porte esposte

### Avvio locale senza Docker

Dal `README.md`:

- Discovery Server: `http://localhost:8761`
- Config Server: `http://localhost:8888`
- API Gateway: `http://localhost:8080`
- Tracing Server (Zipkin): `http://localhost:9411/zipkin/`
- Admin Server: `http://localhost:9090`
- Grafana: `http://localhost:3030`
- Prometheus: `http://localhost:9091`
- Customers, Vets, Visits e GenAI Services: porte casuali, da verificare in Eureka Dashboard

### Avvio con Docker Compose

Il file `docker-compose.yml` espone queste porte host:

- Config Server: `8888:8888`
- Discovery Server: `8761:8761`
- Customers Service: `8081:8081`
- Visits Service: `8082:8082`
- Vets Service: `8083:8083`
- GenAI Service: `8084:8084`
- API Gateway: `8080:8080`
- Tracing Server: `9411:9411`
- Admin Server: `9090:9090`
- Grafana: `3030:3000`
- Prometheus: `9091:9090`

## Dipendenze principali

Dal `README.md` e dal `pom.xml` si ricavano le dipendenze e le piattaforme principali:

- Spring Boot 4.0.1
- Java 17
- Spring Cloud 2025.1.0
- Spring Cloud Gateway
- Spring Cloud Config
- Eureka / Spring Cloud Netflix per discovery
- Spring Cloud Circuit Breaker
- Resilience4j
- Micrometer Tracing
- OpenTelemetry
- Spring AI
- Zipkin per tracing
- Spring Boot Admin
- Grafana e Prometheus per metriche
- MySQL JDBC driver supportato dal `pom.xml` per il profilo MySQL
- HSQLDB in-memory come configurazione predefinita, secondo il `README.md`

Per il modulo GenAI, il `README.md` indica supporto per:

- OpenAI come provider predefinito
- Azure OpenAI come alternativa

## Cosa e' core e cosa e' opzionale

### Core

Il flusso minimo descritto dal repository richiede:

- Config Server
- Discovery Server
- API Gateway
- Customers Service
- Vets Service
- Visits Service

Questi sono i servizi che il `README.md` indica come prerequisiti per l'avvio degli altri servizi e come base dell'applicazione distribuita.

### Opzionale

Dal `README.md` risultano opzionali o dipendenti da esigenze specifiche:

- GenAI Service
- Tracing Server
- Admin Server
- Grafana
- Prometheus
- MySQL profile e database MySQL
- Avvio tramite Docker / Docker Compose
- Avvio con Podman al posto di Docker

## Avvio locale senza Docker

Il `README.md` indica che ogni microservizio e' una Spring Boot application e puo' essere avviato localmente con l'IDE oppure con `../mvnw spring-boot:run`.

Punti operativi supportati dal repository:

- prima si avviano Config Server e Discovery Server
- poi si avviano Customers, Vets, Visits e API Gateway
- Tracing Server, Admin Server, Grafana e Prometheus sono opzionali
- alcuni servizi applicativi non usano porte fisse in locale e vanno controllati da Eureka

## Avvio con Docker Compose

Il `README.md` e `docker-compose.yml` mostrano un flusso diverso:

- prima si costruiscono le immagini con `./mvnw clean install -P buildDocker`
- poi si avvia tutto con `docker compose up` oppure `podman-compose up`
- il compose definisce dipendenze di startup tramite `depends_on` e healthcheck
- le porte sono fisse sul lato host e corrispondono ai servizi esposti nel file compose
- il `README.md` segnala che l'API Gateway puo' richiedere un po' di tempo prima di sincronizzarsi con il service registry

## Differenza operativa tra i due avvii

- Senza Docker: ogni servizio e' avviato come processo Spring Boot separato, con alcune porte casuali e supervisione manuale tramite Eureka.
- Con Docker Compose: il repository fornisce un avvio coordinato dell'infrastruttura completa, con immagini costruite in precedenza e porte host stabili.

## Note pratiche

- La configurazione predefinita usa HSQLDB in-memory.
- Il supporto MySQL esiste, ma richiede il profilo `mysql` sui servizi indicati nel `README.md`.
- Il modulo GenAI richiede una scelta tra OpenAI e Azure OpenAI, con credenziali fornite via variabili d'ambiente.
- Questo documento descrive solo quanto e' verificabile nei file richiesti dal ticket.
