// Builds assets/portfolio-banner.jpg: collage of structural models and renders (no confidential projects).
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const files = ['tb-render.jpg','sdc-model.jpg','hardrock-render.jpg','tb-etabs.jpg','okc-render.jpg','sdc-braces.jpg','tb-mat.jpg','shell-render.jpg'];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2400,height:720}});
await p.setContent(`<style>body{margin:0;background:#0f2447}.g{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr);gap:10px;padding:10px;height:700px}
.t{border-radius:12px;overflow:hidden;background:#fff}.t img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;filter:saturate(1.25) contrast(1.05)}</style>
<div class="g">${files.map(f=>`<div class="t"><img src="data:image/jpeg;base64,${fs.readFileSync(path.resolve('assets',f)).toString('base64')}"></div>`).join('')}</div>`);
await p.waitForTimeout(500);await p.screenshot({path:'assets/portfolio-banner.jpg',type:'jpeg',quality:85});await b.close();})();
