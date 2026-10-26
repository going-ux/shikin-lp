from html.parser import HTMLParser
from pathlib import Path

LINK='https://px.a8.net/svt/ejp?a8mat=4BEFL9+A9Q87U+4JGG+BWVTE'
PIXEL='https://www14.a8.net/0.gif?a8mat=4BEFL9+A9Q87U+4JGG+BWVTE'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.scripts=[]; self.cards={}; self.resources=[]; self.ad_links=[]; self.pixels=[]; self.active_slot=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, 'duplicate ID'
            self.ids.add(a['id'])
        if tag=='a':
            self.links.append(a.get('href',''))
            if 'a8mat' in a.get('href','') or 'px.a8.net' in a.get('href',''): self.ad_links.append(a)
        if tag=='script' and 'src' in a: self.scripts.append(a['src'])
        if 'src' in a:
            self.resources.append(a['src'])
            if 'a8.net' in a['src']: self.pixels.append(a)
        if a.get('id')=='ququmo-affiliate-slot': self.active_slot=a.get('data-status')=='active'
        if 'data-card' in a: self.cards[a['data-card']]='hidden' in a
p=Page();p.feed(Path('index.html').read_text())
for link in p.links:
    assert link, 'empty href'
    if link.startswith('#'): assert link[1:] in p.ids, link
for source in p.scripts: assert Path(source).is_file(), source
assert Path('CNAME').read_text().strip()=='shikin.diggworks.com'
assert p.cards=={'ququmo':False,'accel':True,'mynavi':True,'support':True,'try':True}
# Exact issued URLs and attributes; no extra parameters, lazy-loading, or duplicate pixel.
assert p.ad_links==[{'href':LINK,'rel':'nofollow'}]
assert p.pixels==[{'border':'0','width':'1','height':'1','src':PIXEL,'alt':''}]
assert p.active_slot and 'ququmo-a8-code' not in p.ids
assert not any('ququmo.com' in x for x in p.links)
print('PASS: internal targets, assets, CNAME, exact single A8 link/pixel, retained hidden providers')
