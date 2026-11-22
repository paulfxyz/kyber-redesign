# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/).

## [1.3.0] — 2026-11-22

### Added
- `docs/translation-review.xlsx`: a native-speaker review sheet covering 50 languages, 53,200 strings and 800 documents. The README now features it prominently.
- **Igbo** completes the set: 51 languages in total (the 50 most widely spoken plus Hebrew).
- Every language now has all 16 documents; the remaining English fallbacks are translated.
- **Native-editor pass**: each translation is rewritten by a second model acting as a native copywriter, so the copy reads as if it were originally written in that language.
  - Gemini 4 Neon: all interface strings in 50 languages, plus blog posts.
  - GPT-6.2 Sol: blog posts for az, el, ig, ml, ms, ne, nl, ps, ro, su, uk, uz, zu and part of or.
- `tools/qa/layout-audit.mjs`: automated layout audit for every language on desktop (1440/1280), tablet (820) and mobile (390/360).
- `tools/i18n/orc_chunk.py` translates long documents one section at a time. `tools/i18n/orr_docs.py` runs the native-editor pass on documents, with a budget guard.

### Fixed
- Terminal window bar: long titles now truncate, tabs scroll, and the Copy button no longer gets squeezed off narrow screens.
- Long button labels (German, Malayalam, Burmese and others) now wrap on screens 560 px wide or less instead of overflowing.
- The FEC demo footer wraps on small screens, and its Reset button keeps its size.

 — 2026-11-22

### Added
- **Kyber release 0.29** blog post (13 Oct 2026) in all 50 languages, with its hero and three inline illustrations: WebSocket fallback, 4:4:4 color at native resolution, GStreamer capture for Raspberry Pi, fleet groundwork and macOS packaging.
- 0.29 entry in the SDK release timeline.

### Changed
- Windows installer bumped to **0.29.0** (9 Oct 2026); the live GitLab check still overrides it when reachable.
- Documentation links now point to **docs.kyber.tech**.
- Careers legacy line now mentions the 0.29 release.
- Featured blog card shows the whole hero image on a blurred backdrop instead of cropping its title.

## [1.1.0] — 2026-10-07

### Added
- “What’s Kyber? In simple words” floating widget, shown before scrolling on desktop and mobile; links to the Simple view and hands over to the SDK dock once you scroll. Translated into all 50 languages.

### Fixed
- Page changes now always return to the top, even with inertial scrolling (trackpads, iOS) or browser scroll restoration.

## [1.0.0] — 2026-10-04

First public-ready release of the concept.

### Added
- Searchable **language modal** with 50 languages, browser-language suggestion, keyboard navigation and per-script fonts.
- **RTL** support for Arabic, Hebrew, Urdu, Persian and Pashto.
- **Careers**: listing page, five role pages and an embedded application form.
- **Simple view**: plain-language one-pager with read time and narrated audio in 10 languages.
- **Hosted content**: 7 blog posts and the privacy, cookies and terms pages, with table of contents, reading bar and an English-original toggle.
- **Connect**: multi-step form with per-field validation, file uploads and voice notes.
- **SDK** install modal with per-platform tabs; redesigned Solutions menu.
- External-link modal explaining where each outbound link leads.
- Browser **console** (<kbd>K</kbd>) with live metrics, latency simulator and fully translated output.
- Accessibility panel; translated ARIA labels and tooltips everywhere.
- LLM-assisted translation and review tooling in `tools/i18n/`.

### Fixed
- Encoding errors (mojibake) in the original job ads.
- Header overflow in long languages; hero headings in long-word scripts.

### Known gaps
- 19 documents in 9 languages fall back to English; Igbo not yet included; no human native review yet.
