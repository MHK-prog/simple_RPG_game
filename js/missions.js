const DAILY_MISSIONS=[
 {id:'kills',title:'شکارچی روز',description:'۵ دشمن را شکست بده.',target:5,gold:55,xp:25},
 {id:'treasure',title:'جویندهٔ گنج',description:'۲ گنج پنهان پیدا کن.',target:2,gold:60,xp:20},
 {id:'skills',title:'استاد فنون',description:'۳ بار از مهارت‌ها استفاده کن.',target:3,gold:45,xp:35}
];
function localDateKey(){const now=new Date();return now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');}
function ensureDailyMissions(){
 const today=localDateKey();
 if(!dailyMissionState||dailyMissionState.date!==today){dailyMissionState={date:today,progress:{},claimed:[]};return;}
 const progress=dailyMissionState.progress&&typeof dailyMissionState.progress==='object'?dailyMissionState.progress:{};
 dailyMissionState={date:today,progress:Object.fromEntries(DAILY_MISSIONS.map(mission=>[mission.id,Math.max(0,Math.min(mission.target,Number(progress[mission.id])||0))])),claimed:Array.isArray(dailyMissionState.claimed)?dailyMissionState.claimed.filter(id=>DAILY_MISSIONS.some(mission=>mission.id===id)):[]};
}
function recordMissionProgress(id,amount=1){
 ensureDailyMissions();const mission=DAILY_MISSIONS.find(entry=>entry.id===id);if(!mission)return;
 dailyMissionState.progress[id]=Math.min(mission.target,(dailyMissionState.progress[id]||0)+amount);saveGame();
}
function claimDailyMission(id){
 ensureDailyMissions();const mission=DAILY_MISSIONS.find(entry=>entry.id===id);if(!mission)return;
 const progress=dailyMissionState.progress[id]||0;
 if(progress<mission.target||dailyMissionState.claimed.includes(id))return;
 dailyMissionState.claimed.push(id);player.gold+=mission.gold;gainXp(mission.xp);
 showToast('مأموریت کامل شد · '+mission.gold+' سکه و '+mission.xp+' تجربه');render();
}
function renderMissions(){
 const root=document.getElementById('dailyMissions');if(!root)return;ensureDailyMissions();
 root.innerHTML='<div class="section-heading"><div><h2>مأموریت‌های روزانه</h2><p>هر روز با سه هدف کوتاه جایزه بگیر.</p></div><span class="mission-date">'+dailyMissionState.date+'</span></div><div class="mission-list">'+DAILY_MISSIONS.map(mission=>{
  const progress=dailyMissionState.progress[mission.id]||0,claimed=dailyMissionState.claimed.includes(mission.id),complete=progress>=mission.target;
  const label=claimed?'گرفته شد':complete?'گرفتن جایزه':'جایزه · '+mission.gold+' سکه + '+mission.xp+' تجربه';
  return '<article class="mission-card '+(claimed?'claimed':'')+'"><div class="mission-copy"><b>'+mission.title+'</b><span>'+mission.description+'</span><small>'+progress+' از '+mission.target+'</small><div class="mission-track" role="progressbar" aria-valuemin="0" aria-valuemax="'+mission.target+'" aria-valuenow="'+progress+'"><div style="width:'+Math.floor(progress/mission.target*100)+'%"></div></div></div><button type="button" '+(!complete||claimed?'disabled':'')+' onclick="claimDailyMission(\''+mission.id+'\')">'+label+'</button></article>';
 }).join('')+'</div>';
}
