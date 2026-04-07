/**
 * ============================================================
 * DOTAASIS ULTIMATE UI INTEGRATION CORE
 * Связывает app.js с интерфейсом Liquid Glass
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация движка из app.js
    let engine = null;
    if (typeof DotaasisEngine !== 'undefined') {
        engine = typeof DotaasisEngine === 'function' ? DotaasisEngine() : DotaasisEngine;
    } else if (window.DOTAASIS) {
        engine = window.DOTAASIS;
    }

    if (!engine || !engine.heroes) {
        showToast('Критическая ошибка', 'Аналитическое ядро app.js не загружено.', 'error');
        return;
    }

    // 2. Глобальные словари и стейт
    const RU_MAP = {
        "antimage": "Антимаг", "axe": "Акс", "bane": "Бейн", "bloodseeker": "Бладсикер",
        "crystal_maiden": "Кристал Мейден", "drow_ranger": "Дроу", "earthshaker": "Шейкер",
        "juggernaut": "Джаггернаут", "mirana": "Мирана", "nevermore": "Shadow Fiend",
        "morphling": "Морфлинг", "phantom_lancer": "Фантом Лансер", "puck": "Пак",
        "pudge": "Пудж", "razor": "Рейзор", "sand_king": "Санд Кинг", "storm_spirit": "Шторм Спирит",
        "sven": "Свен", "tiny": "Тини", "vengefulspirit": "Венга", "windrunner": "Windranger",
        "zuus": "Zeus", "kunkka": "Кункка", "lina": "Лина", "lich": "Лич", "lion": "Лион",
        "shadow_shaman": "Шаман", "slardar": "Слардар", "tidehunter": "Тайдхантер",
        "witch_doctor": "Вич Доктор", "riki": "Рики", "enigma": "Энигма", "tinker": "Тинкер",
        "sniper": "Снайпер", "necrolyte": "Necrophos", "warlock": "Варлок", "beastmaster": "Бистмастер",
        "queenofpain": "Квопа", "venomancer": "Веномансер", "faceless_void": "Войд",
        "skeleton_king": "Wraith King", "death_prophet": "Банша", "phantom_assassin": "Фантомка",
        "pugna": "Пугна", "templar_assassin": "Темпларка", "viper": "Вайпер", "luna": "Луна",
        "dragon_knight": "ДК", "dazzle": "Даззл", "rattletrap": "Clockwerk", "leshrac": "Лешрак",
        "furion": "Nature's Prophet", "life_stealer": "Lifestealer", "dark_seer": "Дарк Сир",
        "clinkz": "Клинкз", "omniknight": "Омник", "enchantress": "Энча", "huskar": "Хускар",
        "night_stalker": "Баланар", "broodmother": "Бруда", "bounty_hunter": "БХ", "weaver": "Вивер",
        "jakiro": "Джакиро", "batrider": "Баттрайдер", "chen": "Чен", "spectre": "Спектра",
        "doom_bringer": "Дум", "ancient_apparition": "Аппарат", "ursa": "Урса",
        "spirit_breaker": "Баратрум", "gyrocopter": "Гиро", "alchemist": "Алхимик",
        "invoker": "Инвокер", "silencer": "Сало", "obsidian_destroyer": "Outworld Destroyer",
        "lycan": "Ликан", "brewmaster": "Панда", "shadow_demon": "ШД", "lone_druid": "Друид",
        "chaos_knight": "ЦК", "meepo": "Мипо", "treant": "Трент", "ogre_magi": "Огр",
        "undying": "Андаинг", "rubick": "Рубик", "disruptor": "Дисраптор", "nyx_assassin": "Никс",
        "naga_siren": "Нага", "keeper_of_the_light": "Котл", "wisp": "Io", "visage": "Визаж",
        "slark": "Сларк", "medusa": "Медуза", "troll_warlord": "Тролль", "centaur": "Кентавр",
        "magnataur": "Магнус", "shredder": "Timbersaw", "bristleback": "Бристл", "tusk": "Туск",
        "skywrath_mage": "Скаймаг", "abaddon": "Абаддон", "elder_titan": "Титан",
        "legion_commander": "Легионка", "ember_spirit": "Эмбер", "earth_spirit": "Земляная панда",
        "abyssal_underlord": "Андерлорд", "terrorblade": "Террорблейд", "phoenix": "Феникс",
        "techies": "Течис", "oracle": "Оракул", "winter_wyvern": "Виверна", "arc_warden": "Арк",
        "monkey_king": "МК", "pangolier": "Панго", "dark_willow": "Вилка", "void_spirit": "Войд Спирит",
        "snapfire": "Бабка", "mars": "Марс", "hoodwink": "Белка", "dawnbreaker": "Валлора",
        "marci": "Марси", "primal_beast": "Бист", "muerta": "Муэрта", "kez": "Кез", "ringmaster": "Рингмастер"
    };

    let state = {
        draft: [], // максимум 5 героев
        heroesFilter: 'all',
        heroesRole: null,
        heroesSearch: '',
        itemsFilter: 'all',
        itemsSearch: '',
        draftTableFilter: 'all',
        draftTableSearch: ''
    };

    const ATTR_ICONS = {
        strength: '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1L11 5L15 5L12 8L13 13L8 10L3 13L4 8L1 5L5 5Z" fill="currentColor"/></svg>',
        agility: '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1C11 1 14 4 14 8C14 12 11 15 8 15C5 15 2 12 2 8C2 4 5 1 8 1ZM8 4L10 8L8 12L6 8Z" fill="currentColor"/></svg>',
        intelligence: '<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 10L6 14M10 10L10 14M5 14L11 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        universal: '<svg viewBox="0 0 16 16" width="14" height="14"><polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>'
    };

    // ============================================================
    // ИНИЦИАЛИЗАЦИЯ
    // ============================================================
    init();

    function init() {
        document.getElementById('heroes-count').innerText = Object.keys(engine.heroes).length;
        document.getElementById('items-count').innerText = Object.keys(engine.items).length;
        
        setupTabs();
        setupHeroesTab();
        setupItemsTab();
        setupDraftTab();
        setupModals();
        
        // Запускаем рендер первой вкладки
        renderHeroesGrid();
        renderItemsGrid();
        renderDraftTable();
        
        // Цитата оракула
        setInterval(() => {
            document.getElementById('oracle-text').innerText = engine.getOraclePhrase('neutral');
        }, 15000);

        showToast('Система готова', `Загружено ${Object.keys(engine.heroes).length} героев. Патч 7.41a`, 'success');
    }

    // ============================================================
    // ВКЛАДКИ (TABS)
    // ============================================================
    function setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                
                // Переключение кнопок
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Переключение контента
                document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                document.getElementById(`${target}-tab`).classList.add('active');

                // Ленивая загрузка для таблицы винрейтов (чтобы не спамить API)
                if(target === 'winrate' && !document.querySelector('#winrate-tbody .table-hero-name')) {
                    loadWinrateData();
                }
            });
        });
    }

    // ============================================================
    // ВКЛАДКА: ГЕРОИ
    // ============================================================
    function setupHeroesTab() {
        // Фильтры по атрибутам
        document.querySelectorAll('#heroes-filters .filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#heroes-filters .filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                state.heroesFilter = e.currentTarget.getAttribute('data-filter');
                renderHeroesGrid();
            });
        });

        // Фильтры по ролям
        document.querySelectorAll('#heroes-filters .filter-btn[data-filter-role]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(e.currentTarget.classList.contains('active')) {
                    e.currentTarget.classList.remove('active');
                    state.heroesRole = null;
                } else {
                    document.querySelectorAll('#heroes-filters .filter-btn[data-filter-role]').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    state.heroesRole = e.currentTarget.getAttribute('data-filter-role');
                }
                renderHeroesGrid();
            });
        });

        // Поиск
        document.getElementById('heroes-search-bar').addEventListener('input', (e) => {
            state.heroesSearch = e.target.value.toLowerCase();
            renderHeroesGrid();
        });
    }

    function renderHeroesGrid() {
        const grid = document.getElementById('heroes-grid');
        const empty = document.getElementById('heroes-empty');
        let html = '';
        let count = 0;

        Object.entries(engine.heroes).forEach(([id, hero]) => {
            const ruName = RU_MAP[id] || hero.localName;
            
            // Фильтрация
            if (state.heroesFilter !== 'all' && hero.primaryAttr !== state.heroesFilter) return;
            if (state.heroesRole && !hero.roles.includes(state.heroesRole)) return;
            if (state.heroesSearch && !ruName.toLowerCase().includes(state.heroesSearch) && !id.includes(state.heroesSearch)) return;

            count++;
            const attrClass = `attr-${hero.primaryAttr}`;
            const complexDots = Array(3).fill(0).map((_, i) => `<div class="complexity-dot ${i < hero.complexity ? 'filled' : ''}"></div>`).join('');
            
            html += `
                <div class="hero-card" onclick="openHeroModal('${id}')">
                    <div class="hero-card-img-wrap">
                        <img class="hero-card-img" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}.png" loading="lazy" onerror="this.src='https://via.placeholder.com/256x144?text=?'">
                        <div class="hero-card-attr ${attrClass}">${ATTR_ICONS[hero.primaryAttr]}</div>
                    </div>
                    <div class="hero-card-body">
                        <div class="hero-card-name">${ruName}</div>
                        <div class="hero-card-local">${hero.name}</div>
                        <div class="hero-card-role">${hero.roles[0] || 'Unknown'}</div>
                    </div>
                    <div class="hero-card-complexity">${complexDots}</div>
                </div>
            `;
        });

        grid.innerHTML = html;
        grid.style.display = count > 0 ? 'grid' : 'none';
        empty.style.display = count > 0 ? 'none' : 'flex';
    }

    // ============================================================
    // ВКЛАДКА: ПРЕДМЕТЫ
    // ============================================================
    function setupItemsTab() {
        document.querySelectorAll('#items-filters .filter-btn[data-item-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#items-filters .filter-btn[data-item-filter]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                state.itemsFilter = e.currentTarget.getAttribute('data-item-filter');
                renderItemsGrid();
            });
        });

        document.getElementById('items-search-bar').addEventListener('input', (e) => {
            state.itemsSearch = e.target.value.toLowerCase();
            renderItemsGrid();
        });
    }

    function renderItemsGrid() {
        const grid = document.getElementById('items-grid');
        const empty = document.getElementById('items-empty');
        let html = '';
        let count = 0;

        Object.entries(engine.items).forEach(([id, item]) => {
            // Упрощенная фильтрация предметов для примера
            if (state.itemsSearch && !item.name.toLowerCase().includes(state.itemsSearch)) return;

            count++;
            const cleanId = id.replace('item_', '');
            
            html += `
                <div class="item-card" onclick="openItemModal('${id}')">
                    <div class="item-card-img-wrap">
                        <img class="item-card-img" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${cleanId}.png" loading="lazy">
                    </div>
                    <div style="width: 100%;">
                        <div class="item-card-name">${item.name}</div>
                        <div class="item-card-cost">
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#e8c97a"/><text x="7" y="10" text-anchor="middle" font-size="7" fill="#0a0a1f" font-weight="bold">G</text></svg>
                            ${item.cost}
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
        grid.style.display = count > 0 ? 'grid' : 'none';
        empty.style.display = count > 0 ? 'none' : 'flex';
    }

    // ============================================================
    // ВКЛАДКА: ДРАФТ ЦЕНТР
    // ============================================================
    function setupDraftTab() {
        // Поиск в таблице драфта
        document.getElementById('hero-search').addEventListener('input', (e) => {
            state.draftTableSearch = e.target.value.toLowerCase();
            renderDraftTable();
        });

        // Фильтры в таблице драфта
        document.querySelectorAll('#draft-attr-filters .attr-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#draft-attr-filters .attr-filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                state.draftTableFilter = e.currentTarget.getAttribute('data-draft-filter');
                renderDraftTable();
            });
        });

        // Кнопка анализа
        document.getElementById('analyze-draft-btn').addEventListener('click', runDraftAnalysis);
        
        // Кнопка очистки
        document.getElementById('clear-draft-btn').addEventListener('click', () => {
            state.draft = [];
            updateTeamSlots();
            renderDraftTable();
            document.getElementById('draft-results').style.display = 'none';
            document.getElementById('draft-empty-hint').style.display = 'flex';
        });

        // Делегирование событий для таблицы героев и кнопок удаления
        document.getElementById('all-heroes-tbody').addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            if (tr && !tr.classList.contains('in-draft')) {
                const id = tr.getAttribute('data-id');
                addToDraft(id);
            }
        });

        document.getElementById('team-slots').addEventListener('click', (e) => {
            if (e.target.classList.contains('slot-remove')) {
                const index = parseInt(e.target.getAttribute('data-remove'));
                removeFromDraft(index);
            }
        });
    }

    function renderDraftTable() {
        const tbody = document.getElementById('all-heroes-tbody');
        let html = '';

        Object.entries(engine.heroes).forEach(([id, hero]) => {
            const ruName = RU_MAP[id] || hero.localName;
            
            if (state.draftTableFilter !== 'all' && hero.primaryAttr !== state.draftTableFilter) return;
            if (state.draftTableSearch && !ruName.toLowerCase().includes(state.draftTableSearch) && !id.includes(state.draftTableSearch)) return;

            const isInDraft = state.draft.includes(id);
            const complexDots = Array(3).fill(0).map((_, i) => `<div class="complexity-dot ${i < hero.complexity ? 'filled' : ''}"></div>`).join('');
            
            html += `
                <tr data-id="${id}" class="${isInDraft ? 'in-draft' : ''}" style="cursor: pointer;">
                    <td class="th-img"><img class="table-hero-img" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}.png"></td>
                    <td>
                        <div class="table-hero-cell">
                            <span class="table-hero-name">${ruName}</span>
                        </div>
                    </td>
                    <td class="th-attr attr-${hero.primaryAttr}">${ATTR_ICONS[hero.primaryAttr]}</td>
                    <td class="th-role"><span class="role-tag role-${hero.roles[0]}">${hero.roles[0]}</span></td>
                    <td class="th-complexity"><div class="hero-card-complexity" style="position:static;">${complexDots}</div></td>
                    <td class="th-action">
                        <button class="table-add-btn" ${isInDraft ? 'disabled' : ''}>+ Добавить</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function addToDraft(id) {
        if (state.draft.length >= 5) {
            showToast('Лимит', 'Максимум 5 героев во вражеской команде', 'warn');
            return;
        }
        if (!state.draft.includes(id)) {
            state.draft.push(id);
            updateTeamSlots();
            renderDraftTable();
        }
    }

    function removeFromDraft(index) {
        state.draft.splice(index, 1);
        updateTeamSlots();
        renderDraftTable();
        // Скрываем результаты, если драфт изменился
        document.getElementById('draft-results').style.display = 'none';
        document.getElementById('draft-empty-hint').style.display = 'flex';
    }

    function updateTeamSlots() {
        for (let i = 0; i < 5; i++) {
            const slot = document.getElementById(`slot-${i}`);
            const btnRemove = slot.querySelector('.slot-remove');
            const nameSpan = slot.querySelector('.slot-name');
            const imgWrap = slot.querySelector('.slot-img-wrap');

            if (state.draft[i]) {
                const id = state.draft[i];
                const ruName = RU_MAP[id] || engine.heroes[id].localName;
                slot.classList.remove('empty');
                slot.classList.add('filled');
                imgWrap.innerHTML = `<img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}.png">`;
                nameSpan.innerText = ruName;
                btnRemove.style.display = 'flex';
            } else {
                slot.classList.remove('filled');
                slot.classList.add('empty');
                imgWrap.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.3"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.5"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`;
                nameSpan.innerText = `Слот ${i + 1}`;
                btnRemove.style.display = 'none';
            }
        }
    }

    function runDraftAnalysis() {
        if (state.draft.length === 0) {
            showToast('Ошибка', 'Добавьте хотя бы одного героя в драфт врага.', 'error');
            return;
        }

        const btn = document.getElementById('analyze-draft-btn');
        btn.innerHTML = 'Анализирую...';
        btn.classList.add('analyzing');

        setTimeout(() => {
            const results = engine.analyzeDraft(state.draft);
            renderAnalysisResults(results);
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="currentColor" stroke-width="1.8"/><path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Подобрать контр-пики';
            btn.classList.remove('analyzing');
        }, 600); // Имитация обработки ИИ
    }

    function renderAnalysisResults(res) {
        document.getElementById('draft-empty-hint').style.display = 'none';
        const resultsBox = document.getElementById('draft-results');
        resultsBox.style.display = 'block';

        // 1. Угроза
        const fill = document.getElementById('threat-fill');
        const scoreText = document.getElementById('threat-score');
        const safeThreat = Math.min(res.overallEnemyThreat, 100);
        fill.style.width = `${safeThreat}%`;
        scoreText.innerText = `${safeThreat}`;

        if(safeThreat > 75) scoreText.className = 'threat-score text-red';
        else if(safeThreat > 40) scoreText.className = 'threat-score text-gold';
        else scoreText.className = 'threat-score text-green';

        // 2. Оракул
        document.getElementById('oracle-comment').innerHTML = res.oracleComment.join('<br><br>');

        // 3. Теги ситуаций
        const tagsBox = document.getElementById('situation-tags');
        let tagsHtml = '';
        if(res.threatLevel.magic === 'CRITICAL') tagsHtml += '<span class="situation-tag situation-tag--blue">Обилие магии</span>';
        if(res.threatLevel.physical === 'CRITICAL') tagsHtml += '<span class="situation-tag situation-tag--red">Тяжелый Физ.Урон</span>';
        if(res.threatLevel.control === 'CRITICAL') tagsHtml += '<span class="situation-tag situation-tag--purple">Много контроля</span>';
        tagsBox.innerHTML = tagsHtml;

        // 4. Контрпики (Топ 5)
        const cList = document.getElementById('counterpicks-list');
        cList.innerHTML = res.topRecommendations.slice(0, 5).map((h, i) => `
            <div class="counterpick-item" onclick="openHeroModal('${h.hero}')">
                <div class="counterpick-rank">#${i+1}</div>
                <img class="counterpick-img" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${h.hero}.png">
                <div class="counterpick-info">
                    <div class="counterpick-name">${RU_MAP[h.hero] || h.localName}</div>
                    <div class="counterpick-reason">${h.reasoning}</div>
                </div>
                <div class="counterpick-score score-badge score-badge--high">${h.score}</div>
            </div>
        `).join('');

        // 5. Предметы
        const iList = document.getElementById('recommended-items');
        let iHtml = '';
        res.itemRecommendations.forEach(sit => {
            sit.items.forEach(item => {
                const cleanId = item.key.replace('item_', '');
                iHtml += `
                    <div class="rec-item-chip" onclick="openItemModal('${item.key}')">
                        <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${cleanId}.png">
                        ${item.name}
                    </div>
                `;
            });
        });
        iList.innerHTML = iHtml || '<span class="text-muted">Специфичных предметов не требуется.</span>';
    }

    // ============================================================
    // МОДАЛЬНЫЕ ОКНА
    // ============================================================
    function setupModals() {
        const closeModals = () => {
            document.querySelectorAll('.modal-overlay').forEach(m => {
                m.classList.add('modal-closing');
                setTimeout(() => {
                    m.style.display = 'none';
                    m.classList.remove('modal-closing');
                }, 200);
            });
        };

        document.getElementById('hero-modal-close').addEventListener('click', closeModals);
        document.getElementById('hero-modal-close-footer').addEventListener('click', closeModals);
        document.getElementById('item-modal-close').addEventListener('click', closeModals);
        document.getElementById('item-modal-close-footer').addEventListener('click', closeModals);

        // Клик вне модалки
        document.querySelectorAll('.modal-overlay').forEach(m => {
            m.addEventListener('click', (e) => {
                if(e.target === m) closeModals();
            });
        });
    }

    window.openHeroModal = function(id) {
        const hero = engine.heroes[id];
        if(!hero) return;

        document.getElementById('modal-hero-img').src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}.png`;
        document.getElementById('modal-hero-attr').innerHTML = `<div class="attr-${hero.primaryAttr}">${ATTR_ICONS[hero.primaryAttr]}</div> <span class="text-muted fw-700 fs-11">${hero.primaryAttr.toUpperCase()}</span>`;
        document.getElementById('modal-hero-name').innerText = RU_MAP[id] || hero.localName;
        document.getElementById('modal-hero-localname').innerText = hero.name;
        
        document.getElementById('modal-hero-roles').innerHTML = hero.roles.map(r => `<span class="role-tag role-${r}">${r}</span>`).join('');
        
        document.getElementById('modal-hero-mechanics').innerHTML = hero.mechanics.map(m => `<span class="mechanic-tag">${m.replace('_', ' ')}</span>`).join('');
        
        // Сильные стороны генерируем из типов
        document.getElementById('modal-hero-strengths').innerHTML = hero.types.map(t => `<div class="strength-item">Отличный ${t.replace('_', ' ')}</div>`).join('');

        // Контрпики (из базы COUNTERPICKS)
        const counters = engine.counterpicks[id];
        if (counters && counters.counters) {
            document.getElementById('modal-hero-counters').innerHTML = counters.counters.slice(0, 4).map(c => `
                <div class="counter-card" onclick="openHeroModal('${c.hero}')">
                    <img class="counter-card-img" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${c.hero}.png">
                    <div class="counter-card-info">
                        <div class="counter-card-name">${RU_MAP[c.hero] || c.hero}</div>
                        <div class="counter-card-reason">${c.reason.substring(0, 30)}...</div>
                    </div>
                </div>
            `).join('');
        } else {
            document.getElementById('modal-hero-counters').innerHTML = '<span class="text-muted">Нет данных</span>';
        }

        // Кнопка добавить в драфт
        const addBtn = document.getElementById('modal-add-to-draft-btn');
        addBtn.onclick = () => {
            addToDraft(id);
            document.getElementById('hero-modal').style.display = 'none';
            document.getElementById('draft-tab').click(); // Переход на вкладку драфта
            showToast('Добавлено', `${RU_MAP[id] || hero.localName} добавлен в драфт`, 'success');
        };

        document.getElementById('hero-modal').style.display = 'flex';
    };

    window.openItemModal = function(id) {
        const item = engine.items[id];
        if(!item) return;

        const cleanId = id.replace('item_', '');
        document.getElementById('modal-item-img').src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${cleanId}.png`;
        document.getElementById('modal-item-name').innerText = item.name;
        document.getElementById('modal-item-cost-val').innerText = item.cost;
        
        document.getElementById('modal-item-tags').innerHTML = `<span class="tier--situational situation-tag">${item.category}</span>`;
        document.getElementById('modal-item-desc').innerText = item.reason || 'Базовый предмет или компонент.';
        
        // Ситуации (имитация)
        document.getElementById('modal-item-situations').innerHTML = item.situation ? `<span class="situation-tag situation-tag--blue">${item.situation.replace(/_/g, ' ')}</span>` : '<span class="text-muted">Универсальный</span>';

        document.getElementById('item-modal').style.display = 'flex';
    };

    // ============================================================
    // УТИЛИТЫ (TOASTS)
    // ============================================================
    function showToast(title, msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        let icon = '';
        if(type === 'success') icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#00ff9d" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        else if(type === 'error') icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="#ff2d55" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        else if(type === 'warn') icon = '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#e8c97a" stroke-width="1.5" fill="none"/><path d="M8 4v5M8 12v.01" stroke="#e8c97a" stroke-width="2" stroke-linecap="round"/></svg>';
        else icon = '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#00d4ff" stroke-width="1.5" fill="none"/><path d="M8 7v5M8 4v.01" stroke="#00d4ff" stroke-width="2" stroke-linecap="round"/></svg>';

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-msg">${msg}</div>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast--exit');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
