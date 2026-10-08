# Operations, diagnosis and recovery

Owner: runtime thread for COG-172. This is a local demonstration runbook, not a production deployment procedure. Start with [setup](setup.md); use [checks](checks.md) for gates and [validation](validation.md) for actual observed outcomes. No deployed environment or provider account was exercised by this documentation thread.

## Readiness and diagnosis

For the explicit local ports in setup, these read-only probes are useful after services start:

```sh
curl --fail --silent --show-error http://localhost:8761/actuator/health
curl --fail --silent --show-error http://localhost:8080/actuator/health
curl --fail --silent --show-error http://localhost:8080/api/customer/owners
curl --fail --silent --show-error http://localhost:8080/api/vet/vets
```

Config Server has no Actuator dependency in its POM: `/actuator/health` can match its configuration route and return HTTP 200 with an Environment document, not health. Validate a known configuration semantically without printing values:

```sh
python3 - <<'PY'
import json
import urllib.request
with urllib.request.urlopen("http://localhost:8888/customers-service/default", timeout=10) as response:
    assert response.status == 200
    document = json.load(response)
assert document.get("name") == "customers-service"
assert "default" in document.get("profiles", [])
sources = document.get("propertySources")
assert isinstance(sources, list) and sources, "No configuration property sources"
print("Config semantic probe PASS; propertySources:", len(sources))
PY
```

This checks resolution of one known application/profile without logging property values; it does not establish correctness of every service/profile or datasource. For the other applications, a health response must report `UP`, not merely HTTP success; configured exposure and access can differ with external profiles. Apply `/actuator/health` to each remaining app's selected port (8081–8084 and 9090) when available. A 404/401 is an exposure/access diagnosis, not proof that the business service is unavailable. For Discovery also inspect registered instances at `http://localhost:8761/`. For Gateway open `http://localhost:8080/` and verify owner list/detail and vets browsing against synthetic fixtures. Use an actual returned owner/pet ID for the corresponding detail/visit read; do not assume IDs. Record status, semantic result, profile, config commit and environment. Do not paste real owner data into tickets.

Config root success alone does not verify that client configuration was resolved. The COG-172 packaged native smoke observed `/actuator/health` return an Environment document and `/customers-service/default` return two property sources; this is configuration resolution evidence only. Inspect Config/client startup logs for the requested application/profile/label and the expected reviewed repository commit. Config's environment endpoints may disclose datasource or provider settings; do not log their bodies into shared artifacts. Registry registration alone does not prove downstream HTTP routes work. Chat needs an authorized provider and may mutate owner/pet data through tools; it is outside the default read-only smoke.

For a Compose run you own, diagnostics are:

```sh
docker compose ps
docker compose logs --tail=100 config-server discovery-server
docker compose logs --tail=100 api-gateway customers-service visits-service vets-service
```

