/**
 * DOTAASIS ULTIMATE — js/app.js
 * Полная логика приложения: API, рендеринг, драфт-анализ, модальные окна
 */
'use strict';

/* ═══════════════════════════════════════════════════════════
   КОНСТАНТЫ И CDN
═══════════════════════════════════════════════════════════ */
const API = {
  heroes:    'https://api.opendota.com/api/heroes',
  heroStats: 'https://api.opendota.com/api/heroStats',
  items:     'https://api.opendota.com/api/constants/items',
};
const CDN_HERO  = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/';
const CDN_ITEM  = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/';
const FALLBACK_IMG = 'https://placehold.co/256x144/13131a/2d8bff?text=?';

/* ═══════════════════════════════════════════════════════════
   СЛОВАРИ ЛОКАЛИЗАЦИИ
═══════════════════════════════════════════════════════════ */
const LOCALE = {
  attr: {
    str:       'Сила',
    agi:       'Ловкость',
    int:       'Интеллект',
    universal: 'Универсал',
    strength:  'Сила',
    agility:   'Ловкость',
    intelligence: 'Интеллект',
  },
  roles: {
    Carry:      'Керри',
    Support:    'Поддержка',
    Nuker:      'Нюкер',
    Disabler:   'Диспелер',
    Jungler:    'Джанглер',
    Durable:    'Танк',
    Escape:     'Эскейпер',
    Pusher:     'Пушер',
    Initiator:  'Инициатор',
    Healer:     'Хилер',
    Roamer:     'Роумер',
  },
  heroes: {
    'Anti-Mage':            'Анти-Маг',
    'Axe':                  'Акс',
    'Bane':                 'Бейн',
    'Bloodseeker':          'Кровопийца',
    'Crystal Maiden':       'Кристальная Дева',
    'Drow Ranger':          'Дроу Рейнджер',
    'Earthshaker':          'Земной Потрясатель',
    'Juggernaut':           'Джаггернаут',
    'Mirana':               'Мирана',
    'Shadow Fiend':         'Теневой Демон',
    'Morphling':            'Морфлинг',
    'Phantom Lancer':       'Фантомный Копейщик',
    'Puck':                 'Пак',
    'Pudge':                'Пудж',
    'Razor':                'Рейзор',
    'Sand King':            'Песчаный Король',
    'Storm Spirit':         'Дух Бури',
    'Sven':                 'Свен',
    'Tiny':                 'Тини',
    'Vengeful Spirit':      'Мстительный Дух',
    'Windranger':           'Виндрейнджер',
    'Zeus':                 'Зевс',
    'Kunkka':               'Кункка',
    'Lina':                 'Лина',
    'Lion':                 'Лион',
    'Shadow Shaman':        'Теневой Шаман',
    'Slardar':              'Слардар',
    'Tidehunter':           'Охотник на Прибой',
    'Witch Doctor':         'Доктор Вуду',
    'Lich':                 'Лич',
    'Riki':                 'Рики',
    'Enigma':               'Энигма',
    'Tinker':               'Тинкер',
    'Sniper':               'Снайпер',
    'Necrophos':            'Некрофос',
    'Warlock':              'Чернокнижник',
    'Beastmaster':          'Повелитель Зверей',
    'Queen of Pain':        'Королева Боли',
    'Venomancer':           'Веномансер',
    'Faceless Void':        'Лишённый лица',
    'Wraith King':          'Король-Призрак',
    'Death Prophet':        'Пророчица Смерти',
    'Phantom Assassin':     'Призрачный Убийца',
    'Pugna':                'Пугна',
    'Templar Assassin':     'Убийца Тамплиера',
    'Viper':                'Вайпер',
    'Luna':                 'Луна',
    'Dragon Knight':        'Рыцарь Дракона',
    'Dazzle':               'Дазл',
    'Clinkz':               'Клинкз',
    'Omniknight':           'Омнирыцарь',
    'Chaos Knight':         'Рыцарь Хаоса',
    'Meepo':                'Мипо',
    'Treant Protector':     'Страж Рощи',
    'Ogre Magi':            'Огр-Маг',
    'Undying':              'Нежить',
    'Rubick':               'Рубик',
    'Disruptor':            'Нарушитель',
    'Nyx Assassin':         'Убийца Никс',
    'Naga Siren':           'Нага Сирена',
    "Keeper of the Light":  'Хранитель Света',
    'Io':                   'Ио',
    'Visage':               'Визаж',
    'Slark':                'Сларк',
    'Medusa':               'Медуза',
    'Troll Warlord':        'Тролль-Военачальник',
    'Centaur Warrunner':    'Центавр Воитель',
    'Magnus':               'Магнус',
    'Timbersaw':            'Лесоруб',
    'Bristleback':          'Щетинистый',
    'Tusk':                 'Клык',
    'Skywrath Mage':        'Маг Небесного гнева',
    'Abaddon':              'Абаддон',
    'Elder Titan':          'Старейший Титан',
    'Legion Commander':     'Командир Легиона',
    'Techies':              'Саботажники',
    'Ember Spirit':         'Дух Эмбер',
    'Earth Spirit':         'Земной Дух',
    'Underlord':            'Underlord',
    'Terrorblade':          'Террорбейд',
    'Phoenix':              'Феникс',
    'Oracle':               'Оракул',
    'Winter Wyvern':        'Зимняя Виверна',
    'Arc Warden':           'Хранитель Дуги',
    'Underlord':            'Господин Подземелья',
    'Monkey King':          'Царь Обезьян',
    'Pangolier':            'Пангольер',
    'Dark Willow':          'Тёмная Ива',
    'Grimstroke':           'Мрачный Маэстро',
    'Invoker':              'Инвокер',
    'Silencer':             'Умолкание',
    'Outworld Destroyer':   'Разрушитель Иного Мира',
    'Lycan':                'Ликан',
    'Brewmaster':           'Пивовар',
    'Shadow Demon':         'Теневой Демон',
    'Lone Druid':           'Одинокий Друид',
    'Night Stalker':        'Ночной Преследователь',
    'Ancient Apparition':   'Древнее Привидение',
    'Spirit Breaker':       'Сокрушитель Духов',
    'Ursa':                 'Урса',
    "Nature's Prophet":     'Пророк Природы',
    'Lifestealer':          'Пожиратель Жизни',
    'Dark Seer':            'Тёмный Видящий',
    'Bounty Hunter':        'Охотник за головами',
    'Weaver':               'Ткач',
    'Jakiro':               'Джакиро',
    'Batrider':             'Летучий Всадник',
    'Chen':                 'Чэнь',
    'Spectre':              'Призрак',
    'Doom':                 'Дум',
    'Clockwerk':            'Гоблин-Механик',
    'Leshrac':              'Лешрак',
    'Gyrocopter':           'Гирокоптер',
    'Alchemist':            'Алхимик',
    'Io':                   'Ио',
    'Huskar':               'Хускар',
    'Marci':                'Марси',
    'Primal Beast':         'Первозданный Зверь',
    'Muerta':               'Муэрта',
    'Snapfire':             'Снэпфайр',
    'Dawnbreaker':          'Рассветник',
    'Hoodwink':             'Хитрец',
    'Ringmaster':           'Дирижёр Теней',
    'Kez':                  'Кез',
    'Bloodseeker':          'Кровопийца',
    'Storm Spirit':         'Дух Бури',
    'Void Spirit':          'Дух Пустоты',
    'Broodmother':          'Паучиха-Матерь',
  }
};

function localizeHero(name) { return LOCALE.heroes[name] || name; }
function localizeAttr(a)    { return LOCALE.attr[a] || a; }
function localizeRole(r)    { return LOCALE.roles[r] || r; }

