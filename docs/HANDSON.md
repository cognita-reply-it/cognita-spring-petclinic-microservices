# Spring Petclinic Microservices Hands-on Briefing

Questo repository contiene la versione microservizi di Spring PetClinic, costruita con Spring Cloud e Spring AI. L'obiettivo del progetto e' mostrare come una classica applicazione PetClinic possa essere divisa in servizi separati, con gateway, discovery, configurazione centralizzata, tracing e integrazione GenAI.

## Scopo del progetto

- Applicazione demo distribuita basata su Spring Boot 4.0.1 e Java 17.
- Architettura a microservizi con Spring Cloud Gateway, Spring Cloud Config e Eureka Service Discovery.
- Frontend AngularJS servito dall'API Gateway.
- Integrazione Spring AI tramite un microservizio dedicato alla chat.

## Servizi presenti

Dal `pom.xml` root risultano questi moduli:

- `spring-petclinic-admin-server`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`
- `spring-petclinic-genai-service`
- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`

Dal `README.md` emerge questo ruolo operativo:

- `config-server`: configurazione centralizzata.
- `discovery-server`: registry Eureka.
- `api-gateway`: ingresso HTTP e frontend AngularJS.
- `customers-service`: dati degli owner e dei pet.
- `vets-service`: dati dei veterinari.
- `visits-service`: dati delle visite.
- `genai-service`: chatbot applicativo.
- `admin-server`: Spring Boot Admin.
- `tracing-server`: Zipkin.
- `grafana-server` e `prometheus-server`: osservabilita' e metriche.

## Porte esposte

### Avvio locale senza Docker

Il `README.md` indica questi endpoint locali:

- Discovery Server: `http://localhost:8761`
- Config Server: `http://localhost:8888`
- API Gateway / frontend AngularJS: `http://localhost:8080`
- Tracing Server (Zipkin): `http://localhost:9411/zipkin/`
- Admin Server: `http://localhost:9090`
- Grafana: `http://localhost:3030`
- Prometheus: `http://localhost:9091`

Per i microservizi applicativi (`customers`, `vets`, `visits`, `genai`) il README segnala che partono su porta casuale in locale e vanno letti dal dashboard Eureka.

### Docker Compose

Il `docker-compose.yml` espone queste porte host:

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

Dal `pom.xml` root:

- Spring Boot `4.0.1`
- Java `17`
- Spring Cloud `2025.1.0`
- profilo `buildDocker` per costruire le immagini OCI

Dal `README.md` e dai POM dei moduli:

- Spring Cloud Config
- Spring Cloud Discovery / Eureka
- Spring Cloud Gateway
- Spring Boot Admin
- Micrometer Tracing e Zipkin
- Micrometer Prometheus
- MySQL Connector/J per i moduli che supportano il profilo `mysql`
- Spring AI OpenAI oppure Azure OpenAI nel modulo GenAI

## Core e opzionale

### Core

Questi elementi sono necessari per il flusso locale normale descritto nel README:

- `config-server`
- `discovery-server`
- `api-gateway`
- `customers-service`
- `vets-service`
- `visits-service`

### Opzionale o dipendente dal caso d'uso

- `genai-service`: serve per il chatbot.
- `tracing-server`: tracing distribuito.
- `admin-server`: Spring Boot Admin.
- `grafana-server` e `prometheus-server`: monitoraggio e dashboard.
- profilo `mysql`: solo se si vuole usare MySQL invece di HSQLDB.
- profilo `buildDocker`: solo se si vogliono costruire le immagini Docker/OCI.

## Avvio locale senza Docker

Uso previsto:

- sviluppo rapido;
- verifica funzionale dei servizi;
- lavoro sui moduli Java senza richiedere container.

Flusso supportato dal README:

1. Avviare prima `config-server` e `discovery-server`.
2. Avviare poi gli altri servizi Java con `../mvnw spring-boot:run` o dall'IDE.
3. Accedere al gateway su `http://localhost:8080`.
4. Controllare Eureka per vedere le porte effettive dei microservizi applicativi.

Nota sui dati:

- di default il progetto usa HSQLDB in-memory con popolamento all'avvio;
- per MySQL bisogna attivare il profilo `mysql` sui moduli indicati dal README.

## Avvio con Docker Compose

Uso previsto:

- avvio dell'infrastruttura completa;
- verifica full stack;
- ambiente riproducibile con i container già costruiti.

Flusso supportato dal README:

1. Costruire le immagini con `./mvnw clean install -P buildDocker`.
2. Avviare lo stack con `docker compose up` o `podman-compose up`.
3. Lasciare che i servizi partano nell'ordine imposto da `service_healthy`.
4. Attendere la sincronizzazione del gateway con il registry Eureka.

Differenza pratica rispetto all'avvio locale:

- senza Docker si avviano i singoli processi Java;
- con Docker Compose si avvia lo stack completo tramite container;
- Compose usa dipendenze e healthcheck per coordinare l'ordine di startup;
- il README segnala che il gateway puo' mostrare timeout iniziali finche' Eureka non e' allineato.

## Lettura rapida

- Se vuoi lavorare sul codice: usa l'avvio locale senza Docker.
- Se vuoi verificare il comportamento end-to-end dell'infrastruttura: usa Docker Compose.
- Se vuoi la chat AI: devi considerare anche il `genai-service` e le credenziali del provider scelto.
