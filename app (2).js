/**
 * ============================================================
 * DOTAASIS ULTIMATE ANALYTICS — app.js
 * Patch 7.41a | Production Core
 * Sources: OpenDota API, Steam/Valve Dota 2 API
 * ============================================================
 */

'use strict';

// ============================================================
// 1. API CONFIG
// ============================================================
const OPENDOTA_BASE = 'https://api.opendota.com/api';
const STEAM_API_BASE = 'https://api.steampowered.com';
const DOTA2_APP_ID = 570;

const API = {
  heroes: () => `${OPENDOTA_BASE}/heroes`,
  heroStats: () => `${OPENDOTA_BASE}/heroStats`,
  heroMatchups: (heroId) => `${OPENDOTA_BASE}/heroes/${heroId}/matchups`,
  publicMatches: (params = '') => `${OPENDOTA_BASE}/publicMatches?${params}`,
  proMatches: () => `${OPENDOTA_BASE}/proMatches`,
  metaStats: () => `${OPENDOTA_BASE}/heroStats`,
  items: () => `${OPENDOTA_BASE}/constants/items`,
  abilities: () => `${OPENDOTA_BASE}/constants/abilities`,
  steamGetHeroes: (key) =>
    `${STEAM_API_BASE}/IEconDOTA2_570/GetHeroes/v1/?key=${key}&language=ru`,
};

async function fetchAPI(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`[DOTAASIS] API error: ${url}`, e.message);
    return null;
  }
}

