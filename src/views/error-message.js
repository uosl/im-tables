let ErrorMessage;
const _ = require('underscore');
const fs = require('fs');

const CoreView = require('../core-view');
const Icons = require('../icons');
const Templates = require('../templates');

module.exports = (ErrorMessage = (function() {
  ErrorMessage = class ErrorMessage extends CoreView {
    static initClass() {
  
      this.prototype.className = 'im-error-message';
  
      this.prototype.template = Templates.template('error-message');
    }

    modelEvents() {
      return {'change:error': this.reRender};
    }

    getData() { return {icons: Icons, error: this.model.get('error')}; }

    logError() {
      let e;
      if (e = this.model.get('error')) {
        return console.error(e, e.stack);
      }
    }
  };
  ErrorMessage.initClass();
  return ErrorMessage;
})());
