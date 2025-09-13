const auth = firebase.auth();
const db = firebase.database();
let uid = null;
let words = [];
let i = 0;

let presetLevel = null;
let presetType = null;
let usePreset = false;
let userWordsRef = null;
let askReverse = false;
let trainingMode = "both";

auth.signInAnonymously().then(() => {
  uid = auth.currentUser.uid;
  listenWords();
});

function listenWords() {
  if (usePreset) return;
  if (userWordsRef) userWordsRef.off();

  userWordsRef = db.ref('users/' + uid + '/words');
  userWordsRef.on('value', snapshot => {
    words = snapshot.val() ? Object.values(snapshot.val()) : [];
    i = 0;
    showWord();
  });
}

function getSelectedValue(id) {
  const el = document.querySelector(`#${id} .selected`);
  return el ? el.getAttribute('data-value') : null;
}

function addWord() {
  if (usePreset) return; // нельзя добавлять в пресеты
  const w = document.getElementById('word').value.trim();
  const t = document.getElementById('translation').value.trim();
  if (!w || !t) return;
  const newRef = db.ref('users/' + uid + '/words').push();
  newRef.set({ word: w, translation: t });
  document.getElementById('word').value = '';
  document.getElementById('translation').value = '';
}

function showWord() {
  if (words.length === 0) {
    document.getElementById('trainer').innerHTML = t("noWords");
    return;
  }
  if (i >= words.length) i = 0;

  if (trainingMode === "ru2lv") {
    askReverse = false;
  } else if (trainingMode === "lv2ru") {
    askReverse = true;
  } else {
    askReverse = Math.random() < 0.5;
  }

  if (!askReverse) {
    document.getElementById('trainer').innerHTML =
      '<b>' + words[i].word + '</b>' +
      '<input id="answer" placeholder="' + t("translation") + '">' +
      '<br><button onclick="checkAnswer()">' + t("check") + '</button>';
  } else {
    document.getElementById('trainer').innerHTML =
      '<b>' + words[i].translation + '</b>' +
      '<input id="answer" placeholder="' + t("word") + '">' +
      '<br><button onclick="checkAnswer()">' + t("check") + '</button>';
  }
}

function checkAnswer() {
  const input = document.getElementById('answer');
  const userAns = input.value.trim().toLowerCase();

  let correctAns;
  if (!askReverse) {
    correctAns = words[i].translation.trim().toLowerCase();
  } else {
    correctAns = words[i].word.trim().toLowerCase();
  }

  if (userAns === correctAns) {
    input.classList.remove('wrong');
    input.classList.add('correct');
    setTimeout(() => { nextWord(); }, 1000);
  } else {
    input.classList.remove('correct');
    input.classList.add('wrong');
  }
}

function nextWord() {
  i++;
  showWord();
}

function openModal() {
  renderWordList();
  document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
function renderWordList() {
  const list = document.getElementById('word-list');
  list.innerHTML = '';
  const ref = db.ref('users/' + uid + '/words');
  ref.once('value', snap => {
    const data = snap.val();
    if (!data) {
      list.innerHTML = '<p>Нет слов</p>';
      return;
    }
    Object.entries(data).forEach(([key, item]) => {
      const div = document.createElement('div');
      div.className = 'word-item';
      div.innerHTML = `
        <input value="${item.word}" onchange="updateWord('${key}', this.value, 'word')">
        <input value="${item.translation}" onchange="updateWord('${key}', this.value, 'translation')">
        <button onclick="deleteWord('${key}')">Удалить</button>
      `;
      list.appendChild(div);
    });
  });
}
function updateWord(key, value, field) {
  db.ref('users/' + uid + '/words/' + key + '/' + field).set(value);
}
function deleteWord(key) {
  db.ref('users/' + uid + '/words/' + key).remove().then(() => renderWordList());
}

function openSettings() {
  document.getElementById('settings-modal').style.display = 'flex';
}
function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

function applySettings() {
  const lvl = getSelectedValue('level-select');
  const typ = getSelectedValue('type-select');
  const mode = getSelectedValue('mode-select');

  if (!lvl || !typ || !mode) return;

  presetLevel = lvl;
  presetType  = typ;
  trainingMode = mode;
  usePreset   = true;

  if (userWordsRef) userWordsRef.off();

  document.getElementById('manage-btn').style.display = 'none';
  document.getElementById('add-card').style.display   = 'none';

  document.getElementById('trainer').innerText = t('trainer');
  closeSettings();
  loadPresetWords();
}

function resetToPersonal() {
  usePreset = false;

  document.getElementById('manage-btn').style.display = 'inline-block';
  document.getElementById('add-card').style.display   = 'block';

  document.getElementById('trainer').innerText = t('trainer');
  listenWords();
}

function loadPresetWords() {
  if (!presetLevel || !presetType) return;

  db.ref(`presets/${presetLevel}/${presetType}`).once('value', snap => {
    const data = snap.val();
    words = data ? shuffle(Object.values(data)) : [];
    i = 0;
    showWord();
  });
}

function shuffle(array) {
  for (let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
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
});
