//Receptor: perfil.
function viewRProfile(){
  const u = me(), e = eco(u.ecopontoId) || {};
  if (ui.f._rpFor !== u.id) Object.assign(ui.f, {rp_nome:u.nome, rp_resp:u.responsavel||e.responsavel||'', rp_cep:e.cep||'', rp_num:e.numero||'', rp_rua:e.rua||'', rp_bairro:e.bairro||'', rp_cidade:e.cidade||'', rp_hor:e.horarioTxt||'', rp_pw:'', _rpFor:u.id});
  return shell(`
    <div class="grid g-prof" style="max-width:1100px">
      <div>
        ${pageHead('Perfil do Ecoponto','Dados da entidade.')}
        <section class="card prof"><div class="bigav">${icon('user')}</div><b style="font-size:22px">${esc(u.nome)}</b>
          <div style="text-align:left;margin-top:40px"><b style="font-size:13px">Categorias aceitas</b>
            <div class="f2" style="gap:12px;margin-top:12px">${CAT_ORDER.map(c=>`<label class="check" style="font-size:12.5px"><input type="checkbox" data-act-change="rpCat" value="${c}" ${(e.cats||[]).includes(c)?'checked':''}> ${c}</label>`).join('')}</div></div></section>
        <div style="text-align:center;margin-top:24px"><span class="st st-${(e.status||'pendente').toLowerCase().split(' ')[0]}" style="padding:6px 50px;font-weight:600">${esc(e.status||'Pendente')}</span></div>
      </div>
      <section class="card"><form data-form="rprofile" novalidate>
        <h3>Entidade</h3>
        <div class="f3">${field('<span class="faint">Nome da entidade</span>', input('rp_nome',{cls:'soft'}))}${field('<span class="faint">CNPJ</span>', `<input class="inp" disabled value="${esc(u.cnpj)}">`)}${field('<span class="faint">Responsável legal</span>', input('rp_resp',{cls:'soft'}))}</div>
        <p class="hint" style="margin-top:-8px">O CNPJ da entidade não pode ser alterado.</p>
        <hr style="border:0;border-top:1px solid var(--line);margin:18px 0">
        <h3>Endereço e funcionamento</h3>
        <div class="f2">${field('<span class="faint">CEP</span>', input('rp_cep',{mask:'cep', cls:'soft', ph:'00000-000'}))}${field('<span class="faint">Número</span>', input('rp_num',{cls:'soft'}))}
          ${field('<span class="faint">Rua</span>', input('rp_rua',{cls:'soft'}))}${field('<span class="faint">Bairro</span>', input('rp_bairro',{cls:'soft'}))}
          ${field('<span class="faint">Cidade</span>', input('rp_cidade',{cls:'soft', attrs:'list="dl-cities3"'}))}${field('<span class="faint">Horário de funcionamento</span>', input('rp_hor',{cls:'soft', ph:'Ex.: Seg a Sex, 8h às 17h'}))}</div>
        <datalist id="dl-cities3">${CITIES.map(c=>`<option value="${c}">`).join('')}</datalist>
        <hr style="border:0;border-top:1px solid var(--line);margin:8px 0 18px">
        <div style="max-width:300px;margin:0 auto">${field('Nova senha', input('rp_pw',{eye:true, cls:'soft', ph:'Deixe em branco para manter', attrs:'autocomplete="new-password"'}))}</div>
        <div class="row wrap" style="margin-top:40px;align-items:flex-end"><div><button type="button" class="link danger" data-act="deleteAccount">Excluir conta</button><br><button type="button" class="link danger" style="margin-top:22px" data-act="logout">Sair da conta</button></div><span class="spacer"></span><button type="button" class="btn light" data-act="rpCancel">Cancelar</button><button class="btn" type="submit">Salvar alterações</button></div>
      </form></section>
    </div>`, 'r/perfil');
}
