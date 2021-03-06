let AvailableColumns;
const Collection = require('../core/collection');
const PathModel = require('./path');

const cmp = function(f, a, b) {
  const [fa, fb] = Array.from(([a, b].map((x) => f(x))));
  if (fa < fb) {
    return -1;
  } else if (fa > fb) {
    return 1;
  } else {
    return 0;
  }
};

const partsLen = m => m.get('parts').length;
const displayName = m => m.get('displayName');

module.exports = (AvailableColumns = (function() {
  AvailableColumns = class AvailableColumns extends Collection {
    static initClass() {
  
      this.prototype.model = PathModel;
    }

    add(model) {
      const returned = super.add(...arguments);
      if (returned && (returned.collection == null)) { return returned.collection = this; }
    }

    initialize() {
      super.initialize(...arguments);
      return this.on('change:parts change:displayName', () => this.sort());
    }

    comparator(a, b) { // sort by path-length, and then lexically by attribute name.
      return (cmp(partsLen, a, b)) || (cmp(displayName, a, b));
    }
  };
  AvailableColumns.initClass();
  return AvailableColumns;
})());