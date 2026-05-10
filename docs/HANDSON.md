# Hands-on Spring Petclinic Microservices

Questo repository contiene una versione distribuita della sample application Spring Petclinic. Il README la descrive come una applicazione Spring divisa in microservizi usando Spring Cloud Gateway, Spring Cloud Circuit Breaker, Spring Cloud Config, Micrometer Tracing, Resilience4j, OpenTelemetry ed Eureka Service Discovery.

Il progetto e' pensato per eseguire piu' applicazioni Spring Boot coordinate da Config Server e Discovery Server. L'accesso utente passa dall'API Gateway, che espone anche il frontend AngularJS indicato dal README.

## Struttura del repository

Il `pom.xml` principale e' un aggregatore Maven con packaging `pom` e dichiara questi moduli:

| Modulo | Ruolo operativo |
| --- | --- |
| `spring-petclinic-config-server` | Config Server centralizzato. |
| `spring-petclinic-discovery-server` | Service registry Eureka. |
| `spring-petclinic-api-gateway` | API Gateway e frontend AngularJS. |
| `spring-petclinic-customers-service` | Gestione dei dati dei clienti. |
| `spring-petclinic-vets-service` | Gestione delle informazioni sui veterinari. |
| `spring-petclinic-visits-service` | Gestione delle visite degli animali. |
| `spring-petclinic-genai-service` | Servizio chatbot GenAI. |
| `spring-petclinic-admin-server` | Spring Boot Admin server. |

Sono presenti anche:

| Percorso | Uso |
| --- | --- |
| `docker-compose.yml` | Avvio containerizzato dei servizi applicativi e degli strumenti di supporto. |
| `docker/` | Build context per Grafana, Prometheus e Dockerfile condiviso usato dal profilo Maven `buildDocker`. |
| `docs/` | Documentazione e immagini del progetto. |
| `scripts/` | Script operativi citati dal README, inclusi bootstrap e avvio misto Docker/Java. |

## Servizi e porte

Il README indica queste porte per l'avvio locale senza Docker:

| Servizio | URL locale senza Docker |
| --- | --- |
| Discovery Server | `http://localhost:8761` |
| Config Server | `http://localhost:8888` |
| API Gateway / frontend AngularJS | `http://localhost:8080` |
| Customers, Vets, Visits, GenAI | Porta random, da verificare nella dashboard Eureka |
| Zipkin tracing server | `http://localhost:9411/zipkin/` |
| Spring Boot Admin | `http://localhost:9090` |
| Grafana | `http://localhost:3030` |
| Prometheus | `http://localhost:9091` |

Il `docker-compose.yml` espone invece queste porte host:

| Container | Immagine/build | Porta host |
| --- | --- | --- |
| `config-server` | `springcommunity/spring-petclinic-config-server` | `8888:8888` |
| `discovery-server` | `springcommunity/spring-petclinic-discovery-server` | `8761:8761` |
| `customers-service` | `springcommunity/spring-petclinic-customers-service` | `8081:8081` |
| `visits-service` | `springcommunity/spring-petclinic-visits-service` | `8082:8082` |
| `vets-service` | `springcommunity/spring-petclinic-vets-service` | `8083:8083` |
| `genai-service` | `springcommunity/spring-petclinic-genai-service` | `8084:8084` |
| `api-gateway` | `springcommunity/spring-petclinic-api-gateway` | `8080:8080` |
| `tracing-server` | `openzipkin/zipkin` | `9411:9411` |
| `admin-server` | `springcommunity/spring-petclinic-admin-server` | `9090:9090` |
| `grafana-server` | build locale da `./docker/grafana` | `3030:3000` |
| `prometheus-server` | build locale da `./docker/prometheus` | `9091:9090` |

## Dipendenze principali

Il parent POM usa Spring Boot `4.0.1`, Java `17` e Spring Cloud `2025.1.0`. Gestisce anche versioni comuni per Chaos Monkey for Spring Boot, Jolokia e `datasource-micrometer-spring-boot`.

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

Per l'avvio locale senza Docker, il README dice che Config Server e Discovery Server devono partire prima delle altre applicazioni. Per usare la Petclinic dal browser, il percorso core e':

1. `spring-petclinic-config-server`
2. `spring-petclinic-discovery-server`
3. `spring-petclinic-customers-service`
4. `spring-petclinic-vets-service`
5. `spring-petclinic-visits-service`
6. `spring-petclinic-api-gateway`

Il README elenca Tracing server, Admin server, Grafana e Prometheus come opzionali. Il servizio `spring-petclinic-genai-service` e' un microservizio del progetto e aggiunge il chatbot: per avviarlo il README richiede la scelta del provider OpenAI o Azure OpenAI e le relative variabili d'ambiente, quindi per un hands-on sulla Petclinic base puo' essere trattato come estensione funzionale.

La configurazione database di default usa HSQLDB in memoria, popolato allo startup. Il README descrive MySQL come setup alternativo per una configurazione persistente e richiede il profilo Spring `mysql` sui servizi `visits-service`, `customers-service` e `vets-service`.

## Avvio locale senza Docker

Ogni microservizio e' una applicazione Spring Boot e il README indica che puo' essere avviato da IDE o con:

```bash
../mvnw spring-boot:run
```

Uso operativo:

1. Avviare prima Config Server.
2. Avviare Discovery Server.
3. Avviare Customers, Vets, Visits e API Gateway.
4. Aprire `http://localhost:8080` per accedere alla Petclinic.
5. Per i servizi Customers, Vets, Visits e GenAI, verificare la porta effettiva nella dashboard Eureka.

Per usare una configurazione locale del Config Server, il README indica il profilo Spring `native` e la variabile `GIT_REPO`, per esempio:

```bash
-Dspring.profiles.active=native -DGIT_REPO=/projects/spring-petclinic-microservices-config
```

## Avvio con Docker Compose

Il README richiede prima la build delle immagini:

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

Il README segnala che, dopo l'avvio, l'API Gateway puo' impiegare tempo a sincronizzarsi con il service registry e che la dashboard Eureka e' disponibile su `http://localhost:8761`.

## Differenza pratica tra i due avvii

| Aspetto | Locale senza Docker | Docker Compose |
| --- | --- | --- |
| Processo di avvio | Ogni modulo Spring Boot si avvia separatamente da IDE o Maven Wrapper. | I container si avviano insieme con `docker compose up` dopo la build immagini. |
| Ordine | Config Server e Discovery Server devono essere avviati prima degli altri servizi. | `depends_on` e healthcheck coordinano l'ordine tra container. |
| Porte servizi applicativi | Gateway su `8080`; Customers, Vets, Visits e GenAI su porta random da Eureka. | Porte fisse esposte: Customers `8081`, Visits `8082`, Vets `8083`, GenAI `8084`, Gateway `8080`. |
| Strumenti opzionali | Tracing, Admin, Grafana e Prometheus sono opzionali secondo il README. | Zipkin, Admin Server, Grafana e Prometheus sono dichiarati nel Compose. |
| Build richiesta | Non e' richiesta una build Docker; si usa il Maven Wrapper per eseguire i moduli. | Richiede immagini costruite con il profilo Maven `buildDocker`, oppure immagini disponibili con i nomi dichiarati nel Compose. |
| Configurazione GenAI | Richiede variabili OpenAI o Azure OpenAI se si avvia il servizio GenAI. | Il Compose propaga `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT` al container GenAI. |

## Fonti usate

Questo briefing usa solo evidenza da:

- `README.md`
- `pom.xml`
- `spring-petclinic-*/pom.xml`
- `docker-compose.yml`
- struttura delle directory del repository
