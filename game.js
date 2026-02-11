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

  // optional hook
  if (typeof sceneData.onEnter === "function") sceneData.onEnter();

  // optional encounter trigger
  // sceneData.encounter = { enemyKey: "wolf" }
  if (sceneData.encounter && sceneData.encounter.enemyKey) {
    startEncounter(sceneData.encounter.enemyKey, sceneKey, sceneData.text);
    return;
  }

  storyText.textContent = sceneData.text;

  const choices = sceneData.choices || [];
  clearButtons();

  // still supports 0/1/2 choices, but can also support 3/4 if you ever want
  for (let i = 0; i < Math.min(choices.length, 4); i++) {
    setButton(i, choices[i].text, () => loadScene(choices[i].next));
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
  storyText.textContent = `${introText}\n\n⚠ Encounter: ${e.name} appears!`;

  clearButtons();
  setButton(0, "Run", () => attemptRunFromEncounter());
  setButton(1, "Fight", () => startCombat(enemyKey));

  updateHUD();
}

function attemptRunFromEncounter() {
  const enemyKey = state.encounter.enemyKey;
  const e = ENEMIES[enemyKey];

  // Run from encounter = chance-based, fail = death (as you requested)
  // tweak this any time:
  const chance = 0.55;

  if (roll(chance)) {
    storyText.textContent = `You RUN like your life depends on it...\n\nBecause it does.\n\nYou escape the ${e.name}.`;
    clearButtons();
    setButton(0, "Catch your breath", () => loadScene(state.encounter.returnScene));
    state.encounter = null;
  } else {
    // funny death message
    storyText.textContent =
      `You attempt to run...\n\nYour foot catches on absolutely nothing.\nYou do a perfect faceplant.\n\nThe ${e.name} does not forgive.\n\n(You died. Skill issue.)`;
    clearButtons();
    setButton(0, "Restart", () => {
      state.player.hp = state.player.maxHP;
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
    `⚔ Combat vs ${e.name}\n\n` +
    `${logTail}`;

  clearButtons();
  setButton(0, "Attack", () => openAttackMenu());
  setButton(1, "Use Item", () => openItemMenu());
  setButton(2, "Befriend", () => attemptBefriend());
  setButton(3, "Flee", () => attemptFlee());

  updateHUD();

  // if player died, stop
  if (p.hp <= 0) {
    storyText.textContent =
      `You fought bravely.\n\nYou also lost.\n\n(You died.)`;
    clearButtons();
    setButton(0, "Restart", () => {
      state.player.hp = state.player.maxHP;
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

  const actions = [];

  if ((inv.potion_small || 0) > 0) {
    actions.push({ text: "Small Potion (+10 HP)", fn: () => useItem("potion_small") });
  }
  if ((inv.potion_big || 0) > 0) {
    actions.push({ text: "Big Potion (+20 HP)", fn: () => useItem("potion_big") });
  }

  if (actions.length === 0) {
    actions.push({ text: "(No items)", fn: () => popMenu() });
  }

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
  p.hp = clamp(p.hp + item.heal, 0, p.maxHP);

  popMenu();
  state.combat.log.push(`You used a ${item.name} and healed ${item.heal} HP.`);
  enemyTurn();
}

function playerAttack(target) {
  popMenu();

  const e = ENEMIES[state.combat.enemyKey];
  const { dmg, isCrit } = calcPlayerDamage(target);

  state.combat.enemyHP = clamp(state.combat.enemyHP - dmg, 0, e.maxHP);
  state.combat.log.push(
    `You strike the ${target} for ${dmg} damage${isCrit ? " (CRIT!)" : ""}.`
  );

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
      `You lower your guard.\n\nThe ${e.name} hesitates...\n\nThen calms.\n\n✅ You befriended it.\n(For now.)`;
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
    storyText.textContent =
      `You wait for the right moment...\n\nThen BOLT.\n\n✅ You escaped the ${e.name}.`;
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
  const e = ENEMIES[state.combat.enemyKey];

  const { dmg, isCrit } = enemyAttack();
  state.combat.log.push(
    `${e.name} hits you for ${dmg}${isCrit ? " (CRIT!)" : ""}.`
  );

  renderCombat();
}

function winCombat() {
  const e = ENEMIES[state.combat.enemyKey];

  storyText.textContent =
    `✅ You defeated the ${e.name}.\n\nYou gained ${e.xp} XP.`;
  giveXP(e.xp);

  clearButtons();
  setButton(0, "Continue", () => endCombatToStory(false));

  state.combat = null;
  state.menuStack = [];
  updateHUD();
}

function endCombatToStory(befriended) {
  // for now, just return to the same scene
  // later we can branch: befriended enemies give rewards, etc.
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
  } else if (state.mode === "encounter") {
    // encounter render handled by startEncounter
    updateHUD();
  } else {
    // story render handled by loadScene
    updateHUD();
  }
}

// boot
loadScene("start");
