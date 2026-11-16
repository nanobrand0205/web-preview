/* A25 Same-page discovery / static review only. No API, analytics, or data transmission. */
(()=>{
'use strict';
const data=window.ISUZU_REVIEW_DATA||{models:[],manuals:[]};
const cases=window.ISUZU_A22_CASES||[];
const dialog=document.getElementById('a25-discovery');if(!dialog)return;
const input=dialog.querySelector('#a25-query'),results=dialog.querySelector('#a25-results'),status=dialog.querySelector('#a25-status');
const group=dialog.querySelector('#a25-filter-group');const allBtns=[...dialog.querySelectorAll('[data-a25-tab]')];
const norm=(str)=>String(str||'').normalize('NFKC').toLowerCase().replace(/[ー－―‐–—-]/g,'').replace(/[\s　]+/g,'').trim();
const safe=(x)=>String(x??'');
const pages=[
{title:'特型・カスタマイズ装置',href:'tokugata.html',tags:'特注 試験条件 設計'},
{title:'標準製品ラインアップ',href:'lineup.html',tags:'温度 湿度 型式 製品'},
{title:'製品選定ガイド',href:'selection-guide.html',tags:'比較 営業 試験目的'},
{title:'製造技術・品質管理',href:'tech.html',tags:'設計 製造 工程 品質'},
{title:'省エネルギーへの取り組み',href:'sustainability.html',tags:'環境 脱炭素 省エネ サステナビリティ SBT'},
{title:'会社概要・拠点・沿革',href:'company.html',tags:'企業 1938 ISO 工場'},
{title:'採用情報',href:'recruit.html',tags:'募集 求人 新卒'},
{title:'修理・取扱説明書',href:'support.html',tags:'サポート 取説 旧製品 修理'},
{title:'お問い合わせ・FAQ',href:'contact.html#faq',tags:'相談 見積 不具合 FAQ'},
{title:'お知らせ',href:'news.html',tags:'最新情報 ニュース'},
];
let scope='all', limit=15, origin=null;
const types={model:'標準製品・型式',manual:'取扱説明書',case:'特型事例',page:'サイト内ページ'};
const sourceData=()=>{
 const rows=[];
 data.models.forEach(m=>rows.push({type:'model',title:m.id,subtitle:m.group+' / '+m.series,category:m.group,url:'model.html?model='+encodeURIComponent(m.id),keywords:m.group+' '+m.series+' '+m.id+' '+String(m.page)}));
 data.manuals.forEach(m=>rows.push({type:'manual',title:m.title,subtitle:m.group,category:m.group,url:m.url,keywords:m.group+' '+m.title+' '+m.url.split('/').pop(),external:true}));
 cases.forEach(c=>rows.push({type:'case',title:c.name,subtitle:c.kind+' / '+c.features.slice(0,2).join('・'),category:c.kind,url:'case.html?case='+encodeURIComponent(c.id),keywords:c.name+' '+c.kind+' '+c.features.join(' ')}));
 pages.forEach(p=>rows.push({type:'page',title:p.title,subtitle:'サイト内ページ',category:'案内',url:p.href,keywords:p.tags}));
 return rows;
};
const corpus=sourceData();
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
function updateFacets(){const value=group.value;const options=[...new Set(corpus.filter(x=>scope==='all'||x.type===scope).map(x=>x.category))].sort((a,b)=>a.localeCompare(b,'ja'));
 group.replaceChildren(new Option('すべてのカテゴリー',''));options.forEach(v=>group.append(new Option(v,v)));if(options.includes(value))group.value=value;}
function makeItem(x){const a=make('a','a25-result');a.href=x.url;if(x.external){a.target='_blank';a.rel='noopener noreferrer';}
 const box=make('div','a25-result-icon',x.type==='model'?'M':x.type==='manual'?'PDF':x.type==='case'?'C':'↗');
 const content=make('div','a25-result-body');content.append(make('span','a25-result-tag',types[x.type]),make('strong',null,x.title),make('small',null,x.subtitle||''));
 a.append(box,content,make('span','a25-result-arrow','↗'));return a;}
function render(){const q=norm(input.value),fac=group.value;
 let items=corpus.filter(x=>(scope==='all'||x.type===scope)&&(!fac||x.category===fac));
 if(q){items=items.map(x=>({...x,score:norm(x.title)===q?100:norm(x.title).startsWith(q)?70:norm(x.title).includes(q)?40:norm(x.keywords).includes(q)?20:0})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,'ja'));}
 else { // guide choices; default previews based on scope (do not present hundreds without direction)
 const preferred={model:['恒温恒湿試験機','産業用恒温試験機','恒温試験機'],manual:[],case:[],page:[]};
 if(scope==='all') items=[...corpus.filter(x=>x.type==='page').slice(0,7),...corpus.filter(x=>x.type==='model').slice(0,4)];
 }
 results.replaceChildren();
 // Non-binding guidance by test intent. No fabricated machine suitability or numeric spec.
 const suggestions=[
  {words:['高温','乾燥','耐熱','熱処理'],title:'高温・乾燥の試験について',info:'関連する製品群を確認し、温度範囲などは正式仕様で判断',url:'series-industrial.html'},
  {words:['湿度','結露','低温','温湿度'],title:'温度・湿度を組み合わせた試験',info:'恒温恒湿試験機のシリーズから探す',url:'series-climate.html'},
  {words:['サイズ','特殊','大型','搬送','コンベア','窒素','真空'],title:'標準品にない装置条件のご相談',info:'特型・カスタマイズの既存事例と相談の入口',url:'tokugata.html'},
  {words:['故障','修理','不具合'],title:'使用中の装置・修理のご案内',info:'取扱説明書と修理の案内',url:'support.html'}
 ];
 if(q && (scope==='all'||scope==='page'||scope==='model')){
   const hint=suggestions.find(s=>s.words.some(w=>norm(w).includes(q)||q.includes(norm(w))));
   if(hint){const a=make('a','a25-intent-suggestion');a.href=hint.url;a.append(make('span','a25-result-tag','関連するご案内（機種の適合判断ではありません）'),make('strong',null,hint.title),make('small',null,hint.info+' ↗'));results.append(a);}
 }
 for(const x of items.slice(0,limit))results.append(makeItem(x));
 status.textContent=q?`${items.length}件が該当`:scope==='all'?'まず検索する対象かキーワードを選んでください':`${items.length}件の候補`;
 if(!items.length){const empty=make('div','a25-no-results');empty.append(make('strong',null,'条件に合う情報が見つかりません'),make('p',null,'別の型式・機種名で探すか、条件未確定の特型相談をご利用ください'));const clear=make('button','a25-empty-reset','条件を解除する');clear.type='button';clear.addEventListener('click',()=>{input.value='';group.value='';render();input.focus();});empty.append(clear);results.append(empty);}
 if(items.length>limit){const more=make('button','a25-more',`さらに表示（残り${items.length-limit}件）`);more.type='button';more.addEventListener('click',()=>{limit+=20;render();});results.append(more)}
}
function select(tab){scope=['all','model','manual','case','page'].includes(tab)?tab:'all';limit=15;allBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.a25Tab===scope)));updateFacets();render();}
function open(tab,query='',initialGroup=''){origin=document.activeElement;input.value=query;select(tab);if(initialGroup && [...group.options].some(x=>x.value===initialGroup)){group.value=initialGroup;render();}if(!dialog.open){dialog.showModal();document.body.classList.add('a25-modal-active');}setTimeout(()=>input.focus(),0)}
function close(){if(dialog.open)dialog.close();document.body.classList.remove('a25-modal-active');if(origin&&origin.isConnected)origin.focus()}
dialog.querySelector('#a25-close').addEventListener('click',close);dialog.querySelector('#a25-reset').addEventListener('click',()=>{input.value='';render();input.focus()});dialog.querySelector('#a25-clear-filters').addEventListener('click',()=>{group.value='';input.value='';render();input.focus()});
input.addEventListener('input',()=>{limit=15;render()});group.addEventListener('change',()=>{limit=15;render()});allBtns.forEach(b=>b.addEventListener('click',()=>select(b.dataset.a25Tab)));
dialog.querySelectorAll('[data-a25-chip]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.a25Chip;select('all');input.focus()}));
dialog.addEventListener('close',()=>{document.body.classList.remove('a25-modal-active');if(origin&&origin.isConnected)origin.focus()});
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
document.addEventListener('click',e=>{const opener=e.target.closest('[data-a25-open]');if(!opener)return;e.preventDefault();open(opener.dataset.a25Open,opener.dataset.a25Query||'',opener.dataset.a25Group||'');});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(dialog.open)input.focus();else open('all');}});
// Revive previous simple TOP/legacy search forms where any remain: show results in place, not new page.
document.querySelectorAll('form[action="search.html"]').forEach(f=>{f.addEventListener('submit',e=>{e.preventDefault();const field=f.querySelector('input[type="search"],input[name="q"]');open('all',field?.value||'');});});
// Local page search takes precedence over site-level navigation and preserves requested context.
const path=location.pathname.split('/').pop();if(path==='search.html'){const old=new URLSearchParams(location.search).get('q');if(old){const button=document.querySelector('.a25-floating-search');if(button)button.dataset.a25Query=old;}}
})();