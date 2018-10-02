let html = require('choo/html');
let button = require('./button.js');

module.exports = view

function view(data) {

  return html`
    <div>
      ${data.map(button)}
    </div>
  `
}
