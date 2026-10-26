const CATS={escuela:'Escuela',trabajo:'Trabajo',gimnasio:'Gimnasio',libre:'Tiempo libre',hobby:'Hobby',descanso:'Descanso'};
const KEY='plandia-v1';
let S=null;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=S||{};
const blank=()=>Array.from({length:48},()=>({t:'',c:''}));
if(!S.plans){S.plans=Array.from({length:7},()=>S.plan?JSON.parse(JSON.stringify(S.plan)):blank());delete S.plan}
S.plans=S.plans.map(p=>p.length===24?p.flatMap(b=>[b,{...b}]):p);
const DN=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const todayDow=()=>(new Date().getDay()+6)%7;
let selDay=todayDow();
const P=()=>S.plans[selDay];
const FOODS=`Manzana|1 mediana|95
Banana|1 mediana|105
Naranja|1 mediana|62
Mandarina|1 unidad|47
Pera|1 mediana|100
Durazno|1 mediano|60
Frutillas|1 taza (150 g)|50
Uvas|1 taza (150 g)|100
Sandía|1 tajada grande|85
Palta|½ unidad|160
Tomate|1 mediano|22
Zanahoria|1 mediana|25
Lechuga|1 plato|8
Papa hervida|1 mediana (150 g)|130
Batata hervida|1 mediana|115
Zapallo cocido|1 taza|50
Puré de papa|1 taza|210
Papas fritas|1 porción (100 g)|310
Pan francés|1 miñón (30 g)|80
Pan lactal|1 rebanada|75
Galletitas de agua|3 unidades|70
Arroz cocido|1 taza (160 g)|205
Fideos cocidos|1 plato (200 g)|280
Fideos con salsa|1 plato|400
Ravioles con salsa|1 plato|450
Polenta cocida|1 plato (200 g)|140
Avena|40 g|150
Cereales de desayuno|30 g|115
Lentejas cocidas|1 taza|230
Garbanzos cocidos|1 taza|270
Milanesa de carne frita|1 unidad (120 g)|330
Milanesa al horno|1 unidad (120 g)|250
Bife de chorizo|200 g|450
Asado (costilla)|150 g|420
Pechuga de pollo a la plancha|150 g|250
Muslo de pollo al horno|1 unidad|230
Merluza al horno|150 g|130
Atún al natural|1 lata (120 g)|120
Huevo|1 unidad|75
Jamón cocido|2 fetas|60
Chorizo (parrilla)|1 unidad|300
Hamburguesa casera con pan|1 unidad|450
Empanada de carne al horno|1 unidad|250
Empanada de carne frita|1 unidad|330
Pizza de muzzarella|1 porción|270
Tarta de verdura|1 porción|250
Sándwich de miga|1 unidad|150
Leche entera|1 vaso (200 ml)|125
Leche descremada|1 vaso (200 ml)|70
Yogur entero|1 pote (190 g)|130
Yogur descremado|1 pote (190 g)|80
Queso cremoso|30 g|90
Queso de máquina|1 feta|70
Queso port salut|30 g|100
Manteca|1 cucharada|100
Aceite|1 cucharada|120
Dulce de leche|1 cucharada (20 g)|60
Mermelada|1 cucharada|50
Medialuna|1 unidad|180
Alfajor simple|1 unidad|200
Alfajor triple|1 unidad|350
Chocolate|3 cuadraditos (25 g)|135
Helado|1 bocha|130
Barra de cereal|1 unidad|90
Maní|30 g|170
Almendras|30 g|175
Nueces|30 g|195
Snack de papas|bolsa chica (50 g)|270
Gaseosa|1 vaso (250 ml)|105
Gaseosa light|1 vaso (250 ml)|0
Jugo de naranja|1 vaso (250 ml)|110
Café con leche y azúcar|1 taza|90
Café solo|1 taza|5
Mate amargo|1 mate cebado|5
Mate con azúcar|1 mate cebado|30
Cerveza|1 lata (350 ml)|150
Vino|1 copa|125
Proteína en polvo|1 scoop|120
Azúcar|1 cucharadita|16`.split('\n').map(l=>{const [n,p,k]=l.split('|');return{n,p,k:+k}});
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
S.hobbies=S.hobbies||['Leer','Guitarra'];
S.days=S.days||{};
S.goals=S.goals||{water:2000,kcal:2000};
S.notes=S.notes||'';S.checks=S.checks||{};S.events=S.events||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=h=>String(h).padStart(2,'0')+':00';
const tm=s=>String(s>>1).padStart(2,'0')+(s&1?':30':':00');
const dk=d=>d.getFullYear()+'-'+pad(d.getMonth()+1).slice(0,2)+'-'+pad(d.getDate()).slice(0,2);
const key=()=>dk(new Date());
const wkKey=()=>{const d=new Date();d.setDate(d.getDate()-todayDow());return dk(d)};
const day=()=>S.days[key()]||(S.days[key()]={water:[],food:[]});
let sel=new Date().getHours()*2+(new Date().getMinutes()>=30?1:0);

