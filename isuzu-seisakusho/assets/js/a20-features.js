/* A20 internal-only UI demo. No form submission or network. */
(()=>{
'use strict';
const d=window.ISUZU_REVIEW_DATA||{models:[],manuals:[]};
const $=s=>document.querySelector(s);
const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ja').replace(/\s+/g,' ').trim();
const el=(tag,cls,content)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e;};
const qs=()=>new URLSearchParams(location.search);
const addlink=(container,title,url,cls)=>{const a=el('a',cls,title);a.href=url;container.append(a);return a;};
const mapUnique=(arr,key)=>[...new Set(arr.map(v=>v[key]))].sort((a,b)=>String(a).localeCompare(String(b),'ja'));
const currentModel=id=>d.models.find(m=>m.id===id);
function fillSelect(select,vals){if(!select)return;for(const v of vals){const opt=el('option',null,v);opt.value=v;select.append(opt);}}
const setHidden=(x,v)=>{if(x)x.hidden=v;};

// Product search: data-bound to the 2026 catalogue, not a fitness/compatibility calculation.
const modelQuery=$('#a20-model-query'),modelGroup=$('#a20-model-group'),modelResults=$('#a20-model-results'),modelEmpty=$('#a20-model-empty');
let compare=new Set(),modelLimit=16,modelMatches=[];
function syncCompare(){const dock=$('#a20-compare-dock');if(dock){dock.hidden=compare.size===0;$('#a20-compare-info').textContent=compare.size?`${compare.size}件の型式を選択中（最大3件）`:'比較したい型式を選択してください';}}
function modelCard(m){const item=el('article','a20-model-item'),left=el('div','a20-model-main');
 const tag=el('small','a20-eyebrow',m.group);left.append(tag);const title=el('h3','a20-model-name');addlink(title,m.id,`model.html?model=${encodeURIComponent(m.id)}`);left.append(title);
 const note=el('p','a20-model-desc',`${m.series}  ｜ カタログ印刷 ${m.page}頁`);left.append(note);
 const right=el('div','a20-model-actions');const label=el('label','a20-check-model');const cb=document.createElement('input');cb.type='checkbox';cb.value=m.id;cb.checked=compare.has(m.id);cb.setAttribute('aria-label',m.id+' を比較対象にする');cb.addEventListener('change',()=>{if(cb.checked){if(compare.size>=3){cb.checked=false;alert('比較は3型式まで選択できます');return;}compare.add(m.id)}else compare.delete(m.id);syncCompare();});label.append(cb,document.createTextNode('比較する'));right.append(label);addlink(right,'詳細を見る ↗',`model.html?model=${encodeURIComponent(m.id)}`,'a20-inline-link');item.append(left,right);return item;
}
function renderModels(){if(!modelResults)return;const q=normalize(modelQuery.value),group=modelGroup.value;modelMatches=d.models.filter(m=>(!group||m.group===group)&&(!q||normalize(m.id+' '+m.series+' '+m.group).includes(q)));
 modelResults.replaceChildren();const visible=modelMatches.slice(0,modelLimit);visible.forEach(m=>modelResults.append(modelCard(m)));
 if(modelMatches.length>modelLimit){const more=el('button','a20-more',`さらに表示（残り${modelMatches.length-modelLimit}件）`);more.type='button';more.addEventListener('click',()=>{modelLimit+=20;renderModels()});modelResults.append(more)}
 $('#a20-model-count').textContent=`${modelMatches.length}件の型式候補を表示`;setHidden(modelEmpty,modelMatches.length!==0);
}
if(modelResults){fillSelect(modelGroup,mapUnique(d.models,'group'));const q=qs();if(q.has('q'))modelQuery.value=q.get('q')||'';if(q.has('group')&&[...modelGroup.options].some(o=>o.value===q.get('group')))modelGroup.value=q.get('group');
 for(const x of [modelQuery,modelGroup])x.addEventListener(x===modelQuery?'input':'change',()=>{modelLimit=16;renderModels();});$('#a20-model-clear').addEventListener('click',()=>{modelQuery.value='';modelGroup.value='';modelLimit=16;renderModels();modelQuery.focus();});$('#a20-print-models').addEventListener('click',()=>window.print());
 $('#a20-compare-open').addEventListener('click',()=>{const c=$('#a20-compare-panel'),table=$('#a20-compare-table');table.replaceChildren();const ms=[...compare].map(currentModel).filter(Boolean);if(!ms.length)return;const t=el('table','a20-diff-table');const tr=el('tr');tr.append(el('th',null,'比較項目'));ms.forEach(m=>tr.append(el('th',null,m.id)));t.append(tr);for(const [title,key] of [['製品群','group'],['シリーズ・製品形態','series'],['カタログ印刷ページ','page'],['現行販売','status']]){const row=el('tr');row.append(el('th',null,title));for(const m of ms)row.append(el('td',null,key==='page'?String(m.page)+'頁':m[key]));t.append(row)}const row=el('tr');row.append(el('th',null,'型式別情報'));for(const m of ms){const cell=el('td');addlink(cell,'型式詳細を見る ↗',`model.html?model=${encodeURIComponent(m.id)}`);row.append(cell)}t.append(row);table.append(t);c.hidden=false;c.focus();});$('#a20-compare-close').addEventListener('click',()=>{$('#a20-compare-panel').hidden=true});renderModels();syncCompare();}

// Manuals are indexed by historic public title + category, no rehosting and no claim of revision validity.
const manualQuery=$('#a20-manual-query'),manualGroup=$('#a20-manual-group'),manualResults=$('#a20-manual-results');let manualLimit=12;
function renderManuals(){if(!manualResults)return;const q=normalize(manualQuery.value),group=manualGroup.value;const list=d.manuals.filter(m=>(!group||m.group===group)&&(!q||normalize(m.title+' '+m.group+' '+m.url.split('/').pop()).includes(q)));manualResults.replaceChildren();
 for(const m of list.slice(0,manualLimit)){const item=el('article','a20-manual-card');const c=el('div');c.append(el('span','a20-eyebrow',m.group),el('h3',null,m.title));item.append(c);const a=addlink(item,'取扱説明書PDFを開く ↗',m.url,'a20-inline-link');a.target='_blank';a.rel='noopener noreferrer';a.title='旧公式のPDFを別タブで開きます';manualResults.append(item)}
 if(list.length>manualLimit){const more=el('button','a20-more',`さらに表示（残り${list.length-manualLimit}件）`);more.type='button';more.addEventListener('click',()=>{manualLimit+=20;renderManuals()});manualResults.append(more)}
 $('#a20-manual-count').textContent=`旧公式掲載 ${list.length}件（確認用）`;setHidden($('#a20-manual-empty'),list.length!==0);
}
if(manualResults){fillSelect(manualGroup,mapUnique(d.manuals,'group'));const q=qs();if(q.has('q'))manualQuery.value=q.get('q')||'';
 for(const x of [manualQuery,manualGroup])x.addEventListener(x===manualQuery?'input':'change',()=>{manualLimit=12;renderManuals();});$('#a20-manual-clear').addEventListener('click',()=>{manualQuery.value='';manualGroup.value='';manualLimit=12;renderManuals();manualQuery.focus();});renderManuals();}

// Site-wide search across public-facing page templates and REVIEW data, with relevance by field labels.
const pages=[['トップページ','index.html','いすゞ製作所 試験条件から 装置づくり','サイト案内'],['特型・カスタマイズ','tokugata.html#requirements','カスタマイズ 仕様 未確定 試験 条件 図面 特注','特型相談'],['製品情報','lineup.html#model-finder','製品 検索 型式 カタログ 比較','製品'],['技術・品質','tech.html','技術 品質 製造工程 設計 検査','技術'],['サポート・修理','support.html#manual-search','取説 取扱説明書 修理 旧製品 後継 機種','サポート'],['環境への取り組み','sustainability.html','環境 サステナビリティ 脱炭素','企業'],['企業情報','company.html','会社概要 沿革 ISO 拠点','企業'],['採用情報','recruit.html','採用 求人 就職 仕事','採用'],['お問い合わせ','contact.html','相談 連絡 見積 問い合わせ','窓口'],['お知らせ','news.html','ニュース 最新情報 お知らせ','お知らせ'],['既存特型事例を探す','cases.html','カスタマイズ 特型 製作事例 台車 窒素 低温','特型'],['恒温恒湿試験機','series-climate.html','Futaba TPCY Big Box 温度 湿度','製品'],['産業用恒温試験機','series-industrial.html','VTRL VTRH VTFH VTFP VTHH 温度','製品'],['恒温試験機','series-constant.html','Aoba Wakaba Sakura 小型 恒温','製品']];
const globalForm=$('#a20-global-form'),globalResults=$('#a20-global-results');let searchType='all';
function globalSearch(){if(!globalResults)return;const q=normalize($('#a20-global-query').value);globalResults.replaceChildren();let records=[];
 if(q){if(searchType==='all'||searchType==='page')pages.forEach(p=>{if(normalize(p.join(' ')).includes(q))records.push({kind:'page',title:p[0],url:p[1],subtitle:p[3]})});
 if(searchType==='all'||searchType==='model')d.models.filter(m=>normalize(m.id+' '+m.group+' '+m.series).includes(q)).forEach(m=>records.push({kind:'model',title:m.id,url:'model.html?model='+encodeURIComponent(m.id),subtitle:m.group+' / '+m.series}));
 if(searchType==='all'||searchType==='page')(window.ISUZU_A22_CASES||[]).filter(c=>normalize(c.name+' '+c.kind+' '+c.features.join(' ')).includes(q)).forEach(c=>records.push({kind:'case',title:c.name,url:'case.html?case='+encodeURIComponent(c.id),subtitle:'旧公式掲載の特型事例 / '+c.kind}));
 if(searchType==='all'||searchType==='manual')d.manuals.filter(m=>normalize(m.title+' '+m.group+' '+m.url.split('/').pop()).includes(q)).forEach(m=>records.push({kind:'manual',title:m.title,url:m.url,subtitle:'取扱説明書 / '+m.group}));}
 $('#a20-global-count').textContent=q?`${records.length}件の検索候補`:'キーワードを入力して検索してください';setHidden($('#a20-global-empty'),!q||records.length>0);
 records.slice(0,40).forEach(r=>{const card=el('article','a20-global-item');card.append(el('span','a20-eyebrow',r.kind==='page'?'WEB PAGE':r.kind==='model'?'MODEL / CATALOG':r.kind==='case'?'CUSTOM / LEGACY':'MANUAL / LEGACY'));const h=el('h3');const a=addlink(h,r.title,r.url);if(r.kind==='manual'){a.target='_blank';a.rel='noopener noreferrer'}card.append(h,el('p',null,r.subtitle));globalResults.append(card)});
 if(records.length>40){globalResults.append(el('p','a20-help','検索結果が多数あります。キーワードやタブで絞り込んでください。'));}
 const url=new URL(location.href);if(q)url.searchParams.set('q',$('#a20-global-query').value.trim());else url.searchParams.delete('q');try{history.replaceState(null,'',url.pathname+url.search)}catch(e){};}
if(globalForm){$('#a20-global-query').value=qs().get('q')||'';globalForm.addEventListener('submit',e=>{e.preventDefault();globalSearch();});document.querySelectorAll('.a20-search-tabs button').forEach(b=>b.addEventListener('click',()=>{searchType=b.dataset.type;document.querySelectorAll('.a20-search-tabs button').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b));});globalSearch()}));globalSearch();}

