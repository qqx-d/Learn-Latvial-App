const translations = {
  ru: {
    title: "Тренировка слов",
    addWordTitle: "Добавить слово",
    translation: "Перевод",
    add: "Добавить",
    manage: "Управлять словами",
    listTitle: "Список слов",
    delete: "Удалить",
    check: "Проверить",
    noWords: "Нет слов. Добавьте новые ниже.",
    trainer: "Загрузка...",
    settings: "Настройки",
    settingsTitle: "Настройки",
    apply: "Применить",
    reset: "Сбросить",
    nouns: "Существительные",
    verbs: "Глаголы",
    adjectives: "Прилагательные",
    mode_ru2lv: "С русского на латышский",
    mode_lv2ru: "С латышского на русский",
    mode_both: "Все вместе",
    randomAll: "Случайные слова",
    skip: "Пропустить",
    trainerTab: "Слова",
    manageTab: "Склонения",
    settingsTab: "🔒",
    noWords: "Нет слов",
    delete: "Удалить",
    decl1: "1 склонение",
    decl2: "2 склонение",
    decl3: "3 склонение",
    decl4: "4 склонение",
    decl5: "5 склонение",
    decl6: "6 склонение",
  },
  en: {
    title: "Word Trainer",
    addWordTitle: "Add word",

    translation: "Translation",
    add: "Add",
    manage: "Manage words",
    listTitle: "Word list",
    delete: "Delete",
    check: "Check",
    noWords: "No words yet. Add new ones below.",
    trainer: "Loading...",
    settings: "Settings",
    settingsTitle: "Settings",
    apply: "Apply",
    reset: "Reset",
    nouns: "Nouns",
    verbs: "Verbs",
    adjectives: "Adjectives",
    mode_ru2lv: "From Russian to Latvian",
    mode_lv2ru: "From Latvian to Russian",
    mode_both: "Mixed",
    randomAll: "Random words",
    skip: "Skip",
    trainerTab: "Words",
    manageTab: "Declensions",
    settingsTab: "🔒",
    noWords: "No words",
    delete: "Delete",
    decl1: "1st declension",
    decl2: "2nd declension",
    decl3: "3rd declension",
    decl4: "4th declension",
    decl5: "5th declension",
    decl6: "6th declension",
  },
  lv: {
    title: "Vārdu treniņš",
    addWordTitle: "Pievienot vārdu",
    translation: "Tulkojums",
    add: "Pievienot",
    manage: "Pārvaldīt vārdus",
    listTitle: "Vārdu saraksts",
    delete: "Dzēst",
    check: "Pārbaudīt",
    noWords: "Nav vārdu. Pievienojiet jaunus zemāk.",
    trainer: "Ielāde...",
    settings: "Iestatījumi",
    settingsTitle: "Iestatījumi",
    apply: "Apstiprināt",
    reset: "Atiestatīt",
    nouns: "Lietvārdi",
    verbs: "Darbības vārdi",
    adjectives: "Īpašības vārdi",
    mode_ru2lv: "No krievu uz latviešu",
    mode_lv2ru: "No latviešu uz krievu",
    mode_both: "Abi kopā",
    randomAll: "Nejauši vārdi",
    skip: "Izlaist",
    trainerTab: "Vārdi",
    manageTab: "Locījumi",
    settingsTab: "🔒",
    noWords: "Nav vārdu",
    delete: "Dzēst",
    decl1: "1. deklinācija",
    decl2: "2. deklinācija",
    decl3: "3. deklinācija",
    decl4: "4. deklinācija",
    decl5: "5. deklinācija",
    decl6: "6. deklinācija",
  }
};

let currentLang = localStorage.getItem("lang") || "ru";

function t(key) {
  return translations[currentLang][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.getElementById("lang-btn").innerText = lang.toUpperCase();
  applyTranslations();
  showWord();
}

function toggleLang() {
  currentLang = currentLang === "ru" ? "en" : currentLang === "en" ? "lv" : "ru";
  localStorage.setItem("lang", currentLang);

  const langBtn = document.getElementById("lang-btn");
  if (langBtn) {
    langBtn.innerText = currentLang.toUpperCase();
  }

  applyTranslations();

  if (typeof renderWordList === "function") {
    renderWordList();
  }
  if (typeof showWord === "function") {
    showWord();
  }
}

function applyTranslations() {
  document.getElementById("title").innerText = t("title");
  document.getElementById("add-title").innerText = t("addWordTitle");
  document.getElementById("word").placeholder = t("word");
  document.getElementById("translation").placeholder = t("translation");
  document.getElementById("add-btn").innerText = t("add");
  document.getElementById("manage-btn").innerText = t("manage");
  document.getElementById("settings-btn").innerText = t("settings");
  document.getElementById("list-title").innerText = t("listTitle");
  document.getElementById("trainer").innerText = t("trainer");
  document.getElementById("settings-title").innerText = t("settingsTitle");
  document.getElementById("apply-btn").innerText = t("apply");
  document.getElementById("reset-btn").innerText = t("reset");

  document.querySelector("#type-select .options [data-value='nouns']").innerText = t("nouns");
  document.querySelector("#type-select .options [data-value='verbs']").innerText = t("verbs");
  document.querySelector("#type-select .options [data-value='adjectives']").innerText = t("adjectives");

  document.getElementById("tab-trainer").innerText = t("trainerTab");
  document.getElementById("tab-manage").innerText = t("manageTab");
  document.getElementById("tab-settings").innerText = t("settingsTab");

  const selectedType = document.querySelector("#type-select .selected");
  if (selectedType) {
    const current = selectedType.getAttribute("data-value");
    if (current) selectedType.innerText = t(current);
  }

  document.querySelector("#mode-select .options [data-value='ru2lv']").innerText = t("mode_ru2lv");
  document.querySelector("#mode-select .options [data-value='lv2ru']").innerText = t("mode_lv2ru");
  document.querySelector("#mode-select .options [data-value='both']").innerText  = t("mode_both");

  const selectedMode = document.querySelector("#mode-select .selected");
  if (selectedMode) {
    const current = selectedMode.getAttribute("data-value");
    if (current) selectedMode.innerText = t("mode_" + current);
  }

  document.querySelector("#level-select .options [data-value='randomAll']").innerText = t("randomAll");

  const selectedLevel = document.querySelector("#level-select .selected");
  if (selectedLevel) {
    const current = selectedLevel.getAttribute("data-value");
    if (current === "randomAll") {
      selectedLevel.innerText = t("randomAll");
    } else {
      selectedLevel.innerText = current.toUpperCase();
    }
  }

  const langBtn = document.getElementById("lang-btn");
  if (langBtn) {
    langBtn.textContent = currentLang.toUpperCase();
  }

  for (let i = 1; i <= 6; i++) {
    const btn = document.getElementById("decl-btn-" + i);
    if (btn) btn.innerText = t("decl" + i);
  }
}