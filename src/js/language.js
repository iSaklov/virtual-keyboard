export default function setLanguage(lang) {
  document.querySelector('h1')
    .innerText = lang === 'en'
      ? 'RSS Virtual Keyboard'
      : 'RSS Виртуальная клавиатура';

  document.querySelector('.keyboard-OS')
    .innerText = lang === 'en'
      ? 'The keyboard was created in the operating system Mac OS'
      : 'Клавиатура создана в операционной системе Mac OS';

  document.querySelector('.keyboard-switching')
    .innerText = lang === 'en'
      ? 'To switch the language, use the combination : ctrl ⌃ + cmd ⌘ || delete key: ctrl ⌃ + ⌫'
      : 'Для переключения языка, используйте комбинацию : ctrl ⌃ + cmd ⌘ || клавиша delete : ctrl ⌃ + ⌫';
}
