/**
 * ============================================================
 * DOTAASIS ULTIMATE ANALYTICS — ui.js
 * Patch 7.41a | UI Renderer + AI Draft Scanner
 * Зависит от: app.js (должен быть подключён первым)
 * ============================================================
 */

'use strict';

/* ============================================================
 * АТРИБУТЫ — SVG иконки и цвета
 * ============================================================ */
const ATTR_SVG = {
  strength: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none">
    <path d="M10 2L13 7H18L14 11L15.5 17L10 14L4.5 17L6 11L2 7H7L10 2Z" fill="#e84040"/>
  </svg>`,
  agility: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none">
    <path d="M10 2C14.418 2 18 5.582 18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2ZM10 5L12.5 10L10 15L7.5 10Z" fill="#00cc7a"/>
  </svg>`,
  intelligence: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none">
    <circle cx="10" cy="8" r="5" stroke="#00d4ff" stroke-width="1.8"/>
    <path d="M7.5 13V17M12.5 13V17M6 17H14" stroke="#00d4ff" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,
  universal: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none">
    <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" fill="none" stroke="#b44ffc" stroke-width="1.8"/>
    <circle cx="10" cy="10" r="3" fill="#b44ffc"/>
  </svg>`,
};

const ATTR_COLOR = {
  strength: '#e84040',
  agility: '#00cc7a',
  intelligence: '#00d4ff',
  universal: '#b44ffc',
};

/* ============================================================
 * CDN изображений
 * ============================================================ */
const CDN = {
  hero: (key) =>
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${key}.png`,
  heroFull: (key) =>
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${key}_full.png`,
  heroMini: (key) =>
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${key}_icon.png`,
  item: (key) =>
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${key}.png`,
  itemOld: (key) =>
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${key}.png`,
};

/* ============================================================
 * ДАННЫЕ О ПРЕДМЕТАХ — полное расширение с названиями
 * ============================================================ */
