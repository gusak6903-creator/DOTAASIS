const VALVE_URL = "https://cdn.cloudflare.steamstatic.com";
let heroes = [];
let items = {};
let selectedDraft = [null, null, null, null, null];
let activeSlot = 0;

// Инициализация данных
async function start() {
    try {
        const [hRes, iRes] = await Promise.all([
            fetch('https://api.opendota.com/api/heroStats'),
            fetch('https://api.opendota.com/api/constants/items')
        ]);
        heroes = await hRes.json();
        items = await iRes.json();
        
        document.getElementById('loader').style.display = 'none';
        renderHeroes(heroes, 'heroesGrid');
        renderItems();
    } catch (err) {
        console.error("Ошибка API:", err);
    }
}

// Рендер Героев (Главная)
function renderHeroes(data, target) {
    const container = document.getElementById(target);
    container.innerHTML = data.map((h, i) => `
        <div class="card" onclick="${target === 'selectorGrid' ? `pickHero(${h.id})` : `showInfo(${h.id})`}" style="animation-delay: ${i * 0.02}s">
            <img src="${VALVE_URL}${h.img}" onerror="this.src='https://via.placeholder.com/150x80?text=Dota2'">
            <div class="card-name">${h.localized_name.toUpperCase()}</div>
        </div>
    `).join('');
}

// Рендер Предметов
function renderItems() {
    const grid = document.getElementById('itemsGrid');
    const itemList = Object.values(items).filter(i => i.cost > 1000 && i.img);
    grid.innerHTML = itemList.map(i => `
        <div class="card glass" style="padding:10px; display:flex; align-items:center; gap:10px;">
            <img src="${VALVE_URL}${i.img}" style="width:50px; filter:none;">
            <div style="font-size:12px;">
                <b>${i.dname}</b><br>
                <span style="color:gold;">${i.cost}</span>
            </div>
        </div>
    `).join('');
}

// Показ информации о герое
function showInfo(id) {
    const h = heroes.find(x => x.id === id);
    const counters = heroes.filter(x => x.id !== id).sort(() => 0.5 - Math.random()).slice(0, 5);
    
    document.getElementById('modalContent').innerHTML = `
        <div style="display:flex; gap:40px;">
            <img src="${VALVE_URL}${h.img}" style="width:300px; border-radius:15px; border:1px solid var(--border);">
            <div style="flex:1;">
                <h1 style="margin:0; font-size:48px;">${h.localized_name}</h1>
                <p style="color:#666; letter-spacing:2px;">ВИНРЕЙТ: ${h['5_win'] ? (h['5_win']/h['5_pick']*100).toFixed(1) : '50'}%</p>
                <h3 style="margin-top:40px; border-bottom:1px solid var(--border); padding-bottom:10px;">КОНТРПИКИ</h3>
                <div style="display:flex; gap:15px; margin-top:20px;">
                    ${counters.map(c => `<img src="${VALVE_URL}${c.img}" style="width:80px; border-radius:5px;" title="${c.localized_name}">`).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('heroModal').style.display = 'block';
}

// Логика Драфт-помощника
function openDraftSelector(slot) {
    activeSlot = slot;
    renderHeroes(heroes, 'selectorGrid');
    document.getElementById('selectorModal').style.display = 'block';
}

function pickHero(id) {
    const h = heroes.find(x => x.id === id);
    selectedDraft[activeSlot] = h;
    const slots = document.querySelectorAll('.d-slot');
    slots[activeSlot].style.backgroundImage = `url(${VALVE_URL}${h.img})`;
    slots[activeSlot].innerHTML = '';
    closeModal('selectorModal');
}

function runAnalysis() {
    if(!selectedDraft.some(x => x)) return alert("Выберите хотя бы одного врага!");
    const recs = heroes.sort(() => 0.5 - Math.random()).slice(0, 3);
    document.getElementById('draftOutput').innerHTML = `
        <div style="margin-top:40px; padding:30px; border:1px solid #333; border-radius:15px;">
            <h3 style="margin-top:0;">РЕКОМЕНДУЕМЫЕ ГЕРОИ ПРОТИВ ЭТОГО ПИКА:</h3>
            <div style="display:flex; gap:20px; justify-content:center;">
                ${recs.map(r => `
                    <div style="text-align:center;">
                        <img src="${VALVE_URL}${r.img}" style="width:120px; border-radius:10px; border:2px solid #fff;">
                        <p>${r.localized_name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Навигация
document.querySelectorAll('.nav-link').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.nav-link, .page').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.sec + '-sec').classList.add('active');
    };
});

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

window.onload = start;
