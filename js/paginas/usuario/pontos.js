/*ecopontos*/
function filteredEcos(){
  const city = fv('p_city'), cat = fv('p_cat'), q = fv('p_bairro').trim().toLowerCase();
  return S.ecopontos.filter(e=>e.status==='Homologado' && (!city||e.cidade===city) && (!cat||e.cats.includes(cat)) && (!q || (e.bairro+' '+e.rua+' '+e.nome).toLowerCase().includes(q)));
}
function viewPontos(){
  const list = filteredEcos();
  if (!list.find(e=>e.id===ui.pontos.sel)) ui.pontos.sel = list[0]?.id || null;
  const sel = eco(ui.pontos.sel);
  const H = sel ? sel.horario : null;
  return shell(`
    ${pageHead('Pontos de coleta', `Ecopontos dentro de um raio de ${S.config.raio} km da sua localização.`)}
    <div class="grid" style="grid-template-columns:1.4fr .9fr 1.1fr auto;gap:14px;margin-bottom:24px" id="pfilters">
      ${input('p_bairro',{ph:'Digite ou selecione o bairro após escolher a cidade', attrs:'list="dl-bairros"'})}
      <datalist id="dl-bairros">${[...new Set(S.ecopontos.filter(e=>!fv('p_city')||e.cidade===fv('p_city')).map(e=>e.bairro))].map(b=>`<option value="${esc(b)}">`).join('')}</datalist>
      ${dropdown('p_city', fv('p_city'), [{v:'',l:'Todas as cidades'}, ...CITIES.map(c=>({v:c,l:c}))], {placeholder:'Cidade', title:'Selecione uma cidade'})}
      ${dropdown('p_cat', fv('p_cat'), [{v:'',l:'Todas categorias'}, ...activeCats().map(c=>({v:c,l:c}))], {placeholder:'Todas categorias', title:'Categoria'})}
      <button class="btn outline" data-act="locate" title="Usar minha localização">${icon('locate')}<span class="sr">Usar minha localização</span></button>
    </div>
    <div class="grid g-map">
      <div>
        <div class="map">
          <img src="${IMG.mapa}" width="688" height="468" alt="Mapa da região com os ecopontos">
          ${list.map(e=>`<button class="pin ${e.id===ui.pontos.sel?'on':''} ${e.x>70?'rt':''}" style="left:${e.x}%;top:${e.y}%" data-act="selEco" data-id="${e.id}" aria-label="${esc(e.nome)}"><span class="lbl">${esc(e.nome)}</span>${PIN_SVG(e.id===ui.pontos.sel?'#d6372b':'#2d8057')}</button>`).join('')}
        </div>
        ${list.length>1?`<div style="margin-top:14px">${list.map(e=>`<button class="eco-li ${e.id===ui.pontos.sel?'on':''}" data-act="selEco" data-id="${e.id}">${icon('pin')}<span><b>${esc(e.nome)}</b><br><span class="hint">${esc(e.bairro)} · ${esc(e.cidade)}</span></span><span class="spacer"></span>${e.cats.map(c=>catPill(c)).join(' ')}</button>`).join('')}</div>`:''}
      </div>
      <div>
        <section class="card eco-info">
          ${sel ? `<h3>${esc(sel.nome)}</h3>
            <p style="margin:0 0 16px"><span class="k">Endereço:</span> ${esc(ecoAddr(sel))}</p>
            <div class="k">Horário de funcionamento:</div>
            <div class="hours">${['seg','ter','qua','qui','sex','sab','dom'].map((d,i)=>`<span>${WEEK[i]}</span><span>${esc(H[d])}</span>`).join('')}</div>
            <p style="margin:0 0 14px"><span class="k">Categorias aceitas:</span> ${sel.cats.map(c=>c.toLowerCase()).join(', ')}</p>
            <p style="margin:0"><span class="k">Telefone:</span> ${esc(sel.telefone)}</p>`
          : `<div class="empty">${icon('pin')}Nenhum ecoponto encontrado com esses filtros.<br><button class="link" style="margin-top:8px" data-act="clearPontos">Limpar filtros</button></div>`}
        </section>
        <button class="btn block" style="margin-top:22px;font-size:15px" data-act="pontosToAgenda" ${sel?'':'disabled'}>Agendamento ${icon('arrowr')}</button>
      </div>
    </div>`, 'u/pontos');
}
