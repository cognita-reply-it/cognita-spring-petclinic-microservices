# Agent readiness

Start at [AGENTS.md](../../AGENTS.md), then use the document that owns your question. COG-172 established these contracts; [COG-174](cog-174.md) audits the current repository and records its inventory, ownership, evidence and handoff. Historical [COG-172 validation](validation.md) remains dated evidence, not a new execution. A documented command is not a claim it passed.

| Question / contract owner | Document |
|---|---|
| What exists, and what was examined? Coordinator | [Current inventory, gap matrix and execution](cog-174.md); [COG-172 baseline inventory](inventory.md) |
| Which app owns this flow/data/API? Architecture thread | [Architecture](architecture.md); [current source audit](cog-174-architecture.md) |
| How do I install, configure and start? Runtime thread | [Setup and environment](setup.md); [current runtime audit](cog-174-runtime.md) |
| What should I run for this change? Validation thread | [Checks and CI](checks.md); [current validation audit](cog-174-checks.md) |
| How do I diagnose, stop, reset or release? Runtime thread | [Operations](operations.md) |
| Who may edit what, in what order? Coordinator | [Current thread contracts](cog-174.md); [COG-172 plan](plan.md) |
| What actually ran? Coordinator | [Current evidence](cog-174.md); [COG-172 evidence](validation.md) |
| Was the integrated result reviewed? Independent reviewer | [Current independent review](cog-174-review.md); [COG-172 review](review.md) |
| How do I resume? Coordinator | [Handoff](handoff.md) and [reusable task prompt](task-template.md) |

These owners describe document responsibilities during this migration, not unverified organizational CODEOWNERS. Future changes should update the owning document together with the executable contract. Preserve the [existing design reference](../../design-system/README.md), [contribution policy](../../CONTRIBUTING.md) and runtime-provided WORKFLOW.md.

The dated manifests are evidence snapshots. When adding a reactor module, update the module coverage in `inventory.md` and `architecture.md` (the guard's two module contracts) without rewriting the historical manifest; record the new snapshot in the current task artifact.
