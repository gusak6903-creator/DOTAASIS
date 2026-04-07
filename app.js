/**
 * DOTAASIS ULTIMATE - Bridge UI Script
 * Назначение: Интеграция логики app.js с Liquid Glass HTML.
 */

const STEAM_HERO_CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/';
const STEAM_ITEM_CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/';

const UI = {
    state: {
        draft: [null, null, null, null, null],
        pickingForSlot: null,
        currentHeroFilter: 'all'
    },

    init() {
        this.bindNavTabs();
        this.bindFilters();
        this.renderHeroes();
        this.renderItems();
        this.bindDraftSystem();
    },

    // ===== НАВИГАЦИЯ =====
    bindNavTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.add('active');
            });
        });
    },

    bindFilters() {
        document.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.currentHeroFilter = btn.dataset.attr;
                this.renderHeroes();
            });
        });

        document.getElementById('hero-search').addEventListener('input', () => this.renderHeroes());
    },

    // ===== РЕНДЕР ГЕРОЕВ =====
    renderHeroes() {
        const grid = document.getElementById('hero-grid');
        grid.innerHTML = '';
        const search = document.getElementById('hero-search').value.toLowerCase();
        
        Object.entries(window.DOTAASIS.heroes).forEach(([key, hero]) => {
            // Фильтрация
            if (this.state.currentHeroFilter !== 'all' && hero.primaryAttr !== this.state.currentHeroFilter) return;
            if (search && !hero.localName.toLowerCase().includes(search) && !hero.name.toLowerCase().includes(search)) return;

            const card = document.createElement('div');
            card.className = 'dota-card hero-card';
            card.innerHTML = `
                <img src="${STEAM_HERO_CDN}${key}.png" alt="${hero.localName}">
                <div class="card-label">${hero.localName}</div>
            `;
            card.onclick = () => this.showHeroDetails(key);
            grid.appendChild(card);
        });
    },

    // ===== РЕНДЕР ПРЕДМЕТОВ =====
    renderItems() {
        const grid = document.getElementById('item-grid');
        grid.innerHTML = '';
        Object.entries(window.DOTAASIS.items).forEach(([key, item]) => {
            const card = document.createElement('div');
            card.className = 'dota-card item-card';
            // Обработка имени файла для предметов DOTA
            let imgKey = key.replace(/recipe_/g, 'recipe');
            card.innerHTML = `<img src="${STEAM_ITEM_CDN}${imgKey}.png" alt="${key}">`;
            card.onclick = () => this.showItemDetails(key);
            grid.appendChild(card);
        });
    },

    // ===== МОДАЛЬНЫЕ ОКНА И ОПИСАНИЯ =====
    showHeroDetails(heroKey) {
        const hero = window.DOTAASIS.heroes[heroKey];
        const counterData = window.DOTAASIS.counterpicks[heroKey];
        const body = document.getElementById('modal-content-body');
        
        let countersHtml = '<p style="color:var(--text-muted);font-size:13px;">Данных по контрпикам в базе 7.41a пока нет.</p>';
        
        if (counterData && counterData.counters) {
            countersHtml = `
                <table class="insight-table">
                    ${counterData.counters.map(c => `
                        <tr>
                            <td width="180">
                                <div class="hero-row">
                                    <img src="${STEAM_HERO_CDN}${c.hero}.png">
                                    <strong>${window.DOTAASIS.heroes[c.hero].localName}</strong>
                                </div>
                            </td>
                            <td><span style="color:var(--accent-red);font-weight:900;">+${c.advantage}%</span></td>
                            <td style="color:var(--text-muted);">${c.reason}</td>
                        </tr>
                    `).join('')}
                </table>
            `;
        }

        body.innerHTML = `
            <div class="detail-header">
                <img src="${STEAM_HERO_CDN}${heroKey}.png">
                <div class="detail-title">
                    <h1>${hero.localName}</h1>
                    <div class="tags">
                        <span class="detail-tag" style="color:var(--accent-cyan); border:1px solid var(--accent-cyan);">${hero.primaryAttr}</span>
                        ${hero.roles.map(r => `<span class="detail-tag">${r}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>ПОЧЕМУ ОН СИЛЕН (МЕХАНИКИ)</h3>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom: 25px;">
                    ${hero.mechanics.map(m => `<span class="detail-tag" style="background:rgba(0,255,136,0.1); color:var(--accent-emerald);">${m.replace(/_/g, ' ')}</span>`).join('')}
                </div>
                <h3>КЕМ КОНТРИТЬ (ОПАСНОСТЬ)</h3>
                ${countersHtml}
            </div>
        `;
        document.getElementById('info-modal').classList.add('active');
    },

    showItemDetails(itemKey) {
        const item = window.DOTAASIS.items[itemKey];
        const body = document.getElementById('modal-content-body');
        
        let situationHtml = '';
        if (item.situation) {
            situationHtml = `
                <div class="insight-block" style="border-color:var(--accent-red); margin-top:20px;">
                    <h3 style="color:var(--accent-red);">ДЛЯ КАКОЙ СИТУАЦИИ (ПАТЧ 7.41a)</h3>
                    <p style="color:var(--text-main); font-size:14px; line-height:1.6;">${item.reason || 'Ситуативный выбор на усмотрение игрока.'}</p>
                    <p style="margin-top:10px; font-size:12px; color:var(--text-muted);">Хорош против: ${item.counters ? item.counters.join(', ') : 'Общего урона'}</p>
                </div>
            `;
        }

        body.innerHTML = `
            <div class="detail-header">
                <img src="${STEAM_ITEM_CDN}${itemKey.replace(/recipe_/g, 'recipe')}.png" style="width:80px;">
                <div class="detail-title">
                    <h1>${itemKey.replace(/_/g, ' ').toUpperCase()}</h1>
                    <div class="tags">
                        <span class="detail-tag" style="color:var(--accent-emerald);">COST: ${item.cost}</span>
                        <span class="detail-tag">${item.category}</span>
                    </div>
                </div>
            </div>
            ${situationHtml}
        `;
        document.getElementById('info-modal').classList.add('active');
    },

    closeModal(id) {
        document.getElementById(id).classList.remove('active');
    },

    // ===== СИСТЕМА ДРАФТА =====
    bindDraftSystem() {
        document.querySelectorAll('.pick-slot').forEach(slot => {
            // Клик по крестику
            slot.querySelector('.slot-clear').addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = slot.dataset.slot;
                this.state.draft[idx] = null;
                this.updateDraftUI();
            });

            // Клик по самому слоту
            slot.addEventListener('click', () => {
                this.state.pickingForSlot = slot.dataset.slot;
                this.openDraftPicker();
            });
        });

        document.getElementById('btn-analyze').addEventListener('click', () => {
            this.runNeuralAnalysis();
        });
    },

    openDraftPicker() {
        const grid = document.getElementById('picker-grid');
        grid.innerHTML = '';
        
        Object.entries(window.DOTAASIS.heroes).forEach(([key, hero]) => {
            const card = document.createElement('div');
            card.className = 'dota-card hero-card';
            
            // Логика исключения (проверка дубликатов)
            if (this.state.draft.includes(key)) {
                card.classList.add('disabled');
            } else {
                card.onclick = () => {
                    this.state.draft[this.state.pickingForSlot] = key;
                    this.updateDraftUI();
                    this.closeModal('picker-modal');
                };
            }

            card.innerHTML = `
                <img src="${STEAM_HERO_CDN}${key}.png" alt="${hero.localName}">
                <div class="card-label">${hero.localName}</div>
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('picker-modal').classList.add('active');
    },

    updateDraftUI() {
        const slots = document.querySelectorAll('.pick-slot');
        slots.forEach((slot, idx) => {
            const heroKey = this.state.draft[idx];
            if (heroKey) {
                slot.classList.add('filled');
                slot.querySelector('.slot-content').innerText = window.DOTAASIS.heroes[heroKey].localName;
                // Добавляем фон картинки
                let img = slot.querySelector('img.bg-portrait');
                if(!img) {
                    img = document.createElement('img');
                    img.className = 'bg-portrait';
                    slot.appendChild(img);
                }
                img.src = `${STEAM_HERO_CDN}${heroKey}.png`;
            } else {
                slot.classList.remove('filled');
                slot.querySelector('.slot-content').innerText = `ВЫБРАТЬ POS ${idx + 1}`;
                const img = slot.querySelector('img.bg-portrait');
                if(img) img.remove();
            }
        });
    },

    runNeuralAnalysis() {
        const activeDraft = this.state.draft.filter(Boolean);
        const resultsBox = document.getElementById('analysis-results');
        
        if (activeDraft.length === 0) {
            resultsBox.innerHTML = '<div class="insight-block" style="border-color:var(--accent-red);">Сначала выберите хотя бы одного героя врага!</div>';
            return;
        }

        // Запуск логики из твоего app.js
        const analysis = window.DOTAASIS.analyzeDraft(activeDraft);
        
        // Рендер результатов и советов
        let html = `
            <div class="insight-block">
                <h3>УРОВЕНЬ УГРОЗЫ: ${analysis.overallEnemyThreat} баллов</h3>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <span class="detail-tag">МАГИЯ: ${analysis.threatLevel.magic}</span>
                    <span class="detail-tag">ФИЗИКА: ${analysis.threatLevel.physical}</span>
                    <span class="detail-tag">КОНТРОЛЬ: ${analysis.threatLevel.control}</span>
                </div>
            </div>
            
            <div class="insight-block" style="border-color:var(--accent-emerald);">
                <h3 style="color:var(--accent-emerald);">НЕЙРО-РЕКОМЕНДАЦИИ К ПИКУ</h3>
                <table class="insight-table">
                    ${analysis.topRecommendations.slice(0, 5).map(r => `
                        <tr>
                            <td width="150"><div class="hero-row"><img src="${STEAM_HERO_CDN}${r.hero}.png"> ${r.localName}</div></td>
                            <td style="color:var(--text-muted);">${r.reasoning}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>

            <div class="insight-block" style="border-color:var(--accent-red);">
                <h3 style="color:var(--accent-red);">НЕОБХОДИМЫЕ АРТЕФАКТЫ (АНТИ-БИЛД)</h3>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                    ${analysis.itemRecommendations.slice(0, 3).map(rec => 
                        rec.items.map(item => `
                            <div title="${rec.reason}" style="text-align:center; cursor:pointer;" onclick="UI.showItemDetails('${item.key}')">
                                <img src="${STEAM_ITEM_CDN}${item.key.replace(/recipe_/g, 'recipe')}.png" style="width:50px; border-radius:8px; border:1px solid var(--glass-border);">
                            </div>
                        `).join('')
                    ).join('')}
                </div>
            </div>
        `;
        
        resultsBox.innerHTML = html;

        // Отправляем комментарии Оракула в чат
        const chat = document.getElementById('oracle-chat');
        analysis.oracleComment.forEach(comment => {
            const msg = document.createElement('div');
            msg.className = 'chat-msg ai';
            msg.innerHTML = `<span class="sender">ORACLE:</span><span class="text">${comment}</span>`;
            chat.appendChild(msg);
        });
        chat.scrollTop = chat.scrollHeight;
        
        // Переключаем вкладку на анализ на мобилках или даем понять, что сработало
        document.getElementById('btn-analyze').innerText = "ОБНОВИТЬ АНАЛИЗ";
    }
};

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Ждем инициализации DOTAASIS из app.js
    if(window.DOTAASIS) {
        UI.init();
    } else {
        console.error("DOTAASIS не найден! Проверьте подключение app.js");
    }
});
