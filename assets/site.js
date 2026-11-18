document.getElementById('yr').textContent = new Date().getFullYear();
const mb = document.querySelector('.menu-btn'), nl = document.getElementById('nav-links');
mb.addEventListener('click', () => { const o = nl.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nl.classList.remove('open'); mb.setAttribute('aria-expanded', false); }));

const lb = document.getElementById('lb'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p');
let last = null;
document.querySelectorAll('[data-full]').forEach(b => b.addEventListener('click', () => {
  last = b; lbImg.src = b.dataset.full; lbImg.alt = b.dataset.cap || ''; lbCap.textContent = b.dataset.cap || '';
  lb.classList.add('open'); lb.querySelector('button').focus();
}));
const close = () => { lb.classList.remove('open'); lbImg.src = ''; if (last) last.focus(); };
lb.addEventListener('click', e => { if (e.target !== lbImg) close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });

const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
document.getElementById('theme').addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});
