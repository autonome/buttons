let html = require('choo/html');

// export module
module.exports = function(label, onclick, emit) {
  // create html template
  return html`
    <button onclick=${onclick} class="f6 link dim br2 ba ph3 pv2 mb2 dib black">${label}</button>
  `
  function onclick(e) {
    emit('click', e.srcElement.innerText)
  }
}
