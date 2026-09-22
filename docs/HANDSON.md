# Spring Petclinic Microservices — hands-on

Questo documento è una guida operativa ricavata esclusivamente da `README.md`, dai `pom.xml`, da `docker-compose.yml` e dalla struttura del repository.

## Scopo del progetto

Il repository è una versione distribuita della Spring PetClinic Sample Application. Il progetto dimostra come separare l'applicazione in microservizi Spring Boot. La comunicazione e l'infrastruttura usano Spring Cloud Gateway, Spring Cloud Config, Spring Cloud Circuit Breaker/Resilience4j, Micrometer/OpenTelemetry e la service discovery Eureka di Spring Cloud Netflix.

Il modulo root Maven è `spring-petclinic-microservices`, versione `4.0.1`, con Java 17 e Spring Cloud `2025.1.0`.

## Servizi e porte

| Servizio | Ruolo documentato | Porta esposta |
|---|---|---:|
| `config-server` | Configurazione centralizzata | 8888 |
| `discovery-server` | Registro Eureka per la service discovery | 8761 |
| `api-gateway` | Frontend AngularJS e punto di ingresso che instrada le richieste | 8080 |
| `customers-service` | Dati dei clienti/proprietari | 8081 in Compose; porta casuale in avvio locale |
| `visits-service` | Dati delle visite | 8082 in Compose; porta casuale in avvio locale |
| `vets-service` | Informazioni sui veterinari | 8083 in Compose; porta casuale in avvio locale |
| `genai-service` | Interfaccia chatbot per l'applicazione | 8084 in Compose; porta casuale in avvio locale |
| `tracing-server` | Tracing Zipkin | 9411 |
| `admin-server` | Spring Boot Admin | 9090 |
| `grafana-server` | Dashboard Grafana | 3030 (container 3000) |
| `prometheus-server` | Metriche Prometheus | 9091 (container 9090) |

Gli URL principali indicati dal README sono `http://localhost:8080` per PetClinic, `http://localhost:8761` per Eureka, `http://localhost:8888` per Config Server, `http://localhost:9411/zipkin/` per Zipkin, `http://localhost:9090` per Admin, `http://localhost:3030` per Grafana e `http://localhost:9091` per Prometheus.

## Dipendenze principali

- **Runtime e build:** Maven Wrapper (`./mvnw`), Spring Boot `4.0.1`, Java 17 e Spring Cloud `2025.1.0`.
- **Infrastruttura distribuita:** Spring Cloud Config, Eureka client/server, Spring Cloud Gateway e Spring Cloud Circuit Breaker con Resilience4j.
- **Servizi dati:** Spring Data JPA; HSQLDB è il database in-memory predefinito. I moduli customers, vets, visits e genAI includono anche MySQL Connector/J per il profilo MySQL descritto nel README.
- **Osservabilità:** Actuator, Micrometer/Prometheus, Zipkin starter e Jolokia. Il root POM gestisce anche `datasource-micrometer-spring-boot`.
- **Frontend:** l'API Gateway contiene il frontend AngularJS e le dipendenze WebJars (AngularJS, Bootstrap, Font Awesome e altre).
- **GenAI:** il modulo genAI include Spring AI OpenAI (abilitato di default), vector store, cache Caffeine e supporto al provider Azure OpenAI descritto nel README.
- **Build container:** il profilo Maven `buildDocker` usa Docker per costruire immagini OCI; il README documenta anche Podman.

## Cosa è core e cosa è opzionale

### Core

Per un avvio funzionale locale, il README richiede di avviare prima `config-server` e `discovery-server`, poi `customers-service`, `vets-service`, `visits-service` e `api-gateway`. Il gateway è il punto di accesso all'applicazione su porta 8080.

### Opzionale

Il README dichiara opzionali Tracing server, Admin server, Grafana e Prometheus. Anche il `genai-service` è separato dal flusso core descritto sopra; il suo POM e Compose richiedono inoltre un provider LLM e variabili come `OPENAI_API_KEY` oppure quelle Azure per usarlo.

MySQL è un'opzione rispetto al database in-memory HSQLDB: il README lo presenta come profilo alternativo e richiede di avviare i tre servizi dati con il profilo `mysql`.

## Avvio locale senza Docker

Ogni microservizio è un'applicazione Spring Boot avviabile da IDE o con `../mvnw spring-boot:run` dalla directory del modulo. L'ordine minimo documentato è:

1. `config-server`;
2. `discovery-server`;
3. `customers-service`, `vets-service`, `visits-service` e `api-gateway`.

In questa modalità Config e Discovery devono essere disponibili prima degli altri servizi. Customers, Vets, Visits e GenAI usano una porta casuale: la porta va individuata dalla dashboard Eureka. Tracing, Admin, Grafana e Prometheus possono essere avviati separatamente e sono opzionali.

Il Config Server può usare un repository Git locale impostando il profilo Spring `native` e la variabile `GIT_REPO`, secondo l'esempio nel README.

## Avvio con Docker Compose

Per il flusso Compose documentato:

1. Assicurarsi che Docker o Docker Desktop sia installato e in esecuzione.
2. Costruire le immagini con `./mvnw clean install -P buildDocker`.
3. Avviare lo stack con `docker compose up`.

Il profilo `buildDocker` costruisce le immagini dei moduli Maven; il POM usa di default Docker, `linux/amd64` e il prefisso immagini `springcommunity`. Il README documenta anche Podman con `-Dcontainer.executable=podman` e la selezione di altre architetture con `-Dcontainer.platform`.

Compose avvia tutti i servizi dichiarati nel file, incluse osservabilità e tracing. Le dipendenze tra Config, Discovery e gli altri servizi sono coordinate con `depends_on` e condizioni `service_healthy`; i container espongono le porte fisse riportate nella tabella. Per il genAI, Compose inoltra le variabili `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`.

Dopo `docker compose up` il gateway può impiegare tempo per sincronizzarsi con il registro Eureka; i timeout iniziali del gateway sono quindi compatibili con il normale startup descritto nel README. La disponibilità può essere controllata dalla dashboard Eureka su `http://localhost:8761`.

## Confini di questa guida

Questa guida non deduce porte o comportamenti da file di configurazione non inclusi nelle fonti richieste. In particolare, per l'avvio locale le porte casuali dei servizi indicate dal README non vengono sostituite con valori ricavati da altri file.
