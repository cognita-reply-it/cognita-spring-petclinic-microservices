#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIN_JAVA_MAJOR=17

CHECK_ONLY=false
RUN_BUILD=true
RUN_TESTS=false
WITH_DOCKER=false

usage() {
  cat <<'EOF'
Usage: scripts/bootstrap.sh [options]

Prepare this repository after a fresh clone.

Options:
  --check-only     Only check prerequisites; do not install anything.
  --no-build       Do not run the Maven build verification step.
  --run-tests      Run the full Maven package phase with tests.
  --with-docker    Also install/check Docker tooling where supported.
  -h, --help       Show this help.

Notes:
  - Spring Boot is managed by Maven dependencies in this repository.
    No global Spring CLI installation is required.
  - Maven is provided by ./mvnw. No global Maven installation is required.
  - Docker is optional for the core local flow and required for docker compose.
EOF
}

log() {
  printf '\n==> %s\n' "$*"
}

warn() {
  printf 'WARN: %s\n' "$*" >&2
}

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --check-only)
        CHECK_ONLY=true
        ;;
      --no-build)
        RUN_BUILD=false
        ;;
      --run-tests)
        RUN_TESTS=true
        ;;
      --with-docker)
        WITH_DOCKER=true
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        fail "Unknown option: $1"
        ;;
    esac
    shift
  done
}

detect_os() {
  uname -s
}

java_major_version() {
  if ! command_exists java; then
    return 1
  fi

  local version
  version="$(java -version 2>&1 | awk -F '"' '/version/ {print $2; exit}')"
  if [[ -z "${version}" ]]; then
    return 1
  fi

  if [[ "${version}" == 1.* ]]; then
    printf '%s\n' "${version#1.}" | cut -d. -f1
  else
    printf '%s\n' "${version}" | cut -d. -f1
  fi
}

has_required_java() {
  local major
  major="$(java_major_version || true)"
  [[ -n "${major}" && "${major}" -ge "${MIN_JAVA_MAJOR}" ]]
}

set_java_home_if_possible() {
  if [[ "$(detect_os)" == "Darwin" ]] && [[ -x /usr/libexec/java_home ]]; then
    local java_home
    java_home="$(/usr/libexec/java_home -v "${MIN_JAVA_MAJOR}" 2>/dev/null || true)"
    if [[ -n "${java_home}" ]]; then
      export JAVA_HOME="${java_home}"
      export PATH="${JAVA_HOME}/bin:${PATH}"
      log "Using JAVA_HOME=${JAVA_HOME}"
    fi
  fi
}

install_java_macos() {
  if ! command_exists brew; then
    fail "Homebrew is required to install JDK ${MIN_JAVA_MAJOR} automatically on macOS. Install Homebrew first, then rerun this script."
  fi
  brew install --cask temurin@17
  set_java_home_if_possible
}

install_java_linux() {
  if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y openjdk-17-jdk
    return
  fi

  if command_exists dnf; then
    sudo dnf install -y java-17-openjdk-devel
    return
  fi

  if command_exists yum; then
    sudo yum install -y java-17-openjdk-devel
    return
  fi

  fail "Unsupported Linux package manager. Install JDK ${MIN_JAVA_MAJOR}+ manually and rerun this script."
}

ensure_java() {
  set_java_home_if_possible

  if has_required_java; then
    log "Java $(java_major_version) detected"
    return
  fi

  if [[ "${CHECK_ONLY}" == "true" ]]; then
    fail "JDK ${MIN_JAVA_MAJOR}+ is missing"
  fi

  log "Installing JDK ${MIN_JAVA_MAJOR}+"
  case "$(detect_os)" in
    Darwin)
      install_java_macos
      ;;
    Linux)
      install_java_linux
      ;;
    *)
      fail "Unsupported OS. Install JDK ${MIN_JAVA_MAJOR}+ manually."
      ;;
  esac

  has_required_java || fail "JDK installation completed, but java ${MIN_JAVA_MAJOR}+ is still not available on PATH"
}

ensure_maven_wrapper() {
  [[ -x "${ROOT_DIR}/mvnw" ]] || fail "Missing executable Maven wrapper at ${ROOT_DIR}/mvnw"
  log "Maven Wrapper detected"
}

install_docker_macos() {
  if ! command_exists brew; then
    fail "Homebrew is required to install Docker Desktop automatically on macOS."
  fi
  brew install --cask docker-desktop
  warn "Docker Desktop was installed. Start Docker Desktop manually before running docker compose."
}

install_docker_linux() {
  if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose-plugin
    return
  fi

  warn "Automatic Docker installation is only implemented for apt-based Linux. Install Docker manually for this OS."
}

ensure_docker() {
  if command_exists docker; then
    log "Docker CLI detected"
  elif [[ "${CHECK_ONLY}" == "true" ]]; then
    fail "Docker CLI is missing"
  else
    log "Installing Docker tooling"
    case "$(detect_os)" in
      Darwin)
        install_docker_macos
        ;;
      Linux)
        install_docker_linux
        ;;
      *)
        fail "Unsupported OS. Install Docker manually."
        ;;
    esac
  fi

  if command_exists docker && docker compose version >/dev/null 2>&1; then
    log "Docker Compose detected"
  else
    warn "Docker Compose is not currently available. Docker may need to be started or installed manually."
  fi
}

verify_build() {
  [[ "${RUN_BUILD}" == "true" ]] || return

  log "Running Maven build verification"
  if [[ "${RUN_TESTS}" == "true" ]]; then
    "${ROOT_DIR}/mvnw" -B package --file "${ROOT_DIR}/pom.xml"
  else
    "${ROOT_DIR}/mvnw" -B -DskipTests package --file "${ROOT_DIR}/pom.xml"
  fi
}

print_next_steps() {
  cat <<'EOF'

Bootstrap completed.

Next useful commands:
  ./mvnw -B package
  ./mvnw -pl spring-petclinic-config-server spring-boot:run
  ./mvnw -pl spring-petclinic-discovery-server spring-boot:run

Optional Docker flow:
  ./mvnw clean install -P buildDocker
  docker compose up
EOF
}

main() {
  parse_args "$@"

  log "Repository: ${ROOT_DIR}"
  ensure_java
  ensure_maven_wrapper

  if [[ "${WITH_DOCKER}" == "true" ]]; then
    ensure_docker
  fi

  verify_build
  print_next_steps
}

main "$@"