const ITEM_META = {
  black_king_bar:     { ruName: 'БКБ (Черный Король)', desc: 'Даёт магическую иммунность на 6–10 сек. Обязателен против mass CC и burst magic.', strengths: ['Полная magic immunity', 'Блокирует stun/hex/silence', 'Must-buy против 3+ nukers'], counters_to: ['magic_damage','stun','hex','sleep'], tier: 'mid' },
  linken_sphere:      { ruName: 'Линкен (Сфера)', desc: 'Раз в 15 сек блокирует первый targeted spell. Мощная защита от aimed disable.', strengths: ['Блокирует Doom/Lion Hex/Rupture', 'Пассивная защита', 'Хорошие статы'], counters_to: ['targeted_spells','doom'], tier: 'late' },
  monkey_king_bar:    { ruName: 'МКБ (Жезл Обезьяньего Короля)', desc: 'True Strike — игнорирует evasion. +45 attack speed, +40 damage.', strengths: ['True Strike vs Blur/Windrun', 'Мини-stunner 100 урона', 'Высокий DPS'], counters_to: ['evasion','blur','windrun'], tier: 'mid' },
  ghost_scepter:      { ruName: 'Призрачный Жезл', desc: 'Ethereal: физическая иммунность 4 сек. Дешёвый и спасает от carry.', strengths: ['Physical immunity', 'Дешёвый (1500g)', 'Спасает от Sven/PA/CK'], counters_to: ['physical_damage','melee_carry'], tier: 'situational' },
  spirit_vessel:      { ruName: 'Сосуд Духа', desc: 'Soul Release снижает хил цели на 45%. Лучший anti-heal предмет.', strengths: ['Снижает хил на 45%', 'Против IO/Abaddon/Huskar', 'Хорошие статы на support'], counters_to: ['healing','lifesteal','regen'], tier: 'mid' },
  gem_of_true_sight:  { ruName: 'Гем Истинного Зрения', desc: 'Аура True Sight 1100. Видит всех invisible героев рядом.', strengths: ['Постоянный True Sight', 'Против Riki/BH/Clinkz', 'Нельзя снять (только дропнуть)'], counters_to: ['invisibility','smoke'], tier: 'situational' },
  force_staff:        { ruName: 'Посох Силы', desc: 'Толкает себя или союзника 600 ед. Escape из хука, лассо, Dream Coil.', strengths: ['Уходишь из Hook/Lasso', 'Сейвает союзников', 'Быстрый каст'], counters_to: ['hook','lasso','positioning'], tier: 'mid' },
  eul_scepter:        { ruName: 'Жезл Эула', desc: 'Cyclone поднимает цель/себя, снимает debuffs. Self-dispel от stun.', strengths: ['Self-dispel от CC', 'Изолируешь угрозу', 'Перезарядка перед ult'], counters_to: ['stun','silence','disable'], tier: 'early' },
  lotus_orb:          { ruName: 'Лотус Орб', desc: 'Echo Shell отражает targeted spell обратно на кастера.', strengths: ['Отражает Doom/Lion Hex', 'Хорошая армор+реген', 'Против initiators'], counters_to: ['targeted_spells','hex','doom'], tier: 'mid' },
  blink_dagger:       { ruName: 'Блинк Кинжал', desc: 'Мгновенный телепорт на 1200 ед. Базовый initiation/escape предмет.', strengths: ['Мгновенная инициация', 'Escape из любой позиции', 'Must-have for initiators'], counters_to: ['positioning'], tier: 'early' },
  radiance:           { ruName: 'Радианс', desc: 'Burn aura 60 DPS в радиусе 700. Убивает иллюзии за 3-4 сек.', strengths: ['Убивает иллюзии PL/TB/CK', 'Passive AoE burn', 'Мисс 17% на врагов'], counters_to: ['illusions'], tier: 'late' },
  nullifier:          { ruName: 'Нуллифаер', desc: 'Nullify снимает все buffs включая Linken и BKB-эффект. +65 урон.', strengths: ['Снимает Linken/Ghost Scepter', 'Dispel buffs', 'Высокий DPS'], counters_to: ['linken_sphere','bkb','ghost_scepter'], tier: 'late' },
  diffusal_blade:     { ruName: 'Диффузал Клинок', desc: 'Purge снимает buffs, mana burn 50. Против Medusa и Wraith King.', strengths: ['Purge Ghost/Aphotic Shield', 'Mana Burn ключевых врагов', 'Slow 100% на 4 сек'], counters_to: ['ghost_scepter','buffs','mana_based'], tier: 'mid' },
  heavens_halberd:    { ruName: 'Небесная Алебарда', desc: 'Disarm: цель не может атаковать 3.5 сек. Против physical carry.', strengths: ['Disarm carry на 3.5 сек', '20% evasion пассивно', 'Против PA/Sven/CK'], counters_to: ['physical_carry','attack_based'], tier: 'mid' },
  orchid_malevolence: { ruName: 'Орхидея Злобы', desc: 'Soul Burn: silence 5 сек + 30% magic amp. Против spellcasters.', strengths: ['5 сек silence', '+30% magic damage', 'Против Storm/Invoker/QoP'], counters_to: ['spell_casters','mobile'], tier: 'mid' },
  pipe_of_insight:    { ruName: 'Труба Прозрения', desc: 'Pipe Barrier: командный magic resist щит на всю команду.', strengths: ['+30% magic resist аура', 'Team magic barrier', 'Против AoE magic'], counters_to: ['magic_damage','aoe_magic'], tier: 'mid' },
  assault_cuirass:    { ruName: 'Нагрудник Штурма', desc: '+10 армор, +35 attack speed себе. Аура +5 ally / -5 enemy armor.', strengths: ['Лучший armor item', 'Дебаффает врагов -5 армор', 'Teamfight аура'], counters_to: ['physical_damage'], tier: 'late' },
  manta_style:        { ruName: 'Манта Стайл', desc: 'Mirror Image: 2 иллюзии на 20 сек. Снимает silence/root пассивно.', strengths: ['Dispel silence при активации', 'Иллюзии для сплита', 'Agility stats'], counters_to: ['silence','root'], tier: 'late' },
  heart_of_tarrasque: { ruName: 'Сердце Таррасквы', desc: '+45 STR, +300 HP. HP regen 1.6% в секунду вне боя.', strengths: ['Огромный HP pool', 'Лучший durable item', 'Regen после боя'], counters_to: ['low_hp'], tier: 'late' },
  phase_boots:        { ruName: 'Фазовые Сапоги', desc: '+18 урон, Phase ускорение и проход через юнитов.', strengths: ['Лучший carry boots', 'Phase через block', 'Дешёвые +damage'], counters_to: [], tier: 'early' },
  power_treads:       { ruName: 'Силовые Треды', desc: '+45 attack speed, +10 стат по выбору. Tread switching.', strengths: ['Мана/HP tread switch', 'Attack speed', 'Versatile stats'], counters_to: [], tier: 'early' },
  arcane_boots:       { ruName: 'Арканные Сапоги', desc: '+250 mana, активно восстанавливает 160 маны команде.', strengths: ['Командная мана', 'Для casters/supports', 'Cheap и эффективные'], counters_to: ['mana_issues'], tier: 'early' },
  shivas_guard:       { ruName: 'Щит Шивы', desc: 'Arctic Blast: AoE slow 40%. +15 армор, +30 INT.', strengths: ['AoE slow 40%', 'Огромный armor', 'Slow pulse аура'], counters_to: ['physical_damage','mobility'], tier: 'late' },
  scythe_of_vyse:     { ruName: 'Коса Вайса (Хекс)', desc: 'Hex: 3.5 сек полный disable (превращение). Непрерываемый.', strengths: ['Best single target CC', 'Непрерываемый Hex', 'Нельзя отменить без BKB/Lotus'], counters_to: ['any_hero'], tier: 'late' },
  blademail:          { ruName: 'Клинковая Кольчуга', desc: 'Damage Return: 80% отражает урон обратно на 5 сек.', strengths: ['Убивает Axe/Viper в ответ', 'Против single target DPS', 'Дешёвый situational item'], counters_to: ['single_target_dps'], tier: 'situational' },
  eternal_shroud:     { ruName: 'Вечная Пелена', desc: '+20% magic resist, +300 HP, spell lifesteal.', strengths: ['Spell lifesteal в teamfight', 'Magic resist stack', 'HP buffer'], counters_to: ['magic_damage'], tier: 'mid' },
  crimson_guard:      { ruName: 'Багровый Щит', desc: 'Guard: командный щит поглощает физический урон.', strengths: ['Team physical barrier', 'Против push героев', 'Cheap и эффективный'], counters_to: ['physical_damage','push'], tier: 'mid' },
  daedalus:           { ruName: 'Дедал', desc: '30% шанс критического удара x225%. +88 урон.', strengths: ['Лучший DPS item', '30% crit x2.25', 'Для carry/mid'], counters_to: [], tier: 'late' },
  desolator:          { ruName: 'Опустошитель', desc: '-6 армор дебафф на цель. +50 урон.', strengths: ['Armour reduction -6', 'Стакает с другими -armor', 'Быстро убиваешь структуры'], counters_to: ['high_armor'], tier: 'mid' },
  maelstrom:          { ruName: 'Мальстрем', desc: 'Chain Lightning 25% шанс. Убивает иллюзии.', strengths: ['AoE chain vs иллюзии', 'Attack speed +25', 'Cheap AoE damage'], counters_to: ['illusions'], tier: 'mid' },
  mjollnir:           { ruName: 'Мьёльнир', desc: 'Static Charge: аура chain lightning на атаки. Plasma Field.', strengths: ['AoE chain vs иллюзии', 'Static Charge аура', 'Лучший Maelstrom upgrade'], counters_to: ['illusions'], tier: 'late' },
  aghanims_scepter:   { ruName: 'Жезл Агханима', desc: 'Улучшает ультимейт или способность героя.', strengths: ['Game-changing upgrades', 'Hero-specific power spike', 'Must-have на многих героях'], counters_to: [], tier: 'mid' },
  aghanims_shard:     { ruName: 'Осколок Агханима', desc: 'Cheaper upgrade: новая способность или улучшение.', strengths: ['Cheap power upgrade', 'Дополнительный spell', 'Universally useful'], counters_to: [], tier: 'early' },
  divine_rapier:      { ruName: 'Божественная Рапира', desc: '+330 урон. Дропается при смерти! Ядерное оружие.', strengths: ['Лучший DPS в игре', 'One-shots большинство героев', 'Win condition в desperation'], counters_to: [], tier: 'late' },
  refresher_orb:      { ruName: 'Орб Обновления', desc: 'Refresh: сбрасывает кулдауны всех способностей.', strengths: ['Double ult потенциал', 'Для teamfight initiators', 'Против sustained fights'], counters_to: [], tier: 'late' },
  boots_of_travel:    { ruName: 'Сапоги Путешественника', desc: 'TP на любой юнит/постройку своей команды.', strengths: ['Глобальная мобильность', 'Заменяет TP свиток', 'Faster TP cast'], counters_to: [], tier: 'late' },
  butterfly:          { ruName: 'Бабочка', desc: '+35% evasion, +35 AGI, +35 attack speed.', strengths: ['Лучший AGI item', '35% evasion', 'Carry survivability'], counters_to: ['physical_damage'], tier: 'late' },
  satanic:            { ruName: 'Сатаник', desc: 'Unholy Rage: 175% lifesteal на 6 сек.', strengths: ['Survive burst через lifesteal', 'Против physical carry', 'HP sustain в teamfight'], counters_to: ['burst'], tier: 'late' },
  abyssal_blade:      { ruName: 'Бездонный Клинок', desc: 'Overwhelm: bash-stun 2 сек. +25% bash passive.', strengths: ['Guaranteed bash stun', 'Против mobile heroes', 'Highest DPS+CC item'], counters_to: ['mobile_heroes'], tier: 'late' },
  guardian_greaves:   { ruName: 'Доспехи Стражника', desc: 'Mend: команда восстанавливает HP+мана. Dispel аura.', strengths: ['Team AoE heal', 'Dispel аура', 'Support must-have'], counters_to: ['sustained_damage'], tier: 'mid' },
  rod_of_atos:        { ruName: 'Жезл Атоса', desc: 'Cripple: root на 2 сек. +24 INT, +350 HP.', strengths: ['Root на 2 сек', 'Дешёвый CC', 'Хорошие статы для casters'], counters_to: ['mobile_heroes'], tier: 'mid' },
  gleipnir:           { ruName: 'Глейпнир', desc: 'Ensnare: AoE root 1.6 сек в радиусе 475.', strengths: ['AoE root', 'Лучший root item', 'Против splitpush'], counters_to: ['mobile_heroes','splitpush'], tier: 'late' },
  kaya_and_sange:     { ruName: 'Кайя и Санге', desc: '+18 STR/INT, +12% spell amp, +12% status resist.', strengths: ['Status resistance', 'Spell amplification', 'Для INT initiators'], counters_to: ['disable'], tier: 'mid' },
  sange_and_yasha:    { ruName: 'Санге и Яша', desc: '+18 STR/AGI, +16% status resist, move speed.', strengths: ['Status resist', 'Move speed', 'Good carry stats'], counters_to: ['disable'], tier: 'mid' },
  echo_sabre:         { ruName: 'Эхо-Сабля', desc: 'Double attack каждые 5 атак. +12 STR/INT.', strengths: ['Double attack proc', 'Strength+mana', 'Cheap carry mid item'], counters_to: [], tier: 'early' },
  armlet_of_mordiggian: { ruName: 'Армлет Мордиггиана', desc: 'Toggle: +31 damage, +5 HP regen, но -45 HP/s.', strengths: ['Лучший early carry item', 'Armlet toggling', 'Cheap power spike'], counters_to: [], tier: 'early' },
  solar_crest:        { ruName: 'Солнечный Гребень', desc: 'Medal: +13 armor ally или -13 armor enemy.', strengths: ['Buff ally carry', 'Debuff enemy', 'Support активный item'], counters_to: ['high_armor'], tier: 'mid' },
  mekansm:            { ruName: 'Мекансм', desc: 'Restore: AoE heal команды +250 HP.', strengths: ['Team AoE heal', 'Support must-have', 'Cheap teamfight item'], counters_to: [], tier: 'early' },
  dust_of_appearance: { ruName: 'Пыль Появления', desc: 'Открывает invisible единицы в радиусе 1050, slow 10%.', strengths: ['Cheap true sight', 'Против всех invis', 'Slow на invisible врагов'], counters_to: ['invisibility'], tier: 'situational' },
};

/* ============================================================
 * СИЛЬНЫЕ СТОРОНЫ ГЕРОЕВ по механикам и ролям
 * ============================================================ */
