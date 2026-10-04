# Contributing

Thanks for helping. This is a small static project, so contributing is easy.

## Run it locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`, add `?lang=<code>` to test a language.

## Most wanted

1. **Native-speaker corrections.** Edit `i18n/<lang>.json` or `content/<lang>/*.json` directly. Keep keys, `{placeholders}` and HTML tags exactly as they are.
2. **Missing translations.** See *Known gaps* in the README.
3. **Accessibility issues.** Keyboard traps, contrast, screen-reader labels.
4. **Performance.** Fewer bytes, fewer requests.

## Guidelines

- No frameworks and no build step. Vanilla HTML, CSS and JS only.
- Every user-facing string goes through i18n. No hard-coded English in markup or JS (brand and technical tokens excepted).
- New strings: add them to `i18n/en.json` first, then run `tools/i18n/ors.py` or translate by hand.
- Test light and dark, desktop and mobile (375 px), and at least one RTL language (`ar`, `he`, `ur`, `fa` or `ps`).
- Respect `prefers-reduced-motion`.
- Keep commits small and messages descriptive.

## Pull requests

1. Fork and branch from `main`.
2. Describe what changed and how you tested it, with screenshots for visual changes.
3. One topic per pull request.

By contributing you agree that your code contributions are licensed under the MIT License.
