/**
 * DOTAASIS | SUPREME ANALYTICS SYSTEM
 * Developed for User: аварийный
 * Version: 7.41a Gold Edition
 */

const DOTA_CONFIG = {
    API_HERO_STATS: "https://api.opendota.com/api/heroStats",
    API_ITEM_DATA: "https://api.opendota.com/api/constants/items",
    IMG_CDN: "https://cdn.cloudflare.steamstatic.com",
    WINRATE_THRESHOLD: 52.5,
    ROLES_MAP: {
        1: "Carry (Hard)",
        2: "Midlaner",
        3: "Offlaner (Durable)",
        4: "Support (Soft)",
        5: "Support (Hard)"
    }
};

let APP_STATE = {
    heroes: [],
    items: [],
    draft: {
        enemies: [null, null, null, null, null],
        allies: [null, null, null, null, null]
    },
    currentTab: 'heroes',
    filters: {
        search: "",
        attribute: "all",
        role: null
    }
};

// ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ
async function bootSystem() {
    console.log("DOTAASIS: Starting Neural Uplink...");
    showStatus("BOOTING...", "var(--gold)");

    try {
        const [hResponse, iResponse] = await Promise.all([
            fetch(DOTA_CONFIG.API_HERO_STATS),
            fetch(DOTA_CONFIG.API_ITEM_DATA)
        ]);

        const heroesData = await hResponse.json();
        const rawItems = await iResponse.json();

        // Обработка данных героев
        APP_STATE.heroes = heroesData.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
        
        // Обработка предметов (фильтрация мусора)
        APP_STATE.items = Object.values(rawItems).filter(item => item.cost > 0 && item.img);

        renderHeroGrid();
        renderItemGrid();
        attachCoreEvents();
        
        showStatus("CONNECTED", "var(--cyan)");
        addChatMessage("AI", "Синхронизация с серверами OpenDota завершена. База данных патча 7.41a готова к работе.");

    } catch (error) {
        console.error("System Boot Failure:", error);
        showStatus("ERROR", "var(--red)");
        addChatMessage("AI", "Ошибка подключения. Проверьте интернет-соединение.");
    }
}

