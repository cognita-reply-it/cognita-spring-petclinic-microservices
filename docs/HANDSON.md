# Hands-on briefing

Questo repository contiene la versione microservices di Spring PetClinic.
La base funzionale dichiarata nel `README.md` e' una demo per mostrare come dividere una sample Spring application in microservizi usando Spring Cloud Gateway, Spring Cloud Config, Eureka service discovery, Micrometer Tracing, Resilience4j, OpenTelemetry e Spring Cloud Netflix/Eureka.

## Scopo del progetto

- Dimostrare una architettura Spring in stile microservices a partire da Spring PetClinic.
- Esporre un frontend applicativo attraverso l'API Gateway.
- Centralizzare configurazione, discovery e osservabilita' tramite i servizi di supporto inclusi nel repository.
- Integrare un servizio GenAI/Chatbot che nel `README.md` e' descritto come supporto a OpenAI di default o Azure OpenAI.

## Servizi presenti

Dal `pom.xml` root e dalla struttura delle cartelle risultano questi moduli:

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

## Porte esposte

Dal `README.md` e da `docker-compose.yml`:

- `8761` - Discovery Server
- `8888` - Config Server
- `8080` - API Gateway
- `8081` - Customers Service
- `8082` - Visits Service
- `8083` - Vets Service
- `8084` - GenAI Service
- `9411` - Tracing Server
- `9090` - Admin Server
- `3030` - Grafana
- `9091` - Prometheus

Nel `README.md` e' indicato che, in avvio locale senza Docker, i servizi `customers-service`, `vets-service`, `visits-service` e `genai-service` possono partire su porta casuale; la porta da usare va letta da Eureka.

## Dipendenze principali

Dal `pom.xml` root:

- Spring Boot parent `4.0.1`
- Java `17`
- Spring Cloud `2025.1.0`
- plugin/strumenti condivisi per build info, git properties e enforce della versione Java

Dal `pom.xml` dei moduli:

- `spring-cloud-starter-config` nei servizi che leggono la configurazione centralizzata
- `spring-cloud-starter-netflix-eureka-client` nei servizi client del registry
- `spring-cloud-starter-netflix-eureka-server` nel discovery server
- `spring-cloud-starter-gateway-server-webflux` nell'API Gateway
- `spring-cloud-config-server` nel config server
- `spring-boot-admin-starter-server` e `spring-boot-admin-server-ui` nell'admin server
- `spring-boot-starter-webmvc` e `spring-boot-starter-data-jpa` nei servizi applicativi
- `spring-boot-starter-actuator`, `micrometer-registry-prometheus` e `jolokia-core` per health/metriche
- `spring-boot-starter-zipkin` per tracing
- `hsqldb` come database in-memory di default
- `mysql-connector-j` per il profilo MySQL
- `chaos-monkey-spring-boot` nei moduli che lo dichiarano
- nel `genai-service`, `spring-ai-starter-model-openai` e il BOM `spring-ai-bom`

Dal `README.md` emerge anche che il servizio GenAI puo' essere configurato per OpenAI o Azure OpenAI tramite variabili d'ambiente.

## Core vs opzionale

### Core

Questa e' la parte minima che il `README.md` descrive come necessaria per un flusso completo:

- Config Server
- Discovery Server
- API Gateway
- Customers Service
- Vets Service
- Visits Service

Il `README.md` include anche il `GenAI Service` nell'elenco dei microservizi e lo tratta come parte integrante dell'applicazione estesa con chatbot.

### Opzionale

Sempre secondo il `README.md`:

- Tracing Server
- Admin Server
- Grafana
- Prometheus

Inoltre, il profilo MySQL e' descritto come alternativa rispetto al database in-memory HSQLDB.

## Avvio locale senza Docker

Il `README.md` dice che ogni microservizio e' una applicazione Spring Boot e puo' essere avviato con IDE oppure con `../mvnw spring-boot:run`.

Punti operativi:

- il Config Server e il Discovery Server vanno avviati prima degli altri servizi
- Customers, Vets, Visits e API devono partire dopo i servizi di supporto
- Tracing Server, Admin Server, Grafana e Prometheus sono opzionali
- l'API Gateway e' accessibile su `http://localhost:8080`
- il Discovery Server su `http://localhost:8761`
- il Config Server su `http://localhost:8888`
- il Tracing Server su `http://localhost:9411/zipkin/`
- l'Admin Server su `http://localhost:9090`
- Grafana su `http://localhost:3030`
- Prometheus su `http://localhost:9091`

Il `README.md` specifica anche che, senza Docker, alcuni servizi non usano una porta fissa ma una porta casuale, quindi la discovery tramite Eureka e' il punto di riferimento operativo.

## Avvio con Docker Compose

Il `README.md` e `docker-compose.yml` descrivono un flusso diverso:

1. prima si costruiscono le immagini con `./mvnw clean install -P buildDocker`
2. poi si avvia tutto con `docker compose up` oppure `podman-compose up`

Caratteristiche operative del flusso Docker Compose:

- l'ordine di avvio e' coordinato da `depends_on` e `healthcheck`
- le immagini usano i tag `springcommunity/spring-petclinic-*`
- il GenAI service riceve le variabili `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`
- le porte sono mappate in modo esplicito su host, quindi l'accesso e' stabile

## Differenza pratica tra i due avvii

- Senza Docker: ogni servizio e' lanciato come processo Java/Spring Boot separato; l'operatore deve rispettare l'ordine Config -> Discovery -> servizi applicativi.
- Con Docker Compose: il repository prevede immagini gia' costruite e un avvio coordinato tramite healthcheck; la sequenza e' automatizzata e l'esposizione porte e' dichiarata nel file compose.

## Cose da tenere a mente durante un hands-on

- Il repository richiede Java 17.
- Il `README.md` indica che il branch `main` usa una base image Eclipse Temurin con Java 17 per i container.
- Il database predefinito e' HSQLDB in-memory.
- Il profilo MySQL esiste, ma richiede configurazione aggiuntiva.
- Il servizio GenAI dipende da credenziali esterne se si usa OpenAI o Azure OpenAI.

