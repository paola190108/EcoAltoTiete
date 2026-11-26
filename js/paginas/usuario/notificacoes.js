/*tela de notificações*/
function viewNotifs(){
  const u = me(), f = ui.notifFilter;
  const all = S.notifications.filter(n=>n.userId===u.id);
  const list = all.filter(n=>f==='todas' || (f==='lidas'?n.lida:!n.lida));
  const unread = all.filter(n=>!n.lida).length;
  return shell(`
    ${pageHead('Notificações', `${unread} não lida${unread===1?'':'s'}`, `<button class="btn light sm" style="margin-left:auto;margin-top:6px;padding:8px 10px" data-act="readAll" ${unread?'':'disabled'}>${icon('check')} ${unread?'Marcar todas como lidas':'Todas lidas'}</button>`)}
    <div class="row" style="margin:-12px 0 36px">${[['todas','Todas'],['lidas','Lidas'],['nlidas','Não lidas']].map(([k,l])=>`<button class="chip ${f===k?'on':''}" data-act="nfilter" data-f="${k}">${l}</button>`).join('')}</div>
    ${list.length ? list.map(n=>`<article class="notif ${n.lida?'read':''}" data-act="readNotif" data-id="${n.id}">
        ${n.lida?'':'<span class="dot" aria-label="não lida"></span>'}
        <h3>${esc(n.titulo)}</h3><p>${esc(n.texto)}</p>
        ${n.acao?`<button class="btn" data-act="notifGo" data-id="${n.id}">${n.acao==='recompensas'?'Ir para recompensas':'Ver agendamentos'}</button>`:''}
        <small>${shortDate(n.data)} · ${n.tipo==='recompensa'?'Recompensas':'Sistema'}</small>
      </article>`).join('') : `<div class="empty">${icon('bell')}Nenhuma notificação ${f==='lidas'?'lida':f==='nlidas'?'não lida':''}.</div>`}`);
}