// Product detail (no fabricated specs); linkable via query string to support sales handoff.
const detail=$('#a20-model-detail');if(detail){const m=currentModel(qs().get('model'));if(!m){detail.append(el('h2',null,'型式が見つかりません'));addlink(detail,'製品検索へ戻る ↗','lineup.html#model-finder');}else{
 const header=el('div','a20-detail-head');const info=el('div');info.append(el('span','a20-eyebrow',m.group),el('h2','a20-detail-id',m.id),el('p','a20-detail-series',m.series),el('p','a20-detail-meta','2026総合カタログ印刷 '+m.page+'頁 / 現行性・掲載承認未確認'));const pane=el('aside','a20-detail-side');pane.append(el('span','a20-eyebrow','DESIGN INTENT'),el('h3',null,'営業と顧客が、同じ情報を確認できる。'),el('p',null,'実際の製品ページでは、特長、仕様、寸法、必要な付属品、標準と特型の境界、取扱資料をここにまとめます。'));header.append(info,pane);detail.append(header);
 const box=el('div','a20-detail-spec');const rows=[['型式',m.id],['製品群',m.group],['シリーズ・製品形態',m.series],['原本カタログ',`2026総合カタログ / 印刷 ${m.page}頁`],['温度・湿度・容量・電源','正式仕様資料の確認待ち'],['現行販売・後継機種','いすゞ製作所確認待ち'],['実機写真・寸法図','型式との一致・権利確認待ち']];rows.forEach(([k,v])=>{let row=el('div');row.append(el('dt',null,k),el('dd',null,v));box.append(row)});detail.append(box);
 const actions=el('div','a20-detail-actions');let a=addlink(actions,'カタログ原本PDFを確認 ↗',m.catalog,'a20-primary-button');a.target='_blank';a.rel='noopener noreferrer';addlink(actions,'特型・仕様相談へ ↗','tokugata.html#requirements','a20-tertiary-button');const copy=el('button','a20-tertiary-button','この型式URLをコピー');copy.type='button';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);copy.textContent='URLをコピーしました';}catch(e){copy.textContent='URLのコピーに失敗しました';}});actions.append(copy);detail.append(actions);
 // Manual search belongs to each model detail. Only direct-link if matching can be grounded in indexed title.
 const manuals=d.manuals.filter(x=>{const k=(m.series||'').split(/[（(・・ \/]/)[0].toLowerCase();return k.length>=3 && x.title.toLowerCase().includes(k)});
 const docs=el('section','a33-model-manuals');docs.append(el('h3',null,'この製品の取扱説明書・関連資料'));
 if(manuals.length){ manuals.slice(0,8).forEach(x=>{const a=addlink(docs,x.title+'（旧公式PDF） ↗',x.url,'a20-inline-link');a.target='_blank';a.rel='noopener noreferrer';}); docs.append(el('p','a20-help','タイトルにシリーズ名が一致した資料候補です。適用型式・版は必ず確認してください。'));}
 else docs.append(el('p','a20-help','この型式へのPDFの適用は未確認です。説明書一覧から型式・資料名で検索してください。'));
 addlink(docs,'取扱説明書の一覧から探す ↗','support.html#manuals','a20-inline-link');detail.append(docs);
 $('#a20-model-breadcrumb').textContent=m.id;}
}

