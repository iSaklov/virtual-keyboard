import './index.html';
import './styles/style.scss';
import keyboardLayouts from './js/keyboard-layout';
import setLanguage from './js/language';

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
const title = document.createElement('h1');
const keyboardOS = document.createElement('span');
keyboardOS.classList.add('keyboard-OS');
const keyboardSwitching = document.createElement('span');
keyboardSwitching.classList.add('keyboard-switching');
let currentLanguage = localStorage.getItem('language') || 'en';

document.body.append(title, textarea, keyboard, keyboardOS, keyboardSwitching);

function getButtonByCode(code) {
  return keyboard.querySelector(`button[data-code="${code}"]`);
}

function highlightKey(code) {
  const button = getButtonByCode(code);
  if (button) {
    button.classList.add('active');
  }
}

function unhighlightKey(code) {
  const button = getButtonByCode(code);
  if (button) {
    button.classList.remove('active');
  }
}

function insertText(text) {
  const cursorPosStart = textarea.selectionStart;
  const cursorPosEnd = textarea.selectionEnd;
  const currentValue = textarea.value;
  const string = text;

  if (
    keyboard.classList.contains('capslock-pressed')
    || keyboard.classList.contains('shift-pressed')
  ) {
    string.toUpperCase();
  }

  textarea
    .value = currentValue.substring(0, cursorPosStart)
    + string + currentValue.substring(cursorPosEnd);
  textarea.setSelectionRange(cursorPosStart + string.length, cursorPosStart + string.length);
  textarea.focus();
}

function deleteText(direction) {
  const startPosition = textarea.selectionStart;
  const endPosition = textarea.selectionEnd;

  if (direction === -1 && startPosition > 0) {
    // backspace
    textarea.value = textarea.value.slice(0, startPosition - 1) + textarea.value.slice(endPosition);
    textarea.selectionStart = startPosition - 1;
    textarea.selectionEnd = startPosition - 1;
  } else if (direction === 1 && endPosition < textarea.value.length) {
    // delete
    textarea.value = textarea.value.slice(0, startPosition) + textarea.value.slice(endPosition + 1);
    textarea.selectionStart = startPosition;
    textarea.selectionEnd = textarea.selectionStart;
  }

  textarea.focus();
}

function toggleCapsLock() {
  const buttons = document.querySelectorAll('button[data-keytype="letter"]');
  buttons.forEach((button) => {
    if (keyboard.classList.contains('capslock-pressed')) {
      button.classList.add('uppercase');
    } else {
      button.classList.remove('uppercase');
    }
  });
}

function toggleShift() {
  const buttons = document.querySelectorAll('button:not([data-action])');
  buttons.forEach((button) => {
    if (keyboard.classList.contains('shift-pressed')) {
      button.classList.add('uppercase');
    } else {
      button.classList.remove('uppercase');
    }
  });
}

function createKeyboard(language) {
  setLanguage(currentLanguage);

  const keys = keyboardLayouts[language].map((row) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('keyboard-row');

    row.forEach((item) => {
      const isLetter = /^[a-zA-Zа-яА-ЯёЁ]$/.test(item.key);
      const button = document.createElement('button');
      button.classList.add('keyboard-key');

      if (item.action) {
        button.setAttribute('data-action', item.action);
      }

      if (item.shiftKey) {
        button.setAttribute('data-shiftKey', item.shiftKey);
      }

      if (isLetter) {
        button.setAttribute('data-keyType', 'letter');
      }

      button.setAttribute('data-code', item.code);
      button.setAttribute('data-key', item.key);

      rowElement.append(button);
    });

    return rowElement;
  });

  keyboard.append(...keys);
}

createKeyboard(currentLanguage);

function switchLanguage() {
  keyboard.innerHTML = '';
  const newLanguage = currentLanguage === 'en' ? 'ru' : 'en';
  localStorage.setItem('language', newLanguage);
  currentLanguage = newLanguage;
  createKeyboard(newLanguage);
}

