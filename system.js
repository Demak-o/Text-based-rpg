// -------------------------
// GAME DATA + STATE
// -------------------------

const state = {
  mode: "story",          // "story" | "encounter" | "combat" | "submenu"
  scene: "start",

  player: {
    name: "Traveller",
    level: 1,
    xp: 0,
    xpToNext: 20,

    maxHP: 30,
    hp: 30,

    weaponKey: null, // "bow" | "sword" | "magic"
    inventory: {
      potion_small: 1,
      potion_big: 0
    },

    varrickQuestsDone: 0 // 0,1,2
  },

  encounter: null, // { enemyKey, returnScene }
  combat: null,    // { enemyKey, enemyHP, log: [] }

  // when we need temporary menus (attack target selection etc)
  menuStack: [] // each entry = { text, actions: [{text, fn}] }
};

const WEAPONS = {
  bow: {
    name: "Hunter’s Bow",
    baseDamage: 6,
    critChance: 0.20,
    critMult: 1.6,
    targetBonus: { head: 1.35, center: 1.0, feet: 0.85 },
    typeBonus: { wildlife: 1.25, human: 0.95, magical: 0.90 }
  },
  sword: {
    name: "Sword & Shield",
    baseDamage: 7,
    critChance: 0.12,
    critMult: 1.8,
    targetBonus: { head: 1.0, center: 1.0, feet: 1.35 },
    typeBonus: { human: 1.20, wildlife: 1.0, magical: 0.85 }
  },
  magic: {
    name: "Apprentice Focus",
    baseDamage: 8,
    critChance: 0.15,
    critMult: 1.7,
    targetBonus: { head: 0.95, center: 1.35, feet: 0.95 },
    typeBonus: { magical: 1.30, human: 0.95, wildlife: 0.90 }
  }
};

const ENEMIES = {
  wolf:   { name: "Starved Wolf",  type: "wildlife", maxHP: 18, damage: 5, critChance: 0.10, xp: 12 },
  bandit: { name: "Road Bandit",   type: "human",    maxHP: 22, damage: 6, critChance: 0.12, xp: 16 },
  wisp:   { name: "Lantern Wisp",  type: "magical",  maxHP: 16, damage: 7, critChance: 0.15, xp: 18 }
};

const ITEM_EFFECTS = {
  potion_small: { name: "Small Potion", heal: 10 },
  potion_big:   { name: "Big Potion", heal: 20 }
};

// -------------------------
// HELPERS
// -------------------------

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function roll(p) { return Math.random() < p; }

function playerWeapon() {
  return state.player.weaponKey ? WEAPONS[state.player.weaponKey] : null;
}

function updateHUD() {
  const p = state.player;
  const w = playerWeapon();

  const playerStats = document.getElementById("player-stats");
  const enemyStats = document.getElementById("enemy-stats");

  playerStats.textContent =
    `${p.name} | LVL ${p.level} | HP ${p.hp}/${p.maxHP}` +
    ` | Weapon: ${w ? w.name : "None"}` +
    ` | Potions: ${p.inventory.potion_small || 0}`;

  if (state.mode === "combat" && state.combat) {
    const e = ENEMIES[state.combat.enemyKey];
    enemyStats.textContent = `${e.name} (${e.type}) | HP ${state.combat.enemyHP}/${e.maxHP}`;
    enemyStats.style.display = "block";
  } else {
    enemyStats.textContent = "";
    enemyStats.style.display = "none";
  }
}

function giveXP(amount) {
  const p = state.player;
  p.xp += amount;

  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level += 1;
    p.xpToNext = Math.round(p.xpToNext * 1.35);

    // level-up rewards
    p.maxHP += 5;
    p.hp = p.maxHP;
  }
}

function enemyHealthRatio() {
  const e = ENEMIES[state.combat.enemyKey];
  return state.combat.enemyHP / e.maxHP;
}

function befriendChance() {
  const r = enemyHealthRatio();
  return Math.min(0.60, 0.05 + (1 - r) * 0.55);
}

function fleeChance() {
  const r = enemyHealthRatio();
  return Math.min(0.55, 0.03 + (1 - r) * 0.45);
}

function calcPlayerDamage(target) {
  const p = state.player;
  const w = playerWeapon();
  const enemy = ENEMIES[state.combat.enemyKey];

  // no weapon yet = weak punch
  let dmg = w ? w.baseDamage : 2;

  if (w) {
    dmg *= (w.typeBonus[enemy.type] ?? 1.0);
    dmg *= (w.targetBonus[target] ?? 1.0);
  }

  const isCrit = w ? roll(w.critChance) : roll(0.05);
  const critMult = w ? w.critMult : 1.5;

  if (isCrit) dmg *= critMult;

  // mild level scaling
  dmg *= (1 + (p.level - 1) * 0.06);

  return { dmg: Math.max(1, Math.round(dmg)), isCrit };
}

function enemyAttack() {
  const p = state.player;
  const e = ENEMIES[state.combat.enemyKey];

  let dmg = e.damage;
  const isCrit = roll(e.critChance);
  if (isCrit) dmg = Math.round(dmg * 1.5);

  p.hp = clamp(p.hp - dmg, 0, p.maxHP);

  return { dmg, isCrit };
}