Review logs privately before sharing: credentials, user data and GenAI prompts/responses can appear. Avoid printing `docker compose config` with real credentials; use `docker compose config --quiet` to validate without rendered secret values. The checked-in Config healthcheck uses `curl -I` without `--fail`, which can regard an HTTP error as a successful connection; most app containers have no healthcheck. Thus Compose ordering and a running container do not establish full readiness. Wait for the business probes above. See [Compose startup semantics](https://docs.docker.com/reference/cli/docker/compose/up/).

| Symptom | First checks |
|---|---|
| Wrapper fails before Maven starts | JDK 17 installed, `JAVA_HOME` valid, `java -version`; then `./mvnw -version` |
| Artifact resolution fails | Exact coordinate and Maven repository response; proxy/network and milestone availability; retain error without auth |
| Config unavailable / missing property | External Git reachability, reviewed config revision, native directory and selected profiles |
| Port collision | Confirm which process/container owns the explicit local port; stop only your own process or coordinate a port change |
| Gateway returns fallback/503 | Config, Eureka registration and advertised host/port; direct domain health; allow registry convergence |
| Database startup/data failure | Effective local JDBC target and SQL initialization; check fixture schema compatibility before any reset |
| Chat fails | Enabled starter, credentials from approved source, provider/model access, Vets availability and vector-store loading; do not retry paid operations blindly |
| Metrics absent | `/actuator/prometheus` exposure and Prometheus targets; do not assume a healthy UI means successful scraping |

## Monitoring boundaries

[Compose](../../docker-compose.yml) exposes Zipkin at 9411, Admin at 9090, Grafana at host 3030 and Prometheus at host 9091. [Prometheus configuration](../../docker/prometheus/prometheus.yml) targets Docker DNS names for Gateway, Customers, Visits and Vets, plus itself. It does not scrape GenAI, Config, Discovery or Admin. The mixed host-Java launcher does not supply an alternative scrape configuration, so do not claim its monitoring path works without verifying container-to-host resolution. Grafana's [configuration](../../docker/grafana/grafana.ini) enables anonymous access; these sample interfaces must remain inside the intended local boundary. Compose port mappings do not bind exclusively to loopback. Do not expose them on public infrastructure as part of an agent task.

Java foreground output goes to the terminal; Maven reports are in each module's target directory. Managed worker logs go under `/opt/project/logs`, not into source or Linear. The existing launcher instead writes `target/*.log`; preserve relevant logs before `mvn clean`. There is no established production alerting, backup schedule, deployment inventory or recovery-time guarantee in this repository.

## Safe shutdown, reset and rollback

Stop foreground Java processes with Ctrl-C in their own terminal. For detached processes, identify the exact PID owned by this run before sending a normal termination signal; never kill by a broad name match. A dedicated local Compose stack can be stopped with `docker compose stop`. Fixed `container_name` values and published ports in this file mean a different project name alone cannot safely run multiple copies on one host.

On an explicitly disposable stack you own, `docker compose down` removes its containers/network; it is not a database backup or safe reset for retained data. Do not add volume/image deletion flags. See [Compose down documentation](https://docs.docker.com/reference/cli/docker/compose/down/). In-memory data disappears when its process stops; restarting may reseed only when effective configuration enables it. MySQL reset requires confirmation of the exact datasource, retention decision and a tested backup/restore path; the bundled SQL is demo initialization, not rollback migrations.

A failed local change should be reverted with a normal reviewed Git revert of the responsible commit, preserving concurrent work; rebuild and rerun the relevant gates. This migration changes documentation, guardrails and CI gates only, so it needs no database rollback. For application release rollback, use a known recorded image digest and matching configuration revision through the actual environment owner's process; this repository does not define that process or establish a last-known-good release. A floating `latest` tag is not sufficient evidence of recoverability.

## Restricted existing scripts and release boundary

- [run_all.sh](../../scripts/run_all.sh) uses `pkill -9 -f spring-petclinic`, `docker compose kill`, fixed sleeps, background wildcard JAR starts and the `chaos-monkey` profile. It can terminate unrelated matching processes. It is retained for compatibility and must not be the default bootstrap on a shared worker. Use setup's foreground commands.
- [Chaos scripts](../../scripts/chaos/README.md) deliberately inject latency, exceptions, memory pressure and application termination. They send state-changing actuator requests to local domain services. Run only in an explicitly authorized isolated experiment; record restoration steps and verify normal behavior afterward.
- [tagImages.sh](../../scripts/tagImages.sh) changes local image tags using `REPOSITORY_PREFIX` and `VERSION`; [pushImages.sh](../../scripts/pushImages.sh) publishes all eight images to a registry. These scripts do not establish that tests passed or that the target/tag is correct. Confirm intended repository and immutable version before an authorized release. Do not execute publishing or set `container.build.extraarg=--push` as validation.
- Maven's `buildDocker` profile builds images during `install`. Its ordinary `--load` default is local. CI build success, image creation, registry push and successful deployment are separate claims. There is no deployment/migration stage in the checked-in Maven workflow; do not invent one.

For handoff, include exact code/config revisions, changed files, process/container ownership, checks and unresolved failures. Use the [handoff](handoff.md) to resume without assuming services are still running or secrets remain available.
