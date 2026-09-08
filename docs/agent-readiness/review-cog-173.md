# COG-173 independent review

Reviewed on 2026-09-08 against baseline `ad874c63673aaf6d1407ff359703481e85f473f4` and the integrated working-tree changes. The reviewer owns this record only and has authored none of the reviewed implementation or guidance files. Findings go to the responsible owner through the coordinator.

Scope: the [current migration record](cog-173.md) and manifest, all changed and newly added artifacts, source correspondence of changed claims, documentation guard and regression tests, CI wiring, historical/current evidence boundaries, preservation of application and secret boundaries.

## Findings and disposition

| ID / severity | Finding and source | Owner / resolution |
|---|---|---|
| R1 / low | Architecture's opening coverage and ownership links still pointed at historical COG-172 inventory/plan although the current index uses COG-173 | Architecture owner corrected both links to the current migration record; reviewer observed the correction in the integrated file. Closed. |

No blocking implementation defect was found in this guidance/guard migration. Recommendation: proceed with commit and PR delivery, carrying the explicit runtime limitations into the handoff. The reviewer rechecked the coordinator's integrated evidence and final change ledger (13 modified files, five additions) after R1 was closed. Review acceptance does not certify runtime paths explicitly left unverified; no PR, hosted CI or tracker transition is asserted by this record.

## Coverage and source correspondence

- Independently compared the entire baseline manifest with `git ls-tree -r --name-only ad874c6`: exactly 230 distinct paths, no omissions, extras or duplicates. The current record classifies all repository areas and explicitly excludes binary internals, individual vector elements and external environments from deeper audit. This is full structural coverage, not exhaustive behavioral or binary analysis.
- Reviewed the integrated changes to root instructions/README, readiness index, architecture, setup, operations, checks, historical notices, current migration/ownership/evidence/handoff, reusable task prompt, guard, its complete test file and CI step. The archived COG-172 handoff is byte-for-byte identical to the baseline handoff; previous evidence is retained and labeled historical.
- Checked the changed MySQL/HSQLDB statements against all domain SQL schema/seed files: the MySQL scripts select the shared `petclinic` database and Visits references Customers' `pets`; HSQLDB Visits has no corresponding foreign key. The correction does not execute SQL or alter schema behavior.
- Checked image-port discrepancies against root/child POM properties and Compose, the default Vets production/cache profile against YAML and CacheConfig, and chat fallback/vector resource claims against PetclinicChatClient and VectorStoreController. Source-level packaged-resource risk is explicitly separated from an observed startup failure.
- Checked explicit environment placeholders against application YAML/Compose and the existing blank-key template. Setup correctly distinguishes shell export, Compose interpolation/forwarding, optional native Config mode and external configuration provenance. No new credentials, runtime auth/config, real user records or secret values appear in the reviewed additions.
- Confirmed via scoped Git diff that application module trees, root POM, Docker/Compose, environment template/ignore rules, wrapper, devcontainer, role specifications and design/extraction files are unchanged. CI adds only local guard regression execution ahead of the existing guard/package steps; it does not add privileged execution, deployment or publication.
- The guard's documented scope matches its implementation: tracked plus nonignored new Markdown, runtime/generated exclusions, local link targets and explicit application/Compose environment-name drift. It is intentionally not a full Markdown/YAML parser or a secret scanner. Its CLI fixtures include independently meaningful failure cases and preserve ignored/runtime boundaries.
- The task prompt and thread contracts establish exclusive ownership, cross-thread coordination, source authority, bounded external actions, failure evidence and resumable handoff. The independent reviewer never amended another owner's files. Current and historical acceptance states remain distinct.

Read-only KG health matched the baseline HEAD and disclosed truncation/fallback enrichment; the review's documentation/configuration search returned no nodes. File evidence, not graph completeness, supports this review.

## Checks independently observed

Environment: active Maestro checkout, Linux aarch64, Python 3.13.5; commands run from repository root.

| Command / inspection | Observed result | Meaning and limits |
|---|---|---|
| `python3 scripts/check-agent-docs.py` | Exit 0; 20 Markdown files, 8 Maven modules | Integrated local destinations/required artifacts/module/env checks pass |
| `python3 -B -m unittest discover -s scripts/tests -v` | Exit 0; all 11 tests pass | Actual guard CLI exercised in isolated temporary Git fixtures |
| `git diff --check` | Exit 0; no output | No tracked whitespace errors; not a semantic or security scan |
| Manifest comparison with `git ls-tree -r --name-only ad874c6` | 230 recorded paths equal 230 tracked baseline paths; zero duplicates | Complete baseline structural inventory |
| Byte comparison with `git show ad874c6:docs/agent-readiness/handoff.md` | Equal | Prior handoff preserved exactly |
| Parse current `*/target/surefire-reports/TEST-*.xml` and inspect `/opt/project/logs/cog-173/baseline-maven-jdk.log` | Eight reports, 9 tests, 0 failures/errors/skips; log records BUILD SUCCESS at 2026-09-08T14:58:40Z | Reviewer inspected the coordinator's recovered baseline evidence; did not launch a second Maven run |

Maven was not run concurrently. The recovered baseline used `JAVA_HOME=/opt/project/logs/cog-172/jdk-arm64 ./mvnw -B clean package --file pom.xml`; no Java/POM/resources changed afterward. Guard-only final checks are proportionate to the actual executable change. A passing package does not establish Admin/GenAI, database writes or distributed/provider behavior.

## Accepted limits and remaining delivery

Docker/Podman/devcontainer and MySQL lack the recorded runtime prerequisites; full distributed/browser smoke was not repeated, and provider/production interactions remain outside authorized validation. Floating configuration/images, limited Java coverage and existing GenAI packaged-resource risk are explicitly disclosed with their consequences. Historical 2 GiB/OOM evidence is not relabeled as a new execution. No environment success, release or deployment is inferred.

Coordinator must update the current handoff/evidence from review-pending to this observed disposition, publish the reviewed branch, link its PR to Linear, poll visible checks/reviews and record Human Review according to WORKFLOW. These delivery operations are outside this reviewer's write scope. The migration can be reverted through an ordinary reviewed revert without data reset or application deployment.
