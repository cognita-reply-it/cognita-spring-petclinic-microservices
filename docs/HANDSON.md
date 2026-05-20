# Hands-on Repo Briefing

Questo documento descrive il repository usando solo evidenza da `README.md`, dai `pom.xml`, da `docker-compose.yml` e dalla struttura delle cartelle.

## Scopo del progetto

Il repository contiene la versione microservices di Spring PetClinic. Dal `README.md` emerge che il progetto serve a mostrare come separare una sample Spring application in microservizi usando:

- Spring Cloud Gateway;
- Spring Cloud Circuit Breaker;
- Spring Cloud Config;
- Spring Cloud Netflix Eureka;
- Micrometer Tracing;
- Resilience4j;
- OpenTelemetry;
- Spring AI.

In pratica, il repository e' un ambiente demo per osservare un'architettura distribuita composta da servizi applicativi, servizi di supporto e infrastruttura di osservabilita'.

## Servizi presenti

Dalla struttura del repository e dai moduli Maven risultano questi moduli applicativi:

- `spring-petclinic-admin-server`
- `spring-petclinic-api-gateway`
- `spring-petclinic-config-server`
- `spring-petclinic-customers-service`
- `spring-petclinic-discovery-server`
- `spring-petclinic-genai-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`

Nel `docker-compose.yml` compaiono inoltre questi container di supporto:

- `tracing-server`
- `grafana-server`
- `prometheus-server`

Dal `README.md` i ruoli operativi sono questi:

- `config-server`: configurazione centralizzata;
- `discovery-server`: registry Eureka;
- `api-gateway`: ingresso HTTP dell'applicazione;
- `customers-service`: gestione dei clienti;
- `vets-service`: gestione dei veterinari;
- `visits-service`: gestione delle visite;
- `genai-service`: chatbot / interazione in linguaggio naturale;
- `admin-server`: Spring Boot Admin.

## Porte esposte

### Avvio locale senza Docker

Il `README.md` indica queste porte o endpoint pubblici:

- `config-server`: `http://localhost:8888`
- `discovery-server`: `http://localhost:8761`
- `api-gateway`: `http://localhost:8080`
- `tracing-server` / Zipkin: `http://localhost:9411/zipkin/`
- `admin-server`: `http://localhost:9090`
- `grafana-server`: `http://localhost:3030`
- `prometheus-server`: `http://localhost:9091`

Per `customers-service`, `vets-service`, `visits-service` e `genai-service`, il `README.md` dice che l'avvio locale usa una porta random e che bisogna verificare la porta su Eureka.

### Docker Compose

Nel `docker-compose.yml` le porte pubblicate sono:

- `config-server`: `8888:8888`
- `discovery-server`: `8761:8761`
- `customers-service`: `8081:8081`
- `visits-service`: `8082:8082`
- `vets-service`: `8083:8083`
- `genai-service`: `8084:8084`
- `api-gateway`: `8080:8080`
- `tracing-server`: `9411:9411`
- `admin-server`: `9090:9090`
- `grafana-server`: `3030:3000`
- `prometheus-server`: `9091:9090`

## Dipendenze principali

### Dati comuni dal POM radice

Dal `pom.xml` principale risultano:

- Spring Boot parent `4.0.1`;
- Java `17`;
- Spring Cloud BOM `2025.1.0`;
- `chaos-monkey-spring-boot`;
- `jolokia-core`;
- `datasource-micrometer-spring-boot`.

### Dipendenze per modulo

- `spring-petclinic-config-server`
  - `spring-cloud-config-server`

- `spring-petclinic-discovery-server`
  - `spring-cloud-starter-netflix-eureka-server`
  - `spring-cloud-starter-config`
  - `jaxb-runtime`

- `spring-petclinic-api-gateway`
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
  - webjars per UI statica

- `spring-petclinic-customers-service`
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

- `spring-petclinic-vets-service`
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

- `spring-petclinic-visits-service`
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

- `spring-petclinic-genai-service`
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

- `spring-petclinic-admin-server`
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

Il flusso base descritto nel `README.md` richiede prima di tutto:

- `config-server`
- `discovery-server`

Poi i servizi applicativi principali del dominio PetClinic:

- `customers-service`
- `vets-service`
- `visits-service`
- `api-gateway`

### Opzionale

Dal `README.md` risultano opzionali nel flusso locale:

- `tracing-server`
- `admin-server`
- `grafana-server`
- `prometheus-server`

Il `genai-service` e' presente nel repository e nel Compose, ma il `README.md` lo presenta come componente aggiuntivo per la funzionalita' chatbot, non come prerequisito del flusso base.

## Avvio locale senza Docker

Il `README.md` dice che ogni microservizio e' una Spring Boot application e puo' essere avviato con IDE oppure con `./mvnw spring-boot:run`.

Ordine operativo:

1. avviare `config-server`;
2. avviare `discovery-server`;
3. avviare `customers-service`, `vets-service`, `visits-service` e `api-gateway`;
4. avviare `genai-service` solo se serve la parte chatbot;
5. usare Eureka per trovare le porte dei servizi che partono su porta random.

Punto di ingresso principale:

- `http://localhost:8080/`

## Avvio con Docker Compose

Dal `README.md` il flusso Docker prevede:

1. costruire le immagini con `./mvnw clean install -P buildDocker`;
2. avviare l'intero stack con `docker compose up` oppure `podman-compose up`.

Differenze pratiche rispetto all'avvio locale senza Docker:

- le porte sono fisse e pubblicate dal `docker-compose.yml`;
- l'ordine di startup e' coordinato da `depends_on` e `healthcheck`;
- `genai-service` riceve `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT` dall'ambiente;
- il gateway puo' impiegare tempo a sincronizzarsi con Eureka dopo l'avvio.

## Uso pratico

Per un hands-on Codex App:

- usa `8080` come ingresso principale;
- considera `config-server` e `discovery-server` come prerequisiti;
- usa l'avvio locale senza Docker se vuoi lavorare servizio per servizio;
- usa Docker Compose se vuoi porte fisse e startup coordinato;
- verifica su Eureka le porte dei servizi avviati senza Docker.
