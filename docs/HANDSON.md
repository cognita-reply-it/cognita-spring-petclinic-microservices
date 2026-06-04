# Spring Petclinic Microservices - Repo Briefing

Questo documento riassume il repository in modo operativo per un hands-on Codex App, usando solo evidenze presenti in `README.md`, nei `pom.xml`, in `docker-compose.yml` e nella struttura del repository.

## Scopo Del Progetto

Il repository contiene la versione distribuita di Spring PetClinic, descritta nel README come una sample application separata in microservizi con Spring Cloud e Spring AI.

L'obiettivo operativo del repo e':
- fornire un esempio di architettura a microservizi Spring;
- mostrare il flusso locale con servizi Java avviati singolarmente;
- mostrare un flusso completo con immagini Docker e `docker-compose`;
- includere componenti opzionali per osservabilita', amministrazione e GenAI.

## Servizi Presenti

Dalla struttura del repository e dal `pom.xml` root risultano questi moduli Maven:

- `spring-petclinic-admin-server`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`
- `spring-petclinic-genai-service`
- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`

Ruolo operativo dei servizi, come descritto nel README:

- `spring-petclinic-api-gateway`: gateway API e frontend legacy AngularJS.
- `spring-petclinic-customers-service`: gestione clienti e animali.
- `spring-petclinic-vets-service`: gestione veterinari.
- `spring-petclinic-visits-service`: gestione visite.
- `spring-petclinic-config-server`: configurazione centralizzata.
- `spring-petclinic-discovery-server`: service discovery Eureka.
- `spring-petclinic-genai-service`: chatbot / integrazione GenAI.
- `spring-petclinic-admin-server`: server Spring Boot Admin.

## Porte Esposte

Le porte osservabili nel README e in `docker-compose.yml` sono:

- `8080`: API Gateway / frontend.
- `8081`: `customers-service` in Docker Compose.
- `8082`: `visits-service` in Docker Compose.
- `8083`: `vets-service` in Docker Compose.
- `8084`: `genai-service` in Docker Compose.
- `8761`: Discovery Server.
- `8888`: Config Server.
- `9090`: Admin Server.
- `9411`: Tracing Server / Zipkin.
- `3030`: Grafana.
- `9091`: Prometheus.

Nel README e' indicato che, nel flusso locale senza Docker, `Customers`, `Vets`, `Visits` e `GenAI` possono partire su porta casuale e vanno controllati nel dashboard Eureka.

## Dipendenze Principali

Dal README e dal `pom.xml` root emergono queste dipendenze tecniche principali:

- Spring Boot `4.0.1` come parent del build.
- Java `17`.
- Spring Cloud `2025.1.0`.
- Spring Cloud Gateway.
- Spring Cloud Circuit Breaker.
- Spring Cloud Config.
- Spring Cloud Netflix Eureka.
- Micrometer Tracing.
- Resilience4j.
- OpenTelemetry.
- Spring AI.
- Chaos Monkey Spring Boot.
- Jolokia.
- `datasource-micrometer-spring-boot`.

Dal README emergono anche dipendenze funzionali e operative:

- HSQLDB come database in-memory di default.
- MySQL come alternativa esplicita per il profilo `mysql`.
- Docker / Podman per il flusso containerizzato.
- Zipkin, Grafana, Prometheus e Spring Boot Admin come componenti di supporto.

## Core E Cosa E' Opzionale

### Core

Per l'uso normale del repository, il nucleo funzionale e' una lettura operativa dei servizi che il README presenta come necessari per far partire il sistema:

- `spring-petclinic-config-server`
- `spring-petclinic-discovery-server`
- `spring-petclinic-api-gateway`
- `spring-petclinic-customers-service`
- `spring-petclinic-vets-service`
- `spring-petclinic-visits-service`

Questi sono i servizi necessari per far funzionare la PetClinic distribuita nel flusso Java locale descritto nel README.

### Opzionale

Sono opzionali, salvo che il task richieda esplicitamente il contrario:

- `spring-petclinic-admin-server`
- `spring-petclinic-genai-service`
- `tracing-server` / Zipkin
- `grafana-server`
- `prometheus-server`
- supporto Docker / Podman come modalita' di esecuzione

Nel README il tracing, l'admin server, Grafana e Prometheus sono indicati come opzionali nel flusso locale senza Docker.

Per la parte GenAI, il README indica che il servizio supporta OpenAI o Azure OpenAI e richiede credenziali di provider; quindi, per un hands-on generico, va trattato come componente opzionale.

## Avvio Locale Senza Docker

Il README descrive questo flusso come avvio diretto dei singoli microservizi:

- ogni microservizio e' una Spring Boot application;
- si puo' usare l'IDE oppure `../mvnw spring-boot:run`;
- `config-server` e `discovery-server` vanno avviati prima degli altri servizi;
- `customers-service`, `vets-service`, `visits-service` e `api-gateway` dipendono dal supporto di configurazione e discovery;
- tracing, admin, Grafana e Prometheus sono opzionali;
- i servizi business possono partire su porta casuale e vengono registrati in Eureka.

Il README indica anche che il `config-server` puo' usare un repository Git locale tramite profilo `native` e variabile `GIT_REPO`.

## Avvio Con Docker Compose

Il flusso Docker prevede due passi:

1. costruzione delle immagini con Maven e profilo `buildDocker`;
2. avvio dell'infrastruttura con `docker compose up` oppure `podman-compose up`.

Nel README e nel `docker-compose.yml` si vede che questo flusso mette insieme:

- config server;
- discovery server;
- customers service;
- visits service;
- vets service;
- genai service;
- api gateway;
- tracing server;
- admin server;
- Grafana;
- Prometheus.

Nel file `docker-compose.yml` sono presenti `depends_on` e healthcheck per coordinare l'ordine di startup. Questo significa che il flusso Docker e' pensato per un avvio completo e piu' automatizzato rispetto all'avvio locale manuale.

Nota operativa dal README:
- su macOS o Windows serve memoria sufficiente per la VM Docker;
- il gateway puo' mostrare timeout iniziali mentre i servizi si sincronizzano con Eureka;
- il README suggerisce di controllare la disponibilita' dei servizi dal dashboard Eureka.

## Differenza Tra I Due Flussi

### Senza Docker

- si avviano i servizi come applicazioni Spring Boot separate;
- serve avviare prima i servizi di supporto;
- i servizi business possono usare porte casuali;
- alcune componenti restano opzionali;
- e' il flusso piu' adatto per lavorare sul codice e sui test locali.

### Con Docker Compose

- si usano immagini container gia' costruite;
- l'avvio e' guidato da compose e dai healthcheck;
- le porte sono fissate e dichiarate in `docker-compose.yml`;
- il flusso include anche componenti opzionali come tracing, admin, Grafana e Prometheus;
- e' il flusso piu' adatto per una dimostrazione full-stack o per verificare l'infrastruttura completa.

## Nota Su Database E Profili

Dal README:

- il comportamento di default usa HSQLDB in-memory con dati caricati all'avvio;
- MySQL e' un'alternativa esplicita;
- per usare MySQL, il README indica il profilo `mysql` sui servizi `visits-service`, `customers-service` e `vets-service`.

Per un hands-on base, il default HSQLDB e' il punto di partenza piu' semplice.

## Lettura Rapida Per Chi Entra Nel Repo

Se devi iniziare a usare il repository:

1. considera `api-gateway` come punto di ingresso del frontend;
2. considera `config-server` e `discovery-server` come prerequisiti del flusso Java locale;
3. considera `customers`, `vets` e `visits` come core domain services;
4. tratta `genai`, `admin`, `tracing`, `grafana` e `prometheus` come estensioni opzionali;
5. scegli l'avvio senza Docker se stai lavorando sul codice; scegli Docker Compose se ti serve una dimostrazione integrata dell'intero stack.
