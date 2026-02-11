let currentScene = "start";

const storyText = document.getElementById("story-text");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");

function setChoice(button, choice) {
  if (!choice) {
    button.style.display = "none";
    button.onclick = null;
    button.textContent = "";
    return;
  }

  button.style.display = "inline-block";
  button.textContent = choice.text;
  button.onclick = () => loadScene(choice.next);
}

function loadScene(sceneKey) {
  const sceneData = story[sceneKey];

  // If a scene key doesn't exist, don't hard-crash silently.
  if (!sceneData) {
    storyText.textContent = `Error: scene "${sceneKey}" not found. Check your story.js keys.`;
    choice1.style.display = "none";
    choice2.style.display = "none";
    return;
  }

  storyText.textContent = sceneData.text;

  const choices = sceneData.choices || [];
  setChoice(choice1, choices[0]);
  setChoice(choice2, choices[1]);
}

loadScene(currentScene);
