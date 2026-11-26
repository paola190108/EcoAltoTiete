// Utilitários: CEP, máscaras e validações (e-mail, CPF, CNPJ, senha).
const CEP_DB = [
  [8700,8899,'Mogi das Cruzes'],[8600,8699,'Suzano'],[8570,8599,'Itaquaquecetuba'],[8550,8569,'Poá'],
  [8500,8549,'Ferraz de Vasconcelos'],[7400,7499,'Arujá'],[7000,7399,'Guarulhos'],[8900,8919,'Guararema'],
  [8940,8949,'Biritiba Mirim'],[8970,8979,'Salesópolis'],[7500,7599,'Santa Isabel']
];
const CEP_STREETS = {'08820130':['Av. Capitão Arcilio Rizzi','Cezar de Souza'],'08780000':['Av. Voluntário Fernando Pinheiro Franco','Centro'],'08810000':['Av. Ricieri José Marcatto','Vila Suissa'],'08820280':['R. Prof. Primo Vilar','Vila Suissa']};
function lookupCep(cep){
  const d = digits(cep); if (d.length!==8) return null;
  const p = Number(d.slice(0,5));
  const hit = CEP_DB.find(([a,b])=>p>=a&&p<=b); if (!hit) return null;
  const st = CEP_STREETS[d] || ['', ''];
  return {cidade:hit[2], uf:'SP', rua:st[0], bairro:st[1]};
}

const MASKS = {
  cpf: v => { const d=digits(v).slice(0,11); return d.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'); },
  cnpj: v => { const d=digits(v).slice(0,14); return d.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1/$2').replace(/(\d{4})(\d)/,'$1-$2'); },
  tel: v => { const d=digits(v).slice(0,11); if (d.length<=10) return d.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{4})(\d)/,'$1-$2'); return d.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2'); },
  cep: v => { const d=digits(v).slice(0,8); return d.replace(/^(\d{5})(\d)/,'$1-$2'); },
  emailcpf: v => /[a-z@]/i.test(v) ? v : MASKS.cpf(v)
};
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e).trim());
function validCPF(c){ const d=digits(c); if(d.length!==11||/^(\d)\1+$/.test(d)) return false; let s=0; for(let i=0;i<9;i++) s+=d[i]*(10-i); let r=(s*10)%11%10; if(r!=d[9]) return false; s=0; for(let i=0;i<10;i++) s+=d[i]*(11-i); r=(s*10)%11%10; return r==d[10]; }
function validCNPJ(c){ const d=digits(c); if(d.length!==14||/^(\d)\1+$/.test(d)) return false; const calc=n=>{let s=0,p=n-7;for(let i=0;i<n;i++){s+=d[i]*p--; if(p<2)p=9;} const r=s%11; return r<2?0:11-r;}; return calc(12)==d[12]&&calc(13)==d[13]; }
const pwRules = p => ({len:p.length>=8, num:/\d/.test(p), esp:/[^A-Za-z0-9]/.test(p)});
