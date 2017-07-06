"use strict";
var CurrentAnchor = document.registerElement('basic-current-anchor', {
  prototype: Object.create(HTMLAnchorElement.prototype),
  extends: 'a'
});