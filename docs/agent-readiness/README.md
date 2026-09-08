# Agent readiness

Start at [AGENTS.md](../../AGENTS.md), then use the document that owns your question. COG-173 audits and extends the existing COG-172 migration without changing application behavior or dependency versions. Start with the [current migration record](cog-173.md) for the baseline, full current inventory, gap matrix and thread ownership. COG-172 records remain historical evidence. Current execution status and observed limits are in [COG-173 evidence](cog-173.md) and [handoff](handoff.md); a documented command is not a claim it passed.

| Question / contract owner | Document |
|---|---|
| What exists, and what was examined? Coordinator | [Current inventory and gap matrix](cog-173.md) |
| Which app owns this flow/data/API? Architecture thread | [Architecture](architecture.md) |
| How do I install, configure and start? Runtime thread | [Setup and environment](setup.md) |
| What should I run for this change? Validation thread | [Checks and CI](checks.md) |
| How do I diagnose, stop, reset or release? Runtime thread | [Operations](operations.md) |
| Who may edit what, in what order? Coordinator | [Current migration plan and thread contracts](cog-173.md) |
| What actually ran? Coordinator | [Current validation evidence](cog-173.md) |
| Was the integrated result reviewed? Independent reviewer | [COG-173 independent review](review-cog-173.md) |
| How do I resume? Coordinator | [Handoff](handoff.md) |

These owners describe document responsibilities during this migration, not unverified organizational CODEOWNERS. Future changes should update the owning document together with the executable contract. Preserve the [existing design reference](../../design-system/README.md), [contribution policy](../../CONTRIBUTING.md) and runtime-provided WORKFLOW.md.

For a new coding task, start from the versioned [task prompt](task-prompt.md). Historical COG-172 records: [inventory](inventory.md), [plan](plan.md), [validation](validation.md), [review](review.md) and [handoff](handoff-cog-172.md). Their execution outcomes belong to that run.
