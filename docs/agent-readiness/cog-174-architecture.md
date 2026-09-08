# COG-174 architecture source audit

Architecture thread; 2026-09-08; examined `ad874c63673aaf6d1407ff359703481e85f473f4` in the Maestro checkout. Exclusive writes: this report and [architecture](architecture.md). No application, POM, configuration, fixture or asset changes. The [coordinator record](cog-174.md) owns initial Git state, the complete path manifest, integration and delivery. COG-172 evidence remains historical.

## Coverage and method

Read root AGENTS, WORKFLOW, README, readiness index and assigned thread contract. No nested AGENTS were found. Read the root and eight module POMs, all 62 Java files (including nine test/support Java files), all application/test configuration, logging XML, three message bundles, frontend JavaScript/templates/SCSS, schema/seed SQL and the JMeter plan. Reads were split by module; fixture string literals were suppressed for SQL review. JMeter XML was also parsed to inspect every nonempty property rather than relying on a truncated terminal dump. No fixtures were executed.

Counts below are the tracked `src/main` and `src/test` paths, excluding each module POM. They reconcile to 153 source/resource paths (138 main, 15 test). The [complete manifest](cog-174.md) identifies each path.

| Module | Main paths | Test paths | Java files | Examined contracts / result |
|---|---:|---:|---:|---|
| Admin | 3 | 0 | 1 | Admin/discovery entrypoint, configuration import, logging and dependencies; existing map accurate, no behavior change |
| Gateway | 69 | 6 | 14 | Static routing, four discovery routes, aggregation and fallback, local DTO copies, every UI controller/template, WebJars and SCSS generation, test definitions and load plan; existing flow map accurate; telephone and image metadata differences now recorded |
| Config | 3 | 2 | 2 | Config entrypoint, Git/native backend, landing-page API links, context test and test Git URL; no source change |
| Customers | 21 | 2 | 16 | Owner/pet REST reads and writes, request mapping, entities, repositories, schemas, seeds, metrics and read test; no source change; telephone constraint discrepancy recorded |
| Discovery | 2 | 1 | 2 | Eureka entrypoint, optional/default versus mandatory/docker config import, context test; no change |
| GenAI | 16 | 0 | 13 | Chat prompt/advisors, four tools, customers REST calls, startup vector loader, DTOs, provider config and POM; no tests present; no change to model calls or data |
| Vets | 13 | 2 | 8 | Repository-backed list, eager specialties, production-profile cache switch, properties record, SQL, logging and list test; no change |
| Visits | 11 | 2 | 6 | Create/read/batch REST, entity/repository, metrics, SQL, logging and read test; MySQL coupling corrected in documentation |
| Total | 138 | 15 | 62 | Eight independently packaged modules; no additional domain job, broker or shared library discovered |

Explicit depth limits: 137 of these paths received semantic text review. The remaining 16 received classification or structural inspection: 12 binary gateway assets (six PNGs and six EOT/TTF/WOFF fonts), two SVG font resources, the bundled vector JSON and generated `petclinic.css`. Both SVGs parsed as font/glyph/kerning resources; glyph outlines were not visually reviewed. Vector JSON parsed as six records with `embedding`, `id`, `metadata`, `text` keys; embedding values and record content were not reproduced or independently validated. The generated CSS includes Bootstrap 5.3.3 and custom output; its provenance, source SCSS and custom tail were reviewed, but the full embedded Bootstrap declaration corpus was not manually audited. These are bounded asset exclusions, not a complete visual or dependency-security review. No rendered browser behavior is claimed.

The source corpus was enumerated from `git ls-files` and counted by module, source tree and suffix. The graph was read-only: `kg_health` matched the examined head (600 nodes, 1174 relationships, truncated graph and fallback local enrichment); `kg_search` for `routes controllers services` returned no nodes; a bounded `kg_subgraph` for `visits` returned source nodes. Source inspection, not graph completeness, supports this report. Memory registry search for COG-174/Petclinic returned no relevant guidance.

## Findings and disposition

| Finding / evidence | Risk and disposition | Owner / dependencies | Completion evidence |
|---|---|---|---|
| Existing architecture asserted no visits database FK for all engines; [MySQL schema](../../spring-petclinic-visits-service/src/main/resources/db/mysql/schema.sql) references customers `pets`, while HSQLDB does not | Resolved documentation error; MySQL retains an existing shared-database and initialization-order constraint | Architecture; runtime notified for setup alignment | Architecture now distinguishes engines and links both schemas |
| Image metadata mismatch was recorded only for gateway; module POMs also show vets/GenAI mismatches and the visits property-name discrepancy | Accepted existing build metadata risk, documented without changing runtime ports or build configuration | Architecture; runtime confirmation needed before any corrective build change | Architecture lists exact property names and Compose mappings |
| Browser owner form requires 12 telephone digits; API request allows up to 12; GenAI tool prose asks for 10 | Accepted existing input-contract difference; no unauthorized behavior change | Architecture; any future correction must coordinate UI, customers validation and GenAI prompt | Source-linked observation added to architecture |
| Architecture only described COG-172 source review | Resolved continuity gap without relabeling old tests | Architecture; coordinator index/handoff | Both reviewed heads and this audit linked from architecture |
| Existing REST route, aggregation fallback, tool-write, vector-startup, config/deploy and test-boundary maps match source | Accepted, no change needed | Architecture | All module paths accounted for above; no application diff |
| Browser, packaged GenAI startup, live provider and MySQL behavior have no fresh runtime evidence in this thread | Bounded validation limitation; documentation is not a pass result | Coordinator validation and runtime owners | This report explicitly limits conclusions to source; final commands/results belong to coordinator evidence |

## Validation and handoff

Observed local static checks: XML parsing of the JMeter plan and two SVG font resources succeeded; JSON parsing of the vector resource succeeded without dumping values. These establish parseability only. `git diff --check -- docs/agent-readiness/architecture.md docs/agent-readiness/cog-174-architecture.md` passed (exit 0). A Python path check passed for all local link targets in the two owned documents. The full `python3 scripts/check-agent-docs.py` initially failed (exit 1) because concurrent runtime edits linked the not-yet-created `cog-174-runtime.md`; this integration timing failure is not an architecture link failure and requires the coordinator to rerun the guard after owner artifacts are complete. No Maven, stack launch, provider request, database command, commit, push or tracker mutation ran in this thread.

Next integration step: independent reviewer checks documentation corrections against schemas/POMs and reconciles this coverage with the coordinator's remaining areas. Preserve the existing application behavior; rollback consists only of reverting these documentation changes in the authorized delivery flow.
