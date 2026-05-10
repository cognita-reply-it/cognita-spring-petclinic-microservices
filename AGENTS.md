# Repository Agent Contract

Read these files before editing:

- `README.md` for the service map, local startup modes, database defaults and optional components.
- `pom.xml` plus the affected module `pom.xml` before backend, gateway, frontend asset or GenAI dependency changes.
- `docker-compose.yml` before changing container startup, fixed ports, service dependencies or observability services.
- `docs/BOOTSTRAP.md` before changing bootstrap or developer setup flows.

Area boundaries:

- Frontend: legacy AngularJS, static assets, templates, styles and the chat widget served from `spring-petclinic-api-gateway/src/main/resources/static`.
- Backend: Java, Spring Boot, Gateway, REST, persistence and tests under the `spring-petclinic-*` Maven modules.
- Observability and runtime: Docker Compose, `docker/`, `scripts/`, Zipkin, Grafana, Prometheus and Spring Boot Admin.
- GenAI: `spring-petclinic-genai-service` plus the gateway chat widget at `spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js`.

Repository rules:

- Treat `spring-petclinic-api-gateway` as both API Gateway and frontend host.
- Treat `spring-petclinic-config-server` and `spring-petclinic-discovery-server` as required support services for the normal local Java flow.
- Treat Zipkin, Grafana, Prometheus, Spring Boot Admin and external GenAI provider credentials as optional unless the task explicitly depends on them.
- Do not invent owners, pets, vets, visits, AI responses, endpoints or runtime behavior. Use existing seed data or clearly declared test fixtures.
- Default local data work to the HSQLDB in-memory setup documented by the README.
- Use MySQL only when the task explicitly asks for persistence or `mysql` profile behavior.
- Use Docker only when the task needs the full stack, container behavior, fixed Compose ports or observability components.
- If an API contract, UI contract, startup contract or operator workflow changes, update the matching repository documentation.

Validation expectations:

- Backend changes: run the narrowest Maven test slice that proves the change, usually `./mvnw -pl <module> test` from the repository root.
- Frontend changes: verify the affected UI flow with Playwright when the app can be started. If browser verification is blocked, state the blocker and the static checks performed.
- Documentation-only changes: validate by checking consistency against `README.md`, `pom.xml`, relevant module POMs and `docker-compose.yml`; do not claim runtime verification unless it was actually run.

Final reporting:

- List changed files.
- State validation performed.
- Call out any unverified runtime-dependent areas, especially Docker, observability and provider-backed GenAI flows.
