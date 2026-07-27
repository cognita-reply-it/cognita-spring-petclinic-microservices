# Spring Petclinic Microservices — guida hands-on

## Scopo

Questo repository contiene una versione distribuita dell'applicazione di esempio Spring Petclinic. Il progetto mostra come suddividere l'applicazione in microservizi usando Spring Cloud; il punto di ingresso dell'applicazione è l'API Gateway con la UI AngularJS.

Il build Maven radice aggrega otto moduli, usa Java 17, Spring Boot 4.0.1 e la release train Spring Cloud 2025.1.0. Le dipendenze dichiarate includono Spring Cloud Config, Eureka, Gateway, Circuit Breaker/Resilience4j, tracing, Micrometer e OpenTelemetry. I servizi di dominio dichiarano anche Spring MVC, JPA e i driver HSQLDB/MySQL; GenAI aggiunge Spring AI con il modello OpenAI predefinito.

## Servizi e porte

| Componente | Ruolo riportato dal repository | Porta con Docker Compose | Avvio locale senza Docker |
| --- | --- | --- | --- |
| Config Server | configurazione centralizzata | 8888 | 8888 |
| Discovery Server | registro Eureka | 8761 | 8761 |
| API Gateway | instrada le richieste e ospita la UI AngularJS | 8080 | 8080 |
| Customers Service | dati dei clienti | 8081 | porta casuale; controllare Eureka |
| Vets Service | informazioni sui veterinari | 8083 | porta casuale; controllare Eureka |
| Visits Service | visite degli animali | 8082 | porta casuale; controllare Eureka |
| GenAI Service | chatbot dell'applicazione | 8084 | porta casuale; controllare Eureka |
| Admin Server | Spring Boot Admin | 9090 | 9090 |
| Tracing Server | Zipkin | 9411 | 9411 |
| Grafana Server | dashboard Grafana | 3030 (inoltrata alla 3000 del container) | 3030 |
| Prometheus Server | raccolta metriche | 9091 (inoltrata alla 9090 del container) | 9091 |

Le porte della colonna Docker Compose sono le pubblicazioni esplicite in `docker-compose.yml`. Per l'avvio senza Docker, il README indica porte casuali per Customers, Vets, Visits e GenAI e indica la dashboard Eureka per trovarle.

## Cosa serve per una sessione hands-on

Per la parte Petclinic, avviare prima Config Server e Discovery Server; il README li identifica come servizi di supporto necessari prima di Customers, Vets, Visits e API Gateway. Dopo l'avvio, aprire `http://localhost:8080/`. L'API Gateway può richiedere un breve tempo per sincronizzarsi con il registro; la disponibilità dei servizi è osservabile in Eureka su `http://localhost:8761`.

La configurazione predefinita usa HSQLDB in memoria e popola dati all'avvio. MySQL è un'alternativa per una configurazione persistente: il repository fornisce le dipendenze JDBC e documenta il profilo Spring `mysql` per Customers, Vets e Visits. Non è necessario per l'avvio base documentato.

GenAI è incluso tra i microservizi e Docker Compose inoltra le variabili `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT`. Il README dichiara OpenAI come provider predefinito e Azure OpenAI come alternativa; usare solo le credenziali del provider scelto.

Tracing, Admin Server, Grafana e Prometheus sono esplicitamente opzionali nell'avvio locale senza Docker. Grafana e Prometheus sono inclusi nel Compose per il monitoraggio, mentre il gateway e i servizi di dominio espongono dipendenze di metriche/tracing nel build.

## Avvio locale senza Docker

Ogni microservizio è un'applicazione Spring Boot. Avviarlo dall'IDE oppure dalla sua directory con:

```bash
../mvnw spring-boot:run
```

Rispettare l'ordine: Config Server, Discovery Server, poi Customers, Vets, Visits e API Gateway. I componenti opzionali possono essere avviati in aggiunta. Per far usare al Config Server un repository Git locale, il README documenta il profilo `native` con la variabile `GIT_REPO`.

## Avvio con Docker Compose

1. Assicurarsi che Docker (o Docker Desktop) sia in esecuzione.
2. Costruire le immagini:

   ```bash
   ./mvnw clean install -P buildDocker
   ```

3. Avviare lo stack:

   ```bash
   docker compose up
   ```

Il README documenta anche Podman: usare `-PbuildDocker -Dcontainer.executable=podman` per il build e `podman-compose up` per l'avvio. Il profilo `buildDocker` del POM configura la costruzione delle immagini; il Compose ordina Config e Discovery prima dei servizi dipendenti usando `depends_on` con condizione `service_healthy`.

## Differenza pratica tra i due percorsi

Senza Docker si avviano singolarmente applicazioni Spring Boot e i quattro servizi applicativi Customers/Vets/Visits/GenAI usano porte casuali; Config e Discovery vanno avviati manualmente per primi. Con Docker Compose si costruiscono prima le immagini e si avvia l'intera infrastruttura con un comando, con porte host fisse e ordine coordinato dagli health check. In entrambi i casi, la UI è raggiungibile dal Gateway sulla porta 8080 quando lo stack è pronto.