/* ═══════════════════════════════════════════════════════════
   БАЗА ЗНАНИЙ — контрпики + предметы + советы
═══════════════════════════════════════════════════════════ */
const KB = {
  axe:{ counters:[{n:"Slark",r:"Не даёт Axe прыгать без последствий"},{n:"Phantom Lancer",r:"Иллюзии дают огромный урон Counter Helix"},{n:"Bristleback",r:"Не боится Call — берёт урон пассивно"},{n:"Faceless Void",r:"Chrono снимает его из командного боя"},{n:"Omniknight",r:"Repel блокирует Battle Hunger и Call"}], items:[{k:"black_king_bar",n:"BKB",w:"Полный иммунитет к Battle Hunger и Berserker's Call"},{k:"cyclone",n:"Eul's Scepter",w:"Снимает Battle Hunger с союзника"},{k:"sphere",n:"Linken's Sphere",w:"Блокирует Berserker's Call на носителе"}], tip:"Axe живёт Counter Helix. BKB полностью нейтрализует его угрозу. Никогда не разделяйтесь — Culling Blade убивает одиночек мгновенно.", tags:["aoe","disabler","initiator"] },
  bristleback:{ counters:[{n:"Silver Edge",r:"Отключает пассивный Bristleback"},{n:"Bloodseeker",r:"Видит и ограничивает передвижение"},{n:"Ancient Apparition",r:"Ульт отменяет реген от квилов"},{n:"Doom",r:"Doom блокирует все его пассивки"},{n:"Silencer",r:"Глобальное молчание мешает ротации"}], items:[{k:"silver_edge",n:"Silver Edge",w:"Отключает пассивку Bristleback — ключ к победе"},{k:"diffusal_blade",n:"Diffusal Blade",w:"Сжигает ману, замедляет бегство"},{k:"ancient_apparition",n:"AA (ульт)",w:"Отменяет реген от квилов и пассивных атак"}], tip:"Атакуйте сбоку или сзади. Silver Edge — обязателен. Без пассивки он обычный медленный герой.", tags:["durable","carry","pusher"] },
  phantom_assassin:{ counters:[{n:"Bloodseeker",r:"Видит через инвиз, ограничивает движение"},{n:"Ancient Apparition",r:"Ульт не даёт ей хилиться"},{n:"Viper",r:"Viper Strike замедляет и наносит урон"},{n:"Phantom Lancer",r:"Иллюзии контрят её одиночные атаки"},{n:"Legion Commander",r:"Duel при физической слабости}"}], items:[{k:"monkey_king_bar",n:"Monkey King Bar",w:"Убирает её Blur (50% уклонение)"},{k:"heavens_halberd",n:"Heaven's Halberd",w:"Дизарм + снятие уклонения — она беспомощна"},{k:"radiance",n:"Radiance",w:"AoE промах суммируется против иллюзий"}], tip:"PA убивает через Critical и Blur. MKB — обязателен абсолютно. Bloodseeker видит её сквозь инвиз.", tags:["carry","escape","nuker","burst"] },
  anti_mage:{ counters:[{n:"Nyx Assassin",r:"Mana Burn убивает его ман-пул"},{n:"Pugna",r:"Decrepify + Nether Ward разрушает его план"},{n:"Bane",r:"Fiend's Grip лочит его надолго"},{n:"Silencer",r:"Int Steal лишает ман-пула"},{n:"Doom",r:"Doom блокирует Blink и ману"}], items:[{k:"necronomicon",n:"Necronomicon",w:"Mana Burn убивает его ман-пул"},{k:"orchid",n:"Orchid Malevolence",w:"Молчание — нет Blink, нет Mana Void"},{k:"force_staff",n:"Force Staff",w:"Не давайте фармить — давление на позицию"}], tip:"AM — поздний гиперкэрри. Агрессия в ранней игре критична. Pugna Decrepify лишает его атак. Не давайте ему 20+ минут фарма.", tags:["carry","escape","hard_carry"] },
  invoker:{ counters:[{n:"Silencer",r:"Global Silence полностью выключает его"},{n:"Nyx Assassin",r:"Mana Burn убивает ман-пул"},{n:"Doom",r:"Doom блокирует Invoke и все заклинания"},{n:"Lion",r:"Hex прерывает его комбо"},{n:"Bane",r:"Fiend's Grip не даёт кастовать комбо"}], items:[{k:"orchid",n:"Orchid Malevolence",w:"Молчание — он не может комбинировать заклинания"},{k:"black_king_bar",n:"BKB",w:"BKB блокирует большинство его спеллов"},{k:"sheepstick",n:"Scythe of Vyse",w:"Hex прерывает комбо — нужно время на каст"}], tip:"Invoker живёт комбо. Silencer Global Silence полностью его выключает. Давите агрессивно до покупки Blink Dagger.", tags:["nuker","disabler","escape","pusher"] },
  pudge:{ counters:[{n:"Ursa",r:"Убивает Pudge в 1v1 без труда"},{n:"Lifestealer",r:"Feast + физурон без магии"},{n:"Viper",r:"Заходит в ближний бой безопасно"},{n:"Clockwerk",r:"Cog блокирует Hook и ловит его"},{n:"Silencer",r:"Global Silence в момент каста Hook"}], items:[{k:"black_king_bar",n:"BKB",w:"Иммунитет к Dismember — его главному локу"},{k:"blade_mail",n:"Blade Mail",w:"Отражает урон от Rot — он убивает себя"},{k:"force_staff",n:"Force Staff",w:"Укрывайтесь за крипами и деревьями от Hook"}], tip:"Pudge живёт Hook'ом. Постоянно двигайтесь за крипами. Blade Mail отражает Rot — он буквально убивает себя.", tags:["disabler","initiator","durable"] },
  phantom_lancer:{ counters:[{n:"Gyrocopter",r:"Flak Cannon уничтожает все иллюзии"},{n:"Alchemist",r:"Chemical Rage + AoE"},{n:"Medusa",r:"Stone Gaze убивает армию иллюзий"},{n:"Leshrac",r:"Pulse Nova горит по всем иллюзиям"},{n:"Earthshaker",r:"Echo Slam множится от иллюзий"}], items:[{k:"radiance",n:"Radiance",w:"AoE горение на все иллюзии одновременно"},{k:"skadi",n:"Eye of Skadi",w:"Замедление проц на каждую иллюзию"},{k:"mjollnir",n:"Mjollnir",w:"Chain Lightning прыгает по всей армии"}], tip:"PL = иллюзии. Splash/AoE — обязателен. Radiance — лучший контр. Держитесь вместе, не разделяйтесь.", tags:["carry","escape","pusher","illusions"] },
  storm_spirit:{ counters:[{n:"Orchid",r:"Молчание блокирует Ball Lightning"},{n:"Bloodseeker",r:"Rupture убивает его через движение"},{n:"Lion",r:"Hex заперт + Mana Drain"},{n:"Nyx Assassin",r:"Mana Burn убивает ман-пул"},{n:"Ancient Apparition",r:"AA Ice Blast не даёт хилиться"}], items:[{k:"orchid",n:"Orchid Malevolence",w:"Молчание — Ball Lightning требует маны и каста"},{k:"cyclone",n:"Eul's Scepter",w:"Прерывает его движение и регенерацию"},{k:"sheepstick",n:"Scythe of Vyse",w:"Hex — он не может уйти через Ball Lightning"}], tip:"Storm зависит от маны для Ball Lightning. Orchid = он заперт. Bloodseeker Rupture убивает через движение.", tags:["carry","initiator","escape","nuker"] },
  earthshaker:{ counters:[{n:"Faceless Void",r:"Chronosphere ловит его в момент ульта"},{n:"Rubick",r:"Крадёт Fissure — блокирует Earthshaker"},{n:"Tinker",r:"Blink + BKB позволяет игнорировать его"},{n:"Phantom Lancer",r:"Иллюзии множат Echo Slam — не выгодно"},{n:"Naga Siren",r:"Song of the Siren отменяет его ульт"}], items:[{k:"black_king_bar",n:"BKB",w:"Блокирует весь CC Earthshaker"},{k:"force_staff",n:"Force Staff",w:"Разделяйтесь — Echo Slam множится от кластеров"},{k:"blink",n:"Blink Dagger",w:"Мгновенно уходите из зоны Echo Slam"}], tip:"Echo Slam убийственен по кластерам. НИКОГДА не стойте рядом с союзниками. Rubick крадёт Fissure.", tags:["initiator","disabler","support"] },
  faceless_void:{ counters:[{n:"Rubick",r:"Украдёт Chronosphere — смерть Void"},{n:"Tinker",r:"BKB + Blink позволяет игнорировать Chrono"},{n:"Oracle",r:"False Promise внутри Chrono спасает"},{n:"Omniknight",r:"Repel дает иммунитет внутри Chrono"},{n:"Luna",r:"Eclipse сквозь Chrono при BKB"}], items:[{k:"cyclone",n:"Eul's Scepter",w:"Eul на себе выбрасывает из Chronosphere"},{k:"force_staff",n:"Force Staff",w:"Выносите союзника из Chronosphere"},{k:"black_king_bar",n:"BKB",w:"Внутри Chronosphere вы свободны"}], tip:"Chronosphere ловит ВСЕХ. Rubick украл Chrono — мгновенная смерть Void. BKB внутри Chrono = вы свободны.", tags:["carry","initiator","escape","disabler"] },
  slark:{ counters:[{n:"Ancient Apparition",r:"AoE урон прерывает Shadow Dance реген"},{n:"Bloodseeker",r:"Видит сквозь Shadow Dance"},{n:"Bounty Hunter",r:"Track + Jinada контрит инвиз"},{n:"Slardar",r:"Corrosive Haze снимает Shadow Dance"},{n:"Zeus",r:"Thundergod's Wrath бьёт сквозь инвиз"}], items:[{k:"heavens_halberd",n:"Heaven's Halberd",w:"Дизарм в Shadow Dance — он не может атаковать"},{k:"cyclone",n:"Eul's Scepter",w:"Прерывает Shadow Dance реген"},{k:"ghost",n:"Ghost Scepter",w:"Неуязвимость к физическому урону Slark"}], tip:"Slark с Shadow Dance регенерирует невидимо. AoE прерывает реген. Bloodseeker видит его насквозь.", tags:["carry","escape","initiator","roamer"] },
  riki:{ counters:[{n:"Slardar",r:"Corrosive Haze снимает Smoke Screen"},{n:"Bounty Hunter",r:"Track + истинное зрение"},{n:"Zeus",r:"Thundergod бьёт сквозь инвиз"},{n:"Death Prophet",r:"Exorcism бьёт инвиз-цели"},{n:"Spirit Breaker",r:"Charge находит инвиз-героев"}], items:[{k:"ward_sentry",n:"Sentry Ward",w:"Базовый контр инвиза — всегда покупайте"},{k:"gem",n:"Gem of True Sight",w:"Постоянное истинное зрение"},{k:"dust",n:"Dust of Appearance",w:"Пыль при ганке — раскрывает и замедляет"}], tip:"Riki существует только в инвизе. Zeus Thundergod бьёт сквозь инвиз. Gem — высший контр. Никогда не ходите в одиночку.", tags:["carry","escape","nuker"] },
  ursa:{ counters:[{n:"Doom",r:"Doom блокирует Enrage — его главный инструмент"},{n:"Oracle",r:"Fortune's End снимает стаки Fury Swipes"},{n:"Phantom Lancer",r:"Иллюзии разделяют Fury Swipes"},{n:"Naga Siren",r:"Song of the Siren отменяет его инициацию"},{n:"Medusa",r:"Stone Gaze даёт время убежать"}], items:[{k:"black_king_bar",n:"BKB",w:"BKB блокирует большинство CC на него"},{k:"heavens_halberd",n:"Heaven's Halberd",w:"Дизарм — без атак он ничто"},{k:"cyclone",n:"Eul's Scepter",w:"Кайтинг — Fury Swipes сбрасывается при дистанции"}], tip:"Ursa убивает за секунды с Fury Swipes. Кайтинг — лучшая защита. Oracle снимает стаки Fury Swipes.", tags:["carry","jungler","burst"] },
  troll_warlord:{ counters:[{n:"Doom",r:"Doom блокирует Battle Trance"},{n:"Silencer",r:"Global Silence прерывает Battle Trance"},{n:"Bane",r:"Nightmare/Fiend's Grip лочит его"},{n:"Legion Commander",r:"Duel против его высокого DPS"},{n:"Necrophos",r:"Death Pulse с большой дальностью"}], items:[{k:"heavens_halberd",n:"Heaven's Halberd",w:"Дизарм на 4 сек — Battle Trance бесполезен"},{k:"black_king_bar",n:"BKB",w:"BKB против его CC и Bash"},{k:"sheepstick",n:"Scythe of Vyse",w:"Hex прерывает Battle Trance"}], tip:"Troll с Battle Trance = смерть команде. Heaven's Halberd дизармит и спасает всю команду.", tags:["carry","pusher","disabler"] },
  doom_bringer:{ counters:[{n:"Linken's Sphere",r:"Блокирует Doom — его единственный ключевой спелл"},{n:"Nullifier",r:"Снимает Doom с союзника"},{n:"Oracle",r:"Fortune's End снимает Doom"},{n:"Abaddon",r:"Aphotic Shield снимает Doom"},{n:"Kaolin",r:"Земляной Дух разрывает Doom"}], items:[{k:"sphere",n:"Linken's Sphere",w:"Блокирует Doom — его единственный сильный спелл"},{k:"nullifier",n:"Nullifier",w:"Снимает Doom с союзника (развеивает)"},{k:"black_king_bar",n:"BKB",w:"BKB делает вас иммунным к Doom"}], tip:"Doom блокирует ВСЕ способности. Linken нейтрализует его полностью. Убивайте его первым в командных боях.", tags:["carry","initiator","disabler","jungler"] },
  luna:{ counters:[{n:"Nyx Assassin",r:"Carapace отражает Lucent Beam"},{n:"Puck",r:"Phase Shift уходит от Eclipse"},{n:"Storm Spirit",r:"Высокая мобильность для побега"},{n:"Anti-Mage",r:"Mana Void убивает её ман-пул"},{n:"Phantom Lancer",r:"Иллюзии контрят её AoE ульт"}], items:[{k:"black_king_bar",n:"BKB",w:"Иммунитет к CC и ауре"},{k:"force_staff",n:"Force Staff",w:"Разбегайтесь — её ульт AoE убийственен"},{k:"hood",n:"Hood of Defiance",w:"Снижает магический урон её Lucent Beam"}], tip:"Luna хрупка. Давление в ранней игре убивает её сноуболл. Держитесь рассредоточенно в командных боях.", tags:["carry","pusher","nuker"] },
  lina:{ counters:[{n:"Pugna",r:"Decrepify не даёт ей атаковать физически"},{n:"Rubick",r:"Крадёт Dragon Slave или Laguna Blade"},{n:"Anti-Mage",r:"Mana Void убивает её ман-пул"},{n:"Silencer",r:"Int Steal + Global Silence"},{n:"BKB heroes",r:"BKB нейтрализует весь её урон"}], items:[{k:"black_king_bar",n:"BKB",w:"Иммунитет к Stun, Dragon Slave и Laguna Blade"},{k:"sphere",n:"Linken's Sphere",w:"Блокирует Laguna Blade — её главный бурст"},{k:"cyclone",n:"Eul's Scepter",w:"Уходите от её комбо — она хрупка"}], tip:"Lina — стеклянная пушка. BKB — лучший контр. Rubick крадёт Laguna Blade. Атакуйте её агрессивно в ранней игре.", tags:["nuker","support","carry","disabler"] },
  lion:{ counters:[{n:"BKB heroes",r:"BKB нейтрализует весь его набор"},{n:"Linken's Sphere heroes",r:"Linken блокирует Hex или Earth Spike"},{n:"Faceless Void",r:"Chrono изолирует его в командном бою"},{n:"Anti-Mage",r:"Mana Void убивает его"},{n:"Silencer",r:"Global Silence + Int Steal"}], items:[{k:"black_king_bar",n:"BKB",w:"Иммунитет к Hex и Earth Spike"},{k:"sphere",n:"Linken's Sphere",w:"Блокирует Hex или Earth Spike"},{k:"blink",n:"Blink Dagger",w:"Blink прямо в него — он хрупок и беззащитен"}], tip:"Lion — CC-бурст саппорт. BKB блокирует весь его набор. Агрессивный прыжок убивает его мгновенно.", tags:["support","disabler","nuker","roamer"] },
  zeus:{ counters:[{n:"Silencer",r:"Global Silence прерывает его цепочку"},{n:"Anti-Mage",r:"Mana Void убивает его"},{n:"Pugna",r:"Nether Ward наказывает за каждый спелл"},{n:"Bloodseeker",r:"Rupture + глобальный урон убивает"},{n:"Storm Spirit",r:"Высокая мобильность уходить от Arc Lightning"}], items:[{k:"black_king_bar",n:"BKB",w:"Иммунитет к Chain Lightning и Thundergod's Wrath"},{k:"sphere",n:"Linken's Sphere",w:"Блокирует один его спелл"},{k:"cyclone",n:"Eul's Scepter",w:"В воздухе не получаете урон от Thundergod's Wrath"}], tip:"Zeus наносит глобальный урон. BKB блокирует Thundergod's Wrath. Он хрупок — атакуйте агрессивно.", tags:["nuker","support"] },
  spectre:{ counters:[{n:"Doom",r:"Doom блокирует Haunt и все способности"},{n:"Pugna",r:"Decrepify лишает её физических атак"},{n:"Ancient Apparition",r:"Отменяет Dispersion реген"},{n:"Bloodseeker",r:"Rupture убивает её через Haunt"},{n:"Silencer",r:"Global Silence прерывает Reality"}], items:[{k:"diffusal_blade",n:"Diffusal Blade",w:"Жжёт ману — лишает Haunt"},{k:"cyclone",n:"Eul's Scepter",w:"Прерывает Reality — её ключевую атаку"},{k:"black_king_bar",n:"BKB",w:"BKB против её урона и CC"}], tip:"Spectre убивает одиночек через Desolate. ВСЕГДА держитесь вместе — Haunt опасен только по разделённой команде.", tags:["carry","escape","durable"] },
  meepo:{ counters:[{n:"Earthshaker",r:"Echo Slam множится на все копии"},{n:"Leshrac",r:"Pulse Nova + Diabolic Edict по всем копиям"},{n:"Warlock",r:"Upheaval + Fatal Bonds по всем копиям"},{n:"Jakiro",r:"Macropyre горит по всем копиям"},{n:"Bane",r:"Nightmare основного убивает всю армию"}], items:[{k:"radiance",n:"Radiance",w:"Горение на все копии одновременно"},{k:"mjollnir",n:"Mjollnir",w:"Chain Lightning множится на всех Meepo"},{k:"sheepstick",n:"Scythe of Vyse",w:"Hex основного Meepo убивает всех копий"}], tip:"Meepo — все копии умирают вместе. Earthshaker Echo Slam множится. Bane Nightmare основного убивает армию.", tags:["carry","escape","initiator","jungler"] },
  bloodseeker:{ counters:[{n:"Omniknight",r:"Divine Favor снимает Rupture"},{n:"Oracle",r:"Fortune's End снимает Rupture"},{n:"Abaddon",r:"Aphotic Shield снимает Rupture"},{n:"Naga Siren",r:"Song не даёт ему Rupture-инициацию"},{n:"Io",r:"Tether + Relocate спасают цель Rupture"}], items:[{k:"black_king_bar",n:"BKB",w:"BKB блокирует Rupture полностью"},{k:"force_staff",n:"Force Staff",w:"Переносит союзника без движения — нет урона"},{k:"cyclone",n:"Eul's Scepter",w:"В воздухе нет движения = нет урона от Rupture"}], tip:"Rupture убивает при движении. Стойте на месте! Omniknight Divine Favor снимает Rupture.", tags:["carry","jungler","nuker","disabler"] },
};

