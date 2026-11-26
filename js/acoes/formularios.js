/*formulários*/
const FORMS = {
  login(){ doLogin(fv('login_id'), fv('login_pw'), fv('login_rem')); },
  cadastro(){
    const r = ui.reg, rec = r.tipo==='receptor';
    if (r.step===1){
      if (!fv('reg_nome').trim()) { toast('err', rec?'Informe o nome do ecoponto':'Informe seu nome', 'Este campo é obrigatório.'); ui._focus='f-reg_nome'; rerender(); return; }
      if (digits(fv('reg_tel')).length<10) { toast('err','Telefone inválido','Informe DDD + número.'); ui._focus='f-reg_tel'; rerender(); return; }
      const em = fv('reg_email').trim().toLowerCase();
      if (!validEmail(em) || S.users.some(u=>u.email.toLowerCase()===em)) { alertT('email'); ui._focus='f-reg_email'; rerender(); return; }
      if (rec ? !validCNPJ(fv('reg_doc')) : !validCPF(fv('reg_doc'))) { alertT('cpf'); ui._focus='f-reg_doc'; rerender(); return; }
      r.step=2; render(); return;
    }
    if (r.step===2){
      const cep = fv('reg_cep');
      if (digits(cep).length!==8) { alertT('cep','Informe um CEP com 8 dígitos ou preencha o endereço manualmente.'); return; }
      if (!fv('reg_cidade').trim() || !fv('reg_bairro').trim() || !fv('reg_rua').trim()) { toast('err','Endereço incompleto','Preencha cidade, bairro e rua.'); return; }
      r.step=3; render(); return;
    }
    const p = fv('reg_pw'), p2 = fv('reg_pw2'), rr = pwRules(p);
    if (!rr.len) { alertT('curta'); return; }
    if (!rr.num || !rr.esp) { toast('err','Senha fraca','A senha deve conter número e caractere especial.'); return; }
    if (p!==p2) { alertT('coincidem'); return; }
    if (!fv('reg_terms')) { toast('err','Aceite os termos','É preciso aceitar os termos de privacidade para criar a conta.'); return; }
    const email = fv('reg_email').trim().toLowerCase();
    const nu = {id:uid(), tipo:r.tipo, nome:fv('reg_nome').trim(), email, telefone:fv('reg_tel'), cep:fv('reg_cep'), cidade:fv('reg_cidade'), uf:(fv('reg_uf')||'SP').toUpperCase(), bairro:fv('reg_bairro'), rua:fv('reg_rua'), senha:p, pontos:0, verificado:false, criado:ymd(new Date())};
    if (rec){
      nu.cnpj = fv('reg_doc'); nu.responsavel = '';
      const eid = uid(); nu.ecopontoId = eid;
      S.ecopontos.push({id:eid, doc:'EAT-EC-'+String(S.ecopontos.length+1).padStart(4,'0'), nome:nu.nome, rua:nu.rua, numero:'s/n', bairro:nu.bairro, cidade:nu.cidade, cep:nu.cep, cats:[...CAT_ORDER], horario:{seg:'08:00–17:00',ter:'08:00–17:00',qua:'08:00–17:00',qui:'08:00–17:00',sex:'08:00–17:00',sab:'Fechado',dom:'Fechado'}, horarioTxt:'Seg a Sex, 8h às 17h', telefone:nu.telefone, cnpj:nu.cnpj, responsavel:'', status:'Pendente de homologação', x:15+Math.random()*70, y:15+Math.random()*70});
      addLog(nu.nome,'Solicitou cadastro como receptor');
    } else { nu.cpf = fv('reg_doc'); addLog(nu.nome,'Criou uma conta de usuário'); }
    S.users.push(nu); save();
    if (!startVerify(email,'cadastro')) { ui.verify = {email, purpose:'cadastro', code:code6(), sentAt:0}; }
    ui.reg = {step:1, tipo:'usuario'};
    Object.keys(ui.f).filter(k=>k.startsWith('reg_')).forEach(k=>delete ui.f[k]);
    go('confirmar-email');
  },
  verify(){
    if (!checkOtp()) return;
    const u = S.users.find(x=>x.email===ui.verify.email); if (u) u.verificado = true; save();
    toast('ok','E-mail confirmado! Bem-vindo(a) ao EcoAltoTietê');
    ui.verify = null;
    if (u){ S.session={userId:u.id, remember:false}; save(); try{sessionStorage.setItem('eco-alive','1');}catch(e){} ui.f={}; go(HOME[u.tipo]); } else go('login');
  },
  recover(){ if (!checkOtp()) return; ui.verify.ok = true; ui.f.np_pw=''; ui.f.np_pw2=''; go('nova-senha'); },
  newpass(){
    const p=fv('np_pw'), p2=fv('np_pw2');
    if (p.length<8) { alertT('curta'); return; }
    if (p!==p2) { alertT('coincidem'); return; }
    const u = S.users.find(x=>x.id===ui.verify.userId); if (u) u.senha=p; save();
    ui.verify=null; ui.f={}; toast('ok','Senha alterada! Entre com a nova senha'); go('login');
  },
  uprofile(){
    const u = me(), em = fv('pf_email').trim().toLowerCase();
    if (!fv('pf_nome').trim()) { toast('err','Informe seu nome','O nome não pode ficar em branco.'); return; }
    if (!validEmail(em) || S.users.some(x=>x.id!==u.id && x.email.toLowerCase()===em)) { alertT('email'); return; }
    const pw = fv('pf_pw'); if (pw && pw.length<8) { alertT('curta'); return; }
    Object.assign(u, {nome:fv('pf_nome').trim(), email:em, telefone:fv('pf_tel'), cidade:fv('pf_cidade'), bairro:fv('pf_bairro')});
    if (pw) u.senha = pw;
    S.schedules.filter(s=>s.userId===u.id).forEach(s=>s.userNome=u.nome);
    ui.f.pf_pw=''; save(); toast('ok','Alterações salvas'); rerender();
  },
  rprofile(){
    const u = me(), e = eco(u.ecopontoId), pw = fv('rp_pw');
    if (pw && pw.length<8) { alertT('curta'); return; }
    u.nome = fv('rp_nome').trim() || u.nome; u.responsavel = fv('rp_resp');
    if (e) Object.assign(e, {nome:u.nome, responsavel:u.responsavel, cep:fv('rp_cep'), numero:fv('rp_num'), rua:fv('rp_rua'), bairro:fv('rp_bairro'), cidade:fv('rp_cidade'), horarioTxt:fv('rp_hor')});
    if (pw) u.senha = pw; ui.f.rp_pw='';
    save(); toast('ok','Alterações salvas'); rerender();
  },
  recDetails(form){
    const s = S.schedules.find(x=>x.id===form.dataset.id);
    s.estado = form.elements.estado.value; s.obs = form.elements.obs.value; save();
    closeModal(); toast('ok','Detalhes da solicitação salvos'); rerender();
  },
  ecoNew(){
    const req = [['en_nome','Nome do ponto'],['en_cep','CEP'],['en_rua','Rua'],['en_num','Número'],['en_bairro','Bairro'],['en_cidade','Cidade'],['en_resp','Responsável'],['en_tel','Telefone']];
    const miss = req.filter(([k])=>!String(fv(k)).trim()).map(([,l])=>l);
    if (miss.length) { toast('err','Campos obrigatórios', 'Preencha: '+miss.join(', ')+'.'); return; }
    if (digits(fv('en_cep')).length!==8 || !lookupCep(fv('en_cep'))) { alertT('cep'); return; }
    if (fv('en_cnpj') && !validCNPJ(fv('en_cnpj'))) { alertT('cpf'); return; }
    const cats = CAT_ORDER.filter(c=>fv('en_cat_'+c));
    if (!cats.length) { toast('err','Selecione categorias','Marque ao menos uma categoria aceita.'); return; }
    const h = fv('en_hor') || 'Seg a Sex, 8h às 17h';
    S.ecopontos.push({id:uid(), doc:'EAT-EC-'+String(S.ecopontos.length+1).padStart(4,'0'), nome:fv('en_nome').trim(), rua:fv('en_rua'), numero:fv('en_num'), bairro:fv('en_bairro'), cidade:fv('en_cidade'), cep:fv('en_cep'), cats, horario:{seg:'08:00–17:00',ter:'08:00–17:00',qua:'08:00–17:00',qui:'08:00–17:00',sex:'08:00–17:00',sab:'Fechado',dom:'Fechado'}, horarioTxt:h, telefone:fv('en_tel'), cnpj:fv('en_cnpj'), responsavel:fv('en_resp'), status:'Pendente de homologação', foto:fv('en_foto')||null, x:20+Math.random()*60, y:20+Math.random()*60});
    addLog('Gestor','Cadastrou um ponto de coleta'); save();
    Object.keys(ui.f).filter(k=>k.startsWith('en_')).forEach(k=>delete ui.f[k]);
    ui.g.ecoNew=false; toast('ok','Ponto de coleta salvo — pendente de homologação'); render();
  }
};
