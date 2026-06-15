# Spring Petclinic Microservices - Hands-on Briefing

## Scopo del progetto

Questo repository contiene la versione microservices della Spring PetClinic sample application. Dal `README.md` emerge che l'obiettivo operativo e' mostrare come separare una sample Spring in piu' servizi usando Spring Cloud e componenti collegati per gateway, configurazione centralizzata, discovery, resilienza, tracing e osservabilita'.

## Servizi presenti

Dal `pom.xml` e dalla struttura del repository risultano questi moduli Maven:

- `spring-petclinic-admin-server`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`
- `spring-petclinic-genai-service`
- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`

Dal `README.md` i servizi funzionali descritti esplicitamente sono:

- Config Server
- Discovery Server
- API Gateway
- Customers Service
- Vets Service
- Visits Service
- GenAI Service

## Porte esposte

### Avvio locale senza Docker

Dal `README.md` le destinazioni note sono:

- Discovery Server: `http://localhost:8761`
- Config Server: `http://localhost:8888`
- API Gateway: `http://localhost:8080`
- Tracing Server (Zipkin): `http://localhost:9411/zipkin/`
- Admin Server: `http://localhost:9090`
- Grafana: `http://localhost:3030`
- Prometheus: `http://localhost:9091`
- Customers, Vets, Visits e GenAI Services: porte casuali; il `README.md` dice di controllarle nella Eureka Dashboard

### Avvio con Docker Compose

Il `docker-compose.yml` espone sul lato host queste porte:

- `8888:8888` per Config Server
- `8761:8761` per Discovery Server
- `8081:8081` per Customers Service
- `8082:8082` per Visits Service
- `8083:8083` per Vets Service
- `8084:8084` per GenAI Service
- `8080:8080` per API Gateway
- `9411:9411` per Tracing Server
- `9090:9090` per Admin Server
- `3030:3000` per Grafana
- `9091:9090` per Prometheus

## Dipendenze principali

Dal `README.md` e dal `pom.xml` emergono queste dipendenze e piattaforme centrali:

- Spring Boot 4.0.1
- Java 17
- Spring Cloud 2025.1.0
- Spring Cloud Gateway
- Spring Cloud Config
- Spring Cloud Netflix / Eureka per service discovery
- Spring Cloud Circuit Breaker
- Resilience4j
- Micrometer Tracing
- OpenTelemetry
- Spring AI
- Spring Boot Admin
- Zipkin per tracing
- Grafana e Prometheus per metriche
- MySQL JDBC driver nei `pom.xml`, per il profilo MySQL
- HSQLDB in-memory come database predefinito, secondo il `README.md`

Per il modulo GenAI, il `README.md` indica il supporto per:

- OpenAI come provider predefinito
- Azure OpenAI come alternativa

## Cosa e' core e cosa e' opzionale

### Core

Il nucleo operativo del repository e' composto dai servizi che il `README.md` presenta come necessari per l'avvio degli altri componenti:

- Config Server
- Discovery Server
- API Gateway
- Customers Service
- Vets Service
- Visits Service

### Opzionale

Dal `README.md` e dal `docker-compose.yml` risultano opzionali o dipendenti da esigenze specifiche:

- GenAI Service
- Tracing Server
- Admin Server
- Grafana
- Prometheus
- MySQL profile e database MySQL
- Avvio con Docker / Docker Compose
- Avvio con Podman al posto di Docker

## Avvio locale senza Docker

Il `README.md` dice che ogni microservizio e' una Spring Boot application e puo' essere avviato localmente con l'IDE oppure con `../mvnw spring-boot:run`.

Operativamente:

- prima vanno avviati Config Server e Discovery Server
- poi vanno avviati Customers, Vets, Visits e API Gateway
- Tracing Server, Admin Server, Grafana e Prometheus sono opzionali
- i servizi Customers, Vets, Visits e GenAI non hanno una porta fissa locale e vanno letti da Eureka

## Avvio con Docker Compose

Il flusso descritto dal `README.md` e dal `docker-compose.yml` e' diverso:

- prima si costruiscono le immagini con `./mvnw clean install -P buildDocker`
- poi si avvia l'infrastruttura con `docker compose up` oppure `podman-compose up`
- il compose usa `depends_on` e healthcheck per coordinare l'ordine di startup
- le porte host sono fisse e definite nel file compose
- il `README.md` segnala che l'API Gateway puo' impiegare un po' di tempo prima di sincronizzarsi con il service registry

## Differenza operativa

- Senza Docker: ogni servizio parte come processo Spring Boot separato; alcuni servizi girano su porte casuali e il punto di controllo e' Eureka.
- Con Docker Compose: il repository fornisce un avvio coordinato dell'intero stack, con immagini prebuild e porte host stabili.

## Note pratiche

- La configurazione predefinita usa HSQLDB in-memory.
- Il supporto MySQL esiste, ma richiede il profilo `mysql` sui servizi indicati nel `README.md`.
- Il modulo GenAI richiede la scelta tra OpenAI e Azure OpenAI, con credenziali passate via variabili d'ambiente.
- Questo documento riporta solo evidenza verificabile nei file richiesti dal ticket.
