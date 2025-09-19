const declDb = firebase.database();
let currentDecl = null;

function loadRandomDeclension() {
  declDb.ref("declension").once("value", snap => {
    const data = snap.val();
    if (!data) {
      showDeclensionWord(null);
      return;
    }
    
    let all = [];
    Object.values(data).forEach(levelData => {
      all = all.concat(Object.values(levelData));
    });

    if (all.length === 0) {
      showDeclensionWord(null);
      return;
    }

    const idx = Math.floor(Math.random() * all.length);
    currentDecl = all[idx];
    showDeclensionWord(currentDecl);
  });
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
    setTimeout(() => loadRandomDeclension(), 800);
  } else {
    btn.classList.add("wrong");
    const correctBtn = document.querySelector(`.declension-actions button[data-choice='${correct}']`);
    if (correctBtn) correctBtn.classList.add("correct");
    setTimeout(() => loadRandomDeclension(), 1200);
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
