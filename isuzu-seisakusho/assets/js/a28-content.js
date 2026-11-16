// A28 static design review: product-format comparison (no suitability judgment)
(function(){'use strict';
const list=document.querySelector('.a28-spec-showcase');if(!list)return;
const cards=[...list.querySelectorAll('.a28-model-card')];const out=list.querySelector('.a28-compare-result');const count=list.querySelector('.a28-compare-count');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function update(ev){let picked=cards.filter(x=>x.querySelector('input').checked);if(picked.length>3){ev.target.checked=false;ev.target.focus();count.textContent='最大3つまで選択できます';return;}count.textContent=picked.length+' / 3 選択中';
if(!picked.length){out.innerHTML='<p>比較したい製品を最大3つ選択してください</p>';return;}
const rows=picked.map(x=>({name:x.querySelector('h3').textContent,vals:[...x.querySelectorAll('dl dd')].map(v=>v.textContent)}));
let html='<div class="a28-table-wrap"><table class="a28-table"><thead><tr><th scope="col">比較項目</th>'+rows.map(r=>'<th scope="col">'+esc(r.name)+'</th>').join('')+'</tr></thead><tbody>';
['内容積','温度範囲','湿度範囲','最大消費電力'].forEach((label,i)=>{html+='<tr><th scope="row">'+label+'</th>'+rows.map(r=>'<td>'+esc(r.vals[i]||'—')+'</td>').join('')+'</tr>';});html+='</tbody></table></div>';out.innerHTML=html;}
list.querySelectorAll('.a28-pick').forEach(x=>x.addEventListener('change',update));
})();