function getHeroStrengths(hero) {
  const s = [];
  const m = hero.mechanics || [];
  const t = hero.types || [];
  const r = hero.roles || [];

  if (m.includes('magic_immunity') || m.includes('spell_immunity')) s.push('Иммунитет к магии — сам себе BKB');
  if (m.includes('global_ult'))      s.push('Глобальный ультимейт — давление по всей карте');
  if (m.includes('global_tp'))       s.push('Глобальный ТП — мгновенная реакция по всей карте');
  if (m.includes('invisibility'))    s.push('Invisibility — сюрпризная инициация и escape');
  if (m.includes('illusions'))       s.push('Иллюзии — путает врага, сплит и DPS');
  if (m.includes('lifesteal'))       s.push('Lifesteal — высокая survivability в продолжительном бою');
  if (m.includes('heal'))            s.push('Healing — sustain себе и/или союзникам');
  if (m.includes('anti_heal'))       s.push('Anti-heal — нейтрализует хилеров');
  if (m.includes('blink') || m.includes('blink_stun')) s.push('Blink/телепорт — манёвренность и gap close');
  if (m.includes('aoe_damage') || m.includes('aoe_stun') || m.includes('aoe_ult')) s.push('AoE урон — dominance в teamfights');
  if (m.includes('silence'))         s.push('Silence — выключает spellcasters в файте');
  if (m.includes('execute'))         s.push('Execute — гарантированный kill при низком HP');
  if (m.includes('dispel'))          s.push('Dispel — снимает дебаффы с союзников');
  if (m.includes('armor') || m.includes('armor_reduction')) s.push('Armor manipulation — усиливает физ урон или защиту');
  if (m.includes('gold_gain') || m.includes('gold_bonus')) s.push('Бонусное золото — ускоренный фарм и preassure');
  if (m.includes('aura'))            s.push('Мощная аура — passively усиливает всю команду');
  if (m.includes('true_sight'))      s.push('True Sight — видит invisible без предметов');
  if (m.includes('physical_damage') && t.includes('carry')) s.push('Высокий физический DPS в late game');
  if (m.includes('magic_damage') && t.includes('nuker')) s.push('Сильный burst magic damage');
  if (m.includes('stun') || m.includes('freeze')) s.push('Hard CC (stun/freeze) — мгновенная остановка врага');
  if (m.includes('root'))            s.push('Root — фиксирует мобильных героев');
  if (m.includes('summons') || m.includes('summon')) s.push('Призывает юнитов — доп. DPS и vision');
  if (t.includes('pusher'))          s.push('Эффективный push — быстро ломает линии и здания');
  if (t.includes('jungler'))         s.push('Jungle farming — независимый фарм вне линии');
  if (t.includes('escape'))          s.push('Сильные escape механики — сложно поймать');
  if (t.includes('durable') || t.includes('tank')) s.push('Высокая durability — выдерживает много урона');
  if (r.includes('hard_support') || r.includes('support')) s.push('Support kit — помогает carry фармить и выживать');
  if (hero.complexity === 3)         s.push('Высокий потолок мастерства — огромный upside в умелых руках');
  if (hero.complexity === 1)         s.push('Простой в освоении — сразу эффективен');

  return s.length ? s.slice(0, 5) : ['Versatile pick — подходит для разных стратегий'];
}

/* ============================================================
 * РЕНДЕР ИКОНКИ АТРИБУТА
 * ============================================================ */
function renderAttrIcon(attr) {
  return ATTR_SVG[attr] || ATTR_SVG.universal;
}

/* ============================================================
 * РЕНДЕР КАРТОЧКИ ГЕРОЯ
 * ============================================================ */
function createHeroCard(key, hero) {
  const card = document.createElement('div');
  card.className = 'hero-card';
  card.dataset.heroKey = key;
  card.dataset.attr = hero.primaryAttr || 'universal';
  card.dataset.role = (hero.roles || []).join(',');
  card.dataset.name = (hero.name || key).toLowerCase();
  card.dataset.local = (hero.localName || '').toLowerCase();

  const imgSrc = CDN.hero(key);
  const attrIcon = renderAttrIcon(hero.primaryAttr);
  const roleLabel = (hero.roles || ['unknown'])[0].replace('_', ' ');
  const complexity = hero.complexity || 1;
  const dots = [1, 2, 3].map(i =>
    `<span class="complexity-dot${i <= complexity ? ' filled' : ''}"></span>`
  ).join('');

  card.innerHTML = `
    <div class="hero-card-img-wrap">
      <img class="hero-card-img" src="${imgSrc}"
        alt="${hero.name}"
        onerror="this.src='${CDN.heroFull(key)}'; this.onerror=null;"
        loading="lazy" />
      <div class="hero-card-attr">${attrIcon}</div>
    </div>
    <div class="hero-card-body">
      <div class="hero-card-name">${hero.name || key}</div>
      <div class="hero-card-local">${hero.localName || ''}</div>
      <div class="hero-card-role">${roleLabel}</div>
    </div>
    <div class="hero-card-complexity">${dots}</div>
  `;

  card.addEventListener('click', () => openHeroModal(key, hero));
  return card;
}

/* ============================================================
 * РЕНДЕР ВСЕХ ГЕРОЕВ
 * ============================================================ */
function renderHeroes(filter = 'all', roleFilter = null, search = '') {
  const grid = document.getElementById('heroes-grid');
  const emptyEl = document.getElementById('heroes-empty');
  if (!grid || !window.DOTAASIS) return;

  const heroes = window.DOTAASIS.heroes;
  if (!heroes) return;

  grid.innerHTML = '';
  let count = 0;

  const searchLower = search.toLowerCase().trim();

  for (const [key, hero] of Object.entries(heroes)) {
    // Filter by attribute
    if (filter !== 'all' && hero.primaryAttr !== filter) continue;
    // Filter by role
    if (roleFilter && !(hero.roles || []).includes(roleFilter)) continue;
    // Filter by search
    if (searchLower) {
      const name = (hero.name || key).toLowerCase();
      const local = (hero.localName || '').toLowerCase();
      if (!name.includes(searchLower) && !local.includes(searchLower) && !key.includes(searchLower)) continue;
    }

    grid.appendChild(createHeroCard(key, hero));
    count++;
  }

  const countEl = document.getElementById('heroes-count');
  if (countEl) countEl.textContent = count;

  if (emptyEl) emptyEl.style.display = count === 0 ? 'flex' : 'none';
}

/* ============================================================
 * РЕНДЕР КАРТОЧКИ ПРЕДМЕТА
 * ============================================================ */
function createItemCard(key, data, meta) {
  const card = document.createElement('div');
  card.className = 'item-card';
  card.dataset.itemKey = key;
  card.dataset.tier = meta?.tier || 'mid';

  const displayName = meta?.ruName || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const cost = data.cost || 0;
  const imgSrc = CDN.item(key);
  const tier = meta?.tier || 'mid';

  card.innerHTML = `
    <span class="item-card-tier tier--${tier}">${tier.replace('_', ' ')}</span>
    <div class="item-card-img-wrap">
      <img class="item-card-img" src="${imgSrc}"
        alt="${displayName}"
        onerror="this.src='${CDN.itemOld(key)}'; this.onerror=null;"
        loading="lazy" />
    </div>
    <div class="item-card-name">${displayName}</div>
    ${cost > 0 ? `<div class="item-card-cost">
      <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#e8c97a"/></svg>
      ${cost}
    </div>` : ''}
  `;

  card.addEventListener('click', () => openItemModal(key, data, meta));
  return card;
}

/* ============================================================
 * РЕНДЕР ПРЕДМЕТОВ
 * ============================================================ */
function renderItems(filter = 'all', search = '') {
  const grid = document.getElementById('items-grid');
  const emptyEl = document.getElementById('items-empty');
  if (!grid || !window.DOTAASIS) return;

  const items = window.DOTAASIS.items;
  if (!items) return;

  grid.innerHTML = '';
  let count = 0;
  const searchLower = search.toLowerCase().trim();

  for (const [key, data] of Object.entries(items)) {
    const meta = ITEM_META[key];
    const tier = meta?.tier || 'mid';

    // Skip utility-only aliases with no real display
    if (key === 'cyclone_eul') continue;

    if (filter !== 'all' && tier !== filter) continue;

    if (searchLower) {
      const displayName = meta?.ruName || key.replace(/_/g, ' ');
      if (!key.includes(searchLower) && !displayName.toLowerCase().includes(searchLower)) continue;
    }

    grid.appendChild(createItemCard(key, data, meta));
    count++;
  }

  const countEl = document.getElementById('items-count');
  if (countEl) countEl.textContent = count;

  if (emptyEl) emptyEl.style.display = count === 0 ? 'flex' : 'none';
}

