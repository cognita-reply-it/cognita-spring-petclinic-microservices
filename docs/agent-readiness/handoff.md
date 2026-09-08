# COG-173 handoff

## Objective and current state

Audit and complete the existing agent-ready migration while preserving application behavior. Examined clean `main` at `ad874c63673aaf6d1407ff359703481e85f473f4`, synchronized with origin on 2026-09-08. Delivery branch: `codex/cog-173-agent-ready`. Work occurs in the active Maestro checkout `/opt/project/workspaces/COG-173`; separate canonical-mirror untracked work is untouched. The [current migration record](cog-173.md) owns the 230-file baseline inventory, current gap matrix, thread contracts and validation ledger. The [COG-172 handoff](handoff-cog-172.md) is preserved as historical evidence, not current PR status.

## Decisions and files

Reuse existing instructions, module/flow map, setup, operations, checks, roles and design provenance. Three specialists own architecture/task prompt, runtime documentation, and validation guard/tests/CI respectively; coordinator integrates continuity records. No Java, SQL, UI, POM, deployment, authorization or runtime credentials are changed. No extra tracker issue is created. Reviewable task prompts complement AGENTS; they do not register unavailable runtime roles.

## Checks, failures and risks

Initial documentation baseline passed (13 Markdown files, 8 modules). Initial Maven invocation failed before execution because no JDK was selected; an existing Temurin 17 aarch64 installation was subsequently verified outside PATH and completed the clean package build with 9 tests, zero failures/errors/skips. Newly observed outcomes and exact commands belong in the current migration record, separate from COG-172 evidence. Docker, provider and production results cannot be inferred from a local package build. External Config Git and image tags remain floating inputs; demo SQL and chaos scripts retain their documented boundaries.

## Next step and resumption

Current phase: implementation and independent review complete; reviewed branch pushed and draft PR opened. The reviewer found no blocking defect; R1 (historical-navigation links) was corrected by the architecture owner and rechecked. Final guard passes 20 Markdown documents/eight modules; all 11 guard regressions and staged whitespace check pass. Inspect Git status, this record and the single COG-173 Linear Codex Workpad before resuming. Leave the implementation in Human Review after the workpad is current and wait for explicit review/merge routing; never mark Done from implementation. Do not assume previous services are running or credentials available.

## Reusable handoff shape

Record objective/issue; branch and HEAD; preserved changes; phase; decisions and exclusive file owners; changed files; exact command/environment/exit/result; failed and unexecuted paths with impact; residual risks; one concrete next step. Keep stable preferences in user-owned guidance and temporary progress here or in the workpad. Do not rewrite runtime memory.

## Compatibility and rollback

This migration changes development guidance and its validation only. Review/revert the responsible COG-173 commit through ordinary Git revert if needed, preserving subsequent concurrent changes. No database reset, registry publication, deploy or dependency rollback is needed. Existing source-level limitations remain documented and require separately scoped behavior work.

## Delivery snapshot — 2026-09-08

Implementation commit `baab9bbe062e3593cb56b8cff56ca18a3dbf0ed4` is pushed on `codex/cog-173-agent-ready`. [Draft PR #30](https://github.com/cognita-reply-it/cognita-spring-petclinic-microservices/pull/30) targets `main`, has the `maestro` label, and is attached to [COG-173](https://linear.app/cognita-reply/issue/COG-173/migra-il-repository-in-un-repo-agent-like). This delivery snapshot is a subsequent documentation commit; the exact final HEAD and Linear transition are recorded in the single Codex Workpad to avoid self-referential commits.

First observed PR poll: Java build and metadata triage in progress, stale-incomplete job skipped; no comments or reviews. That is not a green CI or deployment claim. The final post-push check/review poll belongs to the workpad. Local acceptance: 9 Java tests and 11 guard tests pass, 20-document/eight-module guard passes, independent review has no open findings. No task-owned app processes or containers were started.

Remaining limits: Docker/Podman unavailable; no MySQL/provider/production run; distributed/browser smoke not repeated in this 2 GiB worker. Use the documented prerequisites and an isolated suitable environment to close runtime evidence gaps. These limits do not prevent reviewing this guidance/guard change. No user decision is required for the delivered scope; merge/deploy remain separate workflow actions.