// selects
$('e-c').innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
$('e-a').innerHTML=Array.from({length:48},(_,h)=>`<option value="${h}">${tm(h)}</option>`).join('');
$('e-b').innerHTML=Array.from({length:48},(_,h)=>`<option value="${h+1}">${tm(h+1)}</option>`).join('');

$('fecha').textContent=new Date().toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});

const ROW=22;
function runs(p=P()){const r=[];let h=0;while(h<48){const b=p[h];if(!b.t){h++;continue}let e=h+1;while(e<48&&p[e].t===b.t&&p[e].c===b.c)e++;r.push({s:h,e,t:b.t,c:b.c});h=e}return r}
const runAt=h=>runs().find(r=>h>=r.s&&h<r.e);
let undo=null,drag=null,suppress=false;
const snap=()=>{undo={d:selDay,p:JSON.stringify(P())}};
function loadEditor(h){
  sel=h;const b=P()[h],r=runAt(h);
  $('e-t').value=b.t;$('e-c').value=b.c||'escuela';
  $('e-a').value=r?r.s:h;$('e-b').value=r?r.e:h+1;
  renderPlan();
}
function renderPlan(){
  const isToday=selDay===todayDow();
  const now=isToday?new Date().getHours()*2+(new Date().getMinutes()>=30?1:0):-1;
  $('days').innerHTML=DN.map((n,i)=>`<button data-day="${i}" aria-pressed="${i===selDay}" class="${i===todayDow()?'hoy':''}">${n}</button>`).join('');
  const m=new Date();
  const lines=Array.from({length:48},(_,h)=>`<div class="hl${h===now?' now':''}${h%2?' hf':''}" data-h="${h}" style="top:${h*ROW}px"><span>${tm(h)}</span></div>`).join('');
  const cards=runs().map(r=>`<div class="tc c-${r.c||'libre'}${r.s<=sel&&sel<r.e?' sel':''}${r.e-r.s<2?' un':''}" data-s="${r.s}" data-e="${r.e}" style="top:${r.s*ROW+1}px;height:${(r.e-r.s)*ROW-2}px"><b>${esc(r.t)}</b><small>${tm(r.s)} a ${tm(r.e)}</small><span class="gp" aria-hidden="true">⠿</span><span class="rz"></span></div>`).join('');
  const nl=isToday?`<div class="nowl" style="top:${(m.getHours()*2+m.getMinutes()/30)*ROW}px"></div>`:'';
  $('grid').innerHTML=`<div class="tl" style="height:${48*ROW}px">${lines}${cards}${nl}</div>`;
  const cnt={};P().forEach(b=>{if(b.t){cnt[b.c]=(cnt[b.c]||0)+1}});
  const tt=Object.keys(cnt).map(k=>`<span><span class="dot" style="background:var(--${k})"></span>${CATS[k]}: ${cnt[k]/2} h</span>`).join('');
  const empty=P().filter(b=>!b.t).length;
  $('tot').innerHTML=(tt||'')+(empty?`<span>Sin asignar: ${empty/2} h</span>`:'');
}
function renderHobbies(){
  $('hobbies').innerHTML=S.hobbies.length?S.hobbies.map((h,i)=>`<span class="chip" data-hob="${i}">${esc(h)}<i data-del="${i}" title="Quitar" aria-label="Quitar ${esc(h)}">×</i></span>`).join(''):'<span class="mut">Todavía no agregaste hobbies.</span>';
}
function renderWater(){
  const d=day(),tot=d.water.reduce((a,b)=>a+b,0),g=S.goals.water;
  $('w-v').textContent=tot;$('w-g').textContent=g;
  $('w-b').style.width=Math.min(100,tot/g*100)+'%';
  $('w-goal').value=g;
  $('w-n').textContent=tot>=g?'¡Meta cumplida por hoy!':`Te faltan ${g-tot} ml.`;
}
function renderCal(){
  const d=day(),tot=d.food.reduce((a,f)=>a+f.k,0),g=S.goals.kcal;
  $('k-v').textContent=tot;$('k-g').textContent=g;
  $('k-b').style.width=Math.min(100,tot/g*100)+'%';
  $('k-b').style.background=tot>g?'var(--gimnasio)':'var(--acc)';
  $('k-goal').value=g;
  $('k-n').textContent=tot>g?`Te pasaste por ${tot-g} kcal.`:`Te quedan ${g-tot} kcal.`;
  $('foods').innerHTML=d.food.length?d.food.map((f,i)=>`<li><span>${esc(f.n)}</span><span>${f.k} kcal <button data-delf="${i}" aria-label="Quitar ${esc(f.n)}">×</button></span></li>`).join(''):'<li class="mut">Todavía no cargaste comidas hoy.</li>';
}

