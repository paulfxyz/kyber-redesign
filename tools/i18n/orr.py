import json, asyncio, glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from or_lib import *
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
K = ROOT + '/'
MODEL = os.environ.get('M', 'openai/gpt-6.1-sol')
sem = asyncio.Semaphore(int(os.environ.get('C', '40')))
EN = json.load(open(K + 'i18n/en.json')); ENF = {k: v for k, v in flat(EN) if v}
ONLY = os.environ.get('ONLY')  # optional comma-separated key prefixes
RULES = f"""You are a demanding native-speaker editor reviewing the {{lang}} localization of Kyber's website (deep-tech startup from the VLC creators: open-source SDK for real-time, ultra-low-latency remote control of robots, drones, vehicles and computers).
Check every translation against the English source. Fix: mistranslations, literal/awkward or machine-like phrasing, wrong register, inconsistent terminology, grammar, spelling, diacritics/tone marks, wrong script, punctuation and typography (native quotation marks; French-style spacing only for French; full-width punctuation for CJK), and ANY leftover English words except these tokens: {KEEP}. UI labels must stay short. Keep placeholders like {{{{n}}}} and HTML tags exactly. Never use the straight ASCII double-quote in values."""
async def strings(code):
    p = K + f'i18n/{code}.json'; d = json.load(open(p))
    keys = [k for k in ENF if (not ONLY or any(k.startswith(x) for x in ONLY.split(',')))]
    chunks = [keys[i:i + 110] for i in range(0, len(keys), 110)]
    changes = {}
    async def ch(ks):
        body = '\n'.join(f'{k}\t{ENF[k]}\t{getp(d, k) or ""}' for k in ks)
        pr = RULES.replace('{lang}', LN[code]) + f"""
Input lines: KEY<TAB>ENGLISH<TAB>CURRENT {LN[code]}.
Output ONLY the lines that need a correction, as KEY<TAB>CORRECTED (one per line, no commentary, no code fences). If a line is already excellent, omit it. If everything is excellent, output exactly: NONE

{body}"""
        async with sem:
            for a in range(3):
                try:
                    r = parse_tab(await chat(MODEL, pr, 16000))
                    for k, v in r.items():
                        if k in ENF and k in ks and not check(ENF[k], v): changes[k] = v
                    return
                except Exception as e: print('retry', code, str(e)[:80], flush=True)
    await asyncio.gather(*[ch(c) for c in chunks])
    d = json.load(open(p))
    for k, v in changes.items(): setp(d, k, v)
    json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
    json.dump(changes, open(os.path.join(ROOT, f'tools/i18n/rev/{code}.json'), 'w'), ensure_ascii=False, indent=1)
    print('ok strings', code, len(changes), flush=True)
async def doc(code, f):
    p = K + f'content/{code}/{os.path.basename(f)}'
    if not os.path.exists(p): print('missing', p, flush=True); return
    d = json.load(open(p)); en = json.load(open(f))
    keys = [k for k in ('title', 'tag', 'quote', 'html') if en.get(k)]
    pr = RULES.replace('{lang}', LN[code]) + f"""
Review this document translation. Keep every HTML tag, attribute and href exactly. Return the full corrected document in EXACTLY this plain-text format, same keys and order (no commentary, no code fences):
""" + ''.join(f'@@{k}@@\n<corrected {k}>\n' for k in keys) + "\nENGLISH SOURCE:\n" + ''.join(f'@@{k}@@\n{en[k]}\n' for k in keys) + "\nCURRENT TRANSLATION:\n" + ''.join(f'@@{k}@@\n{d.get(k, "")}\n' for k in keys)
    async with sem:
        for a in range(3):
            try:
                t = (await chat(MODEL, pr, 32000)).strip()
                parts = re.split(r'^@@(\w+)@@\s*$', t, flags=re.M); o = {parts[i]: parts[i + 1].strip() for i in range(1, len(parts) - 1, 2)}
                assert set(o) == set(keys), 'keys'
                assert abs(tagn(en['html']) - tagn(o['html'])) <= 4, 'tags'
                assert re.findall(r'href="([^"]+)"', en['html']) == re.findall(r'href="([^"]+)"', o['html']), 'hrefs'
                d.update(o); json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1); print('ok doc', code, os.path.basename(f), flush=True); return
            except Exception as e: print('retry doc', code, os.path.basename(f), str(e)[:80], flush=True)
        print('FAIL doc', code, f, flush=True)
async def main():
    os.makedirs(os.path.join(ROOT, 'tools/i18n/rev'), exist_ok=True)
    mode = os.environ.get('MODE', 'all'); codes = sys.argv[1:] or NEW
    jobs = []
    if mode in ('all', 'strings'): jobs += [strings(c) for c in codes]
    if mode in ('all', 'docs'): jobs += [doc(c, f) for c in codes for f in sorted(glob.glob(K + 'content/en/*.json'))]
    await asyncio.gather(*jobs)
asyncio.run(main())
