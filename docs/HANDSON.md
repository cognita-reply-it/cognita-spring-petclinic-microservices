# Spring Petclinic Microservices - Hands-on Briefing

Questo repository contiene la versione microservices della Spring Petclinic sample application. Dal `README.md` emerge che l'obiettivo e' mostrare come suddividere Petclinic in piu' servizi Spring Boot con Spring Cloud.

## Scopo del progetto

Dal `README.md` e dal `pom.xml` root si ricava che il progetto:

- e' una distribuzione microservices della Spring Petclinic sample application;
- usa Spring Cloud per configurazione centralizzata, discovery e gateway;
- include osservabilita' e resilienza tramite Actuator, Micrometer, Prometheus, Zipkin e Resilience4j;
- include un servizio GenAI basato su Spring AI.

## Servizi presenti

La struttura del repository e il `pom.xml` root mostrano questi moduli:

- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`
- `spring-petclinic-genai-service`
- `spring-petclinic-admin-server`

Dal `README.md` risulta anche che il servizio API Gateway e' il punto di ingresso per il frontend AngularJS.

## Porte esposte

Le porte esposte sono indicate nel `README.md` e nel `docker-compose.yml`:

- `8080` - API Gateway / frontend AngularJS
- `8081` - customers-service
- `8082` - visits-service
- `8083` - vets-service
- `8084` - genai-service
- `8761` - discovery-server
- `8888` - config-server
- `9090` - admin-server
- `9091` - Prometheus
- `9411` - tracing-server / Zipkin
- `3030` - Grafana

Il `README.md` specifica che `customers-service`, `vets-service`, `visits-service` e `genai-service` possono usare porte variabili quando avviati localmente senza Docker; in quel caso la porta va letta dalla registrazione su Eureka.

## Dipendenze principali

Dal `pom.xml` root e dai `pom.xml` dei moduli emergono le dipendenze chiave:

- Spring Boot `4.0.1` come parent del build;
- Java `17`;
- Spring Cloud `2025.1.0`;
- Spring Cloud Config Server e Config Client;
- Spring Cloud Netflix Eureka Server e Client;
- Spring Cloud Gateway WebFlux;
- Spring Cloud Circuit Breaker con Resilience4j;
- Spring Boot Actuator;
- Micrometer Prometheus;
- Zipkin tracing;
- Spring Boot Admin server;
- JPA per i servizi dati;
- HSQLDB come database in-memory di default nei servizi dati;
- MySQL Connector/J per il profilo MySQL;
- Spring AI nel `spring-petclinic-genai-service`, con modello OpenAI attivo per default e Azure OpenAI presente come alternativa commentata nel `pom.xml`.

Nel `pom.xml` si vedono anche dipendenze opzionali per supporto operativo e test, come Chaos Monkey, Jolokia e datasource-micrometer.

## Core vs opzionale

### Core

Questa parte e' necessaria per far funzionare il sistema base:

- `config-server`
- `discovery-server`
- `api-gateway`
- `customers-service`
- `vets-service`
- `visits-service`

Il `README.md` dice che Config Server e Discovery Server devono partire prima degli altri servizi applicativi.

### Opzionale

Il repository documenta come opzionali o non indispensabili per il flusso base:

- `admin-server`
- `tracing-server` / Zipkin
- `grafana-server`
- `prometheus-server`
- avvio del servizio `genai-service` se non serve il chatbot
- il profilo `mysql`, rispetto al database in-memory di default

Il `README.md` indica anche che l'avvio di Tracing server, Admin server, Grafana e Prometheus e' opzionale.

## Avvio locale senza Docker

Il `README.md` indica che ogni microservizio e' una Spring Boot application e puo' essere avviato con IDE oppure con `../mvnw spring-boot:run`.

Punti operativi ricavati dal repository:

- prima partono `config-server` e `discovery-server`;
- poi si avviano `customers-service`, `vets-service`, `visits-service` e `api-gateway`;
- `admin-server`, `tracing-server`, `grafana` e `prometheus` sono opzionali;
- il `README.md` segnala che, senza Docker, i servizi applicativi non hanno una porta fissa nel testo e vanno controllati tramite Eureka Dashboard;
- se si vuole usare una configurazione Git locale per Config Server, il `README.md` indica il profilo `native` e la variabile `GIT_REPO`.

## Avvio con Docker Compose

Il `README.md` e `docker-compose.yml` descrivono un avvio dell'infrastruttura tramite container.

Flusso supportato dal repository:

1. costruire le immagini con `./mvnw clean install -P buildDocker`;
2. avviare lo stack con `docker compose up` oppure `podman-compose up`.

Nel `docker-compose.yml` si vede che:

- `config-server` e `discovery-server` hanno healthcheck;
- i servizi applicativi dipendono da `config-server` e `discovery-server` tramite `depends_on` con condizione `service_healthy`;
- `genai-service` riceve le variabili `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`;
- le porte pubblicate sono fisse e corrispondono al blocco "Porte esposte" sopra.

Il `README.md` segnala anche che, dopo l'avvio, l'API Gateway puo' impiegare un po' di tempo prima di sincronizzarsi con il service registry.

## Differenza pratica tra i due avvii

- Senza Docker: avvii le Spring Boot app una per una; devi rispettare l'ordine Config/Discovery prima degli altri servizi.
- Con Docker Compose: parti con immagini pre-costruite e avvii lo stack con un comando unico; l'ordine e' coordinato dai healthcheck e dai `depends_on`.

## Note operative

- Il repository usa HSQLDB in-memory come configurazione di default per i servizi dati.
- Il profilo `mysql` richiede di avviare `visits-service`, `customers-service` e `vets-service` con quel profilo.
- Il servizio `genai-service` supporta OpenAI di default; Azure OpenAI e' un'alternativa prevista nel `pom.xml`.
