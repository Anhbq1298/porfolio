// Builds assets/tools-banner.jpg: collage of tool snapshots. Run from repo root.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const tiles = [['Mcotis','mcotis-deflection.jpg'],['MCalcCanvas','mcalc-pdf.jpg'],['mCompositeBeamDesign','composite-ui.jpg'],['MBColumn Lite','mbclite-pmm.jpg'],
 ['MGT · Grasshopper','gh-trib.jpg'],['SP-Editor','sp-ui.jpg'],['PDFETABS Column Mapper','pdfetabs-after.jpg'],['Bridger','bridger-ui.jpg']];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2400,height:720}});
await p.setContent(`<style>body{margin:0;background:#0f2447;font-family:Inter,Arial,sans-serif}
.g{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr);gap:10px;padding:10px;height:700px}
.t{position:relative;border-radius:12px;overflow:hidden;background:#fff}.t img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;filter:saturate(1.35) contrast(1.05)}
.t span{position:absolute;left:12px;bottom:12px;background:#0f2447;color:#fff;font-weight:700;font-size:26px;padding:6px 14px;border-radius:8px}</style>
<div class="g">${tiles.map(([n,f])=>`<div class="t"><img src="data:image/jpeg;base64,${fs.readFileSync(path.resolve('assets',f)).toString('base64')}"><span>${n}</span></div>`).join('')}</div>`);
await p.waitForTimeout(500);await p.screenshot({path:'assets/tools-banner.jpg',type:'jpeg',quality:85});await b.close();})();
