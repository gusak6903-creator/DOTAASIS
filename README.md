# ⚔ Dota 2 Counterpick — Патч 7.41

Сайт для контрпиков героев Dota 2 с автоматической загрузкой данных через API.

## 🚀 Быстрый старт

### GitHub Pages (рекомендуется)
1. Загрузи все 3 файла в новый GitHub репозиторий:
   - `index.html`
   - `style.css`
   - `app.js`
2. Зайди в **Settings → Pages → Source: main branch**
3. Через минуту сайт будет доступен по адресу `https://USERNAME.github.io/REPO/`

### Локально
```bash
# Нужен локальный сервер (из-за CORS)
npx serve .
# или
python -m http.server 8080
# затем открой http://localhost:8080
```

> ⚠️ Не открывай `index.html` напрямую через `file://` — CORS заблокирует API запросы.

---

## 📡 Используемые API

| API | Что даёт |
|-----|----------|
| **OpenDota API** `api.opendota.com/api/heroes` | Все герои, атрибуты, роли |
| **OpenDota API** `api.opendota.com/api/constants/items` | Все предметы с описанием |
| **OpenDota API** `api.opendota.com/api/heroStats` | Статистика побед/поражений |
| **Steam CDN** `cdn.cloudflare.steamstatic.com` | Иконки героев и предметов |

Все данные обновляются **автоматически** — API всегда отдаёт актуальный патч.

---

## 🎮 Функционал

### Вкладка ГЕРОИ
- Все ~125 героев с иконками
- Фильтр по атрибуту (Сила / Ловкость / Интеллект / Универсал)
- Фильтр по роли (Carry, Support, Initiator и т.д.)
- Поиск по имени
- Клик на героя → модальное окно с полной статой и контрпиками

### Вкладка ПРЕДМЕТЫ
- Все предметы из игры
- Фильтр по категории (расходники, броня, оружие, нейтральные...)
- Поиск по имени
- Клик → модальное окно с характеристиками

### Вкладка КОНТРПИК
- Выбери вражеского героя → сайт показывает:
  - ✅ Каких героев пикать против него
  - 🛒 Рекомендованные предметы
  - ⚠ Слабые стороны героя
  - 🚫 Против каких героев он сам силён

---

## 🎨 Стек

- Чистый HTML/CSS/JavaScript (без фреймворков)
- Google Fonts (Cinzel + Rajdhani)
- OpenDota Public API (бесплатно, без ключа)

---

## 📁 Структура

```
/
├── index.html   — разметка
├── style.css    — стили (тема Dota 2, анимации)
├── app.js       — логика, API запросы, рендеринг
└── README.md    — этот файл
```

---

## 🔧 Расширение

Чтобы улучшить контрпики на основе реальных матчей:

```javascript
// В app.js замени функцию getCounters() на:
async function loadHeroMatchups(heroId) {
  const res = await fetch(`https://api.opendota.com/api/heroes/${heroId}/matchups`);
  const data = await res.json();
  return data
    .map(m => ({ ...m, winrate: m.wins / m.games_played }))
    .sort((a, b) => b.winrate - a.winrate)
    .slice(0, 8)
    .map(m => ALL_HEROES.find(h => h.id === m.hero_id))
    .filter(Boolean);
}
```

> OpenDota бесплатен, но лимит ~1200 запросов/мин без API ключа.
> С ключом (получи на opendota.com) лимит выше.

---

Made with ⚔ for the Dota 2 community
