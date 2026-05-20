# Hands-on Briefing

Questo documento riassume il repository in modo operativo usando solo evidenza da `README.md`, dai `pom.xml`, da `docker-compose.yml` e dalla struttura delle cartelle.

## Scopo del progetto

Il repository contiene la versione microservices di Spring PetClinic.
Dal `README.md` emerge che il progetto serve a mostrare come dividere una sample Spring application in microservizi usando Spring Cloud Gateway, Spring Cloud Config, Eureka service discovery, Micrometer Tracing, Resilience4j, OpenTelemetry e Spring AI.

Le tecnologie citate nel repository sono:

- Spring Cloud Gateway
- Spring Cloud Circuit Breaker
- Spring Cloud Config
- Spring Cloud Netflix Eureka
- Micrometer Tracing
- Resilience4j
- OpenTelemetry
- Spring AI

## Servizi presenti

Dalla struttura del repository e dai moduli Maven risultano questi servizi:

- `spring-petclinic-admin-server`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`
- `spring-petclinic-genai-service`
- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`

Nel `docker-compose.yml` compaiono anche i container per:

- `tracing-server`
- `grafana-server`
- `prometheus-server`

Il `README.md` associa a questi ruoli operativi:

- `config-server`: configurazione centralizzata
- `discovery-server`: service registry Eureka
- `api-gateway`: punto di ingresso HTTP dell'applicazione
- `customers-service`: gestione dati clienti
- `vets-service`: gestione veterinari
- `visits-service`: gestione visite
- `genai-service`: chatbot / interazione in linguaggio naturale
- `admin-server`: Spring Boot Admin

## Porte esposte

### Avvio locale senza Docker

Il `README.md` indica queste porte o endpoint:

- Discovery Server: `8761`
- Config Server: `8888`
- API Gateway: `8080`
- Tracing Server (Zipkin): `9411`
- Admin Server: `9090`
- Grafana: `3030`
- Prometheus: `9091`

Per `customers-service`, `vets-service`, `visits-service` e `genai-service` il `README.md` dice che l'avvio locale usa una porta random e che va verificata su Eureka.

### Docker Compose

Nel `docker-compose.yml` le porte pubblicate sono:

- `config-server`: `8888`
- `discovery-server`: `8761`
- `customers-service`: `8081`
- `visits-service`: `8082`
- `vets-service`: `8083`
- `genai-service`: `8084`
- `api-gateway`: `8080`
- `tracing-server`: `9411`
- `admin-server`: `9090`
- `grafana-server`: `3030` verso la porta interna `3000`
- `prometheus-server`: `9091` verso la porta interna `9090`

## Dipendenze principali

### Dati comuni dal parent POM

Dal `pom.xml` radice risultano:

- Spring Boot parent `4.0.1`
- Java `17`
- Spring Cloud BOM `2025.1.0`
- `chaos-monkey-spring-boot`
- `jolokia-core`
- `datasource-micrometer-spring-boot`

### Dipendenze per modulo

- `config-server`
  - `spring-cloud-config-server`

- `discovery-server`
  - `spring-cloud-starter-netflix-eureka-server`
  - `spring-cloud-starter-config`
  - `jaxb-runtime`

- `api-gateway`
  - `spring-cloud-starter-gateway-server-webflux`
  - `spring-cloud-starter-config`
  - `spring-cloud-starter-netflix-eureka-client`
  - `spring-cloud-starter-circuitbreaker-reactor-resilience4j`
  - `spring-boot-starter-actuator`
  - `spring-boot-starter-cache`
  - `spring-boot-starter-zipkin`
  - `micrometer-registry-prometheus`
  - `resilience4j-micrometer`
  - `jolokia-core`
  - webjars per frontend statico

- `customers-service`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-webmvc`
  - `spring-boot-starter-actuator`
  - `spring-boot-starter-zipkin`
  - `spring-cloud-starter-config`
  - `spring-cloud-starter-netflix-eureka-client`
  - `mysql-connector-j`
  - `hsqldb`
  - `micrometer-registry-prometheus`
  - `chaos-monkey-spring-boot`
  - `datasource-micrometer-spring-boot`

- `vets-service`
  - `spring-boot-starter-webmvc`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-actuator`
  - `spring-boot-starter-cache`
  - `spring-boot-starter-zipkin`
  - `spring-cloud-starter-config`
  - `spring-cloud-starter-netflix-eureka-client`
  - `mysql-connector-j`
  - `hsqldb`
  - `micrometer-registry-prometheus`
  - `chaos-monkey-spring-boot`
  - `datasource-micrometer-spring-boot`

