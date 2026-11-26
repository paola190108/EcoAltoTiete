/*receptor*/
function viewRHome(){
  const u = me(), e = eco(u.ecopontoId), f = ui.rec;
  const rows = S.schedules.filter(s=>s.ecopontoId===u.ecopontoId && s.status!=='Cancelado')
    .filter(s=>!f.search || s.codigo.includes(f.search.trim()))
    .filter(s=>!f.status || s.status===f.status)
    .filter(s=>!f.date || s.data===f.date)
    .filter(s=>!f.cat || s.categoria===f.cat)
    .sort((a,b)=>(a.status==='Pendente'?0:1)-(b.status==='Pendente'?0:1) || b.data.localeCompare(a.data));
  return shell(`
    ${pageHead('Olá!','Gerencie o recebimento de resíduos eletrônicos e faça a triagem física dos lotes.')}
    ${e && e.status!=='Homologado'?`<div class="banner">${icon('info')} Seu ecoponto está <b>${esc(e.status.toLowerCase())}</b>. Ele aparecerá para os usuários após a aprovação do gestor.</div>`:''}
    <section class="card" style="margin-bottom:30px">
      <div class="filters">
        <div class="search inp-ic">${icon('search','lead')}<input class="inp soft" id="f-rec_search" placeholder="Buscar por código" value="${esc(f.search)}" data-rec="search" inputmode="numeric"></div>
        <div style="width:160px">${dropdown('rec_status', f.status, [{v:'',l:'Status: Todos'},{v:'Pendente',l:'Pendente'},{v:'Realizado',l:'Realizado'},{v:'Negado',l:'Negado'}], {plain:true})}</div>
        <input type="date" class="inp" style="width:170px" value="${f.date}" data-rec="date" aria-label="Filtrar por data">
      </div>
      <div class="row wrap" style="justify-content:center;margin-top:12px"><span class="lb cap" style="margin:0">Atalho categoria:</span>
        ${[['','Todas'],...CAT_ORDER.map(c=>[c,c])].map(([v,l])=>`<button class="chip sq ${f.cat===v?'on':''}" data-act="recCat" data-c="${v}">${l}</button>`).join('')}</div>
    </section>
    <section class="card" style="padding:0;min-height:450px">
      <div class="row" style="padding:20px 24px"><b class="faint">Histórico:</b><span class="spacer"></span><span class="muted" style="font-size:12.5px">${rows.length} registro${rows.length===1?'':'s'} · atualizado em tempo real</span></div>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Código / Data</th><th>Equipamento &amp; Qtd</th><th>Categoria</th><th>Usuário</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
        <tbody>${rows.length?rows.map(s=>`<tr>
          <td><b>${s.codigo}</b><div class="hint" style="margin:0">${s.data} ${s.hora.split(' ')[0]}</div></td>
          <td><b style="color:#7d8a83">${esc(s.equipamento)}</b><div class="hint" style="margin:0">${s.qtd} un (${fmtKg(s.kg)} kg) · ${s.tipo==='ponto'?'Entrega':'Retirada'}</div></td>
          <td>${catPill(s.categoria)}</td>
          <td><span class="muted">${esc(s.userNome)}</span><div class="hint" style="margin:0">${esc(s.telefone)}</div></td>
          <td><span class="st st-${s.status.toLowerCase()}">${s.status}</span></td>
          <td><div class="acts"><button class="btn sm outline" data-act="recDetails" data-id="${s.id}">Detalhes</button>
            ${s.status==='Pendente'?`<button class="btn sm danger" data-act="recDeny" data-id="${s.id}">${icon('x')} Negar</button><button class="btn sm dark" data-act="recConfirm" data-id="${s.id}">${icon('check')} Confirmar</button>`:''}
            ${s.status==='Realizado'?`<button class="btn sm blue" data-act="recReceipt" data-id="${s.id}">Recibo</button>`:''}
          </div></td></tr>`).join('') : `<tr><td colspan="6"><div class="empty">Nenhuma solicitação encontrada.</div></td></tr>`}</tbody>
      </table></div>
    </section>`);
}
function detailsDrawer(s){
  return `<aside class="drawer" role="dialog" aria-modal="true">
    <div class="drawer-h"><div><h2>Detalhes da Solicitação</h2><small>Código: <b style="color:#fff">${s.codigo}</b></small></div><button class="x" data-act="closeModal" aria-label="Fechar">${icon('x')}</button></div>
    <form data-form="recDetails" data-id="${s.id}" style="padding:16px 20px">
      <div class="box"><span class="lb cap">Resíduo / equipamento</span><div class="faint" style="font-weight:600">${esc(s.equipamento)}</div>
        <div class="row wrap" style="margin-top:8px"><span class="pill cat-${(CATS[s.categoria]||{cls:'branca'}).cls}">Categoria: ${esc(s.categoria)}</span><span>Qtd: ${s.qtd} un</span><span>Peso Est: ${fmtKg(s.kg)} kg</span></div></div>
      <div class="f2" style="gap:0 12px"><div class="box"><span class="lb cap">Data solicitação</span><div class="faint" style="font-weight:600">${s.data} ${s.hora.split(' ')[0]}</div></div>
        <div class="box"><span class="lb cap">Status atual</span><div style="font-weight:600"><span class="st st-${s.status.toLowerCase()}">${s.status}</span></div></div></div>
      <div class="box"><span class="lb cap">Usuário</span><div>${esc(s.userNome)} · ${esc(s.telefone)}</div><div class="hint">${s.tipo==='ponto'?'Entrega no ponto':'Retirada em: '+esc(s.local)}</div></div>
      <div class="box"><label class="lb cap" for="f-dt_estado">Estado do resíduo:</label><select class="inp" id="f-dt_estado" name="estado"><option value="">Descreva a condição física do material</option>${['Bom','Regular','Danificado'].map(o=>`<option ${s.estado===o?'selected':''}>${o}</option>`).join('')}</select></div>
      <div class="box"><label class="lb cap" for="f-dt_obs">Observações opcionais:</label><input class="inp" id="f-dt_obs" name="obs" placeholder="Digite observações" value="${esc(s.obs)}"></div>
      <div class="row" style="align-items:stretch;gap:14px;justify-content:flex-end">
        
        <button class="btn" type="submit" style="align-self:flex-end">Salvar</button>
      </div>
    </form></aside>`;
}
function receiptHTML(s){
  const e = eco(s.ecopontoId);
  return `<div class="receipt"><div class="head"><div class="brand"><img src="${IMG.logo}" alt="" style="background:var(--forest);border-radius:8px"><b>EcoAltoTietê</b></div><small>Comprovante Oficial de Recebimento de Resíduo</small></div>
    <div class="rl"><span>Código do Lote:</span><b>${s.codigo}</b></div>
    <div class="rl"><span>Ponto de Coleta:</span><b>${esc(e?e.nome:s.local)}</b></div>
    <div class="rl"><span>Data/Hora:</span><b>${s.data} ${s.hora.split(' ')[0]}</b></div>
    <div class="rl"><span>Resíduo:</span><b>${esc(s.equipamento)}</b></div>
    <div class="rl"><span>Categoria:</span><b>${esc(s.categoria)}</b></div>
    <div class="rl"><span>Estado:</span><b>${esc(s.estado||'Regular')}</b></div>
    <div class="valid"><b>RESÍDUO VALIDADO E AUTENTICADO</b>Código de verificação: ${hex16('lote'+s.codigo)}</div></div>`;
}
