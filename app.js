const heroesData = [
    { name: "Anti-Mage", id: "antimage", primary_attr: "agi" },
    { name: "Axe", id: "axe", primary_attr: "str" },
    { name: "Pudge", id: "pudge", primary_attr: "str" },
    { name: "Invoker", id: "invoker", primary_attr: "int" },
    { name: "Juggernaut", id: "juggernaut", primary_attr: "agi" },
    { name: "Phantom Assassin", id: "phantom_assassin", primary_attr: "agi" },
    { name: "Slark", id: "slark", primary_attr: "agi" },
    { name: "Sniper", id: "sniper", primary_attr: "agi" },
    { name: "Shadow Fiend", id: "nevermore", primary_attr: "agi" },
    { name: "Legion Commander", id: "legion_commander", primary_attr: "str" },
    { name: "Void Spirit", id: "void_spirit", primary_attr: "all" }
];

function renderHeroes(attr = 'all') {
    const grid = document.querySelector('.hero-grid') || document.getElementById('heroGrid');
    if(!grid) return;
    grid.innerHTML = "";
    
    const filtered = attr === 'all' ? heroesData : heroesData.filter(h => h.primary_attr === attr);
    
    filtered.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.innerHTML = `
            <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.id}.png">
            <div class="hero-name">${hero.name}</div>
        `;
        grid.appendChild(card);
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    renderHeroes();
    
    // Вешаем логику на кнопки фильтров, если они есть
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const attr = e.target.dataset.attr;
            renderHeroes(attr);
        });
    });
});
