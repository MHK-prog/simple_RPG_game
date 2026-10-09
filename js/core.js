const SAVE_KEY='rpg-fa-save-v4';
let player={...INIT_PLAYER,equipment:{...INIT_PLAYER.equipment}},curDungeonIdx=0,dungeonKills=Array(8).fill(0);
let enemy=null,hpBuyCooldown=0,mpBuyCooldown=0;
let heroHpDelta='',heroMpDelta='',enemyHpDelta='',battleMessage='آمادهٔ ماجراجویی هستی.',currentShop='swords';
let ownedItems=Object.fromEntries(Object.entries(SHOP).map(([category,items])=>[category,Array(items.length).fill(false)]));
function syncInventory(source){
 ownedItems=Object.fromEntries(Object.entries(SHOP).map(([category,items])=>{
  const saved=Array.isArray(source?.[category])?source[category]:[];
  return [category,Array.from({length:items.length},(_,index)=>saved[index]===true)];
 }));
 for(const [category,index] of Object.entries(player.equipment||{}))if(Number.isInteger(index)&&index>=0&&ownedItems[category])ownedItems[category][index]=true;
}
function loadGame(){
 try{
  const saved=JSON.parse(localStorage.getItem(SAVE_KEY)||localStorage.getItem('rpg-fa-save-v3')||localStorage.getItem('rpg-fa-save-v2'));
  if(saved?.player){
   player={...INIT_PLAYER,...saved.player,equipment:{...INIT_PLAYER.equipment,...(saved.player.equipment||{})}};
   curDungeonIdx=Math.max(0,Math.min(7,Number(saved.curDungeonIdx)||0));
   dungeonKills=Array.isArray(saved.dungeonKills)?Array.from({length:8},(_,index)=>Math.min(100,Math.max(0,Number(saved.dungeonKills[index])||0))):Array(8).fill(0);
   syncInventory(saved.ownedItems);
   battleMessage='بازیابی پیشرفت ذخیره‌شده';
  }else syncInventory();
 }catch(error){console.warn('ذخیره بازی خوانده نشد.',error);syncInventory();}
}
function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:4,player,curDungeonIdx,dungeonKills,ownedItems}));}catch(error){console.warn('ذخیره‌سازی در دسترس نیست.',error);}}
function icon(name){const src=ICONS[name];return src?'<img class="svg-icon" src="'+src+'" alt="">':'';}
function showToast(message,type=''){const box=document.getElementById('toastBox');const element=document.createElement('div');element.className='toast '+type;element.textContent=message;box.appendChild(element);setTimeout(()=>element.remove(),2600);}
function showRewardToast(gold,xp,levels=0){const box=document.getElementById('toastBox');const element=document.createElement('div');element.className='toast reward-toast';element.innerHTML='<span>پاداش نبرد</span><b>+'+gold+' '+icon('gold')+'</b><b>+'+xp+' تجربه</b>'+(levels?'<b>+'+levels+' سطح</b>':'');box.appendChild(element);setTimeout(()=>element.remove(),3200);}
function battleLog(message){battleMessage=message;const element=document.getElementById('battleFeed');if(element)element.textContent=message;}
function setBattleFeedVisibility(){document.body.classList.toggle('battle-open',document.getElementById('battle')?.classList.contains('active')||false);}
function tab(id){document.querySelectorAll('section').forEach(section=>section.classList.toggle('active',section.id===id));document.querySelectorAll('#bottomBar button').forEach(button=>button.classList.toggle('active',button.id==='btn-'+id));setBattleFeedVisibility();render();}
function updateBar(id,current,max){const bar=document.getElementById(id);if(!bar)return;const percent=Math.max(0,Math.min(100,Math.floor(current/Math.max(1,max)*100)));bar.style.width=percent+'%';bar.style.backgroundColor='hsl('+Math.round(percent*1.2)+', 72%, 48%)';}
function floatNumber(layerId,value,type){if(!value)return;const layer=document.getElementById(layerId);if(!layer)return;const element=document.createElement('span');element.className='float-number '+type;const label=(value>0?'+':'−')+Math.abs(value);if(type==='gold')element.innerHTML=label+' '+icon('gold');else element.textContent=label;layer.appendChild(element);setTimeout(()=>element.remove(),1050);}
function render(){
 const rank=calcRank(player);
 document.querySelectorAll('[data-icon]').forEach(element=>{element.innerHTML=icon(element.dataset.icon);element.setAttribute('role','img');element.setAttribute('aria-label',({gold:'سکه',heart:'جان',mana:'مانا',atk:'حمله',def:'دفاع',agi:'چابکی',heal:'درمان',manaRegen:'بازیابی مانا',trophy:'پیروزی',monster:'دشمن',search:'جست‌وجو',fire:'آتش',lock:'قفل',xp:'تجربه',armor:'زره',boots:'چکمه',sword:'شمشیر',hero:'قهرمان'})[element.dataset.icon]||'نماد');});
 document.getElementById('topLvl').textContent=player.lvl;document.getElementById('topGold').textContent=player.gold;document.getElementById('topRank').innerHTML=getRankTag(rank);
 const values={pLvl:player.lvl,pXp:player.xp+' / '+player.nextXp,pHp:player.hp,pMaxHp:player.maxHp,pMp:player.mp,pMaxMp:player.maxMp,pAtk:player.atk,pDef:player.def,pAgi:player.agi,pHeal:player.heal,pManaRegen:player.manaRegen,pKills:player.kills};
 for(const [id,value] of Object.entries(values)){const element=document.getElementById(id);if(element)element.textContent=value;}
 document.getElementById('topGold').style.transform='translateY(5px)';document.getElementById('pXpBar').style.width=Math.min(100,player.xp/player.nextXp*100)+'%';document.getElementById('deadBox').hidden=player.hp>0;document.getElementById('curDungeon').textContent=RANKS[curDungeonIdx];document.getElementById('bDungeon').textContent=RANKS[curDungeonIdx];
 renderDungeons();renderBattle(rank);renderEquipment();if(SHOP[currentShop])openShop(currentShop);setBattleFeedVisibility();saveGame();
}
loadGame();
