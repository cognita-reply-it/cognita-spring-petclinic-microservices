# Repository inventory — COG-172

Coordinator-owned. Baseline: `f3b392c92580b740f4bafd0364b326e0bd1774f0`, clean `main`, origin `cognita-reply-it/cognita-spring-petclinic-microservices`; fetched and fast-forward checked on 2026-09-07. Work occurs in the workflow-selected Maestro checkout, not the separate canonical mirror. No pre-existing tracked changes. Injected `WORKFLOW.md` is preserved and not added to Git. No AGENTS.md or nested AGENTS.md existed. BACKLOG.md, DESIGN.md, INIT_PROMPT.md absent in this checkout; mirror workflow was also read but does not override selected checkout.

KG health matches baseline; search(application), subgraph(gateway), recent_changes consulted. Graph is truncated (600 nodes/1175 relationships) and partly enriched: orientation only, not complete evidence. Inventory enumerates all 217 tracked files below; binaries are classified, not reverse engineered. External config, provider services, hosted CI and production are outside source coverage; live checks are separately reported.

## Area inventory and initial gap matrix

| Area / verified sources | Current state / gap | Risk | Proposed change / owner | Dependency / completion proof |
|---|---|---|---|---|
| Root README, CONTRIBUTING, PR template, injected WORKFLOW | Upstream target and removed UI references conflict with fork; no agent entrypoint | High onboarding drift | Coordinator: AGENTS, index, corrected navigation and contribution target | Shared contracts first; relative links and independent review |
| Eight child POMs, root pom, wrapper | Java 17, Boot 4.0.1, Cloud 2025.1.0, Maven 3.9.8; AI 2.0.0-M1; no dependency upgrades needed | Build availability | Runtime: exact setup and blocked-path evidence | Baseline initially fails: Java absent |
| customers, vets, visits src/main + src/test + SQL | Domain REST/JPA, HSQLDB/MySQL fixtures; no migration tool | Data loss if demo SQL reused | Architecture: API/data ownership map; runtime reset boundaries | Source contracts and test inventory |
| gateway Java, static JS/HTML/CSS/SCSS, tests/JMeter | Gateway routing/aggregation and AngularJS WebJars; no Node app; optional css profile | Cross-service regression | Architecture: route/flow map; coordinator remove obsolete UI instructions | Preserve design assets and UI behavior |
| genai Java/resources/POM | Provider chat and mutating tools, vector store; no tests | Provider costs/data exposure | Architecture: trust/data flow; runtime env template | No real provider calls without task authorization |
| config/discovery/admin | Config backed by external Git; Eureka/admin supporting apps | External config drift | Architecture + runtime: startup dependency map and limitations | External repository not silently vendored |
| Compose, docker images, monitoring JSON/YAML, devcontainer | Local demo topology; floating images; not production deployment proof | Environment confusion | Runtime: operations guide | Docker capability check; no deploy |
| scripts/run_all.sh, image scripts, chaos payloads | Launcher kills matching processes and enables chaos; image scripts publish | Destructive shared-runtime behavior | Runtime documents restricted use and safe foreground alternative | Do not execute destructive launcher or pushes |
| CI workflows and PR template | Maven system version differs wrapper; PR triage targets upstream conventions | Gate drift | Validation thread: wrapper + documentation guard; coordinator PR wording | Official tool docs; local check plus hosted status |
| .codex/agents | Four existing role specifications, runtime registration unproven | Invented capability | Preserve; AGENTS capability discovery contract | Confirm collaboration tool actually available |
| design-system, .extract-design-system | Existing COG-113 extraction and token provenance | Unrequested UI changes | No changes; retained as review input | File diff |
| .editorconfig, .gitattributes, .gitignore, LICENSE, docs images | Valid conventions/assets; env ignore missing | Secret accidents | Runtime: env ignore; remainder no changes | Ignore check and diff |

## Final gap disposition

Status vocabulary: **resolved** means the migration change and its stated proof exist; **accepted** means examined and intentionally unchanged within COG-172 (not organizational risk approval); **blocked** means an execution path lacks the required environment/evidence. No new external tickets were created. [Validation](validation.md) and [review](review.md) own observed outcomes.