// Consultation preparation: does not transmit; sessionStorage only for same-browser preview navigation.
const wizard=$('#a20-requirement-form');let step=1;function showStep(n){step=n;document.querySelectorAll('.a20-wizard-step').forEach(x=>{x.hidden=Number(x.dataset.step)!==n});$('#a20-step-indicator').textContent=`STEP ${n} / 3`;$('#a20-wizard-back').hidden=n===1;$('#a20-wizard-next').textContent=n===3?'条件整理メモを確認 ↗':'次へ進む ↗';}
if(wizard){$('#a20-wizard-next').addEventListener('click',()=>{if(step<3){showStep(step+1);return;}const purpose=(wizard.querySelector('input[name=purpose]:checked')||{}).value||'未定';const value=id=>$(id)?.value.trim()||'未定';const str=['【試験の目的】 '+purpose,'【試験対象】 '+value('#a20-test-object'),'【温度条件】 '+value('#a20-temp'),'【湿度条件】 '+value('#a20-humidity'),'【寸法・設置条件】 '+value('#a20-size'),'【現在の課題】 '+value('#a20-challenge')].join('\n');$('#a20-requirement-summary').textContent=str;wizard.hidden=true;$('#a20-wizard-summary').hidden=false;$('#a20-wizard-summary').focus();try{sessionStorage.setItem('isuzu_a20_requirements',str);}catch(e){};});
 $('#a20-wizard-back').addEventListener('click',()=>{if(step>1)showStep(step-1)});
 
 showStep(1);}