/* ═══════════════════════════════════════════════════════════
   МЕТА СБОРКИ
═══════════════════════════════════════════════════════════ */
const META_BUILDS = {
  antimage: {
    desc: "Классическая сборка керри на Anti-Mage. Фокус на быстром фарме и Mana Void.",
    early:  [{k:"boots",n:"Сапоги"},{k:"quelling_blade",n:"Секира"},{k:"poor_mans_shield",n:"Щит бедняка"},{k:"wraith_band",n:"Браслет призрака"}],
    core:   [{k:"battle_fury",n:"Battle Fury"},{k:"manta",n:"Manta Style"},{k:"abyssal_blade",n:"Abyssal Blade"}],
    lux:    [{k:"skadi",n:"Eye of Skadi"},{k:"butterfly",n:"Butterfly"},{k:"heart",n:"Heart of Tarrasque"}],
    neutral:[{k:"titan_sliver",n:"Titan Sliver"},{k:"paladin_sword",n:"Paladin Sword"},{k:"mirror_shield",n:"Mirror Shield"}],
    tip: "Фармите Battle Fury до 15–18 минут. Никогда не инициируйте — ждите Mana Void при 0 мане врага.",
    wr: "47.8%",
  },
  phantom_assassin: {
    desc: "Агрессивный керри с ранней инициацией. Акцент на критических ударах.",
    early:  [{k:"wraith_band",n:"Браслет призрака"},{k:"orb_of_venom",n:"Orb of Venom"},{k:"phase_boots",n:"Phase Boots"}],
    core:   [{k:"bfury",n:"Battle Fury"},{k:"desolator",n:"Desolator"},{k:"black_king_bar",n:"BKB"}],
    lux:    [{k:"monkey_king_bar",n:"MKB"},{k:"abyssal_blade",n:"Abyssal Blade"},{k:"satanic",n:"Satanic"}],
    neutral:[{k:"broom_handle",n:"Broom Handle"},{k:"lance_of_pursuit",n:"Lance of Pursuit"},{k:"ninja_gear",n:"Ninja Gear"}],
    tip: "Desolator даёт огромный burst damage при Critical Strike. MKB против уклонений обязателен.",
    wr: "50.2%",
  },
  invoker: {
    desc: "Ульт Invoker — Exort-стиль. Максимальный урон через Sun Strike + Meteor + EMP.",
    early:  [{k:"null_talisman",n:"Null Talisman"},{k:"null_talisman",n:"Null Talisman"},{k:"boots",n:"Сапоги"}],
    core:   [{k:"blink",n:"Blink Dagger"},{k:"aghanims_scepter",n:"Aghanim's Scepter"},{k:"octarine_core",n:"Octarine Core"}],
    lux:    [{k:"refresher",n:"Refresher Orb"},{k:"sheepstick",n:"Scythe of Vyse"},{k:"ethereal_blade",n:"Ethereal Blade"}],
    neutral:[{k:"ceremonial_robe",n:"Ceremonial Robe"},{k:"timeless_relic",n:"Timeless Relic"},{k:"book_of_shadows",n:"Book of Shadows"}],
    tip: "Combo: Sun Strike → Meteor → Chaos Meteor → Cold Snap → EMP. Blink открывает все инициации.",
    wr: "52.1%",
  },
  juggernaut: {
    desc: "Универсальный керри. Omnislash и Blade Fury дают отличный burst и escape.",
    early:  [{k:"phase_boots",n:"Phase Boots"},{k:"wraith_band",n:"Браслет призрака"},{k:"magic_wand",n:"Magic Wand"}],
    core:   [{k:"battlefury",n:"Battle Fury"},{k:"manta",n:"Manta Style"},{k:"black_king_bar",n:"BKB"}],
    lux:    [{k:"butterfly",n:"Butterfly"},{k:"abyssal_blade",n:"Abyssal Blade"},{k:"skadi",n:"Eye of Skadi"}],
    neutral:[{k:"broom_handle",n:"Broom Handle"},{k:"lance_of_pursuit",n:"Lance"},{k:"mirror_shield",n:"Mirror Shield"}],
    tip: "Battle Fury даёт AoE урон Omnislash. Manta создаёт иллюзии во время Blade Fury.",
    wr: "49.8%",
  },
  pudge: {
    desc: "Агрессивный роумер/инициатор. Акцент на HP и Rot урон.",
    early:  [{k:"tango",n:"Tango"},{k:"clarity",n:"Clarity"},{k:"gauntlets",n:"Gauntlets"}],
    core:   [{k:"blink",n:"Blink Dagger"},{k:"hood",n:"Hood of Defiance"},{k:"blade_mail",n:"Blade Mail"}],
    lux:    [{k:"heart",n:"Heart of Tarrasque"},{k:"shivas_guard",n:"Shiva's Guard"},{k:"eternal_shroud",n:"Eternal Shroud"}],
    neutral:[{k:"faded_broach",n:"Faded Broach"},{k:"cloak_of_flames",n:"Cloak of Flames"},{k:"martyrs_plate",n:"Martyr's Plate"}],
    tip: "Blink + Hook = стандартная инициация. Blade Mail убивает любого, кто стоит в Rot.",
    wr: "51.5%",
  },
};

function getBuildForHero(heroName) {
  const key = heroName.replace('npc_dota_hero_','').toLowerCase();
  return META_BUILDS[key] || null;
}

