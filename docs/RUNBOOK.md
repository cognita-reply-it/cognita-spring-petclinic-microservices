# Runbook Operativo

Questo runbook serve per avviare e verificare il progetto in modo pratico durante un hands-on. I comandi sotto sono riferiti alla root del repository.

Validazione di questo documento: non e' stato avviato il progetto in questa sessione. Le istruzioni sono state verificate tramite lettura di `README.md`, `docs/BOOTSTRAP.md`, `pom.xml`, `docker-compose.yml`, `scripts/` e dei file `application.yml` dei servizi.

## Prerequisiti locali

- JDK 17 o superiore.
- Maven Wrapper del repository: `./mvnw` su macOS/Linux, `.\mvnw.cmd` su Windows.
- Docker Desktop, Docker Engine o Podman solo per il flusso containerizzato.
- Una API key OpenAI o Azure OpenAI solo se si vuole usare il chatbot GenAI con un provider reale.

Bootstrap consigliato dopo un clone fresco:

```bash
scripts/bootstrap.sh
```

Su Windows:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\bootstrap.ps1
```

Per il flusso Java/Maven senza Docker:

```bash
scripts/bootstrap.sh --check-only --no-build
```

Su Windows:

```powershell
.\scripts\bootstrap.ps1 -SkipDocker -CheckOnly -NoBuild
```

## Quando usare Docker

Usa Docker Compose quando vuoi:

- avviare tutto lo stack con un solo comando;
- avere porte host fisse anche per Customers, Visits, Vets e GenAI;
- includere facilmente Zipkin, Grafana e Prometheus;
- verificare comportamento containerizzato o integrazione completa.

Docker non serve per:

- modifiche documentali;
- test Maven mirati;
- sviluppo ordinario su un singolo servizio;
- flusso locale Java con Config Server, Discovery Server e servizi applicativi.

## Avvio senza Docker

Apri un terminale per ogni servizio. Avvia prima i servizi di supporto, poi i servizi applicativi.

Ordine corretto:

1. `spring-petclinic-config-server`
2. `spring-petclinic-discovery-server`
3. `spring-petclinic-customers-service`
4. `spring-petclinic-vets-service`
5. `spring-petclinic-visits-service`
6. `spring-petclinic-api-gateway`
7. `spring-petclinic-genai-service`, solo se serve la chat GenAI

Comandi macOS/Linux:

```bash
./mvnw -pl spring-petclinic-config-server spring-boot:run
./mvnw -pl spring-petclinic-discovery-server spring-boot:run
./mvnw -pl spring-petclinic-customers-service spring-boot:run
./mvnw -pl spring-petclinic-vets-service spring-boot:run
./mvnw -pl spring-petclinic-visits-service spring-boot:run
./mvnw -pl spring-petclinic-api-gateway spring-boot:run
```

Comandi Windows:

```powershell
.\mvnw.cmd -pl spring-petclinic-config-server spring-boot:run
.\mvnw.cmd -pl spring-petclinic-discovery-server spring-boot:run
.\mvnw.cmd -pl spring-petclinic-customers-service spring-boot:run
.\mvnw.cmd -pl spring-petclinic-vets-service spring-boot:run
.\mvnw.cmd -pl spring-petclinic-visits-service spring-boot:run
.\mvnw.cmd -pl spring-petclinic-api-gateway spring-boot:run
```

Il Config Server puo' usare anche il profilo `native` con `GIT_REPO` quando vuoi puntare a un repository di configurazione locale:

```bash
./mvnw -pl spring-petclinic-config-server spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=native -DGIT_REPO=/path/to/config-repo"
```

## GenAI con API key

Per usare il provider OpenAI di default:

```bash
export OPENAI_API_KEY="your_api_key_here"
./mvnw -pl spring-petclinic-genai-service spring-boot:run
```

Su Windows:

```powershell
$env:OPENAI_API_KEY = "your_api_key_here"
.\mvnw.cmd -pl spring-petclinic-genai-service spring-boot:run
```

Per Azure OpenAI:

```bash
export AZURE_OPENAI_ENDPOINT="https://your_resource.openai.azure.com"
export AZURE_OPENAI_KEY="your_api_key_here"
./mvnw -pl spring-petclinic-genai-service spring-boot:run
```

Note operative:

- `spring-petclinic-genai-service/src/main/resources/application.yml` contiene il fallback `${OPENAI_API_KEY:demo}` per OpenAI.
- Per una verifica reale della chat usa una chiave valida; la chiave `demo`, se usata, va trattata solo come fallback dimostrativo.
- `docker-compose.yml` passa al container `genai-service` le variabili `OPENAI_API_KEY`, `AZURE_OPENAI_KEY` e `AZURE_OPENAI_ENDPOINT` dall'ambiente host.

## Avvio con Docker Compose

Costruisci prima le immagini:

```bash
./mvnw clean install -P buildDocker
```

Poi avvia lo stack:

```bash
docker compose up
```

Alternativa Podman documentata dal README:

```bash
./mvnw clean install -PbuildDocker -Dcontainer.executable=podman
podman-compose up
```

Note operative:

- `docker-compose.yml` usa `depends_on` con `service_healthy` per coordinare Config Server e Discovery Server.
- Dopo lo startup, il gateway puo' restituire timeout iniziali finche' Eureka non ha completato la registrazione dei servizi.
- Su macOS e Windows verifica che Docker Desktop abbia memoria sufficiente per avviare tutti i microservizi.

## URL da controllare manualmente

Flusso locale senza Docker:

| Componente | URL |
| --- | --- |
| API Gateway / UI | `http://localhost:8080` |
| Config Server | `http://localhost:8888` |
| Eureka Discovery Server | `http://localhost:8761` |
| Customers, Vets, Visits, GenAI | porta random, da leggere in Eureka |
| Zipkin, se avviato | `http://localhost:9411/zipkin/` |
| Spring Boot Admin, se avviato | `http://localhost:9090` |
| Grafana, se avviata | `http://localhost:3030` |
| Prometheus, se avviato | `http://localhost:9091` |