const passed=$('#a20-passed-summary');if(passed){let mem='';try{mem=sessionStorage.getItem('isuzu_a20_requirements')||''}catch(e){}if(mem){passed.hidden=false;$('#a20-passed-text').textContent=mem;const ta=document.querySelector('#design-form textarea');if(ta&&!ta.value.includes(mem)){ta.value=(ta.value?ta.value+'\n\n':'')+mem;}const category=document.querySelector('#design-form input[name="category"][value="特注製品"]');if(category){category.checked=true;category.dispatchEvent(new Event('change',{bubbles:true}));}$('#a20-clear-passed').addEventListener('click',()=>{passed.hidden=true;if(ta)ta.value=ta.value.replace(mem,'').trim();try{sessionStorage.removeItem('isuzu_a20_requirements')}catch(e){}});}}

// FAQ controls the existing three provisional examples only; client-approved full FAQ is not yet loaded.
const faqInput=$('#a20-faq-query');if(faqInput){const entries=[...document.querySelectorAll('.faq-list details')];const update=()=>{const q=normalize(faqInput.value);let n=0;entries.forEach(x=>{let show=normalize(x.textContent).includes(q);x.hidden=!show;n+=Number(show)});$('#a20-faq-count').textContent=`デザイン用FAQ ${n}件（正式原本は確認待ち）`;};faqInput.addEventListener('input',update);update();}
})();
