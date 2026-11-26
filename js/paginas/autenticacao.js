/*telas de autenticação*/
function authLayout(inner, robot){
  return `<div class="auth">
    <aside class="auth-side">
      <div class="brand"><img src="${IMG.logo}" alt=""><b>EcoAltoTietê</b></div>
      <h2>Descarte hoje,<br>preserve o amanhã.</h2>
      <p>Um futuro mais sustentável começa com a destinação correta dos resíduos eletrônicos.</p>
      <img class="art" src="${IMG.ewaste}" alt="Ilustração de eletrodomésticos e eletrônicos empilhados">
      <div class="auth-feats">
        <div>${icon('pin')}Encontre pontos de coleta</div>
        <div>${icon('calendar')}Agende a coleta</div>
        <div>${icon('star')}Ganhe recompensas</div>
      </div>
    </aside>
    <section class="auth-main">
      <div class="auth-box"><div class="auth-mobile-logo"><span><img src="${IMG.logo}" alt=""></span>EcoAltoTietê</div>${inner}</div>
      ${robot?`<div class="bubble ${robot.big?'big':''}">${robot.text}</div><img class="robot" src="${IMG.robot}" alt="">`:''}
    </section>
  </div>`;
}

function viewLogin(){
  return authLayout(`
    <h1>Bem-vindo(a)!</h1>
    <p class="sub">Acesse sua conta ou crie uma para continuar</p>
    <form data-form="login" novalidate>
      ${'<div class="field">'}${dropdown('login_tipo', '', [{v:'receptor',l:'Receptor'},{v:'usuario',l:'Usuário Comum'},{v:'gestor',l:'Gestor'}], {placeholder:'Tipo de usuário', plain:true})}${'</div>'}
      ${field('<b>E-mail ou CPF:</b>', input('login_id',{ph:'Digite seu e-mail ou CPF', ic:'mail', mask:'emailcpf', attrs:'autocomplete="username"'}))}
      ${field('<b>Senha:</b>', input('login_pw',{ph:'Digite sua senha', ic:'lock', eye:true, attrs:'autocomplete="current-password"'}))}
      <div style="text-align:right;margin:-4px 0 18px"><button type="button" class="link plain" data-act="go" data-to="recuperar">Esqueci minha senha.</button></div>
      <label class="check" style="margin-bottom:20px"><input type="checkbox" data-bind="login_rem" ${fv('login_rem')?'checked':''}> Mantenha-me conectado neste dispositivo</label>
      <button class="btn block" type="submit">Entrar</button>
      <div class="or">ou</div>
      <button class="btn light block" type="button" data-act="go" data-to="cadastro">Criar conta</button>
    </form>
</div>`);
}

function viewCadastro(){
  const st = ui.reg.step, tipo = ui.reg.tipo, rec = tipo==='receptor';
  let body = '';
  if (st===1){
    body = `
      ${field('Tipo de usuário:', dropdown('reg_tipo', tipo, [{v:'receptor',l:'Receptor'},{v:'usuario',l:'Usuário Comum'}], {plain:true}))}
      ${rec ? `
        ${field('Nome do ecoponto:', input('reg_nome',{ph:'Digite o nome do ponto de coleta'}))}
        ${field('CNPJ:', input('reg_doc',{ph:'Digite o CNPJ do local', mask:'cnpj', attrs:'inputmode="numeric"'}))}
        ${field('E-mail:', input('reg_email',{type:'email', ph:'Digite o e-mail corporativo'}))}
        ${field('Telefone:', input('reg_tel',{ph:'Digite um número de contato', mask:'tel', attrs:'inputmode="tel"'}))}
      ` : `
        ${field('Nome:', input('reg_nome',{ph:'Digite seu nome completo'}))}
        ${field('Telefone:', input('reg_tel',{ph:'Digite seu número de contato', mask:'tel', attrs:'inputmode="tel"'}))}
        ${field('E-mail:', input('reg_email',{type:'email', ph:'Digite seu e-mail'}))}
        ${field('CPF:', input('reg_doc',{ph:'Digite seu CPF', mask:'cpf', attrs:'inputmode="numeric"'}))}
      `}`;
  } else if (st===2){
    body = `
      ${field('CEP:', input('reg_cep',{ph:'Digite seu CEP', mask:'cep', attrs:'inputmode="numeric"'}))}
      <div style="display:grid;grid-template-columns:1fr 66px;gap:12px">
        ${field('Cidade:', input('reg_cidade',{ph:'Digite o nome de sua cidade', attrs:'list="dl-cities"'}))}
        ${field('UF:', input('reg_uf',{attrs:'maxlength="2" style="text-transform:uppercase"'}))}
      </div>
      <datalist id="dl-cities">${CITIES.map(c=>`<option value="${c}">`).join('')}</datalist>
      ${field('Bairro:', input('reg_bairro',{ph:'Digite o nome de seu bairro'}))}
      ${field('Rua:', input('reg_rua',{ph:rec?'Digite o nome da rua do ecoponto':'Digite o nome da rua em que mora'}))}
      ${rec ? `${field('Complemento:', input('reg_comp',{ph:'Digite complemento se houver'}))}${field('Tipo de via:', input('reg_via',{ph:'Ex.: Travessa, viela...'}))}` : '<div style="height:60px"></div>'}`;
  } else {
    const p = fv('reg_pw'), r = pwRules(p), p2 = fv('reg_pw2');
    body = `
      <div style="height:30px"></div>
      ${field('Senha:', input('reg_pw',{ph:'Digite uma senha', ic:'lock', eye:true, attrs:'autocomplete="new-password"'}) + `
        <ul class="rules" id="pw-rules">${ruleLi(r.len,'Mínimo de 8 caracteres',p)}${ruleLi(r.num,'Deve conter número',p)}${ruleLi(r.esp,'Deve conter caracteres especiais',p)}</ul>`)}
      <div style="height:20px"></div>
      ${field('Confirme sua senha:', input('reg_pw2',{ph:'Digite sua senha novamente', ic:'lock', eye:true, attrs:'autocomplete="new-password"'}) + `<ul class="rules" id="pw-match">${p2?ruleLi(p===p2,'As senhas coincidem',p2):''}</ul>`)}
      <label class="check" style="margin:20px 0 40px"><input type="checkbox" data-bind="reg_terms" ${fv('reg_terms')?'checked':''}> <span>Aceito os <button type="button" class="link plain" style="text-decoration:underline" data-act="terms">termos de privacidade (ler aqui)</button></span></label>`;
  }
  const bubble = rec && st===1 ? {text:'Bem vindo(a)!', big:true} : (!rec ? {text:'Na falta de algum desses dados, compareça pessoalmente em algum ecoponto para realização do cadastro.'} : null);
  return authLayout(`
    <h1>Criar conta</h1>
    <p class="sub" style="margin-bottom:18px">Etapa ${st} de 3</p>
    <form data-form="cadastro" novalidate>
      ${body}
      <button class="btn block" type="submit">${st===3?'Criar conta':'Continuar'}</button>
      ${st>1?`<button type="button" class="back" style="margin-top:12px" data-act="regBack">${icon('arrowl')} Voltar</button>`:''}
      <div class="or">ou</div>
      <button class="btn light block" type="button" data-act="go" data-to="login">Entrar</button>
    </form>`, bubble);
}
const ruleLi = (ok, txt, any) => `<li class="${any?(ok?'ok':'bad'):''}">${any?icon(ok?'check':'x'):'•'} ${txt}</li>`;

