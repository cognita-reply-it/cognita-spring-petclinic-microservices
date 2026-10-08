# Migration plan and ownership

Coordinator owns AGENTS.md, README.md, CONTRIBUTING.md, .github/PULL_REQUEST_TEMPLATE.md and docs/agent-readiness/{README,inventory,plan,validation,handoff}.md. All other writes require assignment. No application source, dependency, data, deployment or role configuration changes are planned.

After whole-repository inventory, three specialist work threads plus one independent reviewer are assigned below. All may read the whole selected checkout and read KG context; all must read local instructions. No thread may revert another writer, commit, push, change Linear, or write outside its exclusive list. Runtime logs go under /opt/project/logs/cog-172. Shared interfaces: relative links from this directory; English durable docs; exact commands with observed/unexecuted distinction; existing versions retained. Escalate cross-owned fixes to coordinator.

| Thread | Exclusive writes | Objective / deliverable | Inputs / dependencies | Validation / exit |
|---|---|---|---|---|
| architecture | docs/agent-readiness/architecture.md | All 8 apps, routes, main flows, data and trust boundaries, ownership and test references | Inventory, POMs, all application sources/config/tests; root contract | Verify every source link and coverage; report gaps |
| runtime | docs/agent-readiness/setup.md, docs/agent-readiness/operations.md, .env.example, .gitignore | Reproducible minimum path per app, env provenance, safe reset/diagnosis/release boundaries | Inventory; external config boundary; architecture route references | Static env consistency; attempt available harmless setup checks; report blockers |
| validation | docs/agent-readiness/checks.md, scripts/check-agent-docs.py, .github/workflows/maven-build.yml | Exact test/build/CI matrix and dependency-free documentation guard | Existing workflow/POM/test definitions, coordinator index and AGENTS | Run guard after integration; official documentation before workflow change |
| reviewer | docs/agent-readiness/review.md only | Independent review of all other authors' changes | Integrated diff and actual validation evidence | Report severity/source; owners fix; recheck findings |

Sequence: inventory and baseline → shared root contract → three independent writers → integrate and targeted validation → independent review → owner fixes and relevant reruns → commit/push/PR/check poll → Linear Human Review. Reviewer starts after integration and has authored none of the examined files. No extra Linear issues.
