/*recompensas*/
function viewRewards(){
  const u = me(), sp = fv('rw_sp');
  const vs = S.vouchers.filter(v=>!sp || v.patrocinador===sp).sort((a,b)=>a.pontos-b.pontos);
  const reds = S.redemptions.filter(r=>r.userId===u.id);
  const sponsorsOpts = [...new Set(S.vouchers.map(v=>v.patrocinador))];
  return shell(`
    ${pageHead('Recompensas','Seus descartes viram benefícios.', `<div class="saldo"><small>Saldo</small><b>${u.pontos} pts</b></div>`)}
    <div style="max-width:300px;margin:0 0 16px 8px"><label class="lb">Patrocinador</label>${dropdown('rw_sp', sp, [{v:'',l:'Todos'}, ...sponsorsOpts.map(s=>({v:s,l:s}))], {placeholder:'Selecione'})}</div>
    <div class="grid g-sched">
      <div class="grid" style="gap:10px">
        <section class="card" style="min-height:290px"><h3>Recompensas disponíveis</h3>
          <div class="vouchers" style="margin-top:28px">${vs.map(v=>{ const ok = u.pontos>=v.pontos; return `<div class="voucher"><div class="t">VOUCHER ÚNICO</div><div class="v">VALOR: ${money(v.valor)}</div><div class="s">${v.pontos} pts · ${esc(v.patrocinador)}</div><button class="btn sm ${ok?'':'light'}" ${ok?'':'disabled'} data-act="redeem" data-id="${v.id}">${ok?'Resgatar':`Faltam ${v.pontos-u.pontos} pts`}</button></div>`; }).join('') || '<div class="empty">Nenhum voucher para este patrocinador.</div>'}</div>
        </section>
        <section class="card" style="min-height:240px"><h3>Nossos patrocinadores</h3>
          ${S.sponsors.length ? `<div class="row wrap" style="margin-top:16px">${S.sponsors.map(s=>`<span class="pill cat-verde" style="padding:8px 16px;font-size:13px">${esc(s.nome)}</span>`).join('')}</div>` : `<div class="empty" style="padding-top:60px">Ainda não há patrocinadores disponíveis<br>no momento.</div>`}
        </section>
      </div>
      <section class="card"><h3>Histórico de resgates</h3>
        ${reds.length ? reds.map(r=>`<div class="red"><div><b>Voucher ${money(r.valor)}</b><div class="hint" style="margin:2px 0 0">${esc(r.patrocinador)} · ${r.data}</div></div><div style="text-align:right"><span class="code">${r.codigo}</span><div class="hint" style="margin:2px 0 0">−${r.pontos} pts</div></div></div>`).join('') : `<div class="empty" style="padding-top:200px">Nenhum resgate ainda.</div>`}
      </section>
    </div>`);
}
