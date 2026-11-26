// Dados: catálogo de equipamentos usado na identificação.
const CATALOG = [
  {k:['notebook','laptop','thinkpad','macbook'], nome:'Notebook', marca:'Lenovo', cat:'Verde', risco:'Médio — bateria de lítio', peso:2.4, co2:'25 kg a 40 kg'},
  {k:['celular','smartphone','iphone','phone'], nome:'Smartphone', marca:'Samsung', cat:'Verde', risco:'Médio — bateria de lítio', peso:0.2, co2:'2 kg a 4 kg'},
  {k:['computador','desktop','cpu','gabinete','pc'], nome:'Computador de mesa', marca:'Dell', cat:'Verde', risco:'Baixo', peso:7, co2:'60 kg a 95 kg'},
  {k:['teclado','keyboard','mouse'], nome:'Teclado', marca:'Kumara', cat:'Verde', risco:'Baixo', peso:0.8, co2:'5 kg a 9 kg'},
  {k:['tablet','ipad'], nome:'Tablet', marca:'Samsung', cat:'Verde', risco:'Médio — bateria de lítio', peso:0.5, co2:'6 kg a 9 kg'},
  {k:['impressora','printer'], nome:'Impressora', marca:'HP', cat:'Verde', risco:'Baixo — cartuchos de tinta', peso:5, co2:'30 kg a 45 kg'},
  {k:['geladeira','refrigerador','freezer'], nome:'Geladeira', marca:'Consul', cat:'Branca', risco:'Alto — gás refrigerante', peso:45, co2:'70 kg a 110 kg'},
  {k:['fogao','fogão','cooktop'], nome:'Fogão', marca:'Brastemp', cat:'Branca', risco:'Médio — componentes a gás', peso:30, co2:'40 kg a 55 kg'},
  {k:['maquina','lavar','lavadora','washer'], nome:'Máquina de lavar', marca:'Electrolux', cat:'Branca', risco:'Baixo', peso:35, co2:'50 kg a 70 kg'},
  {k:['microondas','micro-ondas'], nome:'Micro-ondas', marca:'Panasonic', cat:'Branca', risco:'Médio — capacitor de alta tensão', peso:12, co2:'18 kg a 26 kg'},
  {k:['tv','televisao','televisão','televisor'], nome:'Televisor', marca:'LG', cat:'Marrom', risco:'Médio — tela/placas', peso:10, co2:'45 kg a 80 kg'},
  {k:['monitor','tela'], nome:'Monitor', marca:'AOC', cat:'Marrom', risco:'Médio — tela/placas', peso:4, co2:'20 kg a 35 kg'},
  {k:['som','caixa','speaker','radio','rádio'], nome:'Aparelho de som', marca:'Philco', cat:'Marrom', risco:'Baixo', peso:5, co2:'12 kg a 20 kg'},
  {k:['liquidificador','blender'], nome:'Liquidificador', marca:'Arno', cat:'Azul', risco:'Baixo', peso:2.5, co2:'6 kg a 9 kg'},
  {k:['batedeira','mixer'], nome:'Batedeira', marca:'Mondial', cat:'Azul', risco:'Baixo', peso:2, co2:'5 kg a 8 kg'},
  {k:['ferro','iron'], nome:'Ferro de passar', marca:'Black+Decker', cat:'Azul', risco:'Baixo', peso:1.2, co2:'3 kg a 5 kg'},
  {k:['secador','hair'], nome:'Secador de cabelo', marca:'Taiff', cat:'Azul', risco:'Baixo', peso:0.6, co2:'2 kg a 3 kg'},
  {k:['furadeira','drill'], nome:'Furadeira', marca:'Bosch', cat:'Azul', risco:'Baixo', peso:1.8, co2:'5 kg a 7 kg'}
];
