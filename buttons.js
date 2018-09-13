/*

TODO
  * user flows
  * data hierarchy

Data Model
  * activities
    * activity
  * activity
    * startTime
    * endTime
    * duration
    * items
    * sets - number of items that are numbers
    * sum - sum of any items that are numbers
  * item
    * label
    * nextItems - array of item:count

Behaviors
  * automeasure activity length based on inputs
    * eg: starts at first button, ends at checkmark
  * button selection based on previous button selection
    * for each button, store list of top n next selections

User Flows
  * new activity
  * view activities

Use-cases
  * Exercise
  * Moods
  * Health
  * Diet

Wishlist
  * Themes
  * Extension for inline (cmd) or panel tracking

*/
(async () => {

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

  let stateData = await storage.get('state');
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
        await storage.set('state', stateData);
      }
      await render();
      return Reflect.get(...arguments);
    }
  };

  let state = new Proxy(stateData, stateHandler);
  
  async function markState() {
    state.lastUpdated = Date.now();
  }

  async function processInput(text) {
    if (!text) {
      return;
    }

    let index = state.stack.findIndex(el => el.value == text);
    //console.log('processInput', text, index)
    if (index == -1) {
      state.stack.push({
        value: text,
        timestamp: Date.now()
      });
    }
    await addToHistory(text);
  }

  async function addToHistory(text) {
    let index = state.history.findIndex(el => el.value == text);
    console.log('i?', index)
    if (index != -1) {
      state.history[index].count++;
    }
    else {
      state.history.push({
        value: text,
        timestamp: Date.now(),
        count: 1
      });
    }
    markState();
  }

  async function render() {
    console.log('render');
    let container = document.querySelector('section.main');
    container.innerHTML = '';

    let el = await renderStack();
    container.appendChild(el);
    el = await renderInput();
    container.appendChild(el);
    el = await renderButtons();
    container.appendChild(el);
  }

  async function renderStack() {
    function onStackButtonClick(e) {
      let label = e.target.textContent;
      let index = state.stack.findIndex(el => el == label);
      state.stack.splice(index, 1);
      markState();
    }

    let container = document.createElement('div');
    container.classList.add('preview');

    state.stack.forEach(key => {
      let button = renderLabel(key.value, container);
      button.addEventListener('click', onStackButtonClick);
    });

    return container;
  }

  async function renderButtons() {
    async function onButtonClick(e) {
      let label = e.target.textContent;
      await processInput(label);
    }

    let container = document.createElement('div');
    container.classList.add('buttons');
    document.querySelector('section').appendChild(container);;

    console.log('s?', state.history)
    state.history.sort((a, b) => b.count - a.count).forEach(key => {
      let button = renderLabel(key.value, container)
      button.addEventListener('click', onButtonClick);
    });

    return container;
  }

  function renderInput() {
    let container = document.createElement('div');
    container.classList.add('inputContainer');

    let label = document.createElement('label');
    label.classList.add('inputLabel');
    label.setAttribute('for', 'input');
		label.textContent = 'Type a thing...';
    container.appendChild(label);
    
    let input = document.createElement('input');
    input.id = 'input';
    input.type = 'text';
		input.name = 'input';
		input.autocomplete = 'off';
		input.placeholder = 'Type a thing...';
    input.classList.add('inputField');
    input.addEventListener('keyup', onKeyup);
    input.focus();
    container.appendChild(input);

    return container;
  }

  function renderLabel(label, container) {
    let div = document.createElement('div');
    div.textContent = label;
    div.classList.add('label');
    return container.appendChild(div);
  }

  async function onKeyup(e) {
    let input = document.querySelector('.inputField');
    if (e.keyCode == 13) {
      await processInput(input.value);
      input.value = '';
    }
  }

  async function onDOMContentLoaded() {
    await render();
  }
  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
})();
