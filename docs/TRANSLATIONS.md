# Translations

## Layout

- `i18n/en.json` — source of truth for ~1,050 interface strings, grouped by section.
- `i18n/<code>.json` — same keys, translated. Missing keys fall back to English at runtime.
- `content/en/*.json` — long-form documents (`title`, `tag`, `quote`, `html`).
- `content/<code>/*.json` — translated documents. A missing file falls back to English.

The language list, right-to-left set and per-script fonts are defined at the top of `js/app.js` (`LANGS`, `RTL`, `FONTS`).

## Rules for translators

- Keep every key, `{placeholder}` and HTML tag exactly.
- Keep brand and technical tokens untranslated: Kyber, VLC, VideoLAN, FFmpeg, SDK, AGPL, GitLab, QUIC, Rust, C/C++, product and person names, URLs, code.
- Use the language's native punctuation and quotation marks.
- Short UI labels should stay short.

## Status

| Group | Languages | Status |
|---|---|---|
| Original | en, fr, de, es, pt, zh, ja, hi, ar, he | Translated + automated native-editor review |
| Added in 1.0 | 40 more of the world's most-spoken languages | Translated with Claude Opus 5.5; not yet reviewed |
| Missing | ig (Igbo) | Not included |

Human native-speaker review is the biggest open need. Open a pull request or an issue with the *Translation* template.

## Tooling

`tools/i18n/` contains the scripts used to produce the translations through [OpenRouter](https://openrouter.ai):

```bash
export OPENROUTER_API_KEY=sk-or-...
M=anthropic/claude-opus-5.5 python3 tools/i18n/ors.py fr de   # interface strings (fills missing keys only)
python3 tools/i18n/orc.py ko it                                  # documents (skips existing files)
MODE=strings python3 tools/i18n/orr.py ko                         # native-editor review pass
```

Responses are streamed: long, non-streamed responses can be dropped by proxies while still being billed. Scripts are resumable and validate placeholders, HTML tag counts and links before writing.
