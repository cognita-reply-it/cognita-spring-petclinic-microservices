# Contributing to Spring PetClinic Microservices

Thank you for your interest in contributing!

## ⚠️ Are you a student or course participant?

This repository is widely used as a **training exercise** in DevOps, cloud, and Java courses.  
If you forked this repo as part of a course, bootcamp, or homework assignment:

- **Your changes belong in your own fork**, not here.
- Pull Requests that are part of a course assignment (CI pipelines, Kubernetes manifests, monitoring additions, etc.) will be labelled `invalid` and **closed without review**.
- This is not personal. It is simply not the scope of this project.

## What we accept

- Bug fixes with a linked issue
- Dependency upgrades (Spring Boot, Spring Cloud ...)
- Documentation improvements
- Features discussed and agreed upon in an issue first

## What we do NOT accept

- Course assignments or homework submissions
- PRs adding Jenkins/GitLab CI, ECR pipelines, or cloud-specific infrastructure for educational purposes
- PRs that duplicate already-open contributions
- Changes without tests

## How to contribute

1. Discuss scope in the existing Linear issue for Maestro work; do not create a second external work unit. Other contributions should discuss scope in an issue first.
2. In the selected checkout, create the workflow branch (`codex/<issue>-<slug>` for Maestro). PRs target `main` in `cognita-reply-it/cognita-spring-petclinic-microservices`.
3. Make your changes and add tests if applicable.
4. Run the test suite: `./mvnw test`
5. Open a Pull Request using the provided template and fill it out completely.

## Reporting a bug

Open an issue with:
- A clear description of the bug
- Steps to reproduce
- Expected vs actual behaviour
- Spring Boot / Java version

## Agent and validation guidance

Read [AGENTS.md](AGENTS.md) and the [agent-readiness index](docs/agent-readiness/README.md). Follow injected WORKFLOW.md when present. Record actual checks and blockers; documentation-only changes use the documentation guard and relevant checks without claiming unexecuted application tests passed. Retain Description, Type of change and Checklist headings as the repository template convention. Automated triage checks body completeness and checkbox state; headings alone do not satisfy it.
