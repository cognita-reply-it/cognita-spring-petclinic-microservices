# COG-173 handoff

## Objective and current state

Audit and complete the existing agent-ready migration while preserving application behavior. Examined clean `main` at `ad874c63673aaf6d1407ff359703481e85f473f4`, synchronized with origin on 2026-09-08. Delivery branch: `codex/cog-173-agent-ready`. Work occurs in the active Maestro checkout `/opt/project/workspaces/COG-173`; separate canonical-mirror untracked work is untouched. The [current migration record](cog-173.md) owns the 230-file baseline inventory, current gap matrix, thread contracts and validation ledger. The [COG-172 handoff](handoff-cog-172.md) is preserved as historical evidence, not current PR status.

## Decisions and files

Reuse existing instructions, module/flow map, setup, operations, checks, roles and design provenance. Three specialists own architecture/task prompt, runtime documentation, and validation guard/tests/CI respectively; coordinator integrates continuity records. No Java, SQL, UI, POM, deployment, authorization or runtime credentials are changed. No extra tracker issue is created. Reviewable task prompts complement AGENTS; they do not register unavailable runtime roles.

## Checks, failures and risks

Initial documentation baseline passed (13 Markdown files, 8 modules). Initial Maven invocation failed before execution because no JDK was selected; an existing Temurin 17 aarch64 installation was subsequently verified outside PATH and completed the clean package build with 9 tests, zero failures/errors/skips. Newly observed outcomes and exact commands belong in the current migration record, separate from COG-172 evidence. Docker, provider and production results cannot be inferred from a local package build. External Config Git and image tags remain floating inputs; demo SQL and chaos scripts retain their documented boundaries.

## Next step and resumption

Current phase: implementation and independent review complete; publish the reviewed branch. The reviewer found no blocking defect; R1 (historical-navigation links) was corrected by the architecture owner and rechecked. Final guard passes 20 Markdown documents/eight modules; all 11 guard regressions and staged whitespace check pass. Inspect Git status, this record and the single COG-173 Linear Codex Workpad before resuming. After publication, leave the implementation in Human Review and wait for explicit review/merge routing; never mark Done from implementation. Do not assume previous services are running or credentials available.

## Reusable handoff shape

Record objective/issue; branch and HEAD; preserved changes; phase; decisions and exclusive file owners; changed files; exact command/environment/exit/result; failed and unexecuted paths with impact; residual risks; one concrete next step. Keep stable preferences in user-owned guidance and temporary progress here or in the workpad. Do not rewrite runtime memory.

## Compatibility and rollback

This migration changes development guidance and its validation only. Review/revert the responsible COG-173 commit through ordinary Git revert if needed, preserving subsequent concurrent changes. No database reset, registry publication, deploy or dependency rollback is needed. Existing source-level limitations remain documented and require separately scoped behavior work.