| ID / area | Status | Final change or retained limitation | Owner / dependencies | Completion proof |
|---|---|---|---|---|
| G01 Orientation / instructions | Resolved | New scoped AGENTS and index link all contract owners, capability/failure/parallel-work/handoff rules | Coordinator; all specialist docs | Documentation guard, independent review |
| G02 README / contribution drift | Resolved | Removed nonexistent UI links, corrected fork delivery target and unsupported demo-key claim; native launch args and SQL-init wording corrected | Coordinator; runtime source review | Source comparison, links, diff |
| G03 Architecture / data / flows | Resolved | Eight apps, entrypoints, route/DTO dependencies, startup indexing, trust/deploy boundaries and tests mapped | Architecture; whole manifest | architecture.md source links and reviewer |
| G04 Setup / environment | Resolved | Eight foreground commands, external config revision procedure, blank provider template, ignored local env and creds files | Runtime; external config reviewed before smoke | setup.md, static env/source-name check, git check-ignore |
| G05 Validation / CI | Resolved | Pinned existing wrapper now used in CI; offline doc guard runs before package; exact test/build/absence matrix | Validation; shared index | 7 guard helper assertions; full guard, 9 Java tests; CI result separately recorded |
| G06 Operations / release | Resolved | Safe owned-process shutdown, diagnostics, reset/rollback limits, destructive launcher/chaos/image script boundaries | Runtime; architecture/config | operations.md and read-only smoke ledger |
| G07 Continuity / coordination | Resolved | Inventory, ownership/dependencies, review, evidence and reusable handoff recorded; one Linear workpad | Coordinator; reviewer and delivery | plan.md, review.md, handoff.md; PR/workpad delivery record |
| G08 Existing role specs / design / assets / license / formatting | Accepted | Existing .codex/agents, extraction/tokens, images/fonts, license and editor conventions preserved; roles not assumed enabled | Coordinator; existing user preferences | No diff in those paths; complete manifest below |
| G09 Source test gaps | Accepted | No Admin/GenAI test sources, limited write/schema/browser coverage; no app logic changed so not filled with mirror tests | Architecture + validation | checks.md lists all 8 classes/9 methods and limits |
| G10 External config and images | Accepted | Public config main and image tags float; record config SHA and image provenance before real runs; no vendor/pin/release change in this task | Runtime | setup/operations; fixed config snapshot for local smoke |
| G11 Docker / Podman / devcontainer / MySQL | Blocked | No container CLI/daemon or disposable MySQL target; JVM integrated smoke exceeded 2 GiB worker capacity twice; container layer extraction and full routed behavior need environment-specific checks | Runtime; external environment | Capability commands and exact unexecuted checks in validation.md |
| G12 Provider and production | Blocked | No authorized live provider/data/deployment exercise; GenAI real chat/embedding and production recovery cannot be proven locally | Runtime + coordinator | No provider calls, registry pushes or deploy; scope explicitly bounded |
| G13 Existing behavior observations | Accepted | Wildcard owner route, body-selected pet ID, POST retry/idempotency, fallback method coverage, chat storage/logging/conversation scope, vector resource.getFile packaged path and image EXPOSE mismatch remain unchanged | Architecture; would need separately scoped behavior work | architecture.md names exact source and uncertainty; no application diff |

No source area is excluded from structural inventory. Binaries are inventoried by role/path only; runtime-owned state, credentials, external services and remote production contents are not represented as audited source. The config snapshot inspected during validation does not assert complete external-repository coverage. Java verification and selected smoke probes do not imply all user behavior is tested.

## Full tracked-file manifest

### (root)

- `.editorconfig`
- `.gitattributes`
- `.gitignore`
- `CONTRIBUTING.md`
- `LICENSE`
- `README.md`
- `docker-compose.yml`
- `mvnw`
- `mvnw.cmd`
- `pom.xml`

### .codex

- `.codex/agents/api-designer.toml`
- `.codex/agents/azure-infra-engineer.toml`
- `.codex/agents/data-engineer.toml`
- `.codex/agents/spring-boot-engineer.toml`

### .devcontainer

- `.devcontainer/devcontainer.json`

### .extract-design-system

- `.extract-design-system/normalized.json`
- `.extract-design-system/raw.json`

