const LS_KEY = 'ecoaltotiete-prototipo-v1';
let S;
function load(){
  try { const raw = localStorage.getItem(LS_KEY); if (raw) { const d = JSON.parse(raw); if (d && d.version===1) return d; } } catch(e){}
  return seed();
}
function save(){ try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch(e){} }
S = load();
let HIST = historicalData();

try { if (S.session && !S.session.remember && !sessionStorage.getItem('eco-alive')) S.session = null; } catch(e){}

const ui = {
  f:{},           
  dd:null,        
  menu:false,    
  proto:false,    
  reg:{step:1, tipo:'usuario'},
  verify:null,   
  ident:null,     
  draft:{tipo:'ponto', ecopontoId:null, date:null, slot:null, month:null},
  pontos:{sel:null},
  notifFilter:'todas',
  rec:{search:'', status:'', date:'', cat:''},
  g:{agStatus:'', histCat:'', histRisco:'', relView:'grafico', ecoNew:false},
  timers:{}
};

const me = () => S.session ? S.users.find(u=>u.id===S.session.userId) : null;
const eco = id => S.ecopontos.find(e=>e.id===id);
const activeCats = () => CAT_ORDER.filter(c=>S.config.cats[c]);
const userSchedules = uid => S.schedules.filter(s=>s.userId===uid);
const unreadCount = uid => S.notifications.filter(n=>n.userId===uid && !n.lida).length;
const ptsFor = (cat, qtd) => Math.round(S.config.pontosPorDescarte * (Number(S.config.regras[cat])||1) * Math.max(1,qtd||1));
const statusUser = s => ({Pendente:'CONFIRMADO', Realizado:'ENTREGUE', Negado:'NEGADO', Cancelado:'CANCELADO'})[s] || s;
const statusGestor = s => ({Realizado:'Aprovado'})[s] || s;
function notify(userId, tipo, titulo, texto, acao){
  S.notifications.unshift({id:uid(), userId, tipo, titulo, texto, acao, lida:false, data:ymd(new Date())});
}
function addLog(nome, acao){ S.log.unshift({nome, acao, quando:nowStamp()}); S.log = S.log.slice(0,20); }
function slotTaken(dateStr, slot, ecoId){
  if (dateStr===ymd(new Date())) { const [h,m]=slot.split(' ')[0].split(':').map(Number), n=new Date(); if (n.getHours()*60+n.getMinutes() >= h*60+m) return true; }
  if (S.schedules.some(s=>s.data===dateStr && s.hora===slot && s.ecopontoId===ecoId && s.status!=='Cancelado' && s.status!=='Negado')) return true;
  return hashStr(dateStr+slot+(ecoId||'')) % 5 === 0;
}
function allRecords(){
  const real = S.schedules.map(s=>{
    const e = eco(s.ecopontoId);
    const it = CATALOG.find(c=>c.cat===s.categoria);
    return {id:s.id, data:s.data, cidade:e?e.cidade:'Mogi das Cruzes', categoria:s.categoria, equipamento:s.equipamento, kg:s.kg*1, risco:(it?it.risco:'Baixo').split(' ')[0], status:s.status==='Cancelado'?'Negado':s.status, nome:s.userNome};
  });
  return HIST.concat(real);
}
