const storyText = document.getElementById("story-text");

const buttons = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3"),
  document.getElementById("choice4")
];

function setButton(i, label, handler) {
  const b = buttons[i];
  if (!label) {
    b.style.display = "none";
    b.onclick = null;
    b.textContent = "";
    return;
  }
  b.style.display = "inline-block";
  b.textContent = label;
  b.onclick = handler;
}

function clearButtons() {
  for (let i = 0; i < 4; i++) setButton(i, null, null);
}

function pushMenu(text, actions) {
  state.menuStack.push({ text, actions });
  state.mode = "submenu";
  render();
}

function popMenu() {
  state.menuStack.pop();
  state.mode = state.menuStack.length ? "submenu" : (state.combat ? "combat" : "story");
  render();
}

// -------------------------
// VARRICK SHOP
// -------------------------

function openVarrickShop(page = 0) {
  const tier = Math.min(2, state.player.varrickQuestsDone);
  const tierText = ["No discount", "Discount (1 quest)", "Big discount (2 quests)"][tier];

  const itemsForSale = [
    "potion_small",
    "potion_big",
    "tonic_swiftness",
    "tonic_strength",
    "tonic_ironhide"
  ];

  const perPage = 3;
  const start = page * perPage;
  const slice = itemsForSale.slice(start, start + perPage);

  const actions = slice.map((key) => {
    const item = ITEM_EFFECTS[key];
    const price = getPrice(key);
    const label = `${item.name} - ${price}g` + (item.desc ? ` (${item.desc})` : "");
    return { text: label, fn: () => buyItem(key, page) };
  });

  const hasNext = start + perPage < itemsForSale.length;
  if (hasNext) actions.push({ text: "Next", fn: () => openVarrickShop(page + 1) });
  else actions.push({ text: "Back", fn: () => popMenu() });

  pushMenu(
    `Dr. Varrick's Supplies\nGold: ${state.player.gold}\n${tierText}\n\nHealing potions work instantly.\nTonics last 3 turns in combat.`,
    actions
  );
}

function buyItem(itemKey, page = 0) {
  const price = getPrice(itemKey);
  const item = ITEM_EFFECTS[itemKey];

  if (state.player.gold < price) {
    popMenu();
    storyText.textContent = `"Not enough gold," Varrick rasps. "Come back when you can afford medicine."`;
    clearButtons();
    setButton(0, "Back to shop", () => openVarrickShop(page));
    setButton(1, "Return", () => loadScene(state.scene));
    updateHUD();
    return;
  }

  state.player.gold -= price;
  state.player.inventory[itemKey] = (state.player.inventory[itemKey] || 0) + 1;

  popMenu();
  storyText.textContent = `You bought: ${item.name}\nGold left: ${state.player.gold}`;
  clearButtons();
  setButton(0, "Buy more", () => openVarrickShop(page));
  setButton(1, "Return", () => loadScene(state.scene));
  updateHUD();
}

// -------------------------
// STORY MODE
// -------------------------

function loadScene(sceneKey) {
  const sceneData = story[sceneKey];

  if (!sceneData) {
    storyText.textContent = `Error: scene "${sceneKey}" not found. Check your story.js keys.`;
    clearButtons();
    updateHUD();
    return;
  }

  state.scene = sceneKey;
  state.mode = "story";

  if (typeof sceneData.onEnter === "function") sceneData.onEnter();

  if (sceneData.encounter && sceneData.encounter.enemyKey) {
    startEncounter(sceneData.encounter.enemyKey, sceneKey, sceneData.text);
    return;
  }

  storyText.textContent = sceneData.text;

  const choices = sceneData.choices || [];
  clearButtons();

  for (let i = 0; i < Math.min(choices.length, 4); i++) {
    setButton(i, choices[i].text, () => loadScene(choices[i].next));
  }

  // Show Varrick shop button if the scene allows it or you've met him
  if (sceneData.shop === "varrick" || state.player.hasMetVarrick) {
    setButton(3, "Visit Dr. Varrick (Shop)", () => openVarrickShop(0));
  }

  updateHUD();
}

