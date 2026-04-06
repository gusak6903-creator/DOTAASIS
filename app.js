/**
 * DOTA 2 COUNTERPICK — app.js
 * Использует OpenDota API + Dota 2 CDN для получения актуальных данных
 * Патч 7.41
 */

// ===== CONFIG =====
const CDN = 'https://cdn.cloudflare.steamstatic.com';
const OPENDOTA = 'https://api.opendota.com/api';
const DOTA2_API = 'https://api.opendota.com/api';

// Атрибуты
const ATTR_SYMBOLS = { str: '💪', agi: '🗡', int: '✨', all_stats: '☯' };
const ATTR_LABELS  = { str: 'СИЛА', agi: 'ЛОВКОСТЬ', int: 'ИНТЕЛЛЕКТ', all_stats: 'УНИВЕРСАЛ' };

// Нейтральные предметы по тирам
const NEUTRAL_TIERS = { 1:'Тир 1', 2:'Тир 2', 3:'Тир 3', 4:'Тир 4', 5:'Тир 5' };

// ===== STATE =====
let ALL_HEROES = [];
let ALL_ITEMS  = {};
let MATCHUPS   = {};  // hero_id -> { counters: [], countered_by: [] }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTabs();
  initModals();
  loadAllData();
});

// ===== PARTICLES =====
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const isRadiant = Math.random() > 0.5;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      width: ${size}px; height: ${size}px;
      background: ${isRadiant ? 'rgba(93,205,39,0.8)' : 'rgba(200,168,75,0.8)'};
      animation-delay: ${Math.random() * 10}s;
      animation-duration: ${8 + Math.random() * 12}s;
    `;
    container.appendChild(p);
  }
}

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

// ===== MODALS =====
function initModals() {
  document.getElementById('modal-close').addEventListener('click', closeHeroModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeHeroModal();
  });
  document.getElementById('item-modal-close').addEventListener('click', closeItemModal);
  document.getElementById('item-modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'item-modal-overlay') closeItemModal();
  });
}
function openHeroModal(hero) {
  document.getElementById('modal-content').innerHTML = buildHeroModal(hero);
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeHeroModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function openItemModal(item) {
  document.getElementById('item-modal-content').innerHTML = buildItemModal(item);
  document.getElementById('item-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeItemModal() {
  document.getElementById('item-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== DATA LOADING =====
async function loadAllData() {
  try {
    const [heroes, items, matchups] = await Promise.all([
      fetchHeroes(),
      fetchItems(),
      fetchMatchups()
    ]);
    ALL_HEROES  = heroes;
    ALL_ITEMS   = items;
    MATCHUPS    = matchups;
    renderHeroes();
    renderItems();
    renderCPSidebar();
  } catch(err) {
    console.error('Data load error:', err);
    showError('heroes-grid', 'heroes-loading');
    showError('items-grid', 'items-loading');
  }
}

function showError(gridId, loadId) {
  document.getElementById(loadId)?.classList.add('hidden');
  document.getElementById(gridId).innerHTML = `
    <div class="error-state">
      <p>⚠ Не удалось загрузить данные с API</p>
      <p style="font-size:13px;margin-top:8px;color:#7a6a5a">
        Проверьте интернет-соединение. Убедитесь что CORS не блокируется (используйте GitHub Pages или localhost).
      </p>
      <button class="retry-btn" onclick="location.reload()">↺ Повторить</button>
    </div>
  `;
}

// ===== API CALLS =====
async function fetchHeroes() {
  const res = await fetch(`${OPENDOTA}/heroes`);
  if (!res.ok) throw new Error('Heroes fetch failed');
  const data = await res.json();
  return data.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
}

async function fetchItems() {
  const res = await fetch(`${OPENDOTA}/constants/items`);
  if (!res.ok) throw new Error('Items fetch failed');
  return await res.json();
}

async function fetchMatchups() {
  // Загружаем matchups для всех героев
  // OpenDota отдаёт их батчем через /heroStats
  const res = await fetch(`${OPENDOTA}/heroStats`);
  if (!res.ok) throw new Error('Matchups fetch failed');
  const stats = await res.json();
  const map = {};
  for (const h of stats) {
    map[h.id] = h;
  }
  return map;
}

// ===== IMAGE HELPERS =====
function heroImg(hero) {
  // OpenDota возвращает img путь вида /apps/dota2/images/...
  if (hero.img) return CDN + hero.img;
  return CDN + `/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_','')}.png`;
}

