
  items = await res2.json();

  renderHeroes();
  renderItems();
}

function renderHeroes(list = heroes) {
  const grid = document.getElementById('heroesGrid');
  grid.innerHTML = '';

  list.forEach(hero => {
    const el = document.createElement('div');
    el.className = 'card glass';

    el.innerHTML = `
      <img src="https://cdn.cloudflare.steamstatic.com${hero.img}" width="100%">
      <h3>${hero.localized_name}</h3>
      <p>${hero.roles.map(r=>roleMap[r]||r).join(', ')}</p>
    `;

    el.onclick = () => openHero(hero);
    grid.appendChild(el);
  });
}

function renderItems() {
  const grid = document.getElementById('itemsGrid');

  Object.keys(items).slice(0,100).forEach(key => {
    const item = items[key];
    const el = document.createElement('div');
    el.className = 'card glass';

    el.innerHTML = `
      <h4>${key}</h4>
      <p>${(item.hint||[]).join(' ')}</p>
    `;

    grid.appendChild(el);
  });
}

function openHero(hero) {
  const modal = document.getElementById('modal');
  const data = document.getElementById('modalData');

  data.innerHTML = `
    <h2>${hero.localized_name}</h2>
    <p>Винрейт: ${(hero.pro_win/hero.pro_pick*100||0).toFixed(1)}%</p>
    <p>Атака: ${hero.attack_type}</p>
    <p>Роли: ${hero.roles.join(', ')}</p>
  `;

  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function analyzeDraft() {
  const result = document.getElementById('draftResult');
  const picks = heroes.sort(()=>0.5-Math.random()).slice(0,3);
  result.innerHTML = picks.map(p=>p.localized_name).join(', ');
}

// search

document.addEventListener('input', (e)=>{
  if(e.target.id==='search'){
    const val = e.target.value.toLowerCase();
    const filtered = heroes.filter(h=>h.localized_name.toLowerCase().includes(val));
    renderHeroes(filtered);
  }
});

// tabs

document.querySelectorAll('nav button').forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  }
});

init();
