var _ = require('underscore');
var fs = require('fs');
var TEMPLATES = exports;
exports.template = function (name, opts) {
  return _.template(getTemplate(name), opts);
};
exports.templateFromParts = function (names, opts) {
  var src = names.map(getTemplate).join("\n");
  return _.template(src, opts);
};
function getTemplate (name) {
  if (!name) throw new Error('Name is required.');
  name = name.replace(/-/g, '_');
  templ = TEMPLATES[name];
  if (templ) {
    return templ;
  } else {
    throw new Error('No template registered as "' + name + '"');
  }
}
// Simple templates we can define inline.
TEMPLATES.clear = '<div style="clear:both"></div>';
