import json, asyncio, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from or_lib import *
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
D = os.path.join(ROOT, 'content/')
MODEL = os.environ.get('M', 'anthropic/claude-opus-5.5')
sem = asyncio.Semaphore(16)
def P(code, text, what):
    return f"""You are a senior native {LN[code]} translator and editor. Translate this {what} of a Kyber company blog article from English into perfectly natural, idiomatic {LN[code]}, as a top native publication would write it.
Keep ALL HTML tags and attributes exactly (translate only text nodes; never change href/src). Keep untranslated: {KEEP}. Native punctuation; never the ASCII double quote in text. Output ONLY the translated text/HTML, nothing else.

{text}"""
async def tr(code, text, what):
    async with sem:
        for a in range(4):
            try:
                t = (await chat(MODEL, P(code, text, what), 16000)).strip()
                t = re.sub(r'^```\w*\n|\n```$', '', t)
                if tagn(text) and abs(tagn(text) - tagn(t)) > 2: raise RuntimeError('tags')
                return t
            except Exception as e: print('retry', code, what[:20], str(e)[:60], flush=True)
        raise RuntimeError('fail')
async def one(code, slug):
    src = json.load(open(D + 'en/' + slug + '.json')); out = D + code + '/' + slug + '.json'
    if os.path.exists(out): return
    parts = re.split(r'(?=<h2)', src['html']); parts = [p for p in parts if p.strip()]
    res = dict(src)
    meta = await asyncio.gather(*[tr(code, src[k], 'short ' + k) for k in ('title', 'tag', 'quote') if src.get(k)])
    for k, v in zip([k for k in ('title', 'tag', 'quote') if src.get(k)], meta): res[k] = v
    body = await asyncio.gather(*[tr(code, p, 'HTML section') for p in parts])
    res['html'] = ''.join(body)
    assert re.findall(r'href="([^"]+)"', src['html']) == re.findall(r'href="([^"]+)"', res['html']), 'hrefs'
    json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1); print('ok', code, slug, flush=True)
async def main():
    jobs = [a.split(':') for a in sys.argv[1:]]
    r = await asyncio.gather(*[one(c, s) for c, s in jobs], return_exceptions=True)
    for (c, s), x in zip(jobs, r):
        if isinstance(x, Exception): print('FAIL', c, s, x, flush=True)
asyncio.run(main())
