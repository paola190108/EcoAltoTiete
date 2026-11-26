// Gestor: ecopontos (lista, detalhes e cadastro).
function ecoDetailsModal(e, extra=''){
  return `<div class="modal lg" role="dialog" aria-modal="true">
    <div class="modal-h"><div><h2>Detalhes do ecoponto</h2><span class="muted">Informações cadastrais e contato</span></div><button class="x" data-act="closeModal" aria-label="Fechar">${icon('x')}</button></div>
    ${extra}
    <div class="kv">
      <div><label>Nome do ecoponto</label><div>${esc(e.nome)}</div></div><div><label>Código do documento</label><div>${esc(e.doc)}</div></div>
      <div><label>Localização</label><div>${esc(e.cidade)} - SP</div></div><div><label>CNPJ</label><div>${esc(e.cnpj||'—')}</div></div>
      <div><label>Responsável legal</label><div>${esc(e.responsavel||'—')}</div></div><div><label>Telefone de contato</label><div>${esc(e.telefone||'—')}</div></div>
      <div><label>Endereço</label><div>${esc(ecoAddr(e))}</div></div><div><label>Status</label><div><span class="st st-${e.status.toLowerCase().split(' ')[0]}">${esc(e.status)}</span></div></div>
    </div>
    <div class="row" style="justify-content:flex-end;padding:0 32px 26px">${e.status!=='Homologado'?`<button class="btn danger" data-act="ecoReject" data-id="${e.id}">Rejeitar</button><button class="btn" data-act="ecoApprove" data-id="${e.id}">Homologar</button>`:''}<button class="btn" style="border-radius:999px;padding:10px 24px" data-act="closeModal">Fechar</button></div>
  </div>`;
}
function viewGEco(){
  if (ui.g.ecoNew) return viewGEcoNew();
  return shell(`
    ${pageHead('Ecopontos','Gerencie os pontos de coleta e as solicitações de homologação.', `<button class="btn" style="margin-left:auto" data-act="ecoNew">${icon('plus')} Novo ponto de coleta</button>`)}
    <section class="card" style="padding:0"><div class="tbl-wrap"><table class="tbl">
      <thead><tr><th>Ecoponto</th><th>Cidade</th><th>Categorias</th><th>Status</th><th style="text-align:right">Ações</th></tr></thead>
      <tbody>${S.ecopontos.map(e=>`<tr><td><b>${esc(e.nome)}</b><div class="hint" style="margin:0">${esc(e.rua)}, ${esc(e.numero)} · ${esc(e.doc)}</div></td><td>${esc(e.cidade)}</td><td><div class="row wrap" style="gap:4px">${e.cats.map(c=>catPill(c)).join('')}</div></td>
        <td><span class="st st-${e.status.toLowerCase().split(' ')[0]}">${esc(e.status)}</span></td>
        <td><div class="acts"><button class="btn sm outline" data-act="ecoDetails" data-id="${e.id}">Detalhes</button>${e.status!=='Homologado'?`<button class="btn sm" data-act="ecoApprove" data-id="${e.id}">Homologar</button>`:''}</div></td></tr>`).join('')}</tbody>
    </table></div></section>`, 'g/ecopontos');
}
function viewGEcoNew(){
  return shell(`
    ${pageHead('Cadastro de Ponto de Coleta','Informe os dados do local para solicitar a homologação.', `<button class="back" style="margin-left:auto" data-act="ecoBack">${icon('arrowl')} Voltar à lista</button>`)}
    <form data-form="ecoNew" novalidate>
    <div class="grid" style="grid-template-columns:1.35fr 1fr;align-items:start" id="eco-grid">
      <section class="card"><h3>Identificação e endereço</h3>
        <div style="display:grid;grid-template-columns:1fr 140px;gap:0 20px">
          ${field('Nome do ponto de coleta', input('en_nome',{ph:'Ex.: PCMOGI - Soluções em informática e ECOponto'}))}${field('CEP', input('en_cep',{ph:'08820-280', mask:'cep'}))}
          ${field('Rua', input('en_rua',{ph:'R. Prof. Primo Vilar'}))}${field('Número', input('en_num',{ph:'60'}))}
        </div>
        <div class="f2" style="gap:0 24px">${field('Bairro', input('en_bairro',{ph:'Vila Suissa'}))}${field('Cidade', dropdown('en_cidade', fv('en_cidade'), CITIES.map(c=>({v:c,l:c})), {placeholder:'Selecione', title:'Selecione uma cidade'}))}</div>
        <label class="lb">Localização no mapa</label><div class="map" style="border-color:var(--line-2);border-radius:8px;margin-bottom:18px"><img src="${IMG.mini}" alt="Pré-visualização da localização no mapa"></div>
        <label class="lb">Categorias aceitas</label>
        <div class="cbx" style="margin-bottom:18px">${CAT_ORDER.map(c=>`<label><input type="checkbox" data-bind="en_cat_${c}" ${fv('en_cat_'+c)?'checked':''}> ${c}</label>`).join('')}</div>
        ${field('Horário de funcionamento', `<div style="max-width:220px">${input('en_hor',{ph:'Seg a Sex, 8h às 17h'})}</div>`)}
      </section>
      <div class="grid" style="gap:20px">
        <section class="card" style="min-height:280px"><h3>Responsável e contato</h3>
          ${field('Receptor responsável', input('en_resp',{ph:'Nome do responsável'}))}
          ${field('CNPJ', input('en_cnpj',{ph:'00.000.000/0000-00', mask:'cnpj'}))}
          ${field('Telefone / contato', input('en_tel',{ph:'(00) 00000-0000', mask:'tel'}))}</section>
        <section class="card"><h3>Foto do local</h3>
          <label class="drop small" style="min-height:70px;border-style:solid;border-width:1px">${fv('en_foto')?`<img src="${fv('en_foto')}" alt="Foto do local" style="max-height:100px;border-radius:6px">`:`${icon('camera')}<b style="font-size:12px">Tirar foto ou enviar imagem</b><span style="font-size:10px" class="muted">JPG ou PNG até 5 MB</span>`}<input type="file" accept="image/*" class="sr" data-file="ecoFoto"></label></section>
        <section class="card"><h3>Status inicial</h3><span class="pill st-pendente" style="margin:16px 0 0 40px;padding:4px 10px">Pendente de homologação</span></section>
        <button class="btn" type="submit" style="justify-self:end;padding:13px 40px">Salvar ponto de coleta</button>
      </div>
    </div></form>`, 'g/ecopontos');
}
