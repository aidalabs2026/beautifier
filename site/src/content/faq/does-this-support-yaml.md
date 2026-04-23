---
question: "Does this support YAML, TOML, or CSV?"
category: "formats"
order: 2
---

Not yet. YAML is on the consideration list for Phase 7 (after XML and HTML land). TOML and CSV are more niche — we will add them if usage numbers suggest demand.

For YAML-to-JSON conversion right now, the easiest path is `yq` on the command line: `yq -o=json . < file.yaml`. Or use the Python one-liner `python -c "import yaml,json,sys; json.dump(yaml.safe_load(sys.stdin), sys.stdout, indent=2)"`.

For a longer comparison of the two formats, see the guide [JSON vs YAML](/guides/json-vs-yaml/).