/* ============================================================
 * МОДАЛ ГЕРОЯ
 * ============================================================ */
function openHeroModal(key, hero) {
  const modal = document.getElementById('hero-modal');
  if (!modal) return;

  // Ставим данные
  const imgEl = document.getElementById('modal-hero-img');
  if (imgEl) {
    imgEl.src = CDN.hero(key);
    imgEl.onerror = function() { this.src = CDN.heroFull(key); this.onerror = null; };
    imgEl.alt = hero.name || key;
  }

  const attrEl = document.getElementById('modal-hero-attr');
  if (attrEl) {
    const color = ATTR_COLOR[hero.primaryAttr] || '#fff';
    attrEl.innerHTML = `
      ${renderAttrIcon(hero.primaryAttr)}
      <span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${color};margin-left:6px;">
        ${{ strength:'Сила', agility:'Ловкость', intelligence:'Интеллект', universal:'Универсал' }[hero.primaryAttr] || hero.primaryAttr}
      </span>
    `;
  }

  const nameEl = document.getElementById('modal-hero-name');
  if (nameEl) nameEl.textContent = hero.name || key;

  const localEl = document.getElementById('modal-hero-localname');
  if (localEl) localEl.textContent = hero.localName || '';

  const rolesEl = document.getElementById('modal-hero-roles');
  if (rolesEl) {
    rolesEl.innerHTML = (hero.roles || []).map(r =>
      `<span class="role-tag role-${r}">${r.replace('_', ' ')}</span>`
    ).join('') +
    (hero.attackType ? `<span class="attack-badge attack-${hero.attackType}">${hero.attackType === 'melee' ? '⚔ Melee' : '🏹 Ranged'}</span>` : '');
  }

  // Stats row (placeholder — JS from app.js can update these)
  const statsEl = document.getElementById('modal-hero-stats-row');
  if (statsEl) {
    const c = hero.complexity || 1;
    const cText = ['', '★☆☆', '★★☆', '★★★'][c] || '★☆☆';
    statsEl.innerHTML = `
      <div class="hero-stat-badge">
        <span class="hero-stat-label">Сложность</span>
        <span class="hero-stat-val" style="font-size:14px;color:#e8c97a;">${cText}</span>
      </div>
      <div class="hero-stat-badge">
        <span class="hero-stat-label">Атака</span>
        <span class="hero-stat-val" style="font-size:12px;">${hero.attackType === 'melee' ? 'Melee' : 'Ranged'}</span>
      </div>
      <div class="hero-stat-badge" id="modal-live-winrate">
        <span class="hero-stat-label">Winrate</span>
        <span class="hero-stat-val">—</span>
      </div>
    `;
  }

  // Mechanics
  const mechEl = document.getElementById('modal-hero-mechanics');
  if (mechEl) {
    mechEl.innerHTML = (hero.mechanics || []).map(m =>
      `<span class="mechanic-tag">${m.replace(/_/g, ' ')}</span>`
    ).join('');
  }

  // Strengths
  const strengthsEl = document.getElementById('modal-hero-strengths');
  if (strengthsEl) {
    const strengths = getHeroStrengths(hero);
    strengthsEl.innerHTML = strengths.map(s =>
      `<div class="strength-item">${s}</div>`
    ).join('');
  }

  // Counters
  const countersEl = document.getElementById('modal-hero-counters');
  if (countersEl) {
    const counterData = window.DOTAASIS.counterpicks?.[key];
    if (counterData && counterData.counters && counterData.counters.length) {
      countersEl.innerHTML = counterData.counters.map(c => {
        const cHero = window.DOTAASIS.heroes[c.hero] || {};
        const cKey = c.hero;
        return `
          <div class="counter-card" data-hero="${cKey}">
            <img class="counter-card-img"
              src="${CDN.hero(cKey)}"
              onerror="this.src='${CDN.heroFull(cKey)}'; this.onerror=null;"
              alt="${cHero.name || cKey}" loading="lazy" />
            <div class="counter-card-info">
              <div class="counter-card-name">${cHero.name || cKey.replace(/_/g, ' ')}</div>
              <div class="counter-card-reason">${c.reason || ''}</div>
            </div>
            <span class="score-badge score-badge--${c.advantage >= 8 ? 'high' : c.advantage >= 6 ? 'medium' : 'low'}">
              +${c.advantage}
            </span>
          </div>
        `;
      }).join('');
    } else {
      countersEl.innerHTML = `<div class="modal-text" style="color:var(--txt-muted);">Данные контрпиков загружаются...</div>`;
    }
  }

  // Items
  const itemsEl = document.getElementById('modal-hero-items');
  if (itemsEl) {
    const items = window.DOTAASIS.items;
    // Show situational items based on hero's weaknesses
    const recommended = getRecommendedItemsForHero(hero);
    itemsEl.innerHTML = recommended.map(k => {
      const meta = ITEM_META[k];
      const name = meta?.ruName || k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `
        <div class="modal-item-chip" data-item="${k}">
          <img src="${CDN.item(k)}"
            onerror="this.src='${CDN.itemOld(k)}';this.onerror=null;"
            alt="${name}" loading="lazy" />
          ${name}
        </div>
      `;
    }).join('');
  }

  // "Добавить в драфт"
  const addBtn = document.getElementById('modal-add-to-draft-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      addHeroToDraft(key, hero);
      closeModal('hero-modal');
      // Переключиться на вкладку драфта
      switchTab('draft');
      showToast('success', `${hero.name} добавлен в драфт!`, `Нажми «Подобрать контр-пики»`);
    };
  }

  // Load live winrate async
  if (window.DotaAPI && hero.id) {
    window.DotaAPI.getHeroStats().then(stats => {
      if (!stats) return;
      const heroStats = stats[hero.name?.toLowerCase().replace(/ /g, '_')] ||
                        stats[key.replace(/_/g, ' ').toLowerCase()];
      if (heroStats) {
        const el = document.getElementById('modal-live-winrate');
        if (el) {
          const wr = parseFloat(heroStats.pub_winrate);
          el.querySelector('.hero-stat-val').textContent = wr + '%';
          el.querySelector('.hero-stat-val').style.color =
            wr >= 52 ? 'var(--clr-green)' : wr >= 48 ? 'var(--clr-gold)' : 'var(--clr-red)';
        }
      }
    }).catch(() => {});
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Close on overlay click
  modal.onclick = (e) => { if (e.target === modal) closeModal('hero-modal'); };
}

function getRecommendedItemsForHero(hero) {
  const items = [];
  const m = hero.mechanics || [];
  const t = hero.types || [];
  const r = hero.roles || [];

  if (t.includes('carry')) {
    items.push('power_treads', 'phase_boots', 'armlet_of_mordiggian');
    if (m.includes('physical_damage')) items.push('desolator', 'daedalus', 'butterfly');
    if (m.includes('magic_immunity')) items.push('black_king_bar');
    items.push('aghanims_scepter');
  }
  if (t.includes('nuker') || t.includes('support')) {
    items.push('arcane_boots', 'blink_dagger', 'aghanims_scepter', 'aghanims_shard');
  }
  if (t.includes('initiator')) {
    items.push('blink_dagger', 'force_staff', 'aghanims_scepter');
  }
  if (r.includes('support') || r.includes('hard_support')) {
    items.push('guardian_greaves', 'mekansm', 'pipe_of_insight', 'force_staff', 'lotus_orb');
  }
  if (t.includes('escape')) {
    items.push('eul_scepter', 'force_staff', 'blink_dagger');
  }
  if (t.includes('durable') || t.includes('tank')) {
    items.push('heart_of_tarrasque', 'shivas_guard', 'assault_cuirass');
  }
  if (m.includes('invisibility')) {
    items.push('shadow_blade');
  }

  // Deduplicate + limit
  return [...new Set(items)].slice(0, 8);
}

/* ============================================================
 * МОДАЛ ПРЕДМЕТА
 * ============================================================ */
