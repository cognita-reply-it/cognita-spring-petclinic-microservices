# Hands-on Spring Petclinic Microservices

Questo documento riassume il repository per un hands-on Codex App. Le informazioni sono ricavate solo da `README.md`, dai `pom.xml`, da `docker-compose.yml` e dalla struttura del repository.

## Scopo del progetto

Il repository contiene una versione distribuita della Spring PetClinic Sample Application. Il `README.md` la descrive come una applicazione Spring PetClinic divisa in microservizi per dimostrare un'architettura basata su Spring Cloud e Spring AI.

Il progetto usa Spring Cloud Gateway, Spring Cloud Circuit Breaker, Spring Cloud Config, Micrometer Tracing, Resilience4j, OpenTelemetry ed Eureka Service Discovery. L'accesso utente passa dall'API Gateway, che espone anche il frontend AngularJS indicato dal `README.md`.

## Struttura Maven e servizi

Il `pom.xml` principale e' un aggregatore Maven con packaging `pom` e dichiara questi moduli applicativi:

| Modulo | Ruolo operativo |
| --- | --- |
| `spring-petclinic-config-server` | Config Server centralizzato per gli altri servizi. |
| `spring-petclinic-discovery-server` | Service registry Eureka. |
| `spring-petclinic-api-gateway` | API Gateway e frontend AngularJS esposto su HTTP. |
| `spring-petclinic-customers-service` | Gestione dei dati dei clienti/proprietari e pet. |
| `spring-petclinic-vets-service` | Gestione delle informazioni sui veterinari. |
| `spring-petclinic-visits-service` | Gestione delle visite dei pet. |
| `spring-petclinic-genai-service` | Servizio GenAI/chatbot integrato con Spring AI. |
| `spring-petclinic-admin-server` | Spring Boot Admin server. |

Sono presenti anche questi percorsi operativi:

| Percorso | Uso |
| --- | --- |
| `docker-compose.yml` | Avvio containerizzato dei servizi applicativi e degli strumenti di supporto. |
| `docker/` | Build context per Grafana e Prometheus, piu' Dockerfile condiviso usato dal profilo Maven `buildDocker`. |
| `docs/` | Documentazione e immagini del progetto. |
| `scripts/` | Script operativi citati dal `README.md`, inclusi bootstrap e avvio misto Docker/Java. |

`docker-compose.yml` aggiunge anche servizi infrastrutturali non presenti come moduli Maven:

| Servizio Compose | Ruolo operativo |
| --- | --- |
| `tracing-server` | Zipkin, usato come tracing server. |
| `grafana-server` | Grafana per dashboard metriche. |
| `prometheus-server` | Prometheus per raccolta metriche. |

## Porte esposte

### Avvio locale senza Docker

Secondo il `README.md`, con avvio locale via IDE o `../mvnw spring-boot:run`:

| Componente | URL o porta |
| --- | --- |
| Discovery Server | `http://localhost:8761` |
| Config Server | `http://localhost:8888` |
| AngularJS frontend / API Gateway | `http://localhost:8080` |
| Customers, Vets, Visits, GenAI | Porta random; verificare nella Eureka Dashboard. |
| Tracing Server / Zipkin | `http://localhost:9411/zipkin/` |
| Admin Server | `http://localhost:9090` |
| Grafana | `http://localhost:3030` |
| Prometheus | `http://localhost:9091` |

### Avvio con Docker Compose

`docker-compose.yml` espone queste porte host:

| Servizio Compose | Immagine/build | Porta host -> container |
| --- | --- | --- |
| `config-server` | `springcommunity/spring-petclinic-config-server` | `8888 -> 8888` |
| `discovery-server` | `springcommunity/spring-petclinic-discovery-server` | `8761 -> 8761` |
| `customers-service` | `springcommunity/spring-petclinic-customers-service` | `8081 -> 8081` |
| `visits-service` | `springcommunity/spring-petclinic-visits-service` | `8082 -> 8082` |
| `vets-service` | `springcommunity/spring-petclinic-vets-service` | `8083 -> 8083` |
| `genai-service` | `springcommunity/spring-petclinic-genai-service` | `8084 -> 8084` |
| `api-gateway` | `springcommunity/spring-petclinic-api-gateway` | `8080 -> 8080` |
| `tracing-server` | `openzipkin/zipkin` | `9411 -> 9411` |
| `admin-server` | `springcommunity/spring-petclinic-admin-server` | `9090 -> 9090` |
| `grafana-server` | build locale da `./docker/grafana` | `3030 -> 3000` |
| `prometheus-server` | build locale da `./docker/prometheus` | `9091 -> 9090` |

## Dipendenze principali

Il `pom.xml` root usa:

- Spring Boot parent `4.0.1`.
- Java `17`.
- Spring Cloud dependencies `2025.1.0`.
- versioni gestite per Chaos Monkey for Spring Boot, Jolokia e `datasource-micrometer-spring-boot`.
- profilo Maven `buildDocker` per costruire immagini OCI con `docker` o `podman`.

Dipendenze ricorrenti nei moduli:

| Area | Evidenza nei POM |
| --- | --- |
| Configurazione centralizzata | `spring-cloud-config-server` nel Config Server; `spring-cloud-starter-config` nei client. |
| Service discovery | `spring-cloud-starter-netflix-eureka-server` nel Discovery Server; `spring-cloud-starter-netflix-eureka-client` nei servizi client. |
| API Gateway | `spring-cloud-starter-gateway-server-webflux` e circuit breaker Reactor Resilience4j nel modulo API Gateway. |
| Web/API | `spring-boot-starter-webmvc` nei servizi applicativi; WebFlux nel gateway. |
| Persistenza | `spring-boot-starter-data-jpa`, runtime HSQLDB e MySQL Connector/J nei servizi dati. |
| Osservabilita' | Spring Boot Actuator, Zipkin starter, Micrometer Prometheus, Jolokia, Grafana e Prometheus in Docker Compose. |
| UI | WebJars AngularJS, Bootstrap, Font Awesome, Angular UI Router e Marked nel modulo API Gateway. |
| GenAI | `spring-ai-starter-model-openai`, `spring-ai-vector-store` e BOM Spring AI nel modulo GenAI. |
| Admin | `spring-boot-admin-starter-server` e `spring-boot-admin-server-ui` nel modulo Admin Server. |
| Test | JUnit Jupiter e Spring Boot test starter nei moduli. |

