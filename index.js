let choo = require('choo');
let css = require('sheetify');

css('tachyons');
css('./base.css');

let app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
else {
  app.use(require('choo-service-worker')())
}

// initialize state
app.use(function(state) {
  state.history = [];
  state.stack = [];
  state.lastUpdated = new Date();
  state.lastClicked = '';
})

app.use(require('./stores/clicks'))

app.route('/', require('./views/main'))
app.route('/help', require('./views/help'))
app.route('/*', require('./views/404'))

module.exports = app.mount('body')
