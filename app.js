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
