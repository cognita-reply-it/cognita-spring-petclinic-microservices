# Bootstrap From Fresh Clone

This repository is meant to be runnable after a fresh clone with a small local setup step.

The core application does not require a global Spring installation. Spring Boot and Spring Cloud are pulled by Maven from the project `pom.xml` files. Maven itself is provided by the checked-in Maven Wrapper (`./mvnw`).

## Windows Quick Start

From a PowerShell terminal opened in the repository root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\bootstrap.ps1
```

The Windows bootstrap script checks or prepares:

- JDK 17 or newer;
- the Maven Wrapper (`mvnw.cmd`);
- Docker Desktop and Docker Compose;
- an optional Maven build verification.

To only check the machine without installing anything:

```powershell
.\scripts\bootstrap.ps1 -CheckOnly -NoBuild
```

To skip Docker installation/checks and prepare only the Java/Maven path:

```powershell
.\scripts\bootstrap.ps1 -SkipDocker
```

The script uses `winget` for automatic Windows installation. If `winget` is not available, install Eclipse Temurin JDK 17 and Docker Desktop manually, then rerun the script.

## macOS / Linux Quick Start

From the repository root:

```bash
scripts/bootstrap.sh
```

The script checks or prepares:

- JDK 17 or newer;
- the Maven Wrapper;
- an optional Maven build verification.

To only check the machine without installing anything:

```bash
scripts/bootstrap.sh --check-only --no-build
```

To include Docker tooling checks or installation where supported:

```bash
scripts/bootstrap.sh --with-docker
```

## What The Script Installs

On Windows, `scripts/bootstrap.ps1` installs Eclipse Temurin JDK 17 and Docker Desktop through `winget` when they are missing.

On macOS, `scripts/bootstrap.sh` installs Eclipse Temurin JDK 17 through Homebrew when Java is missing.

On Debian/Ubuntu Linux, `scripts/bootstrap.sh` installs `openjdk-17-jdk` through `apt-get`.

On Fedora/RHEL-like Linux, `scripts/bootstrap.sh` installs `java-17-openjdk-devel` through `dnf` or `yum`.

Docker is installed or checked by default on Windows. Use `-SkipDocker` if you only want the basic Java/Maven flow.

On macOS/Linux, Docker remains optional and is installed only when the Docker flag is passed.

On Windows and macOS, Docker Desktop still has to be started manually after installation.

## What The Script Does Not Install

- No global Spring Boot CLI. The project uses Maven-managed Spring dependencies.
- No global Maven. The project uses `./mvnw`.
- No MySQL by default. The default development database is in-memory HSQLDB.
- No OpenAI or Azure credentials. GenAI runtime features require user-provided environment variables.

## Build Modes

Default Windows bootstrap build:

```powershell
.\scripts\bootstrap.ps1
```

Runs:

```powershell
.\mvnw.cmd -B -DskipTests package --file pom.xml
```

Full Windows build with tests:

```powershell
.\scripts\bootstrap.ps1 -RunTests
```

No Windows build:

```powershell
.\scripts\bootstrap.ps1 -NoBuild
```

Windows Java/Maven only, without Docker:

```powershell
.\scripts\bootstrap.ps1 -SkipDocker
```

Default macOS/Linux bootstrap build:

```bash
scripts/bootstrap.sh
```

Runs:

```bash
./mvnw -B -DskipTests package --file pom.xml
```

Full build with tests:

```bash
scripts/bootstrap.sh --run-tests
```

No build:

```bash
scripts/bootstrap.sh --no-build
```

## Running Services Locally

The supporting services must start first:

Windows:

```powershell
.\mvnw.cmd -pl spring-petclinic-config-server spring-boot:run
.\mvnw.cmd -pl spring-petclinic-discovery-server spring-boot:run
```

macOS/Linux:

```bash
./mvnw -pl spring-petclinic-config-server spring-boot:run
./mvnw -pl spring-petclinic-discovery-server spring-boot:run
```

Then start the application services:

Windows:

```powershell
.\mvnw.cmd -pl spring-petclinic-customers-service spring-boot:run
.\mvnw.cmd -pl spring-petclinic-vets-service spring-boot:run
.\mvnw.cmd -pl spring-petclinic-visits-service spring-boot:run
.\mvnw.cmd -pl spring-petclinic-api-gateway spring-boot:run
```

macOS/Linux:

```bash
./mvnw -pl spring-petclinic-customers-service spring-boot:run
./mvnw -pl spring-petclinic-vets-service spring-boot:run
./mvnw -pl spring-petclinic-visits-service spring-boot:run
./mvnw -pl spring-petclinic-api-gateway spring-boot:run
```

Useful URLs:

- API Gateway / UI: http://localhost:8080
- Config Server: http://localhost:8888
- Eureka Discovery Server: http://localhost:8761

## Docker Flow

Docker is useful for running the complete stack, including optional observability services:

Windows:

```powershell
.\scripts\bootstrap.ps1 -NoBuild
.\mvnw.cmd clean install -P buildDocker
docker compose up
```

macOS/Linux:

```bash
scripts/bootstrap.sh --with-docker --no-build
./mvnw clean install -P buildDocker
docker compose up
```

Docker is not required for the basic local Java flow.
