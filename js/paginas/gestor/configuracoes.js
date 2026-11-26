// Gestor: configurações do sistema.
function viewGConf(){
  const c = S.config;
  if (ui.f._cfg !== true) Object.assign(ui.f, {cf_pts:String(c.pontosPorDescarte), cf_niv:c.niveis, ...Object.fromEntries(CAT_ORDER.map(k=>['cf_r_'+k, String(c.regras[k])])), _cfg:true});
  return shell(`
    ${pageHead('Configurações','Gerencie os parâmetros gerais do sistema.')}
    <div class="grid g2">
      <section class="card"><h3>Busca de pontos de coleta</h3><p class="muted" style="font-size:13px;margin:0 0 8px">Raio padrão de busca</p>
        <input type="range" class="range" min="1" max="20" value="${c.raio}" data-act-input="raio" aria-label="Raio padrão de busca em km">
        <p style="margin:6px 0"><b id="raio-v">${c.raio} km</b></p><p class="hint">Defina a distância padrão utilizada nas buscas.</p></section>
      <section class="card"><h3>Patrocinadores</h3><p class="muted" style="font-size:13px;margin:0 0 10px">Gerencie as informações dos patrocinadores.</p>
        <div style="display:grid;grid-template-columns:1fr 1.2fr auto;gap:10px;align-items:end">
          <div><label class="lb">Nome do patrocinador</label>${input('sp_nome',{ph:'Nome'})}</div><div><label class="lb">Contato</label>${input('sp_cont',{ph:'E-mail / telefone'})}</div><button class="btn" data-act="addSponsor" aria-label="Adicionar patrocinador">${icon('plus')}</button></div>
        <div style="margin-top:12px">${S.sponsors.map(s=>`<div class="row" style="padding:7px 0;border-bottom:1px solid var(--line);font-size:13px"><b>${esc(s.nome)}</b><span class="muted">${esc(s.contato)}</span><span class="spacer"></span><button class="x" data-act="rmSponsor" data-id="${s.id}" aria-label="Remover">${icon('trash')}</button></div>`).join('')}</div></section>
      <section class="card"><h3>Pontuação e recompensas</h3>
        <div class="f2" style="gap:0 24px">${field('<span class="muted">Pontos por descarte</span>', input('cf_pts',{type:'number', attrs:'min="1"'}))}${field('<span class="muted">Níveis de recompensa</span>', input('cf_niv'))}</div>
        <hr style="border:0;border-top:1px solid var(--line);margin:6px 0 16px"><b style="font-weight:500">Regras de pontuação</b><p class="hint" style="margin:6px 0 14px">Configure o multiplicador de pontuação atribuído às categorias.</p>
        <div class="grid g4" style="gap:10px">${CAT_ORDER.map(k=>`<div><label class="lb" style="font-size:12px">${catPill(k)}</label>${input('cf_r_'+k,{type:'number', attrs:'step="0.1" min="0"'})}</div>`).join('')}</div>
        <button class="link" style="margin-top:18px" data-act="saveRules">Salvar regras</button></section>
      <section class="card"><h3>Categorias de resíduos</h3><p class="muted" style="font-size:13px;margin:0 0 14px">Categorias disponíveis no sistema</p>
        ${CAT_ORDER.map(k=>`<div class="toggle-row"><span>${k}</span><button class="sw ${c.cats[k]?'':'off'}" data-act="toggleCat" data-c="${k}" aria-pressed="${c.cats[k]}">${c.cats[k]?'Ativa':'Inativa'}</button></div>`).join('')}
        <hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><b>Notificações automáticas</b><p class="hint" style="margin:6px 0">${Object.entries({solicitacoes:'Solicitações',agendamentos:'Agendamentos',homologacoes:'Homologações'}).filter(([k])=>c.notif[k]).map(([,l])=>l).join(' · ')||'Nenhuma ativa'}</p>
        <button class="link" data-act="notifCfg">Configurar tipos de notificação</button></section>
    </div>`);
}
