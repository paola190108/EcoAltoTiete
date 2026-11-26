/* cabeçalho de dropdown */
const DD = {
  reg_tipo: v => { ui.reg.tipo=v; },
  login_tipo: v => { doLogin({receptor:'receptor@eco.com',usuario:'usuario@eco.com',gestor:'gestor@eco.com'}[v],'eco12345',false); },
  rec_status: v => { ui.rec.status=v; },
  g_ag: v => { ui.g.agStatus=v; },
  g_hc: v => { ui.g.histCat=v; },
  g_hr: v => { ui.g.histRisco=v; },
  ident_manual: v => { const it = CATALOG.find(c=>c.cat===v); ui.ident.status='done'; ui.ident.result={nome:'NÃO IDENTIFICADO', marca:'—', cat:v, risco:it?it.risco:'Baixo', co2:it?it.co2:'—', manual:true}; },
  p_city: v => { ui.f.p_city=v; ui.f.p_bairro=''; }
};
