# Spring Petclinic Microservices: guida hands-on

## Scopo del progetto

Questo repository contiene una versione distribuita della Spring Petclinic di
esempio. Il suo scopo è mostrare come suddividere l'applicazione in
microservizi usando Spring Boot, Spring Cloud e Spring AI.

L'accesso principale all'applicazione avviene tramite l'API Gateway, che
include il frontend AngularJS e instrada le richieste verso i servizi
applicativi. Config Server e Discovery Server forniscono rispettivamente la
configurazione centralizzata e il service registry Eureka.

## Servizi presenti

Il `pom.xml` principale aggrega otto moduli Maven:

| Modulo | Ruolo operativo |
| --- | --- |
| `spring-petclinic-config-server` | Distribuisce la configurazione centralizzata. |
| `spring-petclinic-discovery-server` | Espone il service registry Eureka. |
| `spring-petclinic-customers-service` | Gestisce proprietari e animali. |
| `spring-petclinic-vets-service` | Gestisce le informazioni sui veterinari. |
| `spring-petclinic-visits-service` | Gestisce le visite degli animali. |
| `spring-petclinic-genai-service` | Fornisce l'interfaccia chatbot basata su Spring AI. |
| `spring-petclinic-api-gateway` | Espone il frontend AngularJS e instrada le richieste ai servizi. |
| `spring-petclinic-admin-server` | Fornisce il server Spring Boot Admin. |

`docker-compose.yml` aggiunge inoltre tre componenti infrastrutturali che non
sono moduli Maven del progetto:

- Zipkin come `tracing-server`;
- Grafana come `grafana-server`;
- Prometheus come `prometheus-server`.

## Porte esposte

Le porte dipendono dalla modalità di avvio.

| Componente | Avvio locale senza Docker | Docker Compose |
| --- | ---: | ---: |
| Config Server | `8888` | `8888:8888` |
| Discovery Server / Eureka | `8761` | `8761:8761` |
| API Gateway e frontend | `8080` | `8080:8080` |
| Customers Service | porta casuale, visibile in Eureka | `8081:8081` |
| Visits Service | porta casuale, visibile in Eureka | `8082:8082` |
| Vets Service | porta casuale, visibile in Eureka | `8083:8083` |
| GenAI Service | porta casuale, visibile in Eureka | `8084:8084` |
| Spring Boot Admin | `9090` | `9090:9090` |
| Zipkin | `9411` (`/zipkin/`) | `9411:9411` |
| Grafana | `3030` | `3030:3000` |
| Prometheus | `9091` | `9091:9090` |

Nell'avvio locale, quindi, non bisogna assegnare ai servizi Customers, Visits,
Vets e GenAI le porte fisse usate da Compose: il README indica di recuperare
le loro porte dal dashboard Eureka.

## Dipendenze principali

Questa è una sintesi delle dipendenze che incidono sull'uso del repository, non
un inventario completo di ogni libreria:

- Java `17` o superiore e Spring Boot `4.0.1`;
- Spring Cloud `2025.1.0`;
- Spring Cloud Config per la configurazione centralizzata;
- Netflix Eureka per discovery server e client;
- Spring Cloud Gateway per l'ingresso HTTP e il routing;
- Resilience4j tramite Spring Cloud Circuit Breaker;
- Spring Data JPA per i servizi che accedono ai dati;
- HSQLDB come database in memoria predefinito e MySQL come alternativa;
- Micrometer e il registry Prometheus per le metriche;
- Zipkin per il tracing;
- Spring Boot Admin, Jolokia e Caffeine per amministrazione e supporto;
- Spring AI `2.0.0-M1` nel solo servizio GenAI, con OpenAI configurato nel POM
  e Azure OpenAI documentato come alternativa.

Per costruire ed eseguire le immagini servono Docker o Docker Desktop. Il
repository documenta anche Podman o Podman Desktop come alternativa.

## Core e componenti opzionali

Per il percorso Petclinic di base, il README richiede che i due servizi di
supporto siano avviati prima delle applicazioni:

1. Config Server;
2. Discovery Server;
3. Customers, Vets, Visits e API Gateway.

L'API Gateway su `http://localhost:8080/` è il punto di ingresso
dell'applicazione.

Il README dichiara esplicitamente opzionale l'avvio di:

- tracing con Zipkin;
- Spring Boot Admin;
- Grafana;
- Prometheus.

