(function($) {
  'use strict';

  function handler(e) {
    if(e.target.name && e.target.name === 'tab-visible') {
      $.scroll(0,0);
      $.document.querySelector('body').scrollTop = 0;
    }
  }

  var tabs = $.document.querySelectorAll('.tabs');

  for(var i= 0, l, ls = $.document.querySelectorAll('.tabs'); (l = ls[i]); i++) {
    l.addEventListener('change', handler);
  }

})(window);
