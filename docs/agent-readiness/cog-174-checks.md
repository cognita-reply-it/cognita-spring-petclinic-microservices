# COG-174 validation audit

Owner: validation thread. Audit date: 2026-09-08. Checkout: `/opt/project/workspaces/COG-174`, source HEAD `ad874c63673aaf6d1407ff359703481e85f473f4`, branch `codex/cog-174-agent-readiness`. This thread owns the guard, its regression script, [checks](checks.md) and this report. The coordinator owns Maven execution and workflow edits. No application, dependency, test fixture data or runtime configuration was changed here.

## Sources and coverage

Read root AGENTS/WORKFLOW, README and readiness index, root/eight module POMs, wrapper properties and launcher paths, both GitHub workflows, all Java test classes and test YAML, the documentation guard, and all four `.codex/agents` role files. No nested AGENTS existed in the original source checkout. KG health matched HEAD, but reported truncation and local-evidence enrichment fallback; `kg_search` for `check-agent-docs test Maven` returned no nodes, so files supplied the evidence. The wrapper JAR was classified as a supplied binary, not audited internally. Windows launcher execution, hosted workflow execution, external providers and deployed systems were outside this thread's executed checks.

The existing [check matrix](checks.md) matches the source: eight concrete Java test classes/nine methods, six modules with tests, no Admin/GenAI test sources, MVC repositories mocked, gateway client using MockWebServer, Config Server context configured against upstream Git. No separate Failsafe, Java/JS linter, Node package, browser runner or migration gate was found. Existing behavioral coverage and its missing write/persistence/provider cases remain disclosed rather than filled with unrelated application changes. Source review establishes test definitions; the coordinator's [execution record](cog-174.md) owns actual Maven results.

The Maven workflow preserves Java 17/adopt, Maven caching, pinned wrapper, main push/PR triggers and package gate. PR triage is a separate metadata workflow with `pull_request_target`, a daily stale-PR schedule and no checkout of PR code; its presence is not proof that secrets, branch protection or remote Actions are enabled. No image publication or deploy job is defined. Coordinator approved adding the new Python regression command before the existing guard in the same CI step; workflow change and hosted results belong to the coordinator.

## Demonstrated gap and fix

Before editing the guard, `python3 scripts/check-agent-docs.py` exited 0 with 14 Markdown files/eight modules. This differs from the coordinator's initial 13-file baseline only because the coordinator had created the current issue inventory before delegation.

A stdlib temporary-directory probe built the required entrypoints and a minimal Maven POM, then created a broken Markdown destination in both `service/AGENTS.md` and `.codex/agents/example.toml`. Calling the original `check(root)` returned `([], 13, 0)`: neither source was inspected. The regression `test_nested_instructions_and_role_prompt_destinations` now preserves this reproduction and requires both path/line diagnostics.

The guard now discovers nested AGENTS plus role Markdown/TOML sources, deduplicates root instructions and checks their destinations relative to their source. Build/dependency/cache directories (including gitignored `generated/`) and directory symlinks are not traversed. Runtime workflow/auth/config files are not selected. It remains a bounded source-link guard, not a complete Markdown parser, TOML validator, secret scanner or semantic documentation audit. Required-file, module-mention and environment-name checks are preserved.

## Executed evidence

Environment: Linux worker, Python 3.13.5, standard library only. Commands run from the selected checkout, without a network dependency or Maven invocation in this thread.

| Command / probe | Observed result |
|---|---|
| `python3 scripts/check-agent-docs.py`, before guard edits | Exit 0; 14 Markdown files, eight modules |
| Temporary-directory negative probe against original guard | Returned no errors despite two broken instruction/role links |
| `python3 scripts/test-check-agent-docs.py` | Exit 0; nine tests passed |
| `python3 scripts/check-agent-docs.py`, after guard edit | Exit 0; 19 documentation/instruction files, eight modules at that moment; count grows as other owners add linked reports |
| Integrated guard during concurrent documentation writes | Exit 1; detected links to pending `cog-174-architecture.md` and `cog-174-runtime.md`; coordinator must rerun after reports exist |
| `git diff --check -- scripts/check-agent-docs.py scripts/test-check-agent-docs.py docs/agent-readiness/checks.md docs/agent-readiness/cog-174-checks.md` | Exit 0; no whitespace diagnostics |

The nine regression cases cover valid local/image/reference/external destinations; broken inline/reference destinations; nested AGENTS and role links; relative resolution; fenced examples and generated-directory exclusion; missing required handoff; undocumented reactor modules; duplicate/undocumented environment names; and outside-repository paths including symlinks. Fixtures are isolated and removed by `TemporaryDirectory`; tests do not mutate the real checkout or copy credentials.

No Java, Docker, browser, external provider or remote CI execution is claimed by this thread. Final integrated counts, Maven baseline/final results and hosted checks are in the coordinator record. Rollback of this validation-only change means reverting the guard/test/docs plus the associated CI command together; application behavior and dependency versions remain unchanged.
