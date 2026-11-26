/*identificar de resíduo*/
function viewIdent(){
  const id = ui.ident, u = me();
  const prev = userSchedules(u.id).filter(s=>s.status==='Realizado').sort((a,b)=>b.data.localeCompare(a.data));
  const left = id && id.img
    ? `<div style="position:relative"><img class="preview" src="${id.img}" alt="Foto enviada do equipamento">${id.status==='loading'?'<div class="scan"></div>':''}</div>
       <div class="row" style="justify-content:center;margin-top:14px"><label class="btn outline sm" style="cursor:pointer">${icon('camera')} Trocar imagem<input type="file" accept="image/*" capture="environment" class="sr" data-file="ident"></label></div>`
    : `<label class="drop" id="drop">${icon('camera')}<b>Tirar foto ou enviar imagem</b><span class="muted" style="font-size:13px">JPG ou PNG até 5 MB</span><input type="file" accept="image/*" capture="environment" class="sr" data-file="ident"></label>`;
  let right;
  if (!id) right = `<div class="empty" style="padding-top:120px">O resultado da identificação aparecerá aqui.</div>`;
  else if (id.status==='loading') right = `<div class="empty" style="padding-top:120px"><div class="spin"></div>Analisando a imagem com IA…</div>`;
  else if (id.status==='fail') right = `<div style="padding:30px 10px">
      <div class="banner" style="background:var(--danger-bg);border-color:var(--danger-line);color:var(--danger)">${icon('info')} Não foi possível classificar automaticamente.</div>
      <label class="lb strong">Classifique manualmente</label>
      ${dropdown('ident_manual', '', activeCats().map(c=>({v:c,l:`${c} — ${CATS[c].desc}`})), {placeholder:'Selecione a categoria', title:'Categoria'})}
    </div>`;
  else {
    const r = id.result, pts = ptsFor(r.cat,1);
    right = `<div class="res-grid">
        <div>
          <div class="res-f" style="margin-bottom:8px"><label>Resíduo:</label><div>${esc(r.nome)}</div></div>
          <div class="res-f" style="margin-bottom:8px"><label>Marca:</label><div>${esc(r.marca)}</div></div>
          <div class="res-f" style="margin-bottom:8px"><label>Categoria:</label><div style="text-transform:none">${esc(r.cat)}</div></div>
          <div class="res-f"><label>Risco de manuseio:</label><div style="text-transform:none">${esc(r.risco)}</div></div>
        </div>
        <div class="impact"><span class="ic">${icon('badge')}</span><h4>Impacto ambiental</h4><span class="muted" style="font-size:13px">CO₂ evitado</span><div class="v">${esc(r.co2)}</div><span class="muted" style="font-size:13px">Possibilidade de pontos:</span><div class="v" style="font-size:17px">+${pts} pts</div>
          ${r.manual?'<span class="hint">Classificação manual</span>':''}</div>
      </div>`;
  }
  return shell(`
    ${pageHead('Identificar resíduo','Fotografe o equipamento e nossa IA indica a categoria e os pontos que aceitam.')}
    <div class="grid g2">
      <div>
        <section class="card">${left}</section>
        ${id && id.status==='done' ? `<div class="row wrap" style="justify-content:center;margin-top:22px">
          <button class="btn block" style="max-width:420px" data-act="identToPontos">Busca por Ecoponto ${icon('arrowr')}</button>
          <button class="btn light" data-act="identToAgenda">${icon('calendar')} Agendar descarte deste item</button></div>`:''}
      </div>
      <section class="card">
        ${right}
        <h3 style="text-align:center;margin:26px 0 12px">Descartes anteriores</h3>
        ${prev.length ? prev.map(s=>`<div class="hist"><div class="row" style="align-items:flex-start"><b class="t">${esc(s.equipamento)}</b><span class="spacer"></span><span class="st st-entregue">Status: ENTREGUE</span></div>
          <div class="lab" style="margin-top:6px">Data e hora:</div>${longDate(s.data)} ${esc(s.hora)}
          <div class="row" style="margin:6px 0"><span class="lab">Categoria:</span> ${catPill(s.categoria)}</div>
          <span class="lab">Local:</span> ${esc(ecoAddr(eco(s.ecopontoId)) || s.local)}</div>`).join('')
          : `<div class="empty" style="padding:16px">Nenhum descarte anterior.</div>`}
      </section>
    </div>`);
}
const ecoAddr = e => e ? `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade} - SP, ${e.cep}` : '';
function classify(file){
  if (!file) return;
  if (!/^image\//.test(file.type)) { alertT('classificar','Envie um arquivo de imagem (JPG ou PNG).'); return; }
  if (file.size > 5*1024*1024) { alertT('classificar','A imagem ultrapassa 5 MB. Envie um arquivo menor.'); return; }
  const rd = new FileReader();
  rd.onload = () => {
    ui.ident = {img:rd.result, status:'loading'}; rerender();
    const name = file.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    setTimeout(()=>{
      if (!ui.ident) return;
      if (/erro|falha|blur/.test(name)) { ui.ident.status='fail'; alertT('classificar'); rerender(); return; }
      let item = CATALOG.find(c=>c.k.some(k=>name.includes(k.normalize('NFD').replace(/[̀-ͯ]/g,''))));
      if (!item) item = CATALOG[hashStr(file.name+file.size) % CATALOG.length];
      if (!S.config.cats[item.cat]) { ui.ident.status='fail'; alertT('classificar','A categoria identificada está desativada. Classifique manualmente.'); rerender(); return; }
      ui.ident.status='done'; ui.ident.result={...item, nome:item.nome.toUpperCase(), marca:item.marca.toUpperCase(), conf:82+hashStr(name)%16};
      rerender();
    }, 1600);
  };
  rd.readAsDataURL(file);
}
