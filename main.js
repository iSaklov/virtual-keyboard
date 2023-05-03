import keyboardLayouts from './keyboard-layout.js'

const os = 'mac' // Указываем операционную систему

// alert('Здесь кипит работа 🤯')
// alert('Работа над заданием привела к глубокой депрессии')
// alert('Буду очень признателен, если сможешь проверить меня в последнюю очередь')

let currentLanguage = localStorage.getItem('language') || 'en' // Получаем текущий язык или устанавливаем по умолчанию английский

const keyboard = document.createElement('div')
keyboard.classList.add('keyboard')

const textarea = document.createElement('textarea')
textarea.classList.add('textarea')

const title = document.createElement('h1')
title.innerText =
	currentLanguage === 'en'
		? 'RSS Virtual Keyboard'
		: 'RSS Виртуальная клавиатура'
title.classList.add('title')

const span1 = document.createElement('span')
span1.innerText =
	currentLanguage === 'en'
		? 'The keyboard was created in the operating system Mac OS'
		: 'Клавиатура создана в операционной системе Mac OS'
span1.classList.add('span')

const span2 = document.createElement('span')
span2.innerText =
	currentLanguage === 'en'
		? 'To switch the language, the combination: left ctrl + space'
		: 'Для переключения языка комбинация: левый ctrl + пробел'
span2.classList.add('span')

document.body.append(title, textarea, keyboard, span1, span2)

// Функция для создания всей клавиатуры на основе языков
function initKeyboard(language) {
	const keys = keyboardLayouts[language].map((row) => {
		const rowElement = document.createElement('div')
		rowElement.classList.add('keyboard-row')

		row.forEach((item) => {
			// const isLetter = /^[a-zA-Zа-яА-ЯёЁ]$/.test(keyValue)
			// /^[^a-zA-Zа-яА-ЯёЁ]$/
			const button = document.createElement('button')
			button.classList.add('keyboard-key')

			if (item.action) {
				button.classList.add('action')
				button.setAttribute('data-action', item.action)
			}

			button.setAttribute('data-code', item.code)
			button.setAttribute('data-key', item.key)
			button.setAttribute('data-shiftKey', item.shiftKey)
			if (/^[^a-zA-Zа-яА-ЯёЁ]$/.test(item.key)) {
				// button.textContent = item.shiftKey
			}
			// button.textContent += '\n' + item.key
			rowElement.append(button)
		})

		return rowElement
	})

	keyboard.append(...keys)
}

// Создаем клавиатуру при загрузке страницы
initKeyboard(currentLanguage)

// Обработчик нажатия на клавиатуре мышью
keyboard.addEventListener('click', (event) => {
	if (event.target.classList.contains('keyboard-key')) {
		if (!event.target.classList.contains('action')) {
			insertText(event.target.textContent)
		}

		// console.log('event.target.dataset.code', event.target.dataset.code)
		// console.log('event.target.dataset.action', event.target.dataset.action)

		switch (event.target.dataset.action) {
			case 'Backspace':
				deleteText(-1)
				break
			case 'Delete':
				deleteText(1)
				break
			case 'Tab':
				insertText('    ')
				break
			case 'Enter':
				insertText('\n')
				break
			case 'CapsLock':
				capslockButton.classList.toggle('active')
				toggleCaseMode()
				break
			// case 'Shift':
			// 	keyboard.classList.add('shift-pressed')
			// 	toggleCaseMode()
			case 'Space':
				insertText(' ')
				break
			case 'ArrowUp':
				insertText('↑')
				break
			case 'ArrowDown':
				insertText('↓')
				break
			case 'ArrowLeft':
				insertText('←')
				break
			case 'ArrowRight':
				insertText('→')
				break
		}
	}
})

// Обработчик нажатия клавиш на физической клавиатуре
document.addEventListener('keydown', (event) => {
	const key = event.key
	// console.log('key', key)
	// console.log('event', event.code)

	// Отменяем стандартное поведение кнопок
	event.preventDefault()

	// Подсвечиваем нажатую клавишу на виртуальной клавиатуре
	highlightKey(event.code)

	// Ввод символа в текстовое поле
	if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
		insertText(key)
	}

	// Навигация по текстовому полю
	switch (key) {
		case 'Backspace':
			deleteText(-1)
			break
		case 'Delete':
			deleteText(1)
			break
		case 'Tab':
			insertText('    ')
			break
		case 'Enter':
			insertText('\n')
			break
		case 'CapsLock':
			capslockButton.classList.toggle(
				'active',
				event.getModifierState('CapsLock')
			)
			toggleCaseMode()
			break
		case 'Shift':
			keyboard.classList.add('shift-pressed')
			toggleCaseMode()
			break
		case 'ArrowUp':
			insertText('↑')
			break
		case 'ArrowDown':
			insertText('↓')
			break
		case 'ArrowLeft':
			insertText('←')
			break
		case 'ArrowRight':
			insertText('→')
			break
	}
})