const shiftButtons = document.querySelectorAll('button[data-action="Shift"]');

// Mouse click handlers
shiftButtons.forEach((button) => {
  button.addEventListener('mousedown', () => {
    keyboard.classList.add('shift-pressed');
    toggleShift();
  });
});

shiftButtons.forEach((button) => {
  button.addEventListener('mouseup', () => {
    keyboard.classList.remove('shift-pressed');
    toggleShift();
  });
});

keyboard.addEventListener('click', (event) => {
  if (event.target.classList.contains('keyboard-key')) {
    if (!event.target.dataset.action) {
      if (
        keyboard.classList.contains('capslock-pressed')
        || keyboard.classList.contains('shift-pressed')
      ) {
        insertText(event.target.dataset.shiftkey);
      } else {
        insertText(event.target.dataset.key);
      }
    }

    switch (event.target.dataset.action) {
      case 'Backspace':
        deleteText(-1);
        break;
      case 'Delete':
        deleteText(1);
        break;
      case 'Tab':
        insertText('    ');
        break;
      case 'Enter':
        insertText('\n');
        break;
      case 'CapsLock':
        keyboard.classList.toggle('capslock-pressed');
        toggleCapsLock();
        break;
      case 'ArrowUp':
        insertText('↑');
        break;
      case 'ArrowDown':
        insertText('↓');
        break;
      case 'ArrowLeft':
        insertText('←');
        break;
      case 'ArrowRight':
        insertText('→');
        break;
      default:
    }
  }
});

// Keystroke handlers on a physical keyboard
document.addEventListener('keydown', (event) => {
  event.preventDefault();

  // Highlight the pressed key on the virtual keyboard
  highlightKey(event.code);

  const { key } = event;

  if (key.length === 1) {
    const { code } = event;

    if (
      keyboard.classList.contains('capslock-pressed')
      || keyboard.classList.contains('shift-pressed')
    ) {
      const char = keyboardLayouts[currentLanguage]
        .find((row) => row.some((keyObj) => keyObj.code === code))
        .find((keyObj) => keyObj.code === code).shiftKey;
      insertText(char);
    } else {
      const char = keyboardLayouts[currentLanguage]
        .find((row) => row.some((keyObj) => keyObj.code === code))
        .find((keyObj) => keyObj.code === code).key;
      insertText(char);
    }
  }

  switch (event.key) {
    case 'Backspace':
      if (keyboard.classList.contains('ctrl-pressed')) {
        deleteText(1);
      } else {
        deleteText(-1);
      }
      break;
    case 'Tab':
      insertText('    ');
      break;
    case 'Enter':
      insertText('\n');
      break;
    case 'CapsLock':
      keyboard.classList.toggle('capslock-pressed', event.getModifierState('CapsLock'));
      toggleCapsLock();
      break;
    case 'Shift':
      keyboard.classList.add('shift-pressed');
      toggleShift();
      break;
    case 'Control':
      keyboard.classList.add('ctrl-pressed');
      break;
    case 'Meta':
      if (keyboard.classList.contains('ctrl-pressed')) {
        switchLanguage();
      }
      break;
    case 'ArrowUp':
      insertText('↑');
      break;
    case 'ArrowDown':
      insertText('↓');
      break;
    case 'ArrowLeft':
      insertText('←');
      break;
    case 'ArrowRight':
      insertText('→');
      break;
    default:
  }
});

// Key release handler on the physical keyboard
document.addEventListener('keyup', (event) => {
  if (event.key === 'CapsLock') {
    keyboard.classList.toggle('capslock-pressed', event.getModifierState('CapsLock'));
    toggleCapsLock();
  }

  if (event.key === 'Shift') {
    keyboard.classList.remove('shift-pressed');
    toggleShift();
  }

  if (event.key === 'Control') {
    keyboard.classList.remove('ctrl-pressed');
  }

  // Removing the backlight from a key on a virtual keyboard
  unhighlightKey(event.code);
});
