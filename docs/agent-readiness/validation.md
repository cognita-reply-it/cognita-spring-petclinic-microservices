# COG-172 validation evidence

Coordinator-owned execution ledger, 2026-09-07. Commands run in `/opt/project/workspaces/COG-172`, Linux aarch64, unless stated otherwise. Baseline source HEAD `f3b392c92580b740f4bafd0364b326e0bd1774f0`; application source/POMs are unchanged during this migration. Runtime logs stay outside Git in `/opt/project/logs/cog-172`; sanitized observations below are the durable evidence.

| Command / capability | Environment | Observed result |
|---|---|---|
| `git status --short`, branch/HEAD/remotes | Initial checkout | Clean main at f3b392c; no user changes to preserve; injected WORKFLOW.md ignored and retained |
| `git fetch origin main`; `git merge --ff-only origin/main` | GitHub origin | Success, already up to date |
| kg_health; kg_search; kg_subgraph; kg_recent_changes | worker-local MCP | Ready at baseline SHA; graph truncated, 600 nodes/1175 relationships; used as read-only context |
| `./mvnw -B clean verify` | Initial runtime | Exit 1: `JAVA_HOME is not defined correctly`; Java/Maven/Docker absent from PATH |
| JDK17 bootstrap attempt | Downloaded x64 archive | Wrong architecture: qemu could not open x86_64 loader; corrected after `uname -m` returned aarch64 |
| `JAVA_HOME=/opt/project/logs/cog-172/jdk-arm64 ./mvnw -B clean verify` | Downloaded Temurin JDK17 aarch64; pinned Maven wrapper | Exit 0, BUILD SUCCESS, 1:11 min; all nine reactor entries successful. Eight Surefire report files contain 9 tests, 0 failures/errors/skips. Admin/GenAI have no tests. |
| Collaboration tools | Runtime | Three work threads actually spawned; independent review reserved after integration |
| Linear/GitHub tooling discovery | Runtime | Linear GraphQL authenticated and workpad created; no GitHub connector exposed, local authenticated gh fallback available |

## Additional validation

`python3 scripts/check-agent-docs.py` passed (13 Markdown files, 8 modules). `git diff --check`, Python AST/all POM XML parsing, `sh -n mvnw` and `bash -n scripts/run_all.sh scripts/pushImages.sh scripts/tagImages.sh scripts/chaos/call_chaos.sh` passed. The five explicit application YAML environment placeholder names exactly match .env.example; provider values are blank. `git check-ignore .env .env.local spring-petclinic-genai-service/src/main/resources/creds.yaml` confirms all are ignored. Reviewer independently exercised negative guard cases. Docker/Podman are absent; no container build, Compose startup, live browser, provider, MySQL, registry publish or production deploy has been executed. Those outcomes cannot be inferred from documentation or CI configuration. [Checks](checks.md) identifies exact coverage limits. [Review](review.md) records independent findings and owner corrections.

JDK observed: Temurin 17.0.20.1+1 (aarch64); wrapper observed Maven 3.9.8. Initial provisioning failed only due to missing JDK and then a wrong-architecture download; neither changed source. The corrected full build is the behavioral baseline and final Java regression evidence because no Java/POM/resources changed afterward.

A bounded packaged-JAR smoke was attempted using reviewed public external config YAML at commit `323993ce2519c6d02df63e08bf4458d123d3b611`, native backend, explicit local ports and synthetic bundled HSQLDB data. No MySQL/chaos/provider profile. Observed outcomes are recorded below.

## Packaged-JAR runtime attempt

The external config files were fetched read-only from public GitHub at `323993ce2519c6d02df63e08bf4458d123d3b611` and inspected before launch: default HSQLDB initialization, local Eureka, no MySQL/chaos profile. They were kept outside source under `/opt/project/logs/cog-172/config`.

For each selected service the actual command was `/opt/project/logs/cog-172/jdk-arm64/bin/java -Xmx160m -jar spring-petclinic-<service>/target/spring-petclinic-<service>-4.0.1.jar --server.port=<port>`, with `GIT_REPO=/opt/project/logs/cog-172/config`; Config additionally used `--spring.profiles.active=native`. Service/port pairs were config-server/8888, discovery-server/8761, customers-service/8081, visits-service/8082, vets-service/8083, api-gateway/8080, admin-server/9090. The temporary orchestration script only started/stopped its own processes and issued GET probes.

- Initial Config probe `/actuator/health` returned HTTP 200 with Environment fields, not health. `/customers-service/default` returned two property sources. Runtime docs were corrected and independently reviewed. An immediate retry's port preflight encountered address-in-use after shutdown; SO_REUSEADDR corrected that preflight without terminating unrelated processes.
- Corrected sequence observed Config sources resolved, Eureka `/eureka/apps` registry XML, and health `UP` for Customers, Visits, Vets, Gateway and Admin. Gateway `/` returned HTTP 200 HTML (3597 bytes).
- The seven-service run did **not** establish sustained integrated health: later Customers had exited (zombie), direct connection failed and routed GET returned 405 through existing fallback behavior. The worker cgroup limit is 2147483648 bytes with `oom_kill=1`; resource exhaustion is the supported explanation, not a proven application regression. All surviving owned processes were terminated. No data write probes were sent.
- Reduced core-only retry (without Admin, `-Xmx96m -XX:ActiveProcessorCount=2`): Config semantic check, Eureka registry and domain/gateway health probes initially passed (Customers, Visits, Vets, Gateway); gateway HTML again HTTP 200. The cgroup then recorded a second OOM kill (`oom_kill=2`), so sustained routed domain probes were not accepted as passing. The bounded driver was interrupted and stopped its surviving owned processes. Full integrated smoke remains **blocked by worker capacity**; retry on a suitably sized isolated environment using the documented commands. Admin was observed UP only in the first run; GenAI/provider was not launched.

## Final interpretation

The Java build/tests and offline migration gates pass. Application source/POM/data/UI/role/image files have no diff; no Java rerun is needed after subsequent documentation-only corrections. The full integrated runtime is not certified: isolated startup signals and static shell HTTP success are explicitly narrower than domain flows. Missing Docker/Podman/daemon, MySQL target, authorized provider test and production environment remain bounded exclusions. No release or deploy is claimed. The independent reviewer rechecked this final technical ledger before commit and closed R4 for technical evidence; hosted PR checks are recorded with delivery in the handoff/workpad.

The first staged whitespace check caught an extra blank line at inventory EOF (untracked files were absent from earlier unstaged diff checks). It was removed before push; final baseline-to-HEAD whitespace and documentation checks pass.
