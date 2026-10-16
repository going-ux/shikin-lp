from html.parser import HTMLParser
from pathlib import Path
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.scripts=[]; self.preview=[]; self.cards={}
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, 'duplicate ID'
            self.ids.add(a['id'])
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='script' and 'src' in a: self.scripts.append(a['src'])
        if 'data-card' in a: self.cards[a['data-card']]='hidden' in a
        if tag=='button' and a.get('data-preview-cta')=='true': self.preview.append(a)
p=Page();p.feed(Path('index.html').read_text())
for link in p.links:
    assert link, 'empty href'
    if link.startswith('#'): assert link[1:] in p.ids, link
for source in p.scripts: assert Path(source).is_file(), source
assert Path('CNAME').read_text().strip()=='shikin.diggworks.com'
assert '#links-pending' not in p.links
assert not any('ququmo.com' in x for x in p.links), 'prototype must not activate QuQuMo outbound'
assert len(p.preview)==1 and p.preview[0].get('data-public-url')=='https://ququmo.com/'
assert p.preview[0].get('aria-disabled')=='true'
assert p.cards=={'ququmo':False,'accel':True,'mynavi':True,'support':True,'try':True}, 'retain other records hidden even without JS'
print('PASS: internal targets, assets, CNAME, inactive prototype CTA and hidden retained providers')
