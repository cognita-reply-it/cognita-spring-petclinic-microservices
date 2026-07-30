# Hands-on: Spring Petclinic Microservices

## Scopo

Questo repository e' la versione distribuita di Spring Petclinic: un esempio che
mostra come suddividere un'applicazione Spring in microservizi. Usa Spring Cloud
per gateway, configurazione centralizzata, service discovery e circuit breaker;
il README indica anche tracing con Micrometer/OpenTelemetry, Resilience4j e
osservabilita'.

## Servizi presenti

| Modulo o servizio | Ruolo indicato dalle fonti |
| --- | --- |
| `spring-petclinic-api-gateway` / `api-gateway` | Gateway API e frontend AngularJS pubblico. Instrada le richieste verso i servizi. |
| `spring-petclinic-customers-service` / `customers-service` | Gestisce i dati dei clienti. |
| `spring-petclinic-vets-service` / `vets-service` | Gestisce le informazioni sui veterinari. |
| `spring-petclinic-visits-service` / `visits-service` | Gestisce le visite degli animali. |
| `spring-petclinic-genai-service` / `genai-service` | Fornisce il chatbot; il README documenta OpenAI come provider predefinito e Azure OpenAI come alternativa. |
| `spring-petclinic-config-server` / `config-server` | Gestione centralizzata della configurazione. |
| `spring-petclinic-discovery-server` / `discovery-server` | Registry Eureka per la service discovery. |
| `spring-petclinic-admin-server` / `admin-server` | Spring Boot Admin nel compose. |
| `tracing-server` | Server Zipkin per il tracing. |
| `grafana-server` | Dashboard Grafana. |
| `prometheus-server` | Raccolta delle metriche Prometheus. |

Il `pom.xml` radice dichiara otto moduli Maven: Admin, Customers, Vets, Visits,
GenAI, Config Server, Discovery Server e API Gateway. I servizi applicativi
comunicano tramite API REST secondo il README.

## Porte esposte

| Endpoint | Avvio locale senza Docker | Docker Compose |
| --- | --- | --- |
| API Gateway / frontend AngularJS | `8080` | `8080:8080` |
| Config Server | `8888` | `8888:8888` |
| Discovery Server | `8761` | `8761:8761` |
| Customers | porta casuale, da verificare in Eureka | `8081:8081` |
| Visits | porta casuale, da verificare in Eureka | `8082:8082` |
| Vets | porta casuale, da verificare in Eureka | `8083:8083` |
| GenAI | porta casuale, da verificare in Eureka | `8084:8084` |
| Zipkin | `9411` (con percorso `/zipkin/`) | `9411:9411` |
| Spring Boot Admin | `9090` | `9090:9090` |
| Grafana | `3030` | `3030:3000` |
| Prometheus | `9091` | `9091:9090` |

## Dipendenze principali

- Java 17 o superiore e Maven: il POM radice usa Spring Boot `4.0.1` e
  Spring Cloud `2025.1.0`.
- I servizi usano dipendenze Spring Boot e Spring Cloud; Config Server e client
  Eureka compaiono nei POM dei servizi di supporto e applicativi.
- I servizi Customers, Vets e Visits includono HSQLDB e MySQL Connector/J a
  runtime. Il README indica HSQLDB come configurazione predefinita e MySQL come
  alternativa con profilo `mysql`.
- Il modulo GenAI include Spring AI; per usarlo il README richiede credenziali
  OpenAI oppure Azure OpenAI. In Compose le variabili del provider vengono
  passate al container `genai-service`.
- Per il flusso Compose occorrono Docker/Docker Desktop e immagini costruite
  con `./mvnw clean install -P buildDocker`; il README documenta anche Podman.

## Core e opzionale

Per il normale avvio Java locale, il README richiede di avviare prima Config
Server e Discovery Server, quindi Customers, Vets, Visits e API Gateway: questo
e' il percorso core operativo del repository.

Il README definisce esplicitamente opzionali Tracing Server, Admin Server,
Grafana e Prometheus. MySQL e' opzionale rispetto all'HSQLDB predefinito e
richiede il profilo `mysql` sui servizi Customers, Vets e Visits.

GenAI e' un servizio applicativo presente sia nei moduli sia in Compose. Il
README non lo classifica espressamente come core o opzionale: per attivare il
chatbot richiede invece una configurazione del provider e le relative
credenziali. Va quindi aggiunto quando l'hands-on include il chatbot, senza
attribuirgli una classificazione non dichiarata dalle fonti.

## Avvio locale senza Docker

Ogni microservizio e' un'applicazione Spring Boot e il README consente l'avvio
da IDE oppure con Maven Wrapper. L'ordine richiesto e':

1. Config Server;
2. Discovery Server;
3. Customers, Vets, Visits e API Gateway;
4. GenAI quando serve il chatbot.

Esempio di comando per un modulo:

```bash
./mvnw -pl spring-petclinic-config-server spring-boot:run
```

Il README segnala che, senza Docker, Customers, Vets, Visits e GenAI usano porte
casuali e vanno individuati nella dashboard Eureka. Il Config Server puo' usare
un repository Git locale tramite profilo `native` e variabile `GIT_REPO`.

## Avvio con Docker Compose

Il flusso containerizzato costruisce prima le immagini e poi avvia l'intera
infrastruttura:

```bash
./mvnw clean install -P buildDocker
docker compose up
```

`docker-compose.yml` definisce porte host fisse per tutti i servizi elencati
nella tabella e coordina l'ordine di avvio: i servizi dipendenti attendono gli
healthcheck di Config Server e Discovery Server tramite `service_healthy`.
Il README avverte che, subito dopo l'avvio, il Gateway puo' produrre timeout
iniziali finche' non si allinea al service registry; Eureka su `localhost:8761`
e' il punto di controllo documentato.

La differenza pratica e' quindi che l'avvio locale esegue le applicazioni Java
separatamente, con porte casuali per i servizi applicativi, mentre Compose
prepara immagini e avvia anche i componenti di osservabilita' con porte host
predeterminate e dipendenze di startup dichiarate.

## Fonti usate

Questo briefing usa esclusivamente `README.md`, i `pom.xml` radice e dei moduli,
`docker-compose.yml` e la struttura del repository.
