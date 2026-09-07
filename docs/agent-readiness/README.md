# Agent readiness

Start at [AGENTS.md](../../AGENTS.md), then use the document that owns your question. COG-172 improves orientation and validation without changing application behavior or dependency versions. Execution status and observed limits are in [validation](validation.md) and [handoff](handoff.md); a documented command is not a claim it passed.

| Question / contract owner | Document |
|---|---|
| What exists, and what was examined? Coordinator | [Full inventory and gap matrix](inventory.md) |
| Which app owns this flow/data/API? Architecture thread | [Architecture](architecture.md) |
| How do I install, configure and start? Runtime thread | [Setup and environment](setup.md) |
| What should I run for this change? Validation thread | [Checks and CI](checks.md) |
| How do I diagnose, stop, reset or release? Runtime thread | [Operations](operations.md) |
| Who may edit what, in what order? Coordinator | [Migration plan and thread contracts](plan.md) |
| What actually ran? Coordinator | [Validation evidence](validation.md) |
| Was the integrated result reviewed? Independent reviewer | [Review](review.md) |
| How do I resume? Coordinator | [Handoff](handoff.md) |

These owners describe document responsibilities during this migration, not unverified organizational CODEOWNERS. Future changes should update the owning document together with the executable contract. Preserve the [existing design reference](../../design-system/README.md), [contribution policy](../../CONTRIBUTING.md) and runtime-provided WORKFLOW.md.