document.addEventListener('click',e=>{
  if(suppress)return;
  const t=e.target;
  const tab=t.closest('[data-tab]');
  if(tab){
    document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b===tab));
    ['plan','agua','cal','mes','notas'].forEach(id=>$(id).hidden=id!==tab.dataset.tab);
    if(tab.dataset.tab==='mes')renderMes();return;
  }
  const dbtn=t.closest('[data-day]');
  if(dbtn){selDay=+dbtn.dataset.day;loadEditor(sel);return}
  const mdb=t.closest('[data-md]');
  if(mdb){md=mdb.dataset.md;renderMes();return}
  if(t.dataset.cs){cs=t.dataset.cs;renderNotes();return}
  if(t.dataset.ck!==undefined){cl(cdx(t))[+t.dataset.ck].d=t.checked;save();renderNotes();return}
  if(t.dataset.delc!==undefined){cl(cdx(t)).splice(+t.dataset.delc,1);save();renderNotes();return}
  if(t.dataset.dele!==undefined){S.events[md].splice(+t.dataset.dele,1);save();renderMes();return}
  const tc=t.closest('.tc');
  if(tc){loadEditor(+tc.dataset.s);return}
  const hl=t.closest('.hl');
  if(hl){loadEditor(+hl.dataset.h);$('e-t').focus({preventScroll:true});return}
  if(t.dataset.act==='undo'){if(undo){S.plans[undo.d]=JSON.parse(undo.p);selDay=undo.d;undo=null;save();loadEditor(sel)}return}
  const add=t.closest('[data-addres]');
  if(add){
    const f=FOODS[+add.dataset.addres],q=+$('s-n').value||1;
    day().food.push({n:(q===1?'':q+' × ')+f.n,k:Math.round(f.k*q)});
    save();renderCal();return;
  }
  if(t.dataset.act==='copiar'){
    const to=$('cp-to').value;
    const idx=to==='lv'?[0,1,2,3,4]:to==='fs'?[5,6]:[0,1,2,3,4,5,6];
    idx.filter(i=>i!==selDay).forEach(i=>S.plans[i]=JSON.parse(JSON.stringify(P())));
    save();$('cp-n').textContent='Listo, copiaste el '+DN[selDay]+' a los días elegidos.';return;
  }
  if(t.dataset.del!==undefined){S.hobbies.splice(+t.dataset.del,1);save();renderHobbies();return}
  const hob=t.closest('[data-hob]');
  if(hob){$('e-t').value=S.hobbies[+hob.dataset.hob];$('e-c').value='hobby';return}
  if(t.dataset.delf!==undefined){day().food.splice(+t.dataset.delf,1);save();renderCal();return}
  const a=t.dataset.act;
  if(a==='guardar'||a==='borrar'){
    snap();
    let from=+$('e-a').value,to=+$('e-b').value;
    if(to<=from)to=from+1;
    const name=a==='guardar'?$('e-t').value.trim():'';
    if(a==='guardar'&&!name){$('e-t').focus();return}
    for(let h=from;h<to;h++)P()[h]=name?{t:name,c:$('e-c').value}:{t:'',c:''};
    save();renderPlan();
  }
  if(a==='addhobby'){
    const v=$('h-n').value.trim();
    if(v&&!S.hobbies.includes(v)){S.hobbies.push(v);save();renderHobbies()}
    $('h-n').value='';
  }
  if(a==='mprev'||a==='mnext'){mo.setMonth(mo.getMonth()+(a==='mnext'?1:-1));renderMes()}
  if(a==='addev'){const v=$('m-e').value.trim();if(v&&md){(S.events[md]=S.events[md]||[]).push(v);save();renderMes()}$('m-e').value=''}
  if(a==='addcd'){const d=+t.dataset.d,v=document.querySelector(`[data-ci="${d}"]`).value.trim();if(v){cl(d).push({t:v,d:false});save();renderNotes()}document.querySelector(`[data-ci="${d}"]`).focus()}
  if(a==='addcheck'){const v=$('c-i').value.trim();if(v){cl().push({t:v,d:false});save();renderNotes()}$('c-i').value='';$('c-i').focus()}
  if(a==='w'){day().water.push(+t.dataset.v);save();renderWater()}
  if(a==='wundo'){day().water.pop();save();renderWater()}
  if(a==='wcustom'){const v=Math.round(+$('w-c').value);if(v>0){day().water.push(v);save();renderWater()}$('w-c').value=''}
  if(a==='addfood'){
    const n=$('f-n').value.trim(),k=Math.round(+$('f-k').value);
    if(!n||!(k>=0)||$('f-k').value===''){(n?$('f-k'):$('f-n')).focus();return}
    day().food.push({n,k});save();renderCal();$('f-n').value='';$('f-k').value='';$('f-n').focus();
  }
});
$('grid').addEventListener('pointerdown',e=>{
  const card=e.target.closest('.tc');if(!card)return;
  const rz=e.target.closest('.rz');
  if(e.pointerType==='touch'&&!rz&&!e.target.closest('.gp'))return;
  e.preventDefault();
  try{card.setPointerCapture(e.pointerId)}catch(x){}
  drag={card,mode:rz?'rs':'mv',y0:e.clientY,s:+card.dataset.s,e:+card.dataset.e,d:0,moved:false};
});
document.addEventListener('pointermove',e=>{
  if(!drag)return;
  const dy=e.clientY-drag.y0;
  if(Math.abs(dy)>4)drag.moved=true;
  if(!drag.moved)return;
  const d=Math.round(dy/ROW),len=drag.e-drag.s;
  if(drag.mode==='mv'){const ns=Math.max(0,Math.min(48-len,drag.s+d));drag.d=ns-drag.s;drag.card.style.top=(ns*ROW+1)+'px';drag.card.style.zIndex=5}
  else{const ne=Math.max(drag.s+1,Math.min(48,drag.e+d));drag.d=ne-drag.e;drag.card.style.height=((ne-drag.s)*ROW-2)+'px'}
});
document.addEventListener('pointerup',()=>{
  if(!drag)return;const g=drag;drag=null;
  if(!g.moved)return;
  suppress=true;setTimeout(()=>suppress=false,0);
  if(g.d!==0){
    snap();const p=P(),t=p[g.s].t,c=p[g.s].c,len=g.e-g.s;
    if(g.mode==='mv'){
      for(let h=g.s;h<g.e;h++)p[h]={t:'',c:''};
      for(let h=g.s+g.d;h<g.s+g.d+len;h++)p[h]={t,c};
      sel=g.s+g.d;
    }else{
      const ne=g.e+g.d;
      for(let h=g.e;h<ne;h++)p[h]={t,c};
      for(let h=ne;h<g.e;h++)p[h]={t:'',c:''};
    }
    save();
  }
  loadEditor(sel);
});
document.addEventListener('pointercancel',()=>{if(drag){drag=null;renderPlan()}});
function renderRes(){
  const q=norm($('s-q').value.trim());
  if(!q){$('res').innerHTML='<li class="mut">Escribí el nombre de un alimento para ver sus calorías.</li>';return}
  const hits=FOODS.map((f,i)=>({f,i})).filter(o=>norm(o.f.n).includes(q)).slice(0,8);
  $('res').innerHTML=hits.length?hits.map(o=>`<li><span>${esc(o.f.n)}<small>${esc(o.f.p)} · ${o.f.k} kcal</small></span><button class="btn alt" data-addres="${o.i}">Agregar</button></li>`).join(''):'<li class="mut">No encontré ese alimento. Probá con otro nombre o cargalo a mano más abajo.</li>';
}
$('s-q').addEventListener('input',renderRes);
renderRes();
$('w-goal').addEventListener('change',e=>{const v=+e.target.value;if(v>=500){S.goals.water=v;save()}renderWater()});
$('k-goal').addEventListener('change',e=>{const v=+e.target.value;if(v>=500){S.goals.kcal=v;save()}renderCal()});
['f-n','f-k'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('[data-act=addfood]').click()}));
$('h-n').addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('[data-act=addhobby]').click()});
$('m-e').addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('[data-act=addev]').click()});
$('c-i').addEventListener('keydown',e=>{if(e.key==='Enter')document.querySelector('[data-act=addcheck]').click()});
$('n-t').addEventListener('input',e=>{S.notes=e.target.value;save()});
$('c-wk').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.ci!==undefined)document.querySelector(`[data-act=addcd][data-d="${e.target.dataset.ci}"]`).click()});

