<div align="center">

<img src="favicon.svg" width="72" height="72" alt="Kyber mark">

# kyber-redesign

**An independent, open-source redesign concept for [kyber.tech](https://kyber.tech) — real-time control for every machine.**

Static · zero build step · 50 languages · light & dark · RTL · accessible · ~0 dependencies

[Live preview](https://kyber.paulfleury.com) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [Translations](docs/TRANSLATIONS.md)

</div>

---

> **Unofficial.** This is a design proposal made by [Paul Fleury](https://paulfleury.com) as a gift to the Kyber team. It is not affiliated with or endorsed by Kyber SAS. Kyber, the Kyber mark, VLC and VideoLAN are trademarks of their respective owners. See [NOTICE](NOTICE.md).

## What's inside

| | |
|---|---|
| **Pages** | Home, Technology, 6 Solutions, About, SDK, Blog (7 posts), Careers (5 roles + embedded application form), Connect (multi-step form with files and voice note), Legal (privacy, cookies, terms), and a plain-language “Simple view” with narrated audio |
| **Languages** | 50 — the most widely spoken languages worldwide plus Hebrew, selected from a searchable language modal. Native script fonts, RTL for Arabic, Urdu, Persian, Pashto and Hebrew |
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
i18n/<lang>.json      ~1,050 interface strings per language
content/<lang>/*.json Long-form documents: blog posts, legal pages, job ads
audio/simple-*.mp3    Narration for the Simple view
img/                  Team photos, blog headers (WebP)
tools/i18n/           LLM-assisted translation and review scripts
docs/                 Translation and architecture notes
```

### Routes

Hash-based, so it runs from any static host: `#/`, `#/technology`, `#/solutions/<slug>`, `#/about`, `#/sdk`, `#/blog`, `#/blog/<slug>`, `#/careers`, `#/careers/<role>`, `#/connect`, `#/legal/{privacy,cookies,terms}`, `#/simple`. Force a language with `?lang=<code>`.

## Translations

All copy lives in `i18n/en.json` (interface) and `content/en/*.json` (documents). Every other language mirrors those keys. Missing keys and documents fall back to English.

Translations were produced with frontier LLMs and an automated native-editor review for the original ten languages. **They have not yet been reviewed by human native speakers** — corrections are the most valuable contribution you can make. See [docs/TRANSLATIONS.md](docs/TRANSLATIONS.md).

## Known gaps

- 19 long-form documents across 9 languages still fall back to English.
- Igbo is not yet included (the 50th most-spoken language without it is Hebrew).
- Narration exists for 10 languages; the listen button is hidden elsewhere.
- Job ads, legal text and company facts mirror kyber.tech as of October 2026 and are illustrative only.

## Contributing

Issues and pull requests are welcome — especially native-speaker corrections, accessibility findings and performance improvements. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

The **code** (HTML, CSS, JavaScript, tooling) is released under the [MIT License](LICENSE).
Kyber's **brand, names, logos, photos and original copy** are not covered by that license — see [NOTICE](NOTICE.md).

<div align="center"><sub>Made in Lisbon by Paul Fleury · for the people who made VLC</sub></div>
