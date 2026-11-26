// Utilitários: formatação de datas, números, escape de HTML, hash, etc.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const digits = s => String(s||'').replace(/\D/g,'');
const pad = n => String(n).padStart(2,'0');
const uid = () => Math.random().toString(36).slice(2,10);
const code6 = () => String(Math.floor(100000 + Math.random()*900000));
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseYmd = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const longDate = s => cap(parseYmd(s).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
const shortDate = s => { const d = parseYmd(s); return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`; };
const nowStamp = () => { const d = new Date(); return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtKg = n => (Math.round(n*10)/10).toLocaleString('pt-BR');
const money = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const hashStr = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const hex16 = s => (hashStr(s).toString(16) + hashStr(s+'x').toString(16) + hashStr('y'+s).toString(16)).slice(0,20);
const initials = n => String(n||'?').trim().split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase();
const TODAY = new Date(); TODAY.setHours(0,0,0,0);
