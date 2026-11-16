/* A30 internal design preview — model / case details in-place; direct URLs remain accessible. */
(()=>{
'use strict';
const dialog=document.getElementById('a30-detail-modal');if(!dialog)return;
const container=dialog.querySelector('#a30-detail-content');
const data=window.ISUZU_REVIEW_DATA||{models:[]};
const cases=window.ISUZU_A22_CASES||[];
let origin=null, lastType=null, lastId=null;
const E=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n};
function link(text,url,cls){const a=E('a',cls,text);a.href=url;return a}
function strip(text){return String(text||'').trim()}
function sectionHeading(text){return E('h3','a30-detail-section-title',text)}
function kv(rows){const d=E('dl','a30-fact-grid');rows.forEach(([k,v])=>{if(!v)return;const x=E('div');x.append(E('dt',null,k),E('dd',null,v));d.append(x)});return d;}
function fillModel(id){const m=data.models.find(x=>x.id===id);if(!m)return false;
 const wrap=E('div','a30-modal-inner');const header=E('div','a30-detail-head');
 header.append(E('p','a30-eyebrow','標準製品・型式情報'),E('h2','a30-detail-title',m.id),E('p','a30-detail-lead',m.group+'｜'+m.series));
 wrap.append(header,sectionHeading('型式・カタログ情報'),kv([['製品群',m.group],['シリーズ・製品形態',m.series],['2026年版カタログ',m.page+'頁']]));
 wrap.append(E('p','a30-detail-helper','型式ごとの温度・湿度・容量などの適合条件は正式仕様を確認したうえでご検討ください。'));
 const buttons=E('div','a30-modal-actions');const pdf=link('カタログPDFを確認',m.catalog,'a30-action-primary');pdf.target='_blank';pdf.rel='noopener noreferrer';buttons.append(pdf);
 buttons.append(link('この型式の詳細URL',`model.html?model=${encodeURIComponent(m.id)}`,'a30-action-plain'));
 buttons.append(link('標準製品の一覧を見る','lineup.html','a30-action-plain'));
 wrap.append(buttons);container.append(wrap);return true;
}
function fillCase(id){const c=cases.find(x=>x.id===id);if(!c)return false;
 const wrap=E('div','a30-modal-inner');const header=E('div','a30-detail-head');
 header.append(E('p','a30-eyebrow',c.kind+'｜特型製作事例'),E('h2','a30-detail-title',c.name));wrap.append(header);
 if(c.features&&c.features.length){wrap.append(sectionHeading('対応した仕様・機構'));const ul=E('ul','a30-feature-list');c.features.forEach(x=>ul.append(E('li',null,x)));wrap.append(ul);}
 if(c.specs&&Object.keys(c.specs).length){wrap.append(sectionHeading('旧公式掲載の装置仕様'),kv(Object.entries(c.specs)));}
 if(!c.features?.length&&!Object.keys(c.specs||{}).length)wrap.append(E('p','a30-detail-helper','詳細情報は旧公式掲載資料と照合中です。'));
 const foot=E('div','a30-modal-actions');foot.append(link('事例の詳細URL',`case.html?case=${encodeURIComponent(c.id)}`,'a30-action-primary'));
 foot.append(link('特型・カスタマイズを見る','tokugata.html#cases','a30-action-plain'));
 wrap.append(foot);container.append(wrap);return true;
}
function open(type,id,trigger){if(!id)return false;container.replaceChildren();let ok=type==='model'?fillModel(id):type==='case'?fillCase(id):false;
 if(!ok)return false;origin=trigger||document.activeElement;lastType=type;lastId=id;
 dialog.querySelector('.a30-detail-type').textContent=type==='model'?'製品型式の詳細':'特型事例の詳細';
 const ttl=container.querySelector('h2');if(ttl)ttl.id='a30-detail-title';
 let descr=container.querySelector('.a30-detail-lead, .a30-detail-helper');if(!descr){descr=container.querySelector('.a30-eyebrow')};if(descr)descr.id='a30-detail-desc';
 if(!dialog.open)dialog.showModal();dialog.querySelector('.a30-modal-close').focus();return true;
}
function close(){if(dialog.open)dialog.close();}
const cleanPath=(href)=>{try{const u=new URL(href,document.baseURI);return u.origin===new URL(document.baseURI).origin?{path:u.pathname.split('/').pop(),params:u.searchParams}:null}catch(e){return null}};
// Preserve direct URLs, middle-click, right-click and modifier-key navigation for sharing and accessibility.
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href]');if(!a||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target==='_blank'||e.defaultPrevented)return;
 const parsed=cleanPath(a.href);if(!parsed)return;
 const kind=parsed.path==='model.html'?'model':parsed.path==='case.html'?'case':null;
 if(!kind || a.closest('#a30-detail-modal') || a.hasAttribute('data-a30-direct'))return;
 const id=parsed.params.get(kind);if(!id)return;
 if(open(kind,id,a))e.preventDefault();
},true);
dialog.querySelector('.a30-modal-close').addEventListener('click',close);
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
dialog.addEventListener('close',()=>{container.replaceChildren();if(origin&&origin.isConnected){try{origin.focus({preventScroll:true})}catch(e){origin.focus()}}});
window.ISUZU_A30_PREVIEW={open};
})();
