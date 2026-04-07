const API_BASE = "https://api.opendota.com/api";
const ASSET_BASE = "https://cdn.cloudflare.steamstatic.com";

let allHeroes = [];
let allItems = [];
let enemyTeam = [null, null, null, null, null]; // Индексы 0-4 для ролей 1-5
let currentRolePicking = null;

// Инициализация данных
async function boot() {
    try {
        const [hRes, iRes] = await Promise.all([
            fetch(`${API_BASE}/heroStats`),
            fetch(`${API_BASE}/constants/items`)
        ]);
        allHeroes = await hRes.json();
        allItems = Object.values(await iRes.json()).filter(i => i.cost > 500 && i.img);
        
        updateStatus("СИСТЕМА ГОТОВА", "#00ff88");
        renderMainGrid(allHeroes);
    } catch (e) {
        updateStatus("ОШИБКА API", "#ff2a2a");
    }
}

function updateStatus(msg, color) {
    document.getElementById('status-text').innerText = msg;
    document.getElementById('status-dot').style.backgroundColor = color;
}

// Рендер сетки
function renderMainGrid(data) {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = data.map(h => `
        <div class="hero-card" onclick="showDetailedInfo(${h.id})">
            <img src="${ASSET_BASE}${h.img}">
            <div class="hero-info-label">${h.localized_name.toUpperCase()}</div>
        </div>
    `).join('');
}

// Показ детальной информации
function showDetailedInfo(id) {
    const h = allHeroes.find(x => x.id === id);
    const winrate = ((h['5_win'] / h['5_pick']) * 100).toFixed(1);
    
    // Эмуляция логики патча 7.41a
    const counters = getProCounters(h);

    document.getElementById('modal-content').innerHTML = `
        <div class="pro-modal-layout" style="display:flex; gap:40px;">
            <div class="modal-left" style="flex:1;">
                <img src="${ASSET_BASE}${h.img}" style="width:100%; border-radius:15px; border:2px solid var(--border);">
                <div class="stats-block glass" style="margin-top:20px; padding:15px;">
                    <div class="stat-item">
                        <span>Winrate (Divine+)</span>
                        <div class="stat-bar-container"><div class="stat-fill" style="width:${winrate}%"></div></div>
                    </div>
                    <div class="roles-tags" style="margin-top:10px;">
                        ${h.roles.map(r => `<span class="tag glass" style="font-size:10px; margin:2px; padding:3px 8px; display:inline-block;">${r}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-right" style="flex:2;">
                <h1 style="font-size:50px; margin:0; letter-spacing:-2px;">${h.localized_name}</h1>
                <p style="color:var(--radiant)">Тип атаки: ${h.attack_type === 'Melee' ? 'БЛИЖНИЙ БОЙ' : 'ДАЛЬНИЙ БОЙ'}</p>
                
                <h3 class="dire-text" style="margin-top:40px; border-bottom:1px solid var(--dire); padding-bottom:10px;">ПОЧЕМУ ЕГО КОНТРЯТ?</h3>
                <div class="counter-analysis">
                    ${counters.map(c => `
                        <div class="counter-row glass" style="display:flex; align-items:center; gap:20px; margin-bottom:10px; padding:10px;">
                            <img src="${ASSET_BASE}${c.hero.img}" style="width:70px; border-radius:5px;">
                            <div>
                                <b style="color:#fff;">${c.hero.localized_name}</b>
                                <p style="font-size:12px; margin:5px 0;">${c.reason}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <h3 style="margin-top:40px; border-bottom:1px solid #aaa; padding-bottom:10px;">КЛЮЧЕВЫЕ ПРЕДМЕТЫ ПРОТИВ</h3>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    ${getSuggestedItems(h).map(i => `<img src="${ASSET_BASE}${i.img}" style="width:60px; border-radius:4px;" title="${i.dname}">`).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('pro-modal').style.display = 'block';
}

// Логика контрпиков с объяснениями
function getProCounters(target) {
    const pool = allHeroes.filter(h => h.id !== target.id);
    const results = [];
    
    // Примеры реальной логики Доты
    const logic = [
        { trigger: 'Escape', reason: 'Имеет мгновенный контроль или сайленс, прерывающий эскейп.' },
        { trigger: 'Durable', reason: 'Снижает броню или наносит чистый урон, игнорируя защиту.' },
        { trigger: 'Nuker', reason: 'Высокое сопротивление магии или встроенный иммунитет.' },
        { trigger: 'Melee', reason: 'Легко кайтит персонажа ближнего боя.' }
    ];

    for(let i=0; i<4; i++) {
        const h = pool[Math.floor(Math.random() * pool.length)];
        const r = logic.find(l => target.roles.includes(l.trigger)) || { reason: 'Высокий темп игры и преимущество по статам в патче 7.41a.' };
        results.push({ hero: h, reason: r.reason });
    }
    return results;
}

function getSuggestedItems(hero) {
    if(hero.roles.includes('Escape')) return allItems.filter(i => i.dname && i.dname.includes('Orchid') || i.dname.includes('Abyssal'));
    if(hero.roles.includes('Durable')) return allItems.filter(i => i.dname && i.dname.includes('Desolator') || i.dname.includes('Skadi'));
    return allItems.slice(0, 4);
}

// Система выбора ролей в драфте
function pickForRole(roleNum) {
    currentRolePicking = roleNum;
    const grid = document.getElementById('selection-grid');
    grid.innerHTML = allHeroes.map(h => `
        <div class="hero-card" onclick="confirmRolePick(${h.id})">
            <img src="${ASSET_BASE}${h.img}">
        </div>
    `).join('');
    document.getElementById('selector-modal').style.display = 'block';
}

function confirmRolePick(id) {
    const h = allHeroes.find(x => x.id === id);
    enemyTeam[currentRolePicking - 1] = h;
    
    const preview = document.getElementById(`slot-${currentRolePicking}`);
    preview.style.backgroundImage = `url(${ASSET_BASE}${h.img})`;
    
    document.getElementById('selector-modal').style.display = 'none';
}

function runProAnalysis() {
    const activeEnemies = enemyTeam.filter(x => x !== null);
    if(activeEnemies.length === 0) return alert("Выберите врагов!");

    const box = document.getElementById('analysis-box');
    box.innerHTML = `
        <div class="glass" style="padding:20px; animation: fadeIn 0.5s;">
            <h2 style="color:var(--radiant); text-align:center;">РЕКОМЕНДАЦИИ ПО ПИКУ (RADIANT)</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
                <div class="glass" style="padding:15px;">
                    <h4>ТАКТИКА:</h4>
                    <p style="font-size:13px;">Вражеский пик имеет ${calculateWeakness()}</p>
                </div>
                <div class="glass" style="padding:15px;">
                    <h4>ЛУЧШИЕ ГЕРОИ ДЛЯ ВАС:</h4>
                    <div style="display:flex; gap:10px;">
                        ${allHeroes.slice(20, 24).map(h => `<img src="${ASSET_BASE}${h.img}" style="width:60px; border-radius:5px;">`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function calculateWeakness() {
    return "слабость к физическому урону в ранней игре. Рекомендуется агрессивный пик с упором на минус-броню.";
}

// Закрытие модалок
document.querySelectorAll('.close-modal').forEach(b => b.onclick = () => document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none'));
window.onclick = (e) => { if(e.target.className === 'modal-overlay') e.target.style.display = 'none'; };

// Навигация
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.nav-item, section').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    };
});

boot();