const capslockButton = document.querySelector('button[data-code="CapsLock"]')
capslockButton.classList.add('capslock')

const shiftButtons = document.querySelectorAll('button[data-action="Shift"]')

shiftButtons.forEach((button) => {
	button.addEventListener('mousedown', () => {
		keyboard.classList.add('shift-pressed')
		toggleCaseMode()
	})
})

shiftButtons.forEach((button) => {
	button.addEventListener('mouseup', () => {
		keyboard.classList.remove('shift-pressed')
		toggleCaseMode()
	})
})

// Обработчик отжатия клавиш на физической клавиатуре
document.addEventListener('keyup', (event) => {
	if (event.key === 'CapsLock') {
		capslockButton.classList.toggle(
			'active',
			event.getModifierState('CapsLock')
		)
		toggleCaseMode()
	}
	if (event.key === 'Shift') {
		keyboard.classList.remove('shift-pressed')
		toggleCaseMode()
	}

	// Снимаем подсветку с клавиши на виртуальной клавиатуре
	unhighlightKey(event.code)
})

// Функция для подсветки клавиши на виртуальной клавиатуре
function highlightKey(code) {
	const button = getButtonByCode(code)
	if (button) {
		button.classList.add('active')
	}
}

// Функция для снятия подсветки с клавиши на виртуальной клавиатуре
function unhighlightKey(code) {
	const button = getButtonByCode(code)
	if (button) {
		button.classList.remove('active')
	}
}

// Функция для получения кнопки на виртуальной клавиатуре по коду
function getButtonByCode(code) {
	return keyboard.querySelector(`button[data-code="${code}"]`)
}

// Функция для вставки символа в текстовое поле
function insertText(string) {
	const textarea = document.querySelector('.textarea')
	const cursorPosStart = textarea.selectionStart
	const cursorPosEnd = textarea.selectionEnd
	const currentValue = textarea.value

	if (capslockButton.classList.contains('active')) {
		string = string.toUpperCase()
	}

	textarea.value =
		currentValue.substring(0, cursorPosStart) +
		string +
		currentValue.substring(cursorPosEnd)
	textarea.setSelectionRange(
		cursorPosStart + string.length,
		cursorPosStart + string.length
	)
	textarea.focus()
}

// Функция для удаления символа в текстовом поле
function deleteText(direction) {
	const textarea = document.querySelector('.textarea')
	const startPosition = textarea.selectionStart
	const endPosition = textarea.selectionEnd
	// console.log(startPosition, endPosition)

	if (startPosition === endPosition && startPosition > 0) {
		textarea.value =
			textarea.value.slice(0, startPosition - 1) +
			textarea.value.slice(endPosition)
		textarea.selectionEnd = textarea.selectionStart = startPosition - 1
	} else {
		textarea.value =
			textarea.value.slice(0, startPosition) + textarea.value.slice(endPosition)
		textarea.selectionEnd = textarea.selectionStart = startPosition + direction
	}
	textarea.focus()
}

// Функция для переключения режима CapsLock и удержания клавиши Shift
function toggleCaseMode() {
	const buttons = document.querySelectorAll('button:not([data-action])')
	buttons.forEach((button) => {
		if (
			capslockButton.classList.contains('active') ||
			keyboard.classList.contains('shift-pressed')
		) {
			button.textContent = button.dataset.shiftkey
		} else {
			button.textContent = button.dataset.key
		}
	})
}

// Функция для переключения языка клавиатуры
function switchLanguage() {
	const language = localStorage.getItem('language') || 'en'
	const newLanguage = language === 'en' ? 'ru' : 'en'
	localStorage.setItem('language', newLanguage)
	initKeyboard(newLanguage)
}

// Обработчик события переключения языка клавиатуры
// const languageSwitcher = document.querySelector(".language-switcher");
// languageSwitcher.addEventListener("click", () => {
// if (currentLanguage === "en") {
// currentLanguage = "ru";
// } else {
// currentLanguage = "en";
// }
// localStorage.setItem("language", currentLanguage);
// initKeyboard();
// });

// Функция для обновления клавиатуры на новом языке
// function initKeyboard() {
// 	const keyboardRows = document.querySelectorAll('.keyboard-row')
// 	keyboardRows.forEach((row, i) => {
// 		const keys = row.querySelectorAll('.key')
// 		keys.forEach((key, j) => {
// 			const keyValue = languages[currentLanguage][i].split(' ')[j]
// 			key.textContent = keyValue
// 		})
// 	})
// }

// Инициализация клавиатуры при загрузке страницы
// initKeyboard();
