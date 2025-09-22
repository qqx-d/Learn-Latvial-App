const declDb = firebase.database();
let currentDecl = null;
let declGroups = {};

function loadRandomDeclension() {
  declDb.ref("declension").once("value", snap => {
    const data = snap.val();
    if (!data) {
      showDeclensionWord(null);
      return;
    }

    declGroups = {};
    Object.values(data).forEach(levelData => {
      Object.values(levelData).forEach(item => {
        if (!declGroups[item.group]) {
          declGroups[item.group] = [];
        }
        declGroups[item.group].push(item);
      });
    });

    pickBalancedDeclension();
  });
}

function pickBalancedDeclension() {
  const groups = Object.keys(declGroups).filter(g => declGroups[g].length > 0);
  if (groups.length === 0) {
    showDeclensionWord(null);
    return;
  }

  const randGroup = groups[Math.floor(Math.random() * groups.length)];
  const words = declGroups[randGroup];
  const idx = Math.floor(Math.random() * words.length);

  currentDecl = words[idx];
  showDeclensionWord(currentDecl);
}

function showDeclensionWord(item) {
  const wordEl = document.getElementById("declension-word");
  const transEl = document.getElementById("declension-translation");

  document.querySelectorAll(".declension-actions button").forEach(btn => {
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });

  if (!item) {
    wordEl.innerText = "Пусто";
    transEl.innerText = "";
    return;
  }

  wordEl.innerText = item.word;
  transEl.innerText = item.translation;
}

function checkDeclension(choice, btn) {
  if (!currentDecl) return;
  const correct = currentDecl.group;

  document.querySelectorAll(".declension-actions button").forEach(b => b.disabled = true);

  if (choice === correct) {
    btn.classList.add("correct");
    setTimeout(() => pickBalancedDeclension(), 800);
  } else {
    btn.classList.add("wrong");
    const correctBtn = document.querySelector(`.declension-actions button[data-choice='${correct}']`);
    if (correctBtn) correctBtn.classList.add("correct");
    setTimeout(() => pickBalancedDeclension(), 1200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".declension-actions button").forEach(btn => {
    btn.addEventListener("click", () => {
      checkDeclension(btn.dataset.choice, btn);
    });
  });

  loadRandomDeclension();
});
