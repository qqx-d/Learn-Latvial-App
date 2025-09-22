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

  const dTitle = document.getElementById("duplicate-title");
  if (dTitle) dTitle.innerText = t("duplicateTitle");

  const dExists = document.getElementById("duplicate-exists-label");
  if (dExists) dExists.innerText = t("duplicateExists");

  const dNew = document.getElementById("duplicate-new-label");
  if (dNew) dNew.innerText = t("duplicateNew");

  const dConfirm = document.getElementById("duplicate-confirm");
  if (dConfirm) dConfirm.innerText = t("duplicateConfirm");

  const dupYes = document.getElementById("dup-yes");
  if (dupYes) dupYes.innerText = t("yes");

  const dupNo = document.getElementById("dup-no");
  if (dupNo) dupNo.innerText = t("no");

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
