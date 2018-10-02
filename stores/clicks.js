module.exports = store

function store(state, emitter) {
  emitter.on('click', function(label) {
    let d = new Date();

    // add to stack
    state.stack.push({
      value: label
    });

    // add to history
    let i = state.history.findIndex(el => el.value == label);
    if (i != -1) {
      state.history[i].count++;
      state.entries.push(d);
    }
    else {
      state.history.push({
        value: label,
        count: 1,
        lastEntry: d,
        entries: [d]
      });
    }

    state.lastClicked = label;
    state.lastUpdated = d;

    emitter.emit('render');
  })
}

function old() {
  let storage = {
    store: localStorage,
    async get(key) {
      let val = this.store.getItem(key);
      if (val) {
        val = JSON.parse(val);
      }
      return val;
    },
    async set(key, value) {
      this.store.setItem(key, JSON.stringify(value));
    }
  };

  // TODO: why doesn't this work?!
  //window.addEventListener('storage', e => console.log(e));

  // TODO: re-add await fuck
  let stateData = storage.get('state');
  console.log('stateData', stateData);

  // blow away db
  //stateData = false;

  if (!stateData) {
    stateData = {
      stack: [],
      history: [],
      lastUpdated: Date.now()
    }
  }

  // TODO: debounce me
  let stateHandler = {
    async set(obj, prop) {
      //console.log('set', prop);
      if (['lastCompleteInput', 'lastUpdated'].find(e => e == prop)) {
        // TODO: re-add await fuck
        storage.set('state', stateData);
      }
      //render();
      return Reflect.get(...arguments);
    }
  };

  let state = new Proxy(stateData, stateHandler);
  
  async function markState() {
    state.lastUpdated = Date.now();
  }
}

