// Componente: modal e caixa de confirmação.
let modalCb = {};
function openModal(html, opts={}){
  modalCb = opts;
  document.getElementById('modal-root').innerHTML = `<div class="ovl ${opts.drawer?'drawer-ovl':''}" data-ovl>${html}</div>`;
}
function closeModal(){ document.getElementById('modal-root').innerHTML=''; modalCb={}; }
function confirmBox(title, text, okLabel, onOk, opts={}){
  openModal(`<div class="modal" role="dialog" aria-modal="true"><div class="mb"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="row"><button class="btn" data-act="closeModal">${esc(opts.cancel||'Voltar')}</button><button class="btn danger" data-act="modalOk">${esc(okLabel)}</button></div></div></div>`, {ok:onOk});
}
