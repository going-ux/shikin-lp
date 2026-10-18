"""Validate SEO relationships for the single public landing page; no network requests."""
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.canonical = []
        self.title = []
        self.in_title = False
        self.h1_count = 0
        self.lang = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'h1': self.h1_count += 1
        if tag == 'title': self.in_title = True
        if tag == 'meta':
            key = a.get('name') or a.get('property')
            if key:
                assert key not in self.meta, f'duplicate metadata: {key}'
                self.meta[key] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a['href'])
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
    def handle_data(self, text):
        if self.in_title: self.title.append(text)

page = Head()
page.feed(Path('index.html').read_text())
origin = 'https://' + Path('CNAME').read_text().strip()
assert page.lang == 'ja' and page.h1_count == 1
assert page.canonical == [origin + '/']
assert '建設業' in ''.join(page.title) and 'QuQuMo' in ''.join(page.title)
assert page.meta['description'] and page.meta['viewport']
assert set(page.meta['robots'].split(',')) == {'index', 'follow'}
assert page.meta['og:url'] == page.canonical[0]
assert page.meta['og:type'] == 'website'
assert page.meta['og:title'] == ''.join(page.title)
assert page.meta['og:description'] == page.meta['description']
root = ET.parse('sitemap.xml').getroot()
assert root.tag == '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset'
urls = root.findall('{*}url')
assert len(urls) == 1 and urls[0].find('{*}loc').text == page.canonical[0]
robots = Path('robots.txt').read_text()
assert 'Sitemap: ' + origin + '/sitemap.xml' in robots
assert 'Allow: /' in robots and 'Disallow: /\n' not in robots
for directory in ['docs', 'tests', 'scripts']: assert f'Disallow: /{directory}/' in robots
qa = Head()
qa.feed(Path('tests/mobile-preview.html').read_text())
assert qa.meta['robots'] == 'noindex'
print('PASS SEO: Japanese/unique h1, metadata, canonical/OG/sitemap agreement, root crawl allowed, QA noindex')
