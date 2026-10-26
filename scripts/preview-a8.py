"""Loopback-only A/B preview. No proxying or third-party requests. Do not deploy."""
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import argparse, json, re, subprocess
ROOT=Path(__file__).resolve().parents[1]
CSP="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'"
UI='''<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>QuQuMo 非公開ローカル比較</title>
<style>body{font-family:system-ui;margin:16px;background:#edf3fa;color:#123}button,select{font:inherit;padding:8px;margin:4px}main{display:flex;gap:16px;flex-wrap:wrap}iframe{height:740px;border:1px solid #aaa;background:white}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:white;padding:12px}h1{font-size:22px}h2{font-size:18px}</style>
<h1>QuQuMo A/B確認用（ローカル専用）</h1><p>A8・Googleへの通信なし。Bの文言・装飾は未承認候補です。クリック先はローカルの模擬画面です。</p>
<label>表示幅 <select id="width"><option>320</option><option selected>375</option><option>390</option><option>1024</option></select>px</label><button id="reload">最初から確認</button>
<main><section><h2>A：本番相当・送客停止</h2><iframe title="A 送客停止" src="/a" sandbox="allow-scripts allow-same-origin"></iframe></section><section><h2>B：設置候補・モック</h2><iframe title="B 設置候補" src="/b" sandbox="allow-scripts allow-same-origin"></iframe></section></main>
<h2>操作イベント（Googleには送信しません）</h2><pre id="events" aria-live="polite">ここに操作結果が表示されます。</pre><details><summary>発行コード原文（読取り専用・実通信なし）</summary><pre id="source"></pre></details>
<script>const frames=[...document.querySelectorAll('iframe')],log=document.getElementById('events');function resize(){frames.forEach(f=>f.style.width=document.getElementById('width').value+'px')}resize();document.getElementById('width').onchange=resize;document.getElementById('reload').onclick=()=>{log.textContent='';frames.forEach(f=>f.src=f.src)};window.addEventListener('message',e=>{if(e.origin!==location.origin||!frames.some(f=>f.contentWindow===e.source)||e.data?.kind!=='preview-event')return;log.textContent+=JSON.stringify(e.data)+'\\n'});fetch('/source').then(r=>r.json()).then(d=>document.getElementById('source').textContent=d.code);</script></html>'''
BRIDGE="""<script>window.addEventListener('lp:analytics',e=>parent.postMessage({kind:'preview-event',mode:location.pathname,event:e.detail},location.origin));document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.getAttribute('href')&&!a.getAttribute('href').startsWith('#')&&!a.getAttribute('href').startsWith('/mock/'))e.preventDefault()});</script>"""
ACTIVATE="""const slot=document.getElementById('ququmo-affiliate-slot');const fragment=document.getElementById('ququmo-a8-code').content.cloneNode(true);const a=fragment.querySelector('a'),img=fragment.querySelector('img');a.dataset.originalHref=a.getAttribute('href');a.setAttribute('href','/mock/ququmo');a.textContent='QuQuMoのサービス内容を確認する';img.dataset.originalSrc=img.getAttribute('src');img.setAttribute('src','/mock/pixel.gif');slot.replaceChildren(fragment);slot.dataset.status='active';const note=document.createElement('p');note.className='note';note.textContent='広告リンク設置候補です。ここではローカルの模擬画面へ移動します。';slot.appendChild(note);
"""
def original():
    s=(ROOT/'index.html').read_text()
    return re.search(r'<template id="ququmo-a8-code">(.*?)</template>',s,re.S).group(1)
def page(mode):
    baseline=ROOT/'preview-baseline.html'
    s=(baseline.read_text() if baseline.exists() else subprocess.check_output(['git','show','58a5181:index.html'],cwd=ROOT).decode()) if mode=='a' else (ROOT/'index.html').read_text()
    s=s.replace('content="index,follow"','content="noindex,nofollow"')
    # All non-fragment public links become inert local stubs in the served derivative.
    s=re.sub(r'href="(?:https?://|mailto:)[^"]*"','href="/mock/external"',s)
    s=s.replace('<script src="assets/config.js"','<script src="/assets/config.js"').replace('<script src="assets/analytics.js"',f'<script src="/assets/analytics-{mode}.js"')
    # Preserve the issued code in its inert template; activation maps it to local mocks only.
    if mode=='b': s=re.sub(r'(<template id="ququmo-a8-code">).*?(</template>)',lambda m:m[1]+original()+m[2],s,flags=re.S)
    if mode=='b':
        s=s.replace('ご案内は準備中です。現在、このページからお申込みいただくことはできません。','設置候補の表示確認です。申込みは行いません。')
        s=s.replace('当サイトはアフィリエイト広告の掲載を予定しています。','当サイトはアフィリエイト広告を掲載する想定の確認用画面です。')
        s=s.replace('広告リンクによる外部送客は現在停止しています。','この確認画面は広告リンク・計測画像の設置候補です。外部通信は行いません。')
    return s.replace('</head>', '<meta name="referrer" content="no-referrer"></head>').replace('</body>',BRIDGE+'</body>')
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.headers.get('Host') not in (f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}'):
            self.send_error(403);return
        path=self.path.split('?')[0]
        status=200;kind='text/html; charset=utf-8'
        if path=='/':body=UI
        elif path in ('/a','/b'):body=page(path[1:])
        elif path=='/source':kind='application/json';body=json.dumps({'code':original()},ensure_ascii=False)
        elif path=='/assets/config.js':kind='text/javascript';body=(ROOT/'assets/config.js').read_text()
        elif path in ('/assets/analytics-a.js','/assets/analytics-b.js'):
            kind='text/javascript';body=(ACTIVATE if path.endswith('-b.js') else '')+(ROOT/'assets/analytics.js').read_text().replace("'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId","'/mock/gtag.js'")
        elif path=='/mock/gtag.js':kind='text/javascript';body='// Mock only; dataLayer stays local.'
        elif path=='/mock/pixel.gif':
            kind='image/gif';body=bytes.fromhex('47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b')
        elif path.startswith('/mock/'):
            body='<html lang="ja"><meta charset="utf-8"><title>模擬遷移</title><h1>ローカルの模擬遷移です</h1><p>A8・QuQuMoへのアクセス、申込み、成果は発生していません。</p><button onclick="history.back()">プレビューへ戻る</button></html>'
        else:self.send_error(404);return
        payload=body.encode() if isinstance(body,str) else body
        self.send_response(status)
        for k,v in [('Content-Type',kind),('Content-Length',str(len(payload))),('Content-Security-Policy',CSP),('X-Robots-Tag','noindex, nofollow'),('Cache-Control','no-store'),('X-Content-Type-Options','nosniff')]:self.send_header(k,v)
        self.end_headers();self.wfile.write(payload)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8067);args=parser.parse_args()
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    print(f'Loopback-only preview: 127.0.0.1:{args.port}; no public URL',flush=True)
    server.serve_forever()
