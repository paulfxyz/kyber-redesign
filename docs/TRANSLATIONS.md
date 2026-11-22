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

All 51 languages are complete: every interface string and all 16 documents.

| Content | Translation | Native-editor pass |
|---|---|---|
| Interface strings (~1,060) | Claude Opus 5.5 (all 50) | Gemini 4 Neon (all 50) |
| Blog posts (8) | Claude Opus 5.5 (all 50) | Gemini 4 Neon (37 languages) · GPT-6.2 Sol (az, el, ig, ml, ms, ne, nl, ps, ro, su, uk, uz, zu, part of or) |
| Job ads (5) and legal pages (3) | Claude Opus 5.5 (all 50) | Gemini 4 Neon: fr, de, es, pt, zh, ja and most of ar. Other languages are first-pass. |

The native-editor prompt (`tools/i18n/orr_rules.py`) asks for a rewrite by "a gifted native copywriter and senior editor", not a translation check. Facts, numbers, links, brand tokens and HTML stay as they are, and the wording, rhythm and logic are rewritten until the text reads as if it were originally written in that language.

Human native-speaker review is still the biggest open need. Use the [review sheet](translation-review.xlsx) (one tab per language, with an OK / Fix / Unsure status and a suggestion column). Open a pull request or an issue with the *Translation* template.

## Tooling

`tools/i18n/` contains the scripts used to produce the translations through [OpenRouter](https://openrouter.ai):

```bash
export OPENROUTER_API_KEY=sk-or-...
M=anthropic/claude-opus-5.5 python3 tools/i18n/ors.py fr de   # interface strings (fills missing keys only)
python3 tools/i18n/orc.py ko it                                  # documents (skips existing files)
python3 tools/i18n/orc_chunk.py my:v-028                         # long document, one <h2> section at a time
M=google/gemini-4-neon MODE=strings python3 tools/i18n/orr.py ko # native-editor pass, interface strings
M=google/gemini-4-neon BLOG=1 FLOOR=5 python3 tools/i18n/orr_docs.py ko   # native-editor pass, documents (stops when key credit < FLOOR)
```

Responses are streamed: long, non-streamed responses can be dropped by proxies while still being billed. Under heavy concurrency some providers drop streams mid-response, so keep concurrency around 12–16. Scripts are resumable and validate placeholders, HTML tag counts and links before writing.
