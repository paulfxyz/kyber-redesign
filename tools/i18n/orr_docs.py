import json, asyncio, glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from or_lib import *
import orr_rules
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
MODEL = os.environ.get('M', 'google/gemini-4-neon')
sem = asyncio.Semaphore(99)
DONE = os.path.join(ROOT, 'tools/i18n/rev/docs_done.json')
done = json.load(open(DONE)) if os.path.exists(DONE) else {}
def split(h): return [p for p in re.split(r'(?=<h2)', h) if p.strip()]
async def polish(code, en, cur, what):
    pr = orr_rules.RULES.replace('{lang}', LN[code]) + f"""
Polish this {what} so it reads as if written natively. Output ONLY the polished {LN[code]} text/HTML (same tags), nothing else.

ENGLISH SOURCE:
{en}

CURRENT {LN[code]}:
{cur}"""
    async with sem:
        for a in range(3):
            try:
                t = (await chat(MODEL, pr, 24000)).strip(); t = re.sub(r'^```\w*\n|\n```$', '', t)
                if tagn(cur) and abs(tagn(cur) - tagn(t)) > 2: raise RuntimeError('tags')
                if re.findall(r'href="([^"]+)"', cur) != re.findall(r'href="([^"]+)"', t): raise RuntimeError('hrefs')
                if len(t) < 0.5 * len(cur): raise RuntimeError('short')
                return t
            except Exception as e: print('retry', code, what[:16], str(e)[:60], flush=True)
        return cur
async def doc(code, f):
    b = os.path.basename(f); key = code + '/' + b
    if done.get(key): return
    if os.environ.get('BLOG') and (b.startswith('job-') or b.startswith('doc-')): return
    async with gate:
        if stop[0]: return
        await budget()
        p = os.path.join(ROOT, 'content', code, b); d = json.load(open(p)); en = json.load(open(f))
        T = lambda x: ('<h1 data-meta="title">' + x['title'] + '</h1>\n') if en.get('title') and d.get('title') else ''
        r = await polish(code, T(en) + en['html'], T(d) + d['html'], 'HTML article (the h1 data-meta="title" line is the article title; keep it as the first line)')
        m = re.match(r'\s*<h1 data-meta="title">(.*?)</h1>\n?', r, re.S)
        if T(d):
            if not m: print('notitle', key, flush=True); return
            d['title'] = m.group(1).strip(); r = r[m.end():]
        d['html'] = r
        json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
        done[key] = 1; json.dump(done, open(DONE, 'w'))
        print('ok doc', key, flush=True)
import subprocess
stop=[False]; cnt=[0]; gate=asyncio.Semaphore(int(os.environ.get('C','16')))
async def budget():
    cnt[0]+=1
    if cnt[0]%10: return
    r=await asyncio.to_thread(subprocess.run,['curl','-s','https://openrouter.ai/api/v1/key'],capture_output=True,text=True)
    try:
        rem=json.loads(r.stdout)['data']['limit_remaining']; print('budget',rem,flush=True)
        if rem is not None and rem<float(os.environ.get('FLOOR','8')): stop[0]=True
    except Exception: pass
async def main():
    os.makedirs(os.path.dirname(DONE), exist_ok=True)
    codes = sys.argv[1:] or (OLD + NEW)
    await asyncio.gather(*[doc(c, f) for c in codes for f in sorted(glob.glob(os.path.join(ROOT, 'content/en/*.json')))])
asyncio.run(main())
