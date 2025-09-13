const translations = {
  ru: {
    title: "Тренировка слов",
    addWordTitle: "Добавить слово",
    word: "Слово",
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
    mode_both: "Все вместе"
  },
  en: {
    title: "Word Trainer",
    addWordTitle: "Add word",
    word: "Word",
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
    mode_both: "Mixed"
  },
  lv: {
    title: "Vārdu treniņš",
    addWordTitle: "Pievienot vārdu",
    word: "Vārds",
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
    mode_both: "Abi kopā"
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
  const order = ["ru", "en", "lv"];
  const next = order[(order.indexOf(currentLang) + 1) % order.length];
  setLang(next);
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
}
