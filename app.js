const auth = firebase.auth();
const db = firebase.database();
let uid = null;

let presetLevel = null;
let presetType = null;
let usePreset = false;
let userWordsRef = null;
let pendingDuplicate = null;

auth.signInAnonymously().then(() => {
  uid = auth.currentUser.uid;
  listenWords();
});

function listenWords() {
  if (usePreset) return;
  if (userWordsRef) userWordsRef.off();

  userWordsRef = db.ref("users/" + uid + "/words");
  userWordsRef.on("value", snapshot => {
    const words = snapshot.val() ? Object.values(snapshot.val()) : [];
    Trainer.setWords(words);
  });
}

function getSelectedValue(id) {
  const el = document.querySelector(`#${id} .selected`);
  return el ? el.getAttribute("data-value") : null;
}

function addWord() {
  if (usePreset) return;

  const wordInput = document.getElementById("word");
  const transInput = document.getElementById("translation");

  const w = wordInput.value.trim();
  const t = transInput.value.trim();
  if (!w || !t) return;

  const found = Trainer.getWords().find(item =>
    item.word.toLowerCase() === w.toLowerCase() ||
    item.translation.toLowerCase() === t.toLowerCase() ||
    (item.word.toLowerCase() === t.toLowerCase() &&
    item.translation.toLowerCase() === w.toLowerCase())
  );

  if (found) {
    pendingDuplicate = { w, t };

    document.getElementById("duplicate-existing").innerText =
      `${found.word} → ${found.translation}`;
    document.getElementById("duplicate-new").innerText =
      `${w} → ${t}`;

    document.getElementById("duplicate-modal").style.display = "flex";
    return;
  }

  saveWord(w, t);
}

function saveWord(w, t) {
  const newRef = db.ref("users/" + uid + "/words").push();
  newRef.set({ word: w, translation: t });

  const wordInput = document.getElementById("word");
  const transInput = document.getElementById("translation");

  wordInput.value = "";
  transInput.value = "";
  wordInput.style.backgroundColor = "";
  transInput.style.backgroundColor = "";
}

function openModal() {
  renderWordList();
  document.getElementById("modal").style.display = "flex";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function renderWordList() {
  const list = document.getElementById("word-list");
  list.innerHTML = "";
  const ref = db.ref("users/" + uid + "/words");
  ref.once("value", snap => {
    const data = snap.val();
    if (!data) {
      list.innerHTML = `<p>${t("noWords")}</p>`;
      return;
    }
    Object.entries(data).forEach(([key, item]) => {
      const div = document.createElement("div");
      div.className = "word-item";
      div.innerHTML = `
        <input value="${item.word}" onchange="updateWord('${key}', this.value, 'word')">
        <input value="${item.translation}" onchange="updateWord('${key}', this.value, 'translation')">
        <button onclick="deleteWord('${key}')">${t("delete")}</button>
      `;
      list.appendChild(div);
    });
  });
}

function updateWord(key, value, field) {
  db.ref("users/" + uid + "/words/" + key + "/" + field).set(value);
}

function deleteWord(key) {
  db.ref("users/" + uid + "/words/" + key)
    .remove()
    .then(() => renderWordList());
}

function openSettings() {
  document.getElementById("settings-modal").style.display = "flex";
}
function closeSettings() {
  document.getElementById("settings-modal").style.display = "none";
}

function applySettings() {
  const lvl = getSelectedValue("level-select");
  const typ = getSelectedValue("type-select");
  const mode = getSelectedValue("mode-select");

  if (!lvl || !typ || !mode) return;

  presetLevel = lvl;
  presetType = typ;
  Trainer.setMode(mode);
  usePreset = true;

  if (userWordsRef) userWordsRef.off();

  document.getElementById("manage-btn").style.display = "none";
  document.getElementById("add-card").style.display = "none";

  closeSettings();
  loadPresetWords();
}

function resetToPersonal() {
  usePreset = false;

  document.getElementById("manage-btn").style.display = "inline-block";
  document.getElementById("add-card").style.display = "block";

  listenWords();
}

function loadPresetWords() {
  if (!presetLevel || !presetType) return;

  if (presetLevel === "randomAll") {
    db.ref("presets").once("value", snap => {
      const data = snap.val();
      let all = [];
      if (data) {
        Object.values(data).forEach(levelData => {
          if (levelData[presetType]) {
            all = all.concat(Object.values(levelData[presetType]));
          }
        });
      }
      Trainer.setWords(shuffle(all));
    });
  } else {
    db.ref(`presets/${presetLevel}/${presetType}`).once("value", snap => {
      const data = snap.val();
      const words = data ? shuffle(Object.values(data)) : [];
      Trainer.setWords(words);
    });
  }
}

function shuffle(array) {
  for (
    let j, x, i = array.length;
    i;
    j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x
  );
  return array;
}

function initCustomSelects() {
  document.querySelectorAll(".custom-select").forEach(select => {
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");

    selected.addEventListener("click", () => {
      document.querySelectorAll(".custom-select").forEach(s => {
        if (s !== select) {
          s.classList.remove("open");
          s.querySelector(".options").style.display = "none";
        }
      });
      select.classList.toggle("open");
      options.style.display = select.classList.contains("open") ? "block" : "none";
    });

    options.querySelectorAll("div").forEach(opt => {
      opt.addEventListener("click", () => {
        selected.innerText = opt.innerText;
        selected.setAttribute("data-value", opt.getAttribute("data-value"));
        options.style.display = "none";
        select.classList.remove("open");
      });
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".custom-select")) {
      document.querySelectorAll(".custom-select").forEach(select => {
        select.classList.remove("open");
        select.querySelector(".options").style.display = "none";
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCustomSelects();
  applyTranslations();

  document.getElementById("dup-yes").addEventListener("click", () => {
    if (pendingDuplicate) {
      saveWord(pendingDuplicate.w, pendingDuplicate.t);
      pendingDuplicate = null;
    }
    document.getElementById("duplicate-modal").style.display = "none";
  });

  document.getElementById("dup-no").addEventListener("click", () => {
    pendingDuplicate = null;
    document.getElementById("duplicate-modal").style.display = "none";
  });
});
