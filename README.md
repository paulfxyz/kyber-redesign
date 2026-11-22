<div align="center">

<img src="favicon.svg" width="72" height="72" alt="Kyber mark">

# kyber-redesign

**An independent, open-source redesign concept for [kyber.tech](https://kyber.tech) — real-time control for every machine.**

Static · zero build step · 51 languages · light & dark · RTL · accessible · ~0 dependencies

[Live preview](https://kyber.paulfleury.com) · [**Review a translation**](#native-speakers-wanted) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [Translations](docs/TRANSLATIONS.md)

</div>

---

> **Unofficial.** This is a design proposal made by [Paul Fleury](https://paulfleury.com) as a gift to the Kyber team. It is not affiliated with or endorsed by Kyber SAS. Kyber, the Kyber mark, VLC and VideoLAN are trademarks of their respective owners. See [NOTICE](NOTICE.md).

> [!IMPORTANT]
> **Native speakers wanted.** All 51 languages are machine-translated and machine-edited. None has been checked by a person yet. If you speak one of them, the [review sheet](docs/translation-review.xlsx) takes a few minutes per section. See [how to help](#native-speakers-wanted).

## What's inside

| | |
|---|---|
| **Pages** | Home, Technology, 6 Solutions, About, SDK, Blog (8 posts), Careers (5 roles + embedded application form), Connect (multi-step form with files and voice note), Legal (privacy, cookies, terms), and a plain-language “Simple view” with narrated audio |
| **Languages** | 51 — the 50 most widely spoken languages worldwide plus Hebrew, selected from a searchable language modal. Native script fonts, RTL for Arabic, Urdu, Persian, Pashto and Hebrew |
| **Themes** | Light and dark, following the system by default |
| **Accessibility** | Skip link, full keyboard paths, focus management in every modal, reduced-motion support, an accessibility panel (text size, high contrast, easy-to-read font, reduced motion, underlined links, bigger buttons) and the Simple view for older or non-technical readers |
| **Geeky bits** | A real browser console (press <kbd>K</kbd>) with live frame timing, a ghost-cursor latency simulator, a FEC packet-loss demo, live GitLab release info |
| **Stack** | Plain HTML, CSS and vanilla JS. No framework, no bundler, no tracking |

## Quick start

```bash
git clone git@github.com:paulfxyz/kyber-redesign.git
cd kyber-redesign
python3 -m http.server 8080
# open http://localhost:8080
```

That's it — there is no build step. Any static host works (Apache, Nginx, S3, Netlify, Vercel, GitHub Pages). An `.htaccess` is included that disables caching for HTML and JSON so translation updates appear immediately.

### Cache-busting a release

Static assets are referenced with a `?v=<timestamp>` query string:

```bash
sed -i -E "s#\?v=[0-9]+#?v=$(date +%s)#g" index.html js/app.js
```

## Project structure

```
index.html            App shell, header, footer, modals
css/style.css         Design tokens, components, per-script typography
js/app.js             Router, i18n, pages, forms, modals, console
js/fx.js              Canvas effects, metrics, latency and FEC demos
i18n/<lang>.json      ~1,060 interface strings per language
content/<lang>/*.json Long-form documents: blog posts, legal pages, job ads
audio/simple-*.mp3    Narration for the Simple view
img/                  Team photos, blog headers (WebP)
tools/i18n/           LLM-assisted translation and native-editor scripts
tools/qa/             Cross-language, cross-device layout audit
docs/                 Translation and architecture notes
```

### Routes

Hash-based, so it runs from any static host: `#/`, `#/technology`, `#/solutions/<slug>`, `#/about`, `#/sdk`, `#/blog`, `#/blog/<slug>`, `#/careers`, `#/careers/<role>`, `#/connect`, `#/legal/{privacy,cookies,terms}`, `#/simple`. Force a language with `?lang=<code>`.

## Translations

All copy lives in `i18n/en.json` (interface) and `content/en/*.json` (documents). Every other language mirrors those keys. Missing keys and documents fall back to English.

Every language is complete: all ~1,060 interface strings and all 16 documents (8 blog posts, 5 job ads, 3 legal pages), with no English fallback left.

Translation runs in two passes:

1. **Translate**: Claude Opus 5.5 produces the first draft.
2. **Native-editor rewrite**: a second model is told to act as a native copywriter and senior editor. It is told to rewrite anything that does not read as if it were originally written in that language (wording, rhythm, sentence logic, idioms, punctuation), without changing facts, numbers, links or brand terms.
   - Gemini 4 Neon reviewed every interface string in all 50 languages and the blog posts in 37 of them.
   - GPT-6.2 Sol reviewed the blog posts in the other 13 languages.

Every change is checked for placeholders, HTML tags, links and images before it is written. Desktop, tablet and mobile layouts are checked automatically in every language (see [Quality](#quality)).

### Native speakers wanted

**No human native speaker has reviewed these translations yet.** That makes your corrections the most valuable contribution to this project.

**[Download the review sheet](docs/translation-review.xlsx)** (Excel, ~4 MB)

| Tab | What's in it |
|---|---|
| **How to review** | Four-step instructions and the rules (keep `{placeholders}`, HTML tags and brand names) |
| **Overview** | All 50 languages, each linked to its tab and live site, with counts of strings still to review, approved and flagged that update as you fill in Status |
| **One tab per language** | Every one of the 1,064 interface strings next to the English, plus a **Status** dropdown (OK / Fix / Unsure), **Your suggestion** and **Comment** |
| **Documents** | All 800 long-form pages (blog posts, job ads, legal), with how far each was edited and a link to the live page |

**How to help**

1. Open your language's tab, or preview it live at `https://kyber.paulfleury.com/?lang=<code>`.
2. Mark each string **OK**, **Fix** or **Unsure**, and add your better wording where needed.
3. Send the sheet back in a [Translation issue](../../issues/new?template=translation.md), or open a pull request editing `i18n/<code>.json`.

Even a single section (the navigation, the homepage hero) helps. See [docs/TRANSLATIONS.md](docs/TRANSLATIONS.md) for the full process.

## Quality

`tools/qa/layout-audit.mjs` (Playwright) loads 12 key routes in every language at five widths: 1440 and 1280 px desktop, 820 px tablet, and 390 and 360 px mobile. It flags horizontal overflow, clipped or overlapping text and controls pushed off-screen.

```bash
python3 -m http.server 8080 &
NODE_PATH=$(npm root -g) node tools/qa/layout-audit.mjs http://127.0.0.1:8080/ [lang ...]
```

## Known gaps

- The native-editor pass covered job ads and legal pages only in fr, de, es, pt, zh, ja and part of ar. Elsewhere those pages are the first-pass translation.
- Narration exists for 10 languages; the listen button is hidden elsewhere.
- Job ads, legal text and company facts mirror kyber.tech as of October 2026 and are illustrative only.

## Contributing

Issues and pull requests are welcome — especially native-speaker corrections, accessibility findings and performance improvements. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

The **code** (HTML, CSS, JavaScript, tooling) is released under the [MIT License](LICENSE).
Kyber's **brand, names, logos, photos and original copy** are not covered by that license — see [NOTICE](NOTICE.md).

<div align="center"><sub>Made in Lisbon by Paul Fleury · for the people who made VLC</sub></div>
