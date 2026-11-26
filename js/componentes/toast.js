// Componente: toasts e mensagens de alerta.
function toast(type, title, msg, ms){
  const el = document.createElement('div');
  if (type==='ok'){ el.className='toast ok'; el.innerHTML = `<span class="ck">${icon('check')}</span><b>${esc(title)}</b>`; }
  else { el.className='toast'; el.innerHTML = `<b>${esc(title)}</b><p>${esc(msg||'')}</p><button class="x" aria-label="Fechar">${icon('x')}</button>`; el.querySelector('.x').onclick=()=>el.remove(); }
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>el.remove(), ms || (type==='ok'?3200:5200));
}
const ALERTS = {
  cpf:['CPF/CNPJ inválido','Confira os números informados e tente novamente.'],
  email:['E-mail inválido ou já cadastrado','Digite um e-mail válido ou entre na sua conta.'],
  senha:['Senha incorreta','Confira sua senha e tente novamente.'],
  coincidem:['As senhas não coincidem','Digite a mesma senha nos dois campos.'],
  curta:['Senha muito curta','Use pelo menos 8 caracteres.'],
  expirado:['Código expirado','Solicite o reenvio do código de verificação.'],
  cep:['CEP não encontrado','Tente novamente ou preencha o endereço manualmente.'],
  local:['Falha na localização','Ative a localização ou filtre os pontos manualmente.'],
  classificar:['Não foi possível classificar o resíduo','Tente novamente ou classifique o resíduo manualmente.'],
  envio:['Falha no envio do e-mail','Verifique seu endereço e solicite o reenvio.']
};
const alertT = (k, extra) => toast('err', ALERTS[k][0], extra || ALERTS[k][1]);
