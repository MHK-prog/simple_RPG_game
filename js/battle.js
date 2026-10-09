let encounterType='ready';
function tickCooldowns(){hpBuyCooldown=Math.max(0,hpBuyCooldown-1);mpBuyCooldown=Math.max(0,mpBuyCooldown-1);}
function handleMainAction(){if(player.hp<=0){battleLog('برای ادامه قهرمان را احیا کن.');return;}if(!enemy){findEnemy();return;}attack();}
function showEncounter(type,message){encounterType=type;battleLog(message);render();}
function findEnemy(){
 if(dungeonKills[curDungeonIdx]>=100){encounterType='complete';battleLog('این سیاه‌چال پاک‌سازی شده است.');render();return;}
 heroHpDelta=heroMpDelta=enemyHpDelta='';
 const roll=Math.random();
 if(roll<.17&&player.mp<player.maxMp){manaSpring();return;}
 if(roll<.30){findTreasure();return;}
 if(roll<.40){triggerTrap();return;}
 spawnEnemy();
}
function spawnEnemy(){
 const ranked=ENEMIES.map(entry=>({...entry,rIdx:calcRank(entry)}));
 let candidates=ranked.filter(entry=>Math.abs(entry.rIdx-curDungeonIdx)<=1);
 if(!candidates.length)candidates=ranked.sort((a,b)=>Math.abs(a.rIdx-curDungeonIdx)-Math.abs(b.rIdx-curDungeonIdx)).slice(0,1);
 if(!candidates.length){showEncounter('ready','هیچ دشمنی برای این سیاه‌چال تعریف نشده است.');return;}
 const weights=candidates.map(entry=>1/(1+Math.abs(entry.rIdx-curDungeonIdx)*2));
 let pick=Math.random()*weights.reduce((sum,value)=>sum+value,0),index=0;
 for(;index<weights.length-1&&pick>=weights[index];index++)pick-=weights[index];
 const selected=candidates[index];enemy={...selected,maxHp:selected.hp};encounterType='enemy';battleLog(enemy.name+' وارد میدان شد.');render();
}
function manaSpring(){
 const amount=Math.min(player.maxMp-player.mp,Math.floor(20+Math.random()*25+curDungeonIdx*4));
 if(amount>0){player.mp+=amount;heroMpDelta='+'+amount;floatNumber('heroFloats',amount,'mana');showEncounter('mana','چشمهٔ مانا پیدا کردی · '+amount+' مانا بازیابی شد.');}
 else showEncounter('mana','چشمهٔ مانا پیدا کردی، اما مانایت کامل بود.');
}
function findTreasure(){
 const amount=Math.floor((16+Math.random()*25)*(1+curDungeonIdx*.28));player.gold+=amount;floatNumber('heroFloats',amount,'gold');
 showEncounter('treasure','گنج پنهان پیدا کردی · '+amount+' سکه به دست آوردی.');
}
function triggerTrap(){
 const possible=Math.floor(player.maxHp*.09+curDungeonIdx*3),damage=Math.min(possible,Math.max(0,player.hp-1));
 if(damage>0){player.hp-=damage;heroHpDelta='−'+damage;floatNumber('heroFloats',-damage,'damage');showEncounter('trap','تله فعال شد · '+damage+' جان از دست دادی.');}
 else showEncounter('trap','تله‌ای فعال شد، اما در لحظهٔ آخر جاخالی دادی.');
}
function attack(){
 if(!enemy||player.hp<=0)return;
 tickCooldowns();const base=Math.max(1,player.atk-enemy.def),double=Math.random()*100<Math.min(30,player.agi*1.2),damage=Math.max(1,Math.floor(base*(double?2:1)));
 enemy.hp=Math.max(0,enemy.hp-damage);enemyHpDelta='−'+damage;floatNumber('enemyFloats',-damage,'damage');
 resolveAction(double?'ضربهٔ دوگانهٔ '+damage+' وارد شد.':damage+' آسیب وارد کردی.');
}
function castFireball(){
 if(!enemy||player.hp<=0)return;
 if(player.mp<20){battleLog('برای گوی آتشین ۲۰ مانا لازم است.');return;}
 tickCooldowns();player.mp-=20;heroMpDelta='−۲۰';floatNumber('heroFloats',-20,'mana');
 const damage=Math.floor(player.atk*1.6+25+(player.firePower||0));enemy.hp=Math.max(0,enemy.hp-damage);enemyHpDelta='−'+damage;floatNumber('enemyFloats',-damage,'damage');
 resolveAction('گوی آتشین '+damage+' آسیب زد.');
}
function castHeal(){
 if(!enemy||player.hp<=0)return;
 if(player.mp<15){battleLog('برای ورد شفا ۱۵ مانا لازم است.');return;}
 tickCooldowns();player.mp-=15;heroMpDelta='−۱۵';floatNumber('heroFloats',-15,'mana');
 const healed=Math.min(player.maxHp-player.hp,Math.floor(player.heal*1.5+20));player.hp+=healed;heroHpDelta='+'+healed;floatNumber('heroFloats',healed,'healing');
 enemyTurn('ورد شفا خواندی و '+healed+' جان بازیابی کردی.');
}
function resolveAction(message){
 if(!enemy)return;
 if(enemy.hp<=0){
  const defeated=enemy,gold=Math.floor(defeated.gold*(1+curDungeonIdx*.35)),xp=Math.floor(defeated.maxHp*.25*(1+curDungeonIdx*.25));
  player.gold+=gold;player.kills++;dungeonKills[curDungeonIdx]=Math.min(100,dungeonKills[curDungeonIdx]+1);player.bestDungeon=Math.max(player.bestDungeon,curDungeonIdx);
  const healed=Math.min(player.maxHp-player.hp,player.heal),mana=Math.min(player.maxMp-player.mp,player.manaRegen);player.hp+=healed;player.mp+=mana;
  if(healed)floatNumber('heroFloats',healed,'healing');if(mana)floatNumber('heroFloats',mana,'mana');
  const oldLevel=player.lvl;gainXp(xp);const levels=player.lvl-oldLevel;enemy=null;heroHpDelta=healed?'+'+healed:'';enemyHpDelta='';encounterType='victory';
  battleLog(defeated.name+' شکست خورد · '+dungeonKills[curDungeonIdx]+' از ۱۰۰');showRewardToast(gold,xp,levels);render();return;
 }
 enemyTurn(message);
}
function enemyTurn(message){
 if(!enemy)return;
 const dodged=Math.random()*100<Math.min(25,Math.max(0,player.agi-enemy.agi*.3));
 if(dodged){heroHpDelta='جا خالی';message+=' حملهٔ دشمن خطا رفت.';}
 else{const damage=Math.max(2,enemy.atk-player.def);player.hp=Math.max(0,player.hp-damage);heroHpDelta='−'+damage;floatNumber('heroFloats',-damage,'damage');}
 if(player.hp<=0){enemy=null;message='از پا افتادی؛ برای احیا به صفحهٔ قهرمان برو.';encounterType='defeat';}
 battleLog(message);render();
}
function flee(){if(!enemy)return;enemy=null;heroHpDelta=heroMpDelta=enemyHpDelta='';encounterType='ready';battleLog('از نبرد عقب‌نشینی کردی.');render();}
function buyBattleHp(){if(!enemy||hpBuyCooldown||player.gold<20||player.hp>=player.maxHp)return;player.gold-=20;const amount=Math.min(60,player.maxHp-player.hp);player.hp+=amount;heroHpDelta='+'+amount;floatNumber('heroFloats',amount,'healing');hpBuyCooldown=4;render();}
function buyBattleMp(){if(!enemy||mpBuyCooldown||player.gold<20||player.mp>=player.maxMp)return;player.gold-=20;const amount=Math.min(40,player.maxMp-player.mp);player.mp+=amount;heroMpDelta='+'+amount;floatNumber('heroFloats',amount,'mana');mpBuyCooldown=4;render();}
function setText(id,value){const element=document.getElementById(id);if(element)element.textContent=value;}
function renderBattle(rank){
 const heroRank=document.getElementById('bHeroRank');if(heroRank)heroRank.innerHTML=getRankTag(rank);
 const playerValues={bHp:player.hp,bMaxHp:player.maxHp,bMp:player.mp,bMaxMp:player.maxMp,bAtk:player.atk,bDef:player.def,bAgi:player.agi,bHpChange:heroHpDelta,bMpChange:heroMpDelta};
 for(const [id,value] of Object.entries(playerValues))setText(id,value);
 const feed=document.getElementById('battleFeed');if(feed)feed.className='battle-feed event-'+encounterType;
 updateBar('heroHpFill',player.hp,player.maxHp);updateBar('enemyHpBar',enemy?enemy.hp:0,enemy?enemy.maxHp:1);
 const manaFill=document.getElementById('heroMpFill');if(manaFill)manaFill.style.width=Math.max(0,Math.min(100,player.mp/Math.max(1,player.maxMp)*100))+'%';
 setText('battleCount',dungeonKills[curDungeonIdx]+' / ۱۰۰');
 const active=!!enemy;setText('eName',active?enemy.name:'برای جست‌وجو آماده');
 const enemyRank=document.getElementById('eRank');if(enemyRank)enemyRank.innerHTML=active?getRankTag(enemy.rIdx):'<span class="tag rank-placeholder" aria-label="رتبه مشخص نیست">&nbsp;</span>';
 setText('eHp',active?enemy.hp+' / '+enemy.maxHp:'—');setText('eHpChange',enemyHpDelta);setText('eAtk',active?enemy.atk:'—');setText('eDef',active?enemy.def:'—');setText('eAgi',active?enemy.agi:'—');
 const main=document.getElementById('mainActionBtn');if(main)main.innerHTML=active?'حملهٔ معمولی '+icon('atk'):'جست‌وجوی بیشتر '+icon('search');
 const fleeButton=document.getElementById('fleeBtn');if(fleeButton)fleeButton.hidden=!active;
 const magic=document.getElementById('magicRow');if(magic)magic.hidden=!active;const shop=document.getElementById('battleShopRow');if(shop)shop.hidden=!active;
 const buyHp=document.getElementById('buyHpBattleBtn');if(buyHp){buyHp.disabled=!active||!!hpBuyCooldown||player.gold<20||player.hp>=player.maxHp;buyHp.innerHTML=hpBuyCooldown?'درمان · '+hpBuyCooldown+' نوبت':'درمان ۶۰ جان · ۲۰ '+icon('gold');}
 const buyMp=document.getElementById('buyMpBattleBtn');if(buyMp){buyMp.disabled=!active||!!mpBuyCooldown||player.gold<20||player.mp>=player.maxMp;buyMp.innerHTML=mpBuyCooldown?'مانا · '+mpBuyCooldown+' نوبت':'بازیابی ۴۰ مانا · ۲۰ '+icon('gold');}
 const fireball=document.getElementById('fireballBtn');if(fireball)fireball.disabled=!active||player.mp<20;const heal=document.getElementById('healSkillBtn');if(heal)heal.disabled=!active||player.mp<15||player.hp>=player.maxHp;
}
