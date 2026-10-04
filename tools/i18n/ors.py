import json, asyncio, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from or_lib import *
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
K = os.path.join(ROOT, 'i18n/')
MODEL = os.environ.get('M', 'google/gemini-3.8-flash')
sem = asyncio.Semaphore(int(os.environ.get('C', '24')))
EN = json.load(open(K + 'en.json')); ENF = dict(flat(EN))
CTX = 'Kyber (kyber.tech) is a deep-tech startup from the creators of VLC: an open-source SDK for real-time, ultra-low-latency remote control of machines (robots, drones, vehicles, computers) and immersive streaming.'
def prompt(code, items):
    body = '\n'.join(f'{k}\t{v}' for k, v in items)
    return f"""You are a senior native {LN[code]} UX writer and localizer. {CTX}
Translate the website interface strings below from English into perfectly natural, idiomatic, fluent {LN[code]} — the way a top native tech product would phrase it, not a literal translation. Keep it concise (UI labels stay short). Use the native script, punctuation and quotation marks of the language. Never use the straight ASCII double-quote character in values.
Rules: keep placeholders like {{n}} {{q}} {{link}} exactly; keep any HTML tags exactly; keep untranslated: {KEEP}. Keep keyboard keys (Esc, K, Enter) and symbols (↗ → · ✓ ×) as they are. Do not leave any other English words.
Input format: one string per line as KEY<TAB>ENGLISH. Output: EXACTLY one line per input key as KEY<TAB>TRANSLATION, same keys, same order, nothing else (no code fences, no commentary). Never put a newline inside a value.

{body}"""
async def chunk(code, items, out):
    async with sem:
        todo = items
        for a in range(4):
            if not todo: return
            try:
                r = parse_tab(await chat(MODEL, prompt(code, todo), 24000))
            except Exception as e:
                print('err', code, e, flush=True); continue
            bad = []
            for k, v in todo:
                t = r.get(k)
                if not t or check(v, t): bad.append((k, v))
                else: out[k] = t
            todo = bad
            if bad: print('retry', code, len(bad), [b[0] for b in bad[:4]], flush=True)
        for k, v in todo: print('FAIL', code, k, flush=True)
async def lang(code):
    p = K + code + '.json'
    d = json.load(open(p)) if os.path.exists(p) else {}
    miss = [(k, v) for k, v in ENF.items() if v and not getp(d, k)]
    if not miss: print('skip', code, flush=True); return
    chunks, cur = [], []
    for kv in miss:
        cur.append(kv)
        if sum(len(x[1]) for x in cur) > 2500 or len(cur) >= 45: chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    out = {}
    await asyncio.gather(*[chunk(code, c, out) for c in chunks])
    d = json.load(open(p)) if os.path.exists(p) else {}
    # rebuild in EN key order
    res = {}
    for k in ENF:
        v = out.get(k) or getp(d, k)
        if v: setp(res, k, v)
    json.dump(res, open(p, 'w'), ensure_ascii=False, indent=1)
    print('ok', code, len(out), 'of', len(miss), flush=True)
async def main():
    codes = sys.argv[1:] or (OLD + NEW)
    await asyncio.gather(*[lang(c) for c in codes])
asyncio.run(main())
