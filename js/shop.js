function applyItem(item,direction){
 for(const key of ['atk','def','agi','heal','manaRegen','firePower'])if(item[key])player[key]=(player[key]||0)+direction*item[key];
 if(item.regen)player.manaRegen=(player.manaRegen||0)+direction*item.regen;
 if(item.agi_down)player.agi-=direction*item.agi_down;
 if(item.hp){player.maxHp+=direction*item.hp;player.hp=Math.min(player.maxHp,player.hp+direction*item.hp);}
 if(item.maxMp){player.maxMp+=direction*item.maxMp;player.mp=Math.min(player.maxMp,player.mp+direction*item.maxMp);}
 player.agi=Math.max(1,player.agi);
}
function itemBonuses(item={}){
 return {atk:item.atk||0,def:item.def||0,agi:(item.agi||0)-(item.agi_down||0),maxHp:item.hp||0,maxMp:item.maxMp||0,heal:item.heal||0,manaRegen:(item.regen||0)+(item.manaRegen||0),firePower:item.firePower||0};
}
function previewEquipment(category,index){
 const before=itemBonuses(SHOP[category][player.equipment[category]]),after=itemBonuses(SHOP[category][index]),preview={...player};
 for(const key of Object.keys(before))preview[key]=(preview[key]||0)-before[key]+after[key];
 preview.agi=Math.max(1,preview.agi);return {preview,deltas:Object.fromEntries(Object.keys(before).map(key=>[key,after[key]-before[key]]))};
}
function itemImpactHtml(category,index){
 const {preview,deltas}=previewEquipment(category,index),labels={atk:'حمله',def:'دفاع',agi:'چابکی',maxHp:'حداکثر جان',maxMp:'حداکثر مانا',heal:'قدرت درمان',manaRegen:'بازیابی مانا',firePower:'قدرت آتش'};
 const changes=Object.entries(deltas).filter(([,value])=>value!==0).map(([key,value])=>(value>0?'+':'−')+Math.abs(value)+' '+labels[key]);
 const oldRank=calcRank(player),newRank=calcRank(preview),scoreChange=getPowerScore(preview)-getPowerScore(player);
 const rankText=oldRank===newRank?(scoreChange===0?'رتبه تغییری نمی‌کند':'رتبه '+RANKS[newRank]+' · '+(scoreChange>0?'+':'−')+Math.abs(scoreChange)+' امتیاز قدرت'):'رتبه از '+RANKS[oldRank]+' به '+RANKS[newRank];
 return '<small class="item-impact"><span>'+(changes.length?changes.join(' · '):'بدون تغییر در ویژگی‌ها')+'</span><b>'+(player.equipment[category]===index?'این وسیله همین حالا مجهز است':rankText)+'</b></small>';
}
function buy(category,index){
 const item=SHOP[category]?.[index];
 if(!item)return;
 if(player.hp<=0)return showToast('اول قهرمان را احیا کن.');
 const owned=ownedItems[category]?.[index]===true;
 if(!owned&&player.gold<item.cost)return showToast('موجودی کافی نیست '+icon('gold'));
 if(player.equipment[category]===index)return showToast('این وسیله همین حالا مجهز است.');
 const old=player.equipment[category],hpRatio=player.hp/player.maxHp,mpRatio=player.mp/player.maxMp;
 if(old>=0)applyItem(SHOP[category][old],-1);
 if(!owned){player.gold-=item.cost;ownedItems[category][index]=true;}
 applyItem(item,1);
 player.hp=Math.max(1,Math.min(player.maxHp,Math.round(player.maxHp*hpRatio)));
 player.mp=Math.max(0,Math.min(player.maxMp,Math.round(player.maxMp*mpRatio)));
 player.equipment[category]=index;
 showToast(owned?item.name+' دوباره مجهز شد.':item.name+' خریداری و مجهز شد.');
 render();
}
function openShop(category){
 if(!SHOP[category])return;
 currentShop=category;
 document.getElementById('shopTitle').textContent='بازار · '+SHOP_LABELS[category];
 document.querySelectorAll('.shop-tabs button').forEach(button=>button.classList.toggle('selected',button.dataset.cat===category));
 document.getElementById('shopItems').innerHTML=SHOP[category].map((item,index)=>{
  const stats=[];
  for(const key of ['atk','def','agi','hp','heal','regen','maxMp','firePower'])if(item[key]){const ico={atk:'atk',def:'def',agi:'agi',hp:'heart',heal:'heal',regen:'manaRegen',maxMp:'mana',firePower:'fire'}[key];stats.push(icon(ico)+' +'+item[key]);}
  if(item.agi_down)stats.push(icon('agi')+' −'+item.agi_down);
  const equipped=player.equipment[category]===index,owned=ownedItems[category]?.[index]===true;
  const disabled=equipped||(!owned&&player.gold<item.cost);
  const label=equipped?'مجهز':owned?'تجهیز':'خرید · '+item.cost+' '+icon('gold');
  return '<article class="shop-item"><img src="'+item.img+'" alt=""><div class="item-info"><b>'+item.name+'</b><span>'+stats.join(' · ')+'</span>'+itemImpactHtml(category,index)+'</div><button '+(disabled?'disabled':'')+' onclick="buy(\''+category+'\','+index+')">'+label+'</button></article>';
 }).join('');
}