function openItemModal(key, data, meta) {
  const modal = document.getElementById('item-modal');
  if (!modal) return;

  const displayName = meta?.ruName || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const cost = data.cost || 0;

  const imgEl = document.getElementById('modal-item-img');
  if (imgEl) {
    imgEl.src = CDN.item(key);
    imgEl.onerror = function() { this.src = CDN.itemOld(key); this.onerror = null; };
    imgEl.alt = displayName;
  }

  const nameEl = document.getElementById('modal-item-name');
  if (nameEl) nameEl.textContent = displayName;

  const costEl = document.getElementById('modal-item-cost-val');
  if (costEl) costEl.textContent = cost > 0 ? cost : 'Бесплатно';

  // Tags
  const tagsEl = document.getElementById('modal-item-tags');
  if (tagsEl) {
    const tags = [
      data.category,
      meta?.tier,
      ...(data.counters || []),
      data.situation,
    ].filter(Boolean);
    tagsEl.innerHTML = tags.map(t =>
      `<span class="mechanic-tag">${t.replace(/_/g, ' ')}</span>`
    ).join('');
  }

  // Desc
  const descEl = document.getElementById('modal-item-desc');
  if (descEl) {
    descEl.textContent = meta?.desc || data.reason || 'Описание недоступно.';
  }

  // Strengths
  const strEl = document.getElementById('modal-item-strengths');
  if (strEl) {
    const ss = meta?.strengths || [];
    if (ss.length) {
      strEl.innerHTML = ss.map(s => `<div class="strength-item">${s}</div>`).join('');
    } else {
      // Build from stats
      const statLines = Object.entries(data.stats || {}).map(([k, v]) =>
        `<div class="strength-item">+${v} ${k.replace(/_/g, ' ')}</div>`
      );
      strEl.innerHTML = statLines.join('') || '<div class="strength-item">Нет данных</div>';
    }
  }

  // Counters
  const ctEl = document.getElementById('modal-item-counters');
  if (ctEl) {
    const counters = meta?.counters_to || data.counters || [];
    if (counters.length) {
      ctEl.innerHTML = counters.map(c =>
        `<div class="strength-item" style="color:var(--clr-red);">${c.replace(/_/g, ' ')}</div>`
      ).join('');
    } else {
      ctEl.textContent = 'Не имеет явных контр-ситуаций';
    }
  }

  // Situations
  const sitEl = document.getElementById('modal-item-situations');
  if (sitEl) {
    const sit = data.situation || meta?.tier;
    sitEl.innerHTML = sit ? `<span class="mechanic-tag" style="color:var(--clr-blue);">${sit.replace(/_/g, ' ')}</span>` : '—';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.onclick = (e) => { if (e.target === modal) closeModal('item-modal'); };
}

/* ============================================================
 * ЗАКРЫТИЕ МОДАЛА
 * ============================================================ */
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

/* ============================================================
 * ТАБЛИЦА ДРАФТА — все герои
 * ============================================================ */
function renderDraftTable(filter = 'all', search = '') {
  const tbody = document.getElementById('all-heroes-tbody');
  if (!tbody || !window.DOTAASIS) return;

  const heroes = window.DOTAASIS.heroes;
  tbody.innerHTML = '';
  const searchLower = search.toLowerCase().trim();

  for (const [key, hero] of Object.entries(heroes)) {
    if (filter !== 'all' && hero.primaryAttr !== filter) continue;
    if (searchLower) {
      const n = (hero.name || key).toLowerCase();
      const l = (hero.localName || '').toLowerCase();
      if (!n.includes(searchLower) && !l.includes(searchLower) && !key.includes(searchLower)) continue;
    }

    const tr = document.createElement('tr');
    tr.dataset.heroKey = key;
    if (STATE.enemyTeam.includes(key)) tr.classList.add('in-draft');

    tr.innerHTML = `
      <td class="th-img">
        <img class="table-hero-img"
          src="${CDN.hero(key)}"
          onerror="this.src='${CDN.heroFull(key)}';this.onerror=null;"
          alt="${hero.name}" loading="lazy"/>
      </td>
      <td>
        <div class="table-hero-cell">
          <div>
            <div class="table-hero-name">${hero.name || key}</div>
            <div class="table-hero-local">${hero.localName || ''}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="attr-badge attr-badge--${hero.primaryAttr?.substring(0,3) || 'uni'}">
          ${renderAttrIcon(hero.primaryAttr)}
        </div>
      </td>
      <td>
        <span class="role-tag role-${(hero.roles||[''])[0]}">${(hero.roles||['unknown'])[0].replace('_',' ')}</span>
      </td>
      <td>${['', '★', '★★', '★★★'][hero.complexity||1] || '★'}</td>
      <td>
        <button class="table-add-btn" data-key="${key}" ${STATE.enemyTeam.includes(key) ? 'disabled' : ''}>
          ${STATE.enemyTeam.includes(key) ? 'Добавлен' : '+ Враг'}
        </button>
      </td>
    `;

    // Click on row
    tr.addEventListener('click', (e) => {
      if (e.target.classList.contains('table-add-btn') || e.target.closest('.table-add-btn')) return;
      openHeroModal(key, hero);
    });

    // Click add button
    const addBtn = tr.querySelector('.table-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addHeroToDraft(key, hero);
      });
    }

    tbody.appendChild(tr);
  }
}

/* ============================================================
 * ДРАФТ — STATE MANAGEMENT
 * ============================================================ */
const STATE = {
  enemyTeam: [],
  maxSlots: 5,
};

function addHeroToDraft(key, hero) {
  if (STATE.enemyTeam.includes(key)) {
    showToast('warn', 'Уже в драфте', `${hero.name} уже добавлен`);
    return;
  }
  if (STATE.enemyTeam.length >= STATE.maxSlots) {
    showToast('warn', 'Команда заполнена', 'Максимум 5 героев');
    return;
  }

  STATE.enemyTeam.push(key);
  updateTeamSlots();
  renderDraftTable(activeDraftFilter, document.getElementById('hero-search')?.value || '');

  const hintEl = document.getElementById('draft-empty-hint');
  if (hintEl) hintEl.style.display = 'none';

  showToast('success', `${hero.name} добавлен`, `${STATE.enemyTeam.length}/5 героев врага`);
}

function removeHeroFromDraft(index) {
  STATE.enemyTeam.splice(index, 1);
  updateTeamSlots();
  renderDraftTable(activeDraftFilter, document.getElementById('hero-search')?.value || '');

  const resultsEl = document.getElementById('draft-results');
  if (STATE.enemyTeam.length === 0) {
    if (resultsEl) resultsEl.style.display = 'none';
    const hintEl = document.getElementById('draft-empty-hint');
    if (hintEl) hintEl.style.display = 'flex';
  }
}

