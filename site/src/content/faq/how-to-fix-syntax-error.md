---
question: "Why does my JSON show a syntax error?"
category: "using-the-tool"
order: 3
---

The status bar shows the specific error, but the most common causes are short:

- **Trailing comma** — `{"a": 1,}` is invalid. Remove the last comma.
- **Single quotes** — JSON requires `"` around keys and strings, never `'`.
- **Missing quotes on a key** — `{name: "Ada"}` is invalid; `{"name": "Ada"}` is correct.
- **Comments** — strict JSON has no `//` or `/* */`. Remove them.
- **Unescaped backslashes** — Windows paths need `\\` not `\`.

The error line and column point within a few characters of the real issue. For a full reference, see our guide on [the 10 most common JSON syntax errors](/guides/common-json-syntax-errors/).
