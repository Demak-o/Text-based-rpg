const story = {
  start: {
    text: "You wake up in a dark forest. You hear something moving in the trees.",
    choices: [
      { text: "Investigate the sound", next: "investigate" },
      { text: "Run away", next: "run" }
    ]
  },

  investigate: {
    text: "A wolf steps into the clearing, staring at you.",
    choices: [
      { text: "Fight the wolf", next: "fight" },
      { text: "Slowly back away", next: "run" }
    ]
  },

  run: {
    text: "You escape safely... for now.",
    choices: []
  },

  fight: {
    text: "The wolf overpowers you. Game over.",
    choices: []
  }
};