### .github

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/check-pr-template.yml`
- `.github/workflows/maven-build.yml`

### .mvn

- `.mvn/wrapper/maven-wrapper.jar`
- `.mvn/wrapper/maven-wrapper.properties`

### design-system

- `design-system/README.md`
- `design-system/tokens.css`
- `design-system/tokens.json`

### docker

- `docker/Dockerfile`
- `docker/grafana/Dockerfile`
- `docker/grafana/dashboards/grafana-petclinic-dashboard.json`
- `docker/grafana/grafana.ini`
- `docker/grafana/provisioning/dashboards/all.yml`
- `docker/grafana/provisioning/datasources/all.yml`
- `docker/prometheus/Dockerfile`
- `docker/prometheus/prometheus.yml`

### docs

- `docs/application-screenshot.png`
- `docs/grafana-custom-metrics-dashboard.png`
- `docs/microservices-architecture-diagram.jpg`
- `docs/spring-ai.png`

### scripts

- `scripts/chaos/README.md`
- `scripts/chaos/attacks_disable.json`
- `scripts/chaos/attacks_enable_exception.json`
- `scripts/chaos/attacks_enable_killapplication.json`
- `scripts/chaos/attacks_enable_latency.json`
- `scripts/chaos/attacks_enable_memory.json`
- `scripts/chaos/call_chaos.sh`
- `scripts/chaos/watcher_disable.json`
- `scripts/chaos/watcher_enable_component.json`
- `scripts/chaos/watcher_enable_controller.json`
- `scripts/chaos/watcher_enable_repository.json`
- `scripts/chaos/watcher_enable_restcontroller.json`
- `scripts/chaos/watcher_enable_service.json`
- `scripts/pushImages.sh`
- `scripts/run_all.sh`
- `scripts/tagImages.sh`

### spring-petclinic-admin-server

- `spring-petclinic-admin-server/pom.xml`
- `spring-petclinic-admin-server/src/main/java/org/springframework/samples/petclinic/admin/SpringBootAdminApplication.java`
- `spring-petclinic-admin-server/src/main/resources/application.yml`
- `spring-petclinic-admin-server/src/main/resources/logback-spring.xml`

### spring-petclinic-api-gateway

- `spring-petclinic-api-gateway/.gitignore`
- `spring-petclinic-api-gateway/pom.xml`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/ApiGatewayApplication.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/FallbackController.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/OwnerDetails.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/PetDetails.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/PetType.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/VisitDetails.java`
- `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/Visits.java`
- `spring-petclinic-api-gateway/src/main/resources/application.yml`
- `spring-petclinic-api-gateway/src/main/resources/logback-spring.xml`
- `spring-petclinic-api-gateway/src/main/resources/messages/messages.properties`
- `spring-petclinic-api-gateway/src/main/resources/messages/messages_de.properties`
- `spring-petclinic-api-gateway/src/main/resources/messages/messages_en.properties`
- `spring-petclinic-api-gateway/src/main/resources/static/css/header.css`
- `spring-petclinic-api-gateway/src/main/resources/static/css/petclinic.css`
- `spring-petclinic-api-gateway/src/main/resources/static/css/responsive.css`
- `spring-petclinic-api-gateway/src/main/resources/static/css/typography.css`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/montserrat-webfont.eot`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/montserrat-webfont.svg`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/montserrat-webfont.ttf`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/montserrat-webfont.woff`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/varela_round-webfont.eot`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/varela_round-webfont.svg`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/varela_round-webfont.ttf`
- `spring-petclinic-api-gateway/src/main/resources/static/fonts/varela_round-webfont.woff`
- `spring-petclinic-api-gateway/src/main/resources/static/images/favicon.png`
- `spring-petclinic-api-gateway/src/main/resources/static/images/pets.png`
- `spring-petclinic-api-gateway/src/main/resources/static/images/platform-bg.png`
- `spring-petclinic-api-gateway/src/main/resources/static/images/spring-logo-dataflow-mobile.png`
- `spring-petclinic-api-gateway/src/main/resources/static/images/spring-logo-dataflow.png`
- `spring-petclinic-api-gateway/src/main/resources/static/images/spring-pivotal-logo.png`
- `spring-petclinic-api-gateway/src/main/resources/static/index.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/app.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/footer.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/nav.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/welcome.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/httpErrorHandlingInterceptor.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/infrastructure.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.component.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.component.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.template.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.component.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.component.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.template.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.component.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.component.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.js`
- `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.template.html`
- `spring-petclinic-api-gateway/src/main/resources/static/scss/header.scss`
- `spring-petclinic-api-gateway/src/main/resources/static/scss/petclinic.scss`
- `spring-petclinic-api-gateway/src/main/resources/static/scss/responsive.scss`
- `spring-petclinic-api-gateway/src/main/resources/static/scss/typography.scss`
- `spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/ApiGatewayApplicationTests.java`
- `spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/application/VisitsServiceClientIntegrationTest.java`
- `spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java`
- `spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/CircuitBreakerConfiguration.java`
- `spring-petclinic-api-gateway/src/test/jmeter/petclinic_test_plan.jmx`
- `spring-petclinic-api-gateway/src/test/resources/application-test.yml`

### spring-petclinic-config-server

- `spring-petclinic-config-server/pom.xml`
- `spring-petclinic-config-server/src/main/java/org/springframework/samples/petclinic/config/ConfigServerApplication.java`
- `spring-petclinic-config-server/src/main/resources/application.yml`
- `spring-petclinic-config-server/src/main/resources/static/index.html`
- `spring-petclinic-config-server/src/test/java/org/springframework/samples/petclinic/config/PetclinicConfigServerApplicationTests.java`
- `spring-petclinic-config-server/src/test/resources/application.yml`

### spring-petclinic-customers-service

- `spring-petclinic-customers-service/pom.xml`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/CustomersServiceApplication.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/config/MetricConfig.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Owner.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/OwnerRepository.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/Pet.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetRepository.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/PetType.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerRequest.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetDetails.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetRequest.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetResource.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/ResourceNotFoundException.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/mapper/Mapper.java`
- `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/mapper/OwnerEntityMapper.java`
- `spring-petclinic-customers-service/src/main/resources/application.yml`
- `spring-petclinic-customers-service/src/main/resources/db/hsqldb/data.sql`
- `spring-petclinic-customers-service/src/main/resources/db/hsqldb/schema.sql`
- `spring-petclinic-customers-service/src/main/resources/db/mysql/data.sql`
- `spring-petclinic-customers-service/src/main/resources/db/mysql/schema.sql`
- `spring-petclinic-customers-service/src/main/resources/logback-spring.xml`
- `spring-petclinic-customers-service/src/test/java/org/springframework/samples/petclinic/customers/web/PetResourceTest.java`
- `spring-petclinic-customers-service/src/test/resources/application-test.yml`

