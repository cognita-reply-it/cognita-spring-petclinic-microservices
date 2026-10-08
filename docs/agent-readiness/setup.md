# Local setup and configuration

Owner: runtime thread for COG-172; future changes follow the [agent contract](../../AGENTS.md). Read [architecture](architecture.md), [checks](checks.md) and [operations](operations.md). Commands below are supported by source and documentation, not evidence of successful execution; observed results belong to [validation](validation.md).

## Prerequisites and versions

The [root POM](../../pom.xml) targets Java 17, Spring Boot 4.0.1 and Spring Cloud 2025.1.0. Use a JDK 17 installation, with `JAVA_HOME` pointing at its directory and `java` on PATH. The [wrapper](../../.mvn/wrapper/maven-wrapper.properties) downloads Maven 3.9.8 with a distribution checksum (wrapper 3.3.2); a system Maven installation is unnecessary. Git and HTTPS access to Maven artifact repositories are required on the first build. The Admin POM pins Spring Boot Admin 4.0.2. The GenAI POM pins Spring AI 2.0.0-M1; do not replace this milestone incidentally. Gateway frontend dependencies come from Maven WebJars; no Node/npm application setup exists.

From the checkout root:

```sh
java -version
./mvnw -version
./mvnw -B clean verify
```

The baseline initially failed before Maven execution because no JDK was available. See validation for any later provisioning/build result. A dependency download failure must be reported with the unresolved artifact and repository; it does not justify an upgrade. `clean` removes generated targets: first preserve any local logs or artifacts needed for diagnosis.

## External configuration is part of runtime

[Config Server configuration](../../spring-petclinic-config-server/src/main/resources/application.yml) uses `https://github.com/spring-petclinic/spring-petclinic-microservices-config`, branch `main`. Its contents are outside this repository and are not pinned by this application commit. Shared datasource settings, initialization, discovery, management endpoints and runtime ports can therefore change independently. Do not infer a complete runtime configuration from the local YAML alone. Before an environment run, inspect the external configuration, record its commit and selected profiles in the handoff, and confirm all datasource targets are disposable local resources. Do not copy production configuration into Git.

For a repeatable local run, use an existing reviewed checkout of that configuration at a recorded commit. From this repository root (replace the path with that actual checkout):

```sh
GIT_REPO=/absolute/path/to/reviewed-config ./mvnw -pl spring-petclinic-config-server spring-boot:run -Dspring-boot.run.profiles=native
```

The repository already defines the native filesystem search path. An empty directory is not sufficient: it must contain the shared and service/profile configuration. This path requires no Config Server Git pull, but Maven may still need downloads. Never use test configuration as the full deployment contract. The default Git-backed alternative is:

```sh
./mvnw -pl spring-petclinic-config-server spring-boot:run
```

## Eight application startup paths

Run each command in its own terminal from the root. Start Config first, then Discovery, then domain services, then Gateway. Admin and GenAI are optional for core owner/pet/visit browsing; chat requires GenAI. Ports below are explicitly selected for this local run, avoiding implicit remote port allocation. The defaults remain unchanged. Verify readiness with the operations checks before proceeding to dependents. Config uses a semantic configuration probe, not `/actuator/health`, because that path can match its generic configuration route.

| Application | Foreground command | Dependencies / useful observation |
|---|---|---|
| Config | `./mvnw -pl spring-petclinic-config-server spring-boot:run` | Reviewed external Git configuration; port 8888 |
| Discovery | `./mvnw -pl spring-petclinic-discovery-server spring-boot:run -Dspring-boot.run.arguments=--server.port=8761` | Config; registry at 8761 |
| Customers | `./mvnw -pl spring-petclinic-customers-service spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` | Config, Discovery, reviewed datasource; owners API |
| Visits | `./mvnw -pl spring-petclinic-visits-service spring-boot:run -Dspring-boot.run.arguments=--server.port=8082` | Config, Discovery, reviewed datasource; visits API |
| Vets | `./mvnw -pl spring-petclinic-vets-service spring-boot:run -Dspring-boot.run.arguments=--server.port=8083` | Config, Discovery, reviewed datasource; vets API; existing production profile |
| GenAI | `./mvnw -pl spring-petclinic-genai-service spring-boot:run -Dspring-boot.run.arguments=--server.port=8084` | Config, Discovery, Vets and provider credential; existing production profile |
| Gateway | `./mvnw -pl spring-petclinic-api-gateway spring-boot:run -Dspring-boot.run.arguments=--server.port=8080` | Config, Discovery, domain services; browser at 8080 |
| Admin | `./mvnw -pl spring-petclinic-admin-server spring-boot:run -Dspring-boot.run.arguments=--server.port=9090` | Config, Discovery; admin UI at 9090 |

