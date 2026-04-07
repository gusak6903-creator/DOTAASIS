:root {
    --steam-bg: #171a21;
    --steam-panel: #1b2838;
    --steam-blue: #66c0f4;
    --steam-dark-blue: #2a475e;
    --text-main: #c7d5e0;
    --glass-bg: rgba(27, 40, 56, 0.65);
    --glass-border: rgba(102, 192, 244, 0.2);
}

* { box-sizing: border-box; }

body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: var(--steam-bg);
    color: var(--text-main);
    overflow-x: hidden;
}

.steam-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at top right, var(--steam-dark-blue), var(--steam-bg) 60%);
    z-index: -2;
}

.ambient-glow {
    position: fixed;
    width: 600px; height: 600px;
    background: var(--steam-blue);
    filter: blur(150px);
    opacity: 0.05;
    top: -200px; left: -200px;
    z-index: -1;
    pointer-events: none;
}

/* Liquid Glass Elements */
.glass-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    background: rgba(23, 26, 33, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    position: sticky;
    top: 0; z-index: 100;
}

.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    padding: 20px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 2px;
}
.logo img { height: 30px; filter: drop-shadow(0 0 5px var(--steam-blue)); }
.logo span { color: var(--steam-blue); }

.tabs { display: flex; gap: 15px; }
.tab-btn {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-main);
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
    border-radius: 6px;
    transition: 0.3s;
}
.tab-btn:hover { color: #fff; text-shadow: 0 0 10px var(--steam-blue); }
.tab-btn.active {
    background: rgba(102, 192, 244, 0.1);
    border-color: var(--steam-blue);
    color: var(--steam-blue);
}

.container { max-width: 1400px; margin: 40px auto; padding: 0 20px; }

.filters { display: flex; justify-content: space-between; margin-bottom: 30px; align-items: center; }
#searchInput {
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--glass-border);
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    width: 300px;
    outline: none;
    font-family: 'Inter';
}
#searchInput:focus { border-color: var(--steam-blue); }

.attr-filters button {
    background: rgba(0,0,0,0.3);
    border: 1px solid transparent;
    color: #8f98a0;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    margin-left: 10px;
    transition: 0.3s;
}
.attr-filters button:hover, .attr-filters button.active {
    background: rgba(255,255,255,0.05);
    border-color: currentColor;
}

.hero-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 20px;
}

.hero-card {
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    background: #000;
}
.hero-card img { width: 100%; display: block; border-bottom: 2px solid transparent; transition: 0.3s;}
.hero-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 25px rgba(0,0,0,0.6);
}
.hero-card:hover img { border-color: var(--steam-blue); opacity: 0.8;}
.hero-name {
    position: absolute; bottom: 0; width: 100%;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    padding: 10px 5px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
}

/* Modal Liquid Glass */
.modal {
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: 1000;
}
.modal-content {
    position: relative; margin: 5% auto; width: 80%; max-width: 900px;
    animation: floatIn 0.4s ease-out;
}
.liquid-border {
    box-shadow: 0 0 40px rgba(102, 192, 244, 0.1), inset 0 0 20px rgba(102, 192, 244, 0.05);
}
@keyframes floatIn { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.close-btn {
    position: absolute; top: 15px; right: 25px;
    color: var(--text-main); font-size: 30px; font-weight: bold; cursor: pointer;
    transition: 0.2s;
}
.close-btn:hover { color: #ff4c4c; }

/* Draft Section */
.draft-slots { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
.slot {
    width: 120px; height: 160px;
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; color: var(--steam-blue);
    cursor: pointer; transition: 0.3s;
    background-size: cover; background-position: center;
}
.slot:hover { border-color: var(--steam-blue); background-color: rgba(102,192,244,0.1); }

.action-btn {
    background: linear-gradient(90deg, var(--steam-dark-blue), var(--steam-blue));
    color: #fff; border: none; padding: 15px 40px;
    font-size: 16px; font-weight: bold; border-radius: 30px;
    cursor: pointer; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    box-shadow: 0 5px 15px rgba(102,192,244,0.3);
    transition: 0.3s;
}
.action-btn:hover { filter: brightness(1.2); box-shadow: 0 8px 25px rgba(102,192,244,0.5); }

/* Item Grid */
.item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
.item-card {
    display: flex; align-items: center; gap: 15px;
    padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3);
    border: 1px solid var(--glass-border);
}
.item-card img { width: 50px; border-radius: 5px; }

/* Loader */
.spinner {
    width: 50px; height: 50px; border: 4px solid var(--glass-border);
    border-top: 4px solid var(--steam-blue); border-radius: 50%;
    animation: spin 1s linear infinite; margin: 20px auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
