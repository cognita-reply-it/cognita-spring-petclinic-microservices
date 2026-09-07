#!/usr/bin/env python3
"""Offline guard for agent documentation. Python 3 standard library only.

Checks inline Markdown links and reference definitions outside fenced code,
required entrypoints, Maven module mentions and environment-name documentation.
Does not validate anchors, external URLs, HTML, code snippets or prose semantics.
"""
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOCS = Path("docs/agent-readiness")
REQUIRED = [Path(name) for name in ("AGENTS.md", "README.md", "CONTRIBUTING.md", ".env.example")]
REQUIRED += [DOCS / (name + ".md") for name in (
    "README", "inventory", "plan", "architecture", "setup", "operations", "checks", "validation", "handoff", "review")]
LINK = re.compile(r'\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\s*\)')
REFERENCE = re.compile(r'^\s{0,3}\[[^\]]+\]:\s*(<[^>]+>|\S+)')


def destinations(markdown):
    """Yield simple Markdown destinations with source lines, skipping code fences."""
    fence = None
    for number, line in enumerate(markdown.splitlines(), 1):
        marker = re.match(r"^\s{0,3}(`{3,}|~{3,})", line)
        if marker:
            value = marker.group(1)
            if fence is None:
                fence = value
            elif value[0] == fence[0] and len(value) >= len(fence):
                fence = None
            continue
        if fence:
            continue
        for match in LINK.finditer(line):
            yield number, match.group(1).strip("<>")
        match = REFERENCE.match(line)
        if match:
            yield number, match.group(1).strip("<>")


def local_error(root, source, target):
    url = urlsplit(target)
    if url.scheme or url.netloc or not url.path:
        return None
    path = (root / source.parent / unquote(url.path)).resolve()
    if not path.is_relative_to(root.resolve()):
        return "local link escapes repository"
    if not path.exists():
        return "local link target does not exist"
    return None


def check(root):
    errors = []
    for path in REQUIRED:
        if not (root / path).is_file():
            errors.append(f"{path}: required file missing")
    files = [Path("AGENTS.md"), Path("README.md"), Path("CONTRIBUTING.md")]
    files += sorted(path.relative_to(root) for path in (root / DOCS).rglob("*.md"))
    for source in files:
        if not (root / source).is_file():
            continue
        for line, target in destinations((root / source).read_text()):
            error = local_error(root, source, target)
            if error:
                errors.append(f"{source}:{line}: {error}: {target}")
    namespaces = {"m": "http://maven.apache.org/POM/4.0.0"}
    modules = [element.text for element in ET.parse(root / "pom.xml").findall("m:modules/m:module", namespaces)]
    for name in ("inventory", "architecture"):
        source = DOCS / (name + ".md")
        content = (root / source).read_text() if (root / source).is_file() else ""
        for module in modules:
            if module not in content:
                errors.append(f"{source}: Maven module not documented: {module}")
    template = root / ".env.example"
    setup = root / DOCS / "setup.md"
    if template.is_file() and setup.is_file():
        names = re.findall(r"^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)=", template.read_text(), re.MULTILINE)
        content = setup.read_text()
        for name in sorted(set(names)):
            if names.count(name) > 1:
                errors.append(f".env.example: duplicate variable: {name}")
            if not re.search(r"\b" + re.escape(name) + r"\b", content):
                errors.append(f"{DOCS}/setup.md: environment variable not documented: {name}")
    return errors, len(files), len(modules)


if __name__ == "__main__":
    problems, file_count, module_count = check(ROOT)
    if problems:
        print("Agent documentation check FAILED:")
        print("\n".join(problems))
        sys.exit(1)
    print(f"Agent documentation check passed: {file_count} Markdown files, {module_count} Maven modules.")
