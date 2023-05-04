import keyboardLayouts from './keyboard-layout.js'

// alert('Здесь кипит работа 🤯')
// alert('Работа над заданием привела к глубокой депрессии')
// alert('Буду очень признателен, если сможешь проверить меня в последнюю очередь')

// let currentLanguage = localStorage.getItem('language') || 'en' // Получаем текущий язык или устанавливаем по умолчанию английский

let currentLanguage = localStorage.getItem('language') || 'en'


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
			const isLetter = /^[a-zA-Zа-яА-ЯёЁ]$/.test(item.key)
			const button = document.createElement('button')
			button.classList.add('keyboard-key')

			if (item.action) {
				button.setAttribute('data-action', item.action)
			}

			if (item.shiftKey) {
				button.setAttribute('data-shiftKey', item.shiftKey)
			}

			if (isLetter) {
				button.setAttribute('data-keyType', 'letter')
			}

			button.setAttribute('data-code', item.code)
			button.setAttribute('data-key', item.key)

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
		if (!event.target.dataset.action) {
			if (
				capslockButton.classList.contains('active') ||
				keyboard.classList.contains('shift-pressed')
			) {
				insertText(event.target.dataset.shiftkey)
			} else {
				insertText(event.target.dataset.key)
			}
		}

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
				toggleCapsLock()
				break
			case 'ArrowUp':
				insertText(event.target.dataset.key)
				break
			case 'ArrowDown':
				insertText(event.target.dataset.key)
				break
			case 'ArrowLeft':
				insertText(event.target.dataset.key)
				break
			case 'ArrowRight':
				insertText(event.target.dataset.key)
				break
		}
	}
})

const capslockButton = document.querySelector('button[data-code="CapsLock"]')
capslockButton.classList.add('capslock')

const shiftButtons = document.querySelectorAll('button[data-action="Shift"]')

shiftButtons.forEach((button) => {
	button.addEventListener('mousedown', () => {
		keyboard.classList.add('shift-pressed')
		toggleShift()
	})
})

shiftButtons.forEach((button) => {
	button.addEventListener('mouseup', () => {
		keyboard.classList.remove('shift-pressed')
		toggleShift()
	})
})

// Обработчик нажатия клавиш на физической клавиатуре
document.addEventListener('keydown', (event) => {
	const key = event.key

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
			toggleCapsLock()
			break
		case 'Shift':
			keyboard.classList.add('shift-pressed')
			toggleShift()
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

// Обработчик отжатия клавиш на физической клавиатуре
document.addEventListener('keyup', (event) => {
	if (event.key === 'CapsLock') {
		capslockButton.classList.toggle(
			'active',
			event.getModifierState('CapsLock')
		)
		toggleCapsLock()
	}
	if (event.key === 'Shift') {
		keyboard.classList.remove('shift-pressed')
		toggleShift()
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

	if (
		capslockButton.classList.contains('active') ||
		keyboard.classList.contains('shift-pressed')
	) {
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

function toggleCapsLock() {
	const buttons = document.querySelectorAll('button[data-keytype="letter"]')
	buttons.forEach((button) => {
		if (capslockButton.classList.contains('active')) {
			button.classList.add('uppercase')
		} else {
			button.classList.remove('uppercase')
		}
	})
}

function toggleShift() {
	const buttons = document.querySelectorAll('button:not([data-action])')
	buttons.forEach((button) => {
		if (keyboard.classList.contains('shift-pressed')) {
			button.classList.add('uppercase')
		} else {
			button.classList.remove('uppercase')
		}
	})
}

const ctrl = document.querySelector('button[data-code="ControlLeft"]')
ctrl.addEventListener('click', switchLanguage)

// Функция для переключения языка клавиатуры
function switchLanguage() {
	keyboard.innerHTML = ''
	const newLanguage = currentLanguage === 'en' ? 'ru' : 'en'
	localStorage.setItem('language', newLanguage)
	currentLanguage = newLanguage
	initKeyboard(newLanguage)
}
