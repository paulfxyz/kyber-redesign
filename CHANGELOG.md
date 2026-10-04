# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/).

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
