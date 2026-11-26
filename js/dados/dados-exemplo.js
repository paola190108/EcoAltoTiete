// Dados: histórico sintético e dados de exemplo iniciais (seed).
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function historicalData(){
  // histórico sintético (antes do sistema), usado em relatórios e no painel do gestor
  const r = mulberry(42), out = [];
  const weights = {Branca:42, Azul:30, Verde:54, Marrom:21};
  const names = ['Ana Costa','Bruno Lima','Carla Dias','Diego Alves','Elisa Rocha','Fábio Melo','Gabi Nunes','Hugo Reis','Iara Souza','João P.','Maria S.','Natália Pereira'];
  let n = 0;
  for (const cat of CAT_ORDER) for (let i=0;i<weights[cat];i++){
    const items = CATALOG.filter(c=>c.cat===cat), it = items[Math.floor(r()*items.length)];
    const m = Math.floor(r()*10), d = 1+Math.floor(r()*28);
    const city = r()<.55 ? 'Mogi das Cruzes' : CITIES[Math.floor(r()*CITIES.length)];
    const st = r()<.86 ? 'Realizado' : (r()<.5?'Pendente':'Negado');
    out.push({id:'h'+(n++), data:`2026-${pad(m+1)}-${pad(d)}`, cidade:city, categoria:cat, equipamento:it.nome, kg:it.peso, risco:it.risco.split(' ')[0], status:st, nome:names[Math.floor(r()*names.length)]});
  }
  return out;
}
function seed(){
  return {
    version:1,
    users:[
      {id:'u1', tipo:'usuario', nome:'Paola Souza', email:'usuario@eco.com', cpf:'123.456.789-09', telefone:'(11) 98888-7777', cep:'08820-130', cidade:'Mogi das Cruzes', uf:'SP', bairro:'Vila Suissa', rua:'Av. Narciso Yague, 1200', senha:'eco12345', pontos:120, verificado:true, criado:'2026-01-10'},
      {id:'u2', tipo:'usuario', nome:'Natália Pereira', email:'natalia@eco.com', cpf:'987.654.321-00', telefone:'(11) 8888-9999', cidade:'Mogi das Cruzes', uf:'SP', bairro:'Centro', rua:'R. Dr. Deodato Wertheimer, 300', senha:'eco12345', pontos:0, verificado:true, criado:'2026-03-02'},
      {id:'r1', tipo:'receptor', nome:'Ecoponto Cezar de Souza', responsavel:'Monalisa Pereira', email:'receptor@eco.com', cnpj:'12.345.678/0001-90', telefone:'(11) 99999-9999', ecopontoId:'e1', senha:'eco12345', verificado:true, criado:'2026-01-02'},
      {id:'g1', tipo:'gestor', nome:'Gestor', email:'gestor@eco.com', senha:'eco12345', verificado:true}
    ],
    ecopontos:[
      {id:'e1', doc:'EAT-EC-0001', nome:'Ecoponto Cezar de Souza', rua:'Av. Capitão Arcilio Rizzi', numero:'30', bairro:'Cezar de Souza', cidade:'Mogi das Cruzes', cep:'08820-130', cats:['Verde','Branca','Marrom','Azul'], horario:{seg:'08:00–18:00',ter:'08:00–18:00',qua:'08:00–18:00',qui:'08:00–18:00',sex:'08:00–18:00',sab:'08:00–18:00',dom:'Fechado'}, horarioTxt:'Seg a Sáb, 8h às 18h', telefone:'(11) 99999-9999', cnpj:'12.345.678/0001-90', responsavel:'Monalisa Pereira', status:'Homologado', x:86, y:66},
      {id:'e2', doc:'EAT-EC-0002', nome:'Ecoponto Central', rua:'Av. Ricieri José Marcatto', numero:'1226', bairro:'Vila Suissa', cidade:'Mogi das Cruzes', cep:'08810-000', cats:['Verde','Azul'], horario:{seg:'08:00–17:00',ter:'08:00–17:00',qua:'08:00–17:00',qui:'08:00–17:00',sex:'08:00–17:00',sab:'Fechado',dom:'Fechado'}, horarioTxt:'Seg a Sex, 8h às 17h', telefone:'(11) 0000-0000', cnpj:'00.000.000/0001-00', responsavel:'Nome do responsável', status:'Homologado', x:25, y:22},
      {id:'e3', doc:'EAT-EC-0003', nome:'Ecoponto Jardim Imperador', rua:'R. Benjamin Constant', numero:'540', bairro:'Jardim Imperador', cidade:'Suzano', cep:'08673-000', cats:['Branca','Marrom'], horario:{seg:'09:00–17:00',ter:'09:00–17:00',qua:'09:00–17:00',qui:'09:00–17:00',sex:'09:00–17:00',sab:'09:00–13:00',dom:'Fechado'}, horarioTxt:'Seg a Sex, 9h às 17h · Sáb até 13h', telefone:'(11) 4747-0000', cnpj:'22.333.444/0001-55', responsavel:'Ana Costa', status:'Homologado', x:52, y:30}
    ],
    schedules:[
      {id:'s0', codigo:'327476', userId:'u2', userNome:'Natália Pereira', telefone:'(11) 8888-9999', tipo:'ponto', equipamento:'Notebook Dell Inspiron 15 + Fonte original', qtd:1, categoria:'Verde', kg:2.4, data:'2026-11-10', hora:'10:30 - 11:30', ecopontoId:'e1', local:'Ecoponto Cezar de Souza', status:'Pendente', estado:'', obs:'', criado:'2026-11-05'},
      {id:'s1', codigo:'418220', userId:'u1', userNome:'Paola Souza', telefone:'(11) 98888-7777', tipo:'ponto', equipamento:'Teclado Kumara', qtd:1, categoria:'Verde', kg:0.8, data:'2026-09-12', hora:'09:30 - 10:30', ecopontoId:'e1', local:'Ecoponto Cezar de Souza', status:'Realizado', estado:'Bom', obs:'', pontos:60, criado:'2026-09-01'},
      {id:'s2', codigo:'205117', userId:'u1', userNome:'Paola Souza', telefone:'(11) 98888-7777', tipo:'ponto', equipamento:'Geladeira Consul', qtd:1, categoria:'Branca', kg:45, data:'2026-02-08', hora:'11:00 - 12:00', ecopontoId:'e1', local:'Ecoponto Cezar de Souza', status:'Realizado', estado:'Regular', obs:'', pontos:60, criado:'2026-02-01'},
      {id:'s3', codigo:'550931', userId:'x1', userNome:'Maria S.', telefone:'(11) 97777-1111', tipo:'domicilio', equipamento:'Televisor', qtd:1, categoria:'Marrom', kg:10, data:'2026-11-19', hora:'14:00 - 15:00', ecopontoId:'e2', local:'Residência (Centro)', status:'Realizado', estado:'Regular', obs:'', criado:'2026-11-12'},
      {id:'s4', codigo:'550872', userId:'x2', userNome:'João P.', telefone:'(11) 96666-2222', tipo:'ponto', equipamento:'Liquidificador', qtd:2, categoria:'Azul', kg:5, data:'2026-11-18', hora:'09:00 - 10:00', ecopontoId:'e2', local:'Ecoponto Central', status:'Realizado', estado:'Bom', obs:'', criado:'2026-11-10'}
    ],
    notifications:[
      {id:'n1', userId:'u1', tipo:'recompensa', titulo:'Novo voucher disponível!', texto:'Você atingiu 120 pontos e ganhou R$ 20,00 de desconto. Toque para resgatar sua recompensa.', acao:'recompensas', lida:false, data:'2026-09-12'}
    ],
    vouchers:[
      {id:'v1', patrocinador:'EcoAltoTietê', valor:10, pontos:60},
      {id:'v2', patrocinador:'EcoAltoTietê', valor:20, pontos:120},
      {id:'v3', patrocinador:'EcoAltoTietê', valor:25, pontos:150}
    ],
    sponsors:[],
    redemptions:[],
    config:{raio:5, pontosPorDescarte:60, niveis:'Bronze · Prata · Ouro', regras:{Branca:1, Azul:1, Verde:1, Marrom:1}, cats:{Branca:true, Azul:true, Verde:true, Marrom:true}, notif:{solicitacoes:true, agendamentos:true, homologacoes:true}},
    log:[
      {nome:'Monalisa Pereira', acao:'Aprovou um receptor', quando:'20/11/2026 · 14:32'},
      {nome:'Ana Costa', acao:'Atualizou um agendamento', quando:'10/11/2026 · 20:21'}
    ],
    reports:[
      {id:'rp1', nome:'Descartes — Outubro', data:'01/11/26', params:{status:'', ini:'2026-10-01', fim:'2026-10-31', cidade:'', categoria:''}},
      {id:'rp2', nome:'Impacto ambiental', data:'05/11/26', params:{status:'Realizado', ini:'', fim:'', cidade:'', categoria:''}},
      {id:'rp3', nome:'Por cidade — Anual', data:'10/11/26', params:{status:'', ini:'2026-01-01', fim:'2026-12-31', cidade:'', categoria:''}}
    ],
    session:null
  };
}
