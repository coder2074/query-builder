"use strict";
var CuiInput = document.registerElement('cui-input', {
  prototype: Object.create(HTMLAnchorElement.prototype),
  extends: 'input'
});