// ============================================================
// 2. HEROES DATABASE (полный ростер патч 7.41a)
// ============================================================
const HEROES = {
  abaddon: {
    id: 102,
    name: 'Abaddon',
    localName: 'Абаддон',
    roles: ['support', 'hard_support', 'offlane'],
    types: ['healer', 'tank', 'disabler', 'support'],
    mechanics: ['shield', 'heal', 'magic_damage', 'aura', 'passive_reset', 'dispel'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  alchemist: {
    id: 73,
    name: 'Alchemist',
    localName: 'Алхимик',
    roles: ['carry', 'mid'],
    types: ['carry', 'tank', 'pusher', 'nuker'],
    mechanics: ['stun', 'slow', 'gold_gain', 'chemical', 'melee_carry', 'bash'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  ancient_apparition: {
    id: 68,
    name: 'Ancient Apparition',
    localName: 'Древний Ап',
    roles: ['support', 'hard_support'],
    types: ['nuker', 'disabler', 'support'],
    mechanics: ['magic_damage', 'slow', 'anti_heal', 'global_ult', 'freeze'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 0,
  },
  anti_mage: {
    id: 1,
    name: 'Anti-Mage',
    localName: 'Антимаг',
    roles: ['carry'],
    types: ['carry', 'escape', 'nuker'],
    mechanics: ['mana_break', 'blink', 'magic_immunity', 'illusions', 'spell_shield'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  arc_warden: {
    id: 113,
    name: 'Arc Warden',
    localName: 'Арк Варден',
    roles: ['carry', 'mid'],
    types: ['carry', 'pusher', 'nuker'],
    mechanics: ['clone', 'trap', 'magic_damage', 'slow', 'ranged_carry'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  axe: {
    id: 2,
    name: 'Axe',
    localName: 'Акс',
    roles: ['offlane'],
    types: ['initiator', 'disabler', 'tank', 'durable'],
    mechanics: ['taunt', 'counter_helix', 'berserk_call', 'armor_reduction', 'execute'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  bane: {
    id: 5,
    name: 'Bane',
    localName: 'Бейн',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'support'],
    mechanics: ['sleep', 'silence', 'nightmare', 'drain', 'root', 'disable'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 6,
  },
  batrider: {
    id: 65,
    name: 'Batrider',
    localName: 'Батрайдер',
    roles: ['mid', 'offlane'],
    types: ['initiator', 'disabler', 'nuker', 'escape'],
    mechanics: ['lasso', 'fire_damage', 'magic_damage', 'mobility', 'aoe_slow'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  beastmaster: {
    id: 38,
    name: 'Beastmaster',
    localName: 'Бeastmaster',
    roles: ['offlane'],
    types: ['initiator', 'disabler', 'pusher', 'durable'],
    mechanics: ['aura', 'summons', 'silence', 'hawk_vision', 'leap', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  bloodseeker: {
    id: 41,
    name: 'Bloodseeker',
    localName: 'Кровопийца',
    roles: ['carry', 'mid', 'offlane'],
    types: ['carry', 'nuker', 'disabler', 'jungler'],
    mechanics: ['silence', 'slow', 'blood_rage', 'rupture', 'heal', 'mobility'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  bounty_hunter: {
    id: 61,
    name: 'Bounty Hunter',
    localName: 'Бегун',
    roles: ['support', 'carry'],
    types: ['carry', 'support', 'escape', 'disabler'],
    mechanics: ['invisibility', 'track', 'physical_damage', 'bash', 'gold_bonus'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  brewmaster: {
    id: 78,
    name: 'Brewmaster',
    localName: 'Пивовар',
    roles: ['offlane'],
    types: ['initiator', 'disabler', 'durable', 'nuker'],
    mechanics: ['cyclone', 'primal_split', 'fire_storm', 'earth_stun', 'purna_slow'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  bristleback: {
    id: 99,
    name: 'Bristleback',
    localName: 'Бристлбэк',
    roles: ['offlane'],
    types: ['tank', 'durable', 'nuker', 'disabler'],
    mechanics: ['quill_spray', 'viscous_nasal', 'physical_damage', 'slow', 'damage_reduction'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  broodmother: {
    id: 61,
    name: 'Broodmother',
    localName: 'Мамочка',
    roles: ['mid', 'offlane'],
    types: ['carry', 'pusher', 'escape', 'nuker'],
    mechanics: ['web', 'summons', 'spiders', 'physical_damage', 'poison', 'invisibility'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 8,
  },
  centaur_warrunner: {
    id: 96,
    name: 'Centaur Warrunner',
    localName: 'Центавр',
    roles: ['offlane'],
    types: ['initiator', 'tank', 'durable', 'disabler'],
    mechanics: ['stamp', 'double_edge', 'retaliate', 'blink', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  chaos_knight: {
    id: 81,
    name: 'Chaos Knight',
    localName: 'Хаос Найт',
    roles: ['carry'],
    types: ['carry', 'durable', 'disabler', 'initiator'],
    mechanics: ['blink_stun', 'illusions', 'chaos_bolt', 'physical_damage', 'armor_reduction'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  chen: {
    id: 66,
    name: 'Chen',
    localName: 'Чен',
    roles: ['support', 'hard_support'],
    types: ['support', 'healer', 'pusher', 'jungler', 'disabler'],
    mechanics: ['holy_persuasion', 'creep_convert', 'heal', 'penitence', 'divine_favor'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  clinkz: {
    id: 56,
    name: 'Clinkz',
    localName: 'Клинц',
    roles: ['carry', 'mid'],
    types: ['carry', 'escape', 'nuker', 'disabler'],
    mechanics: ['invisibility', 'skeleton_summons', 'fire_arrows', 'physical_damage', 'silence'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  clockwerk: {
    id: 51,
    name: 'Clockwerk',
    localName: 'Клоквёрк',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'durable', 'support'],
    mechanics: ['hookshot', 'cog_trap', 'power_cogs', 'battery_assault', 'silence'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  crystal_maiden: {
    id: 10,
    name: 'Crystal Maiden',
    localName: 'Ледяная Дева',
    roles: ['hard_support'],
    types: ['support', 'disabler', 'nuker', 'healer'],
    mechanics: ['slow', 'freeze', 'magic_damage', 'mana_regen_aura', 'aoe_ult'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  dark_seer: {
    id: 53,
    name: 'Dark Seer',
    localName: 'Тёмный Провидец',
    roles: ['offlane', 'support'],
    types: ['initiator', 'pusher', 'disabler', 'nuker'],
    mechanics: ['vacuum', 'wall_of_replica', 'ion_shell', 'surge', 'illusions', 'aoe'],
    primaryAttr: 'intelligence',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  dark_willow: {
    id: 119,
    name: 'Dark Willow',
    localName: 'Тёмная Ива',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'escape', 'support'],
    mechanics: ['root', 'sleep', 'magic_damage', 'terror', 'shadow_realm', 'evasion'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  dawnbreaker: {
    id: 135,
    name: 'Dawnbreaker',
    localName: 'Рассветница',
    roles: ['support', 'offlane'],
    types: ['initiator', 'healer', 'tank', 'disabler'],
    mechanics: ['global_tp_ult', 'aoe_heal', 'stun', 'physical_damage', 'aura'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  dazzle: {
    id: 50,
    name: 'Dazzle',
    localName: 'Даззл',
    roles: ['support', 'hard_support'],
    types: ['support', 'healer', 'disabler', 'nuker'],
    mechanics: ['save_ult', 'armor_reduction', 'heal', 'weave', 'shadow_wave', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  death_prophet: {
    id: 43,
    name: 'Death Prophet',
    localName: 'Пророк Смерти',
    roles: ['mid', 'offlane'],
    types: ['nuker', 'pusher', 'tank', 'disabler'],
    mechanics: ['silence', 'magic_damage', 'drain_ult', 'ghost_summons', 'aoe'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  disruptor: {
    id: 87,
    name: 'Disruptor',
    localName: 'Дисраптор',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'support'],
    mechanics: ['silence', 'static_storm', 'thunder_strike', 'glimpse', 'kinetic_field', 'aoe'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 4,
  },
  doom: {
    id: 69,
    name: 'Doom',
    localName: 'Дум',
    roles: ['offlane'],
    types: ['disabler', 'tank', 'nuker', 'jungler', 'carry'],
    mechanics: ['silence', 'doom_spell', 'spell_immunity_removal', 'devour', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  dragon_knight: {
    id: 49,
    name: 'Dragon Knight',
    localName: 'Рыцарь Дракон',
    roles: ['mid', 'offlane', 'carry'],
    types: ['carry', 'tank', 'initiator', 'durable', 'disabler'],
    mechanics: ['stun', 'dragon_form', 'fire_breath', 'physical_damage', 'armor'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  drow_ranger: {
    id: 6,
    name: 'Drow Ranger',
    localName: 'Дроу',
    roles: ['carry'],
    types: ['carry', 'disabler', 'nuker'],
    mechanics: ['silence', 'frost_arrows', 'agility_aura', 'marksmanship', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  earth_spirit: {
    id: 107,
    name: 'Earth Spirit',
    localName: 'Дух Земли',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'nuker', 'escape'],
    mechanics: ['stun', 'silence', 'roll', 'magnetize', 'stone_remnants', 'boulder_smash'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  earthshaker: {
    id: 7,
    name: 'Earthshaker',
    localName: 'Эртшейкер',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'nuker'],
    mechanics: ['blink_stun', 'fissure', 'echo_slam', 'stun', 'aoe_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  elder_titan: {
    id: 103,
    name: 'Elder Titan',
    localName: 'Старейший Титан',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'nuker', 'support'],
    mechanics: ['astral_spirit', 'echo_stomp', 'magic_damage', 'armor_reduction', 'aoe'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  ember_spirit: {
    id: 106,
    name: 'Ember Spirit',
    localName: 'Дух Огня',
    roles: ['mid', 'carry'],
    types: ['carry', 'escape', 'nuker', 'disabler'],
    mechanics: ['fire_remnants', 'sleight_of_fist', 'magic_damage', 'searing_chains', 'mobility'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  enchantress: {
    id: 58,
    name: 'Enchantress',
    localName: 'Чаровница',
    roles: ['support', 'hard_support', 'carry'],
    types: ['support', 'healer', 'disabler', 'carry', 'jungler'],
    mechanics: ['enchant', 'creep_convert', 'slow', 'heal', 'nature_attendants', 'physical_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 4,
  },
  enigma: {
    id: 33,
    name: 'Enigma',
    localName: 'Энигма',
    roles: ['offlane', 'support'],
    types: ['initiator', 'disabler', 'nuker', 'jungler', 'pusher'],
    mechanics: ['black_hole', 'midnight_pulse', 'aoe_disable', 'eidolons_summons', 'midnight_pulse'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 0,
  },
  faceless_void: {
    id: 41,
    name: 'Faceless Void',
    localName: 'Войд',
    roles: ['carry'],
    types: ['carry', 'initiator', 'disabler', 'escape'],
    mechanics: ['chronosphere', 'time_walk', 'time_lock', 'bash', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  grimstroke: {
    id: 121,
    name: 'Grimstroke',
    localName: 'Гримстрок',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'support'],
    mechanics: ['silence', 'ink_swell', 'phantom', 'stroke_of_fate', 'root', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 0,
  },
  gyrocopter: {
    id: 72,
    name: 'Gyrocopter',
    localName: 'Гиро',
    roles: ['carry', 'mid'],
    types: ['carry', 'nuker', 'disabler', 'pusher'],
    mechanics: ['flak_cannon', 'homing_missile', 'call_down', 'magic_damage', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 0,
  },
  hoodwink: {
    id: 123,
    name: 'Hoodwink',
    localName: 'Худвинк',
    roles: ['support', 'carry'],
    types: ['disabler', 'nuker', 'escape', 'support'],
    mechanics: ['acorn_shot', 'bushwhack', 'sharpshooter', 'magic_damage', 'slow', 'tree'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 4,
  },
  huskar: {
    id: 59,
    name: 'Huskar',
    localName: 'Хаскар',
    roles: ['carry', 'mid'],
    types: ['carry', 'tank', 'durable', 'nuker', 'disabler'],
    mechanics: ['magic_immunity', 'fire_damage', 'life_break', 'inner_fire', 'low_hp_power'],
    primaryAttr: 'strength',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  invoker: {
    id: 74,
    name: 'Invoker',
    localName: 'Инвокер',
    roles: ['mid', 'carry'],
    types: ['nuker', 'disabler', 'escape', 'carry'],
    mechanics: ['spell_combo', 'meteor', 'tornado', 'cold_snap', 'ghost_walk', 'forge_spirit'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  io: {
    id: 91,
    name: 'Io',
    localName: 'Ио',
    roles: ['hard_support'],
    types: ['support', 'healer', 'carry', 'escape'],
    mechanics: ['tether', 'global_tp', 'heal', 'overcharge', 'spirits'],
    primaryAttr: 'strength',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  jakiro: {
    id: 64,
    name: 'Jakiro',
    localName: 'Джакиро',
    roles: ['support', 'hard_support'],
    types: ['support', 'disabler', 'nuker', 'pusher'],
    mechanics: ['dual_breath', 'ice_path', 'macropyre', 'slow', 'magic_damage', 'aoe'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 0,
  },
  juggernaut: {
    id: 8,
    name: 'Juggernaut',
    localName: 'Джаггернаут',
    roles: ['carry'],
    types: ['carry', 'escape', 'nuker', 'pusher'],
    mechanics: ['omnislash', 'blade_fury', 'spell_immunity', 'healing_ward', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  keeper_of_the_light: {
    id: 90,
    name: 'Keeper of the Light',
    localName: 'КотЛ',
    roles: ['support', 'hard_support'],
    types: ['support', 'nuker', 'disabler', 'healer'],
    mechanics: ['illuminate', 'chakra_magic', 'spirit_form', 'solar_bind', 'mana_restore'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 4,
  },
  kez: {
    id: 145,
    name: 'Kez',
    localName: 'Кез',
    roles: ['carry', 'mid'],
    types: ['carry', 'escape', 'nuker'],
    mechanics: ['raptor_dance', 'phoenix_fire', 'shadow_dance', 'physical_damage', 'agility'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  kunkka: {
    id: 23,
    name: 'Kunkka',
    localName: 'Кунка',
    roles: ['mid', 'offlane', 'carry'],
    types: ['initiator', 'disabler', 'nuker', 'carry', 'durable'],
    mechanics: ['torrent', 'ghostship', 'tidebringer', 'x_marks_the_spot', 'aoe_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  legion_commander: {
    id: 104,
    name: 'Legion Commander',
    localName: 'Легион',
    roles: ['offlane', 'support'],
    types: ['carry', 'initiator', 'disabler', 'durable'],
    mechanics: ['press_the_attack', 'duel', 'overwhelming_odds', 'physical_damage', 'dispel'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  leshrac: {
    id: 52,
    name: 'Leshrac',
    localName: 'Лешрак',
    roles: ['mid', 'support'],
    types: ['nuker', 'disabler', 'pusher', 'initiator'],
    mechanics: ['split_earth', 'diabolic_edict', 'lightning_storm', 'pulse_nova', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  lich: {
    id: 31,
    name: 'Lich',
    localName: 'Лич',
    roles: ['hard_support'],
    types: ['support', 'nuker', 'disabler'],
    mechanics: ['frost_nova', 'chain_frost', 'ice_armor', 'sacrifice', 'slow', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  lifestealer: {
    id: 54,
    name: 'Lifestealer',
    localName: 'Лайфстилер',
    roles: ['carry', 'offlane'],
    types: ['carry', 'tank', 'jungler', 'disabler'],
    mechanics: ['lifesteal', 'open_wounds', 'slow', 'magic_immunity', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  lina: {
    id: 25,
    name: 'Lina',
    localName: 'Лина',
    roles: ['mid', 'support', 'carry'],
    types: ['nuker', 'disabler', 'carry'],
    mechanics: ['stun', 'magic_damage', 'laguna_blade', 'light_strike_array', 'attack_speed_bonus'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  lion: {
    id: 26,
    name: 'Lion',
    localName: 'Лион',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'support'],
    mechanics: ['hex', 'impale', 'mana_drain', 'finger_of_death', 'magic_damage', 'disable'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  lone_druid: {
    id: 80,
    name: 'Lone Druid',
    localName: 'Одинокий Друид',
    roles: ['carry', 'mid', 'offlane'],
    types: ['carry', 'pusher', 'durable', 'nuker'],
    mechanics: ['spirit_bear', 'entangle', 'savage_roar', 'physical_damage', 'summons'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 3,
    legs: 4,
  },
  luna: {
    id: 27,
    name: 'Luna',
    localName: 'Луна',
    roles: ['carry'],
    types: ['carry', 'pusher', 'nuker'],
    mechanics: ['lucent_beam', 'moon_glaives', 'lunar_blessing', 'eclipse', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 4,
  },
  lycan: {
    id: 77,
    name: 'Lycan',
    localName: 'Ликан',
    roles: ['carry', 'offlane'],
    types: ['carry', 'pusher', 'jungler', 'tank', 'disabler'],
    mechanics: ['wolfs_summons', 'howl', 'feral_impulse', 'shapeshift', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  magnus: {
    id: 97,
    name: 'Magnus',
    localName: 'Магнус',
    roles: ['offlane', 'support'],
    types: ['initiator', 'disabler', 'nuker', 'carry'],
    mechanics: ['reverse_polarity', 'empower', 'skewer', 'shockwave', 'aoe_stun'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  marci: {
    id: 136,
    name: 'Marci',
    localName: 'Марси',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'tank', 'escape'],
    mechanics: ['rebound', 'dispose', 'sidekick', 'unleash', 'physical_damage', 'stun'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  mars: {
    id: 129,
    name: 'Mars',
    localName: 'Марс',
    roles: ['offlane'],
    types: ['initiator', 'disabler', 'tank', 'durable'],
    mechanics: ['arena_of_blood', 'spear', 'gods_rebuke', 'bulwark', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  medusa: {
    id: 94,
    name: 'Medusa',
    localName: 'Медуза',
    roles: ['carry'],
    types: ['carry', 'tank', 'durable', 'disabler'],
    mechanics: ['stone_gaze', 'mana_shield', 'split_shot', 'mystic_snake', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 4,
  },
  meepo: {
    id: 82,
    name: 'Meepo',
    localName: 'Мипо',
    roles: ['mid', 'carry'],
    types: ['carry', 'escape', 'jungler', 'nuker'],
    mechanics: ['poof', 'earthbind', 'geostrike', 'divided_we_stand', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  mirana: {
    id: 9,
    name: 'Mirana',
    localName: 'Мирана',
    roles: ['support', 'carry', 'mid'],
    types: ['carry', 'escape', 'disabler', 'nuker', 'support'],
    mechanics: ['sacred_arrow', 'starfall', 'invisibility', 'leap', 'magic_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 4,
  },
  monkey_king: {
    id: 114,
    name: 'Monkey King',
    localName: 'Манки',
    roles: ['carry', 'support'],
    types: ['carry', 'escape', 'disabler', 'nuker', 'initiator'],
    mechanics: ['tree_dance', 'jingu_mastery', 'primal_spring', 'wukong_command', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  morphling: {
    id: 10,
    name: 'Morphling',
    localName: 'Морфлинг',
    roles: ['carry', 'mid'],
    types: ['carry', 'escape', 'nuker', 'durable'],
    mechanics: ['waveform', 'attribute_shift', 'adaptive_strike', 'morph', 'replicate'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  muerta: {
    id: 140,
    name: 'Muerta',
    localName: 'Муэрта',
    roles: ['carry', 'support'],
    types: ['carry', 'nuker', 'disabler', 'escape'],
    mechanics: ['dead_shot', 'the_calling', 'pierce_the_veil', 'true_strike', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  naga_siren: {
    id: 89,
    name: 'Naga Siren',
    localName: 'Нага',
    roles: ['carry'],
    types: ['carry', 'disabler', 'pusher', 'escape', 'initiator'],
    mechanics: ['song_of_siren', 'illusions', 'net', 'mirror_image', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  nature_prophet: {
    id: 53,
    name: "Nature's Prophet",
    localName: 'Пропик',
    roles: ['carry', 'support', 'offlane'],
    types: ['carry', 'pusher', 'escape', 'nuker', 'disabler'],
    mechanics: ['teleport', 'treants_summons', 'sprout', 'wrath_of_nature', 'physical_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  necrophos: {
    id: 36,
    name: 'Necrophos',
    localName: 'Некро',
    roles: ['mid', 'support', 'offlane'],
    types: ['nuker', 'healer', 'tank', 'disabler'],
    mechanics: ['reaper_scythe', 'ghost_shroud', 'heartstopper_aura', 'death_pulse', 'anti_heal'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  night_stalker: {
    id: 60,
    name: 'Night Stalker',
    localName: 'Страж Ночи',
    roles: ['offlane', 'carry'],
    types: ['carry', 'disabler', 'initiator', 'durable'],
    mechanics: ['silence', 'void', 'hunter_in_the_night', 'dark_ascension', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  nyx_assassin: {
    id: 88,
    name: 'Nyx Assassin',
    localName: 'Никс',
    roles: ['support', 'offlane'],
    types: ['disabler', 'nuker', 'escape', 'support'],
    mechanics: ['impale', 'mana_burn', 'spiked_carapace', 'vendetta', 'magic_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 6,
  },
  ogre_magi: {
    id: 84,
    name: 'Ogre Magi',
    localName: 'Огр',
    roles: ['support', 'hard_support'],
    types: ['support', 'disabler', 'tank', 'nuker'],
    mechanics: ['stun', 'slow', 'fireblast', 'multicast', 'magic_damage', 'durable'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  omniknight: {
    id: 57,
    name: 'Omniknight',
    localName: 'Омни',
    roles: ['support', 'hard_support'],
    types: ['support', 'healer', 'disabler', 'durable', 'tank'],
    mechanics: ['purification', 'repel', 'degen_aura', 'guardian_angel', 'spell_immunity_aura'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  oracle: {
    id: 111,
    name: 'Oracle',
    localName: 'Оракул',
    roles: ['hard_support'],
    types: ['support', 'healer', 'disabler', 'nuker'],
    mechanics: ['fate_edict', 'fortunes_end', 'false_promise', 'purifying_flames', 'magic_damage', 'save'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  outworld_destroyer: {
    id: 76,
    name: 'Outworld Destroyer',
    localName: 'ОД',
    roles: ['mid', 'carry'],
    types: ['carry', 'nuker', 'disabler'],
    mechanics: ['arcane_orb', 'astral_imprisonment', 'sanity_eclipse', 'essence_aura', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  pangolier: {
    id: 120,
    name: 'Pangolier',
    localName: 'Пангол',
    roles: ['offlane', 'support', 'mid'],
    types: ['initiator', 'disabler', 'nuker', 'escape', 'durable'],
    mechanics: ['rolling_thunder', 'swashbuckle', 'shield_crash', 'lucky_shot', 'magic_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  phantom_assassin: {
    id: 44,
    name: 'Phantom Assassin',
    localName: 'ПА',
    roles: ['carry'],
    types: ['carry', 'escape', 'nuker'],
    mechanics: ['blink', 'blur', 'coup_de_grace', 'physical_damage', 'evasion', 'critical_strike'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  phantom_lancer: {
    id: 12,
    name: 'Phantom Lancer',
    localName: 'Фантомная Лансер',
    roles: ['carry'],
    types: ['carry', 'escape', 'disabler', 'nuker'],
    mechanics: ['illusions', 'doppelganger', 'spirit_lance', 'juxtapose', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  phoenix: {
    id: 110,
    name: 'Phoenix',
    localName: 'Феникс',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'nuker', 'healer', 'escape'],
    mechanics: ['supernova', 'sun_ray', 'fire_spirits', 'icarus_dive', 'magic_damage'],
    primaryAttr: 'strength',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  primal_beast: {
    id: 137,
    name: 'Primal Beast',
    localName: 'Примальный Зверь',
    roles: ['offlane'],
    types: ['initiator', 'tank', 'disabler', 'durable'],
    mechanics: ['onslaught', 'trample', 'uproar', 'pulverize', 'physical_damage', 'stun'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  puck: {
    id: 14,
    name: 'Puck',
    localName: 'Пак',
    roles: ['mid', 'offlane'],
    types: ['escape', 'nuker', 'disabler', 'initiator'],
    mechanics: ['waning_rift', 'dream_coil', 'phase_shift', 'illusory_orb', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  pudge: {
    id: 14,
    name: 'Pudge',
    localName: 'Пудж',
    roles: ['support', 'offlane'],
    types: ['disabler', 'nuker', 'durable', 'initiator'],
    mechanics: ['hook', 'rot', 'dismember', 'flesh_heap', 'magic_damage', 'disable'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  pugna: {
    id: 45,
    name: 'Pugna',
    localName: 'Пугна',
    roles: ['support', 'mid'],
    types: ['nuker', 'disabler', 'support', 'pusher'],
    mechanics: ['nether_blast', 'decrepify', 'nether_ward', 'life_drain', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  queen_of_pain: {
    id: 39,
    name: 'Queen of Pain',
    localName: 'КП / Квина',
    roles: ['mid', 'carry'],
    types: ['nuker', 'escape', 'disabler', 'carry'],
    mechanics: ['scream_of_pain', 'blink', 'shadow_strike', 'sonic_wave', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  razor: {
    id: 15,
    name: 'Razor',
    localName: 'Рейзор',
    roles: ['carry', 'mid', 'offlane'],
    types: ['carry', 'durable', 'nuker', 'disabler'],
    mechanics: ['plasma_field', 'static_link', 'unstable_current', 'eye_of_the_storm', 'lightning_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 0,
  },
  riki: {
    id: 32,
    name: 'Riki',
    localName: 'Рики',
    roles: ['carry', 'support'],
    types: ['carry', 'escape', 'disabler', 'nuker'],
    mechanics: ['invisibility', 'backstab', 'smoke_screen', 'tricks_of_trade', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  ringmaster: {
    id: 146,
    name: 'Ringmaster',
    localName: 'Рингмастер',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'support', 'healer'],
    mechanics: ['tame_the_beasts', 'hat_trick', 'impalement', 'curtain_call', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  rubick: {
    id: 86,
    name: 'Rubick',
    localName: 'Рубик',
    roles: ['support', 'hard_support'],
    types: ['support', 'disabler', 'nuker'],
    mechanics: ['spell_steal', 'fade_bolt', 'telekinesis', 'arcane_supremacy', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  sand_king: {
    id: 16,
    name: 'Sand King',
    localName: 'Санд Кинг',
    roles: ['offlane', 'support'],
    types: ['initiator', 'disabler', 'nuker', 'escape'],
    mechanics: ['burrowstrike', 'epicenter', 'sand_storm', 'caustic_finale', 'magic_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 8,
  },
  shadow_demon: {
    id: 79,
    name: 'Shadow Demon',
    localName: 'Шедоу Демон',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'support', 'initiator'],
    mechanics: ['disruption', 'shadow_poison', 'soul_catcher', 'demonic_purge', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 0,
  },
  shadow_fiend: {
    id: 11,
    name: 'Shadow Fiend',
    localName: 'СФ',
    roles: ['mid', 'carry'],
    types: ['carry', 'nuker', 'disabler'],
    mechanics: ['shadowraze', 'necromastery', 'presence_of_the_dark_lord', 'requiem_of_souls', 'magic_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  shadow_shaman: {
    id: 27,
    name: 'Shadow Shaman',
    localName: 'Рхаста',
    roles: ['support', 'hard_support'],
    types: ['disabler', 'nuker', 'pusher', 'support'],
    mechanics: ['hex', 'shackles', 'mass_serpent_ward', 'ether_shock', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  silencer: {
    id: 75,
    name: 'Silencer',
    localName: 'Сайленсер',
    roles: ['carry', 'support', 'hard_support'],
    types: ['carry', 'disabler', 'nuker', 'support'],
    mechanics: ['global_silence', 'last_word', 'glaives_of_wisdom', 'arcane_curse', 'intelligence_steal'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  skywrath_mage: {
    id: 101,
    name: 'Skywrath Mage',
    localName: 'Скай',
    roles: ['support', 'hard_support', 'mid'],
    types: ['nuker', 'disabler', 'support'],
    mechanics: ['concussive_shot', 'ancient_seal', 'mystic_flare', 'arcane_bolt', 'magic_damage', 'silence'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  slardar: {
    id: 28,
    name: 'Slardar',
    localName: 'Слардар',
    roles: ['offlane', 'support'],
    types: ['initiator', 'disabler', 'carry', 'durable'],
    mechanics: ['sprint', 'slithereen_crush', 'bash', 'corrosive_haze', 'armor_reduction', 'vision'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  slark: {
    id: 93,
    name: 'Slark',
    localName: 'Слар',
    roles: ['carry'],
    types: ['carry', 'escape', 'disabler', 'nuker'],
    mechanics: ['dark_pact', 'pounce', 'shadow_dance', 'essence_shift', 'dispel', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 4,
  },
  snapfire: {
    id: 128,
    name: 'Snapfire',
    localName: 'Снэпфайр',
    roles: ['support', 'hard_support'],
    types: ['support', 'disabler', 'nuker', 'initiator'],
    mechanics: ['lil_shredder', 'mortimer_kisses', 'firesnap_cookie', 'gobble_up', 'magic_damage'],
    primaryAttr: 'strength',
    attackType: 'ranged',
    complexity: 2,
    legs: 6,
  },
  sniper: {
    id: 35,
    name: 'Sniper',
    localName: 'Снайпер',
    roles: ['carry', 'mid'],
    types: ['carry', 'nuker', 'disabler'],
    mechanics: ['assassinate', 'headshot', 'take_aim', 'shrapnel', 'physical_damage', 'slow'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  spectre: {
    id: 67,
    name: 'Spectre',
    localName: 'Спектр',
    roles: ['carry'],
    types: ['carry', 'escape', 'durable', 'initiator'],
    mechanics: ['haunt', 'spectral_dagger', 'desolate', 'dispersion', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  spirit_breaker: {
    id: 71,
    name: 'Spirit Breaker',
    localName: 'СБ / Спирит Брейкер',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'carry', 'durable'],
    mechanics: ['charge', 'bash', 'bulldoze', 'nether_strike', 'physical_damage', 'mobility'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  storm_spirit: {
    id: 17,
    name: 'Storm Spirit',
    localName: 'Шторм',
    roles: ['mid', 'carry'],
    types: ['carry', 'escape', 'nuker', 'disabler', 'initiator'],
    mechanics: ['ball_lightning', 'electric_vortex', 'overload', 'static_remnant', 'magic_damage', 'mobility'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  sven: {
    id: 18,
    name: 'Sven',
    localName: 'Свен',
    roles: ['carry', 'offlane'],
    types: ['carry', 'initiator', 'disabler', 'durable'],
    mechanics: ['storm_hammer', 'great_cleave', 'god_strength', 'warcry', 'physical_damage', 'aoe'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  techies: {
    id: 105,
    name: 'Techies',
    localName: 'Техис',
    roles: ['support', 'offlane'],
    types: ['nuker', 'disabler', 'pusher', 'support'],
    mechanics: ['remote_mines', 'proximity_mines', 'reactive_tazer', 'land_mines', 'magic_damage', 'stun'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  templar_assassin: {
    id: 46,
    name: 'Templar Assassin',
    localName: 'ТА',
    roles: ['mid', 'carry'],
    types: ['carry', 'escape', 'nuker', 'disabler'],
    mechanics: ['evasion', 'psionic_trap', 'meld', 'psi_blades', 'physical_damage', 'invisibility'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  terrorblade: {
    id: 109,
    name: 'Terrorblade',
    localName: 'ТБ',
    roles: ['carry'],
    types: ['carry', 'pusher', 'escape', 'nuker'],
    mechanics: ['sunder', 'reflection', 'conjure_image', 'metamorphosis', 'illusions', 'physical_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  tidehunter: {
    id: 29,
    name: 'Tidehunter',
    localName: 'Тайд',
    roles: ['offlane', 'support'],
    types: ['initiator', 'disabler', 'durable', 'tank'],
    mechanics: ['ravage', 'gush', 'kraken_shell', 'anchor_smash', 'aoe_stun', 'armor_reduction'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  timbersaw: {
    id: 98,
    name: 'Timbersaw',
    localName: 'Тимбер',
    roles: ['offlane'],
    types: ['tank', 'nuker', 'escape', 'durable'],
    mechanics: ['whirling_death', 'timber_chain', 'chakram', 'reactive_armor', 'magic_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  tinker: {
    id: 34,
    name: 'Tinker',
    localName: 'Тинкер',
    roles: ['mid'],
    types: ['nuker', 'pusher', 'escape', 'disabler'],
    mechanics: ['rearm', 'heat_seeking_missile', 'laser', 'march_of_the_machines', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  tiny: {
    id: 19,
    name: 'Tiny',
    localName: 'Тайни',
    roles: ['mid', 'support', 'carry'],
    types: ['carry', 'initiator', 'disabler', 'nuker', 'pusher'],
    mechanics: ['toss', 'avalanche', 'tree_grab', 'grow', 'magic_damage', 'physical_damage'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  treant_protector: {
    id: 83,
    name: 'Treant Protector',
    localName: 'Тринт',
    roles: ['hard_support'],
    types: ['support', 'healer', 'disabler', 'initiator'],
    mechanics: ['natures_guise', 'overgrowth', 'living_armor', 'leech_seed', 'magic_damage', 'root'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  troll_warlord: {
    id: 95,
    name: 'Troll Warlord',
    localName: 'Тролль',
    roles: ['carry'],
    types: ['carry', 'disabler', 'durable'],
    mechanics: ['berserkers_rage', 'whirling_axes', 'fervor', 'battle_trance', 'physical_damage', 'bash'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  tusk: {
    id: 100,
    name: 'Tusk',
    localName: 'Таск',
    roles: ['support', 'offlane'],
    types: ['initiator', 'disabler', 'escape', 'nuker'],
    mechanics: ['walrus_punch', 'ice_shards', 'snowball', 'tag_team', 'physical_damage', 'stun'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  underlord: {
    id: 108,
    name: 'Underlord',
    localName: 'Андерлорд',
    roles: ['offlane'],
    types: ['initiator', 'tank', 'durable', 'disabler', 'pusher'],
    mechanics: ['firestorm', 'pit_of_malice', 'atrophy_aura', 'dark_rift', 'magic_damage', 'root'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  undying: {
    id: 85,
    name: 'Undying',
    localName: 'Андинг',
    roles: ['support', 'offlane'],
    types: ['support', 'healer', 'tank', 'disabler', 'nuker'],
    mechanics: ['decay', 'soul_rip', 'tombstone', 'flesh_golem', 'magic_damage', 'stat_steal'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 2,
    legs: 2,
  },
  ursa: {
    id: 70,
    name: 'Ursa',
    localName: 'Урса',
    roles: ['carry', 'offlane'],
    types: ['carry', 'durable', 'jungler', 'initiator'],
    mechanics: ['earthshock', 'overpower', 'fury_swipes', 'enrage', 'physical_damage', 'slow'],
    primaryAttr: 'agility',
    attackType: 'melee',
    complexity: 1,
    legs: 4,
  },
  vengeful_spirit: {
    id: 20,
    name: 'Vengeful Spirit',
    localName: 'Венга',
    roles: ['support', 'hard_support', 'carry'],
    types: ['support', 'disabler', 'nuker', 'initiator'],
    mechanics: ['magic_missile', 'wave_of_terror', 'nether_swap', 'vengeance_aura', 'armor_reduction'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  venomancer: {
    id: 40,
    name: 'Venomancer',
    localName: 'Вено',
    roles: ['support', 'offlane', 'carry'],
    types: ['nuker', 'disabler', 'pusher', 'support'],
    mechanics: ['plague_wards', 'poison_nova', 'gale_force_poison', 'venomous_gale', 'magic_damage', 'slow'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 8,
  },
  viper: {
    id: 47,
    name: 'Viper',
    localName: 'Вайпер',
    roles: ['mid', 'carry', 'offlane'],
    types: ['carry', 'nuker', 'disabler', 'durable'],
    mechanics: ['poison_attack', 'nethertoxin', 'corrosive_skin', 'viper_strike', 'slow', 'magic_damage'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 1,
    legs: 4,
  },
  visage: {
    id: 92,
    name: 'Visage',
    localName: 'Висаж',
    roles: ['support', 'mid'],
    types: ['support', 'nuker', 'disabler', 'initiator', 'durable'],
    mechanics: ['grave_chill', 'soul_assumption', 'graven_image', 'familiars', 'physical_damage', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 3,
    legs: 2,
  },
  void_spirit: {
    id: 131,
    name: 'Void Spirit',
    localName: 'Войд Спирит',
    roles: ['mid', 'offlane'],
    types: ['carry', 'escape', 'nuker', 'disabler', 'initiator'],
    mechanics: ['resonant_pulse', 'dissimilate', 'aether_remnant', 'astral_step', 'magic_damage', 'mobility'],
    primaryAttr: 'intelligence',
    attackType: 'melee',
    complexity: 3,
    legs: 2,
  },
  warlock: {
    id: 37,
    name: 'Warlock',
    localName: 'Ворлок',
    roles: ['support', 'hard_support'],
    types: ['support', 'disabler', 'nuker', 'initiator'],
    mechanics: ['shadow_word', 'fatal_bonds', 'upheaval', 'chaotic_offering', 'golem_summon', 'magic_damage'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  weaver: {
    id: 63,
    name: 'Weaver',
    localName: 'Вивер',
    roles: ['carry', 'offlane'],
    types: ['carry', 'escape', 'nuker', 'durable'],
    mechanics: ['the_swarm', 'shukuchi', 'geminate_attack', 'time_lapse', 'physical_damage', 'armor_reduction'],
    primaryAttr: 'agility',
    attackType: 'ranged',
    complexity: 2,
    legs: 8,
  },
  windranger: {
    id: 42,
    name: 'Windranger',
    localName: 'Виндрейнджер',
    roles: ['support', 'carry', 'mid'],
    types: ['carry', 'escape', 'disabler', 'nuker', 'support'],
    mechanics: ['shackleshot', 'powershot', 'windrun', 'focusfire', 'physical_damage', 'evasion'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 2,
  },
  winter_wyvern: {
    id: 112,
    name: 'Winter Wyvern',
    localName: 'Зима',
    roles: ['support', 'hard_support'],
    types: ['support', 'healer', 'disabler', 'nuker'],
    mechanics: ['arctic_burn', 'splinter_blast', 'cold_embrace', 'winters_curse', 'magic_damage', 'save'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 2,
    legs: 4,
  },
  witch_doctor: {
    id: 30,
    name: 'Witch Doctor',
    localName: 'Вич Доктор',
    roles: ['hard_support', 'support'],
    types: ['support', 'nuker', 'disabler', 'healer'],
    mechanics: ['paralyzing_cask', 'maledict', 'voodoo_restoration', 'death_ward', 'magic_damage', 'bounce_disable'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
  wraith_king: {
    id: 42,
    name: 'Wraith King',
    localName: 'Врейт',
    roles: ['carry'],
    types: ['carry', 'tank', 'durable', 'disabler', 'pusher'],
    mechanics: ['wraithfire_blast', 'mortal_strike', 'vampiric_spirit', 'reincarnation', 'physical_damage', 'stun'],
    primaryAttr: 'strength',
    attackType: 'melee',
    complexity: 1,
    legs: 2,
  },
  zeus: {
    id: 22,
    name: 'Zeus',
    localName: 'Зевс',
    roles: ['mid', 'support'],
    types: ['nuker', 'carry', 'disabler'],
    mechanics: ['arc_lightning', 'lightning_bolt', 'static_field', 'thundergods_wrath', 'magic_damage', 'global_ult'],
    primaryAttr: 'intelligence',
    attackType: 'ranged',
    complexity: 1,
    legs: 2,
  },
};


// ============================================================
// 3. COUNTERPICKS DATABASE (патч 7.41a)
// ============================================================
const COUNTERPICKS = {
  abaddon: {
    counters: [
      { hero: 'ancient_apparition', advantage: 8.2, reason: 'Ice Blast полностью отключает пассивную смерть Абаддона (Borrowed Time не активируется при заморозке от AA) и нивелирует весь хил. Апостроф — главный хард-каунтер.' },
      { hero: 'silencer', advantage: 6.1, reason: 'Global Silence отключает Mist Coil и Aphotic Shield в ключевые моменты. Arcane Curse усугубляет ситуацию при кастах, снижает эффективность спелов в 2 раза.' },
      { hero: 'doom', advantage: 5.9, reason: 'Doom полностью снимает все способности Абаддона — ни шилда, ни хила, ни Borrowed Time. Девур нейтрализует threat на весь файт.' },
      { hero: 'skywrath_mage', advantage: 5.7, reason: 'Ancient Seal silences и ставит -magic resist: Abaddon без кастов — мёртвый вес. Связка Seal + Mystic Flare убивает за 2 секунды.' },
      { hero: 'diffusal_blade_carrier', advantage: 5.5, reason: 'Purge (Diffusal) или Eul сбрасывают Aphotic Shield мгновенно. Любой carry с Diffusal нивелирует защиту.' },
      { hero: 'axe', advantage: 5.3, reason: 'Culling Blade через Borrowed Time работает корректно — AOE Taunt + Call принуждает Абаддона к невыгодной позиции, убивая физ DPS через исполнение.' },
    ],
  },
  alchemist: {
    counters: [
      { hero: 'antimage', advantage: 9.1, reason: 'Mana Break уничтожает ману Алхимика, без которой Chemical Rage теряет половину эффекта. AM рвёт Алхимика в сплите и не даёт фармить.' },
      { hero: 'nyx_assassin', advantage: 7.8, reason: 'Mana Burn сжигает огромную ману Алхимика — ультимейт Chemical Rage дорогой, Никс выжигает ресурс. Vendetta + burst убивает до активации Chemical Rage.' },
      { hero: 'diffusal_carry', advantage: 7.3, reason: 'Purge снимает Chemical Rage досрочно. Алхимик огромный — любой carry с Butterfly + MKB закрывает его физуроном.' },
      { hero: 'doom', advantage: 7.1, reason: 'Doom на Chemical Rage = мёртвый Алхимик. Spell Lock + Doom в одном флаконе — ультимейт, спасающий игру.' },
      { hero: 'ancient_apparition', advantage: 6.5, reason: 'Ice Blast убирает регенерацию в Chemical Rage. Алхимик в ультимейте регенирирует 75+ HP/s — AA это выключает.' },
      { hero: 'silencer', advantage: 6.2, reason: 'Global Silence блокирует Chemical Rage в момент инициации. Без ульта Алхимик — медленный пухлый крип.' },
    ],
  },
  ancient_apparition: {
    counters: [
      { hero: 'storm_spirit', advantage: 7.9, reason: 'Ball Lightning позволяет уйти с Ice Blast зоны мгновенно. AA сложно попасть по мобильным героям. Storm burst убивает хрупкого АА за 2 удара.' },
      { hero: 'puck', advantage: 7.2, reason: 'Phase Shift уклоняется от Chilling Touch и Ice Blast. Puck бьёт АА с огромного дистанции и уходит раньше чем тот реагирует.' },
      { hero: 'ember_spirit', advantage: 7.0, reason: 'Fire Remnants снимают стаки Cold Feet. Мобильность позволяет уходить от Cold Blast. Слепой burst убивает за 1 ротацию.' },
      { hero: 'phantom_assassin', advantage: 6.8, reason: 'Blur даёт evasion — многие физ атаки АА промахиваются. Blink позиционирует сзади. Coup de Grace может убить с одного удара.' },
      { hero: 'faceless_void', advantage: 6.3, reason: 'Time Walk отменяет Ice Blast если успел занять позицию. Chronosphere locke АА в месте без возможности кастовать.' },
      { hero: 'night_stalker', advantage: 6.1, reason: 'Silence в Darkness нивелирует весь AP-арсенал. Hunter in the Night делает НС нечувствительным к slow Chilling Touch.' },
    ],
  },
  anti_mage: {
    counters: [
      { hero: 'oracle', advantage: 8.6, reason: 'False Promise спасает любого союзника, которого гоняет АМ. Purifying Flames + Fate\'s Edict даёт танк и снимает DoT. АМ теряет kill confirm.' },
      { hero: 'omniknight', advantage: 8.2, reason: 'Guardian Angel (magic immunity) спасает команду в момент ультимейта. Repel даёт BKB-like эффект на союзника. АМ не может убить под Guardian Angel.' },
      { hero: 'nyx_assassin', advantage: 7.7, reason: 'Spiked Carapace отражает урон в момент Blink+атаки. АМ бьёт физикой — Carapace stunит его самого. Сюрпризная смерть для AM.' },
      { hero: 'ember_spirit', advantage: 7.4, reason: 'АМ выжигает ману, но Ember строит Linken\'s: Blink от AM блокирован. Мобильность Ember не даёт поймать его в сплите.' },
      { hero: 'terrorblade', advantage: 7.1, reason: 'TB в сплите фармит быстрее АМ. Sunder при попытке убить разворачивает HP. Illusions путают целевую систему Mana Break.' },
      { hero: 'bane', advantage: 6.9, reason: 'Nightmare + Fiend\'s Grip безнаказанно держит АМ пока союзники добивают. АМ не может использовать Blink под контролем.' },
    ],
  },
  arc_warden: {
    counters: [
      { hero: 'slardar', advantage: 8.0, reason: 'Corrosive Haze даёт True Sight — Warden не может прятаться. Sprint + Bash гоняет. AW — хрупкий, умирает от физурона.' },
      { hero: 'bounty_hunter', advantage: 7.7, reason: 'Track выдаёт обоих (Arc Warden + tempest double). Jingu Mastery + Track — double kill потенциал с bounty gold. Invisibility контрит позицию.' },
      { hero: 'nyx_assassin', advantage: 7.4, reason: 'Vendetta позволяет убить tempest double первым. Mana Burn выжигает запасы. Сюрпризный burst убивает до Magnetic Field.' },
      { hero: 'doom', advantage: 7.2, reason: 'Doom на основного — tempest double становится бесполезным (он копирует нет-спелы). Девур нейтрализует угрозу.' },
      { hero: 'silencer', advantage: 7.0, reason: 'Global Silence убирает весь спел-арсенал Warden + Double. Tempest Double под Silence — обычный крип с луком.' },
      { hero: 'phantom_assassin', advantage: 6.5, reason: 'Blur не позволяет атаковать ловушки правильно. PA burst убивает хрупкого Warden быстрее Magnetic Field.' },
    ],
  },
  axe: {
    counters: [
      { hero: 'drow_ranger', advantage: 7.5, reason: 'Silence (Gust) блокирует Berserker\'s Call — Axe не может принудить атаковать себя. Frost Arrows снижают скорость, держа дистанцию вне Helix-прока. Drow не атакует в момент Call = нет Counter Helix.' },
      { hero: 'windranger', advantage: 7.1, reason: 'Windrun даёт evasion — Counter Helix не прокает от промахов. Shackleshot к дереву держит Axe на месте, не давая инициировать Call.' },
      { hero: 'phantom_assassin', advantage: 6.9, reason: 'Blur evasion не даёт прокать Counter Helix. Blink позиционирует вне Blademail-отдачи. PA убивает через Coup de Grace быстрее чем успевает Helix.' },
      { hero: 'templar_assassin', advantage: 6.7, reason: 'Refraction поглощает Helix hits. Evasion не триггерит Counter Helix. TA держит дистанцию с Psionic Traps и убивает Axe в сплите.' },
      { hero: 'huskar', advantage: 6.4, reason: 'Magic immunity (Berserker Blood) нивелирует Culling Blade (не убивает под low-HP buff). Inner Fire отбрасывает Axe, сбивая Call.' },
      { hero: 'oracle', advantage: 6.1, reason: 'False Promise спасает союзника с Culling Blade threshold. Fate\'s Edict даёт spell immunity — Call не работает на иммунных.' },
    ],
  },
  bane: {
    counters: [
      { hero: 'oracle', advantage: 8.4, reason: 'Purifying Flames снимает Nightmare. False Promise отменяет Fiend\'s Grip с союзника. Fate\'s Edict даёт spell immunity vs Bane.' },
      { hero: 'lifestealer', advantage: 7.6, reason: 'Rage (magic immunity) отменяет все спелы Bane: ни Nightmare, ни Grip не работают. LS просто включает Rage и убивает.' },
      { hero: 'juggernaut', advantage: 7.3, reason: 'Blade Fury дает spell immunity — Fiend\'s Grip прерывается. Omnislash убивает Bane до завершения ультимейта.' },
      { hero: 'black_king_bar_carrier', advantage: 7.0, reason: 'BKB нивелирует весь контроль Bane. Любой carry с BKB — головная боль для Bane.' },
      { hero: 'slark', advantage: 6.7, reason: 'Dark Pact (self purge) снимает Nightmare и прерывает Grip. Shadow Dance делает неуязвимым. Bane не может удержать Slark.' },
      { hero: 'morphling', advantage: 6.4, reason: 'Attribute Shift смещает в str — выживает под Fiend\'s Grip. Waveform уходит из Nightmare. Replicate позволяет убить самого Bane его же Grip.' },
    ],
  },
  batrider: {
    counters: [
      { hero: 'oracle', advantage: 8.1, reason: 'Purifying Flames + Fate\'s Edict на союзника в Lasso — полная блокировка убийства. False Promise держит союзника живым всё время ультимейта Bat.' },
      { hero: 'winter_wyvern', advantage: 7.8, reason: 'Cold Embrace (physical immunity) на союзника в Lasso — урон Firefly не проходит. Batrider тащит физически иммунного союзника без урона.' },
      { hero: 'naga_siren', advantage: 7.5, reason: 'Song of the Siren сбрасывает Lasso (сон = новая позиция). Batrider теряет kill-target при активации Song.' },
      { hero: 'puck', advantage: 7.2, reason: 'Phase Shift уклоняется от Firefly damage. Illusory Orb даёт escape. Puck жёстко burst Batrider ещё на подходе.' },
      { hero: 'antimage', advantage: 6.9, reason: 'Blink позволяет уйти из Lasso-тащи (AM blink cancel). Mana Break выжигает Bat до ключевых спелов.' },
      { hero: 'storm_spirit', advantage: 6.6, reason: 'Ball Lightning позволяет мгновенно выйти из Fire Fly зоны. Storm burst убивает хрупкого Bat без ульта.' },
    ],
  },
  bloodseeker: {
    counters: [
      { hero: 'oracle', advantage: 8.7, reason: 'Purifying Flames лечит союзника не давая достигать low-HP для Thirst movement speed. False Promise делает союзника неубиваемым под Rupture.' },
      { hero: 'io', advantage: 8.3, reason: 'Tether + Overcharge закрывает союзника от Rupture damage (хил > DoT). Relocate уходит из Rupture дистанции мгновенно.' },
      { hero: 'clinkz', advantage: 7.8, reason: 'Clinkz строит несколько героев (Death Pact) — Blood Rite на многих невыгодно. Invisibility уходит от контроля.' },
      { hero: 'omniknight', advantage: 7.5, reason: 'Guardian Angel (physical immunity) = Rupture урон не проходит. Purification восстанавливает HP под Rupture.' },
      { hero: 'naga_siren', advantage: 7.1, reason: 'Mirror Image создаёт иллюзии — BS теряет настоящую цель. Song сбрасывает Rupture если успеть уснуть.' },
      { hero: 'phantom_lancer', advantage: 6.8, reason: 'Doppelganger позволяет "сбросить" Rupture — PL телепортируется, Rupture привязан к оригиналу, но позиция меняется. Illusions запутывают.' },
    ],
  },
  bounty_hunter: {
    counters: [
      { hero: 'slardar', advantage: 8.5, reason: 'Corrosive Haze даёт True Sight — BH не может использовать Jinada из инвизибилити. Sprint + Bash мгновенно закрывает. True Sight разрушает механику BH.' },
      { hero: 'witch_doctor', advantage: 7.7, reason: 'Paralyzing Cask bounces — BH всё время в stunе. Death Ward убивает за 2-3 секунды если нет диспела.' },
      { hero: 'bounty_own_counter', advantage: 7.3, reason: 'Dust of Appearance нивелирует невидимость полностью. Любая команда с Dust — BH превращается в обычного героя.' },
      { hero: 'sniper', advantage: 7.0, reason: 'Headshot knockback сбивает Jinada positioning. Assassinate убивает с максимальной дистанции — BH не может зайти незамеченным на Sniper.' },
      { hero: 'clockwerk', advantage: 6.8, reason: 'Power Cogs ловит BH инвиза. Battery Assault не даёт убежать. Hookshot игнорирует Smoke позиционирование.' },
      { hero: 'leshrac', advantage: 6.5, reason: 'Diabolic Edict (physical damage) наносит урон даже в инвиз. Lightning Storm debuff замедляет. AoE Leshrac не даёт BH безопасно ходить.' },
    ],
  },
  brewmaster: {
    counters: [
      { hero: 'silencer', advantage: 7.9, reason: 'Global Silence в момент Primal Split не даёт Brewmaster кастовать — он остаётся единым. Arcane Curse критичен против частых спелов.' },
      { hero: 'doom', advantage: 7.5, reason: 'Doom на Brew = нет Primal Split. Без ультимейта Brew не имеет survival mechanics в поздней игре.' },
      { hero: 'disruptor', advantage: 7.2, reason: 'Static Storm в момент Cyclone + Primal Split — невозможно кастовать части. Glimpse возвращает Brew в начало. Thunder Strike дебафает.' },
      { hero: 'rubick', advantage: 7.0, reason: 'Spell Steal на Primal Split — Rubick получает одну из лучших ультимейт-механик в игре. Мощный психологический counter-pick.' },
      { hero: 'naga_siren', advantage: 6.8, reason: 'Song of the Siren усыпляет все части Primal Split синхронно — команда убивает Brew по частям во сне.' },
      { hero: 'lion', advantage: 6.5, reason: 'Hex трансформирует одну часть, Impale stunsit другую. Finger даёт single-target burst по самой уязвимой части.' },
    ],
  },
  centaur_warrunner: {
    counters: [
      { hero: 'bristleback', advantage: 7.6, reason: 'Double Edge наносит урон самому Центавру — BB в спине снижает это. Quill Spray + стаки делают физ атаки Centaur неэффективными.' },
      { hero: 'windranger', advantage: 7.3, reason: 'Windrun evasion не даёт Double Edge прокать Retaliate. Shackleshot к дереву блокирует Stampede инициацию.' },
      { hero: 'phantom_assassin', advantage: 7.0, reason: 'Blur evasion — Centaur Double Edge промахивается. Coup de Grace убивает быстрее чем Stampede успевает создать advantage.' },
      { hero: 'faceless_void', advantage: 6.8, reason: 'Chronosphere полностью блокирует Stampede и фризит Centaur. Void убивает в хроне быстрее любого сейва.' },
      { hero: 'bane', advantage: 6.5, reason: 'Nightmare блокирует Stampede initiation. Fiend\'s Grip держит Centaur мёртвым пока союзники добивают.' },
      { hero: 'skywrath_mage', advantage: 6.2, reason: 'Ancient Seal silence блокирует Stampede + Double Edge. Mystic Flare убивает хрупкого (несмотря на str) Centaur с magical burst.' },
    ],
  },
  chaos_knight: {
    counters: [
      { hero: 'death_prophet', advantage: 8.1, reason: 'Exorcism духи атакуют всех иллюзий одновременно, убивая их за секунды. CK иллюзии против DP — мусор. Silence блокирует Chaos Bolt escape.' },
      { hero: 'shadow_demon', advantage: 7.9, reason: 'Disruption создаёт иллюзии CK которые не имеют того же power. Soul Catcher + Demonic Purge на оригинала — instant kill пока иллюзии путаются.' },
      { hero: 'radiance_heroes', advantage: 7.6, reason: 'Radiance burn уничтожает все иллюзии CK за 3-4 секунды. CK без иллюзий — медленный str hero без gap closer.' },
      { hero: 'lina', advantage: 7.3, reason: 'Laguna Blade с Aghanim\'s убивает весь пакет иллюзий разом (AoE version). Lina burst проходит через иллюзии.' },
      { hero: 'earthshaker', advantage: 7.0, reason: 'Echo Slam с иллюзиями — double damage за каждый доп hit. Fissure блокирует Blink инициацию.' },
      { hero: 'arc_warden', advantage: 6.7, reason: 'Spark Wraith убивает иллюзии пассивно. Tempest Double с Radiance = instant иллюзии-нет.' },
    ],
  },
  crystal_maiden: {
    counters: [
      { hero: 'phantom_assassin', advantage: 8.9, reason: 'CM — самый медленный герой в игре. PA Blink + Coup de Grace убивает CM за 1 удар до завершения Freezing Field. Стекло против стекла — PA выигрывает.' },
      { hero: 'monkey_king', advantage: 8.5, reason: 'Tree Dance позволяет зайти с нефаскованного угла. Jingu Mastery + 4 стака burst убивает CM в момент Freezing Field channeling.' },
      { hero: 'slark', advantage: 8.1, reason: 'Dark Pact снимает Frostbite и Frost Nova slow. Shadow Dance в Freezing Field — Slark неуязвим. CM не может держать Slark.' },
      { hero: 'huskar', advantage: 7.8, reason: 'Magic immunity (Berserker Blood) vs Freezing Field (весь урон магический). CM Freezing Field = ноль урона под Huskar low-hp immunity.' },
      { hero: 'juggernaut', advantage: 7.5, reason: 'Blade Fury spell immunity прерывает Freezing Field и CM ультимейт. Omnislash убивает CM до завершения каста.' },
      { hero: 'storm_spirit', advantage: 7.2, reason: 'Ball Lightning уходит из Freezing Field зоны мгновенно. CM не может поймать Storm в 1v1.' },
    ],
  },
  doom: {
    counters: [
      { hero: 'oracle', advantage: 8.8, reason: 'False Promise снимает Doom (единственный способ в игре снять Doom без BKB). После False Promise союзник возвращается без дебаффа. Ультимейт Oracle хардконтрит Doom.' },
      { hero: 'abaddon', advantage: 8.3, reason: 'Borrowed Time активируется под Doom. Aphotic Shield диспелит Doom (Aghanim\'s сфера с апгрейдом). Абаддон — главный anti-Doom support.' },
      { hero: 'lifestealer', advantage: 7.9, reason: 'Rage (magic immunity) позволяет самому кастовать внутри Doom — LS выживает. Если Doom слабый, Rage + Feast убивают Doom в ответ.' },
      { hero: 'silencer', advantage: 7.6, reason: 'Pre-silence не даёт Doom активировать Doom spell вовремя. Global Silence на иниц — Doom не может использовать Devour на нужного крипа.' },
      { hero: 'naga_siren', advantage: 7.3, reason: 'Song of Siren: если союзник под Doom — Song его усыпляет? Нет, Doom продолжает тикать. Но Song меняет расстановку, позволяя вынести Doom самого.' },
      { hero: 'puck', advantage: 7.0, reason: 'Phase Shift уклоняется от Doom заброски. Dream Coil в момент инициации = позиционный nightmare для Doom. Если Doom промахнул — он бесполезен.' },
    ],
  },
  drow_ranger: {
    counters: [
      { hero: 'slark', advantage: 8.4, reason: 'Dark Pact снимает Gust silence моментально. Shadow Dance в атаке — неуязвим. Slark сближается с Drow быстро — убивает в меле.' },
      { hero: 'phantom_lancer', advantage: 8.1, reason: 'Иллюзии PL сбрасывают Marksmanship (нужно 3 врага рядом — иллюзии считаются). Drow теряет главную пассивку.' },
      { hero: 'bounty_hunter', advantage: 7.7, reason: 'Track + невидимость позволяет подойти вплотную. Drow хрупкая в меле, Shadow Walk инициация убивает до Gust.' },
      { hero: 'storm_spirit', advantage: 7.4, reason: 'Ball Lightning закрывает дистанцию мгновенно. Gust silence — Storm строит BKB. Electric Vortex держит Drow в меле.' },
      { hero: 'legion_commander', advantage: 7.2, reason: 'Duel на Drow — она физически слабая в меле. Press the Attack диспелит Gust silence. Drow проигрывает Duel почти всегда.' },
      { hero: 'axe', advantage: 6.9, reason: 'Berserker\'s Call не даёт Drow использовать Gust (stunned/forced attack). Counter Helix убивает её быстро в меле.' },
    ],
  },
  earthshaker: {
    counters: [
      { hero: 'phantom_lancer', advantage: 8.2, reason: 'PL иллюзии усиливают Echo Slam против PL самого... но PL строит Diffusal + linkens что уклоняется от Fissure. Основная проблема: Echo Slam убивает иллюзии, но не оригинала если линкенс.' },
      { hero: 'naga_siren', advantage: 8.0, reason: 'Song сбрасывает ультимейт ES. Net держит Earthshaker на месте без Blink Item.' },
      { hero: 'windranger', advantage: 7.7, reason: 'Windrun evasion + Shackleshot не даёт ES Blink-инициировать без потерь. Shackleshot блокирует Blink позицию.' },
      { hero: 'morphling', advantage: 7.4, reason: 'Waveform уходит из Fissure блокировки. Attribute Shift выживает под Echo Slam burst. ES нужна идеальная позиция — Morph её ломает.' },
      { hero: 'puck', advantage: 7.1, reason: 'Phase Shift уклоняется от Fissure/Echo. Illusory Orb escape из Blink позиции ES.' },
      { hero: 'faceless_void', advantage: 6.8, reason: 'Chronosphere блокирует ES в момент каста Fissure. ES в Chrono = dead.' },
    ],
  },
  faceless_void: {
    counters: [
      { hero: 'oracle', advantage: 8.5, reason: 'False Promise нейтрализует Chronosphere: союзник живёт всё время хрона. Fate\'s Edict даёт физическую неуязвимость в Хроне.' },
      { hero: 'io', advantage: 8.2, reason: 'Tether + Relocate: союзник в Chrono телепортируется, Relocate ломает ультимейт Void. Overcharge heal > Void DPS внутри хрона.' },
      { hero: 'winter_wyvern', advantage: 7.9, reason: 'Winter\'s Curse: союзники Void начинают атаковать Void внутри его хрона! Лучший каунтер в игре на ультимейт уровне.' },
      { hero: 'naga_siren', advantage: 7.7, reason: 'Song отменяет Chronosphere (все засыпают, хрон продолжается но никто не двигается — Naga может войти в сон). Фактически бесполезный хрон.' },
      { hero: 'enigma', advantage: 7.5, reason: 'Black Hole > Chronosphere по инициации. Enigma инициирует раньше — Void не может использовать Chrono без попадания в Black Hole.' },
      { hero: 'dark_willow', advantage: 7.2, reason: 'Shadow Realm делает DW неатакуемой в Chrono. Terror из Shadow Realm бьёт сквозь Chrono.' },
    ],
  },
  invoker: {
    counters: [
      { hero: 'silencer', advantage: 9.1, reason: 'Global Silence — весь Invoker kit = 0. Arcane Curse при каждом Invoke = огромный DoT. Intelligence steal делает Силенсер сильнее с каждым убийством.' },
      { hero: 'doom', advantage: 8.7, reason: 'Doom + Devour negate spell combo. Инвокер без спелов = мёртвый вес. Doom перед Deafening Blast = отмена ультимейта.' },
      { hero: 'anti_mage', advantage: 8.3, reason: 'Mana Break выжигает ману быстрее чем Invoker её тратит. Invoker без маны = просто Quas/Wex/Exort stacks без кастов.' },
      { hero: 'nyx_assassin', advantage: 8.0, reason: 'Mana Burn на Intelligence hero = катастрофа. Vendetta + Mana Burn burst убивает Invoker до завершения первого спела.' },
      { hero: 'outworld_destroyer', advantage: 7.7, reason: 'Arcane Orb = (OD mana - enemy mana) * modifier: Invoker тратит ману постоянно, OD бьёт тяжелее. Astral Imprisonment баним Invoker.' },
      { hero: 'skywrath_mage', advantage: 7.4, reason: 'Ancient Seal silence + magic resist reduction → Invoker уязвим к Mystic Flare burst. Sky убивает Invoker быстро на миду.' },
    ],
  },
  io: {
    counters: [
      { hero: 'ancient_apparition', advantage: 8.6, reason: 'Ice Blast отключает весь хил Io (Tether regen, Overcharge heal). AA делает Io бесполезным supportом.' },
      { hero: 'doom', advantage: 8.3, reason: 'Doom на Io = нет Tether, нет Relocate, нет Overcharge. Пара с Io становится беззащитной.' },
      { hero: 'silencer', advantage: 8.0, reason: 'Global Silence блокирует Relocate в критический момент. Io не может телепортироваться для сейва.' },
      { hero: 'disruptor', advantage: 7.7, reason: 'Glimpse возвращает Io в начальную позицию Relocate — разрывает пару. Thunder Strike на Io мешает Tether бонусу.' },
      { hero: 'rubick', advantage: 7.4, reason: 'Spell Steal Relocate → Rubick получает лучший global-TP в игре. Используется для спасения союзников или инициации.' },
      { hero: 'nyx_assassin', advantage: 7.1, reason: 'Vendetta burst убивает Io до активации Overcharge. Mana Burn не даёт тратить ману на Spirits.' },
    ],
  },
  juggernaut: {
    counters: [
      { hero: 'witch_doctor', advantage: 8.1, reason: 'Paralyzing Cask bounce-stuns через Blade Fury. Death Ward убивает Jugg вне Blade Fury spell immunity. Maledict ставит DoT до Omnislash.' },
      { hero: 'bristleback', advantage: 7.8, reason: 'Quill Spray наносит physical damage который стакает. BB в спине снижает весь урон. Вискозный слизь замедляет между Blade Fury.' },
      { hero: 'phantom_assassin', advantage: 7.5, reason: 'Blur evasion vs Omnislash (все атаки могут промахнуться при blur). PA убивает Jugg за ультимейта быстрее.' },
      { hero: 'grimstroke', advantage: 7.2, reason: 'Ink Swell stuns Jugg + доносит урон через Blade Fury (magic damage прерывает? нет, но setup). Stroke of Fate урон.' },
      { hero: 'timbersaw', advantage: 6.9, reason: 'Reactive Armor стакает при атаках Omnislash. Jugg атакует Timber 10+ раз = Timber получает 20+ armor. Timber выживает Omnislash.' },
      { hero: 'abaddon', advantage: 6.7, reason: 'Borrowed Time активируется под Omnislash. Aphotic Shield поглощает урон. Jugg тратит ультимейт впустую.' },
    ],
  },
  legion_commander: {
    counters: [
      { hero: 'oracle', advantage: 8.9, reason: 'Fate\'s Edict даёт physical immunity → Legion не может атаковать в Duel. Союзник выживает Duel без единой атаки.' },
      { hero: 'winter_wyvern', advantage: 8.6, reason: 'Cold Embrace (physical immunity) на союзника в Duel → LC не может нанести урон. Duel = 0 damage = 0 стаков.' },
      { hero: 'omniknight', advantage: 8.3, reason: 'Guardian Angel physical immunity отменяет Duel damage. LC не получает стаки в Guardian Angel window.' },
      { hero: 'ancient_apparition', advantage: 7.8, reason: 'Ice Blast отключает Press the Attack heal. Без heal LC теряет sustainability в Duel.' },
      { hero: 'phantom_assassin', advantage: 7.5, reason: 'PA может выиграть Duel если Coup de Grace прокает — critical strike убивает LC первой. Риск-игра в пользу PA.' },
      { hero: 'underlord', advantage: 7.2, reason: 'Firestorm + Pit of Malice не дают LC инициировать Duel. Dark Rift relocate убирает союзника из зоны LC.' },
    ],
  },
  morphling: {
    counters: [
      { hero: 'silencer', advantage: 8.2, reason: 'Global Silence blocks Waveform. Morphling без Waveform не имеет escape/initiate механики. Intelligence steal + Arcane Curse ломает всю стратегию.' },
      { hero: 'doom', advantage: 7.9, reason: 'Doom блокирует Attribute Shift — Morphling не может перекачать статы для выживания. Без Attribute Shift умирает быстро.' },
      { hero: 'ancient_apparition', advantage: 7.6, reason: 'Ice Blast блокирует Attribute Shift heal. Морфлинг активно использует Attribute Shift для регенерации — AA отключает это.' },
      { hero: 'outworld_destroyer', advantage: 7.3, reason: 'Astral Imprisonment: Morph внутри = он не может Waveform, Replicate, Attribute Shift. Выходит из ОД и умирает от OD burst.' },
      { hero: 'lina', advantage: 7.0, reason: 'Laguna Blade burst убивает Morphling в окне низкого HP (после Waveform атаки). Lina stun + Laguna гарантированный kill.' },
      { hero: 'phantom_assassin', advantage: 6.8, reason: 'Coup de Grace может one-shot Morphling в low-AGI стате. Если Morph перекачал STR — критует не убивает. Если AGI — одиночный крит смертелен.' },
    ],
  },
  phantom_assassin: {
    counters: [
      { hero: 'witch_doctor', advantage: 8.3, reason: 'Cask bounce stuns уменьшают эффективность позиционирования. Death Ward игнорирует Blur evasion (не atk roll based). PA умирает под Death Ward быстро.' },
      { hero: 'viper', advantage: 8.0, reason: 'Viper Strike + corrosive skin: physical slow не даёт PA убегать. Break-эффект снимает Blur если у Viper есть Heart Breaker (аналог). Corrosion stacks.' },
      { hero: 'monkey_king', advantage: 7.7, reason: 'MKB True Strike на Monkey King игнорирует Blur полностью при покупке. Wukong\'s Command убивает PA в зоне 360°.' },
      { hero: 'razor', advantage: 7.5, reason: 'Static Link крадёт agility damage — PA теряет основной DPS источник. Eye of the Storm фокусирует самого low-armor героя.' },
      { hero: 'oracle', advantage: 7.2, reason: 'False Promise спасает carry под Omnislash... аналогично под PA ультимейтом — союзник выживает критическую фазу.' },
      { hero: 'heaven_halberd_carrier', advantage: 7.0, reason: 'Heaven\'s Halberd disarm отменяет физ атаки PA на 3.5 секунды. PA без атак = нет урона. Ключевая покупка против PA.' },
    ],
  },
  phantom_lancer: {
    counters: [
      { hero: 'ember_spirit', advantage: 8.4, reason: 'Sleight of Fist бьёт по всем иллюзиям PL в радиусе. AOE burst убивает весь пакет иллюзий за 1 ротацию. Ember — лучший counter PL.' },
      { hero: 'io', advantage: 8.1, reason: 'Spirits от IO (с Aghanim) убивают иллюзии пассивно. Overcharge + Tether делает carry непробиваемым для PL пакета.' },
      { hero: 'luna', advantage: 7.8, reason: 'Eclipse попадает по всем иллюзиям. Glaives рикошетят — каждая иллюзия получает урон. Moon Glaives с Radiance = instant иллюзии мёртвы.' },
      { hero: 'arc_warden', advantage: 7.5, reason: 'Spark Wraith наносит AoE damage — убивает иллюзии пассивно. Double + Radiance полностью нейтрализует PL.' },
      { hero: 'shadow_demon', advantage: 7.2, reason: 'Disruption создаёт иллюзии PL, которые бьют оригинала. Demonic Purge снимает всех иллюзий, слоу оригинала.' },
      { hero: 'earthshaker', advantage: 7.0, reason: 'Echo Slam — 5+ иллюзий = каждый удар наносит X * (иллюзии) damage. PL пакет это идеальная цель для Echo.' },
    ],
  },
  pudge: {
    counters: [
      { hero: 'naga_siren', advantage: 8.0, reason: 'Song сбрасывает hook channeling и positioning. Net держит Pudge не давая найти позицию для hook.' },
      { hero: 'morphling', advantage: 7.7, reason: 'Waveform уходит из hook дистанции + позиции. Pudge не может предсказать direction Waveform.' },
      { hero: 'puck', advantage: 7.4, reason: 'Phase Shift уклоняется от Hook. Illusory Orb позиционирует Puck туда-сюда. Pudge не может поймать Puck в hook.' },
      { hero: 'anti_mage', advantage: 7.2, reason: 'Blink уходит от Hook + Rot зоны. Mana Break выжигает Pudge — без маны Rot не работает (бесплатная), но Dismember стоит 100 маны.' },
      { hero: 'spirit_breaker', advantage: 6.9, reason: 'Charge + Bash прерывает Dismember channeling. SB атакует Pudge из любой точки карты — проблемная мобильность.' },
      { hero: 'silencer', advantage: 6.7, reason: 'Global Silence в момент Dismember прерывает channeling. Pudge после промаха hook легко silenced.' },
    ],
  },
  queen_of_pain: {
    counters: [
      { hero: 'anti_mage', advantage: 8.5, reason: 'Mana Break выжигает ману QoP — без маны нет spells. Spell Shield поглощает магический урон. AM бьёт QoP в сплите.' },
      { hero: 'nyx_assassin', advantage: 8.1, reason: 'Mana Burn на Intelligence hero критичен. Spiked Carapace stuns при Shadow Strike попадании. Vendetta burst убивает QoP.' },
      { hero: 'diffusal_carry', advantage: 7.8, reason: 'Diffusal Purge снимает Shadow Strike DoT. Manabreak выжигает. QoP теряет мобильность без Blink-спела.' },
      { hero: 'orchid_carrier', advantage: 7.5, reason: 'Orchid Malevolence silence: QoP без Blink и Scream = лёгкая цель. Soul Burn (после Orchid) = смерть.' },
      { hero: 'outworld_destroyer', advantage: 7.2, reason: 'Arcane Orb + Astral: пока QoP в Astral — OD атакует союзников. Sanity\'s Eclipse (INT based) убивает всю команду.' },
      { hero: 'doom', advantage: 6.9, reason: 'Doom removes all QoP mobility spells. Без Blink QoP уязвима к любому control.' },
    ],
  },
  shadow_fiend: {
    counters: [
      { hero: 'silencer', advantage: 8.7, reason: 'Global Silence в момент Requiem of Souls отменяет ультимейт. Arcane Curse при каждом Shadowraze. SF против Silencer = nightmare.' },
      { hero: 'anti_mage', advantage: 8.3, reason: 'Mana Break выжигает ману SF до Requiem. AM blink уходит от Shadowraze позиции.' },
      { hero: 'doom', advantage: 7.9, reason: 'Doom отключает Necromastery (passive) = SF теряет stack damage. Requiem не может быть cast под Doom.' },
      { hero: 'spirit_breaker', advantage: 7.6, reason: 'Charge прерывает Requiem channeling (если успевает). Bash прерывает любой каст. SB инициирует через туман на SF.' },
      { hero: 'bloodseeker', advantage: 7.4, reason: 'Rupture на SF = он не может Blink/Shadow Raze без урона. Silence держит SF на месте. Low-HP SF — хилится BS.' },
      { hero: 'nyx_assassin', advantage: 7.1, reason: 'Vendetta + Mana Burn burst убивает SF до начала teamfight rotation. Mana Burn на Necromastery-стакающего героя.' },
    ],
  },
  sven: {
    counters: [
      { hero: 'winter_wyvern', advantage: 8.2, reason: 'Cold Embrace (physical immunity) на carry в момент God\'s Strength ультимейта = Sven ничего не делает. Лучший counter ult.' },
      { hero: 'oracle', advantage: 8.0, reason: 'Fate\'s Edict physical immunity. Sven купил BKB, Oracle дал physical immunity союзнику — Sven не может атаковать цель.' },
      { hero: 'phantom_assassin', advantage: 7.7, reason: 'Blur evasion: Sven Great Cleave + God\'s Strength атаки промахиваются. PA убивает Sven быстрее чем он Warcry.' },
      { hero: 'windranger', advantage: 7.4, reason: 'Windrun evasion vs Sven physical damage. Shackleshot блокирует Sven storm hammer инициацию.' },
      { hero: 'ancient_apparition', advantage: 7.1, reason: 'Ice Blast отключает God\'s Strength HP threshold? Нет, но блокирует Warcry heal regen. AoE slow делает Sven легкой целью.' },
      { hero: 'disruptor', advantage: 6.9, reason: 'Kinetic Field ловит Sven в бою. Static Storm silence не даёт использовать активные предметы. Glimpse отправляет Sven назад.' },
    ],
  },
  tinker: {
    counters: [
      { hero: 'lifestealer', advantage: 8.9, reason: 'Rage (magic immunity) нивелирует весь arsenal Tinker. LS убивает Tinker в physical атаке. Жизненно критичный counter.' },
      { hero: 'nyx_assassin', advantage: 8.5, reason: 'Vendetta позволяет подкрасться к Tinker base camp. Mana Burn выжигает. Без маны Tinker не может Rearm.' },
      { hero: 'anti_mage', advantage: 8.2, reason: 'Mana Break уничтожает запасы Tinker. Blink уходит из лазера. AM split убивает Tinker быстро.' },
      { hero: 'bloodseeker', advantage: 7.9, reason: 'Rupture: если Tinker двигается между базой — instant death. Tinker ОБЯЗАН двигаться для Rearm позиции — Rupture = kill.' },
      { hero: 'doom', advantage: 7.6, reason: 'Doom снимает Rearm пассивку (точнее Doom делает каст Rearm невозможным). Devour нейтрализует threat.' },
      { hero: 'faceless_void', advantage: 7.3, reason: 'Chronosphere: Tinker в хроне не может Rearm или уйти. Убивается до выхода из хрона.' },
    ],
  },
  zeus: {
    counters: [
      { hero: 'lifestealer', advantage: 8.4, reason: 'Rage magic immunity vs Zeus (весь damage магический). LS под Rage = неуязвим к Zeus. Купи Rage — Zeus бесполезен против тебя.' },
      { hero: 'huskar', advantage: 8.1, reason: 'Berserker Blood + magic immunity vs Zeus AoE. Huskar low-HP passive = immuneность к magic. Zeus не может убить Huskar.' },
      { hero: 'anti_mage', advantage: 7.8, reason: 'Spell Shield: каждый Zeus arc lightning заряжает Mana Shield — AT получает magic damage reduction. Mana Break выжигает быстро.' },
      { hero: 'clinkz', advantage: 7.5, reason: 'Clinkz невидим большую часть времени — Zeus Thundergod\'s Wrath наносит True Sight урон... но не убивает на дистанции. Clinkz убивает Zeus в физ.' },
      { hero: 'nyx_assassin', advantage: 7.2, reason: 'Spiked Carapace stuns Zeus при попытке cast Lightning Bolt. Vendetta burst убивает хрупкого Zeus мгновенно.' },
      { hero: 'razor', advantage: 7.0, reason: 'Static Link крадёт base damage Zeus. Eye of the Storm атакует его пассивно. Zeus хрупкий — Razor в lane убивает его быстро.' },
    ],
  },
};

// ============================================================
// 4. DRAFT ANALYSIS ALGORITHM
// ============================================================
const DRAFT_WEIGHTS = {
  heavy_nuker: { tank: 1.8, healer: 1.6, magic_immunity: 2.0, bkb: 1.9 },
  heavy_physical: { armor: 1.9, evasion: 1.7, ghost_scepter: 1.6, blademail: 1.5 },
  heavy_control: { bkb: 2.0, lotus_orb: 1.8, dispel: 1.7, linken: 1.9 },
  heavy_illusion: { aoe_damage: 2.0, radiance: 1.9, splitter: 1.7 },
  heavy_push: { anti_push: 1.8, guardian: 1.5, defend_heroes: 1.7 },
  heavy_mobility: { vision: 1.8, silence: 1.9, root: 1.7 },
  heavy_healer: { ancient_apparition: 2.0, spirit_vessel: 1.9, anti_heal: 1.8 },
  heavy_invisibility: { sentry: 2.0, gem: 1.9, dust: 1.7, true_sight: 1.8 },
  single_target: { bkb: 1.5, evasion: 1.6 },
  no_escape: { gap_closers: 1.8, mobility: 1.7 },
};

function analyzeEnemyTeam(enemyTeam) {
  const profile = {
    nukers: 0, physical: 0, control: 0, illusions: 0,
    push: 0, mobility: 0, healers: 0, invisibility: 0,
    magic_immunity: 0, silence: 0, burst: 0, lane_dominant: 0,
    heroes: [],
  };

  for (const heroKey of enemyTeam) {
    const hero = HEROES[heroKey];
    if (!hero) continue;
    profile.heroes.push(heroKey);

    if (hero.types.includes('nuker')) profile.nukers++;
    if (hero.mechanics.some(m => ['physical_damage', 'bash', 'critical_strike'].includes(m))) profile.physical++;
    if (hero.types.includes('disabler')) profile.control++;
    if (hero.mechanics.includes('illusions')) profile.illusions++;
    if (hero.types.includes('pusher')) profile.push++;
    if (hero.mechanics.includes('mobility') || hero.mechanics.includes('blink')) profile.mobility++;
    if (hero.types.includes('healer')) profile.healers++;
    if (hero.mechanics.includes('invisibility')) profile.invisibility++;
    if (hero.mechanics.some(m => ['magic_immunity', 'spell_immunity'].includes(m))) profile.magic_immunity++;
    if (hero.mechanics.includes('silence')) profile.silence++;
    if (hero.types.some(t => ['nuker', 'carry'].includes(t))) profile.burst++;
  }

  return profile;
}

function scoreDraftSuggestion(heroKey, enemyProfile) {
  const hero = HEROES[heroKey];
  if (!hero) return 0;

  let score = 50;
  const em = enemyProfile;

  if (em.nukers >= 3) {
    if (hero.mechanics.includes('magic_immunity')) score += 15 * DRAFT_WEIGHTS.heavy_nuker.magic_immunity;
    if (hero.types.includes('tank')) score += 12 * DRAFT_WEIGHTS.heavy_nuker.tank;
    if (hero.types.includes('healer')) score += 10 * DRAFT_WEIGHTS.heavy_nuker.healer;
    if (hero.mechanics.some(m => ['bkb', 'magic_immunity'].includes(m))) score += 14;
  }

  if (em.physical >= 3) {
    if (hero.mechanics.includes('evasion')) score += 13 * DRAFT_WEIGHTS.heavy_physical.evasion;
    if (hero.types.includes('tank')) score += 11 * DRAFT_WEIGHTS.heavy_physical.armor;
    if (hero.mechanics.includes('armor')) score += 10;
  }

  if (em.control >= 3) {
    if (hero.mechanics.some(m => ['dispel', 'magic_immunity'].includes(m))) score += 16 * DRAFT_WEIGHTS.heavy_control.dispel;
    if (hero.mechanics.includes('blink')) score += 8;
  }

  if (em.illusions >= 2) {
    if (hero.mechanics.some(m => ['aoe_damage', 'cleave'].includes(m))) score += 14 * DRAFT_WEIGHTS.heavy_illusion.aoe_damage;
  }

  if (em.mobility >= 3) {
    if (hero.mechanics.includes('silence')) score += 12 * DRAFT_WEIGHTS.heavy_mobility.silence;
    if (hero.mechanics.includes('root')) score += 10 * DRAFT_WEIGHTS.heavy_mobility.root;
  }

  if (em.healers >= 2) {
    if (hero.mechanics.some(m => ['anti_heal', 'heal_disable'].includes(m))) score += 15 * DRAFT_WEIGHTS.heavy_healer.anti_heal;
  }

  if (em.invisibility >= 2) {
    if (hero.mechanics.includes('true_sight')) score += 14 * DRAFT_WEIGHTS.heavy_invisibility.true_sight;
  }

  if (em.push >= 3) {
    if (hero.types.includes('durable') || hero.mechanics.includes('aoe_damage')) score += 12;
  }

  return Math.round(score);
}

function calculateDraftScore(enemyTeam) {
  const enemyProfile = analyzeEnemyTeam(enemyTeam);

  const threatLevel = {
    magic: enemyProfile.nukers >= 3 ? 'CRITICAL' : enemyProfile.nukers >= 2 ? 'HIGH' : 'LOW',
    physical: enemyProfile.physical >= 3 ? 'CRITICAL' : enemyProfile.physical >= 2 ? 'HIGH' : 'LOW',
    control: enemyProfile.control >= 3 ? 'CRITICAL' : enemyProfile.control >= 2 ? 'HIGH' : 'LOW',
    push: enemyProfile.push >= 3 ? 'HIGH' : 'MEDIUM',
    invisibility: enemyProfile.invisibility >= 2 ? 'HIGH' : 'LOW',
  };

  const recommendations = {};
  for (const heroKey of Object.keys(HEROES)) {
    const s = scoreDraftSuggestion(heroKey, enemyProfile);
    if (s > 60) recommendations[heroKey] = s;
  }

  const sorted = Object.entries(recommendations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([hero, score]) => ({
      hero,
      localName: HEROES[hero]?.localName || hero,
      score,
      reasoning: buildDraftReasoning(hero, enemyProfile),
    }));

  const countersMap = {};
  for (const enemyHero of enemyTeam) {
    const data = COUNTERPICKS[enemyHero];
    if (data) {
      for (const c of data.counters) {
        if (!countersMap[c.hero]) countersMap[c.hero] = 0;
        countersMap[c.hero] += c.advantage;
      }
    }
  }

  const topCounters = Object.entries(countersMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([hero, totalAdvantage]) => ({
      hero,
      localName: HEROES[hero]?.localName || hero,
      totalAdvantage: Math.round(totalAdvantage * 10) / 10,
    }));

  const overallScore = Math.round(
    (enemyProfile.nukers * 10) +
    (enemyProfile.physical * 8) +
    (enemyProfile.control * 12) +
    (enemyProfile.mobility * 7) +
    (enemyProfile.push * 6)
  );

  return {
    enemyProfile,
    threatLevel,
    topRecommendations: sorted,
    topCounters,
    overallEnemyThreat: overallScore,
    itemRecommendations: getItemRecommendations(enemyProfile),
    oracleComment: getOracleComment(enemyProfile, overallScore),
  };
}

function buildDraftReasoning(heroKey, profile) {
  const hero = HEROES[heroKey];
  if (!hero) return '';
  const reasons = [];

  if (profile.nukers >= 3 && hero.types.includes('tank')) reasons.push('Tank против тройного нюкера');
  if (profile.physical >= 3 && hero.mechanics.includes('evasion')) reasons.push('Evasion против физ ДПС');
  if (profile.control >= 3 && hero.mechanics.some(m => ['dispel', 'magic_immunity'].includes(m))) reasons.push('Dispel/BKB против hard CC');
  if (profile.illusions >= 2 && hero.mechanics.some(m => ['aoe_damage', 'cleave'].includes(m))) reasons.push('AoE против иллюзий');
  if (profile.invisibility >= 2 && hero.mechanics.includes('true_sight')) reasons.push('True Sight против инвизилити');
  if (profile.healers >= 2 && hero.mechanics.includes('anti_heal')) reasons.push('Anti-heal против хилеров');

  return reasons.join(' | ') || 'Общий пик по meta';
}

// ============================================================
// 5. ITEMS DATABASE + SITUATIONAL SYSTEM
// ============================================================
const ITEMS = {
  // === BOOTS ===
  boots_of_speed: { cost: 500, category: 'boots', stats: { move_speed: 45 } },
  phase_boots: { cost: 1500, category: 'boots', stats: { damage: 18, armor: 4, active: 'phase' } },
  power_treads: { cost: 1400, category: 'boots', stats: { attack_speed: 45, primary_stat: 10 } },
  arcane_boots: { cost: 1300, category: 'boots', stats: { mana: 250, active: 'restore_mana' } },
  tranquil_boots: { cost: 975, category: 'boots', stats: { hp_regen: 14, move_speed: 55 } },
  guardian_greaves: { cost: 2200, category: 'boots', stats: { armor: 5, regen: 4, active: 'mend' } },
  boots_of_travel: { cost: 2500, category: 'boots', stats: { move_speed: 100, active: 'tp' } },

  // === WEAPONS / DAMAGE ===
  blades_of_attack: { cost: 420, category: 'weapon', stats: { damage: 9 } },
  broadsword: { cost: 1000, category: 'weapon', stats: { damage: 18 } },
  quarterstaff: { cost: 875, category: 'weapon', stats: { damage: 10, attack_speed: 10 } },
  shadow_blade: { cost: 3000, category: 'weapon', stats: { damage: 22, attack_speed: 30, active: 'shadow_walk' } },
  silver_edge: { cost: 5250, category: 'weapon', stats: { damage: 52, attack_speed: 30, active: 'break_invis' } },
  daedalus: { cost: 5650, category: 'weapon', stats: { damage: 88, critical_strike: 30 } },
  desolator: { cost: 3500, category: 'weapon', stats: { damage: 50, armor_reduction: 6 } },
  divine_rapier: { cost: 5700, category: 'weapon', stats: { damage: 330 } },
  monkey_king_bar: {
    cost: 4975, category: 'weapon',
    stats: { damage: 40, attack_speed: 45, true_strike: true },
    counters: ['evasion', 'blur', 'windrun'],
    situation: 'enemy_has_evasion',
    reason: 'True Strike игнорирует уклонение. Против PA Blur, WR Windrun, TA Refraction — обязателен.',
  },
  butterfly: { cost: 4975, category: 'weapon', stats: { agility: 35, attack_speed: 35, evasion: 35 } },
  satanic: { cost: 5050, category: 'weapon', stats: { strength: 25, damage: 25, lifesteal: 25, active: 'unholy_rage' } },
  abyssal_blade: { cost: 6250, category: 'weapon', stats: { strength: 10, damage: 60, bash: 25, active: 'overwhelm' } },
  skull_basher: { cost: 2875, category: 'weapon', stats: { strength: 8, damage: 25, bash: 25 } },
  armlet_of_mordiggian: { cost: 2370, category: 'weapon', stats: { strength: 9, damage: 15, attack_speed: 25, armor: 3 } },
  radiance: { cost: 5000, category: 'weapon', stats: { damage: 60, burn_aoe: true }, situation: 'enemy_has_illusions' },
  echo_sabre: { cost: 2500, category: 'weapon', stats: { strength: 12, intelligence: 12, attack_speed: 20, double_attack: true } },
  crystalys: { cost: 2075, category: 'weapon', stats: { damage: 32, critical_strike: 30 } },

  // === ARMOR / DEFENSE ===
  chainmail: { cost: 550, category: 'armor', stats: { armor: 4 } },
  ring_of_basilius: { cost: 475, category: 'armor', stats: { armor: 2, mana_regen: 1 } },
  assault_cuirass: { cost: 5125, category: 'armor', stats: { armor: 10, attack_speed: 35, aura_armor: 5, aura_reduce: -5 } },
  heart_of_tarrasque: { cost: 5000, category: 'armor', stats: { strength: 45, hp: 300, hp_regen_pct: 1.6 } },
  shivas_guard: { cost: 4750, category: 'armor', stats: { intelligence: 30, armor: 15, active: 'arctic_blast' } },
  blademail: { cost: 2200, category: 'armor', stats: { damage: 22, armor: 6, active: 'damage_return' } },
  crimson_guard: { cost: 3575, category: 'armor', stats: { strength: 13, armor: 6, hp: 250, active: 'guard' } },
  pipe_of_insight: { cost: 3475, category: 'armor', stats: { hp_regen: 8, magic_resist: 30, active: 'pipe_barrier' } },
  hood_of_defiance: { cost: 1975, category: 'armor', stats: { hp_regen: 8, magic_resist: 30 } },
  vanguard: { cost: 1825, category: 'armor', stats: { strength: 6, hp: 250, damage_block: 70 } },
  stout_shield: { cost: 200, category: 'armor', stats: { damage_block: 16 } },
  platemail: { cost: 1400, category: 'armor', stats: { armor: 10 } },
  mekansm: { cost: 2275, category: 'armor', stats: { intelligence: 5, armor: 5, hp_regen: 4, active: 'restore' } },
  eternal_shroud: { cost: 3300, category: 'armor', stats: { magic_resist: 20, hp: 300, spell_lifesteal: true } },

  // === MAGIC / INTELLIGENCE ===
  black_king_bar: {
    cost: 4050, category: 'magic_defense',
    stats: { strength: 10, damage: 24, active: 'avatar' },
    counters: ['magic_damage', 'stun', 'hex', 'sleep', 'drain'],
    situation: 'enemy_heavy_magic_cc',
    reason: 'Magic immunity против burst mages, stun chains, hex. Обязателен против VC, Lina, Lion.',
  },
  linken_sphere: {
    cost: 4900, category: 'magic_defense',
    stats: { strength: 14, agility: 14, intelligence: 14, hp_regen: 8, mana_regen: 4, active: 'spellblock' },
    counters: ['targeted_spells', 'hex', 'doom', 'impale'],
    situation: 'enemy_has_targeted_disable',
    reason: 'Блокирует первый targeted spell. Против Doom, Lion Hex, Impale, Rupture — must-buy.',
  },
  ghost_scepter: {
    cost: 1500, category: 'magic_defense',
    stats: { intelligence: 7, magic_resist: 12, active: 'ethereal' },
    counters: ['physical_damage', 'bash', 'melee_carry'],
    situation: 'enemy_physical_carry',
    reason: 'Ethereal даёт физ иммунитет. Против Sven, CK, Terrorblade, physical carry — спасительная покупка.',
  },
  ethereal_blade: {
    cost: 4700, category: 'magic_defense',
    stats: { agility: 40, active: 'ether_blast', magic_amp: true },
    counters: ['physical_damage'],
    situation: 'enemy_physical_carry',
  },
  eul_scepter: {
    cost: 2750, category: 'utility',
    stats: { intelligence: 10, mana_regen: 2.75, active: 'cyclone' },
    counters: ['disable', 'stun'],
    situation: 'need_self_dispel',
    reason: 'Cyclone = self-dispel. Снимает stun, hex, doom если cast до применения. Рассеивает debuffs.',
  },
  lotus_orb: {
    cost: 3850, category: 'utility',
    stats: { armor: 10, hp_regen: 6, mana_regen: 3, active: 'echo_shell' },
    counters: ['targeted_spells', 'hex', 'doom', 'silence'],
    situation: 'enemy_targeted_spells',
    reason: 'Echo Shell отражает targeted spell обратно на кастера. Против Doom, Lion, Disruptor — контролирует initiators.',
  },

  // === ANTI-HEAL ===
  spirit_vessel: {
    cost: 2980, category: 'anti_heal',
    stats: { strength: 10, intelligence: 8, hp: 250, charge_heal: true, active: 'soul_release' },
    counters: ['healing', 'lifesteal', 'regen_heavy'],
    situation: 'enemy_has_healing',
    reason: 'Soul Release снижает хил цели на 45%. Против Abaddon, Huskar, Underlord, любого Lifesteal carry.',
  },
  heavens_halberd: {
    cost: 3500, category: 'utility',
    stats: { strength: 20, evasion: 20, active: 'disarm' },
    counters: ['physical_carry', 'attack_based'],
    situation: 'enemy_physical_carry',
    reason: 'Disarm: цель не может атаковать 3.5/4 секунды. Против PA, Sven, CK — убивает carry window.',
  },
  ancient_janggo: { cost: 1525, category: 'utility', stats: { strength: 9, agility: 9, active: 'janggo' } },
  solar_crest: { cost: 3000, category: 'utility', stats: { agility: 14, armor: 9, mana_regen: 1.75, active: 'medal' } },

  // === VISION / WARD ===
  gem_of_true_sight: {
    cost: 900, category: 'vision',
    stats: { true_sight_aoe: 1100 },
    counters: ['invisibility', 'smoke'],
    situation: 'enemy_has_invisibility',
    reason: 'True Sight на носителе. Против Riki, BH, Clinkz, Shadow Blade carries — обнуляет механику.',
  },
  sentry_ward: {
    cost: 100, category: 'vision',
    stats: { true_sight_aoe: 950 },
    counters: ['invisibility', 'wards'],
    situation: 'enemy_has_invisibility',
  },
  dust_of_appearance: {
    cost: 180, category: 'vision',
    stats: { true_sight_aoe: 1050, slow: 10 },
    counters: ['invisibility'],
    situation: 'enemy_has_invisibility',
  },
  observer_ward: { cost: 0, category: 'vision', stats: { vision_aoe: 1600 } },

  // === UTILITY ===
  force_staff: {
    cost: 2200, category: 'utility',
    stats: { intelligence: 10, hp_regen: 4, active: 'force' },
    counters: ['positioning_dependent', 'hook', 'lasso'],
    situation: 'need_escape_or_save',
    reason: 'Push себя или союзника 600 единиц. Уходишь из Hook, Lasso, Dream Coil. Обязателен против Pudge и Bat.',
  },
  blink_dagger: {
    cost: 2250, category: 'utility',
    stats: { active: 'blink_1200' },
    situation: 'need_initiation_or_escape',
  },
  aether_lens: { cost: 2275, category: 'utility', stats: { intelligence: 8, mana: 300, cast_range: 225 } },
  aghanims_scepter: { cost: 4200, category: 'utility', stats: { strength: 10, agility: 10, intelligence: 10, upgrades_ability: true } },
  aghanims_shard: { cost: 1400, category: 'utility', stats: { upgrades_ability: true, cheaper: true } },
  refresher_orb: { cost: 5000, category: 'utility', stats: { intelligence: 20, hp_regen: 10, mana_regen: 7, active: 'refresh' } },
  cyclone_eul: { cost: 2750, category: 'utility', stats: {} }, // alias
  rod_of_atos: { cost: 2750, category: 'utility', stats: { intelligence: 24, hp: 350, active: 'cripple' } },
  nullifier: {
    cost: 4700, category: 'dispel',
    stats: { strength: 10, damage: 65, active: 'nullify' },
    counters: ['linken_sphere', 'bkb_users', 'ghost_scepter'],
    situation: 'enemy_has_bkb_or_linken',
    reason: 'Nullify снимает BKB и Linken эффект. Против Linken carry, BKB-спама — разрывает защиту.',
  },
  diffusal_blade: {
    cost: 2800, category: 'utility',
    stats: { agility: 22, active: 'purge' },
    counters: ['heavier_mana', 'ghost_scepter', 'strong_buffs'],
    situation: 'enemy_low_mana_dependent',
    reason: 'Purge снимает buffs (Ghost, Aphotic Shield). Mana Burn выжигает. Против Medusa, Wraith King — критично.',
  },
  scythe_of_vyse: {
    cost: 5675, category: 'utility',
    stats: { intelligence: 35, hp_regen: 10, mana_regen: 6.5, active: 'hex' },
    situation: 'need_hard_disable',
    reason: 'Hex: 3.5 секунды полного disable. Невозможно отменить без Lotus/BKB. Лучший late-game disable item.',
  },
  orchid_malevolence: {
    cost: 4075, category: 'silence',
    stats: { intelligence: 25, damage: 30, attack_speed: 30, active: 'soul_burn' },
    counters: ['spell_casters', 'mobile_heroes'],
    situation: 'enemy_spell_dependent',
    reason: 'Soul Burn silence на 5 секунд + 30% magic damage amplification. Против Storm Spirit, QoP, Invoker — kill confirm.',
  },
  bloodthorn: {
    cost: 6750, category: 'silence',
    stats: { intelligence: 35, damage: 60, attack_speed: 60, active: 'soul_burn_upgraded' },
    counters: ['evasion', 'spell_casters'],
    situation: 'enemy_has_evasion_AND_spells',
  },
  maelstrom: { cost: 3000, category: 'weapon', stats: { damage: 24, attack_speed: 25, chain_lightning: true } },
  mjollnir: { cost: 5400, category: 'weapon', stats: { damage: 24, attack_speed: 70, chain_lightning: true } },
  gleipnir: { cost: 6300, category: 'weapon', stats: { intelligence: 24, damage: 35, active: 'ensnare' } },
  octarine_core: { cost: 5900, category: 'magic', stats: { strength: 24, intelligence: 24, cooldown_reduction: 25 } },
  kaya_and_sange: { cost: 4200, category: 'hybrid', stats: { strength: 18, intelligence: 18, spell_amp: 12, status_resist: 12 } },
  yasha_and_kaya: { cost: 4200, category: 'hybrid', stats: { agility: 16, intelligence: 16, spell_amp: 12, move_speed_pct: 10 } },
  sange_and_yasha: { cost: 4200, category: 'hybrid', stats: { strength: 18, agility: 18, status_resist: 16, move_speed_pct: 8 } },
  dragon_lance: { cost: 1900, category: 'weapon', stats: { strength: 14, agility: 8, attack_range: 140 } },
  hurricane_pike: { cost: 4450, category: 'weapon', stats: { strength: 14, agility: 20, attack_range: 140, active: 'hurricane' } },
  manta_style: { cost: 4600, category: 'utility', stats: { agility: 26, strength: 10, move_speed_pct: 5, active: 'mirror_image' } },
};

const ITEM_SITUATIONS = [
  {
    condition: 'enemy_has_evasion',
    trigger: (profile) => profile.heroes.some(h => HEROES[h]?.mechanics.includes('evasion')),
    items: ['monkey_king_bar'],
    priority: 'HIGH',
    reason: 'True Strike нивелирует Blur PA, Windrun WR, Refraction TA.',
  },
  {
    condition: 'enemy_heavy_magic_cc',
    trigger: (profile) => profile.nukers >= 3 || profile.control >= 3,
    items: ['black_king_bar', 'pipe_of_insight', 'eternal_shroud'],
    priority: 'CRITICAL',
    reason: 'BKB обязателен против 3+ nukers или disablers. Pipe protect команды от AoE magic.',
  },
  {
    condition: 'enemy_has_healing',
    trigger: (profile) => profile.healers >= 2 || profile.heroes.some(h => HEROES[h]?.mechanics.includes('heal')),
    items: ['spirit_vessel', 'heavens_halberd'],
    priority: 'HIGH',
    reason: 'Spirit Vessel снижает хил на 45%. Против IO, Abaddon, Omni — must-buy.',
  },
  {
    condition: 'enemy_has_invisibility',
    trigger: (profile) => profile.invisibility >= 1,
    items: ['gem_of_true_sight', 'dust_of_appearance', 'sentry_ward'],
    priority: 'HIGH',
    reason: 'True Sight обязателен. Gem — постоянный, Dust — ситуационный.',
  },
  {
    condition: 'enemy_targeted_spells',
    trigger: (profile) => profile.heroes.some(h => COUNTERPICKS[h]?.counters.some(c => c.reason?.includes('targeted'))),
    items: ['linken_sphere', 'lotus_orb'],
    priority: 'HIGH',
    reason: 'Linken блокирует первый targeted spell. Lotus Echo Shell — отражает обратно.',
  },
  {
    condition: 'enemy_has_illusions',
    trigger: (profile) => profile.illusions >= 2,
    items: ['radiance', 'maelstrom'],
    priority: 'HIGH',
    reason: 'Radiance burn убивает все иллюзии за 3-4 секунды. AoE damage — приоритет.',
  },
  {
    condition: 'enemy_physical_carry',
    trigger: (profile) => profile.physical >= 3,
    items: ['ghost_scepter', 'heavens_halberd', 'crimson_guard'],
    priority: 'HIGH',
    reason: 'Ghost Scepter = физ иммунитет. Heaven\'s Halberd Disarm = нет атак 4 секунды.',
  },
  {
    condition: 'enemy_has_bkb',
    trigger: (profile) => profile.magic_immunity >= 2,
    items: ['nullifier', 'silver_edge'],
    priority: 'MEDIUM',
    reason: 'Nullifier снимает BKB/Linken. Silver Edge добавляет Break (отключает passives).',
  },
  {
    condition: 'enemy_spell_dependent',
    trigger: (profile) => profile.nukers >= 3,
    items: ['orchid_malevolence', 'scythe_of_vyse'],
    priority: 'MEDIUM',
    reason: 'Orchid silence kill confirm. Hex на ключевого carrier = выключить из fight.',
  },
  {
    condition: 'need_escape_or_save',
    trigger: (profile) => profile.control >= 3 || profile.mobility >= 3,
    items: ['force_staff', 'eul_scepter', 'blink_dagger'],
    priority: 'HIGH',
    reason: 'Force Staff / Blink / Eul — escape из AOE initiation или save союзника.',
  },
];

function getItemRecommendations(enemyProfile) {
  const recs = [];
  for (const sit of ITEM_SITUATIONS) {
    if (sit.trigger(enemyProfile)) {
      recs.push({
        situation: sit.condition,
        items: sit.items.map(key => ({
          key,
          name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          cost: ITEMS[key]?.cost || 0,
          reason: sit.reason,
        })),
        priority: sit.priority,
      });
    }
  }
  return recs.sort((a, b) => (a.priority === 'CRITICAL' ? -1 : b.priority === 'CRITICAL' ? 1 : 0));
}

// ============================================================
// 6. AI ORACLE — 100+ PHRASES (DOTA SLANG)
// ============================================================
const ORACLE_PHRASES = {
  bad_draft: [
    'Братан, ты задрафтил 5 кэрри без единого сапорта. Это не драфт, это птсики в 10 рейтинге.',
    'Три ближника против пяти рендж? Это не позиционка, это публичная казнь.',
    'У врага весь стан мира, а ты пикнул Медузу без БКБшки? Ты фидишь не осознавая этого.',
    'Вижн на нуле, пять сентри не куплено, рики пятый час инвизится — может хватит?',
    'Ты взял 4 инта и ни одного нормального фармера. Это не мид, это мид в голове у тебя.',
    'Бро, у врага Лайфстилер + Омни + Дав — ты собираешься фидить или как?',
    'Этот драфт выглядит так, как будто ты пикнул рандомом пять раз подряд. В 2к так не делают.',
    'У тебя три хард-каунтера к своему же кэрри. Ты сам себя задрафтил, уважаю.',
    'Нет диспела, нет бкб, нет иллюзий — но есть три плохих пика. Мощно.',
    'Вся команда — нюкеры ближнего боя без мобильности. Фридомный ульт Тайда в лицо — и всё.',
    'Пикнул ТА против тройного нюкера без ни одного танка? Ты точно хочешь выиграть?',
    'Команда выглядит как пять одиноких волков, которые никогда не слышали слово "синергия".',
    'Без хилера против Undying + WD — пушишь на рожон, но зато смело.',
    'Вся позиционка полетела в трубу — слабый сайдлейн, слабый мид, слабый оффлейн. Как?',
    'У вас нет single-target disable. Войд спокойно кидает хрон и ваша команда просто стоит.',
    'Три carry без сапорта? Братан, даже в пабе так не играют.',
    'Весь нюк — магический, а у них BKB на четырёх. Приятной игры, ты фидишь всей командой.',
    'Ты задрафтил стекло против брони. Это не мета, это не стратегия, это просто плохо.',
    'Нет анти-хила против IO + Омни + Аба? Просто смирись с поражением на 25 минуте.',
    'Слушай, может просто GG нажмём заранее? Уважаю время всех участников.',
  ],
  good_draft: [
    'Слушай, это реально огонь — контр-пик на контр-пике, чистая синергия. Уважаю.',
    'Три хардкаунтера к их кэрри? Они даже фармить не начнут.',
    'Ультимейт-комбо Тайд + Дакр + Энигма — это не игра, это шоу.',
    'Вижн на всей карте, инициация на любом экране — профессиональный уровень позиционки.',
    'Оффлейн танк + сапорт с диспелом + быстрый кэрри = идеальный lane matchup.',
    'Пять хероев с синергией, каждый закрывает слабое место другого. Это называется Dota.',
    'Анти-хил против их хилеров? Молодец, ты прочитал мою аналитику.',
    'БКБшка на кэрри + Лотос на сапорте = весь их CC в мусоропровод.',
    'Магнус + 4 right-click кэрри? Это не fair play, это избиение.',
    'Правильный пик, правильные роли, правильный тайминг. Ты должен выиграть это к 30 минуте.',
    'Физ иммунитет против их физ-carry + нюк против их магов = симметричный counter.',
    'Линкен на кэрри, Лотос на коре — их targeted spells просто не работают.',
    'Они пикнули иллюзии? А ты взял Радиансного, который сожжёт их за 4 секунды.',
    'Весь контроль в твоей команде, вся мобильность тоже. Вижн + ptsi = ловушка для врага.',
    'True Sight на четырёх — рики даже инвизиться не будет, знает что бесполезно.',
    'Связка Венга + хардкэрри = swap + физ урон = instant kill на любом кэрри врага.',
    'Хороший прогрессивный драфт: early game→mid game→late game без пробелов.',
    'Они взяли пять slow-героев, а ты взял пять с мобильностью. Объяснять не надо.',
    'Эта команда выглядит как настоящий Tier-1 пик. Осталось сыграть как Tier-1.',
    'Все синергии закрыты, все слабые места покрыты — это академический драфт.',
  ],
  risk_analysis: [
    'Риск: если их кэрри задрафтится в фарм до 20 минуты — весь ваш план рассыпается.',
    'Опасность: три сапорта в вашей команде и ни одного надёжного late-carry. Вам нужно закрыть до 35 минут.',
    'Вижн на их карте — ноль. Это критично. Два пати-варда решат игру или убьют её.',
    'Если их Войд купит BKB раньше вашего сейва — вся позиционка в трубу.',
    'Ваш план работает только если лейн выигран. Проиграете лейн — Snowball план рухнет.',
    'Высокий риск на мидкоре: один неудачный гаим у врага не значит что у вас выигрышный.',
    'Если они соберут антимагию против вашего нюка — вся стратегия сломана.',
    'Осторожно: у врага глобальный ульт (Зевс/СФ) — вижн критичен весь матч.',
    'Без нормальной инициации в поздней игре вы фидите в тимфайтах. Решите это до 25 минуты.',
    'Их Рошан потенциал высокий. Вижн на пите или проиграете Aegis-пуш.',
    'Проблема: ваш кэрри hard-countered on lane. Ранняя ротация или фид.',
    'Если не купите Spirit Vessel до 15 минуты — их хилеры выиграют каждый файт.',
    'Без gem вы слепые против двух инвизов врага. Это не пти вопрос, это survival.',
    'Два роша им — ваша база упадёт. Контр-инициация с Refresher или проигрыш.',
    'Фидите ли вы слайном с первых секунд? Если да — поменяйте позицию кэрри срочно.',
    'Риск: бкбшка врага на двух хероях выключает весь ваш CC. Нужен Nullifier.',
    'Если Дарк Сир ставит Вакуум + Дота — вы проигрываете файт каждый раз без BKB.',
    'Их лесной герой задрафтится быстро. Если нет вижна на лесу — внезапные ганки убьют мид.',
    'Внимание: хаос-найт с Радиансом в 20 минут = неостановимая армия. Убейте его ДО Агима.',
    'Риск низкий, но он есть: один disconnect в критический момент может стоить матча.',
  ],
  neutral: [
    'Это среднестатистический пик. Всё зависит от исполнения и птсиков в ключевых точках.',
    'Аналитика говорит: 55% winrate, если лейн не проигран. Дерзайте.',
    'Синергия есть, но не идеальная. Выиграете если сыграете слаженно.',
    'Позиционка сложная: нужно правильно расставить пти, иначе гаим превратится в хаос.',
    'Стандартный мета-пик. Будет работать при правильной ротации в 7-8 минут.',
    'Нейтральный анализ: ни плохо, ни хорошо. Много зависит от лайн-матчапа на миде.',
    'Это рабочая стратегия, но требует слаженности. Без коммуникации — разброд и шатание.',
    'Вижн будет ключевым фактором. Кто контролирует карту — тот и выигрывает.',
    'Хороший тайминг Росана может изменить всё. Следите за стаком в 15-16 минуту.',
    'Сейчас это спорный драфт: уязвим к split-push если не сыграете грамотно.',
    'Средний риск. Убедитесь что все знают свои роли перед первым смоком.',
    'Мета-аналитика показывает 51.3% winrate на этой композиции в патче 7.41a.',
    'Если враг пойдёт на agg early — у вас есть ответ. Если passive — придётся давить.',
    'Ваш late-game сильнее, но их early может поломать план. Осторожно на лейне.',
    'Стандарт. Работает с Courier-менеджментом и тревожной осторожностью на Рошане.',
  ],
  emergency: [
    'СТОП! Три хард-каунтера к вашему мейн кэрри — это не драфт, это капитуляция на экране.',
    'КРИТИЧНО: Вы задрафтились без единого escape-механизма. Вы умрёте от первого же Чрона.',
    'ЭКСТРЕННО: у них 4 silence и у вас нет Lotus или BKB. Исправьте это НЕМЕДЛЕННО.',
    'ТРЕВОГА: вся ваша стратегия зависит от Мипо, у которого нет Boots на 10 минуте.',
    'СРОЧНО: купите Gem или вы проиграете 4 из 5 тимфайтов против двойного инвиза.',
    'КАТАСТРОФА: они пикнули АА против вашего хилера. Весь ваш сустейн = ноль с 6 уровня.',
  ],
  farm_tips: [
    'Купи Quelling Blade на кэрри. Каждый крип считается когда нет фарма.',
    'Стакай лагерь с нейтралами в 53 секунды — это 30% extra farm для кэрри.',
    'Не забывай про denied creeps — отказ 5 золота врагу × 100 = 500 потерянных игровых золота.',
    'Courier на миде в 3 минуты = faster level 6 = первый kill на карте.',
    'Tangos + Salve экономят деньги от b-triping. Это не мелочи, это фундамент.',
    'Давай стаки нейтралов каждую минуту на 53 секунде. Пяти стаков достаточно для free farm.',
  ],
};

function getOracleComment(enemyProfile, threatScore) {
  const comments = [];

  if (threatScore > 80) {
    const critical = ORACLE_PHRASES.emergency;
    comments.push(critical[Math.floor(Math.random() * critical.length)]);
  }

  if (enemyProfile.nukers >= 3) {
    comments.push('Три нюкера у врага — это не шутки. БКБшка нужна ВСЕМ carry до 20 минуты.');
  }
  if (enemyProfile.invisibility >= 2) {
    comments.push('Два инвиза у врага? Gem или Dust — без вижна вы слепые птсики.');
  }
  if (enemyProfile.healers >= 2) {
    comments.push('Двойной хил без Spirit Vessel — вы просто не убиваете врага в late game.');
  }
  if (enemyProfile.control >= 3) {
    comments.push('У них три disabler — без BKB/Linken/Lotus вы мёртвые во время любого тимфайта.');
  }
  if (enemyProfile.illusions >= 2) {
    comments.push('Иллюзии у врага? Купи Радианс или Mjollnir — AoE или ты умрёшь от армии теней.');
  }
  if (enemyProfile.push >= 3) {
    comments.push('Три пушер-героя у врага. Если не защититесь до 25 минуты — база под угрозой.');
  }

  const pool = threatScore > 60 ? ORACLE_PHRASES.risk_analysis :
    threatScore < 30 ? ORACLE_PHRASES.good_draft : ORACLE_PHRASES.neutral;

  for (let i = 0; i < 2; i++) {
    comments.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return comments;
}

function getRandomOracleQuote(category = 'neutral') {
  const pool = ORACLE_PHRASES[category] || ORACLE_PHRASES.neutral;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
// 7. LIVE API INTEGRATION (OpenDota + Steam)
// ============================================================
const DotaAPI = {
  async getHeroStats() {
    const data = await fetchAPI(API.heroStats());
    if (!data) return null;
    return data.reduce((acc, hero) => {
      acc[hero.localized_name?.toLowerCase().replace(/ /g, '_')] = {
        winrate: ((hero.pro_win / hero.pro_pick) * 100).toFixed(1),
        pickRate: hero.pro_pick,
        pro_win: hero.pro_win,
        pub_winrate: ((hero['1_win'] + hero['2_win'] + hero['3_win'] + hero['4_win'] + hero['5_win']) /
          (hero['1_pick'] + hero['2_pick'] + hero['3_pick'] + hero['4_pick'] + hero['5_pick']) * 100).toFixed(1),
      };
    }, {});
  },

  async getHeroMatchups(heroId) {
    if (!heroId) return null;
    const data = await fetchAPI(API.heroMatchups(heroId));
    if (!data) return null;
    return data
      .map(m => ({
        heroId: m.hero_id,
        gamesPlayed: m.games_played,
        wins: m.wins,
        winrate: ((m.wins / m.games_played) * 100).toFixed(1),
        advantage: (((m.wins / m.games_played) - 0.5) * 100).toFixed(2),
      }))
      .sort((a, b) => b.advantage - a.advantage);
  },

  async getProMatches() {
    const data = await fetchAPI(API.proMatches());
    if (!data) return [];
    return data.slice(0, 20).map(m => ({
      matchId: m.match_id,
      radiantWin: m.radiant_win,
      duration: Math.floor(m.duration / 60) + 'min',
      league: m.leaguename,
      radiantTeam: m.radiant_name,
      direTeam: m.dire_name,
    }));
  },

  async getPublicMatchesByRank(rankTier = 80) {
    const data = await fetchAPI(API.publicMatches(`rank_tier=${rankTier}`));
    if (!data) return [];
    return data.slice(0, 10);
  },

  async getLiveMetaHeroes() {
    const stats = await this.getHeroStats();
    if (!stats) return [];
    return Object.entries(stats)
      .filter(([, s]) => s.pickRate > 10)
      .sort((a, b) => parseFloat(b[1].pub_winrate) - parseFloat(a[1].pub_winrate))
      .slice(0, 20)
      .map(([name, s]) => ({ name, ...s }));
  },
};

// ============================================================
// 8. MAIN ANALYTICS ENGINE
// ============================================================
const DotaasisEngine = {
  heroes: HEROES,
  counterpicks: COUNTERPICKS,
  items: ITEMS,
  itemSituations: ITEM_SITUATIONS,
  oracle: ORACLE_PHRASES,

  analyzeDraft(enemyTeam) {
    if (!Array.isArray(enemyTeam) || enemyTeam.length === 0) {
      return { error: 'Передай массив героев врага. Например: ["axe", "crystal_maiden", "lina"]' };
    }
    const valid = enemyTeam.filter(h => HEROES[h]);
    if (valid.length !== enemyTeam.length) {
      const invalid = enemyTeam.filter(h => !HEROES[h]);
      console.warn('[DOTAASIS] Unknown heroes:', invalid);
    }
    return calculateDraftScore(valid.length > 0 ? valid : enemyTeam);
  },

  getHeroCounters(heroKey) {
    const counters = COUNTERPICKS[heroKey];
    if (!counters) return { error: `Контрпики для ${heroKey} не найдены` };
    return {
      hero: heroKey,
      localName: HEROES[heroKey]?.localName || heroKey,
      counters: counters.counters.map(c => ({
        ...c,
        localName: HEROES[c.hero]?.localName || c.hero,
        heroData: HEROES[c.hero] || null,
      })),
    };
  },

  getItemsAgainst(situation) {
    const sit = ITEM_SITUATIONS.find(s => s.condition === situation);
    if (!sit) return { error: `Ситуация ${situation} не найдена` };
    return {
      ...sit,
      items: sit.items.map(key => ({
        key,
        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        ...ITEMS[key],
      })),
    };
  },

  getOraclePhrase(category = 'neutral') {
    return getRandomOracleQuote(category);
  },

  getHeroInfo(heroKey) {
    const hero = HEROES[heroKey];
    if (!hero) return { error: `Герой ${heroKey} не найден` };
    return {
      ...hero,
      counters: COUNTERPICKS[heroKey]?.counters || [],
    };
  },

  searchHeroesByRole(role) {
    return Object.entries(HEROES)
      .filter(([, h]) => h.roles.includes(role))
      .map(([key, h]) => ({ key, ...h }));
  },

  searchHeroesByMechanic(mechanic) {
    return Object.entries(HEROES)
      .filter(([, h]) => h.mechanics.includes(mechanic))
      .map(([key, h]) => ({ key, ...h }));
  },

  async getLiveMeta() {
    return await DotaAPI.getLiveMetaHeroes();
  },

  async getProMatchData() {
    return await DotaAPI.getProMatches();
  },

  async getLiveHeroMatchups(heroId) {
    return await DotaAPI.getHeroMatchups(heroId);
  },

  getFullItemList() {
    return Object.entries(ITEMS).map(([key, data]) => ({
      key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      ...data,
    }));
  },

  getSituationalItems(enemyTeam) {
    const profile = analyzeEnemyTeam(enemyTeam);
    return getItemRecommendations(profile);
  },
};

// ============================================================
// 9. EXPORT
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DotaasisEngine,
    DotaAPI,
    HEROES,
    COUNTERPICKS,
    ITEMS,
    ITEM_SITUATIONS,
    ORACLE_PHRASES,
    calculateDraftScore,
    analyzeEnemyTeam,
    getItemRecommendations,
    getOracleComment,
    getRandomOracleQuote,
  };
}

// Browser global
if (typeof window !== 'undefined') {
  window.DOTAASIS = DotaasisEngine;
  window.DotaAPI = DotaAPI;
  console.log('%c⚔️ DOTAASIS ULTIMATE ANALYTICS v1.0 — Patch 7.41a', 'color:#e8c97a;font-size:14px;font-weight:bold');
  console.log('%cПолный ростер: ' + Object.keys(HEROES).length + ' героев | ' +
    Object.keys(COUNTERPICKS).length + ' контрпик-датасетов | ' +
    Object.keys(ITEMS).length + ' предметов', 'color:#6fc;font-size:11px');
}

/*
 * === USAGE EXAMPLES ===
 *
 * // Анализ вражеского драфта:
 * const result = DotaasisEngine.analyzeDraft(['axe', 'crystal_maiden', 'lina', 'phantom_assassin', 'storm_spirit']);
 * console.log(result.topRecommendations);
 * console.log(result.oracleComment);
 *
 * // Контрпики для героя:
 * const counters = DotaasisEngine.getHeroCounters('invoker');
 * console.log(counters.counters);
 *
 * // Ситуационные предметы:
 * const items = DotaasisEngine.getSituationalItems(['phantom_assassin', 'bounty_hunter']);
 * console.log(items);
 *
 * // Фраза Оракула:
 * console.log(DotaasisEngine.getOraclePhrase('bad_draft'));
 *
 * // Live мета (async):
 * DotaasisEngine.getLiveMeta().then(meta => console.log(meta));
 *
 * // Герои по роли:
 * const carries = DotaasisEngine.searchHeroesByRole('carry');
 * const silencers = DotaasisEngine.searchHeroesByMechanic('silence');
 */