`production` is an existing profile name, not permission to contact production resources. Inspect its external settings. Maven run forks Java; application arguments belong in `spring-boot.run.arguments`, profiles in `spring-boot.run.profiles`. See the [Spring Boot 4.0 Maven run reference](https://docs.spring.io/spring-boot/4.0/maven-plugin/run.html); exact 4.0.1 documentation URL was unavailable during this audit, so the maintained 4.0 series reference was used. The [Config native backend reference](https://docs.spring.io/spring-cloud-config/reference/server/environment-repository/file-system-backend.html) describes the existing filesystem mode; installed Cloud version remains the source POM value.

## Environment contract

The secret-free [template](../../.env.example) covers every explicit application environment placeholder found in main YAML. Copy to an ignored `.env` only if needed. Export selected names through your shell or approved secret manager for Java runs; Spring Boot has no repository-defined dotenv loader. Do not source a file obtained from an untrusted source. Compose automatically interpolates `.env` but only the three provider keys are forwarded by the checked-in Compose file. `CONFIG_SERVER_URL` and `GIT_REPO` in `.env` alone do not configure containers. See [Compose interpolation](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/).

| Name | Consumer / provenance | Requirement and impact |
|---|---|---|
| `CONFIG_SERVER_URL` | Seven client application YAML files; local operator | Optional; default `http://localhost:8888/`. Non-Docker imports are optional, so a process may start without required shared configuration. Docker profile instead hard-codes mandatory `http://config-server:8888`. |
| `GIT_REPO` | Config Server native search location; reviewed local config checkout | Required only for native profile; absolute directory. No secret needed. |
| `OPENAI_API_KEY` | GenAI YAML and Compose; authorized provider credentials | Required for real OpenAI interactions. Code fallback `demo` is a placeholder, not evidence of valid access or free quota. Blank template does not provide working chat. |
| `AZURE_OPENAI_KEY` | GenAI YAML and Compose; authorized Azure resource credentials | Only relevant when intentionally selecting the Azure starter. Blank otherwise. |
| `AZURE_OPENAI_ENDPOINT` | GenAI YAML and Compose; same Azure resource | Required with Azure starter. Existing chat deployment-name is `gpt-4o`; the resource must actually provide the configured deployment. |

The GenAI POM currently enables OpenAI and comments out Azure; filling Azure variables does not switch providers. No SDK/provider change is part of this migration. Prefer environment credentials over the optional `classpath:/creds.yaml`: a classpath file can be packaged in a JAR even when Git ignores it. GenAI chat advisor DEBUG logs and vector-store operations can contain user content; use synthetic data and keep logs private. Do not delete the checked-in vector store as a reset: startup may then fetch vets and create embeddings through the provider.

Tool-only variables are separate from application configuration: `JAVA_HOME` selects JDK for `mvnw`; `SPRING_PROFILES_ACTIVE` is set to `docker` by the Dockerfile; `REPOSITORY_PREFIX` and `VERSION` feed the image tagging/publishing scripts; `PORT` is the chaos script's internal destination selector. Wrapper proxy/download options remain documented in its script. Managed worker values in the injected WORKFLOW (for example `LINEAR_API_KEY`, `SOURCE_REPO_URL`, `CODEX_HOME`) are provisioned by Principal/Maestro, never copied into application templates or printed.

## Docker, devcontainer and database alternatives

Docker Engine/Desktop with a working daemon and Compose v2 are needed for the checked-in topology; no exact Docker version is pinned. Check `docker version` and `docker compose version`. Build local images with `./mvnw -B clean install -PbuildDocker`; this uses `docker build`, Java 17 images, `linux/amd64` and `--load`. Then `docker compose up` starts eight applications plus Zipkin, Grafana and Prometheus. Core-only startup is `docker compose up config-server discovery-server customers-service visits-service vets-service api-gateway`. Verify local images exist first: Compose references floating tags and can otherwise fetch images unrelated to your checkout. `container.platform` and `container.executable` are existing Maven properties; Podman support is declared but not validated in this run. Dockerfile layer extraction compatibility with Boot 4.0.1 remains a container validation gate.

The existing [devcontainer](../../.devcontainer/devcontainer.json) declares Java 17 Bullseye, Java/Maven, Azure CLI and Docker-in-Docker features; it is an optional environment definition, not proof that it was built. Use the wrapper inside it too. Prometheus is pinned to v2.4.2 and Grafana to 5.2.4; Zipkin and Java base tags float. No image updates were made.

Customers, Vets and Visits include HSQLDB/MySQL schema and seed SQL under their resources. The default documented demo is in-memory HSQLDB; effective initialization depends on external config. There is no versioned database migration runner. MySQL is an optional external path: provision a disposable database, review JDBC URLs and initialization in the external `mysql` profile, and start only those three services with `-Dspring-boot.run.profiles=mysql`. No universal MySQL credentials/template can be derived from this repository. Existing seed/schema scripts may drop tables, so do not run them against retained data. This migration does not establish a production MySQL setup or execute that path.
