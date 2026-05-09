param(
    [switch]$CheckOnly,
    [switch]$NoBuild,
    [switch]$RunTests,
    [switch]$WithDocker,
    [switch]$SkipDocker
)

$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$MinJavaMajor = 17

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message"
}

function Write-WarningLine {
    param([string]$Message)
    Write-Warning $Message
}

function Get-JavaMajorVersion {
    $java = Get-Command java -ErrorAction SilentlyContinue
    if (-not $java) {
        return $null
    }

    $versionOutput = & java -version 2>&1
    $versionLine = $versionOutput | Where-Object { $_ -match 'version "' } | Select-Object -First 1
    if (-not $versionLine) {
        return $null
    }

    $version = [regex]::Match($versionLine, 'version "([^"]+)"').Groups[1].Value
    if (-not $version) {
        return $null
    }

    if ($version.StartsWith("1.")) {
        return [int]($version.Split(".")[1])
    }

    return [int]($version.Split(".")[0])
}

function Find-Jdk17Home {
    $candidates = @()

    if ($env:ProgramFiles) {
        $candidates += Get-ChildItem -Path (Join-Path $env:ProgramFiles "Eclipse Adoptium") -Directory -Filter "jdk-17*" -ErrorAction SilentlyContinue
        $candidates += Get-ChildItem -Path (Join-Path $env:ProgramFiles "Java") -Directory -Filter "jdk-17*" -ErrorAction SilentlyContinue
    }

    $selected = $candidates | Sort-Object FullName -Descending | Select-Object -First 1
    if ($selected) {
        return $selected.FullName
    }

    return $null
}

function Refresh-JavaPath {
    $jdkHome = Find-Jdk17Home
    if (-not $jdkHome) {
        return
    }

    $env:JAVA_HOME = $jdkHome
    $env:Path = "$jdkHome\bin;$env:Path"
    Write-Step "Using JAVA_HOME=$jdkHome"
}

function Install-Java {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "winget is required for automatic Windows setup. Install JDK $MinJavaMajor manually, then rerun this script."
    }

    Write-Step "Installing Eclipse Temurin JDK $MinJavaMajor with winget"
    winget install --id EclipseAdoptium.Temurin.17.JDK --exact --source winget --accept-package-agreements --accept-source-agreements
    Refresh-JavaPath
}

function Ensure-Java {
    Refresh-JavaPath

    $major = Get-JavaMajorVersion
    if ($major -and $major -ge $MinJavaMajor) {
        Write-Step "Java $major detected"
        return
    }

    if ($CheckOnly) {
        throw "JDK $MinJavaMajor+ is missing"
    }

    Install-Java

    $major = Get-JavaMajorVersion
    if (-not $major -or $major -lt $MinJavaMajor) {
        throw "JDK installation completed, but java $MinJavaMajor+ is still not available. Open a new PowerShell terminal and rerun .\scripts\bootstrap.ps1 -CheckOnly."
    }
}

function Ensure-MavenWrapper {
    $mvnw = Join-Path $RootDir "mvnw.cmd"
    if (-not (Test-Path $mvnw)) {
        throw "Missing Maven Wrapper: $mvnw"
    }

    Write-Step "Maven Wrapper detected"
}

function Install-Docker {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "winget is required for automatic Docker Desktop installation."
    }

    Write-Step "Installing Docker Desktop with winget"
    winget install --id Docker.DockerDesktop --exact --source winget --accept-package-agreements --accept-source-agreements
    Write-WarningLine "Docker Desktop was installed. Start Docker Desktop manually before running docker compose."
}

function Ensure-Docker {
    $docker = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $docker) {
        if ($CheckOnly) {
            throw "Docker CLI is missing"
        }

        Install-Docker
    } else {
        Write-Step "Docker CLI detected"
    }

    $composeWorks = $false
    try {
        docker compose version *> $null
        $composeWorks = $true
    } catch {
        $composeWorks = $false
    }

    if ($composeWorks) {
        Write-Step "Docker Compose detected"
    } else {
        Write-WarningLine "Docker Compose is not currently available. Docker Desktop may need to be started."
    }
}

function Invoke-Build {
    if ($NoBuild) {
        return
    }

    $mvnw = Join-Path $RootDir "mvnw.cmd"
    Write-Step "Running Maven build verification"

    if ($RunTests) {
        & $mvnw -B package --file (Join-Path $RootDir "pom.xml")
    } else {
        & $mvnw -B -DskipTests package --file (Join-Path $RootDir "pom.xml")
    }
}

function Write-NextSteps {
    Write-Host ""
    Write-Host "Bootstrap completed."
    Write-Host ""
    Write-Host "Next useful commands:"
    Write-Host "  .\mvnw.cmd -B package"
    Write-Host "  .\mvnw.cmd -pl spring-petclinic-config-server spring-boot:run"
    Write-Host "  .\mvnw.cmd -pl spring-petclinic-discovery-server spring-boot:run"
    Write-Host ""
    Write-Host "Docker flow:"
    Write-Host "  .\mvnw.cmd clean install -P buildDocker"
    Write-Host "  Start Docker Desktop if it is not already running"
    Write-Host "  docker compose up"
}

Write-Step "Repository: $RootDir"
if ($WithDocker -and $SkipDocker) {
    throw "Use either -WithDocker or -SkipDocker, not both. Docker is enabled by default on Windows."
}

Ensure-Java
Ensure-MavenWrapper

if (-not $SkipDocker) {
    Ensure-Docker
}

Invoke-Build
Write-NextSteps
