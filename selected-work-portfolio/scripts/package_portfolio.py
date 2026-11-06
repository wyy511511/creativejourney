"""Build portable HTML, source ZIP and a ready-to-upload static Pages ZIP."""
from pathlib import Path
import base64
import json
import mimetypes
import re
import zipfile

project = Path(__file__).resolve().parents[1]
workspace = project.parent
dist = project / "dist"
html = (dist / "index.html").read_text()
js = (dist / "app.js").read_text()
assets = {
    f"assets/{file.name}": (
        f"data:{mimetypes.guess_type(file.name)[0]};base64,"
        + base64.b64encode(file.read_bytes()).decode()
    )
    for file in sorted((dist / "assets").iterdir())
    if file.is_file()
}
for stylesheet in ('styles.css', 'story.css'):
    css = (dist / stylesheet).read_text()
    html = html.replace(f'<link rel="stylesheet" href="{stylesheet}">', '<style>' + css + '</style>')
html = html.replace('<script src="app.js" defer></script>', '')
html = re.sub(
    r'\b(src|href)="(assets/[^"<>]+)"',
    lambda match: f'data-local-{match[1]}="{match[2]}"',
    html,
)
js = js.replace(
    'dialogContent.innerHTML = content;',
    r'dialogContent.innerHTML = content.replace(/assets\/[A-Za-z0-9._-]+/g, name => embeddedAssets[name] || name);',
)
bootstrap = 'const embeddedAssets = ' + json.dumps(assets, separators=(',', ':')) + ';\n'
bootstrap += '''document.querySelectorAll('[data-local-src],[data-local-href]').forEach(el => {
  for (const attr of ['src','href']) {
    const path = el.getAttribute('data-local-' + attr);
    if (path) {
      el.setAttribute(attr, embeddedAssets[path] || path);
      el.removeAttribute('data-local-' + attr);
    }
  }
});\n'''
html = html.replace('</body>', '<script>\n' + bootstrap + js + '\n</script>\n</body>')
standalone = workspace / 'Selected-Work-Portfolio.html'
standalone.write_text(html)
archive = workspace / 'Selected-Work-Portfolio.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as out:
    for file in sorted(project.rglob('*')):
        relative = file.relative_to(project)
        if file.is_file() and not any(part in {'.git', '__pycache__', 'outputs', 'node_modules'} for part in relative.parts):
            out.write(file, Path('selected-work-portfolio') / relative)
    out.write(standalone, standalone.name)
with zipfile.ZipFile(archive) as out:
    assert out.testzip() is None, 'Corrupt ZIP member'
    assert not any('/.git/' in name for name in out.namelist())
pages_archive = workspace / 'Creative-Journey-GitHub-Pages.zip'
with zipfile.ZipFile(pages_archive, 'w', zipfile.ZIP_DEFLATED) as out:
    for file in sorted(dist.rglob('*')):
        if file.is_file() and file.name != '.DS_Store':
            out.write(file, file.relative_to(dist))
with zipfile.ZipFile(pages_archive) as out:
    assert out.testzip() is None, 'Corrupt Pages ZIP member'
    assert 'index.html' in out.namelist()
    assert '.nojekyll' in out.namelist()
print(f'Portable HTML: {standalone.name} ({standalone.stat().st_size / 1048576:.2f} MB)')
print(f'Source ZIP: {archive.name} ({archive.stat().st_size / 1048576:.2f} MB)')
print(f'GitHub Pages ZIP: {pages_archive.name} ({pages_archive.stat().st_size / 1048576:.2f} MB)')
