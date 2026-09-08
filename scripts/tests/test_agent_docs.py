"""Regression scenarios for the documentation CLI, using isolated Git fixtures."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

GUARD = Path(__file__).resolve().parents[1] / "check-agent-docs.py"


class DocumentationContractTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        subprocess.run(["git", "init", "--quiet", str(self.root)], check=True)
        self.write(".gitignore", "target/\ngenerated/\n.env\nprivate/\n")
        for name in ("README", "AGENTS", "CONTRIBUTING"):
            self.write(name + ".md", "# Entry point\n")
        for name in ("README", "inventory", "plan", "architecture", "setup",
                     "operations", "checks", "validation", "handoff", "review"):
            self.write(f"docs/agent-readiness/{name}.md", "module-one CONFIG_SERVER_URL\n")
        self.write("pom.xml", '<project xmlns="http://maven.apache.org/POM/4.0.0">'
                   '<modules><module>module-one</module></modules></project>')
        self.write("module-one/src/main/resources/application.yml",
                   "spring:\n  config:\n    import: ${CONFIG_SERVER_URL:http://localhost:8888/}\n")
        self.write(".env.example", "CONFIG_SERVER_URL=http://localhost:8888/\n")
        self.write("scripts/check-agent-docs.py", GUARD.read_text())
        subprocess.run(["git", "-C", str(self.root), "add", "."], check=True)

    def write(self, name, content):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)

    def check_cli(self, expected_status, expected_text):
        result = subprocess.run([sys.executable, str(self.root / "scripts/check-agent-docs.py")],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, expected_status, result.stdout + result.stderr)
        self.assertIn(expected_text, result.stdout)
        self.assertNotIn("Traceback", result.stderr)

    def test_valid_checkout_and_new_markdown_are_counted(self):
        self.write("module-one/AGENTS.md", "[Setup](../docs/agent-readiness/setup.md)\n")
        self.check_cli(0, "14 Markdown files, 1 Maven modules")

    def test_broken_nested_instructions_are_rejected_before_staging(self):
        self.write("module-one/AGENTS.md", "[Policy](missing-policy.md)\n")
        self.check_cli(1, "module-one/AGENTS.md:1: local link target does not exist")

    def test_tracked_docs_outside_readiness_are_checked(self):
        self.write("design-system/README.md", "[Tokens](missing.json)\n")
        subprocess.run(["git", "-C", str(self.root), "add", "design-system"], check=True)
        self.check_cli(1, "design-system/README.md:1: local link target does not exist")

    def test_runtime_ignored_and_generated_markdown_are_excluded(self):
        for path in ("WORKFLOW.md", "private/credentials.md", "target/report.md", "generated/report.md"):
            self.write(path, "[Not source](missing.md)\n")
        self.check_cli(0, "13 Markdown files")

    def test_documented_typo_cannot_masquerade_as_consumed_environment(self):
        self.write(".env.example", "CONFIG_SERVER_URL=\nTYPO_CONFIG_SERVER_URL=\n")
        self.write("docs/agent-readiness/setup.md", "CONFIG_SERVER_URL TYPO_CONFIG_SERVER_URL\n")
        self.check_cli(1, "variable has no application/Compose placeholder: TYPO_CONFIG_SERVER_URL")

    def test_new_required_source_placeholder_requires_template_entry(self):
        self.write("docker-compose.yml", 'services:\n  app:\n    image: "${APP_IMAGE}"\n')
        self.check_cli(1, "source placeholder missing from template: APP_IMAGE")

    def test_missing_handoff_and_module_documentation_fail(self):
        (self.root / "docs/agent-readiness/handoff.md").unlink()
        self.write("docs/agent-readiness/architecture.md", "# Architecture\n")
        self.check_cli(1, "handoff.md: required file missing")
        self.check_cli(1, "architecture.md: Maven module not documented: module-one")

    def test_duplicate_and_undocumented_environment_fail(self):
        self.write(".env.example", "CONFIG_SERVER_URL=\nCONFIG_SERVER_URL=\n")
        self.write("docs/agent-readiness/setup.md", "# Setup\n")
        self.check_cli(1, "duplicate variable: CONFIG_SERVER_URL")
        self.check_cli(1, "environment variable not documented: CONFIG_SERVER_URL")

    def test_reference_images_encoding_and_fences(self):
        self.write("docs/image name.png", "fixture")
        self.write("README.md", '![Image](docs/image%20name.png)\n[manual]: <docs/agent-readiness/setup.md>\n'
                   '````md\n[example](missing.md)\n```\n[still example](missing.md)\n````\n'
                   '[External](https://example.invalid/)\n[Anchor](#not-checked)\n')
        self.check_cli(0, "passed")
        self.write("README.md", "[manual]: missing.md\n")
        self.check_cli(1, "README.md:1: local link target does not exist")

    def test_encoded_repository_escape_fails(self):
        self.write("README.md", "[Outside](%2e%2e/outside.md)\n")
        self.check_cli(1, "local link escapes repository")

    def test_missing_pom_is_an_explicit_check_failure(self):
        (self.root / "pom.xml").unlink()
        self.check_cli(1, "check could not run: FileNotFoundError")


if __name__ == "__main__":
    unittest.main()
