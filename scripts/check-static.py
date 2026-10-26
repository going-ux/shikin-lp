from html.parser import HTMLParser
from pathlib import Path
LINK='https://px.a8.net/svt/ejp?a8mat=4BEFL9+A9Q87U+4JGG+BWVTE'
PIXEL='https://www14.a8.net/0.gif?a8mat=4BEFL9+A9Q87U+4JGG+BWVTE'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.scripts=[]; self.cards={}; self.resources=[]; self.ad_links=[]; self.pixels=[]; self.pending=False; self.depth=0; self.preview=[]; self.material_text=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='template': self.depth+=1
        if 'id' in a:
            assert a['id'] not in self.ids
            self.ids.add(a['id'])
        if self.depth:
            if tag=='a': self.ad_links.append(a)
            elif tag=='img': self.pixels.append(a)
            else: assert tag=='template'
            return
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='script' and 'src' in a: self.scripts.append(a['src'])
        if 'src' in a: self.resources.append(a['src'])
        if a.get('id')=='ququmo-affiliate-slot': self.pending=a.get('data-status')=='pending'
        if 'data-card' in a: self.cards[a['data-card']]='hidden' in a
        if a.get('data-preview-cta')=='true': self.preview.append(a)
    def handle_endtag(self,tag):
        if tag=='template':self.depth-=1
    def handle_data(self,data):
        if self.depth and data.strip():self.material_text.append(data.strip())
p=Page();p.feed(Path('index.html').read_text())
for link in p.links:
    assert link
    if link.startswith('#'): assert link[1:] in p.ids
for source in p.scripts: assert Path(source).is_file()
assert Path('CNAME').read_text().strip()=='shikin.diggworks.com'
assert p.cards=={'ququmo':False,'accel':True,'mynavi':True,'support':True,'try':True}
assert p.ad_links==[{'href':LINK,'rel':'nofollow'}]
assert p.pixels==[{'border':'0','width':'1','height':'1','src':PIXEL,'alt':''}]
assert p.material_text==['キャッチコピーやサービス内容＋【サービス名】をご入力下さい。']
assert p.pending and 'ququmo-a8-code' in p.ids
assert len(p.preview)==1 and p.preview[0]['aria-disabled']=='true'
assert not any('a8.net' in u or 'a8mat' in u or 'ququmo.com' in u for u in p.links+p.resources)
print('PASS: exact original A8 code held inert; no live link/pixel, stopped CTA, internal targets/assets/CNAME, other providers hidden')