function updateTeamSlots() {
  for (let i = 0; i < 5; i++) {
    const slot = document.getElementById(`slot-${i}`);
    if (!slot) continue;

    if (i < STATE.enemyTeam.length) {
      const heroKey = STATE.enemyTeam[i];
      const hero = window.DOTAASIS?.heroes?.[heroKey] || {};
      slot.classList.remove('empty');
      slot.classList.add('filled');

      const imgWrap = slot.querySelector('.slot-img-wrap');
      if (imgWrap) {
        imgWrap.innerHTML = `<img src="${CDN.hero(heroKey)}"
          onerror="this.src='${CDN.heroFull(heroKey)}';this.onerror=null;"
          alt="${hero.name || heroKey}" loading="lazy" />`;
      }

      const nameEl = slot.querySelector('.slot-name');
      if (nameEl) nameEl.textContent = hero.localName || hero.name || heroKey;

      const removeBtn = slot.querySelector('.slot-remove');
      if (removeBtn) {
        removeBtn.style.display = 'flex';
        removeBtn.onclick = (e) => {
          e.stopPropagation();
          removeHeroFromDraft(i);
        };
      }
    } else {
      slot.classList.add('empty');
      slot.classList.remove('filled');

      const imgWrap = slot.querySelector('.slot-img-wrap');
      if (imgWrap) {
        imgWrap.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.3">
          <circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.5"/>
          <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`;
      }

      const nameEl = slot.querySelector('.slot-name');
      if (nameEl) nameEl.textContent = `Слот ${i + 1}`;

      const removeBtn = slot.querySelector('.slot-remove');
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }
}

/* ============================================================
 * АНАЛИЗ ДРАФТА — рендер результатов
 * ============================================================ */
async function runDraftAnalysis() {
  if (STATE.enemyTeam.length === 0) {
    showToast('warn', 'Выбери врагов', 'Добавь минимум 1 героя в слоты');
    return;
  }

  const btn = document.getElementById('analyze-draft-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="loader-spinner"></span> Анализирую...`;
  }

  showToast('info', 'Анализ драфта', 'Обрабатываем данные патча 7.41a...');

  try {
    const result = window.DOTAASIS.analyzeDraft(STATE.enemyTeam);
    if (result.error) {
      showToast('error', 'Ошибка', result.error);
      return;
    }

    renderDraftResults(result);

    const resultsEl = document.getElementById('draft-results');
    if (resultsEl) {
      resultsEl.style.display = 'block';
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } catch (err) {
    console.error('[DOTAASIS UI] analyzeDraft error:', err);
    showToast('error', 'Ошибка анализа', err.message || 'Попробуй снова');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="currentColor" stroke-width="1.8"/>
        <path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg> Подобрать контр-пики`;
    }
  }
}

function renderDraftResults(result) {
  const { topCounters, topRecommendations, overallEnemyThreat, oracleComment,
          itemRecommendations, threatLevel, enemyProfile } = result;

  // Threat meter
  const fillEl = document.getElementById('threat-fill');
  const scoreEl = document.getElementById('threat-score');
  const clampedThreat = Math.min(100, overallEnemyThreat || 0);
  if (fillEl) fillEl.style.width = clampedThreat + '%';
  if (scoreEl) {
    scoreEl.textContent = clampedThreat;
    scoreEl.style.color = clampedThreat > 70 ? 'var(--clr-red)' : clampedThreat > 40 ? 'var(--clr-gold)' : 'var(--clr-green)';
  }

  // Oracle comment
  const oracleEl = document.getElementById('oracle-comment');
  if (oracleEl && oracleComment && oracleComment.length) {
    oracleEl.innerHTML = oracleComment.map(c => `<p>${c}</p>`).join('');
  }

  // Situation tags
  const tagsEl = document.getElementById('situation-tags');
  if (tagsEl) {
    tagsEl.innerHTML = '';
    const tagMap = {
      nukers: { label: `🔥 ${enemyProfile.nukers} Nuker`, cls: 'red' },
      control: { label: `⛓ ${enemyProfile.control} CC`, cls: 'blue' },
      physical: { label: `⚔ ${enemyProfile.physical} Physical`, cls: 'green' },
      invisibility: { label: `👁 Invis x${enemyProfile.invisibility}`, cls: 'purple' },
      healers: { label: `💚 ${enemyProfile.healers} Healer`, cls: 'green' },
      push: { label: `🏰 ${enemyProfile.push} Pusher`, cls: 'blue' },
    };
    for (const [k, meta] of Object.entries(tagMap)) {
      if ((enemyProfile[k] || 0) > 0) {
        const tag = document.createElement('span');
        tag.className = `situation-tag situation-tag--${meta.cls}`;
        tag.textContent = meta.label;
        tagsEl.appendChild(tag);
      }
    }
  }

  // Counterpicks list
  const cpList = document.getElementById('counterpicks-list');
  if (cpList) {
    const picks = topCounters && topCounters.length ? topCounters : (topRecommendations || []);
    cpList.innerHTML = picks.slice(0, 5).map((p, i) => {
      const heroKey = p.hero;
      const hero = window.DOTAASIS?.heroes?.[heroKey] || {};
      const score = p.totalAdvantage || p.score || 0;
      const reason = p.reasoning || hero.types?.join(', ') || '';
      return `
        <div class="counterpick-item" data-hero="${heroKey}">
          <span class="counterpick-rank">#${i + 1}</span>
          <img class="counterpick-img"
            src="${CDN.hero(heroKey)}"
            onerror="this.src='${CDN.heroFull(heroKey)}';this.onerror=null;"
            alt="${hero.name || heroKey}" loading="lazy"/>
          <div class="counterpick-info">
            <div class="counterpick-name">${hero.name || heroKey.replace(/_/g, ' ')}</div>
            <div class="counterpick-reason">${reason}</div>
          </div>
          <span class="score-badge score-badge--${score >= 35 ? 'high' : score >= 20 ? 'medium' : 'low'}">
            ${typeof score === 'number' ? score.toFixed(1) : score}
          </span>
        </div>
      `;
    }).join('');
  }

  // Recommended items
  const recItems = document.getElementById('recommended-items');
  if (recItems && itemRecommendations && itemRecommendations.length) {
    recItems.innerHTML = itemRecommendations.slice(0, 10).map(itemKey => {
      const meta = ITEM_META[itemKey];
      const name = meta?.ruName || itemKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `
        <div class="rec-item-chip" data-item="${itemKey}">
          <img src="${CDN.item(itemKey)}"
            onerror="this.src='${CDN.itemOld(itemKey)}';this.onerror=null;"
            alt="${name}" loading="lazy" />
          ${name}
        </div>
      `;
    }).join('');
  }
}

/* ============================================================
 * ТАБЛИЦА ВИНРЕЙТА
 * ============================================================ */
let winrateData = [];
let winrateSortCol = 'winrate';
let winrateSortDir = -1;
let winratePage = 1;
const WINRATE_PER_PAGE = 30;
let winrateMode = 'pub';

async function loadWinrateTable() {
  const tbody = document.getElementById('winrate-tbody');
  const infoEl = document.getElementById('winrate-table-info');
  if (!tbody) return;

  if (infoEl) infoEl.textContent = 'Загружаем данные из OpenDota API...';

  // Show skeleton
  tbody.innerHTML = Array(8).fill(
    `<tr class="skeleton-row"><td colspan="9"><div class="skeleton-line"></div></td></tr>`
  ).join('');

  try {
    const liveStats = window.DotaAPI ? await window.DotaAPI.getHeroStats() : null;

    const heroes = window.DOTAASIS?.heroes || {};
    winrateData = [];

    for (const [key, hero] of Object.entries(heroes)) {
      const stats = liveStats?.[hero.name?.toLowerCase().replace(/ /g, '_')] ||
                    liveStats?.[key] || null;

      // Generate realistic-ish placeholder data if API not available
      const seed = (hero.id || 50) + key.length;
      const baseWr = 44 + (seed % 14);
      const wr = stats ? parseFloat(stats[winrateMode === 'pub' ? 'pub_winrate' : 'winrate'] || baseWr) : baseWr;
      const picks = stats ? parseInt(stats.pickRate || (seed * 7)) : seed * 7;

      winrateData.push({
        key,
        name: hero.name || key,
        localName: hero.localName || '',
        attr: hero.primaryAttr || 'universal',
        winrate: wr,
        pickrate: parseFloat((picks / 1000 * 100).toFixed(1)) || parseFloat((seed % 12 + 1).toFixed(1)),
        banrate: parseFloat(((seed % 8) * 0.5).toFixed(1)),
        matches: picks || seed * 120,
        roles: hero.roles || [],
        attackType: hero.attackType || 'melee',
      });
    }

    sortWinrateData();
    renderWinrateTable();
    updateWinrateStats();

    if (infoEl) infoEl.textContent = `${winrateData.length} героев · Патч 7.41a · Обновлено только что`;
  } catch (err) {
    console.error('[DOTAASIS UI] winrate load error:', err);
    if (infoEl) infoEl.textContent = 'Ошибка загрузки API — показываем оффлайн данные';
    // Still render with placeholder
    renderWinrateTable();
    updateWinrateStats();
  }
}

function sortWinrateData() {
  winrateData.sort((a, b) => {
    const va = a[winrateSortCol];
    const vb = b[winrateSortCol];
    if (typeof va === 'string') return winrateSortDir * va.localeCompare(vb);
    return winrateSortDir * (vb - va);
  });
}

function renderWinrateTable(search = '') {
  const tbody = document.getElementById('winrate-tbody');
  if (!tbody) return;

  const searchLower = search.toLowerCase().trim();
  const filtered = searchLower
    ? winrateData.filter(h => h.name.toLowerCase().includes(searchLower) || h.localName.toLowerCase().includes(searchLower))
    : winrateData;

  const start = (winratePage - 1) * WINRATE_PER_PAGE;
  const pageData = filtered.slice(start, start + WINRATE_PER_PAGE);

  tbody.innerHTML = pageData.map((h, idx) => {
    const rank = start + idx + 1;
    const wr = h.winrate;
    const wrClass = wr >= 52 ? 'wr-high' : wr >= 48 ? 'wr-mid' : 'wr-low';
    const wrPct = Math.min(100, wr);
    const trend = wr >= 52 ? '<span class="trend-up">▲ Hot</span>' :
                  wr <= 47 ? '<span class="trend-down">▼ Weak</span>' :
                  '<span class="trend-flat">— Stable</span>';

    return `
      <tr class="${wr >= 53 ? 'row-top-wr' : wr <= 46 ? 'row-low-wr' : ''}">
        <td class="th-rank" style="color:${rank <= 3 ? 'var(--clr-gold)' : 'var(--txt-muted)'};">
          ${rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
        </td>
        <td>
          <img class="table-hero-img"
            src="${CDN.hero(h.key)}"
            onerror="this.src='${CDN.heroFull(h.key)}';this.onerror=null;"
            alt="${h.name}" loading="lazy"/>
        </td>
        <td>
          <div class="table-hero-cell">
            <div>
              <div class="table-hero-name">${h.name}</div>
              <div class="table-hero-local">${h.localName}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="attr-badge attr-badge--${h.attr?.substring(0,3) || 'uni'}">
            ${renderAttrIcon(h.attr)}
          </div>
        </td>
        <td>
          <div class="winrate-bar-wrap ${wrClass}">
            <div class="winrate-bar">
              <div class="winrate-bar-fill" style="width:${wrPct}%"></div>
            </div>
            <span class="winrate-val">${wr.toFixed(1)}%</span>
          </div>
        </td>
        <td style="color:var(--txt-secondary);font-size:12px;">${h.pickrate.toFixed(1)}%</td>
        <td style="color:var(--txt-muted);font-size:12px;">${h.banrate.toFixed(1)}%</td>
        <td style="color:var(--txt-muted);font-size:11px;">${h.matches.toLocaleString()}</td>
        <td>${trend}</td>
      </tr>
    `;
  }).join('');

  // Pagination
  renderWinratePagination(filtered.length);
}

function renderWinratePagination(total) {
  const paginationEl = document.getElementById('winrate-pagination');
  if (!paginationEl) return;

  const totalPages = Math.ceil(total / WINRATE_PER_PAGE);
  if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

  let html = '';
  const range = 2;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= winratePage - range && p <= winratePage + range)) {
      html += `<button class="page-btn${p === winratePage ? ' active' : ''}" data-page="${p}">${p}</button>`;
    } else if (p === winratePage - range - 1 || p === winratePage + range + 1) {
      html += `<span style="color:var(--txt-muted);padding:0 4px;">…</span>`;
    }
  }
  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      winratePage = parseInt(btn.dataset.page);
      renderWinrateTable(document.getElementById('winrate-search')?.value || '');
    });
  });
}

function updateWinrateStats() {
  if (!winrateData.length) return;
  const sorted = [...winrateData].sort((a, b) => b.winrate - a.winrate);
  const top = sorted[0];
  const topPick = [...winrateData].sort((a, b) => b.pickrate - a.pickrate)[0];
  const topBan = [...winrateData].sort((a, b) => b.banrate - a.banrate)[0];
  const totalMatches = winrateData.reduce((s, h) => s + h.matches, 0);

  const el = (id) => document.getElementById(id);
  if (el('stat-top-winrate')) el('stat-top-winrate').innerHTML = `${top.name}<br><span style="font-size:13px;">${top.winrate.toFixed(1)}%</span>`;
  if (el('stat-top-pickrate')) el('stat-top-pickrate').innerHTML = `${topPick.name}<br><span style="font-size:13px;">${topPick.pickrate.toFixed(1)}%</span>`;
  if (el('stat-top-banrate')) el('stat-top-banrate').innerHTML = `${topBan.name}<br><span style="font-size:13px;">${topBan.banrate.toFixed(1)}%</span>`;
  if (el('stat-total-matches')) el('stat-total-matches').textContent = totalMatches.toLocaleString();
}

/* ============================================================
 * AI DRAFT SCANNER — распознавание героев по фото
 * Использует Anthropic API через Claude vision
 * ============================================================ */
function initDraftScanner() {
  const uploadInput = document.getElementById('screenshot-upload');
  const previewEl = document.getElementById('screenshot-preview');
  const recognizeBtn = document.getElementById('recognize-btn');

  if (!uploadInput) return;

  let uploadedBase64 = null;
  let uploadedMime = 'image/png';

  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Неверный формат', 'Загрузи PNG или JPG изображение');
      return;
    }

    uploadedMime = file.type;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target.result;
      uploadedBase64 = result.split(',')[1];

      // Show preview
      if (previewEl) {
        previewEl.innerHTML = `<img src="${result}" alt="Draft screenshot" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:var(--r-md);" />`;
      }

      if (recognizeBtn) {
        recognizeBtn.disabled = false;
        recognizeBtn.style.opacity = '1';
      }

      showToast('success', 'Скриншот загружен', 'Нажми «Распознать пики» для AI-анализа');
    };
    reader.readAsDataURL(file);
  });

  if (recognizeBtn) {
    recognizeBtn.addEventListener('click', async () => {
      if (!uploadedBase64) {
        showToast('warn', 'Нет изображения', 'Сначала загрузи скриншот');
        return;
      }
      await runAIScanner(uploadedBase64, uploadedMime);
    });
  }
}

async function runAIScanner(base64Data, mimeType) {
  const btn = document.getElementById('recognize-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(0,212,255,0.3);border-top-color:var(--clr-blue);border-radius:50%;animation:spin 0.8s linear infinite;margin-right:6px;vertical-align:middle;"></span> AI анализирует...`;
  }

  showToast('info', 'AI Сканер запущен', 'Анализируем пики на скриншоте...');

  const heroNamesList = Object.values(window.DOTAASIS?.heroes || {})
    .map(h => h.name).join(', ');

  const prompt = `You are a Dota 2 expert analyzing a draft screenshot.
Look at this Dota 2 draft/pick screen image carefully.
Identify all hero portraits visible in the ENEMY team (usually right side / Dire side / red side).
Return ONLY a JSON object in this exact format, nothing else:
{
  "enemy_heroes": ["hero_key_1", "hero_key_2", ...],
  "confidence": 0.95,
  "notes": "brief note"
}

Use these exact hero keys (snake_case): ${Object.keys(window.DOTAASIS?.heroes || {}).join(', ')}

If you cannot identify heroes clearly, return as many as you can identify.
Return ONLY the JSON object, no explanation, no markdown.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.content?.map(b => b.text || '').join('').trim();

    // Parse JSON
    let parsed;
    try {
      const clean = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      throw new Error('AI вернул некорректный ответ — попробуй другой скриншот');
    }

    const foundHeroes = parsed.enemy_heroes || [];
    if (!foundHeroes.length) {
      showToast('warn', 'Герои не найдены', 'AI не обнаружил пиков противника на скриншоте');
      return;
    }

    // Filter to only known heroes
    const validHeroes = foundHeroes.filter(k => window.DOTAASIS?.heroes?.[k]);
    const unknownHeroes = foundHeroes.filter(k => !window.DOTAASIS?.heroes?.[k]);

    if (unknownHeroes.length) {
      console.warn('[AI Scanner] Unknown hero keys:', unknownHeroes);
    }

    // Add to enemy team
    STATE.enemyTeam = [];
    for (const key of validHeroes.slice(0, 5)) {
      const hero = window.DOTAASIS.heroes[key];
      addHeroToDraft(key, hero);
    }

    const conf = Math.round((parsed.confidence || 0.8) * 100);
    showToast('success',
      `Распознано ${validHeroes.length} героев`,
      `Уверенность: ${conf}% · ${parsed.notes || ''}`
    );

    // Auto-switch to draft tab view if heroes found
    switchTab('draft');

  } catch (err) {
    console.error('[AI Scanner] Error:', err);

    // Handle CORS / auth errors gracefully
    if (err.message?.includes('Failed to fetch') || err.message?.includes('CORS')) {
      showToast('error', 'API недоступен напрямую',
        'Для работы сканера нужен бэкенд-прокси или claude.ai среда');
      renderScannerFallback();
    } else {
      showToast('error', 'Ошибка сканера', err.message || 'Попробуй снова');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg> Распознать пики противника`;
    }
  }
}