## Core e opzionale

Per l'avvio locale senza Docker, il `README.md` dice che Config Server e Discovery Server devono partire prima delle altre applicazioni. Per usare la PetClinic dal browser, il percorso core e':

1. `spring-petclinic-config-server`
2. `spring-petclinic-discovery-server`
3. `spring-petclinic-customers-service`
4. `spring-petclinic-vets-service`
5. `spring-petclinic-visits-service`
6. `spring-petclinic-api-gateway`

Sono opzionali o aggiuntivi rispetto al core:

- `spring-petclinic-genai-service`, per la funzionalita' chatbot Spring AI. Il `README.md` richiede la scelta del provider OpenAI o Azure OpenAI e le relative variabili d'ambiente quando si configura il provider.
- `tracing-server` / Zipkin, `spring-petclinic-admin-server`, Grafana e Prometheus: il `README.md` dichiara che Tracing server, Admin server, Grafana e Prometheus sono opzionali in avvio locale.
- MySQL: la configurazione di default usa HSQLDB in memoria e popolato allo startup; il `README.md` descrive MySQL come setup alternativo per una configurazione persistente.
- Chaos Monkey: dipendenza presente nei `pom.xml` dei servizi dati/applicativi; il `README.md` cita il profilo `chaos-monkey` per lo script `./scripts/run_all.sh`.

## Avvio locale senza Docker

Ogni microservizio e' una applicazione Spring Boot e il `README.md` indica che puo' essere avviato da IDE o con:

```bash
../mvnw spring-boot:run
```

Uso operativo:

1. Avviare prima Config Server.
2. Avviare Discovery Server.
3. Avviare Customers, Vets, Visits e API Gateway; GenAI e' incluso nell'elenco dei servizi applicativi del `README.md`.
4. Usare la Eureka Dashboard su `http://localhost:8761` per verificare le porte random di Customers, Vets, Visits e GenAI.
5. Aprire l'applicazione da `http://localhost:8080`.

Per usare una configurazione locale del Config Server, il `README.md` indica il profilo Spring `native` e la variabile `GIT_REPO`, per esempio:

```bash
-Dspring.profiles.active=native -DGIT_REPO=/projects/spring-petclinic-microservices-config
```

Tracing Server, Admin Server, Grafana e Prometheus non sono necessari per il percorso base.

## Avvio con Docker Compose

Il `README.md` richiede prima la build delle immagini:

```bash
./mvnw clean install -P buildDocker
```

Sono documentate anche varianti per Podman e per architetture diverse da `linux/amd64`, tramite le proprieta' Maven `container.executable` e `container.platform`.

Dopo la build, l'avvio e':

```bash
docker compose up
```

oppure:

```bash
podman-compose up
```

Nel `docker-compose.yml`, l'ordine di startup e' espresso con `depends_on` e condizione `service_healthy`:

| Servizio | Dipendenze Compose |
| --- | --- |
| `discovery-server` | `config-server` healthy |
| `customers-service` | `config-server` healthy, `discovery-server` healthy |
| `visits-service` | `config-server` healthy, `discovery-server` healthy |
| `vets-service` | `config-server` healthy, `discovery-server` healthy |
| `genai-service` | `config-server` healthy, `discovery-server` healthy |
| `api-gateway` | `config-server` healthy, `discovery-server` healthy |
| `admin-server` | `config-server` healthy, `discovery-server` healthy |

Il `README.md` segnala che, dopo l'avvio, l'API Gateway puo' impiegare tempo a sincronizzarsi con il service registry e che la dashboard Eureka e' disponibile su `http://localhost:8761`.

## Differenza pratica tra i due avvii

| Aspetto | Locale senza Docker | Docker Compose |
| --- | --- | --- |
| Processo di avvio | Ogni modulo Spring Boot si avvia separatamente da IDE o Maven Wrapper. | I container si avviano insieme con `docker compose up` dopo la build immagini. |
| Ordine | Config Server e Discovery Server devono essere avviati prima degli altri servizi. | `depends_on` e healthcheck coordinano l'ordine tra container. |
| Porte servizi applicativi | Gateway su `8080`; Customers, Vets, Visits e GenAI su porta random da Eureka. | Porte fisse esposte: Customers `8081`, Visits `8082`, Vets `8083`, GenAI `8084`, Gateway `8080`. |
| Strumenti opzionali | Tracing, Admin, Grafana e Prometheus sono opzionali secondo il `README.md`. | Zipkin, Admin Server, Grafana e Prometheus sono dichiarati nel Compose. |
| Build richiesta | Non e' richiesta una build Docker; si usa il Maven Wrapper per eseguire i moduli. | Richiede immagini costruite con il profilo Maven `buildDocker`, oppure immagini disponibili con i nomi dichiarati nel Compose. |
| Configurazione GenAI | Richiede variabili OpenAI o Azure OpenAI se si avvia il servizio GenAI. | Il Compose propaga `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT` al container GenAI. |

## Fonti usate

- `README.md`
- `pom.xml`
- `spring-petclinic-*/pom.xml`
- `docker-compose.yml`
- struttura top-level del repository
