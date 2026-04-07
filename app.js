document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Логика переключения вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем active у всех
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем active нажатому
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 2. Детальные данные контр-пиков (Решение проблемы с "одним текстом на всех")
    // Вместо одной строки мы храним уникальное описание и массив предметов
    const detailedCounters = [
        {
            enemy: "Medusa",
            reason: "Anti-Mage сжигает ману, которая является основным здоровьем Медузы благодаря Mana Shield. Без маны она становится очень уязвимой физической целью.",
            items: ["manta", "diffusal_blade", "abyssal_blade"]
        },
        {
            enemy: "Storm Spirit",
            reason: "Шторм полностью зависим от маны для мобильности. Mana Void наносит колоссальный АОЕ урон по пулу маны Шторма, убивая его и его команду.",
            items: ["orchid", "abyssal_blade", "black_king_bar"]
        },
        {
            enemy: "Zeus",
            reason: "Встроенный Counterspell дает огромное сопротивление магии, а мобильность позволяет легко сократить дистанцию до Зевса в драке.",
            items: ["manta", "mage_slayer"]
        }
    ];

    // Функция рендера контр-пиков
    const countersContainer = document.getElementById('counter-picks-container');
    
    function renderCounters() {
        countersContainer.innerHTML = ''; // Очищаем контейнер
        
        detailedCounters.forEach(counter => {
            // Генерируем HTML картинок предметов (используем заглушки OpenDota)
            const itemsHtml = counter.items.map(item => 
                `<img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${item}.png" class="item-icon" title="${item}" alt="${item}">`
            ).join('');

            const counterEl = document.createElement('div');
            counterEl.className = 'counter-item';
            counterEl.innerHTML = `
                <h4 class="text-blue">Против: ${counter.enemy}</h4>
                <p>${counter.reason}</p>
                <div class="items-row">
                    <span style="font-size: 12px; color: var(--text-muted); align-self: center;">Предметы: </span>
                    ${itemsHtml}
                </div>
            `;
            countersContainer.appendChild(counterEl);
        });
    }

    renderCounters();

    // 3. Интеграция API OpenDota (Пример получения актуального патча/героев)
    async function fetchDotaData() {
        try {
            // Это реальный публичный эндпоинт OpenDota
            const response = await fetch('https://api.opendota.com/api/heroStats');
            const heroes = await response.json();
            console.log(`Успешно загружено ${heroes.length} героев из API`);
            // Здесь можно будет написать логику заполнения сетки героев
        } catch (error) {
            console.error('Ошибка загрузки данных OpenDota API:', error);
        }
    }
    fetchDotaData();

    // 4. Скелет для интеграции ИИ (Gemini / OpenAI)
    const aiInput = document.getElementById('ai-input');
    const aiChatBody = document.getElementById('ai-chat-body');

    aiInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && aiInput.value.trim() !== '') {
            const userText = aiInput.value;
            
            // Добавляем сообщение пользователя
            aiChatBody.innerHTML += `<div class="msg" style="align-self: flex-end; background: rgba(255,255,255,0.1);">${userText}</div>`;
            aiInput.value = '';
            
            // Имитация "печатает..."
            const typingId = 'typing-' + Date.now();
            aiChatBody.innerHTML += `<div id="${typingId}" class="msg ai-msg text-green">Анализирую данные патча...</div>`;
            aiChatBody.scrollTop = aiChatBody.scrollHeight;

            // ВАЖНО: Здесь в будущем будет твой fetch-запрос к твоему backend-серверу, 
            // который по защищенному каналу обращается к API Gemini.
            /* Пример реального вызова в будущем:
               const aiResponse = await fetch('/api/ask-gemini', { method: 'POST', body: JSON.stringify({ query: userText }) });
               const result = await aiResponse.json();
            */

            setTimeout(() => {
                document.getElementById(typingId).innerHTML = `Я обработал запрос. Для контры этого пика советую взять Axe в оффлейн. Он пробивает сквозь BKB.`;
                aiChatBody.scrollTop = aiChatBody.scrollHeight;
            }, 1500);
        }
    });
});