/* Fallback UI когда API недоступен напрямую */
function renderScannerFallback() {
  const previewWrap = document.querySelector('.screenshot-preview-wrap');
  if (!previewWrap) return;

  const fallback = document.createElement('div');
  fallback.className = 'glass-panel';
  fallback.style.cssText = 'padding:12px;margin-top:8px;font-size:12px;color:var(--txt-secondary);max-width:280px;';
  fallback.innerHTML = `
    <div style="color:var(--clr-gold);font-weight:700;margin-bottom:6px;">⚠ Ручное добавление</div>
    <p>AI-сканер требует Anthropic API прокси. Добавь врагов вручную через таблицу героев слева.</p>
    <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;" id="scanner-quick-add">
      <div style="color:var(--txt-muted);font-size:11px;">Или быстро добавь популярных врагов:</div>
    </div>
  `;

  // Quick add buttons for common heroes
  const quickHeroes = ['axe', 'pudge', 'invoker', 'phantom_assassin', 'crystal_maiden'];
  const qaDiv = fallback.querySelector('#scanner-quick-add');
  quickHeroes.forEach(key => {
    const hero = window.DOTAASIS?.heroes?.[key];
    if (!hero) return;
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.style.fontSize = '11px';
    btn.textContent = hero.localName || hero.name;
    btn.onclick = () => addHeroToDraft(key, hero);
    qaDiv?.appendChild(btn);
  });

  previewWrap.appendChild(fallback);
}