// -------------------------
// ENCOUNTER MODE (Run/Fight)
// -------------------------

function startEncounter(enemyKey, returnScene, introText) {
  state.mode = "encounter";
  state.encounter = { enemyKey, returnScene };

  const e = ENEMIES[enemyKey];
  storyText.textContent = `${introText}\n\nEncounter: ${e.name} appears.`;

  clearButtons();
  setButton(0, "Run", () => attemptRunFromEncounter());
  setButton(1, "Fight", () => startCombat(enemyKey));

  updateHUD();
}

function attemptRunFromEncounter() {
  const enemyKey = state.encounter.enemyKey;
  const e = ENEMIES[enemyKey];

  const chance = 0.55;

  if (roll(chance)) {
    storyText.textContent = `You run like your life depends on it.\n\nYou escape the ${e.name}.`;
    clearButtons();
    setButton(0, "Continue", () => loadScene(state.encounter.returnScene));
    state.encounter = null;
  } else {
    storyText.textContent =
      `You attempt to run...\n\nYour foot catches on absolutely nothing.\nYou do a perfect faceplant.\n\nThe ${e.name} does not forgive.\n\n(You died. Skill issue.)`;
    clearButtons();
    setButton(0, "Restart", () => {
      state.player.hp = state.player.maxHP;
      state.player.gold = 15;
      state.combat = null;
      state.encounter = null;
      state.menuStack = [];
      loadScene("start");
    });
  }

  updateHUD();
}

// -------------------------
// COMBAT MODE
// -------------------------

function startCombat(enemyKey) {
  const e = ENEMIES[enemyKey];

  state.mode = "combat";
  state.encounter = null;
  state.combat = {
    enemyKey,
    enemyHP: e.maxHP,
    log: [`You engage the ${e.name}.`]
  };

  renderCombat();
}

function renderCombat(extraText = "") {
  const e = ENEMIES[state.combat.enemyKey];
  const p = state.player;

  const logTail = state.combat.log.slice(-3).join("\n");
  storyText.textContent =
    `${extraText}${extraText ? "\n\n" : ""}` +
    `Combat vs ${e.name}\n\n` +
    `${logTail}`;

  clearButtons();
  setButton(0, "Attack", () => openAttackMenu());
  setButton(1, "Use Item", () => openItemMenu());
  setButton(2, "Befriend", () => attemptBefriend());
  setButton(3, "Flee", () => attemptFlee());

  updateHUD();

  if (p.hp <= 0) {
    storyText.textContent =
      `You fought bravely.\n\nYou also lost.\n\n(You died.)`;
    clearButtons();
    setButton(0, "Restart", () => {
      state.player.hp = state.player.maxHP;
      state.player.gold = 15;
      state.combat = null;
      state.menuStack = [];
      loadScene("start");
    });
  }
}

function openAttackMenu() {
  pushMenu("Choose a target:", [
    { text: "Head",   fn: () => playerAttack("head") },
    { text: "Center", fn: () => playerAttack("center") },
    { text: "Feet",   fn: () => playerAttack("feet") },
    { text: "Back",   fn: () => popMenu() }
  ]);
}

function openItemMenu() {
  const inv = state.player.inventory;

  const keys = Object.keys(inv).filter(k => (inv[k] || 0) > 0);

  const actions = keys.slice(0, 3).map((key) => {
    const item = ITEM_EFFECTS[key];
    return { text: `${item.name} x${inv[key]}`, fn: () => useItem(key) };
  });

  if (actions.length === 0) actions.push({ text: "(No items)", fn: () => popMenu() });
  actions.push({ text: "Back", fn: () => popMenu() });

  pushMenu("Choose an item:", actions);
}

