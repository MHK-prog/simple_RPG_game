function getPowerScore(unit){return Math.floor((unit.maxHp||unit.hp)*.2+unit.atk*2.2+unit.def*3.2+(unit.agi||0)*2);}
function getRankTag(index){return '<span class="tag" style="background:'+(RANK_COLORS[index]||'#555')+'">رتبه '+(RANKS[index]||'E')+'</span>';}
function calcRank(unit){const score=getPowerScore(unit);for(let index=RANK_THRESHOLDS.length-1;index>=0;index--)if(score>=RANK_THRESHOLDS[index])return index;return 0;}
function getRankProgressText(unit){
 const score=getPowerScore(unit),rank=calcRank(unit),next=RANK_THRESHOLDS[rank+1];
 return rank>=RANKS.length-1?'قدرت رتبه: '+score+' · بالاترین رتبه':('قدرت رتبه: '+score+' · '+Math.max(0,next-score)+' امتیاز تا رتبهٔ '+RANKS[rank+1]);
}
function gainXp(value){
 player.xp+=value;let levels=0;
 while(player.xp>=player.nextXp){player.xp-=player.nextXp;player.lvl++;player.nextXp=Math.floor(player.nextXp*1.5);player.maxHp+=25;player.maxMp+=10;player.hp=player.maxHp;player.mp=player.maxMp;player.atk+=5;player.def+=3;player.agi++;levels++;}
 if(levels)showToast('تبریک! '+levels+' سطح پیشرفت کردی.','lvl');
}
function revive(){
 if(player.hp>0)return;
 const lost=Math.floor(player.gold*.1);player.gold-=lost;player.hp=Math.max(1,Math.ceil(player.maxHp*.5));player.mp=Math.ceil(player.maxMp*.35);enemy=null;heroHpDelta=heroMpDelta=enemyHpDelta='';hpBuyCooldown=mpBuyCooldown=0;
 showToast('به هوش آمدی؛ '+lost+' '+icon('gold')+' از دست رفت.');battleLog('سطح و تجهیزاتت حفظ شدند.');render();
}
function renderEquipment(){
 const list=document.getElementById('equipmentList');if(!list)return;
 list.innerHTML=Object.entries(SHOP_LABELS).map(([category,label])=>{const index=player.equipment[category],item=index>=0?SHOP[category][index]:null;return '<div class="equipment-chip"><span>'+label+'</span><b>'+(item?item.name:'ندارد')+'</b></div>';}).join('');
}
