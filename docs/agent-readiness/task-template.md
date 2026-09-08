# Reusable repository task prompt

Use this template after reading [AGENTS.md](../../AGENTS.md), the injected workflow when present and [the index](README.md). Replace the fields with verified facts before delegating or editing; this prompt grants no additional permissions or runtime capabilities. Existing versioned role specifications remain under [.codex/agents](../../.codex/agents).

```text
Objective and acceptance evidence:
- Issue / requested outcome:
- Behavior to preserve and explicit exclusions:
- Observable completion criteria:

Starting evidence:
- Selected checkout, branch, HEAD, remote and existing changes:
- Applicable root and nested instructions:
- Relevant source, configuration and tests (paths):
- KG freshness, search and connected context, or precise unavailable capability:
- Baseline command, environment, exit result and evidence:

Execution contract:
- Exclusive owned files/directories:
- Allowed reads and forbidden writes:
- Shared APIs/data/configuration, dependencies and other owners:
- Changes requiring coordination or explicit authorization:
- Available tools/roles actually discovered:
- Validation commands chosen from checks.md:

Handoff:
- Changes and rationale, preserved work:
- Checks actually run and results; unexecuted checks and why:
- Findings, failures, limitations and residual risk:
- Commit/PR/workpad when required by workflow:
- Next concrete step and owner:
```

For a Java change, locate the owning module in [architecture](architecture.md), read its POM and source/tests, then choose its focused Maven command from [checks](checks.md). For a runtime or environment change, include [setup](setup.md) and [operations](operations.md). A thread that needs a file owned by another thread sends the proposed change to that owner. Keep Maven builds serial in the shared checkout. Record failed checks without converting them into successful evidence; do not write credentials or runtime configuration into the task prompt.