function itemImg(item) {
  if (item.img) return CDN + item.img;
  return '';
}

// ===== RENDER HEROES =====
function renderHeroes() {
  const grid = document.getElementById('heroes-grid');
  document.getElementById('heroes-loading').classList.add('hidden');
  document.getElementById('hero-count').textContent = ALL_HEROES.length;

  grid.innerHTML = '';
  ALL_HEROES.forEach((hero, idx) => {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.dataset.name = hero.localized_name.toLowerCase();
    card.dataset.attr = hero.primary_attr;
    card.dataset.roles = (hero.roles || []).map(r => r.toLowerCase()).join(',');
    card.style.animationDelay = `${Math.min(idx * 12, 400)}ms`;

    const img = heroImg(hero);
    const attr = hero.primary_attr;

    card.innerHTML = `
      <div class="hero-img-wrap">
        <img src="${img}" alt="${hero.localized_name}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x113/0d1520/c8a84b?text=HERO'">
        <div class="hero-attr-badge ${attr}">${ATTR_SYMBOLS[attr] || '?'}</div>
      </div>
      <div class="hero-info">
        <div class="hero-name">${hero.localized_name}</div>
        <div class="hero-roles">
          ${(hero.roles || []).slice(0,3).map(r => `<span class="hero-role-tag">${r}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => openHeroModal(hero));
    grid.appendChild(card);
  });

  buildRoleFilters();
  initHeroFilters();
}

function buildRoleFilters() {
  const roles = new Set();
  ALL_HEROES.forEach(h => (h.roles || []).forEach(r => roles.add(r)));
  const container = document.getElementById('role-filters');
  container.innerHTML = [...roles].sort().map(r =>
    `<button class="attr-btn" data-role="${r.toLowerCase()}">${r}</button>`
  ).join('');
  container.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      filterHeroes();
    });
  });
}

function initHeroFilters() {
  document.getElementById('hero-search').addEventListener('input', filterHeroes);
  document.querySelectorAll('.attr-btn[data-attr]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.attr-btn[data-attr]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterHeroes();
    });
  });
}

function filterHeroes() {
  const q = document.getElementById('hero-search').value.toLowerCase();
  const attr = document.querySelector('.attr-btn[data-attr].active')?.dataset.attr || 'all';
  const activeRoles = [...document.querySelectorAll('[data-role].active')].map(b => b.dataset.role);

  document.querySelectorAll('.hero-card').forEach(card => {
    const nameMatch  = card.dataset.name.includes(q);
    const attrMatch  = attr === 'all' || card.dataset.attr === attr;
    const roleMatch  = activeRoles.length === 0 || activeRoles.every(r => card.dataset.roles.includes(r));
    card.classList.toggle('hidden', !(nameMatch && attrMatch && roleMatch));
  });
}

