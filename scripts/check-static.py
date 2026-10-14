from html.parser import HTMLParser
from pathlib import Path
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.scripts=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, 'duplicate ID'
            self.ids.add(a['id'])
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='script' and 'src' in a: self.scripts.append(a['src'])
p=Page();p.feed(Path('index.html').read_text())
for link in p.links:
    assert link, 'empty href'
    if link.startswith('#'): assert link[1:] in p.ids, link
for source in p.scripts: assert Path(source).is_file(), source
assert Path('CNAME').read_text().strip()=='shikin.diggworks.com'
assert '#links-pending' not in p.links
assert len([x for x in p.links if 'ququmo.com' in x])==1
print('PASS: internal targets, script assets, CNAME, provider placeholder removal')
