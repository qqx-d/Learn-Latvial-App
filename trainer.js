let words = [];
let i = 0;
let trainingMode = "both";
let askReverse = false;

let stats = loadStats(); 

function showWord() {
  const trainer = document.getElementById("trainer");
  trainer.innerHTML = "";

  const uiContainer = document.createElement("div");
  uiContainer.className = "trainer-ui";
  trainer.appendChild(uiContainer);

  if (words.length === 0) {
    const noWordsMsg = document.createElement("p");
    noWordsMsg.innerText = t("noWords");
    uiContainer.appendChild(noWordsMsg);
    return;
  }

  const wordObj = words[i];

  askReverse =
    trainingMode === "ru2lv"
      ? false
      : trainingMode === "lv2ru"
      ? true
      : Math.random() < 0.5;

  const question = document.createElement("b");
  question.textContent = askReverse ? wordObj.translation : wordObj.word;
  uiContainer.appendChild(question);

  const input = document.createElement("input");
  input.id = "answer";
  input.placeholder = t("translation");
  uiContainer.appendChild(input);

  const actions = document.createElement("div");
  actions.className = "trainer-actions";

  const btnCheck = document.createElement("button");
  btnCheck.id = "check-btn";
  btnCheck.textContent = t("check");
  btnCheck.addEventListener("click", checkAnswer);

  const btnSkip = document.createElement("button");
  btnSkip.id = "skip-btn";
  btnSkip.textContent = t("skip");
  btnSkip.addEventListener("click", skipWord);

  actions.appendChild(btnCheck);
  actions.appendChild(btnSkip);
  uiContainer.appendChild(actions);
}

function skipWord() {
  setTimeout(() => {
    nextWord();
  }, 100);
}

function checkAnswer() {
  const input = document.getElementById("answer");
  const btn = document.getElementById("check-btn");
  const userAns = cleanWord(input.value);

  const wordObj = words[i];
  const word = wordObj.word;
  const translation = wordObj.translation;
  const key = word + "|" + translation;

  let correctAns = askReverse ? cleanWord(word) : cleanWord(translation);

  if (userAns === correctAns) {
    input.classList.remove("wrong");
    input.classList.add("correct");
    btn.classList.remove("wrong");
    btn.classList.add("correct");

    btn.disabled = true;

    updateStats(key, true);

    setTimeout(() => {
      nextWord();
    }, 1000);
  } else {
    input.classList.remove("correct");
    input.classList.add("wrong");
    btn.classList.remove("correct");
    btn.classList.add("wrong");

    updateStats(key, false);
  }
}

function nextWord() {
  i = pickWeightedIndex();
  showWord();
}

function pickWeightedIndex() {
  if (words.length === 0) return 0;

  const weights = words.map(w => {
    const key = w.word + "|" + w.translation;
    const s = stats[key] || { correct: 0, wrong: 0 };
    return (1 + s.wrong) / (1 + s.correct);
  });

  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;

  let acc = 0;
  for (let idx = 0; idx < weights.length; idx++) {
    acc += weights[idx];
    if (r <= acc) return idx;
  }
  return 0;
}

function cleanWord(word) {
  return word.replace(/\(.*?\)/g, "").trim().toLowerCase();
}

function updateStats(key, isCorrect) {
  if (!stats[key]) stats[key] = { correct: 0, wrong: 0 };
  if (isCorrect) stats[key].correct++;
  else stats[key].wrong++;
  saveStats();
}

function saveStats() {
  localStorage.setItem("trainerStats", JSON.stringify(stats));
}

function loadStats() {
  try {
    const raw = localStorage.getItem("trainerStats");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

window.Trainer = {
  setWords(newWords) {
    words = newWords || [];
    i = 0;
    showWord();
  },
  getWords() {
    return words;
  },
  setMode(mode) {
    trainingMode = mode;
  },
  showWord
};