function useItem(itemKey) {
  const item = ITEM_EFFECTS[itemKey];
  const p = state.player;

  if (!item || (p.inventory[itemKey] || 0) <= 0) {
    popMenu();
    renderCombat("You fumble around but find nothing useful.");
    return;
  }

  p.inventory[itemKey] -= 1;

  if (item.type === "heal") {
    p.hp = clamp(p.hp + item.heal, 0, p.maxHP);
    popMenu();
    state.combat.log.push(`You used ${item.name} and healed ${item.heal} HP.`);
    enemyTurn();
    return;
  }

  if (item.type === "buff") {
    p.buffs[item.buff] = Math.max(p.buffs[item.buff], item.turns);
    popMenu();
    state.combat.log.push(`You used ${item.name}.`);
    enemyTurn();
    return;
  }

  popMenu();
  renderCombat("That item does not seem to do anything.");
}

function playerAttack(target) {
  popMenu();

  const e = ENEMIES[state.combat.enemyKey];
  const { dmg, isCrit } = calcPlayerDamage(target);

  state.combat.enemyHP = clamp(state.combat.enemyHP - dmg, 0, e.maxHP);
  state.combat.log.push(`You strike the ${target} for ${dmg} damage${isCrit ? " (CRIT)" : ""}.`);

  if (state.combat.enemyHP <= 0) {
    winCombat();
    return;
  }

  enemyTurn();
}

function attemptBefriend() {
  const e = ENEMIES[state.combat.enemyKey];
  const chance = befriendChance();

  if (roll(chance)) {
    storyText.textContent =
      `You lower your guard.\n\nThe ${e.name} hesitates...\n\nThen calms.\n\nYou befriended it.\n(For now.)`;
    clearButtons();
    setButton(0, "Continue", () => endCombatToStory(true));
    state.combat = null;
    state.menuStack = [];
    updateHUD();
  } else {
    state.combat.log.push(`You attempt to befriend it... (failed)`);
    enemyTurn();
  }
}

function attemptFlee() {
  const e = ENEMIES[state.combat.enemyKey];
  const chance = fleeChance();

  if (roll(chance)) {
    storyText.textContent = `You wait for the right moment...\n\nThen bolt.\n\nYou escaped the ${e.name}.`;
    clearButtons();
    setButton(0, "Continue", () => endCombatToStory(false));
    state.combat = null;
    state.menuStack = [];
    updateHUD();
  } else {
    state.combat.log.push(`You try to flee... (failed)`);
    enemyTurn();
  }
}

function enemyTurn() {
  tickBuffs();

  const e = ENEMIES[state.combat.enemyKey];
  const { dmg, isCrit } = enemyAttack();

  state.combat.log.push(`${e.name} hits you for ${dmg}${isCrit ? " (CRIT)" : ""}.`);
  renderCombat();
}

function winCombat() {
  const e = ENEMIES[state.combat.enemyKey];

  const goldGain = 5 + Math.floor(Math.random() * 6);
  state.player.gold += goldGain;

  storyText.textContent = `You defeated the ${e.name}.\n\nYou gained ${e.xp} XP and found ${goldGain} gold.`;
  giveXP(e.xp);

  clearButtons();
  setButton(0, "Continue", () => endCombatToStory(false));

  state.combat = null;
  state.menuStack = [];
  updateHUD();
}

function endCombatToStory(befriended) {
  loadScene(state.scene);
}

// -------------------------
// SUBMENU RENDERER
// -------------------------

function renderSubmenu() {
  const menu = state.menuStack[state.menuStack.length - 1];
  storyText.textContent = menu.text;

  clearButtons();
  for (let i = 0; i < 4; i++) {
    const action = menu.actions[i];
    if (action) setButton(i, action.text, action.fn);
  }

  updateHUD();
}

function render() {
  if (state.mode === "submenu") {
    renderSubmenu();
  } else if (state.mode === "combat") {
    renderCombat();
  } else {
    updateHUD();
  }
}

loadScene("start");
