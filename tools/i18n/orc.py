import json, asyncio, glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from or_lib import *
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
D = os.path.join(ROOT, 'content/')
MODEL = os.environ.get('M', 'anthropic/claude-opus-5.5')
sem = asyncio.Semaphore(int(os.environ.get('C', '32')))
def tags(h): return re.findall(r'<(/?)(\w+)', h)
async def one(code, path):
    src = json.load(open(path)); out = D + code + '/' + os.path.basename(path)
    if os.path.exists(out): return
    os.makedirs(D + code, exist_ok=True)
    payload = {k: src[k] for k in ('title', 'tag', 'quote', 'html') if src.get(k)}
    b = os.path.basename(path)
    kind = ('legal document (privacy/cookies/terms) — translate precisely and faithfully in the formal legal register, never add or drop obligations' if src.get('legal')
            else 'job advertisement for a careers page — warm, professional, natural; translate all section headings and interview step names' if b.startswith('job-')
            else 'company blog article / release notes — natural, fluent, idiomatic tech-journalism prose')
    prompt = f"""You are a senior native {LN[code]} translator and editor. Translate this Kyber website {kind} from English into perfectly natural, idiomatic {LN[code]}, as a top native publication would write it — never literal or machine-like.
Rules: keep ALL HTML tags, attributes and their order exactly (translate only text nodes; never translate href/src/class values). Keep untranslated: {KEEP}. Use the native script, punctuation and quotation marks of the language. Never use the straight ASCII double-quote character inside text. No leftover English words except the tokens above.
Return EXACTLY this plain-text format (no JSON, no code fences, no commentary), one section per key present in the input, same order:
""" + ''.join(f'@@{k}@@\n<translated {k}>\n' for k in payload) + "\nINPUT:\n" + ''.join(f'@@{k}@@\n{v}\n' for k, v in payload.items())
    async with sem:
        for a in range(4):
            try:
                t = (await chat(MODEL, prompt, 32000)).strip()
                parts = re.split(r'^@@(\w+)@@\s*$', t, flags=re.M); d = {parts[i]: parts[i + 1].strip() for i in range(1, len(parts) - 1, 2)}
                assert set(d) == set(payload), 'keys %s' % list(d)
                ta, tb = tags(payload['html']), tags(d['html'])
                assert abs(len(ta) - len(tb)) <= 4, f'tags {len(ta)} vs {len(tb)}'
                assert re.findall(r'href="([^"]+)"', payload['html']) == re.findall(r'href="([^"]+)"', d['html']), 'hrefs'
                res = dict(src); res.update(d); json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1); print('ok', code, b, flush=True); return
            except Exception as e: print('retry', code, b, str(e)[:100], flush=True)
        print('FAIL', code, b, flush=True)
async def main():
    codes = sys.argv[1:] or NEW
    await asyncio.gather(*[one(c, p) for c in codes for p in sorted(glob.glob(D + 'en/*.json'))])
asyncio.run(main())
