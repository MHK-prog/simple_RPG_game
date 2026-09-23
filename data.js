// data.js - مقادیر، آیکون‌های SVG، تجهیزات و تصاویر

const ICONS = {
  gold: `<svg class="svg-icon" viewBox="0 0 24 24" fill="#fbc02d" stroke="#c49000" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5" fill="#fdd835"/></svg>`,
  heart: `<svg class="svg-icon" viewBox="0 0 24 24" fill="#e53935"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  atk: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#e53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>`,
  def: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  agi: `<svg class="svg-icon" viewBox="0 0 512 512" fill="#00bcd4"><path d="M169.53 16.344 259.345 88 337 92.28l-1.03 18.657-161.376-8.906-118.78-4.905 227.28 68.03-197.72 246.75-14.53-17.655-49.22 96.625 248.69-202.78 51.81 11.592-38.78 40.594L270.5 329.5l-57.28 84.125L444.843 273.47 328 241.06l100.22-81.718c1.132.46 2.3.898 3.5 1.22 23.324 6.248 49.764-16.835 59.06-51.533 9.298-34.695-2.08-67.874-25.405-74.124-23.325-6.25-49.765 16.802-59.063 51.5a95.43 95.43 0 0 0-2.875 16.22L169.53 16.343z"/></svg>`,
  heal: `<svg class="svg-icon" viewBox="0 0 24 24"><path fill="#2e7d32" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/><path fill="#fff" d="M11 7h2v3h3v2h-3v3h-2v-3H8v-2h3V7z"/></svg>`,
  mana: `<svg class="svg-icon" viewBox="0 0 24 24" fill="#0288d1"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  manaRegen: `<svg class="svg-icon" viewBox="0 0 24 24"><path fill="#0288d1" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path fill="#ffffff" d="M11 11H8v2h3v3h2v-3h3v-2h-3V8h-2v3z"/></svg>`
};

const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
const RANK_COLORS = ['#1E88E5', '#00ACC1', '#00897B', '#43A047', '#FB8C00', '#E53935', '#C2185B', '#7B1FA2'];
const RANK_THRESHOLDS = [0, 80, 200, 420, 800, 1500, 2800, 5000];

const INIT_PLAYER = {
  lvl: 1, xp: 0, nextXp: 50,
  hp: 100, maxHp: 100,
  mp: 50, maxMp: 50,
  manaRegen: 5,
  gold: 50,
  atk: 18, def: 6, agi: 10, heal: 15
};

const ENEMIES = [
  { name: 'اسلایم کوچک', hp: 70, atk: 11, def: 3, agi: 4, gold: 9 },
  { name: 'خفاش تاریکی', hp: 90, atk: 14, def: 4, agi: 8, gold: 13 },
  { name: 'گابلین چابک', hp: 160, atk: 24, def: 10, agi: 12, gold: 24 },
  { name: 'گرگ وحشی', hp: 195, atk: 29, def: 12, agi: 14, gold: 32 },
  { name: 'اسکلت زره‌پوش', hp: 370, atk: 48, def: 24, agi: 12, gold: 55 },
  { name: 'زامبی جهش‌یافته', hp: 440, atk: 55, def: 28, agi: 8, gold: 70 },
  { name: 'اورک تنومند', hp: 720, atk: 90, def: 46, agi: 16, gold: 115 },
  { name: 'مارپیتون غول‌آسا', hp: 830, atk: 105, def: 52, agi: 22, gold: 140 },
  { name: 'ترول کوهستان', hp: 1350, atk: 165, def: 80, agi: 18, gold: 210 },
  { name: 'مینوتور شاخ‌دار', hp: 1550, atk: 185, def: 95, agi: 24, gold: 260 },
  { name: 'شوالیه سیاه', hp: 2400, atk: 290, def: 145, agi: 28, gold: 450 },
  { name: 'جادوگر دوزخی', hp: 2750, atk: 330, def: 135, agi: 34, gold: 540 },
  { name: 'غول باستانی سنگ', hp: 4200, atk: 500, def: 240, agi: 25, gold: 880 },
  { name: 'شبح لرد نامیرا', hp: 4700, atk: 560, def: 220, agi: 40, gold: 1050 },
  { name: 'اژدهای دوزخ سرخ', hp: 7200, atk: 820, def: 380, agi: 42, gold: 1750 },
  { name: 'تایتان تاریکی مطلق', hp: 8500, atk: 950, def: 440, agi: 48, gold: 2300 }
];

// مسیر تصاویر به شکل خودکار بر اساس اندیس هر آیتم مقداردهی می‌شوند
const SHOP = {
  swords: [
    { name: 'شمشیر چوبی', atk: 8, cost: 10 },
    { name: 'خنجر برنزی', atk: 20, cost: 28 },
    { name: 'شمشیر آهنی', atk: 45, cost: 65 },
    { name: 'تیغه فولادی', atk: 95, cost: 140 },
    { name: 'شمشیر کریستالی', atk: 170, cost: 260 },
    { name: 'تبر اژدهاکش', atk: 320, cost: 520 }
  ],
  shields: [
    { name: 'سپر چوبی', def: 6, agi_down: 1, cost: 10 },
    { name: 'سپر برنزی', def: 16, agi_down: 1, cost: 28 },
    { name: 'سپر آهنی', def: 38, agi_down: 2, cost: 65 },
    { name: 'سپر شوالیگی', def: 85, agi_down: 3, cost: 140 },
    { name: 'سپر برج سنگی', def: 160, agi_down: 4, cost: 270 },
    { name: 'سپر ابدی تایتان', def: 280, agi_down: 5, cost: 520 }
  ],
  armors: [
    { name: 'ردای نمدی', hp: 40, agi_down: 0, cost: 10 },
    { name: 'زره چرمی', hp: 100, agi_down: 1, cost: 28 },
    { name: 'زره برنزی', hp: 220, agi_down: 2, cost: 65 },
    { name: 'زره مشبک آهنی', hp: 480, agi_down: 2, cost: 140 },
    { name: 'زره پولکی کهن', hp: 900, agi_down: 3, cost: 280 },
    { name: 'جوشن زرین پالادین', hp: 1700, agi_down: 4, cost: 550 }
  ],
  boots: [
    { name: 'صندل خاکی', agi: 4, cost: 12 },
    { name: 'چکمه چرمی سبک', agi: 9, cost: 32 },
    { name: 'کفش رعدآسا', agi: 18, cost: 80 },
    { name: 'چکمه‌های سایه', agi: 32, cost: 170 },
    { name: 'کفش باد صبا', agi: 55, cost: 350 }
  ],
  heals: [
    { name: 'تمرین تنفس', heal: 10, cost: 20 },
    { name: 'بانداژ دارویی', heal: 25, cost: 50 },
    { name: 'هاله حیات', heal: 55, cost: 110 },
    { name: 'فیض پریان', heal: 110, cost: 220 },
    { name: 'اشک ققنوس جاودان', heal: 220, cost: 420 }
  ],
  manaRegen: [
    { name: 'تمرکز ذهنی', regen: 5, cost: 20 },
    { name: 'آویز کریستال آبی', regen: 12, cost: 50 },
    { name: 'جام سرچشمه کهن', regen: 25, cost: 115 },
    { name: 'حلقه جریان اثیری', regen: 50, cost: 230 }
  ],
  potions: [
    { name: 'پوشن سلامتی کوچک', potHp: 60, cost: 10 },
    { name: 'پوشن سلامتی بزرگ', potHp: 220, cost: 35 },
    { name: 'معجون مانا', potMp: 50, cost: 15 },
    { name: 'معجون مانا بزرگ', potMp: 140, cost: 35 },
    { name: 'اکسیر اعجاب‌انگیز', potHp: 500, potMp: 150, cost: 80 }
  ]
};

// تزریق مسیر عکس به داده‌ها
for (let cat in SHOP) {
  SHOP[cat].forEach((itm, i) => {
    itm.img = `img/${cat}/${i}.webp`;
  });
}

// اعداد یونانی برای نمایش
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// نام دسته‌بندی‌ها برای ساخت اسم‌های یونانی
const CAT_NAMES = {
  swords: 'Sword',
  shields: 'Shield',
  armors: 'Armor',
  boots: 'Boot',
  heals: 'Heal',
  manaRegen: 'Mana',
  potions: 'Potion'
};

// تزریق هوشمند نام و مسیر عکس به آیتم‌ها
for (let cat in SHOP) {
  SHOP[cat].forEach((itm, i) => {
    // تولید خودکار اسم (مثلاً: Sword I)
    itm.name = `${CAT_NAMES[cat]} ${ROMAN[i]}`;
    // تولید مسیر عکس
    itm.img = `img/${cat}/${i}.webp`;
  });
}

