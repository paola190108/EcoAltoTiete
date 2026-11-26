// Gestor: relatórios. 
function reportData(p){
  const recs = allRecords().filter(r=>(!p.status||r.status===p.status) && (!p.ini||r.data>=p.ini) && (!p.fim||r.data<=p.fim) && (!p.cidade||r.cidade===p.cidade) && (!p.categoria||r.categoria===p.categoria));
  const by = {}; CAT_ORDER.forEach(c=>by[c]={n:0,kg:0,co2:0});
  recs.forEach(r=>{ by[r.categoria].n++; by[r.categoria].kg+=r.kg; by[r.categoria].co2+=r.kg*CO2_PER_KG[r.categoria]; });
  return {recs, by};
}
const relParams = () => ({status:fv('rl_status'), ini:fv('rl_ini'), fim:fv('rl_fim'), cidade:fv('rl_cidade'), categoria:fv('rl_cat')});
function viewGRel(){
  const p = relParams(), {by, recs} = reportData(p);
  const max = Math.max(1, ...CAT_ORDER.map(c=>by[c].n));
  return shell(`
    ${pageHead('Relatórios','Gere e consulte relatórios de descarte e impacto ambiental.')}
    <section class="card"><h3>Parâmetros do relatório</h3>
      <div class="grid" style="grid-template-columns:repeat(5,1fr);gap:14px" id="rel-params">
        <div><label class="lb">Status</label>${dropdown('rl_status', p.status, [{v:'',l:'Todos os status'},{v:'Realizado',l:'Realizado'},{v:'Pendente',l:'Pendente'},{v:'Negado',l:'Negado'}], {plain:true})}</div>
        <div><label class="lb">Data inicial</label>${input('rl_ini',{type:'date', attrs:'data-rerender'})}</div>
        <div><label class="lb">Data final</label>${input('rl_fim',{type:'date', attrs:'data-rerender'})}</div>
        <div><label class="lb">Cidade</label>${dropdown('rl_cidade', p.cidade, [{v:'',l:'Todas as cidades'},...CITIES.map(c=>({v:c,l:c}))], {title:'Selecione uma cidade'})}</div>
        <div><label class="lb">Categoria</label>${dropdown('rl_cat', p.categoria, [{v:'',l:'Todas'},...CAT_ORDER.map(c=>({v:c,l:c}))], {title:'Categoria'})}</div>
      </div></section>
    <div class="grid g-gh" style="margin-top:40px">
      <section class="card"><h3>Pré-visualização dos dados</h3>
        <div class="row"><button class="chip ${ui.g.relView==='grafico'?'on':''}" style="${ui.g.relView==='grafico'?'background:var(--mint);border-color:var(--mint);color:var(--forest)':''}" data-act="relView" data-v="grafico">Gráfico</button><button class="chip ${ui.g.relView==='tabela'?'on':''}" style="${ui.g.relView==='tabela'?'background:var(--mint);border-color:var(--mint);color:var(--forest)':''}" data-act="relView" data-v="tabela">Tabela</button><span class="spacer"></span><span class="muted" style="font-size:12.5px">${recs.length} registros</span></div>
        <p class="muted" style="font-size:12.5px;margin:16px 0 0">Quantidade de descartes por categoria</p>
        ${ui.g.relView==='grafico'
          ? `<div class="bars">${CAT_ORDER.map(c=>`<div class="b"><span>${c}</span><div class="track"><div class="fill ${CATS[c].cls}" style="width:${by[c].n/max*100}%"></div></div><span class="muted" style="font-size:12px">${by[c].n}</span></div>`).join('')}</div>`
          : `<div class="tbl-wrap" style="margin-top:10px"><table class="tbl simple"><thead><tr><th>Categoria</th><th>Descartes</th><th>Peso (kg)</th><th>CO₂ evitado (kg)</th></tr></thead><tbody>${CAT_ORDER.map(c=>`<tr><td>${catPill(c)}</td><td>${by[c].n}</td><td>${fmtKg(by[c].kg)}</td><td>${fmtKg(by[c].co2)}</td></tr>`).join('')}<tr><td><b>Total</b></td><td><b>${recs.length}</b></td><td><b>${fmtKg(CAT_ORDER.reduce((a,c)=>a+by[c].kg,0))}</b></td><td><b>${fmtKg(CAT_ORDER.reduce((a,c)=>a+by[c].co2,0))}</b></td></tr></tbody></table></div>`}
      </section>
      <section class="card"><h3>Relatórios anteriores</h3>
        <table class="tbl simple"><thead><tr><th>Nome</th><th>Data</th><th>Arquivo</th></tr></thead><tbody>
          ${S.reports.map(r=>`<tr><td>${esc(r.nome)}</td><td class="muted" style="font-size:12px">${r.data}</td><td><button class="link" style="font-size:12px" data-act="relDownload" data-id="${r.id}">Baixar ↓</button></td></tr>`).join('')}
        </tbody></table></section>
    </div>
    <div style="text-align:right;margin-top:28px"><button class="btn" style="padding:13px 22px" data-act="relGenerate">Gerar e baixar relatório em PDF</button></div>`);
}
/* ============================================================
   PDF DO RELATÓRIO — EDITE AQUI A FORMATAÇÃO
   1) REPORT_CSS  = estilos (cores, fontes, tamanhos, bordas)
   2) reportPrint = estrutura/textos (título, linha de filtros, tabela)
   ============================================================ */
const REPORT_CSS = `
  .rp-title{color:#173d32;margin:0}
  .rp-info{color:#666}
  .rp-table{width:100%;border-collapse:collapse;margin-top:20px}
  .rp-table .rp-head{background:#e9f3ec}
`;
function reportPrint(nome, p){
  const {by, recs} = reportData(p);
  const tot = k => CAT_ORDER.reduce((a,c)=>a+by[c][k],0);
  return `<style>${REPORT_CSS}</style>
    <h1 class="rp-title">EcoAltoTietê — ${esc(nome)}</h1>
    <p class="rp-info">Gerado em ${nowStamp()} · Status: ${p.status||'Todos'} · Período: ${p.ini?shortDate(p.ini):'início'} a ${p.fim?shortDate(p.fim):'hoje'} · Cidade: ${p.cidade||'Todas'} · Categoria: ${p.categoria||'Todas'}</p>
    <table class="rp-table" border="1" cellpadding="8"><tr class="rp-head"><th>Categoria</th><th>Descartes</th><th>Peso (kg)</th><th>CO₂ evitado (kg)</th></tr>
    ${CAT_ORDER.map(c=>`<tr><td>${c}</td><td>${by[c].n}</td><td>${fmtKg(by[c].kg)}</td><td>${fmtKg(by[c].co2)}</td></tr>`).join('')}
    <tr><th>Total</th><th>${recs.length}</th><th>${fmtKg(tot('kg'))}</th><th>${fmtKg(tot('co2'))}</th></tr></table>`;
}
