/* agendamento*/
function viewAgenda(){
  const u = me(), d = ui.draft;
  if (!d.month) { const t = new Date(TODAY); d.month = `${t.getFullYear()}-${pad(t.getMonth()+1)}`; }
  if (!d.ecopontoId || !eco(d.ecopontoId)) d.ecopontoId = S.ecopontos.find(e=>e.status==='Homologado')?.id;
  const [yy,mm] = d.month.split('-').map(Number);
  const first = new Date(yy, mm-1, 1), days = new Date(yy, mm, 0).getDate();
  const mine = userSchedules(u.id).filter(s=>s.status!=='Cancelado').sort((a,b)=>b.criado.localeCompare(a.criado)||b.data.localeCompare(a.data));
  const myDates = new Set(mine.filter(s=>s.status==='Pendente').map(s=>s.data));
  let cells = ''; for (let i=0;i<first.getDay();i++) cells += '<span></span>';
  for (let day=1; day<=days; day++){
    const dt = new Date(yy, mm-1, day), ds = ymd(dt);
    const disabled = dt < TODAY || dt.getDay()===0;
    cells += `<button ${disabled?'disabled':''} class="${ds===d.date?'sel':''} ${+dt===+TODAY?'today':''} ${myDates.has(ds)?'has':''}" data-act="pickDate" data-d="${ds}" aria-label="${longDate(ds)}">${day}</button>`;
  }
  const monthName = cap(first.toLocaleDateString('pt-BR',{month:'long', year:'numeric'}));
  const canPrev = new Date(yy, mm-1, 1) > new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const slots = d.date ? SLOTS.map(s=>{ const taken = slotTaken(d.date, s, d.ecopontoId); return `<button class="slot ${d.slot===s?'on':''}" ${taken?'disabled':''} data-act="pickSlot" data-s="${s}"><span>${s}</span>${taken?'<small>Ocupado</small>':d.slot===s?icon('checkc'):''}</button>`; }).join('')
    : `<div class="empty" style="padding:24px 0">Selecione um dia no calendário.</div>`;
  const ecos = S.ecopontos.filter(e=>e.status==='Homologado');
  return shell(`
    ${pageHead('Agendamento','Escolha como, onde e quando descartar.')}
    <div class="grid g-sched">
      <div class="grid" style="gap:14px">
        <section class="card">
          <div class="mode">
            <button class="${d.tipo==='ponto'?'on':''}" data-act="mode" data-m="ponto">${icon('store')}Entregar no ponto</button>
            <button class="${d.tipo==='domicilio'?'on':''}" data-act="mode" data-m="domicilio">${icon('house')}Retirada em domicílio</button>
          </div>
          ${field('Equipamento', input('ag_eq',{ph:'Ex.: notebook, TV, geladeira'}))}
          <div class="f2" style="gap:0 20px">
            ${field('Quantidade', input('ag_qtd',{type:'number', attrs:'min="1" max="20"', val:fv('ag_qtd','1')}))}
            ${field('Categoria', dropdown('ag_cat', fv('ag_cat','Verde'), activeCats().map(c=>({v:c,l:c})), {title:'Categoria'}))}
          </div>
          ${d.tipo==='ponto'
            ? field('Ecoponto', `<select class="inp" data-bind="ag_eco" data-act-change="agEco">${ecos.map(e=>`<option value="${e.id}" ${e.id===d.ecopontoId?'selected':''}>${esc(e.nome)} — ${esc(e.cidade)}</option>`).join('')}</select>`)
            : field('Endereço para retirada', input('ag_end',{val:fv('ag_end', u.rua ? `${u.rua} - ${u.bairro||''}, ${u.cidade||''}` : ''), ph:'Rua, número, bairro'}))}
        </section>
        <section class="card">
          <div class="grid g-cal">
            <div>
              <div class="cal-h"><b>${monthName}</b><div class="cal-nav"><button data-act="month" data-dir="-1" ${canPrev?'':'disabled style="opacity:.4"'} aria-label="Mês anterior">${icon('left')}</button><button data-act="month" data-dir="1" aria-label="Próximo mês">${icon('right')}</button></div></div>
              <div class="cal">${['DOM','SEG','TER','QUA','QUI','SEX','SÁB'].map(w=>`<span class="dw">${w}</span>`).join('')}${cells}</div>
            </div>
            <div>
              <b style="font-size:15px">Horários disponíveis</b>
              <div class="faint" style="font-size:12px;margin:2px 0 14px">${d.date?longDate(d.date).replace(/ de \d{4}$/,''):'—'}</div>
              ${slots}
              <button class="btn dark block" style="margin-top:8px" data-act="confirmAgenda">Confirmar agendamento</button>
            </div>
          </div>
        </section>
      </div>
      <section class="card">
        <h3 style="text-align:center">Meus agendamentos</h3>
        ${mine.length ? mine.map(s=>`<div class="ag">
            <div class="codes"><span>CÓDIGO: ${s.codigo}</span><span class="s ${s.status==='Negado'?'neg':''}">Status: ${statusUser(s.status)}</span></div>
            <p><b>Data:</b> ${longDate(s.data)}</p><p><b>Horário:</b> ${s.hora}</p><p><b>Tipo:</b> ${s.tipo==='ponto'?'Entrega no ponto':'Retirada domiciliar'}</p><br>
            <p><b>Resíduo:</b> ${esc(s.equipamento)}</p><p><b>Quantidade:</b> ${s.qtd}</p><br>
            <p><b>Local:</b> ${esc(s.local)}</p>
            <div class="row" style="margin-top:10px"><button class="btn sm outline" data-act="comprovante" data-id="${s.id}">Comprovante</button>${s.status==='Pendente'?`<button class="btn sm ghost" style="color:var(--danger)" data-act="cancelAg" data-id="${s.id}">Cancelar</button>`:''}</div>
          </div>`).join('') : `<div class="empty">Nenhum agendamento ainda.</div>`}
      </section>
    </div>`, 'u/agendamento');
}
function comprovanteHTML(s){
  return `<div class="receipt"><div class="head"><div class="brand"><img src="${IMG.logo}" alt="" style="background:var(--forest);border-radius:8px"><b>EcoAltoTietê</b></div><small>Comprovante de agendamento</small></div>
    <div class="rl"><span>Código:</span><b>${s.codigo}</b></div>
    <div class="rl"><span>Status:</span><b>${statusUser(s.status)}</b></div>
    <div class="rl"><span>Data:</span><b>${longDate(s.data)}</b></div>
    <div class="rl"><span>Horário:</span><b>${s.hora}</b></div>
    <div class="rl"><span>Tipo:</span><b>${s.tipo==='ponto'?'Entrega no ponto':'Retirada domiciliar'}</b></div>
    <div class="rl"><span>Resíduo:</span><b>${esc(s.equipamento)}</b></div>
    <div class="rl"><span>Quantidade:</span><b>${s.qtd}</b></div>
    <div class="rl"><span>Categoria:</span><b>${esc(s.categoria)}</b></div>
    <div class="rl"><span>Local:</span><b>${esc(s.local)}</b></div>
    <div class="valid"><b>Apresente este código no momento da entrega</b>Pontos previstos: +${ptsFor(s.categoria,s.qtd)} pts</div></div>`;
}