### spring-petclinic-discovery-server

- `spring-petclinic-discovery-server/pom.xml`
- `spring-petclinic-discovery-server/src/main/java/org/springframework/samples/petclinic/discovery/DiscoveryServerApplication.java`
- `spring-petclinic-discovery-server/src/main/resources/application.yml`
- `spring-petclinic-discovery-server/src/test/java/org/springframework/samples/petclinic/discovery/DiscoveryServerApplicationTests.java`

### spring-petclinic-genai-service

- `spring-petclinic-genai-service/.gitignore`
- `spring-petclinic-genai-service/pom.xml`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIBeanConfiguration.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIDataProvider.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/GenAIServiceApplication.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicTools.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/VectorStoreController.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/OwnerDetails.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/PetDetails.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/PetRequest.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/PetType.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/Specialty.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/Vet.java`
- `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/dto/VisitDetails.java`
- `spring-petclinic-genai-service/src/main/resources/application.yml`
- `spring-petclinic-genai-service/src/main/resources/logback-spring.xml`
- `spring-petclinic-genai-service/src/main/resources/vectorstore.json`

### spring-petclinic-vets-service

- `spring-petclinic-vets-service/.gitignore`
- `spring-petclinic-vets-service/pom.xml`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/VetsServiceApplication.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Specialty.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/Vet.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/VetRepository.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/CacheConfig.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/system/VetsProperties.java`
- `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java`
- `spring-petclinic-vets-service/src/main/resources/application.yml`
- `spring-petclinic-vets-service/src/main/resources/db/hsqldb/data.sql`
- `spring-petclinic-vets-service/src/main/resources/db/hsqldb/schema.sql`
- `spring-petclinic-vets-service/src/main/resources/db/mysql/data.sql`
- `spring-petclinic-vets-service/src/main/resources/db/mysql/schema.sql`
- `spring-petclinic-vets-service/src/main/resources/logback-spring.xml`
- `spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java`
- `spring-petclinic-vets-service/src/test/resources/application-test.yml`

### spring-petclinic-visits-service

- `spring-petclinic-visits-service/pom.xml`
- `spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/VisitsServiceApplication.java`
- `spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/config/MetricConfig.java`
- `spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/Visit.java`
- `spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/model/VisitRepository.java`
- `spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java`
- `spring-petclinic-visits-service/src/main/resources/application.yml`
- `spring-petclinic-visits-service/src/main/resources/db/hsqldb/data.sql`
- `spring-petclinic-visits-service/src/main/resources/db/hsqldb/schema.sql`
- `spring-petclinic-visits-service/src/main/resources/db/mysql/data.sql`
- `spring-petclinic-visits-service/src/main/resources/db/mysql/schema.sql`
- `spring-petclinic-visits-service/src/main/resources/logback-spring.xml`
- `spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java`
- `spring-petclinic-visits-service/src/test/resources/application-test.yml`
