/* A29 design review - category-aware non-submitting inquiry assistance. */
(()=>{const form=document.querySelector('#design-form[data-a29-inquiry-form]');if(!form)return;
const map={
 '製品・見積':{title:'カタログ商品・見積について',body:'ご希望の製品名・型式や、使用目的・試験条件を分かる範囲でご記入ください。購入方法は販売協力会社をご案内する方式です',tags:['製品名・型式','試験内容・希望条件','数量・設置場所']},
 '特注製品':{title:'特注製品・カスタマイズのご相談',body:'図面や仕様がまだ決まっていなくても構いません。どのような試験を実現したいか、現状の困りごとを整理してお知らせください',tags:['試験対象・目的','温度・湿度','内寸・設置・搬入条件','既存装置で難しいこと']},
 '修理':{title:'修理のご依頼',body:'お使いの製品情報と不具合を確認します。画像の送付方法は受付後の自動返信メールでご案内する予定です',tags:['製品名・型式','製造番号','症状・エラー表示','発生時期']},
 '仕入先':{title:'仕入れ先さまのお問い合わせ',body:'お取り扱いの商品・技術、ご提案内容、ご連絡先についてお知らせください',tags:['会社名','取り扱い品目','ご提案内容']},
 'その他':{title:'その他のお問い合わせ',body:'装置の移設・点検・校正、企業情報など、ご相談内容を分かる範囲でお知らせください',tags:['ご相談の種類','製品名・型式（該当する場合）','ご希望の対応']}
};
const title=document.getElementById('a29-inquiry-guidance-title'),copy=document.getElementById('a29-inquiry-guidance-copy'),tags=document.getElementById('a29-inquiry-tags');
function draw(){const active=form.querySelector('input[name="category"]:checked');const x=map[active?.value]||map['その他'];title.textContent=x.title;copy.textContent=x.body;tags.replaceChildren(...x.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s}))}
const requested=new URLSearchParams(window.location.search).get('category');if(requested&&map[requested]){const input=[...form.querySelectorAll('input[name="category"]')].find(x=>x.value===requested);if(input)input.checked=true}
form.querySelectorAll('input[name="category"]').forEach(x=>x.addEventListener('change',draw));
form.addEventListener('submit',e=>{e.preventDefault()});draw();
})();