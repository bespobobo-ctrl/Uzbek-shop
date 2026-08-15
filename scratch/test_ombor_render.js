const fs = require('fs');
const code = fs.readFileSync('./sections/user-auth/user-auth.js', 'utf8');
const vm = require('vm');

let omborHtml = '';
const mockContainer = {
  id: 'omborTabContent',
  set innerHTML(val) { omborHtml = val; },
  get innerHTML() { return omborHtml; }
};

const sandbox = {
  window: {},
  localStorage: {
    data: {},
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = v; }
  },
  document: {
    getElementById(id) {
      if (id === 'omborTabContent') return mockContainer;
      return { value: '', style: {}, addEventListener() {}, set innerHTML(v) {} };
    },
    querySelectorAll() { return []; },
    addEventListener() {}
  },
  console: console
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

sandbox.window.renderOmborTab();

const matches = omborHtml.match(/id="omborRow_/g);
console.log('Successfully rendered ombor table rows:', matches ? matches.length : 0);
console.log('Contains categories filters:', omborHtml.includes('filterOmborCategory'));
console.log('Contains live search:', omborHtml.includes('omborLiveSearch'));