- `visits-service`
  - `spring-boot-starter-actuator`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-webmvc`
  - `spring-boot-starter-zipkin`
  - `spring-cloud-starter-config`
  - `spring-cloud-starter-netflix-eureka-client`
  - `hsqldb`
  - `mysql-connector-j`
  - `micrometer-registry-prometheus`
  - `chaos-monkey-spring-boot`
  - `datasource-micrometer-spring-boot`

- `genai-service`
  - `spring-ai-starter-model-openai`
  - commento nel POM per `spring-ai-starter-model-azure-openai`
  - `spring-ai-vector-store`
  - `spring-boot-starter-webmvc`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-actuator`
  - `spring-boot-starter-cache`
  - `spring-boot-starter-zipkin`
  - `spring-cloud-starter-config`
  - `spring-cloud-starter-netflix-eureka-client`
  - `spring-cloud-starter-circuitbreaker-reactor-resilience4j`
  - `spring-cloud-starter-gateway-server-webflux`
  - `javax.cache:cache-api`
  - `jakarta.xml.bind:jakarta.xml.bind-api`
  - `caffeine`
  - `jolokia-core`
  - `hsqldb`
  - `mysql-connector-j`
  - `micrometer-registry-prometheus`
  - `chaos-monkey-spring-boot`
  - `datasource-micrometer-spring-boot`

- `admin-server`
  - `spring-boot-starter`
  - `spring-boot-starter-cache`
  - `spring-cloud-starter-config`
  - `spring-cloud-starter-netflix-eureka-client`
  - `spring-boot-admin-starter-server`
  - `spring-boot-admin-server-ui`
  - `jolokia-core`
  - `caffeine`

## Core e opzionale

### Core

Dal `README.md` i servizi di supporto da avviare prima degli altri sono:

- `config-server`
- `discovery-server`

Nel flusso base dell'applicazione il `README.md` mostra anche come centrali:

- `api-gateway`
- `customers-service`
- `vets-service`
- `visits-service`

### Opzionale

Il `README.md` indica come opzionale l'avvio di:

- `tracing-server`
- `admin-server`
- `grafana-server`
- `prometheus-server`

Il `genai-service` e' presente nel progetto e nel Docker Compose, ma il `README.md` non lo descrive come prerequisito del flusso base.

## Avvio locale senza Docker

Il `README.md` dice che ogni microservizio e' una Spring Boot application e puo' essere avviata da IDE oppure con `../mvnw spring-boot:run`.

Sequenza operativa ricavata dal testo:

1. avviare prima `config-server` e `discovery-server`
2. avviare poi `customers-service`, `vets-service`, `visits-service` e `api-gateway`
3. avviare `genai-service` solo se serve
4. consultare Eureka per vedere le porte dei servizi che partono su porta random

Punto di accesso principale:

- `http://localhost:8080/`

## Avvio con Docker Compose

Dal `README.md`:

1. costruire le immagini con `./mvnw clean install -P buildDocker`
2. in alternativa usare `./mvnw clean install -PbuildDocker -Dcontainer.executable=podman`
3. avviare con `docker compose up` oppure `podman-compose up`

Differenze operative rispetto all'avvio locale senza Docker:

- il compose assegna porte fisse ai container
- l'ordine di startup e' coordinato con `depends_on` e `healthcheck`
- `genai-service` riceve le variabili di ambiente `OPENAI_API_KEY`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`
- il `README.md` avvisa che il gateway puo' impiegare un po' a sincronizzarsi con Eureka subito dopo l'avvio

## Lettura pratica per un hands-on

Se devi usare il repository durante un hands-on Codex App:

- usa `8080` come ingresso principale
- considera `config-server` e `discovery-server` come prerequisiti
- usa Docker Compose se vuoi porte fisse e startup coordinato
- usa l'avvio locale senza Docker se vuoi lavorare servizio per servizio
- verifica su Eureka le porte dei servizi avviati senza Docker