/* ═══════════════════════════════════════════════════════════
   АЛГОРИТМ АНАЛИЗА ДРАФТА
═══════════════════════════════════════════════════════════ */
const HERO_PROFILE = {
  // Уязвимости и угрозы [тип_угрозы, вес]
  axe:              { threats:["initiator","aoe","disabler"], weak:["magic","kite","split"] },
  bristleback:      { threats:["durable","carry","push"],      weak:["silver_edge","magic_burst","aoe"] },
  phantom_assassin: { threats:["carry","burst","escape"],      weak:["mkb","disarm","aoe"] },
  anti_mage:        { threats:["carry","hard_carry","escape"],  weak:["magic","mana_burn","early_pressure"] },
  invoker:          { threats:["nuker","disabler","pusher"],    weak:["silence","hex","bkb"] },
  pudge:            { threats:["initiator","disabler"],        weak:["kite","bkb","blade_mail"] },
  phantom_lancer:   { threats:["carry","pusher","illusions"],  weak:["aoe","radiance","splash"] },
  storm_spirit:     { threats:["carry","escape","nuker"],      weak:["silence","mana_burn","hex"] },
  earthshaker:      { threats:["initiator","disabler","aoe"],  weak:["bkb","spread","rubick"] },
  faceless_void:    { threats:["carry","initiator","disabler"],weak:["bkb","rubick","split"] },
  slark:            { threats:["carry","escape","roamer"],     weak:["aoe","true_sight","disarm"] },
  riki:             { threats:["carry","escape","assassin"],   weak:["true_sight","aoe","gem"] },
  ursa:             { threats:["carry","burst","jungler"],     weak:["kite","doom","disarm"] },
  troll_warlord:    { threats:["carry","pusher"],              weak:["disarm","hex","doom"] },
  doom_bringer:     { threats:["initiator","disabler","carry"],weak:["linken","nullifier","bkb"] },
  luna:             { threats:["carry","pusher","nuker"],      weak:["early_pressure","kite","magic"] },
  lina:             { threats:["nuker","carry","support"],     weak:["bkb","linken","gap_close"] },
  lion:             { threats:["support","disabler","nuker"],  weak:["bkb","linken","gap_close"] },
  zeus:             { threats:["nuker","support"],             weak:["bkb","linken","gap_close"] },
  spectre:          { threats:["carry","durable","escape"],    weak:["diffusal","doom","split_push"] },
  meepo:            { threats:["carry","initiator","jungler"], weak:["aoe","hex","echo_slam"] },
  bloodseeker:      { threats:["carry","jungler","disabler"],  weak:["bkb","dispel","linken"] },
};

function analyzeEnemyTeam(enemyHeroes) {
  const threats = { aoe:0, disabler:0, carry:0, initiator:0, magic:0, physical:0, escape:0, durable:0 };
  const weaknesses = {};
  const enemyTags = [];

  enemyHeroes.forEach(h => {
    const npc = h.name.replace('npc_dota_hero_','');
    const prof = HERO_PROFILE[npc];
    if (prof) {
      prof.threats.forEach(t => {
        if (threats[t] !== undefined) threats[t]++;
        enemyTags.push(t);
      });
      prof.weak.forEach(w => {
        weaknesses[w] = (weaknesses[w]||0) + 1;
      });
    }
    // Attribute-based threats
    if (h.primary_attr === 'str') threats.physical++;
    if (h.primary_attr === 'int') threats.magic++;
    if (h.roles?.includes('Carry')) threats.carry++;
    if (h.roles?.includes('Initiator')) threats.initiator++;
    if (h.roles?.includes('Escape')) threats.escape++;
    if (h.roles?.includes('Durable')) threats.durable++;
  });

  // Top weaknesses sorted
  const sortedWeaknesses = Object.entries(weaknesses).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // Score heroes from knowledge base
  const scores = [];
  Object.entries(KB).forEach(([key, data]) => {
    if (!data.tags) return;
    let score = 0;
    const reasons = [];

    // Check if this hero counters enemy weaknesses
    if (weaknesses.aoe       && data.tags.includes('aoe'))      { score += weaknesses.aoe * 25;       reasons.push('AoE урон по вражескому составу'); }
    if (weaknesses.silence   && data.tags.includes('nuker'))     { score += 20; reasons.push('Высокий нюк-урон против данного врага'); }
    if (weaknesses.kite      && data.tags.includes('escape'))    { score += weaknesses.kite * 20;      reasons.push('Кайтинг вражеских керри'); }
    if (weaknesses.disarm    && data.tags.includes('disabler'))  { score += weaknesses.disarm * 22;    reasons.push('Контроль вражеских физических дамагеров'); }
    if (weaknesses.true_sight&& data.tags.includes('initiator')) { score += 15; reasons.push('Инициация на разделённых врагах'); }
    if (weaknesses.magic_burst&&data.tags.includes('nuker'))     { score += weaknesses.magic_burst*20; reasons.push('Магический бурст против уязвимости'); }
    if (weaknesses.early_pressure&&data.tags.includes('disabler')){ score += 18; reasons.push('Ранее давление на вражеского керри'); }

    // Check if this hero counters common enemy threats
    if (threats.aoe >= 2     && data.tags.includes('escape'))   { score += 20; reasons.push('Мобильность против AoE'); }
    if (threats.initiator>=2 && data.tags.includes('durable'))  { score += 18; reasons.push('Высокая выживаемость против инициаторов'); }
    if (threats.magic >= 2   && data.tags.includes('carry'))    { score += 15; reasons.push('Физический урон обходит магическую защиту'); }
    if (threats.carry >= 2   && data.tags.includes('disabler')) { score += 22; reasons.push('Контроль вражеских керри'); }
    if (threats.escape >= 2  && data.tags.includes('nuker'))    { score += 18; reasons.push('Быстрый бурст до побега врагов'); }

    // Random base score variation for diversity
    score += Math.random() * 10;

    if (score > 15 && reasons.length > 0) {
      scores.push({ key, score, reasons: reasons.slice(0,3) });
    }
  });

  scores.sort((a,b)=>b.score-a.score);
  return { threats, weaknesses: sortedWeaknesses, topPicks: scores.slice(0,3) };
}

/* ═══════════════════════════════════════════════════════════
   СОСТОЯНИЕ ПРИЛОЖЕНИЯ
═══════════════════════════════════════════════════════════ */
const State = {
  heroes:     [],
  heroStats:  {},
  items:      [],
  loaded:     { heroes:false, stats:false, items:false },
  activeTab:  'heroes',
  heroFilter: 'all',
  heroQuery:  '',
  itemQuery:  '',
  itemType:   'all',
  buildHero:  null,
  buildQuery: '',
  draft:      { enemies:[], searchQuery:'' },
  modal:      { hero:null, tab:'counters' },
};

/* ═══════════════════════════════════════════════════════════
   УТИЛИТЫ
═══════════════════════════════════════════════════════════ */
const $   = id => document.getElementById(id);
const esc = s  => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function heroImg(npcName) {
  return CDN_HERO + npcName.replace('npc_dota_hero_','') + '.png';
}
function itemImg(key) {
  return CDN_ITEM + key + '.png';
}
function kbKey(npcName) {
  return npcName.replace('npc_dota_hero_','');
}
function getWR(heroId) {
  const s = State.heroStats[heroId];
  if (!s) return null;
  const total = (s['7_pick']||0) + (s['8_pick']||0) + (s['7_pick']||0);
  const totalWins = (s['7_win']||0) + (s['8_win']||0);
  if (!total) return null;
  return ((totalWins / Math.max(total,1)) * 100).toFixed(1);
}
function wrClass(wr) {
  if (!wr) return '';
  const v = parseFloat(wr);
  if (v >= 52) return '';
  if (v >= 48) return 'wr--mid';
  return 'wr--low';
}

/* ═══════════════════════════════════════════════════════════
   API ЗАГРУЗКА
═══════════════════════════════════════════════════════════ */
function setStatus(state, text) {
  const dot  = $('status-dot');
  const stxt = $('status-text');
  dot.className  = 'status-dot ' + state;
  stxt.textContent = text;
}

async function safeFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const r = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function loadData() {
  setStatus('loading', 'Загрузка...');

  try {
    // Parallel load: heroes + heroStats
    const [heroData, statsData] = await Promise.all([
      safeFetch(API.heroes),
      safeFetch(API.heroStats).catch(() => []),
    ]);

    // Deduplicate heroes
    const seen = new Set();
    State.heroes = heroData.filter(h => {
      if (seen.has(h.id) || !h.name) return false;
      seen.add(h.id); return true;
    });

    // Parse hero stats indexed by hero_id
    if (Array.isArray(statsData)) {
      statsData.forEach(s => {
        if (s && s.id) State.heroStats[s.id] = s;
      });
    }

    State.loaded.heroes = true;
    State.loaded.stats  = true;

    // Async load items (non-blocking)
    safeFetch(API.items).then(itemData => {
      State.items = Object.entries(itemData)
        .filter(([k,v]) => v && v.dname && !k.startsWith('recipe_'))
        .map(([k,v]) => ({
          key:     k,
          name:    v.dname,
          img:     itemImg(k),
          cost:    v.cost || 0,
          desc:    v.notes || v.dname,
          neutral: v.neutral_tier !== undefined,
        }))
        .sort((a,b) => a.name.localeCompare(b.name));
      State.loaded.items = true;
      renderItems();
    }).catch(() => {
      State.items = FALLBACK_ITEMS;
      State.loaded.items = true;
      renderItems();
    });

    setStatus('ok', `${State.heroes.length} героев`);
    renderAll();

  } catch (e) {
    console.warn('API error, using fallback:', e);
    State.heroes = FALLBACK_HEROES;
    State.items  = FALLBACK_ITEMS;
    State.loaded.heroes = State.loaded.stats = State.loaded.items = true;
    setStatus('error', 'Офлайн-режим');
    renderAll();
  }
}