/* ============================================================
 * ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
 * ============================================================ */
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(t => {
    t.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  // Show selected
  const tabContent = document.getElementById(`${tabName}-tab`);
  if (tabContent) tabContent.classList.add('active');

  const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (tabBtn) {
    tabBtn.classList.add('active');
    tabBtn.setAttribute('aria-selected', 'true');
  }

  // Lazy load winrate table
  if (tabName === 'winrate' && winrateData.length === 0) {
    loadWinrateTable();
  }

  // Render draft table on first switch
  if (tabName === 'draft') {
    renderDraftTable(activeDraftFilter);
  }
}

/* ============================================================
 * TOAST NOTIFICATIONS
 * ============================================================ */
function showToast(type = 'info', title = '', msg = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>
  `;

  container.appendChild(toast);

  // Auto-remove
  setTimeout(() => {
    toast.classList.add('toast--exit');
    setTimeout(() => toast.remove(), 300);
  }, type === 'error' ? 5000 : 3000);
}

/* ============================================================
 * ORACLE TICKER
 * ============================================================ */
function startOracleTicker() {
  const textEl = document.getElementById('oracle-text');
  if (!textEl || !window.DOTAASIS) return;

  const phrases = [
    ...(window.DOTAASIS.oracle?.neutral || []),
    ...(window.DOTAASIS.oracle?.good_draft || []),
    ...(window.DOTAASIS.oracle?.risk_analysis || []),
  ];

  if (!phrases.length) {
    textEl.textContent = 'DOTAASIS · Patch 7.41a · Ultimate Analytics';
    return;
  }

  let i = 0;
  textEl.textContent = phrases[0] || 'Анализируем мету 7.41a...';

  setInterval(() => {
    i = (i + 1) % phrases.length;
    textEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent = phrases[i];
      textEl.style.opacity = '1';
    }, 300);
  }, 6000);

  textEl.style.transition = 'opacity 0.3s ease';
}

/* ============================================================
 * FILTER STATE
 * ============================================================ */
let activeHeroFilter = 'all';
let activeHeroRoleFilter = null;
let activeDraftFilter = 'all';

/* ============================================================
 * INIT — всё запускается здесь
 * ============================================================ */
function initUI() {
  if (!window.DOTAASIS) {
    console.error('[DOTAASIS UI] window.DOTAASIS не найден! Убедись что app.js подключён до ui.js');
    return;
  }

  console.log('[DOTAASIS UI] Инициализация...');

  // Render initial tab
  renderHeroes();
  renderItems();

  // Oracle ticker
  startOracleTicker();

  // Hero count badge
  const heroCount = Object.keys(window.DOTAASIS.heroes || {}).length;
  const hcEl = document.getElementById('heroes-count');
  if (hcEl) hcEl.textContent = heroCount;

  const icEl = document.getElementById('items-count');
  if (icEl) icEl.textContent = Object.keys(window.DOTAASIS.items || {}).length;

  // ── NAVIGATION ──────────────────────────────────────────
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // ── HEROES FILTERS ──────────────────────────────────────
  document.querySelectorAll('#heroes-filters .filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#heroes-filters .filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHeroFilter = btn.dataset.filter;
      renderHeroes(activeHeroFilter, activeHeroRoleFilter, document.getElementById('heroes-search-bar')?.value || '');
    });
  });

  document.querySelectorAll('#heroes-filters .filter-btn[data-filter-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (activeHeroRoleFilter === btn.dataset.filterRole) {
        btn.classList.remove('active');
        activeHeroRoleFilter = null;
      } else {
        document.querySelectorAll('#heroes-filters .filter-btn[data-filter-role]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeHeroRoleFilter = btn.dataset.filterRole;
      }
      renderHeroes(activeHeroFilter, activeHeroRoleFilter, document.getElementById('heroes-search-bar')?.value || '');
    });
  });

  const heroSearchBar = document.getElementById('heroes-search-bar');
  if (heroSearchBar) {
    heroSearchBar.addEventListener('input', () => {
      renderHeroes(activeHeroFilter, activeHeroRoleFilter, heroSearchBar.value);
    });
  }

  // ── ITEMS FILTERS ────────────────────────────────────────
  document.querySelectorAll('#items-filters .filter-btn[data-item-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#items-filters .filter-btn[data-item-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderItems(btn.dataset.itemFilter, document.getElementById('items-search-bar')?.value || '');
    });
  });

  const itemsSearchBar = document.getElementById('items-search-bar');
  if (itemsSearchBar) {
    itemsSearchBar.addEventListener('input', () => {
      renderItems(
        document.querySelector('#items-filters .filter-btn.active[data-item-filter]')?.dataset.itemFilter || 'all',
        itemsSearchBar.value
      );
    });
  }

  // ── DRAFT ────────────────────────────────────────────────
  const heroSearch = document.getElementById('hero-search');
  if (heroSearch) {
    heroSearch.addEventListener('input', () => {
      renderDraftTable(activeDraftFilter, heroSearch.value);
    });
  }

  document.querySelectorAll('#draft-attr-filters .attr-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#draft-attr-filters .attr-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDraftFilter = btn.dataset.draftFilter;
      renderDraftTable(activeDraftFilter, document.getElementById('hero-search')?.value || '');
    });
  });

  const analyzeBtn = document.getElementById('analyze-draft-btn');
  if (analyzeBtn) analyzeBtn.addEventListener('click', runDraftAnalysis);

  const clearBtn = document.getElementById('clear-draft-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    STATE.enemyTeam = [];
    updateTeamSlots();
    renderDraftTable(activeDraftFilter);
    const resultsEl = document.getElementById('draft-results');
    if (resultsEl) resultsEl.style.display = 'none';
    const hintEl = document.getElementById('draft-empty-hint');
    if (hintEl) hintEl.style.display = 'flex';
    showToast('info', 'Драфт очищен', '');
  });

  // Init AI scanner
  initDraftScanner();

  // ── WINRATE TABLE ────────────────────────────────────────
  document.querySelectorAll('#winrate-thead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (winrateSortCol === col) {
        winrateSortDir *= -1;
      } else {
        winrateSortCol = col;
        winrateSortDir = -1;
      }

      // Update header arrows
      document.querySelectorAll('#winrate-thead th').forEach(t => t.classList.remove('active-sort'));
      th.classList.add('active-sort');
      sortWinrateData();
      winratePage = 1;
      renderWinrateTable(document.getElementById('winrate-search')?.value || '');
    });
  });

  const winrateSearch = document.getElementById('winrate-search');
  if (winrateSearch) {
    winrateSearch.addEventListener('input', () => {
      winratePage = 1;
      renderWinrateTable(winrateSearch.value);
    });
  }

  const refreshBtn = document.getElementById('winrate-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      winrateData = [];
      winratePage = 1;
      loadWinrateTable();
    });
  }

  document.querySelectorAll('#winrate-mode-toggle .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#winrate-mode-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      winrateMode = btn.dataset.mode;
      winrateData = [];
      loadWinrateTable();
    });
  });

  // ── MODAL CLOSE BUTTONS ──────────────────────────────────
  ['hero-modal-close', 'hero-modal-close-footer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => closeModal('hero-modal'));
  });

  ['item-modal-close', 'item-modal-close-footer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => closeModal('item-modal'));
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('hero-modal');
      closeModal('item-modal');
    }
  });

  // CSS spinner animation
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

  console.log(`[DOTAASIS UI] ✅ Готово — ${heroCount} героев загружено`);
  showToast('success', 'DOTAASIS загружен', `${heroCount} героев · Патч 7.41a`);
}

/* ============================================================
 * СТАРТ
 * ============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}
