# COG-174 runtime audit

Owner: runtime thread. Scope/ownership was assigned in [COG-174 execution record](cog-174.md) before writes. Reviewed the selected Maestro checkout at `ad874c63673aaf6d1407ff359703481e85f473f4` on 2026-09-08. This records current static inspection and harmless checks; historical COG-172 application runs remain in [validation](validation.md). The coordinator owns current Maven/runtime recovery evidence.

## Coverage and decisions

| Area and inspected sources | Result / gap | Decision and evidence |
|---|---|---|
| Root POM, all eight module POMs, `.mvn/wrapper/maven-wrapper.properties` | Java 17, Boot 4.0.1, Cloud 2025.1.0, Maven 3.9.8/checksum; image profile builds on install | Existing version/setup contract preserved; no dependency or build changes |
| All eight main `application.yml` files; all five test YAML files | Seven optional local Config imports become mandatory Docker imports; native Config needs GIT_REPO; external main is unpinned; tests are not full runtime configuration | [Setup](setup.md) remains owner for eight startup paths and external revision recording; no unsupported standalone deployment claim |
| `.env.example`, root `.gitignore`, main Java/YAML environment lookup search | Five explicit uppercase YAML placeholders match five template names exactly; local env/creds ignored | Accepted, no edit needed. Framework relaxed-binding overrides are not an exhaustive enumerable environment contract |
| `docker-compose.yml`, `docker/Dockerfile`, `.devcontainer/devcontainer.json` | Eleven Compose services; two healthchecks; floating application/base tags; devcontainer declares features but was not built | Source-based paths preserved; runtime validation blocked by missing tools. Image EXPOSE mismatches added to setup; they do not prove a wrong actual Spring port |
| All eight files under `docker/`, including dashboard JSON and provisioning | Four application Prometheus targets plus self; Grafana anonymous Admin; `Visit Created` uses `method="read"` | Operations now records role and misleading panel. Accepted legacy dashboard defect; validate actual metrics before using it as creation evidence |
| Six main `logback-spring.xml` files, GenAI logging YAML, `VectorStoreController.java` | Boot base logging/JMX declarations; advisor DEBUG; missing vector store can trigger provider-backed initialization | Existing synthetic-data/private-log and no-provider-default-smoke boundaries preserved; declared logging configuration is not runtime compatibility proof |
| Customers/Vets/Visits `src/main/resources/db/{hsqldb,mysql}/{schema,data}.sql` (12 files) | HSQLDB drops tables; MySQL creates/uses fixed petclinic database and Visits references Customers pets; initialization comes from external config | Setup now distinguishes dialects and dependency. No seed/reset or SQL execution; schema/sample data retained |
| `scripts/run_all.sh`, `scripts/tagImages.sh`, `scripts/pushImages.sh` | Launcher kills broadly/activates chaos; image scripts lack fail-fast/variable validation | Foreground startup remains default; operations now explains why final image-script exit alone cannot prove all eight operations succeeded |
| `scripts/chaos/README.md`, helper, all 11 JSON payloads | All payloads parse; disable payload accepted despite omitted usage option; only exception/memory explicitly set level 5 | Operations records source/doc discrepancy and restoration payloads; no chaos request made |

No file under application source, Docker, scripts, dependency configuration or infrastructure was changed by this thread. Changes are limited to `setup.md`, `operations.md` and this audit. `.env.example` and `.gitignore` were assigned, checked and retained unchanged. Cross-owned README clarification was sent to the coordinator.

The source-level legacy discrepancies above are accepted with explicit impact rather than silently repaired: container port metadata, dashboard labeling, broad legacy launcher, image-script failure handling and chaos documentation do not establish a production contract. Correcting executable behavior would need its own scoped validation in this same issue or a later authorized task; no additional tracker issue was created.

## Current checks

Linux worker, Python 3 and Bash; no service or provider call. Sanitized log: `/opt/project/logs/cog-174/runtime-static.txt` (worker-local, not required to understand results below).

| Check actually executed | Observed result | Limit |
|---|---|---|
| `bash -n scripts/run_all.sh`, `bash -n scripts/tagImages.sh`, `bash -n scripts/pushImages.sh`, `bash -n scripts/chaos/call_chaos.sh` | Four exit 0 results | Syntax only; scripts not executed |
| Python `json.loads` on all `scripts/chaos/*.json` and Grafana dashboard | 12 parsed documents | Not Chaos Monkey/Grafana schema or runtime validation |
| Python regex set equality: uppercase placeholders in all main YAML versus assignment names in `.env.example` | PASS; AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, CONFIG_SERVER_URL, GIT_REPO, OPENAI_API_KEY | Covers explicit YAML placeholders, not external config or arbitrary framework overrides |
| `git check-ignore -q` for `.env`, `.env.local`, `creds.yaml`, GenAI resources `creds.yaml` | Exit 0 for each | No credential file created/read |
| `git check-ignore -q .env.example` | Exit 1, intentionally trackable | No secret values in the template |
| `command -v docker`, `podman`, `podman-compose`, `devcontainer`, `java` (individually) | Exit 1 for each at runtime audit time | PATH lookup, not proof of absence everywhere on disk; coordinator investigates Java separately |
| `git diff --check -- docs/agent-readiness/setup.md docs/agent-readiness/operations.md` | Exit 0 | Whitespace only; independent content review follows |

Equivalent parser/template check from the root:

```sh
python3 - <<'PY'
import json, re
from pathlib import Path
for path in list(Path('scripts/chaos').glob('*.json')) + [Path('docker/grafana/dashboards/grafana-petclinic-dashboard.json')]:
    json.loads(path.read_text())
names = set()
for path in Path('.').glob('spring-petclinic-*/src/main/resources/application.yml'):
    names.update(re.findall(r'\$\{([A-Z][A-Z_0-9]*)(?=[:}])', path.read_text()))
template = set(re.findall(r'^([A-Z][A-Z_0-9]*)=', Path('.env.example').read_text(), re.M))
assert names == template, (names, template)
print('JSON and explicit environment template checks PASS')
PY
```

## Capability boundaries and handoff

KG health reported matching indexed HEAD, 600 nodes/1174 edges, truncation and local-evidence enrichment fallback. `kg_search` for `docker configuration scripts` returned no nodes; `kg_subgraph` for `config` returned a truncated metric configuration community. These results did not substitute for the complete file inspection above. No graph refresh or mutation.

Docker/Podman/Compose/devcontainer build, Dockerfile layer extraction, image publishing, MySQL, monitoring scrape, browser flow, complete distributed startup and paid chat were not executed by this thread. Container commands cannot run with their executables missing. External config contents/revision and provider/deployed environments are outside this repository audit; they require separate reviewed runtime inputs. Maven/service execution belongs to the coordinator and must be read in the current execution record, not inferred from this static audit.

No SDK, API, dependency or tool configuration was changed. The new EXPOSE explanation was checked against the [official Dockerfile reference](https://docs.docker.com/reference/dockerfile/#expose) on 2026-09-08; the project does not pin a Docker Engine version. Existing official-reference links in setup retain their historical attribution.

Next step: independent reviewer checks these three documents against sources; coordinator integrates the evidence and any runtime recovery. A normal reviewed revert of these documentation changes restores the prior instructions; no database or application rollback is needed.
