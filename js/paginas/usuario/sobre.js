/*iniciativa*/
function viewAbout(){
  return shell(`
    ${pageHead('Sobre a iniciativa','Descarte hoje, preserve o amanhã.')}
    <section class="about-hero"><h2>O que é o EcoAltoTietê</h2><p>O EcoAltoTietê é uma iniciativa para organizar a coleta de resíduos eletrônicos na região do Alto Tietê. Ajudamos você a identificar o tipo de resíduo, encontrar o ponto de coleta mais próximo, agendar a entrega e ganhar recompensas por descartar corretamente.</p></section>
    <h2 class="sec">Nossos objetivos</h2>
    <div class="grid g4">${[['Descarte correto','Levar cada eletrônico ao destino adequado: reciclagem, reaproveitamento ou tratamento especializado.'],['Educação ambiental','Informar a população sobre os riscos do lixo eletrônico e como separá-lo por categoria.'],['Inclusão social','Fortalecer cooperativas e entidades receptoras, gerando renda e trabalho digno na região.'],['Rede regional','Conectar moradores, ecopontos e gestão pública dos 9 municípios do Alto Tietê.']].map(([t,p])=>`<div class="obj"><b>${t}</b><p>${p}</p></div>`).join('')}</div>
    <h2 class="sec">Impacto ambiental</h2>
    <div class="grid g3">${[['Protege a água','Pilhas, baterias e placas contêm chumbo, mercúrio e cádmio. Descartados no lixo comum, contaminam o solo e os rios — incluindo as nascentes do Rio Tietê, que abastecem milhões de pessoas.'],['Reduz a mineração','Uma tonelada de celulares contém mais ouro que uma tonelada de minério. Reciclar devolve metais à indústria e evita extrair novos recursos.'],['Menos emissões','Reaproveitar materiais consome muito menos energia que produzi-los do zero, diminuindo a emissão de gases de efeito estufa.']].map(([t,p])=>`<div class="imp"><b>${t}</b><p>${p}</p></div>`).join('')}</div>
    <h2 class="sec">Patrocinadores</h2>
    <div class="card" style="border-radius:4px">${S.sponsors.length?`<div class="row wrap">${S.sponsors.map(s=>`<span class="pill cat-verde" style="padding:8px 16px;font-size:13px">${esc(s.nome)}</span>`).join('')}</div>`:'<div class="empty" style="padding:6px">Nenhum patrocinador cadastrado ainda.</div>'}</div>`);
}
