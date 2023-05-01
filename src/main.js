const os = "mac"; // Указываем операционную систему

const languages = {
  en: [
    "` 1 2 3 4 5 6 7 8 9 0 - =",
    "q w e r t y u i o p [ ] \\",
    "a s d f g h j k l ; '",
    "z x c v b n m , . /",
    "space",
  ],
  ru: [
    "ё 1 2 3 4 5 6 7 8 9 0 - =",
    "й ц у к е н г ш щ з х ъ \\",
    "ф ы в а п р о л д ж э",
    "я ч с м и т ь б ю .",
    "space",
  ],
};

let currentLanguage = localStorage.getItem("language") || "en"; // Получаем текущий язык или устанавливаем по умолчанию английский

const keyboardContainer = document.createElement("div");
keyboardContainer.classList.add("keyboard-container");

const textarea = document.createElement("textarea");
textarea.classList.add("textarea");

document.body.append(keyboardContainer, textarea);

// Функция для добавления кнопки на клавиатуру
function createButton(keyValue, buttonClass) {
  const button = document.createElement("button");
  button.classList.add("keyboard-button", buttonClass);
  button.textContent = keyValue;

  // Обработчик событий на клик по кнопке
  button.addEventListener("click", () => {
    if (keyValue === "space") {
      textarea.value += " ";
    } else if (keyValue === "tab") {
      textarea.value += "  ";
    } else if (keyValue === "enter") {
      textarea.value += "\n";
    } else if (keyValue === "backspace") {
      textarea.value = textarea.value.slice(0, -1);
    } else if (keyValue === "del") {
      textarea.value = textarea.value.slice(0, textarea.selectionStart) + textarea.value.slice(textarea.selectionEnd);
    } else if (keyValue === "capslock") {
      const capsLock = document.querySelector(".capslock");
      capsLock.classList.toggle("active");
      toggleCapsLock();
    } else {
      textarea.value += keyValue[currentLanguage === "en" ? 0 : 1];
    }
  });

  return button;
}

// Функция для создания всей клавиатуры на основе языков
function createKeyboard(language) {
  const keys = languages[language].map((row) => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("keyboard-row");

    row.split(" ").forEach((keyValue) => {
      if (keyValue === "") {
        rowElement.append(createSpacer());
      } else {
        const isLetter = /^[a-zA-Zа-яА-ЯёЁ]$/.test(keyValue);
        const button = document.createElement("button");
				button.classList.add("keyboard-key");
				button.textContent = keyValue;

    if (isLetter) {
      button.dataset.en = keyValue.toLowerCase();
      button.dataset.language = language;
    }

    rowElement.append(button);
  }
});

return rowElement;
});

keyboardContainer.append(...keys);
}

// Функция для создания пустого промежутка между кнопками
function createSpacer() {
const spacer = document.createElement("div");
spacer.classList.add("keyboard-spacer");
return spacer;
}

// Создаем клавиатуру при загрузке страницы
createKeyboard(currentLanguage);

// Обработчик нажатия на клавиатуре мышью
keyboardContainer.addEventListener("click", (event) => {
if (event.target.classList.contains("keyboard-key")) {
const key = event.target.textContent;
insertText(key);
}
});

// Обработчик нажатия клавиш на физической клавиатуре
document.addEventListener("keydown", (event) => {
const key = event.key;

// Отменяем стандартное поведение кнопок
event.preventDefault();

// Подсвечиваем нажатую клавишу на виртуальной клавиатуре
highlightKey(key);

// Ввод символа в текстовое поле
if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
insertText(key);
}

// Навигация по текстовому полю
switch (key) {
case "ArrowUp":
insertText("↑");
break;
case "ArrowDown":
insertText("↓");
break;
case "ArrowLeft":
insertText("←");
break;
case "ArrowRight":
insertText("→");
break;
case "Enter":
insertText("\n");
break;
case "Tab":
insertText(" ");
break;
case "Backspace":
deleteText(-1);
break;
case "Delete":
deleteText(1);
break;
}
});

// Обработчик отжатия клавиш на физической клавиатуре
document.addEventListener("keyup", (event) => {
const key = event.key;

// Снимаем подсветку с клавиши на виртуальной клавиатуре
unhighlightKey(key);
});

// Функция для подсветки клавиши на виртуальной клавиатуре
function highlightKey(key) {
const button = getButtonByKey(key);
if (button) {
button.classList.add("keyboard-key-active");
}
}

// Функция для снятия подсветки с клавиши на виртуальной клавиатуре
function unhighlightKey(key) {
const button = getButtonByKey(key);
if (button) {
button.classList.remove("keyboard-key-active");
}
}

// Функция для получения кнопки на виртуальной клавиатуре по символу
function getButtonByKey(key) {
return keyboardContainer.querySelector(`button:not([data-en])[data-key="${key}"]`);
}

