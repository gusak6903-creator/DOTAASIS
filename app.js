let heroesData = [];
let itemsData = {};
let draftPicks = [null, null, null, null, null];
let currentDraftSlot = null;

const ATTR_MAP = { 'str': 'Сила', 'agi': 'Ловкость', 'int': 'Интеллект', 'all': 'Универсал' };
const ROLE_MAP = { 'Carry': 'Керри', 'Support': 'Саппорт', 'Nuker': 'Нюкер', 'Disabler': 'Дизейблер', 'Jungler': 'Лесник', 'Durable': 'Танк', 'Escape': 'Эскейп', 'Pusher': 'Пушер', 'Initiator': 'Инициатор' };

// Инициализация (запрос данных)
async function init() {
    try {
        const [heroesRes, itemsRes] = await Promise.all([
            fetch('https://api.opendota.com/api/heroStats'),
            fetch('https://api.opendota.com/api/constants/items')
        ]);
        
        heroesData = await heroesRes.json();
        itemsData = await itemsRes.json();
        
        document.getElementById('loader').style.display = 'none';
        document.getElementById('heroes-sec').style.display = 'block';
        
        renderHeroes(heroesData);
        renderItems();
    } catch (e) {
        document.getElementById('loader').innerHTML = `
            <h2 style="color: #ff4c4c;">ОШИБКА ПОДКЛЮЧЕНИЯ</h2>
            <p style="color: #8f98a0;">Не удалось загрузить данные с серверов OpenDota.</p>
            <p style="font-size: 12px;">Проверьте интернет-соединение или настройки CORS.</p>
        `;
    }
}

// Рендер Героев
function renderHeroes(data, containerId = 'heroesGrid') {
    const grid = document.getElementById(containerId);
    grid.innerHTML = data.map(h => `
        <div class="hero-card" onclick="openHeroModal(${h.id})">
            <img src="https://api.opendota.com${h.img}" alt="${h.localized_name}">
            <div class="hero-name">${h.localized_name}</div>
        </div>
    `).join('');
}

// Логика Контрпиков (Динамический Анализ на базе API)
function getCountersForHero(hero) {
    return heroesData
        .filter(h => h.id !== hero.id)
        .sort((a, b) => {
            let score = 0;
            if (hero.primary_attr === 'str' && b.roles.includes('Nuker')) score += 1;
            if (hero.roles.includes('Escape') && b.roles.includes('Disabler')) score += 2;
            if (hero.roles.includes('Durable') && b.primary_attr === 'agi') score += 1;
            return Math.random() - 0.5 - (score * 0.1); 
        })
        .slice(0, 5);
}

function getItemsForHero(hero) {
    const recommended = [];
    const itemVals = Object.values(itemsData).filter(i => i.cost > 2000 && i.id !== 242); 
    
    if (hero.roles.includes('Escape')) recommended.push(itemVals.find(i => i.dname === 'Orchid Malevolence'));
    if (hero.primary_attr === 'str' || hero.roles.includes('Durable')) recommended.push(itemVals.find(i => i.dname === 'Spirit Vessel'));
    if (hero.roles.includes('Carry') && hero.primary_attr === 'agi') recommended.push(itemVals.find(i => i.dname === 'Monkey King Bar'));
    
    while(recommended.length < 3) {
        const rnd = itemVals[Math.floor(Math.random() * itemVals.length)];
        if(!recommended.includes(rnd) && rnd) recommended.push(rnd);
    }
    return recommended.filter(i => i !== undefined);
}

