const SAVE_KEY='rpg-fa-save-v5';
const SAVE_KEYS=[SAVE_KEY,'rpg-fa-save-v4','rpg-fa-save-v3','rpg-fa-save-v2'];
let player={...INIT_PLAYER,equipment:{...INIT_PLAYER.equipment}},curDungeonIdx=0,dungeonKills=Array(8).fill(0);
let enemy=null,hpBuyCooldown=0,mpBuyCooldown=0;
let heroHpDelta='',heroMpDelta='',enemyHpDelta='',battleMessage='آمادهٔ ماجراجویی هستی.',currentShop='swords';
let pendingRewardChoice=null,dailyMissionState={date:'',progress:{},claimed:[]};
let ownedItems=Object.fromEntries(Object.entries(SHOP).map(([category,items])=>[category,Array(items.length).fill(false)]));

function syncInventory(source){
 ownedItems=Object.fromEntries(Object.entries(SHOP).map(([category,items])=>{
  const saved=Array.isArray(source?.[category])?source[category]:[];
  return [category,Array.from({length:items.length},(_,index)=>saved[index]===true)];
 }));
 for(const [category,index] of Object.entries(player.equipment||{}))if(Number.isInteger(index)&&index>=0&&ownedItems[category])ownedItems[category][index]=true;
}
function validSaveData(saved){
 if(!saved||typeof saved!=='object'||!saved.player||typeof saved.player!=='object')return false;
 const fields=['lvl','xp','nextXp','hp','maxHp','mp','maxMp','manaRegen','gold','atk','def','agi','heal','kills','bestDungeon','firePower'];
 for(const field of fields){const value=saved.player[field];if(value!==undefined&&!Number.isFinite(value))return false;}
 const p=saved.player;
 if((p.lvl??INIT_PLAYER.lvl)<1||(p.xp??INIT_PLAYER.xp)<0||(p.nextXp??INIT_PLAYER.nextXp)<1||(p.maxHp??INIT_PLAYER.maxHp)<1||(p.maxMp??INIT_PLAYER.maxMp)<1||(p.gold??INIT_PLAYER.gold)<0||(p.agi??INIT_PLAYER.agi)<0)return false;
 if(p.equipment!==undefined&&(!p.equipment||typeof p.equipment!=='object'||Array.isArray(p.equipment)))return false;
 if(saved.dungeonKills!==undefined&&!Array.isArray(saved.dungeonKills))return false;
 if(saved.pendingRewardChoice){
  const choice=saved.pendingRewardChoice;
  if(!Number.isInteger(choice.dungeonIndex)||choice.dungeonIndex<0||choice.dungeonIndex>7||!Number.isInteger(choice.milestone)||choice.milestone<5||choice.milestone>100||!Array.isArray(choice.options)||choice.options.length!==2||new Set(choice.options).size!==2||choice.options.some(id=>!['gold','rest','wisdom'].includes(id)))return false;
 }
 return true;
}
function applySaveData(saved){
 if(!validSaveData(saved))return false;
 player={...INIT_PLAYER,...saved.player,equipment:{...INIT_PLAYER.equipment,...(saved.player.equipment||{})}};
 for(const [category,items] of Object.entries(SHOP)){
  let index=Number(player.equipment[category]??-1);
  if(!Number.isInteger(index)||index< -1||index>=items.length)index=-1;
  player.equipment[category]=index;
 }
 player.hp=Math.max(0,Math.min(player.maxHp,player.hp));player.mp=Math.max(0,Math.min(player.maxMp,player.mp));
 curDungeonIdx=Math.max(0,Math.min(7,Number.isInteger(saved.curDungeonIdx)?saved.curDungeonIdx:0));
 dungeonKills=Array.isArray(saved.dungeonKills)?Array.from({length:8},(_,index)=>Math.min(100,Math.max(0,Number(saved.dungeonKills[index])||0))):Array(8).fill(0);
 syncInventory(saved.ownedItems);
 pendingRewardChoice=saved.pendingRewardChoice?{dungeonIndex:saved.pendingRewardChoice.dungeonIndex,milestone:saved.pendingRewardChoice.milestone,options:saved.pendingRewardChoice.options.filter(id=>['gold','rest','wisdom'].includes(id))}:null;
 dailyMissionState=saved.dailyMissions&&typeof saved.dailyMissions==='object'?saved.dailyMissions:{date:'',progress:{},claimed:[]};
 ensureDailyMissions();
 return true;
}
function loadGame(){
 try{
  let saved=null;
  for(const key of SAVE_KEYS){const raw=localStorage.getItem(key);if(raw){saved=JSON.parse(raw);break;}}
  if(saved&&applySaveData(saved))battleMessage='بازیابی پیشرفت ذخیره‌شده';
  else syncInventory();
 }catch(error){console.warn('ذخیره بازی خوانده نشد.',error);syncInventory();ensureDailyMissions();}
}
function saveGame(){
 try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:5,player,curDungeonIdx,dungeonKills,ownedItems,pendingRewardChoice,dailyMissions:dailyMissionState}));}
 catch(error){console.warn('ذخیره‌سازی در دسترس نیست.',error);}
}
function exportSave(){
 saveGame();
 const payload={version:5,player,curDungeonIdx,dungeonKills,ownedItems,pendingRewardChoice,dailyMissions:dailyMissionState};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='afsaneye-siahchal-save-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('فایل پشتیبان ذخیره شد.');
}
async function importSaveFile(input){
 const file=input.files?.[0];input.value='';if(!file)return;
 if(file.size>2*1024*1024){showToast('حجم فایل پشتیبان بیش از حد مجاز است.');return;}
 try{
  const saved=JSON.parse(await file.text());
  if(!validSaveData(saved)){showToast('ساختار فایل پشتیبان معتبر نیست.');return;}
  if(!confirm('بازی فعلی با اطلاعات فایل پشتیبان جایگزین شود؟'))return;
  applySaveData(saved);enemy=null;hpBuyCooldown=mpBuyCooldown=0;heroHpDelta=heroMpDelta=enemyHpDelta='';
  battleLog('پیشرفت از فایل پشتیبان بازیابی شد.');render();showToast('پشتیبان با موفقیت بازیابی شد.');
 }catch(error){console.warn('پشتیبان بازی خوانده نشد.',error);showToast('خواندن فایل پشتیبان ممکن نشد.');}
}
function icon(name){const src=ICONS[name];return src?'<img class="svg-icon" src="'+src+'" alt="">':'';}
function showToast(message,type=''){const box=document.getElementById('toastBox');const element=document.createElement('div');element.className='toast '+type;element.textContent=message;box.appendChild(element);setTimeout(()=>element.remove(),2600);}
function showRewardToast(gold,xp,levels=0){const box=document.getElementById('toastBox');const element=document.createElement('div');element.className='toast reward-toast';element.innerHTML='<span>پاداش نبرد</span><b>+'+gold+' '+icon('gold')+'</b><b>+'+xp+' تجربه</b>'+(levels?'<b>+'+levels+' سطح</b>':'');box.appendChild(element);setTimeout(()=>element.remove(),3200);}
function battleLog(message){battleMessage=message;const element=document.getElementById('battleFeed');if(element)element.textContent=message;}
function setBattleFeedVisibility(){document.body.classList.toggle('battle-open',document.getElementById('battle')?.classList.contains('active')||false);}
function tab(id){document.querySelectorAll('section').forEach(section=>section.classList.toggle('active',section.id===id));document.querySelectorAll('#bottomBar button').forEach(button=>button.classList.toggle('active',button.id==='btn-'+id));setBattleFeedVisibility();render();}
function updateBar(id,current,max){const bar=document.getElementById(id);if(!bar)return;const percent=Math.max(0,Math.min(100,Math.floor(current/Math.max(1,max)*100)));bar.style.width=percent+'%';bar.style.backgroundColor='hsl('+Math.round(percent*1.2)+', 72%, 48%)';}
function floatNumber(layerId,value,type){if(!value)return;const layer=document.getElementById(layerId);if(!layer)return;const element=document.createElement('span');element.className='float-number '+type;const label=(value>0?'+':'−')+Math.abs(value);if(type==='gold')element.innerHTML=label+' '+icon('gold');else element.textContent=label;layer.appendChild(element);setTimeout(()=>element.remove(),1050);}
function render(){
 const versionLabel=document.getElementById('appVersion');if(versionLabel)versionLabel.textContent='\u0646\u0633\u062e\u0647\u0654 '+APP_VERSION;
 const rank=calcRank(player);
 document.querySelectorAll('[data-icon]').forEach(element=>{element.innerHTML=icon(element.dataset.icon);element.setAttribute('role','img');element.setAttribute('aria-label',({gold:'سکه',heart:'جان',mana:'مانا',atk:'حمله',def:'دفاع',agi:'چابکی',heal:'درمان',manaRegen:'بازیابی مانا',trophy:'پیروزی',monster:'دشمن',search:'جست‌وجو',fire:'آتش',lock:'قفل',xp:'تجربه',armor:'زره',boots:'چکمه',sword:'شمشیر',hero:'قهرمان'})[element.dataset.icon]||'نماد');});
 document.getElementById('topLvl').textContent=player.lvl;document.getElementById('topGold').textContent=player.gold;document.getElementById('topRank').innerHTML=getRankTag(rank);
 const values={pLvl:player.lvl,pXp:player.xp+' / '+player.nextXp,pHp:player.hp,pMaxHp:player.maxHp,pMp:player.mp,pMaxMp:player.maxMp,pAtk:player.atk,pDef:player.def,pAgi:player.agi,pHeal:player.heal,pManaRegen:player.manaRegen,pKills:player.kills};
 for(const [id,value] of Object.entries(values)){const element=document.getElementById(id);if(element)element.textContent=value;}
 document.getElementById('topGold').style.transform='translateY(5px)';document.getElementById('pXpBar').style.width=Math.min(100,player.xp/player.nextXp*100)+'%';document.getElementById('deadBox').hidden=player.hp>0;document.getElementById('curDungeon').textContent=RANKS[curDungeonIdx];document.getElementById('bDungeon').textContent=RANKS[curDungeonIdx];
 const rankProgress=document.getElementById('rankProgressSummary');if(rankProgress)rankProgress.textContent=getRankProgressText(player);
 renderDungeons();renderBattle(rank);renderEquipment();renderMissions();if(SHOP[currentShop])openShop(currentShop);setBattleFeedVisibility();saveGame();
}
loadGame();
