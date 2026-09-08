# Choosing and interpreting checks

Owner: validation thread, reconfirmed for COG-174; future changes follow the owner of the affected build or test contract. Run commands from repository root unless noted. [Historical validation evidence](validation.md) and [COG-174 checks](cog-174-checks.md) record actual executions; the commands below describe available checks, not successful results. [Setup](setup.md) owns prerequisites and supported start paths.

## Local and CI matrix

| Change / check | Command | What it establishes / limits | CI |
|---|---|---|---|
| Documentation, instructions, environment names | `python3 scripts/check-agent-docs.py` | Python 3.9+ stdlib guard: required files, local Markdown file destinations, all reactor modules mentioned in inventory/architecture, environment assignment names documented in setup | Maven workflow, before build |
| Documentation guard changes | `python3 scripts/test-check-agent-docs.py` | Stdlib temporary-repository regression cases for missing files/links/module/env names, nested instructions, role sources, fences and repository escapes | Maven workflow, before guard |
| Every Java module; final regression gate | `./mvnw -B clean package --file pom.xml` | Fresh compile, test compilation, Surefire tests and application packaging. Requires JDK 17 and artifact network access; Config Server tests can use external Git | CI runs `./mvnw -B package --file pom.xml` on a fresh checkout |
| Focused Java module tests | `./mvnw -B -pl spring-petclinic-api-gateway -am test` | Example: gateway reactor prerequisites and tests; replace module with one from root POM. Modules without tests still compile; success there is not behavioral coverage | Full reactor |
| One existing test | `./mvnw -B -pl spring-petclinic-api-gateway -Dtest=ApiGatewayControllerTest test` | Gateway aggregation and visits-error fallback with mocked clients; not deployed routing or persistence | Full reactor includes this class |
| Java type checking only | `./mvnw -B -DskipTests compile` | Java compiler checks; does not test runtime behavior | Part of package |
| Lint / formatting | `git diff --check` | Whitespace errors only. No dedicated Java, JS or Markdown linter configured; respect root `.editorconfig` | No dedicated lint job |
| Gateway SCSS regeneration | `./mvnw -B -pl spring-petclinic-api-gateway -Pcss generate-resources` | Existing optional libsass 0.2.29 profile unpacks Bootstrap and overwrites tracked static CSS. Review generated diff and UI before retaining | Not enabled |
| Images | `./mvnw -B clean install -PbuildDocker` | Builds all application images using Docker daemon; see setup for Podman/platform variants. Does not publish or prove container health | Not enabled |
| Compose model | `docker compose config --quiet` | Validates interpolation/model only; does not start containers or validate credentials/remote images | Not enabled |
| Runtime smoke | Follow [setup](setup.md) and [operations](operations.md) health/route probes | Requires actual running services. Record HTTP status and payload; distinguish health from routed domain behavior | Not configured |
| SQL/schema/seed | Maven service tests plus explicit disposable database inspection if SQL changes | No Flyway/Liquibase migration runner or automated migration gate. Current MVC slices mock repositories and do not validate schema/fixtures | No database matrix |
| AngularJS browser behavior / E2E | Manual browser flow after stack startup; see procedure below | No package.json, Node package manager, JS typecheck, browser runner or automated E2E gate is configured | Not configured |
| JMeter load plan | Inspect existing `.jmx` before any run | Plugin-dependent load plan with writes and a custom thread schedule; not an acceptance smoke command | Not configured |

A full Maven `verify` may also be used, but the repository declares no distinct Failsafe execution or additional verify-phase integration gate. `VisitsServiceClientIntegrationTest` ends in `Test` and belongs to the ordinary test suite despite its name. Do not call a compilation-only, skipped-test or cached earlier report a new passing test run. Keep Maven invocations serial in a shared checkout because they write the same module `target/` directories.

## Behavioral coverage from source

The eight concrete test classes contain nine `@Test` methods:

| Module | Existing coverage | Missing evidence |
|---|---|---|
| `spring-petclinic-api-gateway` | `ApiGatewayApplicationTests` context; `ApiGatewayControllerTest` owner aggregation and visits-error behavior; `VisitsServiceClientIntegrationTest` HTTP client against MockWebServer | Live discovery/routing, customer failure, complete browser flows and provider chat |
| `spring-petclinic-customers-service` | `PetResourceTest` GET pet response through MVC slice and mocked repository | Owner/pet writes, actual DB schema and persistence |
| `spring-petclinic-vets-service` | `VetResourceTest` list serialization via mocked repository | Actual DB/cache behavior |
| `spring-petclinic-visits-service` | `VisitResourceTest` GET list through mocked repository | Write validation and actual persistence |
| `spring-petclinic-config-server` | `PetclinicConfigServerApplicationTests` application context; test config references upstream Git | Stable pinned external configuration and deployed refresh |
| `spring-petclinic-discovery-server` | `DiscoveryServerApplicationTests` application context | Live registration and discovery |
| `spring-petclinic-admin-server` | No test source | Runtime registration and admin behavior |
| `spring-petclinic-genai-service` | No test source | Provider chat, embeddings/vector load and tool-driven mutations |

