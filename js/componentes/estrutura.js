/*topo de página*/
function shell(content, active){
  const u = me(); const t = u.tipo;
  const NAV = {
    usuario:[['u/inicio','home','Início'],['u/identificar','camera','Identificar resíduo'],['u/pontos','map','Pontos de coleta e agendamento'],['u/recompensas','gift','Recompensas'],['u/notificacoes','bell','Notificações'],['u/perfil','user','Meu perfil'],['u/sobre','heart','Sobre a iniciativa']],
    receptor:[['r/inicio','home','Início'],['r/perfil','user','Meu perfil']],
    gestor:[['g/inicio','home','Início'],['g/ecopontos','pin','Ecopontos'],['g/relatorios','columns','Relatórios'],['g/configuracoes','settings','Configurações']]
  }[t];
  const unread = unreadCount(u.id);
  const cur = active || route();
  const isOn = r => cur===r || (r==='u/pontos' && cur==='u/agendamento');
  const role = {usuario:'Usuário', receptor:'Receptor', gestor:'Gestor'}[t];
  return `<div class="shell ${ui.menu?'menu':''}">
    <aside class="side" aria-label="Menu principal">
      <div class="logo"><img src="${IMG.logo}" alt=""><span>EcoAltoTietê</span></div>
      <nav class="nav">${NAV.map(([r,ic,l])=>`<button class="${isOn(r)?'on':''}" data-act="go" data-to="${r}">${icon(ic)}<span>${l}</span>${r==='u/notificacoes'&&unread?`<span class="badge">${unread}</span>`:''}</button>`).join('')}</nav>
      <button class="out" data-act="logout">${icon('logout')} Sair</button>
    </aside>
    <div class="main">
      <header class="top">
        <button class="burger" data-act="menu" aria-label="Abrir menu">${icon('menu')}</button>
        <span class="crumb">Alto Tietê · Gestão de resíduos eletrônicos</span>
        <span class="spacer"></span>
        ${t!=='gestor'?`<button class="bell" data-act="${t==='usuario'?'go':'noop'}" data-to="u/notificacoes" aria-label="Notificações">${icon('bell')}${unread?'<span class="dot"></span>':''}</button>`:''}
        <button class="who" data-act="go" data-to="${t==='usuario'?'u/perfil':t==='receptor'?'r/perfil':'g/configuracoes'}"><span class="av">${esc(initials(t==='gestor'?'G':t==='receptor'?'R':u.nome))}</span><span class="txt"><b>${esc(t==='usuario'?u.nome.split(' ')[0]:role)}</b><small>${role}</small></span></button>
      </header>
      <main class="content">${content}</main>
    </div>
  </div>`;
}
const pageHead = (t, s, right='') => `<div class="ph"><div><h1>${t}</h1>${s?`<p>${s}</p>`:''}</div>${right}</div>`;