// Функция для вставки символа в текстовое поле
function insertText(text) {
const textarea = document.querySelector(".textarea");
const cursorPosStart = textarea.selectionStart;
const cursorPosEnd = textarea.selectionEnd;
const currentValue = textarea.value;
textarea.value =
currentValue.substring(0, cursorPosStart) +
text +
currentValue.substring(cursorPosEnd);
textarea.setSelectionRange(cursorPosStart + 1, cursorPosStart + 1);
textarea.focus();
}

// Функция для удаления символа в текстовом поле
function deleteText(direction) {
  const startPosition = textarea.selectionStart;
  const endPosition = textarea.selectionEnd;
  textarea.value = textarea.value.slice(0, startPosition) + textarea.value.slice(endPosition);
  textarea.selectionEnd = textarea.selectionStart = startPosition + direction;
}

// Функция для вставки символа-разделителя
function insertSeparator(separator) {
const textarea = document.querySelector(".textarea");
const cursorPosStart = textarea.selectionStart;
const cursorPosEnd = textarea.selectionEnd;
const currentValue = textarea.value;
textarea.value =
currentValue.substring(0, cursorPosStart) +
separator +
currentValue.substring(cursorPosEnd);
textarea.setSelectionRange(cursorPosStart + separator.length, cursorPosStart + separator.length);
textarea.focus();
}

// Функция для переключения режима CapsLock
function toggleCapsLock() {
  const buttons = document.querySelectorAll(".keyboard-button");
  buttons.forEach((button) => {
    if (/^[a-zA-Zа-яА-ЯёЁ]$/.test(button.textContent)) {
      button.textContent = button.textContent.toUpperCase();
    }
  });
}

// Обработчик событий нажатия на кнопки клавиатуры
document.addEventListener("keydown", (event) => {
const key = document.querySelector(`[data-code="${event.code}"]`);
if (key) {
key.classList.add("active");
if (key.classList.contains("letter")) {
const language = localStorage.getItem("language") || "en";
const keyValue = event.shiftKey ? key.dataset.shift : key.dataset.value;
const upperKeyValue = keyValue.toUpperCase();
insertText(event.getModifierState("CapsLock") ? upperKeyValue : keyValue);
} else if (key.classList.contains("number")) {
const keyValue = event.shiftKey ? key.dataset.shift : key.dataset.value;
insertText(keyValue);
} else if (key.classList.contains("separator")) {
const keyValue = key.dataset.value;
insertSeparator(keyValue);
} else if (key.classList.contains("space")) {
insertText(" ");
} else if (key.classList.contains("backspace")) {
const textarea = document.querySelector(".textarea");
const cursorPosStart = textarea.selectionStart;
const cursorPosEnd = textarea.selectionEnd;
if (cursorPosStart === cursorPosEnd) {
textarea.setSelectionRange(cursorPosStart - 1, cursorPosStart - 1);
}
document.execCommand("delete");
} else if (key.classList.contains("delete")) {
const textarea = document.querySelector(".textarea");
const cursorPosStart = textarea.selectionStart;
const cursorPosEnd = textarea.selectionEnd;
if (cursorPosStart === cursorPosEnd) {
textarea.setSelectionRange(cursorPosStart + 1, cursorPosStart + 1);
}
document.execCommand("delete");
} else if (key.classList.contains("tab")) {
insertSeparator(" ");
} else if (key.classList.contains("enter")) {
insertSeparator("\n");
}
event.preventDefault();
}
});

document.addEventListener("keyup", (event) => {
const key = document.querySelector(`[data-code="${event.code}"]`);
if (key) {
key.classList.remove("active");
}
});

// Функция для переключения языка клавиатуры
function switchLanguage() {
const language = localStorage.getItem("language") || "en";
const newLanguage = language === "en" ? "ru" : "en";
localStorage.setItem("language", newLanguage);
createKeyboard(newLanguage);
}

// Обработчик события переключения языка клавиатуры
const languageSwitcher = document.querySelector(".language-switcher");
languageSwitcher.addEventListener("click", () => {
if (currentLanguage === "en") {
currentLanguage = "ru";
} else {
currentLanguage = "en";
}
localStorage.setItem("language", currentLanguage);
updateKeyboard();
});

// Функция для обновления клавиатуры на новом языке
function updateKeyboard() {
const keyboardRows = document.querySelectorAll(".keyboard-row");
keyboardRows.forEach((row, i) => {
const keys = row.querySelectorAll(".key");
keys.forEach((key, j) => {
const keyValue = languages[currentLanguage][i].split(" ")[j];
key.textContent = keyValue;
});
});
}

// Инициализация клавиатуры при загрузке страницы
updateKeyboard();
