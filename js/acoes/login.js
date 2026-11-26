// Ações: login, verificação de e-mail e código.
function doLogin(id, pw, remember){
  const idT = String(id||'').trim().toLowerCase();
  const u = S.users.find(x=>x.email.toLowerCase()===idT || (x.cpf && digits(x.cpf)===digits(idT) && digits(idT).length===11));
  if (!u) { if (/@/.test(idT) && !validEmail(idT)) alertT('email'); else toast('err','Conta não encontrada','Verifique o e-mail/CPF ou crie uma conta.'); return; }
  if (u.senha !== pw) { alertT('senha'); return; }
  if (!u.verificado) { startVerify(u.email,'cadastro'); go('confirmar-email'); return; }
  S.session = {userId:u.id, remember:!!remember}; save();
  try { sessionStorage.setItem('eco-alive','1'); } catch(e){}
  ui.f = {}; ui.ident = null; ui.draft = {tipo:'ponto'}; ui.proto = false;
  go(HOME[u.tipo]);
}
function startVerify(email, purpose){
  if (/falha/i.test(email)) { alertT('envio'); return false; }
  ui.verify = {email, purpose, code:code6(), sentAt:Date.now(), ok:false};
  ui.f.otp = '';
  toast('ok', `Código enviado para ${email}`);
  return true;
}
function checkOtp(){
  const v = ui.verify, typed = fv('otp');
  if (typed.length<6) { toast('err','Código incompleto','Digite os 6 dígitos do código.'); return false; }
  if (Date.now()-v.sentAt > 5*60*1000) { alertT('expirado'); return false; }
  if (typed !== v.code) { toast('err','Código inválido','Confira o código recebido ou solicite o reenvio.'); return false; }
  return true;
}
