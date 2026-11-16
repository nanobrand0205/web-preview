/* A26: Staging only; no server/API calls. */
(()=>{
'use strict';
const stage=document.querySelector('.a26-hero-stage');
if(stage){
 const slides=[...stage.querySelectorAll('[data-slide]')],dots=[...document.querySelectorAll('[data-slide-to]')],toggle=document.querySelector('[data-slide-toggle]');
 let idx=0,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches,timer=null;
 function apply(){slides.forEach((s,i)=>{const active=i===idx;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));});dots.forEach((b,i)=>{b.classList.toggle('is-active',i===idx);b.setAttribute('aria-pressed',String(i===idx));});if(toggle){toggle.textContent=paused?'再生 ▶':'一時停止 II';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'写真の自動切替を再開':'写真の自動切替を停止');}}
 function start(){if(timer)clearInterval(timer);timer=null;if(!paused)timer=setInterval(()=>{idx=(idx+1)%slides.length;apply();},6500)}
 document.querySelector('[data-slide-prev]')?.addEventListener('click',()=>{idx=(idx+slides.length-1)%slides.length;apply();start()});
 document.querySelector('[data-slide-next]')?.addEventListener('click',()=>{idx=(idx+1)%slides.length;apply();start()});
 dots.forEach(b=>b.addEventListener('click',()=>{idx=Number(b.dataset.slideTo);apply();start()}));
 toggle?.addEventListener('click',()=>{paused=!paused;apply();start()});
 document.querySelector('.a24-hero')?.addEventListener('focusin',()=>{if(timer){clearInterval(timer);timer=null}});
 document.querySelector('.a24-hero')?.addEventListener('focusout',()=>{if(!paused)start()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer);timer=null}else start()});
 apply();start();
}
// FAQ category filtering is layered onto preexisting A24 keyword filtering.
const categoryButtons=[...document.querySelectorAll('[data-faq-filter]')];
const details=[...document.querySelectorAll('.a24-faq-accordion details')];
const faqInput=document.getElementById('a24-faq-find');
const faqCount=document.getElementById('a24-faq-count');
let category='all';
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/\s/g,'');
function filterFaq(){let count=0;const q=norm(faqInput?.value);details.forEach(d=>{const yes=(category==='all'||d.dataset.faqCategory===category)&&(!q||norm(d.textContent).includes(q));d.hidden=!yes;if(yes)count++;});if(faqCount)faqCount.textContent=`${count}件の質問`;}
if(categoryButtons.length){categoryButtons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.faqFilter;categoryButtons.forEach(b=>{b.classList.toggle('is-active',b.dataset.faqFilter===category);b.setAttribute('aria-pressed',String(b.dataset.faqFilter===category));});filterFaq()}));faqInput?.addEventListener('input',filterFaq);setTimeout(filterFaq,0)}
// Language architecture: use client-authored terminology at visible headings, not a fake full-site translation.
const localize={
'環境試験装置の製造・特型設計':['Environmental Test Chambers & Custom Engineering','환경시험기 제조 및 맞춤 설계'],
'標準製品を探す':['Find Standard Products','표준 제품 찾기'],
'特型・カスタマイズ装置':['Custom Test Equipment','맞춤형 시험 장비'],
'標準製品ラインアップ':['Standard Product Lineup','표준 제품 라인업'],
'製品カテゴリー':['Product Categories','제품 카테고리'],
'製品仕様・カタログ':['Specifications & Catalogs','제품 사양 및 카탈로그'],
'取扱説明書・修理サポート':['Manuals & Repair Support','사용 설명서 및 수리 지원'],
'取扱説明書を探す':['Find Manuals','사용 설명서 찾기'],
'お問い合わせ':['Contact Us','문의하기'],
'お問い合わせ前のよくある質問':['Frequently Asked Questions','자주 묻는 질문'],
'試験・製品・サポートを探す':['Find Equipment, Tests & Support','시험·제품·지원 찾기'],
'特型装置の製作事例':['Custom Equipment Examples','맞춤형 장비 사례'],
'いすゞ製作所の採用情報':['Careers at Isuzu Seisakusho','이스즈제작소 채용'],
'会社概要・拠点・沿革':['Company, Locations & History','회사·거점·연혁'],
'企業情報':['Company','회사 소개'],
'設計・製造・品質管理':['Engineering, Production & Quality','설계·제조·품질 관리'],
'省エネルギーへの取り組み':['Energy-Efficient Equipment','에너지 절감 활동'],
'環境への取り組み':['Sustainability','환경 활동'],
'製品選定ガイド':['Equipment Selection Guide','장비 선정 가이드'],
'採用情報':['Careers','채용 정보'],
'お知らせ':['News','공지사항'],
'このページで探す':['Search on This Page','이 페이지에서 검색'],
'製品名・型式から探す':['Search by Product or Model','제품명·모델로 검색'],
'修理・旧製品のご案内':['Repair & Legacy Products','수리·구형 제품 안내'],
'恒温恒湿試験機':['Temperature & Humidity Chambers','항온항습 시험기'],
'産業用恒温試験機':['Industrial Ovens','산업용 항온 시험기'],
'恒温試験機':['Constant-Temperature Chambers','항온 시험기'],
};
const nodes=[...document.querySelectorAll('main h1, main h2, main h3')].filter(n=>n.childElementCount===0&&localize[n.textContent.trim()]);
const originals=new Map(nodes.map(n=>[n,n.textContent]));
const langRoot=document.querySelector('.a24-lang');const langMenu=langRoot?.querySelector('.a24-lang-menu');
const status=document.querySelector('.a24-language-status');
const translations={en:0,ko:1};
function langUpdate(code){const i=translations[code];nodes.forEach(n=>{const original=originals.get(n);n.textContent=(i===undefined?original:localize[original]?.[i])||original;});
 if(status&&code!=='ja'){status.hidden=false;status.textContent=code==='en'?'Design preview: navigation and key headings are translated. Full technical content is pending professional review.':'디자인 검토용: 주요 제목과 메뉴만 번역되었습니다. 기술 본문은 감수 후 제공됩니다.';}
 if(code==='ja'&&status){status.hidden=true;status.textContent='';}
 try{sessionStorage.setItem('isuzu-review-language',code)}catch{};
}
langMenu?.addEventListener('click',e=>{const b=e.target.closest('[data-locale]');if(b)queueMicrotask(()=>langUpdate(b.dataset.locale));});
let saved='ja';try{saved=sessionStorage.getItem('isuzu-review-language')||'ja'}catch{};
if(['ja','en','ko'].includes(saved)&&saved!=='ja'){const b=langMenu?.querySelector(`[data-locale="${saved}"]`);b?.click();}
})();
