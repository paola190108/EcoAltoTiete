// Dados: cidades, categorias de resíduo, CO₂ por kg, horários e semana.
const CITIES = ['Arujá','Biritiba Mirim','Ferraz de Vasconcelos','Guararema','Guarulhos','Itaquaquecetuba','Mogi das Cruzes','Poá','Salesópolis','Santa Isabel','Suzano'];
const CATS = {
  Branca:{cls:'branca', desc:'Geladeiras, fogões, máquinas de lavar'},
  Azul:{cls:'azul', desc:'Batedeiras, liquidificadores, ferros'},
  Verde:{cls:'verde', desc:'Computadores, notebooks, celulares'},
  Marrom:{cls:'marrom', desc:'TVs, monitores, aparelhos de som'}
};
const CAT_ORDER = ['Branca','Azul','Verde','Marrom'];
const CO2_PER_KG = {Branca:1.6, Azul:3.2, Verde:13, Marrom:6.5};
const catPill = c => `<span class="pill cat-${(CATS[c]||{cls:'branca'}).cls}">${esc(c)}</span>`;
const SLOTS = ['09:00 - 10:00','10:30 - 11:30','14:00 - 15:00','15:30 - 16:30'];
const WEEK = ['segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado','domingo'];