/* ═══════════════════════════════════════════════════════════
   РЕНДЕР: ГЕРОИ
═══════════════════════════════════════════════════════════ */
function renderHeroes() {
  const grid  = $('hero-grid');
  const empty = $('hero-empty');
  const meta  = $('heroes-meta');

  if (!State.loaded.heroes) { showHeroSkeletons(); return; }

  const q = State.heroQuery.toLowerCase();
  const list = State.heroes.filter(h => {
    const matchAttr = State.heroFilter === 'all' || h.primary_attr === State.heroFilter;
    const locName   = localizeHero(h.localized_name).toLowerCase();
    const matchQ    = !q || h.localized_name.toLowerCase().includes(q) || locName.includes(q);
    return matchAttr && matchQ;
  });

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    meta.innerHTML = '';
    return;
  }
  empty.style.display = 'none';
  meta.innerHTML = `Показано героев: <strong>${list.length}</strong> из ${State.heroes.length}`;

  grid.innerHTML = list.map((h, i) => {
    const key    = kbKey(h.name);
    const hasKB  = !!KB[key];
    const wr     = getWR(h.id);
    const wrCls  = wrClass(wr);
    const delay  = Math.min(i * 0.015, 0.6);

    return `
    <div class="hero-card" data-id="${h.id}" style="animation-delay:${delay}s" tabindex="0" role="button" aria-label="${esc(localizeHero(h.localized_name))}">
      ${hasKB ? '<div class="hero-card__kb" title="Есть аналитика"></div>' : ''}
      ${wr ? `<div class="hero-card__winrate ${wrCls}" title="Winrate">${wr}%</div>` : ''}
      <img class="hero-card__img" src="${esc(heroImg(h.name))}" alt="${esc(h.localized_name)}" loading="lazy"
           onerror="this.src='${FALLBACK_IMG}'">
      <div class="hero-card__body">
        <div class="hero-card__name">${esc(localizeHero(h.localized_name))}</div>
        <span class="hero-card__attr hero-card__attr--${h.primary_attr}">${localizeAttr(h.primary_attr)}</span>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.hero-card').forEach(card => {
    const open = () => {
      const hero = State.heroes.find(h => h.id === +card.dataset.id);
      if (hero) openHeroModal(hero);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

function showHeroSkeletons(n = 50) {
  $('hero-grid').innerHTML = Array.from({length: n}, (_, i) => `
    <div class="skeleton-card" style="animation-delay:${i*0.012}s">
      <div class="skel skel-img"></div>
      <div class="skel skel-ln" style="margin-top:10px"></div>
      <div class="skel skel-ln s"></div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   РЕНДЕР: ПРЕДМЕТЫ
═══════════════════════════════════════════════════════════ */
function renderItems() {
  const grid = $('item-grid');
  const meta = $('items-meta');

  const q    = State.itemQuery.toLowerCase();
  const type = State.itemType;

  const list = State.items.filter(it => {
    const matchType = type === 'all'
      || (type === 'neutral' && it.neutral)
      || (type === 'regular' && !it.neutral);
    const matchQ = !q || it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
    return matchType && matchQ;
  });

  meta.innerHTML = `Показано предметов: <strong>${list.length}</strong> из ${State.items.length}`;

  grid.innerHTML = list.map((it, i) => `
    <div class="item-card" style="animation-delay:${Math.min(i*0.01,0.5)}s">
      ${it.neutral ? '<span class="item-type-badge badge--neutral">🟡 нейтральный</span>' : ''}
      <img class="item-card__img" src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy"
           onerror="this.style.opacity=.3">
      <div class="item-card__info">
        <div class="item-card__name">${esc(it.name)}</div>
        <div class="item-card__desc">${esc(it.desc || '—')}</div>
        ${it.cost > 0 ? `<div class="item-card__cost">${it.cost} 🪙</div>` : ''}
      </div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   РЕНДЕР: СБОРКИ
═══════════════════════════════════════════════════════════ */
function renderBuildsList() {
  const list = $('builds-hero-list');
  const q    = State.buildQuery.toLowerCase();

  const heroes = State.heroes.filter(h =>
    !q || h.localized_name.toLowerCase().includes(q) ||
    localizeHero(h.localized_name).toLowerCase().includes(q)
  );

  list.innerHTML = heroes.map(h => `
    <div class="builds-hero-item ${State.buildHero?.id === h.id ? 'selected' : ''}" data-id="${h.id}">
      <img src="${esc(heroImg(h.name))}" alt="${esc(h.localized_name)}" loading="lazy"
           onerror="this.style.opacity=.3">
      <span>${esc(localizeHero(h.localized_name))}</span>
    </div>`).join('');

  list.querySelectorAll('.builds-hero-item').forEach(item => {
    item.addEventListener('click', () => {
      const hero = State.heroes.find(h => h.id === +item.dataset.id);
      if (hero) { State.buildHero = hero; renderBuildContent(); renderBuildsList(); }
    });
  });
}

function renderBuildContent() {
  const content = $('builds-content');
  const hero    = State.buildHero;

  if (!hero) {
    content.innerHTML = `
      <div class="builds-placeholder glass-card">
        <div class="placeholder-icon">📋</div>
        <p>Выберите героя слева, чтобы увидеть сборку</p>
      </div>`;
    return;
  }

  const build = getBuildForHero(hero.name);
  const wr    = getWR(hero.id);

  if (!build) {
    content.innerHTML = `
      <div class="glass-card build-panel" style="padding:1.5rem">
        <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem">
          <img src="${esc(heroImg(hero.name))}" style="width:100px;height:56px;border-radius:8px;object-fit:cover">
          <div>
            <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700">${esc(localizeHero(hero.localized_name))}</div>
            <div style="font-size:0.75rem;color:var(--text-3);margin-top:0.3rem">Детальная сборка недоступна в базе. Рекомендуем проверить dotabuff.com</div>
          </div>
        </div>
        <div class="build-tip">
          Стандартный путь: Phase Boots → ситуативные предметы → BKB/Линкен →핵심 damage item.<br>
          Следите за метой на <strong>dotabuff.com</strong> для актуальных сборок.
        </div>
      </div>`;
    return;
  }

  const renderItems = (items) => items.map(it => `
    <div class="build-item">
      <img src="${esc(itemImg(it.k))}" alt="${esc(it.n)}" onerror="this.style.opacity=.3">
      <span class="build-item__name">${esc(it.n)}</span>
    </div>`).join('');

  content.innerHTML = `
    <div class="build-panel glass-card" style="padding:1.5rem">
      <div style="display:flex;gap:1.2rem;align-items:flex-end;margin-bottom:1.2rem;flex-wrap:wrap">
        <img src="${esc(heroImg(hero.name))}" style="width:120px;height:68px;border-radius:8px;object-fit:cover;border:1px solid var(--glass-b)">
        <div style="flex:1">
          <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin-bottom:0.3rem">
            ${esc(localizeHero(hero.localized_name))}
          </div>
          <div style="font-size:0.78rem;color:var(--text-2);margin-bottom:0.5rem">${esc(build.desc)}</div>
          <div class="stat-row">
            ${wr ? `<span class="stat-badge">Винрейт: <span class="badge-wr">${wr}%</span></span>` : ''}
            <span class="stat-badge">Мета: <strong>${build.wr}</strong></span>
          </div>
        </div>
      </div>

      <div class="mb-section">
        <div class="build-section-title">Начало игры</div>
        <div class="build-items-row">${renderItems(build.early)}</div>
      </div>
      <div class="mb-section">
        <div class="build-section-title">Основные предметы</div>
        <div class="build-items-row">${renderItems(build.core)}</div>
      </div>
      <div class="mb-section">
        <div class="build-section-title">Поздняя игра</div>
        <div class="build-items-row">${renderItems(build.lux)}</div>
      </div>
      <div class="mb-section">
        <div class="build-section-title">Нейтральные предметы</div>
        <div class="build-items-row">${renderItems(build.neutral)}</div>
      </div>
      <div class="mb-section">
        <div class="build-section-title">Совет</div>
        <div class="build-tip">${esc(build.tip)}</div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════
   РЕНДЕР: ДРАФТ
═══════════════════════════════════════════════════════════ */
function renderDraftSlots() {
  const slotsEl = $('draft-enemy-slots');
  const maxSlots = 5;

  let html = '';
  for (let i = 0; i < maxSlots; i++) {
    const hero = State.draft.enemies[i];
    if (hero) {
      html += `
        <div class="draft-slot filled" data-slot="${i}">
          <img src="${esc(heroImg(hero.name))}" alt="${esc(hero.localized_name)}">
          <span class="draft-slot__name">${esc(localizeHero(hero.localized_name))}</span>
          <button class="draft-slot__remove" data-slot="${i}" title="Убрать">✕</button>
        </div>`;
    } else {
      html += `
        <div class="draft-slot" data-slot="${i}">
          <span class="draft-slot__empty">+ Добавить героя врага</span>
        </div>`;
    }
  }
  slotsEl.innerHTML = html;

  slotsEl.querySelectorAll('.draft-slot__remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = +btn.dataset.slot;
      State.draft.enemies.splice(idx, 1);
      renderDraftSlots();
      updateAnalyzeBtn();
    });
  });

  updateAnalyzeBtn();
}

function updateAnalyzeBtn() {
  $('btn-analyze').disabled = State.draft.enemies.length === 0;
}

function renderDraftSearch(query) {
  const el = $('draft-search-results');
  if (!query.trim()) { el.innerHTML = ''; return; }

  const q = query.toLowerCase();
  const already = new Set(State.draft.enemies.map(h => h.id));
  const results = State.heroes
    .filter(h => !already.has(h.id) &&
      (h.localized_name.toLowerCase().includes(q) ||
       localizeHero(h.localized_name).toLowerCase().includes(q)))
    .slice(0, 8);

  el.innerHTML = results.map(h => `
    <div class="draft-result-item" data-id="${h.id}">
      <img src="${esc(heroImg(h.name))}" alt="${esc(h.localized_name)}">
      <span>${esc(localizeHero(h.localized_name))}</span>
    </div>`).join('');

  el.querySelectorAll('.draft-result-item').forEach(item => {
    item.addEventListener('click', () => {
      if (State.draft.enemies.length >= 5) return;
      const hero = State.heroes.find(h => h.id === +item.dataset.id);
      if (hero) {
        State.draft.enemies.push(hero);
        $('draft-search').value = '';
        $('draft-search-results').innerHTML = '';
        renderDraftSlots();
      }
    });
  });
}

function renderDraftResult() {
  const resultEl = $('draft-result');
  if (State.draft.enemies.length === 0) {
    resultEl.innerHTML = `
      <div class="draft-placeholder glass-card">
        <div class="placeholder-icon">🎯</div>
        <p>Добавьте хотя бы одного врага и нажмите «Анализировать»</p>
      </div>`;
    return;
  }

  const { threats, weaknesses, topPicks } = analyzeEnemyTeam(State.draft.enemies);

  // Map topPicks to hero objects
  const picksWithHeroes = topPicks.map(p => {
    // Find hero by KB key
    const hero = State.heroes.find(h => h.name.replace('npc_dota_hero_','') === p.key);
    if (!hero) return null;
    return { ...p, hero };
  }).filter(Boolean).slice(0, 3);

  // Threats display
  const threatEntries = Object.entries(threats)
    .filter(([,v]) => v > 0)
    .sort((a,b) => b[1] - a[1])
    .slice(0,6);

  const threatLabels = {
    aoe:       { label:'AoE угроза',      icon:'💥', color:'#ff4757' },
    disabler:  { label:'Контроль (CC)',    icon:'⛓',  color:'#ffd32a' },
    carry:     { label:'Физ. керри',       icon:'⚔',  color:'#5ba8ff' },
    initiator: { label:'Инициаторы',       icon:'🔥',  color:'#ff6b81' },
    magic:     { label:'Маг. урон',        icon:'🔮',  color:'#a29bfe' },
    physical:  { label:'Физ. урон',        icon:'💪',  color:'#fd9644' },
    escape:    { label:'Эскейп',           icon:'💨',  color:'#26de81' },
    durable:   { label:'Живучесть',        icon:'🛡',  color:'#4bcffa' },
  };

  const threatsHtml = threatEntries.map(([k, v]) => {
    const info = threatLabels[k] || { label:k, icon:'❓', color:'var(--text-2)' };
    const pct  = Math.min(100, v * 33);
    return `
      <div class="threat-item">
        <span class="threat-item__icon">${info.icon}</span>
        <span class="threat-item__label">${info.label}</span>
        <span class="threat-item__value" style="color:${info.color}">${v > 1 ? 'Высокая' : 'Средняя'}</span>
      </div>
      <div class="threat-bar" style="background:linear-gradient(to right,${info.color},transparent);width:${pct}%;margin:-0.2rem 0 0.4rem 2.4rem;opacity:.5"></div>`;
  }).join('');

  const weaksHtml = weaknesses.map(([k,v]) => {
    const wlabels = { aoe:'Уязвим к AoE', silence:'Уязвим к молчанию', kite:'Уязвим к кайтингу', disarm:'Уязвим к дизарму', true_sight:'Уязвим к истинному зрению', magic_burst:'Уязвим к маг. бурсту', early_pressure:'Слаб в ранней игре', mkb:'Уязвим к MKB', bkb:'Не контрит BKB', linken:'Уязвим к Linken', hex:'Уязвим к Hex', doom:'Уязвим к Doom', radiance:'Уязвим к Radiance', silver_edge:'Уязвим к Silver Edge', split:'Уязвим к сплит-пушу', rubick:'Уязвим к краже спеллов', echo_slam:'Уязвим к Echo Slam', diffusal:'Уязвим к Diffusal', magic:'Уязвим к магии', mana_burn:'Уязвим к Mana Burn', gap_close:'Уязвим к инициации' };
    return `<span class="stat-badge" style="border-color:rgba(45,139,255,.35)">⚡ ${wlabels[k]||k}</span>`;
  }).join('');

  const picksHtml = picksWithHeroes.length > 0
    ? picksWithHeroes.map((p, idx) => `
      <div class="pick-card" data-id="${p.hero.id}">
        <div class="pick-rank">${String(idx+1).padStart(2,'0')}</div>
        <img src="${esc(heroImg(p.hero.name))}" alt="${esc(p.hero.localized_name)}"
             onerror="this.src='${FALLBACK_IMG}'">
        <div class="pick-hero-name">${esc(localizeHero(p.hero.localized_name))}</div>
        <div class="pick-reasons">
          ${p.reasons.map(r => `<div class="pick-reason">${esc(r)}</div>`).join('')}
        </div>
        <span class="pick-score">Рейтинг: ${Math.round(p.score)}</span>
      </div>`).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-3)">
         Недостаточно данных для точного анализа. Попробуйте добавить больше героев врага.
       </div>`;

  resultEl.innerHTML = `
    <div class="analysis-panel">
      <div class="analysis-threats glass-card">
        <div class="mb-title">Угрозы вражеского состава</div>
        <div class="threat-list">${threatsHtml}</div>
        ${weaknesses.length ? `<div style="margin-top:1rem"><div class="mb-title" style="margin-bottom:0.6rem">Уязвимости врага</div><div class="stat-row">${weaksHtml}</div></div>` : ''}
      </div>

      <div class="picks-section glass-card">
        <div class="mb-title">Рекомендуемые контрпики</div>
        <div class="picks-grid">${picksHtml}</div>
      </div>
    </div>`;

  // Click on pick → open modal
  resultEl.querySelectorAll('.pick-card').forEach(card => {
    card.addEventListener('click', () => {
      const hero = State.heroes.find(h => h.id === +card.dataset.id);
      if (hero) openHeroModal(hero);
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   МОДАЛЬНОЕ ОКНО
═══════════════════════════════════════════════════════════ */
function openHeroModal(hero) {
  State.modal.hero = hero;
  State.modal.tab  = 'counters';

  const key  = kbKey(hero.name);
  const data = KB[key];
  const img  = heroImg(hero.name);
  const wr   = getWR(hero.id);

  $('modal-hero-bg').src       = img;
  $('modal-hero-portrait').src = img;
  $('modal-hero-name').textContent = localizeHero(hero.localized_name);

  // Meta tags
  const metaEl = $('modal-hero-meta');
  metaEl.innerHTML = `
    <span class="hero-card__attr hero-card__attr--${hero.primary_attr}">${localizeAttr(hero.primary_attr)}</span>
    ${wr ? `<span class="stat-pill">Винрейт: <span class="wr-val">${wr}%</span></span>` : ''}`;

  $('modal-hero-roles').textContent = (hero.roles||[]).map(localizeRole).join(' · ');

  // Stats
  const stats = State.heroStats[hero.id];
  const statsEl = $('modal-hero-stats');
  statsEl.innerHTML = stats ? `
    <div class="stat-pill">Пики: <strong>${((stats['7_pick']||0)+(stats['8_pick']||0)).toLocaleString()}</strong></div>
  ` : '';

  // Activate first modal tab
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.modal-tab[data-mtab="counters"]').classList.add('active');

  renderModalBody('counters', hero, data);

  $('hero-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderModalBody(tab, hero, data) {
  const body = $('modal-body');
  const img  = heroImg(hero.name);

  if (!data) {
    body.innerHTML = `
      <div class="mb-section">
        <div class="mb-title">Информация</div>
        <div class="tip-glass">
          Детальной аналитики по <strong>${esc(localizeHero(hero.localized_name))}</strong> нет в базе знаний.<br>
          Для поиска контрпиков используйте <strong>dotabuff.com</strong> или <strong>opendota.com</strong>.<br>
          Общий совет: BKB нейтрализует большинство CC, Force Staff помогает кайтить, Gem/Sentry — контр инвиза.
        </div>
      </div>`;
    return;
  }

  if (tab === 'counters') {
    body.innerHTML = `
      <div class="mb-section">
        <div class="mb-title">Топ-5 контрпиков</div>
        <ul class="counter-list">
          ${data.counters.map((c, i) => {
            const cHero = State.heroes.find(h => h.localized_name === c.n);
            const cImg  = cHero ? heroImg(cHero.name) : FALLBACK_IMG;
            return `
              <li class="counter-item">
                <span class="counter-num">${String(i+1).padStart(2,'0')}</span>
                <img class="counter-img" src="${esc(cImg)}" alt="${esc(c.n)}" onerror="this.src='${FALLBACK_IMG}'">
                <span class="counter-name">${esc(c.n)}</span>
                <span class="counter-reason">${esc(c.r)}</span>
              </li>`;
          }).join('')}
        </ul>
      </div>
      <div class="mb-section">
        <div class="mb-title">Тактический совет</div>
        <div class="tip-glass">${esc(data.tip)}</div>
      </div>`;

  } else if (tab === 'items-vs') {
    body.innerHTML = `
      <div class="mb-section">
        <div class="mb-title">Предметы против ${esc(localizeHero(hero.localized_name))}</div>
        <div class="items-vs-list">
          ${data.items.map(it => `
            <div class="item-vs-row">
              <img class="item-vs-icon" src="${esc(itemImg(it.k))}" alt="${esc(it.n)}" onerror="this.style.opacity=.3">
              <div class="item-vs-info">
                <div class="item-vs-name">${esc(it.n)}</div>
                <div class="item-vs-why">${esc(it.w)}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

  } else if (tab === 'synergy') {
    // Synergies: heroes that work well WITH the selected hero
    const synergyMap = {
      axe:              ["Crystal Maiden","Earthshaker","Disruptor"],
      bristleback:      ["Ancient Apparition","Bloodseeker","Witch Doctor"],
      phantom_assassin: ["Bloodseeker","Shadow Demon","Magnus"],
      anti_mage:        ["Crystal Maiden","Earthshaker","Io"],
      invoker:          ["Earthshaker","Leshrac","Jakiro"],
      pudge:            ["Clockwerk","Lion","Vengeful Spirit"],
      phantom_lancer:   ["Dark Seer","Magnus","Ancient Apparition"],
      storm_spirit:     ["Magnus","Earthshaker","Jakiro"],
      earthshaker:      ["Phantom Lancer","Warlock","Enigma"],
      faceless_void:    ["Disruptor","Magnus","Leshrac"],
      slark:            ["Io","Dark Seer","Disruptor"],
      riki:             ["Crystal Maiden","Lion","Bounty Hunter"],
      ursa:             ["Io","Warlock","Crystal Maiden"],
      troll_warlord:    ["Io","Warlock","Shadow Demon"],
      doom_bringer:     ["Lina","Zeus","Invoker"],
      luna:             ["Lich","Dark Seer","Earthshaker"],
      lina:             ["Lion","Crystal Maiden","Shadow Demon"],
      lion:             ["Lina","Zeus","Crystal Maiden"],
      zeus:             ["Io","Crystal Maiden","Bloodseeker"],
      spectre:          ["Io","Ancient Apparition","Crystal Maiden"],
      meepo:            ["Dark Seer","Medusa","Necrophos"],
      bloodseeker:      ["Zeus","Axe","Disruptor"],
    };
    const key = kbKey(hero.name);
    const syn = synergyMap[key] || ["Crystal Maiden","Lion","Earthshaker"];

    body.innerHTML = `
      <div class="mb-section">
        <div class="mb-title">Лучшие союзники</div>
        <ul class="counter-list">
          ${syn.map((n, i) => {
            const synHero = State.heroes.find(h => h.localized_name === n);
            const synImg  = synHero ? heroImg(synHero.name) : FALLBACK_IMG;
            return `
              <li class="counter-item">
                <span class="counter-num">${String(i+1).padStart(2,'0')}</span>
                <img class="counter-img" src="${esc(synImg)}" alt="${esc(n)}" onerror="this.src='${FALLBACK_IMG}'">
                <span class="counter-name">${esc(n)}</span>
              </li>`;
          }).join('')}
        </ul>
      </div>
      <div class="mb-section">
        <div class="mb-title">Почему они сочетаются</div>
        <div class="tip-glass">
          Эти герои усиливают сильные стороны <strong>${esc(localizeHero(hero.localized_name))}</strong> и компенсируют слабые.
          Комбинируйте инициацию, CC и урон для максимальной эффективности.
        </div>
      </div>`;
  }
}

/* ═══════════════════════════════════════════════════════════
   РЕНДЕР: ВСЕ
═══════════════════════════════════════════════════════════ */
function renderAll() {
  renderHeroes();
  renderItems();
  renderBuildsList();
  renderBuildContent();
  renderDraftSlots();
}

/* ═══════════════════════════════════════════════════════════
   СОБЫТИЯ
═══════════════════════════════════════════════════════════ */
function initEvents() {

  // ── Навигация по вкладкам ──
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      State.activeTab = tab;
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      document.querySelectorAll('.tab-section').forEach(s => {
        s.classList.toggle('active', s.id === 'tab-' + tab);
      });
      // Lazy renders
      if (tab === 'builds') { renderBuildsList(); renderBuildContent(); }
      if (tab === 'draft')  { renderDraftSlots(); }
    });
  });

  // ── Hero search ──
  let heroTimer;
  $('hero-search').addEventListener('input', e => {
    clearTimeout(heroTimer);
    heroTimer = setTimeout(() => {
      State.heroQuery = e.target.value;
      renderHeroes();
    }, 120);
  });

  // ── Attr filters ──
  document.querySelectorAll('#attr-filters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#attr-filters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      State.heroFilter = chip.dataset.attr;
      renderHeroes();
    });
  });

  // ── Items search ──
  let itemTimer;
  $('item-search').addEventListener('input', e => {
    clearTimeout(itemTimer);
    itemTimer = setTimeout(() => {
      State.itemQuery = e.target.value;
      renderItems();
    }, 120);
  });

  // ── Item type filter ──
  document.querySelectorAll('#item-type-filters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#item-type-filters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      State.itemType = chip.dataset.itype;
      renderItems();
    });
  });

  // ── Builds search ──
  let buildTimer;
  $('build-search').addEventListener('input', e => {
    clearTimeout(buildTimer);
    buildTimer = setTimeout(() => {
      State.buildQuery = e.target.value;
      renderBuildsList();
    }, 100);
  });

  // ── Draft search ──
  let draftTimer;
  $('draft-search').addEventListener('input', e => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      renderDraftSearch(e.target.value);
    }, 100);
  });

  // ── Analyze button ──
  $('btn-analyze').addEventListener('click', () => {
    renderDraftResult();
  });

  // ── Modal tabs ──
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tname = tab.dataset.mtab;
      State.modal.tab = tname;
      if (State.modal.hero) {
        const key  = kbKey(State.modal.hero.name);
        const data = KB[key] || null;
        renderModalBody(tname, State.modal.hero, data);
      }
    });
  });

  // ── Close modal ──
  $('modal-close').addEventListener('click', closeModal);
  $('hero-modal').addEventListener('click', e => {
    if (e.target === $('hero-modal')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function closeModal() {
  $('hero-modal').classList.remove('open');
  document.body.style.overflow = '';
  State.modal.hero = null;
}

/* ═══════════════════════════════════════════════════════════
   FALLBACK DATA
═══════════════════════════════════════════════════════════ */
const FALLBACK_HEROES = [
  {id:1,  localized_name:"Anti-Mage",         name:"antimage",           primary_attr:"agi",       roles:["Carry","Escape"]},
  {id:2,  localized_name:"Axe",               name:"axe",                primary_attr:"str",       roles:["Initiator","Durable","Disabler"]},
  {id:3,  localized_name:"Bane",              name:"bane",               primary_attr:"int",       roles:["Disabler","Support","Nuker"]},
  {id:4,  localized_name:"Bloodseeker",       name:"bloodseeker",        primary_attr:"agi",       roles:["Carry","Jungler","Nuker"]},
  {id:5,  localized_name:"Crystal Maiden",    name:"crystal_maiden",     primary_attr:"int",       roles:["Support","Disabler","Nuker"]},
  {id:6,  localized_name:"Drow Ranger",       name:"drow_ranger",        primary_attr:"agi",       roles:["Carry","Pusher"]},
  {id:7,  localized_name:"Earthshaker",       name:"earthshaker",        primary_attr:"str",       roles:["Initiator","Disabler","Support"]},
  {id:8,  localized_name:"Juggernaut",        name:"juggernaut",         primary_attr:"agi",       roles:["Carry","Pusher"]},
  {id:9,  localized_name:"Mirana",            name:"mirana",             primary_attr:"agi",       roles:["Carry","Support","Escape"]},
  {id:11, localized_name:"Shadow Fiend",      name:"nevermore",          primary_attr:"agi",       roles:["Carry","Nuker"]},
  {id:12, localized_name:"Phantom Lancer",    name:"phantom_lancer",     primary_attr:"agi",       roles:["Carry","Escape"]},
  {id:13, localized_name:"Puck",              name:"puck",               primary_attr:"int",       roles:["Initiator","Disabler","Escape"]},
  {id:14, localized_name:"Pudge",             name:"pudge",              primary_attr:"str",       roles:["Disabler","Initiator","Durable"]},
  {id:15, localized_name:"Razor",             name:"razor",              primary_attr:"agi",       roles:["Carry","Durable","Nuker"]},
  {id:16, localized_name:"Sand King",         name:"sand_king",          primary_attr:"str",       roles:["Initiator","Disabler","Support"]},
  {id:17, localized_name:"Storm Spirit",      name:"storm_spirit",       primary_attr:"int",       roles:["Carry","Initiator","Escape"]},
  {id:18, localized_name:"Sven",              name:"sven",               primary_attr:"str",       roles:["Carry","Initiator","Durable"]},
  {id:19, localized_name:"Tiny",              name:"tiny",               primary_attr:"str",       roles:["Carry","Nuker","Initiator"]},
  {id:20, localized_name:"Vengeful Spirit",   name:"vengefulspirit",     primary_attr:"agi",       roles:["Support","Disabler","Roamer"]},
  {id:21, localized_name:"Windranger",        name:"windrunner",         primary_attr:"int",       roles:["Carry","Support","Disabler"]},
  {id:22, localized_name:"Zeus",              name:"zuus",               primary_attr:"int",       roles:["Nuker","Support"]},
  {id:23, localized_name:"Kunkka",            name:"kunkka",             primary_attr:"str",       roles:["Carry","Disabler","Initiator"]},
  {id:25, localized_name:"Lina",              name:"lina",               primary_attr:"int",       roles:["Carry","Support","Nuker"]},
  {id:26, localized_name:"Lion",              name:"lion",               primary_attr:"int",       roles:["Support","Disabler","Nuker"]},
  {id:27, localized_name:"Shadow Shaman",     name:"shadow_shaman",      primary_attr:"int",       roles:["Support","Pusher","Disabler"]},
  {id:28, localized_name:"Slardar",           name:"slardar",            primary_attr:"str",       roles:["Carry","Initiator","Disabler"]},
  {id:29, localized_name:"Tidehunter",        name:"tidehunter",         primary_attr:"str",       roles:["Initiator","Disabler","Durable"]},
  {id:30, localized_name:"Witch Doctor",      name:"witch_doctor",       primary_attr:"int",       roles:["Support","Nuker","Disabler"]},
  {id:31, localized_name:"Lich",              name:"lich",               primary_attr:"int",       roles:["Support","Nuker","Disabler"]},
  {id:32, localized_name:"Riki",              name:"riki",               primary_attr:"agi",       roles:["Carry","Escape","Nuker"]},
  {id:33, localized_name:"Enigma",            name:"enigma",             primary_attr:"int",       roles:["Initiator","Pusher","Disabler"]},
  {id:34, localized_name:"Tinker",            name:"tinker",             primary_attr:"int",       roles:["Carry","Nuker","Pusher"]},
  {id:35, localized_name:"Sniper",            name:"sniper",             primary_attr:"agi",       roles:["Carry","Nuker"]},
  {id:36, localized_name:"Necrophos",         name:"necrolyte",          primary_attr:"int",       roles:["Carry","Support","Nuker"]},
  {id:37, localized_name:"Warlock",           name:"warlock",            primary_attr:"int",       roles:["Support","Pusher","Disabler"]},
  {id:38, localized_name:"Beastmaster",       name:"beastmaster",        primary_attr:"str",       roles:["Initiator","Disabler","Pusher"]},
  {id:39, localized_name:"Queen of Pain",     name:"queenofpain",        primary_attr:"int",       roles:["Carry","Initiator","Nuker"]},
  {id:40, localized_name:"Venomancer",        name:"venomancer",         primary_attr:"agi",       roles:["Pusher","Support","Nuker"]},
  {id:41, localized_name:"Faceless Void",     name:"faceless_void",      primary_attr:"agi",       roles:["Carry","Initiator","Escape"]},
  {id:42, localized_name:"Wraith King",       name:"skeleton_king",      primary_attr:"str",       roles:["Carry","Durable","Initiator"]},
  {id:43, localized_name:"Death Prophet",     name:"death_prophet",      primary_attr:"int",       roles:["Carry","Pusher","Nuker"]},
  {id:44, localized_name:"Phantom Assassin",  name:"phantom_assassin",   primary_attr:"agi",       roles:["Carry","Escape","Nuker"]},
  {id:45, localized_name:"Pugna",             name:"pugna",              primary_attr:"int",       roles:["Support","Pusher","Nuker"]},
  {id:46, localized_name:"Templar Assassin",  name:"templar_assassin",   primary_attr:"agi",       roles:["Carry","Escape","Nuker"]},
  {id:47, localized_name:"Viper",             name:"viper",              primary_attr:"agi",       roles:["Carry","Durable","Nuker"]},
  {id:48, localized_name:"Luna",              name:"luna",               primary_attr:"agi",       roles:["Carry","Pusher","Nuker"]},
  {id:49, localized_name:"Dragon Knight",     name:"dragon_knight",      primary_attr:"str",       roles:["Carry","Durable","Pusher"]},
  {id:50, localized_name:"Dazzle",            name:"dazzle",             primary_attr:"int",       roles:["Support","Healer","Disabler"]},
  {id:51, localized_name:"Clinkz",            name:"clinkz",             primary_attr:"agi",       roles:["Carry","Escape","Nuker"]},
  {id:52, localized_name:"Omniknight",        name:"omniknight",         primary_attr:"str",       roles:["Support","Durable"]},
  {id:53, localized_name:"Chaos Knight",      name:"chaos_knight",       primary_attr:"str",       roles:["Carry","Escape","Durable"]},
  {id:54, localized_name:"Meepo",             name:"meepo",              primary_attr:"agi",       roles:["Carry","Escape","Initiator"]},
  {id:56, localized_name:"Ogre Magi",         name:"ogre_magi",          primary_attr:"str",       roles:["Support","Durable","Disabler"]},
  {id:57, localized_name:"Undying",           name:"undying",            primary_attr:"str",       roles:["Support","Durable","Nuker"]},
  {id:58, localized_name:"Rubick",            name:"rubick",             primary_attr:"int",       roles:["Support","Disabler","Nuker"]},
  {id:59, localized_name:"Disruptor",         name:"disruptor",          primary_attr:"int",       roles:["Support","Disabler","Nuker"]},
  {id:60, localized_name:"Nyx Assassin",      name:"nyx_assassin",       primary_attr:"agi",       roles:["Escape","Nuker","Disabler"]},
  {id:63, localized_name:"Io",                name:"wisp",               primary_attr:"universal", roles:["Support","Escape"]},
  {id:65, localized_name:"Slark",             name:"slark",              primary_attr:"agi",       roles:["Carry","Escape","Initiator"]},
  {id:66, localized_name:"Medusa",            name:"medusa",             primary_attr:"agi",       roles:["Carry","Durable","Pusher"]},
  {id:67, localized_name:"Troll Warlord",     name:"troll_warlord",      primary_attr:"agi",       roles:["Carry","Pusher"]},
  {id:68, localized_name:"Centaur Warrunner", name:"centaur_warrunner",  primary_attr:"str",       roles:["Initiator","Durable","Disabler"]},
  {id:69, localized_name:"Magnus",            name:"magnataur",          primary_attr:"str",       roles:["Initiator","Disabler","Nuker"]},
  {id:70, localized_name:"Timbersaw",         name:"shredder",           primary_attr:"str",       roles:["Carry","Initiator","Durable"]},
  {id:72, localized_name:"Gyrocopter",        name:"gyrocopter",         primary_attr:"agi",       roles:["Carry","Nuker","Pusher"]},
  {id:74, localized_name:"Invoker",           name:"invoker",            primary_attr:"int",       roles:["Carry","Nuker","Disabler"]},
  {id:75, localized_name:"Silencer",          name:"silencer",           primary_attr:"int",       roles:["Carry","Support","Disabler"]},
  {id:76, localized_name:"Outworld Destroyer",name:"obsidian_destroyer", primary_attr:"int",       roles:["Carry","Nuker","Disabler"]},
  {id:77, localized_name:"Lycan",             name:"lycan",              primary_attr:"str",       roles:["Carry","Pusher","Jungler"]},
  {id:89, localized_name:"Doom",              name:"doom_bringer",       primary_attr:"str",       roles:["Carry","Initiator","Disabler"]},
  {id:90, localized_name:"Ancient Apparition",name:"ancient_apparition", primary_attr:"int",       roles:["Support","Nuker","Disabler"]},
  {id:91, localized_name:"Spirit Breaker",    name:"spirit_breaker",     primary_attr:"str",       roles:["Initiator","Durable","Disabler"]},
  {id:92, localized_name:"Ursa",              name:"ursa",               primary_attr:"agi",       roles:["Carry","Jungler"]},
  {id:93, localized_name:"Morphling",         name:"morphling",          primary_attr:"agi",       roles:["Carry","Escape","Durable"]},
  {id:94, localized_name:"Nature's Prophet",  name:"furion",             primary_attr:"int",       roles:["Carry","Jungler","Pusher"]},
  {id:95, localized_name:"Lifestealer",       name:"life_stealer",       primary_attr:"str",       roles:["Carry","Durable","Jungler"]},
  {id:96, localized_name:"Dark Seer",         name:"dark_seer",          primary_attr:"int",       roles:["Initiator","Disabler","Support"]},
  {id:100,localized_name:"Huskar",            name:"huskar",             primary_attr:"str",       roles:["Carry","Durable","Initiator"]},
  {id:101,localized_name:"Night Stalker",     name:"night_stalker",      primary_attr:"str",       roles:["Carry","Initiator","Durable"]},
  {id:102,localized_name:"Broodmother",       name:"broodmother",        primary_attr:"agi",       roles:["Carry","Escape","Pusher"]},
  {id:103,localized_name:"Bounty Hunter",     name:"bounty_hunter",      primary_attr:"agi",       roles:["Carry","Escape","Nuker"]},
  {id:104,localized_name:"Weaver",            name:"weaver",             primary_attr:"agi",       roles:["Carry","Escape","Nuker"]},
  {id:105,localized_name:"Jakiro",            name:"jakiro",             primary_attr:"int",       roles:["Support","Nuker","Pusher"]},
  {id:106,localized_name:"Batrider",          name:"batrider",           primary_attr:"int",       roles:["Initiator","Disabler","Nuker"]},
  {id:108,localized_name:"Spectre",           name:"spectre",            primary_attr:"agi",       roles:["Carry","Escape","Durable"]},
  {id:111,localized_name:"Clockwerk",         name:"rattletrap",         primary_attr:"str",       roles:["Initiator","Durable","Disabler"]},
  {id:112,localized_name:"Leshrac",           name:"leshrac",            primary_attr:"int",       roles:["Carry","Support","Pusher","Nuker"]},
  {id:119,localized_name:"Marci",             name:"marci",              primary_attr:"universal", roles:["Support","Disabler","Initiator"]},
  {id:120,localized_name:"Primal Beast",      name:"primal_beast",       primary_attr:"universal", roles:["Initiator","Durable","Disabler"]},
  {id:121,localized_name:"Muerta",            name:"muerta",             primary_attr:"int",       roles:["Carry","Support","Nuker"]},
  {id:129,localized_name:"Snapfire",          name:"snapfire",           primary_attr:"universal", roles:["Support","Nuker","Disabler"]},
  {id:135,localized_name:"Dawnbreaker",       name:"dawnbreaker",        primary_attr:"str",       roles:["Support","Initiator","Durable"]},
  {id:136,localized_name:"Hoodwink",          name:"hoodwink",           primary_attr:"agi",       roles:["Support","Nuker","Disabler","Escape"]},
  {id:145,localized_name:"Void Spirit",       name:"void_spirit",        primary_attr:"universal", roles:["Carry","Initiator","Escape","Nuker"]},
  {id:137,localized_name:"Hollow Wings",      name:"hollows_wings",      primary_attr:"int",       roles:["Support","Nuker"]},
];

const FALLBACK_ITEMS = [
  {key:"black_king_bar",   name:"Black King Bar",      img:itemImg("black_king_bar"),   cost:4050, desc:"Даёт иммунитет к магии — блокирует CC, ульты и большинство спеллов", neutral:false},
  {key:"monkey_king_bar",  name:"Monkey King Bar",     img:itemImg("monkey_king_bar"),  cost:4975, desc:"Гарантированные попадания — нейтрализует уклонение и промахи",        neutral:false},
  {key:"orchid",           name:"Orchid Malevolence",  img:itemImg("orchid"),           cost:3475, desc:"Молчание — лишает противника всех заклинаний на 5 секунд",             neutral:false},
  {key:"heavens_halberd",  name:"Heaven's Halberd",    img:itemImg("heavens_halberd"),  cost:3500, desc:"Дизарм — противник не может атаковать; снимает уклонение",             neutral:false},
  {key:"silver_edge",      name:"Silver Edge",         img:itemImg("silver_edge"),      cost:5600, desc:"Прерывает пассивные способности при атаке",                            neutral:false},
  {key:"sphere",           name:"Linken's Sphere",     img:itemImg("sphere"),           cost:4700, desc:"Блокирует один вражеский спелл раз в 12 секунд",                       neutral:false},
  {key:"diffusal_blade",   name:"Diffusal Blade",      img:itemImg("diffusal_blade"),   cost:2500, desc:"Сжигает ману и накладывает замедление через атаки",                    neutral:false},
  {key:"force_staff",      name:"Force Staff",         img:itemImg("force_staff"),      cost:2200, desc:"Мгновенно перемещает союзника или врага на 600 ед.",                   neutral:false},
  {key:"sheepstick",       name:"Scythe of Vyse",      img:itemImg("sheepstick"),       cost:5675, desc:"Hex — превращает врага в животное, полностью нейтрализуя",             neutral:false},
  {key:"blink",            name:"Blink Dagger",        img:itemImg("blink"),            cost:2250, desc:"Мгновенное перемещение на 1200 ед. — инициация или побег",             neutral:false},
  {key:"gem",              name:"Gem of True Sight",   img:itemImg("gem"),              cost:900,  desc:"Постоянное истинное зрение — убивает концепт инвиз-героев",            neutral:false},
  {key:"skadi",            name:"Eye of Skadi",        img:itemImg("skadi"),            cost:5500, desc:"Замедление атак и движения через каждую атаку",                        neutral:false},
  {key:"nullifier",        name:"Nullifier",           img:itemImg("nullifier"),        cost:4700, desc:"Развеивает баффы и молчание — снимает щиты и ульты-баффы",             neutral:false},
  {key:"radiance",         name:"Radiance",            img:itemImg("radiance"),         cost:5050, desc:"AoE горение — урон всем иллюзиям и врагам рядом",                      neutral:false},
  {key:"mjollnir",         name:"Mjollnir",            img:itemImg("mjollnir"),         cost:5600, desc:"Chain Lightning прыгает по нескольким целям",                          neutral:false},
  {key:"cyclone",          name:"Eul's Scepter",       img:itemImg("cyclone"),          cost:2725, desc:"Выбрасывает цель вверх — прерывает каналирование и CC",                neutral:false},
  {key:"ghost",            name:"Ghost Scepter",       img:itemImg("ghost"),            cost:1500, desc:"Неуязвимость к физическому урону на 4 секунды",                        neutral:false},
  {key:"blade_mail",       name:"Blade Mail",          img:itemImg("blade_mail"),       cost:2100, desc:"Отражает входящий урон обратно — убивает атакующих",                   neutral:false},
  {key:"necronomicon",     name:"Necronomicon",        img:itemImg("necronomicon"),     cost:4700, desc:"Вызывает юнитов с Mana Burn и True Sight",                             neutral:false},
  {key:"ward_sentry",      name:"Sentry Ward",         img:itemImg("ward_sentry"),      cost:50,   desc:"Базовый контр инвиза — невидимые герои и варды видны",                  neutral:false},
  {key:"dust",             name:"Dust of Appearance",  img:itemImg("dust"),             cost:80,   desc:"Раскрывает и замедляет невидимых врагов",                               neutral:false},
  {key:"abyssal_blade",    name:"Abyssal Blade",       img:itemImg("abyssal_blade"),    cost:6250, desc:"Bash + активный стан — прерывает любые действия",                      neutral:false},
  {key:"hood",             name:"Hood of Defiance",    img:itemImg("hood"),             cost:1750, desc:"Снижает магический урон — базовый магрез",                             neutral:false},
  {key:"manta",            name:"Manta Style",         img:itemImg("manta"),            cost:4950, desc:"Создаёт 2 иллюзии, снимает некоторые дебаффы",                         neutral:false},
  {key:"butterfly",        name:"Butterfly",           img:itemImg("butterfly"),        cost:5400, desc:"Уклонение 35% и высокая скорость атаки",                               neutral:false},
  {key:"desolator",        name:"Desolator",           img:itemImg("desolator"),        cost:3500, desc:"Уменьшает броню цели при атаке",                                       neutral:false},
  // Neutral items
  {key:"paladin_sword",    name:"Paladin Sword",       img:itemImg("paladin_sword"),    cost:0,    desc:"Нейтральный: лайфстил и урон",                                         neutral:true},
  {key:"ninja_gear",       name:"Ninja Gear",          img:itemImg("ninja_gear"),       cost:0,    desc:"Нейтральный: скорость и уклонение",                                    neutral:true},
  {key:"mirror_shield",    name:"Mirror Shield",       img:itemImg("mirror_shield"),    cost:0,    desc:"Нейтральный: блокирует спеллы",                                        neutral:true},
  {key:"timeless_relic",   name:"Timeless Relic",      img:itemImg("timeless_relic"),   cost:0,    desc:"Нейтральный: усиливает все заклинания",                                neutral:true},
];

/* ═══════════════════════════════════════════════════════════
   ИНИЦИАЛИЗАЦИЯ
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  showHeroSkeletons();
  loadData();
});
