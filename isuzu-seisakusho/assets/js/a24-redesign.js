/* A24 interactive UX review: real menu and FAQ filtering; translation preview covers UI/navigation only.
   Full-page EN/KR translations are NOT supplied or claimed by this static prototype. */
(()=>{
  const root=document.querySelector('.a24-lang');
  const trigger=root?.querySelector('.a24-lang-trigger');
  const menu=root?.querySelector('.a24-lang-menu');
  const status=document.querySelector('.a24-language-status');
  const links=document.querySelectorAll('.nav a,.mobile-nav a,.header-contact,.a20-search-trigger');
  const orig=[...links].map(n=>n.textContent);
  const dict={
    en:['Custom equipment','Products','Technology & Quality','Sustainability','Company','Careers','Support','Contact','Search'],
    ko:['맞춤형 장비','제품','기술·품질','환경 활동','회사 소개','채용','지원','문의','검색']
  };
  const jpLabels=['特型・カスタマイズ','製品情報','技術・品質','環境への取り組み','企業情報','採用','サポート','お問い合わせ','サイト内検索'];
  const targets=['tokugata.html','lineup.html','tech.html','sustainability.html','company.html','recruit.html','support.html','contact.html','search.html'];
  function setLocale(locale){
    // Deliberately a scoped UI translation preview, not a misleading half-translated public site.
    const text=locale==='ja'?jpLabels:dict[locale];
    links.forEach((node,i)=>{
      let href=node.getAttribute('href')||'';let index=targets.indexOf(href);
      if(index>=0){
        const suffix=node.classList.contains('header-contact')?' ↗':'';
        node.textContent=text[index]+suffix;
      }
    });
    trigger?.querySelector('strong')?.replaceChildren(document.createTextNode(locale==='en'?'English':locale==='ko'?'한국어':'日本語'));
    menu?.querySelectorAll('button[data-locale]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.locale===locale)));
    if(status){
      if(locale==='ja'){status.hidden=true;status.textContent='';}
      else{
        status.hidden=false;
        status.textContent=locale==='en'?'Translation UI preview — navigation only. Page contents remain in Japanese. Full-page translation requires a licensed production service.':'언어 선택 UI 검토용 — 메뉴만 번역됩니다. 본문은 일본어로 유지됩니다. 전체 번역은 정식 서비스 연동 후 제공됩니다.';
      }
    }
    document.documentElement.lang='ja'; // content remains Japanese; do NOT mislabel document language
    if(menu)menu.hidden=true;
    trigger?.setAttribute('aria-expanded','false');
  }
  trigger?.addEventListener('click',()=>{if(!menu)return;menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden));});
  menu?.addEventListener('click',e=>{const b=e.target.closest('[data-locale]');if(b)setLocale(b.dataset.locale);});
  document.addEventListener('click',e=>{if(root&&!root.contains(e.target)){if(menu)menu.hidden=true;trigger?.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;trigger?.setAttribute('aria-expanded','false');trigger?.focus();}});
  const search=document.getElementById('a24-faq-find');
  const faq=document.querySelectorAll('.a24-faq-accordion details');
  const count=document.getElementById('a24-faq-count');
  function filterFaq(){const q=(search?.value||'').toLowerCase().trim();let n=0;faq.forEach(d=>{const yes=d.textContent.toLowerCase().includes(q);d.hidden=!yes;if(yes)n++;});if(count)count.textContent=`${n}件の質問`;}
  search?.addEventListener('input',filterFaq);if(search)filterFaq();
})();
