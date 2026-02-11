const story = {
  start: {
    text: "As your eyes open you look around the darkened, unlit room. That was your last night in the rented room of the tavern. You get up and head over to the door. You are staying in a town called Björnsfield. You open the heavy wooden door and get blinded by the vibrant town. As your eyes adjust to the early morning light you become aware of the people pushing past you on the street. Looking directly across the pebbled road you see medieval houses lining both sides. Down the street to the left are more houses and shops; to your right stands a large stone building. Do you choose to go down the road or up the street to the large stone building?",
    choices: [
      { text: "Head down the street", next: "down" },
      { text: "Head up the street", next: "up" }
    ]
  },

  // -------------------------
  // PATH 1: MAGIC ACADEMY
  // -------------------------
  up: {
    text: "You head up toward the large stone building. The closer you get, the more the air changes — faintly warmer, like standing near a fire. A carved archway towers above you, etched with strange symbols that seem to shift when you stare too long.\n\nA plaque reads: THE BJÖRNSFIELD ACADEMY OF MAGIC.\n\nA tall door opens on its own. A voice inside says, calm and amused: 'Well? Are you coming in or not?'",
    choices: [
      { text: "Step inside", next: "academy_entry" },
      { text: "Back away slowly", next: "academy_leave" }
    ]
  },

  academy_leave: {
    text: "You take one step back… and bump into something. You turn and see a broom sweeping the steps by itself. It pauses. Then launches at your face like a furious bird.\n\nYou sprint down the street, barely escaping with your dignity intact.\n\nMaybe… another day.",
    choices: [
      { text: "Return to the tavern (restart)", next: "start" }
    ]
  },

  academy_entry: {
    text: "Inside, the hall is impossibly large — bigger than the outside of the building could ever allow. Candles float near the ceiling, drifting like lazy fireflies.\n\nAt the end of the hall stands an old man in a grey cloak, staff in hand, beard like a waterfall.\n\n'Name’s Gandolf,' he says. 'If you want to learn magic, you’ll need a mind that doesn’t crumble under pressure.'\n\nHe taps the floor with his staff. A circle of runes lights up beneath your feet.\n\n'First trial: Which of these is the safest rule when handling unknown magic?'",
    choices: [
      { text: "Touch it to learn what it does", next: "academy_fail1" },
      { text: "Assume it's dangerous until proven safe", next: "academy_pass1" }
    ]
  },

  academy_fail1: {
    text: "You confidently reach out.\n\nThe runes flash.\n\nYour hair stands on end. Your vision fills with blue light. Then everything goes black.\n\nGandolf sighs from somewhere far away.\n\n'Classic.'",
    choices: [
      { text: "Restart", next: "start" }
    ]
  },

  academy_pass1: {
    text: "Gandolf nods. 'Good. Caution is not cowardice — it’s survival.'\n\nHe waves his hand. A table appears, holding three small vials: red, silver, and clear.\n\n'Second trial: one vial is poison, one is sleep, one is harmless water. You must choose one to drink to continue.\n\nHere’s the hint: The poison is never in the vial that *looks* dangerous.'",
    choices: [
      { text: "Drink the red vial", next: "academy_fail2" },
      { text: "Drink the clear vial", next: "academy_pass2" }
    ]
  },

  academy_fail2: {
    text: "You drink the red vial.\n\nIt tastes like burning metal.\n\nYour throat tightens. Your knees hit the floor.\n\nGandolf watches, disappointed.\n\n'Overthinking is just another kind of guessing.'",
    choices: [
      { text: "Restart", next: "start" }
    ]
  },

  academy_pass2: {
    text: "You drink the clear vial.\n\n…Nothing happens.\n\nGandolf smirks. 'Exactly. Most danger is in what we assume.'\n\nHe flicks his staff and the room shifts — suddenly you’re standing in a courtyard, wind howling. A stone pedestal rises with an open book.\n\n'Final trial,' Gandolf says. 'The book will answer one question truthfully. What do you ask?'",
    choices: [
      { text: "“How do I become the strongest?”", next: "academy_fail3" },
      { text: "“What is the cost of magic?”", next: "academy_pass3" }
    ]
  },

  academy_fail3: {
    text: "The book flips open and slams shut.\n\nThe courtyard goes silent.\n\nGandolf’s expression hardens.\n\n'Power without wisdom destroys everything around it — including you.'\n\nThe wind becomes a wall.\n\nYou wake up back in the street, the Academy doors closed as if you were never welcome at all.",
    choices: [
      { text: "Restart", next: "start" }
    ]
  },

  academy_pass3: {
    text: "The book opens gently.\n\nWords form on the page:\n\n'Attention. Discipline. And sacrifice — small at first, then greater.'\n\nGandolf steps closer, studying you like a puzzle.\n\n'You asked the right question,' he says quietly.\n\nHe extends a hand.\n\n'If you wish it… you may become my apprentice.'\n\nHe places a small crystal focus in your palm. It hums softly.\n\n(You gained a weapon: Apprentice Focus.)",
    onEnter: () => {
      state.player.weaponKey = "magic";
    },
    choices: [
      { text: "Return to the start (for now)", next: "start" }
    ]
  },

  // -------------------------
  // PATH 2: MAIN STREET / HOSPITAL QUEST
  // -------------------------
  down: {
    text: "You travel down the road, passing shops selling goods from across the lands. Silks and strange wares fill your vision, and the smell of street food makes your stomach rumble.\n\nAs you look right you notice a smaller sign on the front of an old hospital. Its stone face is worn down by age and weather.",
    choices: [
      { text: "Enter the hospital", next: "hosp" },
      { text: "Continue down the road", next: "road" }
    ]
  },

  road: {
    text: "You start travelling down the road. A deep rumble comes from within your gut; an ominous sense of wrongness floods your body. The edges of your vision start fading.",
    choices: [
      { text: "Head back to the hospital", next: "hosp" },
      { text: "Ignore the obvious signs you're doing the wrong thing", next: "dumb" }
    ]
  },

  dumb: {
    text: "You push forward.\n\nThe darkness thickens.\n\nYour knees buckle.\n\nSomewhere in the distance a bell rings — once, twice — like it’s counting down.\n\nYou don’t make it much further.\n\n(You lost. Seriously, that was a bad idea.)",
    choices: [
      { text: "Restart", next: "start" }
    ]
  },

  hosp: {
    text: "The hospital smells like herbs, old paper, and something bitter underneath. A few patients sit in silence, staring at the floor.\n\nFrom behind a curtain, a hunched old man steps out — his spine curved like a question mark. One cloudy eye watches you; the other seems far too sharp.\n\nHe grins.\n\n'Ah… a healthy traveller. Perfect.'\n\nHe leans close and whispers: 'I can make you rich. Rich enough that Björnsfield will remember your name… if you fetch me one ingredient.'",
    choices: [
      { text: "Hear him out", next: "hosp_offer" },
      { text: "Refuse and leave", next: "hosp_refuse" }
    ]
  },

  hosp_refuse: {
    text: "You shake your head and turn to leave.\n\nThe old man’s grin vanishes.\n\n'Pity,' he mutters.\n\nAs you step outside, your stomach twists again — worse than before.\n\nWhatever that feeling is… it’s following you.",
    choices: [
      { text: "Go back inside", next: "hosp_offer" },
      { text: "Restart", next: "start" }
    ]
  },

  hosp_offer: {
    text: "'Name’s Dr. Varrick,' the hunchback says, though the title feels… self-awarded.\n\nHe produces a small vial of shimmering liquid. 'This potion will cure what’s starting in your gut. I can smell it on you — the creeping rot of something unnatural.'\n\nHe tilts the vial. The liquid catches the light like trapped stars.\n\n'But I lack one ingredient: Moon-Thorn Sap. Rare. Dangerous. And valuable.'\n\nHe taps a map with a bony finger.\n\n'You can find it either:\n\n• at a Hunter’s Hut in the northern woods (safer, but you’ll need to convince them)\n\n• or in an Abandoned Castle ruins to the east (faster, but… cursed)\n\nChoose.'",
    choices: [
      { text: "Go to the northern woods (Hunter’s Hut)", next: "woods_path" },
      { text: "Go east to the Abandoned Castle", next: "castle_path" }
    ]
  },

  // -------------------------
  // WOODS / HUT (with an encounter)
  // -------------------------
  woods_path: {
    text: "You head north, leaving the town behind. The road turns to dirt, then to a thin trail. Trees tighten around you like a crowd.\n\nHours pass. The light dims.\n\nYou spot smoke in the distance — a hut. But you also notice fresh claw marks on a nearby tree.\n\nA low growl echoes between the trunks.\n\nDo you go straight to the hut, or follow the claw marks to see what’s stalking the area?",
    choices: [
      { text: "Go straight to the hut", next: "woods_wolf" },
      { text: "Follow the claw marks", next: "woods_detour" }
    ]
  },

  woods_wolf: {
    text: "You push forward toward the smoke.\n\nA shape slips between the trees.\n\nSomething hungry watches you.",
    encounter: { enemyKey: "wolf" },
    choices: [
      { text: "After the encounter, continue", next: "hut_arrive" }
    ]
  },

  woods_detour: {
    text: "You follow the claw marks deeper into the trees.\n\nThe forest goes unnaturally quiet.\n\nYou find a half-buried stone marker — old, cracked, and carved with the same shifting symbols you saw near the Academy.\n\nBeyond it, the ground slopes down into mist.\n\nYou realise too late: this isn’t just a forest trail.\n\nIt’s a path leading east… toward ruined stone towers barely visible through the fog.\n\nYou’ve accidentally found a hidden route to the Abandoned Castle.",
    choices: [
      { text: "Turn back and go to the hut", next: "woods_wolf" },
      { text: "Keep going toward the ruins", next: "castle_arrive" }
    ]
  },

  hut_arrive: {
    text: "You approach the Hunter’s Hut. It’s sturdy, built from dark logs and reinforced with bone charms tied to the doorway.\n\nA figure steps out — cloaked in fur, face half-hidden.\n\nA bow is raised at you.\n\n'Why are you here?' the hunter demands.",
    choices: [
      { text: "Explain Dr. Varrick's request", next: "hut_weapon" },
      { text: "Back away and leave", next: "start" }
    ]
  },

  hut_weapon: {
    text: "The hunter narrows their eyes at the mention of Moon-Thorn Sap.\n\n'Varrick… figures.'\n\nThey lower the bow slightly and toss you a worn weapon.\n\n'If you’re going to deal with his kind of trouble, you’ll need this.'\n\n(You gained a weapon: Hunter’s Bow.)",
    onEnter: () => {
      state.player.weaponKey = "bow";
      state.player.varrickQuestsDone = Math.min(2, state.player.varrickQuestsDone + 1);
    },
    choices: [
      { text: "Return to town (for now)", next: "start" }
    ]
  },

  // -------------------------
  // CASTLE (with an encounter)
  // -------------------------
  castle_path: {
    text: "You travel east. The land becomes rocky and uneven. A cold wind presses against you like a warning.\n\nAt sunset, you see it: the Abandoned Castle, broken towers jutting into the sky like snapped teeth.\n\nThe gates are gone, but the air near the ruins tastes of iron.\n\nA narrow side trail splits off toward the woods — you can still turn back if you want.",
    choices: [
      { text: "Enter the castle ruins", next: "castle_arrive" },
      { text: "Take the side trail toward the woods", next: "hut_fallback" }
    ]
  },

  hut_fallback: {
    text: "You follow the side trail, forcing yourself away from the ruins.\n\nThe pressure in your chest eases a little.\n\nSoon the scent of smoke and cooked meat finds you.\n\nA hut appears between the trees.\n\n(You’ve reached the Hunter’s Hut — by avoiding the castle.)",
    choices: [
      { text: "Continue", next: "hut_arrive" }
    ]
  },

  castle_arrive: {
    text: "You step into the castle ruins.\n\nThe temperature drops instantly.\n\nYour footsteps echo wrong — like the sound comes back a half-second too late.\n\nA broken hallway stretches ahead. On the wall, something has scratched symbols into the stone.\n\nFor a moment, you swear one of the shadows moves *against* the torchlight.",
    encounter: { enemyKey: "wisp" },
    choices: [
      { text: "Push deeper into the ruins", next: "castle_weapon" },
      { text: "Retreat (restart)", next: "start" }
    ]
  },

  castle_weapon: {
    text: "Beyond a collapsed archway you find an old armour stand. Dust coats everything… except the sword.\n\nWhen you touch it, the steel hums — like it remembers being used.\n\nA battered shield rests beside it, still strapped and ready.\n\n(You gained a weapon: Sword & Shield.)",
    onEnter: () => {
      state.player.weaponKey = "sword";
      state.player.varrickQuestsDone = Math.min(2, state.player.varrickQuestsDone + 1);
    },
    choices: [
      { text: "Return to town (for now)", next: "start" }
    ]
  }
};
