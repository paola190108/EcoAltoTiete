/*perfil do usuário*/
function viewUProfile(){
  const u = me();
  const done = userSchedules(u.id).filter(s=>s.status==='Realizado').length;
  const ranked = S.users.filter(x=>x.tipo==='usuario').sort((a,b)=>b.pontos-a.pontos);
  const rank = u.pontos>0 ? ranked.findIndex(x=>x.id===u.id)+1 : null;
  const k = 'pf_';
  if (ui.f._pfFor !== u.id) { Object.assign(ui.f, {pf_nome:u.nome, pf_email:u.email, pf_tel:u.telefone||'', pf_cidade:u.cidade||'', pf_bairro:u.bairro||'', pf_pw:'', _pfFor:u.id}); }
  return shell(`
    ${pageHead('Meu perfil','Gerencie seus dados pessoais e de acesso.')}
    <div class="grid g-prof" style="max-width:1020px">
      <section class="card prof"><div class="bigav">${icon('user')}</div><b style="font-size:17px">${esc(u.nome||'Seu nome')}</b><div class="hint">${esc(u.email)} · ${done} descarte${done===1?'':'s'}</div>
        <div class="mini-stats"><div><b>${u.pontos}</b><small>pontos</small></div><div><b>${rank?rank+'º':'—'}</b><small>ranking</small></div></div></section>
      <section class="card"><form data-form="uprofile" novalidate>
        <h3 style="margin-bottom:4px">Dados pessoais e de acesso</h3>
        <div class="f2">
          ${field('Nome', input(k+'nome',{cls:'soft'}))}${field('E-mail', input(k+'email',{type:'email', cls:'soft'}))}
          ${field('Telefone', input(k+'tel',{mask:'tel', cls:'soft'}))}${field('Cidade', input(k+'cidade',{cls:'soft', attrs:'list="dl-cities2"'}))}
          ${field('Bairro', input(k+'bairro',{cls:'soft'}))}${field('Nova senha', input(k+'pw',{eye:true, cls:'soft', ph:'Deixe em branco para manter', attrs:'autocomplete="new-password"'}))}
        </div>
        <datalist id="dl-cities2">${CITIES.map(c=>`<option value="${c}">`).join('')}</datalist>
        <div class="row wrap" style="margin-top:30px"><button type="button" class="link danger" data-act="deleteAccount">Excluir conta</button><span class="spacer"></span><button type="button" class="btn light" data-act="pfCancel">Cancelar</button><button class="btn" type="submit">Salvar alterações</button></div>
      </form></section>
    </div>`);
}
