import keyboardLayouts from './keyboard-layout.js'
import setLanguage from './language.js'

const keyboard = document.createElement('div')
keyboard.classList.add('keyboard')
const textarea = document.createElement('textarea')
textarea.classList.add('textarea')
const title = document.createElement('h1')
const keyboardOS = document.createElement('span')
keyboardOS.classList.add('keyboard-OS')
const keyboardSwitching = document.createElement('span')
keyboardSwitching.classList.add('keyboard-switching')
let currentLanguage = localStorage.getItem('language') || 'en'

document.body.append(title, textarea, keyboard, keyboardOS, keyboardSwitching)

function createKeyboard(language) {
	setLanguage(currentLanguage)

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

createKeyboard(currentLanguage)

const capslockButton = document.querySelector('button[data-code="CapsLock"]')
const shiftButtons = document.querySelectorAll('button[data-action="Shift"]')

// Mouse click handlers
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

keyboard.addEventListener('click', (event) => {
	if (event.target.classList.contains('keyboard-key')) {
		if (!event.target.dataset.action) {
			if (
				keyboard.classList.contains('capslock-pressed') ||
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
				keyboard.classList.toggle('capslock-pressed')
				toggleCapsLock()
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

// Keystroke handlers on a physical keyboard
document.addEventListener('keydown', (event) => {
	event.preventDefault()

	// Highlight the pressed key on the virtual keyboard
	highlightKey(event.code)

	if (event.key.length === 1) {
		const code = event.code
		if (
			keyboard.classList.contains('capslock-pressed') ||
			keyboard.classList.contains('shift-pressed')
		) {
			const shiftKey = keyboardLayouts[currentLanguage]
				.find((row) => row.some((keyObj) => keyObj.code === code))
				.find((keyObj) => keyObj.code === code).shiftKey
			insertText(shiftKey)
		} else {
			const key = keyboardLayouts[currentLanguage]
				.find((row) => row.some((keyObj) => keyObj.code === code))
				.find((keyObj) => keyObj.code === code).key
			insertText(key)
		}
	}

	switch (event.key) {
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
			keyboard.classList.toggle(
				'capslock-pressed',
				event.getModifierState('CapsLock')
			)
			toggleCapsLock()
			break
		case 'Shift':
			keyboard.classList.add('shift-pressed')
			toggleShift()
			break
		case 'Control':
			keyboard.classList.add('ctrl-pressed')
			break
		case 'Meta':
			if (keyboard.classList.contains('ctrl-pressed')) {
				switchLanguage()
			}
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

// Key release handler on the physical keyboard
document.addEventListener('keyup', (event) => {
	if (event.key === 'CapsLock') {
		keyboard.classList.toggle(
			'capslock-pressed',
			event.getModifierState('CapsLock')
		)
		toggleCapsLock()
	}

	if (event.key === 'Shift') {
		keyboard.classList.remove('shift-pressed')
		toggleShift()
	}

	if (event.key === 'Control') {
		keyboard.classList.remove('ctrl-pressed')
	}

	// Removing the backlight from a key on a virtual keyboard
	unhighlightKey(event.code)
})

function highlightKey(code) {
	const button = getButtonByCode(code)
	if (button) {
		button.classList.add('active')
	}
}

function unhighlightKey(code) {
	const button = getButtonByCode(code)
	if (button) {
		button.classList.remove('active')
	}
}

function getButtonByCode(code) {
	return keyboard.querySelector(`button[data-code="${code}"]`)
}

function insertText(string) {
	const cursorPosStart = textarea.selectionStart
	const cursorPosEnd = textarea.selectionEnd
	const currentValue = textarea.value

	if (
		keyboard.classList.contains('capslock-pressed') ||
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

function deleteText(direction) {
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
		if (keyboard.classList.contains('capslock-pressed')) {
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

function switchLanguage() {
	keyboard.innerHTML = ''
	const newLanguage = currentLanguage === 'en' ? 'ru' : 'en'
	localStorage.setItem('language', newLanguage)
	currentLanguage = newLanguage
	createKeyboard(newLanguage)
}
