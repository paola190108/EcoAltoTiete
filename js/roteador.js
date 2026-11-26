const ROUTES = {
  'login':viewLogin, 'cadastro':viewCadastro, 'confirmar-email':viewVerify, 'recuperar':viewRecover, 'nova-senha':viewNewPass,
  'u/inicio':viewUHome, 'u/identificar':viewIdent, 'u/pontos':viewPontos, 'u/agendamento':viewAgenda, 'u/recompensas':viewRewards, 'u/notificacoes':viewNotifs, 'u/perfil':viewUProfile, 'u/sobre':viewAbout,
  'r/inicio':viewRHome, 'r/perfil':viewRProfile,
  'g/inicio':viewGHome, 'g/ecopontos':viewGEco, 'g/relatorios':viewGRel, 'g/configuracoes':viewGConf
};
const HOME = {usuario:'u/inicio', receptor:'r/inicio', gestor:'g/inicio'};
const PREFIX = {usuario:'u', receptor:'r', gestor:'g'};
const route = () => (location.hash.replace(/^#\/?/,'') || '').split('?')[0];
function go(r){ if (location.hash !== '#/'+r) location.hash = '#/'+r; else render(); }

function render(){
  let r = route();
  const u = me();
  const isAuth = ['login','cadastro','confirmar-email','recuperar','nova-senha'].includes(r);
  if (!ROUTES[r]) { go(u ? HOME[u.tipo] : 'login'); return; }
  if (!isAuth && !u) { go('login'); return; }
  if (!isAuth && u && r.split('/')[0] !== PREFIX[u.tipo]) { go(HOME[u.tipo]); return; }
  if (r==='login' && u) { go(HOME[u.tipo]); return; }
  const y = window.scrollY;
  document.getElementById('app').innerHTML = ROUTES[r]();
  renderProto();
  if (ui._keepScroll) window.scrollTo(0,y); else window.scrollTo(0,0);
  ui._keepScroll = false;
  if (ui._focus) { const el = document.getElementById(ui._focus); if (el) el.focus(); ui._focus=null; }
  afterRender(r);
}
const rerender = () => { ui._keepScroll = true; render(); };
window.addEventListener('hashchange', () => { ui.dd=null; ui.menu=false; render(); });

function renderProto(){
  const root = document.getElementById('proto-root');
  if (root) root.innerHTML = '';
}


function afterRender(r){
  clearInterval(ui.timers.resend);
  if (r==='confirmar-email' || r==='recuperar'){
    ui.timers.resend = setInterval(()=>{ const el = document.getElementById('resend'); if (el) el.innerHTML = resendLabel(); }, 1000);
  }
  const drop = document.getElementById('drop');
  if (drop){
    drop.addEventListener('dragover', e=>{ e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', ()=>drop.classList.remove('over'));
    drop.addEventListener('drop', e=>{ e.preventDefault(); drop.classList.remove('over'); classify(e.dataTransfer.files[0]); });
  }
}
