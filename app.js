// Используем официальный сверхбыстрый CDN Valve для картинок
const IMG_CDN = 'https://cdn.cloudflare.steamstatic.com';

let heroesData = [];
let itemsData = {};
let draftPicks = [null, null, null, null, null];
let currentDraftSlot = null;

const ATTR_MAP = { 'str': 'Сила', 'agi': 'Ловкость', 'int': 'Интеллект', 'all': 'Универсал' };
const ROLE_MAP = { 'Carry': 'Керри', 'Support': 'Саппорт', 'Nuker': 'Нюкер', 'Disabler': 'Дизейблер', 'Jungler': 'Лесник', 'Durable': 'Танк', 'Escape': 'Эскейп', 'Pusher': 'Пушер', 'Initiator': 'Инициатор' };

// Инициализация
async function init() {
    try {
        const [heroesRes, itemsRes] = await Promise.all([
            fetch('https://api.opendota.com/api/heroStats'),
            fetch('https://api.opendota.com/api/constants/items')
        ]);
        
        heroesData = await heroesRes.json();
        itemsData = await itemsRes.json();
        
        document.getElementById('loader').style.display = 'none';
        
        // Показываем первую секцию
        switchSection('heroes');
        
        renderHeroes(heroesData, 'heroesGrid');
        renderItems();
    } catch (e) {
        console.error(e);
        document.getElementById('loader').innerHTML = `
            <h2 style="color: #ff4c4c;">СБОЙ СИНХРОНИЗАЦИИ</h2>
            <p style="color: #a0a0a0;">Не удалось получить данные от Valve.</p>
        `;
    }
}

// Навигация по вкладкам
function switchSection(targetId) {
    document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
    document.getElementById(targetId + '-sec').style.display = 'block';
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        switchSection(e.target.dataset.target);
    });
});

// Рендер Героев
function renderHeroes(data, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    grid.innerHTML = data.map((h, index) => `
        <div class="hero-card" onclick="${containerId === 'draftHeroGrid' ? `selectDraftHero(${h.id})` : `openHeroModal(${h.id})`}" style="animation-delay: ${index * 0.01}s">
            <img src="${IMG_CDN}${h.img}" alt="${h.localized_name}" onerror="this.src='https://via.placeholder.com/256x144?text=No+Image'">
            <div class="hero-name">${h.localized_name}</div>
        </div>
    `).join('');
}

// Контрпики
function getCountersForHero(hero) {
    return heroesData
        .filter(h => h.id !== hero.id)
        .sort(() => Math.random() - 0.5) // Заглушка случайности для демо
        .slice(0, 5);
}

// Предметы для модалки
function getItemsForHero(hero) {
    const itemVals = Object.values(itemsData).filter(i => i && i.cost > 2000 && i.img); 
    const recommended = [];
    while(recommended.length < 3 && itemVals.length > 0) {
        const rnd = itemVals[Math.floor(Math.random() * itemVals.length)];
        if(!recommended.includes(rnd)) recommended.push(rnd);
    }
    return recommended;
}

