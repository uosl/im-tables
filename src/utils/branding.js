const Options = require('../options');
const {Promise} = require('es6-promise');

const instances = {};

const getInstance = service => instances[service.root] != null ? instances[service.root] : (instances[service.root] = new Branding(service));

module.exports = service => getInstance(service).getBranding();

class Branding {

  constructor(service) {
    this.key = service.root.replace(/\./g, '_');
    this.promise = service.get('branding')
                      .then(info => Options.set(['brand', this.key], info.properties));
  }

  // Returns a promise that never fails, but may be resolved with null.
  // The purpose of this is to ensure that we only read the properties after we have attempted
  // to set them at least once.
  getBranding() { return new Promise(resolve => {
    return this.promise.then((() => resolve(Options.get(['brand', this.key]))), (() => resolve(null)));
  }); }
}
