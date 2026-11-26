// Gestor: página inicial.
function viewGHome(){
  const recs = allRecords();
  const done = recs.filter(r=>r.status==='Realizado');
  const kg = done.reduce((a,r)=>a+r.kg,0);
  const usersN = S.users.filter(u=>u.tipo!=='gestor').length;
  const pendEco = S.ecopontos.filter(e=>e.status==='Pendente de homologação').length;
  const homEco = S.ecopontos.filter(e=>e.status==='Homologado').length;
  const pendAg = S.schedules.filter(s=>s.status==='Pendente').length;
  const ags = S.schedules.filter(s=>s.status!=='Cancelado').filter(s=>!ui.g.agStatus || statusGestor(s.status)===ui.g.agStatus).sort((a,b)=>b.data.localeCompare(a.data)).slice(0,6);
  const hist = done.filter(r=>(!ui.g.histCat||r.categoria===ui.g.histCat) && (!ui.g.histRisco||r.risco===ui.g.histRisco)).sort((a,b)=>b.data.localeCompare(a.data)).slice(0,4);
  return shell(`
    ${pageHead('Painel de Gestor','Acompanhe os indicadores e as atividades do sistema.')}
    <div class="grid g3">
      <div class="card"><div class="muted">Total de descartes</div><div style="font-size:30px;font-weight:700;margin:6px 0">${done.length}</div><div class="hint" style="margin:0">Registros realizados</div></div>
      <div class="card"><div class="muted">Impacto ambiental</div><div style="font-size:30px;font-weight:700;margin:6px 0">${Math.round(kg).toLocaleString('pt-BR')} kg</div><div class="hint" style="margin:0">Resíduos destinados</div></div>
      <div class="card"><div class="muted">Usuários ativos</div><div style="font-size:30px;font-weight:700;margin:6px 0">${usersN}</div><div class="hint" style="margin:0">Doador e Receptor</div></div>
    </div>
    <div class="grid g2" style="margin-top:18px;grid-template-columns:1.1fr 1fr">
      <section class="card"><h3>Notificações pendentes</h3>
        <div class="row" style="border-bottom:1px solid var(--line);padding:10px 0"><span>Solicitações de Receptores</span><span class="spacer"></span><span class="muted" style="font-size:13px">${pad(pendEco)} aguardando análise</span></div>
        <div class="row" style="padding:12px 0"><span>Agendamentos</span><span class="spacer"></span><span class="muted" style="font-size:13px">${pad(pendAg)} aguardando análise</span></div>
        <button class="link" data-act="go" data-to="g/ecopontos">Ver solicitações</button></section>
      <section class="card"><h3>Pontos de coleta</h3><p class="muted" style="margin:0 0 16px;font-size:13px">Mapa por status de homologação</p>
        <div class="row wrap" style="align-items:flex-end;gap:16px 60px"><div><div class="muted" style="font-size:13px">Pendentes</div><b style="font-size:26px">${pendEco}</b></div><div><div class="muted" style="font-size:13px">Homologados</div><b style="font-size:26px">${homEco}</b></div><span class="spacer"></span><button class="link" data-act="gMap">Visualizar mapa</button></div></section>
    </div>
    <div class="grid g-gh" style="margin-top:22px">
      <section class="card" style="min-height:360px"><h3 style="margin-bottom:6px">Agendamentos recentes</h3>
        <div class="row" style="margin-bottom:10px"><span class="muted" style="font-size:12.5px">Filtrar por status</span><div style="width:170px">${dropdown('g_ag', ui.g.agStatus, [{v:'',l:'Todos os status'},{v:'Pendente',l:'Pendente'},{v:'Aprovado',l:'Aprovado'},{v:'Negado',l:'Negado'}], {plain:true})}</div></div>
        <div class="tbl-wrap"><table class="tbl simple"><thead><tr><th>Solicitante</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead><tbody>
          ${ags.map(s=>`<tr><td>${esc(s.userNome)}</td><td>${shortDate(s.data)}</td><td><span class="pill st-${statusGestor(s.status).toLowerCase()}" style="border:0">${statusGestor(s.status)}</span></td><td><button class="link" style="font-weight:500" data-act="gAgDetails" data-id="${s.id}">Ver detalhes</button></td></tr>`).join('') || '<tr><td colspan="4"><div class="empty">Nenhum agendamento.</div></td></tr>'}
        </tbody></table></div></section>
      <section class="card"><h3>Histórico de descartes</h3>
        <div class="f2" style="gap:12px"><div><label class="lb" style="font-size:12px;color:var(--muted)">Categoria</label>${dropdown('g_hc', ui.g.histCat, [{v:'',l:'Todas'},...CAT_ORDER.map(c=>({v:c,l:c}))], {plain:true})}</div>
          <div><label class="lb" style="font-size:12px;color:var(--muted)">Nível de risco</label>${dropdown('g_hr', ui.g.histRisco, [{v:'',l:'Todos'},{v:'Baixo',l:'Baixo'},{v:'Médio',l:'Médio'},{v:'Alto',l:'Alto'}], {plain:true})}</div></div>
        <div style="margin:14px 0 4px">${hist.map(r=>`<div class="row" style="font-size:12.5px;padding:6px 0;border-bottom:1px dashed var(--line)">${catPill(r.categoria)}<span>${esc(r.equipamento)}</span><span class="spacer"></span><span class="muted">${shortDate(r.data)}</span></div>`).join('') || '<div class="hint">Nenhum registro.</div>'}</div>
        <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
        <h3>Log de atividades</h3>
        ${S.log.slice(0,4).map(l=>`<div class="log"><span class="av">${esc(initials(l.nome))}</span><div><b>${esc(l.nome)}</b><span class="muted" style="font-size:13px">${esc(l.acao)}</span><br><small>${esc(l.quando)}</small></div></div>`).join('')}
      </section>
    </div>`);
}
