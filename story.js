const story = {
  start: {
    text: "As your eyes open you look around the darkend unlit room. That was your last night in the rented room of the tavern, you get up and head over to the door. You are staying in a town called Björnsfield. You open the heavy wooden door and get blinded by the vibrant town. As your eyes adjust to the early morning light you become aware of the people pushing past you on the street, looking directly across the pebbled streets you see more medieval style houses line the street on both sides. Looking down the street to the left and see more houses and shops lining the streets curbs; to your right you see a large stone building. Do you choose to go down the road or up the street to the large stone building.",
    choices: [
      { text: "Head down the street", next: "down" },
      { text: "Head up the street", next: "up" }
    ]
  },
  up: {
    text: "you die lol, cancer or smth.",
    choices: [
      { text: "But it refused", next: "ref" }

      
    ]
  },
  ref: {
    text: "I havent done this go back atm",
    choices: [
      { text: " go back", next: "start" }
      ]

  
  },

  down: {
    text: " You travel down the road passing by multiple shops selling various goods from accross the lands, silks and different wears paired with the smell of street food nourish your brain, as you look to your right you see a smaller sign on the front of what looks like an old hospital, its front face is worn down by age and weather.",
    choices: [
      { text: "enter the hospital", next: "hosp" },
      { text: "continue down the road", next: "road" }
    ]
  },

  road: {
    text: "You start travelign down the road, a deep rumble comes from within your gut; and omnipresence of darks starts flooding you body, the edges of your vision start fading",
    choices: [
      { text: "head back to the hospital", next: "hosp"},
      { text: "ignore the obvious signs your doing the wrong thing", next: "dumb"}
    ]
  },

  dumb : {
    text: "Wow, not so clever now are you, you get cancer and like explode or something idk, maybe you jump off a cliff, maybe your having a schiz episode, anyway you lost lol",
    choices: [
      { text: "Restart", next: "start" }
      
      
    ]
  }
};

