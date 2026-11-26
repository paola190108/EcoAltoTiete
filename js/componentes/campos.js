// Componente: dropdown, entrada e proteção de formulário.
function dropdown(key, value, options, {placeholder='Selecione', title='', plain=false}={}){
  const open = ui.dd===key;
  const cur = options.find(o=>o.v===value);
  return `<div class="dd ${open?'open':''}">
    <button type="button" class="dd-btn" data-act="ddToggle" data-key="${key}" aria-expanded="${open}">${cur?esc(cur.l):`<span class="ph">${esc(placeholder)}</span>`}${icon('chev')}</button>
    ${open?`<div class="dd-menu ${plain?'plain':''}">${title?`<div class="t">${esc(title)}</div>`:''}${options.map(o=>`<button type="button" class="${o.v===value?'sel':''}" data-act="ddPick" data-key="${key}" data-val="${esc(o.v)}">${esc(o.l)}</button>`).join('')}</div>`:''}
  </div>`;
}
const fv = (k, d='') => ui.f[k] ?? d;
function input(key, {type='text', ph='', mask='', ic='', eye=false, cls='', attrs='', val}={}){
  const v = val!==undefined ? val : fv(key);
  const t = eye ? (ui.f['_show_'+key] ? 'text' : 'password') : type;
  const el = `<input class="inp ${cls}" id="f-${key}" type="${t}" placeholder="${esc(ph)}" value="${esc(v)}" data-bind="${key}" ${mask?`data-mask="${mask}"`:''} ${attrs}>`;
  if (!ic && !eye) return el;
  return `<div class="inp-ic">${ic?icon(ic,'lead'):''}${el}${eye?`<button type="button" class="eye" data-act="toggleEye" data-key="${key}" aria-label="Mostrar senha">${icon(ui.f['_show_'+key]?'eyeoff':'eye')}</button>`:''}</div>`;
}
const field = (label, inner, extra='') => `<div class="field" ${extra}><label class="lb">${label}</label>${inner}</div>`;
