let html = require('choo/html')
let header = require('./header')
let input = require('./input')
let buttonList = require('./buttonList')

let TITLE = 'buttons'

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) {
    emit(state.events.DOMTITLECHANGE, TITLE)
  }

  return html`
    <body>
      ${header(state, emit)}

      <main class="main">

        <div class="stack">
          ${buttonList(state.stack.map(e=>e.value))}
        </div>

        ${input(state, emit)}

        <div class="next">
          ${buttonList(state.history.map(e=>e.value))}
        </div>

      </main>
    </body>
  `
}
