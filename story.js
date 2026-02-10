const story = {
  start: {
    text: "As your eyes open you look around the darkend unlit room. That was your last night in the rented room of the tavern, you get up and head over to the door. You8 are staying in a town called Björnsfield. You open the heavy wooden door and get blinded by the vibrant town. As your eyes adjust to the early morning light you become aware of the people pushing past you on the street, looking directly across the pebbled streets you see more medieval style houses line the street on both sides. Looking down the street to the left and see more houses and shops lining the streets curbs; to your right you see a large stone building. Do you choose to go down the road or up the street to the large stone building.",
    choices: [
      { text: "Head down the street", next: "down" },
      { text: "Head up the street", next: "up" }
    ]
  },
  up: {
    text: "you die lol, cancer or smth.",
    choices: []
  },

  down: {
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

