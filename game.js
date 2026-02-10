let currentScene = "start";

const storyText = document.getElementById("story-text");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");

function loadScene(scene) {
  const sceneData = story[scene];

  storyText.textContent = sceneData.text;

  if (sceneData.choices.length > 0) {
    choice1.style.display = "inline-block";
    choice2.style.display = "inline-block";

    choice1.textContent = sceneData.choices[0].text;
    choice1.onclick = () => loadScene(sceneData.choices[0].next);

    choice2.textContent = sceneData.choices[1].text;
    choice2.onclick = () => loadScene(sceneData.choices[1].next);
  } else {
    choice1.style.display = "none";
    choice2.style.display = "none";
  }
}

loadScene(currentScene);

