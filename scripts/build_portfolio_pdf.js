// Builds assets/Mark_Bui_CV_and_Portfolio.pdf = Part 1 (CV) + Part 2 (print-out of the website).
// Usage (from repo root):  node scripts/build_portfolio_pdf.js path/to/Mark_Bui_Structural_CV.pdf
// Needs: playwright, @fontsource/inter, @fontsource/ibm-plex-mono, python3 (pypdf) .
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CV = path.resolve(process.argv[2] || 'assets/Mark_Bui_Structural_CV.pdf');
const OUT = path.join(ROOT, 'assets', 'Mark_Bui_CV_and_Portfolio.pdf');
const TMP = fs.mkdtempSync('/tmp/portfolio-pdf-');
const PORT = 8123;

const pages = [
  ['Portfolio · Home', 'index.html'],
  ['Project · 4th Broadway', 'projects/4th-broadway.html'],
  ['Project · SDC Belmont Data Center', 'projects/sdc-belmont.html'],
  ['Project · Apple Capstone Campus', 'projects/apple-capstone.html'],
  ['Project · Shellharbour Hospital', 'projects/shellharbour-hospital.html'],
  ['Tool · Mcotis', 'tools/mcotis.html'],
  ['Tool · MCalcCanvas', 'tools/mcalccanvas.html'],
  ['Tool · PDFETABS Column Mapper', 'tools/pdfetabs-column-mapper.html'],
  ['Tool · SP-Editor', 'tools/sp-editor.html'],
  ['Tool · mCompositeBeamDesign', 'tools/mcompositebeamdesign.html'],
  ['Tool · MBColumn Lite', 'tools/mbcolumn-lite.html'],
  ['Tool · Bridger', 'tools/bridger.html'],
  ['Tool · MGT', 'tools/mgt.html'],
];

const fontFile = (pkg, name) => {
  const dir = path.dirname(require.resolve(pkg + '/package.json'));
  return path.join(dir, 'files', name);
};
const FONT_CSS = [400, 500, 600, 700].flatMap(w => ['latin', 'latin-ext', 'vietnamese'].map(sub => {
  const f = fontFile('@fontsource/inter', `inter-${sub}-${w}-normal.woff2`);
  return fs.existsSync(f) ? { w, sub, f } : null;
})).filter(Boolean);
const rule = (family, weight, file) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;src:url(http://localhost:${PORT}/__font/${encodeURIComponent(path.basename(file))}) format('woff2')}`;
const cssText = [
  ...FONT_CSS.flatMap(({ w, f }) => w === 600 ? [rule('Inter', 600, f), rule('Inter', 650, f)] : w === 700 ? [rule('Inter', 700, f), rule('Inter', 750, f)] : [rule('Inter', w, f)]),
  ...[400, 500].map(w => rule('IBM Plex Mono', w, fontFile('@fontsource/ibm-plex-mono', `ibm-plex-mono-latin-${w}-normal.woff2`))),
].join('\n');
const fontFiles = new Map([
  ...FONT_CSS.map(({ f }) => [path.basename(f), f]),
  ...[400, 500].map(w => { const f = fontFile('@fontsource/ibm-plex-mono', `ibm-plex-mono-latin-${w}-normal.woff2`); return [path.basename(f), f]; }),
]);

const PRINT_CSS = `
  nav.top, .menu-btn, .book-launch, #open-book, dialog, .cta, .cv-download, .contact-cv, .skip-link, footer .top-link { display:none !important; }
  *{ animation:none !important; transition:none !important; }
  html{ scroll-behavior:auto !important; }
  section{ padding:34px 0 !important; }
  figure, .oc, .gallery figure, .tool-statement, .callout, .home-flow, table, .pager { break-inside:avoid; }
  h2,h3,h4,.sec-head{ break-after:avoid; }
  video{ display:none !important; }
`;

(async () => {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch();
  const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1200, height: 900 } });
  await context.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body: cssText }));
  await context.route(/fonts\.gstatic\.com/, r => r.abort());
  await context.route(/\/__font\//, r => {
    const name = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
    const f = fontFiles.get(name);
    return f ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f), headers: { 'access-control-allow-origin': '*' } }) : r.abort();
  });

  const files = [];
  const render = async (url, file, opts = {}) => {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print', colorScheme: 'light' });
    await page.addStyleTag({ content: PRINT_CSS });
    await page.evaluate(async () => {
      document.querySelectorAll('details').forEach(d => { d.open = true; });
      document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
      document.querySelectorAll('video[poster]').forEach(v => {
        const img = document.createElement('img');
        img.src = v.poster; img.style.width = '100%'; v.replaceWith(img);
      });
      await Promise.all(Array.from(document.images, i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
      await document.fonts.ready;
    });
    await page.waitForTimeout(400);
    await page.pdf({ path: file, format: 'A4', printBackground: true, scale: 0.7, margin: { top: '10mm', bottom: '12mm', left: '9mm', right: '9mm' },
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;font:8px Inter,Arial,sans-serif;color:#64748B;text-align:center">${opts.footer || ''}  ·  <span class="pageNumber"></span>/<span class="totalPages"></span></div>` });
    await page.close();
  };

  // Part 2 divider page
  const divider = path.join(TMP, 'divider.pdf');
  const dp = await context.newPage();
  await dp.setContent(`<style>@page{size:A4}body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;font-family:Inter,Arial,sans-serif;color:#172033}
    .box{max-width:520px;padding:0 40px}.k{color:#1F4788;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px}
    h1{font-size:44px;line-height:1.1;margin:12px 0}p{color:#64748B;font-size:16px;line-height:1.6}hr{border:0;border-top:3px solid #1F4788;width:64px;margin:24px 0}</style>
    <div class="box"><div class="k">Part 2</div><h1>Portfolio</h1><hr><p><b>Quang Anh Bui (Mark)</b><br>Structural Engineer &amp; Engineering Software Developer</p>
    <p>Print-out of the online portfolio: experience, project case studies and engineering tools. The live version, with videos and interactive workflows, is at <b>anhbq1298.github.io/porfolio</b>.</p></div>`);
  await dp.pdf({ path: divider, format: 'A4', printBackground: true });
  await dp.close();

  const rendered = [];
  for (const [title, rel] of pages) {
    const out = path.join(TMP, rel.replace(/[\/]/g, '_') + '.pdf');
    await render(`http://127.0.0.1:${PORT}/${rel}`, out, { footer: 'Quang Anh (Mark) Bui · Portfolio · ' + title });
    rendered.push([title, out]);
    console.log('rendered', rel);
  }
  await browser.close();
  server.kill();

  const py = `
import sys, json
from pypdf import PdfReader, PdfWriter
cv, divider, out, parts = sys.argv[1], sys.argv[2], sys.argv[3], json.loads(sys.argv[4])
w = PdfWriter()
def add(path, title, parent=None):
    r = PdfReader(path); start = len(w.pages)
    for p in r.pages: w.add_page(p)
    return w.add_outline_item(title, start, parent=parent)
add(cv, 'Part 1 · CV')
part2 = add(divider, 'Part 2 · Portfolio')
for title, f in parts: add(f, title, part2)
w.add_metadata({'/Title': 'Quang Anh (Mark) Bui — CV and Portfolio', '/Author': 'Quang Anh Bui'})
w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
for p in w.pages: p.compress_content_streams()
w.write(out)
`;
  execFileSync('python3', ['-c', py, CV, divider, OUT, JSON.stringify(rendered)], { stdio: 'inherit' });
  console.log('wrote', OUT, (fs.statSync(OUT).size / 1e6).toFixed(1) + ' MB');
})();