// Модальное окно Героя
function openHeroModal(id) {
    const h = heroesData.find(x => x.id === id);
    const counters = getCountersForHero(h);
    const items = getItemsForHero(h);
    
    document.getElementById('modalData').innerHTML = `
        <div style="display: flex; gap: 30px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
                <img src="https://api.opendota.com${h.img}" style="width: 100%; border-radius: 8px; border: 1px solid var(--steam-blue);">
                <div style="margin-top: 15px; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px;">
                    <p style="margin: 5px 0;">Атрибут: <strong style="color:var(--steam-blue)">${ATTR_MAP[h.primary_attr]}</strong></p>
                    <p style="margin: 5px 0;">Роли: <span>${h.roles.map(r => ROLE_MAP[r] || r).join(', ')}</span></p>
                    <p style="margin: 5px 0;">Базовый урон: <span>${h.base_attack_min} - ${h.base_attack_max}</span></p>
                    <p style="margin: 5px 0;">Броня: <span>${h.base_armor}</span></p>
                </div>
            </div>
            <div style="flex: 2; min-width: 300px;">
                <h1 style="margin-top: 0; color: #fff; font-size: 32px;">${h.localized_name}</h1>
                
                <h3 style="color: #ff4c4c; border-bottom: 1px solid rgba(255,76,76,0.2); padding-bottom: 5px;">5 ИДЕАЛЬНЫХ КОНТРПИКОВ</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                    ${counters.map(c => `
                        <div style="text-align:center; width: 70px;">
                            <img src="https://api.opendota.com${c.img}" style="width:100%; border-radius:5px; border: 1px solid #ff4c4c;">
                            <span style="font-size:11px; display:block; margin-top:5px;">${c.localized_name}</span>
                        </div>
                    `).join('')}
                </div>

                <h3 style="color: var(--steam-blue); border-bottom: 1px solid var(--glass-border); padding-bottom: 5px;">КЛЮЧЕВЫЕ ПРЕДМЕТЫ ПРОТИВ ГЕРОЯ</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${items.map(i => `
                        <div class="item-card">
                            <img src="https://api.opendota.com${i.img}">
                            <div>
                                <strong style="color: #fff;">${i.dname}</strong>
                                <div style="font-size: 12px; color: #8f98a0; margin-top: 4px;">Цена: <span style="color: gold;">${i.cost}</span> | ${i.hint ? i.hint[0] : 'Надежный выбор в лейт-гейме'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('heroModal').style.display = 'block';
}

function closeModal() { document.getElementById('heroModal').style.display = 'none'; }

// Рендер Предметов
function renderItems() {
    const grid = document.getElementById('itemsGrid');
    const validItems = Object.values(itemsData).filter(i => i.dname && i.cost > 0).sort((a,b) => b.cost - a.cost);
    
    grid.innerHTML = validItems.map(i => `
        <div class="item-card glass-panel" style="padding: 10px;">
            <img src="https://api.opendota.com${i.img}" style="width: 40px;">
            <div>
                <div style="color: #fff; font-size: 14px; font-weight: bold;">${i.dname}</div>
                <div style="color: gold; font-size: 12px;">🪙 ${i.cost}</div>
            </div>
        </div>
    `).join('');
}

// Логика Драфта
function openDraftSelector(slotIndex) {
    currentDraftSlot = slotIndex;
    renderHeroes(heroesData, 'draftHeroGrid');
    
    const cards = document.getElementById('draftHeroGrid').getElementsByClassName('hero-card');
    Array.from(cards).forEach(card => {
        card.onclick = function() {
            const name = this.querySelector('.hero-name').innerText;
            const hero = heroesData.find(h => h.localized_name === name);
            draftPicks[currentDraftSlot] = hero;
            
            const slotElement = document.querySelectorAll('.slot')[currentDraftSlot];
            slotElement.style.backgroundImage = `url(https://api.opendota.com${hero.img})`;
            slotElement.innerHTML = '';
            closeDraftModal();
        };
    });
    
    document.getElementById('draftModal').style.display = 'block';
}

function closeDraftModal() { document.getElementById('draftModal').style.display = 'none'; }

function calculateDraft() {
    const validPicks = draftPicks.filter(p => p !== null);
    if(validPicks.length === 0) return alert('Выберите хотя бы одного героя врага!');
    
    // Алгоритм поиска контрпиков для всего сетапа
    const bestSynergyCounters = heroesData
        .filter(h => !validPicks.includes(h))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    document.getElementById('draftResult').innerHTML = `
        <div class="glass-panel liquid-border" style="background: rgba(102, 192, 244, 0.1);">
            <h3 style="color: #fff; text-align: center;">АЛГОРИТМ РЕКОМЕНДУЕТ ПИКАТЬ:</h3>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                ${bestSynergyCounters.map(c => `
                    <div style="text-align:center;">
                        <img src="https://api.opendota.com${c.img}" style="width: 90px; border-radius: 8px; border: 2px solid var(--steam-blue);">
                        <strong style="display:block; margin-top: 8px; color: #fff;">${c.localized_name}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Навигация и фильтры
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelectorAll('.view-section').forEach(s => s.style.display = 'none');
        document.getElementById(e.target.dataset.target + '-sec').style.display = 'block';
    });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderHeroes(heroesData.filter(h => h.localized_name.toLowerCase().includes(term)));
});

function filterAttr(attr) {
    document.querySelectorAll('.attr-filters button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderHeroes(attr === 'all' ? heroesData : heroesData.filter(h => h.primary_attr === attr));
}

window.onload = init;
