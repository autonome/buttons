let html = require('choo/html');

module.exports = view

function view(state, emit) {

  return html`
    <header>
      <h1>Buttons</h1>
      <h3>Last entry is ${state.lastClicked}, updated ${state.lastUpdated}.</h3>
    </header>
  `
}
