// Eventos globais
document.addEventListener('click', e=>{
  const ovl = e.target.closest('[data-ovl]');
  if (ovl && e.target===ovl) { closeModal(); return; }
  if (ui.dd && !e.target.closest('.dd')) { ui.dd=null; rerender(); }
  if (ui.proto && !e.target.closest('.proto') && !e.target.closest('.proto-btn') && !e.target.closest('[data-act]')) { ui.proto=false; renderProto(); }
  if (ui.menu && !e.target.closest('.side') && !e.target.closest('.burger')) { ui.menu=false; rerender(); return; }
  const a = e.target.closest('[data-act]');
  if (!a) return;
  if (a.closest('.notif') && a.dataset.act==='readNotif' && e.target.closest('button[data-act="notifGo"]')) return;
  if (a.tagName==='A') e.preventDefault();
  const fn = ACTIONS[a.dataset.act];
  if (fn) { e.stopPropagation(); fn(a, e); }
});
document.addEventListener('submit', e=>{
  const f = e.target.closest('[data-form]'); if (!f) return;
  e.preventDefault(); FORMS[f.dataset.form] && FORMS[f.dataset.form](f);
});
document.addEventListener('input', e=>{
  const t = e.target;
  // OTP
  if (t.dataset.otp !== undefined){
    t.value = digits(t.value).slice(-1);
    const boxes = [...document.querySelectorAll('[data-otp]')];
    ui.f.otp = boxes.map(b=>b.value||' ').join('').replace(/\s+$/,'').replace(/ /g,'');
    if (t.value && boxes[+t.dataset.otp+1]) boxes[+t.dataset.otp+1].focus();
    return;
  }

  if (t.dataset.rec){ ui.rec[t.dataset.rec] = t.value; const pos=t.selectionStart; ui._focus = t.id; rerender(); const el=document.getElementById(t.id); if (el && el.setSelectionRange && t.type!=='date') try{el.setSelectionRange(pos,pos);}catch(_){} return; }
  if (t.dataset.actInput==='raio'){ S.config.raio=+t.value; document.getElementById('raio-v').textContent=t.value+' km'; save(); return; }
  if (!t.dataset.bind) return;
  if (t.dataset.mask && MASKS[t.dataset.mask]){ const m = MASKS[t.dataset.mask](t.value); if (m!==t.value) t.value = m; }
  ui.f[t.dataset.bind] = t.type==='checkbox' ? t.checked : t.value;
  const k = t.dataset.bind;

  if (k==='reg_pw' || k==='reg_pw2'){
    const p=fv('reg_pw'), p2=fv('reg_pw2'), r=pwRules(p);
    const ul=document.getElementById('pw-rules'); if (ul) ul.innerHTML = ruleLi(r.len,'Mínimo de 8 caracteres',p)+ruleLi(r.num,'Deve conter número',p)+ruleLi(r.esp,'Deve conter caracteres especiais',p);
    const um=document.getElementById('pw-match'); if (um) um.innerHTML = p2?ruleLi(p===p2,'As senhas coincidem',p2):'';
  }
  if (k==='np_pw' || k==='np_pw2'){ const el=document.getElementById('np-rules'); if (el) el.innerHTML = npRules(fv('np_pw'), fv('np_pw2')); }
  if (k==='reg_cep' && digits(t.value).length===8){
    const c = lookupCep(t.value);
    if (!c) alertT('cep');
    else { Object.assign(ui.f, {reg_cidade:c.cidade, reg_uf:c.uf}); if (c.rua) ui.f.reg_rua=c.rua; if (c.bairro) ui.f.reg_bairro=c.bairro; ui._focus='f-reg_bairro'; rerender(); }
  }
  if (k==='en_cep' && digits(t.value).length===8){
    const c = lookupCep(t.value);
    if (!c) alertT('cep'); else { ui.f.en_cidade=c.cidade; if (c.rua) ui.f.en_rua=c.rua; if (c.bairro) ui.f.en_bairro=c.bairro; ui._focus='f-en_num'; rerender(); }
  }
  if (k==='p_bairro'){ const pos=t.selectionStart; ui._focus='f-p_bairro'; rerender(); const el=document.getElementById('f-p_bairro'); if (el) try{el.setSelectionRange(pos,pos);}catch(_){} }
});
document.addEventListener('change', e=>{
  const t = e.target;
  if (t.dataset.file){
    const file = t.files[0]; if (!file) return;
    if (t.dataset.file==='ident') { classify(file); return; }
    if (!/^image\//.test(file.type) || file.size>5*1024*1024) { toast('err','Imagem inválida','Envie JPG ou PNG de até 5 MB.'); return; }
    const rd = new FileReader();
    rd.onload = () => {
      if (t.dataset.file==='lote'){ const s=S.schedules.find(x=>x.id===t.dataset.id); s.foto=rd.result; try{save();}catch(_){} openModal(detailsDrawer(s),{drawer:true}); }
      if (t.dataset.file==='ecoFoto'){ ui.f.en_foto=rd.result; rerender(); }
    };
    rd.readAsDataURL(file); return;
  }
  if (t.hasAttribute('data-rerender')) { rerender(); return; }
  if (t.dataset.actChange==='agEco'){ ui.draft.ecopontoId=t.value; ui.draft.slot=null; rerender(); return; }
  if (t.dataset.actChange==='rpCat'){ const e2=eco(me().ecopontoId); if (!e2) return; e2.cats = t.checked ? [...new Set([...e2.cats,t.value])] : e2.cats.filter(c=>c!==t.value); save(); toast('ok','Categorias aceitas atualizadas'); return; }
  if (t.dataset.actChange==='notifCfg'){ S.config.notif[t.value]=t.checked; save(); rerender(); return; }
});
document.addEventListener('keydown', e=>{
  if (e.key==='Escape'){ if (document.getElementById('modal-root').innerHTML) closeModal(); else if (ui.dd){ ui.dd=null; rerender(); } else if (ui.proto){ ui.proto=false; renderProto(); } }
  if (e.target.dataset && e.target.dataset.otp!==undefined && e.key==='Backspace' && !e.target.value){
    const prev = document.querySelector(`[data-otp="${+e.target.dataset.otp-1}"]`); if (prev){ prev.focus(); prev.value=''; }
  }
});
document.addEventListener('paste', e=>{
  if (e.target.dataset && e.target.dataset.otp!==undefined){
    const d = digits(e.clipboardData.getData('text')).slice(0,6); if (!d) return;
    e.preventDefault(); const boxes=[...document.querySelectorAll('[data-otp]')]; boxes.forEach((b,i)=>b.value=d[i]||''); ui.f.otp=d; (boxes[Math.min(d.length,5)]).focus();
  }
});