Flusso Docker Compose:

| Componente | URL |
| --- | --- |
| API Gateway / UI | `http://localhost:8080` |
| Config Server | `http://localhost:8888` |
| Eureka Discovery Server | `http://localhost:8761` |
| Customers Service | `http://localhost:8081` |
| Visits Service | `http://localhost:8082` |
| Vets Service | `http://localhost:8083` |
| GenAI Service | `http://localhost:8084` |
| Zipkin | `http://localhost:9411/zipkin/` |
| Spring Boot Admin | `http://localhost:9090` |
| Grafana | `http://localhost:3030` |
| Prometheus | `http://localhost:9091` |

Verifica manuale minima:

1. Apri Eureka e controlla che i servizi attesi siano registrati.
2. Apri la UI dal gateway.
3. Naviga su owners e veterinarians.
4. Apri un owner detail e verifica che pets e visits vengano caricati.
5. Se GenAI e' attivo, invia un prompt semplice dalla chat.
6. Se osservabilita' e' attiva, apri Zipkin, Grafana e Prometheus.

## Componenti opzionali

- Zipkin (`tracing-server`): tracing distribuito. Non e' necessario per il flusso base.
- Spring Boot Admin (`admin-server`): vista amministrativa dei servizi Spring Boot.
- Prometheus (`prometheus-server`): raccolta metriche.
- Grafana (`grafana-server`): dashboard metriche, inclusa la dashboard Petclinic configurata sotto `docker/grafana`.
- MySQL: opzionale per scenari persistenti; il default di sviluppo usa HSQLDB in memoria.

## Comandi Maven utili

Build veloce senza test:

```bash
./mvnw -B -DskipTests package --file pom.xml
```

Test completi:

```bash
./mvnw test
```

Test per modulo:

```bash
./mvnw -pl spring-petclinic-api-gateway test
./mvnw -pl spring-petclinic-customers-service test
./mvnw -pl spring-petclinic-vets-service test
./mvnw -pl spring-petclinic-visits-service test
./mvnw -pl spring-petclinic-genai-service test
```

Build immagini Docker:

```bash
./mvnw clean install -P buildDocker
```

Build immagini per Podman:

```bash
./mvnw clean install -PbuildDocker -Dcontainer.executable=podman
```

## Troubleshooting comune

- `api-gateway` parte ma la UI non carica dati: controlla che Config Server e Discovery Server siano attivi e che Customers, Vets e Visits siano registrati in Eureka.
- Un servizio applicativo sembra irraggiungibile senza Docker: verifica la porta effettiva in Eureka; in locale i servizi applicativi possono usare porte random.
- Timeout iniziali dal gateway in Docker Compose: attendi la convergenza di Eureka e ricontrolla `http://localhost:8761`.
- Il chatbot risponde con fallback o errore: verifica le variabili `OPENAI_API_KEY` oppure `AZURE_OPENAI_ENDPOINT` e `AZURE_OPENAI_KEY`; controlla anche che il servizio GenAI sia registrato in Eureka.
- Docker Compose e' lento o fallisce su macOS/Windows: aumenta memoria e CPU assegnate a Docker Desktop.
- Vuoi dati persistenti: abilita il profilo `mysql` solo sui servizi Customers, Vets e Visits e configura MySQL come descritto nel README.
- Prometheus o Grafana non mostrano dati subito: verifica che i servizi applicativi siano avviati e che gli endpoint Actuator siano raggiungibili dallo stack Compose.
