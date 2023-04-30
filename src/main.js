import { generateLayout } from './keyboard-layout.js';

const keyboardLayout = generateLayout();

const textarea = document.createElement('textarea');
textarea.classList.add('input');
document.body.appendChild(textarea);

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
document.body.appendChild(keyboard);

let isCapsLock = false;
let isShift = false;
let lang = localStorage.getItem('lang') || 'en';

function generateKeys() {
  keyboardLayout.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('keyboard-row');
    keyboard.appendChild(rowElement);

    row.forEach(key => {
      const keyElement = document.createElement('button');
      keyElement.classList.add('keyboard-key');
      keyElement.setAttribute('data-code', key.code);

      switch (key.type) {
        case 'space':
          keyElement.classList.add('keyboard-key-space');
          keyElement.innerHTML = '&nbsp;';
          break;

        case 'backspace':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = '<i class="material-icons">backspace</i>';
          break;

        case 'caps':
          keyElement.classList.add('keyboard-key-wide', 'keyboard-key-activatable');
          keyElement.innerHTML = 'Caps Lock';
          break;

        case 'shift':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Shift';
          break;

        case 'enter':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Enter';
          break;

        case 'tab':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Tab';
          break;

        case 'language':
          keyElement.classList.add('keyboard-key-small');
          keyElement.innerHTML = lang.toUpperCase();
          break;

        default:
          keyElement.textContent = isCapsLock || isShift ? key.uppercase : key.lowercase;
          break;
      }

      rowElement.appendChild(keyElement);
    });
  });
}

function changeLanguage() {
  lang = lang === 'en' ? 'ru' : 'en';
  localStorage.setItem('lang', lang);
  keyboard.innerHTML = '';
  generateKeys();
}

function onCapsLockClick() {
  isCapsLock = !isCapsLock;

  const capsLockKeys = document.querySelectorAll('.keyboard-key-uppercase, .keyboard-key-lowercase');
  capsLockKeys.forEach(key => {
    if (isCapsLock) {
      key.classList.add('keyboard-key-active');
    } else {
      key.classList.remove('keyboard-key-active');
    }
  });
}

function onShiftClick() {
  isShift = !isShift;

  const shiftKeys = document.querySelectorAll('.keyboard-key-lowercase, .keyboard-key-uppercase');
  shiftKeys.forEach(key => {
    if (isShift) {
      key.textContent = key.dataset.shift || key.textContent.toUpperCase();
    } else {
      key.textContent = key.dataset.default || key.textContent.toLowerCase();
    }
  });
}

function onVirtualKeyPress(e) {
	const keyCode = e.target.dataset.code;
	const keyType = e.target.dataset.type;

	switch (keyType) {
		case 'language':
			changeLanguage();
			break;

		case 'backspace':
			textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
			break;

		case 'caps':
			onCapsLockClick();
			break;

		case 'shift':
			onShiftClick();
			break;

		case 'enter':
			textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
			break;

		case 'tab':
			textarea.setRangeText('\t', textarea.selectionStart, textarea.selectionEnd, 'end');
			break;

		case 'space':
			textarea.setRangeText(' ', textarea.selectionStart, textarea.selectionEnd, 'end');
			break;

		default:
			if (keyType) {
				textarea.setRangeText(keyType, textarea.selectionStart, textarea.selectionEnd, 'end');
			} else {
				textarea.setRangeText(e.target.textContent, textarea.selectionStart, textarea.selectionEnd, 'end');
			}
			break;
	}
}

generateKeys();
keyboard.addEventListener('click', onVirtualKeyPress);
