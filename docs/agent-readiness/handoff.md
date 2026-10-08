# COG-172 handoff

## Objective and current state

Make this eight-application Spring Petclinic fork navigable and executable by a new collaborator using repository evidence, preserving application behavior. Initial clean HEAD: `f3b392c92580b740f4bafd0364b326e0bd1774f0`. Working branch: `codex/cog-172-agent-ready`. No pre-existing tracked changes; runtime-injected WORKFLOW.md preserved. Implementation and independent review are complete; local build and documentation gates pass. Integrated smoke is capacity-blocked (2 GiB worker; two OOM events). Publication status is recorded below and in the single Linear workpad.

## Decisions and ownership

See [plan](plan.md) for three exclusive specialist threads and the independent reviewer. The coordinator owns root contracts, inventory, evidence and delivery. Runtime roles under `.codex/agents` and design extraction assets remain unchanged. No dependencies, source behavior, database fixtures or production settings are changed. README inconsistencies about removed UI, upstream contribution target and the demo provider key were corrected against source.

## Checks and residual risks

[Validation](validation.md) is the exact command/result ledger; [inventory](inventory.md) links gaps to owners and completion evidence. Java was initially absent; a JDK was provisioned outside source for the baseline retry. Docker, provider and production checks remain separate limitations. External Config Git main and image tags float. Existing application limitations are recorded in [architecture](architecture.md), not silently repaired by this documentation task.

## Next step

At Human Review, assess the PR and disclosed environment limits. For integrated runtime verification, use a larger isolated worker with reviewed config revision and repeat the documented startup and read-only probes. Do not mark Done or deploy. Before resuming, inspect the current Git state and the single Linear Codex Workpad instead of assuming this snapshot describes later changes.

## Reusable handoff shape

For subsequent work record: objective and issue; branch/HEAD and preserved changes; current phase; decisions and file owners; files changed; command/environment/result for each check; failures and unexecuted checks; remaining risks; one concrete next step. Keep stable user preferences in user-owned guidance and temporary state here or in the workpad; do not rewrite runtime memory.

## File changes and rationale

Created `AGENTS.md` (operating contract), `.env.example` (source-matched secret-free template), `scripts/check-agent-docs.py` (offline drift guard), and all ten documents under `docs/agent-readiness`: README (index), inventory (217 baseline files and G01–G13 matrix), plan (ownership/dependencies), architecture (system contracts), setup (reproducible paths), operations (safe diagnosis/recovery), checks (test/CI matrix), validation (observed evidence), review (independent findings), handoff (continuity).

Modified root README (corrected orientation/commands), CONTRIBUTING and `.github/PULL_REQUEST_TEMPLATE.md` (fork delivery and honest validation), `.gitignore` (local environment/credential files), `.github/workflows/maven-build.yml` (wrapper and documentation gate). No files removed. All other tracked files, including Java, SQL, UI assets, POMs, Docker, design tokens and role definitions, are unchanged.

## Remaining boundaries and rollback

The matrix resolves G01–G07; G08–G10/G13 are examined and retained; G11–G12 are explicit environment/provider limitations. This means documentation migration is reviewable, not that every deployment path is certified. No data/schema migration or dependency change requires rollback; revert the migration commit(s) through ordinary reviewed Git revert if needed, preserving later changes. Do not reset data or execute the destructive legacy launcher to undo documentation.

## Delivery snapshot — 2026-09-07

Implementation commit: `96cd8675e3dd59e60036536191567d3359e3a59e`, pushed to `origin/codex/cog-172-agent-ready`. [Draft PR #29](https://github.com/cognita-reply-it/cognita-spring-petclinic-microservices/pull/29) is open against this fork's `main`, labeled `maestro`, and attached to [COG-172](https://linear.app/cognita-reply/issue/COG-172/migra-il-repository-in-un-repo-agent-like). This handoff update is a subsequent documentation commit; use `git log` for the current delivery HEAD.

First PR poll: build (17) and triage-pr in progress; stale-incomplete job skipped; no comments/reviews visible. These are observed pending checks, not a green CI claim. Final poll and exact final commit/state are recorded in the single Linear `## Codex Workpad` to avoid self-referential commits. Target handoff state is Human Review; do not implement further work unless review feedback requires rework, and do not mark Done before merge.

Local acceptance: nine Java tests pass, offline documentation/structure/env checks pass, independent technical findings are closed. Remaining blocker brief: sustained multi-service HTTP validation requires more than this worker's observed 2 GiB capacity; Docker/MySQL/provider/browser/production paths remain unverified. All smoke-owned JVMs were confirmed stopped. No application behavior or production changes were made.
