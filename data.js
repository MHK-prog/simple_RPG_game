const ICONS = {
  gold: 'icons/svg/gold.svg',
  heart: 'icons/svg/heart.svg',
  atk: 'icons/svg/atk.svg',
  def: 'icons/svg/def.svg',
  agi: 'icons/svg/agi.svg',
  heal: 'icons/svg/heal.svg',
  mana: 'icons/svg/mana.svg',
  manaRegen: 'icons/svg/manaRegen.svg',
  save: 'icons/svg/save.svg',
  trophy: 'icons/svg/trophy.svg',
  search: 'icons/svg/search.svg',
  fire: 'icons/svg/fire.svg',
  monster: 'icons/svg/monster.svg',
  xp: 'icons/svg/xp.svg',
  armor: 'icons/svg/armor.svg',
  boots: 'icons/svg/boots.svg',
  lock: 'icons/svg/lock.svg',
  hero: 'icons/svg/hero.svg'
};
const RANKS=['E','D','C','B','A','S','SS','SSS'],RANK_COLORS=['#42a5f5','#26a6c8','#7d72c7','#a06cc5','#e0a45e','#ef6478','#e4559a','#ab47bc'],RANK_THRESHOLDS=[0,80,200,420,800,1500,2800,5000];
const INIT_PLAYER={lvl:1,xp:0,nextXp:50,hp:100,maxHp:100,mp:50,maxMp:50,manaRegen:5,gold:50,atk:18,def:6,agi:10,heal:15,kills:0,bestDungeon:0,equipment:{swords:-1,shields:-1,armors:-1,boots:-1,heals:-1,manaRegen:-1}};
const ENEMIES=[{name:'اسلایم کوچک',hp:70,atk:11,def:3,agi:4,gold:9},{name:'خفاش تاریکی',hp:90,atk:14,def:4,agi:8,gold:13},{name:'گابلین چابک',hp:160,atk:24,def:10,agi:12,gold:24},{name:'گرگ وحشی',hp:195,atk:29,def:12,agi:14,gold:32},{name:'اسکلت زره‌پوش',hp:370,atk:48,def:24,agi:12,gold:55},{name:'زامبی جهش‌یافته',hp:440,atk:55,def:28,agi:8,gold:70},{name:'اورک تنومند',hp:720,atk:90,def:46,agi:16,gold:115},{name:'مارپیچون غول‌آسا',hp:830,atk:105,def:52,agi:22,gold:140},{name:'ترول کوهستان',hp:1350,atk:165,def:80,agi:18,gold:210},{name:'مینوتور شاخ‌دار',hp:1550,atk:185,def:95,agi:24,gold:260},{name:'شوالیه سیاه',hp:2400,atk:290,def:145,agi:28,gold:450},{name:'جادوگر دوزخی',hp:2750,atk:330,def:135,agi:34,gold:540},{name:'غول باستانی سنگ',hp:4200,atk:500,def:240,agi:25,gold:880},{name:'شبح لرد نامیرا',hp:4700,atk:560,def:220,agi:40,gold:1050},{name:'اژدهای دوزخ سرخ',hp:7200,atk:820,def:380,agi:42,gold:1750},{name:'تایتان تاریکی مطلق',hp:8500,atk:950,def:440,agi:48,gold:2300}];
const SHOP={swords:[['شمشیر چوبی',8,10],['خنجر برنزی',20,28],['شمشیر آهنی',45,65],['تیغه فولادی',95,140],['شمشیر کریستالی',170,260],['اژدهاشکار',320,520],['لبه سایه',550,950],['اکسکالیبور',900,1800],['شکافنده خلأ',1500,3500],['خدانابودگر',3000,7500]].map(x=>({name:x[0],atk:x[1],cost:x[2]})),shields:[['سپر چوبی',6,1,10],['سپر برنزی',16,1,28],['سپر آهنی',38,2,65],['سپر شوالیه',85,3,140],['برج سنگی',160,4,270],['سپر تایتان',280,5,520],['ایجیس',450,5,1100],['فلس اژدها',750,6,2200],['سپر آینه‌ای',1200,6,4500],['نگهبان الهی',2500,7,9000]].map(x=>({name:x[0],def:x[1],agi_down:x[2],cost:x[3]})),armors:[['ردای نمدی',40,10],['زره چرمی',100,28],['زره برنزی',220,65],['زره زنجیری',480,140],['فلس باستانی',900,280],['زره پالادین',1700,550],['پوسته میتریل',3200,1200],['زره اژدها',6000,2500],['جامه آسمانی',11000,5500],['زره جاودان',25000,12000]].map(x=>({name:x[0],hp:x[1],cost:x[2]})),boots:[['صندل',4,12],['چکمه سبک',9,32],['کفش تندر',18,80],['چکمه سایه',32,170],['بادپیما',55,350],['بال هرمس',90,750],['گام برق‌آسا',150,1600],['گریز از گرانش',260,3500],['چکمه دورپیما',450,7800],['سرعت خدا',1000,15000]].map(x=>({name:x[0],agi:x[1],cost:x[2]})),heals:[['تنفس زندگی',10,20],['بانداژ',25,50],['هاله حیات',55,110],['برکت پری',110,220],['اشک ققنوس',220,420],['جام مقدس',500,1000]].map(x=>({name:x[0],heal:x[1],cost:x[2]})),manaRegen:[['تمرکز ذهن',5,20],['آویز کریستالی',12,50],['چشمه باستانی',25,115],['حلقه اثیری',50,230],['ذهن فرزانه',100,500],['هسته بی‌نهایت',250,1200]].map(x=>({name:x[0],regen:x[1],cost:x[2]}))};
const SHOP_LABELS={swords:'شمشیر',shields:'سپر',armors:'زره',boots:'چکمه',heals:'درمان',manaRegen:'بازیابی مانا'};for(const c in SHOP)SHOP[c].forEach((x,i)=>x.img='img/'+c+'/'+i+'.webp');
