document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ТАБЫ ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });

    // --- 2. РАБОТА С API OPENDOTA ---
    const OPENDOTA_URL = 'https://api.opendota.com';
    let globalHeroes = [];
    let globalItems = [];

    // Элементы DOM
    const heroesGrid = document.getElementById('heroes-grid');
    const itemsGrid = document.getElementById('items-grid');
    const heroDetailsView = document.getElementById('hero-details-view');
    const heroSearch = document.getElementById('hero-search');
    const heroAttrFilter = document.getElementById('hero-attr-filter');
    const btnBack = document.getElementById('back-to-heroes');

    // Инициализация загрузки данных
    async function initData() {
        try {
            // Грузим героев
            const heroRes = await fetch(`${OPENDOTA_URL}/api/heroStats`);
            globalHeroes = await heroRes.json();
            renderHeroes(globalHeroes);

            // Грузим предметы
            const itemRes = await fetch(`${OPENDOTA_URL}/api/constants/items`);
            const itemsData = await itemRes.json();
            // Превращаем объект предметов в массив и фильтруем рецепты
            globalItems = Object.values(itemsData).filter(item => item.id && item.dname);
            renderItems(globalItems);
        } catch (e) {
            console.error("Ошибка загрузки данных:", e);
            heroesGrid.innerHTML = `<div class="text-green">Ошибка подключения к API Steam/OpenDota.</div>`;
        }
    }

    // Рендер Героев
    function renderHeroes(heroes) {
        heroesGrid.innerHTML = '';
        heroes.forEach(hero => {
            const card = document.createElement('div');
            card.className = 'hero-card';
            card.innerHTML = `
                <img src="${OPENDOTA_URL}${hero.img}" loading="lazy" alt="${hero.localized_name}">
                <span>${hero.localized_name}</span>
            `;
            // При клике открываем детальный анализ контр-пиков
            card.addEventListener('click', () => openHeroDetails(hero));
            heroesGrid.appendChild(card);
        });
    }

    // Рендер Предметов
    function renderItems(items) {
        itemsGrid.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            // Используем steam cdn для предметов
            const imgSrc = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${item.name.replace('item_', '')}.png`;
            card.innerHTML = `
                <img src="${imgSrc}" loading="lazy" alt="${item.dname}" onerror="this.src=''">
                <span>${item.dname}</span>
            `;
            itemsGrid.appendChild(card);
        });
    }

    // --- 3. ДЕТАЛЬНЫЙ АНАЛИЗ И КОНТР-ПИКИ (ПО СТАТИСТИКЕ) ---
    async function openHeroDetails(hero) {
        heroesGrid.classList.add('hidden');
        document.querySelector('.filters').classList.add('hidden');
        heroDetailsView.classList.remove('hidden');

        document.getElementById('selected-hero-name').innerText = hero.localized_name;
        document.getElementById('selected-hero-img').src = `${OPENDOTA_URL}${hero.img}`;
        
        const countersContainer = document.getElementById('counter-picks-container');
        countersContainer.innerHTML = '<p class="text-blue">Запрашиваю базу матчапов OpenDota...</p>';

        try {
            // Запрашиваем матчапы конкретного героя
            const matchRes = await fetch(`${OPENDOTA_URL}/api/heroes/${hero.id}/matchups`);
            let matchups = await matchRes.json();

            // Фильтруем: находим тех, кому выбранный герой ЧАЩЕ ВСЕГО ПРОИГРЫВАЕТ
            // Вычисляем винрейт врагов против нашего героя
            matchups.forEach(m => {
                m.enemy_winrate = (m.wins / m.games_played) * 100;
            });
            
            // Сортируем по убыванию сыгранных игр (для релевантности) и винрейту
            matchups = matchups.filter(m => m.games_played > 10).sort((a, b) => b.enemy_winrate - a.enemy_winrate).slice(0, 5);

            countersContainer.innerHTML = '';
            
            matchups.forEach(match => {
                // Находим данные врага в глобальной базе
                const enemy = globalHeroes.find(h => h.id === match.hero_id);
                if(!enemy) return;

                const winrate = match.enemy_winrate.toFixed(1);
                const el = document.createElement('div');
                el.className = 'counter-item';
                el.innerHTML = `
                    <img src="${OPENDOTA_URL}${enemy.img}" class="hero-avatar-fixed" style="width: 80px; height: 45px;" alt="${enemy.localized_name}">
                    <div class="counter-stats">
                        <h4 class="text-blue">${enemy.localized_name}</h4>
                        <p style="font-size: 12px; color: var(--text-muted);">Винрейт против ${hero.localized_name}: <strong>${winrate}%</strong> (Игр: ${match.games_played})</p>
                        <div class="stat-bar-bg">
                            <div class="stat-bar-fill" style="width: ${winrate}%;"></div>
                        </div>
                    </div>
                `;
                countersContainer.appendChild(el);
            });

        } catch (e) {
            countersContainer.innerHTML = '<p style="color: red;">Ошибка загрузки матчапов.</p>';
        }
    }

    // Возврат назад к списку героев
    btnBack.addEventListener('click', () => {
        heroDetailsView.classList.add('hidden');
        heroesGrid.classList.remove('hidden');
        document.querySelector('.filters').classList.remove('hidden');
    });

    // --- 4. ПОИСК И ФИЛЬТРЫ ---
    heroSearch.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        const filtered = globalHeroes.filter(h => h.localized_name.toLowerCase().includes(text));
        renderHeroes(filtered);
    });

    document.getElementById('item-search').addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        const filtered = globalItems.filter(i => i.dname.toLowerCase().includes(text));
        renderItems(filtered);
    });

    // Запускаем сборку данных
    initData();
});
