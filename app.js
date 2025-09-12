const auth = firebase.auth();
const db = firebase.database();
let uid = null;
let words = [];
let i = 0;

auth.signInAnonymously().then(() => {
  uid = auth.currentUser.uid;
  listenWords();
});

function listenWords() {
  db.ref('users/' + uid + '/words').on('value', snapshot => {
    words = snapshot.val() ? Object.values(snapshot.val()) : [];
    showWord();
  });
}

function addWord() {
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
    document.getElementById('trainer').innerHTML = 'Нет слов. Добавьте новые ниже.';
    return;
  }
  if (i >= words.length) i = 0;
  document.getElementById('trainer').innerHTML =
    '<b>' + words[i].word + '</b>' +
    '<input id="answer" placeholder="Введите перевод">' +
    '<br><button onclick="checkAnswer()">Проверить</button>';
}

function checkAnswer() {
  const input = document.getElementById('answer');
  const userAns = input.value.trim().toLowerCase();
  const correctAns = words[i].translation.trim().toLowerCase();
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