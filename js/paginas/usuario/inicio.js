/*usuário comum*/
function userStats(u){
  const done = userSchedules(u.id).filter(s=>s.status==='Realizado');
  const kg = done.reduce((a,s)=>a+s.kg*1,0);
  const co2 = done.reduce((a,s)=>a+s.kg*(CO2_PER_KG[s.categoria]||3),0);
  return {n:done.length, kg, co2};
}
function nextVoucher(p){ const vs = S.vouchers.map(v=>v.pontos).sort((a,b)=>a-b); return vs.find(v=>v>p) || null; }

function viewUHome(){
  const u = me(), st = userStats(u);
  const nv = nextVoucher(u.pontos);
  const pct = nv ? Math.min(100, Math.round(u.pontos/nv*100)) : 100;
  const upcoming = userSchedules(u.id).filter(s=>s.status==='Pendente').sort((a,b)=>a.data.localeCompare(b.data)).slice(0,3);
  return shell(`
    ${pageHead(`Olá${u.nome?', '+esc(u.nome.split(' ')[0]):''}!`, 'Pronto(a) para descartar de forma consciente hoje?')}
    <div class="grid g-home">
      <section class="hero">
        <small>Não sabe como descartar?</small>
        <h2>Tire uma foto do seu eletrônico e descubra a categoria certa.</h2>
        <div class="row wrap">
          <button class="btn white" data-act="go" data-to="u/identificar">${icon('camera')} Identificar resíduo</button>
          <button class="btn" data-act="go" data-to="u/agendamento">${icon('calendar')} Agendar descarte</button>
        </div>
        ${icon('recycle','deco')}
      </section>
      <section class="card score">
        <div class="card-h"><span class="muted">Sua pontuação</span><span style="color:#c08a1e">${icon('trophy')}</span></div>
        <div class="big">${u.pontos}<small>pts</small></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <p class="hint" style="margin:0 0 14px">${st.n===0?'Faça seu primeiro descarte para ganhar pontos':nv?`Faltam ${nv-u.pontos} pts para o próximo voucher`:'Você já pode resgatar todos os vouchers!'}</p>
        <button class="btn light block" style="padding:9px" data-act="go" data-to="u/recompensas">Ver recompensas</button>
      </section>
    </div>
    <div class="grid g3" style="margin-top:18px">
      <div class="card stat"><div><div class="lbl">Descartes realizados</div><div class="val">${st.n}</div></div><span class="ic">${icon('refresh')}</span></div>
      <div class="card stat"><div><div class="lbl">Resíduos destinados</div><div class="val">${fmtKg(st.kg)}<small>kg</small></div></div><span class="ic">${icon('leaf')}</span></div>
      <div class="card stat"><div><div class="lbl">CO₂ evitado</div><div class="val">${fmtKg(st.co2)}<small>kg</small></div></div><span class="ic">${icon('badge')}</span></div>
    </div>
    <div class="grid g2" style="margin-top:18px">
      <section class="card">
        <div class="card-h"><h3>Próximos agendamentos</h3><button class="link" data-act="go" data-to="u/agendamento">Ver todos</button></div>
        ${upcoming.length ? upcoming.map(s=>{ const d=parseYmd(s.data); return `<div class="sched"><div class="d">${pad(d.getDate())}<small>${d.toLocaleDateString('pt-BR',{month:'short'}).replace('.','')}</small></div><div style="min-width:0"><b>${esc(s.equipamento)}</b><div class="hint" style="margin:2px 0 0">${s.hora} · ${s.tipo==='ponto'?esc(s.local):'Retirada em domicílio'}</div></div><span class="spacer"></span>${catPill(s.categoria)}</div>`; }).join('')
          : `<div class="empty">Nenhum agendamento ainda.</div>`}
      </section>
      <section class="card cats-list">
        <div class="card-h"><h3>Categorias de resíduos</h3><button class="link row" style="gap:4px" data-act="go" data-to="u/pontos">${icon('map')} Pontos</button></div>
        ${activeCats().map(c=>`<div class="r">${catPill(c)}<span>${CATS[c].desc}</span></div>`).join('')}
      </section>
    </div>`);
}