function otpInputs(){ return `<div class="otp" id="otp">${[0,1,2,3,4,5].map(i=>`<input inputmode="numeric" maxlength="1" aria-label="Dígito ${i+1}" data-otp="${i}" value="${esc((fv('otp')||'')[i]||'')}">`).join('')}</div>`; }
function resendLabel(){
  const v = ui.verify; if (!v || !v.sentAt) return '';
  const left = Math.max(0, 60 - Math.floor((Date.now()-v.sentAt)/1000));
  return left>0 ? `Reenviar código em 0:${pad(left)}` : `<button type="button" class="link" data-act="resend">Reenviar código</button>`;
}
function viewVerify(){
  if (!ui.verify) { setTimeout(()=>go('login')); return ''; }
  return authLayout(`
    <h1>Confirme seu e-mail</h1>
    <p class="sub">Digite o código de verificação enviado ao e-mail registrado no cadastro.</p>
    <form data-form="verify" novalidate>
      ${otpInputs()}
      <button class="btn block" type="submit">Confirmar código</button>
      <p class="hint" style="text-align:center;margin-top:12px" id="resend">${resendLabel()}</p>
      <p class="hint" style="text-align:center">Protótipo: o código enviado é <span class="code">${esc(ui.verify.code)}</span></p>
      <button type="button" class="back" style="margin-top:22px" data-act="go" data-to="login">${icon('arrowl')} Voltar ao login</button>
    </form>`);
}
function viewRecover(){
  const v = ui.verify && ui.verify.purpose==='senha' ? ui.verify : null;
  return authLayout(`
    <h1>Recuperar senha</h1>
    <p class="sub">Informe seu e-mail ou telefone para receber um código.</p>
    <form data-form="recover" novalidate>
      ${field('E-mail ou telefone:', input('rec_id',{ph:'Digite seu e-mail ou telefone'}))}
      ${v ? otpInputs() : '<div style="height:10px"></div>'}
      ${v ? `<button class="btn block" type="submit">Validar código</button>`
          : `<button class="btn block" type="button" data-act="sendRecover">Enviar código</button>`}
      <p class="hint" style="text-align:center;margin-top:12px" id="resend">${v?resendLabel():''}</p>
      ${v?`<p class="hint" style="text-align:center">Protótipo: o código enviado é <span class="code">${esc(v.code)}</span></p>`:''}
      <button type="button" class="back" style="margin-top:22px" data-act="go" data-to="login">${icon('arrowl')} Voltar ao login</button>
    </form>`);
}
function viewNewPass(){
  if (!ui.verify || !ui.verify.ok) { setTimeout(()=>go('recuperar')); return ''; }
  const p = fv('np_pw'), p2 = fv('np_pw2');
  return authLayout(`
    <h1>Nova senha</h1>
    <p class="sub">Crie uma nova senha para acessar sua conta.</p>
    <form data-form="newpass" novalidate>
      ${field('Senha:', input('np_pw',{ph:'Digite uma senha', ic:'lock', eye:true, attrs:'autocomplete="new-password"'}) + `<ul class="rules">${ruleLi(true,'Mínimo 8 caracteres','')}</ul>`)}
      ${field('Confirme sua senha:', input('np_pw2',{ph:'Digite sua senha novamente', ic:'lock', eye:true, attrs:'autocomplete="new-password"'}) + `<ul class="rules" id="np-rules">${npRules(p,p2)}</ul>`)}
      <button class="btn block" type="submit" style="margin-top:10px">Confirmar alteração</button>
      <button type="button" class="back" style="margin-top:14px;font-weight:700" data-act="go" data-to="login">${icon('arrowl')} Voltar ao login</button>
    </form>`);
}
const npRules = (p,p2) => ruleLi(p.length>=8,'Mínimo 8 caracteres',p||' ') + ruleLi(!!p2 && p===p2,'As senhas coincidem',p2||' ');
