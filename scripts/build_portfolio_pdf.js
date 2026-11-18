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

const SHEET_CSS = `
  @page{size:297mm 210mm;margin:0}
  html,body{margin:0;background:#fff}
  nav.top,.menu-btn,.book-launch,dialog,header.site,footer.site,main,section,.skip-link{display:none !important}
  *{animation:none !important;transition:none !important}
  .sheet{width:297mm;height:210mm;box-sizing:border-box;padding:16mm 13mm 14mm;position:relative;overflow:hidden;break-after:page;background:var(--surface,#fff);color:var(--text,#172033)}
  .sheet:last-child{break-after:auto}
  .sheet .fit{transform-origin:top left;width:100%}
  .sheet .book-page{overflow:visible !important;padding:0 !important;animation:none !important;font-size:15px;line-height:1.5;box-shadow:none !important;border:0 !important}
  .sheet .book-page > h3{font-size:30px;margin:2px 0 10px}
  .sheet .body{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:22px;align-items:start}
  .sheet .body.single{display:block;column-count:2;column-gap:26px}
  .sheet .body.single > *{break-inside:avoid}
  .sheet .book-gallery{margin:0;grid-template-columns:repeat(2,minmax(0,1fr))}
  .sheet .book-gallery img{max-height:62mm;object-fit:contain;width:100%;background:#fff}
  .sheet .book-gallery.many img{max-height:48mm}
  .sheet .book-gallery.many{grid-template-columns:repeat(3,minmax(0,1fr))}
  .sheet .book-details{margin:10px 0}
  .sheet .book-downloads,.sheet .more-link{display:none !important}
  .sheet .book-page .others{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
  .sheet .cardsbody{display:flex !important;flex-direction:column;column-count:auto}
  .sheet .cardsbody .top{display:flex;flex-wrap:wrap;align-items:center;gap:14px 24px;margin-bottom:6px}
  .sheet .cardsbody .top .desc{font-size:20px;flex:1 1 60%;margin:0}
  .sheet .cards-label{margin:14px 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#64748B}
  .sheet .cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;flex:1;min-height:0;grid-auto-rows:minmax(0,1fr)}
  .sheet .card-li{display:flex;gap:16px;align-items:center;padding:16px 20px;border:1px solid #E2E8F0;border-radius:12px;background:#F8FAFC;font-size:21px;line-height:1.45}
  .sheet .card-li .n{white-space:nowrap;flex:none;font:700 28px Inter,Arial,sans-serif;color:#1F4788;opacity:.85}
  .sheet .merged .two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:start}
  .sheet .toolbody{display:flex;flex-direction:column;gap:12px}
  .sheet .thead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
  .sheet .thead h3{margin:2px 0 0 !important;font-size:30px}
  .sheet .tgal{display:flex !important;gap:12px;flex:1 1 0;min-height:0;margin:0 !important;overflow:hidden}
  .sheet .tgal figure,.sheet .tgal a{margin:0;display:flex;flex-direction:column;min-width:0;min-height:0}
  .sheet .tgal figure{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden}
  .sheet .tgal a{flex:1;min-height:0;display:block}
  .sheet .tgal img{width:100%;height:100%;object-fit:contain;max-height:none !important;border:0 !important;border-radius:0 !important;background:transparent}
  .sheet .tgal figcaption{font-size:11px;padding:2px 8px}
  .sheet .tbot{display:grid;grid-template-columns:1.1fr 1.2fr .9fr;gap:16px;align-items:start;font-size:13px;line-height:1.4}
  .sheet .tbot .tool-statement{margin:0 0 8px}.sheet .tbot p{margin:2px 0 0;font-size:13px}
  .sheet .tbot .book-details{margin:0;padding:10px 12px}.sheet .tbot .book-details li{margin:3px 0;font-size:13px}
  .sheet .tbot .home-flow{margin:0 0 8px}.sheet .tbot .home-flow img{width:100%;height:auto}
  .sheet .tbot .tool-links{display:flex;gap:8px;flex-wrap:wrap}.sheet .tbot .tool-links a{font-size:12px;padding:6px 10px}
  .sheet .herorow{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);column-gap:24px;margin-bottom:12px}
  .sheet .herorow > *{grid-column:1}
  .sheet .herorow > .portrait{grid-column:2;grid-row:1 / span 6;max-width:none}
  .sheet .herorow .portrait img{max-height:210px;width:auto;max-width:100%;aspect-ratio:auto;margin-left:auto;display:block}
  .sheet .herorow > h3{font-size:34px;margin:0 0 4px}
  .sheet .herorow .stats{background:transparent !important;border:0 !important;grid-column:2;grid-row:1 / span 6;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:0;align-content:start}
  .sheet .herorow ~ .two{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}
  .sheet .herorow ~ .two > div:first-child{grid-column:1;grid-row:1}
  .sheet .herorow ~ .two > div:last-child{display:contents}
  .sheet .herorow ~ .two .skills{display:contents !important}
  .sheet .herorow ~ .two > div:first-child{grid-row:1 / span 2}
  .sheet .herorow ~ .two .skills > :nth-child(1){grid-column:2;grid-row:1}
  .sheet .herorow ~ .two .skills > :nth-child(2){grid-column:2;grid-row:2}
  .sheet .herorow ~ .two .skills > :nth-child(3){grid-column:3;grid-row:1 / span 2}
  .sheet .herorow ~ .two .dev-grid{grid-template-columns:minmax(0,1fr) !important}
  .sheet .herorow ~ .two .card, .sheet .herorow ~ .two > div:first-child > *{padding:10px 14px !important}
  .sheet .herorow ~ .two li, .sheet .herorow ~ .two p{margin-top:2px !important;margin-bottom:2px !important}
  .sheet .herorow ~ .two h3, .sheet .herorow ~ .two h4{margin:6px 0 3px !important}
  .sheet .herorow ~ .two .chips{margin-top:4px;gap:4px}
  .sheet .herorow .stat{padding:8px 12px !important}
  .sheet .why{margin:12px 0 8px;padding:10px 14px;border-left:4px solid #1F4788;background:#EEF3FB;border-radius:0 10px 10px 0;font-size:17px;line-height:1.5;color:#172033}
  .sheet .why b{color:#1F4788}
  .sheet .halves{display:grid;grid-template-columns:minmax(0,1fr) 2px minmax(0,1fr);gap:26px}
  .sheet .halves .sep{background:#CBD5E1;border-radius:2px}
  .sheet .half{display:flex;flex-direction:column;min-height:0;min-width:0}
  .sheet .half .desc{font-size:17px}
  .sheet .half .cards{grid-template-columns:minmax(0,1fr);flex:1}
  .sheet .corner{position:absolute;top:6mm;right:13mm;font:700 22px Inter,Arial,sans-serif;color:#1F4788;letter-spacing:.01em}
  .sheet .cover{height:100%}
  .sheet .cover .cv-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;height:calc(210mm - 16mm - 14mm - 30px);align-items:stretch}
  .sheet .cover.wide .cv-grid{grid-template-columns:minmax(0,1fr);grid-template-rows:auto 1fr}
  .sheet .cover.wide .cv-imgs{order:-1}
  .sheet .cover .cv-text{align-self:center}
  .sheet .cover .cv-k{color:#1F4788;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:14px}
  .sheet .cover h1{font-size:56px;line-height:1.05;margin:10px 0;text-transform:uppercase;letter-spacing:.02em}
  .sheet .cover hr{border:0;border-top:3px solid #1F4788;width:64px;margin:18px 0}
  .sheet .cover ul{margin:0;padding-left:20px;font-size:18px;line-height:1.6;color:#475569}
  .sheet .cover .cv-imgs{display:grid;gap:10px;min-height:0}
  .sheet .cover .cv-imgs.n6{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr))}
  .sheet .cover .cv-imgs.n1{grid-template-columns:1fr}
  .sheet .cover .cv-imgs img{width:100%;height:100%;object-fit:cover;border-radius:12px;min-height:0}
  .sheet .foot{position:absolute;left:13mm;right:13mm;bottom:6mm;display:flex;justify-content:space-between;font:10px Inter,Arial,sans-serif;color:#64748B}
  .sheet figure,.sheet .oc,.sheet .tool-statement,.sheet .home-flow{break-inside:avoid}
`;