Anche MySQL è una scelta opzionale: la configurazione predefinita usa HSQLDB
in memoria. Per usare MySQL bisogna avviare Customers, Vets e Visits con il
profilo Spring `mysql`.

Il GenAI Service fa parte dei moduli e dei servizi descritti dal repository,
ma non compare nella sequenza minima elencata dal README e non è dichiarato
esplicitamente opzionale. Per usarlo bisogna scegliere un provider LLM:
OpenAI è la dipendenza attiva nel POM, mentre Azure OpenAI è l'alternativa
documentata. Occorre valorizzare solo le credenziali del provider scelto:

```bash
export OPENAI_API_KEY="..."
```

oppure:

```bash
export AZURE_OPENAI_ENDPOINT="https://..."
export AZURE_OPENAI_KEY="..."
```

## Avvio locale senza Docker

Ogni microservizio è un'applicazione Spring Boot e può essere avviato dall'IDE
oppure, dalla directory del modulo, con:

```bash
../mvnw spring-boot:run
```

Procedura operativa:

1. Verificare di avere Java 17 o superiore.
2. Avviare Config Server.
3. Avviare Discovery Server e attendere che Eureka sia disponibile su
   `http://localhost:8761`.
4. Avviare Customers, Vets e Visits.
5. Avviare API Gateway e aprire `http://localhost:8080/`.
6. Se serve il chatbot, configurare il provider LLM e avviare GenAI Service.
7. Avviare solo se utili Zipkin, Admin Server, Grafana e Prometheus.

Se si vuole far leggere al Config Server un repository Git locale di
configurazione, il README indica il profilo `native` e la variabile `GIT_REPO`,
per esempio:

```text
-Dspring.profiles.active=native -DGIT_REPO=/projects/spring-petclinic-microservices-config
```

In questa modalità l'ordine è gestito manualmente e le porte dei servizi
applicativi sono casuali. Eureka è il riferimento operativo per individuarli.

## Avvio con Docker Compose

Prima si costruiscono gli artifact e le immagini tramite il profilo Maven
`buildDocker`:

```bash
./mvnw clean install -P buildDocker
```

Poi si avvia l'infrastruttura dichiarata in `docker-compose.yml`:

```bash
docker compose up
```

Per Podman, il README riporta:

```bash
./mvnw clean install -PbuildDocker -Dcontainer.executable=podman
podman-compose up
```

Con Compose:

- i mapping di porta sono fissi e sono quelli della tabella precedente;
- Config Server e Discovery Server hanno health check;
- `depends_on` con condizione `service_healthy` coordina l'avvio dei servizi
  che dipendono da loro;
- il file inoltra al container GenAI le variabili `OPENAI_API_KEY`,
  `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`;
- possono verificarsi timeout iniziali del Gateway finché il service registry
  non è sincronizzato; lo stato dei servizi è visibile in Eureka.

Il Compose del repository dichiara anche le componenti opzionali Zipkin,
Admin, Grafana e Prometheus. Il semplice `docker compose up` tenta quindi di
avviare tutti i servizi dichiarati nel file.

## Differenze operative in breve

| Aspetto | Locale senza Docker | Docker Compose |
| --- | --- | --- |
| Preparazione | Java 17+ e avvio dei singoli moduli | Docker/Podman e immagini costruite con `buildDocker` |
| Comando | IDE o `../mvnw spring-boot:run` per modulo | `docker compose up` dopo la build |
| Ordine | Manuale: Config e Discovery per primi | Coordinato da health check e `depends_on` |
| Porte applicative | Casuali per Customers, Vets, Visits e GenAI | Fisse da `8081` a `8084` |
| Individuazione servizi | Dashboard Eureka | Porte host fisse e dashboard Eureka |
| Componenti opzionali | Si avviano singolarmente solo se servono | Sono dichiarate nel file Compose |

Il README documenta anche una modalità ibrida tramite
`./scripts/run_all.sh`: l'infrastruttura viene avviata con Compose e le
applicazioni Java con `nohup java -jar`. Non è però una delle due modalità
principali descritte sopra.

## Limite delle informazioni

Questa guida riassume esclusivamente quanto risulta da `README.md`, dai
`pom.xml`, da `docker-compose.yml` e dalla struttura delle directory del
repository. Non descrive configurazioni o comportamenti non verificabili da
queste fonti.
