---
question: "How is this different from Prettier or jq?"
category: "formats"
order: 3
---

[Prettier](https://prettier.io/) and [jq](https://jqlang.org/) are excellent tools. We think of ourselves as a different product with overlapping features.

- **Prettier** is a code formatter that runs as a CLI or pre-commit hook. It formats whole repositories of JavaScript, CSS, HTML, and JSON at once. It is not a browser tool and not a validator.
- **jq** is a streaming JSON processor. It does beautifying, filtering, transformation, and scripting. Unmatched for CLI data wrangling.
- **This site** is browser-based, ad-supported, zero-install, and privacy-respecting. No setup. No upload. Paste, click, read. Targeted at the moment when you have a broken payload in your clipboard and want to know what's wrong in ten seconds.

All three can coexist. For CI pipelines, use Prettier. For shell scripts, use jq. For a quick visual check in the middle of debugging, use the tool here.
