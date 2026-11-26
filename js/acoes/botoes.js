const ACTIONS = {
  noop(){},
  go(el){ ui.menu=false; ui.proto=false; if (el.dataset.to==='g/ecopontos') ui.g.ecoNew=false; go(el.dataset.to); },
  menu(){ ui.menu=!ui.menu; rerender(); },
  proto(){ ui.proto=!ui.proto; renderProto(); },
  closeModal(){ closeModal(); },
  modalOk(){ const cb = modalCb.ok; closeModal(); cb && cb(); },
  toggleEye(el){ const k='_show_'+el.dataset.key; ui.f[k]=!ui.f[k]; ui._focus='f-'+el.dataset.key; rerender(); },
  ddToggle(el){ ui.dd = ui.dd===el.dataset.key ? null : el.dataset.key; rerender(); },
  ddPick(el){ const k=el.dataset.key, v=el.dataset.val; ui.dd=null; (DD[k]||((v)=>ui.f[k]=v))(v); rerender(); },
  demoLogin(el){ ui.proto=false; doLogin(el.dataset.email,'eco12345',false); },
  demoAlert(el){ alertT(el.dataset.k); },
  logout(){ S.session=null; save(); ui.f={}; ui.proto=false; ui.ident=null; ui.verify=null; go('login'); },
  resetData(){ confirmBox('Restaurar dados iniciais?','Todos os cadastros, agendamentos e alterações feitos no protótipo serão apagados deste navegador.','Restaurar', ()=>{ S=seed(); HIST=historicalData(); save(); ui.f={}; ui.proto=false; ui.ident=null; ui.verify=null; toast('ok','Dados restaurados'); go('login'); }, {cancel:'Voltar'}); },

  /* cadastro */
  regBack(){ ui.reg.step=Math.max(1,ui.reg.step-1); render(); },
  terms(){ openModal(`<div class="modal md"><div class="modal-h"><div><h2>Termos de privacidade</h2><span class="muted">Resumo — protótipo</span></div><button class="x" data-act="closeModal">${icon('x')}</button></div><div class="mb" style="font-size:13.5px;line-height:1.6;color:#3a4540">
    <p style="color:inherit">Coletamos nome, contato, documento e endereço apenas para viabilizar o agendamento e a destinação correta dos resíduos, conforme a LGPD (Lei nº 13.709/2018).</p>
    <p style="color:inherit">Seus dados são compartilhados somente com o ecoponto responsável pelo recebimento e com a gestão pública regional, de forma agregada, para relatórios de impacto ambiental.</p>
    <p style="color:inherit">Você pode solicitar a exclusão da conta a qualquer momento em <b>Meu perfil → Excluir conta</b>.</p>
    <div class="row"><span class="spacer"></span><button class="btn" data-act="acceptTerms">Li e aceito</button></div></div></div>`); },
  acceptTerms(){ ui.f.reg_terms=true; closeModal(); rerender(); },
  resend(){ const v=ui.verify; if(!v) return; startVerify(v.email, v.purpose); rerender(); },
  sendRecover(el){
    const id = fv('rec_id').trim();
    const u = S.users.find(x=>x.email.toLowerCase()===id.toLowerCase() || (x.telefone && digits(x.telefone)===digits(id) && digits(id).length>=10));
    if (!id || (/@/.test(id) && !validEmail(id))) { alertT('email'); return; }
    if (!u) { toast('err','Conta não encontrada','Não há conta com esse e-mail ou telefone.'); return; }
    if (startVerify(u.email,'senha')) { ui.verify.userId=u.id; rerender(); }
  },

  /* usuário */
  identToPontos(){ ui.f.p_cat = ui.ident.result.cat; ui.f.p_city=''; ui.f.p_bairro=''; go('u/pontos'); },
  identToAgenda(){ const r=ui.ident.result; ui.f.ag_eq = cap(r.nome.toLowerCase()); ui.f.ag_cat=r.cat; go('u/agendamento'); },
  selEco(el){ ui.pontos.sel=el.dataset.id; rerender(); },
  clearPontos(){ ui.f.p_city=''; ui.f.p_cat=''; ui.f.p_bairro=''; rerender(); },
  locate(){
    if (!navigator.geolocation) { alertT('local'); return; }
    navigator.geolocation.getCurrentPosition(()=>{ ui.f.p_city='Mogi das Cruzes'; ui.f.p_bairro=''; toast('ok','Localização encontrada: Mogi das Cruzes'); rerender(); }, ()=>alertT('local'), {timeout:8000});
  },
  pontosToAgenda(){ ui.draft.ecopontoId = ui.pontos.sel; ui.draft.tipo='ponto'; if (fv('p_cat')) ui.f.ag_cat=fv('p_cat'); go('u/agendamento'); },
  mode(el){ ui.draft.tipo=el.dataset.m; rerender(); },
  month(el){ const [y,m]=ui.draft.month.split('-').map(Number); const d=new Date(y,m-1+Number(el.dataset.dir),1); if (d < new Date(TODAY.getFullYear(),TODAY.getMonth(),1)) return; ui.draft.month=`${d.getFullYear()}-${pad(d.getMonth()+1)}`; rerender(); },
  pickDate(el){ ui.draft.date=el.dataset.d; ui.draft.slot=null; rerender(); },
  pickSlot(el){ ui.draft.slot=el.dataset.s; rerender(); },
  confirmAgenda(){
    const u=me(), d=ui.draft, eq=fv('ag_eq').trim(), qtd=Math.max(1,parseInt(fv('ag_qtd','1'))||1), cat=fv('ag_cat','Verde');
    if (!eq) { toast('err','Informe o equipamento','Descreva o que será descartado (ex.: notebook).'); ui._focus='f-ag_eq'; rerender(); return; }
    if (!d.date || !d.slot) { toast('err','Escolha data e horário','Selecione um dia no calendário e um horário disponível.'); return; }
    if (d.tipo==='domicilio' && !fv('ag_end', u.rua||'').trim()) { toast('err','Informe o endereço','Precisamos do endereço para a retirada.'); return; }
    const e = eco(d.ecopontoId);
    const it = CATALOG.find(c=>c.k.some(k=>eq.toLowerCase().includes(k))) || CATALOG.find(c=>c.cat===cat);
    const s = {id:uid(), codigo:code6(), userId:u.id, userNome:u.nome, telefone:u.telefone||'', tipo:d.tipo, equipamento:eq, qtd, categoria:cat, kg:Math.round((it?it.peso:2)*qtd*10)/10, data:d.date, hora:d.slot, ecopontoId:d.ecopontoId,
      local: d.tipo==='ponto' ? (e?e.nome:'Ecoponto') : `Sua residência (${fv('ag_end', u.rua||'')})`, status:'Pendente', estado:'', obs:'', criado:new Date().toISOString()};
    S.schedules.push(s);
    notify(u.id,'sistema','Agendamento confirmado', `Seu descarte de ${eq} está marcado para ${longDate(s.data).toLowerCase()}, das ${s.hora}. Código ${s.codigo}.`,'agendamento');
    addLog(u.nome,'Criou um agendamento');
    save();
    ui.draft.slot=null; ui.f.ag_eq=''; ui.f.ag_qtd='1';
    rerender();
    openModal(`<div class="modal md"><div class="modal-h"><div><h2>Agendamento confirmado!</h2><span class="muted">Guarde o código para a entrega.</span></div><button class="x" data-act="closeModal">${icon('x')}</button></div>${comprovanteHTML(s)}<div class="modal-f"><span class="spacer"></span><button class="btn outline" data-act="printComp" data-id="${s.id}">${icon('printer')} Imprimir</button><button class="btn dark" data-act="closeModal">Concluir</button></div></div>`);
  },
  comprovante(el){ const s=S.schedules.find(x=>x.id===el.dataset.id); openModal(`<div class="modal md"><div class="modal-h"><div><h2>Comprovante</h2><span class="muted">Agendamento ${s.codigo}</span></div><button class="x" data-act="closeModal">${icon('x')}</button></div>${comprovanteHTML(s)}<div class="modal-f"><span class="spacer"></span><button class="btn outline" data-act="printComp" data-id="${s.id}">${icon('printer')} Imprimir</button><button class="btn dark" data-act="closeModal">Fechar</button></div></div>`); },
  printComp(el){ const s=S.schedules.find(x=>x.id===el.dataset.id); printHTML(comprovanteHTML(s)); },
  cancelAg(el){ const s=S.schedules.find(x=>x.id===el.dataset.id);
    confirmBox('Cancelar agendamento?','Tem certeza de que deseja cancelar este agendamento? Esta ação não pode ser desfeita.','Cancelar agendamento', ()=>{ s.status='Cancelado'; notify(s.userId,'sistema','Agendamento cancelado',`O agendamento ${s.codigo} (${s.equipamento}) foi cancelado.`,null); addLog(s.userNome,'Cancelou um agendamento'); save(); toast('ok','Agendamento cancelado'); rerender(); }); },
  redeem(el){ const u=me(), v=S.vouchers.find(x=>x.id===el.dataset.id);
    confirmBox('Resgatar voucher?',`Serão descontados ${v.pontos} pontos do seu saldo para gerar um voucher de ${money(v.valor)} (${v.patrocinador}).`,'Resgatar', ()=>{
      if (u.pontos < v.pontos) return; u.pontos -= v.pontos;
      const r = {id:uid(), userId:u.id, valor:v.valor, pontos:v.pontos, patrocinador:v.patrocinador, codigo:code6(), data:shortDate(ymd(new Date()))};
      S.redemptions.unshift(r); notify(u.id,'recompensa','Voucher resgatado!',`Seu voucher de ${money(v.valor)} foi gerado. Código: ${r.codigo}.`,'recompensas'); save();
      openModal(`<div class="modal"><div class="mb" style="text-align:center"><h3>Voucher gerado</h3><p>Apresente o código abaixo ao patrocinador.</p><div style="font-size:24px;font-weight:800;letter-spacing:.05em;color:var(--forest);background:var(--mint-3);border-radius:10px;padding:14px;margin-bottom:18px">${r.codigo}</div><button class="btn block" data-act="closeModal">Ok</button></div></div>`);
      rerender(); }, {cancel:'Voltar'});
    document.querySelector('.modal .btn.danger').classList.remove('danger');
  },
  nfilter(el){ ui.notifFilter=el.dataset.f; rerender(); },
  readAll(){ const u=me(); S.notifications.filter(n=>n.userId===u.id).forEach(n=>n.lida=true); save(); rerender(); },
  readNotif(el){ const n=S.notifications.find(x=>x.id===el.dataset.id); if(n && !n.lida){ n.lida=true; save(); rerender(); } },
  notifGo(el){ const n=S.notifications.find(x=>x.id===el.dataset.id); n.lida=true; save(); go(n.acao==='recompensas'?'u/recompensas':'u/agendamento'); },
  pfCancel(){ ui.f._pfFor=null; rerender(); toast('ok','Alterações descartadas'); },
  deleteAccount(){ const u=me();
    confirmBox('Excluir conta?','Tem certeza de que deseja excluir sua conta? Seus dados e pontos serão removidos permanentemente.','Excluir conta', ()=>{
      S.users = S.users.filter(x=>x.id!==u.id);
      if (u.tipo==='receptor') S.ecopontos = S.ecopontos.filter(e=>e.id!==u.ecopontoId || e.status==='Homologado');
      addLog(u.nome,'Excluiu a própria conta'); S.session=null; save(); ui.f={}; toast('ok','Conta excluída'); go('login'); }, {cancel:'Manter conta'});
  },

  /* receptor */
  recCat(el){ ui.rec.cat=el.dataset.c; rerender(); },
  recDetails(el){ const s=S.schedules.find(x=>x.id===el.dataset.id); openModal(detailsDrawer(s), {drawer:true}); },
  recDeny(el){ const s=S.schedules.find(x=>x.id===el.dataset.id);
    confirmBox('Negar recebimento?',`O lote ${s.codigo} será marcado como negado e o solicitante será notificado.`,'Negar', ()=>{ s.status='Negado'; notify(s.userId,'sistema','Descarte não aceito',`O ecoponto não pôde receber ${s.equipamento} (código ${s.codigo}). Agende em outro ponto que aceite a categoria ${s.categoria}.`,'agendamento'); addLog(me().responsavel||me().nome,'Negou um recebimento'); save(); rerender(); }); },
  recConfirm(el){ const s=S.schedules.find(x=>x.id===el.dataset.id);
    confirmBox('Confirmar recebimento?','Confirma que recebeu os resíduos deste agendamento?','Confirmar recebimento', ()=>{
      s.status='Realizado'; s.estado = s.estado || 'Regular';
      const pts = ptsFor(s.categoria, s.qtd); s.pontos = pts;
      const u = S.users.find(x=>x.id===s.userId);
      if (u){ const before=u.pontos; u.pontos += pts;
        notify(u.id,'recompensa','Descarte recebido!',`O ecoponto confirmou o recebimento de ${s.equipamento}. Você ganhou ${pts} pontos.`,'recompensas');
        const unlocked = S.vouchers.filter(v=>before<v.pontos && u.pontos>=v.pontos).sort((a,b)=>b.valor-a.valor)[0];
        if (unlocked) notify(u.id,'recompensa','Novo voucher disponível!',`Você atingiu ${u.pontos} pontos e ganhou ${money(unlocked.valor)} de desconto. Toque para resgatar sua recompensa.`,'recompensas');
      }
      addLog(me().responsavel||me().nome,'Confirmou um recebimento'); save(); toast('ok',`Recebimento confirmado · +${pts} pts ao doador`); rerender(); }); },
  recReceipt(el){ const s=S.schedules.find(x=>x.id===el.dataset.id);
    openModal(`<div class="modal md">${receiptHTML(s)}<div class="modal-f"><button class="btn light" data-act="closeModal">Fechar</button><span class="spacer"></span><button class="btn outline" data-act="printReceipt" data-id="${s.id}">${icon('printer')} Imprimir</button><button class="btn dark" data-act="printReceipt" data-id="${s.id}" data-pdf="1">Baixar PDF</button></div></div>`); },
  printReceipt(el){ const s=S.schedules.find(x=>x.id===el.dataset.id); if (el.dataset.pdf) toast('ok','Escolha “Salvar como PDF” na janela de impressão'); printHTML(receiptHTML(s)); },
  rpCancel(){ ui.f._rpFor=null; rerender(); toast('ok','Alterações descartadas'); },

  /* gestor */
  gMap(){ openModal(`<div class="modal lg"><div class="modal-h"><div><h2>Mapa de pontos de coleta</h2><span class="muted">Verde: homologado · Laranja: pendente</span></div><button class="x" data-act="closeModal">${icon('x')}</button></div><div style="padding:20px"><div class="map"><img src="${IMG.mapa}" alt="Mapa">${S.ecopontos.map(e=>`<button class="pin ${e.x>70?'rt':''}" style="left:${e.x}%;top:${e.y}%" data-act="ecoDetails" data-id="${e.id}"><span class="lbl">${esc(e.nome)}</span>${PIN_SVG(e.status==='Homologado'?'#2d8057':'#e08a1e')}</button>`).join('')}</div></div></div>`); },
  gAgDetails(el){ const s=S.schedules.find(x=>x.id===el.dataset.id), e=eco(s.ecopontoId) || {nome:s.local, doc:'—', cidade:'—', status:'Removido', rua:'', numero:'', bairro:'', cep:''};
    openModal(ecoDetailsModal(e, `<div style="padding:18px 32px 0"><div class="box" style="margin:0"><span class="lb cap">Agendamento ${s.codigo}</span><div><b>${esc(s.userNome)}</b> · ${esc(s.equipamento)} (${s.qtd} un) · ${catPill(s.categoria)} · ${shortDate(s.data)} ${s.hora} · <span class="pill st-${statusGestor(s.status).toLowerCase()}">${statusGestor(s.status)}</span></div></div></div>`)); },
  ecoDetails(el){ openModal(ecoDetailsModal(eco(el.dataset.id))); },
  ecoApprove(el){ const e=eco(el.dataset.id); e.status='Homologado'; addLog('Gestor',`Homologou ${e.nome}`);
    const rec=S.users.find(u=>u.ecopontoId===e.id); if (rec) notify(rec.id,'sistema','Ecoponto homologado',`${e.nome} foi aprovado e já aparece para os usuários.`,null);
    save(); closeModal(); toast('ok',`${e.nome} homologado`); rerender(); },
  ecoReject(el){ const e=eco(el.dataset.id); e.status='Rejeitado'; addLog('Gestor',`Rejeitou ${e.nome}`); save(); closeModal(); rerender(); },
  ecoNew(){ ui.g.ecoNew=true; render(); },
  ecoBack(){ ui.g.ecoNew=false; render(); },
  relView(el){ ui.g.relView=el.dataset.v; rerender(); },
  relGenerate(){ const p=relParams(); const nome = `Descartes${p.categoria?' — '+p.categoria:''}${p.cidade?' — '+p.cidade:''}${p.status?' ('+p.status+')':''}`;
    S.reports.unshift({id:uid(), nome, data:new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'}), params:p}); addLog('Gestor','Gerou um relatório'); save(); rerender();
    toast('ok','Escolha “Salvar como PDF” na janela de impressão'); printHTML(reportPrint(nome,p)); },
  relDownload(el){ const r=S.reports.find(x=>x.id===el.dataset.id); printHTML(reportPrint(r.nome, r.params)); },
  addSponsor(){ const n=fv('sp_nome').trim(), c=fv('sp_cont').trim(); if(!n){ toast('err','Informe o nome','Digite o nome do patrocinador.'); return; }
    S.sponsors.push({id:uid(), nome:n, contato:c}); S.vouchers.push({id:uid(), patrocinador:n, valor:15, pontos:90}); addLog('Gestor',`Cadastrou o patrocinador ${n}`); save(); ui.f.sp_nome=''; ui.f.sp_cont=''; toast('ok','Patrocinador adicionado (voucher de R$ 15 criado)'); rerender(); },
  rmSponsor(el){ const s=S.sponsors.find(x=>x.id===el.dataset.id); S.sponsors=S.sponsors.filter(x=>x!==s); S.vouchers=S.vouchers.filter(v=>v.patrocinador!==s.nome); save(); rerender(); },
  saveRules(){ const p=parseInt(fv('cf_pts')); if(!(p>0)){ toast('err','Valor inválido','Pontos por descarte deve ser maior que zero.'); return; }
    S.config.pontosPorDescarte=p; S.config.niveis=fv('cf_niv'); CAT_ORDER.forEach(k=>{ const v=parseFloat(fv('cf_r_'+k)); S.config.regras[k]= v>=0 ? v : 1; }); addLog('Gestor','Atualizou as regras de pontuação'); save(); toast('ok','Regras salvas'); rerender(); },
  toggleCat(el){ const k=el.dataset.c; S.config.cats[k]=!S.config.cats[k]; if (!activeCats().length){ S.config.cats[k]=true; toast('err','Ação não permitida','Mantenha ao menos uma categoria ativa.'); } save(); rerender(); },
  notifCfg(){ const n=S.config.notif; openModal(`<div class="modal"><div class="mb"><h3>Notificações automáticas</h3><p>Escolha quais eventos geram notificações para o gestor.</p>
    ${[['solicitacoes','Solicitações de receptores'],['agendamentos','Novos agendamentos'],['homologacoes','Homologações de ecopontos']].map(([k,l])=>`<label class="check" style="margin-bottom:12px"><input type="checkbox" data-act-change="notifCfg" value="${k}" ${n[k]?'checked':''}> ${l}</label>`).join('')}
    <div class="row" style="margin-top:16px"><span class="spacer"></span><button class="btn" data-act="closeModal">Concluir</button></div></div></div>`); }
};
