(()=>{
'use strict';
const all=window.ISUZU_A22_CASES||[];const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
const $=s=>document.querySelector(s);const t=(tag,cls,text)=>{let e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const link=(title,url,cls)=>{const a=t('a',cls,title);a.href=url;return a;};
const results=$('#a22-cases'),query=$('#a22-case-query'),filters=$('#a22-case-filters');
if(results){let active='すべて';const kinds=['すべて',...new Set(all.map(c=>c.kind))];
const render=()=>{const q=normalize(query.value);results.replaceChildren();let list=all.filter(c=>(active==='すべて'||c.kind===active)&&(!q||normalize(c.name+' '+c.kind+' '+c.features.join(' ')).includes(q)));$('#a22-case-count').textContent=`${list.length} 件 / 既存公式掲載 ${all.length} 件`;$('#a22-cases-empty').hidden=list.length!==0;
 for(const c of list){const art=t('article','a22-case-card');const top=t('div','a22-case-top');top.append(t('span','a22-case-kind',c.kind),t('span','a22-case-id',c.id.replace('legacy-','#')));art.append(top,t('h3',null,c.name));let desc=c.features.length?c.features.join(' / '):'既存公式に掲載された特型・カスタマイズ装置。';art.append(t('p',null,desc));art.append(link(c.source_detail_verified?'掲載時の仕様を見る ↗':'旧掲載の付加機構を見る ↗','case.html?case='+encodeURIComponent(c.id),'a22-case-action'));results.append(art)}
};
for(const kind of kinds){const btn=t('button','a22-filter',kind);btn.type='button';btn.setAttribute('aria-pressed',kind===active?'true':'false');btn.addEventListener('click',()=>{active=kind;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));render()});filters.append(btn)}query.addEventListener('input',render);let from=new URLSearchParams(location.search).get('q');if(from)query.value=from;render();}
const holder=$('#a22-case-detail');if(holder){let id=new URLSearchParams(location.search||document.documentElement.dataset.a22PreviewQuery||'').get('case');let c=all.find(x=>x.id===id);if(!c){holder.append(t('h1',null,'事例が見つかりません'),link('既存事例一覧へ ↗','cases.html','a20-primary-button'))}else{
 $('#a22-case-breadcrumb').textContent=c.name;
 holder.append(t('span','a22-case-kind',c.kind),t('h1',null,c.name));
 const summary=t('p','a22-detail-lead','既存公式に掲載された当時の特型装置の情報です。仕様の出典と確認深度を区別し、現在の対応可否・再掲載承認を保証しません。');holder.append(summary);
 if(c.features.length){holder.append(t('h2',null,'旧公式に掲載されている仕様・付加機構'));const ul=t('ul','a22-case-features');c.features.forEach(v=>ul.append(t('li',null,v)));holder.append(ul)}
 if(Object.keys(c.specs).length){holder.append(t('h2',null,'当時の掲載スペック'));const dl=t('dl','a22-case-spec');for(const [k,v] of Object.entries(c.specs)){const div=t('div');div.append(t('dt',null,k),t('dd',null,v));dl.append(div)}holder.append(dl)}else{holder.append(t('p','a22-source-note','旧公式の事例一覧には付加機構が掲載されていますが、この事例の個別寸法・温度条件はまだ照合できていません。未確認の数値は掲載しません。'))}
 const verified=t('p','a23-verification-tag',c.source_detail_verified?'旧公式の個別事例記事で仕様・寸法を確認済み':'旧公式の事例一覧で付加機構を確認済み／数値照合は未完了');holder.append(verified);const foot=t('div','a22-detail-foot');foot.append(link('特型・カスタマイズへ戻る →','tokugata.html#cases','a20-tertiary-button'),link('ほかの製作事例を探す →','cases.html','a20-primary-button'));holder.append(foot);
 const caveat=t('p','a22-source-note','旧公式掲載に基づく履歴資料です。新サイトでの再掲載権利・最新仕様・実装上の公開判定は未承認です。');holder.append(caveat);
 }}
})();