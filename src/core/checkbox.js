let Checkbox;
const CoreView = require('../core-view');
const Templates = require('../templates');
const Messages = require('../messages');

// Optimised checkbox component, that does not do
// full-re-renders, and can avoid re-rendering in
// its parent component.
module.exports = (Checkbox = (function() {
  Checkbox = class Checkbox extends CoreView {
    static initClass() {
  
      this.prototype.class = 'checkbox';
  
      this.prototype.template = Templates.template('checkbox');
    }

    getData() {
      return {
        checked: this.checked(),
        label: (this.label ? Messages.getText(this.label) : null)
      };
    }

    initialize({attr, label}) { this.attr = attr; this.label = label; return super.initialize(...arguments); }

    checked() { return this.model.get(this.attr); }

    toggle(e) {
      if (e != null) {
        e.stopPropagation();
      }
      return this.model.toggle(this.attr);
    }

    events() {
      return {'click': 'toggle'};
    }

    modelEvents() {
      const evts = {};
      evts[`change:${ this.attr }`] = this.setCheckboxState;
      return evts;
    }

    setCheckboxState() {
      if (this.cb == null) { this.cb = this.$('input')[0]; }
      return this.cb.checked = this.model.get(this.attr);
    }
  };
  Checkbox.initClass();
  return Checkbox;
})());

