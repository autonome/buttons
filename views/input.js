let html = require('choo/html');
let button = require('./button');

module.exports = view

function view(state, emit) {

  return html`
    <div class="input-container" style="display: flex;">
      <input class="input  input-reset ba b--black-20 pa2 mb2 db w-100"
      type="text" autocomplete="off" placeholder="Type anything"
      onkeyup="${onkeyup}">
      ${button('+', onclick)}
    </div>
  `

  function onkeyup(e) {
    if (e.keyCode == 13) {
      submit();
    }
  }

  function onclick(e) {
    submit();
  }

  function submit() {
    let input = document.querySelector('.input');
    emit('click', input.value);
    input.value = '';
    input.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    let input = document.createElement('input');
    input.focus();
  });
}
