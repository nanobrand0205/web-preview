
const menuBtn=document.querySelector('.menu-btn');const mobile=document.querySelector('.mobile-menu');
menuBtn?.addEventListener('click',()=>{const o=mobile.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o?'true':'false')});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));
const bt=document.querySelector('.backtop');addEventListener('scroll',()=>bt?.classList.toggle('show',scrollY>700));bt?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>card.hidden=!(f==='all'||card.dataset.category===f));document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)))}));