(async () => {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch();
  const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1500, height: 940 } });
  await context.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body: cssText }));
  await context.route(/fonts\.gstatic\.com/, r => r.abort());
  await context.route(/\/__font\//, r => {
    const name = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
    const f = fontFiles.get(name);
    return f ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f), headers: { 'access-control-allow-origin': '*' } }) : r.abort();
  });

  // 1. Collect every Book View page (same content as the on-site Portfolio Book).
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load' });
  await page.click('#open-book');
  const count = await page.locator('.book-contents li').count();
  const sheets = [];
  for (let i = 0; i < count; i++) {
    await page.click('.book-contents summary');
    await page.locator('.book-contents li button').nth(i).click();
    await page.waitForTimeout(80);
    sheets.push(await page.evaluate(() => {
      const el = document.querySelector('.book-spread .book-page');
      return { title: el.querySelector('h3').textContent, html: el.outerHTML };
    }));
  }
  console.log('book pages:', count);

  // Merge About & Education with Core Skills into one two-column sheet.
  const ia = sheets.findIndex(x => x.title === 'About & Education');
  if (ia >= 0 && sheets[ia + 1] && sheets[ia + 1].title === 'Core Skills') {
    const inner = h => h.replace(/^<article[^>]*>/, '').replace(/<\/article>$/, '');
    sheets.splice(ia, 2, { title: 'About, Education & Skills', html: `<article class="book-page merged"><h3>About, Education &amp; Skills</h3><div class="two"><div>${inner(sheets[ia].html).replace(/<h3[^>]*>.*?<\/h3>/, '')}</div><div>${inner(sheets[ia + 1].html).replace(/<h3[^>]*>.*?<\/h3>/, '')}</div></div></article>` });
  }

  // Put About / Education / Skills on the first page together with the intro.
  if (sheets[0].title.startsWith('Bui Quang Anh') && sheets[1] && sheets[1].title === 'About, Education & Skills') {
    const inner = h => h.replace(/^<article[^>]*>/, '').replace(/<\/article>$/, '');
    const two = inner(sheets[1].html).replace(/^<h3[^>]*>.*?<\/h3>/, '');
    sheets.splice(0, 2, { title: sheets[0].title, html: `<article class="book-page merged"><div class="herorow">${inner(sheets[0].html)}</div>${two}</article>` });
  }

  // Merge the two sparse Meinhardt pages (7-storey school + 23-storey hospital) into one page with a separator.
  const i7 = sheets.findIndex(x => x.title.startsWith('7-storey'));
  if (i7 >= 0 && sheets[i7 + 1] && sheets[i7 + 1].title.startsWith('Public hospital')) {
    const inner = h => h.replace(/^<article[^>]*>/, '').replace(/<\/article>$/, '');
    sheets.splice(i7, 2, { title: '7-storey school · 23-storey hospital', html: `<article class="book-page merged twoproj"><div class="halves"><div class="half">${inner(sheets[i7].html)}</div><div class="sep"></div><div class="half">${inner(sheets[i7 + 1].html)}</div></div></article>` });
  }

  // Section cover pages: Working Projects, R&D Projects.
  const cover = (title, kicker, lines, imgs, wide) => ({ title, cover: true, html: `<article class="book-page cover ${wide ? 'wide' : ''}"><div class="cv-grid"><div class="cv-text"><div class="cv-k">${kicker}</div><h1>${title}</h1><hr><ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul></div><div class="cv-imgs n${imgs.length}">${imgs.map(i => `<img src="${i}">`).join('')}</div></div></article>` });
  const iw = sheets.findIndex(x => x.title === 'Airport project');
  const it = sheets.findIndex(x => x.title === 'Mcotis');
  if (it >= 0) sheets.splice(it, 0, cover('R&amp;D Projects', 'Portfolio · Engineering software', ['Mcotis · cable-supported truss FEM study engine', 'MCalcCanvas · human-readable calculation canvas', 'mCompositeBeamDesign · composite beam design to EC4', 'MBColumn Lite · fibre-section column checks', 'MGT · Grasshopper toolbox for ETABS / SAP2000', 'SP-Editor · ETABS-to-spColumn automation', 'PDFETABS Column Mapper · Bridger · Excel CSI ToolBox'], ['assets/tools-banner.jpg'], true));
  if (iw >= 0) sheets.splice(iw, 0, cover('Working Projects', 'Portfolio · Professional experience', ['Meinhardt (Singapore) · Airport · 7-storey school · Public hospital', 'Aurecon Viet Nam · Shellharbour Hospital', 'Thornton Tomasetti Viet Nam · SDC Belmont Data Center · Apple Capstone Campus · Hard Rock Hotel &amp; Casino Hellinikon · 4th Broadway · OKC Tower'], ['assets/sdc-render.jpg', 'assets/apple-render.jpg', 'assets/hardrock-render.jpg', 'assets/okc-render.jpg', 'assets/tb-render.jpg', 'assets/shell-render.jpg'], false));

  // 2. Lay them out one per landscape A4 sheet, shrinking each to fit.
  await page.evaluate(() => document.querySelector('#portfolio-book').close());
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.addStyleTag({ content: SHEET_CSS });
  await page.evaluate((sheets) => {
    const base = 'https://anhbq1298.github.io/porfolio/';
    document.body.querySelectorAll(':scope > *').forEach(n => { if (n.tagName !== 'SCRIPT') n.remove(); });
    sheets.forEach((s, i) => {
      const sheet = document.createElement('div'); sheet.className = 'sheet';
      sheet.innerHTML = `<div class="fit">${s.html}</div><div class="foot"><span>Bui Quang Anh (Mark) · Portfolio</span><span>${i + 1} / ${sheets.length}</span></div>`;
      const art = sheet.querySelector('.book-page');
      if (art.classList.contains('cover')) { sheet.dataset.cover = '1'; document.body.append(sheet); return; }
      Array.from(art.querySelectorAll('.about > *')).filter(e => /^\s*Hi, I/.test(e.textContent)).forEach(e => e.remove());
      art.querySelectorAll('.herorow .portrait').forEach(e => e.remove());
      art.querySelectorAll('.herorow .lead, .herorow .focus').forEach(e => e.remove());
      art.querySelectorAll('.dev-intro').forEach(e => e.remove());
      Array.from(art.querySelectorAll('p, div')).filter(e => /^\s*Trained colleagues/.test(e.textContent) && e.children.length === 0).forEach(e => e.remove());
      const heroRole = art.querySelector('.herorow .role');
      if (heroRole) { const w = document.createElement('div'); w.className = 'why'; w.innerHTML = '<b>Why me:</b> I design to ASCE / ACI / AISC, Eurocode and Australian Standards — and I write the software (ETABS API, Grasshopper, TypeScript apps) that makes the work faster, checkable and traceable.'; heroRole.after(w); }
      if (art.classList.contains('twoproj')) {
        sheet.dataset.twoproj = '1';
        art.querySelectorAll('.half').forEach(half => {
          const ul = half.querySelector('.proj-points');
          const grid = document.createElement('div'); grid.className = 'cards';
          Array.from(ul ? ul.children : []).forEach((li, n) => { const c = document.createElement('div'); c.className = 'card-li'; c.innerHTML = `<span class="n">${String(n + 1).padStart(2, '0')}</span><div>${li.innerHTML}</div>`; grid.append(c); });
          const lab = document.createElement('h4'); lab.className = 'cards-label'; lab.textContent = 'Scope of work';
          if (ul) ul.replaceWith(lab, grid);
        });
      }
      if (art.classList.contains('merged')) { art.querySelectorAll('img').forEach(im => { im.loading = 'eager'; }); document.body.append(sheet); return; }
      if (art.querySelector('.tool-statement')) {
        sheet.dataset.tool = '1';
        const pick = sel => Array.from(art.querySelectorAll(':scope > ' + sel));
        const chapter = art.querySelector(':scope > .book-chapter'), h3 = art.querySelector(':scope > h3');
        const badge = pick('.badge')[0], st = pick('.tool-statement'), flow = pick('.home-flow')[0], det = pick('.book-details')[0], gal = pick('.book-gallery')[0], links = pick('.tool-links')[0];
        const head = document.createElement('div'); head.className = 'thead';
        const hl = document.createElement('div'); [chapter, h3].forEach(x => x && hl.append(x)); head.append(hl); if (badge) head.append(badge);
        const bot = document.createElement('div'); bot.className = 'tbot';
        const c1 = document.createElement('div'); st.forEach(x => c1.append(x));
        const c2 = document.createElement('div'); if (det) c2.append(det);
        const c3 = document.createElement('div'); if (flow) c3.append(flow); if (links) c3.append(links);
        bot.append(c1, c2, c3);
        const wrap = document.createElement('div'); wrap.className = 'toolbody';
        wrap.append(head); if (gal) { gal.classList.add('tgal'); wrap.append(gal); } wrap.append(bot);
        art.replaceChildren(wrap);
        art.querySelectorAll('img').forEach(im => { im.loading = 'eager'; });
        art.querySelectorAll('a[href]').forEach(a => { a.href = new URL(a.getAttribute('href'), base).href; });
        document.body.append(sheet); return;
      }
      const heads = Array.from(art.children).filter(c => /^(P)$/.test(c.tagName) && c.classList.contains('book-chapter') || c.tagName === 'H3');
      const media = Array.from(art.children).filter(c => c.matches('.book-gallery, .home-flow, .others, .portrait'));
      const rest = Array.from(art.children).filter(c => !heads.includes(c) && !media.includes(c));
      const body = document.createElement('div');
      body.className = 'body' + (media.length ? '' : ' single');
      if (media.length && !rest.length) { body.className = 'body'; body.style.display = 'block'; media.forEach(c => body.append(c)); art.querySelectorAll('.others').forEach(o => o.style.gridTemplateColumns = 'repeat(3,minmax(0,1fr))'); }
      else if (media.length) {
        const l = document.createElement('div'), r = document.createElement('div');
        rest.forEach(c => l.append(c)); media.forEach(c => r.append(c));
        body.append(l, r);
      } else rest.forEach(c => body.append(c));
      const ul = body.classList.contains('single') && (body.querySelector('.proj-points') || body.querySelector('.book-details ul'));
      if (ul) {
        sheet.dataset.cards = '1';
        const items = Array.from(ul.querySelectorAll(':scope > li'));
        const grid = document.createElement('div'); grid.className = 'cards';
        items.forEach((li, n) => { const c = document.createElement('div'); c.className = 'card-li'; c.innerHTML = `<span class="n">${String(n + 1).padStart(2, '0')}</span><div>${li.innerHTML}</div>`; grid.append(c); });
        const top = document.createElement('div'); top.className = 'top';
        Array.from(body.children).forEach(c => { if (c !== ul && !c.contains(ul)) top.append(c); });
        const lab = document.createElement('h4'); lab.className = 'cards-label'; lab.textContent = 'Scope of work';
        body.replaceChildren(top, lab, grid);
        body.className = 'body cardsbody';
      }
      art.append(body);
      art.querySelectorAll('.book-gallery').forEach(g => { if (g.children.length > 4) g.classList.add('many'); });
      const g0 = body.querySelector('.book-gallery'); if (g0 && !body.classList.contains('single') && g0.children.length <= 2) body.style.gridTemplateColumns = 'minmax(0,.85fr) minmax(0,1.3fr)';
      art.querySelectorAll('img').forEach(im => { im.loading = 'eager'; });
      art.querySelectorAll('a[href]').forEach(a => { a.href = new URL(a.getAttribute('href'), base).href; });
      sheet.querySelectorAll('.contact-cv, .cv-download, a[download], .book-downloads').forEach(n => n.remove());
      document.body.append(sheet);
    });
  }, sheets);
  await page.evaluate(() => {
    document.querySelectorAll('.sheet').forEach(sh => {
      if (sh.querySelector('.herorow')) return;
      const chs = Array.from(sh.querySelectorAll('.book-page > .book-chapter:first-child, .half > .book-chapter:first-child, .thead .book-chapter:first-child'));
      if (!chs.length) return;
      const corner = document.createElement('div'); corner.className = 'corner'; corner.textContent = chs[0].textContent.trim();
      chs.forEach(c => c.remove());
      sh.append(corner);
    });
  });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images, i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    await document.fonts.ready;
  });
  await page.waitForTimeout(500);
  const layout = forced => page.evaluate(forced => Array.from(document.querySelectorAll('.sheet')).map(sh => {
    if (sh.dataset.cover) return 9;
    const fit = sh.querySelector('.fit'); const avail = sh.clientHeight - 64 - 40;
    const availW = sh.clientWidth - 98;
    const titles = fit.querySelector('.herorow') ? [] : Array.from(fit.querySelectorAll('.book-page > h3, .half > h3, .thead h3'));
    titles.forEach(t => { t.style.textTransform = 'uppercase'; t.style.letterSpacing = '.03em'; t.style.fontWeight = '700'; t.style.lineHeight = '1.15'; });
    const h = z => { fit.style.zoom = z; fit.style.width = (availW / z) + 'px'; titles.forEach(t => { t.style.fontSize = (22 / z) + 'px'; }); return fit.getBoundingClientRect().height; };
    let lo = 0.45, hi = sh.dataset.tool ? 1.0 : sh.dataset.cards ? 1.6 : 1.75;
    for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; if (h(m) <= avail) lo = m; else hi = m; }
    if (!forced) return lo;
    const z = forced; h(z);
    const tb = fit.querySelector('.toolbody');
    if (tb) {
      const top = (tb.getBoundingClientRect().top - fit.getBoundingClientRect().top) / z;
      tb.style.height = (avail / z - top - 14 / z) + 'px';
      tb.querySelectorAll('.tgal figure').forEach(f => { const im = f.querySelector('img'); const ar = (im.naturalWidth || 1) / (im.naturalHeight || 1); f.style.flex = `${ar} ${ar} 0`; });
    }
    const hv = fit.querySelector('.halves');
    if (hv) { const top = (hv.getBoundingClientRect().top - fit.getBoundingClientRect().top) / z; hv.style.height = (avail / z - top - 14 / z) + 'px'; }
    const cb = fit.querySelector('.cardsbody');
    if (cb) {
      const top = (cb.getBoundingClientRect().top - fit.getBoundingClientRect().top) / z;
      cb.style.height = (avail / z - top - 14 / z) + 'px';
    }
    // stretch gallery images to cover the remaining blank space of the sheet
    const body = fit.querySelector('.body:not(.single)');
    const gal = body && body.querySelector('.book-gallery');
    if (gal) {
      const top = (body.getBoundingClientRect().top - fit.getBoundingClientRect().top) / z;
      body.style.height = (avail / z - top) + 'px';
      body.style.alignItems = 'stretch';
      const right = body.lastElementChild; const tool = !!right.querySelector('.home-flow');
      right.style.cssText += ';height:100%;display:flex;flex-direction:column;gap:12px;min-height:0';
      const n = gal.children.length, cols = n === 1 ? 1 : 2;
      gal.classList.remove('many');
      gal.style.cssText += `;flex:1;min-height:0;overflow:hidden;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${Math.ceil(n / cols)},minmax(0,1fr))`;
      gal.querySelectorAll('figure,a').forEach(f => { f.style.cssText += ';display:flex;flex-direction:column;min-height:0;overflow:hidden'; });
      gal.querySelectorAll('figure > a, figure > button').forEach(x => { x.style.cssText += ';flex:1;min-height:0;display:block;overflow:hidden'; });
      gal.querySelectorAll('img').forEach(im => { im.style.cssText += `;flex:1;min-height:0;max-height:none;height:100%;object-fit:cover;object-position:top center`; });
    }
    return Math.round(z * 100);
  }), forced);
  const zs = await layout(0);
  const Z = Math.min(1, ...zs.filter(z => z < 9));
  console.log('fit zooms', zs.map(z => z.toFixed(2)).join(' '), '-> uniform', Z.toFixed(2));
  const report = await layout(Z);
  console.log('zoom %:', report.join(' '));
  const body = path.join(TMP, 'portfolio.pdf');
  await page.pdf({ path: body, preferCSSPageSize: true, printBackground: true });
  await page.close();

  const divider = path.join(TMP, 'divider.pdf');
  const dp = await context.newPage();
  const cov = n => fs.readFileSync(path.join(ROOT, 'assets', `cover-${n}.jpg`)).toString('base64');
  await dp.setContent(`<style>@page{size:297mm 210mm;margin:0}body{margin:0;height:210mm;display:grid;grid-template-columns:1fr 170mm;font-family:Inter,Arial,sans-serif;color:#172033}
    .box{align-self:center;padding:0 18mm}.k{color:#1F4788;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:14px}
    h1{font-size:64px;line-height:1.05;margin:10px 0}p{color:#64748B;font-size:18px;line-height:1.55;max-width:640px;margin:0 0 10px}hr{border:0;border-top:3px solid #1F4788;width:64px;margin:20px 0}
    .ph{height:210mm;display:grid;grid-template-columns:1fr 1fr;gap:3mm}.ph img{width:100%;height:210mm;object-fit:cover;display:block}.ph span{position:absolute;right:8px;bottom:6px;font-size:10px;color:#fff;opacity:.85}</style>
    <div class="box"><div class="k">Part 2</div><h1>Portfolio</h1><hr><p><b>Bui Quang Anh (Mark)</b> · Structural Engineer &amp; Engineering Software Developer</p>
    <p>Book-style print-out of the online portfolio: one page per project and tool. The live version, with videos and interactive workflows, is at <b>anhbq1298.github.io/porfolio</b>.</p></div>
    <div class="ph"><img src="data:image/jpeg;base64,${cov(1)}" style="object-position:30% center"><img src="data:image/jpeg;base64,${cov(2)}"></div>`);
  await dp.pdf({ path: divider, preferCSSPageSize: true, printBackground: true });
  await dp.close();
  await browser.close();
  server.kill();
  const rendered = [['All pages', body]];

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
r = PdfReader(parts[0][1]); st = len(w.pages)
import json as _j
titles = _j.load(open(sys.argv[5]))
for p in r.pages: w.add_page(p)
for i, t in enumerate(titles): w.add_outline_item(t, st + i, parent=part2)
w.add_metadata({'/Title': 'Bui Quang Anh (Mark) — CV and Portfolio', '/Author': 'Quang Anh Bui'})
w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
for p in w.pages: p.compress_content_streams()
w.write(out)
`;
  fs.writeFileSync(path.join(TMP,'titles.json'), JSON.stringify(sheets.map(s=>s.title)));
  execFileSync('python3', ['-c', py, CV, divider, OUT, JSON.stringify(rendered), path.join(TMP,'titles.json')], { stdio: 'inherit' });
  console.log('wrote', OUT, (fs.statSync(OUT).size / 1e6).toFixed(1) + ' MB');
})();
