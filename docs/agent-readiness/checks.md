# Choosing and interpreting checks

Owner: validation thread for COG-173; future changes follow the owner of the affected build or test contract. Run commands from repository root unless noted. [Current validation evidence](cog-173.md) records COG-173 executions; [COG-172 validation](validation.md) is historical evidence. The commands below describe available checks, not successful results. [Setup](setup.md) owns prerequisites and supported start paths.

## Local and CI matrix

| Change / check | Command | What it establishes / limits | CI |
|---|---|---|---|
| Documentation, instructions, environment names | `python3 scripts/check-agent-docs.py` | Python 3.9+ stdlib + Git guard: required files, repository Markdown destinations, reactor module mentions, template names matched to explicit application/Compose placeholders and setup | Maven workflow, before build |
| Documentation guard changes | `python3 -B -m unittest discover -s scripts/tests -v` | Isolated temporary Git fixtures exercise the actual CLI: nested/new/tracked docs, env drift, required artifacts, encoded links and exclusions; no Java/network/provider calls | Maven workflow, before guard |
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

[Java CI with Maven](../../.github/workflows/maven-build.yml) triggers on pushes to `main` and pull requests targeting `main`. It uses `ubuntu-latest`, checkout v4, setup-java v4, Java 17/adopt and Maven dependency caching. COG-172 established the pinned Maven 3.9.8 wrapper and offline documentation guard. COG-173 preserves the Java/action/cache/package choices and adds the guard regression suite before the documentation check. There is no configured artifact upload, release publication, registry push or deploy stage. Branch protection requirements are GitHub settings and cannot be inferred from YAML.

[Triage pull requests](../../.github/workflows/check-pr-template.yml) is preserved. It uses `pull_request_target` for PR metadata triage and a daily schedule for stale incomplete PRs, with PR/issue write permissions and an optional `ORG_READ_PAT` membership lookup. It is not a code validation gate and does not check out or execute PR code. Its configured actions do not prove that organization secrets or hosted workflows are enabled.

The documentation guard discovers tracked and untracked nonignored Markdown through `git ls-files --cached --others --exclude-standard -z`, including nested AGENTS, design references, script docs and the PR template. It explicitly excludes runtime `WORKFLOW.md` and `target/`, `generated/`, `.git/` trees. Ignored local files are not source inputs. Run it from a Git checkout; an unavailable Git executable/index or unreadable POM is a failed check, not empty successful coverage.

It checks simple inline Markdown links and reference definitions outside fenced code, including linked images. It excludes URL reachability, anchors, HTML links, code snippets, full CommonMark parsing and semantic accuracy. Environment assignment names must be unique, documented in setup and match the explicit uppercase `${NAME}` / `${NAME:default}` placeholders in module `src/main/resources/application*.yml`, `.yaml`, `.properties` and root Compose. Whole-line configuration comments are ignored. This bounds the template to application startup; release-only shell inputs and implicit Spring relaxed-binding overrides remain separately documented in setup. The guard is not a YAML parser, secret scanner or proof of provider configuration validity; templates still require manual review. It reports required files missing rather than silently passing an incomplete handoff. No network, build outputs or secret values are needed.

The [CLI regression fixtures](../../scripts/tests/test_agent_docs.py) cover failures that previously escaped detection, alongside exclusions and retained checks. COG-173 observed the old guard failing to report a broken new `scripts/AGENTS.md` link and a fake template name even when that fake name was added to setup prose. The new tests run in disposable Git repositories without staging or changing the working repository.

Official references consulted for the workflow adjustment: [Maven Wrapper behavior](https://maven.apache.org/tools/wrapper/), [setup-java v4 options and cache](https://github.com/actions/setup-java/tree/v4), [GitHub Maven build guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/java-with-maven). The repository's checked-in wrapper properties and workflow remain the version-specific authority. Remote CI results and environment-specific blockers belong in the [current ledger](cog-173.md), not inferred from these references.

COG-173 references consulted before adding the test step and Git discovery: [Git ls-files options](https://git-scm.com/docs/git-ls-files), [Python unittest discovery](https://docs.python.org/3.9/library/unittest.html#test-discovery), and [GitHub run step syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsrun).