Sources: module `src/test` trees listed in [inventory](inventory.md), [parent POM](../../pom.xml), [gateway POM](../../spring-petclinic-api-gateway/pom.xml). Missing coverage is retained as a disclosed limitation; this documentation/CI migration does not add provider calls, rewrite app behavior or claim complete regression coverage.

For a UI change, start the minimum stack on disposable development data, open the gateway, inspect browser console/network failures, list owners and vets, open an owner, and exercise only the changed write flow. Record browser, viewport, URL, observed response and resulting data; clean up only owned disposable data. Chat testing needs separately authorized provider credentials and an explicit mutation boundary. No such browser run follows automatically from Maven success.

The [JMeter plan](../../spring-petclinic-api-gateway/src/test/jmeter/petclinic_test_plan.jmx) refers to `kg.apc.jmeter.threads.UltimateThreadGroup`, defines the misspelled `PETCLINC_HOST`, and calls singular paths such as `/api/customer/owners` and `/api/visit/owners/...`. These singular prefixes match the current gateway route configuration. It issues POST requests and sets loop count `-1` under the plugin-specific thread schedule; this is load traffic, not a single-pass smoke test. Its JMeter/plugin installation is not pinned here. It cannot establish current E2E correctness without first verifying plugin compatibility, the configured schedule and a disposable target; do not launch it against shared or production data.

## CI contract and evidence boundaries

[Java CI with Maven](../../.github/workflows/maven-build.yml) triggers on pushes to `main` and pull requests targeting `main`. It uses `ubuntu-latest`, checkout v4, setup-java v4, Java 17/adopt and Maven dependency caching. COG-172 preserved these choices and the existing package gate, switched to the already pinned Maven 3.9.8 wrapper and added the offline documentation guard. COG-174 adds the guard regression suite to the same step before checking the repository; either Python failure stops the job before Maven. There is no configured artifact upload, release publication, registry push or deploy stage. Branch protection requirements are GitHub settings and cannot be inferred from YAML.

[Triage pull requests](../../.github/workflows/check-pr-template.yml) is preserved. It uses `pull_request_target` for PR metadata triage and a daily schedule for stale incomplete PRs, with PR/issue write permissions and an optional `ORG_READ_PAT` membership lookup. It is not a code validation gate and does not check out or execute PR code. Its configured actions do not prove that organization secrets or hosted workflows are enabled.

The documentation guard checks simple inline Markdown links and reference definitions outside fenced code, including linked images. Its source scope is root README/CONTRIBUTING, all readiness Markdown, root and nested AGENTS.md, and `.codex/agents` Markdown/TOML role sources. Role files are scanned as text for Markdown destinations; this is not TOML/schema validation or proof that a role is installed. Links resolve relative to the containing file. Instruction discovery skips `.git`, `target`, `generated`, `node_modules`, `.venv` and `__pycache__`, and does not follow directory symlinks. Runtime WORKFLOW.md is outside the source scope. Other Markdown outside this scope is not automatically audited. It excludes URL reachability, anchors, HTML links, code snippets and semantic accuracy. It checks env **names**, not their correctness against every Spring relaxed-binding variant or whether a value is secret; review the source/template manually. It reports required files missing rather than silently passing an incomplete handoff. No network, build outputs or secret values are needed.

Official references consulted for the workflow adjustment: [Maven Wrapper behavior](https://maven.apache.org/tools/wrapper/), [setup-java v4 options and cache](https://github.com/actions/setup-java/tree/v4), [GitHub Maven build guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/java-with-maven). The repository's checked-in wrapper properties and workflow remain the version-specific authority. Remote CI results and environment-specific blockers belong in [validation](validation.md), not inferred from these references.

The module-presence guard treats inventory.md as an evolving module coverage contract as well as a dated audit. When adding a module, append current coverage there and update architecture.md; preserve the historical manifest and execution evidence. The guard checks presence of module names, not completeness of the dated file manifest.