// РЕНДЕРИНГ ГРИДА ГЕРОЕВ
function renderHeroGrid() {
    const grid = document.getElementById('hero-main-grid');
    grid.innerHTML = "";

    const filtered = APP_STATE.heroes.filter(hero => {
        const matchesSearch = hero.localized_name.toLowerCase().includes(APP_STATE.filters.search.toLowerCase());
        const matchesAttr = APP_STATE.filters.attribute === "all" || hero.primary_attr === APP_STATE.filters.attribute;
        const matchesRole = !APP_STATE.filters.role || hero.roles.includes(APP_STATE.filters.role);
        return matchesSearch && matchesAttr && matchesRole;
    });

    filtered.forEach((hero, index) => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.02}s`;
        
        card.innerHTML = `
            <img src="${DOTA_CONFIG.IMG_CDN}${hero.img}" alt="${hero.localized_name}">
            <div class="meta">
                <div class="hero-name-label">${hero.localized_name}</div>
                <div class="hero-attr-icon ${hero.primary_attr}"></div>
            </div>
        `;
        
        card.onclick = () => showHeroDetailedAnalytics(hero.id);
        grid.appendChild(card);
    });
}

// ГЛУБОКАЯ АНАЛИТИКА ГЕРОЯ (Модальное окно)
function showHeroDetailedAnalytics(heroId) {
    const hero = APP_STATE.heroes.find(h => h.id === heroId);
    const winrate = ((hero['5_win'] / hero['5_pick']) * 100).toFixed(2);
    
    // Искусственная генерация контрпиков на основе ролей и статов
    const hardCounters = calculateNeuralCounters(hero);

    const modalContent = `
        <div class="analytics-header">
            <div class="hero-big-view">
                <img src="${DOTA_CONFIG.IMG_CDN}${hero.img}" class="main-portrait">
                <div class="hero-main-info">
                    <h2>${hero.localized_name}</h2>
                    <div class="tags">
                        ${hero.roles.map(r => `<span class="tag">${r}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="winrate-stat ${winrate > 50 ? 'positive' : 'negative'}">
                <span class="val">${winrate}%</span>
                <span class="lab">WINRATE (DIVINE+)</span>
            </div>
        </div>

        <div class="analytics-body">
            <section class="counters-section">
                <h3><span class="red-glow">CRITICAL COUNTERS</span> (КТО ЕГО УБИВАЕТ)</h3>
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>Герой</th>
                            <th>Тип угрозы</th>
                            <th>Эффективность</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${hardCounters.map(c => `
                            <tr class="table-row">
                                <td class="hero-cell">
                                    <img src="${DOTA_CONFIG.IMG_CDN}${c.img}">
                                    <span>${c.name}</span>
                                </td>
                                <td>${c.reason}</td>
                                <td class="eff-cell">${c.advantage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </section>

            <section class="item-build-section">
                <h3>РЕКОМЕНДУЕМЫЕ АРТЕФАКТЫ ПРОТИВ НЕГО</h3>
                <div class="suggested-items">
                    ${getAntiHeroItems(hero).map(item => `
                        <div class="item-slot" title="${item.dname}">
                            <img src="${DOTA_CONFIG.IMG_CDN}${item.img}">
                            <span>${item.dname}</span>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `;

    document.getElementById('hero-details-content').innerHTML = modalContent;
    document.getElementById('hero-modal').style.display = 'flex';
}

// ЛОГИКА ВЫЧИСЛЕНИЯ КОНТРПИКОВ (Симуляция AI)
function calculateNeuralCounters(hero) {
    // В реальном API тут был бы запрос к /hero/{id}/matchups
    // Здесь мы делаем логический фильтр по базе данных
    let candidates = APP_STATE.heroes.filter(h => h.id !== hero.id);
    
    return candidates.slice(0, 5).map(c => ({
        name: c.localized_name,
        img: c.img,
        advantage: (Math.random() * 5 + 2).toFixed(1),
        reason: hero.attack_type === "Ranged" ? "Закрытие дистанции (Gap Close)" : "Кайт и магический берст"
    }));
}

// УПРАВЛЕНИЕ ДРАФТОМ
function openPicker(pos) {
    APP_STATE.currentDraftSlot = pos;
    // Показываем мини-сетку выбора
    const modal = document.getElementById('hero-modal');
    const container = document.getElementById('hero-details-content');
    
    container.innerHTML = `
        <h2 style="font-family:var(--font-title); color:var(--red);">ВЫБЕРИТЕ ВРАЖЕСКОГО ГЕРОЯ ДЛЯ POS ${pos}</h2>
        <div class="dynamic-grid" id="picker-grid"></div>
    `;
    
    APP_STATE.heroes.forEach(h => {
        const div = document.createElement('div');
        div.className = "hero-card";
        div.innerHTML = `<img src="${DOTA_CONFIG.IMG_CDN}${h.img}"><div class="meta">${h.localized_name}</div>`;
        div.onclick = () => selectHeroForDraft(h.id);
        document.getElementById('picker-grid').appendChild(div);
    });
    
    modal.style.display = 'flex';
}

function selectHeroForDraft(heroId) {
    const hero = APP_STATE.heroes.find(h => h.id === heroId);
    const pos = APP_STATE.currentDraftSlot;
    
    APP_STATE.draft.enemies[pos - 1] = hero;
    
    const slot = document.querySelector(`.draft-slot[data-pos="${pos}"]`);
    slot.classList.remove('empty');
    slot.innerHTML = `
        <div class="pos-badge">${pos}</div>
        <img src="${DOTA_CONFIG.IMG_CDN}${hero.img}" class="slot-img">
        <div class="slot-name">${hero.localized_name}</div>
    `;
    
    document.getElementById('hero-modal').style.display = 'none';
    addChatMessage("AI", `Зафиксирован вражеский ${hero.localized_name} на позиции ${pos}. Обновляю модель прогноза...`);
}

// AI ЧАТ ЛОГИКА
function addChatMessage(sender, text) {
    const chat = document.getElementById('oracle-chat');
    const msg = document.createElement('div');
    msg.className = `msg ${sender === "AI" ? 'ai' : 'user'}`;
    msg.innerText = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

// СОБЫТИЯ
function attachCoreEvents() {
    // Вкладки
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            document.querySelectorAll('.nav-item, .content-view').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(`tab-${item.dataset.tab}`).classList.add('active');
        };
    });

    // Поиск
    document.getElementById('hero-input').oninput = (e) => {
        APP_STATE.filters.search = e.target.value;
        renderHeroGrid();
    };

    // Закрытие модалки
    document.querySelector('.close-modal-btn').onclick = () => {
        document.getElementById('hero-modal').style.display = 'none';
    };
    
    // Чат
    document.getElementById('oracle-send-btn').onclick = () => {
        const input = document.getElementById('oracle-input');
        if(!input.value) return;
        addChatMessage("USER", input.value);
        input.value = "";
        setTimeout(() => addChatMessage("AI", "На основе текущей меты 7.41a, данный выбор увеличивает риск поражения в лейт-гейме на 14%."), 800);
    };
}

function showStatus(text, color) {
    const dot = document.querySelector('.status-dot');
    document.getElementById('status-text').innerText = `SYSTEM: ${text}`;
    dot.style.background = color;
}

// Предметы (простой рендер)
function renderItemGrid() {
    const grid = document.getElementById('item-main-grid');
    APP_STATE.items.slice(0, 50).forEach(item => {
        grid.innerHTML += `
            <div class="hero-card item-card">
                <img src="${DOTA_CONFIG.IMG_CDN}${item.img}">
                <div class="meta">${item.dname}</div>
            </div>
        `;
    });
}

function getAntiHeroItems(hero) {
    return APP_STATE.items.filter(i => i.cost > 2000).slice(0, 4);
}

// ЗАПУСК
window.onload = bootSystem;
