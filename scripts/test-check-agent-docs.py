#!/usr/bin/env python3
"""Behavioral regression cases for the offline guard; no network or repo mutations."""
from pathlib import Path
import runpy
import tempfile
import unittest

GUARD = runpy.run_path(str(Path(__file__).with_name("check-agent-docs.py")))


class DocumentationGuardTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        for path in GUARD["REQUIRED"]:
            self.write(path, "")
        self.write("pom.xml", '<project xmlns="http://maven.apache.org/POM/4.0.0">'
                   '<modules><module>sample-service</module></modules></project>')
        for name in ("inventory", "architecture"):
            self.write(f"docs/agent-readiness/{name}.md", "sample-service\n")

    def write(self, path, content):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)

    def errors(self):
        return GUARD["check"](self.root)[0]

    def test_valid_local_reference_image_and_external_links(self):
        self.write("README.md", '[guide](<docs/agent-readiness/setup.md>)\n'
                   '![image](asset%20name.png)\n[guide-ref]: AGENTS.md "Title"\n'
                   '[external](https://example.invalid/unreachable)\n[anchor](#missing)\n')
        self.write("asset name.png", "fixture")
        self.assertEqual([], self.errors())

    def test_missing_inline_and_reference_destinations(self):
        self.write("README.md", '[missing](gone.md)\n[ref]: absent.md\n')
        self.assertEqual([
            'README.md:1: local link target does not exist: gone.md',
            'README.md:2: local link target does not exist: absent.md',
        ], self.errors())

    def test_nested_instructions_and_role_prompt_destinations(self):
        self.write("sample-service/AGENTS.md", '[contract](missing.md)\n')
        self.write(".codex/agents/example.toml",
                   'developer_instructions = """\n[contract](missing.md)\n"""\n')
        self.assertEqual([
            '.codex/agents/example.toml:2: local link target does not exist: missing.md',
            'sample-service/AGENTS.md:1: local link target does not exist: missing.md',
        ], self.errors())

    def test_nested_links_resolve_relative_to_source(self):
        self.write("sample-service/AGENTS.md", '[contract](../AGENTS.md)\n')
        self.write(".codex/agents/example.md", '[contract](../../AGENTS.md)\n')
        self.assertEqual([], self.errors())

    def test_fenced_examples_and_generated_copies_are_excluded(self):
        self.write("README.md", '```md\n[missing](gone.md)\n```\n'
                   '~~~~md\n[missing](gone.md)\n~~~\n[missing](gone.md)\n~~~~\n')
        for folder in (".git", "sample-service/target", "generated", "node_modules", ".venv", "__pycache__"):
            self.write(f"{folder}/AGENTS.md", '[missing](gone.md)\n')
        self.assertEqual([], self.errors())

    def test_missing_required_handoff(self):
        (self.root / "docs/agent-readiness/handoff.md").unlink()
        self.assertEqual(['docs/agent-readiness/handoff.md: required file missing'], self.errors())

    def test_new_module_must_be_documented_in_both_owners(self):
        self.write("pom.xml", '<project xmlns="http://maven.apache.org/POM/4.0.0">'
                   '<modules><module>new-service</module></modules></project>')
        self.assertEqual([
            'docs/agent-readiness/inventory.md: Maven module not documented: new-service',
            'docs/agent-readiness/architecture.md: Maven module not documented: new-service',
        ], self.errors())

    def test_duplicate_and_undocumented_environment_names(self):
        self.write(".env.example", 'DEMO_KEY=\nexport DEMO_KEY=\nNEW_OPTION=\n')
        self.write("docs/agent-readiness/setup.md", 'DEMO_KEY\nNEW_OPTION_SUFFIX\n')
        self.assertEqual([
            '.env.example: duplicate variable: DEMO_KEY',
            'docs/agent-readiness/setup.md: environment variable not documented: NEW_OPTION',
        ], self.errors())

    def test_repository_escape_including_symlink_is_rejected(self):
        self.write("README.md", '[outside](../outside.md)\n[outside](escape/file.md)\n')
        (self.root / "escape").symlink_to(self.root.parent, target_is_directory=True)
        self.assertEqual([
            'README.md:1: local link escapes repository: ../outside.md',
            'README.md:2: local link escapes repository: escape/file.md',
        ], self.errors())


if __name__ == "__main__":
    unittest.main(verbosity=2)
