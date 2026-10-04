import requests, json, re, asyncio, os
URL = 'https://openrouter.ai/api/v1/chat/completions'
LN = {
 'fr':'French (France)','de':'German (Germany)','es':'Spanish (neutral, Spain/LatAm)','pt':'European Portuguese (Portugal)','zh':'Simplified Chinese (Mainland China)','ja':'Japanese','ar':'Modern Standard Arabic','he':'Hebrew (Israel)','hi':'Hindi (Devanagari, natural modern Hindi as used by Indian tech companies)',
 'bn':'Bengali (Bangla, Bangladesh/India standard)','id':'Indonesian (Bahasa Indonesia)','ur':'Urdu (Pakistan, Nastaliq script)','ru':'Russian','pcm':'Nigerian Pidgin (Naijá), as written by Nigerian digital media such as BBC Pidgin','mr':'Marathi','vi':'Vietnamese','te':'Telugu','sw':'Swahili (Kiswahili, East African standard)','ha':'Hausa (Boko Latin script, Nigeria/Niger)','tr':'Turkish','pa':'Punjabi (Gurmukhi script, India)','fil':'Filipino (Tagalog-based, natural modern Philippine tech usage incl. common accepted loanwords)','ta':'Tamil','zh-Hant':'Traditional Chinese (Taiwan)','fa':'Persian (Farsi, Iran)','ko':'Korean','am':'Amharic (Ge’ez script)','th':'Thai','jv':'Javanese (Basa Jawa, Latin script, ngoko-madya neutral register)','it':'Italian','gu':'Gujarati','kn':'Kannada','yo':'Yoruba (with correct tone marks)','bho':'Bhojpuri (Devanagari)','pl':'Polish','my':'Burmese (Myanmar, Unicode)','or':'Odia (Oriya)','ml':'Malayalam','uk':'Ukrainian','uz':'Uzbek (Latin script)','ig':'Igbo (with standard diacritics)','ro':'Romanian (with ș ț comma-below)','nl':'Dutch (Netherlands)','ps':'Pashto (Afghanistan)','az':'Azerbaijani (North, Latin script)','su':'Sundanese (Basa Sunda, Latin script)','ne':'Nepali (Devanagari)','ms':'Malay (Bahasa Melayu, Malaysia)','zu':'Zulu (isiZulu)','el':'Greek (Modern)'}
OLD = ['fr','de','es','pt','zh','ja','ar','he','hi']
NEW = [c for c in LN if c not in OLD]
KEEP = 'Kyber, VLC, VideoLAN, FFmpeg, SDK, API, AGPL, GitLab, GitHub, LinkedIn, Discord, Reddit, TechCrunch, Lightspeed, OVNI Capital, Kima Ventures, VivaTech, Rust, C, C++, Go, QUIC, HTTP/3, WebRTC, FEC, XR, SDR, PCB, CTO, CEO, COO, CMO, CDI, PDF, Windows, Linux, macOS, Android, iOS, Visual Studio, x86/x64, GPU, CPU, ms, Hz, fps, person names, email addresses, URLs, code, CLI commands, file paths, version numbers'
import subprocess, tempfile
KEY = os.environ.get('OPENROUTER_API_KEY', '')
def _post(model, prompt, max_tokens, temperature):
    body = json.dumps({'model': model, 'messages': [{'role': 'user', 'content': prompt}], 'max_tokens': max_tokens, 'temperature': temperature, 'stream': True})
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f: f.write(body); fn = f.name
    try:
        r = subprocess.run(['curl', '-s', '-N', '--max-time', '480', '-X', 'POST', URL, '-H', 'Content-Type: application/json'] + (['-H', 'Authorization: Bearer ' + KEY] if KEY else []) + ['--data-binary', '@' + fn], capture_output=True, text=True)
        out = []; fin = None; err = None
        for line in r.stdout.split('\n'):
            line = line.strip()
            if not line.startswith('data:'):
                if line.startswith('{') and 'error' in line: err = line
                continue
            p = line[5:].strip()
            if p == '[DONE]': break
            try: j = json.loads(p)
            except Exception: continue
            if 'error' in j: err = str(j['error']); continue
            c = j.get('choices') or [{}]
            out.append((c[0].get('delta') or {}).get('content') or '')
            fin = c[0].get('finish_reason') or fin
        if err and not out: return {'error': err}
        if not fin: return {'error': 'truncated stream'}
        return {'choices': [{'message': {'content': ''.join(out)}}]}
    finally: os.unlink(fn)
from concurrent.futures import ThreadPoolExecutor
_ex = ThreadPoolExecutor(96)
async def chat(model, prompt, max_tokens=32000, temperature=0.2):
    for a in range(4):
        try:
            j = await asyncio.get_running_loop().run_in_executor(_ex, _post, model, prompt, max_tokens, temperature)
            if 'choices' not in j: raise RuntimeError(str(j)[:200])
            return j['choices'][0]['message']['content'] or ''
        except Exception as e:
            print('net-retry', str(e)[:120], flush=True); await asyncio.sleep(3 + a * 5)
    raise RuntimeError('chat failed')
def flat(o, p=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from flat(v, p + '.' + k if p else k)
    else: yield p, o
def setp(d, path, v):
    ks = path.split('.')
    for k in ks[:-1]: d = d.setdefault(k, {})
    d[ks[-1]] = v
def getp(d, path):
    for k in path.split('.'):
        if not isinstance(d, dict) or k not in d: return None
        d = d[k]
    return d
def phs(s): return sorted(re.findall(r'\{\w+\}', s))
def tagn(s): return len(re.findall(r'<(/?\w+)', s))
def parse_tab(t):
    out = {}
    for line in t.replace('\r', '').split('\n'):
        line = line.strip().strip('`')
        if '\t' not in line: continue
        k, v = line.split('\t', 1); out[k.strip()] = v.strip()
    return out
def check(en_v, v):
    if phs(en_v) != phs(v): return 'ph'
    if abs(tagn(en_v) - tagn(v)) > 0: return 'tags'
    return None