let mo=new Date(),md=null,cs='d';mo.setDate(1);
const ckey=i=>i===undefined?'d'+key():'w'+wkKey()+'-'+i;
const cdx=t=>t.dataset.cd===undefined?undefined:+t.dataset.cd;
const DF=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const cl=i=>S.checks[ckey(i)]||(S.checks[ckey(i)]=[]);
{const o='w'+wkKey();if(S.checks[o]){S.checks[ckey(todayDow())]=S.checks[o];delete S.checks[o];save()}}
function renderMes(){
  const y=mo.getFullYear(),m=mo.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),hoy=key();
  const t=mo.toLocaleDateString('es-AR',{month:'long',year:'numeric'});
  $('m-t').textContent=t[0].toUpperCase()+t.slice(1);
  let h=DN.map(d=>`<b>${d}</b>`).join('')+'<span></span>'.repeat(first);
  for(let d=1;d<=n;d++){
    const dt=new Date(y,m,d),k=dk(dt);
    const ne=(S.events[k]||[]).length;
    h+=`<button data-md="${k}" class="${k===hoy?'hoy ':''}${k===md?'sel':''}"><span>${d}</span><span class="dots">${'<i></i>'.repeat(Math.min(ne,3))}</span></button>`;
  }
  $('m-g').innerHTML=h;
  $('m-dc').hidden=!md;
  const pre=`${y}-${pad(m+1).slice(0,2)}-`,evs=Object.keys(S.events).filter(k=>k.startsWith(pre)).sort().flatMap(k=>S.events[k].map(x=>({k,x})));
  $('m-ev').innerHTML=evs.length?`<h2 style="margin-top:14px">Eventos del mes</h2><ul class="list">`+evs.map(o=>`<li><span>📌 ${esc(o.x)}</span><span class="mut">${new Date(o.k+'T12:00:00').toLocaleDateString('es-AR',{weekday:'short',day:'numeric'})}</span></li>`).join('')+'</ul>':'';
  if(!md)return;
  const dt=new Date(md+'T12:00:00'),ev=S.events[md]||[];
  $('m-d').innerHTML=`<h2>${dt.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})}</h2><ul class="list">`+(ev.map((x,i)=>`<li><span>📌 ${esc(x)}</span><button data-dele="${i}" aria-label="Quitar evento">×</button></li>`).join('')||'<li class="mut">No hay eventos este día.</li>')+'</ul>';
}
function renderNotes(){
  $('c-d').setAttribute('aria-pressed',cs==='d');$('c-w').setAttribute('aria-pressed',cs==='w');
  const wk=cs==='w',l=wk?DF.flatMap((_,i)=>S.checks[ckey(i)]||[]):cl(),n=l.filter(x=>x.d).length;
  $('c-i').closest('.form').hidden=$('c-l').hidden=wk;$('c-wk').hidden=!wk;
  $('c-n').textContent=l.length?`${n} de ${l.length} hechas`:'';
  const it=(x,i,d)=>{const a=d===undefined?'':` data-cd="${d}"`;return `<li><label><input type="checkbox" data-ck="${i}"${a}${x.d?' checked':''}><span${x.d?' class="mut" style="text-decoration:line-through"':''}>${esc(x.t)}</span></label><button data-delc="${i}"${a} aria-label="Quitar tarea">×</button></li>`};
  if(!wk)$('c-l').innerHTML=l.length?l.map((x,i)=>it(x,i)).join(''):'<li class="mut">Todavía no agregaste tareas.</li>';
  else $('c-wk').innerHTML=DF.map((nm,d)=>`<div class="dayblk${d===todayDow()?' hoy':''}"><h3>${nm}</h3><ul class="list">${(S.checks[ckey(d)]||[]).map((x,i)=>it(x,i,d)).join('')||'<li class="mut">Sin tareas.</li>'}</ul><div class="form"><input data-ci="${d}" placeholder="Nueva tarea" aria-label="Nueva tarea del ${nm}"><button class="btn alt" data-act="addcd" data-d="${d}">Agregar</button></div></div>`).join('');
}
$('n-t').value=S.notes;
loadEditor(sel);renderHobbies();renderWater();renderCal();renderNotes();renderMes();