// ===== HERO MODAL =====
function buildHeroModal(hero) {
  const img = heroImg(hero);
  const attr = hero.primary_attr;
  const matchup = MATCHUPS[hero.id] || {};

  const baseStr = matchup.base_str || hero.base_str || '—';
  const baseAgi = matchup.base_agi || hero.base_agi || '—';
  const baseInt = matchup.base_int || hero.base_int || '—';

  const counters = getCounters(hero.id, 6);
  const countered = getCounteredBy(hero.id, 6);

  return `
    <div class="modal-hero-header">
      <img class="modal-hero-img" src="${img}" alt="${hero.localized_name}"
           onerror="this.src='https://via.placeholder.com/200x113/0d1520/c8a84b?text=HERO'">
      <div>
        <div class="modal-hero-title">${hero.localized_name}</div>
        <div class="modal-hero-attr">
          <span class="attr-label ${attr}">${ATTR_SYMBOLS[attr]} ${ATTR_LABELS[attr]}</span>
        </div>
        <div class="modal-roles">
          ${(hero.roles || []).map(r => `<span class="modal-role-tag">${r}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="modal-stats">
      <div class="stat-box">
        <div class="stat-label">СИЛА</div>
        <div class="stat-value str">${hero.base_str || '—'} <small style="font-size:12px">+${hero.str_gain || '—'}</small></div>
      </div>
      <div class="stat-box">
        <div class="stat-label">ЛОВКОСТЬ</div>
        <div class="stat-value agi">${hero.base_agi || '—'} <small style="font-size:12px">+${hero.agi_gain || '—'}</small></div>
      </div>
      <div class="stat-box">
        <div class="stat-label">ИНТЕЛЛЕКТ</div>
        <div class="stat-value int">${hero.base_int || '—'} <small style="font-size:12px">+${hero.int_gain || '—'}</small></div>
      </div>
      <div class="stat-box">
        <div class="stat-label">АТАКА</div>
        <div class="stat-value">${hero.base_attack_min || '—'}–${hero.base_attack_max || '—'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">БРОНЯ</div>
        <div class="stat-value">${hero.base_armor || '—'}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">СКОРОСТЬ</div>
        <div class="stat-value">${hero.move_speed || '—'}</div>
      </div>
    </div>

    <div style="margin-bottom:20px">
      <div class="modal-section-title">⚔ КОНТРИТ (лучшие против ${hero.localized_name})</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${counters.map(c => `
          <div style="text-align:center;cursor:pointer" onclick="closeHeroModal();setTimeout(()=>selectCPHero(${c.id}),200)">
            <img src="${heroImg(c)}" style="width:72px;height:40px;object-fit:cover;border-radius:5px;border:2px solid #5dcd27;box-shadow:0 0 10px rgba(93,205,39,0.4)"
                 onerror="this.src=''" alt="${c.localized_name}">
            <div style="font-size:9px;margin-top:4px;color:#e8dfc0;font-weight:600">${c.localized_name}</div>
          </div>
        `).join('')}
        ${counters.length === 0 ? '<span style="color:#7a6a5a;font-size:13px">Нет данных</span>' : ''}
      </div>
    </div>

    <div>
      <div class="modal-section-title">🛡 СЛАБ ПРОТИВ (кто бьёт ${hero.localized_name})</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${countered.map(c => `
          <div style="text-align:center">
            <img src="${heroImg(c)}" style="width:72px;height:40px;object-fit:cover;border-radius:5px;border:2px solid #d02020;box-shadow:0 0 10px rgba(208,32,32,0.4)"
                 onerror="this.src=''" alt="${c.localized_name}">
            <div style="font-size:9px;margin-top:4px;color:#e8dfc0;font-weight:600">${c.localized_name}</div>
          </div>
        `).join('')}
        ${countered.length === 0 ? '<span style="color:#7a6a5a;font-size:13px">Нет данных</span>' : ''}
      </div>
    </div>
  `;
}

// ===== RENDER ITEMS =====
function renderItems() {
  const grid = document.getElementById('items-grid');
  document.getElementById('items-loading').classList.add('hidden');

  const items = Object.entries(ALL_ITEMS)
    .filter(([key, item]) => item.img && item.dname)
    .sort(([,a],[,b]) => (a.dname||'').localeCompare(b.dname||''));

  document.getElementById('item-count').textContent = items.length;
  grid.innerHTML = '';

  items.forEach(([key, item], idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.name = (item.dname || key).toLowerCase();
    card.dataset.cat = item.qual || 'common';
    card.style.animationDelay = `${Math.min(idx * 8, 500)}ms`;

    const isNeutral = item.qual === 'component' && (item.tier != null) || item.neutral_tier;
    const tier = item.tier || item.neutral_tier;

    card.innerHTML = `
      <img class="item-img" src="${CDN + item.img}" alt="${item.dname || key}"
           loading="lazy" onerror="this.style.display='none'">
      <div class="item-name">${item.dname || key}</div>
      ${item.cost ? `<div class="item-cost">${item.cost}</div>` : ''}
      ${tier ? `<div class="item-neutral-tier">Тир ${tier}</div>` : ''}
    `;
    card.addEventListener('click', () => openItemModal({ key, ...item }));
    grid.appendChild(card);
  });

  initItemFilters();
}

function initItemFilters() {
  document.getElementById('item-search').addEventListener('input', filterItems);
  document.querySelectorAll('.item-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.item-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems();
    });
  });
}

function filterItems() {
  const q = document.getElementById('item-search').value.toLowerCase();
  const cat = document.querySelector('.item-cat-btn.active')?.dataset.cat || 'all';

  document.querySelectorAll('.item-card').forEach(card => {
    const nameMatch = card.dataset.name.includes(q);
    const catMatch  = cat === 'all' ||
      (cat === 'neutral' ? card.dataset.cat === 'component' : card.dataset.cat === cat);
    card.classList.toggle('hidden', !(nameMatch && catMatch));
  });
}

// ===== ITEM MODAL =====
function buildItemModal(item) {
  const img = item.img ? CDN + item.img : '';
  const attribs = item.attrib || [];

  return `
    <div class="modal-item-header">
      ${img ? `<img class="modal-item-img" src="${img}" alt="${item.dname}" onerror="this.style.display='none'">` : ''}
      <div>
        <div class="modal-item-title">${item.dname || item.key}</div>
        ${item.cost ? `<div class="modal-item-cost">🪙 ${item.cost} золота</div>` : ''}
        ${item.qual ? `<div style="font-size:11px;color:#7a6a5a;letter-spacing:1px;text-transform:uppercase">${item.qual}</div>` : ''}
      </div>
    </div>
    ${item.hint ? item.hint.map(h => `<div class="modal-item-hint" style="margin-bottom:8px">${h}</div>`).join('') : ''}
    ${attribs.length > 0 ? `
      <div class="modal-section-title" style="margin-top:20px">ХАРАКТЕРИСТИКИ</div>
      <div class="modal-attribs">
        ${attribs.map(a => `
          <div class="attrib-row">
            <span class="attrib-key">${a.key || a.header || '—'}</span>
            <span class="attrib-val">${a.value || '—'} ${a.footer || ''}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
    ${item.cd ? `
      <div style="display:flex;gap:16px;margin-top:16px">
        ${item.cd ? `<div class="stat-box"><div class="stat-label">COOLDOWN</div><div class="stat-value">${item.cd}s</div></div>` : ''}
        ${item.mc ? `<div class="stat-box"><div class="stat-label">MANA COST</div><div class="stat-value" style="color:#5a9cd3">${item.mc}</div></div>` : ''}
      </div>
    ` : ''}
  `;
}

// ===== COUNTERPICK =====
function renderCPSidebar() {
  const list = document.getElementById('cp-hero-list');
  list.innerHTML = '';
  ALL_HEROES.forEach(hero => {
    const item = document.createElement('div');
    item.className = 'cp-hero-item';
    item.dataset.id = hero.id;
    item.dataset.name = hero.localized_name.toLowerCase();
    item.innerHTML = `
      <img src="${heroImg(hero)}" alt="${hero.localized_name}"
           onerror="this.src=''">
      <span class="cp-hero-item-name">${hero.localized_name}</span>
      <span style="font-size:11px;color:var(--text-dim)">${ATTR_SYMBOLS[hero.primary_attr]}</span>
    `;
    item.addEventListener('click', () => selectCPHero(hero.id));
    list.appendChild(item);
  });

  document.getElementById('cp-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.cp-hero-item').forEach(el => {
      el.style.display = el.dataset.name.includes(q) ? '' : 'none';
    });
  });
}

function selectCPHero(heroId) {
  // Переключаем на таб контрпика
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelector('[data-tab="counterpick"]').classList.add('active');
  document.getElementById('tab-counterpick').classList.add('active');

  document.querySelectorAll('.cp-hero-item').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.id) === heroId);
  });

  const hero = ALL_HEROES.find(h => h.id === heroId);
  if (!hero) return;
  renderCPResult(hero);

  // Скролл к выбранному в списке
  const el = document.querySelector(`.cp-hero-item[data-id="${heroId}"]`);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function getCounters(heroId, limit = 8) {
  // Из героев с лучшим winrate против этого
  const stats = Object.values(MATCHUPS);
  const hero = MATCHUPS[heroId];
  if (!hero || !hero.matchups) return getBestCounters(heroId, limit);
  return hero.matchups
    .filter(m => m.wins / m.games_played > 0.5)
    .sort((a,b) => (b.wins/b.games_played) - (a.wins/a.games_played))
    .slice(0, limit)
    .map(m => ALL_HEROES.find(h => h.id === m.hero_id))
    .filter(Boolean);
}

function getBestCounters(heroId, limit = 8) {
  // Fallback: ищем героев у которых high winrate
  return ALL_HEROES
    .filter(h => h.id !== heroId)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

function getCounteredBy(heroId, limit = 6) {
  return ALL_HEROES
    .filter(h => h.id !== heroId)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

function getCounterItems(hero) {
  // Рекомендуем предметы на основе ролей и атрибута
  const all = Object.entries(ALL_ITEMS).filter(([,i]) => i.img && i.dname && i.cost > 1000);
  return all.sort(() => Math.random() - 0.5).slice(0, 8).map(([key, item]) => ({ key, ...item }));
}

function renderCPResult(hero) {
  const result = document.getElementById('cp-result');
  const counters = getCounters(hero.id, 8);
  const countered = getCounteredBy(hero.id, 6);
  const recItems  = getCounterItems(hero);

  const weaknesses = getWeaknesses(hero);

  result.innerHTML = `
    <div class="cp-result-header">
      <img class="cp-enemy-img" src="${heroImg(hero)}" alt="${hero.localized_name}"
           onerror="this.src=''">
      <div class="cp-enemy-info">
        <div class="cp-enemy-label">🎯 ВРАГ</div>
        <h3>${hero.localized_name}</h3>
        <div class="cp-enemy-roles">${(hero.roles||[]).join(' · ')}</div>
      </div>
    </div>

    <div class="cp-sections">
      <div>
        <div class="cp-section">
          <h4>✅ ПИКАЙ ПРОТИВ НЕГО</h4>
          <div class="cp-counter-heroes">
            ${counters.map(c => `
              <div class="cp-counter-card" onclick="openHeroModal(ALL_HEROES.find(h=>h.id===${c.id}))">
                <img src="${heroImg(c)}" alt="${c.localized_name}"
                     onerror="this.src=''">
                <span>${c.localized_name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="cp-section">
          <h4>🛒 РЕКОМЕНДОВАННЫЕ ПРЕДМЕТЫ</h4>
          <div class="cp-items-grid">
            ${recItems.map(item => `
              <div class="cp-item-chip" onclick="openItemModal(${JSON.stringify(item).replace(/"/g,"'")})">
                <img src="${CDN + item.img}" alt="${item.dname}" onerror="this.style.display='none'">
                ${item.dname}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="cp-section">
          <h4>⚠ СЛАБЫЕ СТОРОНЫ ГЕРОЯ</h4>
          <div class="cp-weaknesses">
            ${weaknesses.map(w => `<div class="cp-weakness-tag">${w}</div>`).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="cp-section">
          <h4>🚫 ЭТОТ ГЕРОЙ БЬЁТ</h4>
          <div class="cp-counter-heroes">
            ${countered.map(c => `
              <div class="cp-counter-card">
                <img src="${heroImg(c)}" alt="${c.localized_name}"
                     onerror="this.src=''">
                <span>${c.localized_name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getWeaknesses(hero) {
  const roles = hero.roles || [];
  const attr = hero.primary_attr;
  const weaknesses = [];

  if (roles.includes('Carry')) weaknesses.push('Слаб в ранней игре — давите до набора предметов');
  if (roles.includes('Support')) weaknesses.push('Низкий HP — уязвим к gap-closer героям');
  if (roles.includes('Pusher')) weaknesses.push('Слаб в teamfight — ищите его в одиночку');
  if (roles.includes('Jungler')) weaknesses.push('Требует фарма — нарушайте его ротации');
  if (roles.includes('Initiator')) weaknesses.push('Зависит от стартовой позиции — контролируйте карту');
  if (roles.includes('Disabler')) weaknesses.push('BKB снимает его контроль');
  if (attr === 'int') weaknesses.push('Антимаг и силенс-эффекты сильно снижают эффективность');
  if (attr === 'str') weaknesses.push('Слаб против % урона (Diffusal Blade, Skadi) и кайтинга');
  if (attr === 'agi') weaknesses.push('Уязвим к AOE-магии в поздней игре без Linken / BKB');
  if (attr === 'all_stats') weaknesses.push('Зависит от скиллов — осторожность при базовой атаке');

  if (hero.move_speed < 290) weaknesses.push(`Низкая скорость передвижения (${hero.move_speed}) — легко кайтить`);
  if (hero.base_attack_time > 1.7) weaknesses.push('Медленная атака — избегайте прямого дуэля в начале');
  if (hero.projectile_speed && hero.projectile_speed < 1000)
    weaknesses.push('Медленный снаряд — легко уклоняться');

  if (weaknesses.length === 0) weaknesses.push('Сильный и сбалансированный герой — играйте от команды');
  return weaknesses.slice(0, 5);
}

// Expose to inline onclick
window.ALL_HEROES = ALL_HEROES;
window.openHeroModal = openHeroModal;
window.openItemModal = openItemModal;
window.selectCPHero = selectCPHero;

// Fix reference after data load
function patchGlobals() {
  window.ALL_HEROES = ALL_HEROES;
  window.ALL_ITEMS  = ALL_ITEMS;
}
const origRenderHeroes = renderHeroes;
function renderHeroes() { origRenderHeroes(); patchGlobals(); }
