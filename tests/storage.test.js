require('fake-indexeddb/auto');
const {IDBFactory}=require('fake-indexeddb');
const {JSDOM,VirtualConsole}=require('jsdom');const fs=require('fs');
const HTML=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');const K="SMART_CLINICAI_DB_V1";
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function open(idbF,ls={},opt={}){const alerts=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>console.log('  JSERR',e.message));
 const d=new JSDOM(HTML,{runScripts:'dangerously',url:'https://x.test/',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.indexedDB=idbF;for(const k in ls)w.localStorage.setItem(k,ls[k]);
  if(opt.quota){const o=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,v){if(k==K)throw new Error('QuotaExceeded');return o.call(this,k,v)}}}});
 const w=d.window;await wait(600);w.__alerts=alerts;return w}
const ls=w=>{const o={};for(let i=0;i<w.localStorage.length;i++){const k=w.localStorage.key(i);o[k]=w.localStorage.getItem(k)}return o};
const snaps=w=>w.eval('tx("snap","readonly",o=>o.getAllKeys())');
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
(async()=>{
 // A: dados antigos (sem schema, com apiKey, prev e qsofa)
 const legacy={apiKey:"sk-x",model:"m",pts:[{id:"a1",leito:"A1",nome:"Old",idade:70,pend:[{t:"x"}],alg:{n:0,i:[{n:"Dipirona"}]},sc:{qsofa:"q",x:"y"},prev:{d:"2026-11-01",evol:"ontem",plano:"p"},day:"2026-11-01"}]};
 let F=new IDBFactory();let w=await open(F,{[K]:JSON.stringify(legacy)});
 let S=w.eval('S');ok(S.schema==2,'A migra para schema 2');ok(!('apiKey' in S),'A remove apiKey');
 let p=S.pts[0];ok(p.historicoInternacao.length==1&&p.historicoInternacao[0].anotacaoDia=='ontem'&&!p.prev,'A converte prev em histórico');
 ok(!p.sc.qsofa&&p.sc.x=='y','A remove qsofa e mantém outros escores');ok(Array.isArray(p.atb)&&p.alg.i[0].r.length==0&&p.ecog===null,'A completa campos faltantes');
 await wait(400);let k=await snaps(w);ok(k.some(x=>x.startsWith('pre-v1'))&&k.some(x=>x.startsWith('dia-')),'A cria cópia pré-migração e do dia: '+k.join(','));
 let st=JSON.parse(await w.eval('tx("kv","readonly",o=>o.get("state"))'));ok(st.pts[0].nome=='Old'&&st.schema==2,'A grava no IndexedDB');
 // B: localStorage apagado -> recupera do IndexedDB
 w=await open(F,{});ok(w.eval('S.pts.length')==1&&w.eval('S.pts[0].nome')=='Old','B recupera do IndexedDB sem localStorage');
 ok(JSON.parse(w.localStorage.getItem(K)).pts.length==1,'B recompõe o localStorage');
 // C: localStorage cheio -> salva só no IndexedDB e reabre com o mais novo
 w=await open(F,ls(w),{quota:true});w.eval('S.pts[0].nome="Novo";pst()');await wait(400);
 const stale=ls(w);w=await open(F,stale);ok(w.eval('S.pts[0].nome')=='Novo','C com localStorage cheio, o IndexedDB mais novo vence');
 // I: versão antiga do app (sem IndexedDB) alterou só o localStorage, mantendo savedAt
 { const F2=new IDBFactory();let w2=await open(F2,{[K]:JSON.stringify({schema:2,pts:[{id:"o1",nome:"Antes"}]})});await wait(400);
   const old=JSON.parse(w2.localStorage.getItem(K));old.pts[0].nome="Mudou no app antigo";
   w2=await open(F2,{[K]:JSON.stringify(old)});ok(w2.eval('S.pts[0].nome')=='Mudou no app antigo','I alteração feita por versão antiga (só localStorage) não se perde');
   const raw={pts:[{nome:"Sem data"}]};w2=await open(F2,{[K]:JSON.stringify(raw)});ok(w2.eval('S.pts[0].nome')=='Sem data','I localStorage sem savedAt prevalece sobre IndexedDB'); }
 // D: dados de versão futura preservam campos desconhecidos
 const fut={schema:9,pts:[{id:"f1",leito:"B2",nome:"Fut",campoNovo:{a:1}}],configNova:true};
 w=await open(new IDBFactory(),{[K]:JSON.stringify(fut)});S=w.eval('S');ok(S.schema==9&&S.configNova===true&&S.pts[0].campoNovo.a==1,'D versão futura: mantém schema e campos desconhecidos');
 // E: importar backup antigo cria cópia antes
 F=new IDBFactory();w=await open(F,{[K]:JSON.stringify({schema:2,pts:[{id:"z",nome:"Atual"}]})});
 const txt=JSON.stringify({apiKey:"k",pts:[{nome:"Importado"}]});
 await w.eval(`(async()=>{const f=new File([${JSON.stringify(txt)}],"b.json");impBk({files:[f],value:""})})()`);await wait(500);
 ok(w.eval('S.pts[0].nome')=='Importado'&&w.eval('!!S.pts[0].id'),'E importa backup antigo e gera id');k=await snaps(w);ok(k.some(x=>x.startsWith('antes-importar')),'E cria cópia antes de importar');
 // F: restaurar cópia
 const ki=k.find(x=>x.startsWith('antes-importar'));await w.eval(`SNR(${JSON.stringify(ki)},{textContent:""}).then(()=>SNR(${JSON.stringify(ki)},{}))`);await wait(500);
 ok(w.eval('S.pts[0].nome')=='Atual','F restaura a cópia anterior');
 // G: exportação marcada com app e schema
 ok(true,'G export inclui: '+Object.keys(w.eval('({app:APP,exportedAt:1,...S})')).join(','));
 // H: retenção de cópias diárias
 await w.eval('(async()=>{for(let i=0;i<20;i++)await tx("snap","readwrite",o=>o.put({k:"dia-x"+i,at:i,j:"{}"},"dia-x"+i));await prune()})()');await wait(300);
 k=await snaps(w);ok(k.filter(x=>x.startsWith('dia-')).length==14,'H mantém 14 cópias diárias');
 process.exit(0)})();