// Открытие модалки героя
function openHeroModal(id) {
    const h = heroesData.find(x => x.id === id);
    if(!h) return;
    const counters = getCountersForHero(h);
    const items = getItemsForHero(h);
    
    document.getElementById('modalData').innerHTML = `
        <div style="display: flex; gap: 30px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
                <img src="${IMG_CDN}${h.img}" style="width: 100%; border-radius: 8px; border: 1px solid var(--glass-border);">
                <div style="margin-top: 15px; background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--glass-border);">
                    <p style="margin: 5px 0; color: #fff;">Атрибут: <span style="color:var(--gray-mid)">${ATTR_MAP[h.primary_attr]}</span></p>
                    <p style="margin: 5px 0; color: #fff;">Роли: <span style="color:var(--gray-mid)">${h.roles.map(r => ROLE_MAP[r] || r).join(', ')}</span></p>
                    <p style="margin: 5px 0; color: #fff;">Урон: <span style="color:var(--gray-mid)">${h.base_attack_min} - ${h.base_attack_max}</span></p>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px;">
                <h1 style="margin-top: 0; color: #fff; font-size: 32px; letter-spacing: 1px;">${h.localized_name}</h1>
                
                <h3 style="color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; font-weight: 400;">ИДЕАЛЬНЫЕ КОНТРПИКИ</h3>
                <div style="display: flex; gap: 12px; margin-bottom: 30px;">
                    ${counters.map(c => `
                        <div style="text-align:center; width: 75px; cursor:pointer;" onclick="openHeroModal(${c.id})">
                            <img src="${IMG_CDN}${c.img}" style="width:100%; border-radius:6px; border: 1px solid var(--gray-mid); transition: 0.2s;">
                            <span style="font-size:11px; display:block; margin-top:5px; color:#fff;">${c.localized_name}</span>
                        </div>
                    `).join('')}
                </div>

                <h3 style="color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; font-weight: 400;">АРСЕНАЛ ПРОТИВ ГЕРОЯ</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${items.map(i => `
                        <div class="item-card" style="background: rgba(0,0,0,0.6);">
                            <img src="${IMG_CDN}${i.img}">
                            <div>
                                <strong style="color: #fff;">${i.dname || i.name}</strong>
                                <div style="font-size: 12px; color: var(--gray-mid); margin-top: 4px;">Цена: <span style="color: #fff;">${i.cost}</span></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('heroModal').style.display = 'block';
}

function closeModal(modalId) { 
    document.getElementById(modalId).style.display = 'none'; 
}

// Рендер Предметов
function renderItems() {
    const grid = document.getElementById('itemsGrid');
    const validItems = Object.values(itemsData).filter(i => i && i.dname && i.cost > 0 && i.img).sort((a,b) => b.cost - a.cost);
    
    grid.innerHTML = validItems.map((i, index) => `
        <div class="item-card" style="animation-delay: ${index * 0.005}s">
            <img src="${IMG_CDN}${i.img}">
            <div>
                <div style="color: #fff; font-size: 14px; font-weight: 600;">${i.dname}</div>
                <div style="color: var(--gray-mid); font-size: 12px; margin-top:3px;">🪙 ${i.cost}</div>
            </div>
        </div>
    `).join('');
}

// Драфт
function openDraftSelector(slotIndex) {
    currentDraftSlot = slotIndex;
    renderHeroes(heroesData, 'draftHeroGrid');
    document.getElementById('draftModal').style.display = 'block';
}

function selectDraftHero(heroId) {
    const hero = heroesData.find(h => h.id === heroId);
    draftPicks[currentDraftSlot] = hero;
    
    const slotElement = document.querySelectorAll('.slot')[currentDraftSlot];
    slotElement.style.backgroundImage = `url(${IMG_CDN}${hero.img})`;
    slotElement.innerHTML = '';
    slotElement.style.border = '1px solid var(--glass-border)';
    
    closeModal('draftModal');
}

function calculateDraft() {
    const validPicks = draftPicks.filter(p => p !== null);
    if(validPicks.length === 0) return alert('Выберите хотя бы одного героя врага!');
    
    const bestSynergyCounters = heroesData
        .filter(h => !validPicks.includes(h))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    document.getElementById('draftResult').innerHTML = `
        <div class="glass-panel liquid-border fade-in" style="background: rgba(255, 255, 255, 0.03);">
            <h3 style="color: #fff; text-align: center; letter-spacing: 1px;">ОПТИМАЛЬНЫЙ ВЫБОР ДЛЯ ПИКА:</h3>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                ${bestSynergyCounters.map(c => `
                    <div style="text-align:center; cursor: pointer;" onclick="openHeroModal(${c.id})">
                        <img src="${IMG_CDN}${c.img}" style="width: 100px; border-radius: 8px; border: 1px solid var(--glass-border); transition: 0.3s;" onmouseover="this.style.borderColor='#fff'" onmouseout="this.style.borderColor='var(--glass-border)'">
                        <strong style="display:block; margin-top: 10px; color: #fff; font-weight: 400;">${c.localized_name}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Поиск и Фильтры
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderHeroes(heroesData.filter(h => h.localized_name.toLowerCase().includes(term)), 'heroesGrid');
});

function filterAttr(attr) {
    document.querySelectorAll('.attr-filters button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderHeroes(attr === 'all' ? heroesData : heroesData.filter(h => h.primary_attr === attr), 'heroesGrid');
}

window.onload = init;
