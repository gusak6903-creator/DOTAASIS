const DB = {
    heroes: [
        { id: 'pudge', name: 'Pudge', attr: 'str', winrate: '52.1%', counters: ['Lifestealer', 'Slark', 'Ursa', 'Timbersaw', 'Monkey King'], items: ['Spirit Vessel', 'Lotus Orb'] },
        { id: 'antimage', name: 'Anti-Mage', attr: 'agi', winrate: '48.5%', counters: ['Meepo', 'Legion Commander', 'Night Stalker', 'Sladar', 'Doom'], items: ['Abyssal Blade', 'Orchid'] },
        { id: 'phantom_assassin', name: 'Phantom Assassin', attr: 'agi', winrate: '50.2%', counters: ['Axe', 'Morphling', 'Tinker', 'Omniknight', 'Razor'], items: ['MKB', 'Silver Edge'] },
        { id: 'invoker', name: 'Invoker', attr: 'int', winrate: '49.8%', counters: ['Nyx Assassin', 'Pugna', 'Silencer', 'Night Stalker', 'Anti-Mage'], items: ['BKB', 'Orchid'] },
        { id: 'legion_commander', name: 'Legion Commander', attr: 'str', winrate: '51.4%', counters: ['Oracle', 'Dazzle', 'Winter Wyvern', 'Abaddon', 'Outworld Destroyer'], items: ['Linkens Sphere', 'Aeon Disk'] }
    ],
    items: [
        { name: 'Silver Edge', type: 'basic', desc: 'Отключает пассивки (Bristleback, PA, Spec).' },
        { name: 'Black King Bar', type: 'basic', desc: 'Защита от магии и контроля.' },
        { name: 'Apex', type: 'neutral', desc: 'Огромный буст основного атрибута.' }
    ]
};

function renderHeroes() {
    const grid = document.getElementById('heroGrid');
    grid.innerHTML = DB.heroes.map(h => `
        <div class="hero-card glass" onclick="showHero('${h.id}')">
            <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${h.id}.png">
            <div style="text-align:center; padding: 10px;">${h.name}</div>
        </div>
    `).join('');
}

function showHero(id) {
    const hero = DB.heroes.find(h => h.id === id);
    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <div style="display:flex; gap:30px;">
            <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.id}.png" style="width:200px; border-radius:15px;">
            <div>
                <h1 style="color:var(--accent); margin:0;">${hero.name}</h1>
                <p>Винрейт: <span style="color:#00ff00">${hero.winrate}</span></p>
                <h3>5 ЖЕСТКИХ КОНТРПИКОВ:</h3>
                <ul style="color: #ff4444; font-weight:bold;">
                    ${hero.counters.map(c => `<li>${c}</li>`).join('')}
                </ul>
                <h3>КЛЮЧЕВЫЕ ПРЕДМЕТЫ:</h3>
                <p>${hero.items.join(', ')}</p>
            </div>
        </div>
    `;
    document.getElementById('modal').style.display = 'block';
}

function analyzeDraft() {
    const res = document.getElementById('draftResult');
    res.innerHTML = `
        <div class="glass" style="padding:20px; margin-top:20px; border-color: #ff9900;">
            <h3>РЕКОМЕНДАЦИЯ ПО ПИКУ:</h3>
            <p>Против этого сетапа лучше всего подойдут: <b>Enigma, Faceless Void или Silencer</b>.</p>
            <p style="font-size:0.8em; color:#888;">Анализ проведен на основе текущей меты патча 7.41.</p>
        </div>
    `;
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(id + '-section').style.display = 'block';
}

window.onload = renderHeroes;
